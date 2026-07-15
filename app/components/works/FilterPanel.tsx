"use client";

import Link from "next/link";
import {
  STATUSES,
  SERIES,
  MEDIUMS,
  SIZES,
  YEAR_START,
  YEAR_END,
  type Filters,
} from "../../lib/works";
import YearRange from "./YearRange";

type ArrayFacet = "statuses" | "series" | "mediums" | "sizes";

function CheckRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className={`fp-check${checked ? " is-checked" : ""}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className="fp-box" aria-hidden="true" />
      <span className="fp-check-text">
        {label}
        {hint ? <span className="fp-check-hint">{hint}</span> : null}
      </span>
    </label>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="fp-group">
      <h3 className="fp-group-title">{title}</h3>
      <div className="fp-group-body">{children}</div>
    </section>
  );
}

export default function FilterPanel({
  filters,
  onToggle,
  onYear,
  onReset,
  count,
  total,
}: {
  filters: Filters;
  onToggle: (facet: ArrayFacet, value: string) => void;
  onYear: (min: number, max: number) => void;
  onReset: () => void;
  count: number;
  total: number;
}) {
  const active =
    filters.statuses.length +
    filters.series.length +
    filters.mediums.length +
    filters.sizes.length +
    (filters.yearMin !== YEAR_START || filters.yearMax !== YEAR_END ? 1 : 0);

  return (
    <div className="fp">
      {/* Collection navigation — a filter-vs-navigate distinction. */}
      <div className="fp-collection" role="group" aria-label="Collection">
        <span className="fp-collection-item is-active" aria-current="page">
          Original Works
        </span>
        <Link href="/shop" className="fp-collection-item fp-collection-link">
          Prints
          <span className="fp-ext" aria-hidden="true">
            ↗
          </span>
          <span className="sr-only">(opens the Shop)</span>
        </Link>
      </div>

      <div className="fp-meta">
        <span className="label-mono">Filters</span>
        <button
          type="button"
          className="fp-reset"
          onClick={onReset}
          disabled={active === 0}
        >
          Reset
        </button>
      </div>

      <Group title="Status">
        {STATUSES.map((s) => (
          <CheckRow
            key={s}
            label={s}
            checked={filters.statuses.includes(s)}
            onChange={() => onToggle("statuses", s)}
          />
        ))}
      </Group>

      <Group title="Year">
        <YearRange
          min={YEAR_START}
          max={YEAR_END}
          valueMin={filters.yearMin}
          valueMax={filters.yearMax}
          onChange={onYear}
        />
      </Group>

      <Group title="Series">
        {SERIES.map((s) => (
          <CheckRow
            key={s}
            label={s}
            checked={filters.series.includes(s)}
            onChange={() => onToggle("series", s)}
          />
        ))}
      </Group>

      <Group title="Medium">
        {MEDIUMS.map((m) => (
          <CheckRow
            key={m}
            label={m}
            checked={filters.mediums.includes(m)}
            onChange={() => onToggle("mediums", m)}
          />
        ))}
      </Group>

      <Group title="Size">
        {SIZES.map((s) => (
          <CheckRow
            key={s.key}
            label={s.label}
            hint={s.hint}
            checked={filters.sizes.includes(s.key)}
            onChange={() => onToggle("sizes", s.key)}
          />
        ))}
      </Group>

      <p className="fp-count label-mono">
        {count} of {total} works
      </p>
    </div>
  );
}
