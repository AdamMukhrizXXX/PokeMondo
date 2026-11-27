"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { usePokedex, type BasicPokemon } from "./pokemon";

type PokedexCtxValue = {
  list: BasicPokemon[];
  loading: boolean;
  degraded: boolean;
  selectedId: number | null;
  openDetail: (id: number) => void;
  closeDetail: () => void;
};

const PokedexCtx = createContext<PokedexCtxValue | null>(null);

export function PokedexProvider({
  initialList = [],
  children,
}: {
  initialList?: BasicPokemon[];
  children: React.ReactNode;
}) {
  const { list, loading, degraded } = usePokedex(initialList);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const openDetail = useCallback((id: number) => setSelectedId(id), []);
  const closeDetail = useCallback(() => setSelectedId(null), []);

  const value = useMemo(
    () => ({ list, loading, degraded, selectedId, openDetail, closeDetail }),
    [list, loading, degraded, selectedId, openDetail, closeDetail],
  );

  return <PokedexCtx.Provider value={value}>{children}</PokedexCtx.Provider>;
}

export function usePokedexData(): PokedexCtxValue {
  const ctx = useContext(PokedexCtx);
  if (!ctx) throw new Error("usePokedexData mesti digunakan dalam PokedexProvider");
  return ctx;
}
