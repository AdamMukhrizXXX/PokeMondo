"use client";

import { useCallback, useMemo, useState } from "react";
import { capital, pixelUrl, type BasicPokemon } from "../lib/pokemon";
import { RevealWords } from "./Reveal";
import { playUiSfx } from "../lib/sound";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pretty(name: string) {
  return capital(name.replace(/-/g, " "));
}

export default function QuizSection({ list }: { list: BasicPokemon[] }) {
  const pool = useMemo(() => (list.length > 0 ? list : []), [list]);

  const makeRound = useCallback(() => {
    if (pool.length < 8) return null;
    const answer = pool[Math.floor(Math.random() * pool.length)];
    const wrong = shuffle(pool.filter((p) => p.id !== answer.id)).slice(0, 3);
    return { answer, options: shuffle([answer, ...wrong]) };
  }, [pool]);

  const [round, setRound] = useState<ReturnType<typeof makeRound>>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [asked, setAsked] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);

  const next = useCallback(() => {
    setRound(makeRound());
    setPicked(null);
  }, [makeRound]);

  const start = useCallback(() => {
    setScore(0);
    setAsked(0);
    setStreak(0);
    next();
  }, [next]);

  const answered = picked !== null;
  const correct = answered && round !== null && picked === round.answer.id;

  const pick = (id: number) => {
    if (answered || round === null) return;
    setPicked(id);
    setAsked((a) => a + 1);
    if (id === round.answer.id) {
      playUiSfx("success");
      setScore((s) => s + 1);
      setStreak((st) => {
        const ns = st + 1;
        setBest((b) => Math.max(b, ns));
        return ns;
      });
      window.setTimeout(() => {
        setRound(makeRound());
        setPicked(null);
      }, 1200);
    } else {
      playUiSfx("error");
      setStreak(0);
    }
  };

  return (
    <section id="kuiz" className="px-5 py-14 sm:px-8 lg:px-16">
      <div
        className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-outline-variant bg-surface-container-low shadow-e2"
        style={{ contentVisibility: "auto", containIntrinsicSize: "560px" }}
      >
        <div className="px-8 pt-8 text-center sm:px-10">
          <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-primary">
            <RevealWords text="Cabaran pantas" />
          </p>
          <h2 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">
            <RevealWords text="Kuiz Rawak" />
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Teka siluet Pokémon — soalan baharu terjana tanpa had, setiap jawapan betul memberi poin & rentetan.
          </p>
        </div>

        {!round ? (
          <div className="px-8 py-10 text-center sm:px-10">
            <button
              type="button"
              onClick={start}
              data-sfx="dice"
              className="inline-flex h-12 items-center rounded-full bg-primary px-8 font-display text-base font-bold text-on-primary shadow-e2 transition-transform active:scale-95"
            >
              Mula Kuiz
            </button>
            {pool.length === 0 && (
              <p className="mt-3 text-xs text-on-surface-variant">Data Pokémon sedang dimuat…</p>
            )}
          </div>
        ) : (
          <div className="px-6 pb-8 pt-6 sm:px-10">
            <div className="mx-auto flex max-w-md items-center justify-between gap-3 font-display text-xs font-bold text-on-surface-variant">
              <span className="tabular-nums">
                Skor {score}/{asked}
              </span>
              <span className="tabular-nums" style={{ color: streak > 1 ? "var(--md-tertiary)" : undefined }}>
                Rentetan {streak} · Terbaik {best}
              </span>
            </div>

            <div className="mx-auto mt-4 grid w-40 place-items-center rounded-3xl border border-outline-variant bg-surface-container p-4">
              <img
                src={pixelUrl(round.answer.id)}
                alt={answered ? pretty(round.answer.name) : "Siluet Pokémon"}
                width={112}
                height={112}
                loading="lazy"
                decoding="async"
                className="size-28 object-contain"
                style={{
                  filter: answered ? "none" : "brightness(0) opacity(0.92)",
                  transition: "filter .4s ease",
                }}
              />
            </div>

            <p
              className="mt-3 text-center font-display text-sm font-bold"
              style={{ color: answered ? (correct ? "var(--md-tertiary)" : "var(--md-error)") : undefined }}
              role="status"
            >
              {answered ? (correct ? `Betul! Ia ${pretty(round.answer.name)}.` : `Salah — ia ${pretty(round.answer.name)}.`) : "Siapakah Pokémon ini?"}
            </p>

            <div className="mx-auto mt-5 grid max-w-md grid-cols-1 gap-2.5 sm:grid-cols-2">
              {round.options.map((o) => {
                const isAnswer = o.id === round.answer.id;
                const isPicked = picked === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => pick(o.id)}
                    disabled={answered}
                    data-no-hover-sfx
                    className={`h-11 rounded-full border px-4 font-display text-sm font-bold transition-colors disabled:cursor-default ${
                      answered && isAnswer
                        ? "border-transparent text-on-primary"
                        : isPicked
                          ? "border-transparent text-on-primary"
                          : "border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high"
                    }`}
                    style={
                      answered && isAnswer
                        ? { background: "var(--md-tertiary)" }
                        : isPicked
                          ? { background: "var(--md-error)" }
                          : undefined
                    }
                  >
                    {pretty(o.name)}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={next}
                data-sfx="dice"
                className="h-10 rounded-full border border-outline-variant px-6 font-display text-sm font-bold text-on-surface-variant transition-transform active:scale-95"
              >
                Soalan Seterusnya
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
