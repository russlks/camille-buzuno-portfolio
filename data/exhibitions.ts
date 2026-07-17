/* ---------------------------------------------------------------------------
   Exhibitions — the growing archive shown on /exhibitions.

   Fully editable. Add an entry to EXHIBITIONS with a `status` of "current"
   (on view now), "upcoming", or "past"; the page groups them under the right
   heading, sorts each group newest-first, and hides any group with no entries
   (no empty headings appear publicly). Only `status`, `year` and `title` are
   required — everything else is optional.

   (The CV keeps its own shorter "Selected Exhibitions" list in data/cv.ts;
   this archive is the complete record.)
--------------------------------------------------------------------------- */
export type ExhibitionStatus = "current" | "upcoming" | "past";

export type ExhibitionEntry = {
  status: ExhibitionStatus;
  year: number | string;
  title: string;
  kind?: string; // e.g. "Group Exhibition", "Solo Exhibition"
  venue?: string;
  city?: string;
  country?: string;
  dates?: string; // optional precise dates, e.g. "12 Mar – 4 May 2025"
  link?: string;
};

export const EXHIBITIONS_INTRO: string[] = [
  "Discover where my work has been exhibited, where it is currently on view, and upcoming opportunities to experience it in person.",
  "This archive grows together with my artistic practice.",
];

export const EXHIBITIONS: ExhibitionEntry[] = [
  {
    status: "past",
    year: 2025,
    title: "0.00 Exhibition",
    kind: "Group Exhibition",
    city: "Prague",
    country: "Czech Republic",
  },
];
