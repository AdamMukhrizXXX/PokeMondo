"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { pixelUrl, paddedId, capital, TYPE_COLORS, type BasicPokemon, type PokemonType } from "../lib/pokemon";

export default function SpuiRandom({
  list,
  onOpen,
}: {
  list: BasicPokemon[];
  onOpen: (id: number) => void;
}) {
  const [idx, setIdx] = useState<number | null>(null);
  const first = useRef(true);

  const roll = useCallback(() => {
    if (list.length === 0) return;
    setIdx(Math.floor(Math.random() * list.length));
  }, [list]);

  useEffect(() => {
    if (!first.current) return;
    first.current = false;
    roll();
  }, [roll]);

  const p = idx !== null ? list[idx] ?? null : null;

  return (
    <section
      aria-label="Pokémon Rawak"
      className="mt-6 rounded-[1.5rem] border border-outline-variant bg-surface-container-low p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="grid size-9 place-items-center rounded-full bg-secondary-container text-on-secondary-container"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
              <path d="M3 12h6M15 12h6" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="1.1" fill="currentColor" />
            </svg>
          </span>
          <div>
            <h2 className="font-display text-base font-extrabold tracking-tight text-on-surface">
              Pokémon Rawak
            </h2>
            <p className="text-xs text-on-surface-variant">
              Satu Pokémon terpilih rawak daripada 1,025 spesies — klik kad untuk butiran penuh.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={roll}
          data-sfx="toggle-on"
          className="h-9 rounded-full bg-primary px-4 font-display text-xs font-bold text-on-primary shadow-e1 transition-transform active:scale-95"
        >
          Rawak Semula
        </button>
      </div>

      {p ? (
        <button
          type="button"
          onClick={() => onOpen(p.id)}
          className="mt-4 flex w-full items-center gap-4 rounded-2xl border border-outline-variant bg-surface-container p-4 text-left transition-transform active:scale-[0.98]"
        >
          <img
            src={pixelUrl(p.id)}
            alt={p.name.replace(/-/g, " ")}
            loading="eager"
            decoding="async"
            width={112}
            height={112}
            className="size-28 shrink-0 object-contain"
          />
          <span className="min-w-0">
            <span className="block font-mono text-xs text-on-surface-variant">{paddedId(p.id)}</span>
            <span className="block truncate font-display text-lg font-extrabold text-on-surface">
              {capital(p.name.replace(/-/g, " "))}
            </span>
            {p.types && p.types.length > 0 && (
              <span className="mt-2 flex flex-wrap gap-1.5">
                {p.types.map((t) => (
                  <span
                    key={t}
                    className="rounded-full px-2.5 py-0.5 font-display text-[11px] font-bold text-white"
                    style={{ background: TYPE_COLORS[t as PokemonType] }}
                  >
                    {capital(t)}
                  </span>
                ))}
              </span>
            )}
          </span>
        </button>
      ) : (
        <p className="mt-4 text-sm text-on-surface-variant">Memuatkan Pokémon…</p>
      )}
    </section>
  );
}
