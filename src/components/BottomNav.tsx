"use client";

import { useEffect, useRef } from "react";
import { useScrollSpy } from "../lib/pokemon";
import { useRipple } from "../components/Ripple";

const NAV_ITEMS = [
  { id: "rumah", label: "Rumah", icon: "M4 11.5 12 4l8 7.5M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" },
  { id: "galeri", label: "Galeri", icon: "M4 8h16M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Zm4 4 2.5 3 2-2.5L16 16" },
  { id: "dex", label: "Pokédex", icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 7.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 3a9 9 0 0 1 8.49 6H12m0 6h8.49A9 9 0 0 1 12 21" },
  { id: "info", label: "Info", icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4.5v.01M12 11v5.5" },
];

export default function BottomNav() {
  const active = useScrollSpy(NAV_ITEMS.map((n) => n.id));
  const barRef = useRef<HTMLDivElement | null>(null);
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
        className="fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[max(env(safe-area-inset-bottom),0.75rem)]"
      >
        <div className="flex items-center gap-1 rounded-full border border-outline-variant bg-surface-container-low/95 p-1.5 shadow-e3 backdrop-blur-md">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={(e) => {
                  ripple(e);
                  go(item.id);
                }}
                aria-current={isActive ? "true" : undefined}
                className={`relative flex h-14 items-center gap-2 overflow-hidden rounded-full px-4 font-display text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-secondary-container text-on-secondary-container"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
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
                >
                  <path d={item.icon} />
                </svg>
                <span className={isActive ? "inline" : "hidden sm:inline"}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
