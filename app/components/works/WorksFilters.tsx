"use client";

import {
  STATUSES,
  MEDIUMS,
  SIZES,
  YEAR_START,
  YEAR_END,
  type Filters,
} from "../../lib/works";
import YearRange from "./YearRange";

type ArrayFacet = "statuses" | "mediums" | "sizes";

function Chips({
  values,
  selected,
  onToggle,
}: {
  values: { key: string; label: string }[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="wk-fchips">
      {values.map((v) => {
        const on = selected.includes(v.key);
        return (
          <button
            key={v.key}
            type="button"
            className={`wk-fchip${on ? " is-on" : ""}`}
            aria-pressed={on}
            onClick={() => onToggle(v.key)}
          >
            {v.label}
          </button>
        );
      })}
    </div>
  );
}

/* The expandable filter panel — Availability, Year, Medium, Size. Series is
   handled by the bar's segmented control, so it is intentionally absent here. */
export default function WorksFilters({
  open,
  filters,
  onToggle,
  onYear,
  onReset,
  count,
  total,
}: {
  open: boolean;
  filters: Filters;
  onToggle: (facet: ArrayFacet, value: string) => void;
  onYear: (min: number, max: number) => void;
  onReset: () => void;
  count: number;
  total: number;
}) {
  const active =
    filters.statuses.length +
    filters.mediums.length +
    filters.sizes.length +
    (filters.yearMin !== YEAR_START || filters.yearMax !== YEAR_END ? 1 : 0);

  return (
    <div
      id="wk-filter-panel"
      className={`wk-panel${open ? " is-open" : ""}`}
      role="region"
      aria-label="Filters"
      aria-hidden={open ? undefined : true}
      inert={open ? undefined : true}
    >
      <div className="wk-panel-clip">
        <div className="wk-panel-inner">
          <div className="wk-panel-head">
            <span className="wk-panel-count label-mono">
              {count} of {total} works
            </span>
            <button
              type="button"
              className="wk-reset"
              onClick={onReset}
              disabled={active === 0}
            >
              Reset
            </button>
          </div>

          <div className="wk-fgrid">
            <section className="wk-fgroup">
              <h3 className="wk-fgroup-title">Availability</h3>
              <Chips
                values={STATUSES.map((s) => ({ key: s, label: s }))}
                selected={filters.statuses}
                onToggle={(v) => onToggle("statuses", v)}
              />
            </section>

            <section className="wk-fgroup">
              <h3 className="wk-fgroup-title">Year</h3>
              <YearRange
                min={YEAR_START}
                max={YEAR_END}
                valueMin={filters.yearMin}
                valueMax={filters.yearMax}
                onChange={onYear}
              />
            </section>

            <section className="wk-fgroup">
              <h3 className="wk-fgroup-title">Medium</h3>
              <Chips
                values={MEDIUMS.map((m) => ({ key: m, label: m }))}
                selected={filters.mediums}
                onToggle={(v) => onToggle("mediums", v)}
              />
            </section>

            <section className="wk-fgroup">
              <h3 className="wk-fgroup-title">Size</h3>
              <Chips
                values={SIZES.map((s) => ({ key: s.key, label: s.label }))}
                selected={filters.sizes}
                onToggle={(v) => onToggle("sizes", v)}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
