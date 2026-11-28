"use client";

import { useEffect, useState } from "react";
import { BGM_TRACKS } from "./bgm-tracks";
import { getBlobUrl, type ImportedMeta } from "./import-db";
import { getResBlobUrl, listResources, type ResourceMeta } from "./resource-db";

export type BgmTrack = {
  id: string;
  title: string;
  game: string;
  url?: string;
};

const BASE_URL = "https://raw.githubusercontent.com/MonkeyBusinessXD/Pokemon-Music/main/";

const REMOTE: BgmTrack[] = BGM_TRACKS.map((t) => ({
  id: t.file,
  title: t.title,
  game: t.game,
  url: t.url ?? BASE_URL + t.file,
}));

function prettyName(name: string) {
  const base = name.replace(/\.[^.]+$/, "").replace(/[_\-\s]+/g, " ").trim();
  return base.replace(/\b\w/g, (c) => c.toUpperCase()) || "Trek import";
}

let playlist: BgmTrack[] = [];
let imported: BgmTrack[] = [];
let downloaded: BgmTrack[] = [];
let audio: HTMLAudioElement | null = null;
let masterVol = 0.55;
let duckTimer = 0;

function rebuild() {
  playlist = [...downloaded, ...imported];
}

export function getBgmCatalog(): BgmTrack[] {
  return REMOTE;
}

let resourcesLoaded = false;

export async function ensureResourcesLoaded() {
  if (resourcesLoaded) return;
  resourcesLoaded = true;
  try {
    const rows = await listResources();
    addDownloadedBgm(rows);
  } catch {
    resourcesLoaded = false;
  }
}

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
        count: playlist.length,
      },
    }),
  );
}

let currentIndex = 0;
let shuffle = loadPref("md-bgm-shuffle") === "on";

function setupAudio(): HTMLAudioElement {
  if (audio) return audio;
  audio = new Audio();
  audio.dataset.bgm = "1";
  audio.preload = "none";
  audio.volume = masterVol;
  audio.addEventListener("ended", () => {
    const finished = playlist[currentIndex]?.title ?? "";
    window.dispatchEvent(new CustomEvent("md-bgm-ended", { detail: { title: finished } }));
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
  return playlist[((i % playlist.length) + playlist.length) % playlist.length] ?? REMOTE[0];
}

export function getBgmIndex() {
  return currentIndex;
}

export function getBgmPlaylist(): BgmTrack[] {
  return [...playlist];
}

export function addDownloadedBgm(metas: ResourceMeta[]) {
  const fresh = metas
    .map((m) => ({ id: m.key, title: m.title, game: m.game }))
    .filter((t) => !downloaded.some((x) => x.id === t.id));
  if (fresh.length === 0) return;
  downloaded = [...downloaded, ...fresh];
  rebuild();
  if (currentIndex >= playlist.length) {
    currentIndex = playlist.length > 0 ? Math.floor(Math.random() * playlist.length) : 0;
  }
  emit();
}

export function removeDownloadedBgm(key: string) {
  const wasCurrent = playlist[currentIndex]?.id === key;
  downloaded = downloaded.filter((t) => t.id !== key);
  rebuild();
  currentIndex = playlist.length > 0 ? Math.min(currentIndex, playlist.length - 1) : 0;
  emit();
  if (wasCurrent && audio && !audio.paused) {
    audio.pause();
  }
}

export function removeImportedBgm(key: string) {
  const wasCurrent = playlist[currentIndex]?.id === key;
  imported = imported.filter((t) => t.id !== key);
  rebuild();
  currentIndex = Math.min(currentIndex, playlist.length - 1);
  emit();
  if (wasCurrent && audio && !audio.paused) {
    void playIndex(currentIndex);
  }
}

export function addImportedBgm(metas: ImportedMeta[]) {
  const fresh = metas
    .map((m) => ({ id: m.key, title: prettyName(m.title), game: "Import" }))
    .filter((t) => !imported.some((x) => x.id === t.id));
  if (fresh.length === 0) return;
  imported = [...imported, ...fresh];
  rebuild();
  emit();
}

export function playBgmById(id: string) {
  const i = playlist.findIndex((t) => t.id === id);
  if (i >= 0) return playIndex(i);
  return Promise.resolve();
}

async function playIndex(i: number) {
  const el = setupAudio();
  if (playlist.length === 0) return;
  currentIndex = ((i % playlist.length) + playlist.length) % playlist.length;
  savePref("md-bgm", "on");
  const track = playlist[currentIndex];
  let src = "";
  if (track.id.startsWith("imp-")) {
    src = (await getBlobUrl(track.id)) ?? "";
  } else {
    src = (await getResBlobUrl(track.id)) ?? "";
  }
  if (!src) {
    emit();
    return;
  }
  if (el.src !== src) el.src = src;
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
    while (playlist.length > 1 && n === currentIndex) {
      n = Math.floor(Math.random() * playlist.length);
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
  count: number;
};

export function useBgmState(): BgmUiState {
  const [state, setState] = useState<BgmUiState>({
    playing: false,
    index: currentIndex,
    shuffle,
    count: playlist.length,
  });
  useEffect(() => {
    const on = () =>
      setState({
        playing: !!audio && !audio.paused && !audio.ended,
        index: currentIndex,
        shuffle,
        count: playlist.length,
      });
    on();
    window.addEventListener("md-bgm", on);
    return () => window.removeEventListener("md-bgm", on);
  }, []);
  return state;
}
