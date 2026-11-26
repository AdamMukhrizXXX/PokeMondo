"use client";

import { useEffect, useRef } from "react";
import { artworkUrl, paddedId } from "../lib/pokemon";
import { RevealWords } from "./Reveal";

const GENS = [
  { numeral: "I", region: "Kanto", range: [1, 151], idol: 1 },
  { numeral: "II", region: "Johto", range: [152, 251], idol: 152 },
  { numeral: "III", region: "Hoenn", range: [252, 386], idol: 252 },
  { numeral: "IV", region: "Sinnoh", range: [387, 493], idol: 387 },
  { numeral: "V", region: "Unova", range: [494, 649], idol: 495 },
  { numeral: "VI", region: "Kalos", range: [650, 721], idol: 650 },
  { numeral: "VII", region: "Alola", range: [722, 809], idol: 722 },
  { numeral: "VIII", region: "Galar", range: [810, 905], idol: 810 },
  { numeral: "IX", region: "Paldea", range: [906, 1025], idol: 906 },
];

const ROW_A = ["Semua Pokémon", "Satu Pokédex", "1025 Spesies", "9 Generasi"];
const ROW_B = ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola", "Galar", "Paldea"];

function Half({ items }: { items: string[] }) {
  return (
    <div className="flex items-center">
      {[0, 1, 2, 3].map((rep) =>
        items.map((t, i) => (
          <span key={`${rep}-${i}`} className="flex items-center">
            <span className={i % 2 ? "stroke-text" : ""}>{t}</span>
            <span aria-hidden className="mx-6 size-2.5 shrink-0 rounded-full bg-primary/70 sm:mx-8" />
          </span>
        )),
      )}
    </div>
  );
}

function VelocityRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0;
    let lastY = window.scrollY;
    let raf = 0;
    let running = false;

    const frame = () => {
      if (!running) return;
      const y = window.scrollY;
      const vel = y - lastY;
      lastY = y;
      const half = track.scrollWidth / 2;
      if (half > 0) {
        const speed = 0.45 + Math.min(Math.abs(vel) * 0.14, 6.5);
        x += (reverse ? -1 : 1) * speed;
        const t = -(((x % half) + half) % half);
        track.style.transform = `translate3d(${t.toFixed(1)}px, 0, 0)`;
      }
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const near = entries.some((e) => e.isIntersecting);
        if (near && !running) {
          running = true;
          lastY = window.scrollY;
          raf = requestAnimationFrame(frame);
        } else if (!near && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(wrap);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [reverse]);

  return (
    <div ref={wrapRef} aria-hidden className="overflow-hidden">
      <div
        ref={trackRef}
        className="flex w-max items-center whitespace-nowrap font-display text-5xl font-extrabold uppercase tracking-tight text-on-surface/85 will-change-transform sm:text-6xl lg:text-7xl"
      >
        <Half items={items} />
        <Half items={items} />
      </div>
    </div>
  );
}

function GenCard({ gen, index }: { gen: (typeof GENS)[number]; index: number }) {
  return (
    <div
      className="card-rise w-[15.5rem] shrink-0 snap-start sm:w-64"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <button
        type="button"
        onClick={() => document.getElementById("dex")?.scrollIntoView({ behavior: "smooth" })}
        aria-label={`Terokai generasi ${gen.region} dalam Pokédex`}
        className="card-press group relative block w-full overflow-hidden rounded-3xl border border-outline-variant bg-surface-low/80 p-5 text-left shadow-e1 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-e3"
      >
        <div className="flex items-start justify-between gap-2">
          <span className="text-gradient font-display text-5xl font-extrabold leading-none">
            {gen.numeral}
          </span>
          <img
            src={artworkUrl(gen.idol)}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            width={112}
            height={112}
            className="size-20 object-contain drop-shadow-md transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
          />
        </div>
        <p className="mt-3 font-display text-lg font-bold text-on-surface">{gen.region}</p>
        <p className="text-xs font-medium text-on-surface-variant">
          #{paddedId(gen.range[0])} – #{paddedId(gen.range[1])}
        </p>
      </button>
    </div>
  );
}

export default function ScrubGallery() {
  return (
    <section
      id="galeri"
      className="relative overflow-hidden py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16">
        <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-primary">
          <RevealWords text="Jelajah ikut generasi" />
        </p>
        <h2 className="mt-1 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          <RevealWords text="Sembilan Generasi" />
        </h2>
      </div>

      <div className="mt-12 flex flex-col gap-7">
        <VelocityRow items={ROW_A} />
        <VelocityRow items={ROW_B} reverse />
      </div>

      <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-3 sm:px-8 lg:px-16">
        {GENS.map((g, i) => (
          <GenCard key={g.numeral} gen={g} index={i} />
        ))}
      </div>
      <p className="mt-3 px-5 text-center text-xs font-medium text-on-surface-variant sm:px-8">
        Leret kad untuk melayari generasi — tekan untuk terus ke Pokédex
      </p>
    </section>
  );
}
