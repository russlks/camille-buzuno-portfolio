"use client";

import { useCallback, useState } from "react";

/* The artwork surface. The real image is shown cleanly and in-flow, so the
   plate hugs the image's true aspect ratio — no letterboxing, no mat, no crop,
   no filter/overlay/opacity change. Its on-screen *scale* is set by the card
   (from the real cm dimensions); the height simply follows the image. If the
   file isn't there yet (or fails to load) a neutral placeholder shaped by the
   catalogue dimensions is shown instead — the database entry is unaffected. */
export default function ArtworkCanvas({
  image,
  alt,
  series,
  title,
  eager = false,
}: {
  image: string;
  alt: string;
  series: string;
  title: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(image) && !failed;

  // Catch images that 404'd before React attached onError (already complete
  // with no intrinsic size) as well as later load failures.
  const check = useCallback((el: HTMLImageElement | null) => {
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <span className="aw-canvas" data-series={series}>
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="aw-img"
          ref={check}
          src={image}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="aw-placeholder">
          <span className="aw-placeholder-label">Image forthcoming</span>
          <span className="aw-placeholder-title">{title}</span>
        </span>
      )}
    </span>
  );
}
