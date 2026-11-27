"use client";

import PokeXSection from "../../components/PokeXSection";
import { usePokedexData } from "../../lib/pokedex-context";

export default function Page() {
  const { list } = usePokedexData();
  return (
    <div className="min-h-svh">
      <PokeXSection list={list} />
    </div>
  );
}
