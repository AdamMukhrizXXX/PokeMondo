"use client";

import { useEffect, useRef } from "react";

export default function LiveBackground() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let running = true;

    const tick = () => {
      cx += (tx - cx) * 0.055;
      cy += (ty - cy) * 0.055;
      el.style.setProperty("--mx", cx.toFixed(4));
      el.style.setProperty("--my", cy.toFixed(4));
      if (running) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div ref={ref} className="bg-live">
      <span aria-hidden className="live-aurora live-aurora-1" />
      <span aria-hidden className="live-aurora live-aurora-2" />
      <span aria-hidden className="live-orb-wrap live-orb-wrap-1">
        <span className="live-orb live-orb-1" />
      </span>
      <span aria-hidden className="live-orb-wrap live-orb-wrap-2">
        <span className="live-orb live-orb-2" />
      </span>
      <span aria-hidden className="live-orb-wrap live-orb-wrap-3">
        <span className="live-orb live-orb-3" />
      </span>
    </div>
  );
}
