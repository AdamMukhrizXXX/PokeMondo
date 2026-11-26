"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RevealWords } from "./Reveal";
import {
  GEN_RANGES,
  POKEMON_TYPES,
  TYPE_COLORS,
  capital,
  type BasicPokemon,
  type PokemonType,
} from "../lib/pokemon";
import PokeCard from "../components/PokeCard";
import { useRipple } from "../components/Ripple";

type GenFilter = "all" | (typeof GEN_RANGES)[number][2];

export default function Pokedex({
  list,
  loading,
  degraded,
  query,
  onQueryChange,
  onOpen,
}: {
  list: BasicPokemon[];
  loading: boolean;
  degraded: boolean;
  query: string;
  onQueryChange: (q: string) => void;
  onOpen: (p: BasicPokemon) => void;
}) {
  const [type, setType] = useState<PokemonType | "all">("all");
  const [gen, setGen] = useState<GenFilter>("all");
  const [desc, setDesc] = useState(false);
  const [window_, setWindow] = useState(120);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const ripple = useRipple();

  useEffect(() => {
    setWindow(120);
  }, [query, type, gen, desc]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^#/, "");
    let rows = list.filter((p) => {
      if (q && !(p.name.includes(q) || String(p.id).includes(q) || "#" + String(p.id).padStart(4, "0").includes(q)))
        return false;
      if (type !== "all" && !(p.types ?? []).includes(type)) return false;
      if (gen !== "all") {
        const range = GEN_RANGES.find((g) => g[2] === gen)!;
        if (p.id < range[0] || p.id > range[1]) return false;
      }
      return true;
    });
    if (desc) rows = [...rows].reverse();
    return rows;
  }, [list, query, type, gen, desc]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || window_ >= filtered.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setWindow((w) => Math.min(filtered.length, w + 120));
        }
      },
      { rootMargin: "1400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [filtered.length, window_, loading]);

    const genLabels = GEN_RANGES.map((g) => g[2]);

  return (
    <section id="dex" className="relative px-5 pb-28 pt-10 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-primary">
              <RevealWords text="Koleksi penuh" />
            </p>
            <h2 className="mt-1 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              <RevealWords text="Pokédex Lengkap" />
            </h2>
          </div>
          <button
            type="button"
            onClick={(e) => {
              ripple(e);
              setDesc((d) => !d);
            }}
            className="flex h-11 items-center gap-2 overflow-hidden rounded-full border border-outline-variant px-5 font-display text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              style={{ transform: desc ? "rotate(180deg)" : undefined, transition: "transform .3s" }}
            >
              <path d="M12 19V5m-6 6 6-6 6 6" />
            </svg>
            {desc ? "Terbaharu dahulu" : "Tertua dahulu"}
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-full border border-outline-variant bg-surface-container-low px-5 shadow-e1 focus-within:shadow-e2" style={{ height: "3.25rem" }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="shrink-0 text-on-surface-variant"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" />
          </svg>
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Tapis Pokédex… cth. mew, 25…"
            aria-label="Tapis Pokédex"
            className="h-full w-full bg-transparent text-base outline-none placeholder:text-on-surface-variant/70"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              aria-label="Kosongkan carian"
              className="grid size-8 shrink-0 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container-highest"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          )}
        </div>

        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
          <Chip active={type === "all"} onClick={() => setType("all")}>
            Semua jenis
          </Chip>
          {POKEMON_TYPES.map((t) => (
            <Chip
              key={t}
              active={type === t}
              onClick={() => setType(type === t ? "all" : t)}
              color={TYPE_COLORS[t]}
            >
              {capital(t)}
            </Chip>
          ))}
        </div>

        <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
          <Chip active={gen === "all"} onClick={() => setGen("all")}>
            Semua generasi
          </Chip>
          {genLabels.map((lb) => (
            <Chip key={lb} active={gen === lb} onClick={() => setGen(gen === lb ? "all" : lb)}>
              {lb}
            </Chip>
          ))}
        </div>

        <p className="mt-5 font-display text-sm font-semibold text-on-surface-variant" aria-live="polite">
          {loading ? "Memuatkan Pokédex…" : `Memaparkan ${filtered.length} daripada ${list.length} Pokémon`}
          {degraded ? " · mod ringan: jenis dimuat semasa tatal" : ""}
        </p>

        {loading ? (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 15 }, (_, i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-3xl bg-surface-container"
                style={{ animationDelay: `${i * 0.05}s` }}
              />
            ))}
          </div>
        ) : (
          <>
            <div
              className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              style={{ contain: "layout style" }}
              onMouseMove={spotlight}
            >
              {filtered.slice(0, window_).map((p, i) => (
                <PokeCard key={p.id} p={p} index={i} onOpen={onOpen} />
              ))}
            </div>
            {window_ < filtered.length && <div ref={sentinelRef} aria-hidden className="h-2" />}
          </>
        )}

        {!loading && filtered.length === 0 && (
          <div className="mt-6 rounded-3xl border border-dashed border-outline-variant p-12 text-center">
            <p className="font-display text-xl font-bold">Tiada Pokémon dijumpai</p>
            <p className="mt-1 text-on-surface-variant">Cuba kata kunci atau penapis lain.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function spotlight(e: React.MouseEvent<HTMLDivElement>) {
  const card = (e.target as HTMLElement).closest<HTMLElement>("[data-spot]");
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
  card.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
}

function Chip({
  active,
  color,
  onClick,
  children,
}: {
  active: boolean;
  color?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 font-display text-[13px] font-bold transition-all active:scale-95"
      style={
        active
          ? color
            ? { background: color, borderColor: color, color: "#fff" }
            : { background: "var(--md-secondary-container)", borderColor: "transparent", color: "var(--md-on-secondary-container)" }
          : { background: "var(--md-surface-container-low)", borderColor: "var(--md-outline-variant)", color: "var(--md-on-surface-variant)" }
      }
    >
      <span
        aria-hidden
        className="hidden size-2 rounded-full sm:block"
        style={{ background: active ? "#fff" : color ?? "var(--md-outline)" }}
      />
      {children}
    </button>
  );
}
