import type { Artwork } from "./works";

/* A tiny shared store so any "Buy Original" button (on cards or the detail
   view) opens a single shared purchase modal with the selected artwork.
   Client-only module singleton, compatible with useSyncExternalStore. */
let current: Artwork | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function openPurchase(artwork: Artwork) {
  current = artwork;
  emit();
}

export function closePurchase() {
  current = null;
  emit();
}

export function getPurchaseSnapshot() {
  return current;
}

export function subscribePurchase(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
