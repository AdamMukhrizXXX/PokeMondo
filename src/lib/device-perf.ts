"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type DeviceInfo = {
  gpu: string;
  cores: number | null;
  memGB: number | null;
  screen: string;
  dpr: number;
  touch: number;
  net: string | null;
};

export function detectDevice(): DeviceInfo {
  let gpu = "\u2014";
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    const dbg = gl?.getExtension("WEBGL_debug_renderer_info");
    const raw = gl
      ? String(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER))
      : "";
    gpu = raw.trim().slice(0, 72) || "\u2014";
  } catch {
    /* ignore */
  }
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { effectiveType?: string };
  };
  return {
    gpu,
    cores: nav.hardwareConcurrency ?? null,
    memGB: nav.deviceMemory ?? null,
    screen: `${window.screen.width}\u00d7${window.screen.height}`,
    dpr: Math.round(window.devicePixelRatio * 100) / 100,
    touch: nav.maxTouchPoints ?? 0,
    net: nav.connection?.effectiveType ?? null,
  };
}

const KEY_AUTO = "md-gpu-auto";

export function getGpuAuto(): boolean {
  try {
    return localStorage.getItem(KEY_AUTO) !== "off";
  } catch {
    return true;
  }
}

export function setGpuAuto(on: boolean) {
  try {
    localStorage.setItem(KEY_AUTO, on ? "on" : "off");
  } catch {
    /* ignore */
  }
}

function applyLite(on: boolean) {
  if (on) document.documentElement.dataset.gpuLite = "on";
  else delete document.documentElement.dataset.gpuLite;
}

export function useDevicePerf() {
  const [fps, setFps] = useState(0);
  const [info, setInfo] = useState<DeviceInfo | null>(null);
  const [auto, setAutoState] = useState(true);
  const [lite, setLite] = useState(false);
  const lowRef = useRef(0);
  const highRef = useRef(0);

  const setAuto = useCallback((v: boolean) => {
    setAutoState(v);
    setGpuAuto(v);
    if (!v) {
      applyLite(false);
      setLite(false);
    }
  }, []);

  useEffect(() => {
    setAutoState(getGpuAuto());
    setInfo(detectDevice());
    applyLite(false);

    const reDetect = () => setInfo(detectDevice());
    window.addEventListener("resize", reDetect);
    window.addEventListener("orientationchange", reDetect);
    const conn = (
      navigator as Navigator & {
        connection?: {
          addEventListener?: (t: string, f: () => void) => void;
          removeEventListener?: (t: string, f: () => void) => void;
        };
      }
    ).connection;
    conn?.addEventListener?.("change", reDetect);

    let frames = 0;
    let last = performance.now();
    let raf = 0;
    let alive = true;
    const loop = (now: number) => {
      if (!alive) return;
      frames += 1;
      if (now - last >= 1000) {
        setFps(Math.round((frames * 1000) / (now - last)));
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", reDetect);
      window.removeEventListener("orientationchange", reDetect);
      conn?.removeEventListener?.("change", reDetect);
      applyLite(false);
    };
  }, []);

  useEffect(() => {
    if (fps <= 0) return;
    if (!auto) return;
    if (fps < 40) {
      lowRef.current += 1;
      highRef.current = 0;
    } else if (fps >= 55) {
      highRef.current += 1;
      lowRef.current = 0;
    }
    if (lowRef.current >= 3 && !lite) {
      applyLite(true);
      setLite(true);
    } else if (highRef.current >= 4 && lite) {
      applyLite(false);
      setLite(false);
    }
  }, [fps, auto, lite]);

  return { fps, info, auto, setAuto, lite };
}
