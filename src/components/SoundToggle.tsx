"use client";

import { useEffect, useState } from "react";
import { isSoundEnabled, isSoundSupported, setSoundEnabled, useCryState } from "../lib/sound";

export function CryBars({ active, className = "" }: { active: boolean; className?: string }) {
  return (
    <span aria-hidden className={`flex items-center gap-[2px] ${className}`}>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="h-[5px] w-[3px] origin-center rounded-full bg-current"
          style={
            active
              ? { animation: `eq-bar 0.9s ease-in-out ${i * 0.13}s infinite` }
              : { transform: "scaleY(0.55)" }
          }
        />
      ))}
    </span>
  );
}

export default function SoundToggle() {
  const { playingId, enabled } = useCryState();
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(isSoundSupported());
  }, []);

  if (!supported) return null;

  const toggle = () => setSoundEnabled(!enabled);

  return (
    <button
      type="button"
      data-no-sfx="true"
      onClick={toggle}
      aria-label={enabled ? "Matikan bunyi" : "Hidupkan bunyi"}
      aria-pressed={enabled}
      className={`relative flex h-10 items-center gap-2 overflow-hidden rounded-full shadow-e1 transition-all duration-300 hover:scale-110 active:scale-90 ${
        enabled
          ? "bg-primary-container text-on-primary-container"
          : "bg-secondary-container text-on-surface-variant"
      } ${playingId !== null ? "ring-2 ring-primary/60" : ""}`}
    >
      <span className="grid size-10 place-items-center">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <defs>
            <linearGradient id="pm-snd-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#2dd4bf" />
              <stop offset="1" stopColor="#2f7cf6" />
            </linearGradient>
          </defs>
          <path
            d="M11 5.5 6.5 9.5H3v5h3.5L11 18.5v-13Z"
            fill="url(#pm-snd-body)"
            stroke="#0d9488"
            strokeOpacity="0.55"
            strokeWidth="1.1"
            className={enabled ? "snd-core" : undefined}
          />
          {enabled ? (
            <>
              <path
                d="M14.6 9.2a4.2 4.2 0 0 1 0 5.6"
                stroke="#ffc531"
                strokeWidth="1.9"
                className="snd-wave"
              />
              <path
                d="M17.3 6.8a7.8 7.8 0 0 1 0 10.4"
                stroke="#00a878"
                strokeWidth="1.9"
                className="snd-wave snd-wave-2"
              />
              <path
                d="M20 4.6a11.2 11.2 0 0 1 0 14.8"
                stroke="#ff9800"
                strokeWidth="1.9"
                className="snd-wave snd-wave-3"
              />
            </>
          ) : (
            <>
              <path d="M14.8 9.6 20 14.8" stroke="#e3350d" strokeWidth="1.9" />
              <path d="M20 9.6 14.8 14.8" stroke="#e3350d" strokeWidth="1.9" />
            </>
          )}
        </svg>
      </span>
      {playingId !== null && (
        <CryBars active className="mr-3 text-on-primary-container" />
      )}
    </button>
  );
}
