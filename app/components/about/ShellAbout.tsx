"use client";

import { useEffect, useRef } from "react";
import { OYSTER_RINGS, OYSTER_VIEWBOX, OYSTER_CENTER } from "../../lib/oyster";

/* The About page as an interior of the shell. The real oyster growth-rings
   (app/lib/oyster.ts) become a large architectural frame — thin layered
   contours, a couple in subtle teal — around a clean, readable text column.
   On load the rings unfold outward from the shell's centre and the text rises
   in; afterwards the shell breathes almost imperceptibly and drifts a little
   under scroll for depth. All motion uses the shared tokens and is disabled
   under prefers-reduced-motion. */

const BIO = [
  "Camille Buzuno (Kamilya Buzunova) is a painter and creative director based in Prague, Czech Republic.",
  "Originally from Almaty, Kazakhstan, she first studied Animation at the Kazakh National Academy of Arts before completing a Bachelor’s degree in Painting and Graphic Design at ART & DESIGN INSTITUT in Prague.",
  "Her multidisciplinary background combines animation, painting and visual storytelling, shaping a practice that moves between traditional fine art and contemporary visual media.",
  "Working primarily with oil painting, Camille explores the expressive potential of the human body, silhouette and color. Through long-term series, she investigates emotional and psychological states, treating each body of work as a complete visual narrative rather than a collection of individual paintings.",
  "Alongside her fine art practice, she works across creative direction and interactive visual experiences, exploring how contemporary technologies can deepen the way audiences engage with images and stories.",
  "She currently lives and works in Prague, Czech Republic.",
];

// The frame uses the outer half of the shell. Inner layers (denser) are hidden
// on small screens to simplify the shape. Rings 6 & 8 echo the site's teal
// accent layers (07 / 09).
const LAYERS = [
  { i: 3, group: "inner", dense: true },
  { i: 4, group: "inner", dense: false },
  { i: 5, group: "inner", dense: true },
  { i: 6, group: "outer", dense: false, accent: true },
  { i: 7, group: "outer", dense: true },
  { i: 8, group: "outer", dense: false, accent: true },
];

export default function ShellAbout() {
  const outerRef = useRef<SVGGElement>(null);
  const innerRef = useRef<SVGGElement>(null);

  // Subtle scroll parallax — the two ring groups drift at slightly different
  // rates for depth. Skipped entirely under reduced-motion.
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    let raf = 0;
    const apply = () => {
      raf = 0;
      const y = window.scrollY;
      if (outerRef.current)
        outerRef.current.style.transform = `translateY(${(y * 0.05).toFixed(2)}px)`;
      if (innerRef.current)
        innerRef.current.style.transform = `translateY(${(y * -0.035).toFixed(2)}px)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    apply();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const rings = (which: "inner" | "outer") =>
    LAYERS.filter((l) => l.group === which).map((l, n) => (
      <path
        key={l.i}
        d={OYSTER_RINGS[l.i]}
        className={`about-ring${l.accent ? " about-ring--accent" : ""}${
          l.dense ? " about-ring--dense" : ""
        }`}
        style={{ "--i": which === "inner" ? n : n + 3 } as React.CSSProperties}
      />
    ));

  return (
    <main className="about">
      <div className="about-inner">
        <div className="about-shell" aria-hidden="true">
          <svg
            viewBox={OYSTER_VIEWBOX}
            preserveAspectRatio="xMidYMid slice"
            className="about-shell-svg"
            style={
              {
                "--cx": `${OYSTER_CENTER.x}px`,
                "--cy": `${OYSTER_CENTER.y}px`,
              } as React.CSSProperties
            }
          >
            <g className="about-breathe">
              <g ref={outerRef} className="about-parallax">
                {rings("outer")}
              </g>
              <g ref={innerRef} className="about-parallax">
                {rings("inner")}
              </g>
            </g>
          </svg>
        </div>

        <article className="about-content">
          <p className="label-mono about-eyebrow">About</p>
          <h1 className="about-name">Camille Buzuno</h1>
          <p className="about-alt">(Kamilya Buzunova)</p>

          <div className="about-bio">
            {BIO.map((para, i) => (
              <p
                key={i}
                className="about-para"
                style={{ "--i": i } as React.CSSProperties}
              >
                {para}
              </p>
            ))}
          </div>
        </article>
      </div>
    </main>
  );
}
