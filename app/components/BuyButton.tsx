"use client";

import type { Artwork } from "../lib/works";
import { openPurchase } from "../lib/purchaseStore";

/* "Buy Original" — a restrained, gallery-quiet control (not a shop button).
   Opens the shared purchase-request modal for this specific artwork. */
export default function BuyButton({
  work,
  className = "",
}: {
  work: Artwork;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`wk-buy ${className}`.trim()}
      onClick={() => openPurchase(work)}
    >
      Buy Original
    </button>
  );
}
