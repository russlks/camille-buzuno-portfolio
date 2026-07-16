"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------------------
   NextChapterTransition — a reusable, editorial "turn to the next chapter"
   interaction between two separate routes.

   At the genuine bottom of the page, the first intentional downward gesture
   reveals a bottom sheet ("Next chapter …") without navigating. A second
   downward gesture within a short window (or Enter/Space/↓, or the clickable
   fallback) continues to the next route with a soft cover crossfade; scrolling
   up, pausing, or the window elapsing cancels and restores the page. The
   destination shows a matching cover that fades away, so it reads as one
   continuous chapter rather than an unrelated load.

   Props:
     • next    — { href, label } to continue to (omit on the final chapter)
     • chapter — this page's own chapter name, shown on the arrival cover

   Normal scrolling before the bottom is untouched; the Back button, direct URLs
   and ordinary navigation all keep working; prefers-reduced-motion falls back
   to a plain fade / navigation.
--------------------------------------------------------------------------- */

const ARRIVE_KEY = "nct:arrive";
const ARM_WINDOW_MS = 1900;
const WHEEL_SETTLE_MS = 180; // momentum is a burst of events < this apart
const MIN_WHEEL = 6;
const TOUCH_THRESHOLD = 46;

type Phase = "idle" | "armed" | "leaving";

export default function NextChapterTransition({
  next,
  chapter,
}: {
  next?: { href: string; label: string };
  chapter?: string;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [coverActive, setCoverActive] = useState(false);
  const [coverIn, setCoverIn] = useState(false);
  const [coverTitle, setCoverTitle] = useState("");

  const phaseRef = useRef<Phase>("idle");
  const reduce = useRef(false);
  const settled = useRef(true);
  const settleTimer = useRef<number | null>(null);
  const armTimer = useRef<number | null>(null);
  const leaveRef = useRef<() => void>(() => {});

  const setP = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };
  const clearArm = () => {
    if (armTimer.current) window.clearTimeout(armTimer.current);
    armTimer.current = null;
  };

  // --- Arrival cover: if we got here through a transition, uncover the page. ---
  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let arriving = false;
    try {
      arriving = sessionStorage.getItem(ARRIVE_KEY) === "1";
      if (arriving) sessionStorage.removeItem(ARRIVE_KEY);
    } catch {}
    if (arriving && chapter && !reduce.current) {
      setCoverTitle(chapter);
      setCoverActive(true);
      setCoverIn(true);
      // Paint the cover, then fade it out to reveal the (already-loaded) page.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setCoverIn(false))
      );
      const t = window.setTimeout(() => setCoverActive(false), 1100);
      return () => window.clearTimeout(t);
    }
  }, [chapter]);

  // --- Departure interaction (only if there is a next chapter). ---
  useEffect(() => {
    if (!next) return;

    const atBottom = () =>
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2;

    const arm = () => {
      setP("armed");
      clearArm();
      armTimer.current = window.setTimeout(() => {
        if (phaseRef.current === "armed") setP("idle");
        armTimer.current = null;
      }, ARM_WINDOW_MS);
    };
    const cancel = () => {
      if (phaseRef.current !== "armed") return;
      clearArm();
      setP("idle");
    };
    const leave = () => {
      if (phaseRef.current === "leaving") return;
      clearArm();
      setP("leaving");
      try {
        sessionStorage.setItem(ARRIVE_KEY, "1");
      } catch {}
      if (reduce.current) {
        router.push(next.href);
        return;
      }
      setCoverTitle(next.label);
      setCoverActive(true);
      requestAnimationFrame(() => setCoverIn(true));
      window.setTimeout(() => router.push(next.href), 720);
    };

    const markSettling = () => {
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
      settleTimer.current = window.setTimeout(() => {
        settled.current = true;
      }, WHEEL_SETTLE_MS);
    };

    const onWheel = (e: WheelEvent) => {
      if (phaseRef.current === "leaving") return;
      markSettling();
      if (e.deltaY < 0) {
        if (phaseRef.current === "armed") cancel();
        return;
      }
      if (e.deltaY < MIN_WHEEL) return;
      if (!atBottom()) return;
      if (!settled.current) return; // inside a momentum burst → not a new gesture
      settled.current = false;
      if (phaseRef.current === "idle") arm();
      else if (phaseRef.current === "armed") leave();
    };

    // Touch — discrete swipes (no double-swipe required: one to reveal, one to go).
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (phaseRef.current === "leaving") return;
      const endY = e.changedTouches[0]?.clientY ?? startY;
      const dy = startY - endY; // + = swiped up (intent to continue down)
      if (dy > TOUCH_THRESHOLD && atBottom()) {
        if (phaseRef.current === "idle") arm();
        else if (phaseRef.current === "armed") leave();
      } else if (dy < -24 && phaseRef.current === "armed") {
        cancel();
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (phaseRef.current !== "armed") return;
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      )
        return;
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        leave();
      } else if (e.key === "ArrowUp" || e.key === "Escape") {
        cancel();
      }
    };

    const onScroll = () => {
      if (phaseRef.current === "armed" && !atBottom()) cancel();
    };

    // Expose leave() to the fallback link handler.
    leaveRef.current = leave;

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearArm();
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [next, router]);

  return (
    <div
      className="nct"
      data-phase={phase}
      aria-hidden={phase === "idle" && !coverActive ? true : undefined}
    >
      {next ? (
        <div className="nct-sheet" role="region" aria-label={`Next chapter: ${next.label}`}>
          <div className="nct-sheet-inner">
            <p className="nct-eyebrow label-mono">Next Chapter</p>
            <p className="nct-title">{next.label}</p>
            <p className="nct-hint" aria-hidden="true">
              Scroll again to continue <span className="nct-arrow">↓</span>
            </p>
            <a
              href={next.href}
              className="nct-open"
              onClick={(e) => {
                e.preventDefault();
                leaveRef.current();
              }}
            >
              Open {next.label} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      ) : null}

      {coverActive ? (
        <div className={`nct-cover${coverIn ? " is-in" : ""}`} aria-hidden="true">
          <span className="nct-cover-title">{coverTitle}</span>
        </div>
      ) : null}
    </div>
  );
}
