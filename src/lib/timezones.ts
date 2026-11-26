export type WorldZone = { city: string; country: string; tz: string; region: string };

export const WORLD_ZONES: WorldZone[] = [
  { city: "Kuala Lumpur", country: "Malaysia", tz: "Asia/Kuala_Lumpur", region: "Asia" },
  { city: "Singapura", country: "Singapura", tz: "Asia/Singapore", region: "Asia" },
  { city: "Jakarta", country: "Indonesia", tz: "Asia/Jakarta", region: "Asia" },
  { city: "Bangkok", country: "Thailand", tz: "Asia/Bangkok", region: "Asia" },
  { city: "Manila", country: "Filipina", tz: "Asia/Manila", region: "Asia" },
  { city: "Hanoi", country: "Vietnam", tz: "Asia/Ho_Chi_Minh", region: "Asia" },
  { city: "Yangon", country: "Myanmar", tz: "Asia/Yangon", region: "Asia" },
  { city: "Dhaka", country: "Bangladesh", tz: "Asia/Dhaka", region: "Asia" },
  { city: "New Delhi", country: "India", tz: "Asia/Kolkata", region: "Asia" },
  { city: "Karachi", country: "Pakistan", tz: "Asia/Karachi", region: "Asia" },
  { city: "Kathmandu", country: "Nepal", tz: "Asia/Kathmandu", region: "Asia" },
  { city: "Colombo", country: "Sri Lanka", tz: "Asia/Colombo", region: "Asia" },
  { city: "Beijing", country: "China", tz: "Asia/Shanghai", region: "Asia" },
  { city: "Hong Kong", country: "China", tz: "Asia/Hong_Kong", region: "Asia" },
  { city: "Taipei", country: "Taiwan", tz: "Asia/Taipei", region: "Asia" },
  { city: "Seoul", country: "Korea Selatan", tz: "Asia/Seoul", region: "Asia" },
  { city: "Tokyo", country: "Jepun", tz: "Asia/Tokyo", region: "Asia" },
  { city: "Ulaanbaatar", country: "Mongolia", tz: "Asia/Ulaanbaatar", region: "Asia" },
  { city: "Tashkent", country: "Uzbekistan", tz: "Asia/Tashkent", region: "Asia" },
  { city: "Almaty", country: "Kazakhstan", tz: "Asia/Almaty", region: "Asia" },
  { city: "Kabul", country: "Afghanistan", tz: "Asia/Kabul", region: "Asia" },
  { city: "Tehran", country: "Iran", tz: "Asia/Tehran", region: "Asia" },
  { city: "Dubai", country: "UEA", tz: "Asia/Dubai", region: "Asia" },
  { city: "Riyadh", country: "Arab Saudi", tz: "Asia/Riyadh", region: "Asia" },
  { city: "Doha", country: "Qatar", tz: "Asia/Qatar", region: "Asia" },
  { city: "Baghdad", country: "Iraq", tz: "Asia/Baghdad", region: "Asia" },
  { city: "Istanbul", country: "Turki", tz: "Europe/Istanbul", region: "Asia" },
  { city: "London", country: "United Kingdom", tz: "Europe/London", region: "Eropah" },
  { city: "Paris", country: "Perancis", tz: "Europe/Paris", region: "Eropah" },
  { city: "Berlin", country: "Jerman", tz: "Europe/Berlin", region: "Eropah" },
  { city: "Madrid", country: "Sepanyol", tz: "Europe/Madrid", region: "Eropah" },
  { city: "Rome", country: "Itali", tz: "Europe/Rome", region: "Eropah" },
  { city: "Amsterdam", country: "Belanda", tz: "Europe/Amsterdam", region: "Eropah" },
  { city: "Brussels", country: "Belgium", tz: "Europe/Brussels", region: "Eropah" },
  { city: "Zurich", country: "Switzerland", tz: "Europe/Zurich", region: "Eropah" },
  { city: "Vienna", country: "Austria", tz: "Europe/Vienna", region: "Eropah" },
  { city: "Stockholm", country: "Sweden", tz: "Europe/Stockholm", region: "Eropah" },
  { city: "Oslo", country: "Norway", tz: "Europe/Oslo", region: "Eropah" },
  { city: "Copenhagen", country: "Denmark", tz: "Europe/Copenhagen", region: "Eropah" },
  { city: "Helsinki", country: "Finland", tz: "Europe/Helsinki", region: "Eropah" },
  { city: "Warsaw", country: "Poland", tz: "Europe/Warsaw", region: "Eropah" },
  { city: "Prague", country: "Czechia", tz: "Europe/Prague", region: "Eropah" },
  { city: "Budapest", country: "Hungary", tz: "Europe/Budapest", region: "Eropah" },
  { city: "Athens", country: "Yunani", tz: "Europe/Athens", region: "Eropah" },
  { city: "Lisbon", country: "Portugal", tz: "Europe/Lisbon", region: "Eropah" },
  { city: "Dublin", country: "Ireland", tz: "Europe/Dublin", region: "Eropah" },
  { city: "Kyiv", country: "Ukraine", tz: "Europe/Kyiv", region: "Eropah" },
  { city: "Bucharest", country: "Romania", tz: "Europe/Bucharest", region: "Eropah" },
  { city: "Moscow", country: "Rusia", tz: "Europe/Moscow", region: "Eropah" },
  { city: "Kaherah", country: "Mesir", tz: "Africa/Cairo", region: "Afrika" },
  { city: "Lagos", country: "Nigeria", tz: "Africa/Lagos", region: "Afrika" },
  { city: "Accra", country: "Ghana", tz: "Africa/Accra", region: "Afrika" },
  { city: "Nairobi", country: "Kenya", tz: "Africa/Nairobi", region: "Afrika" },
  { city: "Addis Ababa", country: "Ethiopia", tz: "Africa/Addis_Ababa", region: "Afrika" },
  { city: "Johannesburg", country: "Afrika Selatan", tz: "Africa/Johannesburg", region: "Afrika" },
  { city: "Casablanca", country: "Maghribi", tz: "Africa/Casablanca", region: "Afrika" },
  { city: "Algiers", country: "Algeria", tz: "Africa/Algiers", region: "Afrika" },
  { city: "Dar es Salaam", country: "Tanzania", tz: "Africa/Dar_es_Salaam", region: "Afrika" },
  { city: "New York", country: "Amerika Syarikat", tz: "America/New_York", region: "Amerika" },
  { city: "Chicago", country: "Amerika Syarikat", tz: "America/Chicago", region: "Amerika" },
  { city: "Denver", country: "Amerika Syarikat", tz: "America/Denver", region: "Amerika" },
  { city: "Los Angeles", country: "Amerika Syarikat", tz: "America/Los_Angeles", region: "Amerika" },
  { city: "Toronto", country: "Kanada", tz: "America/Toronto", region: "Amerika" },
  { city: "Vancouver", country: "Kanada", tz: "America/Vancouver", region: "Amerika" },
  { city: "Mexico City", country: "Mexico", tz: "America/Mexico_City", region: "Amerika" },
  { city: "Havana", country: "Cuba", tz: "America/Havana", region: "Amerika" },
  { city: "Panama City", country: "Panama", tz: "America/Panama", region: "Amerika" },
  { city: "Bogota", country: "Colombia", tz: "America/Bogota", region: "Amerika" },
  { city: "Caracas", country: "Venezuela", tz: "America/Caracas", region: "Amerika" },
  { city: "Lima", country: "Peru", tz: "America/Lima", region: "Amerika" },
  { city: "La Paz", country: "Bolivia", tz: "America/La_Paz", region: "Amerika" },
  { city: "Santiago", country: "Chile", tz: "America/Santiago", region: "Amerika" },
  { city: "Buenos Aires", country: "Argentina", tz: "America/Argentina/Buenos_Aires", region: "Amerika" },
  { city: "Montevideo", country: "Uruguay", tz: "America/Montevideo", region: "Amerika" },
  { city: "Sao Paulo", country: "Brazil", tz: "America/Sao_Paulo", region: "Amerika" },
  { city: "Manaus", country: "Brazil", tz: "America/Manaus", region: "Amerika" },
  { city: "Sydney", country: "Australia", tz: "Australia/Sydney", region: "Oceania" },
  { city: "Melbourne", country: "Australia", tz: "Australia/Melbourne", region: "Oceania" },
  { city: "Brisbane", country: "Australia", tz: "Australia/Brisbane", region: "Oceania" },
  { city: "Perth", country: "Australia", tz: "Australia/Perth", region: "Oceania" },
  { city: "Auckland", country: "New Zealand", tz: "Pacific/Auckland", region: "Oceania" },
  { city: "Suva", country: "Fiji", tz: "Pacific/Fiji", region: "Oceania" },
  { city: "Port Moresby", country: "Papua New Guinea", tz: "Pacific/Port_Moresby", region: "Oceania" },
  { city: "Honolulu", country: "Hawaii, AS", tz: "Pacific/Honolulu", region: "Oceania" },
  { city: "UTC", country: "Waktu Semesta", tz: "UTC", region: "Lain" },
];

export const POKEMON_ZONE_MAP: Array<{ region: string; tz: string; idol: string }> = [
  { region: "Kanto", tz: "Asia/Tokyo", idol: "Jepun" },
  { region: "Johto", tz: "Asia/Tokyo", idol: "Jepun" },
  { region: "Hoenn", tz: "Asia/Tokyo", idol: "Jepun" },
  { region: "Sinnoh", tz: "Asia/Tokyo", idol: "Jepun" },
  { region: "Unova", tz: "America/New_York", idol: "New York" },
  { region: "Kalos", tz: "Europe/Paris", idol: "Perancis" },
  { region: "Alola", tz: "Pacific/Honolulu", idol: "Hawaii" },
  { region: "Galar", tz: "Europe/London", idol: "UK" },
  { region: "Paldea", tz: "Europe/Madrid", idol: "Sepanyol" },
];

const fmtCache = new Map<string, Intl.DateTimeFormat>();

function fmtFor(tz: string) {
  let f = fmtCache.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
    fmtCache.set(tz, f);
  }
  return f;
}

export function readZone(tz: string, d: Date): { time: string; hour: number } {
  try {
    const parts = fmtFor(tz).formatToParts(d);
    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
    return { time: `${get("hour")}:${get("minute")}:${get("second")}`, hour: Number(get("hour")) };
  } catch {
    return { time: "--:--:--", hour: 12 };
  }
}

export function localZoneName(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}
