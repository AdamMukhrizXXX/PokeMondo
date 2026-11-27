"use client";

import { useMemo, useState } from "react";
import { simplify, pixelUrl, paddedId, type BasicPokemon, type PokemonType, TYPE_COLORS, POKEMON_TYPES, capital } from "../lib/pokemon";
import DetailModal from "./DetailModal";
import { setUiMode } from "../lib/ui-mode";

const PAGE = 60;

export default function SimpleHome({
  list,
  loading,
  degraded,
}: {
  list: BasicPokemon[];
  loading: boolean;
  degraded: boolean;
}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = simplify(query);
    return list.filter((p) => {
      const byName = !q || simplify(p.name).includes(q) || String(p.id) === q;
      const byType = type === "all" || (p.types ?? []).includes(type as PokemonType);
      return byName && byType;
    });
  }, [list, query, type]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const pageSafe = Math.min(page, pages - 1);
  const shown = filtered.slice(pageSafe * PAGE, pageSafe * PAGE + PAGE);
  const selected = selectedId !== null ? list.find((p) => p.id === selectedId) ?? null : null;

  const goPage = (p: number) => {
    setPage(Math.min(Math.max(0, p), pages - 1));
    window.scrollTo({ top: 0 });
  };

  return (
    <main className="min-h-svh px-4 pb-16 pt-6 sm:px-8">
      <header className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-2xl font-extrabold text-on-surface">
            PokéMondo — SPUI (Simple Pokedex UI)
          </h1>
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-3 py-1 font-display text-xs font-bold"
              style={{
                background: "color-mix(in srgb, var(--md-tertiary-container) 70%, transparent)",
                color: "var(--md-on-surface-variant)",
              }}
            >
              Mod ringkas stabil
            </span>
            <button
              type="button"
              onClick={() => setUiMode("full")}
              data-sfx="toggle-off"
              className="h-8 rounded-full px-4 font-display text-xs font-bold shadow-e1 transition-transform active:scale-95"
              style={{ background: "var(--md-primary)", color: "var(--md-on-primary)" }}
            >
              Keluar SPUI
            </button>
          </div>
        </div>
        <p className="mt-1 text-sm text-on-surface-variant">
          Versi ringkas tanpa animasi — dipakai apabila UI utama bermasalah. Semua 1,025 Pokémon
          kekal boleh dicari dan dibuka.
        </p>
      </header>

      <section className="mx-auto mt-6 max-w-5xl">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Cari Pokémon… cth. pikachu, 25"
            aria-label="Cari Pokémon"
            className="h-11 min-w-52 flex-1 rounded-full border border-outline-variant bg-surface-container-low px-5 text-base outline-none"
          />
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(0);
            }}
            aria-label="Tapis jenis"
            className="h-11 rounded-full border border-outline-variant bg-surface-container-low px-4 font-display text-sm font-bold text-on-surface outline-none"
          >
            <option value="all">Semua jenis</option>
            {POKEMON_TYPES.map((t) => (
              <option key={t} value={t}>
                {capital(t)}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-3 text-sm font-semibold text-on-surface-variant" aria-live="polite">
          {loading
            ? "Memuatkan Pokémon…"
            : filtered.length === 0
              ? "Tiada Pokémon ditemui"
              : `Memaparkan ${pageSafe * PAGE + 1}–${Math.min((pageSafe + 1) * PAGE, filtered.length)} daripada ${filtered.length}${degraded ? " · mod ringan" : ""}`}
        </p>

        {!loading && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {shown.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedId(p.id)}
                className="rounded-2xl border border-outline-variant bg-surface-container-low p-3 text-center transition-transform active:scale-95"
              >
                <img
                  src={pixelUrl(p.id)}
                  alt={p.name.replace(/-/g, " ")}
                  loading="lazy"
                  decoding="async"
                  width={96}
                  height={96}
                  className="mx-auto size-24 object-contain"
                />
                <span className="mt-1 block font-mono text-[11px] text-on-surface-variant">
                  {paddedId(p.id)}
                </span>
                <span className="block truncate font-display text-sm font-bold text-on-surface">
                  {p.name.replace(/-/g, " ")}
                </span>
                {p.types && p.types.length > 0 && (
                  <span
                    className="mx-auto mt-1 block h-1.5 w-8 rounded-full"
                    style={{ background: TYPE_COLORS[p.types[0]] }}
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {pages > 1 && (
          <nav className="mt-6 flex items-center justify-center gap-3" aria-label="Halaman Pokédex">
            <button
              type="button"
              onClick={() => goPage(pageSafe - 1)}
              disabled={pageSafe <= 0}
              className="h-10 rounded-full border border-outline-variant px-5 font-display text-sm font-bold text-on-surface-variant disabled:opacity-40"
            >
              Sebelum
            </button>
            <span className="font-display text-sm font-bold tabular-nums text-on-surface">
              {pageSafe + 1} / {pages}
            </span>
            <button
              type="button"
              onClick={() => goPage(pageSafe + 1)}
              disabled={pageSafe >= pages - 1}
              className="h-10 rounded-full border border-outline-variant px-5 font-display text-sm font-bold text-on-surface-variant disabled:opacity-40"
            >
              Seterusnya
            </button>
          </nav>
        )}
      </section>

      {selected && (
        <DetailModal
          pokemon={selected}
          onClose={() => setSelectedId(null)}
          onNavigate={(id) => setSelectedId(id)}
        />
      )}
    </main>
  );
}
