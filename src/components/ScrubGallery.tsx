"use client";

import { useEffect, useRef, useState } from "react";
import { artworkUrl, pixelUrl } from "../lib/pokemon";

const GENS = [
  { numeral: "I", region: "Kanto", range: [1, 151], idols: [1, 4, 7, 25, 143, 131] },
  { numeral: "II", region: "Johto", range: [152, 251], idols: [152, 155, 158, 196, 248, 249] },
  { numeral: "III", region: "Hoenn", range: [252, 386], idols: [252, 255, 258, 282, 359, 380] },
  { numeral: "IV", region: "Sinnoh", range: [387, 493], idols: [387, 390, 393, 448, 445, 487] },
  { numeral: "V", region: "Unova", range: [494, 649], idols: [495, 498, 501, 530, 612, 637] },
  { numeral: "VI", region: "Kalos", range: [650, 721], idols: [650, 653, 656, 681, 700, 716] },
  { numeral: "VII", region: "Alola", range: [722, 809], idols: [722, 725, 728, 778, 791, 800] },
  { numeral: "VIII", region: "Galar", range: [810, 905], idols: [810, 813, 816, 887, 888, 889] },
  { numeral: "IX", region: "Paldea", range: [906, 1025], idols: [906, 909, 912, 1000, 1007, 1017] },
];

export default function ScrubGallery() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const barRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      const rect = section.getBoundingClientRect();
      if (rect.bottom < -300 || rect.top > window.innerHeight + 300) return;
      const span = rect.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      const overflow = Math.max(0, track.scrollWidth - window.innerWidth);
      track.style.transform = 'translate3d(' + (-p * overflow).toFixed(1) + 'px, 0, 0)';
      const idx = Math.min(GENS.length - 1, Math.floor(p * GENS.length * 0.999));
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
      if (barRef.current) {
        barRef.current.style.width = (((idx + 1) / GENS.length) * 100).toFixed(1) + '%';
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const current = GENS[active];
  const [lo, hi] = current.range;
  const count = hi - lo + 1;

  return (
    <section id="galeri" ref={sectionRef} className="relative h-[340vh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div
          ref={trackRef}
          className="flex w-max items-center gap-6 px-[8vw] will-change-transform"
          style={{ transform: "translate3d(0, 0, 0)" }}
        >
          {GENS.map((gen, i) => {
            const isActive = i === active;
            return (
              <article
                key={gen.numeral}
                className={`relative flex shrink-0 flex-col overflow-hidden rounded-3xl border border-outline-variant transition-colors duration-500 ${
                  isActive
                    ? "bg-surface-container-high shadow-e3"
                    : "bg-surface-container-low opacity-60"
                } ${i === 0 ? "pl-2" : ""}`}
              >
                <div className="flex items-start justify-between gap-6 px-8 pt-7">
                  <div>
                    <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-primary">
                      Generasi {gen.numeral}
                    </p>
                    <h2 className="font-display text-4xl font-extrabold text-on-surface transition-transform duration-500 sm:text-5xl">
                      {gen.region}
                    </h2>
                    <p className="mt-2 font-display text-sm font-semibold text-on-surface-variant">
                      #{lo} – #{hi}
                      <span className="mx-2 text-outline">|</span>
                      {count} spesies
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className={`vertical-text select-none font-display text-6xl font-black leading-none transition-colors duration-500 sm:text-7xl ${
                      isActive ? "text-primary/25" : "text-outline-variant"
                    }`}
                  >
                    {gen.numeral}
                  </span>
                </div>

                <div className="mt-4 flex items-end gap-3 px-6 pb-6 pt-2">
                  {gen.idols.map((id, k) => (
                    <figure
                      key={id}
                      className={`group relative overflow-hidden rounded-2xl bg-surface transition-all duration-500 ${
                        isActive ? "opacity-100 shadow-e2" : "opacity-70"
                      } ${k % 2 === 1 ? "translate-y-3" : ""} ${k === 0 ? "size-28 sm:size-36" : "size-20 sm:size-28"}`}
                    >
                      <img
                        src={k % 3 === 2 ? pixelUrl(id) : artworkUrl(id)}
                        alt=""
                        loading="lazy"
                        width="140"
                        height="140"
                        className="size-full object-contain p-1.5 transition-transform duration-500 group-hover:scale-110"
                      />
                      <figcaption className="absolute bottom-1 right-1.5 rounded-full bg-inverse-surface/80 px-1.5 py-0.5 text-[10px] font-bold text-inverse-on-surface">
                        #{id}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </article>
            );
          })}

          <article className="flex shrink-0 flex-col items-start justify-center gap-4 rounded-3xl border border-outline-variant bg-primary-container px-10 py-14 sm:px-16">
            <h2 className="max-w-sm font-display text-4xl font-extrabold leading-tight text-on-primary-container sm:text-5xl">
              Tiga generasi lagi menanti di Pokédex penuh.
            </h2>
            <button
              type="button"
              onClick={() =>
                document.getElementById("dex")?.scrollIntoView({ behavior: "smooth" })
              }
              className="h-12 rounded-full bg-on-primary-container px-6 font-display font-bold text-primary-container transition-transform active:scale-95"
            >
              Buka Pokédex
            </button>
          </article>
        </div>

        <div className="pointer-events-none absolute inset-x-8 bottom-8 mx-auto flex max-w-md items-center gap-3">
          <span className="font-display text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Gen {current.numeral}
          </span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-outline-variant">
            <div ref={barRef} className="h-full rounded-full bg-primary" style={{ width: `${(1 / GENS.length) * 100}%` }} />
          </div>
          <span className="font-display text-xs font-bold text-on-surface-variant">
            {active + 1}/{GENS.length}
          </span>
        </div>
      </div>
    </section>
  );
}
