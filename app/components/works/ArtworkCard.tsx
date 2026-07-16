"use client";

import Link from "next/link";
import { cardWidthPx, type Artwork } from "../../lib/works";
import { playWood } from "../../lib/sound";
import ArtworkCanvas from "./ArtworkCanvas";

/* One work in the hang. Frameless: the artwork floats on a soft shadow with a
   single hairline edge (no mat, no beige moulding). Its width is guided by the
   real centimetre dimensions (cardWidthPx → --cardw), scaled responsively and
   clamped, and the canvas derives its height from the true aspect ratio so the
   image is never cropped. Metadata sits directly below; series + availability
   fade in on hover. Hover / tap sounds the work's wood note. */
export default function ArtworkCard({
  work,
  index,
  eager = false,
}: {
  work: Artwork;
  index: number;
  eager?: boolean;
}) {
  return (
    <Link
      href={`/works/${work.slug}`}
      className="wk-card"
      style={
        {
          "--w": work.widthCm,
          "--h": work.heightCm,
          "--cardw": cardWidthPx(work),
        } as React.CSSProperties
      }
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
        <span className="wk-cap-hover" aria-hidden="true">
          {work.status} · {work.series}
        </span>
      </span>
    </Link>
  );
}
