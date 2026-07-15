import ArtworkFrame from "./ArtworkFrame";
import { curateRows, type Artwork } from "../../lib/works";

/* A curated exhibition hang. Works are grouped into intentional rows (never
   more than three; monumental works alone; large works uncrowded) with
   alternating placement and generous negative space — calm and architectural,
   not an auto-packed grid. */
export default function Gallery({ works }: { works: Artwork[] }) {
  if (works.length === 0) {
    return (
      <p className="works-empty label-mono">
        No works match the current filters.
      </p>
    );
  }

  const rows = curateRows(works);
  const eagerIds = new Set(works.slice(0, 3).map((w) => w.id));
  const order = new Map(works.map((w, i) => [w.id, i]));

  return (
    <div className="gallery">
      {rows.map((row, r) => (
        <div
          key={r}
          className={`gallery-row is-${row.align}${row.breathe ? " is-breathe" : ""}`}
        >
          {row.items.map((w) => (
            <ArtworkFrame
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
