"use client";

import { useSyncExternalStore } from "react";
import type { Artwork } from "../lib/works";
import {
  openPurchase,
  subscribePurchase,
  getPurchaseSnapshot,
} from "../lib/purchaseStore";

/* "Buy Original" — a restrained, gallery-quiet control (not a shop button).
   Opens the shared purchase-request modal for this specific artwork, and
   disables itself immediately while that modal is open so a second click
   can't start a duplicate request. */
export default function BuyButton({
  work,
  className = "",
}: {
  work: Artwork;
  className?: string;
}) {
  const active = useSyncExternalStore(
    subscribePurchase,
    getPurchaseSnapshot,
    () => null
  );
  const isOpen = active?.id === work.id;

  return (
    <button
      type="button"
      className={`wk-buy ${className}`.trim()}
      onClick={() => openPurchase(work)}
      disabled={isOpen}
      aria-haspopup="dialog"
    >
      Buy Original
    </button>
  );
}
