export type ImportedMeta = {
  key: string;
  title: string;
  size: number;
  addedAt: number;
};

const DB_NAME = "pokemondo-bgm";
const STORE = "tracks";
const urlCache = new Map<string, string>();

export const isImportSupported = () =>
  typeof indexedDB !== "undefined";

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

export async function putImported(file: File | Blob, title: string): Promise<ImportedMeta> {
  const key = `imp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const meta: ImportedMeta = { key, title, size: file.size, addedAt: Date.now() };
  await withStore("readwrite", (store) => store.put({ ...meta, blob: file }));
  return meta;
}

export async function listImported(): Promise<ImportedMeta[]> {
  if (!isImportSupported()) return [];
  const rows = await withStore<ImportedMeta[]>("readonly", (store) => store.getAll() as IDBRequest<ImportedMeta[]>);
  return rows.sort((a, b) => a.addedAt - b.addedAt);
}

export async function deleteImported(key: string): Promise<void> {
  await withStore("readwrite", (store) => store.delete(key));
  const url = urlCache.get(key);
  if (url) {
    URL.revokeObjectURL(url);
    urlCache.delete(key);
  }
}

export async function getBlobUrl(key: string): Promise<string | null> {
  const cached = urlCache.get(key);
  if (cached) return cached;
  if (!isImportSupported()) return null;
  const row = await withStore<{ blob: Blob } | undefined>("readonly", (store) =>
    store.get(key) as IDBRequest<{ blob: Blob } | undefined>,
  );
  if (!row?.blob) return null;
  const url = URL.createObjectURL(row.blob);
  urlCache.set(key, url);
  return url;
}
