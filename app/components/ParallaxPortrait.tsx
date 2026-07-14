"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A hidden, almost-subconscious portrait living on a background layer behind
 * the interface. Dragging the page horizontally (mouse) or panning (touch)
 * reveals it drifting in soft parallax; releasing lets it ease back. Very soft
 * blur, low opacity — it must never compete with the oyster.
 *
 * Drop the real image at /public/portrait.jpg; until then a soft dreamy
 * teal/coral wash stands in.
 */
export default function ParallaxPortrait() {
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef<number | null>(null);

  useEffect(() => {
    const down = (e: PointerEvent) => {
      start.current = e.clientX;
      setDragging(true);
    };
    const move = (e: PointerEvent) => {
      if (start.current === null) return;
      const d = Math.max(-420, Math.min(420, e.clientX - start.current));
      setOffset(d);
    };
    const up = () => {
      start.current = null;
      setDragging(false);
      setOffset(0); // ease back
    };
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
    >
      <div
        style={{
          transform: `translate3d(${offset * 0.12}px, 0, 0)`,
          transition: dragging
            ? "transform 0.12s linear"
            : "transform 2.2s cubic-bezier(0.16,0.72,0.24,1)",
        }}
        className="absolute inset-0"
      >
        {/* Portrait, softly blurred and faint. */}
        <div
          className="absolute right-[-6%] top-1/2 h-[120vh] w-[70vw] -translate-y-1/2"
          style={{
            backgroundImage:
              "url('/images/portrait/DSCF1296.JPG'), radial-gradient(60% 55% at 55% 40%, rgba(var(--coral-rgb),0.12), transparent 70%), radial-gradient(70% 60% at 40% 65%, rgba(var(--oyster-rgb),0.10), transparent 72%)",
            backgroundSize: "cover, cover, cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "blur(48px) grayscale(0.4)",
            opacity: 0.14,
          }}
        />
      </div>
    </div>
  );
}
