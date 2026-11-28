export const POKEX_CLOSED = true;
export const POKEX_REOPENS_AT = "2026-11-29T00:00:00Z";

export function pokexClosedNow(now = Date.now()): boolean {
  return POKEX_CLOSED && now < Date.parse(POKEX_REOPENS_AT);
}

export function pokexDaysLeft(now = Date.now()): number {
  const diff = Date.parse(POKEX_REOPENS_AT) - now;
  return Math.max(0, Math.ceil(diff / 86400000));
}

export function pokexReopenDate(lang?: string): string {
  try {
    return new Date(Date.parse(POKEX_REOPENS_AT)).toLocaleDateString(lang || undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return POKEX_REOPENS_AT.slice(0, 10);
  }
}
