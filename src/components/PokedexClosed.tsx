"use client";

import { splitCountdown, useCountdown } from "../lib/pokedex-server";
import { RedeemForm } from "./AdminAccess";

function two(n: number) {
  return String(n).padStart(2, "0");
}

export default function PokedexClosed({
  until,
  onRedeem,
}: {
  until: number;
  onRedeem: (code: string) => boolean;
}) {
  const msLeft = useCountdown(until);
  const c = msLeft !== null ? splitCountdown(msLeft) : null;

  return (
    <div className="px-5 pb-16 pt-4 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-outline-variant bg-surface-container-low shadow-e2">
        <div
          className="flex items-center gap-3 px-6 py-3"
          style={{ background: "color-mix(in srgb, var(--md-error) 14%, transparent)" }}
        >
          <span
            className="inline-block size-2.5 shrink-0 rounded-full"
            style={{ background: "var(--md-error)" }}
            aria-hidden
          />
          <p className="font-display text-sm font-bold" style={{ color: "var(--md-error)" }}>
            STATUS PELAYAN: DITUTUP
          </p>
        </div>

        <div className="p-8 text-center sm:p-10">
          <div
            className="mx-auto grid size-16 place-items-center rounded-full"
            style={{ background: "color-mix(in srgb, var(--md-error) 16%, transparent)" }}
            aria-hidden
          >
            <svg
              width="28"
              height="28"
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
          </div>

          <h2 className="mt-4 font-display text-2xl font-extrabold text-on-surface">
            Server Pokédex Ditutup
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-on-surface-variant">
            Servis senarai Pokédex ditutup sehingga <strong className="text-on-surface">31 Disember 2027</strong>.
            Sila datang kembali selepas tarikh itu — pelayan akan terbuka secara automatik.
          </p>

          {c && (
            <div
              className="mx-auto mt-6 flex max-w-sm items-stretch justify-center gap-2 sm:gap-3"
              role="timer"
              aria-label={`Ditutup selama ${c.days} hari ${c.hours} jam ${c.minutes} minit ${c.seconds} saat lagi`}
            >
              {[
                { v: String(c.days), l: "Hari" },
                { v: two(c.hours), l: "Jam" },
                { v: two(c.minutes), l: "Minit" },
                { v: two(c.seconds), l: "Saat" },
              ].map((u) => (
                <div
                  key={u.l}
                  className="min-w-16 rounded-2xl border border-outline-variant bg-surface-container px-3 py-3"
                >
                  <p className="font-display text-2xl font-extrabold tabular-nums text-primary">{u.v}</p>
                  <p className="mt-0.5 text-[11px] font-semibold tracking-wide text-on-surface-variant">
                    {u.l}
                  </p>
                </div>
              ))}
            </div>
          )}

          <p className="mt-6 text-xs text-on-surface-variant">
            Hero, Galeri Generasi, Muzik, Jam Dunia dan sistem lain masih boleh dinikmati seperti biasa.
          </p>
        </div>

        <div className="border-t border-outline-variant px-8 py-6 text-center sm:px-10">
          <p className="font-display text-sm font-bold text-on-surface">Ada kod redeem?</p>
          <p className="mx-auto mt-1 max-w-sm text-xs text-on-surface-variant">
            Akses khas membuka pelayan dalam mod terhad: <strong className="text-on-surface">40 Pokémon rawak sahaja</strong>.
          </p>
          <RedeemForm onRedeem={onRedeem} />
        </div>
      </div>
    </div>
  );
}
