import ArtworkCard from "./ArtworkCard";
import { curateRows, type Artwork } from "../../lib/works";

/* A curated hang. Works are grouped into intentional, centred rows (at most
   three; biased to balanced pairs) with close, deliberate spacing — calm and
   editorial, never an auto-packed grid. The varied sizes carry the rhythm. */
export default function Gallery({ works }: { works: Artwork[] }) {
  if (works.length === 0) {
    return (
      <p className="wk-empty label-mono">
        No works match the current filters.
      </p>
    );
  }

  const rows = curateRows(works);
  // Small archive: eager-load the first two rows' worth so the in-flow images
  // reserve their height before paint; the rest stay lazy.
  const eagerIds = new Set(works.slice(0, 5).map((w) => w.id));
  const order = new Map(works.map((w, i) => [w.id, i]));

  return (
    <div className="wk-gallery">
      {rows.map((row, r) => (
        <div key={r} className="wk-row" data-count={row.length}>
          {row.map((w) => (
            <ArtworkCard
              key={w.id}
              work={w}
              index={order.get(w.id) ?? 0}
              eager={eagerIds.has(w.id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
