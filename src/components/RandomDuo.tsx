"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  TYPE_COLORS,
  artworkUrl,
  capital,
  paddedId,
  pixelUrl,
  type BasicPokemon,
  type PokemonType,
} from "../lib/pokemon";
import { useT } from "../lib/i18n";
import { playUiSfx } from "../lib/sound";
import { FadeIn } from "./Reveal";

type BatteryInfo = { supported: boolean; level: number; charging: boolean };
type StorageInfo = { supported: boolean; used: number; quota: number };

type BatteryManager = EventTarget & {
  level: number;
  charging: boolean;
  addEventListener(type: "levelchange" | "chargingchange", cb: () => void): void;
};

function readGpu(): string {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ?? canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return "WebGPU" in navigator ? "WebGPU" : "";
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    const raw = dbg
      ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) ?? "")
      : String(gl.getParameter(gl.RENDERER) ?? "");
    return raw
      .replace(/^ANGLE \(/, "")
      .replace(/\)$/, "")
      .replace(/Direct3D\d+ \(?([^)]+)\)?/, "$1")
      .replace(/Metal:?.*?,/, "")
      .trim()
      .slice(0, 44);
  } catch {
    return "";
  }
}

const gb = (bytes: number) => (bytes / 1e9).toFixed(1);

export default function RandomDuo({ list }: { list: BasicPokemon[] }) {
  const t = useT();
  const router = useRouter();
  const [pair, setPair] = useState<[BasicPokemon, BasicPokemon] | null>(null);
  const [seed, setSeed] = useState(0);
  const [batt, setBatt] = useState<BatteryInfo | null>(null);
  const [gpu, setGpu] = useState("");
  const [stor, setStor] = useState<StorageInfo | null>(null);
  const firstRoll = useRef(true);

  const roll = useCallback(
    (silent = false) => {
      if (list.length < 2) return;
      const i1 = Math.floor(Math.random() * list.length);
      let i2 = Math.floor(Math.random() * (list.length - 1));
      if (i2 >= i1) i2 += 1;
      setPair([list[i1], list[i2]]);
      setSeed((s) => s + 1);
      if (!silent) playUiSfx("dice");
    },
    [list],
  );

  useEffect(() => {
    if (list.length >= 2) roll(firstRoll.current);
    if (list.length >= 2) firstRoll.current = false;
  }, [list, roll]);

  useEffect(() => {
    const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryManager> };
    if (typeof nav.getBattery !== "function") {
      setBatt({ supported: false, level: 0, charging: false });
      return;
    }
    let alive = true;
    let manager: BatteryManager | null = null;
    const sync = () => {
      if (!alive || !manager) return;
      setBatt({ supported: true, level: Math.round(manager.level * 100), charging: manager.charging });
    };
    nav
      .getBattery()
      .then((b) => {
        manager = b;
        sync();
        b.addEventListener("levelchange", sync);
        b.addEventListener("chargingchange", sync);
      })
      .catch(() => alive && setBatt({ supported: false, level: 0, charging: false }));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    try {
      if (!navigator.storage?.estimate) {
        setStor({ supported: false, used: 0, quota: 0 });
        return;
      }
      navigator.storage
        .estimate()
        .then(({ usage, quota }) => setStor({ supported: true, used: usage ?? 0, quota: quota ?? 0 }))
        .catch(() => setStor({ supported: false, used: 0, quota: 0 }));
    } catch {
      setStor({ supported: false, used: 0, quota: 0 });
    }
  }, []);

  useEffect(() => {
    setGpu(readGpu());
  }, []);

  const open = (p: BasicPokemon) => {
    playUiSfx("click");
    router.push(`/pokedex?q=${p.id}`);
  };

  const battTone = !batt?.supported ? "#85736d" : batt.charging ? "#00a878" : batt.level <= 20 ? "#e3350d" : "#ffc531";

  return (
    <section aria-label={t("rd.tag")} className="px-5 pb-24 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <FadeIn>
          <div className="flex flex-col items-center gap-2 text-center">
            <span
              aria-hidden
              className="grid size-16 place-items-center rounded-[1.6rem] shadow-e2"
              style={{ background: "linear-gradient(135deg, #a855f7, #f472b6)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 3h5v5" />
                <path d="M4 20 21 3" />
                <path d="M21 16v5h-5" />
                <path d="m15 15 6 6" />
                <path d="m4 4 5 5" />
              </svg>
            </span>
            <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-primary">{t("rd.tag")}</p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight">
              <span className="pokex-gradient-text">{t("rd.title")}</span>
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-on-surface-variant">{t("rd.sub")}</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          {pair ? (
            <div key={seed} className="mt-6 grid grid-cols-2 gap-4">
              {pair.map((p) => {
                const primary = p.types?.[0];
                const accent = primary ? TYPE_COLORS[primary as PokemonType] : "#85736d";
                const tint = primary
                  ? `color-mix(in srgb, ${accent} 16%, var(--md-surface-container-low))`
                  : "var(--md-surface-container-low)";
                return (
                  <button
                    key={p.id}
                    type="button"
                    data-sfx="click"
                    onClick={() => open(p)}
                    aria-label={`${t("rd.open")}: ${capital(p.name)}`}
                    className="rd-card rd-in group relative flex flex-col overflow-hidden rounded-3xl border border-outline-variant text-left shadow-e1"
                    style={{ background: tint }}
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
                        className="nv-pulse size-2 rounded-full"
                        style={{ background: accent }}
                      />
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
                      className="mx-auto my-1 size-28 object-contain transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 sm:size-36"
                    />
                    <span className="relative flex flex-1 flex-col gap-2.5 rounded-t-2xl bg-surface-container-lowest/70 px-4 pb-4 pt-3 backdrop-blur-sm">
                      <span className="font-display text-lg font-bold capitalize leading-tight text-on-surface">
                        {p.name.replace(/-/g, " ")}
                      </span>
                      <span className="mt-auto flex flex-wrap gap-1.5">
                        {p.types ? (
                          (p.types as PokemonType[]).map((ty) => (
                            <span
                              key={ty}
                              className="rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white"
                              style={{ background: TYPE_COLORS[ty] }}
                            >
                              {capital(ty)}
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
              })}
            </div>
          ) : (
            <p className="mt-6 text-center text-sm font-semibold text-on-surface-variant">{t("rd.loading")}</p>
          )}
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              data-sfx="dice"
              onClick={() => roll()}
              disabled={!pair}
              className="star-border flex h-12 items-center gap-2 rounded-full bg-primary px-8 font-display text-sm font-bold text-on-primary shadow-e1 transition-transform active:scale-95 disabled:opacity-50"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M16 3h5v5" />
                <path d="M4 20 21 3" />
                <path d="M21 16v5h-5" />
                <path d="m15 15 6 6" />
                <path d="m4 4 5 5" />
              </svg>
              {t("rd.roll")}
            </button>
          </div>
        </FadeIn>

        <FadeIn delay={0.18}>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/70 bg-surface-container/70 px-3 py-1 text-[11px] font-semibold text-on-surface-variant">
              <svg width="13" height="13" viewBox="0 0 24 24" fill={battTone} aria-hidden>
                <path d="M13 2 4.5 13.5H11L9.5 22 19 9.5h-6.5L13 2Z" />
              </svg>
              {t("rd.batt")}
              {" — "}
              {batt === null ? "…" : !batt.supported ? t("rd.nosup") : `${batt.charging ? `${t("rd.charging")} · ` : ""}${batt.level}%`}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/70 bg-surface-container/70 px-3 py-1 text-[11px] font-semibold text-on-surface-variant">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2f7cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="5" y="5" width="14" height="14" rx="3" />
                <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
              </svg>
              {t("rd.gpu")}
              {" — "}
              {gpu || t("rd.nosup")}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/70 bg-surface-container/70 px-3 py-1 text-[11px] font-semibold text-on-surface-variant">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00a878" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <ellipse cx="12" cy="5.5" rx="8" ry="3" />
                <path d="M4 5.5V18.5c0 1.7 3.6 3 8 3s8-1.3 8-3V5.5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
              </svg>
              {t("rd.storage")}
              {" — "}
              {stor === null
                ? "…"
                : !stor.supported || stor.quota === 0
                  ? t("rd.nosup")
                  : `${gb(stor.used)} / ${gb(stor.quota)} GB`}
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
