"use client";

import { useEffect, useRef } from "react";
import type { BasicPokemon } from "../lib/pokemon";
import { useScrollSpy } from "../lib/pokemon";
import { cycleSiteTheme, THEME_LABELS, useSiteTheme } from "../lib/site-theme";
import ThemeToggle from "./ThemeToggle";
import SoundToggle from "./SoundToggle";
import WallpaperControl from "./WallpaperControl";
import FallbackModeButton from "./FallbackModeButton";
import AiAssist from "./AiAssist";

const NAV_ITEMS = [
  { id: "rumah", label: "Rumah", icon: "M4 11.5 12 4l8 7.5M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" },
  { id: "galeri", label: "Galeri", icon: "M4 8h16M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Zm4 4 2.5 3 2-2.5L16 16" },
  { id: "kuiz", label: "Kuiz", icon: "M9.5 9a2.5 2.5 0 1 1 3.4 2.33c-.75.3-1.9 1-1.9 2.17v.5M12 17.5v.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" },
  { id: "dex", label: "Pokédex", icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 7.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 3a9 9 0 0 1 8.49 6H12m0 6h8.49A9 9 0 0 1 12 21" },
  { id: "info", label: "Info", icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4.5v.01M12 11v5.5" },
];

function RailBtn({
  label,
  icon,
  delay,
  active,
  onClick,
  children,
}: {
  label: string;
  icon: string;
  delay: number;
  active?: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}) {
  return (
    <span
      className="rail-item group relative block"
      style={{ animationDelay: `${delay}ms` }}
    >
      <button
        type="button"
        aria-label={label}
        aria-current={active ? "true" : undefined}
        onClick={onClick}
        className={`rail-btn grid size-10 place-items-center rounded-full border shadow-e1 transition-all duration-300 hover:scale-110 active:scale-90 ${
          active
            ? "rail-active border-transparent bg-primary text-on-primary"
            : "border-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
        }`}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? 2.2 : 1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d={icon} />
        </svg>
        {children}
      </button>
      <span
        role="presentation"
        className="pointer-events-none absolute left-full top-1/2 z-10 ml-2 -translate-y-1/2 rounded-full bg-inverse-surface px-2.5 py-0.5 font-display text-[10px] font-bold whitespace-nowrap text-inverse-on-surface shadow-e2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}

function RailSlot({ label, delay, children }: { label: string; delay: number; children: React.ReactNode }) {
  return (
    <span className="rail-item group relative block" style={{ animationDelay: `${delay}ms` }}>
      {children}
      <span
        role="presentation"
        className="pointer-events-none absolute left-full top-1/2 z-10 ml-2 -translate-y-1/2 rounded-full bg-inverse-surface px-2.5 py-0.5 font-display text-[10px] font-bold whitespace-nowrap text-inverse-on-surface shadow-e2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}

export default function Sidebar({ onRandom, list }: { onRandom: () => void; list: BasicPokemon[] }) {
  const active = useScrollSpy(NAV_ITEMS.map((n) => n.id));
  const siteTheme = useSiteTheme();
  const fillRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  let delay = 0;

  return (
    <aside className="fixed bottom-[max(env(safe-area-inset-bottom),0.9rem)] left-1/2 z-50 max-w-[96vw] -translate-x-1/2 sm:bottom-auto sm:left-[max(env(safe-area-inset-left),0.75rem)] sm:top-1/2 sm:-translate-x-0 sm:-translate-y-1/2">
      <div className="rail-in no-scrollbar flex max-h-[88svh] flex-row items-center gap-1 overflow-x-auto rounded-[1.75rem] border border-outline-variant/70 bg-surface-low/85 px-2 py-2 shadow-e3 backdrop-blur-md sm:flex-col sm:gap-1.5 sm:rounded-full sm:px-1.5 sm:py-3">
        <span
          aria-hidden
          className="absolute right-0.5 top-2 hidden h-[calc(100%-1rem)] w-0.5 overflow-hidden rounded-full bg-outline-variant/40 sm:block"
        >
          <span
            ref={fillRef}
            className="block h-full w-full origin-top bg-primary"
            style={{ transform: "scaleY(0)" }}
          />
        </span>

        {NAV_ITEMS.map((item) => (
          <RailBtn
            key={item.id}
            label={item.label}
            icon={item.icon}
            delay={(delay += 45)}
            active={active === item.id}
            onClick={() => go(item.id)}
          />
        ))}

        <span aria-hidden className="mx-0.5 hidden h-5 w-px bg-outline-variant/60 sm:block sm:h-px sm:w-5" />

        <RailSlot label="Bunyi" delay={(delay += 45)}>
          <SoundToggle />
        </RailSlot>
        <RailSlot label="Cerah/Gelap" delay={(delay += 45)}>
          <ThemeToggle compact />
        </RailSlot>
        <RailBtn
          label={`Tema: ${THEME_LABELS[siteTheme]}`}
          icon="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0c2.5 2.5 2.5 15.5 0 18M3 12h18"
          delay={(delay += 45)}
          onClick={() => cycleSiteTheme()}
        />
        <RailSlot label="Latar Custom" delay={(delay += 45)}>
          <WallpaperControl />
        </RailSlot>
        <RailSlot label="UI Cadangan" delay={(delay += 45)}>
          <FallbackModeButton />
        </RailSlot>
        <RailSlot label="AI Anal" delay={(delay += 45)}>
          <AiAssist list={list} />
        </RailSlot>

        <span aria-hidden className="mx-0.5 hidden h-5 w-px bg-outline-variant/60 sm:block sm:h-px sm:w-5" />

        <span className="rail-item block" style={{ animationDelay: `${(delay += 45)}ms` }}>
          <button
            type="button"
            onClick={onRandom}
            data-sfx="dice"
            aria-label="Buka Pokémon rawak"
            className="dice-float grid size-10 place-items-center rounded-full bg-primary text-on-primary shadow-e2 transition-transform hover:scale-110 active:scale-90"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <path d="M8 12h8" />
              <path d="m13 8 4 4-4 4" />
            </svg>
          </button>
        </span>
      </div>
    </aside>
  );
}
