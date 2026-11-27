"use client";

import { useEffect, useState } from "react";

const KEY = "md-site-theme";
const EV = "md-site-theme";

export const SITE_THEMES = ["dasar", "neobrutalism", "claymorphism", "glassmorphism"] as const;
export type SiteTheme = (typeof SITE_THEMES)[number];

export const THEME_LABELS: Record<SiteTheme, string> = {
  dasar: "Dasar M3",
  neobrutalism: "Neobrutalism",
  claymorphism: "Claymorphism",
  glassmorphism: "Glassmorphism",
};

export function applySiteTheme(t: SiteTheme) {
  document.documentElement.dataset.siteTheme = t;
}

export function getSiteTheme(): SiteTheme {
  try {
    const v = localStorage.getItem(KEY) as SiteTheme | null;
    return v && SITE_THEMES.includes(v) ? v : "dasar";
  } catch {
    return "dasar";
  }
}

export function setSiteTheme(t: SiteTheme) {
  try {
    localStorage.setItem(KEY, t);
  } catch {
    /* pelayar swasta */
  }
  applySiteTheme(t);
  window.dispatchEvent(new CustomEvent(EV, { detail: t }));
}

export function cycleSiteTheme(): SiteTheme {
  const next = SITE_THEMES[(SITE_THEMES.indexOf(getSiteTheme()) + 1) % SITE_THEMES.length];
  setSiteTheme(next);
  return next;
}

export function useSiteTheme(): SiteTheme {
  const [theme, setTheme] = useState<SiteTheme>("dasar");
  useEffect(() => {
    setTheme(getSiteTheme());
    const on = (e: Event) => {
      const v = (e as CustomEvent<SiteTheme>).detail;
      if (v && SITE_THEMES.includes(v)) setTheme(v);
    };
    window.addEventListener(EV, on);
    return () => window.removeEventListener(EV, on);
  }, []);
  return theme;
}
