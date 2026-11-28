"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { POKEMON_ZONE_MAP, WORLD_ZONES, localZoneName, readZone } from "../lib/timezones";

const REGION_ORDER = ["Asia", "Eropah", "Afrika", "Amerika", "Oceania", "Lain"];

const STARS: Array<{ x: number; y: number; d: number }> = [
  { x: 12, y: 24, d: 0 },
  { x: 26, y: 50, d: 0.6 },
  { x: 44, y: 18, d: 1.1 },
  { x: 63, y: 42, d: 0.3 },
  { x: 78, y: 26, d: 0.9 },
  { x: 90, y: 54, d: 1.5 },
];

function SunMoon({ hour, minute }: { hour: number; minute: number }) {
  const t = hour + minute / 60;
  const isDay = t >= 6 && t < 18;
  const p = Math.max(0, Math.min(1, isDay ? (t - 6) / 12 : t >= 18 ? (t - 18) / 12 : (t + 6) / 12));
  const x = 7 + 86 * p;
  const y = 78 - Math.sin(p * Math.PI) * 54;
  return (
    <div className="relative mx-5 mb-3 h-28 shrink-0 overflow-hidden rounded-2xl border border-outline-variant/60">
      <div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: "linear-gradient(180deg, #8ecff5 0%, #cfeefd 52%, #fde9c8 100%)",
          opacity: isDay ? 1 : 0,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: "linear-gradient(180deg, #0a1630 0%, #152447 58%, #26355c 100%)",
          opacity: isDay ? 0 : 1,
        }}
      />
      {STARS.map((s, i) => (
        <span
          key={i}
          aria-hidden
          className="wc-star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            animationDelay: `${s.d}s`,
            opacity: isDay ? 0 : 1,
            transition: "opacity 1s",
          }}
        />
      ))}
      <span
        aria-hidden
        className="wc-cloud"
        style={{ top: "16%", animationDuration: "46s", opacity: isDay ? 0.9 : 0, transition: "opacity 1s" }}
      />
      <span
        aria-hidden
        className="wc-cloud wc-cloud-sm"
        style={{ top: "48%", animationDuration: "64s", animationDelay: "-18s", opacity: isDay ? 0.7 : 0, transition: "opacity 1s" }}
      />
      <span
        aria-hidden
        className="absolute z-10 transition-all duration-1000 ease-linear"
        style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)", opacity: isDay ? 1 : 0 }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden>
          <g className="wc-rays" fill="none" stroke="#ffc531" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 2.2v2.9M12 18.9v2.9M2.2 12h2.9M18.9 12h2.9M5.1 5.1l2 2M16.9 16.9l2 2M18.9 5.1l-2 2M7.1 16.9l-2 2" />
          </g>
          <circle cx="12" cy="12" r="4.4" fill="#ffc531" stroke="#ff9800" strokeWidth="1.3" />
        </svg>
      </span>
      <span
        aria-hidden
        className="absolute z-10 transition-all duration-1000 ease-linear"
        style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)", opacity: isDay ? 0 : 1 }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
          <path
            d="M20.4 14.2A8.6 8.6 0 0 1 9.8 3.6a8.6 8.6 0 1 0 10.6 10.6Z"
            fill="#eef1fa"
            stroke="#c3cde6"
            strokeWidth="1"
          />
          <circle cx="15.5" cy="9.5" r="0.9" fill="#c3cde6" />
          <circle cx="12.8" cy="12.8" r="0.7" fill="#c3cde6" />
        </svg>
      </span>
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-3 transition-colors duration-1000"
        style={{ background: isDay ? "#a3c98a" : "#1c2a45" }}
      />
      <span
        className={`absolute right-2.5 top-2.5 z-20 rounded-full px-2.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-widest ${
          isDay ? "bg-[#ffc531] text-[#1a1a1a]" : "bg-inverse-surface text-inverse-on-surface"
        }`}
      >
        {isDay ? "Siang" : "Malam"}
      </span>
    </div>
  );
}

export default function WorldClock() {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const [listNow, setListNow] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setNow(new Date());
    setListNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    const idList = window.setInterval(() => setListNow(new Date()), 15000);
    return () => {
      window.clearInterval(id);
      window.clearInterval(idList);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      if (el.closest("[data-portal-panel]") || el.closest("[data-wc-trigger]")) return;
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
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

  const panel = !mounted ? null : (
    <div
      data-portal-panel
      className="anim-rise fixed left-1/2 top-[4.75rem] z-[60] w-[min(30rem,calc(100vw-1rem))] -translate-x-1/2 overflow-hidden rounded-[1.75rem] border border-outline-variant shadow-e3"
      style={{ background: "var(--md-surface-container-low)" }}
      role="dialog"
      aria-label="Jam Dunia"
    >
      <div className="flex items-center justify-between gap-2 px-5 pb-2 pt-4">
        <div>
          <p className="font-display text-sm font-extrabold tracking-tight text-on-surface">
            Jam Dunia
          </p>
          <p className="text-[11px] text-on-surface-variant">
            Matahari &amp; bulan bergerak ikut masa anda — semua dunia &amp; rantau Pokémon
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

      {local && <SunMoon hour={local.hour} minute={Number(local.time.split(":")[1] ?? 0)} />}

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

      <div className="max-h-[calc(72svh-15rem)] overflow-y-auto px-5 pb-5" style={{ contain: "layout style" }}>
        <p className="pb-2 font-display text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
          Rantau Pokémon
        </p>
        <div className="grid grid-cols-3 gap-2">
          {POKEMON_ZONE_MAP.map((z) => {
            const r = listNow ? readZone(z.tz, listNow) : null;
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
                    {r ? r.time.slice(0, 5) : "--:--"}
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
                const r = listNow ? readZone(z.tz, listNow) : null;
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
                      {r ? r.time.slice(0, 5) : "--:--"}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <p className="pt-3 text-[11px] leading-relaxed text-on-surface-variant">
          Titik kuning = siang (6:00–17:59), titik gelap = malam. Matahari melintasi langit 6:00–18:00,
          bulan mengambil alih pada waktu malam. Semua masa dikira pada peranti anda melalui Intl —
          tanpa panggilan rangkaian.
        </p>
      </div>
    </div>
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center px-4">
      <div className="pointer-events-auto relative">
        <button
          ref={triggerRef}
          type="button"
          data-wc-trigger
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label="Jam Dunia — buka masa semua dunia dan negara"
          className="flex h-11 items-center gap-2.5 rounded-full border border-outline-variant bg-surface-container-low px-4 shadow-e2 transition-transform active:scale-95"
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

        {open && panel}
      </div>
    </div>
  );
}
