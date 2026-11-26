"use client";

import { useEffect, useState } from "react";

export type UiMode = "full" | "simple";
const KEY = "md-ui-mode";

export function getUiMode(): UiMode {
  try {
    return localStorage.getItem(KEY) === "simple" ? "simple" : "full";
  } catch {
    return "full";
  }
}

export function setUiMode(mode: UiMode) {
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent("md-ui-mode", { detail: mode }));
}

export function useUiMode(): UiMode {
  const [mode, setMode] = useState<UiMode>("full");
  useEffect(() => {
    setMode(getUiMode());
    const on = (e: Event) => setMode(((e as CustomEvent<UiMode>).detail ?? "full") as UiMode);
    window.addEventListener("md-ui-mode", on);
    return () => window.removeEventListener("md-ui-mode", on);
  }, []);
  return mode;
}
