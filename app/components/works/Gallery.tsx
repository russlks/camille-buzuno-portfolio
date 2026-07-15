import ArtworkFrame from "./ArtworkFrame";
import type { Artwork } from "../../lib/works";

/* Free-flowing gallery hang. Works keep their real proportions and their
   real-size-derived scale, arranged with generous whitespace — no uniform
   thumbnails, no product grid. */
export default function Gallery({ works }: { works: Artwork[] }) {
  if (works.length === 0) {
    return (
      <p className="works-empty label-mono">
        No works match the current filters.
      </p>
    );
  }
  return (
    <div className="gallery">
      {works.map((w, i) => (
        <ArtworkFrame key={w.id} work={w} eager={i < 4} />
      ))}
    </div>
  );
}
