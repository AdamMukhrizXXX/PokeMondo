"use client";

import { useMemo, useState } from "react";
import { simplify, pixelUrl, paddedId, type BasicPokemon, type PokemonType, TYPE_COLORS, POKEMON_TYPES, capital } from "../lib/pokemon";
import { SPUI_PERF_LEVELS, useSpuiPerf } from "../lib/spui-perf";
import DetailModal from "./DetailModal";
import SpuiExitConfirm from "./SpuiExitConfirm";
import SpuiRandom from "./SpuiRandom";
import SpuiSettings from "./SpuiSettings";

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
  const [confirmExit, setConfirmExit] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const perf = useSpuiPerf();

  const level = SPUI_PERF_LEVELS.find((l) => l.id === perf) ?? SPUI_PERF_LEVELS[2];
  const PAGE = level.page;

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
  const hasFilters = query !== "" || type !== "all";

  const goPage = (p: number) => {
    setPage(Math.min(Math.max(0, p), pages - 1));
    window.scrollTo({ top: 0 });
  };

  return (
    <main className="min-h-svh px-4 pb-16 pt-6 sm:px-8">
      <header className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-container text-on-primary-container"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                <path d="M3 12h6M15 12h6" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="1.1" fill="currentColor" />
              </svg>
            </span>
            <div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-on-surface">
                PokéMondo — SPUI
              </h1>
              <p className="text-sm text-on-surface-variant">Simple Pokedex UI</p>
            </div>
          </div>
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
              onClick={() => setSettingsOpen(true)}
              data-sfx="toggle-on"
              aria-haspopup="dialog"
              className="flex h-8 items-center gap-1.5 rounded-full border border-outline-variant bg-surface-container-low px-3.5 font-display text-xs font-bold text-on-surface transition-colors hover:bg-surface-container"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
              </svg>
              Tetapan
            </button>
            <button
              type="button"
              onClick={() => setConfirmExit(true)}
              data-sfx="toggle-off"
              className="h-8 rounded-full px-4 font-display text-xs font-bold shadow-e1 transition-transform active:scale-95"
              style={{ background: "var(--md-primary)", color: "var(--md-on-primary)" }}
            >
              Keluar SPUI
            </button>
          </div>
        </div>
        <p className="mt-2 text-sm text-on-surface-variant">
          Versi ringkas tanpa animasi — dipakai apabila UI utama bermasalah. Semua 1,025 Pokémon
          kekal boleh dicari, ditapis dan dibuka.
        </p>
      </header>

      <section className="mx-auto mt-6 max-w-6xl" aria-label="Cari dan tapis">
        <div className="flex flex-wrap items-center gap-2 rounded-[1.5rem] border border-outline-variant bg-surface-container-low p-3">
          <div className="relative min-w-52 flex-1">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
              placeholder="Cari Pokémon… cth. pikachu, 25"
              aria-label="Cari Pokémon"
              className="h-11 w-full rounded-full border border-outline-variant bg-surface-container px-5 pr-10 text-base outline-none focus:border-primary"
            />
            {query !== "" && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setPage(0);
                }}
                aria-label="Kosongkan carian"
                data-sfx="close"
                className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-surface-container-high text-on-surface-variant transition-colors hover:bg-surface-container-highest"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            )}
          </div>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(0);
            }}
            aria-label="Tapis jenis"
            className="h-11 rounded-full border border-outline-variant bg-surface-container px-4 font-display text-sm font-bold text-on-surface outline-none focus:border-primary"
          >
            <option value="all">Semua jenis</option>
            {POKEMON_TYPES.map((t) => (
              <option key={t} value={t}>
                {capital(t)}
              </option>
            ))}
          </select>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setType("all");
                setPage(0);
              }}
              data-sfx="close"
              className="h-11 rounded-full px-4 font-display text-sm font-bold text-primary transition-colors hover:bg-surface-container"
            >
              Set semula
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-on-surface-variant" aria-live="polite">
            {loading
              ? "Memuatkan Pokémon…"
              : filtered.length === 0
                ? "Tiada Pokémon ditemui"
                : `${pageSafe * PAGE + 1}–${Math.min((pageSafe + 1) * PAGE, filtered.length)} daripada ${filtered.length} Pokémon`}
          </p>
          <span className="rounded-full bg-surface-container px-2.5 py-0.5 font-display text-[11px] font-bold text-on-surface-variant">
            Prestasi: {level.label}
          </span>
          {degraded && (
            <span className="rounded-full bg-surface-container px-2.5 py-0.5 font-display text-[11px] font-bold text-on-surface-variant">
              mod ringan
            </span>
          )}
        </div>
      </section>

      {!loading && list.length > 0 && (
        <div className="mx-auto max-w-6xl">
          <SpuiRandom list={list} onOpen={setSelectedId} />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="mx-auto mt-6 max-w-6xl rounded-[1.5rem] border border-outline-variant bg-surface-container-low p-8 text-center">
          <p className="font-display text-base font-extrabold text-on-surface">
            Tiada Pokémon ditemui
          </p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Cuba nama lain, nombor Pokédex, atau set semula penapis.
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="mx-auto mt-6 max-w-6xl">
          <div className={level.cols + " grid gap-3"}>
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
                  loading={level.eager ? "eager" : "lazy"}
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
        </div>
      )}

      {pages > 1 && (
        <nav className="mt-6 flex flex-wrap items-center justify-center gap-2" aria-label="Halaman Pokédex">
          <button
            type="button"
            onClick={() => goPage(0)}
            disabled={pageSafe <= 0}
            aria-label="Halaman pertama"
            className="h-10 rounded-full border border-outline-variant px-3 font-display text-sm font-bold text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-40"
          >
            «
          </button>
          <button
            type="button"
            onClick={() => goPage(pageSafe - 1)}
            disabled={pageSafe <= 0}
            className="h-10 rounded-full border border-outline-variant px-5 font-display text-sm font-bold text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-40"
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
            className="h-10 rounded-full border border-outline-variant px-5 font-display text-sm font-bold text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-40"
          >
            Seterusnya
          </button>
          <button
            type="button"
            onClick={() => goPage(pages - 1)}
            disabled={pageSafe >= pages - 1}
            aria-label="Halaman terakhir"
            className="h-10 rounded-full border border-outline-variant px-3 font-display text-sm font-bold text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-40"
          >
            »
          </button>
        </nav>
      )}

      {selected && (
        <DetailModal
          pokemon={selected}
          onClose={() => setSelectedId(null)}
          onNavigate={(id) => setSelectedId(id)}
        />
      )}

      <SpuiSettings
        open={settingsOpen}
        perf={perf}
        onClose={() => setSettingsOpen(false)}
      />

      {confirmExit && <SpuiExitConfirm onClose={() => setConfirmExit(false)} />}
    </main>
  );
}
