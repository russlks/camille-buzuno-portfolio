"use client";

/* A minimal dual-handle year range. Two overlaid native range inputs (only
   their thumbs are interactive) drive a single filled track — accessible and
   dependency-free. The upper bound is dynamic (passed in from YEAR_END). */
export default function YearRange({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
}: {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (nextMin: number, nextMax: number) => void;
}) {
  const span = Math.max(1, max - min);
  const pct = (v: number) => ((v - min) / span) * 100;

  return (
    <div className="yr">
      <div className="yr-values">
        <span>{valueMin}</span>
        <span className="yr-dash" aria-hidden="true">
          —
        </span>
        <span>{valueMax}</span>
      </div>

      <div className="yr-track">
        <span
          className="yr-fill"
          style={{ left: `${pct(valueMin)}%`, right: `${100 - pct(valueMax)}%` }}
        />
        <input
          type="range"
          className="yr-input"
          min={min}
          max={max}
          step={1}
          value={valueMin}
          aria-label="Earliest year"
          onChange={(e) =>
            onChange(Math.min(Number(e.target.value), valueMax), valueMax)
          }
        />
        <input
          type="range"
          className="yr-input"
          min={min}
          max={max}
          step={1}
          value={valueMax}
          aria-label="Latest year"
          onChange={(e) =>
            onChange(valueMin, Math.max(Number(e.target.value), valueMin))
          }
        />
      </div>
    </div>
  );
}
