"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cycleSiteTheme, THEME_LABELS, useSiteTheme } from "../lib/site-theme";
import { getSession, logoutUser } from "../lib/auth";
import { useT } from "../lib/i18n";
import LanguagePicker from "./LanguagePicker";
import ThemeToggle from "./ThemeToggle";
import SoundToggle from "./SoundToggle";
import WallpaperControl from "./WallpaperControl";
import FallbackModeButton from "./FallbackModeButton";

const NAV_ITEMS = [
  { href: "/", k: "nav.home" },
  { href: "/kuiz", k: "nav.quiz" },
  { href: "/pokedex", k: "nav.pokedex" },
  { href: "/pokex", k: "nav.pokex" },
  { href: "/muzik", k: "nav.music" },
  { href: "/api-key", k: "nav.apiKey" },
  { href: "/info", k: "nav.info" },
  { href: "/changelog", k: "nav.changelog" },
];

function NavIcon({ k }: { k: string }) {
  switch (k) {
    case "nav.home":
      return (
        <svg viewBox="0 0 24 24" className="nv-svg" aria-hidden>
          <defs>
            <linearGradient id="nv-g-home" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffd54d" />
              <stop offset="1" stopColor="#ff6a48" />
            </linearGradient>
          </defs>
          <g className="nv-float">
            <path d="M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-4.6v-5.2h-4.8V21H5a1 1 0 0 1-1-1Z" fill="url(#nv-g-home)" />
            <path d="M12 4l8 7.2-1.2 1.1L12 6.2 5.2 12.3 4 11.2Z" fill="#ffffff" opacity="0.45" />
            <rect x="10.6" y="15.8" width="2.8" height="5.2" rx="0.6" fill="#2b2320" opacity="0.75" className="nv-pulse" />
          </g>
        </svg>
      );
    case "nav.quiz":
      return (
        <svg viewBox="0 0 24 24" className="nv-svg" aria-hidden>
          <defs>
            <linearGradient id="nv-g-quiz" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffd54d" />
              <stop offset="1" stopColor="#ff9800" />
            </linearGradient>
          </defs>
          <g className="nv-float">
            <circle cx="12" cy="12" r="9.4" fill="url(#nv-g-quiz)" />
            <circle cx="12" cy="12" r="9.4" fill="none" stroke="#8a4b00" strokeOpacity="0.3" strokeWidth="1.3" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="16.9" r="1.3" fill="#ffffff" className="nv-pulse" />
          </g>
        </svg>
      );
    case "nav.pokedex":
      return (
        <svg viewBox="0 0 24 24" className="nv-svg" aria-hidden>
          <defs>
            <linearGradient id="nv-g-dex" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ff6a48" />
              <stop offset="1" stopColor="#e3350d" />
            </linearGradient>
          </defs>
          <g className="nv-float">
            <path d="M2.6 12a9.4 9.4 0 0 1 18.8 0Z" fill="url(#nv-g-dex)" />
            <path d="M21.4 12a9.4 9.4 0 0 1-18.8 0Z" fill="#f7f4ef" />
            <rect x="2.6" y="10.85" width="18.8" height="2.3" fill="#2b2320" />
            <circle cx="12" cy="12" r="9.4" fill="none" stroke="#2b2320" strokeWidth="1.4" />
            <circle cx="12" cy="12" r="3.3" fill="#2b2320" stroke="#f7f4ef" strokeWidth="1.1" className="nv-pulse" />
            <circle cx="12" cy="12" r="1.5" fill="#ffffff" />
          </g>
        </svg>
      );
    case "nav.pokex":
      return (
        <svg viewBox="0 0 24 24" className="nv-svg" aria-hidden>
          <defs>
            <linearGradient id="nv-g-pokex" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#2dd4bf" />
              <stop offset="1" stopColor="#0d9488" />
            </linearGradient>
          </defs>
          <g className="nv-float">
            <circle cx="12" cy="12" r="9.4" fill="url(#nv-g-pokex)" />
            <circle cx="12" cy="12" r="9.4" fill="none" stroke="#065f56" strokeOpacity="0.3" strokeWidth="1.3" />
            <path d="M12 6.8 17.2 12 12 17.2 6.8 12Z" fill="#ffffff" className="nv-pulse" />
            <path d="M12 9.4 14.6 12 12 14.6 9.4 12Z" fill="#0d9488" />
          </g>
          <path d="M19.8 3.2l.5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5Z" fill="#ffc531" className="nv-twinkle" />
        </svg>
      );
    case "nav.music":
      return (
        <svg viewBox="0 0 24 24" className="nv-svg" aria-hidden>
          <defs>
            <linearGradient id="nv-g-muzik" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f472b6" />
              <stop offset="1" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <g className="nv-float">
            <g className="nv-bounce">
              <circle cx="7" cy="17.6" r="2.7" fill="url(#nv-g-muzik)" />
              <rect x="9" y="6" width="1.9" height="11.6" rx="0.9" fill="url(#nv-g-muzik)" />
              <path d="M9 6c3 .4 5.6 1.4 6.4 3.4-2.2-.8-4.2-1-6.4-.8Z" fill="url(#nv-g-muzik)" />
            </g>
            <g className="nv-bounce nv-bounce-2">
              <circle cx="17.8" cy="16" r="2.2" fill="#ffc531" />
              <rect x="19.3" y="6.6" width="1.6" height="9.4" rx="0.8" fill="#ffc531" />
            </g>
          </g>
        </svg>
      );
    case "nav.apiKey":
      return (
        <svg viewBox="0 0 24 24" className="nv-svg" aria-hidden>
          <defs>
            <linearGradient id="nv-g-key" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffd54d" />
              <stop offset="1" stopColor="#ff9800" />
            </linearGradient>
          </defs>
          <g className="nv-float" fill="none" stroke="url(#nv-g-key)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 14a4.2 4.2 0 1 1 4.2-4.2L21 18.5V21h-2.5M8 9.8v.01" className="nv-pulse" />
          </g>
          <path d="M20.2 4.2l.5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5Z" fill="#ffe082" className="nv-twinkle" />
        </svg>
      );
    case "nav.info":
      return (
        <svg viewBox="0 0 24 24" className="nv-svg" aria-hidden>
          <defs>
            <linearGradient id="nv-g-info" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#4facfe" />
              <stop offset="1" stopColor="#2f7cf6" />
            </linearGradient>
          </defs>
          <g className="nv-float">
            <circle cx="12" cy="12" r="9.4" fill="url(#nv-g-info)" />
            <circle cx="12" cy="12" r="9.4" fill="none" stroke="#0b4a8f" strokeOpacity="0.3" strokeWidth="1.3" />
            <circle cx="12" cy="7.6" r="1.35" fill="#ffffff" className="nv-pulse" />
            <rect x="10.9" y="10.8" width="2.2" height="6" rx="1.1" fill="#ffffff" />
          </g>
        </svg>
      );
    case "nav.changelog":
      return (
        <svg viewBox="0 0 24 24" className="nv-svg" aria-hidden>
          <defs>
            <linearGradient id="nv-g-cl" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#34d399" />
              <stop offset="1" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
          <g className="nv-float">
            <circle cx="12" cy="12" r="9.4" fill="url(#nv-g-cl)" />
            <circle cx="12" cy="12" r="9.4" fill="none" stroke="#065f56" strokeOpacity="0.3" strokeWidth="1.3" />
            <path d="M12 7v5l3.4 2" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" className="nv-hand" />
            <circle cx="12" cy="12" r="1.3" fill="#ffffff" />
          </g>
        </svg>
      );
    default:
      return null;
  }
}

export default function StaggeredMenu() {
  const siteTheme = useSiteTheme();
  const t = useT();
  const textLines = [t("menu"), t("close"), t("menu"), t("close"), t("menu"), t("close")];
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
                  <span className="sm-panel-itemLabel">{t(item.k)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sm-settings">
          <p className="sm-settings-title">{t("set.title")}</p>
          <ul className="sm-settings-list">
            <li className="sm-settings-row">
              <span className="sm-settings-icon">
                <LanguagePicker />
              </span>
              <span className="sm-settings-label">{t("set.lang")}</span>
            </li>
            <li className="sm-settings-row">
              <span className="sm-settings-icon">
                <SoundToggle />
              </span>
              <span className="sm-settings-label">{t("set.sound")}</span>
            </li>
            <li className="sm-settings-row">
              <span className="sm-settings-icon">
                <ThemeToggle compact />
              </span>
              <span className="sm-settings-label">{t("set.bright")}</span>
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
                  <svg width="24" height="24" viewBox="0 0 24 24" className="th-palette transition-transform duration-500 group-hover:rotate-[25deg]" aria-hidden>
                    <defs>
                      <linearGradient id="pm-palette" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#e3350d" />
                        <stop offset="0.28" stopColor="#ffc531" />
                        <stop offset="0.52" stopColor="var(--md-tertiary)" />
                        <stop offset="0.76" stopColor="#2f7cf6" />
                        <stop offset="1" stopColor="#00a878" />
                      </linearGradient>
                      <linearGradient id="pm-palette-shine" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
                        <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M12 3a9 9 0 0 0 0 18c1.3 0 2.1-.9 2.1-1.9 0-.5-.2-.9-.5-1.3-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8h2.1a4 4 0 0 0 4-4C21 6.6 17 3 12 3Z"
                      fill="url(#pm-palette)"
                    />
                    <path
                      d="M12 4.6a7.4 7.4 0 0 0 0 14.8c.7 0 1.2-.5 1.2-1.1 0-.3-.1-.6-.3-.8-.3-.3-.5-.7-.5-1.2 0-.9.7-1.6 1.6-1.6h1.9a3.2 3.2 0 0 0 3.2-3.2C19.1 7.7 15.9 4.6 12 4.6Z"
                      fill="url(#pm-palette-shine)"
                      className="th-shine"
                    />
                    <circle cx="8.2" cy="9.2" r="1.5" fill="#e3350d" className="th-dot th-dot-1" />
                    <circle cx="12.6" cy="6.8" r="1.5" fill="#ffc531" className="th-dot th-dot-2" />
                    <circle cx="16.6" cy="10.4" r="1.5" fill="#2f7cf6" className="th-dot th-dot-3" />
                    <circle cx="7.4" cy="13.8" r="1.5" fill="#00a878" className="th-dot th-dot-4" />
                    <path d="M19.4 3.4l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5Z" fill="#ffe082" className="th-spark th-spark-1" />
                    <path d="M4.2 17.6l.4 1 1 .4-1 .4-.4 1-.4-1-1-.4 1-.4Z" fill="#ffc531" className="th-spark th-spark-2" />
                  </svg>
                </button>
              </span>
              <span className="sm-settings-label">{t("set.theme").replace("{t}", THEME_LABELS[siteTheme])}</span>
            </li>
            <li className="sm-settings-row">
              <span className="sm-settings-icon">
                <WallpaperControl />
              </span>
              <span className="sm-settings-label">{t("set.wallpaper")}</span>
            </li>
            <li className="sm-settings-row">
              <span className="sm-settings-icon">
                <FallbackModeButton />
              </span>
              <span className="sm-settings-label">{t("set.spui")}</span>
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
                <span className="sm-settings-label">{t("set.logout")}</span>
              </li>
            )}
          </ul>
        </div>

        <div className="sm-socials">
          <p className="sm-socials-title">{t("set.explore")}</p>
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
        aria-label={open ? t("close") : t("menu")}
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
            {textLines.map((line, i) => (
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
