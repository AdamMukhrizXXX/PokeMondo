"use client";

const DB_NAME = "pokemondo-ui";
const STORE = "wallpaper";
const KEY = "wallpaper";
export const MAX_WALLPAPER_BYTES = 12 * 1024 * 1024;

export type WallpaperRecord = { key: string; blob: Blob; addedAt: number };

let dbPromise: Promise<IDBDatabase> | null = null;
const urlCache = new Map<string, string>();

export function isWallpaperSupported() {
  return typeof window !== "undefined" && "indexedDB" in window;
}

function openDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "key" });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}

function withStore<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const req = run(tx.objectStore(STORE));
        req.onsuccess = () => resolve(req.result as T);
        req.onerror = () => reject(req.error);
      }),
  );
}

export async function saveWallpaper(file: File): Promise<void> {
  if (!file.type.startsWith("image/")) throw new Error("not-image");
  if (file.size > MAX_WALLPAPER_BYTES) throw new Error("too-large");
  if (file.size === 0) throw new Error("empty");
  const rec: WallpaperRecord = { key: KEY, blob: file, addedAt: Date.now() };
  await withStore("readwrite", (s) => s.put(rec));
  const old = urlCache.get(KEY);
  if (old) URL.revokeObjectURL(old);
  urlCache.delete(KEY);
}

export async function loadWallpaperUrl(): Promise<string | null> {
  const cached = urlCache.get(KEY);
  if (cached) return cached;
  try {
    const rec = await withStore<WallpaperRecord | undefined>("readonly", (s) => s.get(KEY));
    if (!rec?.blob) return null;
    const url = URL.createObjectURL(rec.blob);
    urlCache.set(KEY, url);
    return url;
  } catch {
    return null;
  }
}

export async function deleteWallpaper(): Promise<void> {
  const old = urlCache.get(KEY);
  if (old) URL.revokeObjectURL(old);
  urlCache.delete(KEY);
  await withStore("readwrite", (s) => s.delete(KEY));
}

export function applyWallpaper(url: string | null, dim?: number, blur?: number) {
  const root = document.documentElement;
  if (url) {
    root.style.setProperty("--wp-url", `url("${url}")`);
    root.dataset.wp = "1";
  } else {
    root.style.removeProperty("--wp-url");
    delete root.dataset.wp;
  }
  if (dim !== undefined) root.style.setProperty("--wp-dim", String(dim));
  if (blur !== undefined) root.style.setProperty("--wp-blur", `${blur}px`);
}

export function loadPrefs(): { dim: number; blur: number } {
  try {
    const dim = Number(localStorage.getItem("md-wp-dim"));
    const blur = Number(localStorage.getItem("md-wp-blur"));
    return {
      dim: Number.isFinite(dim) && dim > 0 ? Math.min(dim, 0.9) : 0.45,
      blur: Number.isFinite(blur) && blur >= 0 ? Math.min(blur, 20) : 0,
    };
  } catch {
    return { dim: 0.45, blur: 0 };
  }
}

export function savePrefs(dim: number, blur: number) {
  try {
    localStorage.setItem("md-wp-dim", String(dim));
    localStorage.setItem("md-wp-blur", String(blur));
  } catch {
    /* ignore */
  }
}
