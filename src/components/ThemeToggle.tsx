"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    const on = () => toggle();
    window.addEventListener("md-theme-toggle", on);
    return () => window.removeEventListener("md-theme-toggle", on);
  }, []);

  const toggle = () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("md-theme", next);
    } catch {
      /* ignore */
    }
    setTheme(next);
  };

  const icon = (
    <span className="relative grid size-[22px] place-items-center" aria-hidden>
      <svg
        className={`absolute transition-all duration-500 ${
          theme === "dark" ? "scale-50 opacity-0" : "scale-100 opacity-100"
        }`}
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        strokeLinecap="round"
        aria-hidden
      >
        <defs>
          <linearGradient id="pm-tt-sun" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe082" />
            <stop offset="1" stopColor="#ff9800" />
          </linearGradient>
        </defs>
        <g className="tt-rays" stroke="#ffc531" strokeWidth="1.8">
          <line x1="12" y1="2.6" x2="12" y2="5.1" />
          <line x1="12" y1="18.9" x2="12" y2="21.4" />
          <line x1="2.6" y1="12" x2="5.1" y2="12" />
          <line x1="18.9" y1="12" x2="21.4" y2="12" />
        </g>
        <g className="tt-rays" stroke="#ff9800" strokeWidth="1.8">
          <line x1="5.4" y1="5.4" x2="7.1" y2="7.1" />
          <line x1="16.9" y1="16.9" x2="18.6" y2="18.6" />
          <line x1="5.4" y1="18.6" x2="7.1" y2="16.9" />
          <line x1="16.9" y1="7.1" x2="18.6" y2="5.4" />
        </g>
        <circle
          cx="12"
          cy="12"
          r="4.4"
          fill="url(#pm-tt-sun)"
          stroke="#ff9800"
          strokeWidth="0.8"
          className="tt-core"
        />
      </svg>
      <svg
        className={`absolute transition-all duration-500 ${
          theme === "dark" ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="pm-tt-moon" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7dd3fc" />
            <stop offset="1" stopColor="#0ea5e9" />
          </linearGradient>
          <radialGradient id="pm-tt-halo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#0ea5e9" stopOpacity="0.4" />
            <stop offset="1" stopColor="#0ea5e9" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="13" cy="12" r="9.5" fill="url(#pm-tt-halo)" className="tt-halo" />
        <path
          d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
          fill="url(#pm-tt-moon)"
          stroke="#0369a1"
          strokeOpacity="0.4"
          strokeWidth="0.8"
        />
        <circle cx="19.6" cy="4.8" r="1" fill="#ffc531" className="tt-twinkle" />
        <circle cx="21.2" cy="9.6" r="0.8" fill="#ffe082" className="tt-twinkle tt-twinkle-2" />
        <circle cx="18" cy="14.6" r="0.9" fill="#ffc531" className="tt-twinkle tt-twinkle-3" />
      </svg>
    </span>
  );

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Mod cerah" : "Mod gelap"}
      aria-pressed={theme === "dark"}
      className={`relative overflow-hidden rounded-full shadow-e1 transition-all duration-300 hover:scale-110 active:scale-90 ${
        theme === "dark" ? "bg-primary-container" : "bg-secondary-container"
      } ${compact ? "grid size-10 place-items-center" : "flex h-10 items-center gap-2 px-4"}`}
    >
      {icon}
      {!compact && (
        <span className="text-sm font-medium">{theme === "dark" ? "Gelap" : "Cerah"}</span>
      )}
    </button>
  );
}
