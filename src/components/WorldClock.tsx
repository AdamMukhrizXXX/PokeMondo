"use client";

import { useEffect, useMemo, useState } from "react";
import { POKEMON_ZONE_MAP, WORLD_ZONES, localZoneName, readZone } from "../lib/timezones";

const REGION_ORDER = ["Asia", "Eropah", "Afrika", "Amerika", "Oceania", "Lain"];

export default function WorldClock() {
  const [now, setNow] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const localTz = localZoneName();
  const local = now ? readZone(localTz, now) : null;

  const grouped = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = needle
      ? WORLD_ZONES.filter(
          (z) =>
            z.city.toLowerCase().includes(needle) ||
            z.country.toLowerCase().includes(needle) ||
            z.region.toLowerCase().includes(needle),
        )
      : WORLD_ZONES;
    const map = new Map<string, typeof list>();
    for (const z of list) {
      const arr = map.get(z.region) ?? [];
      arr.push(z);
      map.set(z.region, arr);
    }
    return [...map.entries()].sort(
      (a, b) => REGION_ORDER.indexOf(a[0]) - REGION_ORDER.indexOf(b[0]) || a[0].localeCompare(b[0]),
    );
  }, [q]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center px-4">
      <div className="pointer-events-auto relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Jam Dunia — buka masa semua dunia dan negara"
          className="flex h-11 items-center gap-2.5 rounded-full border border-outline-variant bg-surface-container-low/90 px-4 shadow-e2 backdrop-blur-xl transition-transform active:scale-95"
        >
          <span aria-hidden className="relative grid place-items-center">
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={open ? "text-primary" : "text-on-surface-variant"}
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18" />
              <path d="M12 3a14.5 14.5 0 0 1 0 18a14.5 14.5 0 0 1 0-18Z" />
            </svg>
          </span>
          <span
            aria-hidden
            className={`size-1.5 rounded-full transition-opacity ${
              local
                ? local.hour >= 6 && local.hour < 18
                  ? "bg-[#f0a92e]"
                  : "bg-inverse-surface"
                : "bg-outline"
            } motion-safe:animate-pulse`}
          />
          <span className="font-display text-sm font-bold tabular-nums tracking-wide text-on-surface">
            {local ? local.time : "--:--:--"}
          </span>
          <span className="hidden text-xs text-on-surface-variant sm:block">Masa anda</span>
        </button>

        {open && (
          <div
            className="anim-rise absolute left-1/2 top-[calc(100%+0.75rem)] max-h-[72svh] w-[min(30rem,calc(100vw-0.5rem))] -translate-x-1/2 overflow-hidden rounded-[1.75rem] border border-outline-variant shadow-e3"
            style={{ background: "var(--md-surface-container-low)" }}
          >
            <div className="flex items-center justify-between gap-2 px-5 pb-2 pt-4">
              <div>
                <p className="font-display text-sm font-extrabold tracking-tight text-on-surface">
                  Jam Dunia
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  Masa nyata semua dunia &amp; rantau Pokémon
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                data-sfx="close"
                aria-label="Tutup jam dunia"
                className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-container-high text-on-surface-variant transition-colors hover:bg-surface-container-highest"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <div className="px-5 pb-3">
              <div className="flex h-10 items-center gap-2 rounded-full border border-outline-variant bg-surface-container px-4">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 text-on-surface-variant" aria-hidden>
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.2-3.2" />
                </svg>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Cari negara atau bandar… cth. Jepun, Paris"
                  aria-label="Cari zon masa"
                  className="h-full w-full bg-transparent text-sm outline-none placeholder:text-on-surface-variant/70"
                />
              </div>
            </div>

            <div className="max-h-[calc(72svh-9rem)] overflow-y-auto px-5 pb-5" style={{ contain: "layout style" }}>
              <p className="pb-2 font-display text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                Rantau Pokémon
              </p>
              <div className="grid grid-cols-3 gap-2" style={{ contain: "layout style" }}>
                {POKEMON_ZONE_MAP.map((z) => {
                  const r = now ? readZone(z.tz, now) : null;
                  const isDay = r ? r.hour >= 6 && r.hour < 18 : true;
                  return (
                    <div
                      key={z.region}
                      className="flex items-center gap-2 rounded-2xl bg-surface-container px-3 py-2.5"
                    >
                      <span
                        aria-hidden
                        className={`size-1.5 shrink-0 rounded-full ${isDay ? "bg-[#f0a92e]" : "bg-inverse-surface"}`}
                      />
                      <span className="min-w-0">
                        <span className="block truncate font-display text-xs font-bold text-on-surface">
                          {z.region}
                        </span>
                        <span className="block text-[11px] tabular-nums text-on-surface-variant">
                          {r ? r.time : "--:--:--"}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="pb-2 pt-4 font-display text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                {grouped.length === 0 ? "Tiada padanan" : "Dunia sebenar"}
              </p>
              <div className="grid gap-1">
                {grouped.map(([region, zones]) => (
                  <div key={region}>
                    <p className="px-1 pb-1 pt-2 text-[10px] font-bold uppercase tracking-widest text-outline">
                      {region}
                    </p>
                    {zones.map((z) => {
                      const r = now ? readZone(z.tz, now) : null;
                      const isDay = r ? r.hour >= 6 && r.hour < 18 : true;
                      const isLocal = z.tz === localTz;
                      return (
                        <div
                          key={`${z.tz}-${z.city}`}
                          className={`flex items-center justify-between gap-3 rounded-xl px-3 py-1.5 ${
                            isLocal ? "bg-secondary-container/60" : "hover:bg-surface-container"
                          }`}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <span
                              aria-hidden
                              className={`size-1.5 shrink-0 rounded-full ${isDay ? "bg-[#f0a92e]" : "bg-inverse-surface"}`}
                            />
                            <span className="truncate">
                              <span className="font-display text-[13px] font-bold text-on-surface">{z.city}</span>
                              <span className="ml-1.5 text-[11px] text-on-surface-variant">{z.country}</span>
                            </span>
                          </span>
                          <span className="shrink-0 text-[13px] font-semibold tabular-nums text-on-surface">
                            {r ? r.time : "--:--:--"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <p className="pt-3 text-[11px] leading-relaxed text-on-surface-variant">
                Titik kuning = siang (6:00–17:59), titik gelap = malam. Semua masa dikira pada
                peranti anda melalui Intl — tanpa panggilan rangkaian.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
