"use client";

import { useEffect, useMemo, useState } from "react";
import {
  WORKS,
  emptyFilters,
  filterWorks,
  type Filters,
} from "../../lib/works";
import { primeSound } from "../../lib/sound";
import FilterPanel from "./FilterPanel";
import Gallery from "./Gallery";

type ArrayFacet = "statuses" | "series" | "mediums" | "sizes";

export default function WorksArchive() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Arm the shared sound so the gallery's wood voice unlocks on first gesture.
  useEffect(() => {
    primeSound();
  }, []);

  const filtered = useMemo(() => filterWorks(WORKS, filters), [filters]);

  const toggle = (facet: ArrayFacet, value: string) =>
    setFilters((f) => {
      const arr = f[facet] as string[];
      const next = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      return { ...f, [facet]: next };
    });
  const setYear = (yearMin: number, yearMax: number) =>
    setFilters((f) => ({ ...f, yearMin, yearMax }));
  const reset = () => setFilters(emptyFilters());

  const panelProps = {
    filters,
    onToggle: toggle,
    onYear: setYear,
    onReset: reset,
    count: filtered.length,
    total: WORKS.length,
  };

  return (
    <div className="works">
      {/* Tablet / mobile toolbar — opens the filter drawer. */}
      <div className="works-bar">
        <button
          type="button"
          className="works-filter-btn"
          onClick={() => setDrawerOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={drawerOpen}
          aria-controls="works-filter-drawer"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
            <g
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              fill="none"
            >
              <line x1="2" y1="4" x2="14" y2="4" />
              <line x1="2" y1="8" x2="14" y2="8" />
              <line x1="2" y1="12" x2="14" y2="12" />
              <circle cx="11" cy="4" r="1.6" fill="currentColor" stroke="none" />
              <circle cx="5" cy="8" r="1.6" fill="currentColor" stroke="none" />
              <circle cx="10" cy="12" r="1.6" fill="currentColor" stroke="none" />
            </g>
          </svg>
          Filters
        </button>
        <span className="label-mono works-count-inline">
          {filtered.length} works
        </span>
      </div>

      <div className="works-body">
        <aside className="works-panel">
          <FilterPanel {...panelProps} />
        </aside>
        <div className="works-gallery-wrap">
          <Gallery works={filtered} />
        </div>
      </div>

      {/* Filter drawer — tablet / mobile. */}
      <div
        id="works-filter-drawer"
        className={`works-drawer${drawerOpen ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        <button
          type="button"
          className="works-drawer-scrim"
          aria-label="Close filters"
          tabIndex={drawerOpen ? 0 : -1}
          onClick={() => setDrawerOpen(false)}
        />
        <div className="works-drawer-panel">
          <div className="works-drawer-head">
            <span className="label-mono">Refine</span>
            <button
              type="button"
              className="works-drawer-close"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close filters"
            >
              ✕
            </button>
          </div>
          <div className="works-drawer-scroll">
            <FilterPanel {...panelProps} />
          </div>
        </div>
      </div>
    </div>
  );
}
