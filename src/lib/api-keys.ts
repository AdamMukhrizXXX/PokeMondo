export type ApiKeyEntry = {
  id: string;
  label: string;
  key: string;
  createdAt: number;
};

const K = "md-api-keys";

export const isKeyGenSupported = () =>
  typeof crypto !== "undefined" && "getRandomValues" in crypto;

function load(): ApiKeyEntry[] {
  try {
    const raw = localStorage.getItem(K);
    const parsed = raw ? (JSON.parse(raw) as ApiKeyEntry[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(keys: ApiKeyEntry[]) {
  try {
    localStorage.setItem(K, JSON.stringify(keys));
  } catch {
    /* ignore */
  }
}

export function listApiKeys(): ApiKeyEntry[] {
  return load();
}

export function generateApiKey(label: string): ApiKeyEntry {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  const entry: ApiKeyEntry = {
    id: `${Date.now().toString(36)}-${hex.slice(0, 6)}`,
    label: label.trim() || "Kunci tanpa nama",
    key: `pkm_live_${hex}`,
    createdAt: Date.now(),
  };
  save([entry, ...load()]);
  return entry;
}

export function revokeApiKey(id: string) {
  save(load().filter((k) => k.id !== id));
}

export function maskKey(key: string): string {
  if (key.length <= 16) return key;
  return `${key.slice(0, 12)}…${key.slice(-4)}`;
}

export const POKEAPI_BASE = "https://pokeapi.co/api/v2";
