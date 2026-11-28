"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  addImportedBgm,
  getBgmIndex,
  getBgmPlaylist,
  isBgmOn,
  playBgmById,
  removeImportedBgm,
  useBgmState,
  type BgmTrack,
} from "../lib/bgm";
import {
  deleteImported,
  isImportSupported,
  listImported,
  putImported,
  type ImportedMeta,
} from "../lib/import-db";
import { playUiSfx } from "../lib/sound";
import { CryBars } from "./SoundToggle";
import { FadeIn } from "./Reveal";

type Tab = "semua" | "ost" | "import";

const AUDIO_RE = /\.(mp3|ogg|oga|m4a|aac|wav|flac|opus)$/i;
const MAX_AUDIO = 25 * 1024 * 1024;

export default function MusicLibrary() {
  const { playing, index } = useBgmState();
  const [playlist, setPlaylist] = useState<BgmTrack[]>([]);
  const [tab, setTab] = useState<Tab>("semua");
  const [q, setQ] = useState("");
  const [imports, setImports] = useState<ImportedMeta[]>([]);
  const [busy, setBusy] = useState(false);
  const [importErr, setImportErr] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const currentIndexRef = useRef(index);
  currentIndexRef.current = index;

  const refresh = useCallback(() => setPlaylist(getBgmPlaylist()), []);

  useEffect(() => {
    refresh();
    listImported()
      .then((metas) => {
        setImports(metas);
        addImportedBgm(metas);
        refresh();
      })
      .catch(() => undefined);
    const onBgm = () => refresh();
    window.addEventListener("md-bgm", onBgm);
    return () => window.removeEventListener("md-bgm", onBgm);
  }, [refresh]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return playlist.filter((t) => {
      const isImport = t.game === "Import";
      if (tab === "ost" && isImport) return false;
      if (tab === "import" && !isImport) return false;
      if (!needle) return true;
      return (
        t.title.toLowerCase().includes(needle) || t.game.toLowerCase().includes(needle)
      );
    });
  }, [playlist, tab, q]);

  const onPick = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setImportErr("");
    const saved: ImportedMeta[] = [];
    let skipped = 0;
    for (const f of Array.from(files)) {
      const valid =
        (f.type.startsWith("audio/") || AUDIO_RE.test(f.name)) &&
        f.size > 0 &&
        f.size <= MAX_AUDIO;
      if (!valid) {
        skipped += 1;
        continue;
      }
      try {
        saved.push(await putImported(f, f.name));
      } catch {
        skipped += 1;
      }
    }
    if (saved.length > 0) {
      addImportedBgm(saved);
      refresh();
    }
    try {
      setImports(await listImported());
    } catch {
      /* kekal senarai lama */
    }
    setImportErr(
      saved.length === 0
        ? "Tiada fail audio sah (mp3 / ogg / m4a / wav / flac, ≤ 25MB)."
        : skipped > 0
          ? `${skipped} fail dilangkau (bukan audio atau melebihi 25MB).`
          : "",
    );
    setBusy(false);
    playUiSfx(saved.length > 0 ? "success" : "error");
    if (fileRef.current) fileRef.current.value = "";
  };

  const onRemove = async (key: string) => {
    try {
      await deleteImported(key);
    } catch {
      /* ignore */
    }
    removeImportedBgm(key);
    refresh();
    try {
      setImports(await listImported());
    } catch {
      /* ignore */
    }
  };

  const play = (id: string) => {
    playUiSfx("click");
    void playBgmById(id);
  };

  const importedCount = playlist.filter((t) => t.game === "Import").length;
  const currentId = playlist[getBgmIndex()]?.id;

  return (
    <div className="mx-auto max-w-4xl">
      <FadeIn>
        <div className="flex flex-col items-center gap-2 text-center">
          <span
            aria-hidden
            className="grid size-16 place-items-center rounded-[1.6rem] shadow-e2"
            style={{ background: "linear-gradient(135deg, #ff6a48, #e3350d)" }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l11-2v13" />
              <circle cx="6.5" cy="18" r="2.8" />
              <circle cx="17.5" cy="16" r="2.8" />
            </svg>
          </span>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            <span className="pokex-gradient-text">Pustaka Muzik Pokémon</span>
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-on-surface-variant">
            {playlist.length} runtutan dalam satu senarai — OST rasmi siri permainan dan fail
            import anda, bermain melalui Pemain Muzik yang sama.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <div className="flex gap-1.5 rounded-full border border-outline-variant/70 bg-surface-container/70 p-1">
            {(
              [
                ["semua", `Semua (${playlist.length})`],
                ["ost", `OST (${playlist.length - importedCount})`],
                ["import", `Import (${importedCount})`],
              ] as const
            ).map(([value, labelText]) => (
              <button
                key={value}
                type="button"
                data-sfx="click"
                onClick={() => setTab(value)}
                aria-pressed={tab === value}
                className={`h-9 rounded-full px-4 font-display text-xs font-bold transition-colors ${
                  tab === value
                    ? "bg-primary text-on-primary shadow-e1"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {labelText}
              </button>
            ))}
          </div>
          <div className="relative min-w-0 flex-1">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              aria-hidden
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari lagu atau permainan…"
              aria-label="Cari dalam pustaka muzik"
              className="h-10 w-full rounded-full border border-outline-variant bg-surface-container pl-9 pr-3.5 text-sm text-on-surface outline-none transition-colors focus:border-primary"
            />
          </div>
          <button
            type="button"
            data-sfx="toggle-on"
            disabled={busy || !isImportSupported()}
            onClick={() => fileRef.current?.click()}
            className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-secondary-container px-4 font-display text-xs font-bold text-on-secondary-container transition-all active:scale-95 disabled:opacity-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 16V4m0 0 -5 5m5-5 5 5" />
              <path d="M4 18v2h16v-2" />
            </svg>
            {busy ? "Mengimport…" : "Import Muzik"}
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="audio/*,.mp3,.ogg,.oga,.m4a,.aac,.wav,.flac,.opus"
          onChange={(e) => void onPick(e.target.files)}
          className="hidden"
          aria-hidden
          tabIndex={-1}
        />
        {importErr && (
          <p className="mt-2 text-xs font-medium" style={{ color: "var(--md-error)" }}>
            {importErr}
          </p>
        )}
      </FadeIn>

      <FadeIn delay={0.16}>
        <div
          className="mt-4 overflow-hidden rounded-[1.75rem] border border-outline-variant shadow-e3"
          style={{ background: "var(--md-surface-container-low)" }}
        >
          <div className="flex items-center justify-between gap-2 border-b border-outline-variant px-5 py-3">
            <p className="font-display text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
              {tab === "semua" ? "Semua runtutan" : tab === "ost" ? "OST rasmi" : "Import anda"} —{" "}
              {shown.length} lagu
            </p>
            {playing && (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-primary">
                <CryBars active className="text-primary" />
                sedang bermain
              </span>
            )}
          </div>
          <ul className="no-scrollbar max-h-[62svh] overflow-y-auto p-2">
            {shown.map((t, i) => {
              const isCurrent = t.id === currentId;
              const isImport = t.game === "Import";
              return (
                <li
                  key={t.id}
                  className="anim-rise"
                  style={{ animationDelay: `${Math.min(i, 24) * 0.02}s` }}
                >
                  <div
                    className={`group flex items-center gap-2.5 rounded-2xl px-3 py-2 transition-colors ${
                      isCurrent ? "bg-secondary-container/70" : "hover:bg-surface-container"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => play(t.id)}
                      aria-label={`Main ${t.title}`}
                      className={`grid size-8 shrink-0 place-items-center rounded-full transition-transform active:scale-90 ${
                        isCurrent
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container-high text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary"
                      }`}
                    >
                      {isCurrent && playing ? (
                        <CryBars active className="text-on-primary" />
                      ) : (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M8 5.5v13l11-6.5z" />
                        </svg>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => play(t.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p
                        className={`truncate text-sm font-semibold ${
                          isCurrent ? "text-primary" : "text-on-surface"
                        }`}
                      >
                        {t.title}
                      </p>
                      <p className="truncate text-[11px] text-on-surface-variant">
                        {t.game}
                        {isImport && (
                          <span className="ml-2 rounded-full bg-tertiary-container px-1.5 py-0.5 text-[9px] font-bold text-on-tertiary-container">
                            Import
                          </span>
                        )}
                      </p>
                    </button>
                    {isImport && (
                      <button
                        type="button"
                        onClick={() => void onRemove(t.id)}
                        aria-label={`Buang ${t.title}`}
                        className="grid size-7 shrink-0 place-items-center rounded-full text-on-surface-variant opacity-0 transition-all hover:bg-surface-container-highest hover:text-[var(--md-error)] group-hover:opacity-100"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                          <path d="M6 6l12 12M18 6 6 18" />
                        </svg>
                      </button>
                    )}
                    <span className="w-10 shrink-0 text-right font-display text-[10px] font-bold tabular-nums text-on-surface-variant/70">
                      #{(playlist.indexOf(t) + 1).toString()}
                    </span>
                  </div>
                </li>
              );
            })}
            {shown.length === 0 && (
              <li className="p-8 text-center text-sm font-semibold text-on-surface-variant">
                Tiada lagu sepadan {q ? `dengan “${q}”` : "dalam tapisan ini"}.
              </li>
            )}
          </ul>
        </div>
      </FadeIn>

      <FadeIn delay={0.24}>
        <p className="mt-4 text-center text-[11px] leading-relaxed text-on-surface-variant">
          {isImportSupported()
            ? "Fail import (≤ 25MB setiap satu) disimpan dalam pelayar ini (IndexedDB) dan kekal selepas refresh — ia muncul dalam senarai ini serta auto-tukar & putar rawak Pemain Muzik."
            : "Pelayar ini tidak menyokong IndexedDB — import muzik tidak tersedia, senarai OST tetap boleh dimainkan."}{" "}
          Muzik OST: Nintendo / Game Freak / The Pokémon Company.
        </p>
        {!isBgmOn() && (
          <p className="mt-1 text-center text-[10px] font-semibold text-on-surface-variant/70">
            Muzik latar sedang dimatikan — pilih lagu di atas untuk terus memainkannya.
          </p>
        )}
      </FadeIn>
    </div>
  );
}
