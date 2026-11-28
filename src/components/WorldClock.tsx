"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { POKEMON_ZONE_MAP, WORLD_ZONES, localZoneName, readZone } from "../lib/timezones";
import { fetchWeather, type WeatherInfo, type WeatherKind } from "../lib/weather";

const REGION_ORDER = ["Asia", "Eropah", "Afrika", "Amerika", "Oceania", "Lain"];

const STARS: Array<{ x: number; y: number; d: number }> = [
  { x: 12, y: 24, d: 0 },
  { x: 26, y: 50, d: 0.6 },
  { x: 44, y: 18, d: 1.1 },
  { x: 63, y: 42, d: 0.3 },
  { x: 78, y: 26, d: 0.9 },
  { x: 90, y: 54, d: 1.5 },
];

const DROPS: Array<{ x: number; d: number; delay: number }> = [
  { x: 8, d: 0.85, delay: 0 },
  { x: 18, d: 1.05, delay: 0.4 },
  { x: 29, d: 0.75, delay: 0.15 },
  { x: 41, d: 0.95, delay: 0.6 },
  { x: 52, d: 0.8, delay: 0.3 },
  { x: 63, d: 1.1, delay: 0.05 },
  { x: 74, d: 0.9, delay: 0.5 },
  { x: 85, d: 1.0, delay: 0.22 },
  { x: 94, d: 0.8, delay: 0.7 },
  { x: 35, d: 1.15, delay: 0.9 },
  { x: 47, d: 0.95, delay: 1.1 },
  { x: 70, d: 1.2, delay: 0.8 },
];

const FLAKES: Array<{ x: number; d: number; delay: number }> = [
  { x: 10, d: 3.2, delay: 0 },
  { x: 24, d: 4.1, delay: 1.2 },
  { x: 38, d: 3.6, delay: 0.6 },
  { x: 51, d: 4.5, delay: 1.8 },
  { x: 64, d: 3.4, delay: 0.9 },
  { x: 77, d: 4.2, delay: 2.1 },
  { x: 89, d: 3.8, delay: 1.5 },
  { x: 45, d: 4.8, delay: 2.6 },
  { x: 31, d: 3.9, delay: 3.1 },
  { x: 82, d: 4.4, delay: 0.3 },
];

const WET_KINDS: WeatherKind[] = ["rain", "drizzle", "storm"];

function WeatherIcon({ kind }: { kind: WeatherKind }) {
  const common = {
    width: 13,
    height: 13,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (kind) {
    case "clear":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4.4" />
          <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5 5l1.6 1.6M17.4 17.4 19 19M19 5l-1.6 1.6M6.6 17.4 5 19" />
        </svg>
      );
    case "partly":
      return (
        <svg {...common}>
          <circle cx="8.5" cy="8.5" r="3.2" />
          <path d="M8.5 2.6v1.6M2.6 8.5h1.6M4.3 4.3l1.1 1.1M12.7 4.3l-1.1 1.1" />
          <path d="M7 18.5h9.2a3.4 3.4 0 0 0 .5-6.8 4.6 4.6 0 0 0-8.9-1.2A3.7 3.7 0 0 0 7 18.5Z" />
        </svg>
      );
    case "overcast":
      return (
        <svg {...common}>
          <path d="M6.5 18.5h10a3.5 3.5 0 0 0 .6-7 4.8 4.8 0 0 0-9.3-1.2A3.8 3.8 0 0 0 6.5 18.5Z" />
        </svg>
      );
    case "fog":
      return (
        <svg {...common}>
          <path d="M6.5 14.5h10a3.5 3.5 0 0 0 .6-7 4.8 4.8 0 0 0-9.3-1.2A3.8 3.8 0 0 0 6.5 14.5Z" />
          <path d="M5 18h14M7 21h10" />
        </svg>
      );
    case "drizzle":
      return (
        <svg {...common}>
          <path d="M6.5 13.5h10a3.5 3.5 0 0 0 .6-7 4.8 4.8 0 0 0-9.3-1.2A3.8 3.8 0 0 0 6.5 13.5Z" />
          <path d="M9 17v.5M13 17.5v.5M11 20.5v.5" />
        </svg>
      );
    case "rain":
      return (
        <svg {...common}>
          <path d="M6.5 12.5h10a3.5 3.5 0 0 0 .6-7 4.8 4.8 0 0 0-9.3-1.2A3.8 3.8 0 0 0 6.5 12.5Z" />
          <path d="m8.5 15.5-1 4M12.5 15.5l-1 4M16.5 15.5l-1 4" />
        </svg>
      );
    case "snow":
      return (
        <svg {...common}>
          <path d="M6.5 13.5h10a3.5 3.5 0 0 0 .6-7 4.8 4.8 0 0 0-9.3-1.2A3.8 3.8 0 0 0 6.5 13.5Z" />
          <path d="M9 17.5h.01M13 17.5h.01M11 20.5h.01M15 20.5h.01" />
        </svg>
      );
    case "storm":
      return (
        <svg {...common}>
          <path d="M6.5 12.5h10a3.5 3.5 0 0 0 .6-7 4.8 4.8 0 0 0-9.3-1.2A3.8 3.8 0 0 0 6.5 12.5Z" />
          <path d="M13 14.5 10 18h3l-1.5 3.5" />
        </svg>
      );
  }
}

function SunMoon({
  hour,
  minute,
  weather,
}: {
  hour: number;
  minute: number;
  weather: WeatherInfo | null;
}) {
  const kind = weather?.kind ?? null;
  const t = hour + minute / 60;
  const isDay = t >= 6 && t < 18;
  const p = Math.max(0, Math.min(1, isDay ? (t - 6) / 12 : t >= 18 ? (t - 18) / 12 : (t + 6) / 12));
  const x = 7 + 86 * p;
  const y = 78 - Math.sin(p * Math.PI) * 54;
  const wet = kind !== null && WET_KINDS.includes(kind);
  const dim =
    kind === "overcast" || kind === "fog"
      ? 0.4
      : wet
        ? 0.45
        : 1;
  const cloudy = kind === "overcast" || kind === "partly";
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
      {kind === "rain" || kind === "storm" ? (
        <div
          aria-hidden
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ background: "rgba(23, 32, 48, 0.34)", opacity: isDay ? 1 : 0.55 }}
        />
      ) : kind === "drizzle" || cloudy ? (
        <div
          aria-hidden
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ background: "rgba(60, 72, 92, 0.2)", opacity: isDay ? 1 : 0.4 }}
        />
      ) : null}

      {STARS.map((s, i) => (
        <span
          key={i}
          aria-hidden
          className="wc-star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            animationDelay: `${s.d}s`,
            opacity: isDay ? 0 : dim,
            transition: "opacity 1s",
          }}
        />
      ))}
      {!isDay && <span aria-hidden className="wc-shoot" />}

      <span
        aria-hidden
        className="wc-cloud"
        style={{ top: "16%", animationDuration: "46s", opacity: isDay ? 0.9 * dim + 0.1 : 0.25, transition: "opacity 1s" }}
      />
      <span
        aria-hidden
        className="wc-cloud wc-cloud-sm"
        style={{ top: "48%", animationDuration: "64s", animationDelay: "-18s", opacity: isDay ? 0.7 * dim + 0.1 : 0.2, transition: "opacity 1s" }}
      />
      {cloudy &&
        [0, 1].map((i) => (
          <span
            key={i}
            aria-hidden
            className="wc-cloud"
            style={{
              top: i === 0 ? "8%" : "38%",
              animationDuration: i === 0 ? "38s" : "52s",
              animationDelay: `${-6 - i * 9}s`,
              opacity: isDay ? 0.95 : 0.3,
            }}
          />
        ))}

      {kind === "fog" && (
        <>
          <span aria-hidden className="wc-fog" style={{ bottom: "18%", animationDelay: "0s" }} />
          <span aria-hidden className="wc-fog" style={{ bottom: "42%", animationDelay: "-5s" }} />
        </>
      )}

      {wet &&
        DROPS.slice(0, kind === "drizzle" ? 6 : 12).map((d, i) => (
          <span
            key={i}
            aria-hidden
            className="wc-drop"
            style={{ left: `${d.x}%`, animationDuration: `${d.d}s`, animationDelay: `${d.delay}s` }}
          />
        ))}

      {kind === "snow" &&
        FLAKES.map((f, i) => (
          <span
            key={i}
            aria-hidden
            className="wc-flake"
            style={{ left: `${f.x}%`, animationDuration: `${f.d}s`, animationDelay: `${f.delay}s` }}
          />
        ))}

      {kind === "storm" && <span aria-hidden className="wc-bolt" />}

      <span
        aria-hidden
        className="absolute z-10 transition-all duration-1000 ease-linear"
        style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)", opacity: isDay ? dim : 0 }}
      >
        <span className="relative block">
          <span aria-hidden className="wc-sun-halo" />
          <svg width="42" height="42" viewBox="0 0 24 24" aria-hidden>
            <defs>
              <radialGradient id="wc-sun-grad" cx="0.35" cy="0.3" r="1">
                <stop offset="0" stopColor="#fff7d6" />
                <stop offset="0.55" stopColor="#ffc531" />
                <stop offset="1" stopColor="#ff9800" />
              </radialGradient>
            </defs>
            <g className="wc-rays" fill="none" stroke="#ffb703" strokeWidth="1.6" strokeLinecap="round">
              <path d="M12 1.6v3.1M12 19.3v3.1M1.6 12h3.1M19.3 12h3.1M4.4 4.4l2.2 2.2M17.4 17.4l2.2 2.2M19.6 4.4l-2.2 2.2M6.6 17.4l-2.2 2.2" />
            </g>
            <g className="wc-rays-rev" fill="none" stroke="#ffd166" strokeWidth="1.2" strokeLinecap="round">
              <path d="M12 4.4v1.9M12 17.7v1.9M4.4 12h1.9M17.7 12h1.9M6.5 6.5l1.4 1.4M16.1 16.1l1.4 1.4M17.5 6.5l-1.4 1.4M7.9 16.1l-1.4 1.4" />
            </g>
            <circle className="wc-sun-core" cx="12" cy="12" r="4.7" fill="url(#wc-sun-grad)" stroke="#ff9800" strokeWidth="0.9" />
          </svg>
        </span>
      </span>
      <span
        aria-hidden
        className="absolute z-10 transition-all duration-1000 ease-linear"
        style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)", opacity: isDay ? 0 : dim }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden>
          <defs>
            <radialGradient id="wc-moon-grad" cx="0.35" cy="0.3" r="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#d7dff2" />
            </radialGradient>
          </defs>
          <circle cx="12" cy="12" r="10.6" fill="none" stroke="rgba(238, 241, 250, 0.35)" strokeWidth="1" className="wc-moon-halo" />
          <path
            d="M20.4 14.2A8.6 8.6 0 0 1 9.8 3.6a8.6 8.6 0 1 0 10.6 10.6Z"
            fill="url(#wc-moon-grad)"
            stroke="#b9c4dd"
            strokeWidth="0.9"
          />
          <circle cx="15.6" cy="9.3" r="0.9" fill="#c3cde6" opacity="0.8" />
          <circle cx="12.9" cy="12.7" r="0.65" fill="#c3cde6" opacity="0.7" />
          <circle cx="14.8" cy="14.6" r="0.5" fill="#c3cde6" opacity="0.6" />
        </svg>
      </span>

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-3 transition-colors duration-1000"
        style={{ background: isDay ? "#a3c98a" : "#1c2a45" }}
      />

      {weather && (
        <span className="absolute left-2.5 top-2.5 z-20 inline-flex items-center gap-1.5 rounded-full bg-surface-container/95 px-2.5 py-1 font-display text-[10px] font-bold text-on-surface shadow-e1">
          <WeatherIcon kind={weather.kind} />
          {weather.label}
          <span className="tabular-nums text-on-surface-variant">{weather.temp}°C</span>
        </span>
      )}
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
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const weatherAsked = useRef(false);

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
    if (!open || weatherAsked.current) return;
    weatherAsked.current = true;
    let alive = true;
    void fetchWeather().then((w) => {
      if (alive && w) setWeather(w);
    });
    return () => {
      alive = false;
    };
  }, [open]);

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
            Cuaca &amp; langit masa nyata — semua dunia &amp; rantau Pokémon
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

      {local && <SunMoon hour={local.hour} minute={Number(local.time.split(":")[1] ?? 0)} weather={weather} />}

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
          Titik kuning = siang (6:00–17:59), titik gelap = malam. Cuaca masa nyata daripada Open-Meteo
          (percuma, tanpa kunci) mengikut lokasi pelayar anda; kunci lokasi diminta hanya apabila panel
          dibuka dan cuaca dicache 30 minit. Masa dikira pada peranti anda melalui Intl.
        </p>
      </div>
    </div>
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center px-4">
      <div className="pointer-events-auto relative">
        <button
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
