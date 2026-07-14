"use client";

import { useEffect, useRef } from "react";
import styles from "./WaterMermaid.module.css";

/* ---------------------------------------------------------------------------
   WaterMermaid — a small, abstract, translucent water symbol.

   Read as: a droplet at first glance; on a longer look a torso-like curve and
   a flowing tail emerge. No face / hair / limbs / scales — a living liquid
   symbol, not an illustration. See WaterMermaid.module.css for the movement
   path, durations, size, opacity, blur and deformation notes.

   INTERACTION: pointer-events: none (never blocks content). An optional very
   subtle cursor repulsion (max 14px, eased) nudges it away from the pointer —
   it does NOT follow the cursor, and it stays calm. Disabled under
   prefers-reduced-motion.
--------------------------------------------------------------------------- */
export default function WaterMermaid({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const repelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const REACH = 150; // px radius within which the pointer is felt
    const MAX = 14; // px maximum displacement — deliberately tiny
    let mx = -9999;
    let my = -9999;
    let raf = 0;

    const apply = () => {
      raf = 0;
      const el = svgRef.current;
      const repel = repelRef.current;
      if (!el || !repel) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = cx - mx;
      const dy = cy - my;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < REACH) {
        const f = (1 - dist / REACH) * MAX;
        repel.style.transform = `translate(${(dx / dist) * f}px, ${(dy / dist) * f}px)`;
      } else {
        repel.style.transform = "translate(0px, 0px)";
      }
    };
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={`${styles.root} ${className}`} aria-hidden="true">
      <div className={styles.drift}>
        <div className={styles.breathe}>
          <div ref={repelRef} className={styles.repel}>
            <svg
              ref={svgRef}
              className={styles.svg}
              viewBox="0 0 120 260"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Translucent water — very subtle pale-cyan tint, top→tail. */}
                <linearGradient id="wm-water" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e2f5f8" stopOpacity="0.5" />
                  <stop offset="45%" stopColor="#c9ecf2" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#bfe6ef" stopOpacity="0.52" />
                </linearGradient>
                {/* Faint glass refraction band. */}
                <linearGradient id="wm-refract" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
                {/* Irregular, slightly-blurred edges from "surface tension". */}
                <filter id="wm-edge" x="-25%" y="-25%" width="150%" height="150%">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.014 0.02"
                    numOctaves="2"
                    seed="7"
                    result="noise"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="noise"
                    scale="5"
                    xChannelSelector="R"
                    yChannelSelector="G"
                    result="disp"
                  />
                  <feGaussianBlur in="disp" stdDeviation="0.7" />
                </filter>
                <filter id="wm-soft" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="2.2" />
                </filter>
              </defs>

              {/* The shape: torso droplet + flowing tail, sharing one water fill.
                  They overlap at the waist so the join is invisible. */}
              <g filter="url(#wm-edge)">
                {/* Tail (drawn first, behind the torso) — a gently S-curved,
                    tapering flow ending in a soft split fluke. Sways ±4°. */}
                <g className={styles.tail}>
                  <path
                    d="M72.2 113.6 C76.7 113.8 74.1 120.3 74.9 123.7 C75.8 127.1 76.7 130.6 77.6 134.0 C78.4 137.5 79.2 140.9 79.9 144.4 C80.5 147.9 81.2 151.4 81.7 154.9 C82.2 158.4 82.6 161.9 82.9 165.4 C83.1 168.9 83.3 172.4 83.3 175.9 C83.3 179.4 83.2 182.8 82.9 186.3 C82.7 189.7 82.3 193.1 81.7 196.5 C81.2 199.9 80.5 203.3 79.8 206.6 C79.0 209.9 78.1 213.2 77.1 216.5 C76.1 219.8 72.1 223.4 73.8 226.3 C75.4 229.2 82.8 230.1 87.0 233.9 C91.2 237.7 100.0 247.1 99.0 248.9 C98.0 250.7 85.8 248.4 81.0 244.9 C76.2 241.4 73.7 227.9 70.0 227.9 C66.3 227.9 63.5 241.4 59.0 244.9 C54.5 248.4 44.0 250.7 43.0 248.9 C42.0 247.1 49.0 238.0 53.0 233.9 C57.0 229.8 64.5 227.6 67.1 224.4 C69.7 221.2 68.2 217.9 68.6 214.7 C69.0 211.5 69.3 208.3 69.5 205.1 C69.6 201.9 69.7 198.8 69.6 195.6 C69.6 192.5 69.4 189.4 69.1 186.4 C68.7 183.3 68.3 180.3 67.8 177.2 C67.2 174.2 66.5 171.2 65.7 168.2 C65.0 165.2 64.1 162.2 63.1 159.2 C62.1 156.2 61.0 153.2 59.9 150.1 C58.7 147.1 57.4 144.1 56.1 141.0 C54.8 138.0 53.5 134.9 52.1 131.8 C50.7 128.7 44.4 125.5 47.8 122.4 C51.1 119.4 67.7 113.4 72.2 113.6 Z"
                    fill="url(#wm-water)"
                  />
                </g>

                {/* Torso droplet — rounded top tapering to the waist. */}
                <path
                  d="M60 12
                     C 84 12 99 34 94 62
                     C 90 86 80 98 74 120
                     C 70 134 66 142 60 150
                     C 54 142 50 134 46 120
                     C 40 98 30 86 26 62
                     C 21 34 36 12 60 12 Z"
                  fill="url(#wm-water)"
                />

                {/* Refraction band across the body (glass feel). */}
                <path
                  d="M60 12
                     C 84 12 99 34 94 62
                     C 90 86 80 98 74 120
                     C 70 134 66 142 60 150
                     C 58 130 56 96 58 66
                     C 60 40 54 24 60 12 Z"
                  fill="url(#wm-refract)"
                  opacity="0.7"
                />
              </g>

              {/* One or two delicate highlights (soft, blurred). */}
              <ellipse
                cx="50"
                cy="44"
                rx="9"
                ry="16"
                fill="#ffffff"
                opacity="0.5"
                filter="url(#wm-soft)"
              />
              <ellipse
                cx="68"
                cy="150"
                rx="4"
                ry="10"
                fill="#ffffff"
                opacity="0.35"
                filter="url(#wm-soft)"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
