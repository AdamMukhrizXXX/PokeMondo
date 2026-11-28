"use client";

import { useEffect, useState } from "react";

export type SpuiPerf = "verylow" | "low" | "medium" | "high" | "extreme";
const KEY = "md-spui-perf";

export type SpuiPerfLevel = {
  id: SpuiPerf;
  label: string;
  desc: string;
  page: number;
  cols: string;
  eager: boolean;
};

export const SPUI_PERF_LEVELS: SpuiPerfLevel[] = [
  {
    id: "verylow",
    label: "Very Low",
    desc: "Paling jimat \u2014 20 Pok\u00e9mon sehalaman, grid kecil",
    page: 20,
    cols: "grid-cols-2 sm:grid-cols-3",
    eager: false,
  },
  {
    id: "low",
    label: "Low",
    desc: "Ringan \u2014 40 Pok\u00e9mon sehalaman",
    page: 40,
    cols: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
    eager: false,
  },
  {
    id: "medium",
    label: "Medium",
    desc: "Seimbang (asal) \u2014 60 Pok\u00e9mon sehalaman",
    page: 60,
    cols: "grid-cols-2 sm:grid-cols-4 lg:grid-cols-5",
    eager: false,
  },
  {
    id: "high",
    label: "High",
    desc: "Lancar \u2014 80 Pok\u00e9mon sehalaman, imej dimuat terus",
    page: 80,
    cols: "grid-cols-2 sm:grid-cols-4 lg:grid-cols-6",
    eager: true,
  },
  {
    id: "extreme",
    label: "Extreme",
    desc: "Maksimum \u2014 120 Pok\u00e9mon sehalaman, imej dimuat terus",
    page: 120,
    cols: "grid-cols-2 sm:grid-cols-5 lg:grid-cols-7",
    eager: true,
  },
];

export function getSpuiPerf(): SpuiPerf {
  try {
    const v = localStorage.getItem(KEY);
    return SPUI_PERF_LEVELS.some((l) => l.id === v) ? (v as SpuiPerf) : "medium";
  } catch {
    return "medium";
  }
}

export function setSpuiPerf(level: SpuiPerf) {
  try {
    localStorage.setItem(KEY, level);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent("md-spui-perf", { detail: level }));
}

export function useSpuiPerf(): SpuiPerf {
  const [level, setLevel] = useState<SpuiPerf>("medium");
  useEffect(() => {
    setLevel(getSpuiPerf());
    const on = (e: Event) => setLevel(((e as CustomEvent).detail ?? "medium") as SpuiPerf);
    window.addEventListener("md-spui-perf", on);
    return () => window.removeEventListener("md-spui-perf", on);
  }, []);
  return level;
}
