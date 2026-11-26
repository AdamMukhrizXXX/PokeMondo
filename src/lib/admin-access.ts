"use client";

import { useCallback, useEffect, useState } from "react";

const K_ACCESS = "md-admin-access";
const CODES = ["ADMINSERVER", "SERVERFREE"];
export const ACCESS_LIMIT = 40;

export type AdminAccess = { code: string; ids: number[] };

function readAccess(): AdminAccess | null {
  try {
    const raw = window.localStorage.getItem(K_ACCESS);
    if (!raw) return null;
    const v = JSON.parse(raw) as AdminAccess;
    if (!CODES.includes(v.code) || !Array.isArray(v.ids) || v.ids.length === 0) return null;
    return { code: v.code, ids: v.ids };
  } catch {
    return null;
  }
}

function pickIds(allIds: number[]): number[] {
  const pool = allIds.length ? [...allIds] : Array.from({ length: 1025 }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(ACCESS_LIMIT, pool.length));
}

function save(a: AdminAccess) {
  try {
    window.localStorage.setItem(K_ACCESS, JSON.stringify(a));
  } catch {
    /* pelayar swasta */
  }
}

export function redeemCode(raw: string, allIds: number[]): { ok: boolean; access: AdminAccess | null } {
  const code = raw.trim().toUpperCase();
  if (!CODES.includes(code)) return { ok: false, access: null };
  const access = { code, ids: pickIds(allIds) };
  save(access);
  return { ok: true, access };
}

export function rerollAccess(allIds: number[]): AdminAccess | null {
  const cur = readAccess();
  if (!cur) return null;
  const next = { ...cur, ids: pickIds(allIds) };
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

export function useAdminAccess(allIds: number[]) {
  const [access, setAccess] = useState<AdminAccess | null>(null);

  useEffect(() => {
    setAccess(readAccess());
  }, []);

  const redeem = useCallback(
    (raw: string) => {
      const r = redeemCode(raw, allIds);
      if (r.ok) setAccess(r.access);
      return r.ok;
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
