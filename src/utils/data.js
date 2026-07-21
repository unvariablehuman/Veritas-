/* ==============================================
   KepoMaps — Content data (myths vs facts)
   All content in Bahasa Indonesia. Mixed categories.
   ============================================== */

export const KEPO_CATEGORIES = [
  { id: "tech",     name: "Teknologi",  emoji: "💾", color: "#00F0FF" },
  { id: "health",   name: "Kesehatan",  emoji: "🩺", color: "#7CFFB2" },
  { id: "science",  name: "Sains",      emoji: "🧪", color: "#B892FF" },
  { id: "history",  name: "Sejarah",    emoji: "🏛️", color: "#FFD700" },
  { id: "culture",  name: "Budaya",     emoji: "🎭", color: "#FF2A6D" },
];

/**
 * Learning Path: 8 nodes, mixed categories, rich flavor.
 * Each level references a set of question IDs.
 */
export const KEPO_LEVELS = [
  {
    id: 1,
    title: "Veritas Basic",
    subtitle: "Mitos yang Semua Orang Percaya",
    category: "tech",
    boss: "Si Layar Berbahaya",
    color: "#00F0FF",
    xp: 60,
    questions: ["q_tech_1", "q_health_1", "q_science_1"],
  },
  {
    id: 2,
    title: "Layar & Otak",
    subtitle: "Zona Mitos Teknologi",
    category: "tech",
    boss: "Radiasi Ponsel",
    color: "#00F0FF",
    xp: 75,
    questions: ["q_tech_2", "q_tech_3", "q_tech_4"],
  },
  {
    id: 3,
    title: "Tubuh & Rutinitas",
    subtitle: "Kesehatan Sehari-hari",
    category: "health",
    boss: "8 Gelas Air",
    color: "#7CFFB2",
    xp: 85,
    questions: ["q_health_2", "q_health_3", "q_health_4"],
  },
  {
    id: 4,
    title: "Sains Populer",
    subtitle: "Yang Kita Kira Benar di Sekolah",
    category: "science",
    boss: "10% Otak",
    color: "#B892FF",
    xp: 95,
    questions: ["q_science_2", "q_science_3", "q_science_4"],
  },
  {
    id: 5,
    title: "Lorong Sejarah",
    subtitle: "Cerita yang Dibengkokkan Waktu",
    category: "history",
    boss: "Tembok Cina dari Bulan",
    color: "#FFD700",
    xp: 110,
    questions: ["q_history_1", "q_history_2", "q_history_3"],
  },
  {
    id: 6,
    title: "Budaya Nusantara",
    subtitle: "Antara Mitos Lokal & Fakta",
    category: "culture",
    boss: "Pantangan Kuno",
    color: "#FF2A6D",
    xp: 120,
    questions: ["q_culture_1", "q_culture_2", "q_culture_3"],
  },
  {
    id: 7,
    title: "AI & Masa Depan",
    subtitle: "Ketakutan vs Kenyataan Teknologi",
    category: "tech",
    boss: "AI Ganti Semua Kerjaan",
    color: "#00F0FF",
    xp: 140,
    questions: ["q_tech_5", "q_tech_6", "q_science_5"],
  },
  {
    id: 8,
    title: "Ultimate Mitos Buster",
    subtitle: "Boss Fight Terakhir",
    category: "mixed",
    boss: "Raja Hoaks",
    color: "#FF2A6D",
    xp: 200,
    questions: ["q_health_5", "q_tech_7", "q_science_6", "q_history_4", "q_culture_4"],
  },
];

/**
 * Question bank. Each item:
 *  - claim: kalimat yang harus dinilai user
 *  - answer: "myth" | "fact"
 *  - explain: penjelasan singkat
 *  - source: referensi ringkas
 */
export const KEPO_QUESTIONS = {
  // === TECHNOLOGY ===
  q_tech_1: {
    id: "q_tech_1",
    category: "tech",
    claim: "Menaruh magnet di dekat harddisk laptop kamu akan menghapus semua datanya seketika.",
    answer: "myth",
    explain: "Magnet konsumen sehari-hari (kulkas, speaker kecil) TERLALU LEMAH untuk merusak HDD modern, apalagi SSD yang tidak pakai piringan magnetik. Butuh magnet neodymium industrial yang menempel langsung.",
    source: "Kensington Storage Study",
  },
  q_tech_2: {
    id: "q_tech_2",
    category: "tech",
    claim: "Mengisi daya HP semalaman merusak baterainya secara permanen.",
    answer: "myth",
    explain: "Smartphone modern punya chip pengatur daya yang otomatis berhenti mengisi setelah 100%. Yang benar-benar merusak baterai adalah suhu panas berlebihan dan siklus discharge ke 0%.",
    source: "Battery University",
  },
  q_tech_3: {
    id: "q_tech_3",
    category: "tech",
    claim: "Mode incognito/private browsing membuat aktivitasmu benar-benar anonim di internet.",
    answer: "myth",
    explain: "Mode incognito hanya menyembunyikan riwayat di perangkatmu. ISP, tempat kerja, sekolah, dan website tetap bisa melihat aktivitas. Untuk anonimitas nyata butuh VPN + Tor + kebiasaan yang benar.",
    source: "Google Chrome Docs",
  },
  q_tech_4: {
    id: "q_tech_4",
    category: "tech",
    claim: "Sinyal WiFi rumah menyebabkan gangguan tidur pada manusia.",
    answer: "myth",
    explain: "WHO menyatakan tidak ada bukti ilmiah bahwa sinyal WiFi (radiasi non-ionizing daya rendah) mengganggu tidur. Yang mengganggu adalah cahaya biru dari layar dan notifikasi HP di malam hari.",
    source: "WHO Fact Sheet",
  },
  q_tech_5: {
    id: "q_tech_5",
    category: "tech",
    claim: "AI generatif seperti ChatGPT bisa 'berpikir' dan memahami arti kata seperti manusia.",
    answer: "myth",
    explain: "LLM adalah model statistik super besar yang memprediksi token berikutnya. Ia tidak 'memahami' dalam arti manusia; ia menghitung probabilitas urutan kata dari triliunan contoh.",
    source: "Stanford HAI",
  },
  q_tech_6: {
    id: "q_tech_6",
    category: "tech",
    claim: "Password panjang dengan campuran huruf besar-kecil, angka, dan simbol (misal 'P@$$w0rd!') lebih aman daripada 4 kata acak (misal 'kudabiruterbanglurus').",
    answer: "myth",
    explain: "Menurut NIST 2020+, panjang > kompleksitas. 'Passphrase' 4 kata acak menghasilkan entropi jauh lebih tinggi dan sulit dibrute-force, sekaligus lebih mudah diingat.",
    source: "NIST SP 800-63B",
  },
  q_tech_7: {
    id: "q_tech_7",
    category: "tech",
    claim: "Menutup aplikasi background di HP secara paksa membuat baterai jadi lebih hemat.",
    answer: "myth",
    explain: "Justru sebaliknya. iOS & Android sudah punya manajemen memori yang efisien. Menutup paksa lalu membuka lagi memaksa aplikasi 'cold start' yang lebih boros daya dan RAM.",
    source: "Apple Support / Google Android Team",
  },

  // === HEALTH ===
  q_health_1: {
    id: "q_health_1",
    category: "health",
    claim: "Retak jari (crack knuckles) menyebabkan radang sendi (arthritis) di masa tua.",
    answer: "myth",
    explain: "Studi 60 tahun oleh Dr. Donald Unger (Ig Nobel 2009) & penelitian modern lainnya menemukan tidak ada hubungan antara membunyikan jari dengan arthritis. Suara itu berasal dari gelembung gas di cairan sinovial.",
    source: "Journal of American Board of Family Medicine",
  },
  q_health_2: {
    id: "q_health_2",
    category: "health",
    claim: "Minum 8 gelas air per hari adalah aturan kesehatan wajib untuk semua orang.",
    answer: "myth",
    explain: "Angka '8 gelas' tidak punya dasar ilmiah pasti. Kebutuhan cairan bergantung pada berat badan, aktivitas, iklim, dan makanan (buah/sup sudah mengandung banyak air). Ikuti rasa haus.",
    source: "Harvard T.H. Chan School",
  },
  q_health_3: {
    id: "q_health_3",
    category: "health",
    claim: "Berendam air dingin (cold plunge) segera setelah olahraga berat mengurangi nyeri otot dan mempercepat pemulihan.",
    answer: "fact",
    explain: "Meta-analisis 2022 menunjukkan cold water immersion (10-15°C, 10-15 menit) mengurangi DOMS dan peradangan pasca-latihan intensif. Namun bisa mengurangi hipertrofi otot jika terlalu sering.",
    source: "Sports Medicine Journal",
  },
  q_health_4: {
    id: "q_health_4",
    category: "health",
    claim: "Makan wortel banyak-banyak bisa memperbaiki penglihatan sampai tidak butuh kacamata.",
    answer: "myth",
    explain: "Wortel mengandung beta-karoten yang memang penting untuk kesehatan mata, tapi TIDAK bisa mengoreksi rabun jauh/dekat. Mitos ini berasal dari propaganda PD-II Inggris untuk menyembunyikan teknologi radar.",
    source: "Smithsonian Magazine",
  },
  q_health_5: {
    id: "q_health_5",
    category: "health",
    claim: "Tidur siang selama 20-30 menit meningkatkan performa kognitif dan mood secara signifikan.",
    answer: "fact",
    explain: "Power nap 20-30 menit terbukti meningkatkan alertness, memori kerja, dan mood tanpa menimbulkan 'sleep inertia'. Nap > 30 menit bisa membuatmu justru lebih lelah.",
    source: "NASA Ames Research",
  },

  // === SCIENCE ===
  q_science_1: {
    id: "q_science_1",
    category: "science",
    claim: "Emas 24 karat adalah logam paling murni yang bisa ditempa jadi perhiasan tahan lama.",
    answer: "myth",
    explain: "Emas 24k memang paling murni (99.9%) tapi SANGAT lunak, mudah tergores dan berubah bentuk. Karena itu perhiasan biasanya 18k atau 22k, dicampur logam lain agar kuat.",
    source: "World Gold Council",
  },
  q_science_2: {
    id: "q_science_2",
    category: "science",
    claim: "Manusia hanya menggunakan 10% dari kapasitas otaknya.",
    answer: "myth",
    explain: "Mitos ini populer di film Hollywood. Faktanya scan fMRI & PET menunjukkan seluruh area otak aktif dalam 24 jam, meski tidak semuanya sekaligus. Setiap area punya fungsinya sendiri.",
    source: "Scientific American",
  },
  q_science_3: {
    id: "q_science_3",
    category: "science",
    claim: "Petir tidak pernah menyambar tempat yang sama dua kali.",
    answer: "myth",
    explain: "Empire State Building tersambar petir ~25 kali per tahun. Petir cenderung memilih titik tertinggi dan konduktif — jadi menara, gedung tinggi, dan pohon besar sering tersambar berkali-kali.",
    source: "NOAA National Weather Service",
  },
  q_science_4: {
    id: "q_science_4",
    category: "science",
    claim: "Bulan selalu menunjukkan sisi yang sama ke Bumi karena tidak berputar pada porosnya.",
    answer: "myth",
    explain: "Bulan tetap berputar pada porosnya, tapi kecepatan rotasinya sama persis dengan kecepatan orbit mengelilingi Bumi (tidal locking). Efeknya, sisi yang sama selalu menghadap kita.",
    source: "NASA Solar System",
  },
  q_science_5: {
    id: "q_science_5",
    category: "science",
    claim: "Air panas membeku lebih cepat daripada air dingin dalam kondisi tertentu.",
    answer: "fact",
    explain: "Ini disebut 'Efek Mpemba' — fenomena kontroversial tapi tereplikasi dalam beberapa eksperimen. Faktor evaporasi, konveksi, dan gas terlarut berperan. Belum ada penjelasan tunggal yang final.",
    source: "Physical Review Letters",
  },
  q_science_6: {
    id: "q_science_6",
    category: "science",
    claim: "Air panas mendidih pada suhu 100°C di mana pun di Bumi.",
    answer: "myth",
    explain: "100°C hanya berlaku di permukaan laut (1 atm). Di puncak Everest air mendidih pada ~68°C karena tekanan udara lebih rendah. Karena itu masak nasi di gunung lebih lama & mentah di dalam.",
    source: "Britannica Physics",
  },

  // === HISTORY ===
  q_history_1: {
    id: "q_history_1",
    category: "history",
    claim: "Tembok Besar China adalah satu-satunya struktur buatan manusia yang bisa dilihat dari luar angkasa.",
    answer: "myth",
    explain: "Astronot dari berbagai misi (termasuk Yang Liwei dari China sendiri) mengonfirmasi Tembok Besar TIDAK terlihat dari orbit rendah tanpa alat bantu. Struktur yang lebih terlihat adalah kota, jalan raya, dan piramida.",
    source: "NASA / Chinese Space Program",
  },
  q_history_2: {
    id: "q_history_2",
    category: "history",
    claim: "Bangsa Viking kuno benar-benar memakai helm bertanduk saat berperang.",
    answer: "myth",
    explain: "Tidak satu pun helm Viking asli yang ditemukan arkeolog memiliki tanduk. Citra ini datang dari kostum opera 'Der Ring des Nibelungen' (1876) karya Wagner. Helm asli mereka bulat sederhana.",
    source: "National Museum of Denmark",
  },
  q_history_3: {
    id: "q_history_3",
    category: "history",
    claim: "Napoleon Bonaparte adalah pria yang sangat pendek untuk ukuran zamannya.",
    answer: "myth",
    explain: "Napoleon tingginya sekitar 1.68m — rata-rata pria Prancis abad ke-18. Mitos 'pendek' muncul dari propaganda Inggris dan kebingungan konversi kaki Prancis vs Inggris.",
    source: "Napoleonic Historical Society",
  },
  q_history_4: {
    id: "q_history_4",
    category: "history",
    claim: "Kota Pompeii dilupakan total selama 1500 tahun setelah letusan Vesuvius sebelum ditemukan kembali.",
    answer: "fact",
    explain: "Letusan tahun 79 M mengubur Pompeii di bawah lapisan abu ~6 meter. Kota ini benar-benar hilang dari peta hingga ditemukan tidak sengaja tahun 1748 oleh insinyur Spanyol.",
    source: "UNESCO World Heritage",
  },

  // === CULTURE ===
  q_culture_1: {
    id: "q_culture_1",
    category: "culture",
    claim: "Duduk di depan pintu bisa membuatmu susah jodoh menurut kepercayaan Jawa.",
    answer: "myth",
    explain: "Ini kepercayaan lokal tanpa dasar ilmiah. Kemungkinan besar berasal dari pesan sopan santun praktis (menghalangi orang lewat) yang dibungkus sebagai 'pamali' agar anak-anak menurut.",
    source: "Folklore Studies UGM",
  },
  q_culture_2: {
    id: "q_culture_2",
    category: "culture",
    claim: "Batik Indonesia diakui sebagai Warisan Budaya Takbenda Kemanusiaan oleh UNESCO pada tahun 2009.",
    answer: "fact",
    explain: "Pada 2 Oktober 2009, UNESCO resmi memasukkan Batik Indonesia ke daftar Representative List of the Intangible Cultural Heritage of Humanity. Karena itu 2 Oktober jadi Hari Batik Nasional.",
    source: "UNESCO ICH List",
  },
  q_culture_3: {
    id: "q_culture_3",
    category: "culture",
    claim: "Kata 'Amuk' dalam kamus bahasa Inggris berasal dari kata Melayu/Indonesia.",
    answer: "fact",
    explain: "Kata 'amok' dan 'run amok' dalam Bahasa Inggris berasal dari 'amuk' dalam Bahasa Melayu, merujuk fenomena kekerasan tiba-tiba yang tercatat oleh penjelajah Eropa di Nusantara sejak abad ke-16.",
    source: "Oxford English Dictionary",
  },
  q_culture_4: {
    id: "q_culture_4",
    category: "culture",
    claim: "Wayang kulit hanya dimainkan pada malam hari dan dilarang dipertunjukkan pada siang hari secara adat.",
    answer: "myth",
    explain: "Meskipun tradisional dipentaskan malam, tidak ada larangan adat baku. Ada versi wayang siang (wayang santri, ruwatan) dan pertunjukan singkat siang hari. Preferensi malam murni karena efek dramatis cahaya kelir.",
    source: "Puppetry Journal ISI Yogya",
  },
};

/**
 * Fact library — kartu-kartu terpisah untuk halaman /library/
 */
export const KEPO_LIBRARY = [
  {
    icon: "☕",
    category: "health",
    title: "Kopi itu Dehidrasi?",
    verdict: "myth",
    text: "Kafein memang diuretik ringan, tapi total cairan dari secangkir kopi tetap positif. Kamu tetap terhidrasi.",
  },
  {
    icon: "🍫",
    category: "health",
    title: "Cokelat Bikin Jerawat",
    verdict: "myth",
    text: "Studi Journal of American Academy of Dermatology tidak menemukan hubungan langsung cokelat murni & jerawat. Yang jahat: gula & susu tinggi.",
  },
  {
    icon: "🍎",
    category: "science",
    title: "Newton & Apel Jatuh",
    verdict: "fact",
    text: "Kisah apel jatuh benar-benar diceritakan Newton sendiri kepada William Stukeley pada 1726 — meski apel tidak pernah 'kena kepala'.",
  },
  {
    icon: "🐧",
    category: "science",
    title: "Penguin Setia Seumur Hidup",
    verdict: "myth",
    text: "Kebanyakan spesies penguin ganti pasangan tiap musim kawin. Hanya beberapa spesies (misal Gentoo) yang cenderung monogami jangka panjang.",
  },
  {
    icon: "🔋",
    category: "tech",
    title: "Simpan Baterai di Kulkas",
    verdict: "myth",
    text: "Menyimpan baterai alkaline atau Li-ion di kulkas justru bisa menyebabkan kondensasi & korosi terminal. Simpan di suhu ruang sejuk kering.",
  },
  {
    icon: "🌙",
    category: "science",
    title: "Bulan Purnama Bikin Gila",
    verdict: "myth",
    text: "Meta-analisis besar tidak menemukan korelasi antara fase bulan dan perilaku manusia. Ilusi ini disebut 'lunar effect'.",
  },
  {
    icon: "🌡️",
    category: "health",
    title: "Kedinginan Bikin Flu",
    verdict: "myth",
    text: "Flu disebabkan virus, bukan cuaca dingin. Tapi udara dingin+kering membuat mukosa hidung kurang efektif menahan virus.",
  },
  {
    icon: "📶",
    category: "tech",
    title: "5G Menyebarkan Virus",
    verdict: "myth",
    text: "Virus adalah entitas biologis, mustahil menyebar via gelombang radio. WHO dan seluruh komunitas ilmiah sudah membantah klaim ini berkali-kali.",
  },
  {
    icon: "🍜",
    category: "culture",
    title: "Rendang Butuh 4-8 Jam",
    verdict: "fact",
    text: "Rendang autentik Minang memang dimasak 4-8 jam agar santan mengering total & bumbu menyerap. Karena itu rendang bisa awet berhari-hari tanpa kulkas.",
  },
  {
    icon: "🦈",
    category: "science",
    title: "Hiu Tidak Hamil",
    verdict: "myth",
    text: "Hiu bisa terkena kanker. Mitos ini dipopulerkan industri suplemen tulang rawan hiu di era 90an. Justru menyebabkan populasi hiu turun drastis.",
  },
  {
    icon: "🏛️",
    category: "history",
    title: "Gladiator Selalu Mati",
    verdict: "myth",
    text: "Sebagian besar pertarungan gladiator TIDAK berakhir dengan kematian. Mereka adalah aset investasi mahal — mati satu = rugi besar bagi pemiliknya.",
  },
  {
    icon: "🚿",
    category: "health",
    title: "Mandi Malam Bikin Rematik",
    verdict: "myth",
    text: "Rematik / arthritis disebabkan autoimun, genetik, dan usia — bukan mandi malam. Yang benar: air dingin ke otot tegang bisa terasa nyeri sementara.",
  },
];

/**
 * Achievement badges
 */
export const KEPO_BADGES = [
  { id: "first_step",     name: "Langkah Pertama",  desc: "Selesaikan Level 1",        icon: "🚀", condition: (s) => s.completedLevels.includes(1) },
  { id: "tech_hunter",    name: "Tech Hunter",       desc: "Selesaikan 2 level tech",   icon: "💾", condition: (s) => s.completedLevels.filter(id => (KEPO_LEVELS.find(l=>l.id===id)?.category==="tech")).length >= 2 },
  { id: "health_guru",    name: "Health Guru",       desc: "Selesaikan level Kesehatan", icon: "🩺", condition: (s) => s.completedLevels.includes(3) },
  { id: "streak_5",       name: "Streak 5",          desc: "5 jawaban benar beruntun",  icon: "🔥", condition: (s) => s.bestStreak >= 5 },
  { id: "streak_10",      name: "Streak Mesin",      desc: "10 jawaban benar beruntun", icon: "⚡", condition: (s) => s.bestStreak >= 10 },
  { id: "history_buff",   name: "Time Traveler",     desc: "Selesaikan Lorong Sejarah", icon: "🏛️", condition: (s) => s.completedLevels.includes(5) },
  { id: "culture_lover",  name: "Sahabat Nusantara", desc: "Selesaikan Budaya Nusantara", icon: "🎭", condition: (s) => s.completedLevels.includes(6) },
  { id: "final_boss",     name: "Raja Veritas",     desc: "Kalahkan Boss Terakhir",    icon: "👑", condition: (s) => s.completedLevels.includes(8) },
  { id: "xp_500",         name: "500 XP Club",       desc: "Kumpulkan 500 XP",          icon: "✨", condition: (s) => s.xp >= 500 },
  { id: "xp_1000",        name: "Grand Veritas",     desc: "Kumpulkan 1000 XP",         icon: "💎", condition: (s) => s.xp >= 1000 },
];
