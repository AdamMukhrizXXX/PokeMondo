"use client";

import { useCallback, useEffect, useState } from "react";

const K_ACCESS = "md-admin-access";
const K_USAGE = "md-admin-usage";
const CODES = ["ADMINSERVER", "SERVERFREE"] as const;
export type RedeemCode = (typeof CODES)[number];

export const CODE_LIMITS: Record<RedeemCode, { accessLimit: number; daily: number; weekly: number; monthly: number }> = {
  ADMINSERVER: { accessLimit: 40, daily: 10, weekly: 30, monthly: Infinity },
  SERVERFREE: { accessLimit: 100, daily: Infinity, weekly: Infinity, monthly: 5 },
};

export const ACCESS_LIMIT = 40;

export type AdminAccess = { code: string; ids: number[] };
export type RedeemResult = { ok: boolean; error: string | null };

type Usage = { dayKey: string; dayCount: number; weekKey: string; weekCount: number; monthKey: string; monthCount: number };

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function weekStart(d = new Date()): string {
  const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  dt.setDate(dt.getDate() - ((dt.getDay() + 6) % 7));
  return ymd(dt);
}

function currentKeys(): { day: string; week: string; month: string } {
  const now = new Date();
  return {
    day: ymd(now),
    week: weekStart(now),
    month: ymd(now).slice(0, 7),
  };
}

function freshUsage(): Usage {
  const k = currentKeys();
  return { dayKey: k.day, dayCount: 0, weekKey: k.week, weekCount: 0, monthKey: k.month, monthCount: 0 };
}

function readUsage(): Record<string, Usage> {
  try {
    const raw = window.localStorage.getItem(K_USAGE);
    return raw ? (JSON.parse(raw) as Record<string, Usage>) : {};
  } catch {
    return {};
  }
}

function rolledUsage(code: string): Usage {
  const k = currentKeys();
  const u = { ...freshUsage(), ...(readUsage()[code] ?? {}) };
  if (u.dayKey !== k.day) {
    u.dayKey = k.day;
    u.dayCount = 0;
  }
  if (u.weekKey !== k.week) {
    u.weekKey = k.week;
    u.weekCount = 0;
  }
  if (u.monthKey !== k.month) {
    u.monthKey = k.month;
    u.monthCount = 0;
  }
  return u;
}

export type CodeUsage = { dayLeft: number; weekLeft: number; monthLeft: number };

export function getCodeUsage(code: string): CodeUsage {
  const lim = CODES.includes(code as RedeemCode) ? CODE_LIMITS[code as RedeemCode] : null;
  const u = rolledUsage(code);
  if (!lim) return { dayLeft: 0, weekLeft: 0, monthLeft: 0 };
  return {
    dayLeft: Number.isFinite(lim.daily) ? Math.max(0, lim.daily - u.dayCount) : Infinity,
    weekLeft: Number.isFinite(lim.weekly) ? Math.max(0, lim.weekly - u.weekCount) : Infinity,
    monthLeft: Number.isFinite(lim.monthly) ? Math.max(0, lim.monthly - u.monthCount) : Infinity,
  };
}

function recordUse(code: string) {
  const u = rolledUsage(code);
  u.dayCount += 1;
  u.weekCount += 1;
  u.monthCount += 1;
  const all = readUsage();
  all[code] = u;
  try {
    window.localStorage.setItem(K_USAGE, JSON.stringify(all));
  } catch {
    /* pelayar swasta */
  }
}

export type LimitStatus = { ok: true } | { ok: false; error: string };

export function checkLimits(code: RedeemCode): LimitStatus {
  const lim = CODE_LIMITS[code];
  const u = rolledUsage(code);
  if (u.weekCount >= lim.weekly) {
    return { ok: false, error: `Had mingguan ${code} tercapai (${lim.weekly}×/minggu) — reset secara automatik pada minggu hadapan.` };
  }
  if (u.dayCount >= lim.daily) {
    return { ok: false, error: `Had harian ${code} tercapai (${lim.daily}×/sehari) — cuba lagi esok.` };
  }
  if (u.monthCount >= lim.monthly) {
    return { ok: false, error: `Had bulanan ${code} tercapai (${lim.monthly}×/sebulan) — reset secara automatik pada bulan hadapan.` };
  }
  return { ok: true };
}

export function redeemCode(raw: string, allIds: number[]): RedeemResult & { access: AdminAccess | null } {
  const code = raw.trim().toUpperCase();
  if (!CODES.includes(code as RedeemCode)) {
    return { ok: false, error: "Kod tidak sah — semak ejaan dan cuba lagi.", access: null };
  }
  const lim = checkLimits(code as RedeemCode);
  if (!lim.ok) {
    return { ok: false, error: lim.error, access: null };
  }
  const access = { code, ids: pickIds(allIds, CODE_LIMITS[code as RedeemCode].accessLimit) };
  save(access);
  recordUse(code);
  return { ok: true, error: null, access };
}

function pickIds(allIds: number[], limit: number): number[] {
  const pool = allIds.length ? [...allIds] : Array.from({ length: 1025 }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(limit, pool.length));
}

function save(a: AdminAccess) {
  try {
    window.localStorage.setItem(K_ACCESS, JSON.stringify(a));
  } catch {
    /* pelayar swasta */
  }
}

export function rerollAccess(allIds: number[]): AdminAccess | null {
  const cur = readAccess();
  if (!cur) return null;
  const limit = CODES.includes(cur.code as RedeemCode) ? CODE_LIMITS[cur.code as RedeemCode].accessLimit : ACCESS_LIMIT;
  const next = { ...cur, ids: pickIds(allIds, limit) };
  save(next);
  return next;
}

export function clearAccess() {
  try {
    window.localStorage.removeItem(K_ACCESS);
  } catch {
    /* pelayar swasta */
  }
}

function readAccess(): AdminAccess | null {
  try {
    const raw = window.localStorage.getItem(K_ACCESS);
    if (!raw) return null;
    const v = JSON.parse(raw) as AdminAccess;
    if (!CODES.includes(v.code as RedeemCode) || !Array.isArray(v.ids) || v.ids.length === 0) return null;
    return { code: v.code, ids: v.ids };
  } catch {
    return null;
  }
}

export function accessLimitOf(code: string): number {
  return CODES.includes(code as RedeemCode) ? CODE_LIMITS[code as RedeemCode].accessLimit : ACCESS_LIMIT;
}

const EV_ADMIN = "md-admin";

export function useAdminAccess(allIds: number[]) {
  const [access, setAccess] = useState<AdminAccess | null>(null);

  useEffect(() => {
    setAccess(readAccess());
    const on = (e: Event) => {
      const detail = (e as CustomEvent<AdminAccess | null>).detail;
      if (detail === null || (detail && typeof detail.code === "string" && Array.isArray(detail.ids))) {
        setAccess(detail);
      }
    };
    window.addEventListener(EV_ADMIN, on);
    return () => window.removeEventListener(EV_ADMIN, on);
  }, []);

  const redeem = useCallback(
    (raw: string) => {
      const r = redeemCode(raw, allIds);
      if (r.ok && r.access) {
        setAccess(r.access);
        try {
          window.dispatchEvent(new CustomEvent(EV_ADMIN, { detail: r.access }));
        } catch {
          /* abaikan */
        }
      }
      return r;
    },
    [allIds],
  );

  const reroll = useCallback(() => setAccess(rerollAccess(allIds)), [allIds]);

  const unredeem = useCallback(() => {
    clearAccess();
    setAccess(null);
  }, []);

  return { access, redeem, reroll, unredeem };
}
