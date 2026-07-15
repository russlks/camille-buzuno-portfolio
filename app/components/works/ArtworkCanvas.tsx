"use client";

import { useCallback, useState } from "react";

/* The artwork surface. When the real image is present it is shown cleanly,
   object-fit: contain, no crop, no filter / overlay / opacity change. If the
   file isn't there yet (or fails to load) a neutral placeholder labelled with
   the artwork title is shown instead — the database entry is unaffected. */
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
      <span className="aw-placeholder" aria-hidden={showImage || undefined}>
        <span className="aw-placeholder-label">Image forthcoming</span>
        <span className="aw-placeholder-title">{title}</span>
      </span>
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={check}
          src={image}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          onError={() => setFailed(true)}
        />
      ) : null}
    </span>
  );
}
