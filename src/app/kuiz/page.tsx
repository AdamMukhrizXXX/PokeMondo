"use client";

import QuizSection from "../../components/QuizSection";
import { usePokedexData } from "../../lib/pokedex-context";


export default function Page() {
  const { list } = usePokedexData();
  return (
    <div className="min-h-svh pb-28 pt-16">
      <QuizSection list={list} />
    </div>
  );
}
