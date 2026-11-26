"use client";

import { useEffect, useRef, useState } from "react";
import { artworkUrl, pixelUrl, useCountUp } from "../lib/pokemon";
import { useRipple } from "../components/Ripple";
import { useMagnet } from "../lib/motion";

function BlurWords({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="anim-rise inline-block"
          style={{ animationDelay: `${delay + i * 0.09}s` }}
        >
          {w}
          {i < text.split(" ").length - 1 ? "\u00a0" : ""}
        </span>
      ))}
    </>
  );
}

function MarqueeRow() {
  const ids = [1, 4, 7, 25, 133, 143, 150, 94, 131, 6, 9, 3, 149, 39, 68, 65, 130, 59];
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 overflow-hidden opacity-25 md:opacity-35">
      <div className="flex w-max animate-[marquee_38s_linear_infinite] items-end gap-10 will-change-transform">
        {[...ids, ...ids].map((id, i) => (
          <img
            key={`${id}-${i}`}
            src={pixelUrl(id)}
            alt=""
            width="72"
            height="72"
            loading="eager"
            className="size-14 object-contain sm:size-18"
          />
        ))}
      </div>
    </div>
  );
}

export default function Hero({
  query,
  onQueryChange,
  total,
  onExplore,
  onRandom,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  total: number;
  onExplore: () => void;
  onRandom: () => void;
}) {
  const ripple = useRipple();
  const [visible, setVisible] = useState(false);
  const ctaRef = useMagnet<HTMLDivElement>(0.18);
  const randomRef = useMagnet<HTMLDivElement>(0.12);

  useEffect(() => {
    setVisible(true);
  }, []);

  const countSpecies = useCountUp(total || 1025, visible);
  const countTypes = useCountUp(18, visible, 900);
  const countGens = useCountUp(9, visible, 700);

  return (
    <section
      id="rumah"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden px-5 pt-14 sm:px-8 lg:px-16"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(38rem 30rem at 12% 12%, var(--md-primary-container), transparent 68%), radial-gradient(30rem 26rem at 88% 42%, var(--md-tertiary-container), transparent 64%), radial-gradient(34rem 28rem at 42% 96%, var(--md-secondary-container), transparent 62%)",
        }}
      />
      <div
        aria-hidden
        className="absolute -left-16 top-24 size-56 rounded-full bg-primary-container/40 blur-2xl motion-safe:animate-[drift_48s_linear_infinite]"
      />
      <div
        aria-hidden
        className="absolute bottom-16 right-[18%] size-48 rounded-full bg-tertiary-container/50 blur-2xl motion-safe:animate-[drift_56s_linear_infinite_reverse]"
      />

      <img
        src={artworkUrl(25)}
        alt="Pikachu"
        width={300}
        height={300}
        className="anim-float pointer-events-none absolute right-[4%] top-[16%] z-10 hidden w-40 select-none drop-shadow-xl lg:block xl:w-52"
      />

      <div className="relative z-20 mx-auto w-full max-w-6xl">
        <p
          className="anim-rise mb-5 inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-low px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
          style={{ animationDelay: "0s" }}
        >
          Data langsung dari PokéAPI
        </p>

        <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-on-surface sm:text-6xl lg:text-7xl">
          <BlurWords text="Semua Pokémon." delay={0.1} />
          <br />
          <span className="text-primary">
            <BlurWords text="Satu Pokédex." delay={0.45} />
          </span>
        </h1>

        <p
          className="anim-rise mt-6 max-w-xl text-lg leading-relaxed text-on-surface-variant"
          style={{ animationDelay: "0.8s" }}
        >
          Tatal untuk menyusuri sembilan generasi, tapis mengikut jenis, dan buka
          mana-mana kad untuk melihat statistik penuh.{" "}
          <span className="font-semibold text-on-surface">
            {countSpecies} spesies
          </span>
          , {countTypes} jenis, {countGens} generasi.
        </p>

        <div
          className="anim-rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          style={{ animationDelay: "1s" }}
        >
          <div className="flex h-14 w-full max-w-md items-center gap-3 rounded-full border border-outline-variant bg-surface-container-low px-5 shadow-e1 transition-shadow focus-within:shadow-e2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="shrink-0 text-on-surface-variant"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.2-3.2" />
            </svg>
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onExplore()}
              placeholder="Cari nama atau nombor, cth. pikachu…"
              aria-label="Cari Pokémon"
              className="h-full w-full bg-transparent text-base text-on-surface outline-none placeholder:text-on-surface-variant/70"
            />
          </div>
          <div ref={ctaRef} className="magnet shrink-0">
          <button
            type="button"
            onClick={(e) => {
              ripple(e);
              onExplore();
            }}
            className="flex h-14 items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-7 font-display text-base font-bold text-on-primary shadow-e1 transition-transform active:scale-95"
          >
            Terokai Pokédex
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M12 19V5m-6 6 6 6 6-6" />
            </svg>
          </button>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 pb-20 text-on-surface-variant">
          {[
            ["Spesies", countSpecies],
            ["Jenis", countTypes],
            ["Generasi", countGens],
          ].map(([label, n], i) => (
            <div
              key={label as string}
              className="anim-rise"
              style={{ animationDelay: `${1.15 + i * 0.12}s` }}
            >
              <p className="font-display text-3xl font-extrabold text-on-surface">
                {n as number}
                {label === "Jenis" ? "+" : ""}
              </p>
              <p className="text-sm font-medium">{label as string}</p>
            </div>
          ))}
          <div ref={randomRef} className="magnet ml-auto">
          <div className="anim-rise" style={{ animationDelay: "1.5s" }}>
          <button
            type="button"
            onClick={(e) => {
              ripple(e);
              onRandom();
            }}
            className="flex items-center gap-2 rounded-full border border-outline-variant px-5 py-3 font-display text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <rect x="3" y="3" width="18" height="18" rx="4" />
              <path d="M8 12h8" />
              <path d="m13 8 4 4-4 4" />
            </svg>
            Pokémon rawak
          </button>
          </div>
          </div>
        </div>
      </div>

      <MarqueeRow />

      <div
        aria-hidden
        className="absolute bottom-20 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-on-surface-variant/70 md:flex"
      >
        <span className="font-display text-[10px] font-semibold uppercase tracking-[0.3em]">
          Tatal
        </span>
        <span className="h-8 w-px animate-pulse bg-outline" />
      </div>
    </section>
  );
}
