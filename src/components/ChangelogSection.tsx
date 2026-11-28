"use client";

import pkg from "../../package.json";
import { FadeIn } from "./Reveal";
import { useT } from "../lib/i18n";

type Entry = {
  version: string;
  title: string;
  note: string;
  current?: boolean;
  items: string[];
};

const ENTRIES: Entry[] = [
  {
    version: "v1.2.4",
    title: "24 Lagu Baharu Pokémon (Scarlet/Violet + DLC)",
    note: "Kemas kini terkini",
    current: true,
    items: [
      "Pustaka Muzik bertambah daripada 177 kepada 201 trek — 24 lagu baharu ditambah",
      "Lagu baharu dari Scarlet/Violet + The Hidden Treasure of Area Zero: The Teal Mask (Kitakami, Mossui Town, Festival of Masks, Crystal Pool), The Indigo Disk (Blueberry Academy, 4 biome Terarium, Battle! Champion Kieran, Area Zero Underdepths, Battle! Terapagos) dan Epilog Mochi Mayhem (Battle! Pecharunt)",
      "Termasuk juga lagu asas Paldea yang dinanti — Welcome to the Paldea Region!, Mesagoza, Tera Raid Battle!, Battle! (Top Champion), Area Zero dan Paradise Protection Protocol",
      "Semua lagu baharu disemak satu persatu (audio/mpeg) dan dimain terus melalui Pemain Muzik & Pustaka Muzik yang sama",
    ],
  },
  {
    version: "v1.2.3",
    title: "Muat Turun Semua Sumber (11.8MB) dalam Pop Up Kemas Kini",
    note: "Kemas kini terdahulu",
    items: [
      "Pop Up Kemas Kini kini ada sistem Muat Turun Semua Sumber — satu klik memuat semua 1,025 sprite Pokémon (±11.8MB) ke cache pelayar dengan bar kemajuan masa-nyata (bilangan sumber + MB dimuat)",
      "Selepas selesai, kad & modal Pokémon buka segera dan sprite sedia offline — status “Selesai” diingati dalam pelayar untuk setiap versi",
      "Muat turun 12 sumber serentak dengan ralat selamat (sumber gagal dilangkau, kemajuan tetap berjalan) dan disambung terus walaupun pop up ditutup",
    ],
  },
  {
    version: "v1.2.2",
    title: "Pembaikan xKiro — Kini Berfungsi 100%",
    note: "Kemas kini terdahulu",
    items: [
      "Punca xKiro gagal dijumpai — api.xkiro.com tidak menghantar pengepala CORS, jadi pelayar menyekat semua panggilan dan PokeX sentiasa jatuh balik ke OpenRouter (nota “via OpenRouter”)",
      "Pembaikan: proxy se-origen baharu /api/xkiro meneruskan panggilan xKiro tanpa sekatan CORS — jawapan & strim langsung kini datang terus dari xKiro tanpa nota sandaran",
      "Cip maklumat PokeX diperbetulkan kepada “3 penyedia • sandaran automatik”",
    ],
  },
  {
    version: "v1.2.1",
    title: "SPUI: Rawak 1 Pokémon, Sidebar Tetapan & Prestasi Bertahap",
    note: "Kemas kini terdahulu",
    items: [
      "Halaman SPUI kini ada Sistem Pokémon Rawak — satu Pokémon terpilih rawak daripada 1,025 spesies, klik kad untuk butiran penuh dan butang Rawak Semula untuk dadu baharu",
      "Sidebar Tetapan SPUI baharu (butang Tetapan di kepala halaman) dengan 5 tahap Prestasi: Very Low, Low, Medium, High dan Extreme",
      "Tahap Prestasi benar-benar berfungsi — mengubah bilangan Pokémon sehalaman (20 hingga 120), kepadatan grid dan cara imej dimuat (lazy/eager); pilihan diingati dalam pelayar",
      "UI SPUI diubah lebih kemas & mudah difahami — kepala halaman berikon, bar carian & penapis dalam satu kad dengan butang kosongkan + set semula, cip status prestasi, halaman pertama/terakhir, dan keadaan kosong yang jelas — masih mengekalkan Simple UI",
    ],
  },
  {
    version: "v1.2.0",
    title: "Pop Up Kemas Kini, Sistem Rawak & UI/UX Halus",
    note: "Kemas kini terdahulu",
    items: [
      "Pop Up Kemas Kini — pengguna versi lama disambut pop up automatik dengan senarai apa yang baharu setiap kali versi laman naik (dikesan melalui localStorage, sekali sahaja bagi setiap versi)",
      "Sistem Rawak Pokémon dikembalikan semula — bahagian baharu di Halaman Rumah yang memunculkan 2 Pokémon rawak sekaligus setiap roll, dengan kad masuk beranimasi (flip-in 3D) & condong 3D semasa hover",
      "Pengesanan Bateri untuk semua peranti — paras % dan status mengecas secara langsung (Battery Status API); pelayar yang tidak menyokong dipaparkan dengan jelas tanpa rosak",
      "Pengesanan GPU & Storan — nama GPU sebenar pelayar (WebGL/WebGPU) dan penggunaan storan (GB digunakan / kuota) dipaparkan bersama Sistem Rawak",
      "UI/UX dihaluskan sepenuhnya di semua halaman — transisi spring yang lebih lembut pada semua butang & pautan, skrol licin dan fokus papan kekunci yang jelas",
      "Pembaikan bug & lag berlebihan — Latar Live Motion 3D dihentikan sepenuhnya dalam Mod GPU Lite dan backdrop-blur berat dilumpuhkan pada peranti lemah",
    ],
  },
  {
    version: "v1.1.5",
    title: "Pustaka Muzik, Kunci API PokeAPI & xKiro",
    note: "Kemas kini terdahulu",
    items: [
      "Penyedia baharu xKiro (api.xkiro.com) — gateway serasi OpenAI dengan 38+ model percuma pada satu kunci",
      "Model lalai xKiro: qwen/qwen3.8-max:free — konteks 1M token, menyokong reasoning, harga percuma (RM0/USD0 setiap 1M token)",
      "Sandaran automatik kini tiga hala: jika penyedia pilihan gagal, PokeX mencuba penyedia lain mengikut giliran (OpenRouter → Groq → xKiro)",
      "Kunci xKiro disimpan per penyedia hanya dalam pelayar; status tersimpan ✓ ditunjuk dalam Tetapan PokeX",
      "Latar belakang web utama kini Live Motion 3D — aurora besar bergerak berputar perlahan + tiga orbs 3D realistik (sorotan kilau & bayang dalam) melayang + parallax tetikus mengikut kedalaman (adaptasi reactbits Aurora, CSS tulen, reduced-motion & GPU Lite dihormati)",
      "UI OTP lebih hidup — tajuk gradien bergerak, kotak digit bercahaya denyut, fokus terangkat 3D, peti mel berhalo denyut, kira detik berkilau (Shiny Text), butang Sahkan berbingkai bintang berputar (Star Border) & aurora mini dalam kad peti mel",
      "Pustaka Muzik (halaman /muzik) — OST Pokémon (177 trek) + muzik import anda disatukan dalam satu senarai: tab Semua/OST/Import, carian langsung, main terus melalui Pemain Muzik yang sama, badge Import & buang lagu sendiri terus dari senarai",
      "Sistem Generate API Key With PokeAPI 💯 (halaman /api-key) — jana kunci peribadi pkm_live_… (crypto.getRandomValues), label + salin automatik + tarik balik, topeng selamat, disimpan localStorage sahaja, dengan contoh fetch X-Api-Key",
      "Sistem Multi-lingual — pemilih Bahasa dalam Tetapan dengan 93 bahasa merangkumi bahasa setiap negara + dialek Jawa Pantura (Utara) & Jawa Timur; terjemahan penuh 20 bahasa utama (MS, EN, ID, JV, SU, ZH, JA, KO, HI, AR, ES, FR, PT, DE, RU, TH, VI, TL), carian bahasa, sokongan RTL, disimpan localStorage",
      "Perbaikan Multi-lingual — semua halaman kini diterjemah penuh: Pokédex, Kuiz, Info, PokeX, Pustaka Muzik, Kunci API, Modal Butiran & Changelog (55+ kunci baharu × 20 bahasa)",
      "Ikon Bahasa baharu lebih berwarna & hidup — globe gradien bercahaya denyut, garis bujur merah-amber bernafas, dan 3 titik orbit berwarna (merah, amber, biru) berputar mengelilingi glob; hover mempercepat semua animasi",
      "Ikon Theme (palet) lebih berwarna & hidup — badan palet gradien pelangi 5 warna (merah, amber, teal, biru, hijau) dengan kilauan cahaya bernafas, 4 titik cat berdenyut berperingkat, dan 2 bintang berkelip; hover mempercepat semua animasi",
      "Ikon kad Terokai di halaman Rumah lebih berwarna & hidup — Rumah (rumah amber melayang + pintu berdenyut), Kuiz (soal tanda berdenyut), Pokédex (Poké Ball berkilau), PokeX (permata teal + bintang berkelip), Muzik (nota merah jambu-ungu melantun bergilir), API Key (kunci emas bercahaya) & Info (biru berdenyut) — setiap ikon melayang lembut, condong 3D (perspektif) semasa hover, dan animasi dipercepat",
      "Ikon PokeX lebih berwarna & hidup — cip ikon gradien teal-biru dengan cahaya berdenyut, bingkai konik pelangi berputar, bintang berkelip & condong 3D semasa hover",    ],
  },
  {
    version: "v1.1.4",
    title: "Ikon Tetapan Hidup — Latar Custom & SPUI",
    note: "Kemas kini terdahulu",
    items: [
      "Ikon Latar Custom kini langit hidup — matahari amber dengan 8 sinar berputar + denyut lembut, awan putih hanyut beransur, dan kilauan cahaya melintasi gunung hijau-teal",
      "Ikon SPUI kini peranti hidup — imbasan berkilau menyapu skrin mini, lensa putih dengan halo teal berdenyut + titik kilau, dan LED hijau berkelip",
      "Hover mempercepat semua animasi ikon (sinar, awan, imbasan, halo & LED) dan dot indikator aktif berdenyut",
      "CSS keyframes tulen tanpa dependensi, corak sama dengan ikon Bunyi & Cerah/Gelap — prefers-reduced-motion dihormati penuh",
    ],
  },
  {
    version: "v1.1.0",
    title: "AI Masa-Nyata, Lesen & Sumber Terbuka",
    note: "Kemas kini terdahulu",
    items: [
      "AI streaming masa-nyata — jawapan dan proses pemikiran muncul semasa dijana (OpenRouter & Groq, SSE)",
      "Uji API masa-nyata dengan kiraan aksara langsung",
      "Pro Thinking dipindahkan ke OpenRouter sahaja (reasoning effort tinggi, sasaran 50 saat)",
      "Ikon X baharu gaya tanda tangan profesional — lengkung kaligrafi + permata berlian",
      "Halaman Info: kad Pembangun (Adam & Mistral), sistem Lesen MIT dan maklumat Kod Penuh & Sumber Terbuka",
      "Halaman Changelog baharu (halaman ini)",
    ],
  },
  {
    version: "v1.0.0",
    title: "Pelancaran PokeMondo",
    note: "Versi pertama",
    items: [
      "Semua 1,025 Pokémon, 9 generasi dari PokéAPI — carian, penomboran, modal butiran penuh",
      "Hero Section 3D + Live Text, Scroll Scrub di Halaman Utama",
      "Staggered Menu (adaptasi reactbits.dev) dengan Tetapan lengkap dalam sidebar",
      "Sistem Suara Pokémon — seruan (cry) semua 1,025 Pokémon",
      "Pemain Muzik OST 177 trek + Import Muzik sendiri (IndexedDB) + Media Session",
      "SFX penuh untuk semua butang + fanfare berlapis khas masuk PokeX",
      "Jam Dunia Real-Time — 9 rantau Pokémon + 85+ zon dunia",
      "Kuiz tanpa had dengan Auto-Seterusnya",
      "4 Tema Laman: Dasar, Neobrutalism, Claymorphism, Glassmorphism",
      "Latar Custom, fon Fredoka + Plus Jakarta Sans, ikon berwarna",
      "PokeX — AI analisis Pokémon BYOK (OpenRouter + Groq, sandaran automatik)",
      "SPUI (Simple Pokedex UI) + Prestasi GPU & Auto-Detect Peranti + popup pengesahan keluar",
      "Prestasi: reduced-motion, rAF berjeda bila tab tersembunyi, contentVisibility, Mod GPU Auto",
    ],
  },
];

export default function ChangelogSection() {
  const t = useT();
  return (
    <section
      id="changelog"
      className="px-5 pb-8 pt-4 sm:px-8 lg:px-16"
      aria-label="Changelog PokeMondo"
    >
      <div className="mx-auto max-w-4xl">
        <div className="anim-rise">
          <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-primary">
            Changelog
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t("cl.title")}
            </h2>
            <span className="rounded-full bg-primary px-3 py-1 font-display text-[11px] font-bold text-on-primary shadow-e1">
              {t("cl.current").replace("{v}", pkg.version)}
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
            {t("cl.sub")}
          </p>
        </div>

        <ol className="mt-8 flex flex-col gap-5">
          {ENTRIES.map((entry, ei) => (
            <li key={entry.version}>
              <FadeIn delay={ei * 0.06}>
                <article className="relative rounded-[1.5rem] border border-outline-variant bg-surface-container-low p-6 sm:p-7">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={`rounded-full px-3.5 py-1 font-display text-xs font-extrabold ${
                        entry.current
                          ? "bg-primary text-on-primary shadow-e1"
                          : "bg-secondary-container text-on-secondary-container"
                      }`}
                    >
                      {entry.version}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                        entry.current
                          ? "bg-tertiary-container text-on-tertiary-container"
                          : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      {entry.current ? t("cl.now") : entry.version === "v1.0.0" ? t("cl.first") : t("cl.prev")}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-extrabold text-on-surface">
                    {entry.title}
                  </h3>
                  <ul className="mt-3 flex flex-col gap-2">
                    {entry.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-on-surface-variant">
                        <i
                          aria-hidden
                          className="mt-[7px] size-1.5 shrink-0 rounded-full"
                          style={{
                            background: entry.current
                              ? "linear-gradient(135deg, #2dd4bf, #0ea5e9)"
                              : "var(--md-outline)",
                          }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </FadeIn>
            </li>
          ))}
        </ol>

        <p className="mt-6 text-center text-xs text-on-surface-variant">
          PokeMondo dibangunkan secara berterusan — versi seterusnya akan direkodkan di halaman ini.
        </p>
      </div>
    </section>
  );
}
