export type ResourceMeta = {
  key: string;
  title: string;
  game: string;
  size: number;
  addedAt: number;
};

const DB_NAME = "pokemondo-res";
const STORE = "resources";
const urlCache = new Map<string, string>();

export const isResSupported = () =>
  typeof indexedDB !== "undefined";

export function emitResChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("md-res"));
  }
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE, { keyPath: "key" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB gagal dibuka"));
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const req = run(db.transaction(STORE, mode).objectStore(STORE));
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error ?? new Error("Operasi IndexedDB gagal"));
    });
  } finally {
    db.close();
  }
}

export async function putResource(
  key: string,
  title: string,
  game: string,
  blob: Blob,
): Promise<ResourceMeta> {
  const meta: ResourceMeta = { key, title, game, size: blob.size, addedAt: Date.now() };
  await withStore("readwrite", (store) => store.put({ ...meta, blob }));
  emitResChanged();
  return meta;
}

export async function listResources(): Promise<ResourceMeta[]> {
  if (!isResSupported()) return [];
  const rows = await withStore<ResourceMeta[]>("readonly", (store) =>
    store.getAll() as IDBRequest<ResourceMeta[]>,
  );
  return rows.sort((a, b) => a.addedAt - b.addedAt);
}

export async function deleteResource(key: string): Promise<void> {
  await withStore("readwrite", (store) => store.delete(key));
  const url = urlCache.get(key);
  if (url) {
    URL.revokeObjectURL(url);
    urlCache.delete(key);
  }
  emitResChanged();
}

export async function resourceBytes(): Promise<number> {
  const rows = await listResources();
  return rows.reduce((sum, r) => sum + r.size, 0);
}

export async function getResBlobUrl(key: string): Promise<string | null> {
  const cached = urlCache.get(key);
  if (cached) return cached;
  if (!isResSupported()) return null;
  const row = await withStore<{ blob: Blob } | undefined>("readonly", (store) =>
    store.get(key) as IDBRequest<{ blob: Blob } | undefined>,
  );
  if (!row?.blob) return null;
  const url = URL.createObjectURL(row.blob);
  urlCache.set(key, url);
  return url;
}
