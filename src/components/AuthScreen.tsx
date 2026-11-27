"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { loginUser, registerUser, validEmail, validPassword, type SessionInfo } from "../lib/auth";

type Mode = "masuk" | "daftar";

export default function AuthScreen({ onAuthed }: { onAuthed: (s: SessionInfo) => void }) {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>("masuk");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError("");
    if (!validEmail(email)) {
      setError("Format emel tidak sah.");
      return;
    }
    if (!validPassword(pass)) {
      setError("Kata laluan mesti sekurang-kurangnya 6 aksara.");
      return;
    }
    if (mode === "daftar" && pass !== pass2) {
      setError("Pengesahan kata laluan tidak sepadan.");
      return;
    }
    setBusy(true);
    try {
      const session =
        mode === "daftar"
          ? await registerUser(email, pass)
          : await loginUser(email, pass);
      onAuthed(session);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return createPortal(
    <div
      className="auth-root fixed inset-0 z-[70] grid place-items-center overflow-y-auto px-4 py-10"
      style={{ background: "var(--md-surface)" }}
      role="dialog"
      aria-label="Log masuk PokeMondo"
    >
      <div className="anim-rise w-full max-w-md">
        <div className="mb-5 flex flex-col items-center gap-2 text-center">
          <span
            aria-hidden
            className="grid size-16 place-items-center rounded-[1.6rem] bg-primary-container shadow-e2"
          >
            <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden>
              <defs>
                <linearGradient id="auth-ball" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#ff6a48" />
                  <stop offset="1" stopColor="#e3350d" />
                </linearGradient>
              </defs>
              <circle cx="12" cy="12" r="9.2" fill="url(#auth-ball)" stroke="#1a1a1a" strokeWidth="1.6" />
              <path d="M2.8 12h18.4" stroke="#1a1a1a" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="3.1" fill="#ffffff" stroke="#1a1a1a" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="1.2" fill="#1a1a1a" />
            </svg>
          </span>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            <span className="pokex-gradient-text">PokeMondo</span>
          </h1>
          <p className="max-w-xs text-xs leading-relaxed text-on-surface-variant">
            Log masuk untuk menjelajah 1,025 Pokémon dari sembilan generasi
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-outline-variant bg-surface-container-low p-6 shadow-e3 sm:p-7">
          <div className="flex gap-1.5 rounded-full border border-outline-variant/70 bg-surface-container/70 p-1">
            {(["masuk", "daftar"] as const).map((m) => (
              <button
                key={m}
                type="button"
                data-sfx="click"
                onClick={() => {
                  setMode(m);
                  setError("");
                }}
                aria-pressed={mode === m}
                className={`h-9 flex-1 rounded-full font-display text-xs font-bold capitalize transition-colors ${
                  mode === m
                    ? "bg-primary text-on-primary shadow-e1"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {m === "masuk" ? "Log Masuk" : "Daftar"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-5 flex flex-col gap-3.5">
            <label className="block">
              <span className="text-xs font-bold text-on-surface-variant">Emel</span>
              <div className="relative mt-1">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2.5" />
                  <path d="m3.5 7 8.5 6 8.5-6" />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anda@contoh.com"
                  autoComplete="email"
                  required
                  className="h-12 w-full rounded-xl border border-outline-variant bg-surface-container pl-10 pr-3.5 text-sm text-on-surface outline-none transition-colors focus:border-primary"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs font-bold text-on-surface-variant">Kata laluan</span>
              <div className="relative mt-1">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant"
                >
                  <rect x="4" y="10.5" width="16" height="9.5" rx="2.5" />
                  <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
                </svg>
                <input
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder={mode === "daftar" ? "Sekurang-kurangnya 6 aksara" : "Kata laluan anda"}
                  autoComplete={mode === "daftar" ? "new-password" : "current-password"}
                  required
                  minLength={6}
                  className="h-12 w-full rounded-xl border border-outline-variant bg-surface-container pl-10 pr-3.5 text-sm text-on-surface outline-none transition-colors focus:border-primary"
                />
              </div>
            </label>

            {mode === "daftar" && (
              <label className="block">
                <span className="text-xs font-bold text-on-surface-variant">Sahkan kata laluan</span>
                <input
                  type="password"
                  value={pass2}
                  onChange={(e) => setPass2(e.target.value)}
                  placeholder="Ulang kata laluan"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="mt-1 h-12 w-full rounded-xl border border-outline-variant bg-surface-container px-3.5 text-sm text-on-surface outline-none transition-colors focus:border-primary"
                />
              </label>
            )}

            {error && (
              <p role="alert" className="rounded-xl border border-[var(--md-error)] bg-surface-container px-3.5 py-2.5 text-xs font-semibold text-[var(--md-error)]">
                {error}
              </p>
            )}

            <button
              type="submit"
              data-sfx="toggle-on"
              disabled={busy}
              className="h-12 rounded-full bg-primary font-display text-sm font-bold text-on-primary shadow-e1 transition-transform active:scale-95 disabled:opacity-50"
            >
              {busy
                ? "Memproses…"
                : mode === "masuk"
                  ? "Masuk ke PokeMondo"
                  : "Daftar & Masuk"}
            </button>
          </form>

          <p className="mt-4 text-center text-[11px] leading-relaxed text-on-surface-variant">
            Akaun disimpan hanya dalam pelayar anda — kata laluan dihash SHA-256, tanpa pelayan
            dan tanpa data dihantar ke mana-mana.
          </p>
        </div>

        <p className="mt-4 text-center text-[10px] font-semibold text-on-surface-variant">
          PokeMondo × PokéAPI — tidak rasmi, dibina untuk peminat
        </p>
      </div>
    </div>,
    document.body,
  );
}
