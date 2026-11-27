"use client";

import { useEffect, useState } from "react";

export const CLOSED_UNTIL = 0;

export type ServerStatus = { closed: boolean; until: number; msLeft: number };

export function getServerStatus(): ServerStatus {
  return { closed: false, until: 0, msLeft: 0 };
}

export function getForcedOpen(): boolean {
  return false;
}

export function setForcedOpen(_open: boolean) {
  /* tiada lagi — pelayan sentiasa terbuka */
}

export function useServerStatus(): ServerStatus {
  const [status] = useState<ServerStatus>(() => getServerStatus());
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("md-server-status", { detail: getServerStatus() }));
  }, []);
  return status;
}

export function useCountdown(_until: number): number | null {
  return null;
}

export function splitCountdown(_msLeft: number) {
  return { days: 0, hours: 0, minutes: 0, seconds: 0 };
}
