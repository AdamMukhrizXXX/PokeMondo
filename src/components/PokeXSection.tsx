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
  type AiProvider,
} from "../lib/ai";

type Msg = { role: "user" | "assistant"; content: string; error?: boolean };

const PRESETS = [
  "Ringkaskan keseluruhan Pokédex ini",
  "Analisis jenis paling dominan dan mengapa",
  "Bandingkan sembilan generasi ini",
  "Cadangkan 6 Pokémon untuk pasukan seimbang",
] as const;

function Sparkle({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 4c1 3 2.5 4.5 5.5 5.5C14.5 10.5 13 12 12 15c-1-3-2.5-4.5-5.5-5.5C9.5 8.5 11 7 12 4Z" />
      <path d="M18.5 14.5c.5 1.5 1.3 2.3 2.8 2.8-1.5.5-2.3 1.3-2.8 2.8-.5-1.5-1.3-2.3-2.8-2.8 1.5-.5 2.3-1.3 2.8-2.8Z" />
    </svg>
  );
}

export default function PokeXSection({ list }: { list: BasicPokemon[] }) {
  const [tab, setTab] = useState<"chat" | "tetapan">("chat");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [provider, setProvider] = useState<AiProvider>("mistral");
  const [model, setModel] = useState("");
  const [keyField, setKeyField] = useState("");
  const [keySet, setKeySet] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setProvider(getAiProvider());
    setModel(getAiModel());
    setKeySet(!!getAiKey());
  }, []);

  const saveKey = () => {
    const v = keyField.trim();
    setAiKey(v);
    setKeySet(!!v);
    setKeyField("");
    setTab("chat");
  };

  const clearKey = () => {
    setAiKey("");
    setKeySet(false);
  };

  const request = async (text: string) => {
    if (busy || !text) return;
    const history = [...msgs, { role: "user" as const, content: text }];
    setMsgs(history);
    setInput("");
    setBusy(true);
    try {
      const answer = await askAi(
        history.map(({ role, content }) => ({ role, content })),
        datasetSummary(list),
      );
      setMsgs((m) => [...m, { role: "assistant", content: answer }]);
    } catch (e) {
      const msg = (e as Error).message;
      const detail =
        msg === "NO_KEY"
          ? "Tiada kunci API. Buka tab Tetapan dan masukkan kunci anda sendiri — AI sebenar memerlukan kunci peribadi (percuma untuk Gemini, OpenRouter, atau Mistral)."
          : `Permintaan gagal: ${msg}. Jika pelayar menyekat permintaan (CORS), cuba penyedia lain seperti Gemini atau OpenRouter.`;
      setMsgs((m) => [...m, { role: "assistant", content: detail, error: true }]);
    }
    setBusy(false);
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  };

  return (
    <section aria-label="PokeX — analisis Pokémon dengan AI" className="mx-auto w-full max-w-3xl px-5 pb-24 pt-24 sm:px-8">
      <div className="anim-rise flex items-center gap-4" style={{ animationDelay: "0.05s" }}>
        <span className="grid size-14 shrink-0 place-items-center rounded-[1.4rem] bg-primary-container text-on-primary-container shadow-e2 transition-transform duration-300 hover:scale-105 hover:rotate-3">
          <Sparkle size={30} />
        </span>
        <div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-on-surface sm:text-5xl">
            Poke<span className="text-primary">X</span>
          </h1>
          <p className="mt-0.5 text-sm leading-snug text-on-surface-variant">
            Analisis semua Pokémon dengan AI sebenar — kunci anda sendiri, tanpa pelayan perantara
          </p>
        </div>
        {keySet && (
          <span className="ml-auto hidden rounded-full bg-secondary-container px-3 py-1 font-display text-[11px] font-bold text-on-secondary-container sm:block">
            Kunci aktif
          </span>
        )}
      </div>

      <div className="anim-rise mt-6 flex gap-1.5 rounded-full border border-outline-variant/70 bg-surface-low/85 p-1 shadow-e1 backdrop-blur-md sm:w-fit" style={{ animationDelay: "0.12s" }}>
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
          className="anim-rise mt-4 rounded-[1.75rem] border border-outline-variant p-6 shadow-e3"
          style={{ background: "var(--md-surface-container-low)", animationDelay: "0.18s" }}
        >
          <label className="text-xs font-bold text-on-surface-variant">Penyedia AI</label>
          <select
            value={provider}
            onChange={(e) => {
              const next = e.target.value as AiProvider;
              setProvider(next);
              setAiProvider(next);
              setModel(PROVIDERS[next].model);
            }}
            className="mt-1 h-11 w-full rounded-xl border border-outline-variant bg-surface-container px-3 text-sm text-on-surface outline-none"
          >
            {(Object.keys(PROVIDERS) as AiProvider[]).map((p) => (
              <option key={p} value={p}>
                {PROVIDERS[p].label}
              </option>
            ))}
          </select>

          <label className="mt-4 block text-xs font-bold text-on-surface-variant">Model</label>
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            onBlur={() => setAiModel(model)}
            placeholder={PROVIDERS[provider].model}
            className="mt-1 h-11 w-full rounded-xl border border-outline-variant bg-surface-container px-3 font-mono text-xs text-on-surface outline-none"
          />

          <label className="mt-4 block text-xs font-bold text-on-surface-variant">
            Kunci API {keySet ? "(tersimpan)" : "(diperlukan)"}
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
              disabled={!keySet}
              className="h-10 rounded-full border border-outline-variant px-5 font-display text-xs font-bold text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-40"
            >
              Padam
            </button>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-on-surface-variant">
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
          className="anim-rise mt-4 flex h-[min(74svh,42rem)] flex-col overflow-hidden rounded-[1.75rem] border border-outline-variant shadow-e3"
          style={{ background: "var(--md-surface-container-low)", animationDelay: "0.18s" }}
        >
          <div className="px-5 pt-5">
            <button
              type="button"
              data-sfx="click"
              onClick={() => void request("Analisis keseluruhan set 1,025 Pokémon berdasarkan statistik dataset yang diberikan — ringkaskan penemuan utama dalam poin: taburan jenis, taburan generasi, dan gabungan dwi-jenis paling menonjol.")}
              disabled={busy || list.length === 0}
              className="h-11 w-full rounded-full bg-primary font-display text-sm font-bold text-on-primary shadow-e1 transition-transform active:scale-95 disabled:opacity-40"
            >
              Analisis Semua Pokémon (1,025)
            </button>
          </div>

          <div
            ref={scrollRef}
            className="no-scrollbar flex-1 overflow-y-auto px-5 pt-3"
            style={{ minHeight: "12rem" }}
          >
            {msgs.length === 0 && !busy && (
              <div className="flex h-full flex-col items-center justify-center gap-2 py-8 text-center">
                <span className="grid size-12 place-items-center rounded-full bg-surface-container text-primary">
                  <Sparkle size={24} />
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
                className={`mb-3 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  role={m.error ? "alert" : undefined}
                  className={`max-w-[92%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-e1 ${
                    m.role === "user"
                      ? "bg-primary text-on-primary"
                      : "border border-outline-variant bg-surface-container text-on-surface"
                  }`}
                  style={m.error ? { borderColor: "var(--md-error)" } : undefined}
                >
                  {m.content}
                </p>
              </div>
            ))}
            {busy && (
              <p className="mb-3 animate-pulse text-xs font-semibold text-on-surface-variant">
                PokeX sedang berfikir…
              </p>
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
                className="shrink-0 rounded-full border border-outline-variant px-3.5 py-1.5 text-[11px] font-semibold text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-40"
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
              className="max-h-24 min-h-11 flex-1 resize-y rounded-2xl border border-outline-variant bg-surface-container px-4 py-2.5 text-sm text-on-surface outline-none"
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
