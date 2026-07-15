/* ---------------------------------------------------------------------------
   Selected Works — data model + filtering for the archive.

   Placeholder data only: no final titles, no real artwork assets. Real images
   drop in later via `image`; until then each work renders an elegant neutral
   canvas. Display scale in the gallery is derived from the real centimetre
   dimensions (see Gallery / ArtworkFrame), so a physically larger work reads
   as visibly larger.
--------------------------------------------------------------------------- */

export type Status = "Available" | "Private Collection" | "On Exhibition";
export type Series =
  | "Mermaids in Our Time"
  | "Sketches"
  | "Early Works"
  | "Individual Works";
export type Medium = "Oil" | "Acrylic" | "Mixed Media" | "Drawing" | "Digital";
export type SizeCategory = "Small" | "Medium" | "Large" | "Monumental";
// Extendable — each maps to a frame profile/texture in the ArtworkFrame CSS.
export type FrameStyle = "oak" | "walnut" | "ash";

export type Artwork = {
  id: string;
  slug: string;
  title: string;
  year: number;
  image: string | null; // null → neutral placeholder canvas
  widthCm: number;
  heightCm: number;
  medium: Medium;
  series: Series;
  status: Status;
  frameStyle: FrameStyle;
  description?: string;
};

export const STATUSES: Status[] = [
  "Available",
  "Private Collection",
  "On Exhibition",
];
export const SERIES: Series[] = [
  "Mermaids in Our Time",
  "Sketches",
  "Early Works",
  "Individual Works",
];
export const MEDIUMS: Medium[] = [
  "Oil",
  "Acrylic",
  "Mixed Media",
  "Drawing",
  "Digital",
];
export const SIZES: { key: SizeCategory; label: string; hint: string }[] = [
  { key: "Small", label: "Small", hint: "longest side under 60 cm" },
  { key: "Medium", label: "Medium", hint: "60–100 cm" },
  { key: "Large", label: "Large", hint: "101–150 cm" },
  { key: "Monumental", label: "Monumental", hint: "over 150 cm" },
];

export const YEAR_START = 2020;
// Dynamic end year — updates automatically as the calendar (and rebuilds) move.
export const YEAR_END = new Date().getFullYear();

export function sizeCategory(w: Pick<Artwork, "widthCm" | "heightCm">): SizeCategory {
  const longest = Math.max(w.widthCm, w.heightCm);
  if (longest < 60) return "Small";
  if (longest <= 100) return "Medium";
  if (longest <= 150) return "Large";
  return "Monumental";
}

// Placeholder archive — varied dimensions so the real-size scaling is visible.
export const WORKS: Artwork[] = [
  { id: "01", slug: "untitled-01", title: "Untitled I", year: 2024, image: null, widthCm: 170, heightCm: 160, medium: "Oil", series: "Mermaids in Our Time", status: "On Exhibition", frameStyle: "oak", description: "Placeholder description — archival notes to follow." },
  { id: "02", slug: "untitled-02", title: "Untitled II", year: 2021, image: null, widthCm: 40, heightCm: 30, medium: "Drawing", series: "Sketches", status: "Available", frameStyle: "oak" },
  { id: "03", slug: "untitled-03", title: "Untitled III", year: 2023, image: null, widthCm: 90, heightCm: 70, medium: "Acrylic", series: "Individual Works", status: "Available", frameStyle: "oak" },
  { id: "04", slug: "untitled-04", title: "Untitled IV", year: 2022, image: null, widthCm: 120, heightCm: 100, medium: "Oil", series: "Mermaids in Our Time", status: "Private Collection", frameStyle: "oak", description: "Placeholder description — archival notes to follow." },
  { id: "05", slug: "untitled-05", title: "Untitled V", year: 2020, image: null, widthCm: 55, heightCm: 45, medium: "Mixed Media", series: "Sketches", status: "Available", frameStyle: "oak" },
  { id: "06", slug: "untitled-06", title: "Untitled VI", year: 2025, image: null, widthCm: 150, heightCm: 120, medium: "Oil", series: "Individual Works", status: "On Exhibition", frameStyle: "oak" },
  { id: "07", slug: "untitled-07", title: "Untitled VII", year: 2020, image: null, widthCm: 60, heightCm: 80, medium: "Acrylic", series: "Early Works", status: "Private Collection", frameStyle: "oak" },
  { id: "08", slug: "untitled-08", title: "Untitled VIII", year: 2026, image: null, widthCm: 200, heightCm: 150, medium: "Oil", series: "Mermaids in Our Time", status: "Available", frameStyle: "oak", description: "Placeholder description — archival notes to follow." },
  { id: "09", slug: "untitled-09", title: "Untitled IX", year: 2026, image: null, widthCm: 30, heightCm: 40, medium: "Digital", series: "Individual Works", status: "Available", frameStyle: "oak" },
  { id: "10", slug: "untitled-10", title: "Untitled X", year: 2023, image: null, widthCm: 100, heightCm: 100, medium: "Mixed Media", series: "Mermaids in Our Time", status: "On Exhibition", frameStyle: "oak" },
  { id: "11", slug: "untitled-11", title: "Untitled XI", year: 2021, image: null, widthCm: 45, heightCm: 60, medium: "Drawing", series: "Early Works", status: "Available", frameStyle: "oak" },
  { id: "12", slug: "untitled-12", title: "Untitled XII", year: 2024, image: null, widthCm: 130, heightCm: 90, medium: "Oil", series: "Individual Works", status: "Private Collection", frameStyle: "oak" },
];

export type Filters = {
  statuses: Status[];
  series: Series[];
  mediums: Medium[];
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
      (f.mediums.length === 0 || f.mediums.includes(w.medium)) &&
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
