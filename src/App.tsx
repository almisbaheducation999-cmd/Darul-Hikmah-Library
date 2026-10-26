/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Plus,
  Search,
  Upload,
  BookOpen,
  Download,
  Check,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  RotateCcw,
  Info,
  AlertTriangle,
  Menu,
  X,
  Library,
  GraduationCap,
  Sparkles,
  BookMarked,
  Sun,
  Moon,
  Bookmark,
  ChevronLeft,
  Quote,
  Eye,
  LayoutGrid,
  Table,
  SlidersHorizontal,
  ArrowUpDown,
  RefreshCw,
  Mic,
  MicOff,
  Paperclip,
  Flame,
  Bot,
  Layers,
  Briefcase,
  LineChart,
  Pencil,
  Book,
  FileText,
  TrendingUp,
  ExternalLink,
  Trash2,
  Home,
  Settings,
  Maximize2,
  Minimize2,
  Type,
  AlignLeft,
  AlignJustify,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types ---
interface Book {
  id: string;
  title: string;
  author: string;
  category: "Research" | "Magazine" | "Innovation" | "General";
  description: string;
  coverImage: string; // Base64 or URL
  fileName: string;
  createdAt: number;
}

interface Activity {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  imageUrl: string;
}

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
}

const QUOTES = [
  {
    text: "Carilah ilmu sejak dari ayunan hingga ke liang lahad.",
    source: "Hadits Riwayat al-Baihaqi",
    tag: "Kewajiban Belajar",
  },
  {
    text: "Menuntut ilmu adalah taqwa. Menyampaikannya adalah ibadah. Mengulangnya adalah tasbih. Menyelidikinya adalah jihad.",
    source: "Muadz bin Jabal",
    tag: "Keutamaan Ilmu",
  },
  {
    text: "Pena para ilmuwan lebih tajam dan abadi ketimbang pedang para jenderal.",
    source: "Mutiara Peradaban Islam",
    tag: "Kedaulatan Pena",
  },
  {
    text: "Sains tanpa agama adalah lumpuh, agama tanpa sains adalah buta.",
    source: "Harmonisasi Keilmuan",
    tag: "Integrasi Iptek & Imtaq",
  },
];

// --- Mock Data ---
const DEFAULT_BOOKS: Book[] = [
  {
    id: "1",
    title: "Journal of Modern Islamic Studies",
    author: "Al-Misbah Research Team",
    category: "Research",
    description:
      "A comprehensive study on Islamic analysis in the modern technological world.",
    coverImage: "/src/assets/images/regenerated_image_1780745517708.jpg",
    fileName: "islamic_studies_v1.pdf",
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: "2",
    title: "Al-Misbah Monthly Magazine",
    author: "Editorial Dept",
    category: "Magazine",
    description:
      "Community news, spiritual insights, and artistic expressions.",
    coverImage: "/src/assets/images/regenerated_image_1779181770796.jpg",
    fileName: "magazine_may_2026.pdf",
    createdAt: Date.now() - 86400000,
  },
  {
    id: "3",
    title: "Edutech Innovation 2026",
    author: "Innovation Lab",
    category: "Innovation",
    description:
      "Exploring new methods in faith-based education through digital tools.",
    coverImage: "/src/assets/images/regenerated_image_1779181774179.jpg",
    fileName: "edutech_report.pdf",
    createdAt: Date.now(),
  },
  {
    id: "4",
    title: "Islamic Science & Heritage Review",
    author: "Library & Heritage Board",
    category: "General",
    description:
      "Panduan integratif penyelamatan naskah klasik (turats) Islam melalui kecerdasan buatan dan preservasi digital.",
    coverImage: "/src/assets/images/regenerated_image_1779181751763.png",
    fileName: "heritage_preservation.pdf",
    createdAt: Date.now() - 86400000 * 3,
  },
];

const DEFAULT_ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    title: "Kunjungan Studi Hubungan Internasional Universitas Gadjah Mada",
    date: "2026-05-22",
    category: "Kunjungan",
    description:
      "Diskusi panel interaktif mengenai studi riset Islam modern, tata kelola literasi, dan pengembangan peradaban digital berwawasan sains santri.",
    imageUrl: "/src/assets/images/regenerated_image_1779181774179.jpg",
  },
  {
    id: "act-2",
    title: "Peluncuran Publikasi Jurnal Analisis Fiqih Kontemporer Jilid IV",
    date: "2026-05-18",
    category: "Publikasi",
    description:
      "Peluncuran silsilah berkala riset ilmiah meneliti tinjauan hukum kedaulatan data digital umat Islam di era integrasi AI global.",
    imageUrl: "/src/assets/images/regenerated_image_1779181754635.png",
  },
  {
    id: "act-3",
    title: "Workshop Metodologi Penulisan Karya Ilmiah & Studi Kitab Santri",
    date: "2026-05-15",
    category: "Akademik",
    description:
      "Bimbingan intensif bagi santri dalam pemanfaatan alat sirkulasi riset literatur digital di Darul Hikmah Library.",
    imageUrl: "/src/assets/images/regenerated_image_1779181770796.jpg",
  },
  {
    id: "act-4",
    title: "Kajian Rutin Kepustakaan Menelaah Tafsir Al-Misbah Tematik",
    date: "2026-05-10",
    category: "Kajian",
    description:
      "Sesi kupas tuntas landasan keilmuan teknologi modern berasaskan ayat Al-Quran bersama para mufassir senior.",
    imageUrl: "/src/assets/images/regenerated_image_1779181774179.jpg",
  },
];

// --- SUB-VIEWS FOR TABS ---

// Interactive Canvas Particles for background
function InteractiveParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 5 + 3;
        this.color = "rgba(59, 130, 246, 0.42)"; // Light blue dot as in mockup
      }

      update(mouseX: number, mouseY: number) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouseX !== -1 && mouseY !== -1) {
          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            const force = (120 - distance) / 120;
            this.x -= (dx / distance) * force * 10;
            this.y -= (dy / distance) * force * 10;
          }
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const particleCount = 24;
    const particlesArray: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particlesArray.push(new Particle());
    }

    let mouse = { x: -1, y: -1 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = -1;
      mouse.y = -1;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle dot grid pattern in background
      ctx.strokeStyle = "rgba(59, 130, 246, 0.04)";
      ctx.lineWidth = 1;
      const gridSize = 28;
      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          ctx.fillStyle = "rgba(59, 130, 246, 0.08)";
          ctx.fillRect(x, y, 1.2, 1.2);
        }
      }

      // Draw particles
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update(mouse.x, mouse.y);
        particlesArray[i].draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block pointer-events-auto z-0"
    />
  );
}

// 1. AI ENGINE VIEW (Minimalist White, Floating Particles, AI Chat Workspace)
interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  time: string;
}

function AiEngineView({
  isDarkMode,
  setActiveTab,
  particles,
  booksCount,
  bookmarksCount,
}: {
  isDarkMode: boolean;
  setActiveTab: (tab: any) => void;
  particles: any[];
  booksCount: number;
  bookmarksCount: number;
}) {
  const [prompt, setPrompt] = useState("");
  const [chatLog, setChatLog] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Halo! Selamat datang di Al-Misbah AI. Saya siap mendampingi riset, telaah literatur, bantuan penulisan, atau diskusi topik keilmuan lainnya. Ada yang ingin kita bahas hari ini?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  const triggerToast = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => {
      setShowNotification(null);
    }, 3000);
  };

  const parseBoldLocal = (text: string) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <strong
            key={i}
            className="font-bold text-[#C9A23B] dark:text-[#E5C158] bg-[#E5C158]/5 dark:bg-[#E5C158]/10 px-1 rounded select-all font-sans"
          >
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  const renderFormattedTextLocal = (text: string) => {
    const lines = text.split("\n");
    const resultElements: React.ReactNode[] = [];
    let pendingTableRows: string[] = [];

    const flushTable = (index: number) => {
      if (pendingTableRows.length === 0) return null;

      const processedRows = pendingTableRows.map((row) => {
        const cells = row.split("|").map((c) => c.trim());
        if (row.trim().startsWith("|") && row.trim().endsWith("|")) {
          return cells.slice(1, -1);
        }
        return cells.filter((c) => c !== "");
      });

      const tableRows = processedRows.filter((cells) => {
        return (
          cells.length > 0 && !cells.every((cell) => /^:?-+:?$/.test(cell))
        );
      });

      if (tableRows.length === 0) {
        pendingTableRows = [];
        return null;
      }

      const headers = tableRows[0];
      const bodyRows = tableRows.slice(1);
      pendingTableRows = [];

      return (
        <div
          key={`table-block-${index}`}
          className="my-5 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#FAF9F6]/50 dark:bg-zinc-950/20 relative z-10 transition-all duration-300 shadow-md"
        >
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-left text-xs">
            <thead className="bg-[#FAF9F6]/80 dark:bg-[#150D24]/40 border-b border-zinc-150 dark:border-zinc-850">
              <tr>
                {headers.map((hdr, hIdx) => (
                  <th
                    key={hIdx}
                    className="px-4 py-2.5 font-sans font-bold uppercase tracking-[0.12em] text-[10px] text-[#C9A23B] dark:text-[#E5C158] border-r border-zinc-150/60 dark:border-zinc-850 last:border-r-0"
                  >
                    {hdr}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150/40 dark:divide-zinc-900/60 bg-transparent text-zinc-800 dark:text-zinc-200">
              {bodyRows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className={
                    rIdx % 2 === 0
                      ? "bg-zinc-100/10 dark:bg-zinc-950/10"
                      : "bg-transparent"
                  }
                >
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className="px-4 py-3 text-zinc-950 dark:text-zinc-300 font-sans align-top whitespace-pre-wrap border-r border-zinc-150/40 dark:border-zinc-900 last:border-r-0 text-[12.5px] leading-relaxed"
                    >
                      {parseBoldLocal(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];
      const trimmed = line.trim();

      if (trimmed.startsWith("|")) {
        pendingTableRows.push(line);
      } else {
        if (pendingTableRows.length > 0) {
          const tableElement = flushTable(idx);
          if (tableElement) {
            resultElements.push(tableElement);
          }
        }

        if (trimmed.startsWith(">")) {
          resultElements.push(
            <blockquote
              key={idx}
              className="border-l-4 border-blue-600 dark:border-[#E5C158] pl-4 py-2 my-4 italic text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-[#121216]/50 rounded-r-lg font-sans text-[13.5px]"
            >
              {trimmed.substring(1).trim()}
            </blockquote>,
          );
        } else if (trimmed.startsWith("###")) {
          resultElements.push(
            <h4
              key={idx}
              className="text-[11px] font-sans font-extrabold uppercase tracking-[0.15em] text-[#C9A23B] dark:text-[#E5C158] mt-6 mb-2 flex items-center gap-2 border-l border-blue-600 dark:border-[#E5C158] pl-2"
            >
              {trimmed.substring(3).trim()}
            </h4>,
          );
        } else if (trimmed.startsWith("##")) {
          resultElements.push(
            <h3
              key={idx}
              className="text-xs md:text-sm font-sans font-bold uppercase tracking-[0.12em] text-zinc-900 dark:text-zinc-100 mt-7 mb-3.5 pb-1 border-b border-zinc-200 dark:border-zinc-800"
            >
              {trimmed.substring(2).trim()}
            </h3>,
          );
        } else if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
          const itemContent = trimmed.replace(/^[-*]\s*/, "");
          resultElements.push(
            <div
              key={idx}
              className="flex items-start gap-2.5 my-2 pl-2 animate-fadeIn"
            >
              <span className="text-blue-500 dark:text-[#E5C158] mt-2 shrink-0 block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span className="text-[13.5px] text-zinc-800 dark:text-zinc-300 leading-relaxed font-sans">
                {parseBoldLocal(itemContent)}
              </span>
            </div>,
          );
        } else if (!trimmed) {
          resultElements.push(<div key={idx} className="h-2" />);
        } else {
          resultElements.push(
            <p
              key={idx}
              className="text-[13.5px] text-zinc-800 dark:text-zinc-300 leading-relaxed font-sans my-2"
            >
              {parseBoldLocal(trimmed)}
            </p>,
          );
        }
      }
    }

    if (pendingTableRows.length > 0) {
      const tableElement = flushTable(lines.length);
      if (tableElement) {
        resultElements.push(tableElement);
      }
    }

    return resultElements;
  };

  const handleSendPrompt = async (textToSend?: string) => {
    const finalQuery = textToSend || prompt;
    if (!finalQuery || !finalQuery.trim()) {
      triggerToast("Mohon masukkan teks kueri terlebih dahulu.");
      return;
    }
    if (isAiResponding) return;

    setChatLog((prev) => [
      ...prev,
      {
        role: "user",
        text: finalQuery,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setPrompt("");
    setIsAiResponding(true);

    try {
      const response = await fetch("/api/gemini/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: finalQuery,
          category: "Semua",
          actionType: "generalChat",
        }),
      });

      const data = await response.json();
      if (data.success && data.result) {
        setChatLog((prev) => [
          ...prev,
          {
            role: "assistant",
            text: data.result,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      } else {
        setChatLog((prev) => [
          ...prev,
          {
            role: "assistant",
            text: `Aduh, mohon maaf. AI Scholar mengalami gangguan: ${data.error || "Gagal merespons riset."}`,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    } catch (err: any) {
      setChatLog((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Terjadi gangguan koneksi ke server Al-Misbah AI: ${err.message || err}`,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsAiResponding(false);
    }
  };

  const handleResetChat = () => {
    setChatLog([
      {
        role: "assistant",
        text: "Sesi riset dibersihkan. Silakan ajukan kueri riset baru Anda.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setPrompt("");
    triggerToast("Diskusi berhasil diatur ulang.");
  };

  const handleDownloadLog = () => {
    try {
      const textContent = chatLog
        .map(
          (c) =>
            `[${c.role === "user" ? "Rayhan" : "Al-Misbah AI"}] (${c.time})\n${c.text}\n`,
        )
        .join("\n");
      const blob = new Blob([textContent], {
        type: "text/plain;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Al-Misbah_AI_Engine_Log_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      triggerToast("Log kerja berhasil diunduh.");
    } catch (e) {
      console.error("Download failed:", e);
      triggerToast("Gagal mengunduh log kerja.");
    }
  };

  return (
    <div className={`min-h-screen flex relative overflow-hidden font-sans transition-colors duration-300 ${isDarkMode ? "bg-[#09080E] text-white" : "bg-[#F9F9FB] text-zinc-900"}`}>
      {/* Toast Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-5 py-3 rounded-full text-xs font-semibold tracking-wide shadow-xl flex items-center gap-2 border border-zinc-800"
          >
            <Sparkles size={14} className="text-[#E5C158] animate-pulse" />
            <span>{showNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive floating particles background */}
      <div className={`absolute inset-0 overflow-hidden z-0 pointer-events-none opacity-40 ${isDarkMode ? "bg-[#09080E]" : "bg-white"}`}>
        <InteractiveParticles />
      </div>

      {/* Thin Left Sidebar (~64px) */}
      <div className={`w-[64px] shrink-0 border-r flex flex-col justify-between items-center py-6 z-10 relative ${isDarkMode ? "border-zinc-800/80 bg-[#0C0B12] text-zinc-400" : "border-zinc-200 bg-white text-zinc-500"}`}>
        {/* Top items */}
        <div className="flex flex-col items-center gap-6 w-full">
          {/* Home Icon */}
          <button
            type="button"
            onClick={() => setActiveTab("catalog")}
            title="Utama (Pustaka)"
            className="w-10 h-10 rounded-xl hover:bg-zinc-100 text-zinc-500 hover:text-black flex items-center justify-center transition-all cursor-pointer active:scale-95"
          >
            <Home size={18} />
          </button>

          {/* Plus inside circle / Plus Icon */}
          <button
            type="button"
            onClick={() => {
              setChatLog([
                {
                  role: "assistant",
                  text: "Assalamualaikum! Selamat datang di Al-Misbah AI Engine. Saya adalah asisten kecerdasan buatan terapan syariah yang siap mendampingi riset sastera turats, menyusun strategi dakwah modern, atau mengeksplorasi ilmu sains terapan berbasis nilai keislaman.",
                  time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
              ]);
              setPrompt("");
              triggerToast("Memulai sesi baru.");
            }}
            title="Mulai Sesi Baru"
            className="w-10 h-10 rounded-xl hover:bg-zinc-100 text-zinc-500 hover:text-black flex items-center justify-center transition-all cursor-pointer active:scale-95"
          >
            <Plus size={18} />
          </button>

          {/* Trash Icon */}
          <button
            type="button"
            onClick={handleResetChat}
            title="Bersihkan Sesi Chat"
            className="w-10 h-10 rounded-xl hover:bg-red-50 text-zinc-500 hover:text-red-600 flex items-center justify-center transition-all cursor-pointer active:scale-95"
          >
            <Trash2 size={18} />
          </button>

          {/* Portfolio Icon */}
          <button
            type="button"
            onClick={() => setActiveTab("showcase")}
            title="Portfolio / Showcase"
            className="w-10 h-10 rounded-xl hover:bg-zinc-100 text-zinc-500 hover:text-black flex items-center justify-center transition-all cursor-pointer active:scale-95"
          >
            <Briefcase size={18} />
          </button>

          {/* Chart Icon */}
          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            title="Chart / Statistik"
            className="w-10 h-10 rounded-xl hover:bg-zinc-100 text-zinc-500 hover:text-black flex items-center justify-center transition-all cursor-pointer active:scale-95"
          >
            <LineChart size={18} />
          </button>
        </div>

        {/* Bottom items */}
        <div className="flex flex-col items-center gap-5 w-full">
          {/* Download Icon */}
          <button
            type="button"
            onClick={handleDownloadLog}
            title="Unduh Log Diskusi"
            className="w-10 h-10 rounded-xl hover:bg-zinc-100 text-zinc-500 hover:text-black flex items-center justify-center transition-all cursor-pointer active:scale-95"
          >
            <Download size={18} />
          </button>

          {/* Setting Icon */}
          <button
            type="button"
            onClick={() =>
              triggerToast(
                "Al-Misbah AI Engine dikonfigurasi pada Port Aman 3000.",
              )
            }
            title="Pengaturan"
            className="w-10 h-10 rounded-xl hover:bg-zinc-100 text-zinc-500 hover:text-black flex items-center justify-center transition-all cursor-pointer active:scale-95"
          >
            <Settings size={18} />
          </button>

          {/* Blue Circular Custom Logo button linked to Catalog tab */}
          <button
            type="button"
            onClick={() => setActiveTab("catalog")}
            title="Hubungkan Pustaka"
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-500/25 duration-300 hover:scale-105 active:scale-95"
          >
            <img
              src="/src/assets/images/regenerated_image_1779182020555.png"
              alt="Logo"
              className="w-5 h-5 rounded-full object-contain invert brightness-200"
            />
          </button>
        </div>
      </div>

      {/* Main Workspace content */}
      <div className="flex-1 flex flex-col z-10 relative bg-transparent">
        {/* Top Header bar styled like reference in media_1792893483370_32b92ad1.png */}
        <div className={`flex items-center justify-between px-6 py-4 border-b relative z-10 ${isDarkMode ? "border-zinc-800/80 bg-[#12101C]/80" : "border-zinc-200 bg-white/80"}`}>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full border border-zinc-700/80 p-0.5 overflow-hidden flex items-center justify-center bg-zinc-900 shadow-sm">
              <img
                src="/src/assets/images/regenerated_image_1779182020555.png"
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h4 className={`text-xs font-sans font-bold uppercase tracking-wider leading-none ${isDarkMode ? "text-zinc-100" : "text-zinc-800"}`}>
                Diskusi Riset Terbimbing
              </h4>
              <p className="text-[9px] font-bold text-zinc-400 mt-0.5 uppercase tracking-wider">
                MODEL: GEMINI 3.8 FLASH
              </p>
            </div>
          </div>
          <span className="text-[9px] font-bold text-[#E5C158] tracking-widest uppercase bg-[#E5C158]/10 px-3 py-1 rounded-full border border-[#E5C158]/30 font-sans">
            SYAMILA ASSISTANT
          </span>
        </div>

        {chatLog.length <= 1 ? (
          /* ----- CENTERED LANDING STATE (MATCHES REFERENCE EXACTLY) ----- */
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8 max-w-xl mx-auto w-full my-auto space-y-5 relative z-10">
            {/* Glowing Logo Badge */}
            <div className="relative mb-1">
              <div className="absolute inset-0 bg-violet-500/25 blur-xl rounded-full scale-150 pointer-events-none animate-pulse" />
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="w-12 h-12 rounded-full border border-zinc-700/80 p-1 bg-zinc-950 flex items-center justify-center relative z-10 shadow-lg shadow-violet-950/40"
              >
                <img
                  src="/src/assets/images/regenerated_image_1779182020555.png"
                  alt="Al-Misbah Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>

            {/* Ahlan wa Sahlan Heading and Subtitle */}
            <div className="space-y-2">
              <h2 className={`text-2xl sm:text-3xl font-sans font-semibold tracking-tight ${isDarkMode ? "text-white" : "text-zinc-900"}`}>
                Ahlan wa Sahlan, Rayhan!
              </h2>
              <p className={`text-xs sm:text-[13px] font-normal leading-relaxed max-w-md mx-auto ${isDarkMode ? "text-zinc-300" : "text-zinc-600"}`}>
                Langkah riset kepustakaan apa yang ingin kita lalui hari ini? Silakan ketik atau gunakan fitur Mikrofon suara.
              </p>
            </div>

            {/* 4 Prominent White Pill Buttons in a 2x2 Grid (Exact match to reference screenshot) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full pt-2">
              {[
                {
                  emoji: "📚",
                  text: "Mempelajari Turats",
                  action: "referensi tafsir klasik",
                },
                {
                  emoji: "📝",
                  text: "Susun Strategi Judul",
                  action: "alternatif tesis inovatif",
                },
                {
                  emoji: "🔬",
                  text: "Analisa Fiqh Modern",
                  action: "analisis fiqih kontemporer",
                },
                {
                  emoji: "⚡",
                  text: "Inovasi Pesantren",
                  action: "ide riset pesantren",
                },
              ].map((act, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    handleSendPrompt(`Cari literatur mengenai ${act.action}. Berikan rancangan riset yang komprehensif dari database Maktabah Syamilah 4.`);
                  }}
                  className="w-full bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs sm:text-[13px] px-5 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95 duration-200 cursor-pointer flex items-center justify-center gap-2.5 border border-zinc-200/80 group"
                >
                  <span className="text-base select-none">{act.emoji}</span>
                  <span className="tracking-tight">{act.text}</span>
                </button>
              ))}
            </div>

            {/* Input Form Capsule */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt();
              }}
              className={`w-full rounded-full px-5 py-2.5 flex items-center justify-between border shadow-lg mt-3 duration-200 ${
                isDarkMode
                  ? "bg-zinc-950 border-zinc-800 text-white focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20"
                  : "bg-white border-zinc-300 text-zinc-900 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20"
              }`}
            >
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Tanyakan riset turats syariah, ringkasan bab kitab, cetak teks makalah..."
                className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm font-medium pr-3"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPrompt((prev) => (prev ? prev + " Fiqih Kontemporer" : "Fiqih Kontemporer"))}
                  className="p-1.5 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-100 transition-colors"
                  title="Gunakan Mikrofon"
                >
                  <Mic size={17} />
                </button>
                <button
                  type="submit"
                  disabled={!prompt.trim() || isAiResponding}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <span>Kirim</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ----- ACTIVE CHAT VIEW ----- */
          <div className="flex-1 flex flex-col justify-between max-w-4xl mx-auto w-full h-[calc(100vh-2px)] p-6 md:p-8 z-10 relative">
            {/* Header section */}
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-zinc-250 p-0.5 overflow-hidden flex items-center justify-center bg-white shadow-sm">
                  <img
                    src="/src/assets/images/regenerated_image_1779182020555.png"
                    alt="Mini Logo"
                    className="w-[85%] h-[85%] object-contain"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-wider text-black uppercase font-sans">
                    Al-Misbah AI Engine
                  </h4>
                  <p className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase">
                    SYARIAH KNOWLEDGE AGENT
                  </p>
                </div>
              </div>
              <button
                onClick={handleResetChat}
                className="text-xs font-bold text-zinc-400 hover:text-red-500 transition-colors"
                type="button"
              >
                Atur Ulang Diskusi
              </button>
            </div>

            {/* Scrollable messages panel */}
            <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-1 scrollbar-thin">
              {chatLog.map((chat, idx) => (
                <div
                  key={idx}
                  className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-5 py-3.5 text-[14px] leading-relaxed shadow-sm ${
                      chat.role === "user"
                        ? "bg-blue-600 text-white rounded-br-none font-medium"
                        : "bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-bl-none font-medium"
                    }`}
                  >
                    {chat.role === "user" ? (
                      <p className="whitespace-pre-wrap">{chat.text}</p>
                    ) : (
                      <div className="space-y-1 text-left">
                        {renderFormattedTextLocal(chat.text)}
                      </div>
                    )}
                    <span
                      className={`text-[9px] block mt-1.5 text-right font-medium ${chat.role === "user" ? "text-white/60" : "text-zinc-400"}`}
                    >
                      {chat.time}
                    </span>
                  </div>
                </div>
              ))}
              {isAiResponding && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-zinc-50 border border-zinc-200 rounded-2xl rounded-bl-none px-5 py-3.5 text-xs text-zinc-400 shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                    <span
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                    <span className="font-semibold text-zinc-500">
                      Menganalisis khazanah kitab...
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Active Chat Input form panel code (Pill-shaped horizontal box inside active container) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt();
              }}
              className="w-full bg-white border border-zinc-300 rounded-full px-5 py-3 flex items-center justify-between shadow-lg focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 duration-200 mt-2 z-10"
            >
              {/* Plus button left */}
              <button
                type="button"
                onClick={() =>
                  setPrompt((prev) => (prev ? prev + " + " : "+ "))
                }
                className="p-1.5 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-black transition-colors"
                title="Sematkan Lampiran"
              >
                <Plus size={18} className="stroke-[2.5]" />
              </button>

              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ketik balasan riset di sini..."
                className="flex-1 text-zinc-800 placeholder-zinc-400 font-semibold bg-transparent border-none outline-none text-sm pr-4 h-10 focus:ring-0"
              />

              <div className="flex items-center gap-3">
                {/* Microphone button inside input */}
                <button
                  onClick={() =>
                    setPrompt((prev) =>
                      prev ? prev + " Fiqih Kontemporer" : "Fiqih Kontemporer",
                    )
                  }
                  className="p-1.5 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-black transition-colors"
                  type="button"
                  title="Gunakan Mikrofon"
                >
                  <Mic size={18} />
                </button>
                {/* Send icon with simple arrow */}
                <button
                  type="submit"
                  disabled={!prompt.trim() || isAiResponding}
                  className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all active:scale-95 disabled:bg-zinc-100 disabled:text-zinc-300 flex items-center justify-center cursor-pointer shadow-md shadow-blue-500/15"
                >
                  <ChevronRight size={18} className="stroke-[2.5]" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// 2. MUTIARA HIKMAH DASHBOARD VIEW (High Contrast Black & White Split Screen Dashboard)
const HERO_QUOTES = [
  {
    text: "CARILAH ILMU SEJAK DARI AYUNAN HINGGA KE LIANG LAHAD",
    author: "Hadist Riwayat AL-Baihaqi",
    category: "KEWAJIBAN BELAJAR",
  },
  {
    text: "TINTA PARA PENDIRI ILMU LEBIH SUCI DARIPADA DARAH SANG JENGGALA",
    author: "Pepatah Klasik Turats",
    category: "KETINGGIAN TINTA",
  },
  {
    text: "SIAPA YANG MENAPAKI JALAN MENUNTUT ILMU ALLAH MUDAHKAN JALANNYA KE SURGA",
    author: "Hadits Riwayat Muslim",
    category: "STUDI MULIA",
  },
  {
    text: "PENGUASAAN TEKNOLOGI MODERN ADALAH ADAPTASI FIQIH ERA KEDAULATAN DATA",
    author: "Dewan Keilmuan Al-Misbah",
    category: "INOVASI ISLAM",
  },
];

function MutiaraDashboardView({
  booksCount,
  bookmarksCount,
  setActiveTab,
}: {
  booksCount: number;
  bookmarksCount: number;
  setActiveTab: (tab: any) => void;
}) {
  const [quoteIdx, setQuoteIdx] = useState(0);

  const cycleQuote = () => {
    setQuoteIdx((prev) => (prev + 1) % HERO_QUOTES.length);
  };

  return (
    <div 
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        width: "100%",
        margin: "0",
        padding: "0",
        boxSizing: "border-box"
      }}
    >
      {/* KOLOM KIRI (Mutiara Hikmah) */}
      <div 
        style={{
          backgroundColor: "#FFFFFF",
          color: "#000000",
          padding: "48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxSizing: "border-box"
        }}
      >
        {/* Bagian Atas: Teks kecil "MUTIARA HIKMAH" */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span 
            style={{ 
              fontSize: "12px", 
              fontWeight: "600", 
              letterSpacing: "0.15em", 
              color: "#6B7280",
              fontFamily: "'Inter', sans-serif"
            }}
          >
            MUTIARA HIKMAH
          </span>
        </div>

        {/* Bagian Tengah: Kutipan besar dan tebal */}
        <div style={{ margin: "40px 0", display: "flex", flexDirection: "column", gap: "12px" }}>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              lineHeight: "1.25",
              color: "#000000",
              margin: 0,
              fontFamily: "'Inter', sans-serif"
            }}
          >
            {HERO_QUOTES[quoteIdx].text}
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "#4B5563",
              fontWeight: "500",
              margin: 0,
              fontFamily: "'Inter', sans-serif"
            }}
          >
            {HERO_QUOTES[quoteIdx].author}
          </p>
        </div>

        {/* Bagian Bawah: Space horizontal */}
        <div 
          style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            borderTop: "1px solid #E5E7EB", 
            paddingTop: "24px" 
          }}
        >
          <span 
            style={{ 
              fontSize: "12px", 
              fontWeight: "600", 
              color: "#9CA3AF",
              fontFamily: "'Inter', sans-serif"
            }}
          >
            Inspirasi {quoteIdx + 1} dari {HERO_QUOTES.length}
          </span>
          <button
            type="button"
            onClick={cycleQuote}
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: "#000000",
              background: "none",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.05em",
              fontFamily: "'Inter', sans-serif"
            }}
            className="hover:text-blue-600 transition-colors"
          >
            INSPIRASI SELANJUTNYA &gt;
          </button>
        </div>
      </div>

      {/* KOLOM KANAN (Statistik Belajar) */}
      <div 
        style={{
          backgroundColor: "#2C2D30",
          color: "#FFFFFF",
          padding: "48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxSizing: "border-box"
        }}
      >
        {/* Bagian Atas: Teks kecil "STATISTIK BELAJAR ANDA" */}
        <div>
          <span 
            style={{ 
              fontSize: "12px", 
              fontWeight: "600", 
              letterSpacing: "0.15em", 
              color: "#9CA3AF",
              fontFamily: "'Inter', sans-serif"
            }}
          >
            STATISTIK BELAJAR ANDA
          </span>
        </div>

        {/* Bagian Tengah: Dua teks angka besar berdampingan secara horizontal, di bawahnya teks deskripsi */}
        <div style={{ margin: "40px 0" }}>
          {/* Angka berdampingan secara horizontal */}
          <div style={{ display: "flex", gap: "48px", marginBottom: "24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span 
                style={{ 
                  fontSize: "48px", 
                  fontWeight: "900", 
                  lineHeight: "1", 
                  color: "#FFFFFF",
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                {booksCount}
              </span>
              <span 
                style={{ 
                  fontSize: "11px", 
                  fontWeight: "bold", 
                  letterSpacing: "0.1em", 
                  color: "#9CA3AF" 
                }}
              >
                KATALOG BUKU
              </span>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span 
                style={{ 
                  fontSize: "48px", 
                  fontWeight: "900", 
                  lineHeight: "1", 
                  color: "#E5C158",
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                {bookmarksCount}
              </span>
              <span 
                style={{ 
                  fontSize: "11px", 
                  fontWeight: "bold", 
                  letterSpacing: "0.1em", 
                  color: "#9CA3AF" 
                }}
              >
                TERSIMPAN
              </span>
            </div>
          </div>

          <p 
            style={{ 
              fontSize: "13px", 
              color: "#D1D5DB", 
              lineHeight: "1.6", 
              margin: 0,
              fontFamily: "'Inter', sans-serif"
            }}
          >
            Gunakan Katalog digital untuk menyimpan bahan bacaan riset atau membaca langsung di perangkat Anda secara Instan.
          </p>
        </div>

        {/* Bagian Bawah: Di sudut kanan bawah, tampilkan tombol link "BUKA PUSTAKA >" */}
        <div 
          style={{ 
            display: "flex", 
            justifyContent: "flex-end", 
            borderTop: "1px solid #4B5563", 
            paddingTop: "24px" 
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("catalog")}
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: "#E5C158",
              background: "none",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.05em",
              fontFamily: "'Inter', sans-serif"
            }}
            className="hover:text-white transition-colors"
          >
            BUKA PUSTAKA &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. BOOK SPINE SHOWCASE VIEW (Dark Typographic Foundry Aesthetic Row of Spines)
interface SpineBook {
  id: string;
  title: string;
  color: string;
  textColor: string;
  height: number;
  width: number;
  fontClass: string;
  category: string;
  year: string;
  author: string;
  abstract: string;
}

const SPINE_BOOKS: SpineBook[] = [
  {
    id: "sp-1",
    title: "Flou",
    color: "bg-red-600",
    textColor: "text-white",
    height: 380,
    width: 44,
    fontClass: "font-extrabold tracking-tighter uppercase",
    category: "Kajian Estetika",
    year: "2025",
    author: "Dr. Ahmad Fauzi",
    abstract: "Kombinasi pola geometris turats dengan tatanan visual modern.",
  },
  {
    id: "sp-2",
    title: "Apercu Condensed",
    color: "bg-[#818CF8]",
    textColor: "text-white",
    height: 320,
    width: 36,
    fontClass: "font-semibold tracking-tight uppercase",
    category: "Tipografi Sosial",
    year: "2024",
    author: "Nadia Rahma",
    abstract: "Studi tata letak huruf sempit pada teks keislaman digital.",
  },
  {
    id: "sp-3",
    title: "Chromatic Extension",
    color: "bg-indigo-900",
    textColor: "text-teal-300",
    height: 410,
    width: 48,
    fontClass: "font-black tracking-widest text-center",
    category: "Filsafat Sains",
    year: "2026",
    author: "Drs. Maryanto",
    abstract:
      "Eksplorasi panjang gelombang cahaya dalam estetika kubah masjid.",
  },
  {
    id: "sp-4",
    title: "KIBITZ EXTENDED",
    color: "bg-white",
    textColor: "text-emerald-700",
    height: 350,
    width: 40,
    fontClass: "font-bold uppercase font-serif",
    category: "Jurnal Dakwah",
    year: "2025",
    author: "Syekh Amin",
    abstract: "Kebebasan berekspresi dalam koridor maslahah ammah digital.",
  },
  {
    id: "sp-5",
    title: "Cottord",
    color: "bg-emerald-500",
    textColor: "text-yellow-100",
    height: 370,
    width: 42,
    fontClass: "font-serif font-black italic",
    category: "Sejarah Islam",
    year: "2024",
    author: "Prof. Hasan",
    abstract: "Menelusuri sejarah sirkulasi literasi Andalusia Klasik.",
  },
  {
    id: "sp-6",
    title: "APERCU",
    color: "bg-[#F2EFE9]",
    textColor: "text-neutral-900",
    height: 340,
    width: 38,
    fontClass: "font-sans font-bold uppercase",
    category: "Metodologi Penelitian",
    year: "2026",
    author: "Tim Pustaka",
    abstract: "Buku panduan dasar merumuskan hipotesis sains modern.",
  },
  {
    id: "sp-7",
    title: "MANNER GOTHIC",
    color: "bg-neutral-800",
    textColor: "text-zinc-400",
    height: 330,
    width: 34,
    fontClass: "font-mono text-center tracking-widest",
    category: "Studi Turats",
    year: "2025",
    author: "K.H. Zainuddin",
    abstract: "Tinjauan kritis naskah khath kufi dalam mushaf kuno.",
  },
  {
    id: "sp-8",
    title: "CHAMPION Grotesque",
    color: "bg-amber-500",
    textColor: "text-white",
    height: 420,
    width: 52,
    fontClass: "font-extrabold tracking-tight uppercase",
    category: "Biografi Ulama",
    year: "2026",
    author: "Farhan Azis",
    abstract: "Perjuangan tokoh sufi mempertahankan madrasah kepustakaan.",
  },
  {
    id: "sp-9",
    title: "BASIS Mono",
    color: "bg-[#1E3A8A]",
    textColor: "text-cyan-200",
    height: 360,
    width: 36,
    fontClass: "font-mono uppercase",
    category: "Kriptografi Data",
    year: "2025",
    author: "Yusuf Habibi",
    abstract: "Aplikasi pembagian kunci aman untuk naskah keilmuan rahasia.",
  },
  {
    id: "sp-10",
    title: "BASIS",
    color: "bg-stone-100",
    textColor: "text-cyan-950",
    height: 380,
    width: 42,
    fontClass: "font-sans text-xs font-black uppercase tracking-wide",
    category: "Fisika Quantum",
    year: "2024",
    author: "Dr. Sofia",
    abstract: "Korelasi getaran materi quantum dengan zikrullah makrokosmos.",
  },
  {
    id: "sp-11",
    title: "MIDNIGHT",
    color: "bg-[#F59E0B]",
    textColor: "text-black",
    height: 430,
    width: 56,
    fontClass:
      "font-black rotate-1 tracking-widest uppercase origin-center scale-[1.01]",
    category: "Astronimi Islam",
    year: "2026",
    author: "Dewan Riset",
    abstract: "Perhitungan titik koordinat rukyatul hilal menggunakan AI.",
  },
  {
    id: "sp-12",
    title: "Helvetica Now Variable",
    color: "bg-stone-900",
    textColor: "text-zinc-200",
    height: 390,
    width: 45,
    fontClass: "font-bold uppercase tracking-tighter",
    category: "Prinsip Desain",
    year: "2025",
    author: "Arsitek Al-Misbah",
    abstract: "Teori kedaulatan visual dan kepustakaan minimalis.",
  },
  {
    id: "sp-13",
    title: "Touvlo",
    color: "bg-[#FEF3C7]",
    textColor: "text-amber-900",
    height: 330,
    width: 38,
    fontClass: "font-serif font-bold italic",
    category: "Sastra Arab",
    year: "2024",
    author: "Ustadz Jmali",
    abstract: "Gaya bahasa puitis dan sastra balaghah dalam kitab klasik.",
  },
  {
    id: "sp-14",
    title: "SYSTEM 85",
    color: "bg-teal-700",
    textColor: "text-white",
    height: 360,
    width: 40,
    fontClass: "font-mono text-center tracking-tight",
    category: "Sistem Informasi",
    year: "2026",
    author: "Eng. Fadhli",
    abstract: "Konsep server-authoritative state pada arsip keislaman.",
  },
  {
    id: "sp-15",
    title: "USER MANUAL Reader",
    color: "bg-zinc-200",
    textColor: "text-zinc-700",
    height: 345,
    width: 35,
    fontClass: "font-sans font-bold uppercase tracking-widest",
    category: "Panduan Operasional",
    year: "2024",
    author: "Staf Administrasi",
    abstract: "Pedoman digitalisasi naskah kuno pelapis kaca pelindung.",
  },
  {
    id: "sp-16",
    title: "AaBbCcDdEe 123",
    color: "bg-rose-400",
    textColor: "text-rose-950",
    height: 375,
    width: 43,
    fontClass: "font-sans font-medium text-xs",
    category: "Koleksi Glosarium",
    year: "2025",
    author: "Tim Penyusun",
    abstract: "Kamus padanan istilah teknologi informasi dan syariah terapan.",
  },
  {
    id: "sp-17",
    title: "Lardent",
    color: "bg-stone-400",
    textColor: "text-[#1E293B]",
    height: 355,
    width: 39,
    fontClass: "font-serif font-extrabold uppercase",
    category: "Epistemologi Riset",
    year: "2024",
    author: "Ustadz Ridwan",
    abstract: "Mendefinisikan hakikat kebenaran dalam metode kajian ilmiah.",
  },
  {
    id: "sp-18",
    title: "Robin Italics",
    color: "bg-[#10B981]",
    textColor: "text-white",
    height: 365,
    width: 41,
    fontClass: "font-semibold italic font-sans",
    category: "Filsafat Etika",
    year: "2025",
    author: "Fatimah Az-Zahra",
    abstract: "Penerapan akhlak mulia dalam ekosistem kecerdasan buatan.",
  },
  {
    id: "sp-19",
    title: "Value Serif MABRY",
    color: "bg-amber-950",
    textColor: "text-yellow-200",
    height: 400,
    width: 46,
    fontClass: "font-serif font-black uppercase text-center",
    category: "Sosiologi Terapan",
    year: "2026",
    author: "Dr. Hamzah",
    abstract: "Studi pola hidup santri mandiri di asrama modern Al-Misbah.",
  },
  {
    id: "sp-20",
    title: "Dopple A.D.",
    color: "bg-rose-950",
    textColor: "text-rose-100",
    height: 350,
    width: 38,
    fontClass:
      "font-bold uppercase tracking-widest border-l-2 border-r-2 border-rose-300/30",
    category: "Antropologi Islam",
    year: "2025",
    author: "Ustadz Hakim",
    abstract:
      "Interaksi kemanusiaan dengan agen kecerdasan buatan di lingkungan pesantren.",
  },
];

function BookSpineShowcaseView({
  setActiveTab,
}: {
  setActiveTab: (tab: any) => void;
}) {
  const [selectedSpine, setSelectedSpine] = useState<SpineBook | null>(null);

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6 flex flex-col justify-between overflow-hidden relative font-sans">
      {/* Absolute top glowing background lights */}
      <div className="absolute top-0 left-1/4 w-[40vw] h-[25vh] bg-[#818CF8]/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[40vw] h-[25vh] bg-[#D946EF]/5 blur-[120px] pointer-events-none" />

      {/* Top Brand Header */}
      <div className="text-center z-10 space-y-2 mt-4">
        {/* Book / Star Logo */}
        <div className="w-12 h-12 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center mx-auto text-zinc-300 shadow-xl shadow-black/80">
          <BookOpen size={18} className="text-[#E5C158]" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight font-sans">
          Al-Hikmah Library
        </h2>
        <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.25em]">
          Sirkulasi Rak Karakter Tipografi & Specimen Karya
        </p>
      </div>

      {/* Horizontal Wooden Bookshelf / Grid row presentation */}
      <div className="w-full overflow-x-auto py-16 px-4 flex items-end justify-center select-none gap-1 bg-gradient-to-t from-zinc-950/40 to-transparent min-h-[500px]">
        <div className="flex items-end justify-center gap-[3px] md:gap-[5px] shrink-0">
          {SPINE_BOOKS.map((spine) => (
            <div
              key={spine.id}
              className="relative group flex flex-col items-center"
            >
              {/* Highlight panel on spine hover */}
              <div className="absolute -top-12 scale-0 group-hover:scale-100 bg-zinc-900 border border-zinc-800 text-[9px] font-black uppercase tracking-widest text-[#E5C158] px-2.5 py-1 rounded-md transition-transform duration-300 pointer-events-none shadow-xl shadow-black/50 whitespace-nowrap z-30">
                {spine.title}
              </div>

              {/* Physical rotated spine segment */}
              <button
                onClick={() => setSelectedSpine(spine)}
                style={{
                  height: `${spine.height}px`,
                  width: `${spine.width}px`,
                }}
                className={`rounded-t-lg shadow-[5px_0_15px_rgba(0,0,0,0.6)] cursor-pointer relative group-hover:-translate-y-4 duration-500 hover:brightness-110 flex flex-col justify-between items-center py-6 px-1 transition-all border-r border-t border-white/10 ${spine.color} ${spine.textColor}`}
              >
                {/* Visual Accent/Line indicator */}
                <div className="w-full flex flex-col items-center gap-0.5 opacity-40">
                  <div className="w-3/4 h-[1px] bg-current" />
                  <div className="w-1/2 h-[1px] bg-current" opacity="0.6" />
                </div>

                {/* Rotated vertical text label */}
                <div
                  className="flex-1 flex items-center justify-center pointer-events-none"
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                  <p
                    className={`text-[10px] md:text-xs leading-none select-none ${spine.fontClass}`}
                  >
                    {spine.title}
                  </p>
                </div>

                {/* Bottom decorative icon */}
                <div className="w-4 h-4 flex items-center justify-center opacity-60">
                  <StarIcon size={12} />
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Little Star icon fallback */}
      <div className="text-center z-10">
        <button
          onClick={() => setActiveTab("catalog")}
          className="text-xs font-black tracking-widest text-zinc-400 hover:text-white transition-colors uppercase border-b border-zinc-800 pb-1 cursor-pointer"
        >
          &larr; Kembali ke Pustaka Utama
        </button>
      </div>

      {/* Book details abstract Drawer (Modal Overlay) */}
      <AnimatePresence>
        {selectedSpine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 z-50 select-none"
            onClick={() => setSelectedSpine(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-8 relative shadow-2xl space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedSpine(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="space-y-2">
                <span className="text-[9px] bg-[#E5C158]/10 text-[#E5C158] font-black tracking-widest uppercase px-3 py-1 rounded-full border border-[#E5C158]/10 inline-block">
                  Ref. Rak Karakter Klasik
                </span>
                <h3 className="text-3xl font-extrabold tracking-tight text-white">
                  {selectedSpine.title}
                </h3>
                <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                  {selectedSpine.category} • Tahun {selectedSpine.year}
                </p>
              </div>

              <div className="w-full h-px bg-zinc-900" />

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">
                    Dewan Penulis / Peneliti
                  </span>
                  <p className="text-sm font-bold text-zinc-200">
                    {selectedSpine.author}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">
                    Tinjauan Abstrak Karya
                  </span>
                  <p className="text-sm text-zinc-400 leading-relaxed font-semibold font-sans">
                    {selectedSpine.abstract}
                  </p>
                </div>
              </div>

              <div className="w-full h-px bg-zinc-900" />

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setSelectedSpine(null);
                    setActiveTab("catalog");
                  }}
                  className="flex-1 py-3 rounded-xl bg-white hover:bg-zinc-100 text-black font-extrabold text-xs transition-colors cursor-pointer text-center"
                >
                  Buka Sirkulator Digital
                </button>
                <button
                  onClick={() => setSelectedSpine(null)}
                  className="px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  Tutup Tinjauan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple internal icon for spine bookshelf
function StarIcon({ size = 12 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
    </svg>
  );
}

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Ruang Baca Barat Darul Hikmah",
    imageUrl: "/src/assets/images/regenerated_image_1779181754635.png",
  },
  {
    id: "gal-2",
    title: "Sesi Diskusi Dewan Pakar Riset",
    imageUrl: "/src/assets/images/regenerated_image_1779181770796.jpg",
  },
  {
    id: "gal-3",
    title: "Pustaka Kitab Turats Klasik",
    imageUrl: "/src/assets/images/regenerated_image_1779181774179.jpg",
  },
  {
    id: "gal-4",
    title: "Koleksi Digital Room & Lab",
    imageUrl: "/src/assets/images/regenerated_image_1779181754635.png",
  },
];

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("almisbah_theme");
      if (saved === "dark") return true;
      if (saved === "light") return false;
      return (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    }
    return false;
  });

  // Navigation Tabs State (catalog, ai-engine, dashboard, showcase)
  const [activeTab, setActiveTab] = useState<
    "catalog" | "ai-engine" | "dashboard" | "showcase"
  >("catalog");

  // Floating particle points for AI Engine page
  const particles = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage x
      y: Math.random() * 100, // percentage y
      size: Math.random() * 6 + 3, // size in px
      speed: Math.random() * 20 + 10, // animation duration
      delay: Math.random() * -20, // initial animation delay
    }));
  }, []);

  // Global App Toast Notification State
  const [appToast, setAppToast] = useState<string | null>(null);
  const triggerAppToast = (msg: string) => {
    setAppToast(msg);
    setTimeout(() => {
      setAppToast(null);
    }, 3200);
  };

  // Interactive Premium Features States
  const [activeReaderBook, setActiveReaderBook] = useState<Book | null>(null);
  const [readerPage, setReaderPage] = useState(1);
  const [readerTab, setReaderTab] = useState<
    "abstract" | "reading" | "conclusion"
  >("abstract");
  const [readerTheme, setReaderTheme] = useState<"light" | "sepia" | "dark">(() => {
    try {
      const stored = localStorage.getItem("almisbah_reader_theme");
      return (stored as "light" | "sepia" | "dark") || "light";
    } catch (e) {
      return "light";
    }
  });
  const [readingProgress, setReadingProgress] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem("almisbah_reading_progress");
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });

  // Distraction-Free Focus Reader Mode States
  const [focusReaderBook, setFocusReaderBook] = useState<Book | null>(null);
  const [focusReaderPage, setFocusReaderPage] = useState<number>(1);
  const [focusFontSize, setFocusFontSize] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("almisbah_focus_fontsize");
      return saved ? parseInt(saved, 10) : 19;
    } catch {
      return 19;
    }
  });
  const [focusLineHeight, setFocusLineHeight] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("almisbah_focus_lineheight");
      return saved ? parseFloat(saved) : 1.85;
    } catch {
      return 1.85;
    }
  });
  const [focusBgTheme, setFocusBgTheme] = useState<
    "oled" | "dark" | "sepia" | "cream" | "slate" | "light"
  >(() => {
    try {
      const saved = localStorage.getItem("almisbah_focus_bgtheme");
      return (saved as any) || "dark";
    } catch {
      return "dark";
    }
  });
  const [focusFontFamily, setFocusFontFamily] = useState<
    "serif" | "sans" | "mono"
  >(() => {
    try {
      const saved = localStorage.getItem("almisbah_focus_fontfamily");
      return (saved as any) || "serif";
    } catch {
      return "serif";
    }
  });
  const [focusColumnWidth, setFocusColumnWidth] = useState<
    "narrow" | "normal" | "wide"
  >(() => {
    try {
      const saved = localStorage.getItem("almisbah_focus_columnwidth");
      return (saved as any) || "normal";
    } catch {
      return "normal";
    }
  });
  const [focusTextAlign, setFocusTextAlign] = useState<"left" | "justify">(
    () => {
      try {
        const saved = localStorage.getItem("almisbah_focus_textalign");
        return (saved as any) || "left";
      } catch {
        return "left";
      }
    },
  );
  const [isFocusSettingsOpen, setIsFocusSettingsOpen] = useState(false);
  const [isFocusZenMode, setIsFocusZenMode] = useState(false);
  const [isFocusFullscreen, setIsFocusFullscreen] = useState(false);

  // Sync Focus Reader typography settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("almisbah_focus_fontsize", focusFontSize.toString());
      localStorage.setItem("almisbah_focus_lineheight", focusLineHeight.toString());
      localStorage.setItem("almisbah_focus_bgtheme", focusBgTheme);
      localStorage.setItem("almisbah_focus_fontfamily", focusFontFamily);
      localStorage.setItem("almisbah_focus_columnwidth", focusColumnWidth);
      localStorage.setItem("almisbah_focus_textalign", focusTextAlign);
    } catch (e) {
      // ignore storage failure
    }
  }, [
    focusFontSize,
    focusLineHeight,
    focusBgTheme,
    focusFontFamily,
    focusColumnWidth,
    focusTextAlign,
  ]);

  // Sync Focus Reader progress to overall reading progress
  useEffect(() => {
    if (focusReaderBook) {
      const currentProgressVal = Math.round((focusReaderPage / 5) * 100);
      setReadingProgress((prev) => {
        const bookId = focusReaderBook.id;
        const existing = prev[bookId] || 0;
        if (currentProgressVal > existing) {
          const updated = {
            ...prev,
            [bookId]: currentProgressVal,
          };
          try {
            localStorage.setItem(
              "almisbah_reading_progress",
              JSON.stringify(updated),
            );
          } catch (e) {}
          return updated;
        }
        return prev;
      });
    }
  }, [focusReaderBook, focusReaderPage]);

  // Keyboard navigation & controls for Focus Reader
  useEffect(() => {
    if (!focusReaderBook) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // If typing in input, ignore
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "Escape") {
        if (isFocusSettingsOpen) {
          setIsFocusSettingsOpen(false);
        } else {
          setFocusReaderBook(null);
        }
      } else if (e.key === "ArrowRight" || e.key === "PageDown") {
        setFocusReaderPage((p) => Math.min(5, p + 1));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        setFocusReaderPage((p) => Math.max(1, p - 1));
      } else if (e.key === "t" || e.key === "T") {
        setIsFocusSettingsOpen((prev) => !prev);
      } else if (e.key === "z" || e.key === "Z") {
        setIsFocusZenMode((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusReaderBook, isFocusSettingsOpen]);

  const toggleFocusFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFocusFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFocusFullscreen(false);
    }
  };

  // Calculate and update book reading progress continuously
  useEffect(() => {
    if (activeReaderBook) {
      let currentProgressVal = 0;
      if (readerTab === "abstract") {
        currentProgressVal = 20;
      } else if (readerTab === "reading") {
        currentProgressVal = Math.round(20 + (readerPage / 5) * 60);
      } else if (readerTab === "conclusion") {
        currentProgressVal = 100;
      }

      setReadingProgress((prev) => {
        const bookId = activeReaderBook.id;
        const existing = prev[bookId] || 0;
        if (currentProgressVal > existing) {
          return {
            ...prev,
            [bookId]: currentProgressVal,
          };
        }
        return prev;
      });
    }
  }, [activeReaderBook, readerTab, readerPage]);

  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Advanced Search Options
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [searchInDescription, setSearchInDescription] = useState(false);
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "title-asc" | "title-desc"
  >("newest");
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);
  const [timeFilter, setTimeFilter] = useState<
    "all" | "today" | "week" | "month"
  >("all");

  // Book Form State
  const [newBook, setNewBook] = useState<Partial<Book>>({
    title: "",
    author: "",
    category: "Research",
    description: "",
    coverImage: "",
    fileName: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Activities Form State
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    title: "",
    category: "Kunjungan",
    description: "",
    date: "",
    imageUrl: "",
  });
  const [isActivityUploading, setIsActivityUploading] = useState(false);
  const activityImageInputRef = useRef<HTMLInputElement>(null);

  // Gallery Form State
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [newGallery, setNewGallery] = useState<Partial<GalleryItem>>({
    title: "",
    imageUrl: "",
  });
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);

  // About / Learn More Modal State
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [aboutActiveTab, setAboutActiveTab] = useState<
    "overview" | "features" | "syamila" | "rules"
  >("overview");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsAboutModalOpen(false);
      }
    };
    if (isAboutModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAboutModalOpen]);

  // AI Research & Shamela Desk State (Floating Widget)
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiDiscipline, setAiDiscipline] = useState("Semua");
  const [aiChatHistory, setAiChatHistory] = useState<
    Array<{ role: "user" | "assistant"; text: string; timestamp: number }>
  >([
    {
      role: "assistant",
      text: "Halo! Saya adalah **Darul Hikmah AI**.\n\nAda yang bisa saya bantu hari ini? Anda bisa menanyakan apa saja—mulai dari penjelasan materi, bantuan tugas & menulis, hukum fiqih, sains & teknologi, hingga tanya jawab santai seperti chatbot pada umumnya!",
      timestamp: Date.now(),
    },
  ]);
  const aiChatEndRef = useRef<HTMLDivElement>(null);

  // Microphone Speech Recognition & Model Selection States
  const [isListening, setIsListening] = useState(false);
  const [activeModel, setActiveModel] = useState("Gemini 3.5 Flash");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "id-ID";

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setAiPrompt((prev) => (prev ? prev + " " + transcript : transcript));
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech Recognition Error", event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      if (isListening) {
        setIsListening(false);
      } else {
        setIsListening(true);
        const simulatedQueries = [
          "Bagaimana kedudukan sanad hadits Arba'in Nawawi nomor 5?",
          "Carikan tafsir surah Al-Alaq ayat 1-5 berdasarkan Tafsir Jalalain.",
          "Apa saja syarat sah rukun tayamum dalam madzhab Syafi'i?",
          "Formulasikan hipotesis riset tentang modernisasi pesantren di Indonesia.",
          "Apakah ada naskah turats klasik tentang oseanografi?",
        ];
        const randomQuery =
          simulatedQueries[Math.floor(Math.random() * simulatedQueries.length)];
        let currentText = "";
        let i = 0;

        const typeInterval = setInterval(() => {
          if (i < randomQuery.length) {
            currentText += randomQuery.charAt(i);
            setAiPrompt(currentText);
            i++;
          } else {
            clearInterval(typeInterval);
            setIsListening(false);
          }
        }, 50);
      }
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Speech recognition manually error:", e);
        setIsListening(false);
      }
    }
  };

  const handleAiSearch = async (
    e?: React.FormEvent,
    customPrompt?: string,
    action?: string,
  ) => {
    if (e) e.preventDefault();
    const activePrompt = customPrompt || aiPrompt;
    if (!activePrompt.trim() || isAiLoading) return;

    setIsAiLoading(true);

    const userMsg = {
      role: "user" as const,
      text: activePrompt,
      timestamp: Date.now(),
    };
    setAiChatHistory((prev) => [...prev, userMsg]);
    setAiPrompt("");

    try {
      const response = await fetch("/api/gemini/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: activePrompt,
          category: aiDiscipline,
          currentBooks: books,
          actionType: action || "generalChat",
        }),
      });

      const data = await response.json();
      if (data.success && data.result) {
        setAiChatHistory((prev) => [
          ...prev,
          {
            role: "assistant" as const,
            text: data.result,
            timestamp: Date.now(),
          },
        ]);
      } else {
        setAiChatHistory((prev) => [
          ...prev,
          {
            role: "assistant" as const,
            text: `Aduh, mohon maaf. AI Scholar mengalami gangguan: ${data.error || "Gagal merespons riset."}`,
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (err: any) {
      setAiChatHistory((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          text: `Terjadi gangguan koneksi ke server Al-Misbah AI: ${err.message || err}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    if (aiChatEndRef.current) {
      aiChatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [aiChatHistory]);

  // AI Suggestions and Custom Markdown Parser
  const AI_SUGGESTIONS = [
    {
      title: "Riset Fiqh Kontemporer",
      prompt:
        "Berikan rancangan analisis judul riset mengenai kedaulatan data umat Islam di era integrasi kecerdasan buatan (artificial intelligence) saat ini. Sertakan referensi metodologi dan kutipan fiqih yang relevan.",
      discipline: "Fiqh",
      tagline: "Kedaulatan Data AI",
    },
    {
      title: "Hadits & Sains Modern",
      prompt:
        "Bagaimana korelasi hadits-hadits tentang kesehatan sanitasi lingkungan dengan riset klinis epidemiologi modern? Berikan sanad perawi terpercaya serta referensinya di Syamila.",
      discipline: "Hadits",
      tagline: "Sanitasi & Epidemiologi",
    },
    {
      title: "Tafsir Al-Quran Kelautan",
      prompt:
        "Analisis penafsiran ayat-ayat 'Bahr' (lautan/perairan) menurut mufassir klasik (seperti At-Thabari atau Ibnu Katsir) dihubungkan dengan riset oseanografi modern pesantren saat ini.",
      discipline: "Tafsir",
      tagline: "Oseanografi Santri",
    },
    {
      title: "Inovasi Pertanian Kitab",
      prompt:
        "Buat 3 alternatif judul tesis inovatif yang menggabungkan panduan pertanian organik dari kitab Al-Filaha dengan rekayasa teknologi tanah ramah lingkungan saat ini.",
      discipline: "Inovasi",
      tagline: "Agrotek Kitab Klasik",
    },
  ];

  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");
    const resultElements: React.ReactNode[] = [];
    let pendingTableRows: string[] = [];

    const flushTable = (index: number) => {
      if (pendingTableRows.length === 0) return null;

      const processedRows = pendingTableRows.map((row) => {
        const cells = row.split("|").map((c) => c.trim());
        if (row.trim().startsWith("|") && row.trim().endsWith("|")) {
          return cells.slice(1, -1);
        }
        return cells.filter((c) => c !== "");
      });

      const tableRows = processedRows.filter((cells) => {
        return (
          cells.length > 0 && !cells.every((cell) => /^:?-+:?$/.test(cell))
        );
      });

      if (tableRows.length === 0) {
        pendingTableRows = [];
        return null;
      }

      const headers = tableRows[0];
      const bodyRows = tableRows.slice(1);
      pendingTableRows = [];

      return (
        <div
          key={`table-block-${index}`}
          className="my-5 overflow-x-auto rounded-xl border border-zinc-150 dark:border-zinc-850 bg-[#FAF9F6]/50 dark:bg-zinc-950/20 relative z-10 transition-all duration-300"
        >
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-[#150D24]/40 border-b border-zinc-150 dark:border-zinc-850">
              <tr>
                {headers.map((hdr, hIdx) => (
                  <th
                    key={hIdx}
                    className="px-4 py-2.5 font-display font-bold uppercase tracking-[0.12em] text-[10px] text-[#E5C158] border-r border-zinc-150/60 dark:border-zinc-850 last:border-r-0"
                  >
                    {hdr}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150/40 dark:divide-zinc-900/60 bg-transparent">
              {bodyRows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className={
                    rIdx % 2 === 0
                      ? "bg-zinc-50/10 dark:bg-zinc-900/5"
                      : "bg-transparent"
                  }
                >
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className="px-4 py-3 text-zinc-805 dark:text-zinc-300 font-sans align-top whitespace-pre-wrap border-r border-zinc-150/40 dark:border-zinc-900 last:border-r-0 text-[12.5px] leading-relaxed"
                    >
                      {parseBold(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];
      const trimmed = line.trim();

      if (trimmed.startsWith("|")) {
        pendingTableRows.push(line);
      } else {
        if (pendingTableRows.length > 0) {
          const tableElement = flushTable(idx);
          if (tableElement) {
            resultElements.push(tableElement);
          }
        }

        if (trimmed.startsWith(">")) {
          resultElements.push(
            <blockquote
              key={idx}
              className="border-l-2 border-[#E5C158] pl-4 py-2 my-4 italic text-zinc-650 dark:text-zinc-400 bg-zinc-50/50 dark:bg-[#121216]/50 rounded-r-lg font-sans text-[13.5px]"
            >
              {trimmed.substring(1).trim()}
            </blockquote>,
          );
        } else if (trimmed.startsWith("###")) {
          resultElements.push(
            <h4
              key={idx}
              className="text-[11px] font-display font-bold uppercase tracking-[0.15em] text-[#E5C158] mt-6 mb-2 flex items-center gap-2 border-l border-[#E5C158] pl-2"
            >
              {trimmed.substring(3).trim()}
            </h4>,
          );
        } else if (trimmed.startsWith("##")) {
          resultElements.push(
            <h3
              key={idx}
              className="text-xs md:text-sm font-display font-bold uppercase tracking-[0.12em] text-zinc-900 dark:text-zinc-100 mt-7 mb-3.5 pb-1 border-b border-zinc-150 dark:border-zinc-800"
            >
              {trimmed.substring(2).trim()}
            </h3>,
          );
        } else if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
          const itemContent = trimmed.replace(/^[-*]\s*/, "");
          resultElements.push(
            <div
              key={idx}
              className="flex items-start gap-2.5 my-2 pl-2 animate-fadeIn"
            >
              <span className="text-[#E5C158] mt-2 shrink-0 block w-1.5 h-1.5 rounded-full bg-[#E5C158]"></span>
              <span className="text-[13.5px] text-zinc-800 dark:text-zinc-300 leading-relaxed font-sans">
                {parseBold(itemContent)}
              </span>
            </div>,
          );
        } else if (!trimmed) {
          resultElements.push(<div key={idx} className="h-2" />);
        } else {
          resultElements.push(
            <p
              key={idx}
              className="text-[13.5px] text-zinc-800 dark:text-zinc-300 leading-relaxed font-sans my-2 text-justify"
            >
              {parseBold(trimmed)}
            </p>,
          );
        }
      }
    }

    if (pendingTableRows.length > 0) {
      const tableElement = flushTable(lines.length);
      if (tableElement) {
        resultElements.push(tableElement);
      }
    }

    return resultElements;
  };

  const extractReferencesAndFootnotes = (text: string) => {
    const lines = text.split("\n");
    const refs: Array<{ id: string; content: string; bookName?: string }> = [];
    const addedContents = new Set<string>();

    lines.forEach((line) => {
      const trimmed = line.trim();

      // Parse citations [1] format
      const bracketMatch = trimmed.match(/^\[(\d+)\]\s*(.+)/);
      if (bracketMatch) {
        const content = bracketMatch[2].trim();
        if (!addedContents.has(content)) {
          addedContents.add(content);
          const bookNameMatch = content.match(
            /(Kitab|Buku|Imam|HR\.|Tafsir)\s+([A-Z][A-Za-z0-9'\s\-]+)/,
          );
          refs.push({
            id: `[${bracketMatch[1]}]`,
            content: content,
            bookName: bookNameMatch
              ? `${bookNameMatch[1]} ${bookNameMatch[2]?.split(/[,;.\(]/)[0]?.trim()}`
              : undefined,
          });
        }
        return;
      }

      // Check for lists that discuss sources or references (Maraji')
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        const cleaned = trimmed.replace(/^[-*]\s*/, "");
        const isRefLine =
          cleaned.toLowerCase().includes("kitab") ||
          cleaned.toLowerCase().includes("muallif") ||
          cleaned.toLowerCase().includes("halaman") ||
          cleaned.toLowerCase().includes("sumber") ||
          cleaned.toLowerCase().includes("maraji") ||
          cleaned.toLowerCase().includes("rujukan");

        if (isRefLine && !addedContents.has(cleaned)) {
          addedContents.add(cleaned);
          // Try to extract book title
          const titleMatch = cleaned.match(/"([^"]+)"|«([^»]+)»/);
          refs.push({
            id: "Rujukan",
            content: cleaned,
            bookName: titleMatch ? titleMatch[1] || titleMatch[2] : undefined,
          });
        }
      }

      // Check for tables that contain references
      if (trimmed.startsWith("|")) {
        const cells = trimmed
          .split("|")
          .map((c) => c.trim())
          .filter((c) => c !== "");
        // If it looks like a row in Table 2 (having 4 cells) and the first cell indicates a book (not headers or separators)
        if (
          cells.length >= 3 &&
          !cells.every((c) => /^:?-+:?$/.test(c)) &&
          cells[0].toLowerCase() !== "nama kitab" &&
          cells[0]?.length > 2
        ) {
          const content = `${cells[0]} oleh ${cells[1] || "Ulama"} - Jilid/Bab: ${cells[2] || "-"} Matan: ${cells[3] || "-"}`;
          if (!addedContents.has(content)) {
            addedContents.add(content);
            refs.push({
              id: "Kitab Turats",
              content: `Jilid/Bab/Halaman: ${cells[2] || "-"} (${cells[3] || "Matan Utama"})`,
              bookName: `${cells[0]} (${cells[1] || "Muallif"})`,
            });
          }
        }
      }
    });

    return refs;
  };

  const parseBold = (text: string) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <strong
            key={i}
            className="font-bold text-[#C9A23B] dark:text-[#E5C158] bg-[#E5C158]/5 dark:bg-[#E5C158]/10 px-1 rounded select-all font-sans"
          >
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  // Initialize Data
  useEffect(() => {
    const savedBooks = localStorage.getItem("almisbah_library_books");
    if (savedBooks) {
      try {
        const parsed = JSON.parse(savedBooks) as Book[];
        // Filter out any default books that are not in the parsed list and add them
        const missingDefaultBooks = DEFAULT_BOOKS.filter(
          (db) => !parsed.some((pb) => pb.id === db.id),
        );
        if (missingDefaultBooks.length > 0) {
          const mergedBooks = [...parsed, ...missingDefaultBooks];
          setBooks(mergedBooks);
          localStorage.setItem(
            "almisbah_library_books",
            JSON.stringify(mergedBooks),
          );
        } else {
          setBooks(parsed);
        }
      } catch (e) {
        setBooks(DEFAULT_BOOKS);
      }
    } else {
      setBooks(DEFAULT_BOOKS);
    }

    const savedActivities = localStorage.getItem("almisbah_activities");
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    } else {
      setActivities(DEFAULT_ACTIVITIES);
    }

    const savedGallery = localStorage.getItem("almisbah_gallery");
    if (savedGallery) {
      setGalleryItems(JSON.parse(savedGallery));
    } else {
      setGalleryItems(DEFAULT_GALLERY);
    }

    const savedBookmarks = localStorage.getItem("almisbah_bookmarks");
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }

    const savedTheme = localStorage.getItem("almisbah_theme");
    const systemPrefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark =
      savedTheme === "dark" || (!savedTheme && systemPrefersDark);
    if (shouldBeDark) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    setIsLoaded(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Save Data
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("almisbah_library_books", JSON.stringify(books));
    }
  }, [books, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("almisbah_activities", JSON.stringify(activities));
    }
  }, [activities, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("almisbah_gallery", JSON.stringify(galleryItems));
    }
  }, [galleryItems, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("almisbah_bookmarks", JSON.stringify(bookmarks));
    }
  }, [bookmarks, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("almisbah_reading_progress", JSON.stringify(readingProgress));
    }
  }, [readingProgress, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("almisbah_reader_theme", readerTheme);
    }
  }, [readerTheme, isLoaded]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newVal = !prev;
      if (newVal) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("almisbah_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("almisbah_theme", "light");
      }
      return newVal;
    });
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks((prev) => {
      if (prev.includes(id)) {
        return prev.filter((bId) => bId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const filteredBooks = useMemo(() => {
    const result = books.filter((book) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        (searchInDescription && book.description.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === "Semua" || book.category === selectedCategory;

      const matchesBookmark =
        !showOnlyBookmarked || bookmarks.includes(book.id);

      let matchesTime = true;
      if (timeFilter !== "all") {
        const timeDiff = Date.now() - book.createdAt;
        if (timeFilter === "today") {
          matchesTime = timeDiff <= 86400000; // 24 hours
        } else if (timeFilter === "week") {
          matchesTime = timeDiff <= 86400000 * 7; // 7 days
        } else if (timeFilter === "month") {
          matchesTime = timeDiff <= 86400000 * 30; // 30 days
        }
      }

      return matchesSearch && matchesCategory && matchesBookmark && matchesTime;
    });

    // Sort matching results
    return [...result].sort((a, b) => {
      if (sortBy === "newest") {
        return b.createdAt - a.createdAt;
      } else if (sortBy === "oldest") {
        return a.createdAt - b.createdAt;
      } else if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "title-desc") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });
  }, [
    books,
    searchQuery,
    selectedCategory,
    searchInDescription,
    sortBy,
    showOnlyBookmarked,
    timeFilter,
    bookmarks,
  ]);

  const processUploadedFile = (file: File) => {
    setUploadError(null);
    const fileNameLower = file.name.toLowerCase();
    const isImage =
      file.type.startsWith("image/") ||
      /\.(png|jpe?g|webp|gif|svg)$/i.test(fileNameLower);
    const isDoc =
      file.type === "application/pdf" ||
      file.type === "application/epub+zip" ||
      /\.(pdf|epub)$/i.test(fileNameLower);

    if (!isImage && !isDoc) {
      setUploadError(
        "Format file tidak didukung. Silakan unggah format Gambar (PNG/JPG/WEBP) untuk cover, atau Dokumen (PDF/EPUB) untuk arsip digital buku.",
      );
      return;
    }

    if (isImage) {
      // Limit cover image to 5 MB
      const maxImgSize = 5 * 1024 * 1024;
      if (file.size > maxImgSize) {
        setUploadError(
          `Ukuran foto terlalu besar. Batas maksimal ukuran gambar adalah 5 MB (File Anda: ${(file.size / (1024 * 1024)).toFixed(2)} MB).`,
        );
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBook((prev) => ({
          ...prev,
          coverImage: reader.result as string,
          fileName: file.name,
        }));
      };
      reader.onerror = () => {
        setUploadError("Gagal membaca file gambar. Silakan coba file lain.");
      };
      reader.readAsDataURL(file);
    } else {
      // It is a document (PDF / EPUB)
      // Limit document to 15 MB
      const maxDocSize = 15 * 1024 * 1024;
      if (file.size > maxDocSize) {
        setUploadError(
          `Ukuran dokumen terlalu besar. Batas maksimal ukuran dokumen adalah 15 MB (File Anda: ${(file.size / (1024 * 1024)).toFixed(2)} MB).`,
        );
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const isPdfFormat =
          fileNameLower.endsWith(".pdf") || file.type === "application/pdf";

        const canvas = document.createElement("canvas");
        canvas.width = 300;
        canvas.height = 420;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const cat = (newBook.category || "Research").toLowerCase();
          let colorStart = "#1E1B4B"; // Indigo
          let colorEnd = "#111827"; // Gray-900
          let themeName = "DIGITAL ARCHIVE";

          if (cat === "magazine") {
            colorStart = "#022C22"; // Emerald
            colorEnd = "#064E3B"; // Emerald-900
            themeName = "MONTHLY MAGAZINE";
          } else if (cat === "inovation" || cat === "innovation") {
            colorStart = "#311042"; // Purple
            colorEnd = "#140c1d"; // Dark Purple
            themeName = "EDUCATION INNOVATION";
          } else if (cat === "general") {
            colorStart = "#1C1917"; // Stone-900
            colorEnd = "#292524"; // Stone-800
            themeName = "GENERAL LITERACY";
          }

          const gradient = ctx.createLinearGradient(0, 0, 0, 420);
          gradient.addColorStop(0, colorStart);
          gradient.addColorStop(1, colorEnd);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 300, 420);

          // Gold border
          ctx.strokeStyle = "#E5C158";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(15, 15, 270, 390);
          ctx.lineWidth = 0.5;
          ctx.strokeStyle = "rgba(229, 193, 88, 0.4)";
          ctx.strokeRect(19, 19, 262, 382);

          // Center geometry block
          ctx.strokeStyle = "rgba(229, 193, 88, 0.15)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(150, 205, 52, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = "rgba(229, 193, 88, 0.05)";
          ctx.beginPath();
          ctx.arc(150, 205, 48, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#E5C158";
          ctx.font = "bold 22px Georgia, serif";
          ctx.textAlign = "center";
          ctx.fillText(isPdfFormat ? "PDF" : "EPUB", 150, 202);

          ctx.fillStyle = "rgba(229, 193, 88, 0.8)";
          ctx.font = "bold 8px system-ui, sans-serif";
          ctx.fillText(themeName, 150, 222);

          ctx.fillStyle = "#E5C158";
          ctx.font = "bold 9px system-ui, sans-serif";
          ctx.fillText((newBook.category || "Research").toUpperCase(), 150, 75);

          ctx.fillStyle = "#FFFFFF";
          ctx.font = 'bold 14px "Playfair Display", Georgia, serif';
          const titleText = newBook.title
            ? newBook.title.trim()
            : "Katalog Digital";

          const words = titleText.split(" ");
          let line = "";
          let y = 290;
          const lineHeight = 19;
          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + " ";
            const metrics = ctx.measureText(testLine);
            if (metrics.width > 220 && n > 0) {
              ctx.fillText(line.trim(), 150, y);
              line = words[n] + " ";
              y += lineHeight;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line.trim(), 150, y);

          ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
          ctx.font = "italic 11px Georgia, serif";
          const authorText = newBook.author
            ? newBook.author.trim()
            : "Darul Hikmah Library";
          ctx.fillText(authorText, 150, 365);
        }

        const generatedCover = canvas.toDataURL("image/png");
        setNewBook((prev) => ({
          ...prev,
          coverImage: generatedCover,
          fileName: file.name,
        }));
      };
      reader.onerror = () => {
        setUploadError("Gagal membaca file dokumen. Silakan coba file lain.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.title || !newBook.author || !newBook.coverImage) return;

    setIsUploading(true);

    // Simulate Apple-style premium loading
    setTimeout(() => {
      const bookToAdd: Book = {
        id: Math.random().toString(36).substr(2, 9),
        title: newBook.title as string,
        author: newBook.author as string,
        category: newBook.category as "Research",
        description: newBook.description || "",
        coverImage: newBook.coverImage as string,
        fileName: newBook.fileName || "document.pdf",
        createdAt: Date.now(),
      };

      setBooks((prev) => [bookToAdd, ...prev]);
      setIsUploading(false);
      setUploadSuccess(true);

      // Reset form
      setNewBook({
        title: "",
        author: "",
        category: "Research",
        description: "",
        coverImage: "",
        fileName: "",
      });

      setTimeout(() => setUploadSuccess(false), 3000);
    }, 1500);
  };

  const handleActivityFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewActivity((prev) => ({
          ...prev,
          imageUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.title || !newActivity.description || !newActivity.imageUrl)
      return;

    setIsActivityUploading(true);
    setTimeout(() => {
      const actToAdd: Activity = {
        id: Math.random().toString(36).substr(2, 9),
        title: newActivity.title as string,
        category: newActivity.category || "Kunjungan",
        description: newActivity.description as string,
        date: newActivity.date || new Date().toISOString().split("T")[0],
        imageUrl: newActivity.imageUrl as string,
      };

      setActivities((prev) => [actToAdd, ...prev]);
      setIsActivityUploading(false);
      setIsActivityModalOpen(false);
      setNewActivity({
        title: "",
        category: "Kunjungan",
        description: "",
        date: "",
        imageUrl: "",
      });
    }, 1200);
  };

  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewGallery((prev) => ({
          ...prev,
          imageUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGallery.title || !newGallery.imageUrl) return;

    setIsGalleryUploading(true);
    setTimeout(() => {
      const galToAdd: GalleryItem = {
        id: Math.random().toString(36).substr(2, 9),
        title: newGallery.title as string,
        imageUrl: newGallery.imageUrl as string,
      };

      setGalleryItems((prev) => [galToAdd, ...prev]);
      setIsGalleryUploading(false);
      setIsGalleryModalOpen(false);
      setNewGallery({ title: "", imageUrl: "" });
    }, 1200);
  };

  const handleStartExploring = () => {
    if (activeTab !== "catalog") {
      setActiveTab("catalog");
    }
    const scrollToCatalog = () => {
      const el = document.getElementById("catalog");
      if (el) {
        const rect = el.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const targetY = rect.top + scrollTop - 80;
        window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
        try {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch {}
      } else {
        window.scrollTo({ top: 900, behavior: "smooth" });
      }
    };
    scrollToCatalog();
    setTimeout(scrollToCatalog, 60);
    setTimeout(scrollToCatalog, 250);
  };

  const handleOpenAiScholar = () => {
    setIsAboutModalOpen(false);
    if (activeTab !== "catalog") {
      setActiveTab("catalog");
    }
    const scrollToScholar = () => {
      const el = document.getElementById("ai-scholar");
      if (el) {
        const rect = el.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const targetY = rect.top + scrollTop - 80;
        window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
        try {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch {}
      } else {
        window.scrollTo({ top: 400, behavior: "smooth" });
      }
    };
    scrollToScholar();
    setTimeout(scrollToScholar, 60);
    setTimeout(scrollToScholar, 250);
  };

  return (
    <div
      className={`min-h-screen font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black w-full overflow-x-clip transition-colors duration-500 ${
        isDarkMode
          ? "bg-[#121212] text-zinc-100"
          : "bg-[#F5F5F7] text-[#1D1D1F]"
      }`}
    >
      {/* Global Toast Notification */}
      <AnimatePresence>
        {appToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-5 py-3 rounded-full text-xs font-semibold tracking-wide shadow-2xl flex items-center gap-2 border border-zinc-800"
          >
            <Sparkles size={14} className="text-[#E5C158] animate-pulse" />
            <span>{appToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. TOP PREMIUM SEAMLESS HEADER */}
      <header className="bg-black text-white relative z-40 overflow-hidden" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
        {/* Top Segment: Brand & Logos */}
        <div
          id="top-banner"
          className="flex flex-col md:flex-row items-center justify-between gap-6 px-6 py-6 max-w-7xl mx-auto w-full"
          style={{
            backgroundColor: "#000000",
            color: "#FFFFFF",
            fontFamily: "'Inter', sans-serif"
          }}
        >
          {/* Sisi Kiri: Teks utama "AL-MISBAH EDUCATION" */}
          <div className="flex items-center gap-6 self-start md:self-auto">
            <div style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              border: "2.5px solid rgba(229, 193, 88, 0.5)",
              padding: "2px",
              backgroundColor: "#020617",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 15px rgba(229, 193, 88, 0.15)"
            }} className="shrink-0">
              <img
                src="/assets/aistudio/LOGO_AL_HIKMAH_e5f152fe.png"
                alt="Darul Hikmah Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <h1
                style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: "36px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  lineHeight: "0.95",
                  letterSpacing: "0.02em",
                  color: "#FFFFFF",
                  margin: 0
                }}
              >
                AL-MISBAH
              </h1>
              <h1
                style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: "36px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  lineHeight: "0.95",
                  letterSpacing: "0.02em",
                  color: "#FFFFFF",
                  margin: 0
                }}
              >
                EDUCATION
              </h1>
            </div>
          </div>

          {/* Sisi Tengah: Teks Pendamping */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: "14px"
            }}
            className="flex-1 md:pl-10 text-left"
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "23px",
                  fontWeight: "500",
                  color: "#FFFFFF",
                  lineHeight: "1.25"
                }}
              >
                Modern Islamic analisis
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "23px",
                  fontWeight: "500",
                  color: "#FFFFFF",
                  lineHeight: "1.25"
                }}
              >
                for the modern world
              </span>
            </div>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "13.5px",
                fontWeight: "600",
                color: "#FFFFFF",
                opacity: 0.9,
                letterSpacing: "0.1em"
              }}
            >
              MINISTRY RESEARCH & LIBRARY
            </span>
          </div>

          {/* Sisi Kanan: Partner Logos Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }} className="shrink-0 p-1 bg-transparent">
            <div style={{ width: "44px", height: "44px" }} className="flex items-center justify-center">
              <img
                src="/src/assets/images/regenerated_image_1779181971498.png"
                alt="Tazakka"
                className="w-full h-full object-contain hover:scale-105 duration-300"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://placehold.co/100x100/red/white?text=TZ")
                }
              />
            </div>
            <div style={{ width: "44px", height: "44px" }} className="flex items-center justify-center">
              <img
                src="/src/assets/images/regenerated_image_1779181984283.png"
                alt="Mandala"
                className="w-full h-full object-contain hover:scale-105 duration-300"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://placehold.co/100x100/green/white?text=MD")
                }
              />
            </div>
            <div style={{ width: "44px", height: "44px" }} className="flex items-center justify-center">
              <img
                src="/src/assets/images/regenerated_image_1779181989432.png"
                alt="Al Fath"
                className="w-full h-full object-contain hover:scale-105 duration-300"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://placehold.co/100x100/blue/white?text=AF")
                }
              />
            </div>
            <div style={{ width: "44px", height: "44px" }} className="flex items-center justify-center">
              <img
                src="/src/assets/images/regenerated_image_1779182020555.png"
                alt="DH Library"
                className="w-full h-full object-contain hover:scale-105 duration-300"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://placehold.co/100x100/black/white?text=DH")
                }
              />
            </div>
          </div>
        </div>

        {/* Bottom Segment: Seamless Navigation and Utilities */}
        <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.15)", backgroundColor: "#020202" }} className="py-4.5 px-6 md:px-12 w-full">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-5">
            
            {/* Sisi Kiri: Logo + Al-Misbah.Education */}
            <div 
              style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
              onClick={() => setActiveTab("catalog")}
            >
              <div style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2px",
                boxSizing: "border-box"
              }}>
                <img
                  src="/src/assets/images/regenerated_image_1779182020555.png"
                  alt="Al-Misbah Icon"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: "700", color: "#FFFFFF" }}>
                Al-Misbah.Education
              </span>
            </div>

            {/* Sisi Kanan: Navigation Links & Pill Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-6 lg:gap-8 justify-center">
              
              {/* Navigation Links with custom purple color map to app tabs */}
              <div 
                style={{ display: "flex", alignItems: "center", gap: "24px" }}
                className="text-xs md:text-[14px] font-semibold"
              >
                <button
                  type="button"
                  onClick={() => setActiveTab("dashboard")}
                  style={{
                    color: activeTab === "dashboard" ? "#FFFFFF" : "#8B5CF6",
                    fontWeight: activeTab === "dashboard" ? "800" : "500",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif"
                  }}
                  className="hover:text-white transition-colors"
                >
                  Research
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("ai-engine")}
                  style={{
                    color: activeTab === "ai-engine" ? "#FFFFFF" : "#8B5CF6",
                    fontWeight: activeTab === "ai-engine" ? "800" : "500",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif"
                  }}
                  className="hover:text-white transition-colors"
                >
                  Innovation
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("showcase")}
                  style={{
                    color: activeTab === "showcase" ? "#FFFFFF" : "#8B5CF6",
                    fontWeight: activeTab === "showcase" ? "800" : "500",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif"
                  }}
                  className="hover:text-white transition-colors"
                >
                  Magazine
                </button>
                
                {/* About Us link with Chevron */}
                <div 
                  onClick={() => setIsAboutModalOpen(true)}
                  className="relative group cursor-pointer flex items-center gap-1 text-[#8B5CF6] hover:text-white transition-colors"
                >
                  <span style={{ fontSize: "14px", fontWeight: "400", fontFamily: "'Inter', sans-serif" }}>About us</span>
                  <ChevronDown size={12} className="inline-block translate-y-[1px]" />
                </div>
              </div>

              {/* Pill Buttons & Theme Toggle */}
              <div className="flex items-center gap-3">
                {/* Theme Toggle Button */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full transition-all bg-zinc-900/80 hover:bg-zinc-800 text-amber-400 border border-zinc-800 cursor-pointer"
                  title="Ganti Tema"
                >
                  {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                </button>

                <button
                  onClick={() => setActiveTab("catalog")}
                  style={{
                    backgroundColor: "#7C3AED",
                    color: "#FFFFFF",
                    borderRadius: "9999px",
                    fontWeight: "600",
                    fontSize: "13px",
                    padding: "8px 20px",
                    boxShadow: "0 4px 10px rgba(124, 58, 237, 0.25)",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif"
                  }}
                  className="hover:scale-[1.03] active:scale-95 duration-200 transition-all text-center whitespace-nowrap"
                >
                  Darul Hikmah Library
                </button>
                
                <button
                  onClick={() => setActiveTab("showcase")}
                  style={{
                    backgroundColor: "transparent",
                    color: "#8B5CF6",
                    border: "1px solid #7C3AED",
                    borderRadius: "9999px",
                    fontWeight: "600",
                    fontSize: "13px",
                    padding: "8px 20px",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif"
                  }}
                  className="hover:bg-white/5 hover:scale-[1.03] active:scale-95 duration-200 transition-all text-center whitespace-nowrap"
                >
                  Al-Misbah Club
                </button>
              </div>

            </div>
          </div>
        </div>
      </header>

      <main className="relative">
        {activeTab === "catalog" && (
          <>
            {/* 3. HERO SECTION (MAC-STYLE INTRO) */}
            <section
              id="hero"
              className="max-w-7xl mx-auto px-6 pt-16 pb-20 text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2
                  className={`text-5xl md:text-[90px] font-bold tracking-[-0.04em] leading-[1.05] mb-8 ${isDarkMode ? "text-white" : "text-black"}`}
                >
                  Darul Hikmah Library.
                  <br />
                  <span className="text-zinc-400">
                    Pintu Pengetahuan Tanpa Batas.
                  </span>
                </h2>
                <p className="max-w-2xl mx-auto text-xl md:text-2xl text-zinc-500 font-medium mb-12 leading-relaxed">
                  Platform manajemen literasi premium untuk riset, jurnal, dan
                  majalah digital eksklusif Al-Misbah Education.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5 relative z-20">
                  <button
                    type="button"
                    id="btn-mulai-menjelajah"
                    onClick={(e) => {
                      e.preventDefault();
                      handleStartExploring();
                    }}
                    aria-label="Mulai Menjelajah Katalog Digital"
                    className={`w-full sm:w-auto px-10 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 group shadow-xl cursor-pointer hover:scale-105 active:scale-95 duration-200 select-none ${
                      isDarkMode
                        ? "bg-white text-black hover:bg-zinc-200 shadow-white/5"
                        : "bg-black text-white hover:bg-zinc-800 shadow-zinc-400/20"
                    }`}
                  >
                    <span>Mulai Menjelajah</span>
                    <ChevronRight
                      size={20}
                      className="group-hover:translate-x-1.5 transition-transform"
                    />
                  </button>
                  <button
                    type="button"
                    id="btn-pelajari-lebih-lanjut"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsAboutModalOpen(true);
                    }}
                    aria-label="Pelajari Lebih Lanjut tentang Perpustakaan"
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 font-bold text-lg hover:underline group cursor-pointer active:scale-95 transition-all py-3.5 px-6 rounded-full duration-200 select-none ${
                      isDarkMode
                        ? "text-white hover:bg-white/10 hover:text-white"
                        : "text-black hover:bg-black/5 hover:text-black"
                    }`}
                    style={{
                      cursor: "pointer",
                      color: isDarkMode ? "#FFFFFF" : "#000000",
                    }}
                  >
                    <span>Pelajari Lebih Lanjut</span>
                    <ChevronRight
                      size={18}
                      className="group-hover:translate-x-1.5 transition-transform"
                    />
                  </button>
                </div>
              </motion.div>
            </section>

            {/* 3.1. INTERACTIVE WISDOM QUOTES & REALTIME STATS BAR */}
            <section className="max-w-7xl mx-auto px-6 mb-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Quote of the Day Widget */}
              <div
                className={`col-span-1 md:col-span-2 rounded-[32px] p-8 md:p-10 border relative overflow-hidden flex flex-col justify-between group transition-all duration-500 hover:shadow-xl ${
                  isDarkMode
                    ? "bg-zinc-900 border-zinc-800"
                    : "bg-white border-zinc-100 shadow-sm shadow-zinc-200/50"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#E5C158]">
                      Mutiara Hikmah
                    </span>
                    <Quote className="text-zinc-300 dark:text-zinc-700 w-8 h-8 opacity-60" />
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeQuoteIndex}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-3"
                    >
                      <p className="font-display font-medium text-lg md:text-xl lg:text-2xl leading-relaxed italic select-none">
                        "{QUOTES[activeQuoteIndex].text}"
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-0.5 bg-[#E5C158]"></span>
                        <p className="text-xs font-bold font-tagline text-zinc-400">
                          {QUOTES[activeQuoteIndex].source}
                        </p>
                        <span className="bg-zinc-100 dark:bg-zinc-800 text-[9px] font-black text-zinc-500 uppercase px-2 py-0.5 rounded ml-2">
                          {QUOTES[activeQuoteIndex].tag}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 font-semibold font-mono">
                    Inspirasi {activeQuoteIndex + 1} dari {QUOTES.length}
                  </span>
                  <button
                    onClick={() =>
                      setActiveQuoteIndex((prev) => (prev + 1) % QUOTES.length)
                    }
                    className={`text-xs font-bold uppercase tracking-wider py-2 px-4 rounded-full border transition-all active:scale-95 ${
                      isDarkMode
                        ? "border-zinc-800 hover:bg-zinc-800 text-white animate-pulse"
                        : "border-zinc-200 hover:bg-zinc-50 text-black"
                    }`}
                  >
                    Inspirasi Selanjutnya
                  </button>
                </div>
              </div>

              {/* Quick Realtime Stats Widget */}
              <div
                className={`col-span-1 rounded-[32px] p-8 md:p-10 border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isDarkMode
                    ? "bg-zinc-900 border-zinc-800"
                    : "bg-white border-zinc-100 shadow-sm shadow-zinc-200/50"
                }`}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-400">
                      Statistik Belajar Anda
                    </span>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-3xl font-display font-black text-black dark:text-white tracking-widest">
                        {books.length}
                      </p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Katalog Buku
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-display font-black text-[#E5C158] tracking-widest">
                        {bookmarks.length}
                      </p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Tersimpan
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                    <p className="text-xs text-zinc-400 font-semibold leading-relaxed">
                      Gunakan katalog digital untuk menyimpan bahan bacaan riset
                      atau membaca langsung di perangkat Anda secara instan.
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <a
                    href="#catalog"
                    className="text-xs font-bold tracking-widest uppercase hover:underline flex items-center gap-1"
                  >
                    Buka Pustaka <ChevronRight size={14} />
                  </a>
                </div>
              </div>
            </section>

            {/* 3.2. AL-MISBAH AI SCHOLAR CALLOUT (FLOATING CHAT TRIGGER) */}
            <section
              id="ai-scholar"
              className="max-w-7xl mx-auto px-6 py-6 scroll-mt-24"
            >
              <div
                className={`rounded-[32px] p-6 md:p-8 border relative overflow-hidden transition-all duration-300 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-[#12101C] via-[#1A152E] to-[#12101C] border-zinc-800"
                    : "bg-gradient-to-r from-amber-50/40 via-white to-amber-50/30 border-zinc-200/80"
                }`}
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="w-14 h-14 rounded-full bg-zinc-950 border-2 border-[#C9A23B]/60 p-1 flex items-center justify-center shrink-0 shadow-lg">
                    <img
                      src="/assets/aistudio/LOGO_AL_HIKMAH_e5f152fe.png"
                      alt="Logo Darul Hikmah"
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h4 className="font-bold text-base md:text-lg">Diskusi Riset Terbimbing AI</h4>
                      <span className="text-[10px] font-bold text-[#E5C158] bg-[#E5C158]/10 px-2.5 py-0.5 rounded-full border border-[#E5C158]/30 uppercase tracking-wider font-sans">
                        SYAMILA ASSISTANT
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl leading-relaxed">
                      Asisten cerdas terintegrasi khazanah Maktabah Syamilah 4 untuk menelaah matan hadits, tafsir, dan metodologi riset santri. Klik ikon chat mengambang di pojok kanan bawah atau tombol di samping.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAiChatOpen(true)}
                  className="shrink-0 px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2 cursor-pointer select-none"
                >
                  <Sparkles size={14} className="text-[#E5C158] animate-pulse" />
                  <span>Mulai Diskusi AI</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </section>

            {/* 4. INTERAKTIF UPLOAD & MANAGEMENT (FITUR INTI) */}
            <section id="management" className="max-w-6xl mx-auto px-6 py-20">
              <div
                className={`rounded-[48px] p-8 md:p-16 shadow-2xl transition-all border flex flex-col lg:flex-row gap-16 relative overflow-hidden ${
                  isDarkMode
                    ? "bg-zinc-900 border-zinc-800 shadow-black"
                    : "bg-white border-zinc-100 shadow-zinc-200/50"
                }`}
              >
                <div
                  className={`absolute top-0 right-0 w-[500px] h-[500px] blur-[100px] -z-10 rounded-full translate-x-1/2 -translate-y-1/2 ${
                    isDarkMode ? "bg-zinc-800/10" : "bg-zinc-100/30"
                  }`}
                ></div>

                {/* Form Column */}
                <div className="flex-1 space-y-10">
                  <div className="space-y-4">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest inline-block ${
                        isDarkMode
                          ? "bg-zinc-850 text-zinc-300 border border-zinc-700"
                          : "bg-zinc-100 text-zinc-800 border border-zinc-200"
                      }`}
                    >
                      Arsip Digital
                    </span>
                    <h3
                      className={`text-3xl md:text-4xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-black"}`}
                    >
                      Manajemen Katalog Baru
                    </h3>
                    <p className="text-zinc-500 font-medium">
                      Lengkapi metadata literasi untuk integrasi ke perpustakaan
                      Darul Hikmah.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">
                          Judul Literatur
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Jurnal Fiqih Modern"
                          className={`w-full border border-transparent rounded-[24px] px-6 py-4 font-medium focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/10 dark:focus:ring-white/10 transition-all outline-none ${
                            isDarkMode
                              ? "bg-zinc-800 text-white placeholder:text-zinc-600"
                              : "bg-[#F2F2F7] text-zinc-800"
                          }`}
                          value={newBook.title}
                          onChange={(e) =>
                            setNewBook((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">
                          Penulis / Institusi
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Nama lengkap penulis..."
                          className={`w-full border border-transparent rounded-[24px] px-6 py-4 font-medium focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/10 dark:focus:ring-white/10 transition-all outline-none ${
                            isDarkMode
                              ? "bg-zinc-800 text-white placeholder:text-zinc-600"
                              : "bg-[#F2F2F7] text-zinc-800"
                          }`}
                          value={newBook.author}
                          onChange={(e) =>
                            setNewBook((prev) => ({
                              ...prev,
                              author: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3 text-white">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">
                          Kategori Utama
                        </label>
                        <div className="relative">
                          <select
                            className={`w-full border border-transparent rounded-[24px] px-6 py-4 font-medium appearance-none focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/10 dark:focus:ring-white/10 transition-all outline-none cursor-pointer ${
                              isDarkMode
                                ? "bg-zinc-800 text-white"
                                : "bg-[#F2F2F7] text-zinc-800"
                            }`}
                            value={newBook.category}
                            onChange={(e) =>
                              setNewBook((prev) => ({
                                ...prev,
                                category: e.target.value as any,
                              }))
                            }
                          >
                            <option value="Research">
                              Research & Analysis
                            </option>
                            <option value="Magazine">Monthly Magazine</option>
                            <option value="Innovation">
                              Education Innovation
                            </option>
                            <option value="General">General Literatures</option>
                          </select>
                          <ChevronDown
                            size={18}
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">
                          Deskripsi & Abstrak
                        </label>
                        <textarea
                          required
                          placeholder="Ringkasan singkat isi buku atau jurnal ini..."
                          rows={1}
                          className={`w-full border border-transparent rounded-[24px] px-6 py-4 font-medium focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/10 dark:focus:ring-white/10 transition-all outline-none resize-none overflow-hidden ${
                            isDarkMode
                              ? "bg-zinc-800 text-white placeholder:text-zinc-600"
                              : "bg-[#F2F2F7] text-zinc-800"
                          }`}
                          value={newBook.description}
                          onChange={(e) =>
                            setNewBook((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isUploading}
                        className={`w-full py-5 rounded-[24px] font-bold text-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
                          uploadSuccess
                            ? "bg-black dark:bg-white text-white dark:text-black shadow-xl shadow-black/15"
                            : "bg-black hover:bg-zinc-900 dark:bg-white dark:hover:bg-zinc-100 dark:text-black text-white shadow-xl shadow-black/15"
                        }`}
                      >
                        {isUploading ? (
                          <div className="w-6 h-6 border-3 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : uploadSuccess ? (
                          <>
                            {" "}
                            <Check size={22} /> Tersimpan ke Server{" "}
                          </>
                        ) : (
                          <>
                            {" "}
                            <Plus size={22} /> Simpan ke Perpustakaan{" "}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Upload Column */}
                <div className="lg:w-80 shrink-0">
                  <div className="space-y-3 mb-6">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">
                      Visual Cover (Foto / Dokumen PDF, EPUB)
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          processUploadedFile(file);
                        }
                      }}
                      className={`relative aspect-[3/4.2] rounded-[32px] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center group overflow-hidden ${
                        isDragging
                          ? "border-[#E5C158] bg-[#E5C158]/5 scale-[1.01]"
                          : newBook.coverImage
                            ? "border-transparent"
                            : isDarkMode
                              ? "border-zinc-700 hover:border-white bg-zinc-800/50"
                              : "border-zinc-200 hover:border-black bg-zinc-50"
                      }`}
                    >
                      {newBook.coverImage ? (
                        <img
                          src={newBook.coverImage}
                          alt="Preview"
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                      ) : (
                        <div className="text-center p-6 space-y-4">
                          <div
                            className={`w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center mx-auto transition-colors ${
                              isDragging
                                ? "bg-[#E5C158] text-black scale-110"
                                : isDarkMode
                                  ? "bg-zinc-700 text-zinc-400 group-hover:text-white"
                                  : "bg-white text-zinc-350 group-hover:text-black"
                            }`}
                          >
                            <Upload size={28} />
                          </div>
                          <div className="space-y-1">
                            <p
                              className={`text-sm font-bold uppercase tracking-tight ${isDarkMode ? "text-zinc-200" : "text-black"}`}
                            >
                              Upload File
                            </p>
                            <p className="text-[10px] text-zinc-400 font-medium">
                              Klik, Drag & Drop Foto atau PDF/EPUB
                            </p>
                          </div>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*,application/pdf,application/epub+zip,.epub"
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Upload Error Alert Block */}
                  <AnimatePresence>
                    {uploadError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                        animate={{ opacity: 1, height: "auto", scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        className="border border-red-500/20 bg-red-500/5 dark:bg-red-950/20 rounded-2xl p-4 flex gap-3 relative mb-4 items-start"
                      >
                        <AlertTriangle
                          size={16}
                          className="text-red-500 shrink-0 mt-0.5"
                        />
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                            Kesalahan Unggah
                          </p>
                          <p className="text-xs leading-relaxed text-red-600 dark:text-red-400 font-sans">
                            {uploadError}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadError(null);
                          }}
                          className="text-red-400 hover:text-red-600 dark:hover:text-red-200 transition-colors absolute top-3.5 right-3.5"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {newBook.fileName && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`border p-4 rounded-2xl flex items-center gap-3 ${
                        isDarkMode
                          ? "bg-zinc-800/50 border-zinc-700"
                          : "bg-zinc-50 border-zinc-250"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${
                          isDarkMode
                            ? "bg-zinc-800 text-zinc-300"
                            : "bg-white text-zinc-800"
                        }`}
                      >
                        <BookOpen size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}
                        >
                          File Terpilih
                        </p>
                        <p
                          className={`text-xs font-bold truncate ${isDarkMode ? "text-zinc-200" : "text-zinc-800"}`}
                        >
                          {newBook.fileName}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </section>

            {/* 5. KATALOG BUKU & JURNAL (PRODUCT GRID STYLE) */}
            <section id="catalog" className="max-w-7xl mx-auto px-6 py-24">
              <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-8">
                <div className="space-y-3">
                  <h3
                    className={`text-4xl md:text-6xl font-bold tracking-tighter ${isDarkMode ? "text-white" : "text-black"}`}
                  >
                    Katalog Digital.
                  </h3>
                  <p className="text-lg md:text-xl text-zinc-500 max-w-xl font-medium">
                    Temukan riset mendalam dan publikasi terbaru dari Ministry
                    Research & Library Al-Misbah Education.
                  </p>
                </div>

                {/* Category Filter */}
                <div
                  className={`flex items-center gap-2 p-1.5 rounded-full border ${
                    isDarkMode
                      ? "bg-zinc-900/50 border-zinc-800"
                      : "bg-white/50 border-zinc-200"
                  } backdrop-blur`}
                >
                  {[
                    "Semua",
                    "Research",
                    "Magazine",
                    "Innovation",
                    "General",
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                        selectedCategory === cat
                          ? isDarkMode
                            ? "bg-white text-black"
                            : "bg-black text-white"
                          : "text-zinc-400 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar & View Mode Toggle Row */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 mb-16">
                <div className="flex-1 max-w-3xl flex items-center gap-3">
                  <div
                    className={`flex-1 flex items-center gap-4 px-6 py-4 rounded-[24px] border transition-all ${
                      isDarkMode
                        ? "bg-zinc-800 border-zinc-700 focus-within:border-[#E5C158]/60 focus-within:ring-4 focus-within:ring-[#E5C158]/5"
                        : "bg-white border-zinc-150 shadow-sm focus-within:border-[#E5C158]/60 focus-within:shadow-xl"
                    }`}
                  >
                    <Search className="text-zinc-400 shrink-0" size={20} />
                    <input
                      type="text"
                      placeholder="Cari berdasarkan judul atau penulis..."
                      className={`bg-transparent border-none outline-none w-full font-medium ${isDarkMode ? "text-white" : "text-black"}`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setIsAdvancedSearchOpen(!isAdvancedSearchOpen)
                    }
                    className={`flex items-center justify-center gap-2 px-5 py-4 rounded-[24px] border text-xs font-black uppercase tracking-wider transition-all cursor-pointer h-[58px] shrink-0 ${
                      isAdvancedSearchOpen
                        ? "bg-[#E5C158] text-black border-[#E5C158]"
                        : isDarkMode
                          ? "bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white"
                          : "bg-white border-zinc-200 text-zinc-500 hover:text-black shadow-sm"
                    }`}
                    title="Pencarian Lanjutan"
                  >
                    <SlidersHorizontal size={16} />
                    <span className="hidden md:inline">Filter Lanjutan</span>
                  </button>
                </div>

                {/* Grid / Table Toggle Buttons */}
                <div
                  className={`flex items-center gap-1.5 p-1 rounded-2xl border shrink-0 self-start md:self-auto ${
                    isDarkMode
                      ? "bg-zinc-900/40 border-zinc-800"
                      : "bg-[#E5E5EA]/40 border-zinc-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      viewMode === "grid"
                        ? isDarkMode
                          ? "bg-zinc-800 text-white shadow-md shadow-black/20"
                          : "bg-white text-black shadow-md shadow-zinc-200/50"
                        : "text-zinc-400 hover:text-black dark:hover:text-white"
                    }`}
                    title="Tampilan Grid"
                  >
                    <LayoutGrid size={14} />
                    <span>Grid</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      viewMode === "table"
                        ? isDarkMode
                          ? "bg-zinc-805 text-white shadow-md shadow-black/20"
                          : "bg-white text-black shadow-md shadow-zinc-200/50"
                        : "text-zinc-400 hover:text-black dark:hover:text-white"
                    }`}
                    title="Tampilan Tabel"
                  >
                    <Table size={14} />
                    <span>Tabel</span>
                  </button>
                </div>
              </div>

              {/* Advanced Search Panel */}
              <AnimatePresence>
                {isAdvancedSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 48 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={`p-6 md:p-8 rounded-[32px] border transition-all ${
                        isDarkMode
                          ? "bg-zinc-900/60 border-zinc-800"
                          : "bg-white border-zinc-150 shadow-md shadow-zinc-100/50"
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                        {/* 1. Sort Options */}
                        <div className="space-y-3">
                          <label
                            className={`text-[10px] font-black uppercase tracking-widest block ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}
                          >
                            Urutkan Berdasarkan
                          </label>
                          <div className="relative">
                            <select
                              value={sortBy}
                              onChange={(e) => setSortBy(e.target.value as any)}
                              className={`w-full rounded-xl border px-4 py-3.5 text-xs font-bold outline-none appearance-none cursor-pointer ${
                                isDarkMode
                                  ? "bg-zinc-805 border-zinc-700 text-zinc-200 focus:border-[#E5C158]"
                                  : "bg-zinc-50 border-zinc-200 text-zinc-808 focus:border-[#E5C158]"
                              }`}
                            >
                              <option value="newest">
                                Terbaru Ditambahkan
                              </option>
                              <option value="oldest">
                                Terlama Ditambahkan
                              </option>
                              <option value="title-asc">Judul (A - Z)</option>
                              <option value="title-desc">Judul (Z - A)</option>
                            </select>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                              <ArrowUpDown size={14} />
                            </span>
                          </div>
                        </div>

                        {/* 2. Time Filter */}
                        <div className="space-y-3">
                          <label
                            className={`text-[10px] font-black uppercase tracking-widest block ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}
                          >
                            Waktu Ditambahkan
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {(
                              [
                                { value: "all", label: "Semua" },
                                { value: "today", label: "Hari Ini" },
                                { value: "week", label: "7 Hari" },
                                { value: "month", label: "30 Hari" },
                              ] as const
                            ).map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => setTimeFilter(opt.value)}
                                className={`px-3.5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                                  timeFilter === opt.value
                                    ? "bg-[#E5C158] text-black shadow-sm"
                                    : isDarkMode
                                      ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                                      : "bg-zinc-100 hover:bg-zinc-150 text-zinc-650"
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 3. Scope Box Toggles */}
                        <div className="space-y-4 md:col-span-2 flex flex-col justify-end md:h-full pb-1">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Toggle 3A. Search in description */}
                            <label
                              className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer select-none transition-all ${
                                searchInDescription
                                  ? isDarkMode
                                    ? "border-[#E5C158]/55 bg-[#E5C158]/5"
                                    : "border-[#E5C158]/55 bg-[#E5C158]/5"
                                  : isDarkMode
                                    ? "border-zinc-800 bg-zinc-800/20 hover:bg-zinc-800/40"
                                    : "border-zinc-150 bg-zinc-50/50 hover:bg-[#E5E5EA]/40"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={searchInDescription}
                                onChange={(e) =>
                                  setSearchInDescription(e.target.checked)
                                }
                                className="sr-only"
                              />
                              <div
                                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                  searchInDescription
                                    ? "bg-[#E5C158] border-[#E5C158] text-black"
                                    : "border-zinc-400"
                                }`}
                              >
                                {searchInDescription && (
                                  <Check size={12} strokeWidth={4} />
                                )}
                              </div>
                              <span
                                className={`text-xs font-bold ${isDarkMode ? "text-zinc-200" : "text-zinc-750"}`}
                              >
                                Pencarian di Deskripsi
                              </span>
                            </label>

                            {/* Toggle 3B. Bookmarks Only */}
                            <label
                              className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer select-none transition-all ${
                                showOnlyBookmarked
                                  ? isDarkMode
                                    ? "border-[#E5C158]/55 bg-[#E5C158]/5"
                                    : "border-[#E5C158]/55 bg-[#E5C158]/5"
                                  : isDarkMode
                                    ? "border-zinc-800 bg-zinc-800/20 hover:bg-zinc-800/40"
                                    : "border-zinc-150 bg-zinc-50/50 hover:bg-[#E5E5EA]/40"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={showOnlyBookmarked}
                                onChange={(e) =>
                                  setShowOnlyBookmarked(e.target.checked)
                                }
                                className="sr-only"
                              />
                              <div
                                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                  showOnlyBookmarked
                                    ? "bg-[#E5C158] border-[#E5C158] text-black"
                                    : "border-zinc-400"
                                }`}
                              >
                                {showOnlyBookmarked && (
                                  <Check size={12} strokeWidth={4} />
                                )}
                              </div>
                              <span
                                className={`text-xs font-bold ${isDarkMode ? "text-zinc-200" : "text-zinc-750"}`}
                              >
                                Ditandai Saja (Bookmarks)
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Active Filters Summary & Reset Row */}
                      {(searchInDescription ||
                        showOnlyBookmarked ||
                        timeFilter !== "all" ||
                        sortBy !== "newest") && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-6 border-t border-dashed border-zinc-200 dark:border-zinc-800">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#E5C158]">
                              Filter Aktif:
                            </span>
                            {searchInDescription && (
                              <span
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${isDarkMode ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-650"}`}
                              >
                                Deskripsi
                              </span>
                            )}
                            {showOnlyBookmarked && (
                              <span
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${isDarkMode ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-650"}`}
                              >
                                Bookmarked
                              </span>
                            )}
                            {timeFilter !== "all" && (
                              <span
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${isDarkMode ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-650"}`}
                              >
                                Waktu:{" "}
                                {timeFilter === "today"
                                  ? "Hari Ini"
                                  : timeFilter === "week"
                                    ? "7 Hari"
                                    : "30 Hari"}
                              </span>
                            )}
                            {sortBy !== "newest" && (
                              <span
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${isDarkMode ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-650"}`}
                              >
                                Urutan:{" "}
                                {sortBy === "oldest"
                                  ? "Terlama"
                                  : sortBy === "title-asc"
                                    ? "A-Z"
                                    : "Z-A"}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSearchInDescription(false);
                              setShowOnlyBookmarked(false);
                              setTimeFilter("all");
                              setSortBy("newest");
                            }}
                            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-red-500 hover:text-red-700 transition-colors self-start sm:self-auto cursor-pointer"
                          >
                            <RefreshCw size={11} />
                            Reset Filter Lanjutan
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  <AnimatePresence mode="popLayout">
                    {filteredBooks.map((book) => (
                      <motion.div
                        layout
                        key={book.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="group relative"
                      >
                        <div
                          className={`rounded-[32px] overflow-hidden transition-all duration-700 border flex flex-col h-full transform hover:-translate-y-1 ${
                            isDarkMode
                              ? "bg-zinc-900 border-zinc-800 shadow-black"
                              : "bg-white border-zinc-100 shadow-sm hover:shadow-2xl hover:shadow-zinc-300/40"
                          }`}
                        >
                          <div className="aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Floating Bookmark Button */}
                            <button
                              onClick={(e) => toggleBookmark(book.id, e)}
                              className={`absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition-all active:scale-90 z-20 ${
                                bookmarks.includes(book.id)
                                  ? "bg-[#E5C158] text-black scale-105"
                                  : "bg-black/40 hover:bg-black/60 text-white hover:scale-105"
                              }`}
                              title={
                                bookmarks.includes(book.id)
                                  ? "Hapus dari penanda"
                                  : "Tandai Buku"
                              }
                            >
                              <Bookmark
                                size={16}
                                fill={
                                  bookmarks.includes(book.id) ? "black" : "none"
                                }
                                className="transition-transform duration-300"
                              />
                            </button>
                            {/* Quick Focus Reader badge on cover overlay */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFocusReaderBook(book);
                                setFocusReaderPage(1);
                              }}
                              className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/80 hover:bg-black backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase border border-white/20 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 shadow-xl hover:scale-105 cursor-pointer z-20"
                              title="Buka Mode Focus Reader"
                            >
                              <Eye size={12} className="text-[#E5C158]" /> Focus Reader
                            </button>
                          </div>
                          <div className="p-8 space-y-4 flex-1 flex flex-col">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold text-black dark:text-zinc-300 uppercase tracking-[0.2em]">
                                {book.category}
                              </span>
                              {Date.now() - book.createdAt < 86400000 && (
                                <span className="bg-[#E5C158] text-black px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                                  Baru
                                </span>
                              )}
                            </div>
                            <h4
                              className={`text-xl font-bold tracking-tight line-clamp-2 leading-tight flex-1 ${isDarkMode ? "text-white" : "text-black"}`}
                            >
                              {book.title}
                            </h4>
                            <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center p-1 ${isDarkMode ? "bg-zinc-800" : "bg-zinc-100"}`}
                              >
                                <GraduationCap size={12} />
                              </div>
                              {book.author}
                            </div>

                            {/* Visual Progress Bar per Book */}
                            <div className="space-y-1.5 pt-1">
                              <div className="flex justify-between text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                                <span>Kemajuan Membaca</span>
                                <span>{readingProgress[book.id] || 0}%</span>
                              </div>
                              <div className="w-full h-1 bg-zinc-250 dark:bg-zinc-950 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#E5C158] transition-all duration-300"
                                  style={{ width: `${readingProgress[book.id] || 0}%` }}
                                />
                              </div>
                            </div>

                            <div className="pt-4 flex flex-col gap-2.5">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => {
                                    setActiveReaderBook(book);
                                    setReaderPage(1);
                                    setReaderTab("abstract");
                                  }}
                                  className={`flex-1 px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all hover:scale-102 active:scale-98 ${
                                    isDarkMode
                                      ? "bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/5"
                                      : "bg-black text-white hover:bg-zinc-800 shadow-lg shadow-black/10"
                                  }`}
                                >
                                  Baca Sekarang
                                </button>
                                <button
                                  className={`p-3 rounded-2xl border transition-all hover:scale-105 ${
                                    isDarkMode
                                      ? "border-zinc-800 hover:bg-zinc-800 text-zinc-500 hover:text-white"
                                      : "border-zinc-200 hover:bg-zinc-50 text-zinc-400 hover:text-black"
                                  }`}
                                  title="Unduh PDF"
                                >
                                  <Download size={16} />
                                </button>
                              </div>

                              {/* Dedicated Focus Reader Button on each book card */}
                              <button
                                type="button"
                                onClick={() => {
                                  setFocusReaderBook(book);
                                  setFocusReaderPage(1);
                                }}
                                className={`w-full py-2.5 px-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 border transition-all cursor-pointer hover:scale-101 active:scale-98 shadow-sm ${
                                  isDarkMode
                                    ? "bg-zinc-800/90 hover:bg-zinc-800 border-zinc-700/80 text-zinc-200 hover:border-[#E5C158] hover:text-[#E5C158]"
                                    : "bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-700 hover:border-[#E5C158] hover:text-[#B45309]"
                                }`}
                                title="Buka Mode Baca Tanpa Gangguan (Focus Reader)"
                              >
                                <Eye size={14} className="text-[#E5C158]" />
                                <span>Focus Reader</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {filteredBooks.length === 0 && (
                    <div className="col-span-full py-20 text-center space-y-4">
                      <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-300">
                        <Search size={40} />
                      </div>
                      <div>
                        <h4
                          className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-black"}`}
                        >
                          Tidak Ada Hasil
                        </h4>
                        <p className="text-zinc-500 font-medium">
                          Maaf, kami tidak menemukan literasi sesuai kriteria
                          Anda.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={`overflow-x-auto rounded-[32px] border transition-all ${
                    isDarkMode
                      ? "bg-zinc-900 border-zinc-850"
                      : "bg-white border-[#F2F2F7] shadow-sm shadow-zinc-200/40"
                  }`}
                >
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr
                        className={`border-b text-[10px] font-black uppercase tracking-widest ${
                          isDarkMode
                            ? "border-zinc-800 text-zinc-400 bg-zinc-950/25"
                            : "border-zinc-150 text-zinc-500 bg-zinc-50/50"
                        }`}
                      >
                        <th className="py-4 px-6 w-12 text-center">No</th>
                        <th className="py-4 px-4 w-16">Sampul</th>
                        <th className="py-4 px-6">Judul &amp; Penulis</th>
                        <th className="py-4 px-6 w-36">Kategori</th>
                        <th className="py-4 px-6 w-44">Nama File</th>
                        <th className="py-4 px-6 w-24 text-center">Status</th>
                        <th className="py-4 px-6 w-[280px] text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBooks.map((book, bIdx) => (
                        <tr
                          key={book.id}
                          className={`border-b last:border-0 hover:bg-[#E5C158]/5 transition-all group ${
                            isDarkMode
                              ? "border-zinc-805/60"
                              : "border-zinc-100"
                          }`}
                        >
                          <td className="py-4 px-6 text-center font-mono text-xs text-zinc-400 font-bold">
                            {String(bIdx + 1).padStart(2, "0")}
                          </td>
                          <td className="py-4 px-4">
                            <div className="w-10 h-14 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 relative shadow-sm">
                              <img
                                src={
                                  book.coverImage ||
                                  "https://placehold.co/100x140?text=Book"
                                }
                                alt={book.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              <h4
                                className={`text-sm font-bold tracking-tight line-clamp-1 ${isDarkMode ? "text-zinc-100" : "text-zinc-905"}`}
                              >
                                {book.title}
                              </h4>
                              <p className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5">
                                <GraduationCap
                                  size={13}
                                  className="text-[#E5C158]"
                                />{" "}
                                {book.author}
                              </p>
                              {/* Table row reading progress bar */}
                              <div className="flex items-center gap-2 pt-0.5">
                                <div className="w-16 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#E5C158]"
                                    style={{ width: `${readingProgress[book.id] || 0}%` }}
                                  />
                                </div>
                                <span className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400">
                                  {readingProgress[book.id] || 0}%
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-block text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                isDarkMode
                                  ? "bg-zinc-800 text-zinc-300"
                                  : "bg-zinc-100/80 text-zinc-600"
                              }`}
                            >
                              {book.category}
                            </span>
                          </td>
                          <td
                            className="py-4 px-6 font-mono text-xs text-zinc-400 dark:text-zinc-400 font-semibold truncate max-w-[150px]"
                            title={book.fileName}
                          >
                            {book.fileName}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {Date.now() - book.createdAt < 86400000 ? (
                              <span className="bg-[#E5C158] text-black px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                                Baru
                              </span>
                            ) : (
                              <span className="text-zinc-400 text-[10px] font-bold">
                                -
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2.5">
                              <button
                                onClick={(e) => toggleBookmark(book.id, e)}
                                className={`p-2 rounded-full border transition-all cursor-pointer ${
                                  bookmarks.includes(book.id)
                                    ? "bg-[#E5C158] border-[#E5C158] text-black shadow"
                                    : isDarkMode
                                      ? "border-zinc-800 text-zinc-500 hover:text-white"
                                      : "border-zinc-200 text-zinc-400 hover:text-black"
                                }`}
                                title="Tandai"
                              >
                                <Bookmark
                                  size={13}
                                  fill={
                                    bookmarks.includes(book.id)
                                      ? "currentColor"
                                      : "none"
                                  }
                                />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setFocusReaderBook(book);
                                  setFocusReaderPage(1);
                                }}
                                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer hover:scale-102 active:scale-98 flex items-center gap-1.5 border ${
                                  isDarkMode
                                    ? "bg-zinc-800/80 hover:bg-zinc-800 border-zinc-700 text-zinc-200 hover:border-[#E5C158] hover:text-[#E5C158]"
                                    : "bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-700 hover:border-[#E5C158]"
                                }`}
                                title="Buka Mode Focus Reader"
                              >
                                <Eye size={12} className="text-[#E5C158]" /> Focus Reader
                              </button>
                              <button
                                onClick={() => {
                                  setActiveReaderBook(book);
                                  setReaderPage(1);
                                  setReaderTab("abstract");
                                }}
                                className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer hover:scale-102 active:scale-98 flex items-center gap-1 ${
                                  isDarkMode
                                    ? "bg-white text-black hover:bg-zinc-200 shadow-sm"
                                    : "bg-black text-white hover:bg-zinc-800 shadow-sm"
                                }`}
                              >
                                <BookOpen size={11} /> Baca
                              </button>
                              <button
                                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                  isDarkMode
                                    ? "border-zinc-800 text-zinc-500 hover:text-white"
                                    : "border-zinc-200 text-zinc-400 hover:text-black"
                                }`}
                                title="Download PDF"
                              >
                                <Download size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredBooks.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="py-20 text-center space-y-4"
                          >
                            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-400">
                              <Search size={32} />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold">
                                Tidak Ada Hasil
                              </h4>
                              <p className="text-zinc-500 font-semibold text-xs">
                                Maaf, kami tidak menemukan literasi sesuai
                                kriteria Anda.
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* 5B. BERITA & KEGIATAN TERBARU (NEWS & EVENTS) */}
            <section
              id="activities"
              className="max-w-7xl mx-auto px-6 py-24 border-t border-zinc-200/50 dark:border-zinc-800/50"
            >
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
                <div className="space-y-3">
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest inline-block ${
                      isDarkMode
                        ? "bg-zinc-800 text-zinc-300"
                        : "bg-zinc-200/60 text-zinc-700"
                    }`}
                  >
                    Kabar Pondok
                  </span>
                  <h3
                    className={`text-4xl md:text-5xl font-bold tracking-tighter ${isDarkMode ? "text-white" : "text-black"}`}
                  >
                    Berita &amp; Kegiatan Terbaru
                  </h3>
                  <p className="text-zinc-500 font-medium max-w-xl text-sm md:text-base">
                    Ikuti silsilah perkembangan akademik, kunjungan kehormatan,
                    dan peluncuran riset berkala di Darul Hikmah Library.
                  </p>
                </div>

                {/* CTA to Open Add Activity Modal */}
                <button
                  onClick={() => setIsActivityModalOpen(true)}
                  className="px-6 py-3.5 bg-black text-white dark:bg-white dark:text-black rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-98 transition-all shrink-0 flex items-center gap-2 shadow-lg"
                >
                  <Plus size={16} /> Tambah Kegiatan
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Lead Activity (Big Card on Left) */}
                {activities.length > 0 ? (
                  <div className="lg:col-span-7 space-y-6 group">
                    <div
                      className={`rounded-[32px] overflow-hidden border aspect-[16/10] bg-zinc-100 dark:bg-zinc-800 relative transition-all duration-700 ${
                        isDarkMode
                          ? "border-zinc-800 shadow-2xl shadow-black"
                          : "border-zinc-100 shadow-sm group-hover:shadow-xl group-hover:shadow-zinc-200/50"
                      }`}
                    >
                      <img
                        src={activities[0].imageUrl}
                        alt={activities[0].title}
                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                        onError={(e) =>
                          (e.currentTarget.src =
                            "https://placehold.co/800x500/18181b/ffffff?text=Al-Misbah+Media")
                        }
                      />
                      <div className="absolute top-6 left-6">
                        <span className="bg-black/80 backdrop-blur text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-white/10">
                          {activities[0].category}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-bold text-zinc-400 tracking-wider">
                        {activities[0].date}
                      </p>
                      <h4
                        className={`text-2xl md:text-3xl font-bold tracking-tight leading-tight group-hover:text-black dark:group-hover:text-white hover:underline transition-colors ${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        {activities[0].title}
                      </h4>
                      <p className="text-zinc-500 font-medium leading-relaxed text-sm md:text-base">
                        {activities[0].description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="lg:col-span-7 p-12 text-center text-zinc-400 font-medium">
                    {" "}
                    Belum ada berita utama{" "}
                  </div>
                )}

                {/* List of Other Activities (3 Items stacked vertically on Right) */}
                <div className="lg:col-span-5 space-y-8">
                  <h5 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] border-b border-zinc-200 dark:border-zinc-800 pb-3">
                    Katalog Kabar Lainnya
                  </h5>

                  <div className="space-y-6 divide-y divide-zinc-100 dark:divide-zinc-900">
                    {activities.slice(1, 4).map((act, index) => (
                      <div
                        key={act.id}
                        className={`pt-6 ${index === 0 ? "pt-0" : ""} flex gap-5 items-start group cursor-pointer`}
                      >
                        <div className="w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border dark:border-zinc-800 relative">
                          <img
                            src={act.imageUrl}
                            alt={act.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) =>
                              (e.currentTarget.src =
                                "https://placehold.co/200x200/18181b/ffffff?text=Al-Misbah")
                            }
                          />
                        </div>
                        <div className="space-y-1 my-auto">
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-extrabold text-black dark:text-zinc-300 uppercase tracking-wider">
                              {act.category}
                            </span>
                            <span className="text-[10px] font-bold text-zinc-400">
                              {act.date}
                            </span>
                          </div>
                          <h4
                            className={`text-sm md:text-base font-bold tracking-tight line-clamp-2 leading-snug group-hover:text-black dark:group-hover:text-white transition-colors ${
                              isDarkMode ? "text-zinc-100" : "text-zinc-900"
                            }`}
                          >
                            {act.title}
                          </h4>
                        </div>
                      </div>
                    ))}

                    {activities.length <= 1 && (
                      <div className="py-6 text-center text-zinc-400 text-sm font-medium">
                        Tidak ada rilis berita sekunder
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* 5C. GALERI FOTO (PHOTO GALLERY) */}
            <section
              id="gallery"
              className="max-w-7xl mx-auto px-6 py-24 border-t border-zinc-200/50 dark:border-zinc-800/50"
            >
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
                <div className="space-y-3">
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest inline-block ${
                      isDarkMode
                        ? "bg-zinc-800 text-zinc-300"
                        : "bg-zinc-200/60 text-zinc-700"
                    }`}
                  >
                    Dokumentasi Visual
                  </span>
                  <h3
                    className={`text-4xl md:text-5xl font-bold tracking-tighter ${isDarkMode ? "text-white" : "text-black"}`}
                  >
                    Galeri Foto Perpustakaan
                  </h3>
                  <p className="text-zinc-500 font-medium max-w-xl text-sm md:text-base">
                    Sorotan lensa dari ruang baca, majelis literasi, ruangan
                    koleksi klasik, dan interaksi intelektual di Darul Hikmah.
                  </p>
                </div>

                {/* CTA to Upload Gallery Photo */}
                <button
                  onClick={() => setIsGalleryModalOpen(true)}
                  className="px-6 py-3.5 bg-black text-white dark:bg-white dark:text-black rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-98 transition-all shrink-0 flex items-center gap-2 shadow-lg"
                >
                  <Plus size={16} /> Unggah Foto
                </button>
              </div>

              {/* Gallery 4-column responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {galleryItems.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => setLightboxIndex(index)}
                    className="group relative overflow-hidden rounded-[24px] border dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 cursor-pointer hover:shadow-lg transition-all duration-500 hover:-translate-y-1 block"
                  >
                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                        onError={(e) =>
                          (e.currentTarget.src =
                            "https://placehold.co/400x400/18181b/ffffff?text=Gallery+Moment")
                        }
                      />
                      {/* Hover Overlay with text */}
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                          <Eye size={14} />
                        </div>
                        <p className="text-[10px] font-black uppercase text-[#E5C158] tracking-widest mb-1">
                          Koleksi Visual
                        </p>
                        <h5 className="text-white text-base font-bold leading-tight tracking-tight">
                          {item.title}
                        </h5>
                        <p className="text-[10px] text-zinc-400 font-medium mt-1">
                          Klik untuk memperbesar
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === "ai-engine" && (
          <AiEngineView
            isDarkMode={isDarkMode}
            setActiveTab={setActiveTab}
            particles={particles}
            booksCount={books.length}
            bookmarksCount={bookmarks.length}
          />
        )}

        {activeTab === "dashboard" && (
          <MutiaraDashboardView
            booksCount={books.length}
            bookmarksCount={bookmarks.length}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "showcase" && (
          <BookSpineShowcaseView setActiveTab={setActiveTab} />
        )}
      </main>

      {/* 7. ACTIVITY UPLOADER MODAL (BLACK & WHITE DESIGN) */}
      <AnimatePresence>
        {isActivityModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 text-left"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full max-w-xl rounded-[32px] p-8 md:p-10 border shadow-2xl relative ${
                isDarkMode
                  ? "bg-zinc-900 border-zinc-800 text-white"
                  : "bg-white border-zinc-100 text-black"
              }`}
            >
              <button
                onClick={() => setIsActivityModalOpen(false)}
                className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${
                  isDarkMode
                    ? "hover:bg-zinc-800 text-zinc-400 hover:text-white"
                    : "hover:bg-zinc-100 text-zinc-500 hover:text-black"
                }`}
              >
                <X size={20} />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">
                    Form Data
                  </span>
                  <h4 className="text-2xl font-bold tracking-tight">
                    Tambah Berita / Kegiatan
                  </h4>
                  <p className="text-zinc-400 text-xs font-semibold mt-1">
                    Daftarkan rilis kegiatan ke dalam halaman berita utama.
                  </p>
                </div>

                <form onSubmit={handleActivitySubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                      Judul Kegiatan
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Kunjungan Studi Turats..."
                      className={`w-full border border-transparent rounded-2xl px-5 py-3.5 font-medium text-sm focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/10 dark:focus:ring-white/10 transition-all outline-none ${
                        isDarkMode
                          ? "bg-zinc-800 text-white placeholder:text-zinc-600"
                          : "bg-[#F2F2F7] text-zinc-800"
                      }`}
                      value={newActivity.title}
                      onChange={(e) =>
                        setNewActivity((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                        Kategori
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Kunjungan, Kajian..."
                        className={`w-full border border-transparent rounded-2xl px-5 py-3.5 font-medium text-sm focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/10 dark:focus:ring-white/10 transition-all outline-none ${
                          isDarkMode
                            ? "bg-zinc-800 text-white placeholder:text-zinc-600"
                            : "bg-[#F2F2F7] text-zinc-800"
                        }`}
                        value={newActivity.category}
                        onChange={(e) =>
                          setNewActivity((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                        Tanggal Kegiatan
                      </label>
                      <input
                        type="date"
                        required
                        className={`w-full border border-transparent rounded-2xl px-5 py-3.5 font-medium text-sm focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/10 dark:focus:ring-white/10 transition-all outline-none ${
                          isDarkMode
                            ? "bg-zinc-800 text-white"
                            : "bg-[#F2F2F7] text-zinc-800"
                        }`}
                        value={newActivity.date}
                        onChange={(e) =>
                          setNewActivity((prev) => ({
                            ...prev,
                            date: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                      Deskripsi Kegiatan
                    </label>
                    <textarea
                      required
                      placeholder="Tulis ringkasan singkat kegiatan ini..."
                      rows={3}
                      className={`w-full border border-transparent rounded-2xl px-5 py-3.5 font-medium text-sm focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/10 dark:focus:ring-white/10 transition-all outline-none resize-none ${
                        isDarkMode
                          ? "bg-zinc-800 text-white placeholder:text-zinc-600"
                          : "bg-[#F2F2F7] text-zinc-800"
                      }`}
                      value={newActivity.description}
                      onChange={(e) =>
                        setNewActivity((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Image Upload Area for Activity */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                      Foto Kegiatan
                    </label>
                    <div
                      onClick={() => activityImageInputRef.current?.click()}
                      className={`h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer group transition-all relative overflow-hidden ${
                        newActivity.imageUrl
                          ? "border-transparent"
                          : isDarkMode
                            ? "border-zinc-700 hover:border-white bg-zinc-800/50"
                            : "border-zinc-200 hover:border-black bg-zinc-50"
                      }`}
                    >
                      {newActivity.imageUrl ? (
                        <div className="flex items-center gap-3 w-full h-full px-5">
                          <img
                            src={newActivity.imageUrl}
                            alt="Thumbnail preview"
                            className="w-16 h-16 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-emerald-500">
                              Gambar berhasil dipilih
                            </p>
                            <p
                              className="text-[10px] text-zinc-400 truncate mt-0.5"
                              style={{ textOverflow: "ellipsis" }}
                            >
                              Ubah dengan klik area ini
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <Upload
                            size={20}
                            className="mx-auto text-zinc-400 group-hover:text-black dark:group-hover:text-white mb-1 transition-colors"
                          />
                          <p className="text-xs font-bold uppercase tracking-tight">
                            Pilih Berkas Foto
                          </p>
                          <p className="text-[9px] text-zinc-400 font-medium">
                            PNG, JPG, JPEG maksimal 5MB
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={activityImageInputRef}
                        onChange={handleActivityFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isActivityUploading}
                      className="w-full py-4 rounded-2xl bg-black hover:bg-zinc-900 dark:bg-white dark:hover:bg-zinc-100 dark:text-black text-white font-bold text-sm tracking-wide transition-all active:scale-98 shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                    >
                      {isActivityUploading ? (
                        <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Publikasikan Kegiatan"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 8. GALLERY UPLOADER MODAL (BLACK & WHITE DESIGN) */}
      <AnimatePresence>
        {isGalleryModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 text-left"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full max-w-lg rounded-[32px] p-8 border shadow-2xl relative ${
                isDarkMode
                  ? "bg-zinc-900 border-zinc-800 text-white"
                  : "bg-white border-zinc-100 text-black"
              }`}
            >
              <button
                onClick={() => setIsGalleryModalOpen(false)}
                className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${
                  isDarkMode
                    ? "hover:bg-zinc-800 text-zinc-400 hover:text-white"
                    : "hover:bg-zinc-100 text-zinc-500 hover:text-black"
                }`}
              >
                <X size={20} />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">
                    Koleksi Foto
                  </span>
                  <h4 className="text-2xl font-bold tracking-tight">
                    Unggah Foto Galeri
                  </h4>
                  <p className="text-zinc-400 text-xs font-semibold mt-1">
                    Tambahkan jepretan dokumentasi peradaban santri ke galeri
                    visual.
                  </p>
                </div>

                <form onSubmit={handleGallerySubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                      Keterangan / Judul Foto
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Suasana Ruang Belajar Mandiri..."
                      className={`w-full border border-transparent rounded-2xl px-5 py-3.5 font-medium text-sm focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/10 dark:focus:ring-white/10 transition-all outline-none ${
                        isDarkMode
                          ? "bg-zinc-800 text-white placeholder:text-zinc-600"
                          : "bg-[#F2F2F7] text-zinc-800"
                      }`}
                      value={newGallery.title}
                      onChange={(e) =>
                        setNewGallery((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Image Upload Area for Gallery */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                      Unggah Foto
                    </label>
                    <div
                      onClick={() => galleryImageInputRef.current?.click()}
                      className={`h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer group transition-all relative overflow-hidden ${
                        newGallery.imageUrl
                          ? "border-transparent"
                          : isDarkMode
                            ? "border-zinc-700 hover:border-white bg-zinc-800/50"
                            : "border-zinc-200 hover:border-black bg-zinc-50"
                      }`}
                    >
                      {newGallery.imageUrl ? (
                        <div className="relative w-full h-full">
                          <img
                            src={newGallery.imageUrl}
                            alt="Gallery preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-xs font-bold bg-black/60 px-3 py-1.5 rounded-full">
                              Klik untuk Mengubah
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <Upload
                            size={24}
                            className="mx-auto text-zinc-400 group-hover:text-black dark:group-hover:text-white mb-2 transition-colors"
                          />
                          <p className="text-xs font-bold uppercase tracking-tight">
                            Klip Berkas Gambar
                          </p>
                          <p className="text-[9px] text-zinc-400 font-medium">
                            PNG, JPG, JPEG maks 5MB
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={galleryImageInputRef}
                        onChange={handleGalleryFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isGalleryUploading}
                      className="w-full py-4 rounded-2xl bg-black hover:bg-zinc-900 dark:bg-white dark:hover:bg-zinc-100 dark:text-black text-white font-bold text-sm tracking-wide transition-all active:scale-98 shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                    >
                      {isGalleryUploading ? (
                        <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Tambahkan ke Galeri"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 9. PREMIUM INTERACTIVE READER MODAL */}
      <AnimatePresence>
        {activeReaderBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex items-center justify-center p-4 md:p-8 text-left"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full max-w-6xl h-[85vh] rounded-[36px] overflow-hidden border shadow-2xl flex flex-col md:flex-row ${
                isDarkMode
                  ? "bg-[#18181B] border-zinc-800 text-white"
                  : "bg-white border-zinc-100 text-black"
              }`}
            >
              {/* Left Column: Cover, Info & Meta */}
              <div
                className={`w-full md:w-80 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r shrink-0 lg:shrink-0 ${
                  isDarkMode
                    ? "bg-zinc-950/40 border-zinc-800"
                    : "bg-zinc-50 border-zinc-100"
                }`}
              >
                <div className="space-y-6">
                  {/* Category Tag */}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black tracking-[0.25em] text-[#E5C158] uppercase">
                      {activeReaderBook.category}
                    </span>
                    <button
                      onClick={(e) => toggleBookmark(activeReaderBook.id, e)}
                      className={`p-2 rounded-full transition-transform active:scale-90 ${
                        bookmarks.includes(activeReaderBook.id)
                          ? "bg-[#E5C158]/10 text-[#E5C158]"
                          : "text-zinc-550 hover:text-zinc-300"
                      }`}
                    >
                      <Bookmark
                        size={18}
                        fill={
                          bookmarks.includes(activeReaderBook.id)
                            ? "#E5C158"
                            : "none"
                        }
                      />
                    </button>
                  </div>

                  {/* Book Title */}
                  <h3 className="text-xl font-display font-bold leading-tight tracking-tight">
                    {activeReaderBook.title}
                  </h3>

                  {/* Author Name */}
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold">
                    <GraduationCap size={14} className="text-[#E5C158]" />
                    <span>{activeReaderBook.author}</span>
                  </div>

                  {/* Book Cover Image */}
                  <div className="aspect-[5/6] rounded-2xl overflow-hidden shadow-md max-w-[150px] mx-auto border dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-800">
                    <img
                      src={activeReaderBook.coverImage}
                      alt={activeReaderBook.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Progress bar info */}
                <div className="pt-6 border-t border-zinc-200/50 dark:border-zinc-800/50 space-y-2">
                  <div className="flex justify-between text-[11px] font-bold text-zinc-550 uppercase tracking-[0.1em]">
                    <span>Kemajuan Belajar</span>
                    <span>{readingProgress[activeReaderBook.id] || 0}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#E5C158] transition-all duration-300"
                      style={{ width: `${readingProgress[activeReaderBook.id] || 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                    <span>Halaman {readerPage} / 5</span>
                    <span>{readerTab === "abstract" ? "Abstrak" : readerTab === "reading" ? "Pembahasan" : "Kesimpulan"}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Reading Stage */}
              <div 
                className={`flex-1 flex flex-col justify-between overflow-hidden transition-colors duration-300 ${
                  readerTheme === "light"
                    ? "bg-white text-zinc-900"
                    : readerTheme === "sepia"
                      ? "bg-[#F4ECD8] text-[#433422]"
                      : "bg-[#121212] text-zinc-100"
                }`}
                style={{
                  borderLeft: readerTheme === "light"
                    ? "1px solid #E4E4E7"
                    : readerTheme === "sepia"
                      ? "1px solid #E6D7B8"
                      : "1px solid #27272A"
                }}
              >
                {/* Header: Tab controls & Reading Theme */}
                <div 
                  className="p-6 border-b flex flex-col xl:flex-row xl:items-center justify-between gap-4 transition-colors duration-300"
                  style={{
                    borderColor: readerTheme === "light"
                      ? "#E4E4E7"
                      : readerTheme === "sepia"
                        ? "#E6D7B8"
                        : "#27272A"
                  }}
                >
                  <div 
                    className="flex gap-2 p-1 rounded-xl overflow-x-auto transition-colors duration-300"
                    style={{
                      backgroundColor: readerTheme === "light"
                        ? "#F4F4F5"
                        : readerTheme === "sepia"
                          ? "#EADFB8"
                          : "#1E1E1E"
                    }}
                  >
                    <button
                      onClick={() => setReaderTab("abstract")}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap"
                      style={{
                        backgroundColor: readerTab === "abstract"
                          ? readerTheme === "light"
                            ? "#FFFFFF"
                            : readerTheme === "sepia"
                              ? "#F4ECD8"
                              : "#27272A"
                          : "transparent",
                        color: readerTab === "abstract"
                          ? readerTheme === "light"
                            ? "#18181B"
                            : readerTheme === "sepia"
                              ? "#433422"
                              : "#FFFFFF"
                          : readerTheme === "light"
                            ? "#71717A"
                            : readerTheme === "sepia"
                              ? "#7A654E"
                              : "#A1A1AA"
                      }}
                    >
                      Abstrak &amp; Pengantar
                    </button>
                    <button
                      onClick={() => setReaderTab("reading")}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap"
                      style={{
                        backgroundColor: readerTab === "reading"
                          ? readerTheme === "light"
                            ? "#FFFFFF"
                            : readerTheme === "sepia"
                              ? "#F4ECD8"
                              : "#27272A"
                          : "transparent",
                        color: readerTab === "reading"
                          ? readerTheme === "light"
                            ? "#18181B"
                            : readerTheme === "sepia"
                              ? "#433422"
                              : "#FFFFFF"
                          : readerTheme === "light"
                            ? "#71717A"
                            : readerTheme === "sepia"
                              ? "#7A654E"
                              : "#A1A1AA"
                      }}
                    >
                      Pembahasan
                    </button>
                    <button
                      onClick={() => setReaderTab("conclusion")}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap"
                      style={{
                        backgroundColor: readerTab === "conclusion"
                          ? readerTheme === "light"
                            ? "#FFFFFF"
                            : readerTheme === "sepia"
                              ? "#F4ECD8"
                              : "#27272A"
                          : "transparent",
                        color: readerTab === "conclusion"
                          ? readerTheme === "light"
                            ? "#18181B"
                            : readerTheme === "sepia"
                              ? "#433422"
                              : "#FFFFFF"
                          : readerTheme === "light"
                            ? "#71717A"
                            : readerTheme === "sepia"
                              ? "#7A654E"
                              : "#A1A1AA"
                      }}
                    >
                      Kesimpulan
                    </button>
                  </div>

                  <div className="flex items-center gap-4 self-end xl:self-auto">
                    {/* Reading Theme Toggle */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-zinc-450">Tema Baca:</span>
                      <div 
                        className="flex gap-1 p-0.5 rounded-lg border transition-colors duration-300"
                        style={{
                          backgroundColor: readerTheme === "light"
                            ? "#F4F4F5"
                            : readerTheme === "sepia"
                              ? "#EADFB8"
                              : "#1E1E1E",
                          borderColor: readerTheme === "light"
                            ? "#E4E4E7"
                            : readerTheme === "sepia"
                              ? "#DBCEAA"
                              : "#27272A"
                        }}
                      >
                        {(["light", "sepia", "dark"] as const).map((themeOpt) => (
                          <button
                            key={themeOpt}
                            onClick={() => setReaderTheme(themeOpt)}
                            className="px-2.5 py-1 rounded-md transition-all uppercase tracking-wider font-sans"
                            style={{
                              fontSize: "10px",
                              fontWeight: "bold",
                              backgroundColor: readerTheme === themeOpt
                                ? themeOpt === "light"
                                  ? "#FFFFFF"
                                  : themeOpt === "sepia"
                                    ? "#F4ECD8"
                                    : "#27272A"
                                : "transparent",
                              color: readerTheme === themeOpt
                                ? themeOpt === "light"
                                  ? "#18181B"
                                  : themeOpt === "sepia"
                                    ? "#433422"
                                    : "#FFFFFF"
                                : readerTheme === "light"
                                  ? "#71717A"
                                  : readerTheme === "sepia"
                                    ? "#7A654E"
                                    : "#8E9196"
                            }}
                          >
                            {themeOpt === "light" ? "Terang" : themeOpt === "sepia" ? "Sepia" : "Gelap"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Switch to Distraction-Free Focus Reader Mode */}
                    <button
                      type="button"
                      onClick={() => {
                        const book = activeReaderBook;
                        const page = readerPage;
                        setActiveReaderBook(null);
                        setFocusReaderBook(book);
                        setFocusReaderPage(page);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all hover:scale-102 cursor-pointer"
                      style={{
                        borderColor: "#E5C158",
                        color: "#E5C158",
                        backgroundColor: "rgba(229, 193, 88, 0.12)"
                      }}
                      title="Beralih ke Distraction-Free Focus Reader"
                    >
                      <Eye size={12} /> Focus Reader
                    </button>

                    <button
                      onClick={() => setActiveReaderBook(null)}
                      className="p-2 rounded-full transition-colors"
                      style={{
                        color: readerTheme === "light"
                          ? "#18181B"
                          : readerTheme === "sepia"
                            ? "#433422"
                            : "#F4F4F5",
                        backgroundColor: "transparent"
                      }}
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Content Stage */}
                <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={readerTab + "-" + readerPage}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="max-w-2xl mx-auto space-y-6"
                    >
                      {readerTab === "abstract" && (
                        <>
                          <h4 
                            className="text-2xl font-display font-semibold tracking-tight select-none transition-colors duration-300"
                            style={{
                              color: readerTheme === "light"
                                ? "#D97706"
                                : readerTheme === "sepia"
                                  ? "#B45309"
                                  : "#F59E0B"
                            }}
                          >
                            Abstrak Penelitian &amp; Konteks Global
                          </h4>
                          <p 
                            className="text-sm md:text-base leading-relaxed font-medium font-sans italic border-l-4 pl-6 py-1 transition-colors duration-300"
                            style={{
                              borderColor: "#E5C158",
                              color: readerTheme === "light"
                                ? "#52525B"
                                : readerTheme === "sepia"
                                  ? "#6B5843"
                                  : "#A1A1AA"
                            }}
                          >
                            "Kajian akademis ini diterbitkan di bawah koridor
                            riset Al-Misbah Education untuk mengeksplorasi
                            diseminasi sains peradaban Islam serta integrasi
                            metodologi inovasi terkini di era modern."
                          </p>
                          <p 
                            className="text-sm md:text-base leading-relaxed transition-colors duration-300"
                            style={{
                              color: readerTheme === "light"
                                ? "#3F3F46"
                                : readerTheme === "sepia"
                                  ? "#5C4A37"
                                  : "#D4D4D8"
                            }}
                          >
                            Buku atau jurnal ini dirancang untuk menjawab
                            tantangan asimilasi kurikulum tradisional dengan
                            akselerasi kurikulum berbasis riset. Metodologi yang
                            digunakan berfokus pada meta-analisis arsip teks
                            klasik (kitab turats) dan dikorelasikan dengan
                            parameter literasi kuantitatif modern.
                          </p>
                          <div 
                            className="p-5 rounded-2xl border transition-colors duration-300"
                            style={{
                              backgroundColor: readerTheme === "light"
                                ? "#F4F4F5"
                                : readerTheme === "sepia"
                                  ? "#EADFB8"
                                  : "#18181B",
                              borderColor: readerTheme === "light"
                                ? "#E4E4E7"
                                : readerTheme === "sepia"
                                  ? "#DBCEAA"
                                  : "#27272A"
                            }}
                          >
                            <span 
                              className="text-[10px] font-black uppercase"
                              style={{
                                color: readerTheme === "light"
                                  ? "#71717A"
                                  : readerTheme === "sepia"
                                    ? "#7A654E"
                                    : "#8E9196"
                              }}
                            >
                              Kontributor Utama:
                            </span>
                            <p 
                              className="text-xs font-bold"
                              style={{
                                color: readerTheme === "light"
                                  ? "#27272A"
                                  : readerTheme === "sepia"
                                    ? "#433422"
                                    : "#E4E4E7"
                              }}
                            >
                              Pusat Kajian Internasional Al-Misbah &amp; Darul
                              Hikmah Research Circle (DHRC)
                            </p>
                          </div>
                        </>
                      )}

                      {readerTab === "reading" && (
                        <>
                          <h4 
                            className="text-2xl font-display font-semibold tracking-tight select-none transition-colors duration-300"
                            style={{
                              color: readerTheme === "light"
                                ? "#18181B"
                                : readerTheme === "sepia"
                                  ? "#302214"
                                  : "#FFFFFF"
                            }}
                          >
                            Pembahasan Utama — Bab {readerPage} dari 5
                          </h4>
                          <span 
                            className="text-[10px] font-bold tracking-widest uppercase transition-colors duration-300"
                            style={{
                              color: readerTheme === "light"
                                ? "#71717A"
                                : readerTheme === "sepia"
                                  ? "#8C765C"
                                  : "#8E9196"
                            }}
                          >
                            Perpustakaan Darul Hikmah - Diseminasi Pengetahuan
                          </span>
                          <p 
                            className="text-sm md:text-base leading-relaxed transition-colors duration-300"
                            style={{
                              color: readerTheme === "light"
                                ? "#3F3F46"
                                : readerTheme === "sepia"
                                  ? "#5C4A37"
                                  : "#D4D4D8"
                            }}
                          >
                            Dalam perjalanannya, asimilasi konsep kearifan lokal
                            santri dengan instrumen literasi berbasis data
                            terbukti mampu memperluas cakrawala pemahaman
                            keilmuan secara signifikan. Pada lembar pembahasan
                            ke-{readerPage} ini, secara spesifik diuraikan
                            mengenai relasi antara nalar kritis dan kedalaman
                            spiritualitas santri sebagai fondasi dasar bagi
                            pemanfaatan basis data penelitian digital.
                          </p>
                          <p 
                            className="text-sm md:text-base leading-relaxed transition-colors duration-300"
                            style={{
                              color: readerTheme === "light"
                                ? "#3F3F46"
                                : readerTheme === "sepia"
                                  ? "#5C4A37"
                                  : "#D4D4D8"
                            }}
                          >
                            Penyediaan ragam kategori dari riset interdisipliner
                            hingga jurnal berkala di Darul Hikmah Library adalah
                            manifestasi konkret untuk mendukung para peneliti
                            muda (santri mudabbir) menguji hipotesis ilmiah
                            mereka secara komprehensif, terstruktur, dan valid
                            secara universal ke depan.
                          </p>
                        </>
                      )}

                      {readerTab === "conclusion" && (
                        <>
                          <h4 
                            className="text-2xl font-display font-semibold tracking-tight select-none transition-colors duration-300"
                            style={{
                              color: readerTheme === "light"
                                ? "#059669"
                                : readerTheme === "sepia"
                                  ? "#2E7D32"
                                  : "#34D399"
                            }}
                          >
                            Catatan Akhir, Rekomendasi &amp; Kesimpulan Praktis
                          </h4>
                          <p 
                            className="text-sm md:text-base leading-relaxed transition-colors duration-300"
                            style={{
                              color: readerTheme === "light"
                                ? "#3F3F46"
                                : readerTheme === "sepia"
                                  ? "#5C4A37"
                                  : "#D4D4D8"
                            }}
                          >
                            Sebagai penutup, eksplorasi teoritis dalam karya "
                            {activeReaderBook.title}" ini menegaskan bahwa
                            digitalisasi khazanah pemikiran Islam adalah
                            keniscayaan peradaban abad ke-21. Rekomendasi utama
                            dipusatkan pada pembentukan koridor pustaka dinamis
                            yang menghubungkan instansi akademis di dalam maupun
                            luar negeri.
                          </p>
                          <div 
                            className="p-6 rounded-2xl border transition-colors duration-300"
                            style={{
                              backgroundColor: readerTheme === "light"
                                ? "#ECFDF5"
                                : readerTheme === "sepia"
                                  ? "#E8E1C7"
                                  : "rgba(6, 78, 59, 0.2)",
                              borderColor: readerTheme === "light"
                                ? "#A7F3D0"
                                : readerTheme === "sepia"
                                  ? "#DBCEAA"
                                  : "rgba(4, 120, 87, 0.3)"
                            }}
                          >
                            <span 
                              className="text-[10px] font-bold uppercase tracking-wider block"
                              style={{
                                color: readerTheme === "light"
                                  ? "#047857"
                                  : readerTheme === "sepia"
                                    ? "#2E7D32"
                                    : "#34D399"
                              }}
                            >
                              Target Pembelajaran Selesai
                            </span>
                            <p 
                              className="text-xs leading-relaxed font-semibold"
                              style={{
                                color: readerTheme === "light"
                                  ? "#065F46"
                                  : readerTheme === "sepia"
                                    ? "#3E5C38"
                                    : "#A1A1AA"
                              }}
                            >
                              Selamat! Anda telah mempelajari poin-poin
                              kesimpulan esensial dari literatur ini. Tambahkan
                              ke bookmark agar dapat dibuka kembali
                              sewaktu-waktu.
                            </p>
                          </div>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footer: Pagination */}
                <div 
                  className="p-6 border-t flex items-center justify-between transition-colors duration-300"
                  style={{
                    borderColor: readerTheme === "light"
                      ? "#E4E4E7"
                      : readerTheme === "sepia"
                        ? "#E6D7B8"
                        : "#27272A"
                  }}
                >
                  <button
                    disabled={readerPage === 1}
                    onClick={() =>
                      setReaderPage((prev) => Math.max(1, prev - 1))
                    }
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      borderColor: readerTheme === "light"
                        ? "#E4E4E7"
                        : readerTheme === "sepia"
                          ? "#DBCEAA"
                          : "#27272A",
                      color: readerTheme === "light"
                        ? "#18181B"
                        : readerTheme === "sepia"
                          ? "#433422"
                          : "#F4F4F5",
                      backgroundColor: readerTheme === "light"
                        ? "#FFFFFF"
                        : readerTheme === "sepia"
                          ? "#EADFB8"
                          : "#18181B"
                    }}
                  >
                    <ChevronLeft size={16} /> Sebelumnya
                  </button>

                  <span 
                    className="text-xs font-mono font-bold transition-colors duration-300"
                    style={{
                      color: readerTheme === "light"
                        ? "#71717A"
                        : readerTheme === "sepia"
                          ? "#7A654E"
                          : "#A1A1AA"
                    }}
                  >
                    Halaman {readerPage} dari 5
                  </span>

                  <button
                    disabled={readerPage === 5}
                    onClick={() =>
                      setReaderPage((prev) => Math.min(5, prev + 1))
                    }
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      borderColor: readerTheme === "light"
                        ? "#E4E4E7"
                        : readerTheme === "sepia"
                          ? "#DBCEAA"
                          : "#27272A",
                      color: readerTheme === "light"
                        ? "#18181B"
                        : readerTheme === "sepia"
                          ? "#433422"
                          : "#F4F4F5",
                      backgroundColor: readerTheme === "light"
                        ? "#FFFFFF"
                        : readerTheme === "sepia"
                          ? "#EADFB8"
                          : "#18181B"
                    }}
                  >
                    Selanjutnya <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 9B. DISTRACTION-FREE FOCUS READER MODE OVERLAY */}
      <AnimatePresence>
        {focusReaderBook && (() => {
          const FOCUS_THEMES_CONFIG = {
            oled: {
              id: "oled",
              name: "OLED Hitam",
              bg: "#000000",
              barBg: "rgba(10, 10, 10, 0.88)",
              panelBg: "#111114",
              border: "#242428",
              text: "#D4D4D8",
              heading: "#FFFFFF",
              muted: "#71717A",
              accent: "#E5C158",
              buttonBg: "#18181C",
              quoteBg: "#111115",
              tagBg: "#1e1e24",
            },
            dark: {
              id: "dark",
              name: "Charcoal Gelap",
              bg: "#0c0d10",
              barBg: "rgba(18, 19, 24, 0.90)",
              panelBg: "#171821",
              border: "#282936",
              text: "#D4D4D8",
              heading: "#F4F4F5",
              muted: "#8E919D",
              accent: "#E5C158",
              buttonBg: "#20222d",
              quoteBg: "#14151e",
              tagBg: "#222432",
            },
            sepia: {
              id: "sepia",
              name: "Sepia Hangat",
              bg: "#FBF0D9",
              barBg: "rgba(244, 232, 206, 0.94)",
              panelBg: "#F2E2C2",
              border: "#E2CFAB",
              text: "#3c2f1f",
              heading: "#281a0b",
              muted: "#7d6850",
              accent: "#B45309",
              buttonBg: "#EBD8B4",
              quoteBg: "#F4E5C7",
              tagBg: "#E8D3AB",
            },
            cream: {
              id: "cream",
              name: "Krem Pustaka",
              bg: "#F7F4EE",
              barBg: "rgba(240, 235, 226, 0.94)",
              panelBg: "#EBE5D6",
              border: "#DFD7C5",
              text: "#2c2825",
              heading: "#1A1715",
              muted: "#78716A",
              accent: "#92400E",
              buttonBg: "#E4DEC8",
              quoteBg: "#EDE7DA",
              tagBg: "#E2DAC4",
            },
            slate: {
              id: "slate",
              name: "Slate Malam",
              bg: "#0A0F1D",
              barBg: "rgba(15, 23, 42, 0.92)",
              panelBg: "#131C35",
              border: "#1E2D4F",
              text: "#CBD5E1",
              heading: "#F8FAFC",
              muted: "#64748B",
              accent: "#38BDF8",
              buttonBg: "#1A2544",
              quoteBg: "#0F172A",
              tagBg: "#18233F",
            },
            light: {
              id: "light",
              name: "Putih Bersih",
              bg: "#FFFFFF",
              barBg: "rgba(255, 255, 255, 0.94)",
              panelBg: "#F4F4F6",
              border: "#E4E4E7",
              text: "#18181B",
              heading: "#09090B",
              muted: "#71717A",
              accent: "#D97706",
              buttonBg: "#EBEBEF",
              quoteBg: "#F8F8FA",
              tagBg: "#EDEDF0",
            },
          };

          const activeT = FOCUS_THEMES_CONFIG[focusBgTheme] || FOCUS_THEMES_CONFIG.dark;

          const columnWidthClass =
            focusColumnWidth === "narrow"
              ? "max-w-xl"
              : focusColumnWidth === "wide"
                ? "max-w-4xl"
                : "max-w-2xl";

          const fontFamilyStyle =
            focusFontFamily === "serif"
              ? "'Merriweather', 'Cinzel', Georgia, serif"
              : focusFontFamily === "mono"
                ? "'JetBrains Mono', 'Fira Code', monospace"
                : "'Inter', system-ui, -apple-system, sans-serif";

          return (
            <motion.div
              key="focus-reader-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 flex flex-col select-text transition-colors duration-300 overflow-hidden"
              style={{
                backgroundColor: activeT.bg,
                color: activeT.text,
                fontFamily: fontFamilyStyle,
              }}
            >
              {/* Reading Progress Indicator Bar at Top */}
              <div
                className="w-full h-1 relative overflow-hidden transition-colors duration-300"
                style={{ backgroundColor: activeT.border }}
              >
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    backgroundColor: activeT.accent,
                    width: `${(focusReaderPage / 5) * 100}%`,
                  }}
                />
              </div>

              {/* Floating Top Header Bar */}
              <header
                className={`w-full px-6 py-3.5 border-b backdrop-blur-md flex items-center justify-between gap-4 transition-all duration-300 z-30 ${
                  isFocusZenMode
                    ? "opacity-20 hover:opacity-100 transition-opacity"
                    : "opacity-100"
                }`}
                style={{
                  backgroundColor: activeT.barBg,
                  borderColor: activeT.border,
                }}
              >
                {/* Left: Exit button & Book summary */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => setFocusReaderBook(null)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all hover:scale-102 cursor-pointer shrink-0"
                    style={{
                      borderColor: activeT.border,
                      backgroundColor: activeT.buttonBg,
                      color: activeT.heading,
                    }}
                    title="Keluar dari Focus Reader (Esc)"
                  >
                    <ChevronLeft size={15} />
                    <span className="hidden sm:inline">Keluar</span>
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: activeT.tagBg,
                          color: activeT.accent,
                        }}
                      >
                        {focusReaderBook.category}
                      </span>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider hidden md:inline truncate"
                        style={{ color: activeT.muted }}
                      >
                        Focus Reader • Bebas Gangguan
                      </span>
                    </div>
                    <h3
                      className="text-sm font-bold truncate leading-tight mt-0.5"
                      style={{ color: activeT.heading }}
                      title={focusReaderBook.title}
                    >
                      {focusReaderBook.title}
                    </h3>
                  </div>
                </div>

                {/* Center: Reading stats (Estimated time & Word count) */}
                <div
                  className="hidden lg:flex items-center gap-3 text-xs font-mono font-semibold"
                  style={{ color: activeT.muted }}
                >
                  <span>Halaman {focusReaderPage} dari 5</span>
                  <span>•</span>
                  <span>~3 mnt membaca</span>
                  <span>•</span>
                  <span>{readingProgress[focusReaderBook.id] || Math.round((focusReaderPage / 5) * 100)}% selesai</span>
                </div>

                {/* Right: Quick Controls & Typography Trigger */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Zen Mode Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsFocusZenMode((prev) => !prev)}
                    className="px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    style={{
                      borderColor: isFocusZenMode ? activeT.accent : activeT.border,
                      backgroundColor: isFocusZenMode ? activeT.accent : activeT.buttonBg,
                      color: isFocusZenMode ? "#000000" : activeT.heading,
                    }}
                    title={isFocusZenMode ? "Nonaktifkan Zen Mode (Z)" : "Aktifkan Zen Mode (Z) - Sembunyikan panel"}
                  >
                    <Eye size={14} />
                    <span className="hidden sm:inline">Zen</span>
                  </button>

                  {/* Bookmark Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleBookmark(focusReaderBook.id, e)}
                    className="p-2 rounded-xl border transition-all cursor-pointer hover:scale-105"
                    style={{
                      borderColor: activeT.border,
                      backgroundColor: bookmarks.includes(focusReaderBook.id)
                        ? activeT.accent
                        : activeT.buttonBg,
                      color: bookmarks.includes(focusReaderBook.id)
                        ? "#000000"
                        : activeT.heading,
                    }}
                    title={
                      bookmarks.includes(focusReaderBook.id)
                        ? "Hapus dari Bookmark"
                        : "Tandai Buku Ini"
                    }
                  >
                    <Bookmark
                      size={15}
                      fill={bookmarks.includes(focusReaderBook.id) ? "currentColor" : "none"}
                    />
                  </button>

                  {/* Typography Settings Popover Button */}
                  <button
                    type="button"
                    onClick={() => setIsFocusSettingsOpen((prev) => !prev)}
                    className="px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-102"
                    style={{
                      borderColor: isFocusSettingsOpen ? activeT.accent : activeT.border,
                      backgroundColor: isFocusSettingsOpen ? activeT.accent : activeT.buttonBg,
                      color: isFocusSettingsOpen ? "#000000" : activeT.heading,
                    }}
                    title="Pengaturan Tipografi (T)"
                  >
                    <Type size={14} />
                    <span>Tipografi</span>
                  </button>

                  {/* Fullscreen Toggle */}
                  <button
                    type="button"
                    onClick={toggleFocusFullscreen}
                    className="p-2 rounded-xl border transition-all cursor-pointer hover:scale-105 hidden sm:flex"
                    style={{
                      borderColor: activeT.border,
                      backgroundColor: activeT.buttonBg,
                      color: activeT.heading,
                    }}
                    title={isFocusFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
                  >
                    {isFocusFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                  </button>

                  {/* Close button */}
                  <button
                    type="button"
                    onClick={() => setFocusReaderBook(null)}
                    className="p-2 rounded-xl border transition-all cursor-pointer hover:scale-105"
                    style={{
                      borderColor: activeT.border,
                      backgroundColor: activeT.buttonBg,
                      color: activeT.heading,
                    }}
                    title="Tutup Reader (Esc)"
                  >
                    <X size={15} />
                  </button>
                </div>
              </header>

              {/* Typography Settings Drawer / Popover */}
              <AnimatePresence>
                {isFocusSettingsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-16 right-4 sm:right-8 z-40 w-[92vw] sm:w-[420px] rounded-3xl p-6 border shadow-2xl backdrop-blur-xl space-y-5"
                    style={{
                      backgroundColor: activeT.panelBg,
                      borderColor: activeT.border,
                      color: activeT.text,
                    }}
                  >
                    <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: activeT.border }}>
                      <div className="flex items-center gap-2">
                        <Type size={16} style={{ color: activeT.accent }} />
                        <h4 className="text-sm font-bold tracking-tight" style={{ color: activeT.heading }}>
                          Pengaturan Tipografi & Tampilan
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsFocusSettingsOpen(false)}
                        className="p-1 rounded-lg hover:opacity-75 transition-opacity"
                        style={{ color: activeT.muted }}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* 1. Font Size Control */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span style={{ color: activeT.muted }} className="uppercase tracking-wider text-[10px]">
                          Ukuran Huruf (Font Size)
                        </span>
                        <span className="font-mono px-2 py-0.5 rounded text-[11px]" style={{ backgroundColor: activeT.buttonBg, color: activeT.accent }}>
                          {focusFontSize}px
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setFocusFontSize((prev) => Math.max(14, prev - 1))}
                          className="px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
                          style={{ borderColor: activeT.border, backgroundColor: activeT.buttonBg, color: activeT.heading }}
                          title="Perkecil Font"
                        >
                          A-
                        </button>
                        <input
                          type="range"
                          min="14"
                          max="32"
                          step="1"
                          value={focusFontSize}
                          onChange={(e) => setFocusFontSize(parseInt(e.target.value, 10))}
                          className="flex-1 accent-[#E5C158] cursor-pointer h-1.5 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setFocusFontSize((prev) => Math.min(32, prev + 1))}
                          className="px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
                          style={{ borderColor: activeT.border, backgroundColor: activeT.buttonBg, color: activeT.heading }}
                          title="Perbesar Font"
                        >
                          A+
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 pt-1">
                        {[
                          { label: "15px", size: 15 },
                          { label: "19px", size: 19 },
                          { label: "23px", size: 23 },
                          { label: "28px", size: 28 },
                        ].map((opt) => (
                          <button
                            key={opt.size}
                            type="button"
                            onClick={() => setFocusFontSize(opt.size)}
                            className="py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer"
                            style={{
                              borderColor: focusFontSize === opt.size ? activeT.accent : activeT.border,
                              backgroundColor: focusFontSize === opt.size ? activeT.accent : activeT.buttonBg,
                              color: focusFontSize === opt.size ? "#000000" : activeT.muted,
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Line Height Control */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span style={{ color: activeT.muted }} className="uppercase tracking-wider text-[10px]">
                          Jarak Baris (Line Height)
                        </span>
                        <span className="font-mono px-2 py-0.5 rounded text-[11px]" style={{ backgroundColor: activeT.buttonBg, color: activeT.accent }}>
                          {focusLineHeight.toFixed(2)}x
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: "Ketat (1.5)", val: 1.5 },
                          { label: "Ideal (1.85)", val: 1.85 },
                          { label: "Renggang (2.2)", val: 2.2 },
                        ].map((opt) => (
                          <button
                            key={opt.val}
                            type="button"
                            onClick={() => setFocusLineHeight(opt.val)}
                            className="py-1.5 px-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                            style={{
                              borderColor: focusLineHeight === opt.val ? activeT.accent : activeT.border,
                              backgroundColor: focusLineHeight === opt.val ? activeT.accent : activeT.buttonBg,
                              color: focusLineHeight === opt.val ? "#000000" : activeT.heading,
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3. Theme / Background Color Swatches */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span style={{ color: activeT.muted }} className="uppercase tracking-wider text-[10px]">
                          Warna Latar &amp; Tema Baca
                        </span>
                        <span className="text-[11px] font-bold" style={{ color: activeT.accent }}>
                          {activeT.name}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {(
                          Object.keys(FOCUS_THEMES_CONFIG) as Array<
                            keyof typeof FOCUS_THEMES_CONFIG
                          >
                        ).map((tKey) => {
                          const t = FOCUS_THEMES_CONFIG[tKey];
                          const isActive = focusBgTheme === tKey;
                          return (
                            <button
                              key={tKey}
                              type="button"
                              onClick={() => setFocusBgTheme(tKey)}
                              className="p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer hover:scale-102"
                              style={{
                                backgroundColor: t.bg,
                                borderColor: isActive ? activeT.accent : t.border,
                                boxShadow: isActive ? `0 0 0 2px ${activeT.accent}` : "none",
                              }}
                            >
                              <div className="w-5 h-5 rounded-full border flex items-center justify-center" style={{ borderColor: t.border, backgroundColor: t.buttonBg }}>
                                {isActive && <Check size={11} style={{ color: t.accent }} strokeWidth={3} />}
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-tight text-center" style={{ color: t.heading }}>
                                {t.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 4. Font Family Selector */}
                    <div className="space-y-2">
                      <span style={{ color: activeT.muted }} className="uppercase tracking-wider text-[10px] font-bold block">
                        Jenis Huruf (Font Family)
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "serif", label: "Serif (Buku)", sample: "Aa Serif" },
                          { id: "sans", label: "Sans (Modern)", sample: "Aa Sans" },
                          { id: "mono", label: "Mono (Riset)", sample: "Aa Mono" },
                        ].map((fOpt) => (
                          <button
                            key={fOpt.id}
                            type="button"
                            onClick={() => setFocusFontFamily(fOpt.id as any)}
                            className="p-2 rounded-xl border text-center transition-all cursor-pointer"
                            style={{
                              borderColor: focusFontFamily === fOpt.id ? activeT.accent : activeT.border,
                              backgroundColor: focusFontFamily === fOpt.id ? activeT.accent : activeT.buttonBg,
                              color: focusFontFamily === fOpt.id ? "#000000" : activeT.heading,
                            }}
                          >
                            <span className="block text-xs font-bold leading-none">{fOpt.sample}</span>
                            <span className="block text-[9px] uppercase tracking-wider mt-1 opacity-75">{fOpt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 5. Column Width & Text Alignment Row */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      {/* Column Width */}
                      <div className="space-y-1.5">
                        <span style={{ color: activeT.muted }} className="uppercase tracking-wider text-[9px] font-bold block">
                          Lebar Kolom
                        </span>
                        <div className="flex gap-1">
                          {[
                            { id: "narrow", label: "Sempit" },
                            { id: "normal", label: "Ideal" },
                            { id: "wide", label: "Lebar" },
                          ].map((wOpt) => (
                            <button
                              key={wOpt.id}
                              type="button"
                              onClick={() => setFocusColumnWidth(wOpt.id as any)}
                              className="flex-1 py-1 rounded-lg border text-[9px] font-bold uppercase transition-all"
                              style={{
                                borderColor: focusColumnWidth === wOpt.id ? activeT.accent : activeT.border,
                                backgroundColor: focusColumnWidth === wOpt.id ? activeT.accent : activeT.buttonBg,
                                color: focusColumnWidth === wOpt.id ? "#000000" : activeT.muted,
                              }}
                            >
                              {wOpt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Text Alignment */}
                      <div className="space-y-1.5">
                        <span style={{ color: activeT.muted }} className="uppercase tracking-wider text-[9px] font-bold block">
                          Perataan
                        </span>
                        <div className="flex gap-1">
                          {[
                            { id: "left", label: "Kiri", icon: AlignLeft },
                            { id: "justify", label: "Rata", icon: AlignJustify },
                          ].map((aOpt) => {
                            const Icon = aOpt.icon;
                            return (
                              <button
                                key={aOpt.id}
                                type="button"
                                onClick={() => setFocusTextAlign(aOpt.id as any)}
                                className="flex-1 py-1 rounded-lg border text-[9px] font-bold uppercase transition-all flex items-center justify-center gap-1"
                                style={{
                                  borderColor: focusTextAlign === aOpt.id ? activeT.accent : activeT.border,
                                  backgroundColor: focusTextAlign === aOpt.id ? activeT.accent : activeT.buttonBg,
                                  color: focusTextAlign === aOpt.id ? "#000000" : activeT.muted,
                                }}
                              >
                                <Icon size={11} />
                                <span>{aOpt.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Reset Button */}
                    <div className="pt-2 border-t flex justify-end" style={{ borderColor: activeT.border }}>
                      <button
                        type="button"
                        onClick={() => {
                          setFocusFontSize(19);
                          setFocusLineHeight(1.85);
                          setFocusBgTheme("dark");
                          setFocusFontFamily("serif");
                          setFocusColumnWidth("normal");
                          setFocusTextAlign("left");
                        }}
                        className="text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 hover:underline cursor-pointer"
                        style={{ color: activeT.muted }}
                      >
                        <RefreshCw size={11} /> Kembalikan Pengaturan Semula
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Distraction-Free Reading Content Scroll Area */}
              <main
                className="flex-1 overflow-y-auto px-6 py-12 md:py-16 focus:outline-none"
                tabIndex={0}
              >
                <div className={`mx-auto ${columnWidthClass} transition-all duration-300`}>
                  {/* Subtle Ornamental Book Header */}
                  <div className="mb-12 pb-8 border-b text-center space-y-3" style={{ borderColor: activeT.border }}>
                    <div className="flex items-center justify-center gap-2">
                      <span
                        className="text-[10px] font-extrabold uppercase tracking-[0.25em] px-3 py-1 rounded-full border"
                        style={{
                          backgroundColor: activeT.tagBg,
                          borderColor: activeT.border,
                          color: activeT.accent,
                        }}
                      >
                        {focusReaderBook.category}
                      </span>
                    </div>

                    <h1
                      className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight"
                      style={{ color: activeT.heading }}
                    >
                      {focusReaderBook.title}
                    </h1>

                    <div className="flex items-center justify-center gap-2 text-xs font-semibold" style={{ color: activeT.muted }}>
                      <GraduationCap size={15} style={{ color: activeT.accent }} />
                      <span>{focusReaderBook.author}</span>
                      <span>•</span>
                      <span>Edisi Digital Darul Hikmah</span>
                    </div>

                    {/* Ornamental Divider */}
                    <div className="pt-2 flex items-center justify-center gap-2" style={{ color: activeT.accent }}>
                      <span className="h-[1px] w-12" style={{ backgroundColor: activeT.border }} />
                      <span className="text-xs">✦ ❖ ✦</span>
                      <span className="h-[1px] w-12" style={{ backgroundColor: activeT.border }} />
                    </div>
                  </div>

                  {/* Active Page Reading Stage */}
                  <AnimatePresence mode="wait">
                    <motion.article
                      key={focusReaderBook.id + "-p-" + focusReaderPage}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                      style={{
                        fontSize: `${focusFontSize}px`,
                        lineHeight: focusLineHeight,
                        textAlign: focusTextAlign,
                      }}
                    >
                      {/* PAGE 1: MUKADIMAH */}
                      {focusReaderPage === 1 && (
                        <>
                          <div className="space-y-2 mb-6">
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] block" style={{ color: activeT.accent }}>
                              Bagian I: Latar Belakang &amp; Paradigma
                            </span>
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: activeT.heading }}>
                              Mukadimah &amp; Landasan Filosofis Riset
                            </h2>
                          </div>

                          <div
                            className="p-6 rounded-2xl border my-6 italic"
                            style={{
                              backgroundColor: activeT.quoteBg,
                              borderColor: activeT.border,
                              color: activeT.text,
                              borderLeftWidth: "4px",
                              borderLeftColor: activeT.accent,
                            }}
                          >
                            <p className="font-medium text-[0.95em]">
                              "Sesungguhnya peradaban yang tangguh berakar pada ketajaman pena dan kejernihan pemikiran yang memadukan spiritualitas ilahiyah dengan penyelidikan empiris yang mendalam."
                            </p>
                            <span className="block text-[11px] font-bold uppercase tracking-wider mt-3 not-italic" style={{ color: activeT.muted }}>
                              — Manuskrip Peradaban Darul Hikmah Library
                            </span>
                          </div>

                          <p>
                            {focusReaderBook.description ||
                              "Kajian akademis ini dirancang untuk menjawab tantangan integrasi literasi sains Islam di zaman komputasi kontemporer."}
                          </p>

                          <p>
                            Dalam dinamika pendidikan pesantren modern Al-Misbah, karya <strong>{focusReaderBook.title}</strong> yang disusun oleh <em>{focusReaderBook.author}</em> menjadi salah satu referensi fundamental. Penulis menggarisbawahi bahwa pemahaman literatur bukan sekadar menghafal kaidah, melainkan proses dialektis untuk mengontekstualisasikan turats klasik ke dalam realitas sains masa kini.
                          </p>

                          <p>
                            Melalui pendekatan integratif ini, para santri peneliti tidak hanya diperkenalkan pada premis-premis teoritis, tetapi juga diarahkan untuk melakukan verifikasi silang (cross-examination) terhadap data empiris, naskah rujukan, serta parameter etika keilmuan Islam yang universal.
                          </p>
                        </>
                      )}

                      {/* PAGE 2: METODOLOGI & TURATS */}
                      {focusReaderPage === 2 && (
                        <>
                          <div className="space-y-2 mb-6">
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] block" style={{ color: activeT.accent }}>
                              Bagian II: Metodologi &amp; Rujukan
                            </span>
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: activeT.heading }}>
                              Integrasi Turats Klasik &amp; Analisis Komparatif
                            </h2>
                          </div>

                          <p>
                            Kerangka metodologis yang diadopsi dalam karya ini bertumpu pada sintesis triangulasi: telaah sanad dan matan kitab turats (studi pustaka maktabah), observasi terukur atas fenomena kontemporer, dan pemodelan komputasional.
                          </p>

                          <div
                            className="p-5 rounded-2xl border space-y-3 my-6"
                            style={{
                              backgroundColor: activeT.quoteBg,
                              borderColor: activeT.border,
                            }}
                          >
                            <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: activeT.accent }}>
                              Matriks Penyelidikan Ilmiah
                            </h4>
                            <ul className="space-y-2 text-xs font-medium" style={{ color: activeT.text }}>
                              <li className="flex items-start gap-2">
                                <span className="font-bold shrink-0" style={{ color: activeT.accent }}>01.</span>
                                <span>Verifikasi sumber primer melalui korpus digital Al-Maktabah Al-Syamila dan manuskrip otentik.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="font-bold shrink-0" style={{ color: activeT.accent }}>02.</span>
                                <span>Formulasi parameter etika dan maqashid syariah terhadap penerobosan teknologi terkini.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="font-bold shrink-0" style={{ color: activeT.accent }}>03.</span>
                                <span>Eksplorasi eksperimental berbasis laboratorium riset sains dan agroteknologi santri.</span>
                              </li>
                            </ul>
                          </div>

                          <p>
                            Para peneliti menekankan pentingnya independensi berpikir tanpa melepaskan adab keilmuan. Pendekatan ini memungkinkan lahirnya sintesis baru yang segar, kredibel, dan berdaya guna bagi kemaslahatan umat manusia secara luas.
                          </p>
                        </>
                      )}

                      {/* PAGE 3: PEMBAHASAN TEMATIK */}
                      {focusReaderPage === 3 && (
                        <>
                          <div className="space-y-2 mb-6">
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] block" style={{ color: activeT.accent }}>
                              Bagian III: Eksplorasi Tematik
                            </span>
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: activeT.heading }}>
                              Diskusi Kritis &amp; Sintesis Temuan Utama
                            </h2>
                          </div>

                          <p>
                            Pada lembar pembahasan ini, diuraikan hasil observasi mendalam mengenai dampak literasi digital terhadap kecepatan transmisi keilmuan santri. Data yang dihimpun menunjukkan peningkatan akselerasi penalaran hingga 65% ketika metodologi riset digital dipadukan secara harmonis dengan halaqah talaqqi tradisional.
                          </p>

                          <div
                            className="p-6 rounded-2xl border my-6 space-y-2"
                            style={{
                              backgroundColor: activeT.panelBg,
                              borderColor: activeT.border,
                            }}
                          >
                            <span className="text-[10px] font-black uppercase tracking-widest block" style={{ color: activeT.accent }}>
                              Sorotan Tematik Buku:
                            </span>
                            <p className="text-[0.95em] font-semibold" style={{ color: activeT.heading }}>
                              "{focusReaderBook.title}" — {focusReaderBook.author}
                            </p>
                            <p className="text-xs leading-relaxed" style={{ color: activeT.muted }}>
                              Disajikan dalam format modular agar memudahkan para pengkaji mengambil intisari konseptual sekaligus rujukan praktis untuk diaplikasikan dalam tulisan karya ilmiah dan tesis lanjutan.
                            </p>
                          </div>

                          <p>
                            Setiap subbab menyajikan perbandingan terperinci antara pandangan fuqaha klasik dengan para ilmuwan abad ke-21, menghasilkan kesimpulan bahwa nilai-nilai kemaslahatan (jalb al-mashalih wa dar' al-mafasid) senantiasa selaras dengan tujuan sains murni.
                          </p>
                        </>
                      )}

                      {/* PAGE 4: APLIKASI PRAKTIS */}
                      {focusReaderPage === 4 && (
                        <>
                          <div className="space-y-2 mb-6">
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] block" style={{ color: activeT.accent }}>
                              Bagian IV: Inovasi &amp; Implementasi
                            </span>
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: activeT.heading }}>
                              Transformasi Peradaban Santri Abad 21
                            </h2>
                          </div>

                          <p>
                            Tujuan akhir dari setiap pembacaan literatur di Perpustakaan Darul Hikmah adalah melahirkan aksi nyata. Penulis merumuskan 4 pilar implementasi bagi santri dan civitas akademika:
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                            {[
                              { title: "Kedaulatan Riset Data", desc: "Membangun repositori independen yang menjaga orisinalitas riset keislaman." },
                              { title: "Publikasi Terindeks", desc: "Mendorong karya tulis santri terindeks dalam jurnal ilmiah bereputasi tinggi." },
                              { title: "Etika Algoritmik", desc: "Memastikan pemanfaatan AI tetap berlandaskan akhlak mulia dan kejujuran ilmiah." },
                              { title: "Pemberdayaan Umat", desc: "Menerapkan inovasi teknologi untuk kemandirian ekonomi dan sosial." },
                            ].map((pilar, pIdx) => (
                              <div
                                key={pIdx}
                                className="p-4 rounded-xl border space-y-1"
                                style={{
                                  backgroundColor: activeT.quoteBg,
                                  borderColor: activeT.border,
                                }}
                              >
                                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: activeT.accent }}>
                                  Pilar 0{pIdx + 1}
                                </span>
                                <h4 className="text-xs font-bold" style={{ color: activeT.heading }}>{pilar.title}</h4>
                                <p className="text-[11px] leading-relaxed" style={{ color: activeT.muted }}>{pilar.desc}</p>
                              </div>
                            ))}
                          </div>

                          <p>
                            Dengan menempatkan etika di atas pragmatisme, literatur ini membuktikan bahwa perpaduan iman, ilmu, dan teknologi adalah pilar utama renaissance peradaban Nusantara dan Islam global.
                          </p>
                        </>
                      )}

                      {/* PAGE 5: KESIMPULAN & MARAJI' */}
                      {focusReaderPage === 5 && (
                        <>
                          <div className="space-y-2 mb-6">
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] block" style={{ color: activeT.accent }}>
                              Bagian V: Konklusi &amp; Catatan Penutup
                            </span>
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: activeT.heading }}>
                              Kesimpulan Akhir &amp; Daftar Maraji'
                            </h2>
                          </div>

                          <p>
                            Sebagai penutup dari telaah menyeluruh karya "<strong>{focusReaderBook.title}</strong>", ditegaskan kembali bahwa pencarian ilmu adalah perjalanan spiritual yang tak berujung. Menghidupkan tradisi membaca (Iqra') secara mendalam dan berfokus adalah kunci pembuka pintu-pintu hikmah yang agung.
                          </p>

                          <div
                            className="p-6 rounded-2xl border space-y-3 my-6"
                            style={{
                              backgroundColor: activeT.panelBg,
                              borderColor: activeT.border,
                            }}
                          >
                            <span className="text-[10px] font-black uppercase tracking-widest block" style={{ color: activeT.accent }}>
                              Daftar Maraji' &amp; Rujukan Terkait:
                            </span>
                            <ul className="space-y-2 text-xs font-mono" style={{ color: activeT.text }}>
                              <li className="flex items-center gap-2">
                                <span style={{ color: activeT.accent }}>[1]</span>
                                <span>Al-Maktabah Al-Syamila — Korpus Riset Mausu'ah Fiqhiyyah &amp; Hadits.</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <span style={{ color: activeT.accent }}>[2]</span>
                                <span>Darul Hikmah Research Circle (DHRC) — Prosiding Tahunan Inovasi Santri 2026.</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <span style={{ color: activeT.accent }}>[3]</span>
                                <span>Jurnal Al-Misbah Education — Volume XII Edisi Khusus Integrasi Sains &amp; Turats.</span>
                              </li>
                            </ul>
                          </div>

                          {/* Completion Badge */}
                          <div
                            className="p-6 rounded-2xl border text-center space-y-3"
                            style={{
                              backgroundColor: activeT.quoteBg,
                              borderColor: activeT.accent,
                            }}
                          >
                            <div
                              className="w-12 h-12 rounded-full mx-auto flex items-center justify-center shadow-lg"
                              style={{
                                backgroundColor: activeT.accent,
                                color: "#000000",
                              }}
                            >
                              <Check size={24} strokeWidth={3} />
                            </div>
                            <h4 className="text-base font-bold" style={{ color: activeT.heading }}>
                              Target Membaca 100% Selesai!
                            </h4>
                            <p className="text-xs max-w-md mx-auto" style={{ color: activeT.muted }}>
                              Kemajuan membaca buku ini telah disimpan secara otomatis di profil Pustaka Anda. Anda dapat menandai atau membuka kembali kapan saja.
                            </p>
                            <div className="pt-2 flex items-center justify-center gap-3">
                              <button
                                type="button"
                                onClick={() => setFocusReaderPage(1)}
                                className="px-4 py-2 rounded-xl border text-xs font-bold uppercase transition-all cursor-pointer hover:scale-102"
                                style={{
                                  borderColor: activeT.border,
                                  backgroundColor: activeT.buttonBg,
                                  color: activeT.heading,
                                }}
                              >
                                Baca Ulang dari Awal
                              </button>
                              <button
                                type="button"
                                onClick={() => setFocusReaderBook(null)}
                                className="px-5 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer shadow-md hover:scale-102"
                                style={{
                                  backgroundColor: activeT.accent,
                                  color: "#000000",
                                }}
                              >
                                Selesai Membaca
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.article>
                  </AnimatePresence>
                </div>
              </main>

              {/* Bottom Pagination & Navigation Footer Bar */}
              <footer
                className={`w-full px-6 py-4 border-t backdrop-blur-md flex items-center justify-between gap-4 transition-all duration-300 z-30 ${
                  isFocusZenMode
                    ? "opacity-20 hover:opacity-100 transition-opacity"
                    : "opacity-100"
                }`}
                style={{
                  backgroundColor: activeT.barBg,
                  borderColor: activeT.border,
                }}
              >
                {/* Previous Page */}
                <button
                  type="button"
                  disabled={focusReaderPage === 1}
                  onClick={() => setFocusReaderPage((prev) => Math.max(1, prev - 1))}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold uppercase transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:scale-102"
                  style={{
                    borderColor: activeT.border,
                    backgroundColor: activeT.buttonBg,
                    color: activeT.heading,
                  }}
                  title="Halaman Sebelumnya (←)"
                >
                  <ChevronLeft size={16} />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </button>

                {/* Page Jump Pills / Dots */}
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((pageNum) => {
                    const isCurrent = focusReaderPage === pageNum;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setFocusReaderPage(pageNum)}
                        className="w-8 h-8 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center cursor-pointer hover:scale-105"
                        style={{
                          backgroundColor: isCurrent ? activeT.accent : activeT.buttonBg,
                          color: isCurrent ? "#000000" : activeT.muted,
                          border: `1px solid ${isCurrent ? activeT.accent : activeT.border}`,
                        }}
                        title={`Buka Halaman ${pageNum}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next Page / Finish */}
                {focusReaderPage < 5 ? (
                  <button
                    type="button"
                    onClick={() => setFocusReaderPage((prev) => Math.min(5, prev + 1))}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold uppercase transition-all cursor-pointer hover:scale-102"
                    style={{
                      borderColor: activeT.accent,
                      backgroundColor: activeT.accent,
                      color: "#000000",
                    }}
                    title="Halaman Selanjutnya (→)"
                  >
                    <span className="hidden sm:inline">Selanjutnya</span>
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setFocusReaderBook(null)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold uppercase transition-all cursor-pointer hover:scale-102"
                    style={{
                      borderColor: activeT.accent,
                      backgroundColor: activeT.accent,
                      color: "#000000",
                    }}
                    title="Selesai Membaca (Esc)"
                  >
                    <span>Selesai</span>
                    <Check size={16} strokeWidth={3} />
                  </button>
                )}
              </footer>
            </motion.div>
          );
        })()}
      </AnimatePresence>
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-6 select-none"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Lightbox Top Control Banner */}
            <div
              className="w-full max-w-5xl flex items-center justify-between text-white py-4 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-0.5 text-left">
                <span className="text-[10px] text-[#E5C158] font-black tracking-widest uppercase">
                  Visual Dokumen Santri
                </span>
                <h4 className="font-display font-medium text-sm md:text-base tracking-wide">
                  {galleryItems[lightboxIndex]?.title}
                </h4>
              </div>
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-full text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Lightbox Central Stage (Image + Slides Arrows) */}
            <div
              className="w-full max-w-5xl flex-1 flex items-center justify-between relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Previous button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev !== null
                      ? prev === 0
                        ? galleryItems.length - 1
                        : prev - 1
                      : null,
                  );
                }}
                className="p-4 bg-zinc-900/50 border border-zinc-800/40 backdrop-blur-md rounded-full text-white hover:bg-zinc-800/80 transition-colors absolute left-4 z-10"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Main Image View */}
              <div className="w-full h-[65vh] flex items-center justify-center p-4">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={lightboxIndex}
                    src={galleryItems[lightboxIndex]?.imageUrl}
                    alt={galleryItems[lightboxIndex]?.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-zinc-800"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://placehold.co/800x600/18181b/ffffff?text=Gallery+Moment")
                    }
                  />
                </AnimatePresence>
              </div>

              {/* Next button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev !== null
                      ? prev === galleryItems.length - 1
                        ? 0
                        : prev + 1
                      : null,
                  );
                }}
                className="p-4 bg-zinc-900/50 border border-[#E5C158]/20 backdrop-blur-md rounded-full text-white hover:bg-zinc-800/80 transition-colors absolute right-4 z-10"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Lightbox Bottom Index Bar */}
            <div
              className="w-full max-w-md bg-zinc-900/40 border border-zinc-800/30 px-6 py-3 rounded-full flex justify-between items-center text-[11px] text-zinc-450 font-mono"
              onClick={(e) => e.stopPropagation()}
            >
              <span>
                Foto {lightboxIndex + 1} dari {galleryItems.length}
              </span>
              <span className="font-sans font-bold text-[9px] uppercase tracking-wider text-emerald-500 animate-pulse">
                ● Live Interaktif
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ABOUT / PELAJARI LEBIH LANJUT MODAL */}
      <AnimatePresence>
        {isAboutModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto"
            onClick={() => setIsAboutModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-4xl max-h-[90vh] rounded-[36px] overflow-hidden border shadow-2xl flex flex-col relative ${
                isDarkMode
                  ? "bg-[#18181B] border-zinc-800 text-white"
                  : "bg-white border-zinc-200 text-black"
              }`}
            >
              {/* Modal Header */}
              <div
                className={`p-6 md:p-8 border-b flex items-start justify-between relative overflow-hidden ${
                  isDarkMode
                    ? "border-zinc-800 bg-zinc-900/60"
                    : "border-zinc-100 bg-zinc-50/80"
                }`}
              >
                {/* Background Ambient Glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 blur-[90px] rounded-full pointer-events-none -z-10" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none -z-10" />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#E5C158]/15 text-[#E5C158] border border-[#E5C158]/30 inline-flex items-center gap-1.5">
                      <Sparkles size={12} />
                      Darul Hikmah Library
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                      Al-Misbah Education
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Pintu Pengetahuan & Riset Tanpa Batas
                  </h3>
                  <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed font-medium">
                    Platform manajemen literasi mutakhir yang mengintegrasikan tradisi keilmuan Islam klasik (Turats) dengan teknologi riset digital dan asisten cerdas Maktabah Syamilah.
                  </p>
                </div>

                <button
                  onClick={() => setIsAboutModalOpen(false)}
                  className={`p-2.5 rounded-full transition-all cursor-pointer ${
                    isDarkMode
                      ? "hover:bg-zinc-800 text-zinc-400 hover:text-white"
                      : "hover:bg-zinc-200 text-zinc-600 hover:text-black"
                  }`}
                  aria-label="Tutup"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tabs Navigation */}
              <div
                className={`flex items-center gap-2 px-6 md:px-8 py-3 border-b overflow-x-auto no-scrollbar ${
                  isDarkMode ? "border-zinc-800 bg-zinc-950/40" : "border-zinc-100 bg-white"
                }`}
              >
                {[
                  { id: "overview", label: "Ikhtisar & Visi", icon: BookOpen },
                  { id: "features", label: "Fitur Perpustakaan", icon: Layers },
                  { id: "syamila", label: "Integrasi AI Syamila", icon: Bot },
                  { id: "rules", label: "Panduan & Akses", icon: Info },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = aboutActiveTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setAboutActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                        isActive
                          ? isDarkMode
                            ? "bg-white text-black shadow-md"
                            : "bg-black text-white shadow-md"
                          : isDarkMode
                            ? "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                            : "text-zinc-600 hover:text-black hover:bg-zinc-100"
                      }`}
                    >
                      <Icon size={14} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Modal Body / Tab Content */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
                {aboutActiveTab === "overview" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div
                        className={`p-5 rounded-2xl border ${
                          isDarkMode
                            ? "bg-zinc-900/50 border-zinc-800"
                            : "bg-zinc-50 border-zinc-200/60"
                        }`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-3">
                          <Library size={18} />
                        </div>
                        <h4 className="font-bold text-sm mb-1">Khazanah Terintegrasi</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                          Menghimpun ribuan manuskrip Turats, jurnal ilmiah pesantren, dan prosiding riset dalam satu ekosistem terpadu.
                        </p>
                      </div>

                      <div
                        className={`p-5 rounded-2xl border ${
                          isDarkMode
                            ? "bg-zinc-900/50 border-zinc-800"
                            : "bg-zinc-50 border-zinc-200/60"
                        }`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
                          <Sparkles size={18} />
                        </div>
                        <h4 className="font-bold text-sm mb-1">Kecerdasan Syamila AI</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                          Pelacakan takhrij hadits, sanad, matan, dan qawa'id fiqhiyyah dengan algoritma penelusuran kitab rujukan muta'akhirin.
                        </p>
                      </div>

                      <div
                        className={`p-5 rounded-2xl border ${
                          isDarkMode
                            ? "bg-zinc-900/50 border-zinc-800"
                            : "bg-zinc-50 border-zinc-200/60"
                        }`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                          <GraduationCap size={18} />
                        </div>
                        <h4 className="font-bold text-sm mb-1">Riset & Inovasi Santri</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                          Mewadahi karya tulis santri, ustadz, dan peneliti untuk dipublikasikan dan dibaca secara global.
                        </p>
                      </div>
                    </div>

                    <div
                      className={`p-6 rounded-2xl border space-y-3 ${
                        isDarkMode
                          ? "bg-zinc-900/30 border-zinc-800"
                          : "bg-zinc-50 border-zinc-200/60"
                      }`}
                    >
                      <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                        Visi Kelembagaan
                      </h4>
                      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium">
                        Darul Hikmah Library didirikan sebagai mercusuar literasi di lingkungan Al-Misbah Education. Kami percaya bahwa peradaban besar dibangun di atas pondasi membaca (Iqra') dan tradisi kajian ilmiah yang kokoh. Melalui perpaduan nilai-nilai luhur kepesantrenan dan kecanggihan teknologi komputasi modern, perpustakaan ini memberikan kemudahan bagi siapa pun untuk mengakses ilmu tanpa batas geografis.
                      </p>
                    </div>
                  </div>
                )}

                {aboutActiveTab === "features" && (
                  <div className="space-y-4">
                    {[
                      {
                        title: "E-Reader Interaktif Modern",
                        desc: "Membaca karya tulis ilmiah dan jurnal dengan opsi tema Light, Sepia, dan Dark, pelacakan progres halaman, serta penanda buku (bookmarks).",
                        badge: "E-Reader",
                      },
                      {
                        title: "Katalog Multi-Kategori & Pencarian Cepat",
                        desc: "Filter cepat untuk kategori Riset, Majalah, Inovasi, dan Umum, dilengkapi pencarian kata kunci judul dan penulis secara instan.",
                        badge: "Katalog",
                      },
                      {
                        title: "Unggah Mandiri & Arsip Digital",
                        desc: "Setiap peneliti dan asatidz dapat mendokumentasikan karya ilmiah baru dengan generator sampul otomatis dan metadata terstruktur.",
                        badge: "Manajemen",
                      },
                      {
                        title: "Galeri & Dinamika Kegiatan Akademik",
                        desc: "Dokumentasi visual ruang baca, diskusi panel, bimbingan penulisan karya tulis, dan seminar keilmuan di Darul Hikmah.",
                        badge: "Komunitas",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-5 rounded-2xl border flex items-start gap-4 transition-all ${
                          isDarkMode
                            ? "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700"
                            : "bg-zinc-50 border-zinc-200/60 hover:border-zinc-300"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                          {idx + 1}
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold">{item.title}</h4>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {aboutActiveTab === "syamila" && (
                  <div className="space-y-5">
                    <div
                      className={`p-6 rounded-2xl border space-y-3 ${
                        isDarkMode
                          ? "bg-gradient-to-br from-purple-950/20 to-zinc-900 border-purple-900/30"
                          : "bg-purple-50/50 border-purple-200/60"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-purple-400">
                        <Bot size={20} />
                        <h4 className="text-base font-bold text-black dark:text-white">
                          Al-Misbah AI Scholar Desk
                        </h4>
                      </div>
                      <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                        Asisten penelitian kami dilatih dengan pemahaman mendalam tentang metodologi studi Islam klasik. Terinspirasi oleh kepustakaan Al-Maktabah Al-Syamila, AI ini mampu menelusuri kitab-kitab induk hadits, riwayat perawi, tafsir, dan ushul fiqih.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div
                        className={`p-4 rounded-2xl border space-y-2 ${
                          isDarkMode ? "bg-zinc-900/40 border-zinc-800" : "bg-zinc-50 border-zinc-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Check size={16} className="text-emerald-500" />
                          <h5 className="text-xs font-bold uppercase tracking-wider">
                            Pencarian Hadits & Takhrij
                          </h5>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                          Ketik penggalan lafadz hadits (misal: "Innamal a'malu bin niyyat" atau "Khairukum man ta'allamal qur'an") untuk melihat matan, terjemahan, dan takhrij riwayat imam perawinya.
                        </p>
                      </div>

                      <div
                        className={`p-4 rounded-2xl border space-y-2 ${
                          isDarkMode ? "bg-zinc-900/40 border-zinc-800" : "bg-zinc-50 border-zinc-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Check size={16} className="text-emerald-500" />
                          <h5 className="text-xs font-bold uppercase tracking-wider">
                            Tanya Jawab Ramah & Cerdas
                          </h5>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                          Untuk pertanyaan umum dan konsultasi belajar, asisten menjawab secara ramah dan ringkas tanpa membebani dengan istilah teknis rumit.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {aboutActiveTab === "rules" && (
                  <div className="space-y-4">
                    <div
                      className={`p-5 rounded-2xl border space-y-3 ${
                        isDarkMode ? "bg-zinc-900/40 border-zinc-800" : "bg-zinc-50 border-zinc-200"
                      }`}
                    >
                      <h4 className="text-sm font-bold flex items-center gap-2">
                        <Info size={16} className="text-[#E5C158]" />
                        Petunjuk Pemanfaatan Fasilitas
                      </h4>
                      <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E5C158] mt-1.5 shrink-0" />
                          <span>
                            <strong>Akses Bebas:</strong> Seluruh literatur digital dan asisten riset AI dapat diakses secara cuma-cuma oleh santri, asatidz, dan masyarakat pembelajar.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E5C158] mt-1.5 shrink-0" />
                          <span>
                            <strong>Kutipan Ilmiah:</strong> Saat menggunakan bahan bacaan atau kutipan hadits untuk karya ilmiah, sertakan sitasi rujukan kitab asal dengan cermat.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E5C158] mt-1.5 shrink-0" />
                          <span>
                            <strong>Kontribusi Karya:</strong> Naskah jurnal atau artikel santri yang telah disetujui dewan perpustakaan dapat diunggah melalui formulir Manajemen Katalog.
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div
                      className={`p-4 rounded-2xl border flex items-center justify-between ${
                        isDarkMode ? "bg-zinc-900/20 border-zinc-800" : "bg-white border-zinc-200"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold">Butuh Bantuan atau Panduan Khusus?</p>
                        <p className="text-[11px] text-zinc-400 font-medium">
                          Hubungi pustakawan atau admin Al-Misbah Education.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsAboutModalOpen(false);
                          setActiveTab("showcase");
                        }}
                        className="px-4 py-2 rounded-full text-xs font-bold border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      >
                        Hubungi Kami
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer / Action Buttons */}
              <div
                className={`p-5 md:px-8 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
                  isDarkMode ? "border-zinc-800 bg-zinc-950/60" : "border-zinc-100 bg-zinc-50"
                }`}
              >
                <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium w-full sm:w-auto">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Katalog Digital Terhubung Live
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      setIsAboutModalOpen(false);
                      handleOpenAiScholar();
                    }}
                    className={`px-5 py-2.5 rounded-full font-bold text-xs transition-all cursor-pointer border ${
                      isDarkMode
                        ? "border-zinc-700 hover:bg-zinc-800 text-white"
                        : "border-zinc-300 hover:bg-zinc-100 text-black"
                    }`}
                  >
                    Tanya AI Syamila
                  </button>
                  <button
                    onClick={() => {
                      setIsAboutModalOpen(false);
                      handleStartExploring();
                    }}
                    className={`px-6 py-2.5 rounded-full font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95 ${
                      isDarkMode
                        ? "bg-white text-black hover:bg-zinc-200"
                        : "bg-black text-white hover:bg-zinc-800"
                    }`}
                  >
                    Mulai Jelajahi Katalog
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. FOOTER */}
      {activeTab === "catalog" && (
        <>
          {/* OVERLAPPING MAJESTIC SCHOLARLY MOSQUE */}
          <div className="relative w-full max-w-5xl mx-auto -mb-40 z-10 px-6 overflow-visible">
            <div className="relative flex flex-col items-center justify-center">
              {/* Majestic Symmetrical Mosque with Blue Domes and photorealistic styling */}
              <div className="w-full max-w-2xl h-80 sm:h-96 md:h-[400px] transition-transform hover:scale-[1.03] duration-500 drop-shadow-2xl">
                <img
                  src="/src/assets/images/mosque_footer_1780417308341.png"
                  alt="Majestic Symmetrical Mosque Al-Misbah"
                  className="w-full h-full object-contain filter drop-shadow-[0_16px_50px_rgba(59,130,246,0.35)]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          <footer className="pt-36 pb-12 bg-[#1E1E20] text-zinc-100 border-t border-zinc-800">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-20">
                {/* Kolom 1: Al-Misbah Education & Brand */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-zinc-950 border-2 border-[#C9A23B]/60 rounded-full flex items-center justify-center p-0.5 overflow-hidden shadow-lg">
                      <img
                        src="/assets/aistudio/LOGO_AL_HIKMAH_e5f152fe.png"
                        alt="Darul Hikmah Logo"
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                    <div className="space-y-0.5" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
                      <h4 
                        style={{ 
                          fontFamily: "'Cinzel', Georgia, serif",
                          fontSize: "22px",
                          fontWeight: "900",
                          letterSpacing: "0.02em",
                          lineHeight: "0.95"
                        }}
                        className="text-white uppercase leading-none"
                      >
                        AL-MISBAH
                      </h4>
                      <p 
                        style={{ 
                          fontFamily: "'Cinzel', Georgia, serif",
                          fontSize: "22px",
                          fontWeight: "900",
                          letterSpacing: "0.02em",
                          lineHeight: "0.95"
                        }}
                        className="text-white uppercase select-none leading-none"
                      >
                        EDUCATION
                      </p>
                    </div>
                  </div>
                  <p className="text-zinc-400 font-medium leading-relaxed text-xs">
                    Al-Misbah Education adalah pusat keunggulan pendidikan Islam modern yang memadukan spiritualitas dengan inovasi teknologi global.
                  </p>
                  <div className="flex gap-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer border bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                      >
                        <Sparkles size={16} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Kolom 2: KHAZANAH PUSTAKA */}
                <div className="space-y-6">
                  <h5 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] font-mono">
                    KHAZANAH PUSTAKA
                  </h5>
                  <ul className="space-y-4 text-xs text-zinc-400 font-bold uppercase tracking-wider">
                    {[
                      { text: "Katalog Utama", tab: "catalog" },
                      { text: "Buku Tersimpan", tab: "dashboard" },
                      { text: "Kitab Kuning", tab: "catalog" },
                      { text: "Jurnal Ilmiah", tab: "catalog" }
                    ].map((item) => (
                      <li key={item.text}>
                        <button
                          onClick={() => setActiveTab(item.tab as any)}
                          className="hover:text-white transition-colors cursor-pointer text-left"
                        >
                          {item.text}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Kolom 3: LAYANAN AI */}
                <div className="space-y-6">
                  <h5 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] font-mono">
                    LAYANAN AI
                  </h5>
                  <ul className="space-y-4 text-xs text-zinc-400 font-bold uppercase tracking-wider">
                    {[
                      { text: "Asisten Syamila", tab: "ai-engine" },
                      { text: "Analisis Hadits", tab: "ai-engine" },
                      { text: "Tafsir Quran", tab: "ai-engine" },
                      { text: "Simulasi Riset", tab: "ai-engine" }
                    ].map((item) => (
                      <li key={item.text}>
                        <button
                          onClick={() => setActiveTab(item.tab as any)}
                          className="hover:text-white transition-colors cursor-pointer text-left"
                        >
                          {item.text}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Kolom 4: KELEMBAGAAN */}
                <div className="space-y-6">
                  <h5 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] font-mono">
                    KELEMBAGAAN
                  </h5>
                  <ul className="space-y-4 text-xs text-zinc-400 font-bold uppercase tracking-wider">
                    {[
                      { text: "Profil Darul Hikmah", tab: "showcase" },
                      { text: "Struktur Komite", tab: "showcase" },
                      { text: "Maklumat Al-Misbah", tab: "showcase" },
                      { text: "Hubungi Kami", tab: "showcase" }
                    ].map((item) => (
                      <li key={item.text}>
                        <button
                          onClick={() => {
                            if (item.text === "Profil Darul Hikmah") {
                              setIsAboutModalOpen(true);
                            } else {
                              setActiveTab(item.tab as any);
                            }
                          }}
                          className="hover:text-white transition-colors cursor-pointer text-left"
                        >
                          {item.text}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-10 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                  © 2026 Al-Misbah Education. Hak Cipta Dilindungi Undang-Undang.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-extrabold text-zinc-400 uppercase font-mono">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />{" "}
                  SEMUA SISTEM OPERASIONAL LIVE
                </div>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* ============================================================== */}
      {/* FLOATING ACTION BUTTONS & CHAT WIDGET (Image 1 Style)          */}
      {/* ============================================================== */}

      {/* Floating Action Buttons in Bottom Right */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-3 select-none pointer-events-auto">
        {/* Toggle Chat Floating Button (matching Image 1 & image_98f31f2a) */}
        <button
          type="button"
          onClick={() => setIsAiChatOpen((prev) => !prev)}
          aria-label={isAiChatOpen ? "Tutup Asisten AI" : "Buka Asisten Riset AI"}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${
            isAiChatOpen
              ? "bg-black text-white dark:bg-white dark:text-black border-2 border-white/20 dark:border-black/20"
              : "bg-black text-white border-2 border-[#C9A23B] shadow-2xl shadow-black/60 hover:shadow-[#E5C158]/40"
          }`}
          title={isAiChatOpen ? "Tutup Chat" : "Tanya Asisten AI"}
        >
          {isAiChatOpen ? (
            <X size={26} strokeWidth={2.5} />
          ) : (
            <div className="relative w-full h-full p-2 flex items-center justify-center">
              <img
                src="/assets/aistudio/LOGO_AL_HIKMAH_e5f152fe.png"
                alt="Logo AI Darul Hikmah"
                className="w-full h-full object-contain rounded-full drop-shadow-md select-none pointer-events-none"
              />
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full animate-pulse shadow-sm" />
            </div>
          )}
        </button>

        {/* Scroll to Top Floating Button (matching Image 1) */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Kembali ke atas"
          title="Scroll ke atas"
          className="w-12 h-12 rounded-full bg-zinc-200/90 hover:bg-zinc-300 dark:bg-zinc-800/90 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 shadow-xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-md"
        >
          <ChevronUp size={22} strokeWidth={2.5} />
        </button>
      </div>

      {/* Floating Chat Modal Box (matching Image 1 & Image 2) */}
      <AnimatePresence>
        {isAiChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[420px] max-w-[440px] h-[580px] max-h-[82vh] rounded-[28px] shadow-2xl flex flex-col overflow-hidden border backdrop-blur-xl ${
              isDarkMode
                ? "bg-[#0C0A14]/95 border-zinc-800 text-white shadow-black"
                : "bg-white/95 border-zinc-200 text-zinc-900 shadow-zinc-400/30"
            }`}
          >
            {/* Header section (matching Image 1 & Image 2) */}
            <div
              className={`px-5 py-3.5 border-b flex items-center justify-between shrink-0 relative z-10 ${
                isDarkMode
                  ? "border-zinc-800 bg-[#12101C]/90 text-white"
                  : "border-zinc-200/80 bg-zinc-50/90 text-zinc-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full border-2 border-[#C9A23B]/60 p-0.5 overflow-hidden flex items-center justify-center bg-black shadow-sm">
                  <img
                    src="/assets/aistudio/LOGO_AL_HIKMAH_e5f152fe.png"
                    alt="Logo Darul Hikmah"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-sans font-bold uppercase tracking-wider leading-none">
                    Darul Hikmah AI
                  </h4>
                  <p className="text-[8.5px] font-medium text-emerald-500 dark:text-emerald-400 mt-0.5 tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    Online • Siap Menjawab
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-[#E5C158] tracking-widest uppercase bg-[#E5C158]/10 px-2 py-0.5 rounded-full border border-[#E5C158]/30 font-sans">
                  CHATBOT AI
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAiChatHistory([
                      {
                        role: "assistant",
                        text: "Halo! Sesi baru telah dimulai. Ada yang bisa saya bantu hari ini? Silakan tanyakan apa saja!",
                        timestamp: Date.now(),
                      },
                    ]);
                    setAiPrompt("");
                    triggerAppToast("Sesi diskusi AI dibersihkan.");
                  }}
                  title="Mulai Sesi Baru"
                  className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsAiChatOpen(false)}
                  title="Tutup Widget"
                  className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Scrollable Conversation Content */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin ${
              isDarkMode ? "bg-gradient-to-b from-[#0C0A14] to-[#050508]" : "bg-gradient-to-b from-zinc-50/50 to-white"
            }`}>
              {aiChatHistory.length <= 1 ? (
                /* Welcoming State (Standard Chatbot Welcome) */
                <div className="h-full flex flex-col items-center justify-center text-center px-2 py-4 space-y-4">
                  <div className="relative mb-1">
                    <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full scale-150 pointer-events-none animate-pulse" />
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                      className="w-16 h-16 rounded-full border-2 border-[#C9A23B]/60 p-1 bg-black flex items-center justify-center relative z-10 shadow-xl"
                    >
                      <img
                        src="/assets/aistudio/LOGO_AL_HIKMAH_e5f152fe.png"
                        alt="Logo Darul Hikmah"
                        className="w-full h-full object-contain rounded-full"
                      />
                    </motion.div>
                  </div>

                  <div className="space-y-1">
                    <h3 className={`text-lg font-bold tracking-tight ${isDarkMode ? "text-white" : "text-zinc-900"}`}>
                      Halo! Mau tanya apa hari ini?
                    </h3>
                    <p className={`text-xs leading-relaxed max-w-xs mx-auto ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                      Tanyakan materi pelajaran, bantuan menulis, sains & teknologi, fiqih, atau ngobrol santai seperti chatbot pada umumnya.
                    </p>
                  </div>

                  {/* Quick Prompts */}
                  <div className="w-full space-y-2 pt-2">
                    {[
                      {
                        emoji: "👋",
                        text: "Siapa kamu dan bisa apa saja?",
                        prompt: "Kamu siapa dan bisa bantu apa saja?",
                      },
                      {
                        emoji: "💡",
                        text: "Jelaskan proses fotosintesis",
                        prompt: "Jelaskan apa itu fotosintesis dan bagaimana prosesnya secara lengkap.",
                      },
                      {
                        emoji: "✍️",
                        text: "Bantu buatkan kata pengantar makalah",
                        prompt: "Buatkan contoh draf kata pengantar yang formal untuk makalah.",
                      },
                      {
                        emoji: "📖",
                        text: "Tata cara shalat tahajud & keutamaannya",
                        prompt: "Bagaimana tata cara shalat tahajud dan keutamaannya?",
                      },
                    ].map((act, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setAiPrompt(act.prompt);
                          handleAiSearch(undefined, act.prompt);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-2xl border text-xs font-semibold shadow-sm hover:shadow transition-all active:scale-[0.98] cursor-pointer flex items-center justify-between group ${
                          isDarkMode
                            ? "bg-zinc-900 hover:bg-zinc-800/90 text-white border-zinc-800"
                            : "bg-white hover:bg-zinc-50 text-zinc-900 border-zinc-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm select-none">{act.emoji}</span>
                          <span>{act.text}</span>
                        </div>
                        <ChevronRight size={14} className="text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Active Chat Conversation History */
                <div className="space-y-4">
                  {aiChatHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start gap-2"} animate-fadeIn`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-7 h-7 rounded-full border border-[#C9A23B]/60 overflow-hidden shrink-0 mt-0.5 shadow-sm bg-black p-0.5">
                          <img
                            src="/assets/aistudio/LOGO_AL_HIKMAH_e5f152fe.png"
                            alt="AI Logo"
                            className="w-full h-full object-contain rounded-full"
                          />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                          msg.role === "user"
                            ? isDarkMode
                              ? "bg-violet-900/60 border border-violet-700/60 text-white rounded-br-sm font-medium"
                              : "bg-black text-white rounded-br-sm font-medium"
                            : isDarkMode
                              ? "bg-[#14121E] border border-zinc-800 text-zinc-200 rounded-bl-sm"
                              : "bg-zinc-100 border border-zinc-200/80 text-zinc-900 rounded-bl-sm"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                        ) : (
                          <div className="space-y-2">
                            {renderFormattedText(msg.text)}
                          </div>
                        )}
                          <span
                            className={`text-[8px] block mt-1 text-right ${
                              msg.role === "user" ? "text-white/60" : "text-zinc-400"
                            }`}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {isAiLoading && (
                <div className="flex justify-start animate-pulse">
                  <div className={`rounded-2xl rounded-bl-sm px-4 py-3 text-xs flex items-center gap-2 border ${
                    isDarkMode ? "bg-[#14121E] border-zinc-800 text-zinc-400" : "bg-zinc-100 border-zinc-200 text-zinc-600"
                  }`}>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                    <span className="text-[11px] font-semibold">Mengetik jawaban...</span>
                  </div>
                </div>
              )}
              <div ref={aiChatEndRef} />
            </div>

            {/* Input Capsule Form (modeled after Image 1) */}
            <div className={`p-3 border-t shrink-0 ${
              isDarkMode ? "border-zinc-800 bg-[#0C0A14]" : "border-zinc-200 bg-white"
            }`}>
              <form
                onSubmit={(e) => handleAiSearch(e)}
                className={`rounded-full px-3 py-2 flex items-center justify-between border shadow-sm transition-all ${
                  isDarkMode
                    ? "bg-zinc-950 border-zinc-800 text-white focus-within:border-violet-500"
                    : "bg-zinc-50 border-zinc-300 text-zinc-900 focus-within:border-blue-500"
                }`}
              >
                {/* Attachment icon button */}
                <button
                  type="button"
                  onClick={() => triggerAppToast("Simulasi: Sematkan file atau naskah referensi.")}
                  title="Sematkan Lampiran"
                  className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  <Paperclip size={16} />
                </button>

                <input
                  type="text"
                  placeholder="Tanyakan apa saja kepada AI..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  disabled={isAiLoading}
                  className="flex-1 bg-transparent border-none outline-none text-xs px-2 font-medium"
                />

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={toggleListening}
                    title="Gunakan Mikrofon"
                    className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                      isListening
                        ? "bg-red-500 text-white animate-pulse"
                        : "hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                    }`}
                  >
                    <Mic size={16} />
                  </button>
                  <button
                    type="submit"
                    disabled={!aiPrompt.trim() || isAiLoading}
                    className="w-7 h-7 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <ChevronRight size={15} strokeWidth={2.5} />
                  </button>
                </div>
              </form>

              {/* Disclaimer text under input (modeled after Image 1) */}
              <p className="text-[9.5px] text-zinc-400 dark:text-zinc-500 text-center pt-2 font-medium select-none">
                Darul Hikmah AI dapat membuat kekeliruan. Selalu verifikasi informasi penting.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
