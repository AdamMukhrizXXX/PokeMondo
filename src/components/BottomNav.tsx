"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollSpy } from "../lib/pokemon";
import { useRipple } from "./Ripple";

const NAV_ITEMS = [
  { id: "rumah", label: "Rumah", icon: "M4 11.5 12 4l8 7.5M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" },
  { id: "galeri", label: "Galeri", icon: "M4 8h16M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Zm4 4 2.5 3 2-2.5L16 16" },
  { id: "dex", label: "Pokédex", icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 7.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 3a9 9 0 0 1 8.49 6H12m0 6h8.49A9 9 0 0 1 12 21" },
  { id: "info", label: "Info", icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4.5v.01M12 11v5.5" },
];

const SPREAD = 96;
const MAX_BOOST = 0.32;

export default function BottomNav() {
  const active = useScrollSpy(NAV_ITEMS.map((n) => n.id));
  const barRef = useRef<HTMLDivElement | null>(null);
  const dockRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef(0);
  const ripple = useRipple();

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0})`;
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

  useEffect(() => {
    const item = itemRefs.current[NAV_ITEMS.findIndex((n) => n.id === active)];
    const pill = pillRef.current;
    if (!item || !pill) return;
    pill.style.width = `${item.offsetWidth}px`;
    pill.style.transform = `translate3d(${item.offsetLeft}px, 0, 0) scale(1)`;
    pill.style.opacity = "1";
  }, [active]);

  const magnify = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.clientX === 0 && e.clientY === 0) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      for (const el of itemRefs.current) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const d = Math.abs(e.clientX - (r.left + r.width / 2));
        const t = Math.exp(-(d * d) / (2 * SPREAD * SPREAD));
        const s = 1 + MAX_BOOST * t;
        el.style.transform = `translateY(${(-10 * t).toFixed(1)}px) scale(${s.toFixed(3)})`;
      }
    });
  };

  const reset = () => {
    cancelAnimationFrame(rafRef.current);
    for (const el of itemRefs.current) {
      if (el) el.style.transform = "";
    }
  };

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div
        aria-hidden
        ref={barRef}
        className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-primary will-change-transform"
        style={{ transform: "scaleX(0)" }}
      />
      <nav
        aria-label="Navigasi utama"
        className="fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[max(env(safe-area-inset-bottom),0.9rem)]"
      >
        <div
          ref={dockRef}
          onMouseMove={magnify}
          onMouseLeave={reset}
          className="pop-in relative flex items-end gap-1 rounded-[1.75rem] border border-outline-variant bg-surface-container-low/90 p-2 shadow-e3 backdrop-blur-xl"
        >
          <div
            ref={pillRef}
            aria-hidden
            className="absolute top-2 left-0 h-[calc(100%-1rem)] rounded-[1.2rem] bg-secondary-container opacity-0 shadow-e1 transition-[transform,width,opacity] duration-500"
            style={{
              transitionTimingFunction: "cubic-bezier(0.34, 1.3, 0.5, 1)",
              width: "3.5rem",
            }}
          />
          {NAV_ITEMS.map((item, i) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                onClick={(e) => {
                  ripple(e);
                  go(item.id);
                }}
                aria-current={isActive ? "true" : undefined}
                aria-label={item.label}
                className={`group relative z-10 flex h-14 w-16 items-center justify-center overflow-visible rounded-[1.2rem] transition-colors sm:w-20 ${
                  isActive
                    ? "text-on-secondary-container"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span
                  className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 translate-y-1 rounded-full bg-inverse-surface px-3 py-1 font-display text-xs font-bold whitespace-nowrap text-inverse-on-surface opacity-0 shadow-e2 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                  role="presentation"
                >
                  {item.label}
                </span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={isActive ? 2.25 : 1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className="transition-transform duration-300 group-hover:-translate-y-0.5"
                >
                  <path d={item.icon} />
                </svg>
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute -bottom-1 size-1 rounded-full bg-primary"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
