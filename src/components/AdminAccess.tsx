"use client";

import { useEffect, useRef, useState } from "react";
import { accessLimitOf, getCodeUsage, type AdminAccess, type RedeemResult } from "../lib/admin-access";

const TIERS = [
  { name: "Akses Piawai", detail: "40 Pokémon rawak · 10×/sehari · 30×/minggu (reset mingguan)" },
  { name: "Akses Lanjutan", detail: "100 Pokémon sekaligus · 5×/sebulan (reset bulanan)" },
];

export function RedeemSection({ onRedeem }: { onRedeem: (code: string) => RedeemResult }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-sfx="open"
        className="inline-flex h-11 items-center gap-2 rounded-full border border-outline-variant bg-surface-container px-5 font-display text-sm font-bold text-on-surface transition-transform active:scale-95"
      >
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
        >
          <rect x="4" y="10" width="16" height="11" rx="2.5" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
        Guna Kod Redeem
      </button>

      {open && <RedeemDialog onClose={() => setOpen(false)} onRedeem={onRedeem} />}
    </div>
  );
}

function RedeemDialog({ onClose, onRedeem }: { onClose: () => void; onRedeem: (code: string) => RedeemResult }) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = () => {
    if (!code.trim()) {
      setFailed(true);
      setMsg("Masukkan kod dahulu.");
      return;
    }
    let r: RedeemResult;
    try {
      r = onRedeem(code);
    } catch {
      r = { ok: false, error: "Ralat tidak dijangka — cuba lagi." };
    }
    setFailed(!r.ok);
    setMsg(r.error);
    if (r.ok) {
      try {
        import("../lib/sound").then((m) => m.playUiSfx("success")).catch(() => {});
      } catch {
        /* audio tidak tersedia */
      }
    } else {
      try {
        import("../lib/sound").then((m) => m.playUiSfx("error")).catch(() => {});
      } catch {
        /* audio tidak tersedia */
      }
    }
  };

  const upper = code.trim().toUpperCase();
  const preview =
    upper === "ADMINSERVER" || upper === "SERVERFREE"
      ? upper === "SERVERFREE"
        ? "Baki bulan ini: " + getCodeUsage(upper).monthLeft + "/5."
        : "Baki: " + getCodeUsage(upper).dayLeft + "/10 hari ini · " + getCodeUsage(upper).weekLeft + "/30 minggu ini."
      : null;

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center bg-black/45 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Kod Redeem"
        className="w-full max-w-sm rounded-[28px] border border-outline-variant bg-surface-container-high p-6 shadow-e3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="grid size-11 shrink-0 place-items-center rounded-full"
              style={{ background: "color-mix(in srgb, var(--md-tertiary) 18%, transparent)", color: "var(--md-tertiary)" }}
              aria-hidden
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4" y="10" width="16" height="11" rx="2.5" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-extrabold text-on-surface">Kod Redeem</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-sfx="close"
            aria-label="Tutup"
            className="grid size-9 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-highest"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
          Masukkan kod rahsia untuk membuka pelayan dalam mod terhad semasa ia ditutup:
        </p>

        <ul className="mt-3 space-y-2">
          {TIERS.map((t) => (
            <li
              key={t.name}
              className="rounded-2xl border border-outline-variant bg-surface-container px-4 py-2.5 text-xs font-semibold text-on-surface"
            >
              {t.name}
              <span className="mt-0.5 block font-normal text-on-surface-variant">{t.detail}</span>
            </li>
          ))}
        </ul>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="mt-4"
        >
          <input
            ref={inputRef}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setFailed(false);
              setMsg(null);
            }}
            placeholder="KOD RAHSIA"
            aria-label="Kod redeem"
            aria-invalid={failed}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            className="h-12 w-full rounded-2xl border border-outline-variant bg-surface-container px-4 text-center font-mono text-base font-bold uppercase tracking-widest text-on-surface outline-none focus:border-primary"
          />

          {preview && !failed && !msg && (
            <p className="mt-2 text-center text-xs font-semibold tabular-nums" style={{ color: "var(--md-tertiary)" }}>
              {preview}
            </p>
          )}
          {msg && (
            <p
              className="mt-2 text-center text-xs font-semibold"
              role="alert"
              style={{ color: failed ? "var(--md-error)" : "var(--md-tertiary)" }}
            >
              {msg}
            </p>
          )}

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              data-sfx="close"
              className="h-10 rounded-full px-4 font-display text-sm font-bold text-primary transition-transform active:scale-95"
            >
              Batal
            </button>
            <button
              type="submit"
              data-sfx="dice"
              className="h-10 rounded-full bg-primary px-6 font-display text-sm font-bold text-on-primary shadow-e1 transition-transform active:scale-95 disabled:opacity-40"
              disabled={!code.trim()}
            >
              Redeem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AdminBanner({
  access,
  count,
  onReroll,
  onUnredeem,
}: {
  access: AdminAccess;
  count: number;
  onReroll: () => void;
  onUnredeem: () => void;
}) {
  return (
    <div className="px-5 pt-2 sm:px-8 lg:px-16">
      <div
        className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 rounded-2xl border border-outline-variant bg-surface-container-low px-5 py-3"
        role="status"
      >
        <span
          className="inline-block size-2.5 shrink-0 rounded-full"
          style={{ background: "var(--md-tertiary)" }}
          aria-hidden
        />
        <p className="min-w-0 flex-1 text-sm font-semibold text-on-surface">
          Akses khas aktif (kod <span className="font-mono font-bold uppercase">{access.code}</span>) — pelayan terbuka
          terhad: <strong className="tabular-nums">{count}</strong> Pokémon rawak sahaja (had {accessLimitOf(access.code)}).{" "}
          <Balance access={access} />
        </p>
        <button
          type="button"
          onClick={onReroll}
          data-sfx="dice"
          className="h-9 rounded-full border border-outline-variant px-4 font-display text-xs font-bold text-on-surface-variant transition-transform active:scale-95"
        >
          Rawak semula
        </button>
        <button
          type="button"
          onClick={onUnredeem}
          data-sfx="close"
          className="h-9 rounded-full px-4 font-display text-xs font-bold text-on-primary transition-transform active:scale-95"
          style={{ background: "var(--md-primary)" }}
        >
          Tamat akses
        </button>
      </div>
    </div>
  );
}

function Balance({ access }: { access: AdminAccess }) {
  const u = getCodeUsage(access.code);
  if (Number.isFinite(u.monthLeft)) {
    return <span className="tabular-nums text-on-surface-variant">Baki bulan ini: {String(u.monthLeft)}/5.</span>;
  }
  const dayLeft = Number.isFinite(u.dayLeft) ? String(u.dayLeft) : "∞";
  const weekLeft = Number.isFinite(u.weekLeft) ? String(u.weekLeft) : "∞";
  return (
    <span className="tabular-nums text-on-surface-variant">
      Baki: {dayLeft}/10 hari ini · {weekLeft}/30 minggu ini.
    </span>
  );
}
