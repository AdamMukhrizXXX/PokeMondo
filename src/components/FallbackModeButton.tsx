"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { setUiMode, useUiMode } from "../lib/ui-mode";

export default function FallbackModeButton() {
  const mode = useUiMode();
  const [open, setOpen] = useState(false);
  const isSimple = mode === "simple";

  const switchMode = (next: "full" | "simple") => {
    setOpen(false);
    setUiMode(next);
  };

  useEffect(() => {
    if (!open) return;
    const onScroll = () => setOpen(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Sistem UI Cadangan — tukar antara UI penuh dan UI ringkas"
        className={`relative grid size-10 place-items-center rounded-full transition-colors ${
          isSimple || open
            ? "bg-primary text-on-primary"
            : "bg-secondary-container text-on-secondary-container"
        }`}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 3 3.5 18.5h17L12 3Z" />
          <path d="M12 9.5v4.5m0 3v.01" />
        </svg>
        {isSimple && (
          <span aria-hidden className="absolute right-1 top-1 size-2 rounded-full bg-[#f0a92e]" />
        )}
      </button>

      {open &&
        createPortal(
        <div
          className="anim-rise fixed inset-x-4 top-[4.75rem] z-50 rounded-[1.75rem] border border-outline-variant p-5 shadow-e3 sm:inset-x-auto sm:right-6 sm:top-[4.75rem] sm:w-72"
          style={{ background: "var(--md-surface-container-low)" }}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-display text-sm font-extrabold tracking-tight text-on-surface">
                Sistem UI Cadangan
              </p>
              <p className="text-[11px] text-on-surface-variant">
                UI penuh bug? Pengunjung masih boleh guna laman.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              data-sfx="close"
              aria-label="Tutup panel UI Cadangan"
              className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-container-high text-on-surface-variant transition-colors hover:bg-surface-container-highest"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-surface-container px-4 py-3">
            <span
              aria-hidden
              className={`size-2 rounded-full ${isSimple ? "bg-[#f0a92e]" : "bg-primary"}`}
            />
            <p className="text-sm font-semibold text-on-surface">
              Mod kini: {isSimple ? "UI Cadangan (ringkas)" : "UI Penuh"}
            </p>
          </div>

          <div className="mt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => switchMode("simple")}
              disabled={isSimple}
              className="flex h-10 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-on-primary shadow-e1 transition-transform active:scale-95 disabled:opacity-40"
            >
              Guna UI Cadangan
            </button>
            <button
              type="button"
              onClick={() => switchMode("full")}
              disabled={!isSimple}
              className="flex h-10 items-center justify-center rounded-full border border-outline-variant font-display text-sm font-bold text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-40"
            >
              Balik UI Penuh
            </button>
          </div>

          <p className="mt-3 text-[11px] leading-relaxed text-on-surface-variant">
            UI Cadangan ialah versi ringkas tanpa animasi: carian, penapis jenis, halaman, dan
            modal butiran. Jika mana-mana bahagian UI utama rosak, kad ralat dengan butang
            "Guna UI Cadangan" muncul di tempatnya. Pilihan diingati dalam pelayar.
          </p>
        </div>,
        document.body
      )}
    </>
  );
}
