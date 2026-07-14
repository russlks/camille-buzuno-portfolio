"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { NAV } from "../lib/nav";
import {
  OYSTER_VIEWBOX,
  OYSTER_CENTER,
  OYSTER_RINGS,
  OYSTER_LABELS,
} from "../lib/oyster";

/* ---------------------------------------------------------------------------
   Oyster navigation — recreated from Camille's Figma oyster sketch.

   The outer silhouette and the drift of the growth lines are traced directly
   from the sketch (app/lib/oyster.ts) and subdivided into nine nested growth
   rings, so every route is its own clickable layer: ring 01 (Home) is the
   coral-lit core by the hinge, ring 09 (Contact) is the open outer rim.

   Rendering: teal/cyan glass shell, a soft diffused coral core, slow breathing
   motion and a gentle cursor parallax. Hovering a ring reveals its title
   inside the layer.
--------------------------------------------------------------------------- */

// Rings painted outer → inner so the small central layers stay crisp on top.
const ORDER = NAV.map((_, i) => i).reverse();

// Per-ring fill translucency — denser toward the centre (opacity hierarchy).
const bandAlpha = (i: number) => (0.15 - i * 0.011).toFixed(3);

// Annulus between ring i and the next ring inward (ring 0 is a solid centre).
const bandPath = (i: number) =>
  i === 0 ? OYSTER_RINGS[0] : `${OYSTER_RINGS[i]} ${OYSTER_RINGS[i - 1]}`;

export default function OysterNav() {
  const router = useRouter();
  const [active, setActive] = useState(NAV[0]);
  const [par, setPar] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Soft cursor parallax: nudge the shell a few units toward the pointer.
  function onMove(e: React.MouseEvent) {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return;
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    setPar({ x: nx * 14, y: ny * 14 });
  }

  return (
    <div className="flex flex-col items-center">
      <svg
        ref={svgRef}
        viewBox={OYSTER_VIEWBOX}
        className="oyster h-[min(68vh,580px)] w-auto max-w-[86vw] overflow-visible lg:h-[min(78vh,680px)] lg:max-w-[92vw]"
        role="group"
        aria-label="Oyster shell navigation"
        onMouseMove={onMove}
        onMouseLeave={() => setPar({ x: 0, y: 0 })}
      >
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: "rgba(var(--coral-rgb), 1)" }} />
            <stop offset="35%" style={{ stopColor: "rgba(var(--coral-rgb), 0.62)" }} />
            <stop offset="100%" style={{ stopColor: "rgba(var(--coral-rgb), 0)" }} />
          </radialGradient>
          {/* Atmospheric light — very pale cyan-blue, no defined edge; it
              dissolves softly into the background rather than reading as a
              glow. Shared by the overlapping soft ellipses below. */}
          <radialGradient id="atmoGlow" cx="50%" cy="46%" r="74%">
            <stop offset="0%" style={{ stopColor: "rgba(var(--atmo), 0.55)" }} />
            <stop offset="55%" style={{ stopColor: "rgba(var(--atmo), 0.2)" }} />
            <stop offset="100%" style={{ stopColor: "rgba(var(--atmo), 0)" }} />
          </radialGradient>
          <filter id="lift" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="10"
              floodColor="rgba(var(--oyster-rgb), 1)"
              floodOpacity="0.55"
            />
          </filter>
          {/* Very large, very soft blur so the atmosphere has no visible edge. */}
          <filter id="soft" x="-140%" y="-140%" width="380%" height="380%">
            <feGaussianBlur stdDeviation="62" />
          </filter>
          <filter id="coreblur" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="20" />
          </filter>
          {/* Soft blur for the directional inner shell-depth shading */}
          <filter id="shellblur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.2" />
          </filter>
          {/* Clip the shading to each layer's interior so it can only fall
              inward — never leaking past the silhouette. */}
          <clipPath id="clipShell9">
            <path d={OYSTER_RINGS[8]} />
          </clipPath>
          <clipPath id="clipShell7">
            <path d={OYSTER_RINGS[6]} />
          </clipPath>
        </defs>

        {/* Atmospheric light — two large, overlapping, barely-there ellipses,
            kept static (outside the breathing group) so it reads as ambient
            moisture/light supporting the oyster, not a graphic element. */}
        <ellipse
          className="oyster-anatomy oyster-atmo-a"
          cx={OYSTER_CENTER.x}
          cy={OYSTER_CENTER.y + 12}
          rx="300"
          ry="326"
          fill="url(#atmoGlow)"
          filter="url(#soft)"
        />
        <ellipse
          className="oyster-anatomy oyster-atmo-b"
          cx={OYSTER_CENTER.x - 34}
          cy={OYSTER_CENTER.y - 58}
          rx="210"
          ry="220"
          fill="url(#atmoGlow)"
          filter="url(#soft)"
        />

        <g
          style={{
            transform: `translate(${par.x}px, ${par.y}px)`,
            transition: "transform 1.4s cubic-bezier(0.16,0.72,0.24,1)",
          }}
        >
          <g className="oyster-breathe">
            {/* Soft diffused coral core — the living centre inside ring 01 */}
            <ellipse
              className="oyster-anatomy oyster-core"
              cx={OYSTER_CENTER.x}
              cy={OYSTER_CENTER.y}
              rx="92"
              ry="100"
              fill="url(#coreGlow)"
              filter="url(#coreblur)"
            />

            {/* Growth rings — the navigation */}
            {ORDER.map((i) => {
              const item = NAV[i];
              const a = OYSTER_LABELS[i];
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-label={`${item.n} ${item.label}`}
                  className="oyster-link"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(item.href);
                  }}
                  onMouseEnter={() => setActive(item)}
                  onFocus={() => setActive(item)}
                >
                  <path
                    className={i === 0 ? "oyster-band oyster-band--core" : "oyster-band"}
                    d={bandPath(i)}
                    fillRule={i === 0 ? undefined : "evenodd"}
                    strokeLinejoin="round"
                    style={
                      {
                        "--band-alpha": bandAlpha(i),
                        // ring ordinal (0 = coral core) → staggers the mobile
                        // "wake" entrance so parts light up one after another
                        "--wake-i": i,
                      } as React.CSSProperties
                    }
                  />
                  {/* resting ordinal */}
                  <text
                    className="oyster-num"
                    x={a.x}
                    y={a.y}
                    fontSize="11"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    pointerEvents="none"
                  >
                    {item.n}
                  </text>
                  {/* revealed inside the layer on hover */}
                  <text
                    className="oyster-title-n"
                    x={a.x}
                    y={a.y - 9}
                    fontSize="9"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    pointerEvents="none"
                  >
                    {item.n}
                  </text>
                  <text
                    className="oyster-title"
                    x={a.x}
                    y={a.y + 7}
                    fontSize={item.label.length > 12 ? 8.5 : 11}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    pointerEvents="none"
                  >
                    {item.label}
                  </text>
                </a>
              );
            })}

            {/* Shell depth on Layers 9 (outer) and 7: a directional inner
                shading clipped to each layer's interior — subsurface shell
                thickness that falls only inward, never past the silhouette.
                Black in the depth theme, white/grey in the light theme. */}
            <g clipPath="url(#clipShell9)" className="oyster-anatomy">
              <path
                d={OYSTER_RINGS[8]}
                fill="none"
                stroke="rgba(var(--shell-shade-rgb), var(--shell-shade-a))"
                strokeWidth="6"
                strokeLinejoin="round"
                filter="url(#shellblur)"
              />
            </g>
            <g clipPath="url(#clipShell7)" className="oyster-anatomy">
              <path
                d={OYSTER_RINGS[6]}
                fill="none"
                stroke="rgba(var(--shell-shade-rgb), var(--shell-shade-a))"
                strokeWidth="6"
                strokeLinejoin="round"
                filter="url(#shellblur)"
              />
            </g>

            {/* Crisp outlines for Layers 9 and 7 (black → white by theme). */}
            <path
              className="oyster-anatomy"
              d={OYSTER_RINGS[8]}
              fill="none"
              stroke="var(--shell-line)"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path
              className="oyster-anatomy"
              d={OYSTER_RINGS[6]}
              fill="none"
              stroke="var(--shell-line)"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </g>
        </g>
      </svg>

      {/* Accessible ordered list (screen readers / no-JS) */}
      <nav aria-label="Sections" className="sr-only">
        <ol>
          {NAV.map((item) => (
            <li key={item.href}>
              <a href={item.href}>
                {item.n} {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <span className="sr-only" aria-live="polite">
        {active.n} {active.label}
      </span>
    </div>
  );
}
