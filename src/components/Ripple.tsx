"use client";

import { useCallback, type MouseEvent } from "react";

export function useRipple() {
  return useCallback((e: MouseEvent<HTMLElement>) => {
    const host = e.currentTarget;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = host.getBoundingClientRect();
    const ink = document.createElement("span");
    ink.className = "ripple-ink";
    ink.style.left = `${e.clientX - rect.left}px`;
    ink.style.top = `${e.clientY - rect.top}px`;
    host.appendChild(ink);
    ink.addEventListener("animationend", () => ink.remove());
  }, []);
}
