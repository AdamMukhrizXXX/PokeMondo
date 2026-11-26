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
import { CryBars } from "./SoundToggle";
import { playCry, stopCry, useCryState } from "../lib/sound";

function PokeCardInner({
  p,
  index,
  onOpen,
}: {
  p: BasicPokemon;
  index: number;
  onOpen: (p: BasicPokemon) => void;
}) {
  const { playingId } = useCryState();
  const primary = p.types?.[0];
  const accent = primary ? TYPE_COLORS[primary as PokemonType] : "#85736d";
  const tint = primary ? `color-mix(in srgb, ${accent} 16%, var(--md-surface-container-low))` : "var(--md-surface-container-low)";

  return (
    <button
      type="button"
      data-spot
      onClick={() => onOpen(p)}
      className="card-press card-rise group relative flex flex-col overflow-hidden rounded-3xl border border-outline-variant text-left shadow-e1 hover:-translate-y-1 hover:shadow-e3"
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
          role="button"
          tabIndex={-1}
          aria-label={playingId === p.id ? "Hentikan suara" : `Dengar suara ${p.name.replace(/-/g, " ")}`}
          onClick={(e) => {
            e.stopPropagation();
            if (playingId === p.id) {
              stopCry();
            } else {
              void playCry(p.id, 0.28);
            }
          }}
          className={`relative grid size-8 cursor-pointer place-items-center rounded-full opacity-80 transition-all duration-300 hover:scale-110 group-hover:opacity-100 ${
            playingId === p.id
              ? "bg-inverse-surface text-inverse-on-surface ring-2 ring-primary/50 opacity-100"
              : "bg-surface-container-highest text-on-surface-variant"
          }`}
        >
          {playingId === p.id ? (
            <CryBars active className="text-inverse-on-surface" />
          ) : (
            <svg
              width="14"
              height="14"
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
        </span>
      </span>

      <img
        src={artworkUrl(p.id)}
        alt={capital(p.name)}
        loading="lazy"
        decoding="async"
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
