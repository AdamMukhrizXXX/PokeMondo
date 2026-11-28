"use client";

import { useEffect, useState } from "react";
import pkg from "../../package.json";
import { useT } from "../lib/i18n";
import { playUiSfx } from "../lib/sound";

const KEY = "md-seen-ver";

export default function UpdateNotice() {
  const t = useT();
  const [show, setShow] = useState(false);

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
      <div className="up-card relative w-full max-w-md overflow-hidden rounded-[2rem] border border-outline-variant bg-surface-container-low shadow-e3">
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
