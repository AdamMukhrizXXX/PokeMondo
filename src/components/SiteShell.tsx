"use client";

import { useEffect, useState } from "react";
import { artworkUrl } from "../lib/pokemon";
import { usePokedexData } from "../lib/pokedex-context";
import { getSession, type SessionInfo } from "../lib/auth";
import { initUiSfx } from "../lib/sound";
import { applySiteTheme, getSiteTheme } from "../lib/site-theme";
import { useUiMode } from "../lib/ui-mode";
import MusicPlayer from "./MusicPlayer";
import WorldClock from "./WorldClock";
import StaggeredMenu from "./StaggeredMenu";
import DetailModal from "./DetailModal";
import SimpleHome from "./SimpleHome";
import ErrorBoundary from "./ErrorBoundary";
import AuthScreen from "./AuthScreen";
import BootScreen from "./BootScreen";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const { list, loading, degraded, selectedId, openDetail, closeDetail } = usePokedexData();
  const [playerOpen, setPlayerOpen] = useState(false);
  const [session, setSession] = useState<SessionInfo | null | undefined>(undefined);
  const [booted, setBooted] = useState(true);

  useEffect(() => {
    setSession(getSession() ?? null);
    try {
      setBooted(localStorage.getItem("md-booted") === "1");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => initUiSfx(), []);
  useEffect(() => applySiteTheme(getSiteTheme()), []);
  const uiMode = useUiMode();

  if (session === null) {
    return (
      <AuthScreen
        onAuthed={(s) => {
          try {
            delete document.documentElement.dataset.gate;
          } catch {
            /* ignore */
          }
          setSession(s);
        }}
      />
    );
  }

  if (session && !booted) {
    return <BootScreen onDone={() => setBooted(true)} />;
  }

  const selected =
    selectedId !== null ? list.find((p) => p.id === selectedId) ?? { id: selectedId, name: "", types: null } : null;

  if (uiMode === "simple") {
    return <SimpleHome list={list} loading={loading} degraded={degraded} />;
  }

  return (
    <div>
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

      <ErrorBoundary label="Menu Staggered">
        <StaggeredMenu />
      </ErrorBoundary>

      <main className="relative">{children}</main>

      {selected && (
        <ErrorBoundary label="Modal Butiran">
          <DetailModal
            pokemon={selected}
            onClose={closeDetail}
            onNavigate={(id) => openDetail(id)}
          />
        </ErrorBoundary>
      )}
    </div>
  );
}
