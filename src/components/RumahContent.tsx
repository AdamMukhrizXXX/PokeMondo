"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePokedexData } from "../lib/pokedex-context";
import Hero from "./Hero";

const QUICK_LINKS = [
  {
    href: "/pokedex",
    label: "Pokédex",
    note: "Semua 1025 spesies, tapis jenis & generasi",
    icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 7.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 3a9 9 0 0 1 8.49 6H12m0 6h8.49A9 9 0 0 1 12 21",
  },
  {
    href: "/galeri",
    label: "Galeri",
    note: "Scrub melintasi sembilan generasi",
    icon: "M4 8h16M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Zm4 4 2.5 3 2-2.5L16 16",
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
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d={item.icon} />
                </svg>
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
