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
        className={`relative grid size-10 place-items-center rounded-full transition-colors ${
          hasWp || open
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
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <circle cx="9" cy="10" r="1.8" />
          <path d="m4.5 18.5 5-4.5 3.5 3 3-2.5 3.5 4" />
        </svg>
        {hasWp && (
          <span aria-hidden className="absolute right-1 top-1 size-2 rounded-full bg-[#f0a92e]" />
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
