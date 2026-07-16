import type { Exhibition } from "./artworks";

/* ---------------------------------------------------------------------------
   Series-level presentation.

   Controls the order in which series appear on the Selected Works page and
   holds the editable, author-supplied fields each series panel can reveal.
   Everything is optional: a series with no statement / exhibitions simply
   shows its metadata, and nothing empty is rendered on the public site.

   To populate a series later, fill the fields below:
     • statement    — the PROJECT STATEMENT text (shown when non-empty)
     • exhibitions   — where the whole series has been shown (optional)
     • label         — override the displayed series title
     • yearLabel     — override the auto-derived year span (e.g. "2023–2024")
     • mediumLabel   — override the auto-derived medium summary
   Series title, the number of works and the default year/medium are derived
   from the artwork data automatically.
--------------------------------------------------------------------------- */
export type SeriesInfo = {
  label?: string;
  yearLabel?: string;
  mediumLabel?: string;
  statement?: string;
  exhibitions?: Exhibition[];
};

// Display order on the page. Any series not listed here follows, in the order
// it first appears in the artwork data.
export const SERIES_ORDER: string[] = [
  "Mermaids in Our Time",
  "Early Works",
];

export const SERIES_INFO: Record<string, SeriesInfo> = {
  "Mermaids in Our Time": {
    statement: "",
    exhibitions: [],
  },
  "Early Works": {
    statement: "",
    exhibitions: [],
  },
};
