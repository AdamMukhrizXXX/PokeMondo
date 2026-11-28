"use client";

import { useEffect, useRef, useState } from "react";
import type { BasicPokemon } from "../lib/pokemon";
import {
  askAi,
  datasetSummary,
  getAiKey,
  getAiModel,
  getAiProvider,
  PROVIDERS,
  setAiKey,
  setAiModel,
  setAiProvider,
  PRO_THINK_SECONDS,
  type AiProvider,
} from "../lib/ai";
import { playUiSfx } from "../lib/sound";

type Msg = {
  role: "user" | "assistant";
  content: string;
  error?: boolean;
  via?: string;
  reasoning?: string;
};

type TestState = { status: "idle" | "testing" | "ok" | "fail"; note: string };

const PRESETS = [
  "Ringkaskan keseluruhan Pokédex ini",
  "Analisis jenis paling dominan dan mengapa",
  "Bandingkan sembilan generasi ini",
  "Cadangkan 6 Pokémon untuk pasukan seimbang",
] as const;

function XMark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`pokex-x-live ${className}`}
      aria-hidden
    >
      <defs>
        <linearGradient id="pm-x-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2dd4bf" />
          <stop offset="1" stopColor="#0ea5e9" />
        </linearGradient>
        <linearGradient id="pm-x-b" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffc531" />
          <stop offset="1" stopColor="#ff9800" />
        </linearGradient>
      </defs>
      <path
        d="M19 4.5C14.5 9 8 15 4.8 19.2c2.6 1.8 5.6 1.6 7.7.4"
        stroke="url(#pm-x-b)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M5 4.5C8.5 10.5 13.5 16.5 19 19.5"
        stroke="url(#pm-x-a)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M12 9.6 14.4 12 12 14.4 9.6 12Z" fill="#ffffff" className="pokex-x-gem" />
    </svg>
  );
}

function renderRich(text: string): React.ReactNode[] {
  return text.split(/(\*\*\*[^*\n]+\*\*\*|\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g).map((tok, i) => {
    if (tok.startsWith("***") && tok.endsWith("***") && tok.length > 6) {
      return (
        <strong key={i} className="font-display text-[1.08em] font-extrabold italic text-on-surface">
          {tok.slice(3, -3)}
        </strong>
      );
    }
    if (tok.startsWith("**") && tok.endsWith("**") && tok.length > 4) {
      return (
        <strong key={i} className="font-display text-[1.06em] font-extrabold text-on-surface">
          {tok.slice(2, -2)}
        </strong>
      );
    }
    if (tok.startsWith("*") && tok.endsWith("*") && tok.length > 2) {
      return (
        <em key={i} className="font-semibold italic text-on-surface">
          {tok.slice(1, -1)}
        </em>
      );
    }
    return tok;
  });
}

export default function PokeXSection({ list }: { list: BasicPokemon[] }) {
  const [tab, setTab] = useState<"chat" | "tetapan">("chat");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [provider, setProvider] = useState<AiProvider>("openrouter");
  const [model, setModel] = useState("");
  const [keyField, setKeyField] = useState("");
  const [keyStatus, setKeyStatus] = useState<Record<AiProvider, boolean>>({
    openrouter: false,
    groq: false,
    xkiro: false,
  });
  const [test, setTest] = useState<TestState>({ status: "idle", note: "" });
  const [pro, setPro] = useState(false);
  const [thinkSec, setThinkSec] = useState(0);
  const [live, setLive] = useState<{ content: string; reasoning: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const p = getAiProvider();
    setProvider(p);
    setModel(getAiModel(p));
    setKeyStatus({
      openrouter: !!getAiKey("openrouter"),
      groq: !!getAiKey("groq"),
      xkiro: !!getAiKey("xkiro"),
    });
    const id = window.setTimeout(() => playUiSfx("pokex"), 260);
    return () => window.clearTimeout(id);
  }, []);

  const saveKey = () => {
    const v = keyField.trim();
    setAiKey(provider, v);
    setKeyStatus((s) => ({ ...s, [provider]: !!v }));
    setKeyField("");
  };

  const clearKey = () => {
    setAiKey(provider, "");
    setKeyStatus((s) => ({ ...s, [provider]: false }));
  };

  const runApiTest = async () => {
    if (test.status === "testing") return;
    setTest({ status: "testing", note: `Menguji ${PROVIDERS[provider].label}…` });
    const start = performance.now();
    let chars = 0;
    try {
      const { via } = await askAi(
        [{ role: "user", content: "Balas dengan satu perkataan sahaja: OK" }],
        "",
        {
          onDelta: (c) => {
            chars += c.length;
            setTest({ status: "testing", note: `Menerima data langsung… ${chars} aksara` });
          },
        },
      );
      const ms = Math.round(performance.now() - start);
      const label =
        via === provider ? PROVIDERS[via].label : `${PROVIDERS[via].label} (sandaran)`;
      setTest({ status: "ok", note: `Berjaya — ${label}, ${ms} ms, ${chars} aksara langsung` });
    } catch (e) {
      const msg = (e as Error).message;
      setTest({
        status: "fail",
        note:
          msg === "NO_KEY"
            ? "Gagal — tiada kunci API disimpan"
            : `Gagal — ${msg}`,
      });
    }
  };

  const request = async (text: string) => {
    if (busy || !text) return;
    const history = [...msgs, { role: "user" as const, content: text }];
    setMsgs(history);
    setInput("");
    setBusy(true);
    setThinkSec(0);
    setLive({ content: "", reasoning: "" });
    try {
      const { text: answer, via, reasoning } = await askAi(
        history.map(({ role, content }) => ({ role, content })),
        datasetSummary(list),
        {
          pro: pro && provider === "openrouter",
          onDelta: (c) => setLive((l) => (l ? { ...l, content: l.content + c } : l)),
          onReason: (r) => setLive((l) => (l ? { ...l, reasoning: l.reasoning + r } : l)),
        },
      );
      const viaLabel =
        via === provider ? PROVIDERS[via].label : `${PROVIDERS[via].label} (sandaran)`;
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content: answer,
          via: viaLabel,
          reasoning: reasoning || undefined,
        },
      ]);
    } catch (e) {
      const msg = (e as Error).message;
      const detail =
        msg === "NO_KEY"
          ? "Tiada kunci API. Buka tab Tetapan dan masukkan kunci anda sendiri — AI sebenar memerlukan kunci peribadi (percuma untuk OpenRouter, Groq atau xKiro). Penyedia lain menjadi sandaran automatik jika pilihan utama gagal."
          : `Permintaan gagal — ${msg}. Sandaran telah dicuba juga; semak kunci/model dalam tab Tetapan atau cuba penyedia lain.`;
      setMsgs((m) => [...m, { role: "assistant", content: detail, error: true }]);
    }
    setLive(null);
    setBusy(false);
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  };

  useEffect(() => {
    try {
      setPro(localStorage.getItem("md-ai-pro") === "on");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!busy) return;
    const id = window.setInterval(() => setThinkSec((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [busy]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [live]);

  const togglePro = () => {
    const next = !pro;
    setPro(next);
    try {
      localStorage.setItem("md-ai-pro", next ? "on" : "off");
    } catch {
      /* ignore */
    }
  };

  const proActive = pro && provider === "openrouter";

  return (
    <section
      aria-label="PokeX — analisis Pokémon dengan AI"
      className="relative mx-auto flex min-h-svh w-full max-w-5xl flex-col px-5 pb-10 pt-24 sm:px-8"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 top-14 hidden opacity-[0.055] select-none sm:block"
      >
        <XMark size={280} />
      </span>

      <div className="anim-rise flex shrink-0 items-center gap-4" style={{ animationDelay: "0.05s" }}>
        <span className="grid size-14 shrink-0 place-items-center rounded-[1.4rem] bg-primary-container shadow-e2 transition-transform duration-300 hover:scale-105 hover:rotate-3">
          <XMark size={32} />
        </span>
        <div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            <span className="pokex-gradient-text">PokeX</span>
          </h1>
          <p className="mt-0.5 text-sm leading-snug text-on-surface-variant">
            Analisis semua Pokémon dengan AI sebenar — kunci anda sendiri, tanpa pelayan perantara
          </p>
        </div>
        {(keyStatus.openrouter || keyStatus.groq || keyStatus.xkiro) && (
          <span className="ml-auto hidden rounded-full bg-secondary-container px-3 py-1 font-display text-[11px] font-bold text-on-secondary-container sm:block">
            Kunci aktif
          </span>
        )}
      </div>

      <div
        className="anim-rise mt-3 flex flex-wrap items-center gap-2"
        style={{ animationDelay: "0.09s" }}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/70 bg-surface-container/70 px-3 py-1 text-[11px] font-semibold text-on-surface-variant">
          <i aria-hidden className="size-1.5 rounded-full bg-[#00a878]" />
          AI sebenar
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/70 bg-surface-container/70 px-3 py-1 text-[11px] font-semibold text-on-surface-variant">
          <i aria-hidden className="size-1.5 rounded-full bg-[#ffc531]" />
          Kunci anda sendiri
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/70 bg-surface-container/70 px-3 py-1 text-[11px] font-semibold text-on-surface-variant">
          <i aria-hidden className="size-1.5 rounded-full bg-[#0ea5e9]" />
          2 penyedia • sandaran automatik
        </span>
      </div>

      <div className="anim-rise mt-6 flex shrink-0 gap-1.5 rounded-full border border-outline-variant/70 bg-surface-low/85 p-1 shadow-e1 backdrop-blur-md sm:w-fit" style={{ animationDelay: "0.12s" }}>
        {(["Sembang", "Tetapan"] as const).map((t) => (
          <button
            key={t}
            type="button"
            data-sfx="click"
            onClick={() => setTab(t === "Sembang" ? "chat" : "tetapan")}
            aria-pressed={t === "Sembang" ? tab === "chat" : tab === "tetapan"}
            className={`h-9 flex-1 rounded-full px-6 font-display text-xs font-bold transition-colors sm:flex-none ${
              (t === "Sembang" ? tab === "chat" : tab === "tetapan")
                ? "bg-primary text-on-primary shadow-e1"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "tetapan" ? (
        <div
          className="pokex-spotlight anim-rise mt-4 flex flex-col rounded-[1.75rem] border border-outline-variant p-6 shadow-e3 sm:flex-1"
          style={{ background: "var(--md-surface-container-low)", animationDelay: "0.18s" }}
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty("--spot-x", `${((e.clientX - r.left) / r.width) * 100}%`);
            e.currentTarget.style.setProperty("--spot-y", `${((e.clientY - r.top) / r.height) * 100}%`);
          }}
        >
          <label className="text-xs font-bold text-on-surface-variant">Penyedia AI</label>
          <select
            value={provider}
            onChange={(e) => {
              const next = e.target.value as AiProvider;
              setProvider(next);
              setAiProvider(next);
              setModel(getAiModel(next));
              setKeyField("");
            }}
            className="mt-1 h-11 w-full rounded-xl border border-outline-variant bg-surface-container px-3 text-sm text-on-surface outline-none"
          >
            {(Object.keys(PROVIDERS) as AiProvider[]).map((p) => (
              <option key={p} value={p}>
                {PROVIDERS[p].label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-[11px] leading-relaxed text-on-surface-variant">
            Jika penyedia pilihan gagal (HTTP / had kadar), PokeX mencuba penyedia satunya secara
            automatik.
          </p>

          <label className="mt-4 block text-xs font-bold text-on-surface-variant">Model</label>
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            onBlur={() => setAiModel(provider, model)}
            placeholder={PROVIDERS[provider].model}
            className="mt-1 h-11 w-full rounded-xl border border-outline-variant bg-surface-container px-3 font-mono text-xs text-on-surface outline-none"
          />

          <label className="mt-4 block text-xs font-bold text-on-surface-variant">
            Kunci API {PROVIDERS[provider].label}{" "}
            {keyStatus[provider] ? "(tersimpan)" : "(diperlukan)"}
          </label>
          <input
            type="password"
            value={keyField}
            onChange={(e) => setKeyField(e.target.value)}
            placeholder={PROVIDERS[provider].keyHint}
            className="mt-1 h-11 w-full rounded-xl border border-outline-variant bg-surface-container px-3 font-mono text-xs text-on-surface outline-none"
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              data-sfx="toggle-on"
              onClick={saveKey}
              className="h-10 flex-1 rounded-full bg-primary font-display text-xs font-bold text-on-primary transition-transform active:scale-95"
            >
              Simpan kunci
            </button>
            <button
              type="button"
              data-sfx="close"
              onClick={clearKey}
              disabled={!keyStatus[provider]}
              className="h-10 rounded-full border border-outline-variant px-5 font-display text-xs font-bold text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-40"
            >
              Padam
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-outline-variant/70 bg-surface-container/60 p-4">
            <p className="font-display text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Uji API masa-nyata
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-on-surface-variant">
              Hantar satu permintaan kecil ke {PROVIDERS[provider].label} — jika gagal, sandaran
              automatik mencuba penyedia satunya.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                data-sfx="click"
                onClick={() => void runApiTest()}
                disabled={test.status === "testing"}
                className="h-10 shrink-0 rounded-full bg-secondary-container px-5 font-display text-xs font-bold text-on-secondary-container transition-transform active:scale-95 disabled:opacity-50"
              >
                {test.status === "testing" ? "Menguji…" : "Uji API"}
              </button>
              {test.status !== "idle" && (
                <p
                  role={test.status === "fail" ? "alert" : "status"}
                  className={`text-xs font-semibold ${
                    test.status === "testing"
                      ? "animate-pulse text-on-surface-variant"
                      : test.status === "ok"
                        ? "text-[#00a878]"
                        : "text-[var(--md-error)]"
                  }`}
                >
                  {test.note}
                </p>
              )}
            </div>
          </div>

          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-semibold text-on-surface-variant">
            <span>Kunci OpenRouter: {keyStatus.openrouter ? "tersimpan ✓" : "tiada"}</span>
            <span>Kunci Groq: {keyStatus.groq ? "tersimpan ✓" : "tiada"}</span>
            <span>Kunci xKiro: {keyStatus.xkiro ? "tersimpan ✓" : "tiada"}</span>
          </p>
          <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
            Kunci disimpan <b>hanya dalam pelayar anda</b> (localStorage) dan dihantar terus ke
            penyedia pilihan — tidak melalui pelayan laman. Kunci percuma:{" "}
            <a
              href={PROVIDERS[provider].keyUrl}
              target="_blank"
              rel="noreferrer"
              data-sfx="click"
              className="font-semibold text-primary underline underline-offset-2"
            >
              {PROVIDERS[provider].label}
            </a>
          </p>
        </div>
      ) : (
        <div
          className="pokex-spotlight anim-rise mt-4 flex min-h-[26rem] flex-1 flex-col overflow-hidden rounded-[1.75rem] border border-outline-variant shadow-e3"
          style={{ background: "var(--md-surface-container-low)", animationDelay: "0.18s" }}
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty("--spot-x", `${((e.clientX - r.left) / r.width) * 100}%`);
            e.currentTarget.style.setProperty("--spot-y", `${((e.clientY - r.top) / r.height) * 100}%`);
          }}
        >
          <div className="flex shrink-0 items-center gap-2.5 border-b border-outline-variant/60 px-5 py-3">
            <XMark size={18} />
            <p className="font-display text-sm font-extrabold text-on-surface">Sembang PokeX</p>
            <span className="ml-auto rounded-full bg-secondary-container px-2.5 py-1 text-[10px] font-bold text-on-secondary-container">
              {PROVIDERS[getAiProvider()].label}
            </span>
          </div>

          <div className="px-5 pt-4">
            <button
              type="button"
              data-sfx="click"
              onClick={() => void request("Analisis keseluruhan set 1,025 Pokémon berdasarkan statistik dataset yang diberikan — ringkaskan penemuan utama dalam poin: taburan jenis, taburan generasi, dan gabungan dwi-jenis paling menonjol.")}
              disabled={busy || list.length === 0}
              className="h-11 w-full rounded-full bg-primary font-display text-sm font-bold text-on-primary shadow-e1 transition-transform active:scale-95 disabled:opacity-40"
            >
              Analisis Semua Pokémon (1,025)
            </button>

            <div className="mt-3 flex items-center gap-2.5 rounded-2xl border border-outline-variant/70 bg-surface-container/60 px-3.5 py-2.5">
              <button
                type="button"
                data-sfx="toggle-on"
                onClick={togglePro}
                disabled={provider !== "openrouter"}
                aria-pressed={proActive}
                aria-label="Pro Thinking (khusus OpenRouter)"
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-40 ${
                  proActive ? "bg-primary" : "bg-surface-container-highest"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute top-0.5 size-6 rounded-full bg-white shadow-e1 transition-all ${
                    proActive ? "left-[1.375rem]" : "left-0.5"
                  }`}
                />
              </button>
              <div className="min-w-0">
                <p className="font-display text-xs font-extrabold text-on-surface">
                  Pro Thinking
                  <span className="ml-1.5 rounded-full bg-tertiary-container px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-on-tertiary-container">
                    OpenRouter sahaja
                  </span>
                </p>
                <p className="text-[10px] leading-snug text-on-surface-variant">
                  {provider !== "openrouter"
                    ? "Tukar penyedia ke OpenRouter dalam Tetapan untuk aktifkan."
                    : `Fikir mendalam ${PRO_THINK_SECONDS} saat dengan reasoning effort tinggi.`}
                </p>
              </div>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="no-scrollbar flex-1 overflow-y-auto px-5 pt-3"
            style={{ minHeight: "12rem" }}
          >
            {msgs.length === 0 && !busy && (
              <div className="flex h-full flex-col items-center justify-center gap-2 py-8 text-center">
                <span className="grid size-12 place-items-center rounded-full bg-surface-container">
                  <XMark size={26} />
                </span>
                <p className="max-w-sm text-xs leading-relaxed text-on-surface-variant">
                  Tanya apa sahaja tentang Pokémon — statistik Pokédex (jenis, generasi, dwi-jenis)
                  dihantar bersama setiap soalan sebagai konteks.
                </p>
              </div>
            )}
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`mb-3 flex items-end gap-2 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role === "assistant" && (
                  <span
                    aria-hidden
                    className="grid size-7 shrink-0 place-items-center rounded-full bg-surface-container-high shadow-e1"
                  >
                    <XMark size={15} />
                  </span>
                )}
                <div
                  className={`flex max-w-[88%] flex-col ${
                    m.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <p
                    role={m.error ? "alert" : undefined}
                    className={`whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-e1 ${
                      m.role === "user"
                        ? "text-on-primary"
                        : "border border-outline-variant bg-surface-container text-on-surface"
                    }`}
                    style={
                      m.error
                        ? { borderColor: "var(--md-error)" }
                        : m.role === "user"
                          ? { background: "linear-gradient(135deg, var(--md-primary), var(--md-tertiary))" }
                          : undefined
                    }
                  >
                    {renderRich(m.content)}
                  </p>
                  {m.role === "assistant" && m.via && (
                    <span className="mt-1 px-1 text-[10px] font-semibold text-on-surface-variant">
                      via {m.via}
                    </span>
                  )}
                  {m.role === "assistant" && m.reasoning && (
                    <details className="mt-1 w-full rounded-xl border border-outline-variant/70 bg-surface-container/60 px-3 py-2">
                      <summary className="cursor-pointer font-display text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Proses pemikiran Pro
                      </summary>
                      <p className="mt-1.5 whitespace-pre-wrap text-[11px] leading-relaxed text-on-surface-variant">
                        {m.reasoning}
                      </p>
                    </details>
                  )}
                </div>
              </div>
            ))}
            {live && (live.content || live.reasoning) && (
              <div className="mb-3 flex items-end justify-start gap-2" role="status" aria-live="polite">
                <span
                  aria-hidden
                  className="grid size-7 shrink-0 place-items-center rounded-full bg-surface-container-high shadow-e1"
                >
                  <XMark size={15} />
                </span>
                <div className="flex max-w-[88%] flex-col items-start">
                  {live.content && (
                    <p className="pokex-caret whitespace-pre-wrap rounded-2xl border border-outline-variant bg-surface-container px-4 py-2.5 text-[13px] leading-relaxed text-on-surface shadow-e1">
                      {renderRich(live.content)}
                    </p>
                  )}
                  {live.reasoning && (
                    <p
                      className={`whitespace-pre-wrap px-1 text-[11px] italic leading-relaxed text-on-surface-variant/80 ${
                        live.content ? "mt-1 max-h-24 overflow-hidden" : "max-h-32 overflow-hidden"
                      }`}
                    >
                      {live.reasoning}
                    </p>
                  )}
                </div>
              </div>
            )}
            {busy && !live?.content && (
              <div className="mb-3 flex justify-start" role="status" aria-live="polite">
                <div
                  className={`rounded-2xl border px-4 py-3 shadow-e1 ${
                    proActive
                      ? "w-full border-primary/40 bg-surface-container"
                      : "border-outline-variant bg-surface-container"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="pokex-think-dots" aria-hidden>
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="pokex-shiny font-display text-[13px] font-bold">
                      {proActive ? "PokeX Pro Thinking" : "PokeX sedang berfikir"}
                    </span>
                    <span
                      className="pokex-think-words text-[11px] font-semibold text-on-surface-variant"
                      aria-hidden
                    >
                      <em>menganalisis data…</em>
                      <em>merumus jawapan…</em>
                      <em>menyusun poin…</em>
                    </span>
                  </div>
                  {proActive && (
                    <div className="mt-2.5 flex items-center gap-2.5">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-container-high">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, (thinkSec / PRO_THINK_SECONDS) * 100)}%`,
                            background: "linear-gradient(90deg, #2dd4bf, #0ea5e9)",
                            transition: "width 1s linear",
                          }}
                        />
                      </div>
                      <span className="shrink-0 font-display text-[10px] font-bold tabular-nums text-on-surface-variant">
                        {Math.min(thinkSec, PRO_THINK_SECONDS)}s / {PRO_THINK_SECONDS}s
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-5 pb-2 pt-1">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                data-sfx="click"
                onClick={() => void request(p)}
                disabled={busy || list.length === 0}
                className="shrink-0 rounded-full border border-outline-variant px-3.5 py-1.5 text-[11px] font-semibold text-on-surface-variant transition-all hover:border-primary/50 hover:bg-surface-container hover:text-on-surface disabled:opacity-40"
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-end gap-2 px-5 pb-5 pt-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void request(input.trim());
                }
              }}
              placeholder="Tanya… cth. jenis terkuat Gen 5?"
              rows={1}
              aria-label="Soalan untuk PokeX"
              className="max-h-24 min-h-11 flex-1 resize-y rounded-2xl border border-outline-variant bg-surface-container px-4 py-2.5 text-sm text-on-surface outline-none transition-colors focus:border-primary"
            />
            <button
              type="button"
              data-sfx="click"
              onClick={() => void request(input.trim())}
              disabled={busy || input.trim().length === 0}
              aria-label="Hantar soalan"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-on-primary transition-transform active:scale-90 disabled:opacity-40"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M4 12h15m0 0-6-6m6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
