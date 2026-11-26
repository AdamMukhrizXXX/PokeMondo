"use client";

import { useCallback, useState } from "react";
import { usePokedex, type BasicPokemon } from "../lib/pokemon";
import BottomNav from "../components/BottomNav";
import Hero from "../components/Hero";
import ScrubGallery from "../components/ScrubGallery";
import Pokedex from "../components/Pokedex";
import DetailModal from "../components/DetailModal";
import ThemeToggle from "../components/ThemeToggle";
import { FadeIn } from "./Reveal";
import SoundToggle from "./SoundToggle";
import MusicPlayer from "./MusicPlayer";

export default function Home({ initialList = [] }: { initialList?: BasicPokemon[] }) {
  const { list, loading, degraded } = usePokedex(initialList);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const byId = useCallback(
    (id: number) => list.find((p) => p.id === id) ?? { id, name: "", types: null },
    [list],
  );

  const openDetail = useCallback((id: number) => setSelectedId(id), []);

  const closeModal = useCallback(() => setSelectedId(null), []);

  const random = useCallback(() => {
    openDetail(1 + Math.floor(1025 * Math.random()));
  }, [openDetail]);

  const scrollToDex = useCallback(() => {
    document.getElementById("dex")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const selected = selectedId !== null ? byId(selectedId) : null;

  return (
    <main className="pb-28">
      <div className="fixed right-4 top-4 z-50 flex gap-2 sm:right-6 sm:top-6">
        <SoundToggle />
        <ThemeToggle />
      </div>

      <Hero
        query={query}
        onQueryChange={setQuery}
        total={list.length}
        onExplore={scrollToDex}
        onRandom={random}
      />

      <ScrubGallery />

      <Pokedex
        list={list}
        loading={loading}
        degraded={degraded}
        query={query}
        onQueryChange={setQuery}
        onOpen={(p) => openDetail(p.id)}
      />

      <InfoSection />

      <MusicPlayer />

      <button
        type="button"
        onClick={random}
        aria-label="Buka Pokémon rawak"
        className="fixed bottom-24 right-4 z-40 flex h-14 items-center gap-2 overflow-hidden rounded-2xl bg-primary px-5 font-display font-bold text-on-primary shadow-e3 transition-transform active:scale-90 sm:right-6"
      >
        <svg
          className="spin-once"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a9 9 0 0 1 8.49 6" />
          <path d="M12 3a9 9 0 0 0-8.49 6" strokeLinecap="round" />
        </svg>
        Rawak
      </button>

      <BottomNav />

      {selected && (
        <DetailModal
          pokemon={selected}
          onClose={closeModal}
          onNavigate={(id) => setSelectedId(id)}
        />
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
