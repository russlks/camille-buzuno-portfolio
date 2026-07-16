"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  WORKS,
  SERIES,
  emptyFilters,
  filterWorks,
  type Filters,
} from "../../lib/works";
import { primeSound } from "../../lib/sound";
import WorksFilters from "./WorksFilters";
import Gallery from "./Gallery";

type ArrayFacet = "statuses" | "mediums" | "sizes";

// Series segmented control: All + each series, in catalogue order.
const SERIES_TABS = [{ key: "all", label: "All" }].concat(
  SERIES.map((s) => ({ key: s, label: s }))
);

export default function WorksArchive() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [panelOpen, setPanelOpen] = useState(false);

  // Arm the shared sound so the gallery's wood voice unlocks on first gesture.
  useEffect(() => {
    primeSound();
  }, []);

  const filtered = useMemo(() => filterWorks(WORKS, filters), [filters]);

  const activeSeries = filters.series[0] ?? "all";
  const selectSeries = (key: string) =>
    setFilters((f) => ({ ...f, series: key === "all" ? [] : [key] }));

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

  // Reset only the advanced facets; keep the chosen series tab.
  const resetAdvanced = () =>
    setFilters((f) => ({ ...emptyFilters(), series: f.series }));

  const advancedCount =
    filters.statuses.length +
    filters.mediums.length +
    filters.sizes.length +
    (filters.yearMin !== emptyFilters().yearMin ||
    filters.yearMax !== emptyFilters().yearMax
      ? 1
      : 0);

  return (
    <div className="wk">
      <div className="wk-bar">
        <div className="wk-series" role="group" aria-label="Series">
          {SERIES_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`wk-chip${activeSeries === t.key ? " is-active" : ""}`}
              aria-pressed={activeSeries === t.key}
              onClick={() => selectSeries(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="wk-actions">
          <button
            type="button"
            className="wk-action wk-action--filters"
            aria-expanded={panelOpen}
            aria-controls="wk-filter-panel"
            onClick={() => setPanelOpen((o) => !o)}
          >
            Filters
            {advancedCount > 0 ? (
              <span className="wk-action-count">({advancedCount})</span>
            ) : null}
            <span className="wk-action-sign" aria-hidden="true">
              {panelOpen ? "–" : "+"}
            </span>
          </button>
          <Link href="/shop" className="wk-action wk-action--prints">
            Prints
            <span className="wk-ext" aria-hidden="true">
              ↗
            </span>
            <span className="sr-only">(opens the Shop)</span>
          </Link>
        </div>
      </div>

      <WorksFilters
        open={panelOpen}
        filters={filters}
        onToggle={toggle}
        onYear={setYear}
        onReset={resetAdvanced}
        count={filtered.length}
        total={WORKS.length}
      />

      <Gallery works={filtered} />
    </div>
  );
}
