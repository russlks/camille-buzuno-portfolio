"use client";

import Link from "next/link";
import { NAV } from "../lib/nav";

/* Mobile + tablet navigation legend (hidden on desktop, where the oyster's own
   ring labels serve). Maps the shell's ordinals (01–09) to their sections and
   makes each a real, comfortably tappable link positioned as part of the
   composition — a second way to navigate alongside tapping the oyster itself.

   Each item carries its ring ordinal as `--wake-i`, so its label brightens in
   time with the matching growth band's one-shot "wake" (see .oyster-legend in
   globals.css). Kept aria-hidden: it duplicates the accessible ordered nav the
   oyster already exposes to screen readers, so this is a purely visual/touch
   affordance and must not announce the nine links a second time. */
export default function OysterLegend() {
  return (
    <ul className="oyster-legend lg:hidden" aria-hidden="true">
      {NAV.map((item, i) => {
        const label = item.label === "Works" ? "Selected Works" : item.label;
        // Rings 07 & 09 are the shell's teal accents — mirror them here.
        const accent = item.n === "07" || item.n === "09";
        return (
          <li key={item.href} style={{ "--wake-i": i } as React.CSSProperties}>
            <Link
              href={item.href}
              tabIndex={-1}
              className={`oyster-legend-link${
                accent ? " oyster-legend-link--accent" : ""
              }`}
            >
              <span className="oyster-legend-n">{item.n}</span>
              <span className="oyster-legend-dash" aria-hidden="true">
                —
              </span>
              <span className="oyster-legend-label">{label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
