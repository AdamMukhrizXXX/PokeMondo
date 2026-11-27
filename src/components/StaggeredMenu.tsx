"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BasicPokemon } from "../lib/pokemon";
import { useScrollSpy } from "../lib/pokemon";
import { cycleSiteTheme, THEME_LABELS, useSiteTheme } from "../lib/site-theme";
import ThemeToggle from "./ThemeToggle";
import SoundToggle from "./SoundToggle";
import WallpaperControl from "./WallpaperControl";
import FallbackModeButton from "./FallbackModeButton";
import AiAssist from "./AiAssist";

const NAV_ITEMS = [
  { id: "rumah", label: "Rumah" },
  { id: "galeri", label: "Galeri" },
  { id: "kuiz", label: "Kuiz" },
  { id: "dex", label: "Pokédex" },
  { id: "info", label: "Info" },
];

const TEXT_LINES = ["Menu", "Close", "Menu", "Close", "Menu", "Close"];

export default function StaggeredMenu({
  onRandom,
  list,
}: {
  onRandom: () => void;
  list: BasicPokemon[];
}) {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const panelRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const active = useScrollSpy(NAV_ITEMS.map((n) => n.id));
  const siteTheme = useSiteTheme();

  const setOpenSafe = useCallback((next: boolean) => {
    if (openRef.current === next) return;
    openRef.current = next;
    setOpen(next);
  }, []);

  const toggle = useCallback(() => {
    setOpenSafe(!openRef.current);
  }, [setOpenSafe]);

  const close = useCallback(() => setOpenSafe(false), [setOpenSafe]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target instanceof Element ? e.target : null;
      if (panelRef.current?.contains(t)) return;
      if (toggleRef.current?.contains(t)) return;
      close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const go = useCallback(
    (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      close();
    },
    [close],
  );

  let slotDelay = 0;

  return (
    <div className="sm-scope" data-position="left" data-open={open || undefined}>
      <div className="sm-prelayers" aria-hidden="true">
        <div
          className="sm-prelayer"
          style={{
            background: "var(--md-secondary-container)",
            transitionDelay: open ? "0s" : "0s",
          }}
        />
        <div
          className="sm-prelayer"
          style={{
            background: "var(--md-tertiary-container)",
            transitionDelay: open ? "0.07s" : "0s",
          }}
        />
      </div>

      <aside
        id="staggered-menu-panel"
        ref={panelRef}
        className="sm-panel"
        aria-hidden={!open}
        inert={!open || undefined}
      >
        <nav aria-label="Navigasi utama">
          <ul className="sm-panel-list" data-numbering="true">
            {NAV_ITEMS.map((item, i) => (
              <li className="sm-panel-itemWrap" key={item.id}>
                <button
                  type="button"
                  className="sm-panel-item"
                  data-sfx="click"
                  aria-current={active === item.id ? "true" : undefined}
                  style={{ ["--sm-delay" as string]: open ? `${0.32 + i * 0.1}s` : "0s" }}
                  onClick={() => go(item.id)}
                >
                  <span className="sm-panel-itemLabel">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sm-controls">
          <p className="sm-controls-title">Kawalan</p>
          <div className="sm-controls-row">
            <Slot delay={(slotDelay += 0.08)} open={open} label="Bunyi">
              <SoundToggle />
            </Slot>
            <Slot delay={(slotDelay += 0.08)} open={open} label="Cerah/Gelap">
              <ThemeToggle compact />
            </Slot>
            <Slot delay={(slotDelay += 0.08)} open={open} label={`Tema: ${THEME_LABELS[siteTheme]}`}>
              <button
                type="button"
                data-sfx="toggle-on"
                aria-label={`Tukar tema laman: ${THEME_LABELS[siteTheme]}`}
                onClick={() => cycleSiteTheme()}
                className="sm-ctl-btn grid size-10 place-items-center rounded-full border border-outline-variant/60 bg-surface-low text-on-surface-variant transition-transform hover:scale-110 active:scale-90"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0c2.5 2.5 2.5 15.5 0 18M3 12h18" />
                </svg>
              </button>
            </Slot>
            <Slot delay={(slotDelay += 0.08)} open={open} label="Latar Custom">
              <WallpaperControl />
            </Slot>
            <Slot delay={(slotDelay += 0.08)} open={open} label="UI Cadangan">
              <FallbackModeButton />
            </Slot>
            <Slot delay={(slotDelay += 0.08)} open={open} label="AI Anal">
              <AiAssist list={list} />
            </Slot>
            <Slot delay={(slotDelay += 0.08)} open={open} label="Rawak">
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
            </Slot>
          </div>
        </div>
      </aside>

      <button
        ref={toggleRef}
        type="button"
        className="sm-toggle"
        aria-expanded={open}
        aria-controls="staggered-menu-panel"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        onClick={toggle}
      >
        <span className="sm-toggle-textWrap" aria-hidden="true">
          <span
            className="sm-toggle-textInner"
            style={{
              transform: open ? "translateY(-83.333%)" : "translateY(0)",
              transitionDuration: open ? "0.92s" : "0.5s",
            }}
          >
            {TEXT_LINES.map((line, i) => (
              <span className="sm-toggle-line" key={i}>
                {line}
              </span>
            ))}
          </span>
        </span>
        <span className="sm-icon" aria-hidden="true">
          <span className="sm-icon-line sm-icon-line-h" />
          <span className="sm-icon-line sm-icon-line-v" />
        </span>
      </button>
    </div>
  );
}

function Slot({
  delay,
  open,
  label,
  children,
}: {
  delay: number;
  open: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className="sm-slot"
      style={{ ["--sm-delay" as string]: open ? `${delay}s` : "0s" }}
    >
      {children}
      <span className="sm-slot-label">{label}</span>
    </span>
  );
}
