"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePokedexData } from "../lib/pokedex-context";
import Hero from "./Hero";
import ScrubGallery from "./ScrubGallery";

const QUICK_LINKS = [
  {
    href: "/pokedex",
    label: "Pokédex",
    note: "Semua 1025 spesies, tapis jenis & generasi",
    icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 7.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 3a9 9 0 0 1 8.49 6H12m0 6h8.49A9 9 0 0 1 12 21",
  },
  {
    href: "/kuiz",
    label: "Kuiz",
    note: "Teka siluet, tanpa had, kejar skor terbaik",
    icon: "M9.5 9a2.5 2.5 0 1 1 3.4 2.33c-.75.3-1.9 1-1.9 2.17v.5M12 17.5v.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z",
  },
  {
    href: "/info",
    label: "Info",
    note: "Tentang laman, data terbuka & kredit",
    icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4.5v.01M12 11v5.5",
  },
  {
    href: "/pokex",
    label: "PokeX",
    note: "Analisis semua Pokémon dengan AI sebenar",
    icon: "M12 4c1 3 2.5 4.5 5.5 5.5C14.5 10.5 13 12 12 15c-1-3-2.5-4.5-5.5-5.5C9.5 8.5 11 7 12 4Z",
  },
];

export default function RumahContent() {
  const { list } = usePokedexData();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const onExplore = useCallback(() => {
    const q = query.trim();
    router.push(q ? `/pokedex?q=${encodeURIComponent(q)}` : "/pokedex");
  }, [query, router]);

  return (
    <>
      <Hero
        query={query}
        onQueryChange={setQuery}
        total={list.length}
        onExplore={onExplore}
      />

      <ScrubGallery />

      <section aria-label="Terokai laman" className="px-5 pb-20 sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              data-sfx="click"
              className="anim-rise group flex flex-col gap-3 rounded-[1.75rem] border border-outline-variant bg-surface-low/85 p-6 shadow-e1 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-e3"
              style={{ animationDelay: `${0.15 + i * 0.08}s` }}
            >
              <span className="grid size-11 place-items-center rounded-2xl bg-primary-container text-on-primary-container transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                {item.href === "/pokedex" ? (
                  <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
                    <defs>
                      <linearGradient id="pm-pokeball-red" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#ff6a48" />
                        <stop offset="1" stopColor="#e3350d" />
                      </linearGradient>
                    </defs>
                    <path d="M2 12a10 10 0 0 1 20 0Z" fill="url(#pm-pokeball-red)" />
                    <path d="M22 12a10 10 0 0 1-20 0Z" fill="#f7f4ef" />
                    <rect x="2" y="10.75" width="20" height="2.5" fill="#2b2320" />
                    <circle cx="12" cy="12" r="10" fill="none" stroke="#2b2320" strokeWidth="1.6" />
                    <circle cx="12" cy="12" r="3.6" fill="#2b2320" stroke="#f7f4ef" strokeWidth="1.2" />
                    <circle cx="12" cy="12" r="1.7" fill="#ffffff" />
                  </svg>
                ) : item.href === "/kuiz" ? (
                  <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
                    <defs>
                      <linearGradient id="pm-quiz-amber" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#ffd54d" />
                        <stop offset="1" stopColor="#ff9800" />
                      </linearGradient>
                    </defs>
                    <circle cx="12" cy="12" r="9.2" fill="url(#pm-quiz-amber)" />
                    <circle cx="12" cy="12" r="9.2" fill="none" stroke="#8a4b00" strokeOpacity="0.35" strokeWidth="1.4" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 16.9h.01" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" />
                  </svg>
                ) : item.href === "/pokex" ? (
                  <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
                    <defs>
                      <linearGradient id="pm-pokex-teal" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#2dd4bf" />
                        <stop offset="1" stopColor="#0d9488" />
                      </linearGradient>
                    </defs>
                    <circle cx="12" cy="12" r="9.2" fill="url(#pm-pokex-teal)" />
                    <circle cx="12" cy="12" r="9.2" fill="none" stroke="#065f56" strokeOpacity="0.35" strokeWidth="1.4" />
                    <path d="m15.2 8.8-6.4 6.4" stroke="#ffc531" strokeWidth="2.4" strokeLinecap="round" />
                    <path d="m8.8 8.8 6.4 6.4" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="1.4" fill="#ffffff" />
                  </svg>
                ) : item.href === "/info" ? (
                  <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
                    <defs>
                      <linearGradient id="pm-info-blue" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#4facfe" />
                        <stop offset="1" stopColor="#2f7cf6" />
                      </linearGradient>
                    </defs>
                    <circle cx="12" cy="12" r="9.2" fill="url(#pm-info-blue)" />
                    <circle cx="12" cy="12" r="9.2" fill="none" stroke="#0b4a8f" strokeOpacity="0.35" strokeWidth="1.4" />
                    <path d="M12 7.4h.01" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" />
                    <path d="M12 11.1v5.4" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d={item.icon} />
                  </svg>
                )}
              </span>
              <span className="font-display text-lg font-extrabold text-on-surface">{item.label}</span>
              <span className="text-sm leading-snug text-on-surface-variant">{item.note}</span>
              <span className="mt-auto inline-flex items-center gap-1 font-display text-xs font-bold uppercase tracking-widest text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Buka
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
