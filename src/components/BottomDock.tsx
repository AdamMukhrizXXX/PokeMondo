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
      <div className="dock-in no-scrollbar pointer-events-auto flex max-w-[96vw] items-start gap-1 overflow-x-auto rounded-[1.75rem] border border-outline-variant/70 bg-surface-low/85 px-2 py-2 shadow-e3 backdrop-blur-md sm:items-center sm:rounded-full">
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
            className="grid size-10 place-items-center rounded-full text-on-surface-variant transition-all duration-300 hover:scale-110 hover:bg-surface-container-high hover:text-on-surface active:scale-90"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0c2.5 2.5 2.5 15.5 0 18M3 12h18" />
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
