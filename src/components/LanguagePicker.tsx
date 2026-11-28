"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useSyncExternalStore } from "react";
import { getLang, setLang, LANGS, LANG_BY_CODE, useT } from "../lib/i18n";

const listeners = new Set<() => void>();
let snapshot: string | null = null;

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function currentLang(): string {
  if (typeof window === "undefined") return "ms";
  if (snapshot === null) snapshot = getLang();
  return snapshot;
}

export default function LanguagePicker() {
  const t = useT();
  const lang = useSyncExternalStore(subscribe, currentLang, () => "ms");
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const info = LANG_BY_CODE.get(lang);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return LANGS;
    return LANGS.filter(
      (l) =>
        l.native.toLowerCase().includes(s) ||
        l.en.toLowerCase().includes(s) ||
        l.code.toLowerCase().includes(s),
    );
  }, [q]);

  const pick = (code: string) => {
    snapshot = code;
    setLang(code);
    for (const cb of listeners) cb();
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        data-sfx="toggle-on"
        aria-label={`${t("set.lang")}: ${info?.native ?? "Bahasa Melayu"}`}
        onClick={() => setOpen((v) => !v)}
        className="group relative grid size-10 place-items-center rounded-full text-on-surface-variant transition-all duration-300 hover:scale-110 hover:bg-surface-container-high hover:text-on-surface active:scale-90"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" className="transition-transform duration-500 group-hover:rotate-[25deg]" aria-hidden>
          <defs>
            <linearGradient id="pm-globe" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--md-primary)" />
              <stop offset="0.55" stopColor="var(--md-tertiary)" />
              <stop offset="1" stopColor="#2f7cf6" />
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="9" fill="none" stroke="url(#pm-globe)" strokeWidth="2" />
          <ellipse cx="12" cy="12" rx="4" ry="9" fill="none" stroke="url(#pm-globe)" strokeWidth="1.6" />
          <path d="M3.5 9h17M3.5 15h17" fill="none" stroke="url(#pm-globe)" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span className="absolute bottom-0.5 right-0.5 text-[9px] leading-none">{info?.flag ?? "🇲🇾"}</span>
      </button>

      {open &&
        createPortal(
          <div
            data-portal-panel
            className="anim-rise fixed inset-x-4 top-[4.75rem] z-50 rounded-[1.75rem] border border-outline-variant p-5 shadow-e3 sm:inset-x-auto sm:right-6 sm:top-[4.75rem] sm:w-80"
            style={{ background: "var(--md-surface-container-low)" }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-display text-sm font-extrabold tracking-tight text-on-surface">{t("set.lang")}</p>
                <p className="text-[11px] text-on-surface-variant">{LANGS.length} bahasa · dunia</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                data-sfx="close"
                aria-label={t("close")}
                className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-container-high text-on-surface-variant transition-colors hover:bg-surface-container-highest"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("pick.search")}
              className="mt-4 h-10 w-full rounded-full border border-outline-variant bg-surface-container px-4 text-sm text-on-surface outline-none placeholder:text-on-surface-variant/70 focus:border-primary"
            />

            <ul className="mt-3 max-h-72 space-y-1 overflow-y-auto pr-1" data-no-sfx>
              {filtered.map((l) => {
                const active = l.code === lang;
                return (
                  <li key={l.code}>
                    <button
                      type="button"
                      onClick={() => pick(l.code)}
                      aria-current={active || undefined}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition-colors ${
                        active
                          ? "bg-secondary-container/70 text-primary"
                          : "text-on-surface hover:bg-surface-container-high"
                      }`}
                    >
                      <span className="text-lg leading-none">{l.flag}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{l.native}</span>
                        <span className="block truncate text-[11px] text-on-surface-variant">{l.en}</span>
                      </span>
                      {active && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="m5 13 4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })}
              {filtered.length === 0 && (
                <li className="px-3 py-4 text-center text-xs text-on-surface-variant">—</li>
              )}
            </ul>

            <p className="mt-3 text-[11px] leading-snug text-on-surface-variant">{t("pick.note")}</p>
          </div>,
          document.body,
        )}
    </>
  );
}
