"use client";

import { FadeIn } from "./Reveal";
import { useT } from "../lib/i18n";

export default function InfoSection() {
  const t = useT();
  return (
    <section id="info" className="px-5 pb-8 pt-4 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2rem] border border-outline-variant bg-surface-container-low" style={{ contentVisibility: "auto", containIntrinsicSize: "640px" }}>
          <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-primary">
                <FadeIn><span>{t("inf.tag")}</span></FadeIn>
              </p>
              <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                <FadeIn>
                  <span className="inline-block">{t("inf.open")}</span>
                </FadeIn>
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-on-surface-variant">
                PokeMondo adalah Pokédex web yang memuatkan semua 1025 spesies
                daripada sembilan generasi terus dari{" "}
                <a
                  href="https://pokeapi.co"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary underline underline-offset-4"
                >
                  PokéAPI
                </a>{" "}
                — RESTful, GraphQL, dan kosong iklan. Reka bentuknya mengikut
                bahasa visual Material You: warna tonal yang dinamik, bentuk
                bulat besar, dan pergerakan yang menenangkan.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Next.js",
                  "React 19",
                  "TypeScript",
                  "Tailwind CSS",
                  "CSS",
                  "JavaScript",
                  "HTML",
                  "PokeAPI",
                ].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-outline-variant bg-surface-container-lowest px-3.5 py-1.5 font-display text-xs font-bold text-on-surface-variant"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {[
                {
                  label: "PokéAPI",
                  href: "https://pokeapi.co",
                  note: "Sumber data Pokémon",
                },
                {
                  label: "React Bits",
                  href: "https://reactbits.dev",
                  note: "Ilham corak animasi",
                },
                {
                  label: "Material You",
                  href: "https://m3.material.io",
                  note: "Sistem reka bentuk",
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-2xl bg-surface-container px-5 py-4 transition-colors hover:bg-surface-container-high"
                >
                  <span>
                    <span className="block font-display font-bold text-on-surface">
                      {item.label}
                    </span>
                    <span className="text-sm text-on-surface-variant">{item.note}</span>
                  </span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-on-surface-variant transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  >
                    <path d="M7 17 17 7m0 0h-8m8 0v8" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          <p className="border-t border-outline-variant px-8 py-5 text-xs text-on-surface-variant">
            Pokémon dan nama watak adalah tanda dagangan Nintendo / Game Freak /
            Creatures Inc. Projek ini tidak rasmi dan dibina sebagai demo teknologi.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <FadeIn className="h-full">
            <div className="h-full rounded-[1.5rem] border border-outline-variant bg-surface-container-low p-6">
              <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-primary">
                Pembangun
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-primary font-display text-lg font-extrabold text-on-primary shadow-e1"
                >
                  A
                </span>
                <div className="min-w-0">
                  <p className="font-display font-bold text-on-surface">Adam</p>
                  <p className="text-xs leading-snug text-on-surface-variant">
                    Reka bentuk, kod & idea projek
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-tertiary-container font-display text-lg font-extrabold text-on-tertiary-container shadow-e1"
                >
                  M
                </span>
                <div className="min-w-0">
                  <p className="font-display font-bold text-on-surface">Mistral</p>
                  <p className="text-xs leading-snug text-on-surface-variant">
                    Pembangun AI (Vibe Code oleh Mistral AI)
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.06} className="h-full">
            <div className="h-full rounded-[1.5rem] border border-outline-variant bg-surface-container-low p-6">
              <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-primary">
                Lesen
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-secondary-container px-3 py-1 font-display text-[11px] font-bold text-on-secondary-container">
                  MIT License
                </span>
                <span className="text-[11px] font-semibold text-on-surface-variant">
                  © 2025 Adam & Mistral
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
                PokeMondo dilesenkan di bawah Lesen MIT — bebas untuk digunakan,
                disalin, diubah suai, diedar dan disublesenkan (termasuk kegunaan
                komersial), selagi notis hak cipta dan lesen asal disertakan.
              </p>
              <a
                href="https://github.com/AdamMukhrizXXX/PokeMondo/blob/main/LICENSE"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1 font-display text-xs font-bold text-primary underline underline-offset-4"
              >
                Baca lesen penuh
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M7 17 17 7m0 0h-8m8 0v8" />
                </svg>
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.12} className="h-full">
            <div className="h-full rounded-[1.5rem] border border-outline-variant bg-surface-container-low p-6">
              <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-primary">
                Sumber Terbuka
              </p>
              <p className="mt-4 font-display text-lg font-extrabold text-on-surface">
                Kod penuh 100% terbuka
              </p>
              <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
                Seluruh kod sumber PokeMondo tersedia sepenuhnya di GitHub — tiada
                bahagian tersembunyi atau kod tertutup. Anda bebas untuk klon,
                forka dan bina versi Pokédex anda sendiri.
              </p>
              <a
                href="https://github.com/AdamMukhrizXXX/PokeMondo"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 font-display text-xs font-bold text-on-primary transition-transform active:scale-95"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
                </svg>
                Lihat kod di GitHub
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
