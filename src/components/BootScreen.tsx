"use client";

import { useEffect, useRef, useState } from "react";
import { usePokedexData } from "../lib/pokedex-context";

const BOOT_MS = 40000;

const PHASES: [number, string][] = [
  [0, "Menyambung ke PokéAPI…"],
  [6, "Memuat senarai 1,025 Pokémon…"],
  [28, "Menyusun sembilan generasi…"],
  [52, "Menyiapkan artwork & statistik…"],
  [78, "Meletal akhir — hampir siap…"],
];

function SkeletonCard() {
  return (
    <div className="rounded-[1.25rem] border border-outline-variant/70 bg-surface-container-low p-3.5">
      <div className="boot-skel mx-auto aspect-square w-full max-w-24 rounded-2xl" />
      <div className="boot-skel mt-3 h-3.5 w-3/4 rounded-full" />
      <div className="mt-2 flex gap-1.5">
        <div className="boot-skel h-4 w-12 rounded-full" />
        <div className="boot-skel h-4 w-14 rounded-full" />
      </div>
    </div>
  );
}

export default function BootScreen({ onDone }: { onDone: () => void }) {
  const { list } = usePokedexData();
  const [pct, setPct] = useState(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    let finished = false;
    const tick = (t: number) => {
      const p = Math.min(100, ((t - start) / BOOT_MS) * 100);
      setPct(p);
      if (p >= 100) {
        if (!finished) {
          finished = true;
          try {
            localStorage.setItem("md-booted", "1");
          } catch {
            /* ignore */
          }
          onDoneRef.current();
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const phase = PHASES.filter(([t]) => t <= pct).pop()?.[1] ?? PHASES[0][1];

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col items-center overflow-y-auto px-5 py-10"
      style={{ background: "var(--md-surface)" }}
      role="status"
      aria-label="Memuatkan Pokédex"
    >
      <div className="flex w-full max-w-3xl flex-col items-center">
        <span
          aria-hidden
          className="grid size-14 place-items-center rounded-[1.4rem] bg-primary-container shadow-e2"
        >
          <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden>
            <defs>
              <linearGradient id="boot-ball" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ff6a48" />
                <stop offset="1" stopColor="#e3350d" />
              </linearGradient>
            </defs>
            <circle cx="12" cy="12" r="9.2" fill="url(#boot-ball)" stroke="#1a1a1a" strokeWidth="1.6" />
            <path d="M2.8 12h18.4" stroke="#1a1a1a" strokeWidth="1.6" />
            <circle cx="12" cy="12" r="3.1" fill="#ffffff" stroke="#1a1a1a" strokeWidth="1.6" />
            <circle cx="12" cy="12" r="1.2" fill="#1a1a1a" />
          </svg>
        </span>
        <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          <span className="pokex-gradient-text">PokeMondo</span>
        </h1>
        <p className="pokex-shiny mt-1 font-display text-sm font-bold">{phase}</p>
        {list.length > 0 && (
          <p className="mt-0.5 text-[11px] font-semibold tabular-nums text-on-surface-variant">
            {list.length.toLocaleString("ms-MY")} / 1,025 Pokémon sedia
          </p>
        )}
      </div>

      <div className="mt-7 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      <div className="mt-8 w-full max-w-sm">
        <div className="flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container-high">
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg, #ff6a48, #ffc531)",
                transition: "width 0.2s linear",
              }}
            />
          </div>
          <span className="shrink-0 font-display text-xs font-bold tabular-nums text-on-surface-variant">
            {Math.round(pct)}%
          </span>
          <span className="shrink-0 font-display text-xs font-bold tabular-nums text-on-surface-variant">
            {Math.ceil((BOOT_MS * (100 - pct)) / 100 / 1000)}s
          </span>
        </div>
        <p className="mt-2 text-center text-[11px] leading-relaxed text-on-surface-variant">
          Memuatkan keseluruhan Pokédex (1,025 Pokémon, 9 generasi) — anggaran 40 saat.
        </p>
      </div>
    </div>
  );
}
