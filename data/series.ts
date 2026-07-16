/* ---------------------------------------------------------------------------
   Series-level presentation.

   Controls the order in which series appear on the Selected Works page, and
   holds the short description each series panel reveals when expanded. Add the
   description text here later — the panel picks it up automatically. A series
   with no description simply reveals its metadata.

   `label` optionally overrides how a series title is displayed without
   changing the artwork data.
--------------------------------------------------------------------------- */
export type SeriesInfo = { label?: string; description?: string };

// Display order on the page. Any series not listed here follows, in the order
// it first appears in the artwork data.
export const SERIES_ORDER: string[] = [
  "Mermaids in Our Time",
  "Early Works",
];

export const SERIES_INFO: Record<string, SeriesInfo> = {
  "Mermaids in Our Time": {
    description: "",
  },
  "Early Works": {
    description: "",
  },
};
