"use client";

import { useEffect, useRef, useState } from "react";
import {
  BGM_COUNT,
  getBgmShuffle,
  getBgmTrack,
  getBgmVolume,
  isBgmOn,
  nextBgm,
  pauseBgm,
  prevBgm,
  resumeBgm,
  setBgmVolume,
  toggleShuffleBgm,
  useBgmState,
} from "../lib/bgm";
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
  const { playing, index, shuffle } = useBgmState();
  const [volValue, setVolValue] = useState(() => Math.round(getBgmVolume() * 100));
  const track = getBgmTrack(index);
  const barRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef<HTMLSpanElement | null>(null);
  const durRef = useRef<HTMLSpanElement | null>(null);
  const seekRef = useRef<HTMLDivElement | null>(null);
  const ripple = useRipple();

  useEffect(() => {
    setVolValue(Math.round(getBgmVolume() * 100));
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
          className="flex items-center justify-center"
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
                {(index + 1).toString()}/{BGM_COUNT}
              </p>
            </div>
            <button
              type="button"
              aria-label="Kecilkan pemain"
              onClick={() => onSetExpanded(false)}
              className="grid size-8 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                <path d="M5 12h14" />
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

            <div className="relative grid size-9 place-items-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-on-surface-variant" aria-hidden>
                <path d="M11 5.5 6.5 9.5H3v5h3.5L11 18.5v-13Z" />
                <path d="M15 9a4.4 4.4 0 0 1 0 6" />
              </svg>
              <input
                type="range"
                min={0}
                max={100}
                value={volValue}
                onChange={vol}
                aria-label="Kelantangan muzik"
                className="absolute left-1/2 top-1/2 h-1.5 w-14 -translate-x-1/2 cursor-pointer appearance-none rounded-full bg-surface-container-highest accent-primary [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
