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

   Images live in /public/images/paintings/ and are referenced as
   /images/paintings/<file>.jpg. If a file isn't present yet, the gallery shows
   a neutral placeholder labelled with the artwork title — the entry stays
   intact.
--------------------------------------------------------------------------- */

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
  status: string;
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
    image: "/images/paintings/dismorphophobia.jpg",
    thumbnail: "/images/paintings/dismorphophobia.jpg",
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
    image: "/images/paintings/the-lost-home.jpg",
    thumbnail: "/images/paintings/the-lost-home.jpg",
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
    image: "/images/paintings/mermaids-chapter-i.jpg",
    thumbnail: "/images/paintings/mermaids-chapter-i.jpg",
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
    image: "/images/paintings/mermaids-chapter-ii.jpg",
    thumbnail: "/images/paintings/mermaids-chapter-ii.jpg",
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
    image: "/images/paintings/mermaids-chapter-iii.jpg",
    thumbnail: "/images/paintings/mermaids-chapter-iii.jpg",
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
    image: "/images/paintings/mermaids-chapter-iv.jpg",
    thumbnail: "/images/paintings/mermaids-chapter-iv.jpg",
    description: "",
    featured: false,
    frameStyle: "thin-oak",
  },
];
