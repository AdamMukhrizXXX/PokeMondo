"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { setUiMode, useUiMode } from "../lib/ui-mode";
import SpuiExitConfirm from "./SpuiExitConfirm";
import { useDevicePerf } from "../lib/device-perf";

function fpsColor(fps: number) {
  if (fps >= 50) return "#00a878";
  if (fps >= 30) return "#f0a92e";
  return "#e3350d";
}

export default function FallbackModeButton() {
  const mode = useUiMode();
  const [open, setOpen] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const isSimple = mode === "simple";
  const { fps, info, auto, setAuto, lite } = useDevicePerf();

  const switchMode = (next: "full" | "simple") => {
    setOpen(false);
    setUiMode(next);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="SPUI (Simple Pokedex UI) \u2014 tukar antara UI penuh dan UI ringkas"
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
          data-portal-panel
          className="anim-rise fixed inset-x-4 top-[4.75rem] z-50 max-h-[86svh] overflow-y-auto rounded-[1.75rem] border border-outline-variant p-5 shadow-e3 sm:inset-x-auto sm:right-6 sm:top-[4.75rem] sm:w-80"
          style={{ background: "var(--md-surface-container-low)" }}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-display text-sm font-extrabold tracking-tight text-on-surface">
                SPUI
              </p>
              <p className="text-[11px] text-on-surface-variant">
                Simple Pokedex UI — UI penuh bug? Pengunjung masih boleh guna laman.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              data-sfx="close"
              aria-label="Tutup panel SPUI"
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
              Mod kini: {isSimple ? "SPUI (ringkas)" : "UI Penuh"}
            </p>
          </div>

          <div className="mt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => switchMode("simple")}
              disabled={isSimple}
              className="flex h-10 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-on-primary shadow-e1 transition-transform active:scale-95 disabled:opacity-40"
            >
              Guna SPUI
            </button>
            <button
              type="button"
              onClick={() => setConfirmExit(true)}
              disabled={!isSimple}
              className="flex h-10 items-center justify-center rounded-full border border-outline-variant font-display text-sm font-bold text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-40"
            >
              Balik UI Penuh
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-outline-variant/70 bg-surface-container/60 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="font-display text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Prestasi &amp; Peranti
              </p>
              <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-[10px] font-bold text-on-surface-variant">
                Auto-Detect
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span
                aria-hidden
                className="size-2.5 rounded-full"
                style={{ background: fps > 0 ? fpsColor(fps) : "var(--md-outline-variant)" }}
              />
              <p className="font-display text-sm font-extrabold tabular-nums text-on-surface">
                {fps > 0 ? `${fps} FPS` : "Mengukur\u2026"}
              </p>
              <span className="text-[10px] font-semibold text-on-surface-variant">masa-nyata</span>
              {lite && (
                <span className="ml-auto rounded-full bg-tertiary-container px-2 py-0.5 text-[10px] font-bold text-on-tertiary-container">
                  GPU Lite
                </span>
              )}
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-1.5 text-[11px]">
              <div className="rounded-xl bg-surface-container px-2.5 py-1.5">
                <dt className="font-semibold text-on-surface-variant">GPU</dt>
                <dd className="truncate font-bold text-on-surface" title={info?.gpu}>
                  {info?.gpu ?? "\u2014"}
                </dd>
              </div>
              <div className="rounded-xl bg-surface-container px-2.5 py-1.5">
                <dt className="font-semibold text-on-surface-variant">CPU / RAM</dt>
                <dd className="font-bold text-on-surface">
                  {info?.cores ? `${info.cores} teras` : "\u2014"} /{" "}
                  {info?.memGB ? `${info.memGB} GB` : "\u2014"}
                </dd>
              </div>
              <div className="rounded-xl bg-surface-container px-2.5 py-1.5">
                <dt className="font-semibold text-on-surface-variant">Skrin</dt>
                <dd className="font-bold text-on-surface">
                  {info ? `${info.screen} @${info.dpr}x` : "\u2014"}
                </dd>
              </div>
              <div className="rounded-xl bg-surface-container px-2.5 py-1.5">
                <dt className="font-semibold text-on-surface-variant">Sentuh / Rangkaian</dt>
                <dd className="font-bold text-on-surface">
                  {info?.touch ? `${info.touch}-sentuh` : "tetikus"} /{" "}
                  {info?.net?.toUpperCase() ?? "\u2014"}
                </dd>
              </div>
            </dl>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                data-sfx="toggle-on"
                onClick={() => setAuto(!auto)}
                aria-pressed={auto}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                  auto ? "bg-primary" : "bg-surface-container-highest"
                }`}
                aria-label="Mod GPU Auto"
              >
                <span
                  aria-hidden
                  className={`absolute top-0.5 size-6 rounded-full bg-white shadow-e1 transition-all ${
                    auto ? "left-[1.375rem]" : "left-0.5"
                  }`}
                />
              </button>
              <p className="text-[11px] leading-snug text-on-surface-variant">
                <b className="text-on-surface">Mod GPU Auto</b> — jika FPS jatuh di bawah 40,
                kesan berat (kabur kaca, deco) dikurangkan automatik; kembali penuh bila lancar.
              </p>
            </div>
          </div>

          <p className="mt-3 text-[11px] leading-relaxed text-on-surface-variant">
            SPUI ialah versi ringkas tanpa animasi: carian, penapis jenis, halaman, dan modal
            butiran. Jika mana-mana bahagian UI utama rosak, kad ralat dengan butang &quot;Guna
            SPUI&quot; muncul di tempatnya. Pilihan diingati dalam pelayar.
          </p>
        </div>,
        document.body
      )}

      {confirmExit && <SpuiExitConfirm onClose={() => setConfirmExit(false)} />}
    </>
  );
}
