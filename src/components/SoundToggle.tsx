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
      onClick={toggle}
      aria-label={enabled ? "Matikan bunyi" : "Hidupkan bunyi"}
      aria-pressed={enabled}
      className={`relative flex h-10 items-center gap-2 overflow-hidden rounded-full shadow-e1 transition-transform active:scale-90 ${
        enabled
          ? "bg-secondary-container text-on-secondary-container"
          : "bg-surface-container-highest text-on-surface-variant"
      } ${playingId !== null ? "ring-2 ring-primary/60" : ""}`}
    >
      <span className="grid size-10 place-items-center">
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
          {enabled ? (
            <>
              <path d="M11 5.5 6.5 9.5H3v5h3.5L11 18.5v-13Z" />
              <path d="M15 9a4.4 4.4 0 0 1 0 6" />
              <path d="M17.8 6.6a8 8 0 0 1 0 10.8" />
            </>
          ) : (
            <>
              <path d="M11 5.5 6.5 9.5H3v5h3.5L11 18.5v-13Z" />
              <path d="m16 9.5 5 5m0-5-5 5" />
            </>
          )}
        </svg>
      </span>
      {playingId !== null && (
        <CryBars active className="mr-3 text-on-secondary-container" />
      )}
    </button>
  );
}
