"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { NAV } from "../lib/nav";
import OysterNav from "./OysterNav";

/* Mobile + tablet homepage composition. The oyster stays the centered focal
   point; the nav labels thread off its growth-ring numbers on the left flank,
   each joined to its segment by a very thin connector line. Because the shell's
   ordinals cascade down the lower-left flank (see app/lib/oyster.ts), aligning
   the labels to that flank keeps every thread short and non-crossing — the
   navigation reads as if it grows out of the shell rather than sitting apart
   from it. Desktop keeps its own hover-reveal oyster (this component is
   lg:hidden). A second way to navigate; the oyster itself stays tappable. */

type Tier = "primary" | "secondary" | "muted";

// Emphasis + vertical anchor (% of the hero box) per ordinal. Primary = the
// artistic through-line the homepage should lead with; Commercial Production
// (07) is deliberately muted so it never competes with the practice.
const LAYOUT: Record<
  string,
  { tier: Tier; top: number; label?: string }
> = {
  "01": { tier: "secondary", top: 14 },
  "02": { tier: "primary", top: 24 },
  "03": { tier: "primary", top: 34, label: "Selected Works" },
  "04": { tier: "secondary", top: 44 },
  "05": { tier: "secondary", top: 54 },
  "06": { tier: "primary", top: 64 },
  "07": { tier: "muted", top: 73 },
  "08": { tier: "secondary", top: 82 },
  "09": { tier: "primary", top: 91 },
};

type Line = { x1: number; y1: number; x2: number; y2: number };

export default function OysterHero({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [lines, setLines] = useState<Record<string, Line>>({});
  const [box, setBox] = useState({ w: 0, h: 0 });

  // Measure the rendered segment-number positions and each label's inner edge,
  // then draw a thread between them. Recomputed on resize/orientation and once
  // more after fonts + the shell's entrance settle. The shell's slow breathing
  // shifts the numbers by ~1–2px, which is imperceptible on a hairline thread.
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let raf = 0;

    const measure = () => {
      const wr = wrap.getBoundingClientRect();
      if (!wr.width) return;
      setBox({ w: wr.width, h: wr.height });

      const numByN: Record<string, DOMRect> = {};
      wrap.querySelectorAll<SVGTextElement>(".oyster-num").forEach((t) => {
        const n = (t.textContent || "").trim();
        if (n) numByN[n] = t.getBoundingClientRect();
      });

      const next: Record<string, Line> = {};
      for (const item of NAV) {
        const lab = labelRefs.current[item.n];
        const nr = numByN[item.n];
        if (!lab || !nr) continue;
        const lr = lab.getBoundingClientRect();
        next[item.n] = {
          x1: lr.right - wr.left,
          y1: lr.top + lr.height / 2 - wr.top,
          x2: nr.left + nr.width / 2 - wr.left,
          y2: nr.top + nr.height / 2 - wr.top,
        };
      }
      setLines(next);
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(wrap);
    const settle = window.setTimeout(schedule, 320);
    window.addEventListener("resize", schedule);
    window.addEventListener("orientationchange", schedule);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`omn ${className}`.trim()}>
      <OysterNav />

      {/* Connector threads — purely decorative; the labels carry the links. */}
      <svg
        className="omn-threads"
        width={box.w}
        height={box.h}
        viewBox={`0 0 ${box.w || 1} ${box.h || 1}`}
        aria-hidden="true"
        focusable="false"
      >
        {NAV.map((item) => {
          const l = lines[item.n];
          if (!l) return null;
          return (
            <line
              key={item.n}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              className={`omn-thread omn-thread--${LAYOUT[item.n].tier}`}
            />
          );
        })}
      </svg>

      {/* Labels — a second, immediately-legible way to navigate. Kept
          aria-hidden: the oyster already exposes an ordered nav to screen
          readers, so these must not announce the nine links a second time. */}
      {NAV.map((item) => {
        const cfg = LAYOUT[item.n];
        const label =
          cfg.label ?? (item.label === "Works" ? "Selected Works" : item.label);
        return (
          <Link
            key={item.href}
            href={item.href}
            tabIndex={-1}
            aria-hidden="true"
            ref={(el) => {
              labelRefs.current[item.n] = el;
            }}
            className={`omn-label omn-label--${cfg.tier}`}
            style={{ top: `${cfg.top}%` }}
          >
            <span className="omn-n">{item.n}</span>
            <span className="omn-t">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
