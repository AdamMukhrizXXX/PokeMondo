"use client";

import { useEffect, useMemo, useState } from "react";
import {
  TYPE_COLORS,
  capital,
  fetchPokemonDetail,
  paddedId,
  artworkUrl,
  type BasicPokemon,
  type PokemonDetail,
  type PokemonType,
} from "../lib/pokemon";
import { useRipple } from "../components/Ripple";
import { CryBars } from "./SoundToggle";
import { isSoundEnabled, playCry, playUiSfx, stopCry, useCryState } from "../lib/sound";

const STAT_ROWS: Array<{ key: keyof PokemonDetail["stats"]; label: string; max: number }> = [
  { key: "hp", label: "HP", max: 255 },
  { key: "attack", label: "Serangan", max: 190 },
  { key: "defense", label: "Pertahanan", max: 250 },
  { key: "spAttack", label: "Sp. Serangan", max: 194 },
  { key: "spDefense", label: "Sp. Pertahanan", max: 250 },
  { key: "speed", label: "Kelajuan", max: 200 },
];

function kg(n: number) {
  return (n / 10).toFixed(1).replace(".", ",");
}

export default function DetailModal({
  pokemon,
  onClose,
  onNavigate,
}: {
  pokemon: BasicPokemon;
  onClose: () => void;
  onNavigate: (id: number) => void;
}) {
  const [detail, setDetail] = useState<PokemonDetail | null>(null);
  const [error, setError] = useState(false);
  const { playingId } = useCryState();
  const ripple = useRipple();
  const accent = detail?.types?.[0]
    ? TYPE_COLORS[detail.types[0] as PokemonType]
    : "var(--md-primary)";
  const total = detail
    ? Object.values(detail.stats).reduce((a, b) => a + b, 0)
    : 0;

  useEffect(() => {
    const t = setTimeout(() => {
      if (isSoundEnabled()) void playCry(pokemon.id, 0.4);
    }, 420);
    return () => clearTimeout(t);
  }, [pokemon.id]);

  useEffect(() => {
    playUiSfx("open");
    return () => stopCry();
  }, []);

  useEffect(() => {
    setDetail(null);
    setError(false);
    const controller = new AbortController();
    fetchPokemonDetail(pokemon.id, controller.signal)
      .then(setDetail)
      .catch((e) => {
        if ((e as Error).name !== "AbortError") setError(true);
      });
    return () => controller.abort();
  }, [pokemon.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        playUiSfx("close");
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const prevId = pokemon.id > 1 ? pokemon.id - 1 : null;
  const nextId = pokemon.id < 1025 ? pokemon.id + 1 : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={pokemon.name}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/45 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="anim-rise relative max-h-[92svh] w-full max-w-xl overflow-y-auto rounded-t-[2rem] shadow-e3 sm:rounded-[2rem]"
        style={{ background: "var(--md-surface-container-low)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <header
          className="relative px-6 pb-10 pt-6 text-white sm:px-8"
          style={{ background: `linear-gradient(160deg, ${accent}ee, ${accent}99)` }}
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-sm font-bold tracking-widest opacity-90">
              {paddedId(pokemon.id)}
            </span>
            <button
              type="button"
              onClick={onClose}
              data-sfx="close"
              aria-label="Tutup"
              className="grid size-10 place-items-center overflow-hidden rounded-full bg-white/20 transition-transform hover:rotate-90 active:scale-90"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <h2 className="mt-2 font-display text-4xl font-extrabold capitalize tracking-tight drop-shadow-sm">
            {pokemon.name.replace(/-/g, " ")}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {(detail?.types ?? pokemon.types ?? []).map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/25 px-3 py-1 font-display text-xs font-bold backdrop-blur-sm"
              >
                {capital(t)}
              </span>
            ))}
          </div>
          <button
            type="button"
            data-no-sfx="true"
            onClick={() =>
              playingId === pokemon.id ? stopCry() : void playCry(pokemon.id, 0.4)
            }
            className={`relative mt-4 flex h-10 items-center gap-2.5 overflow-hidden rounded-full px-4 font-display text-sm font-bold transition-all active:scale-95 ${
              playingId === pokemon.id
                ? "bg-white text-on-primary-container"
                : "bg-white/25 text-white backdrop-blur-sm hover:bg-white/40"
            }`}
            style={{ color: playingId === pokemon.id ? "var(--md-on-primary-container)" : undefined }}
          >
            {playingId === pokemon.id ? (
              <CryBars active />
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M11 5.5 6.5 9.5H3v5h3.5L11 18.5v-13Z" />
                <path d="M15 9a4.4 4.4 0 0 1 0 6" />
              </svg>
            )}
            {playingId === pokemon.id ? "Sedang bersuara" : "Dengar suara"}
          </button>
          <img
            src={artworkUrl(pokemon.id)}
            alt={pokemon.name}
            width="260"
            height="260"
            className="anim-float absolute -bottom-4 right-4 z-10 w-32 object-contain drop-shadow-2xl sm:w-40"
          />
        </header>

        <div className="px-6 pb-8 pt-12 sm:px-8">
          {error && (
            <p className="rounded-2xl bg-surface-high p-4 text-sm text-on-surface-variant">
              Butiran tidak dapat dimuatkan. Sila cuba lagi.
            </p>
          )}

          {!detail && !error && (
            <div className="grid gap-4">
              <div className="h-4 w-2/3 animate-pulse rounded-full bg-surface-high" />
              <div className="h-4 w-full animate-pulse rounded-full bg-surface-high" />
              <div className="h-24 animate-pulse rounded-2xl bg-surface-high" />
            </div>
          )}

          {detail && (
            <>
              <p className="font-display text-lg font-semibold text-on-surface">
                {detail.genus}
              </p>
              {detail.flavor && (
                <p className="mt-2 leading-relaxed text-on-surface-variant">{detail.flavor}</p>
              )}

              <div className="mt-5 grid grid-cols-3 gap-2.5">
                <div className="rounded-2xl bg-surface-container-low px-3 py-3 text-center shadow-e1">
                  <p className="font-display text-xl font-extrabold text-on-surface">{kg(detail.height)} m</p>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Tinggi
                  </p>
                </div>
                <div className="rounded-2xl bg-surface-container-low px-3 py-3 text-center shadow-e1">
                  <p className="font-display text-xl font-extrabold text-on-surface">{kg(detail.weight)} kg</p>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Berat
                  </p>
                </div>
                <div className="rounded-2xl bg-surface-container-low px-3 py-3 text-center shadow-e1">
                  <p className="font-display text-xl font-extrabold text-on-surface">{total}</p>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Jumlah Stat
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {detail.abilities.map((a) => (
                  <span
                    key={a}
                    className="rounded-full border border-outline-variant bg-surface-container-low px-3.5 py-1.5 text-xs font-bold text-on-surface-variant"
                  >
                    {a}
                  </span>
                ))}
              </div>

              <h3 className="mt-7 font-display text-sm font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                Statistik Asas
              </h3>
              <div className="mt-3 grid gap-3">
                {STAT_ROWS.map(({ key, label, max }) => {
                  const v = detail.stats[key];
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <span className="w-28 shrink-0 text-xs font-bold text-on-surface-variant">
                        {label}
                      </span>
                      <span className="w-9 shrink-0 text-right font-display text-sm font-extrabold">
                        {v}
                      </span>
                      <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-highest">
                        <span
                          className="block h-full rounded-full transition-[width] duration-700 ease-out"
                          style={{
                            width: `${Math.min(100, (v / max) * 100)}%`,
                            background: accent,
                          }}
                        />
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-outline-variant pt-5">
            <button
              type="button"
              disabled={!prevId}
              onClick={(e) => {
                ripple(e);
                if (prevId) onNavigate(prevId);
              }}
              className="flex h-11 flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-surface-container font-display text-sm font-bold text-on-surface disabled:opacity-40"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M19 12H5m6 6-6-6 6-6" />
              </svg>
              Sebelum
            </button>
            <button
              type="button"
              disabled={!nextId}
              onClick={(e) => {
                ripple(e);
                if (nextId) onNavigate(nextId);
              }}
              className="flex h-11 flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-surface-container font-display text-sm font-bold text-on-surface disabled:opacity-40"
            >
              Seterusnya
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
