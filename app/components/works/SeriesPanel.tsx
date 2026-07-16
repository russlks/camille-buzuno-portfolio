"use client";

import { useState } from "react";
import type { Exhibition } from "../../lib/works";
import ExhibitionList from "./ExhibitionList";

/* A compact exhibition-label panel — the header of each body of work. The whole
   surface is one button: clicking it smoothly reveals the series' metadata, its
   project statement and (later) its exhibition history, and collapses again.
   The motion is the shared site language (organic easing, soft membrane reveal,
   content rising and un-blurring in) rather than a standard accordion. Empty
   fields render nothing, so the public panel stays clean. */
export default function SeriesPanel({
  series,
  label,
  yearLabel,
  mediumLabel,
  count,
  statement,
  exhibitions = [],
  index,
  total,
}: {
  series: string;
  label?: string;
  yearLabel: string;
  mediumLabel: string;
  count: number;
  statement?: string;
  exhibitions?: Exhibition[];
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
  const hasStatement = Boolean(statement && statement.trim());
  const hasExhibitions = exhibitions.length > 0;

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
          <svg viewBox="0 0 24 24" width="15" height="15">
            <path
              d="M6 10l6 5 6-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
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

            {hasStatement ? (
              <section className="sp-block">
                <h3 className="sp-block-title">Project Statement</h3>
                <p className="sp-statement">{statement}</p>
              </section>
            ) : null}

            {hasExhibitions ? (
              <section className="sp-block">
                <h3 className="sp-block-title">Exhibitions</h3>
                <ExhibitionList items={exhibitions} />
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
