"use client";

import { useEffect, useState } from "react";
import {
  generateApiKey,
  isKeyGenSupported,
  listApiKeys,
  maskKey,
  POKEAPI_BASE,
  revokeApiKey,
  type ApiKeyEntry,
} from "../lib/api-keys";
import { playUiSfx } from "../lib/sound";
import { useT } from "../lib/i18n";
import { FadeIn } from "./Reveal";

export default function ApiKeyStudio() {
  const [keys, setKeys] = useState<ApiKeyEntry[]>([]);
  const [label, setLabel] = useState("");
  const [fresh, setFresh] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);
  const t = useT();

  useEffect(() => {
    setSupported(isKeyGenSupported());
    setKeys(listApiKeys());
  }, []);

  const onGenerate = () => {
    if (!supported) return;
    const entry = generateApiKey(label);
    setKeys(listApiKeys());
    setLabel("");
    setFresh(entry.id);
    playUiSfx("success");
    window.setTimeout(() => {
      void navigator.clipboard
        ?.writeText(entry.key)
        .then(() => setCopied(entry.id))
        .catch(() => undefined);
    }, 60);
    window.setTimeout(() => setFresh(null), 2400);
  };

  const onCopy = async (entry: ApiKeyEntry) => {
    try {
      await navigator.clipboard.writeText(entry.key);
      setCopied(entry.id);
      playUiSfx("click");
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      /* ignore */
    }
  };

  const onRevoke = (id: string) => {
    revokeApiKey(id);
    setKeys(listApiKeys());
    playUiSfx("error");
  };

  return (
    <div className="mx-auto max-w-4xl">
      <FadeIn>
        <div className="flex flex-col items-center gap-2 text-center">
          <span
            aria-hidden
            className="grid size-16 place-items-center rounded-[1.6rem] shadow-e2"
            style={{ background: "linear-gradient(135deg, #2dd4bf, #2f7cf6)" }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="14" r="4.2" />
              <path d="m11 11 8.5-8.5M15.5 6.5 18 9M12.5 9.5 15 12" />
            </svg>
          </span>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            <span className="pokex-gradient-text">{t("ak.title")}</span>
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-on-surface-variant">
            {t("ak.sub")}
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div
          className="mt-6 rounded-[1.75rem] border border-outline-variant p-6 shadow-e3"
          style={{ background: "var(--md-surface-container-low)" }}
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onGenerate()}
              maxLength={40}
              placeholder={t("ak.ph")}
              aria-label={t("ak.phA")}
              className="h-12 flex-1 rounded-xl border border-outline-variant bg-surface-container px-4 text-sm text-on-surface outline-none transition-colors focus:border-primary"
            />
            <div className="star-border shrink-0">
              <button
                type="button"
                data-sfx="toggle-on"
                onClick={onGenerate}
                disabled={!supported}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 font-display text-sm font-bold text-on-primary shadow-e1 transition-transform active:scale-95 disabled:opacity-50 sm:w-auto"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M13 2 4.5 13.5H11L9.5 22 19 9.5h-6.5L13 2Z" />
                </svg>
                {t("ak.gen")}
              </button>
            </div>
          </div>
          {!supported && (
            <p role="alert" className="mt-2 text-xs font-semibold" style={{ color: "var(--md-error)" }}>
              {t("ak.unsupported")}
            </p>
          )}
          <p className="mt-3 text-[11px] leading-relaxed text-on-surface-variant">
            {t("ak.note")}
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.16}>
        <div className="mt-6 flex items-center justify-between gap-2 px-1">
          <p className="font-display text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
            Kunci anda ({keys.length})
          </p>
          <span className="rounded-full bg-surface-container px-2.5 py-0.5 text-[10px] font-bold text-on-surface-variant">
            localStorage sahaja
          </span>
        </div>

        {keys.length === 0 ? (
          <div
            className="mt-3 rounded-[1.5rem] border border-dashed border-outline-variant p-8 text-center"
            style={{ background: "var(--md-surface-container-low)" }}
          >
            <p className="text-sm font-semibold text-on-surface-variant">
              Belum ada kunci — jana yang pertama di atas.
            </p>
          </div>
        ) : (
          <ul className="mt-3 flex flex-col gap-2.5">
            {keys.map((entry, i) => (
              <li
                key={entry.id}
                className={`anim-rise flex flex-wrap items-center gap-2 rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-e2 ${
                  fresh === entry.id
                    ? "otp-success border-[#00a878]"
                    : "border-outline-variant"
                }`}
                style={{
                  animationDelay: `${i * 0.05}s`,
                  background: "var(--md-surface-container-low)",
                }}
              >
                <span
                  aria-hidden
                  className="grid size-9 shrink-0 place-items-center rounded-xl text-[11px] font-extrabold text-white"
                  style={{ background: "linear-gradient(135deg, #2dd4bf, #2f7cf6)" }}
                >
                  {entry.label.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-bold text-on-surface">{entry.label}</p>
                  <p className="truncate font-mono text-[11px] text-on-surface-variant">
                    {copied === entry.id ? entry.key : maskKey(entry.key)}
                  </p>
                  <p className="text-[10px] text-on-surface-variant/80">
                    Dijana {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  data-sfx="click"
                  onClick={() => void onCopy(entry)}
                  className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-secondary-container px-3.5 font-display text-xs font-bold text-on-secondary-container transition-transform active:scale-95"
                >
                  {copied === entry.id ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="m4.5 12.5 5 5 10-11" />
                      </svg>
                      Disalin
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <rect x="9" y="9" width="11" height="11" rx="2" />
                        <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                      </svg>
                      {t("ak.copy")}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  data-sfx="close"
                  onClick={() => onRevoke(entry.id)}
                  aria-label={`${t("ak.revoke")} ${entry.label}`}
                  className="grid size-9 shrink-0 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-[var(--md-error)]"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </FadeIn>

      <FadeIn delay={0.24}>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div
            className="rounded-2xl border border-outline-variant p-5"
            style={{ background: "var(--md-surface-container-low)" }}
          >
            <p className="font-display text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Data PokéAPI
            </p>
            <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
              PokéAPI terbuka &amp; percuma tanpa kunci. Gunakan kunci janaan ini sebagai
              pengepala <code className="rounded bg-surface-container px-1.5 py-0.5 font-mono text-[10px]">X-Api-Key</code> dalam
              aplikasi anda supaya setiap permintaan boleh dikenal pasti.
            </p>
            <p className="mt-2.5 truncate rounded-xl bg-surface-container px-3 py-2 font-mono text-[11px] text-on-surface">
              {POKEAPI_BASE}
            </p>
          </div>
          <div
            className="rounded-2xl border border-outline-variant p-5"
            style={{ background: "var(--md-surface-container-low)" }}
          >
            <p className="font-display text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Contoh permintaan
            </p>
            <pre className="mt-2 overflow-x-auto rounded-xl bg-surface-container px-3 py-2.5 font-mono text-[10.5px] leading-relaxed text-on-surface">
{`fetch("${POKEAPI_BASE}/pokemon/25", {
  headers: { "X-Api-Key": "<kunci anda>" }
})`}
            </pre>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
