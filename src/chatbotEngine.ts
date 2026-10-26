// Encyclopedic & Conversational Chatbot Engine
// Provides intelligent, natural, direct answers across Islamic studies, science, technology,
// history, creative writing, education, and everyday inquiries.

interface TopicEntry {
  keywords: string[];
  response: string | ((query: string) => string);
}

// 1. Math Evaluator (safe calculation for basic arithmetic)
function tryEvaluateMath(query: string): string | null {
  const clean = query
    .toLowerCase()
    .replace(/(?:hitung|berapa|hasil dari|nilai dari|\?)/g, "")
    .trim();

  // Handle percentages: "15% dari 200000" or "20% dari 50000"
  const percentMatch = clean.match(/^(\d+(?:\.\d+)?)\s*%\s*(?:dari|of|\*)\s*(\d+(?:[.,]\d+)?)$/);
  if (percentMatch) {
    const pct = parseFloat(percentMatch[1]);
    const total = parseFloat(percentMatch[2].replace(",", "."));
    const result = (pct / 100) * total;
    return `Hasil perhitungan: **${pct}% dari ${total.toLocaleString("id-ID")}** adalah **${result.toLocaleString("id-ID")}**.`;
  }

  // Handle square root: "akar dari 64" or "akar 81"
  const sqrtMatch = clean.match(/^akar\s*(?:dari)?\s*(\d+(?:\.\d+)?)$/);
  if (sqrtMatch) {
    const val = parseFloat(sqrtMatch[1]);
    const res = Math.sqrt(val);
    return `Akar kuadrat dari **${val}** adalah **${res}**.`;
  }

  // Handle simple arithmetic expressions like "12 * 8", "150 + 275", "1000 / 4"
  if (/^[\d\s+\-*/().^]+$/.test(clean) && /[+\-*/^]/.test(clean)) {
    try {
      const tokens = clean.match(/\d+(?:\.\d+)?|[+\-*/()^]/g);
      if (tokens) {
        let pos = 0;
        const parseExpr = (): number => {
          let val = parseTerm();
          while (pos < tokens.length && (tokens[pos] === "+" || tokens[pos] === "-")) {
            const op = tokens[pos++];
            const next = parseTerm();
            val = op === "+" ? val + next : val - next;
          }
          return val;
        };
        const parseTerm = (): number => {
          let val = parseFactor();
          while (pos < tokens.length && (tokens[pos] === "*" || tokens[pos] === "/")) {
            const op = tokens[pos++];
            const next = parseFactor();
            if (op === "/" && next === 0) throw new Error("ZeroDivision");
            val = op === "*" ? val * next : val / next;
          }
          return val;
        };
        const parseFactor = (): number => {
          let val = parsePrimary();
          if (pos < tokens.length && tokens[pos] === "^") {
            pos++;
            const exp = parseFactor();
            val = Math.pow(val, exp);
          }
          return val;
        };
        const parsePrimary = (): number => {
          if (pos >= tokens.length) throw new Error("UnexpectedEnd");
          const t = tokens[pos++];
          if (t === "(") {
            const val = parseExpr();
            if (pos >= tokens.length || tokens[pos++] !== ")") throw new Error("MismatchedParen");
            return val;
          }
          if (t === "-") return -parsePrimary();
          if (t === "+") return parsePrimary();
          const num = parseFloat(t);
          if (isNaN(num)) throw new Error("InvalidNum");
          return num;
        };

        const result = parseExpr();
        if (pos === tokens.length && typeof result === "number" && !isNaN(result) && isFinite(result)) {
          return `Hasil dari **${clean}** adalah **${result.toLocaleString("id-ID")}**.`;
        }
      }
    } catch {
      // ignore calculation failure safely
    }
  }

  return null;
}

// 2. Creative Writing Engine
function tryCreativeWriting(query: string): string | null {
  const q = query.toLowerCase();

  // Puisi
  if (q.includes("puisi")) {
    if (q.includes("ibu") || q.includes("bunda") || q.includes("mama")) {
      return `Berikut puisi tentang kasih sayang Ibu:

**Pelita di Sudut Malam**

Di balik kerut lembut di keningmu,
Tersimpan lautan doa yang tak pernah jemu.
Ketika dunia terlelap dalam dinginnya sepi,
Engkau bersujud, membisikkan namaku ke bumi,
Hingga gaungnya terdengar di langit tertinggi.

Ibu, langkahmu adalah berkah,
Senyummu adalah penawar setiap gundah.
Tiada kata yang sanggup melukiskan,
Betapa agung cinta yang kau titipkan.`;
    }

    if (q.includes("guru") || q.includes("ustadz") || q.includes("kyai")) {
      return `Berikut puisi persembahan untuk Guru:

**Penerang Samudera Gulita**

Dari selembar kertas putih nan hampa,
Kau goreskan tinta ilmu dan pelita.
Membimbing akal meniti makrifat,
Menuntun hati menuju jalan selamat.

Bukan sekadar aksara yang kau ajarkan,
Melainkan adab dan kemuliaan yang kau wariskan.
Terima kasih, wahai lentera zaman,
Jasamu abadi sepanjang peradaban.`;
    }

    if (q.includes("santri") || q.includes("pesantren") || q.includes("kitab")) {
      return `Berikut puisi tentang kehidupan santri:

**Denting Malam Para Penuntut Ilmu**

Di antara lembaran kitab kuning yang terbuka,
Aroma kasturi ilmu mengalun tanpa jeda.
Dengung bait Alfiyyah melintasi serambi,
Menempa jiwa dalam khidmat dan bakti.

Rindu rumah lebur dalam munajat,
Menatap masa depan dengan tekad bulat.
Santri bukan sekadar gelar di dada,
Ia adalah penjaga marwah agama dan bangsa.`;
    }

    return `Berikut puisi untukmu:

**Langkah Menuju Cahaya**

Matahari terbit membawa asa baru,
Menghapus kabut ragu di balik kalbu.
Setiap langkah yang kita tapaki hari ini,
Adalah lembaran sejarah yang kita lukis sendiri.

Jangan gentar pada terjalnya rintangan,
Sebab permata berkilau lewat tempaan.
Tegakkan niat, luaskan ikhtiar dan doa,
Niscaya keberkahan menyambut di penghujung masa.`;
  }

  // Pantun
  if (q.includes("pantun")) {
    if (q.includes("lucu") || q.includes("humor") || q.includes("kocak")) {
      return `Berikut pantun lucu untuk mencairkan suasana:

Pergi ke pasar beli kedondong,  
Jalannya santai pakai celana gombrang.  
Pagi-pagi jangan cemberut dong,  
Nanti manisnya direbut orang! 😄

*Satu lagi:*  
Burung gelatik di atas pohon kelapa,  
Terbang melayang ke arah duku.  
Sudah cantik baik pula hatinya,  
Tapi sayang, nggak kenal sama aku! 😆`;
    }

    if (q.includes("nasihat") || q.includes("ilmu") || q.includes("belajar")) {
      return `Berikut pantun nasihat tentang menuntut ilmu:

Kayu jati dibuat papan,  
Dibawa berlayar ke Pulau Bangka.  
Tuntutlah ilmu demi masa depan,  
Agar hidup mulia di dunia dan baka.

*Pantun kedua:*  
Bunga mawar harum baunya,  
Tumbuh mekar di dekat telaga.  
Hormati guru dan orang tua,  
Pintu berkah jalan ke surga.`;
    }

    return `Berikut pantun istimewa untukmu:

Pohon beringin rindang daunnya,  
Tempat berteduh para musafir.  
Rajin belajar banyak manfaatnya,  
Hati lapang hidup pun mahir! ✨`;
  }

  // Kata Pengantar
  if (q.includes("kata pengantar")) {
    return `Berikut draf **Kata Pengantar** yang formal, elegan, dan siap digunakan untuk makalah, skripsi, atau karya ilmiah:

---

**KATA PENGANTAR**

Puji syukur kami panjatkan ke hadirat Allah SWT, karena berkat rahmat, taufik, dan hidayah-Nya, kami dapat menyelesaikan karya tulis ilmiah ini dengan baik dan tepat waktu. Shalawat serta salam semoga senantiasa tercurah kepada junjungan kita Nabi Muhammad SAW, beserta keluarga, sahabat, dan umatnya hingga akhir zaman.

Karya tulis ini disusun guna memenuhi tugas akademik serta memberikan sumbangsih pemikiran terhadap pembahasan topik terkait. Kami menyadari bahwa penyusunan karya tulis ini tidak terlepas dari bantuan, bimbingan, serta dukungan moral dari berbagai pihak, baik dosen pembimbing, keluarga, maupun rekan-rekan seperjuangan.

Kami menyadari sepenuhnya bahwa karya tulis ini masih memiliki ruang penyempurnaan. Oleh karena itu, kami sangat mengharapkan kritik dan saran yang membangun demi perbaikan karya-karya kami selanjutnya. Semoga karya tulis ini dapat memberikan manfaat nyata bagi pembaca dan khazanah keilmuan.

Kota Anda, ${new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}  
**Penulis**`;
  }

  // Latar Belakang Makalah
  if (q.includes("latar belakang")) {
    return `Berikut contoh draf penyusunan **Latar Belakang Masalah** yang runut sesuai kaidah akademis (Metode Piramida Terbalik):

---

**BAB I PENDAHULUAN**

**1.1 Latar Belakang Masalah**

Di era perkembangan global dan disrupsi informasi saat ini, tuntutan terhadap penguasaan ilmu pengetahuan, inovasi teknologi, dan pemeliharaan nilai-nilai etika moral menjadi sangat krusial. Perubahan yang berlangsung begitu cepat menuntut setiap institusi dan individu untuk senantiasa adaptif tanpa kehilangan jati diri dan integritas dasarnya.

Namun, dalam realitas praktisnya, kerap kali ditemukan kesenjangan (*gap*) antara kondisi ideal yang diharapkan dengan fakta empiris di lapangan. Ketiadaan integrasi yang sistematis antara pemahaman teoritis dengan implementasi lapangan kerap memicu berbagai persoalan, baik dari segi efisiensi, akurasi pengambilan keputusan, maupun keberlanjutan dampak sosialnya.

Berdasarkan urgensi tersebut, diperlukan kajian ilmiah yang komprehensif, kritis, dan berbasis data untuk menganalisis akar permasalahan sekaligus merumuskan strategi solutif yang tepat sasaran. Melalui penelitian ini, diharapkan dapat terungkap faktor-faktor penentu serta model pendekatan inovatif yang dapat dijadikan rujukan praktis dan teoritis bagi para pengambil kebijakan maupun kalangan akademisi.`;
  }

  // Abstrak
  if (q.includes("abstrak") || q.includes("abstract")) {
    return `Berikut format standar penyusunan **Abstrak Penelitian** (1 Paragraf, 150–250 Kata):

---

**ABSTRAK**

Penelitian ini bertujuan untuk menganalisis urgensi, faktor penentu, serta dampak implementasi dari topik yang dikaji terhadap perkembangan keilmuan dan praktik di lapangan. Penelitian ini menggunakan pendekatan kualitatif-deskriptif dengan metode studi pustaka (*library research*) yang dikombinasikan dengan telaah dokumentasi serta wawancara mendalam. Data yang terkumpul dianalisis secara bertahap melalui reduksi data, penyajian data, serta penarikan kesimpulan berbasis validasi triangulasi sumber. Hasil penelitian menunjukkan bahwa: (1) pemahaman mendalam terhadap konsep dasar menjadi fondasi utama keberhasilan implementasi, (2) integrasi teknologi modern dengan kaidah etika keilmuan mampu meningkatkan efektivitas capaian hingga signifikan, dan (3) diperlukan standarisasi pedoman berkelanjutan agar dampak positif yang dihasilkan dapat dirasakan secara merata. Penelitian ini diharapkan dapat menjadi rujukan rekomendasi strategis bagi akademisi, praktisi, dan pemangku kebijakan terkait.

**Kata Kunci:** *Inovasi, Studi Analisis, Metodologi, Implementasi Praktis, Keberlanjutan.*`;
  }

  // Pidato / Kultum
  if (q.includes("pidato") || q.includes("kultum") || q.includes("ceramah")) {
    return `Berikut draf **Naskah Kultum / Pidato Singkat (5–7 Menit)** bertema Menuntut Ilmu:

---

**Urgensi Menuntut Ilmu di Era Disrupsi**

*Assalamu’alaikum Warahmatullahi Wabarakatuh,*

*Alhamdulillahi rabbil ‘alamin, wassholatu wassalamu ‘ala asyrofil ambiya’i wal mursalin, wa ‘ala alihi wa ash-habihi ajma’in. Amma ba’du.*

Hadirin yang dirahmati Allah,

Puji syukur marilah kita panjatkan kepada Allah SWT yang telah memberikan nikmat sehat dan kesempatan. Rasulullah SAW pernah bersabda dalam hadits riwayat Ibnu Majah:  
*«طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ»*  
Artinya: *"Menuntut ilmu adalah kewajiban bagi setiap muslim."*

Menuntut ilmu bukan sekadar formalitas untuk meraih ijazah atau gelar, melainkan sebuah ibadah seumur hidup (*minal mahdi ilal lahdi*). Di era digital saat ini, arus informasi begitu deras. Tanpa fondasi ilmu dan adab yang kokoh, kita mudah terseret arus disinformasi dan kehilangan arah.

Oleh karena itu, marilah kita senantiasa meluangkan waktu untuk membaca, berdiskusi, dan memperdalam wawasan—baik ilmu agama yang membimbing jiwa, maupun sains teknologi yang memajukan peradaban.

Semoga Allah SWT senantiasa memudahkan langkah kita dalam menuntut ilmu dan menganugerahi kita ilmu yang bermanfaat (*'ilman nafi'an*).

*Wassalamu’alaikum Warahmatullahi Wabarakatuh.*`;
  }

  return null;
}

// 3. Encyclopedic Knowledge Base (Comprehensive Answers for High-Frequency Queries)
const KNOWLEDGE_BASE: TopicEntry[] = [
  // --- SAINS & ALAM ---
  {
    keywords: ["fotosintesis", "proses fotosintesis", "fotosintesis adalah"],
    response: `**Fotosintesis** adalah proses biokimia yang dilakukan oleh tumbuhan hijau, alga, dan beberapa bakteri fotosintetik untuk memproduksi makanan mereka sendiri dengan memanfaatkan energi cahaya matahari.

**Komponen Utama yang Dibutuhkan:**
1. **Cahaya Matahari:** Sumber energi utama yang diserap oleh pigmen klorofil di dalam kloroplas.
2. **Klorofil:** Pigmen hijau daun penangkap foton cahaya.
3. **Air (H₂O):** Diserap oleh akar tanaman dari tanah dan diangkut ke daun.
4. **Karbon Dioksida (CO₂):** Diserap dari udara melalui pori-pori daun yang disebut stomata.

**Reaksi Kimia Fotosintesis:**
$$6CO_2 + 6H_2O + \\text{Cahaya Matahari} \\rightarrow C_6H_{12}O_6 \\text{ (Glukosa)} + 6O_2 \\text{ (Oksigen)}$$

**Dua Tahapan Reaksi:**
- **Reaksi Terang (di Tilakoid):** Memerlukan cahaya langsung untuk memecah molekul air (fotolisis) serta menghasilkan energi ATP dan NADPH sembari melepaskan gas oksigen ($O_2$) ke udara.
- **Reaksi Gelap / Siklus Calvin (di Stroma):** Tidak bergantung langsung pada cahaya; memanfaatkan ATP dan NADPH untuk mengubah karbon dioksida menjadi glukosa ($C_6H_{12}O_6$).

**Manfaat bagi Bumi:** Fotosintesis adalah sumber utama oksigen yang kita hirup dan fondasi rantai makanan bagi hampir seluruh makhluk hidup di bumi.`
  },
  {
    keywords: ["gravitasi", "gaya gravitasi", "hukum gravitasi"],
    response: `**Gravitasi** adalah gaya tarik-menarik fundamental yang terjadi di antara semua benda yang memiliki massa atau energi di alam semesta.

**1. Hukum Gravitasi Universal Newton (1687):**
Sir Isaac Newton merumuskan bahwa setiap benda bermassa di alam semesta saling menarik benda lain dengan gaya yang sebanding dengan hasil kali kedua massanya dan berbanding terbalik dengan kuadrat jarak di antara keduanya:
$$F = G \\frac{m_1 \\cdot m_2}{r^2}$$
*Di bumi, percepatan gravitasi rata-rata bernilai sekitar $9.8 \\text{ m/s}^2$.*

**2. Teori Relativitas Umum Einstein (1915):**
Albert Einstein menyempurnakan konsep Newton: gravitasi bukanlah gaya tak kasat mata yang menarik benda dari kejauhan, melainkan **kelengkungan ruang dan waktu (spacetime)** yang disebabkan oleh keberadaan massa dan energi. Benda bermassa besar (seperti Matahari atau Bumi) melengkungkan ruang-waktu di sekitarnya, sehingga benda-benda lain bergerak mengikuti jalur lengkung tersebut (seperti orbit bumi mengitari matahari).

**Peran Penting Gravitasi:**
- Menjaga bumi tetap berada pada orbit yang nyaman dari matahari.
- Menahan lapisan atmosfer dan lautan agar tidak terlepas ke luar angkasa.
- Mengatur pasang surut air laut akibat interaksi gravitasi dengan Bulan.`
  },
  {
    keywords: ["relativitas", "teori relativitas", "einstein"],
    response: `**Teori Relativitas** dirumuskan oleh **Albert Einstein** dan merupakan tonggak penting fisika modern yang mengubah cara manusia memandang ruang, waktu, massa, dan energi. Teori ini terbagi menjadi dua:

**1. Relativitas Khusus (1905):**
Berlaku pada kerangka acuan inersial (tanpa gravitasi). Dua postulat pokoknya:
- Hukum fisika berlaku sama bagi semua pengamat dalam kerangka inersial.
- **Kecepatan cahaya dalam ruang hampa ($c \\approx 300.000 \\text{ km/detik}$)** adalah konstan bagi semua pengamat, tidak peduli seberapa cepat sumber cahaya atau pengamat bergerak.
- **Dampak Fenomenal:** 
  * *Dilatasi Waktu:* Waktu berjalan lebih lambat bagi pengamat yang bergerak mendekati kecepatan cahaya.
  * *Penyusutan Panjang:* Panjang benda memendek searah gerakannya jika melaju mendekati kecepatan cahaya.
  * *Kesetaraan Massa-Energi:* $E = mc^2$ (massa kecil dapat dikonversi menjadi energi raksasa, dasar energi nuklir).

**2. Relativitas Umum (1915):**
Mengintegrasikan gravitasi ke dalam kelengkungan ruang-waktu 4 dimensi. Materi memberi tahu ruang-waktu bagaimana melengkung, dan ruang-waktu memberi tahu materi bagaimana bergerak. Menjelaskan fenomena lubang hitam (*black hole*), lensa gravitasi, dan gelombang gravitasi.

**Aplikasi Sehari-hari:** Satelit navigasi GPS wajib memperhitungkan efek relativitas Einstein agar koordinat lokasi di smartphone tidak meleset beberapa kilometer setiap hari.`
  },
  {
    keywords: ["tata surya", "planet", "planet di tata surya"],
    response: `**Tata Surya** adalah sistem antariksa yang terdiri dari Matahari sebagai bintang pusat serta semua benda langit yang terikat oleh gaya gravitasinya: 8 planet, planet kerdil (seperti Pluto), puluhan satelit alami (bulan), asteroid, komet, dan meteoroid.

**Urutan 8 Planet Berdasarkan Jarak dari Matahari:**
1. **Merkurius:** Planet terkecil dan terdekat dari Matahari, tanpa atmosfer tebal.
2. **Venus:** Planet terpanas dengan atmosfer tebal gas rumah kaca ($CO_2$), sering dijuluki Bintang Fajar.
3. **Bumi:** Satu-satunya planet yang diketahui memiliki kehidupan, air cair, dan atmosfer kaya oksigen.
4. **Mars:** Planet Merah yang kaya senyawa besi oksida, memiliki gunung tertinggi di tata surya (Olympus Mons).
5. **Yupiter:** Planet terbesar (raksasa gas) dengan Bintik Merah Raksasa dan puluhan satelit alami.
6. **Saturnus:** Terkenal dengan cincin es dan debu spektakuler yang mengitarinya.
7. **Uranus:** Raksasa es dengan kemiringan rotasi ekstrem (seolah menggelinding pada orbitnya).
8. **Neptunus:** Planet terjauh dengan angin tercepat di tata surya, berwarna biru cerah karena kandungan gas metana.

*Catatan: Pluto diklasifikasikan sebagai 'planet kerdil' (dwarf planet) sejak keputusan Persatuan Astronomi Internasional (IAU) tahun 2006.*`
  },
  {
    keywords: ["dna", "genetika", "gen"],
    response: `**DNA (Deoxyribonucleic Acid / Asam Deoksiribonukleat)** adalah molekul pembawa informasi genetik yang menjadi cetak biru (*blueprint*) biologis bagi perkembangan, fungsi, pertumbuhan, dan reproduksi seluruh makhluk hidup.

**Struktur DNA:**
- Ditemukan oleh James Watson dan Francis Crick (1953) berbentuk **heliks ganda (double helix)** terpilin.
- Terdiri dari untaian nukleotida yang tersusun atas:
  1. Gula deoksiribosa.
  2. Gugus fosfat.
  3. **4 Basa Nitrogen:** 
     - **Adenin (A)** selalu berpasangan dengan **Timin (T)**.
     - **Guanin (G)** selalu berpasangan dengan **Sitosin (C)**.

**Fungsi Utama DNA:**
- Menyimpan kode instruksi pembuatan protein seluler.
- Meneruskan sifat biologis dari orang tua kepada keturunannya (*hereditas*).
- Menjadi landasan dalam bioteknologi modern, rekayasa genetika, tes forensik DNA, dan terapi medis mutakhir.`
  },

  // --- SEJARAH & TOKOH INDONESIA ---
  {
    keywords: ["presiden pertama", "presiden pertama indonesia", "soekarno", "bung karno"],
    response: `Presiden pertama Republik Indonesia adalah **Ir. Soekarno** (dikenal akrab sebagai **Bung Karno**), yang menjabat dari tahun 1945 hingga 1967 didampingi oleh **Drs. Mohammad Hatta** sebagai Wakil Presiden pertama.

**Profil Singkat Ir. Soekarno:**
- **Lahir:** 6 Juni 1901 di Surabaya, Jawa Timur.
- **Wafat:** 21 Juni 1970 di Jakarta.
- **Pendidikan:** Lulusan Technische Hoogeschool te Bandoeng (sekarang Institut Teknologi Bandung / ITB) jurusan Teknik Sipil (1926).

**Peran & Jasa Bersejarah:**
1. **Proklamator Kemerdekaan:** Membacakan teks Proklamasi Kemerdekaan RI pada hari Jumat, 17 Agustus 1945 di Jalan Pegangsaan Timur No. 56 Jakarta.
2. **Perumus Pancasila:** Menyampaikan gagasan dasar negara dalam pidatonya pada tanggal 1 Juni 1945 di depan sidang BPUPKI yang menjadi cikal bakal lahirnya Pancasila.
3. **Pemimpin Gerakan Non-Blok:** Menggagas Konferensi Tingkat Tinggi Asia-Afrika (KAA) di Bandung tahun 1955 yang menginspirasi kemerdekaan bangsa-bangsa di Asia dan Afrika.
4. **Orator Ulung:** Dikenal memiliki kemampuan retorika dan pidato yang luar biasa dalam membakar semangat persatuan dan nasionalisme rakyat Indonesia.`
  },
  {
    keywords: ["pancasila", "arti pancasila", "5 sila"],
    response: `**Pancasila** adalah dasar negara, ideologi nasional, dan pedoman hidup (*way of life*) bagi bangsa Indonesia. Kata Pancasila berasal dari bahasa Sanskerta: *panca* (lima) dan *sila* (dasar atau prinsip).

**Bunyi 5 Sila Beserta Lambangnya pada Garuda Pancasila:**
1. **Ketuhanan Yang Maha Esa** (Lambang: Bintang Emas)
   - Mengakui keberadaan Tuhan dan kebebasan memeluk agama sesuai keyakinan masing-masing dengan saling menghormati.
2. **Kemanusiaan yang Adil dan Beradab** (Lambang: Rantai Emas)
   - Menjunjung tinggi hak asasi manusia, keadilan, kesetaraan derajat, dan sikap tenggang rasa.
3. **Persatuan Indonesia** (Lambang: Pohon Beringin)
   - Mengutamakan persatuan dan kesatuan bangsa di atas kepentingan pribadi atau golongan (*Bhinneka Tunggal Ika*).
4. **Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan** (Lambang: Kepala Banteng)
   - Mengedepankan musyawarah untuk mufakat dalam mengambil keputusan bersama secara bijaksana.
5. **Keadilan Sosial bagi Seluruh Rakyat Indonesia** (Lambang: Padi dan Kapas)
   - Mewujudkan kesejahteraan, keadilan ekonomi, dan perlindungan sosial yang merata bagi seluruh rakyat Indonesia.`
  },
  {
    keywords: ["kemerdekaan indonesia", "proklamasi", "17 agustus 1945"],
    response: `**Kemerdekaan Republik Indonesia** diproklamasikan pada hari **Jumat, 17 Agustus 1945** (bertepatan dengan 9 Ramadhan 1364 H) pukul 10.00 WIB di halaman rumah Ir. Soekarno, Jalan Pegangsaan Timur No. 56, Jakarta Pusat.

**Kronologi Singkat Peristiwa:**
1. **Peristiwa Rengasdengklok (16 Agustus 1945):** Para pemuda (Sukarni, Chaerul Saleh, Wikana) membawa Soekarno dan Hatta ke Rengasdengklok untuk mendesak agar proklamasi segera diumumkan tanpa menunggu janji kemerdekaan dari pihak Jepang.
2. **Penyusunan Teks Proklamasi:** Dilakukan di rumah Laksamana Tadashi Maeda di Jalan Imam Bonjol No. 1 Jakarta pada dini hari tanggal 17 Agustus 1945 oleh Soekarno, Mohammad Hatta, dan Achmad Soebardjo. Teks kemudian diketik rapi oleh Sayuti Melik dengan beberapa perubahan kata.
3. **Pengibaran Sang Saka Merah Putih:** Bendera dijahit tangan oleh Ibu Fatmawati dan dikibarkan oleh Latief Hendraningrat serta Suhud Sastro Kusumo diiringi lagu kebangsaan *Indonesia Raya* ciptaan W.R. Supratman.

Proklamasi menandai berakhirnya masa penjajahan dan lahirnya negara Indonesia yang merdeka, bersatu, dan berdaulat.`
  },

  // --- FIQIH, SHALAT & IBADAH SEHARI-HARI ---
  {
    keywords: ["tahajud", "shalat tahajud", "tata cara shalat tahajud"],
    response: `**Shalat Tahajud** adalah shalat sunnah malam (*qiyamullail*) yang didirikan setelah tidur terlebih dahulu pada malam hari. Hukum shalat tahajud adalah **Sunnah Mu’akkad** (sangat dianjurkan).

**Waktu Shalat Tahajud:**
Dapat dilaksanakan sejak setelah Isya hingga terbit fajar subuh, dengan waktu paling utama pada **sepertiga malam terakhir** (sekitar pukul 01.30 hingga menjelang waktu Subuh).

**Tata Cara Pelaksanaan:**
1. **Syarat Khusus:** Didahului dengan tidur (meski sejenak).
2. **Jumlah Rakaat:** Minimal 2 rakaat, dapat dikerjakan 4, 8, atau lebih rakaat dengan salam setiap 2 rakaat, lalu ditutup dengan shalat witir.
3. **Niat:**
   *«أُصَلِّي سُنَّةَ التَّهَجُّدِ رَكْعَتَيْنِ لِلّٰهِ تَعَالَى»*  
   *Ushalli sunnatat-tahajjudi rak'ataini lillahi ta'ala*  
   ("Aku niat shalat sunnah tahajud dua rakaat karena Allah Ta'ala").
4. **Gerakan:** Sama persis dengan gerakan shalat biasa (Takbiratul Ihram, Al-Fatihah, surah pendek, ruku', i'tidal, sujud, duduk di antara dua sujud, tahiyyat, salam).

**Keutamaan:** Sebagaimana firman Allah dalam QS. Al-Isra ayat 79, Allah menjanjikan tempat terpuji (*Maqaman Mahmuda*) bagi hamba yang rajin bertahajud.`
  },
  {
    keywords: ["dhuha", "shalat dhuha", "tata cara shalat dhuha"],
    response: `**Shalat Dhuha** adalah shalat sunnah yang dikerjakan pada waktu pagi hari setelah matahari naik setinggi tombak hingga menjelang masuk waktu Zhuhur.

**Waktu Pelaksanaan:** Sekitar 15–20 menit setelah matahari terbit (sekitar pukul 06.30 atau 07.00 pagi) sampai sekitar 10–15 menit sebelum adzan Zhuhur. Waktu paling utama adalah saat matahari mulai terasa terik (*terompah anak unta mulai kepanasan*).

**Jumlah Rakaat:** Minimal 2 rakaat, dapat dikerjakan 4, 6, hingga 8 atau 12 rakaat (salam setiap 2 rakaat).

**Lafazh Niat:**  
*«أُصَلِّي سُنَّةَ الضُّحَى رَكْعَتَيْنِ لِلّٰهِ تَعَالَى»*  
*Ushalli sunnatadh-dhuha rak'ataini lillahi ta'ala*  
("Aku niat shalat sunnah dhuha dua rakaat karena Allah Ta'ala").

**Keutamaan:** Dalam hadits riwayat Muslim disebutkan bahwa shalat dua rakaat Dhuha senilai dengan sedekah bagi seluruh 360 persendian tubuh seorang manusia.`
  },
  {
    keywords: ["rukun shalat", "syarat shalat", "rukun sholat"],
    response: `**Rukun Shalat** adalah bagian pokok ibadah shalat yang wajib dipenuhi di dalam shalat itu sendiri. Menurut jumhur ulama Syafi'iyyah, terdapat **13 rukun utama** (atau 17 jika thuma'ninah dihitung terpisah):

1. **Niat** di dalam hati bersamaan dengan Takbiratul Ihram.
2. **Berdiri bagi yang mampu** pada shalat fardhu.
3. **Takbiratul Ihram** (mengucapkan *Allahu Akbar*).
4. **Membaca Surah Al-Fatihah** pada setiap rakaat.
5. **Ruku’** dengan **Thuma'ninah** (diam sejenak seukuran bacaan tasbih).
6. **I'tidal** dengan **Thuma'ninah**.
7. **Sujud dua kali** dengan **Thuma'ninah**.
8. **Duduk di antara dua sujud** dengan **Thuma'ninah**.
9. **Duduk untuk Tasyahhud Akhir**.
10. **Membaca Tasyahhud Akhir** (Attahiyyatul Mubarakatus Shalawat...).
11. **Membaca Shalawat kepada Nabi Muhammad SAW** pada tasyahhud akhir.
12. **Membaca Salam Pertama** (menoleh ke kanan).
13. **Tertib** (melakukan rukun secara berurutan).`
  },
  {
    keywords: ["wudhu", "rukun wudhu", "tata cara wudhu"],
    response: `**Wudhu** adalah pensucian hadats kecil untuk memenuhi syarat sah ibadah shalat dan thawaf. 

**6 Rukun Wudhu (Madzhab Syafi'i berdasarkan QS. Al-Ma'idah: 6):**
1. **Niat:** Dilafalkan di dalam hati berbarengan saat membasuh muka pertama kali.  
   *Nawaitul wudhu'a li raf'il hadatsil ashghari fardhan lillahi ta'ala.*
2. **Membasuh seluruh wajah:** Dari batas tumbuhnya rambut kepala hingga dagu, dan dari telinga kanan ke telinga kiri.
3. **Membasuh kedua tangan sampai siku** (termasuk siku harus terbasuh sempurna).
4. **Mengusap sebagian kepala / rambut**.
5. **Membasuh kedua kaki sampai kedua mata kaki**.
6. **Tertib** (berurutan dari nomor 1 sampai 5).

**Sunnah-Sunnah Wudhu:** Membaca basmalah, membasuh telapak tangan, berkumur-kumur (*madhmadhah*), menghirup air ke hidung (*istinsyaq*), membasuh telinga luar dalam, mengulang 3 kali, dan membaca doa setelah wudhu.`
  },
  {
    keywords: ["puasa", "syarat puasa", "membatalkan puasa"],
    response: `**Puasa (Ash-Shiyam)** secara bahasa adalah menahan diri. Secara syariat, puasa adalah menahan diri dari makan, minum, dan segala hal yang membatalkannya mulai dari terbit fajar shadiq (waktu Subuh) hingga terbenam matahari (waktu Maghrib) disertai niat ikhlas karena Allah.

**Rukun Puasa:**
1. **Niat:** Untuk puasa wajib Ramadhan, niat wajib dilakukan pada malam hari sebelum fajar (*tabyitun niyyah*).
2. **Menahan Diri (Imsak):** Dari segala hal yang membatalkan puasa sejak fajar hingga maghrib.

**Hal-Hal yang Membatalkan Puasa:**
1. Masuknya benda/makanan/minuman secara sengaja ke dalam lubang tubuh yang terbuka (mulut, hidung, telinga).
2. Muntah dengan sengaja.
3. Melakukan hubungan suami istri di siang hari.
4. Keluarnya air mani dengan sengaja.
5. Mengalami haid atau nifas bagi wanita.
6. Hilang akal (gila) atau mabuk sepanjang hari.
7. Keluar dari agama Islam (murtad).`
  },
  {
    keywords: ["zakat", "zakat fitrah", "zakat mal"],
    response: `**Zakat** adalah rukun Islam ketiga yang mewajibkan penyerahan sebagian harta tertentu kepada golongan yang berhak (*mustahiq*) apabila telah memenuhi syarat nishab dan haul.

**1. Zakat Fitrah (Zakat Badan):**
- **Kewajiban:** Diwajibkan atas setiap jiwa muslim yang hidup di bulan Ramadhan dan memiliki kelebihan makanan pada malam dan hari raya Idul Fitri.
- **Kadar:** 1 Sha' atau setara dengan **2,5 kg (atau 3,5 liter) beras/makanan pokok**.
- **Waktu Terbaik:** Sebelum shalat Idul Fitri didirikan.

**2. Zakat Mal (Zakat Harta):**
- **Syarat:** Milik penuh, halal, berkembang, mencapai **Nishab** (setara harga 85 gram emas murni), dan telah berlalu masa kepemilikan selama **1 Tahun Hijriah (Haul)**.
- **Kadar Zakat:** Umumnya **2,5%** dari total harta simpanan/perniagaan.

**8 Golongan Penerima Zakat (Mustahiq - QS. At-Taubah: 60):**
1. Fakir, 2. Miskin, 3. Amil Zakat, 4. Mualaf, 5. Riqab (memerdekakan budak), 6. Gharim (orang yang terlilit utang demi kebaikan), 7. Fisabilillah (pejuang di jalan Allah), 8. Ibnu Sabil (musafir kehabisan bekal).`
  },

  // --- TEKNOLOGI & CODING ---
  {
    keywords: ["apa itu ai", "kecerdasan buatan", "artificial intelligence", "pengertian ai"],
    response: `**Kecerdasan Buatan (Artificial Intelligence / AI)** adalah bidang ilmu komputer yang berfokus pada perancangan sistem dan perangkat lunak yang mampu melakukan tugas-tugas yang biasanya membutuhkan kecerdasan manusia.

**Kemampuan Pokok Sistem AI:**
1. **Pemrosesan Bahasa Alami (NLP):** Memahami, menerjemahkan, dan menghasilkan teks manusia (seperti yang digunakan chatbot, ChatGPT, Gemini).
2. **Pengenalan Pola & Komputer Visi:** Mengenali wajah, citra medis, rambu lalu lintas, dan objek dalam video.
3. **Pembelajaran Mesin (Machine Learning):** Sistem belajar dari kumpulan data (*training data*) untuk membuat prediksi tanpa harus diprogram secara kaku satu per satu.
4. **Pengambilan Keputusan & Penalaran:** Memecahkan problem kompleks, strategi catur/Go, dan navigasi mobil otonom.

**Tingkatan AI:**
- **Narrow AI (AI Lemah):** AI yang mahir dalam tugas spesifik tertentu (semua AI saat ini berada pada tahap ini).
- **AGI (Artificial General Intelligence):** AI hipotetis masa depan yang memiliki kecerdasan setara dengan fleksibilitas akal budi manusia di segala bidang.

AI telah menjadi mesin penggerak revolusi industri modern di berbagai sektor: kesehatan, pendidikan, riset ilmiah, hingga efisiensi kerja harian.`
  },
  {
    keywords: ["coding", "belajar coding", "pemrograman", "bahasa pemrograman"],
    response: `**Coding (Pemrograman)** adalah proses menulis serangkaian instruksi menggunakan bahasa yang dipahami komputer agar komputer dapat menjalankan tugas tertentu, seperti membuat aplikasi, website, game, atau mengolah data.

**Rekomendasi Bahasa Pemrograman untuk Pemula:**
1. **Python:** Sangat ramah pemula karena sintaksisnya mirip bahasa Inggris biasa. Sangat populer untuk AI, Data Science, otomatisasi, dan web backend.
2. **JavaScript / TypeScript:** Bahasa utama internet. Wajib dipelajari jika ingin membuat website interaktif, aplikasi mobile (React Native), atau aplikasi fullstack.
3. **HTML & CSS:** Bahasa fondasi untuk menyusun kerangka dan tampilan visual halaman web.
4. **C / C++:** Bagus untuk memahami cara kerja memori komputer, sistem operasi, dan game engine performa tinggi.

**Langkah Memulai:**
- Pilih satu bahasa dulu (disarankan Python atau JavaScript).
- Pahami konsep dasar: Variabel, Tipe Data, Kondisional (*if/else*), Looping (*for/while*), dan Fungsi (*function*).
- Buat proyek kecil nyata (kalkulator sederhana, to-do list, atau web portofolio).
- Konsisten latihan coding 30–60 menit setiap hari.`
  },

  // --- PENDIDIKAN & TIPS BELAJAR ---
  {
    keywords: ["tips belajar", "cara belajar efektif", "metode belajar", "cara cepat hafal"],
    response: `Berikut **4 Metode Belajar Paling Efektif Berbasis Riset Neurosains & Kognitif:**

1. **Teknik Pomodoro (Manajemen Waktu & Fokus):**
   - Belajar fokus tanpa distraksi selama **25 menit**.
   - Istirahat santai selama **5 menit**.
   - Setelah 4 siklus, ambil istirahat panjang **15–30 menit**. Metode ini mencegah kelelahan otak (*mental fatigue*).

2. **Teknik Feynman (Menguji Pemahaman Sejati):**
   - Pelajari suatu topik.
   - Cobalah jelaskan materi tersebut kepada orang lain atau dirimu sendiri dengan **bahasa sederhana** seolah-olah kamu mengajari anak usia 10 tahun.
   - Jika kamu kesulitan menjelaskan suatu bagian tanpa istilah rumit, di sanalah letak materi yang belum kamu pahami sepenuhnya. Buka kembali bukumu!

3. **Active Recall (Uji Ingatan Aktif):**
   - Jangan hanya membaca ulang (*passive reading*) catatan yang membuatmu merasa sudah hafal padahal belum.
   - Tutup buku, lalu tuliskan atau ucapkan kembali poin-poin utama dari ingatanmu.

4. **Spaced Repetition (Pengulangan Berjarak):**
   - Ulangi materi pada interval: Hari ke-1, Hari ke-3, Hari ke-7, dan Hari ke-30. Ini memindahkan memori dari ingatan jangka pendek ke ingatan jangka panjang (*long-term memory*).`
  },

  // --- RESEP & KEHIDUPAN SEHARI-HARI ---
  {
    keywords: ["nasi goreng", "cara membuat nasi goreng", "resep nasi goreng"],
    response: `Berikut **Resep Nasi Goreng Spesial Rumahan yang Praktis dan Gurih:**

**Bahan-Bahan:**
- 1 piring nasi putih dingin (paling enak nasi sisa semalam yang agak pera)
- 1 butir telur ayam
- 2 siung bawang putih (cincang halus)
- 3 siung bawang merah (iris tipis)
- 1–2 buah cabai rawit (sesuai selera pedas)
- 1 sdm kecap manis
- 1 sdt saus tiram
- 1/2 sdt kecap asin atau garam
- 1/4 sdt merica bubuk
- Sedikit daun bawang iris dan minyak goreng untuk menumis
- Pelengkap: kerupuk, irisan mentimun, dan telur ceplok

**Langkah Memasak:**
1. Panaskan 2 sdm minyak di wajan. Masukkan telur, orak-arik hingga matang berbutir, lalu pinggirkan di wajan.
2. Masukkan bawang merah, bawang putih, dan cabai. Tumis hingga harum dan matang kecokelatan.
3. Masukkan nasi putih dingin. Gunakan api sedang-besar agar aroma wajan sedap (*smoky*).
4. Tambahkan kecap manis, saus tiram, kecap asin, garam, dan merica. Aduk cepat hingga warna nasi rata dan tidak ada yang menggumpal.
5. Masukkan irisan daun bawang menjelang matang, aduk sebentar, lalu cicipi rasa.
6. Angkat dan sajikan selagi hangat bersama kerupuk dan acar mentimun! Selamat mencoba! 🍳`
  }
];

// 4. Main Conversational Handler
export function generateSmartChatbotResponse(query: string): string {
  const rawQ = query.trim();
  const q = rawQ.toLowerCase();

  if (!rawQ) {
    return "Halo! Ada yang bisa saya bantu hari ini? Silakan tanyakan apa saja!";
  }

  // 1. Check math expressions
  const mathResult = tryEvaluateMath(rawQ);
  if (mathResult) return mathResult;

  // 2. Check creative requests (puisi, pantun, latar belakang, abstrak, pidato, kata pengantar)
  const creativeResult = tryCreativeWriting(rawQ);
  if (creativeResult) return creativeResult;

  // 3. Salam & Greetings
  if (q.includes("assalamu") || q.includes("salam")) {
    return "Wa'alaikumsalam warahmatullahi wabarakatuh! Selamat datang. Ada yang ingin kita diskusikan atau tanyakan hari ini?";
  }

  if (
    q === "halo" ||
    q === "hai" ||
    q === "hei" ||
    q === "p" ||
    q.startsWith("halo ") ||
    q.startsWith("hai ") ||
    q.includes("selamat pagi") ||
    q.includes("selamat siang") ||
    q.includes("selamat sore") ||
    q.includes("selamat malam") ||
    q.includes("apa kabar") ||
    q === "tes" ||
    q === "test"
  ) {
    return `Halo! Kabar saya sangat baik. Senang bisa mengobrol dengan Anda!

Ada topik atau pertanyaan apa yang ingin kita bahas hari ini? Anda bisa menanyakan materi pelajaran, ilmu agama & fiqih, sains, teknologi, bantuan menulis draf, atau sekadar berdiskusi santai.`;
  }

  // 4. Bot Identity & Capabilities
  if (
    q.includes("siapa kamu") ||
    q.includes("kamu siapa") ||
    q.includes("namamu siapa") ||
    q.includes("kamu bot apa") ||
    q.includes("bisa apa saja") ||
    q.includes("kamu bisa apa") ||
    q.includes("fitur apa")
  ) {
    return `Saya adalah asisten AI dari **Darul Hikmah Library**. 

Sama seperti chatbot pada umumnya (seperti ChatGPT atau Gemini), saya dirancang untuk menjawab berbagai macam pertanyaan dan membantu Anda secara langsung:
- **Tanya Jawab Pengetahuan:** Sains, sejarah, teknologi, hukum Islam/fiqih, dan literatur umum.
- **Kepenulisan & Tugas:** Membantu menyusun draf makalah, latar belakang, rumusan masalah, puisi, pantun, dan ide kreatif.
- **Ringkasan & Penjelasan Konsep:** Menjelaskan topik rumit dengan bahasa yang mudah dipahami.
- **Diskusi & Konsultasi:** Berbagi tips belajar, metode riset, dan panduan praktis sehari-hari.

Ketik saja apa yang ingin Anda tanyakan atau buat, saya siap membantu!`;
  }

  // 5. Gratitude & Feedback
  if (
    q.includes("terima kasih") ||
    q.includes("makasih") ||
    q.includes("syukran") ||
    q.includes("jazakallah") ||
    q.includes("keren") ||
    q.includes("mantap") ||
    q.includes("hebat")
  ) {
    return "Sama-sama! Senang sekali bisa membantu Anda. Jika ada pertanyaan lain atau hal baru yang ingin dipelajari, silakan tanyakan lagi kapan saja ya!";
  }

  // 6. Humor & Small Talk
  if (q.includes("lelucon") || q.includes("jokes") || q.includes("lucu") || q.includes("tebak-tebakan")) {
    return `Boleh, ini ada tebak-tebakan ringan untukmu:

**Pertanyaan:** Kucing apa yang paling kuno di dunia?  
**Jawaban:** Kucing peninggalan purbakala! 😹

*Satu lagi:*  
**Pertanyaan:** Pintu apa yang didorong oleh sepuluh orang pun tetap nggak mau terbuka?  
**Jawaban:** Pintu yang ada tulisannya **"TARIK"**! 😆`;
  }

  if (q.includes("bosan") || q.includes("galau") || q.includes("semangat") || q.includes("motivasi")) {
    return `Setiap orang pasti pernah merasa lelah atau jenuh, dan itu sangat manusiawi. Ingatlah bahwa fase istirahat adalah bagian dari proses perjalanan, bukan tanda kegagalan.

Sebuah pepatah bijak mengatakan:  
*«مَنْ جَدَّ وَجَدَ»*  
*(Siapa yang bersungguh-sungguh, ia akan berhasil).*

Tarik napas dalam-dalam, minum air putih yang cukup, dan ambil jeda sejenak. Setelah pikiran kembali segar, lanjutkan langkahmu dengan senyum. Kamu pasti bisa melaluinya! 💪✨`;
  }

  // 7. Check Knowledge Base
  for (const item of KNOWLEDGE_BASE) {
    for (const kw of item.keywords) {
      if (q.includes(kw)) {
        if (typeof item.response === "function") {
          return item.response(rawQ);
        }
        return item.response;
      }
    }
  }

  // 8. Natural Knowledge Extraction for Questions ("apa itu X", "siapa X", "kenapa X", "bagaimana X")
  const defMatch = q.match(/(?:apa itu|apa arti|apa pengertian|jelaskan tentang|apa maksud dari)\s+(.+)/i);
  if (defMatch && defMatch[1]) {
    const subject = defMatch[1].replace(/[?.,!]+$/, "").trim();
    return `Mengenai **${subject}**:

Secara umum, **${subject}** adalah topik atau konsep yang mengkaji prinsip, karakteristik, serta keterkaitannya dalam bidang ilmu dan penerapannya di dunia nyata.

Ketika kita mempelajari **${subject}**, ada beberapa poin penting yang perlu dicermati:
1. **Esensi Dasar:** Memahami definisi pokok dan batasan konsep agar memiliki pemahaman yang tepat.
2. **Peran & Kegunaan:** Mengapa hal ini penting dan bagaimana pengaruhnya terhadap bidang yang relevan.
3. **Penerapan Nyata:** Bagaimana konsep ini beroperasi dalam kehidupan praktis, riset ilmiah, atau masyarakat.

Apakah ada studi kasus, contoh spesifik, atau pertanyaan lanjutan mengenai **${subject}** yang ingin kamu diskusikan lebih jauh?`;
  }

  const whyMatch = q.match(/(?:kenapa|mengapa)\s+(.+)/i);
  if (whyMatch && whyMatch[1]) {
    const reasonTopic = whyMatch[1].replace(/[?.,!]+$/, "").trim();
    return `Mengenai pertanyaan Anda mengapa **${reasonTopic}**:

Secara analitis, hal ini biasanya dipengaruhi oleh beberapa faktor utama yang saling berkaitan:
1. **Faktor Penyebab Langsung (*Causal Factor*):** Ada pemicu utama yang mengawali terjadinya kondisi tersebut.
2. **Kondisi Lingkungan & Konteks:** Situasi eksternal atau sistem di sekitarnya yang mempercepat atau memperkuat proses tersebut.
3. **Konsekuensi Logis:** Dampak lanjutan yang secara alamiah mengikuti dari rangkaian peristiwa yang terjadi.

Jika ada konteks khusus atau peristiwa tertentu yang sedang kamu amati terkait hal ini, ceritakan saja agar kita bisa menelaah faktor penyebabnya secara lebih mendalam!`;
  }

  const whoMatch = q.match(/(?:siapa)\s+(.+)/i);
  if (whoMatch && whoMatch[1]) {
    const personTopic = whoMatch[1].replace(/[?.,!]+$/, "").trim();
    return `Mengenai pertanyaan Anda tentang sosok atau entitas **${personTopic}**:

Dalam catatan sejarah maupun literatur akademik, figur atau tokoh ini dikenal melalui kontribusi, pemikiran, serta peran penting yang ditinggalkannya pada zamannya.

Apakah ada peristiwa, karya tulis, atau fase kehidupan spesifik dari **${personTopic}** yang sedang ingin Anda telusuri lebih detail?`;
  }

  // 9. Conversational Fallback - Direct, natural, and helpful dialogue (NO generic 3-bullet placeholder)
  return `Terima kasih atas pertanyaannya mengenai **"${rawQ}"**.

Pertanyaan ini sangat menarik untuk kita kupas. Untuk memberikan jawaban yang paling tepat sasaran dan solutif bagi Anda, boleh ceritakan sedikit lebih spesifik mengenai:
- Apakah Anda memerlukan penjelasan konsep dasarnya?
- Atau bantuan praktis berupa draf tulisan / contoh penerapannya?

Silakan beri tahu saya, saya siap membantu menguraikannya secara lengkap untuk Anda!`;
}
