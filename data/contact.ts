/* ---------------------------------------------------------------------------
   Contact channels — the single source used by both the Contact page and the
   CV. Edit values here and both pages update. Social links (href starting with
   http) open in a new tab; the email opens the visitor's mail client (mailto).
--------------------------------------------------------------------------- */
export type Channel = { name: string; value: string; href: string | null };

export const CHANNELS: Channel[] = [
  {
    name: "Email",
    value: "russallks.off@gmail.com",
    href: "mailto:russallks.off@gmail.com",
  },
  {
    name: "Instagram",
    value: "@russllks.cb",
    href: "https://www.instagram.com/russllks.cb?igsh=MXJsbjl3cnZmbzduNw%3D%3D&utm_source=qr",
  },
  {
    name: "Behance",
    value: "behance.net/kamalemon",
    href: "https://www.behance.net/kamalemon",
  },
  {
    name: "LinkedIn",
    value: "linkedin.com/in/camillebuzu",
    href: "https://www.linkedin.com/in/camillebuzu?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  },
];
