"use client";

import { useEffect, useState } from "react";

const K_FORCE = "md-pokedex-force";

export const CLOSED_UNTIL = new Date(2027, 11, 31, 23, 59, 59, 999).getTime();

export type ServerStatus = {
  closed: boolean;
  until: number;
  msLeft: number;
};

export function getServerStatus(now = Date.now()): ServerStatus {
  const closed = now < CLOSED_UNTIL && getForcedOpen() !== true;
  return { closed, until: CLOSED_UNTIL, msLeft: Math.max(0, CLOSED_UNTIL - now) };
}

export function getForcedOpen(): boolean {
  try {
    return window.localStorage.getItem(K_FORCE) === "open";
  } catch {
    return false;
  }
}

export function setForcedOpen(open: boolean) {
  try {
    if (open) window.localStorage.setItem(K_FORCE, "open");
    else window.localStorage.removeItem(K_FORCE);
  } catch {
    /* pelayar swasta */
  }
}

export function useServerStatus(): ServerStatus {
  const [status, setStatus] = useState<ServerStatus>(() => ({
    closed: true,
    until: CLOSED_UNTIL,
    msLeft: Math.max(0, CLOSED_UNTIL - Date.now()),
  }));

  useEffect(() => {
    let last = getServerStatus();
    setStatus(last);
    const t = setInterval(() => {
      const s = getServerStatus();
      if (s.closed !== last.closed) {
        last = s;
        setStatus(s);
        window.dispatchEvent(new CustomEvent("md-server-status", { detail: s }));
      }
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return status;
}

export function useCountdown(until: number) {
  const [msLeft, setMsLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setMsLeft(Math.max(0, until - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [until]);

  return msLeft;
}

export function splitCountdown(msLeft: number) {
  const total = Math.floor(msLeft / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}
