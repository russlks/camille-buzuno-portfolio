/* ---------------------------------------------------------------------------
   Selected Works — filtering + curation over the real artwork database.

   The data lives in /data/artworks.ts (add one object to extend the archive).
   Everything here derives from that data: the Status / Series / Medium / Size
   facets, and the Year range. Medium filtering uses each work's
   `mediumFilters` array (never the displayed string), so one work can appear
   under several mediums.
--------------------------------------------------------------------------- */
import { ARTWORKS, type Artwork } from "@/data/artworks";
import { SERIES_ORDER } from "@/data/series";

export type { Artwork };
export const WORKS = ARTWORKS;

export type SizeCategory = "Small" | "Medium" | "Large" | "Monumental";

export function sizeCategory(w: Pick<Artwork, "widthCm" | "heightCm">): SizeCategory {
  const longest = Math.max(w.widthCm, w.heightCm);
  if (longest < 60) return "Small";
  if (longest <= 100) return "Medium";
  if (longest <= 150) return "Large";
  return "Monumental";
}

const ALL_SIZES: { key: SizeCategory; label: string; hint: string }[] = [
  { key: "Small", label: "Small", hint: "longest side under 60 cm" },
  { key: "Medium", label: "Medium", hint: "60–100 cm" },
  { key: "Large", label: "Large", hint: "101–150 cm" },
  { key: "Monumental", label: "Monumental", hint: "over 150 cm" },
];

const uniqueInOrder = (values: string[]): string[] => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of values)
    if (!seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  return out;
};

// Facets, derived from the data.
export const STATUSES = uniqueInOrder(WORKS.map((w) => w.status));
export const SERIES = uniqueInOrder(WORKS.map((w) => w.series));
export const MEDIUMS = uniqueInOrder(WORKS.flatMap((w) => w.mediumFilters));
export const SIZES = ALL_SIZES.filter((s) =>
  WORKS.some((w) => sizeCategory(w) === s.key)
);

// Year range, derived: opens no later than 2020, closes no earlier than now.
const YEARS = WORKS.map((w) => w.year);
export const YEAR_START = Math.min(2020, ...YEARS);
export const YEAR_END = Math.max(new Date().getFullYear(), ...YEARS);

export type Filters = {
  statuses: string[];
  series: string[];
  mediums: string[];
  sizes: SizeCategory[];
  yearMin: number;
  yearMax: number;
};

export const emptyFilters = (): Filters => ({
  statuses: [],
  series: [],
  mediums: [],
  sizes: [],
  yearMin: YEAR_START,
  yearMax: YEAR_END,
});

export function filterWorks(works: Artwork[], f: Filters): Artwork[] {
  return works.filter(
    (w) =>
      (f.statuses.length === 0 || f.statuses.includes(w.status)) &&
      w.year >= f.yearMin &&
      w.year <= f.yearMax &&
      (f.series.length === 0 || f.series.includes(w.series)) &&
      // a work matches if ANY of its medium tags is selected
      (f.mediums.length === 0 ||
        w.mediumFilters.some((m) => f.mediums.includes(m))) &&
      (f.sizes.length === 0 || f.sizes.includes(sizeCategory(w)))
  );
}

export const getWork = (slug: string) => WORKS.find((w) => w.slug === slug);

export function workNeighbors(slug: string): {
  prev: Artwork | null;
  next: Artwork | null;
} {
  const i = WORKS.findIndex((w) => w.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? WORKS[i - 1] : null,
    next: i < WORKS.length - 1 ? WORKS[i + 1] : null,
  };
}

/* ---------------------------------------------------------------------------
   Display scale — the artwork's on-screen size is guided by its real
   dimensions, but *compressed*: we never reproduce a literal cm→px ratio.

   We take the geometric mean of the two sides (√area, an "effective size" in
   cm), map it through a narrow band, and clamp. The result is a controlled
   visual hierarchy — a monumental canvas reads clearly larger than a small
   one, yet the smallest work still has presence and the largest never
   dominates the page. The value is a desktop reference *width*; the layout
   scales it down responsively (--gscale) and the canvas derives its height
   from the true aspect ratio, so nothing is ever cropped or stretched.
--------------------------------------------------------------------------- */
const SCALE = {
  eMin: 75, // ~ a 70×90 canvas
  eMax: 172, // ~ a 160×180 canvas
  hMin: 278, // smallest work's reference height (px)
  hMax: 404, // largest work's reference height (px)
};

export function cardWidthPx(w: Pick<Artwork, "widthCm" | "heightCm">): number {
  const effective = Math.sqrt(w.widthCm * w.heightCm);
  const t = Math.min(
    1,
    Math.max(0, (effective - SCALE.eMin) / (SCALE.eMax - SCALE.eMin))
  );
  const height = SCALE.hMin + t * (SCALE.hMax - SCALE.hMin);
  return Math.round(height * (w.widthCm / w.heightCm));
}

/* ---------------------------------------------------------------------------
   Curation — arrange the (filtered) works into intentional rows rather than an
   auto-packed grid. Calm and editorial: at most three per row, biased to
   balanced pairs, with the occasional trio for rhythm and never an orphaned
   single dangling at the end. Real order is preserved (so it matches the
   detail view's prev/next), and the varied sizes carry the composition —
   pairs read as "two balanced" or "one dominant + one supporting" naturally.
--------------------------------------------------------------------------- */
export function curateRows(works: Artwork[]): Artwork[][] {
  const n = works.length;
  if (n <= 3) return n === 0 ? [] : [works];

  const rhythm = [2, 2, 3]; // pairs, with a trio every third row
  const rows: Artwork[][] = [];
  let i = 0;
  let r = 0;
  while (i < n) {
    const remaining = n - i;
    let len = Math.min(rhythm[r % rhythm.length], remaining);
    // Never leave a lone work at the very end: absorb it (up to three) or
    // shrink this row so the last row keeps a companion.
    if (remaining - len === 1) len = len < 3 ? len + 1 : len - 1;
    rows.push(works.slice(i, i + len));
    i += len;
    r += 1;
  }
  return rows;
}

/* ---------------------------------------------------------------------------
   Series grouping — split the (filtered) works into their series, each with a
   concise metadata line (year span · medium · count) for the series panel.
   Groups follow SERIES_ORDER, then first-appearance for anything unlisted, so
   the page reads as consecutive chapters of the practice rather than one list.
--------------------------------------------------------------------------- */
export type SeriesGroup = {
  series: string;
  works: Artwork[];
  yearLabel: string;
  mediumLabel: string;
  count: number;
};

function yearSpan(works: Artwork[]): string {
  const years = works.map((w) => w.year);
  const min = Math.min(...years);
  const max = Math.max(...years);
  return min === max ? `${min}` : `${min}–${max}`;
}

function mediumSummary(works: Artwork[]): string {
  const displayed = uniqueInOrder(works.map((w) => w.displayedMedium));
  if (displayed.length === 1) return displayed[0];
  // Mixed media across the group — summarise by the medium facets instead.
  return uniqueInOrder(works.flatMap((w) => w.mediumFilters)).join(" · ");
}

export function groupWorksBySeries(works: Artwork[]): SeriesGroup[] {
  const order = uniqueInOrder([
    ...SERIES_ORDER,
    ...works.map((w) => w.series),
  ]);
  return order
    .map((series) => works.filter((w) => w.series === series))
    .filter((group) => group.length > 0)
    .map((group) => ({
      series: group[0].series,
      works: group,
      yearLabel: yearSpan(group),
      mediumLabel: mediumSummary(group),
      count: group.length,
    }));
}
