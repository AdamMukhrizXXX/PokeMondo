"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { capital, pixelUrl, type BasicPokemon } from "../lib/pokemon";
import { RevealWords } from "./Reveal";
import { playUiSfx } from "../lib/sound";
import { useT } from "../lib/i18n";

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

const NEXT_CORRECT_MS = 1200;
const NEXT_WRONG_MS = 1800;

export default function QuizSection({ list }: { list: BasicPokemon[] }) {
  const pool = useMemo(() => (list.length > 0 ? list : []), [list]);
  const t = useT();

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
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const advance = useCallback(() => {
    clearTimer();
    setRound(makeRound());
    setPicked(null);
  }, [clearTimer, makeRound]);

  const start = useCallback(() => {
    setScore(0);
    setAsked(0);
    setStreak(0);
    advance();
  }, [advance]);

  const answered = picked !== null;
  const correct = answered && round !== null && picked === round.answer.id;
  const nextDelay = correct ? NEXT_CORRECT_MS : NEXT_WRONG_MS;

  const pick = (id: number) => {
    if (answered || round === null) return;
    const isCorrect = id === round.answer.id;
    setPicked(id);
    setAsked((a) => a + 1);
    if (isCorrect) {
      playUiSfx("success");
      setScore((s) => s + 1);
      setStreak((st) => {
        const ns = st + 1;
        setBest((b) => Math.max(b, ns));
        return ns;
      });
    } else {
      playUiSfx("error");
      setStreak(0);
    }
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      setRound(makeRound());
      setPicked(null);
    }, isCorrect ? NEXT_CORRECT_MS : NEXT_WRONG_MS);
  };

  return (
    <section id="kuiz" className="px-5 py-14 sm:px-8 lg:px-16">
      <div
        className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-outline-variant bg-surface-container-low shadow-e3"
        style={{ contentVisibility: "auto", containIntrinsicSize: "560px" }}
      >
        <div className="px-8 pt-8 text-center sm:px-10">
          <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-primary">
            <RevealWords text={t("qz.tag")} />
          </p>
          <h2 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">
            <RevealWords text={t("qz.title")} />
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            {t("qz.hint")}
          </p>
        </div>

        {!round ? (
          <div className="px-8 py-10 text-center sm:px-10">
            <button
              type="button"
              onClick={start}
              data-sfx="dice"
              className="quiz-pop inline-flex h-12 items-center rounded-full bg-primary px-8 font-display text-base font-bold text-on-primary shadow-e2 transition-transform active:scale-95"
            >
              {t("qz.start")}
            </button>
            {pool.length === 0 && (
              <p className="mt-3 text-xs text-on-surface-variant">Data Pokémon sedang dimuat…</p>
            )}
          </div>
        ) : (
          <div className="px-6 pb-8 pt-6 sm:px-10">
            <div className="mx-auto flex max-w-md items-center justify-between gap-3 font-display text-xs font-bold text-on-surface-variant">
              <span className="tabular-nums">
                {t("qz.score").replace("{s}", String(score)).replace("{a}", String(asked))}
              </span>
              <span className="tabular-nums" style={{ color: streak > 1 ? "var(--md-tertiary)" : undefined }}>
                {t("qz.streak").replace("{s}", String(streak)).replace("{b}", String(best))}
              </span>
            </div>

            <div className="quiz-pop mx-auto mt-4 grid w-40 place-items-center rounded-3xl border border-outline-variant bg-surface-container p-4 shadow-e2">
              <img
                key={round.answer.id}
                src={pixelUrl(round.answer.id)}
                alt={answered ? pretty(round.answer.name) : "Siluet Pokémon"}
                width={112}
                height={112}
                loading="lazy"
                decoding="async"
                className={`size-28 object-contain ${!answered ? "quiz-float" : correct ? "quiz-bounce" : ""}`}
                style={{
                  filter: answered ? "none" : "brightness(0) opacity(0.92)",
                  transition: "filter .4s ease",
                }}
              />
            </div>

            {answered && (
              <div
                key={`${round.answer.id}-${picked}`}
                className="quiz-countdown mt-4"
                role="presentation"
                style={{ animationDuration: `${nextDelay}ms` }}
              />
            )}

            <p
              className={`mt-3 text-center font-display text-sm font-bold ${answered ? "quiz-pop" : ""}`}
              style={{ color: answered ? (correct ? "var(--md-tertiary)" : "var(--md-error)") : undefined }}
              role="status"
            >
              {answered ? (correct ? t("qz.correct").replace("{n}", pretty(round.answer.name)) : t("qz.wrong").replace("{n}", pretty(round.answer.name))) : t("qz.who")}
            </p>

            <div className="mx-auto mt-5 grid max-w-md grid-cols-1 gap-2.5 sm:grid-cols-2">
              {round.options.map((o, i) => {
                const isAnswer = o.id === round.answer.id;
                const isPicked = picked === o.id;
                const fx = answered && isAnswer ? " quiz-bounce" : isPicked && !correct ? " quiz-shake" : "";
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => pick(o.id)}
                    disabled={answered}
                    data-no-hover-sfx
                    className={`quiz-pop quiz-opt h-11 rounded-full border px-4 font-display text-sm font-bold disabled:cursor-default ${fx} ${
                      answered && isAnswer
                        ? "border-transparent text-on-primary"
                        : isPicked
                          ? "border-transparent text-on-primary"
                          : "border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high"
                    }`}
                    style={{
                      animationDelay: `${i * 70}ms`,
                      ...(answered && isAnswer
                        ? { background: "var(--md-tertiary)" }
                        : isPicked
                          ? { background: "var(--md-error)" }
                          : {}),
                    }}
                  >
                    {pretty(o.name)}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={advance}
                data-sfx="dice"
                className="h-10 rounded-full border border-outline-variant px-6 font-display text-sm font-bold text-on-surface-variant shadow-e1 transition-transform hover:-translate-y-0.5 active:scale-95"
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
