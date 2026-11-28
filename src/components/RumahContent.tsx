"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePokedexData } from "../lib/pokedex-context";
import { useT } from "../lib/i18n";
import Hero from "./Hero";
import ScrubGallery from "./ScrubGallery";

const QUICK_LINKS = [
  {
    href: "/",
    k: "home",
    icon: "M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-4.6v-5.2h-4.8V21H5a1 1 0 0 1-1-1Z",
  },
  {
    href: "/pokedex",
    k: "dex",
    icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 7.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 3a9 9 0 0 1 8.49 6H12m0 6h8.49A9 9 0 0 1 12 21",
  },
  {
    href: "/kuiz",
    k: "quiz",
    icon: "M9.5 9a2.5 2.5 0 1 1 3.4 2.33c-.75.3-1.9 1-1.9 2.17v.5M12 17.5v.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z",
  },
  {
    href: "/info",
    k: "info",
    icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4.5v.01M12 11v5.5",
  },
  {
    href: "/muzik",
    k: "music",
    icon: "M9 18V5l11-2v13M6.5 18a2.8 2.8 0 1 1-2.8-2.8 2.8 2.8 0 0 1 2.8 2.8ZM17.5 16a2.8 2.8 0 1 1-2.8-2.8 2.8 2.8 0 0 1 2.8 2.8Z",
  },
  {
    href: "/api-key",
    k: "key",
    icon: "M8 14a4.2 4.2 0 1 1 4.2-4.2L21 18.5V21h-2.5M8 9.8v.01",
  },
  {
    href: "/pokex",
    k: "pokex",
    icon: "M12 4c1 3 2.5 4.5 5.5 5.5C14.5 10.5 13 12 12 15c-1-3-2.5-4.5-5.5-5.5C9.5 8.5 11 7 12 4Z",
  },
];

export default function RumahContent() {
  const t = useT();
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
              <span className="ql-icon grid size-11 place-items-center rounded-2xl bg-primary-container text-on-primary-container">
                {item.href === "/" ? (
                  <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
                    <defs>
                      <linearGradient id="pm-home-amber" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#ffd54d" />
                        <stop offset="1" stopColor="#ff6a48" />
                      </linearGradient>
                    </defs>
                    <g className="nv-float">
                      <path d="M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-4.6v-5.2h-4.8V21H5a1 1 0 0 1-1-1Z" fill="url(#pm-home-amber)" />
                      <path d="M12 4l8 7.2-1.2 1.1L12 6.2 5.2 12.3 4 11.2Z" fill="#ffffff" opacity="0.45" />
                      <rect x="10.6" y="15.8" width="2.8" height="5.2" rx="0.6" fill="#2b2320" opacity="0.75" className="nv-pulse" />
                    </g>
                  </svg>
                ) : item.href === "/pokedex" ? (
                  <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
                    <defs>
                      <linearGradient id="pm-pokeball-red" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#ff6a48" />
                        <stop offset="1" stopColor="#e3350d" />
                      </linearGradient>
                    </defs>
                    <g className="nv-float">
                      <path d="M2 12a10 10 0 0 1 20 0Z" fill="url(#pm-pokeball-red)" />
                      <path d="M22 12a10 10 0 0 1-20 0Z" fill="#f7f4ef" />
                      <rect x="2" y="10.75" width="20" height="2.5" fill="#2b2320" />
                      <circle cx="12" cy="12" r="10" fill="none" stroke="#2b2320" strokeWidth="1.6" />
                      <circle cx="12" cy="12" r="3.6" fill="#2b2320" stroke="#f7f4ef" strokeWidth="1.2" className="nv-pulse" />
                      <circle cx="12" cy="12" r="1.7" fill="#ffffff" />
                    </g>
                  </svg>
                ) : item.href === "/kuiz" ? (
                  <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
                    <defs>
                      <linearGradient id="pm-quiz-amber" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#ffd54d" />
                        <stop offset="1" stopColor="#ff9800" />
                      </linearGradient>
                    </defs>
                    <g className="nv-float">
                      <circle cx="12" cy="12" r="9.2" fill="url(#pm-quiz-amber)" />
                      <circle cx="12" cy="12" r="9.2" fill="none" stroke="#8a4b00" strokeOpacity="0.35" strokeWidth="1.4" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="16.9" r="1.3" fill="#ffffff" className="nv-pulse" />
                    </g>
                  </svg>
                ) : item.href === "/pokex" ? (
                  <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
                    <defs>
                      <linearGradient id="pm-pokex-teal" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#2dd4bf" />
                        <stop offset="1" stopColor="#0d9488" />
                      </linearGradient>
                    </defs>
                    <g className="nv-float">
                      <circle cx="12" cy="12" r="9.2" fill="url(#pm-pokex-teal)" />
                      <circle cx="12" cy="12" r="9.2" fill="none" stroke="#065f56" strokeOpacity="0.35" strokeWidth="1.4" />
                      <path d="M16.4 8.6C13.6 11.4 9.8 15 7.6 17.4c1.4 1 3 .9 4.2 .2" fill="none" stroke="#ffc531" strokeWidth="2.2" strokeLinecap="round" />
                      <path d="M7.8 8.6c1.9 3.3 4.6 6.6 7.8 8.3" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
                      <path d="M12 9.7 14.3 12 12 14.3 9.7 12Z" fill="#ffffff" className="nv-pulse" />
                    </g>
                    <path d="M20.6 2.6l.5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5Z" fill="#ffc531" className="nv-twinkle" />
                  </svg>
                ) : item.href === "/info" ? (
                  <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
                    <defs>
                      <linearGradient id="pm-info-blue" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#4facfe" />
                        <stop offset="1" stopColor="#2f7cf6" />
                      </linearGradient>
                    </defs>
                    <g className="nv-float">
                      <circle cx="12" cy="12" r="9.2" fill="url(#pm-info-blue)" />
                      <circle cx="12" cy="12" r="9.2" fill="none" stroke="#0b4a8f" strokeOpacity="0.35" strokeWidth="1.4" />
                      <circle cx="12" cy="7.4" r="1.35" fill="#ffffff" className="nv-pulse" />
                      <rect x="10.9" y="10.6" width="2.2" height="6" rx="1.1" fill="#ffffff" />
                    </g>
                  </svg>
                ) : item.href === "/muzik" ? (
                  <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
                    <defs>
                      <linearGradient id="pm-muzik-pink" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#f472b6" />
                        <stop offset="1" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                    <g className="nv-float">
                      <g className="nv-bounce">
                        <circle cx="6.5" cy="17.4" r="2.9" fill="url(#pm-muzik-pink)" />
                        <rect x="8.6" y="5.4" width="2" height="12" rx="1" fill="url(#pm-muzik-pink)" />
                        <path d="M8.6 5.4c3.2.5 6 1.5 6.9 3.7-2.4-.9-4.5-1.1-6.9-.9Z" fill="url(#pm-muzik-pink)" />
                      </g>
                      <g className="nv-bounce nv-bounce-2">
                        <circle cx="17.9" cy="15.9" r="2.3" fill="#ffc531" />
                        <rect x="19.5" y="6.4" width="1.7" height="9.5" rx="0.85" fill="#ffc531" />
                      </g>
                    </g>
                  </svg>
                ) : item.href === "/api-key" ? (
                  <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
                    <defs>
                      <linearGradient id="pm-key-gold" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#ffd54d" />
                        <stop offset="1" stopColor="#ff9800" />
                      </linearGradient>
                    </defs>
                    <g className="nv-float" fill="none" stroke="url(#pm-key-gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 14a4.2 4.2 0 1 1 4.2-4.2L21 18.5V21h-2.5M8 9.8v.01" className="nv-pulse" />
                    </g>
                    <path d="M20.2 4.2l.5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5Z" fill="#ffe082" className="nv-twinkle" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d={item.icon} />
                  </svg>
                )}
              </span>
              <span className="font-display text-lg font-extrabold text-on-surface">{t(`ql.${item.k}`)}</span>
              <span className="text-sm leading-snug text-on-surface-variant">{t(`ql.${item.k}N`)}</span>
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
