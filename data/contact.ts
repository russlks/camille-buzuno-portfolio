/* ---------------------------------------------------------------------------
   Contact channels — the single source used by both the Contact page and the
   CV. `href: null` marks a channel that isn't live yet (shown "In preparation"
   on Contact, hidden on the CV). Edit values here and both pages update.

   NOTE: email / handle are placeholders pending Camille's confirmation.
--------------------------------------------------------------------------- */
export type Channel = { name: string; value: string; href: string | null };

export const CHANNELS: Channel[] = [
  {
    name: "Email",
    value: "hello@camillebuzuno.com",
    href: "mailto:hello@camillebuzuno.com",
  },
  {
    name: "Instagram",
    value: "@camillebuzuno",
    href: "https://www.instagram.com/camillebuzuno/",
  },
  { name: "Behance", value: "In preparation", href: null },
  { name: "LinkedIn", value: "In preparation", href: null },
];
