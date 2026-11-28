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
        className={`group relative grid size-10 place-items-center rounded-full shadow-e1 transition-all duration-300 hover:scale-110 active:scale-90 ${
          isSimple || open ? "bg-primary-container" : "bg-secondary-container"
        }`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
          <defs>
            <linearGradient id="pm-spui-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ff6a48" />
              <stop offset="1" stopColor="#e3350d" />
            </linearGradient>
            <linearGradient id="pm-spui-scan" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <clipPath id="pm-spui-clip">
              <rect x="7.4" y="5.2" width="9.2" height="7.2" rx="1.6" />
            </clipPath>
          </defs>
          <rect
            x="5"
            y="2.8"
            width="14"
            height="18.4"
            rx="3.2"
            fill="url(#pm-spui-body)"
            stroke="#7f1d0d"
            strokeOpacity="0.45"
            strokeWidth="1.3"
          />
          <rect
            x="7.4"
            y="5.2"
            width="9.2"
            height="7.2"
            rx="1.6"
            fill="#eef9ff"
            stroke="#1a1a1a"
            strokeOpacity="0.25"
            strokeWidth="0.9"
          />
          <g clipPath="url(#pm-spui-clip)">
            <path
              d="M8.2 11.2 10.6 8.6l2 2 1.4-1.3 2 2.1"
              fill="none"
              stroke="#2dd4bf"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              className="spui-scan"
              x="6.6"
              y="4.8"
              width="2.6"
              height="8"
              fill="url(#pm-spui-scan)"
            />
          </g>
          <circle
            className="spui-lens-halo"
            cx="12"
            cy="16.4"
            r="2.9"
            fill="none"
            stroke="#2dd4bf"
            strokeWidth="1"
          />
          <circle cx="12" cy="16.4" r="2.5" fill="#ffffff" stroke="#1a1a1a" strokeWidth="1.1" />
          <circle cx="12" cy="16.4" r="1.05" fill="#1a1a1a" />
          <circle cx="12.5" cy="15.9" r="0.32" fill="#ffffff" opacity="0.9" />
          <circle className="spui-led" cx="16.7" cy="4.9" r="0.8" fill="#00a878" />
        </svg>
        {isSimple && (
          <span
            aria-hidden
            className="absolute right-1 top-1 size-2 animate-pulse rounded-full bg-[#f0a92e]"
          />
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
