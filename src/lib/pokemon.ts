import { useEffect, useRef, useState } from "react";

export const TYPE_COLORS = {
  normal: "#919931",
  fire: "#e86422",
  water: "#3d76d8",
  electric: "#e2a619",
  grass: "#4c9f3f",
  ice: "#4ba8b4",
  fighting: "#b93b21",
  poison: "#8f3a97",
  ground: "#ad7a2d",
  flying: "#7c62c4",
  psychic: "#e04373",
  bug: "#8aa52a",
  rock: "#a9932d",
  ghost: "#5863ae",
  dragon: "#4f52c8",
  dark: "#5c4a3e",
  steel: "#668d8e",
  fairy: "#c3588f",
} as const;

export type PokemonType = keyof typeof TYPE_COLORS;
export const POKEMON_TYPES = Object.keys(TYPE_COLORS) as PokemonType[];

export type BasicPokemon = {
  id: number;
  name: string;
  types: PokemonType[] | null;
};

export type StatBlock = {
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
};

export type PokemonDetail = BasicPokemon & {
  height: number;
  weight: number;
  genus: string;
  flavor: string;
  stats: StatBlock;
  abilities: string[];
};

const SPECIES_COUNT = 1025;

export const artworkUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const pixelUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

export const paddedId = (id: number) => "#" + String(id).padStart(4, "0");

export const capital = (name: string) =>
  name.charAt(0).toUpperCase() + name.slice(1);

export const GEN_RANGES: Array<[number, number, string]> = [
  [1, 151, "I Kanto"],
  [152, 251, "II Johto"],
  [252, 386, "III Hoenn"],
  [387, 493, "IV Sinnoh"],
  [494, 649, "V Unova"],
  [650, 721, "VI Kalos"],
  [722, 809, "VII Alola"],
  [810, 905, "VIII Galar"],
  [906, 1025, "IX Paldea"],
];

export const genOf = (id: number) => {
  for (const [lo, hi, label] of GEN_RANGES) if (id >= lo && id <= hi) return label;
  return "I Kanto";
};

const cache = new Map<string, unknown>();

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const hit = cache.get(url);
  if (hit) return hit as T;
  const res = await fetch(url, { signal, cache: "force-cache" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const json = (await res.json()) as T;
  cache.set(url, json);
  return json;
}

const BULK_QUERY = `
query Dex {
  pokemon(where: {id: {_lte: 1025}}, order_by: {id: asc}) {
    id
    name
    pokemontypes(order_by: {slot: asc}) {
      type { name }
    }
  }
}`;

type GraphQLErrorShape = { errors?: unknown };

async function fetchBulkGraphQL(signal: AbortSignal): Promise<BasicPokemon[]> {
  const endpoint = "https://graphql.pokeapi.co/v1beta2";
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: BULK_QUERY }),
    signal,
    cache: "force-cache",
  });
  if (!res.ok) throw new Error("graphql unavailable");
  const json = (await res.json()) as {
    data?: {
      pokemon: Array<{ id: number; name: string; pokemontypes: Array<{ type: { name: string } }> }>;
    };
  } & GraphQLErrorShape;
  if (!json.data) throw new Error("graphql unavailable");
  const rows = json.data.pokemon.map((row) => ({
    id: row.id,
    name: row.name,
    types: row.pokemontypes.map((t) => t.type.name as PokemonType),
  }));
  if (rows.length < SPECIES_COUNT) throw new Error("graphql incomplete");
  return rows;
}

async function fetchBulkRest(signal: AbortSignal): Promise<BasicPokemon[]> {
  const data = await getJson<{ results: Array<{ name: string; url: string }> }>(
    `https://pokeapi.co/api/v2/pokemon?limit=${SPECIES_COUNT}`,
    signal,
  );
  return data.results.map((row, index) => ({
    id: index + 1,
    name: row.name,
    types: null,
  }));
}

export function usePokedex() {
  const [list, setList] = useState<BasicPokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [degraded, setDegraded] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const rows = await fetchBulkGraphQL(controller.signal);
        setList(rows);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        try {
          const rows = await fetchBulkRest(controller.signal);
          setList(rows);
          setDegraded(true);
        } catch (err2) {
          if ((err2 as Error).name === "AbortError") return;
          setLoading(false);
          return;
        }
      }
      setLoading(false);
    })();
    return () => controller.abort();
  }, []);
  return { list, loading, degraded };
}

type NamedEntry = { name: string; url: string };

function mapStats(raw: Array<{ base_stat: number; stat: { name: string } }>): StatBlock {
  const byName = (n: string) => raw.find((s) => s.stat.name === n)?.base_stat ?? 0;
  return {
    hp: byName("hp"),
    attack: byName("attack"),
    defense: byName("defense"),
    spAttack: byName("special-attack"),
    spDefense: byName("special-defense"),
    speed: byName("speed"),
  };
}

export async function fetchPokemonDetail(
  idOrName: number | string,
  signal?: AbortSignal,
): Promise<PokemonDetail> {
  const key = `detail:${idOrName}`;
  if (cache.has(key)) return cache.get(key) as PokemonDetail;
  type RawSpecies = {
    genera: Array<{ genus: string; language: { name: string } }>;
    flavor_text_entries: Array<{ flavor_text: string; language: { name: string } }>;
  };
  const raw = await getJson<{
    id: number;
    name: string;
    height: number;
    weight: number;
    abilities: Array<{ ability: NamedEntry }>;
    types: Array<{ slot: number; type: NamedEntry }>;
    stats: Array<{ base_stat: number; stat: NamedEntry }>;
    species: NamedEntry;
  }>(`https://pokeapi.co/api/v2/pokemon/${idOrName}`, signal);
  const speciesJson = await getJson<RawSpecies>(raw.species.url, signal);
  const genusObj = speciesJson.genera.find((g) => g.language.name === "en");
  const flavorObj = [...speciesJson.flavor_text_entries]
    .reverse()
    .find((f) => f.language.name === "en");
  const detail: PokemonDetail = {
    id: raw.id,
    name: raw.name,
    types: raw.types
      .sort((a, b) => a.slot - b.slot)
      .map((t) => t.type.name as PokemonType),
    height: raw.height,
    weight: raw.weight,
    genus: genusObj ? genusObj.genus.replace(" Pokémon", "") : "Unknown",
    flavor: flavorObj
      ? flavorObj.flavor_text.replace(/[\n\f\u000c]+/g, " ").trim()
      : "",
    stats: mapStats(raw.stats),
    abilities: raw.abilities.map((a) => capital(a.ability.name.replace(/-/g, " "))),
  };
  cache.set(key, detail);
  return detail;
}

export function useInView<T extends HTMLElement>(rootMargin = "600px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          done.current = true;
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, rootMargin]);
  return { ref, inView };
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return progress;
}

export function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.15, 0.5, 1] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [ids.join("|")]);
  return active;
}

export function useCountUp(target: number, run: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration]);
  return value;
}

