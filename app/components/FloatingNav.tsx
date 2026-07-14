"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { NAV } from "../lib/nav";

/* ---------------------------------------------------------------------------
   Floating navigation — mobile + iPad only (below the `lg` breakpoint).

   Instead of the desktop oyster, the sections drift around a small abstract
   organic form as points of light in open water. Each label orbits the core
   at its own distance; a barely-there dotted trajectory ties it back to the
   centre and softly lights up when chosen. The whole thing breathes, drifts
   and floats — discovery, not a menu.

   Desktop is untouched: this component is never mounted at `lg` and above.
--------------------------------------------------------------------------- */

// Where each section floats — an angle around the core and its own distance
// from it, so nothing sits on a tidy ring. Space (0..100), centre at (50,50).
// Longer names are kept near the top/bottom where there is horizontal room;
// the shortest sit out on the flanks. Distances vary so they read as depth.
const ORBIT: { a: number; r: number }[] = [
  { a: -125, r: 30 }, // 01 Home        — upper-left, near
  { a: -88, r: 36 }, //  02 Statement   — top, far
  { a: -40, r: 32 }, //  03 Works       — upper-right
  { a: -5, r: 30 }, //   04 About       — right, near
  { a: 38, r: 33 }, //   05 CV          — lower-right
  { a: 88, r: 37 }, //   06 Exhibitions — bottom, far
  { a: 133, r: 34 }, //  07 Commercial  — lower-left
  { a: 176, r: 30 }, //  08 Shop        — left, near
  { a: 205, r: 32 }, //  09 Contact     — upper-left, far
];

// Shorter display names for the orbit — keeps the composition airy while the
// real routes (and full names in aria-labels) stay intact.
const SHORT: Record<string, string> = {
  "Artist Statement": "Statement",
  "Commercial Production": "Commercial",
};

const CENTER = 50;
const CORE_R = 15; // trajectories start at the core's edge, not its centre.
const rad = (deg: number) => (deg * Math.PI) / 180;

// Resolve an orbit slot to a point in the 0..100 space.
function point(o: { a: number; r: number }) {
  return {
    x: CENTER + o.r * Math.cos(rad(o.a)),
    y: CENTER + o.r * Math.sin(rad(o.a)),
  };
}

// A gently curved dotted trajectory from the core's edge out to a label.
function trajectory(o: { a: number; r: number }, i: number) {
  const p = point(o);
  const dx = p.x - CENTER;
  const dy = p.y - CENTER;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const sx = CENTER + ux * CORE_R; // start at the shell edge
  const sy = CENTER + uy * CORE_R;
  const ex = p.x - ux * 6; // stop just short of the text
  const ey = p.y - uy * 6;
  const mx = (sx + ex) / 2;
  const my = (sy + ey) / 2;
  const bow = i % 2 === 0 ? 6 : -6; // alternate the curve's lean
  const cx = mx + -uy * bow;
  const cy = my + ux * bow;
  return `M ${sx.toFixed(2)} ${sy.toFixed(2)} Q ${cx.toFixed(2)} ${cy.toFixed(
    2
  )} ${ex.toFixed(2)} ${ey.toFixed(2)}`;
}

// Deterministic drifting motes — fixed so server and client render alike.
const PARTICLES = [
  { x: 18, y: 20, s: 1.4, d: 0, t: 9 },
  { x: 80, y: 16, s: 2.0, d: 1.4, t: 11 },
  { x: 88, y: 52, s: 1.2, d: 2.1, t: 10 },
  { x: 72, y: 82, s: 1.8, d: 0.6, t: 12 },
  { x: 30, y: 86, s: 1.4, d: 1.9, t: 9.5 },
  { x: 12, y: 60, s: 2.2, d: 2.6, t: 13 },
  { x: 52, y: 9, s: 1.0, d: 3.1, t: 10.5 },
  { x: 61, y: 33, s: 1.2, d: 1.1, t: 8.5 },
  { x: 39, y: 64, s: 1.6, d: 2.3, t: 11.5 },
  { x: 66, y: 60, s: 1.0, d: 0.3, t: 9 },
  { x: 24, y: 42, s: 1.2, d: 1.7, t: 12.5 },
  { x: 84, y: 74, s: 1.4, d: 2.9, t: 10 },
];

export default function FloatingNav() {
  const router = useRouter();
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="orbit" role="navigation" aria-label="Sections">
      {/* Trajectories, breathing core and motes share one square space so the
          dotted paths line up exactly with the floating labels. */}
      <svg
        className="orbit-field"
        viewBox="0 0 100 100"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <radialGradient id="orbitCore" cx="50%" cy="47%" r="55%">
            <stop offset="0%" stopColor="rgba(var(--oyster-rgb), 0.30)" />
            <stop offset="55%" stopColor="rgba(var(--oyster-rgb), 0.10)" />
            <stop offset="100%" stopColor="rgba(var(--oyster-rgb), 0)" />
          </radialGradient>
          <radialGradient id="orbitHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(var(--atmo), 0.5)" />
            <stop offset="100%" stopColor="rgba(var(--atmo), 0)" />
          </radialGradient>
          <filter id="orbitSoft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
        </defs>

        {/* Guide trajectories — extremely faint, one lit when chosen. */}
        <g className="orbit-paths">
          {ORBIT.map((o, i) => (
            <path
              key={i}
              className={`orbit-path${active === i ? " is-lit" : ""}`}
              d={trajectory(o, i)}
            />
          ))}
        </g>

        {/* Atmospheric halo behind the form. */}
        <circle
          className="orbit-halo"
          cx="50"
          cy="50"
          r="20"
          fill="url(#orbitHalo)"
        />

        {/* The abstract living form — a small breathing organic body, kept
            deliberately small so open water surrounds it on every side. */}
        <g className="orbit-breathe">
          <path
            className="orbit-body"
            d="M50 36 C57 36 64 40 65 47.5 C66 55 61 60 54 62.5 C48.5 64 41.5 63.5 38.5 58 C35.5 52.5 37 44.5 41 40.5 C44 37.5 46 36 50 36 Z"
            fill="url(#orbitCore)"
          />
          <path
            className="orbit-body-inner"
            d="M50 43 C54.5 43 59 45.5 59.5 50.5 C60 55 57 58 52.5 59.5 C49 60.5 44.5 60 42.5 56 C40.5 52 42 47 45 44.5 C46.8 43.4 48 43 50 43 Z"
          />
        </g>
      </svg>

      {/* Drifting motes. */}
      <div className="orbit-motes" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="orbit-mote"
            style={
              {
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.s}px`,
                height: `${p.s}px`,
                "--t": `${p.t}s`,
                "--d": `${p.d}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Floating labels — the navigation. */}
      {NAV.map((item, i) => {
        const p = point(ORBIT[i]);
        return (
          <span
            key={item.href}
            className="orbit-anchor"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <span
              className="orbit-drift"
              style={
                {
                  "--t": `${11 + (i % 5) * 1.3}s`,
                  "--d": `${(i % 4) * 0.9}s`,
                } as React.CSSProperties
              }
            >
              <a
                href={item.href}
                className={`orbit-label${active === i ? " is-active" : ""}`}
                aria-label={`${item.n} ${item.label}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(i);
                  router.push(item.href);
                }}
                onPointerEnter={() => setActive(i)}
                onPointerDown={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className="orbit-idx">{item.n}</span>
                <span className="orbit-name">
                  {SHORT[item.label] ?? item.label}
                </span>
              </a>
            </span>
          </span>
        );
      })}

      <span className="sr-only" aria-live="polite">
        {active !== null ? `${NAV[active].n} ${NAV[active].label}` : ""}
      </span>
    </div>
  );
}
