import type { Exhibition } from "../../lib/works";

/* A structured exhibition history. Renders nothing when empty, so a heading is
   only ever shown by the parent when there is real content — no "no
   exhibitions yet" placeholder appears on the public site. */
export default function ExhibitionList({ items }: { items: Exhibition[] }) {
  if (!items || items.length === 0) return null;

  return (
    <ul className="exh-list">
      {items.map((e, i) => {
        const place = [e.venue, e.city, e.country].filter(Boolean).join(", ");
        const when = e.dates || String(e.year);
        const body = (
          <>
            <span className="exh-title">{e.title}</span>
            {place ? <span className="exh-place">{place}</span> : null}
            <span className="exh-year">{when}</span>
          </>
        );
        return (
          <li key={`${e.title}-${i}`} className="exh-item">
            {e.link ? (
              <a
                href={e.link}
                target="_blank"
                rel="noreferrer"
                className="exh-entry exh-entry--link"
              >
                {body}
              </a>
            ) : (
              <span className="exh-entry">{body}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
