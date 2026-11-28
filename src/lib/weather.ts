"use client";

export type WeatherKind =
  | "clear"
  | "partly"
  | "overcast"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "storm";

export type WeatherInfo = { kind: WeatherKind; label: string; temp: number };

const CACHE_KEY = "md-weather";
const POS_KEY = "md-weather-pos";
const CACHE_MS = 30 * 60 * 1000;

function kindOf(code: number): [WeatherKind, string] {
  if (code === 0) return ["clear", "Cerah"];
  if (code === 1) return ["clear", "Cerah sedikit"];
  if (code === 2) return ["partly", "Berawan sedikit"];
  if (code === 3) return ["overcast", "Mendung"];
  if (code === 45 || code === 48) return ["fog", "Berkabus"];
  if (code >= 51 && code <= 57) return ["drizzle", "Gerimis"];
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return ["rain", "Hujan"];
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return ["snow", "Salji"];
  if (code >= 95) return ["storm", "Ribut petir"];
  return ["partly", "Berawan sedikit"];
}

function getCached(): WeatherInfo | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as WeatherInfo & { ts: number };
    if (!c || typeof c.temp !== "number" || Date.now() - c.ts > CACHE_MS) return null;
    return { kind: c.kind, label: c.label, temp: c.temp };
  } catch {
    return null;
  }
}

function getPosition(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve) => {
    try {
      const raw = localStorage.getItem(POS_KEY);
      if (raw) {
        const p = JSON.parse(raw) as { lat: number; lon: number };
        if (p && typeof p.lat === "number") {
          resolve(p);
          return;
        }
      }
    } catch {
      /* ignore */
    }
    const fallback = { lat: 3.139, lon: 101.6869 };
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve(fallback);
      return;
    }
    const done = (lat: number, lon: number) => {
      const p = { lat, lon };
      try {
        localStorage.setItem(POS_KEY, JSON.stringify(p));
      } catch {
        /* ignore */
      }
      resolve(p);
    };
    const timer = window.setTimeout(() => resolve(fallback), 5000);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        window.clearTimeout(timer);
        done(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        window.clearTimeout(timer);
        resolve(fallback);
      },
      { timeout: 4500, maximumAge: 30 * 60 * 1000 },
    );
  });
}

export async function fetchWeather(): Promise<WeatherInfo | null> {
  const cached = getCached();
  if (cached) return cached;
  try {
    const { lat, lon } = await getPosition();
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { current_weather?: { temperature?: number; weathercode?: number } };
    const cw = data?.current_weather;
    if (!cw || typeof cw.weathercode !== "number") return null;
    const [kind, label] = kindOf(cw.weathercode);
    const info: WeatherInfo = { kind, label, temp: Math.round(cw.temperature ?? 0) };
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ...info, ts: Date.now() }));
    } catch {
      /* ignore */
    }
    return info;
  } catch {
    return null;
  }
}
