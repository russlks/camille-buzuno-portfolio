import { BUY_LABEL } from "@/data/commerce";

/* A restrained Buy control — gallery-quiet, not a shop button. Renders a real
   link when a buyLink is set (opening external targets in a new tab), and a
   visible-but-inert button when it isn't, so it never leads to a broken page.
   Server-safe (no client hooks) so it works inside cards and the detail view. */
export default function BuyButton({
  buyLink,
  className = "",
}: {
  buyLink?: string | null;
  className?: string;
}) {
  const cls = `wk-buy ${className}`.trim();
  if (buyLink) {
    const external = /^https?:/i.test(buyLink);
    return (
      <a
        href={buyLink}
        className={cls}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        {BUY_LABEL}
      </a>
    );
  }
  return (
    <button type="button" className={cls}>
      {BUY_LABEL}
    </button>
  );
}
