"use client";

const USERS_KEY = "md-auth-users";
const SESSION_KEY = "md-session";

export type SessionInfo = { email: string; at: number };
type UserRecord = { salt: string; hash: string };
type UsersMap = Record<string, UserRecord>;

function readUsers(): UsersMap {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "{}") as UsersMap;
  } catch {
    return {};
  }
}

function writeUsers(map: UsersMap) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(map));
  } catch {
    /* simpanan penuh — abaikan */
  }
}

function fallbackHash(text: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return `f${(h2 >>> 0).toString(16)}${(h1 >>> 0).toString(16)}`;
}

async function digest(text: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  return fallbackHash(text);
}

function randomSalt(): string {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  return fallbackHash(`${Date.now()}${Math.random()}`);
}

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const validEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizeEmail(email));

export const validPassword = (password: string) => password.length >= 6;

export const getSession = (): SessionInfo | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as SessionInfo;
    return s && typeof s.email === "string" ? s : null;
  } catch {
    return null;
  }
};

export const logoutUser = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
};

export async function registerUser(email: string, password: string): Promise<SessionInfo> {
  const key = normalizeEmail(email);
  if (!validEmail(key)) throw new Error("Format emel tidak sah.");
  if (!validPassword(password)) throw new Error("Kata laluan mesti sekurang-kurangnya 6 aksara.");
  const users = readUsers();
  if (users[key]) throw new Error("Emel ini sudah didaftarkan — sila log masuk.");
  const salt = randomSalt();
  const hash = await digest(salt + password);
  users[key] = { salt, hash };
  writeUsers(users);
  const session: SessionInfo = { email: key, at: Date.now() };
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
  return session;
}

export async function loginUser(email: string, password: string): Promise<SessionInfo> {
  const key = normalizeEmail(email);
  if (!key || !password) throw new Error("Masukkan emel dan kata laluan.");
  const rec = readUsers()[key];
  if (!rec) throw new Error("Akaun tidak dijumpai — sila daftar dahulu.");
  const hash = await digest(rec.salt + password);
  if (hash !== rec.hash) throw new Error("Kata laluan salah.");
  const session: SessionInfo = { email: key, at: Date.now() };
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
  return session;
}
