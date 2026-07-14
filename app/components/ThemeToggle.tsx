"use client";

import { useSyncExternalStore } from "react";

/**
 * Light / Depth theme switch. "Depth" applies the `.dark` class on <html>.
 * The initial class is set by an inline script in the root layout to avoid a
 * flash; this control subscribes to that DOM state and toggles it.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

const isDepth = () => document.documentElement.classList.contains("dark");

export default function ThemeToggle() {
  const depth = useSyncExternalStore(subscribe, isDepth, () => false);

  function toggle() {
    const next = !depth;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "depth" : "light");
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${depth ? "light" : "depth"} theme`}
      className="group flex items-center gap-2 border border-hair px-3 py-1.5 transition-colors hover:border-accent"
    >
      <span
        aria-hidden="true"
        className="h-2 w-2 rounded-full bg-accent transition-transform duration-500"
        style={{ transform: depth ? "scale(1)" : "scale(0.55)" }}
      />
      <span className="label-mono !text-[0.62rem] group-hover:!text-fg">
        {depth ? "Depth" : "Light"}
      </span>
    </button>
  );
}
