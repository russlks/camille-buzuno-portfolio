"use client";

import Link from "next/link";
import type { Artwork } from "../../lib/works";
import { playWood } from "../../lib/sound";

/* One framed artwork on the gallery wall. Its on-screen width is derived from
   the real centimetre dimensions (via the --w/--h custom props and the
   responsive --ppc "pixels per cm" set on the gallery), clamped so tiny works
   stay visible and monumental works don't break the layout. The frame is a
   thin, matte, contemporary floating profile that follows the artwork's
   proportions and never crops it. Hover / tap sounds the work's wood note —
   part of the shared site sound language. */
export default function ArtworkFrame({
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
      className="aw"
      style={
        { "--w": work.widthCm, "--h": work.heightCm } as React.CSSProperties
      }
      aria-label={`${work.title}, ${work.year} — ${work.medium}, ${work.widthCm} × ${work.heightCm} cm`}
      onMouseEnter={() => playWood(index)}
      onPointerDown={() => playWood(index)}
    >
      <span className={`aw-frame aw-frame--${work.frameStyle}`}>
        <span className="aw-mat">
          <span className="aw-canvas" data-series={work.series}>
            {work.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={work.image}
                alt={work.title}
                loading={eager ? "eager" : "lazy"}
              />
            ) : null}
          </span>
        </span>
      </span>

      <span className="aw-label">
        <span className="aw-label-title">{work.title}</span>
        <span className="aw-label-meta">
          {work.year} · {work.medium} · {work.widthCm} × {work.heightCm} cm
        </span>
      </span>
    </Link>
  );
}
