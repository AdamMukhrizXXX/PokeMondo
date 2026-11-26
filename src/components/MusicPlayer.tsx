"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  addImportedBgm,
  getBgmShuffle,
  getBgmTrack,
  getBgmVolume,
  isBgmOn,
  nextBgm,
  pauseBgm,
  playBgmById,
  prevBgm,
  removeImportedBgm,
  resumeBgm,
  setBgmVolume,
  toggleShuffleBgm,
  useBgmState,
} from "../lib/bgm";
import {
  deleteImported,
  isImportSupported,
  listImported,
  putImported,
  type ImportedMeta,
} from "../lib/import-db";
import { useRipple } from "./Ripple";

const SIZE = "3.75rem";

function fmt(s: number) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function IconBtn({
  onClick,
  label,
  children,
  active = false,
  small = false,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  active?: boolean;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`grid place-items-center rounded-full transition-all active:scale-90 ${
        small ? "size-9" : "size-11"
      } ${active ? "bg-secondary-container text-on-secondary-container" : "text-on-surface-variant hover:bg-surface-container-high"}`}
    >
      {children}
    </button>
  );
}

export default function MusicPlayer({
  expanded,
  onSetExpanded,
}: {
  expanded: boolean;
  onSetExpanded: (v: boolean) => void;
}) {
  const { playing, index, shuffle, count } = useBgmState();
  const [volValue, setVolValue] = useState(() => Math.round(getBgmVolume() * 100));
  const track = getBgmTrack(index);
  const [imports, setImports] = useState<ImportedMeta[]>([]);
  const [busy, setBusy] = useState(false);
  const [importErr, setImportErr] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef<HTMLSpanElement | null>(null);
  const durRef = useRef<HTMLSpanElement | null>(null);
  const seekRef = useRef<HTMLDivElement | null>(null);
  const miniRef = useRef<HTMLSpanElement | null>(null);
  const ripple = useRipple();

  useEffect(() => {
    setVolValue(Math.round(getBgmVolume() * 100));
  }, []);

  useEffect(() => {
    let cancelled = false;
    listImported()
      .then((metas) => {
        if (cancelled) return;
        setImports(metas);
        addImportedBgm(metas);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => {
      const el = document.querySelector<HTMLAudioElement>("audio[data-bgm]");
      if (el) {
        if (barRef.current && el.duration) {
          barRef.current.style.width = `${((el.currentTime / el.duration) * 100).toFixed(2)}%`;
        }
        if (timeRef.current) timeRef.current.textContent = fmt(el.currentTime);
        if (durRef.current && el.duration) durRef.current.textContent = fmt(el.duration);
        if (miniRef.current) {
          const left = el.duration ? Math.max(0, el.duration - el.currentTime) : 0;
          miniRef.current.textContent = el.duration ? fmt(left) : "--:--";
          miniRef.current.style.color = left <= 10 && el.duration ? "var(--md-error)" : "";
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = document.querySelector<HTMLAudioElement>("audio[data-bgm]");
    if (!el || !el.duration || !seekRef.current) return;
    const r = seekRef.current.getBoundingClientRect();
    el.currentTime = ((e.clientX - r.left) / r.width) * el.duration;
  };

  const vol = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolValue(Number(e.target.value));
    setBgmVolume(Number(e.target.value) / 100);
  };

  const lastVol = useRef(0.55);
  const toggleMute = () => {
    if (volValue > 0) {
      lastVol.current = volValue / 100;
      setVolValue(0);
      setBgmVolume(0);
    } else {
      const v = lastVol.current || 0.55;
      setVolValue(Math.round(v * 100));
      setBgmVolume(v);
    }
  };

  const AUDIO_RE = /\.(mp3|ogg|oga|m4a|aac|wav|flac|opus)$/i;
  const MAX_AUDIO = 25 * 1024 * 1024;

  const onPick = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setImportErr("");
    const saved: ImportedMeta[] = [];
    let skipped = 0;
    for (const f of Array.from(files)) {
      const valid = (f.type.startsWith("audio/") || AUDIO_RE.test(f.name)) && f.size > 0 && f.size <= MAX_AUDIO;
      if (!valid) {
        skipped += 1;
        continue;
      }
      try {
        saved.push(await putImported(f, f.name));
      } catch {
        skipped += 1;
      }
    }
    if (saved.length > 0) addImportedBgm(saved);
    try {
      setImports(await listImported());
    } catch {
      /* kekal senarai lama */
    }
    setImportErr(
      saved.length === 0
        ? "Tiada fail audio sah (mp3 / ogg / m4a / wav / flac, ≤ 25MB)."
        : skipped > 0
          ? `${skipped} fail dilangkau (bukan audio atau melebihi 25MB).`
          : "",
    );
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";
  }, []);

  const onRemoveImport = useCallback(async (key: string) => {
    try {
      await deleteImported(key);
    } catch {
      /* ignore */
    }
    removeImportedBgm(key);
    try {
      setImports(await listImported());
    } catch {
      /* ignore */
    }
  }, []);

  const firstGesture = useRef(false);
  useEffect(() => {
    const onFirst = () => {
      if (firstGesture.current) return;
      firstGesture.current = true;
      if (isBgmOn()) void resumeBgm();
    };
    window.addEventListener("pointerdown", onFirst, { once: true });
    return () => window.removeEventListener("pointerdown", onFirst);
  }, []);

  return (
    <div
      className="overflow-hidden transition-all duration-500 ease-out"
      style={{
        background: "var(--md-surface-container-low)",
        boxShadow: "var(--shadow-e3)",
        border: "1px solid var(--md-outline-variant)",
        width: expanded ? "19rem" : SIZE,
        borderRadius: expanded ? "1.75rem" : "9999px",
      }}
    >
      {!expanded ? (
        <button
          type="button"
          aria-label={playing ? "Buka pemain muzik" : "Mainkan muzik latar"}
          onClick={(e) => {
            ripple(e);
            if (!playing) void resumeBgm();
            onSetExpanded(true);
          }}
          className="flex flex-col items-center justify-center gap-0.5"
          style={{ width: SIZE, height: SIZE }}
        >
          <span className="relative grid place-items-center">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={playing ? "text-primary" : "text-on-surface-variant"}
              aria-hidden
            >
              <path d="M9 18V5l11-2v13" />
              <circle cx="6.5" cy="18" r="2.8" />
              <circle cx="17.5" cy="16" r="2.8" />
            </svg>
            {playing && (
              <span aria-hidden className="absolute -right-1.5 -top-1 flex gap-[2px]">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-[2.5px] rounded-full bg-primary"
                    style={{ height: "10px", animation: `eq-bar 0.9s ease-in-out ${i * 0.15}s infinite` }}
                  />
                ))}
              </span>
            )}
          </span>
          {playing && (
            <span
              ref={miniRef}
              aria-label="Masa tersisa lagu ini"
              className="font-mono text-[9px] font-bold leading-none tabular-nums text-on-surface-variant"
            >
              --:--
            </span>
          )}
        </button>
      ) : (
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div
              className="grid size-11 shrink-0 place-items-center rounded-2xl"
              style={{
                background: "linear-gradient(135deg, var(--md-primary), var(--md-tertiary-container))",
                color: "var(--md-on-primary-container)",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M9 18V5l11-2v13" />
                <circle cx="6.5" cy="18" r="2.8" />
                <circle cx="17.5" cy="16" r="2.8" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-bold text-on-surface">
                {track.title}
              </p>
              <p className="truncate text-xs text-on-surface-variant">
                {track.game}
                <span className="mx-1.5 text-outline">|</span>
                {(index + 1).toString()}/{count}
              </p>
            </div>
            <button
              type="button"
              aria-label="Tutup pemain muzik"
              onClick={() => onSetExpanded(false)}
              className="grid size-8 place-items-center rounded-full bg-surface-container-high text-on-surface-variant transition-colors hover:bg-surface-container-highest"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <div
            ref={seekRef}
            onClick={seek}
            role="slider"
            aria-label="Cari kedudukan lagu"
            className="mt-3 cursor-pointer py-1.5"
          >
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-container-highest">
              <div ref={barRef} className="h-full rounded-full bg-primary" style={{ width: "0%" }} />
            </div>
            <div className="mt-1 flex justify-between font-display text-[10px] font-semibold text-on-surface-variant">
              <span ref={timeRef}>0:00</span>
              <span ref={durRef}>-:--</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <IconBtn
              small
              label="Putar rawak"
              onClick={toggleShuffleBgm}
              active={shuffle || getBgmShuffle()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M3 7h3.5L12 17h5" />
                <path d="m15 14 2.5 3L15 20" />
                <path d="M3 17h3.5l2-3" />
                <path d="M12 7h5" />
                <path d="m15 4 2.5 3L15 10" />
              </svg>
            </IconBtn>

            <div className="flex items-center gap-1">
              <IconBtn label="Lagu sebelum" onClick={() => void prevBgm()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M7 6h2v12H7zM20 6l-9 6 9 6z" />
                </svg>
              </IconBtn>
              <button
                type="button"
                aria-label={playing ? "Jeda muzik" : "Main muzik"}
                onClick={(e) => {
                  ripple(e);
                  void (playing ? pauseBgm() : resumeBgm());
                }}
                className="grid place-items-center overflow-hidden rounded-full bg-primary text-on-primary shadow-e1 transition-transform active:scale-90"
                style={{ width: "3rem", height: "3rem" }}
              >
                {playing ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5.5v13l11-6.5z" />
                  </svg>
                )}
              </button>
              <IconBtn label="Lagu seterusnya" onClick={() => void nextBgm()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M15 6h2v12h-2zM4 6l9 6-9 6z" />
                </svg>
              </IconBtn>
            </div>

          </div>

          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={volValue === 0 ? "Nyahsenyapkan muzik" : "Senyapkan muzik"}
              className="grid size-9 shrink-0 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                {volValue === 0 ? (
                  <>
                    <path d="M11 5.5 6.5 9.5H3v5h3.5L11 18.5v-13Z" />
                    <path d="m16 9.5 5 5m0-5-5 5" />
                  </>
                ) : (
                  <>
                    <path d="M11 5.5 6.5 9.5H3v5h3.5L11 18.5v-13Z" />
                    <path d="M15 9a4.4 4.4 0 0 1 0 6" />
                    <path d="M17.8 6.6a8 8 0 0 1 0 10.8" />
                  </>
                )}
              </svg>
            </button>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={volValue}
              onChange={vol}
              aria-label="Kelantangan muzik"
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-e1 [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary"
              style={{
                background: `linear-gradient(to right, var(--md-primary) ${volValue}%, var(--md-surface-container-highest) ${volValue}%)`,
              }}
            />
            <span className="w-9 text-right font-display text-[11px] font-bold text-on-surface-variant">
              {volValue}%
            </span>
          </div>

          <div className="mt-3 border-t border-outline-variant pt-3">
            <div className="flex items-center justify-between gap-2">
              <p className="font-display text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                Muzik import ({imports.length})
              </p>
              <button
                type="button"
                disabled={busy || !isImportSupported()}
                onClick={() => fileRef.current?.click()}
                className="flex h-8 items-center gap-1.5 rounded-full bg-secondary-container px-3 font-display text-xs font-bold text-on-secondary-container transition-all active:scale-95 disabled:opacity-50"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 16V4m0 0 -5 5m5-5 5 5" />
                  <path d="M4 18v2h16v-2" />
                </svg>
                {busy ? "Mengimport…" : "Import"}
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="audio/*,.mp3,.ogg,.oga,.m4a,.aac,.wav,.flac,.opus"
              onChange={(e) => void onPick(e.target.files)}
              className="hidden"
              aria-hidden
              tabIndex={-1}
            />
            {importErr && (
              <p className="mt-1.5 text-[11px] font-medium" style={{ color: "var(--md-error)" }}>
                {importErr}
              </p>
            )}
            {imports.length > 0 && (
              <ul className="no-scrollbar mt-2 max-h-36 space-y-1 overflow-y-auto">
                {imports.map((m) => (
                  <li
                    key={m.key}
                    className={`flex items-center gap-1 rounded-xl px-2 py-1 ${
                      track.id === m.key ? "bg-secondary-container/70" : "bg-surface-container"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => void playBgmById(m.key)}
                      className="min-w-0 flex-1 truncate py-0.5 text-left text-xs font-semibold text-on-surface"
                      aria-label={`Main ${m.title}`}
                    >
                      {m.title}
                    </button>
                    <button
                      type="button"
                      onClick={() => void onRemoveImport(m.key)}
                      aria-label={`Buang ${m.title}`}
                      className="grid size-6 shrink-0 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-highest"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                        <path d="M6 6l12 12M18 6 6 18" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-1.5 text-[10px] leading-snug text-on-surface-variant/80">
              Fail OST Pokémon anda (mp3 / ogg / m4a / wav / flac) disimpan dalam pelayar ini
              dan kekal selepas refresh.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
