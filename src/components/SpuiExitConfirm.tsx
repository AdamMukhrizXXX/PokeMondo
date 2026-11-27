"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { setUiMode } from "../lib/ui-mode";

export default function SpuiExitConfirm({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const confirm = () => {
    setUiMode("full");
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label="Keluar dari SPUI"
        className="anim-rise w-full max-w-sm rounded-[1.75rem] border border-outline-variant p-6 shadow-e3"
        style={{ background: "var(--md-surface-container-low)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary-container text-on-secondary-container"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3 3.5 18.5h17L12 3Z" />
              <path d="M12 9.5v4.5m0 3v.01" />
            </svg>
          </span>
          <div>
            <p className="font-display text-base font-extrabold tracking-tight text-on-surface">
              Keluar dari SPUI?
            </p>
            <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
              Anda akan kembali ke <b className="text-on-surface">UI Penuh</b> dengan semua animasi,
              kesan bunyi dan tema. Jika UI penuh masih bermasalah, anda boleh masuk semula ke SPUI
              pada bila-bila masa — pilihan anda diingati dalam pelayar.
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            data-sfx="close"
            onClick={onClose}
            className="h-10 flex-1 rounded-full border border-outline-variant font-display text-sm font-bold text-on-surface-variant transition-colors hover:bg-surface-container"
          >
            Cancel
          </button>
          <button
            type="button"
            data-sfx="success"
            onClick={confirm}
            className="h-10 flex-1 rounded-full bg-primary font-display text-sm font-bold text-on-primary shadow-e1 transition-transform active:scale-95"
          >
            Anda Yakin?
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
