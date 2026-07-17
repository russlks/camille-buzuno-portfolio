/* ---------------------------------------------------------------------------
   Services / Work With Me — the offerings shown on /commercial.

   Two distinct flows (never the same button for every service):
     • CONSULTATION  — a fixed-price Stripe Checkout ("Book a Consultation").
     • CUSTOM_SERVICES — bespoke work that opens a project inquiry form
       ("Request This Package"), never a "Buy now".

   Everything here is editable. To change the consultation price, update
   `amount` (in the smallest currency unit — cents) and `priceLabel`.
--------------------------------------------------------------------------- */
export type ServiceType = "fixed" | "custom";

export type Service = {
  id: string;
  name: string;
  type: ServiceType;
  summary: string;
  cta: string;
  priceLabel?: string; // shown to visitors, e.g. "€120"
  amount?: number; // Stripe unit_amount in cents, e.g. 12000
  currency?: string; // e.g. "eur"
};

export const CONSULTATION: Service = {
  id: "creative-consultation",
  name: "Creative Consultation",
  type: "fixed",
  summary:
    "A focused one-on-one session to talk through your idea, direction and the next creative steps — clear, personal and to the point.",
  cta: "Book a Consultation — €120",
  priceLabel: "€120",
  amount: 12000,
  currency: "eur",
};

export const CUSTOM_SERVICES: Service[] = [
  {
    id: "creative-direction",
    name: "Creative Direction",
    type: "custom",
    summary:
      "End-to-end creative direction for a project or brand — concept, art direction and a coherent visual language from first idea to final image.",
    cta: "Request This Package",
  },
  {
    id: "campaign-concept",
    name: "Campaign Concept",
    type: "custom",
    summary:
      "A distinctive concept and creative territory for a campaign — the core idea, tone and art direction that hold it together.",
    cta: "Request This Package",
  },
  {
    id: "visual-identity",
    name: "Visual Identity",
    type: "custom",
    summary:
      "A complete visual identity — symbol, palette, typography and the world it lives in — built to feel considered and enduring.",
    cta: "Request This Package",
  },
  {
    id: "ai-creative-production",
    name: "AI Creative Production",
    type: "custom",
    summary:
      "Interactive and AI-driven visual production that extends a story across new media, exploring how contemporary tools can deepen an image.",
    cta: "Request This Package",
  },
];

export const BUDGET_OPTIONS = [
  "Under €1,000",
  "€1,000–€2,500",
  "€2,500–€5,000",
  "€5,000+",
  "Not sure yet",
];

// Options for the inquiry form's "Selected Service" field (custom work +
// the general "Start a Project" catch-all).
export const INQUIRY_SERVICE_OPTIONS = [
  ...CUSTOM_SERVICES.map((s) => s.name),
  "Something else",
];
