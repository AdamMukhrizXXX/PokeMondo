"use client";

import { memo } from "react";
import {
  TYPE_COLORS,
  artworkUrl,
  capital,
  paddedId,
  pixelUrl,
  type BasicPokemon,
  type PokemonType,
} from "../lib/pokemon";

function PokeCardInner({
  p,
  index,
  onOpen,
}: {
  p: BasicPokemon;
  index: number;
  onOpen: (p: BasicPokemon) => void;
}) {
  const primary = p.types?.[0];
  const accent = primary ? TYPE_COLORS[primary as PokemonType] : "#85736d";
  const tint = primary ? `color-mix(in srgb, ${accent} 16%, var(--md-surface-container-low))` : "var(--md-surface-container-low)";

  return (
    <button
      type="button"
      onClick={() => onOpen(p)}
      className="card-press anim-rise group relative flex flex-col overflow-hidden rounded-3xl border border-outline-variant text-left shadow-e1 hover:-translate-y-1 hover:shadow-e3"
      style={{
        background: tint,
        animationDelay: `${(index % 10) * 0.05}s`,
        contentVisibility: "auto",
        containIntrinsicSize: "340px",
      }}
    >
      <span
        aria-hidden
        className="absolute -right-4 -top-4 size-24 rounded-full opacity-15 transition-transform duration-500 group-hover:scale-150"
        style={{ background: accent }}
      />
      <span className="flex items-center justify-between px-4 pt-4">
        <span className="font-display text-xs font-bold tracking-widest text-on-surface-variant">
          {paddedId(p.id)}
        </span>
        <span
          aria-hidden
          className="size-2.5 rounded-full opacity-70 ring-2 ring-inset transition-transform duration-500 group-hover:rotate-180 group-hover:opacity-100"
          style={{ background: accent, boxShadow: `inset 0 0 0 2px var(--md-surface)` }}
        />
      </span>

      <img
        src={artworkUrl(p.id)}
        alt={capital(p.name)}
        loading="lazy"
        width="200"
        height="200"
        onError={(e) => {
          const img = e.currentTarget;
          if (!img.dataset.fallback) {
            img.dataset.fallback = "1";
            img.src = pixelUrl(p.id);
          }
        }}
        className="mx-auto my-1 size-28 object-contain transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 sm:size-32"
      />

      <span className="relative flex flex-1 flex-col gap-2.5 rounded-t-2xl bg-surface-container-lowest/70 px-4 pb-4 pt-3 backdrop-blur-sm">
        <span className="font-display text-lg font-bold capitalize leading-tight text-on-surface">
          {p.name.replace(/-/g, " ")}
        </span>
        <span className="mt-auto flex flex-wrap gap-1.5">
          {p.types ? (
            (p.types as PokemonType[]).map((t) => (
              <span
                key={t}
                className="rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white"
                style={{ background: TYPE_COLORS[t] }}
              >
                {capital(t)}
              </span>
            ))
          ) : (
            <span className="rounded-full bg-surface-high px-2.5 py-0.5 text-[11px] font-bold text-on-surface-variant">
              …
            </span>
          )}
        </span>
      </span>
    </button>
  );
}

export default memo(PokeCardInner);
