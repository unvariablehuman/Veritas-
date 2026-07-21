import React, { useState, useEffect, useRef } from 'react';

const RESPONSES = [
  // Greetings
  { keys: ["halo", "hi", "hello", "hai", "hey"], reply: "Halo! Aku Veritas AI, asisten analis mitormu 🕵️ Tanya aku apa saja tentang mitos vs fakta, atau minta rekomendasi level!" },
  { keys: ["makasih", "terima kasih", "thanks", "thank"], reply: "Sama-sama! Tetap kritis dan kembangkan literasimu ya 💡" },
  { keys: ["siapa kamu", "kamu siapa", "kepo itu", "apa itu kepo"], reply: "Aku Veritas AI — asisten analis mitormu di Veritas+. Tugasku bantu kamu memverifikasi mitos & fakta yang beredar di masyarakat." },

  // How-to
  { keys: ["cara main", "gimana main", "aturan", "how to"], reply: "Main-nya gampang: (1) Pilih level di Learning Path, (2) Baca pernyataan di kartu 3D, (3) Tebak MITOS atau FAKTA, (4) Card akan flip & kasih penjelasan. Selesaikan level buat unlock berikutnya!" },
  { keys: ["xp", "level up", "poin"], reply: "Setiap jawaban benar dapat XP. Setiap level punya XP reward berbeda. Kumpulin XP buat lencana & rank 'Raja Veritas'! Lihat progress-mu di halaman Dashboard." },
  { keys: ["streak", "kill streak"], reply: "Streak = jumlah jawaban benar beruntun tanpa salah. Streak 5 dapat badge 🔥, streak 10 dapat ⚡. Jangan sampai putus ya!" },
  { keys: ["badge", "lencana", "achievement"], reply: "Ada 10 badge yang bisa kamu kumpulin — dari 'Langkah Pertama' 🚀 sampai 'Raja Veritas' 👑. Cek koleksimu di Dashboard!" },
  { keys: ["reset", "hapus data", "mulai ulang"], reply: "Buat reset progress, buka Dashboard → tombol 'Reset Progres' di pojok kanan bawah. Hati-hati, ga bisa di-undo!" },

  // Content specific — Tech
  { keys: ["magnet", "harddisk", "hdd"], reply: "Mitos populer: 'magnet menghapus harddisk'. Faktanya butuh magnet neodymium industrial. Magnet kulkas biasa terlalu lemah 😉" },
  { keys: ["baterai", "charge", "ngecas", "cas"], reply: "HP modern otomatis stop ngecas di 100%. Yang bikin baterai rusak: panas berlebihan & sering pakai sampai 0%. Bukan ngecas semalaman." },
  { keys: ["incognito", "private browsing", "anonim"], reply: "Mode incognito HANYA menyembunyikan riwayat lokal. ISP, kantor, sekolah tetap bisa lihat. Buat anonimitas nyata butuh VPN + Tor." },
  { keys: ["5g", "sinyal", "radiasi hp", "radiasi ponsel"], reply: "5G/WiFi = radiasi non-ionizing daya rendah. WHO menyatakan tidak ada bukti kausal ke kanker atau virus. Mitos '5G nyebar virus' itu 100% hoaks." },
  { keys: ["ai", "chatgpt", "artificial intelligence"], reply: "AI generatif itu model statistik super besar. Ia 'menebak' token berikutnya, bukan 'memahami' seperti manusia. Powerful, tapi bukan sadar." },

  // Content specific — Health
  { keys: ["8 gelas", "delapan gelas", "air putih"], reply: "'8 gelas per hari' bukan aturan universal. Kebutuhan cairan tergantung berat, aktivitas, iklim. Ikuti rasa haus & warna urin (kuning muda = cukup)." },
  { keys: ["wortel", "mata", "kacamata"], reply: "Wortel bagus buat kesehatan mata umum, tapi TIDAK bisa gantiin kacamata. Mitosnya dari propaganda perang Inggris tahun 1940an." },
  { keys: ["retak jari", "crack knuckles", "bunyi jari"], reply: "Membunyikan jari TIDAK menyebabkan arthritis. Dr. Unger membuktikannya dengan retak jari 1 tangan selama 60 tahun — hasilnya sama. (Ig Nobel 2009 🏅)" },
  { keys: ["cold plunge", "es", "berendam dingin"], reply: "Cold water immersion (10-15°C, 10-15 menit) memang mengurangi DOMS. Tapi jangan terlalu sering kalau tujuannya hipertrofi otot." },
  { keys: ["kopi", "kafein"], reply: "Kopi TIDAK bikin dehidrasi. Cairan dari kopi tetap positif meskipun ada efek diuretik ringan." },
  { keys: ["mandi malam", "rematik"], reply: "Mandi malam ≠ rematik. Rematik itu autoimun/genetik/usia. Mandi malam paling banter bikin otot yang tegang terasa lebih nyeri sementara." },

  // Content specific — Science
  { keys: ["10%", "10 persen otak", "sepuluh persen"], reply: "Mitos '10% otak' populer di film, tapi SALAH. fMRI menunjukkan seluruh area otak aktif. Setiap bagian punya peran unik." },
  { keys: ["petir", "sambaran"], reply: "Petir SERING menyambar tempat yang sama. Empire State Building disambar ~25 kali/tahun. Tempat tinggi & konduktif = target favorit petir." },
  { keys: ["bulan", "moon"], reply: "Bulan tetap berputar pada porosnya! Cuma kecepatan rotasinya persis sama dengan orbit ke Bumi (tidal locking) — makanya kita selalu lihat sisi yang sama." },
  { keys: ["mpemba", "air panas beku"], reply: "Efek Mpemba — air panas kadang membeku lebih cepat dari air dingin dalam kondisi tertentu. Fenomena nyata, penjelasannya masih diperdebatkan!" },

  // Content specific — History
  { keys: ["tembok cina", "great wall"], reply: "Tembok Besar China TIDAK terlihat dari luar angkasa. Astronot China sendiri (Yang Liwei) konfirmasi ini. Yang lebih kelihatan: kota, jalan raya." },
  { keys: ["viking", "helm tanduk"], reply: "Viking TIDAK pakai helm bertanduk. Citra itu datang dari kostum opera Wagner tahun 1876. Helm asli mereka bulat sederhana." },
  { keys: ["napoleon", "pendek"], reply: "Napoleon tingginya ~1.68m = normal untuk Prancis abad 18. Mitos 'pendek' dari propaganda Inggris + kebingungan satuan kaki." },

  // Content specific — Culture
  { keys: ["batik"], reply: "Batik Indonesia diakui UNESCO sebagai Warisan Budaya Takbenda tanggal 2 Oktober 2009. Makanya 2 Oktober = Hari Batik Nasional 🥻" },
  { keys: ["duduk pintu", "pamali", "pintu"], reply: "'Pamali duduk depan pintu' kemungkinan besar aturan sopan santun praktis (biar ga menghalangi orang lewat) yang dibungkus mistis biar anak-anak nurut 😅" },
  { keys: ["wayang"], reply: "Wayang kulit boleh dipentaskan siang! Ada wayang santri, wayang ruwatan yang dilakukan siang hari. Preferensi malam murni karena efek dramatis cahaya kelir." },
  { keys: ["rendang"], reply: "Rendang autentik butuh 4-8 jam! Santan mengering total, bumbu meresap. Karena itu rendang bisa awet berhari-hari tanpa kulkas — makanan travel Minang legendaris." },

  // Feature suggestions
  { keys: ["rekomendasi", "level apa", "mulai dari mana", "level pertama"], reply: "Kalau baru mulai, coba 'Level 1: Veritas Basic' — 3 mitos populer buat pemanasan. Kalau udah pro, langsung boss fight 'Ultimate Mitos Buster' di Level 8 🔥" },
  { keys: ["kategori", "topik", "tema"], reply: "Ada 5 kategori: Teknologi 💾, Kesehatan 🩺, Sains 🧪, Sejarah 🏛️, Budaya 🎭. Learning Path mix semuanya biar ga bosen!" },
  { keys: ["library", "pustaka", "koleksi"], reply: "Halaman Library punya 12 kartu mitos vs fakta populer yang bisa langsung kamu baca tanpa quiz. Buka dari nav bar!" },

  // Meta / errors
  { keys: ["bug", "error", "masalah", "tidak jalan"], reply: "Coba refresh halaman ya. Kalau masalah masih ada, reset progress dari Dashboard bisa bantu. Datanya tersimpan di browser kamu, jadi ga hilang di server." },
  { keys: ["lupa", "hilang"], reply: "Semua progress tersimpan di localStorage browser. Kalau ganti browser/device, progressnya ga kebawa. Fitur sync akun lagi dipikirin ✨" },
];

const FALLBACKS = [
  "Hmm, aku belum punya jawaban pas buat itu. Coba tanya soal mitos populer seperti 'wortel bikin mata sehat' atau 'baterai HP semalaman'?",
  "Menarik! Aku masih belajar. Coba tanya soal kategori Teknologi, Kesehatan, Sains, Sejarah, atau Budaya ya 🧠",
  "Veritas mode aktif! Tapi topik itu belum ada di database-ku. Coba buka halaman Library buat lihat 12 mitos populer.",
  "Aku belum tahu jawaban itu — tapi aku tahu mitos '10% otak' salah, dan 5G tidak menyebarkan virus. Mau tanya soal itu?",
];

const QUICK = [
  "Cara main?",
  "Rekomendasi level",
  "Mitos wortel bikin mata sehat?",
  "AI beneran cerdas?",
];

function findReply(text) {
  const q = text.toLowerCase();
  for (const r of RESPONSES) {
    for (const k of r.keys) {
      if (q.includes(k)) return r.reply;
    }
  }
  return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
}

export default function KepoAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Halo! Aku Veritas AI 👋 Siap bantu kamu membedakan MITOS vs FAKTA secara presisi. Coba tanya apa aja, atau pilih pertanyaan di bawah 👇", sender: "bot" }
  ]);
  const [typing, setTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const handleSend = (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { text, sender: "user" }]);
    setInputValue("");
    setTyping(true);

    const reply = findReply(text);
    const delay = 500 + Math.min(1200, text.length * 20);

    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { text: reply, sender: "bot" }]);
    }, delay);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSend(inputValue);
  };

  return (
    <>
      {/* TOGGLE BUTTON */}
      <button
        className="kepo-toggle"
        id="kepo-toggle"
        data-testid="kepo-chat-toggle"
        aria-label="Buka Kepo AI"
        onClick={() => setOpen(!open)}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a8 8 0 0 1-11.6 7.13L4 21l1.87-5.4A8 8 0 1 1 21 12z"/>
          <circle cx="9" cy="12" r="1"/>
          <circle cx="12" cy="12" r="1"/>
          <circle cx="15" cy="12" r="1"/>
        </svg>
      </button>

      {/* PANEL */}
      <div className={`kepo-panel ${open ? "open" : ""}`} id="kepo-panel" role="dialog" aria-label="Veritas AI Chat">
        <div className="kepo-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="kepo-avatar">V</div>
            <div>
              <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 900, fontSize: '1rem', letterSpacing: '-.02em', color: '#fff' }}>Veritas AI</div>
              <div style={{ fontSize: '.72rem', color: '#7CFFB2', display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7CFFB2', boxShadow: '0 0 8px #7CFFB2', display: 'inline-block' }}></span>
                Online · Siap Membantu
              </div>
            </div>
          </div>
          <button
            id="kepo-close"
            data-testid="kepo-chat-close"
            aria-label="Tutup"
            style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
            onClick={() => setOpen(false)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M6 6l12 12M6 18L18 6"/>
            </svg>
          </button>
        </div>

        {/* MESSAGES LIST */}
        <div className="kepo-messages" id="kepo-messages" data-testid="kepo-messages">
          {messages.map((m, idx) => (
            <div key={idx} className={`kepo-bubble ${m.sender}`}>
              {m.text}
            </div>
          ))}
          {typing && (
            <div className="kepo-typing" id="kepo-typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* QUICK QUESTION CHIPS */}
        <div className="kepo-quick" id="kepo-quick">
          {QUICK.map((q, idx) => (
            <button
              key={idx}
              type="button"
              data-testid={`kepo-quick-${q.slice(0, 8).replace(/\s+/g, "-").toLowerCase()}`}
              onClick={() => handleSend(q)}
            >
              {q}
            </button>
          ))}
        </div>

        {/* INPUT FORM */}
        <form className="kepo-input-wrap" id="kepo-form" onSubmit={handleFormSubmit}>
          <input
            className="kepo-input"
            id="kepo-input"
            data-testid="kepo-chat-input"
            type="text"
            placeholder="Tanya soal mitos apa saja..."
            autoComplete="off"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button className="kepo-send" type="submit" data-testid="kepo-chat-send" aria-label="Kirim">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}
