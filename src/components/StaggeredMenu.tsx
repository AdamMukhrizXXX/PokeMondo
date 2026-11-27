"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cycleSiteTheme, THEME_LABELS, useSiteTheme } from "../lib/site-theme";
import { getSession, logoutUser } from "../lib/auth";
import ThemeToggle from "./ThemeToggle";
import SoundToggle from "./SoundToggle";
import WallpaperControl from "./WallpaperControl";
import FallbackModeButton from "./FallbackModeButton";

const NAV_ITEMS = [
  { href: "/", label: "Rumah" },
  { href: "/kuiz", label: "Kuiz" },
  { href: "/pokedex", label: "Pokédex" },
  { href: "/pokex", label: "PokeX" },
  { href: "/info", label: "Info" },
  { href: "/changelog", label: "Changelog" },
];

const TEXT_LINES = ["Menu", "Close", "Menu", "Close", "Menu", "Close"];

export default function StaggeredMenu() {
  const siteTheme = useSiteTheme();
  const [open, setOpen] = useState(false);
  const [sessionEmail, setSessionEmail] = useState("");
  useEffect(() => {
    setSessionEmail(getSession()?.email ?? "");
  }, []);
  const openRef = useRef(false);
  const panelRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const pathname = usePathname();

  const setOpenSafe = useCallback((next: boolean) => {
    if (openRef.current === next) return;
    openRef.current = next;
    setOpen(next);
  }, []);

  const toggle = useCallback(() => {
    setOpenSafe(!openRef.current);
  }, [setOpenSafe]);

  const close = useCallback(() => setOpenSafe(false), [setOpenSafe]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target instanceof Element ? e.target : null;
      if (panelRef.current?.contains(t)) return;
      if (toggleRef.current?.contains(t)) return;
      if (t?.closest("[data-portal-panel]")) return;
      close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  useEffect(() => {
    close();
  }, [pathname, close]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="sm-scope" data-position="left" data-open={open || undefined}>
      <div className="sm-prelayers" aria-hidden="true">
        <div className="sm-prelayer" style={{ background: "var(--md-secondary-container)" }} />
        <div
          className="sm-prelayer"
          style={{ background: "var(--md-tertiary-container)", transitionDelay: open ? "0.07s" : "0s" }}
        />
      </div>

      <aside
        id="staggered-menu-panel"
        ref={panelRef}
        className="sm-panel"
        aria-hidden={!open}
        inert={!open || undefined}
      >
        <nav aria-label="Navigasi halaman">
          <ul className="sm-panel-list" data-numbering="true">
            {NAV_ITEMS.map((item, i) => (
              <li className="sm-panel-itemWrap" key={item.href}>
                <Link
                  href={item.href}
                  className="sm-panel-item"
                  data-sfx="click"
                  aria-current={isActive(item.href) ? "page" : undefined}
                  style={{ ["--sm-delay" as string]: open ? `${0.32 + i * 0.1}s` : "0s" }}
                  onClick={close}
                >
                  <span className="sm-panel-itemLabel">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sm-settings">
          <p className="sm-settings-title">Tetapan &amp; Kawalan</p>
          <ul className="sm-settings-list">
            <li className="sm-settings-row">
              <span className="sm-settings-icon">
                <SoundToggle />
              </span>
              <span className="sm-settings-label">Bunyi &amp; SFX</span>
            </li>
            <li className="sm-settings-row">
              <span className="sm-settings-icon">
                <ThemeToggle compact />
              </span>
              <span className="sm-settings-label">Cerah / Gelap</span>
            </li>
            <li className="sm-settings-row">
              <span className="sm-settings-icon">
                <button
                  type="button"
                  data-sfx="toggle-on"
                  aria-label={`Tukar tema laman: ${THEME_LABELS[siteTheme]}`}
                  onClick={() => cycleSiteTheme()}
                  className="group grid size-10 place-items-center rounded-full text-on-surface-variant transition-all duration-300 hover:scale-110 hover:bg-surface-container-high hover:text-on-surface active:scale-90"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" className="transition-transform duration-500 group-hover:rotate-[25deg]" aria-hidden>
                    <defs>
                      <linearGradient id="pm-palette" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="var(--md-primary)" />
                        <stop offset="0.5" stopColor="var(--md-tertiary)" />
                        <stop offset="1" stopColor="#00a878" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M12 3a9 9 0 0 0 0 18c1.3 0 2.1-.9 2.1-1.9 0-.5-.2-.9-.5-1.3-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8h2.1a4 4 0 0 0 4-4C21 6.6 17 3 12 3Z"
                      fill="url(#pm-palette)"
                    />
                    <circle cx="8.2" cy="9.2" r="1.5" fill="#e3350d" />
                    <circle cx="12.6" cy="6.8" r="1.5" fill="#ffc531" />
                    <circle cx="16.6" cy="10.4" r="1.5" fill="#2f7cf6" />
                    <circle cx="7.4" cy="13.8" r="1.5" fill="#00a878" />
                  </svg>
                </button>
              </span>
              <span className="sm-settings-label">Tema: {THEME_LABELS[siteTheme]}</span>
            </li>
            <li className="sm-settings-row">
              <span className="sm-settings-icon">
                <WallpaperControl />
              </span>
              <span className="sm-settings-label">Latar Custom</span>
            </li>
            <li className="sm-settings-row">
              <span className="sm-settings-icon">
                <FallbackModeButton />
              </span>
              <span className="sm-settings-label">SPUI</span>
            </li>
            {sessionEmail && (
              <li className="sm-settings-row">
                <span className="sm-settings-icon">
                  <button
                    type="button"
                    data-sfx="close"
                    aria-label={`Log keluar daripada ${sessionEmail}`}
                    onClick={() => {
                      logoutUser();
                      window.location.reload();
                    }}
                    className="grid size-10 place-items-center rounded-full text-on-surface-variant transition-all duration-300 hover:scale-110 hover:bg-surface-container-high hover:text-[var(--md-error)] active:scale-90"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <path d="m16 17 5-5-5-5" />
                      <path d="M21 12H9" />
                    </svg>
                  </button>
                </span>
                <span className="sm-settings-label">Log Keluar</span>
              </li>
            )}
          </ul>
        </div>

        <div className="sm-socials">
          <p className="sm-socials-title">Terokai</p>
          <div className="sm-socials-row">
            <a
              href="https://pokeapi.co"
              target="_blank"
              rel="noreferrer"
              data-sfx="click"
              className="sm-socials-link"
            >
              PokéAPI
            </a>
            <a
              href="https://reactbits.dev"
              target="_blank"
              rel="noreferrer"
              data-sfx="click"
              className="sm-socials-link"
            >
              React Bits
            </a>
          </div>
        </div>
      </aside>

      <button
        ref={toggleRef}
        type="button"
        className="sm-toggle"
        aria-expanded={open}
        aria-controls="staggered-menu-panel"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        onClick={toggle}
      >
        <span className="sm-toggle-textWrap" aria-hidden="true">
          <span
            className="sm-toggle-textInner"
            style={{
              transform: open ? "translateY(-83.333%)" : "translateY(0)",
              transitionDuration: open ? "0.92s" : "0.5s",
            }}
          >
            {TEXT_LINES.map((line, i) => (
              <span className="sm-toggle-line" key={i}>
                {line}
              </span>
            ))}
          </span>
        </span>
        <span className="sm-icon" aria-hidden="true">
          <span className="sm-icon-line sm-icon-line-h" />
          <span className="sm-icon-line sm-icon-line-v" />
        </span>
      </button>
    </div>
  );
}
