"use client";

import pkg from "../../package.json";
import { FadeIn } from "./Reveal";

type Entry = {
  version: string;
  title: string;
  note: string;
  current?: boolean;
  items: string[];
};

const ENTRIES: Entry[] = [
  {
    version: "v1.1.5",
    title: "xKiro — Penyedia AI Ketiga untuk PokeX",
    note: "Kemas kini terkini",
    current: true,
    items: [
      "Penyedia baharu xKiro (api.xkiro.com) — gateway serasi OpenAI dengan 38+ model percuma pada satu kunci",
      "Model lalai xKiro: qwen/qwen3.8-max:free — konteks 1M token, menyokong reasoning, harga percuma (RM0/USD0 setiap 1M token)",
      "Sandaran automatik kini tiga hala: jika penyedia pilihan gagal, PokeX mencuba penyedia lain mengikut giliran (OpenRouter → Groq → xKiro)",
      "Kunci xKiro disimpan per penyedia hanya dalam pelayar; status tersimpan ✓ ditunjuk dalam Tetapan PokeX",
    ],
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
              Sejarah Versi PokeMondo
            </h2>
            <span className="rounded-full bg-primary px-3 py-1 font-display text-[11px] font-bold text-on-primary shadow-e1">
              Semasa v{pkg.version}
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
            Setiap kemas kini laman direkodkan di sini — ciri baharu, pembaikan,
            dan perubahan penting daripada pelancaran pertama hingga kini.
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
                      {entry.note}
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
