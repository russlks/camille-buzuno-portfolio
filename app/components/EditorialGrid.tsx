/**
 * Editorial layout grid — a thin, almost-invisible 12-column field aligned to
 * the content width, in the spirit of Swiss editorial and modern luxury
 * portfolio layouts. No markers, no notebook squares; just quiet structure.
 */
export default function EditorialGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* One faint horizontal baseline */}
      <div
        className="absolute inset-x-0 top-1/2"
        style={{ borderTop: "1px solid var(--grid)" }}
      />
      {/* 12-column guides, aligned to the content column */}
      <div className="mx-auto h-full max-w-6xl px-6 sm:px-10">
        <div
          className="grid h-full grid-cols-12"
          style={{ borderRight: "1px solid var(--grid)" }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ borderLeft: "1px solid var(--grid)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
