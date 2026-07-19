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
    // Paragraphs separated by a blank line; the panel's .sp-statement renders
    // them with `white-space: pre-line` for comfortable spacing. The panel
    // already shows the series title + a "Project Statement" heading, so the
    // title line isn't repeated here.
    statement: `Mermaids in Our Time began as my graduation project and became an artistic research into figurative painting, composition, and emotional perception.

The series was also an opportunity for me to study how composition directs attention and how color, silhouette, and spatial relationships can shape an emotional response before the viewer has time to analyze the image. Visually, the paintings are influenced by Fauvism and Neo-Fauvism, with Henri Matisse—especially The Dance—being one of the strongest references during the development of the project.

The choice of mermaids was intentional.

Before starting the series, I spent time researching the mythology and historical origins of mermaids. Across different cultures, they are often associated with death, loss, drowning, longing, and people who became trapped between worlds. I wanted to bring this mythology into the present day and ask what a “mermaid” might look like now.

In this project, mermaids are not fantasy creatures. They are people.

Each painting explores a different psychological state or a different way reality can become emotionally distorted. The works touch on experiences such as addiction, depression, derealization, emotional instability, and the fragile perception of oneself and the surrounding world.

Rather than illustrating mental illness directly, I wanted to explore how beautiful, seductive, and convincing these altered emotional realities can feel from the inside. Sometimes the most painful experiences don’t look frightening—they can appear strangely familiar, comforting, or even beautiful.

For me, this project is less about pathology and more about empathy. It is an attempt to understand how people survive difficult emotional states while continuing to search for beauty, connection, and hope.

Ultimately, Mermaids in Our Time is about seeing mythology as something that never disappeared—it simply changed its form. Today’s mermaids are no longer creatures of the sea. They are people learning to survive within the emotional landscapes of the modern world.`,
    exhibitions: [],
  },
  "Early Works": {
    statement: "",
    exhibitions: [],
  },
};
