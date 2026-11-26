"use client";

import { useEffect, useRef, useState } from "react";

function useReveal<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown, threshold]);
  return { ref, shown };
}

export function RevealWords({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const { ref, shown } = useReveal<HTMLSpanElement>();
  const words = text.split(" ");
  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="inline-block transition-all duration-700 ease-out"
          style={{
            transitionDelay: shown ? `${i * 0.06}s` : "0s",
            opacity: shown ? 1 : 0,
            transform: shown ? "none" : "translateY(0.6em)",
            filter: shown ? "blur(0px)" : "blur(6px)",
          }}
        >
          {w}
          {i < words.length - 1 ? "\u00a0" : ""}
        </span>
      ))}
    </span>
  );
}

export function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, shown } = useReveal<HTMLDivElement>(0.15);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        transitionDelay: `${delay}s`,
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(1.5rem)",
      }}
    >
      {children}
    </div>
  );
}
