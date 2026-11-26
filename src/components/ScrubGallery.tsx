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
  const barRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const LERP = reduced ? 1 : 0.13;
    let panels: HTMLElement[] = [];
    let raf = 0;
    let running = false;
    let current = 0;
    let prevTarget = 0;

    const frame = () => {
      const rect = section.getBoundingClientRect();
      if (rect.bottom < -400 || rect.top > window.innerHeight + 400) {
        running = false;
        return;
      }

      const span = rect.height - window.innerHeight;
      const target = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      const vel = target - prevTarget;
      prevTarget = target;

      current += (target - current) * LERP;
      if (Math.abs(target - current) < 0.0004) current = target;

      const overflow = Math.max(0, track.scrollWidth - window.innerWidth);
      const skew = reduced ? 0 : Math.max(-3.2, Math.min(3.2, vel * -260));
      track.style.transform = `translate3d(${(-current * overflow).toFixed(1)}px, 0, 0) skewX(${skew.toFixed(2)}deg)`;

      const vw = window.innerWidth;
      const reads = panels.map((el) => el.getBoundingClientRect());
      reads.forEach((r, i) => {
        const el = panels[i];
        const centre = r.left + r.width / 2;
        const d = Math.min(1, Math.abs(centre - vw / 2) / (vw / 2 + r.width / 2));
        el.style.transform = `scale(${(1 - d * 0.06).toFixed(3)})`;
        el.style.opacity = (1 - d * 0.5).toFixed(3);
      });

      const idx = Math.min(
        GENS.length - 1,
        Math.floor((Math.max(current, target) * GENS.length) * 0.999),
      );
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
      if (barRef.current) {
        barRef.current.style.width = `${(current * 100).toFixed(2)}%`;
      }

      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };

    const measure = () => {
      panels = Array.from(track.querySelectorAll<HTMLElement>("[data-panel]"));
    };
    measure();

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) start();
      },
      { rootMargin: "400px" },
    );
    io.observe(section);

    const onResize = () => {
      panels = Array.from(track.querySelectorAll<HTMLElement>("[data-panel]"));
      start();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const current = GENS[active];
  const [lo, hi] = current.range;
  const count = hi - lo + 1;

  return (
    <section id="galeri" ref={sectionRef} className="relative h-[340vh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[6vw]"
          style={{ background: "linear-gradient(90deg, var(--md-surface), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[6vw]"
          style={{ background: "linear-gradient(270deg, var(--md-surface), transparent)" }}
        />

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
                data-panel
                className={`relative shrink-0 overflow-hidden rounded-3xl border border-outline-variant transition-[background-color,border-color,box-shadow] duration-500 ${
                  isActive
                    ? "bg-surface-container-high shadow-e3 border-primary/30"
                    : "bg-surface-container-low"
                }`}
              >
                <div className="flex items-start justify-between gap-6 px-8 pt-7">
                  <div>
                    <p
                      className={`font-display text-sm font-bold uppercase tracking-[0.25em] transition-colors duration-500 ${
                        isActive ? "text-primary" : "text-outline"
                      }`}
                    >
                      Generasi {gen.numeral}
                    </p>
                    <h2 className="font-display text-4xl font-extrabold tracking-tight text-on-surface transition-colors duration-500 sm:text-5xl">
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
                    className={`select-none font-display text-6xl font-black leading-none transition-colors duration-500 sm:text-7xl ${
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
                      className={`group relative overflow-hidden rounded-2xl bg-surface ${
                        isActive ? "shadow-e2" : "opacity-80"
                      } ${k % 2 === 1 ? "translate-y-3" : ""} ${k === 0 ? "size-28 sm:size-36" : "size-20 sm:size-28"}`}
                    >
                      <img
                        src={k % 3 === 2 ? pixelUrl(id) : artworkUrl(id)}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width="140"
                        height="140"
                        className="size-full object-contain p-1.5 transition-transform duration-700 group-hover:scale-110"
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

          <article
            data-panel
            className="relative flex shrink-0 flex-col items-start justify-center gap-4 rounded-3xl border border-outline-variant bg-primary-container px-10 py-14 sm:px-16"
          >
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
          <span
            key={current.numeral}
            className="anim-rise shrink-0 font-display text-xs font-bold uppercase tracking-widest text-on-surface-variant"
          >
            Gen {current.numeral}
          </span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-outline-variant">
            <div ref={barRef} className="h-full rounded-full bg-primary" style={{ width: "0%" }} />
          </div>
          <span className="shrink-0 font-display text-xs font-bold text-on-surface-variant">
            {active + 1}/{GENS.length}
          </span>
        </div>
      </div>
    </section>
  );
}
