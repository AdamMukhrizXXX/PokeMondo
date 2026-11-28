"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addDownloadedBgm,
  ensureResourcesLoaded,
  getBgmCatalog,
  playBgmById,
  removeDownloadedBgm,
  useBgmState,
  type BgmTrack,
} from "../lib/bgm";
import {
  deleteResource,
  isResSupported,
  listResources,
  putResource,
  type ResourceMeta,
} from "../lib/resource-db";
import { playUiSfx } from "../lib/sound";
import { useT } from "../lib/i18n";
import { CryBars } from "./SoundToggle";
import { FadeIn } from "./Reveal";

function fmtSize(bytes: number) {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MusicResourceCenter() {
  const { playing } = useBgmState();
  const tr = useT();
  const catalog = useMemo(() => getBgmCatalog(), []);
  const [q, setQ] = useState("");
  const [resources, setResources] = useState<Record<string, ResourceMeta>>({});
  const [activeKey, setActiveKey] = useState("");
  const [prog, setProg] = useState({ done: 0, total: 0 });
  const [errKey, setErrKey] = useState("");

  const refresh = useCallback(async () => {
    try {
      const rows = await listResources();
      setResources(Object.fromEntries(rows.map((r) => [r.key, r])));
    } catch {
      /* kekal senarai lama */
    }
  }, []);

  useEffect(() => {
    void ensureResourcesLoaded();
    void refresh();
    const on = () => void refresh();
    window.addEventListener("md-res", on);
    return () => window.removeEventListener("md-res", on);
  }, [refresh]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return catalog.filter(
      (t) =>
        !needle ||
        t.title.toLowerCase().includes(needle) ||
        t.game.toLowerCase().includes(needle),
    );
  }, [catalog, q]);

  const totalBytes = useMemo(
    () => Object.values(resources).reduce((s, r) => s + r.size, 0),
    [resources],
  );
  const dlCount = Object.keys(resources).length;

  const download = useCallback(
    async (t: BgmTrack) => {
      if (activeKey || !isResSupported()) return;
      setActiveKey(t.id);
      setErrKey("");
      setProg({ done: 0, total: 0 });
      try {
        const res = await fetch(t.url ?? "", { cache: "force-cache" });
        if (!res.ok) throw new Error(String(res.status));
        const total = Number(res.headers.get("content-length")) || 0;
        let blob: Blob;
        const reader = res.body?.getReader();
        if (reader && total > 0) {
          const chunks: Uint8Array[] = [];
          let received = 0;
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            received += value.length;
            setProg({ done: received, total });
          }
          blob = new Blob(chunks as BlobPart[]);
        } else {
          blob = await res.blob();
        }
        const meta = await putResource(t.id, t.title, t.game, blob);
        addDownloadedBgm([meta]);
        playUiSfx("success");
      } catch {
        setErrKey(t.id);
        playUiSfx("error");
      } finally {
        setActiveKey("");
        setProg({ done: 0, total: 0 });
      }
    },
    [activeKey],
  );

  const onDelete = useCallback(async (key: string) => {
    try {
      await deleteResource(key);
    } catch {
      /* ignore */
    }
    removeDownloadedBgm(key);
  }, []);

  const play = (id: string) => {
    playUiSfx("click");
    void playBgmById(id);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <FadeIn>
        <div className="flex flex-col items-center gap-2 text-center">
          <span
            aria-hidden
            className="grid size-16 place-items-center rounded-[1.6rem] shadow-e2"
            style={{ background: "linear-gradient(135deg, #f472b6, #a855f7)" }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4v11m0 0-4-4m4 4 4-4" />
              <path d="M5 18v2h14v-2" />
            </svg>
          </span>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            <span className="pokex-gradient-text">{tr("mr.title")}</span>
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-on-surface-variant">
            {tr("mr.sub")}
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div
          className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-outline-variant px-5 py-3.5"
          style={{ background: "var(--md-surface-container)" }}
        >
          <div className="min-w-0">
            <p className="font-display text-sm font-bold text-on-surface">
              {tr("mr.storage")
                .replace("{n}", String(dlCount))
                .replace("{t}", String(catalog.length))
                .replace("{mb}", fmtSize(totalBytes))}
            </p>
            <div className="mt-1.5 h-1.5 w-56 max-w-full overflow-hidden rounded-full bg-surface-container-highest">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{
                  width: `${catalog.length ? Math.round((dlCount / catalog.length) * 100) : 0}%`,
                }}
              />
            </div>
          </div>
          <div className="relative w-full sm:w-64">
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
              placeholder={tr("mu.search")}
              aria-label={tr("mu.searchA")}
              className="h-10 w-full rounded-full border border-outline-variant bg-surface-container-low pl-9 pr-3.5 text-sm text-on-surface outline-none transition-colors focus:border-primary"
            />
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.16}>
        <div
          className="mt-4 overflow-hidden rounded-[1.75rem] border border-outline-variant shadow-e3"
          style={{ background: "var(--md-surface-container-low)" }}
        >
          <div className="flex items-center justify-between gap-2 border-b border-outline-variant px-5 py-3">
            <p className="font-display text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
              OST rasmi — {shown.length} lagu
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
              const res = resources[t.id];
              const has = !!res;
              const active = activeKey === t.id;
              const pct = active && prog.total > 0 ? Math.round((prog.done / prog.total) * 100) : 0;
              return (
                <li
                  key={t.id}
                  className="anim-rise"
                  style={{ animationDelay: `${Math.min(i, 24) * 0.02}s` }}
                >
                  <div
                    className="group flex items-center gap-2.5 rounded-2xl px-3 py-2 transition-colors hover:bg-surface-container"
                  >
                    <button
                      type="button"
                      onClick={() => has && play(t.id)}
                      disabled={!has}
                      aria-label={has ? `Main ${t.title}` : tr("mr.needDL")}
                      title={has ? undefined : tr("mr.needDL")}
                      className={`grid size-8 shrink-0 place-items-center rounded-full transition-transform active:scale-90 disabled:cursor-not-allowed ${
                        has
                          ? "bg-surface-container-high text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary"
                          : "bg-surface-container text-on-surface-variant/40"
                      }`}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M8 5.5v13l11-6.5z" />
                      </svg>
                    </button>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-sm font-semibold ${
                          has ? "text-on-surface" : "text-on-surface-variant"
                        }`}
                      >
                        {t.title}
                      </p>
                      <p className="truncate text-[11px] text-on-surface-variant">
                        {t.game}
                        {has && (
                          <span className="ml-2 text-primary">
                            {fmtSize(res.size)} · {tr("mr.ready")}
                          </span>
                        )}
                        {active && pct > 0 && (
                          <span className="ml-2 font-bold text-primary">{pct}%</span>
                        )}
                        {errKey === t.id && (
                          <span className="ml-2 font-semibold" style={{ color: "var(--md-error)" }}>
                            {tr("mr.err")}
                          </span>
                        )}
                      </p>
                      {active && prog.total > 0 && (
                        <div className="mt-1 h-1 w-full max-w-56 overflow-hidden rounded-full bg-surface-container-highest">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      )}
                    </div>
                    {has ? (
                      <button
                        type="button"
                        onClick={() => void onDelete(t.id)}
                        aria-label={`${tr("mr.delete")} ${t.title}`}
                        className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-container-high text-on-surface-variant opacity-0 transition-all hover:bg-surface-container-highest hover:text-[var(--md-error)] active:scale-90 group-hover:opacity-100"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M4 7h16M9 7V5h6v2m-8 0 1 13h8l1-13" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        type="button"
                        data-sfx="toggle-on"
                        disabled={!!activeKey}
                        onClick={() => void download(t)}
                        className="flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-primary px-3.5 font-display text-[11px] font-bold text-on-primary shadow-e1 transition-all active:scale-95 disabled:opacity-40"
                      >
                        {active ? (
                          <>
                            <span
                              aria-hidden
                              className="size-3 animate-spin rounded-full border-2 border-on-primary/40 border-t-on-primary"
                            />
                            {tr("mr.downloading")}
                          </>
                        ) : (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                              <path d="M12 4v11m0 0-4-4m4 4 4-4" />
                              <path d="M5 18v2h14v-2" />
                            </svg>
                            {tr("mr.download")}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
            {shown.length === 0 && (
              <li className="p-8 text-center text-sm font-semibold text-on-surface-variant">
                {tr("mu.none").replace("{q}", q ? ` dengan “${q}”` : "")}
              </li>
            )}
          </ul>
        </div>
      </FadeIn>

      <FadeIn delay={0.24}>
        <p className="mt-4 text-center text-[11px] leading-relaxed text-on-surface-variant">
          {tr("mr.sub")} Sumber disimpan dalam pelayar ini (IndexedDB) dan kekal selepas
          refresh. Muzik OST: Nintendo / Game Freak / The Pokémon Company.
        </p>
      </FadeIn>
    </div>
  );
}
