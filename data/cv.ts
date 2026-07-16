/* ---------------------------------------------------------------------------
   Curriculum Vitae — editable, structured data for the CV page.

   Everything the CV renders lives here. Sections whose arrays are empty are
   hidden entirely on the page (no empty headings). To add an exhibition,
   collection, publication or award later, append an object to the relevant
   array below — the layout updates automatically.

   The downloadable CV PDF: drop the file at  public/cv.pdf  (see CV_PDF). No
   code or layout change is needed — the button already points at it.
--------------------------------------------------------------------------- */

// A dated entry (education / experience).
export type CvEntry = {
  period: string; // e.g. "2026–Present" or "2021–2024"
  title: string;
  org?: string;
  location?: string;
};

export const EDUCATION: CvEntry[] = [
  {
    period: "2026–Present",
    title: "Master’s degree in Business Administration (ongoing)",
    org: "Czech University of Life Sciences Prague",
    location: "Prague, Czech Republic",
  },
  {
    period: "2021–2024",
    title: "Bachelor’s Degree in Painting & Graphic Design",
    org: "ART & DESIGN INSTITUT",
    location: "Prague, Czech Republic",
  },
  {
    period: "2017–2019",
    title: "Animation Studies",
    org: "T. K. Zhurgenov Kazakh National Academy of Arts",
    location: "Almaty, Kazakhstan",
  },
];

export const EXPERIENCE: CvEntry[] = [
  {
    period: "2026–Present",
    title: "Independent Creative Director",
    location: "Prague, Czech Republic",
  },
  {
    period: "2023–2025",
    title: "2D Artist",
    org: "REDGoats Studio",
  },
  {
    period: "2023–2025",
    title: "Independent Tattoo Artist",
    location: "Prague, Czech Republic",
  },
  {
    period: "2020–Present",
    title: "Independent Visual Artist",
    location: "Prague, Czech Republic",
  },
];

// Structured exhibition entry. Only year, title and venue are required.
export type CvExhibition = {
  year: number | string;
  title: string;
  venue: string;
  city?: string;
  country?: string;
  dates?: string;
  link?: string;
};

export const SELECTED_EXHIBITIONS: CvExhibition[] = [];

// Collections — plain lines, e.g. "Private collection, Prague".
export const PRIVATE_COLLECTIONS: string[] = [];
export const INSTITUTIONAL_COLLECTIONS: string[] = [];

// Publications & press.
export type CvPress = {
  title: string;
  publication?: string;
  year?: number | string;
  link?: string;
};

export const PUBLICATIONS: CvPress[] = [];

// Awards & residencies.
export type CvAward = {
  year?: number | string;
  title: string;
  org?: string;
  location?: string;
};

export const AWARDS: CvAward[] = [];

export const LANGUAGES: { name: string; level: string }[] = [
  { name: "Russian", level: "Native" },
  { name: "English", level: "Professional Working Proficiency" },
  { name: "Czech", level: "Professional Working Proficiency" },
];

// Downloadable CV PDF. Drop the file at public/cv.pdf to activate the button.
export const CV_PDF = "/cv.pdf";
