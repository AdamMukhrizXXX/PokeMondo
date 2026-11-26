"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { setUiMode } from "../lib/ui-mode";

type Props = {
  label: string;
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  error: Error | null;
};

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[UI Cadangan] ${this.props.label}:`, error, info.componentStack);
  }

  private retry = () => {
    this.setState({ error: null });
  };

  private toSimple = () => {
    setUiMode("simple");
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    if (this.props.fallback) return this.props.fallback;
    return (
      <div
        role="alert"
        className="mx-auto my-6 max-w-md rounded-3xl border border-outline-variant bg-surface-container-low p-6 shadow-e2"
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="grid size-10 shrink-0 place-items-center rounded-full"
            style={{
              background: "color-mix(in srgb, var(--md-error) 18%, transparent)",
              color: "var(--md-error)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 3 2.5 20h19L12 3Zm0 6v5m0 3.5v.01" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="font-display text-base font-extrabold text-on-surface">
              Bahagian {this.props.label} bermasalah
            </p>
            <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
              UI utama untuk bahagian ini tidak dapat dipaparkan. Cuba semula, atau guna UI
              Cadangan yang lebih ringkas.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={this.retry}
            className="flex h-10 items-center rounded-full bg-primary px-5 font-display text-sm font-bold text-on-primary shadow-e1 transition-transform active:scale-95"
          >
            Cuba semula
          </button>
          <button
            type="button"
            onClick={this.toSimple}
            className="flex h-10 items-center rounded-full border border-outline-variant px-5 font-display text-sm font-bold text-on-surface-variant transition-colors hover:bg-surface-container"
          >
            Guna UI Cadangan
          </button>
        </div>
        <details className="mt-3">
          <summary className="cursor-pointer text-xs font-semibold text-on-surface-variant">
            Butiran ralat
          </summary>
          <p className="mt-1 break-words font-mono text-[11px] leading-relaxed text-on-surface-variant">
            {error.message}
          </p>
        </details>
      </div>
    );
  }
}
