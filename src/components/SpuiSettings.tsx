"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { SPUI_PERF_LEVELS, setSpuiPerf, type SpuiPerf } from "../lib/spui-perf";

export default function SpuiSettings({
  open,
  perf,
  onClose,
}: {
  open: boolean;
  perf: SpuiPerf;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Tetapan SPUI"
        className="absolute inset-y-0 right-0 flex w-84 max-w-[88vw] flex-col border-l border-outline-variant shadow-e3"
        style={{ background: "var(--md-surface-container-low)" }}
      >
        <header className="flex items-start justify-between gap-2 border-b border-outline-variant/60 px-5 py-4">
          <div>
            <p className="font-display text-base font-extrabold tracking-tight text-on-surface">
              Tetapan SPUI
            </p>
            <p className="text-xs text-on-surface-variant">
              Kawalan prestasi untuk UI ringkas — pilih tahap yang sesuai dengan peranti anda.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-sfx="close"
            aria-label="Tutup tetapan SPUI"
            className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-container-high text-on-surface-variant transition-colors hover:bg-surface-container-highest"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="font-display text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Prestasi
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {SPUI_PERF_LEVELS.map((l) => {
              const active = l.id === perf;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    if (!active) setSpuiPerf(l.id);
                    onClose();
                  }}
                  data-sfx={active ? undefined : "toggle-on"}
                  aria-pressed={active}
                  className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-colors ${
                    active
                      ? "border-primary bg-primary-container"
                      : "border-outline-variant bg-surface-container hover:bg-surface-container-high"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 ${
                      active ? "border-primary" : "border-outline-variant"
                    }`}
                  >
                    {active && <span className="size-2.5 rounded-full bg-primary" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-sm font-extrabold text-on-surface">
                      {l.label}
                    </span>
                    <span className="block text-xs leading-snug text-on-surface-variant">
                      {l.desc}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-on-surface-variant">
            Tahap prestasi mengawal bilangan Pokémon sehalaman, kepadatan grid dan cara imej dimuat
            (lazy/eager). Pilihan diingati dalam pelayar.
          </p>
        </div>

        <footer className="border-t border-outline-variant/60 px-5 py-3">
          <p className="text-[11px] text-on-surface-variant">
            SPUI — Simple Pokedex UI. UI penuh bermasalah? Terus guna laman di sini.
          </p>
        </footer>
      </aside>
    </div>,
    document.body
  );
}
