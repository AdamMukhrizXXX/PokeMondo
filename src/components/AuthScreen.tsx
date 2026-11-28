"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  commitLogin,
  commitRegistration,
  generateOtp,
  OTP_TTL_MS,
  prepareRegistration,
  validEmail,
  validPassword,
  verifyLogin,
  type PendingReg,
  type SessionInfo,
} from "../lib/auth";

type Mode = "masuk" | "daftar";
type Pending = { type: "reg"; data: PendingReg } | { type: "login"; email: string } | null;

function OtpBoxes({
  digits,
  refs,
  disabled,
  shake,
  verified,
  onChange,
}: {
  digits: string[];
  refs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  disabled: boolean;
  shake: boolean;
  verified: boolean;
  onChange: (i: number, v: string) => void;
}) {
  return (
    <div className={`flex justify-center gap-2 ${shake ? "otp-shake" : ""}`} role="group" aria-label="Kod OTP 6 digit">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={d}
          onChange={(e) => onChange(i, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
          }}
          onPaste={(e) => {
            e.preventDefault();
            const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
            if (!pasted) return;
            for (let j = 0; j < pasted.length; j++) onChange(j, pasted[j]);
          }}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          disabled={disabled || verified}
          aria-label={`Digit ${i + 1}`}
          className={`otp-box otp-pop h-14 w-11 rounded-xl border-2 bg-surface-container text-center font-display text-xl font-extrabold text-on-surface outline-none transition-all sm:w-12 ${
            verified
              ? "otp-success border-[#00a878] bg-tertiary-container"
              : d
                ? "border-primary/60"
                : "border-outline-variant"
          }`}
          style={{ animationDelay: `${i * 0.05}s` }}
        />
      ))}
    </div>
  );
}

export default function AuthScreen({ onAuthed }: { onAuthed: (s: SessionInfo) => void }) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [mode, setMode] = useState<Mode>("masuk");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [pending, setPending] = useState<Pending>(null);
  const [otp, setOtp] = useState<{ code: string; expiresAt: number } | null>(null);
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(false);
  const [verified, setVerified] = useState(false);
  const [left, setLeft] = useState(0);
  const [resends, setResends] = useState(0);
  const [copied, setCopied] = useState(false);
  const boxRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (step !== "otp") return;
    const tick = () => setLeft(Math.max(0, (otp?.expiresAt ?? 0) - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [step, otp]);

  if (!mounted) return null;

  const mm = Math.floor(left / 60000);
  const ss = String(Math.floor((left % 60000) / 1000)).padStart(2, "0");
  const expired = left <= 0;

  const startOtp = (p: Exclude<Pending, null>) => {
    setPending(p);
    setOtp({ code: generateOtp(), expiresAt: Date.now() + OTP_TTL_MS });
    setDigits(Array(6).fill(""));
    setResends(0);
    setError("");
    setStep("otp");
    window.setTimeout(() => boxRefs.current[0]?.focus(), 80);
  };

  const submitForm = async (e: React.FormEvent) => {
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
      if (mode === "daftar") {
        const data = await prepareRegistration(email, pass);
        startOtp({ type: "reg", data });
      } else {
        const key = await verifyLogin(email, pass);
        startOtp({ type: "login", email: key });
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const verify = async (code: string) => {
    if (busy || verified || !pending || !otp) return;
    if (expired) {
      setError("Kod OTP tamat tempoh — tekan Hantar Semula untuk kod baharu (tanpa had).");
      return;
    }
    if (code !== otp.code) {
      setShake(true);
      window.setTimeout(() => setShake(false), 500);
      setDigits(Array(6).fill(""));
      boxRefs.current[0]?.focus();
      setError("Kod OTP salah — cuba lagi (percubaan tanpa had).");
      return;
    }
    setError("");
    setVerified(true);
    await new Promise((r) => window.setTimeout(r, 750));
    try {
      const session =
        pending.type === "reg" ? await commitRegistration(pending.data) : commitLogin(pending.email);
      onAuthed(session);
    } catch (err) {
      setVerified(false);
      setError((err as Error).message);
    }
  };

  const onDigit = (i: number, v: string) => {
    if (verified) return;
    const digit = v.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = digit;
    setDigits(next);
    setError("");
    if (digit && i < 5) boxRefs.current[i + 1]?.focus();
    if (next.every((d) => d !== "")) void verify(next.join(""));
  };

  const resend = () => {
    setOtp({ code: generateOtp(), expiresAt: Date.now() + OTP_TTL_MS });
    setDigits(Array(6).fill(""));
    setVerified(false);
    setCopied(false);
    setResends((r) => r + 1);
    setError("");
    window.setTimeout(() => boxRefs.current[0]?.focus(), 60);
  };

  const copyCode = async () => {
    if (!otp) return;
    try {
      await navigator.clipboard.writeText(otp.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  const backToForm = () => {
    setStep("form");
    setPending(null);
    setOtp(null);
    setDigits(Array(6).fill(""));
    setVerified(false);
    setError("");
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
            {step === "form"
              ? "Log masuk untuk menjelajah 1,025 Pokémon dari sembilan generasi"
              : "Pengesahan dua langkah untuk keselamatan lebih ketat"}
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-outline-variant bg-surface-container-low p-6 shadow-e3 sm:p-7">
          {step === "form" ? (
            <>
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

              <form onSubmit={submitForm} className="mt-5 flex flex-col gap-3.5">
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
                  {busy ? "Memproses…" : mode === "masuk" ? "Teruskan" : "Daftar & Teruskan"}
                </button>
              </form>

              <p className="mt-4 text-center text-[11px] leading-relaxed text-on-surface-variant">
                Langkah seterusnya: pengesahan kod OTP 6 digit. Akaun disimpan hanya dalam pelayar anda
                — kata laluan dihash SHA-256, tanpa pelayan.
              </p>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center gap-2 text-center">
                <span aria-hidden className="otp-envelope grid size-14 place-items-center rounded-full bg-secondary-container text-on-secondary-container shadow-e1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="3" y="5" width="18" height="14" rx="2.5" />
                    <path d="m3.5 7 8.5 6 8.5-6" />
                    <path d="M18.5 3.5v.01M21 6v.01" strokeWidth="2.4" />
                  </svg>
                </span>
                <p className="font-display text-lg font-extrabold text-on-surface">Masukkan Kod OTP</p>
                <p className="text-xs leading-relaxed text-on-surface-variant">
                  Kod 6 digit untuk <b className="text-on-surface">{pending?.type === "reg" ? pending.data.email : pending?.type === "login" ? pending.email : ""}</b>
                </p>
              </div>

              <div className="mt-4 rounded-2xl border-2 border-dashed border-outline-variant/70 bg-surface-container/60 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Peti mel simulasi
                  </span>
                  <button
                    type="button"
                    data-sfx="click"
                    onClick={() => void copyCode()}
                    className="rounded-full bg-secondary-container px-2.5 py-1 text-[10px] font-bold text-on-secondary-container transition-transform active:scale-95"
                  >
                    {copied ? "Disalin ✓" : "Salin kod"}
                  </button>
                </div>
                <p className="mt-1.5 text-center font-display text-2xl font-extrabold tracking-[0.4em] text-on-surface">
                  {otp?.code ?? "······"}
                </p>
                <p className="mt-1 text-center text-[10px] leading-relaxed text-on-surface-variant">
                  Laman ini statik tanpa pelayan emel — kod OTP rawak dipaparkan di sini. Percubaan
                  &amp; hantar semula tanpa had.
                </p>
              </div>

              <div className="mt-5">
                <OtpBoxes
                  digits={digits}
                  refs={boxRefs}
                  disabled={expired}
                  shake={shake}
                  verified={verified}
                  onChange={onDigit}
                />
              </div>

              {error && (
                <p role="alert" className="mt-3 rounded-xl border border-[var(--md-error)] bg-surface-container px-3.5 py-2.5 text-center text-xs font-semibold text-[var(--md-error)]">
                  {error}
                </p>
              )}

              {verified ? (
                <p className="mt-3 text-center font-display text-xs font-bold text-[#00a878]" role="status">
                  Kod disahkan — membuka PokeMondo…
                </p>
              ) : (
                <p className={`mt-3 text-center text-xs font-semibold tabular-nums ${expired ? "text-[var(--md-error)]" : "text-on-surface-variant"}`}>
                  {expired ? "Kod tamat tempoh" : `Sah selama ${mm}:${ss}`}
                </p>
              )}

              <button
                type="button"
                data-sfx="toggle-on"
                onClick={() => void verify(digits.join(""))}
                disabled={busy || verified || expired || digits.some((d) => d === "")}
                className="mt-4 h-12 w-full rounded-full bg-primary font-display text-sm font-bold text-on-primary shadow-e1 transition-transform active:scale-95 disabled:opacity-50"
              >
                {verified ? "Berjaya!" : "Sahkan & Masuk"}
              </button>

              <div className="mt-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  data-sfx="close"
                  onClick={backToForm}
                  className="rounded-full px-3 py-1.5 text-[11px] font-bold text-on-surface-variant transition-colors hover:bg-surface-container"
                >
                  Ganti emel / kata laluan
                </button>
                <button
                  type="button"
                  data-sfx="click"
                  onClick={resend}
                  className="rounded-full px-3 py-1.5 text-[11px] font-bold text-primary underline underline-offset-4 transition-colors hover:bg-surface-container"
                >
                  Hantar semula{resends > 0 ? ` (${resends})` : ""}
                </button>
              </div>
            </>
          )}
        </div>

        <p className="mt-4 text-center text-[10px] font-semibold text-on-surface-variant">
          PokeMondo × PokéAPI — tidak rasmi, dibina untuk peminat
        </p>
      </div>
    </div>,
    document.body,
  );
}
