"use client";

import { usePokedexData } from "../lib/pokedex-context";
import { cycleSiteTheme, THEME_LABELS, useSiteTheme } from "../lib/site-theme";
import ThemeToggle from "./ThemeToggle";
import SoundToggle from "./SoundToggle";
import WallpaperControl from "./WallpaperControl";
import FallbackModeButton from "./FallbackModeButton";
import AiAssist from "./AiAssist";

function DockBtn({
  label,
  delay,
  children,
}: {
  label: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <span className="dock-item group relative flex flex-col items-center" style={{ animationDelay: `${delay}ms` }}>
      {children}
      <span
        role="presentation"
        className="pointer-events-none absolute bottom-full z-10 mb-2 hidden rounded-full bg-inverse-surface px-2.5 py-0.5 font-display text-[10px] font-bold whitespace-nowrap text-inverse-on-surface shadow-e2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 sm:block"
      >
        {label}
      </span>
      <span className="mt-0.5 text-center font-display text-[9px] font-bold leading-tight text-on-surface-variant sm:hidden">
        {label}
      </span>
    </span>
  );
}

export default function BottomDock() {
  const { list, random } = usePokedexData();
  const siteTheme = useSiteTheme();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(env(safe-area-inset-bottom),0.9rem)] z-50 flex justify-center px-3">
      <div className="dock-in no-scrollbar pointer-events-auto flex max-w-[96vw] items-start gap-1 overflow-x-auto sm:overflow-visible rounded-[1.75rem] border border-outline-variant/70 bg-surface-low/85 px-2 py-2 shadow-e3 backdrop-blur-md sm:items-center sm:rounded-full">
        <DockBtn label="Bunyi" delay={60}>
          <SoundToggle />
        </DockBtn>
        <DockBtn label="Cerah/Gelap" delay={110}>
          <ThemeToggle compact />
        </DockBtn>
        <DockBtn label={`Tema: ${THEME_LABELS[siteTheme]}`} delay={160}>
          <button
            type="button"
            data-sfx="toggle-on"
            aria-label={`Tukar tema laman: ${THEME_LABELS[siteTheme]}`}
            onClick={() => cycleSiteTheme()}
            className="group grid size-10 place-items-center rounded-full text-on-surface-variant transition-all duration-300 hover:scale-110 hover:bg-surface-container-high hover:text-on-surface active:scale-90"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" className="transition-transform duration-500 group-hover:rotate-[25deg]" aria-hidden>
              <defs>
                <linearGradient id="pm-palette" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="var(--md-primary)" />
                  <stop offset="0.5" stopColor="var(--md-tertiary)" />
                  <stop offset="1" stopColor="#00a878" />
                </linearGradient>
              </defs>
              <path
                d="M12 3a9 9 0 0 0 0 18c1.3 0 2.1-.9 2.1-1.9 0-.5-.2-.9-.5-1.3-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8h2.1a4 4 0 0 0 4-4C21 6.6 17 3 12 3Z"
                fill="url(#pm-palette)"
              />
              <circle cx="8.2" cy="9.2" r="1.5" fill="#e3350d" />
              <circle cx="12.6" cy="6.8" r="1.5" fill="#ffc531" />
              <circle cx="16.6" cy="10.4" r="1.5" fill="#2f7cf6" />
              <circle cx="7.4" cy="13.8" r="1.5" fill="#00a878" />
            </svg>
          </button>
        </DockBtn>
        <DockBtn label="Latar Custom" delay={210}>
          <WallpaperControl />
        </DockBtn>
        <DockBtn label="UI Cadangan" delay={260}>
          <FallbackModeButton />
        </DockBtn>
        <DockBtn label="AI Anal" delay={310}>
          <AiAssist list={list} />
        </DockBtn>

        <span aria-hidden className="mx-1 hidden h-6 w-px self-center bg-outline-variant/60 sm:block" />

        <DockBtn label="Rawak" delay={380}>
          <button
            type="button"
            onClick={random}
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
        </DockBtn>
      </div>
    </div>
  );
}
