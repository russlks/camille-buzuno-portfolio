/* ---------------------------------------------------------------------------
   Selected Works — filtering + curation over the real artwork database.

   The data lives in /data/artworks.ts (add one object to extend the archive).
   Everything here derives from that data: the Status / Series / Medium / Size
   facets, and the Year range. Medium filtering uses each work's
   `mediumFilters` array (never the displayed string), so one work can appear
   under several mediums.
--------------------------------------------------------------------------- */
import { ARTWORKS, type Artwork } from "@/data/artworks";

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
   Curation — arrange the (filtered) works into intentional exhibition rows
   rather than an auto-packed grid: never more than three per row; a monumental
   work hangs alone; a large work takes at most one small counterpoint; small /
   medium works gather in calm groups; rows alternate placement for rhythm.
--------------------------------------------------------------------------- */
export type RowAlign = "center" | "left" | "right" | "spread";
export type GalleryRow = { items: Artwork[]; align: RowAlign; breathe: boolean };

export function curateRows(works: Artwork[]): GalleryRow[] {
  const grouped: Artwork[][] = [];
  let i = 0;
  while (i < works.length) {
    const cat = sizeCategory(works[i]);
    if (cat === "Monumental") {
      grouped.push([works[i]]);
      i += 1;
    } else if (cat === "Large") {
      const row = [works[i]];
      i += 1;
      if (i < works.length && sizeCategory(works[i]) === "Small") {
        row.push(works[i]);
        i += 1;
      }
      grouped.push(row);
    } else {
      const row = [works[i]];
      i += 1;
      while (i < works.length && row.length < 3) {
        const nc = sizeCategory(works[i]);
        if (nc === "Monumental" || nc === "Large") break;
        row.push(works[i]);
        i += 1;
      }
      grouped.push(row);
    }
  }

  let soloCount = 0;
  return grouped.map((items) => {
    const breathe = items.some((w) => {
      const c = sizeCategory(w);
      return c === "Monumental" || c === "Large";
    });
    let align: RowAlign;
    if (items.length === 1) {
      align =
        sizeCategory(items[0]) === "Monumental"
          ? "center"
          : soloCount % 2 === 0
            ? "left"
            : "right";
      soloCount += 1;
    } else {
      align = "spread";
    }
    return { items, align, breathe };
  });
}
