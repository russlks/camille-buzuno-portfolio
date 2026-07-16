"use client";

import { useState } from "react";

/* An expandable series panel — the header of each body of work. The whole
   surface is one button: clicking it smoothly reveals the series' year,
   medium, count and description, and collapses again. The motion is the shared
   site language (organic easing, slow membrane-like reveal, content rising and
   un-blurring in) rather than a standard accordion. Fully keyboard operable
   and reduced-motion aware (tokens flatten the timings). */
export default function SeriesPanel({
  series,
  label,
  yearLabel,
  mediumLabel,
  count,
  description,
  index,
  total,
}: {
  series: string;
  label?: string;
  yearLabel: string;
  mediumLabel: string;
  count: number;
  description?: string;
  index: number;
  total: number;
}) {
  const [open, setOpen] = useState(false);
  const title = label ?? series;
  const countLabel = `${count} ${count === 1 ? "work" : "works"}`;
  const meta = `${yearLabel} · ${mediumLabel} · ${countLabel}`;
  const bodyId = `series-body-${index}`;
  const seq =
    total > 1
      ? `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`
      : null;

  return (
    <div className={`sp${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="sp-head"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="sp-head-text">
          <span className="sp-eyebrow label-mono">
            {index === 0 ? "Series" : "Next series"}
            {seq ? <span className="sp-seq"> · {seq}</span> : null}
          </span>
          <span className="sp-title">{title}</span>
          <span className="sp-meta">{meta}</span>
        </span>
        <span className="sp-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <path
              d="M5 9l7 7 7-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <div id={bodyId} className="sp-reveal" role="region" aria-label={`${title} — details`}>
        <div className="sp-reveal-clip">
          <div className="sp-reveal-inner">
            <dl className="sp-facts">
              <div>
                <dt>Year</dt>
                <dd>{yearLabel}</dd>
              </div>
              <div>
                <dt>Medium</dt>
                <dd>{mediumLabel}</dd>
              </div>
              <div>
                <dt>Works</dt>
                <dd>{countLabel}</dd>
              </div>
            </dl>
            {description ? (
              <p className="sp-desc">{description}</p>
            ) : (
              <p className="sp-desc sp-desc--empty">
                A description of this series will appear here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
