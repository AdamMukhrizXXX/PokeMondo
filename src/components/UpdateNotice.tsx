"use client";

import { useEffect, useState } from "react";
import pkg from "../../package.json";
import { useT } from "../lib/i18n";
import { playUiSfx } from "../lib/sound";
import { pixelUrl } from "../lib/pokemon";

const KEY = "md-seen-ver";
const DL_KEY = "md-res-dl";
const RES_TOTAL = 1025;
const RES_MB = 11.8;

export default function UpdateNotice() {
  const t = useT();
  const [show, setShow] = useState(false);
  const [dl, setDl] = useState<{ done: number; bytes: number } | null>(null);
  const [dlDone, setDlDone] = useState(false);

  useEffect(() => {
    try {
      setDlDone(localStorage.getItem(DL_KEY) === pkg.version);
    } catch {
      /* ignore */
    }
  }, []);

  const startDownload = async () => {
    if (dl) return;
    setDl({ done: 0, bytes: 0 });
    playUiSfx("click");
    const BATCH = 12;
    for (let start = 1; start <= RES_TOTAL; start += BATCH) {
      const ids: number[] = [];
      for (let id = start; id < start + BATCH && id <= RES_TOTAL; id++) ids.push(id);
      const sizes = await Promise.all(
        ids.map(async (id) => {
          try {
            const r = await fetch(pixelUrl(id), { cache: "force-cache" });
            if (!r.ok) return 0;
            return (await r.arrayBuffer()).byteLength;
          } catch {
            return 0;
          }
        })
      );
      setDl((d) =>
        d
          ? { done: d.done + ids.length, bytes: d.bytes + sizes.reduce((a, b) => a + b, 0) }
          : d
      );
    }
    try {
      localStorage.setItem(DL_KEY, pkg.version);
    } catch {
      /* ignore */
    }
    setDlDone(true);
    playUiSfx("success");
  };

  useEffect(() => {
    let seen: string | null = null;
    try {
      seen = localStorage.getItem(KEY);
    } catch {
      /* ignore */
    }
    if (seen && seen !== pkg.version) {
      setShow(true);
    } else if (!seen) {
      try {
        localStorage.setItem(KEY, pkg.version);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const dismiss = () => {
    playUiSfx("success");
    setShow(false);
    try {
      localStorage.setItem(KEY, pkg.version);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="up-backdrop fixed inset-0 z-[80] grid place-items-center p-5"
      role="dialog"
      aria-modal="true"
      aria-label={t("up.title").replace("{v}", pkg.version)}
    >
      <div className="up-card relative max-h-[88svh] w-full max-w-md overflow-y-auto rounded-[2rem] border border-outline-variant bg-surface-container-low shadow-e3">
        <span aria-hidden className="up-aurora" />
        <div className="relative p-7 text-center">
          <span aria-hidden className="up-badge mx-auto grid size-14 place-items-center rounded-[1.4rem]">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-2.64-6.36" />
              <path d="M21 3v6h-6" />
            </svg>
          </span>
          <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight">
            <span className="pokex-gradient-text">{t("up.title").replace("{v}", pkg.version)}</span>
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">{t("up.sub")}</p>
          <ul className="mt-5 flex flex-col gap-2.5 text-left">
            {(["up.n1", "up.n2", "up.n3", "up.n4"] as const).map((k, i) => (
              <li
                key={k}
                className="anim-rise flex items-start gap-2.5 rounded-xl bg-surface-container/70 px-3.5 py-2.5 text-[13px] leading-relaxed text-on-surface"
                style={{ animationDelay: `${0.15 + i * 0.08}s` }}
              >
                <i
                  aria-hidden
                  className="mt-[7px] size-1.5 shrink-0 rounded-full"
                  style={{ background: "linear-gradient(135deg, #2dd4bf, #0ea5e9)" }}
                />
                {t(k)}
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-2xl border border-outline-variant/70 bg-surface-container/60 p-4 text-left">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary-container text-on-secondary-container"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
                  <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="font-display text-sm font-extrabold text-on-surface">
                  {t("dl.title")}
                </p>
                <p className="text-[11px] leading-snug text-on-surface-variant">
                  {t("dl.desc").replace("{mb}", RES_MB.toFixed(1))}
                </p>
              </div>
            </div>

            {dlDone ? (
              <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-tertiary-container px-3 py-2 font-display text-xs font-bold text-on-tertiary-container">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {t("dl.done")}
              </p>
            ) : dl ? (
              <div className="mt-3">
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest">
                  <div
                    className="h-full rounded-full transition-[width] duration-200"
                    style={{
                      width: `${Math.round((dl.done / RES_TOTAL) * 100)}%`,
                      background: "linear-gradient(90deg, #2dd4bf, #0ea5e9)",
                    }}
                  />
                </div>
                <p className="mt-1.5 font-display text-[11px] font-bold tabular-nums text-on-surface-variant">
                  {t("dl.doing")
                    .replace("{n}", String(dl.done))
                    .replace("{t}", String(RES_TOTAL))
                    .replace("{mb}", (dl.bytes / 1048576).toFixed(1))}
                </p>
              </div>
            ) : (
              <button
                type="button"
                data-sfx="toggle-on"
                onClick={startDownload}
                className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-full border border-primary/60 font-display text-xs font-bold text-primary transition-colors hover:bg-primary/10"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
                  <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                </svg>
                {t("dl.btn").replace("{mb}", RES_MB.toFixed(1))}
              </button>
            )}
          </div>

          <button
            type="button"
            data-sfx="success"
            onClick={dismiss}
            className="star-border mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-display text-sm font-bold text-on-primary shadow-e1 transition-transform active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
            {t("up.btn")}
          </button>
        </div>
      </div>
    </div>
  );
}
