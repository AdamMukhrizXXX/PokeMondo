"use client";

import { useEffect, useState } from "react";

const ZONES: Array<{ region: string; country: string; tz: string }> = [
  { region: "Kanto", country: "Jepun", tz: "Asia/Tokyo" },
  { region: "Johto", country: "Jepun", tz: "Asia/Tokyo" },
  { region: "Hoenn", country: "Jepun", tz: "Asia/Tokyo" },
  { region: "Sinnoh", country: "Jepun", tz: "Asia/Tokyo" },
  { region: "Unova", country: "New York", tz: "America/New_York" },
  { region: "Kalos", country: "Perancis", tz: "Europe/Paris" },
  { region: "Alola", country: "Hawaii", tz: "Pacific/Honolulu" },
  { region: "Galar", country: "UK", tz: "Europe/London" },
  { region: "Paldea", country: "Sepanyol", tz: "Europe/Madrid" },
];

type ZoneReading = { time: string; hour: number };

function readZone(tz: string, d: Date): ZoneReading {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const parts = fmt.formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return {
    time: `${get("hour")}:${get("minute")}:${get("second")}`,
    hour: Number(get("hour")),
  };
}

export default function WorldClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div>
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="size-2 rounded-full bg-primary motion-safe:animate-pulse"
        />
        <p className="font-display text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
          Jam Dunia — masa nyata setiap kawasan
        </p>
      </div>
      <div
        className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5"
        style={{ contain: "layout style" }}
      >
        {ZONES.map((z) => {
          const r = now ? readZone(z.tz, now) : null;
          const isDay = r ? r.hour >= 6 && r.hour < 18 : true;
          return (
            <div
              key={z.region}
              className="flex items-center justify-between gap-2 rounded-2xl bg-surface-container px-4 py-3"
            >
              <span>
                <span className="block font-display text-sm font-bold text-on-surface">
                  {z.region}
                </span>
                <span className="block text-[10px] text-on-surface-variant">{z.country}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  title={isDay ? "Siang di sana" : "Malam di sana"}
                  className={`size-2 rounded-full ${isDay ? "bg-[#f0a92e]" : "bg-inverse-surface"}`}
                />
                <span className="font-mono text-xs font-semibold tabular-nums text-on-surface-variant">
                  {r ? r.time : "--:--:--"}
                </span>
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-2.5 text-[10px] leading-snug text-on-surface-variant/80">
        Setiap kawasan Pokémon mengikut zon masa dunia sebenar — Kanto ke Sinnoh mengikut Jepun,
        Unova mengikut New York, Kalos mengikut Perancis, Alola mengikut Hawaii, Galar mengikut
        United Kingdom, Paldea mengikut Sepanyol.
      </p>
    </div>
  );
}
