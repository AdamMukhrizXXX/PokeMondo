"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  applyWallpaper,
  deleteWallpaper,
  isWallpaperSupported,
  loadPrefs,
  loadWallpaperUrl,
  MAX_WALLPAPER_BYTES,
  savePrefs,
  saveWallpaper,
} from "../lib/ui-db";

export default function WallpaperControl() {
  const [open, setOpen] = useState(false);
  const [hasWp, setHasWp] = useState(false);
  const [dim, setDim] = useState(0.45);
  const [blur, setBlur] = useState(0);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const prefs = loadPrefs();
    setDim(prefs.dim);
    setBlur(prefs.blur);
    loadWallpaperUrl().then((url) => {
      if (url) {
        setHasWp(true);
        applyWallpaper(url, prefs.dim, prefs.blur);
      }
    });
    const onOpen = () => setOpen(true);
    window.addEventListener("md-wp-open", onOpen);
    return () => window.removeEventListener("md-wp-open", onOpen);
  }, []);

  const updateDim = (v: number) => {
    setDim(v);
    savePrefs(v, blur);
    loadWallpaperUrl().then((url) => applyWallpaper(url, v, blur));
  };

  const updateBlur = (v: number) => {
    setBlur(v);
    savePrefs(dim, v);
    loadWallpaperUrl().then((url) => applyWallpaper(url, dim, v));
  };

  const onPick = async (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    setBusy(true);
    setErr("");
    try {
      await saveWallpaper(f);
      const url = await loadWallpaperUrl();
      applyWallpaper(url, dim, blur);
      setHasWp(true);
    } catch (e) {
      const code = (e as Error).message;
      setErr(
        code === "too-large"
          ? `Imej terlalu besar (maks ${Math.round(MAX_WALLPAPER_BYTES / 1024 / 1024)}MB).`
          : code === "not-image"
            ? "Fail bukan imej. Guna JPG / PNG / WebP."
            : "Gagal menyimpan latar dalam pelayar ini.",
      );
    }
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onRemove = async () => {
    try {
      await deleteWallpaper();
    } catch {
      /* ignore */
    }
    applyWallpaper(null);
    setHasWp(false);
    document.documentElement.style.removeProperty("--wp-dim");
    document.documentElement.style.removeProperty("--wp-blur");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Latar custom — tukar gambar latar belakang"
        className={`group relative grid size-10 place-items-center rounded-full transition-all duration-300 hover:scale-110 active:scale-90 ${
          hasWp || open
            ? "bg-primary-container shadow-e1"
            : "bg-secondary-container shadow-e1"
        }`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
          <defs>
            <linearGradient id="pm-wp-frame" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#2dd4bf" />
              <stop offset="1" stopColor="#2f7cf6" />
            </linearGradient>
            <linearGradient id="pm-wp-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#bfe8ff" />
              <stop offset="1" stopColor="#eef9ff" />
            </linearGradient>
            <linearGradient id="pm-wp-mtn" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#00a878" />
              <stop offset="1" stopColor="#0d9488" />
            </linearGradient>
            <linearGradient id="pm-wp-glint" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <clipPath id="pm-wp-clip">
              <rect x="3.75" y="4.75" width="16.5" height="14.5" rx="2.4" />
            </clipPath>
          </defs>
          <rect x="2.8" y="3.8" width="18.4" height="16.4" rx="3.2" fill="url(#pm-wp-sky)" />
          <g clipPath="url(#pm-wp-clip)">
            <g className="wp-cloud" fill="#ffffff">
              <circle cx="5.6" cy="7.4" r="1.05" />
              <circle cx="7.2" cy="6.8" r="1.25" />
              <circle cx="8.7" cy="7.6" r="0.9" />
              <rect x="5.6" y="7.4" width="3.1" height="1.1" rx="0.55" />
            </g>
            <g className="wp-rays" stroke="#ff9800" strokeWidth="1.1" strokeLinecap="round">
              <path d="M18.9 9.1h1.1" />
              <path d="M18 11.2l0.8 0.8" />
              <path d="M15.9 12.1v1.1" />
              <path d="M13.8 11.2l-0.8 0.8" />
              <path d="M12.9 9.1h-1.1" />
              <path d="M13.8 7l-0.8-0.8" />
              <path d="M15.9 6.1V5" />
              <path d="M18 7l0.8-0.8" />
            </g>
            <circle
              cx="15.9"
              cy="9.1"
              r="2.1"
              fill="#ffc531"
              stroke="#ff9800"
              strokeWidth="0.8"
              className="wp-sun"
            />
            <path
              d="M3 20.2 8.4 11.8l4.3 4.4 2.8-2.7 5.5 5.6Z"
              fill="url(#pm-wp-mtn)"
              stroke="#065f56"
              strokeOpacity="0.5"
              strokeWidth="0.9"
            />
            <g className="wp-glint">
              <rect
                x="7.6"
                y="9.6"
                width="1.7"
                height="13"
                fill="url(#pm-wp-glint)"
                transform="rotate(32 8.45 16.1)"
              />
            </g>
          </g>
          <rect
            x="2.8"
            y="3.8"
            width="18.4"
            height="16.4"
            rx="3.2"
            fill="none"
            stroke="url(#pm-wp-frame)"
            strokeWidth="1.9"
          />
        </svg>
        {hasWp && (
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
          className="anim-rise fixed inset-x-4 top-[4.75rem] z-50 rounded-[1.75rem] border border-outline-variant p-5 shadow-e3 sm:inset-x-auto sm:right-6 sm:top-[4.75rem] sm:w-80"
          style={{ background: "var(--md-surface-container-low)" }}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-display text-sm font-extrabold tracking-tight text-on-surface">
                Latar Custom
              </p>
              <p className="text-[11px] text-on-surface-variant">
                Gambar anda sendiri sebagai latar belakang web
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              data-sfx="close"
              aria-label="Tutup latar custom"
              className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-container-high text-on-surface-variant transition-colors hover:bg-surface-container-highest"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => void onPick(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy || !isWallpaperSupported()}
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary font-display text-sm font-bold text-on-primary shadow-e1 transition-transform active:scale-95 disabled:opacity-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 16V5m0 0-4 4m4-4 4 4" />
              <path d="M5 19h14" />
            </svg>
            {busy ? "Menyimpan…" : hasWp ? "Tukar gambar…" : "Pilih gambar…"}
          </button>

          <div className="mt-4">
            <label className="flex items-center justify-between text-xs font-semibold text-on-surface-variant">
              Kelam latar
              <span className="tabular-nums">{Math.round(dim * 100)}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={90}
              step={5}
              value={Math.round(dim * 100)}
              onChange={(e) => updateDim(Number(e.target.value) / 100)}
              aria-label="Keamtan latar"
              className="mt-1.5 w-full"
            />
          </div>

          <div className="mt-3">
            <label className="flex items-center justify-between text-xs font-semibold text-on-surface-variant">
              Kabur (blur)
              <span className="tabular-nums">{blur}px</span>
            </label>
            <input
              type="range"
              min={0}
              max={16}
              step={1}
              value={blur}
              onChange={(e) => updateBlur(Number(e.target.value))}
              aria-label="Kabur latar"
              className="mt-1.5 w-full"
            />
          </div>

          {err && (
            <p className="mt-3 text-xs font-semibold" style={{ color: "var(--md-error)" }}>
              {err}
            </p>
          )}

          <p className="mt-3 text-[11px] leading-relaxed text-on-surface-variant">
            {isWallpaperSupported()
              ? "Disimpan kekal dalam pelayar anda (IndexedDB, maks 12MB) — kekal walaupun selepas tutup tab."
              : "Pelayar ini tidak menyokong IndexedDB — latar custom tidak tersedia."}
          </p>

          {hasWp && (
            <button
              type="button"
              onClick={() => void onRemove()}
              className="mt-3 flex h-10 w-full items-center justify-center rounded-full border font-display text-sm font-bold transition-colors hover:bg-surface-container"
              style={{ borderColor: "var(--md-error)", color: "var(--md-error)" }}
            >
              Padam latar custom
            </button>
          )}
        </div>,
        document.body
      )}
    </>
  );
}
