"use client";

import Link from "next/link";
import { cardWidthPx, type Artwork } from "../../lib/works";
import { playWood } from "../../lib/sound";
import { formatPrice, SHIPPING_NOTE } from "@/data/commerce";
import ArtworkCanvas from "./ArtworkCanvas";
import BuyButton from "../BuyButton";

const statusSlug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

/* One work in the hang. The image and its caption link to the detail page; the
   commerce line (status, price, buy) sits below as a sibling so the Buy
   control is never nested inside the card link. Sizing and the thin oak frame
   are unchanged. Only "Available" works show a price + Buy; the shipping note
   appears only when a concrete price is set. */
export default function ArtworkCard({
  work,
  index,
  eager = false,
}: {
  work: Artwork;
  index: number;
  eager?: boolean;
}) {
  const available = work.status === "Available";
  const showShipping = available && work.price != null;

  return (
    <div
      className="wk-card"
      style={
        {
          "--w": work.widthCm,
          "--h": work.heightCm,
          "--cardw": cardWidthPx(work),
        } as React.CSSProperties
      }
    >
      <Link
        href={`/works/${work.slug}`}
        className="wk-card-link"
        aria-label={`${work.displayTitle}, ${work.year} — ${work.displayedMedium}, ${work.widthCm} × ${work.heightCm} cm`}
        onMouseEnter={() => playWood(index)}
        onPointerDown={() => playWood(index)}
      >
        <span className="wk-plate">
          <ArtworkCanvas
            image={work.image}
            alt={work.displayTitle}
            series={work.series}
            title={work.displayTitle}
            eager={eager}
          />
        </span>

        <span className="wk-cap">
          <span className="wk-cap-title">{work.displayTitle}</span>
          <span className="wk-cap-line">
            {work.year} · {work.displayedMedium}
          </span>
          <span className="wk-cap-dim">
            {work.widthCm} × {work.heightCm} cm
          </span>
        </span>
      </Link>

      <div className="wk-commerce">
        <span className="wk-status" data-status={statusSlug(work.status)}>
          {work.status.toUpperCase()}
        </span>
        {available ? (
          <>
            <span className="wk-price">
              {formatPrice(work.price, work.currency)}
            </span>
            {showShipping ? (
              <span className="wk-ship">{SHIPPING_NOTE}</span>
            ) : null}
            <BuyButton buyLink={work.buyLink} />
          </>
        ) : null}
      </div>
    </div>
  );
}
