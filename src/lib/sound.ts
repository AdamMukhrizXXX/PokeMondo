"use client";

import { useEffect, useState } from "react";

const cryUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;

const MAX_CACHED = 48;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let unsupported = false;
const buffers = new Map<number, AudioBuffer>();
let current: { id: number; src: AudioBufferSourceNode; gain: GainNode } | null = null;

type AudioCtor = new () => AudioContext;

function ensureCtx(): AudioContext | null {
  if (unsupported) return null;
  try {
    if (!ctx) {
      const w = window as unknown as { AudioContext?: AudioCtor; webkitAudioContext?: AudioCtor };
      const AC = w.AudioContext ?? w.webkitAudioContext;
      if (!AC) {
        unsupported = true;
        return null;
      }
      const created = new AC();
      ctx = created;
      const m = created.createGain();
      m.gain.value = 1;
      m.connect(created.destination);
      master = m;
    }
    const c: AudioContext = ctx;
    if (c.state === "suspended") void c.resume();
    return c;
  } catch {
    unsupported = true;
    return null;
  }
}

export function isSoundEnabled() {
  try {
    return localStorage.getItem("md-sound") !== "off";
  } catch {
    return true;
  }
}

export function setSoundEnabled(on: boolean) {
  try {
    localStorage.setItem("md-sound", on ? "on" : "off");
  } catch {
    /* ignore */
  }
  if (!on) stopCry();
  window.dispatchEvent(new CustomEvent("md-sound-change"));
}

export function isSoundSupported() {
  return ensureCtx() !== null;
}

function emit(id: number | null) {
  window.dispatchEvent(new CustomEvent("md-cry", { detail: id }));
}

export function stopCry() {
  if (!current || !ctx) return;
  try {
    const now = ctx.currentTime;
    current.gain.gain.cancelScheduledValues(now);
    current.gain.gain.setValueAtTime(current.gain.gain.value, now);
    current.gain.gain.linearRampToValueAtTime(0.0001, now + 0.08);
    current.src.stop(now + 0.1);
  } catch {
    /* already stopped */
  }
  current = null;
  emit(null);
}

export async function playCry(id: number, volume = 0.32) {
  if (!isSoundEnabled()) return;
  const c = ensureCtx();
  if (!c || !master) return;

  try {
    let buffer = buffers.get(id);
    if (!buffer) {
      const res = await fetch(cryUrl(id));
      if (!res.ok) return;
      const arr = await res.arrayBuffer();
      buffer = await new Promise<AudioBuffer>((resolve, reject) => {
        const pending = c.decodeAudioData(arr, resolve, reject);
        if (pending && typeof pending.then === "function") pending.then(resolve, reject);
      });
      buffers.set(id, buffer);
      if (buffers.size > MAX_CACHED) {
        const oldest = buffers.keys().next().value;
        if (oldest !== undefined) buffers.delete(oldest);
      }
    }
  } catch {
    return;
  }

  if (!isSoundEnabled()) return;
  stopCry();
  emit(id);

  const buffer = buffers.get(id);
  if (!buffer) return;
  const src = c.createBufferSource();
  src.buffer = buffer;
  const gain = c.createGain();
  const now = c.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.02);
  src.connect(gain);
  gain.connect(master);
  src.start();
  src.onended = () => {
    if (current?.id === id) {
      current = null;
      emit(null);
    }
  };
  current = { id, src, gain };
}

export type UiSfx =
  | "click"
  | "toggle-on"
  | "toggle-off"
  | "open"
  | "close"
  | "tick"
  | "dice"
  | "success"
  | "error"
  | "hover"
  | "pokex";

const SFX_KINDS = new Set<string>([
  "click",
  "toggle-on",
  "toggle-off",
  "open",
  "close",
  "tick",
  "dice",
  "success",
  "error",
  "hover",
  "pokex",
]);

function tone(
  c: AudioContext,
  t0: number,
  opts: { type?: OscillatorType; from: number; to?: number; dur: number; vol: number },
) {
  const dest = master;
  if (!dest) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = opts.type ?? "sine";
  osc.frequency.setValueAtTime(opts.from, t0);
  if (opts.to !== undefined && opts.to !== opts.from) {
    osc.frequency.exponentialRampToValueAtTime(opts.to, t0 + opts.dur);
  }
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(opts.vol, t0 + Math.min(0.01, opts.dur * 0.3));
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(t0);
  osc.stop(t0 + opts.dur + 0.02);
}

export function playUiSfx(kind: UiSfx) {
  if (!isSoundEnabled()) return;
  const c = ensureCtx();
  if (!c || !master) return;
  if (c.state === "suspended") void c.resume();
  const t = c.currentTime + 0.001;
  switch (kind) {
    case "click":
      tone(c, t, { type: "triangle", from: 760, to: 360, dur: 0.09, vol: 0.06 });
      break;
    case "toggle-on":
      tone(c, t, { from: 520, to: 840, dur: 0.09, vol: 0.05 });
      break;
    case "toggle-off":
      tone(c, t, { from: 680, to: 360, dur: 0.09, vol: 0.045 });
      break;
    case "open":
      tone(c, t, { from: 300, to: 660, dur: 0.16, vol: 0.05 });
      tone(c, t + 0.02, { from: 600, to: 990, dur: 0.12, vol: 0.025 });
      break;
    case "close":
      tone(c, t, { from: 620, to: 240, dur: 0.14, vol: 0.045 });
      break;
    case "tick":
      tone(c, t, { from: 1200, to: 900, dur: 0.04, vol: 0.028 });
      break;
    case "dice":
      [523.25, 659.25, 783.99].forEach((f, i) =>
        tone(c, t + i * 0.055, { type: "triangle", from: f, dur: 0.07, vol: 0.04 }),
      );
      break;
    case "success":
      tone(c, t, { from: 659.25, dur: 0.1, vol: 0.045 });
      tone(c, t + 0.09, { from: 987.77, dur: 0.16, vol: 0.045 });
      break;
    case "error":
      tone(c, t, { type: "square", from: 200, dur: 0.07, vol: 0.035 });
      tone(c, t + 0.1, { type: "square", from: 150, dur: 0.1, vol: 0.035 });
      break;
    case "hover":
      tone(c, t, { from: 880, dur: 0.03, vol: 0.012 });
      break;
    case "pokex": {
      const dest = master;
      const wdur = 0.4;
      const nBuf = c.createBuffer(1, Math.ceil(c.sampleRate * wdur), c.sampleRate);
      const ch = nBuf.getChannelData(0);
      for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
      const noise = c.createBufferSource();
      noise.buffer = nBuf;
      const bp = c.createBiquadFilter();
      bp.type = "bandpass";
      bp.Q.value = 1.1;
      bp.frequency.setValueAtTime(240, t);
      bp.frequency.exponentialRampToValueAtTime(2600, t + wdur);
      const nGain = c.createGain();
      nGain.gain.setValueAtTime(0.0001, t);
      nGain.gain.exponentialRampToValueAtTime(0.028, t + wdur * 0.6);
      nGain.gain.exponentialRampToValueAtTime(0.0001, t + wdur);
      noise.connect(bp);
      bp.connect(nGain);
      nGain.connect(dest);
      noise.start(t);
      noise.stop(t + wdur + 0.02);

      tone(c, t + 0.05, { type: "sine", from: 130.81, to: 196, dur: 0.55, vol: 0.05 });

      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) =>
        tone(c, t + 0.3 + i * 0.085, { type: "triangle", from: f, dur: 0.18, vol: 0.05 }),
      );

      [523.25, 783.99, 1318.5].forEach((f) =>
        tone(c, t + 0.62, { type: "sine", from: f, dur: 0.7, vol: 0.02 }),
      );

      tone(c, t + 0.78, { from: 1567.98, dur: 0.4, vol: 0.032 });
      tone(c, t + 0.86, { type: "triangle", from: 2093, dur: 0.35, vol: 0.02 });
      tone(c, t + 0.98, { from: 2637, dur: 0.3, vol: 0.016 });
      break;
    }
  }
}

export function playUiClick() {
  playUiSfx("click");
}

export function initUiSfx(): () => void {
  if (typeof document === "undefined") return () => undefined;
  const hoverOk = window.matchMedia("(hover: hover)").matches;
  let lastHover = 0;

  const pick = (el: Element | null): UiSfx | null => {
    const btn = el?.closest("button");
    if (!btn || btn.dataset.noSfx !== undefined) return null;
    if ((btn as HTMLButtonElement).disabled || btn.getAttribute("aria-disabled") === "true") return null;
    const explicit = btn.getAttribute("data-sfx");
    if (explicit === "none") return null;
    if (explicit && SFX_KINDS.has(explicit)) return explicit as UiSfx;
    const pressed = btn.getAttribute("aria-pressed");
    if (pressed === "true") return "toggle-off";
    if (pressed === "false") return "toggle-on";
    const expanded = btn.getAttribute("aria-expanded");
    if (expanded === "true") return "close";
    if (expanded === "false") return "open";
    return "click";
  };

  const onDown = (e: PointerEvent) => {
    const kind = pick(e.target instanceof Element ? e.target : null);
    if (kind) playUiSfx(kind);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const active = document.activeElement;
    const kind = pick(active instanceof Element ? active : null);
    if (kind) playUiSfx(kind);
  };

  const onOver = (e: PointerEvent) => {
    if (!hoverOk) return;
    const now = performance.now();
    if (now - lastHover < 120) return;
    const el = e.target instanceof Element ? e.target : null;
    const btn = el?.closest("button");
    if (!btn || btn.dataset.noSfx !== undefined || btn.dataset.noHoverSfx !== undefined) return;
    if ((btn as HTMLButtonElement).disabled) return;
    lastHover = now;
    playUiSfx("hover");
  };

  document.addEventListener("pointerdown", onDown, true);
  document.addEventListener("keydown", onKey, true);
  document.addEventListener("pointerover", onOver, true);
  return () => {
    document.removeEventListener("pointerdown", onDown, true);
    document.removeEventListener("keydown", onKey, true);
    document.removeEventListener("pointerover", onOver, true);
  };
}

export function useCryState() {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    const onCry = (e: Event) => setPlayingId((e as CustomEvent<number | null>).detail ?? null);
    const onToggle = () => setEnabled(isSoundEnabled());
    setEnabled(isSoundEnabled());
    window.addEventListener("md-cry", onCry);
    window.addEventListener("md-sound-change", onToggle);
    return () => {
      window.removeEventListener("md-cry", onCry);
      window.removeEventListener("md-sound-change", onToggle);
    };
  }, []);
  return { playingId, enabled };
}
