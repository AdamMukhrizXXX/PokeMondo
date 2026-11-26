"use client";

import { useEffect, useState } from "react";
import { BGM_TRACKS } from "./bgm-tracks";

export type BgmTrack = {
  file: string;
  title: string;
  game: string;
};

const BASE_URL = "https://raw.githubusercontent.com/MonkeyBusinessXD/Pokemon-Music/main/";

export const BGM_COUNT = BGM_TRACKS.length;

let audio: HTMLAudioElement | null = null;
let masterVol = 0.55;
let duckTimer = 0;

function loadPref(key: string, fallback = "") {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function savePref(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

function emit() {
  window.dispatchEvent(
    new CustomEvent("md-bgm", {
      detail: {
        playing: !!audio && !audio.paused && !audio.ended,
        index: currentIndex,
        shuffle,
        volume: masterVol,
      },
    }),
  );
}

let currentIndex = Math.floor(Math.random() * BGM_COUNT);
let shuffle = loadPref("md-bgm-shuffle") === "on";

function setupAudio(): HTMLAudioElement {
  if (audio) return audio;
  audio = new Audio();
  audio.dataset.bgm = "1";
  audio.preload = "none";
  audio.volume = masterVol;
  audio.addEventListener("ended", () => {
    void nextBgm(true);
  });
  audio.addEventListener("play", emit);
  audio.addEventListener("pause", emit);
  window.addEventListener("md-cry", (e) => {
    if (!audio) return;
    const id = (e as CustomEvent<number | null>).detail;
    window.clearTimeout(duckTimer);
    if (id !== null) {
      audio.volume = masterVol * 0.22;
      duckTimer = window.setTimeout(() => {
        if (audio) audio.volume = masterVol;
      }, 1700);
    } else {
      audio.volume = masterVol;
    }
  });
  return audio;
}

export function isBgmOn() {
  return loadPref("md-bgm") === "on";
}

export function setBgmOn(on: boolean) {
  savePref("md-bgm", on ? "on" : "off");
  if (!on) pauseBgm();
  emit();
}

export function getBgmTrack(i = currentIndex) {
  return BGM_TRACKS[((i % BGM_COUNT) + BGM_COUNT) % BGM_COUNT];
}

export function getBgmIndex() {
  return currentIndex;
}

async function playIndex(i: number) {
  const el = setupAudio();
  currentIndex = ((i % BGM_COUNT) + BGM_COUNT) % BGM_COUNT;
  savePref("md-bgm", "on");
  const track = BGM_TRACKS[currentIndex];
  el.src = BASE_URL + track.file;
  try {
    await el.play();
  } catch {
    emit();
    return;
  }
  if ("mediaSession" in navigator) {
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.game,
        album: "PokeMondo OST",
      });
      navigator.mediaSession.setActionHandler("previoustrack", () => void prevBgm());
      navigator.mediaSession.setActionHandler("nexttrack", () => void nextBgm());
      navigator.mediaSession.setActionHandler("play", () => void resumeBgm());
      navigator.mediaSession.setActionHandler("pause", pauseBgm);
    } catch {
      /* unsupported */
    }
  }
  emit();
}

export async function startBgm(i?: number) {
  return playIndex(i ?? currentIndex);
}

export async function resumeBgm() {
  const el = setupAudio();
  if (el.src && el.paused) {
    try {
      await el.play();
    } catch {
      /* blocked */
    }
    emit();
  } else {
    await playIndex(currentIndex);
  }
}

export function pauseBgm() {
  audio?.pause();
  emit();
}

export async function nextBgm(auto = false) {
  void auto;
  if (shuffle) {
    let n = currentIndex;
    while (BGM_COUNT > 1 && n === currentIndex) {
      n = Math.floor(Math.random() * BGM_COUNT);
    }
    return playIndex(n);
  }
  return playIndex(currentIndex + 1);
}

export async function prevBgm() {
  const el = audio;
  if (el && !el.paused && el.currentTime > 4) {
    el.currentTime = 0;
    return;
  }
  return playIndex(currentIndex - 1);
}

export function toggleShuffleBgm() {
  shuffle = !shuffle;
  savePref("md-bgm-shuffle", shuffle ? "on" : "off");
  emit();
}

export function setBgmVolume(v: number) {
  masterVol = Math.min(1, Math.max(0, v));
  if (audio) audio.volume = masterVol;
  savePref("md-bgm-vol", String(Math.round(masterVol * 100)));
  emit();
}

export function getBgmVolume() {
  masterVol = Number(loadPref("md-bgm-vol", "55")) / 100 || 0.55;
  return masterVol;
}

export function getBgmShuffle() {
  return shuffle;
}

export type BgmUiState = {
  playing: boolean;
  index: number;
  shuffle: boolean;
};

export function useBgmState(): BgmUiState {
  const [state, setState] = useState<BgmUiState>({
    playing: false,
    index: currentIndex,
    shuffle,
  });
  useEffect(() => {
    const on = () =>
      setState({
        playing: !!audio && !audio.paused && !audio.ended,
        index: currentIndex,
        shuffle,
      });
    on();
    window.addEventListener("md-bgm", on);
    return () => window.removeEventListener("md-bgm", on);
  }, []);
  return state;
}
