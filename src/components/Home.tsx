"use client";

import { useCallback, useEffect, useState } from "react";
import { artworkUrl, usePokedex, type BasicPokemon } from "../lib/pokemon";
import Sidebar from "../components/Sidebar";
import Hero from "../components/Hero";
import ScrubGallery from "../components/ScrubGallery";
import Pokedex from "../components/Pokedex";
import DetailModal from "../components/DetailModal";
import { FadeIn } from "./Reveal";
import MusicPlayer from "./MusicPlayer";
import WorldClock from "./WorldClock";
import ErrorBoundary from "./ErrorBoundary";
import SimpleHome from "./SimpleHome";
import { useUiMode } from "../lib/ui-mode";
import { applySiteTheme, getSiteTheme } from "../lib/site-theme";
import QuizSection from "./QuizSection";
import { initUiSfx } from "../lib/sound";

export default function Home({ initialList = [] }: { initialList?: BasicPokemon[] }) {
  const { list, loading, degraded } = usePokedex(initialList);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [playerOpen, setPlayerOpen] = useState(false);

  useEffect(() => initUiSfx(), []);
  useEffect(() => applySiteTheme(getSiteTheme()), []);
  const uiMode = useUiMode();

  const byId = useCallback(
    (id: number) => list.find((p) => p.id === id) ?? { id, name: "", types: null },
    [list],
  );

  const openDetail = useCallback((id: number) => setSelectedId(id), []);

  const closeModal = useCallback(() => setSelectedId(null), []);

  const random = useCallback(() => {
    if (list.length === 0) return;
    const pick = list[Math.floor(list.length * Math.random())];
    openDetail(pick.id);
  }, [list, openDetail]);

  const scrollToDex = useCallback(() => {
    document.getElementById("dex")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const selected = selectedId !== null ? byId(selectedId) : null;

  if (uiMode === "simple") {
    return <SimpleHome list={list} loading={loading} degraded={degraded} />;
  }

  return (
    <main className="pb-28">
      <div aria-hidden className="bg-wallpaper" />
      <div aria-hidden className="bg-deco pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <img
          src={artworkUrl(384)}
          alt=""
          draggable={false}
          loading="lazy"
          fetchPriority="low"
          width={1024}
          height={1024}
          className="deco-img -top-[6%] right-[-8%] w-[42vw] max-w-[36rem] rotate-12"
        />
        <img
          src={artworkUrl(6)}
          alt=""
          draggable={false}
          loading="lazy"
          fetchPriority="low"
          width={1024}
          height={1024}
          className="deco-img bottom-[2%] left-[-9%] w-[38vw] max-w-[32rem] -rotate-6"
        />
        <img
          src={artworkUrl(448)}
          alt=""
          draggable={false}
          loading="lazy"
          fetchPriority="low"
          width={1024}
          height={1024}
          className="deco-img deco-float top-[42%] left-[34%] hidden w-[24vw] max-w-[22rem] lg:block"
        />
      </div>

      <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
        <ErrorBoundary label="Pemain Muzik">
          <MusicPlayer expanded={playerOpen} onSetExpanded={setPlayerOpen} />
        </ErrorBoundary>
      </div>

      <ErrorBoundary label="Jam Dunia">
        <WorldClock />
      </ErrorBoundary>

      <ErrorBoundary label="Hero">
        <Hero
          query={query}
          onQueryChange={setQuery}
          total={list.length}
          onExplore={scrollToDex}
        />
      </ErrorBoundary>

      <ErrorBoundary label="Galeri Generasi">
        <ScrubGallery />
      </ErrorBoundary>

      <ErrorBoundary label="Kuiz">
        <QuizSection list={list} />
      </ErrorBoundary>

      <ErrorBoundary label="Pokédex">
        <Pokedex
          list={list}
          loading={loading}
          degraded={degraded}
          query={query}
          onQueryChange={setQuery}
          onOpen={(p) => openDetail(p.id)}
        />
      </ErrorBoundary>

      <ErrorBoundary label="Info">
        <InfoSection />
      </ErrorBoundary>

      <ErrorBoundary label="Navigasi">
        <Sidebar onRandom={random} list={list} />
      </ErrorBoundary>

      {selected && (
        <ErrorBoundary label="Modal Butiran">
          <DetailModal
            pokemon={selected}
            onClose={closeModal}
            onNavigate={(id) => setSelectedId(id)}
          />
        </ErrorBoundary>
      )}
    </main>
  );
}

function InfoSection() {
  return (
    <section id="info" className="px-5 pb-8 pt-4 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2rem] border border-outline-variant bg-surface-container-low" style={{ contentVisibility: "auto", containIntrinsicSize: "640px" }}>
          <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-primary">
                <FadeIn><span>Tentang</span></FadeIn>
              </p>
              <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                <RevealTentang />
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-on-surface-variant">
                PokeMondo adalah Pokédex web yang memuatkan semua 1025 spesies
                daripada sembilan generasi terus dari{" "}
                <a
                  href="https://pokeapi.co"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary underline underline-offset-4"
                >
                  PokéAPI
                </a>{" "}
                — RESTful, GraphQL, dan kosong iklan. Reka bentuknya mengikut
                bahasa visual Material You: warna tonal yang dinamik, bentuk
                bulat besar, dan pergerakan yang menenangkan.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Next.js",
                  "React 19",
                  "TypeScript",
                  "Tailwind CSS",
                  "CSS",
                  "JavaScript",
                  "HTML",
                  "PokeAPI",
                ].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-outline-variant bg-surface-container-lowest px-3.5 py-1.5 font-display text-xs font-bold text-on-surface-variant"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {[
                {
                  label: "PokéAPI",
                  href: "https://pokeapi.co",
                  note: "Sumber data Pokémon",
                },
                {
                  label: "React Bits",
                  href: "https://reactbits.dev",
                  note: "Ilham corak animasi",
                },
                {
                  label: "Material You",
                  href: "https://m3.material.io",
                  note: "Sistem reka bentuk",
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-2xl bg-surface-container px-5 py-4 transition-colors hover:bg-surface-container-high"
                >
                  <span>
                    <span className="block font-display font-bold text-on-surface">
                      {item.label}
                    </span>
                    <span className="text-sm text-on-surface-variant">{item.note}</span>
                  </span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-on-surface-variant transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  >
                    <path d="M7 17 17 7m0 0h-8m8 0v8" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          <p className="border-t border-outline-variant px-8 py-5 text-xs text-on-surface-variant">
            Pokémon dan nama watak adalah tanda dagangan Nintendo / Game Freak /
            Creatures Inc. Projek ini tidak rasmi dan dibina sebagai demo teknologi.
          </p>
        </div>
      </div>
    </section>
  );
}

function RevealTentang() {
  return (
    <FadeIn>
      <span className="inline-block">Dibina dengan data terbuka</span>
    </FadeIn>
  );
}
