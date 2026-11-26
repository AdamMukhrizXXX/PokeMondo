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
