"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Pokedex from "../../components/Pokedex";
import { usePokedexData } from "../../lib/pokedex-context";


function PokedexClient() {
  const { list, loading, degraded, openDetail } = usePokedexData();
  const params = useSearchParams();
  const [query, setQuery] = useState(() => params.get("q") ?? "");

  useEffect(() => {
    const q = params.get("q");
    if (q !== null) setQuery(q);
  }, [params]);

  return (
    <Pokedex
      list={list}
      loading={loading}
      degraded={degraded}
      query={query}
      onQueryChange={setQuery}
      onOpen={(p) => openDetail(p.id)}
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-svh" />}>
      <PokedexClient />
    </Suspense>
  );
}
