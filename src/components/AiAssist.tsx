"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
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

export default function AiAssist({ list }: { list: BasicPokemon[] }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"chat" | "tetapan">("chat");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [provider, setProvider] = useState<AiProvider>("mistral");
  const [model, setModel] = useState("");
  const [keyField, setKeyField] = useState("");
  const [keySet, setKeySet] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const onToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      setProvider(getAiProvider());
      setModel(getAiModel());
      setKeySet(!!getAiKey());
    }
  };

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
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-label="AI Anal Pokémon — analisis semua Pokémon dengan AI sebenar"
        className={`relative grid size-10 place-items-center rounded-full transition-colors ${
          open ? "bg-primary text-on-primary" : "bg-secondary-container text-on-secondary-container"
        }`}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 4c1 3 2.5 4.5 5.5 5.5C14.5 10.5 13 12 12 15c-1-3-2.5-4.5-5.5-5.5C9.5 8.5 11 7 12 4Z" />
          <path d="M18.5 14.5c.5 1.5 1.3 2.3 2.8 2.8-1.5.5-2.3 1.3-2.8 2.8-.5-1.5-1.3-2.3-2.8-2.8 1.5-.5 2.3-1.3 2.8-2.8Z" />
        </svg>
        {keySet && <span aria-hidden className="absolute right-1 top-1 size-2 rounded-full bg-[#f0a92e]" />}
      </button>

      {open &&
        createPortal(
        <div
          data-portal-panel
          className="anim-rise fixed inset-x-3 top-[4.5rem] z-50 flex max-h-[82svh] flex-col overflow-hidden rounded-[1.75rem] border border-outline-variant shadow-e3 sm:inset-x-auto sm:right-6 sm:w-[25rem]"
          style={{ background: "var(--md-surface-container-low)" }}
        >
          <div className="flex items-center justify-between gap-2 px-5 pb-2 pt-4">
            <div>
              <p className="font-display text-sm font-extrabold tracking-tight text-on-surface">
                AI Anal Pokémon
              </p>
              <p className="text-[11px] text-on-surface-variant">
                AI sebenar melalui API — bukan skrip bawaan
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              data-sfx="close"
              aria-label="Tutup AI"
              className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-container-high text-on-surface-variant transition-colors hover:bg-surface-container-highest"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <div className="flex gap-1 px-5 pb-3">
            {(["Sembang", "Tetapan"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t === "Sembang" ? "chat" : "tetapan")}
                aria-pressed={t === "Sembang" ? tab === "chat" : tab === "tetapan"}
                className={`h-8 flex-1 rounded-full font-display text-xs font-bold transition-colors ${
                  (t === "Sembang" ? tab === "chat" : tab === "tetapan")
                    ? "bg-secondary-container text-on-secondary-container"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "tetapan" ? (
            <div className="overflow-y-auto px-5 pb-5">
              <label className="text-xs font-bold text-on-surface-variant">Penyedia AI</label>
              <select
                value={provider}
                onChange={(e) => {
                  const next = e.target.value as AiProvider;
                  setProvider(next);
                  setAiProvider(next);
                  setModel(PROVIDERS[next].model);
                }}
                className="mt-1 h-10 w-full rounded-xl border border-outline-variant bg-surface-container px-3 text-sm text-on-surface outline-none"
              >
                {(Object.keys(PROVIDERS) as AiProvider[]).map((p) => (
                  <option key={p} value={p}>
                    {PROVIDERS[p].label}
                  </option>
                ))}
              </select>

              <label className="mt-3 block text-xs font-bold text-on-surface-variant">Model</label>
              <input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                onBlur={() => setAiModel(model)}
                placeholder={PROVIDERS[provider].model}
                className="mt-1 h-10 w-full rounded-xl border border-outline-variant bg-surface-container px-3 font-mono text-xs text-on-surface outline-none"
              />

              <label className="mt-3 block text-xs font-bold text-on-surface-variant">
                Kunci API {keySet ? "(tersimpan)" : "(diperlukan)"}
              </label>
              <input
                type="password"
                value={keyField}
                onChange={(e) => setKeyField(e.target.value)}
                placeholder={PROVIDERS[provider].keyHint}
                className="mt-1 h-10 w-full rounded-xl border border-outline-variant bg-surface-container px-3 font-mono text-xs text-on-surface outline-none"
              />
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={saveKey}
                  className="h-9 flex-1 rounded-full bg-primary font-display text-xs font-bold text-on-primary transition-transform active:scale-95"
                >
                  Simpan kunci
                </button>
                <button
                  type="button"
                  onClick={clearKey}
                  disabled={!keySet}
                  className="h-9 rounded-full border border-outline-variant px-4 font-display text-xs font-bold text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-40"
                >
                  Padam
                </button>
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-on-surface-variant">
                Kunci disimpan <b>hanya dalam pelayar anda</b> (localStorage) dan dihantar terus
                ke penyedia pilihan — tidak melalui pelayan laman. Kunci percuma:{" "}
                <a
                  href={PROVIDERS[provider].keyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary underline underline-offset-2"
                >
                  {PROVIDERS[provider].label}
                </a>
              </p>
            </div>
          ) : (
            <>
              <div className="px-5">
                <button
                  type="button"
                  onClick={() => void request("Analisis keseluruhan set 1,025 Pokémon berdasarkan statistik dataset yang diberikan — ringkaskan penemuan utama dalam poin: taburan jenis, taburan generasi, dan gabungan dwi-jenis paling menonjol.")}
                  disabled={busy || list.length === 0}
                  className="h-10 w-full rounded-full bg-primary font-display text-sm font-bold text-on-primary shadow-e1 transition-transform active:scale-95 disabled:opacity-40"
                >
                  Analisis Semua Pokémon (1,025)
                </button>
              </div>

              <div
                ref={scrollRef}
                className="mt-3 flex-1 overflow-y-auto px-5"
                style={{ minHeight: "10rem" }}
              >
                {msgs.length === 0 && !busy && (
                  <p className="py-4 text-center text-xs leading-relaxed text-on-surface-variant">
                    Tanya apa sahaja tentang Pokémon — statistik Pokédex (jenis, generasi,
                    dwi-jenis) dihantar bersama setiap soalan sebagai konteks.
                  </p>
                )}
                {msgs.map((m, i) => (
                  <div
                    key={i}
                    className={`mb-3 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <p
                      role={m.error ? "alert" : undefined}
                      className={`max-w-[92%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
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
                    AI sedang berfikir…
                  </p>
                )}
              </div>

              <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-5 pb-2 pt-1">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => void request(p)}
                    disabled={busy || list.length === 0}
                    className="shrink-0 rounded-full border border-outline-variant px-3.5 py-1.5 text-[11px] font-semibold text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-40"
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="flex items-end gap-2 px-5 pb-4 pt-1">
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
                  aria-label="Soalan untuk AI"
                  className="max-h-24 min-h-10 flex-1 resize-y rounded-2xl border border-outline-variant bg-surface-container px-3.5 py-2.5 text-sm text-on-surface outline-none"
                />
                <button
                  type="button"
                  onClick={() => void request(input.trim())}
                  disabled={busy || input.trim().length === 0}
                  aria-label="Hantar soalan"
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-on-primary transition-transform active:scale-90 disabled:opacity-40"
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
            </>
          )}
        </div>,
        document.body
      )}
    </>
  );
}
