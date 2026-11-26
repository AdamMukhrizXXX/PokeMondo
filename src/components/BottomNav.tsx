"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollSpy } from "../lib/pokemon";

const NAV_ITEMS = [
  { id: "rumah", label: "Rumah", icon: "M4 11.5 12 4l8 7.5M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" },
  { id: "galeri", label: "Galeri", icon: "M4 8h16M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Zm4 4 2.5 3 2-2.5L16 16" },
  { id: "dex", label: "Pokédex", icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 7.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 3a9 9 0 0 1 8.49 6H12m0 6h8.49A9 9 0 0 1 12 21" },
  { id: "info", label: "Info", icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4.5v.01M12 11v5.5" },
];

const ARC_START = 150;
const ARC_END = 30;
const RADIUS = 92;
const HUB_HALF = 1.75;

function arcPos(i: number, n: number) {
  const deg = ARC_START - (i * (ARC_START - ARC_END)) / (n - 1);
  const a = (deg * Math.PI) / 180;
  return { x: Math.cos(a) * RADIUS, y: Math.sin(a) * RADIUS };
}

const RING_R_REM = RADIUS / 16 + 1.5;
const DIAM_REM = RING_R_REM * 2;

export default function BottomNav() {
  const active = useScrollSpy(NAV_ITEMS.map((nItem) => nItem.id));
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);

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
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const n = NAV_ITEMS.length;

  return (
    <>
      <div
        aria-hidden
        ref={barRef}
        className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-primary will-change-transform"
        style={{ transform: "scaleX(0)" }}
      />

      {open && (
        <div
          aria-hidden
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="fixed bottom-[max(env(safe-area-inset-bottom),1.25rem)] left-1/2 z-50 -translate-x-1/2">
        <div
          aria-hidden
          className={`absolute rounded-full border border-outline-variant/70 bg-surface-container-low/40 backdrop-blur-md transition-all duration-500 ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          style={{
            width: `${DIAM_REM}rem`,
            height: `${DIAM_REM}rem`,
            left: `calc(${HUB_HALF}rem - ${RING_R_REM}rem)`,
            bottom: `calc(${HUB_HALF}rem - ${RING_R_REM}rem)`,
            transform: open ? "scale(1)" : "scale(0.85)",
            transitionTimingFunction: "cubic-bezier(0.34, 1.3, 0.5, 1)",
          }}
        />

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Tutup menu navigasi" : "Buka menu navigasi"}
          className="relative grid size-14 place-items-center rounded-full bg-primary text-on-primary shadow-e3 transition-transform hover:scale-105 active:scale-90"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
            aria-hidden
            className="transition-transform duration-500"
            style={{
              transform: open ? "rotate(180deg)" : undefined,
              transitionTimingFunction: "cubic-bezier(0.34, 1.3, 0.5, 1)",
            }}
          >
            {open ? (
              <path d="M6 6l12 12M18 6 6 18" />
            ) : (
              <>
                <path d="M5 7h14" />
                <path d="M5 12h14" />
                <path d="M5 17h9" />
              </>
            )}
          </svg>
        </button>

        <nav
          aria-label="Navigasi utama"
          className="pointer-events-none absolute"
          style={{ left: `${HUB_HALF}rem`, bottom: `${HUB_HALF}rem` }}
        >
          {NAV_ITEMS.map((item, i) => {
            const isActive = active === item.id;
            const { x, y } = arcPos(i, n);
            return (
              <span
                key={item.id}
                className="absolute left-0 top-0 block will-change-transform"
                style={{
                  transform: open
                    ? `translate3d(calc(${x.toFixed(1)}px - 50%), calc(-${y.toFixed(1)}px + 50%), 0) scale(1)`
                    : "translate3d(-50%, 50%, 0) scale(0.1)",
                  opacity: open ? 1 : 0,
                  transformOrigin: "center",
                  transition: `transform .6s cubic-bezier(0.34, 1.56, 0.45, 1) ${(open ? i : n - 1 - i) * 50}ms, opacity .32s ease ${(open ? i : n - 1 - i) * 50}ms`,
                  pointerEvents: open ? "auto" : "none",
                }}
              >
                <button
                  type="button"
                  tabIndex={open ? 0 : -1}
                  aria-current={isActive ? "true" : undefined}
                  aria-label={`Ke ${item.label}`}
                  onClick={() => go(item.id)}
                  className={`group relative grid size-12 place-items-center rounded-full border shadow-e2 transition-colors ${
                    isActive
                      ? "border-transparent bg-primary text-on-primary"
                      : "border-outline-variant bg-surface-container-low/95 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                  }`}
                >
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={isActive ? 2.25 : 1.85}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d={item.icon} />
                  </svg>
                  <span
                    role="presentation"
                    className={`pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 rounded-full bg-inverse-surface px-2.5 py-0.5 font-display text-[10px] font-bold whitespace-nowrap text-inverse-on-surface shadow-e2 transition-opacity duration-300 ${
                      open ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              </span>
            );
          })}
        </nav>
      </div>
    </>
  );
}
