"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Rumah" },
  { href: "/kuiz", label: "Kuiz" },
  { href: "/pokedex", label: "Pokédex" },
  { href: "/info", label: "Info" },
];

const TEXT_LINES = ["Menu", "Close", "Menu", "Close", "Menu", "Close"];

export default function StaggeredMenu() {
  const [open, setOpen] = useState(false);
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
