import Link from "next/link";
import type { Artwork } from "../../lib/works";

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="wd-meta-row">
      <dt className="wd-meta-label">{label}</dt>
      <dd className="wd-meta-value">{value}</dd>
    </div>
  );
}

/* Individual work view — full artwork, metadata and previous / next
   navigation through the archive. */
export default function WorkDetail({
  work,
  prev,
  next,
}: {
  work: Artwork;
  prev: Artwork | null;
  next: Artwork | null;
}) {
  return (
    <main className="wd">
      <Link href="/works" className="wd-back label-mono">
        <span aria-hidden="true">←</span> Selected Works
      </Link>

      <div className="wd-body">
        <div className="wd-stage">
          <div
            className="aw-frame aw-frame--wd"
            style={
              {
                "--w": work.widthCm,
                "--h": work.heightCm,
              } as React.CSSProperties
            }
          >
            <span className="aw-mat">
              <span className="aw-canvas" data-series={work.series}>
                {work.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={work.image} alt={work.title} />
                ) : null}
              </span>
            </span>
          </div>
        </div>

        <aside className="wd-info">
          <span className="label-mono">{work.series}</span>
          <h1 className="wd-title">{work.title}</h1>

          <dl className="wd-meta">
            <Meta label="Year" value={String(work.year)} />
            <Meta label="Medium" value={work.medium} />
            <Meta
              label="Dimensions"
              value={`${work.widthCm} × ${work.heightCm} cm`}
            />
            <Meta label="Series" value={work.series} />
            <Meta label="Status" value={work.status} />
          </dl>

          {work.description ? (
            <p className="wd-description">{work.description}</p>
          ) : null}
        </aside>
      </div>

      <nav className="wd-nav" aria-label="Works navigation">
        {prev ? (
          <Link href={`/works/${prev.slug}`} className="wd-nav-link wd-nav-prev">
            <span className="label-mono wd-nav-dir">
              <span aria-hidden="true">←</span> Previous
            </span>
            <span className="wd-nav-title">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/works/${next.slug}`} className="wd-nav-link wd-nav-next">
            <span className="label-mono wd-nav-dir">
              Next <span aria-hidden="true">→</span>
            </span>
            <span className="wd-nav-title">{next.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
