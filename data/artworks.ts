/* ---------------------------------------------------------------------------
   Selected Works — the real artwork database.

   To add a work later, append ONE object to ARTWORKS. Everything else (the
   gallery scale, the filters, the medium facets, the year range) derives from
   this data automatically — see app/lib/works.ts.

   Notes on medium:
     • `displayedMedium` is shown to visitors verbatim (e.g. "Oil and acrylic
       on canvas").
     • `mediumFilters` drives the Medium filter and may hold several values, so
       one work can appear under Oil, Acrylic and Mixed Media at once. The
       filter system uses `mediumFilters`, never the displayed string.

   Images live in /public/images/paintings/ and are referenced by their exact
   on-disk filename (the uploads use an uppercase .JPG extension — this matters
   on Vercel's case-sensitive filesystem). If a file isn't present yet, the
   gallery shows
   a neutral placeholder labelled with the artwork title — the entry stays
   intact.
--------------------------------------------------------------------------- */

/* Availability. Only "Available" shows a price + Buy button; the rest read as
   gallery states. Add new values here and they flow through the filters. */
export type Status =
  | "Available"
  | "Sold"
  | "Private collection"
  | "On exhibition"
  | "Not for sale";

/* One exhibition an artwork (or series) has appeared in — structured, not a
   paragraph, so it renders as a proper list. Only title, venue and year are
   required; the rest are optional. */
export type Exhibition = {
  title: string;
  venue: string;
  city?: string;
  country?: string;
  year: number;
  dates?: string; // e.g. "12 Mar – 4 May 2025"
  link?: string;
};

export type Artwork = {
  id: string;
  slug: string;
  title: string;
  displayTitle: string;
  year: number;
  widthCm: number;
  heightCm: number;
  displayedMedium: string;
  mediumFilters: string[];
  series: string;
  status: Status;
  // Commerce — all editable. `price`/`buyLink` may be null until set; a null
  // price shows "Price on request", a null buyLink keeps the Buy button visible
  // but inert (never a broken link).
  price: number | null;
  currency: string;
  buyLink: string | null;
  exhibitions: Exhibition[];
  image: string;
  thumbnail: string;
  description: string;
  featured: boolean;
  frameStyle: string;
};

export const ARTWORKS: Artwork[] = [
  {
    id: "dismorphophobia-2022",
    slug: "dismorphophobia",
    title: "Dismorphophobia",
    displayTitle: "Dismorphophobia",
    year: 2023,
    widthCm: 100,
    heightCm: 120,
    displayedMedium: "Oil on canvas",
    mediumFilters: ["Oil"],
    series: "Early Works",
    status: "Available",
    price: null,
    currency: "EUR",
    buyLink: null,
    exhibitions: [],
    image: "/images/paintings/dismorphophobia.JPG",
    thumbnail: "/images/paintings/dismorphophobia.JPG",
    description: "",
    featured: false,
    frameStyle: "thin-oak",
  },
  {
    id: "the-lost-home-2022",
    slug: "the-lost-home",
    title: "The Lost Home",
    displayTitle: "The Lost Home",
    year: 2023,
    widthCm: 70,
    heightCm: 90,
    displayedMedium: "Oil and acrylic on canvas",
    mediumFilters: ["Oil", "Acrylic", "Mixed Media"],
    series: "Early Works",
    status: "Available",
    price: null,
    currency: "EUR",
    buyLink: null,
    exhibitions: [],
    image: "/images/paintings/the-lost-home.JPG",
    thumbnail: "/images/paintings/the-lost-home.JPG",
    description: "",
    featured: false,
    frameStyle: "thin-oak",
  },
  {
    id: "mermaids-in-our-time-chapter-i",
    slug: "mermaids-in-our-time-chapter-i",
    title: "Mermaids in Our Time — Chapter I",
    displayTitle: "Mermaids in Our Time I",
    year: 2024,
    widthCm: 120,
    heightCm: 170,
    displayedMedium: "Oil on canvas",
    mediumFilters: ["Oil"],
    series: "Mermaids in Our Time",
    status: "Available",
    price: null,
    currency: "EUR",
    buyLink: null,
    exhibitions: [],
    image: "/images/paintings/mermaids-chapter-i.JPG",
    thumbnail: "/images/paintings/mermaids-chapter-i.JPG",
    description: "",
    featured: false,
    frameStyle: "thin-oak",
  },
  {
    id: "mermaids-in-our-time-chapter-ii",
    slug: "mermaids-in-our-time-chapter-ii",
    title: "Mermaids in Our Time — Chapter II",
    displayTitle: "Mermaids in Our Time II",
    year: 2024,
    widthCm: 120,
    heightCm: 180,
    displayedMedium: "Oil on canvas",
    mediumFilters: ["Oil"],
    series: "Mermaids in Our Time",
    status: "Available",
    price: null,
    currency: "EUR",
    buyLink: null,
    exhibitions: [],
    image: "/images/paintings/mermaids-chapter-ii.JPG",
    thumbnail: "/images/paintings/mermaids-chapter-ii.JPG",
    description: "",
    featured: false,
    frameStyle: "thin-oak",
  },
  {
    id: "mermaids-in-our-time-chapter-iii",
    slug: "mermaids-in-our-time-chapter-iii",
    title: "Mermaids in Our Time — Chapter III",
    displayTitle: "Mermaids in Our Time III",
    year: 2024,
    widthCm: 160,
    heightCm: 170,
    displayedMedium: "Oil on canvas",
    mediumFilters: ["Oil"],
    series: "Mermaids in Our Time",
    status: "Available",
    price: null,
    currency: "EUR",
    buyLink: null,
    exhibitions: [],
    image: "/images/paintings/mermaids-chapter-iv.JPG",
    thumbnail: "/images/paintings/mermaids-chapter-iv.JPG",
    description: "",
    featured: false,
    frameStyle: "thin-oak",
  },
  {
    id: "mermaids-in-our-time-chapter-iv",
    slug: "mermaids-in-our-time-chapter-iv",
    title: "Mermaids in Our Time — Chapter IV",
    displayTitle: "Mermaids in Our Time IV",
    year: 2024,
    widthCm: 100,
    heightCm: 160,
    displayedMedium: "Oil on canvas",
    mediumFilters: ["Oil"],
    series: "Mermaids in Our Time",
    status: "Available",
    price: null,
    currency: "EUR",
    buyLink: null,
    exhibitions: [],
    image: "/images/paintings/mermaids-chapter-iii.JPG",
    thumbnail: "/images/paintings/mermaids-chapter-iii.JPG",
    description: "",
    featured: false,
    frameStyle: "thin-oak",
  },
];
