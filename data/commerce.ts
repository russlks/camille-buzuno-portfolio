/* ---------------------------------------------------------------------------
   Commerce presentation — one editable place for the money-facing wording, so
   the works still read as gallery pieces rather than shop products.

   Edit the note text, the currency symbols or the "price on request" wording
   here and it updates everywhere.
--------------------------------------------------------------------------- */

// Shown small and light-gray beneath a concrete price. Reword freely.
export const SHIPPING_NOTE = "Worldwide insured shipping included";

// Displayed when an available work has no price set yet.
export const PRICE_ON_REQUEST = "Price on request";

// Buy button label.
export const BUY_LABEL = "Buy";

export const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  CZK: "Kč",
};

/** Format a price like "€2,500". Falls back to "Price on request" when unset. */
export function formatPrice(
  price: number | null | undefined,
  currency: string
): string {
  if (price == null) return PRICE_ON_REQUEST;
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `;
  return `${symbol}${price.toLocaleString("en-US")}`;
}
