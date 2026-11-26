"use client";

import { useState } from "react";
import { playUiSfx } from "../lib/sound";
import type { AdminAccess } from "../lib/admin-access";

export function RedeemForm({ onRedeem }: { onRedeem: (code: string) => boolean }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!code.trim()) return;
        const ok = onRedeem(code);
        playUiSfx(ok ? "success" : "error");
        if (ok) {
          setCode("");
          setErr(false);
        } else {
          setErr(true);
        }
      }}
      className="mt-4 flex flex-col items-center gap-2"
    >
      <div className="flex w-full max-w-xs gap-2">
        <input
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setErr(false);
          }}
          placeholder="Masukkan kod redeem"
          aria-label="Kod redeem"
          autoComplete="off"
          spellCheck={false}
          className="h-11 min-w-0 flex-1 rounded-full border border-outline-variant bg-surface-container px-4 font-mono text-sm font-bold uppercase tracking-wide text-on-surface outline-none focus:border-primary"
        />
        <button
          type="submit"
          data-sfx="dice"
          className="h-11 shrink-0 rounded-full bg-primary px-5 font-display text-sm font-bold text-on-primary shadow-e1 transition-transform active:scale-95"
        >
          Redeem
        </button>
      </div>
      {err && (
        <p className="text-xs font-semibold" style={{ color: "var(--md-error)" }} role="alert">
          Kod tidak sah — semak ejaan dan cuba lagi.
        </p>
      )}
    </form>
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
          terhad: <strong className="tabular-nums">{count}</strong> Pokémon rawak sahaja sehingga pelayan dibuka penuh.
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
          className="h-9 rounded-full font-display text-xs font-bold text-on-primary px-4 transition-transform active:scale-95"
          style={{ background: "var(--md-primary)" }}
        >
          Tamat akses
        </button>
      </div>
    </div>
  );
}
