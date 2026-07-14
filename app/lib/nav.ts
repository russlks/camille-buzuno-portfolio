export type NavItem = {
  n: string; // ordinal label, e.g. "01"
  label: string;
  href: string;
};

/**
 * The agreed navigation architecture, in order.
 * Presented both as the oyster shell layers and as the header navigation.
 */
export const NAV: NavItem[] = [
  { n: "01", label: "Home", href: "/" },
  { n: "02", label: "Artist Statement", href: "/artist-statement" },
  { n: "03", label: "Works", href: "/works" },
  { n: "04", label: "About", href: "/about" },
  { n: "05", label: "CV", href: "/cv" },
  { n: "06", label: "Exhibitions", href: "/exhibitions" },
  { n: "07", label: "Commercial Production", href: "/commercial" },
  { n: "08", label: "Shop", href: "/shop" },
  { n: "09", label: "Contact", href: "/contact" },
];
