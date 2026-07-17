import Link from "next/link";
import type { Artwork } from "../../lib/works";
import { formatPrice, SHIPPING_NOTE } from "@/data/commerce";
import ArtworkCanvas from "./ArtworkCanvas";
import BuyButton from "../BuyButton";
import ExhibitionList from "./ExhibitionList";

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
            className="wk-plate wk-plate--lg"
            style={
              {
                "--w": work.widthCm,
                "--h": work.heightCm,
              } as React.CSSProperties
            }
          >
            <ArtworkCanvas
              image={work.image}
              alt={work.displayTitle}
              series={work.series}
              title={work.displayTitle}
              eager
            />
          </div>
        </div>

        <aside className="wd-info">
          <span className="label-mono">{work.series}</span>
          <h1 className="wd-title">{work.displayTitle}</h1>

          <dl className="wd-meta">
            <Meta label="Year" value={String(work.year)} />
            <Meta label="Medium" value={work.displayedMedium} />
            <Meta
              label="Dimensions"
              value={`${work.widthCm} × ${work.heightCm} cm`}
            />
            <Meta label="Series" value={work.series} />
            <Meta label="Status" value={work.status} />
            {work.status === "Available" ? (
              <Meta
                label="Price"
                value={formatPrice(work.price, work.currency)}
              />
            ) : null}
          </dl>

          {work.status === "Available" ? (
            <div className="wd-buy">
              <BuyButton work={work} />
              {work.price != null ? (
                <span className="wd-ship">{SHIPPING_NOTE}</span>
              ) : null}
            </div>
          ) : null}

          {work.description ? (
            <p className="wd-description">{work.description}</p>
          ) : null}

          {work.exhibitions.length > 0 ? (
            <section className="wd-exh">
              <h2 className="wd-exh-title label-mono">Exhibitions</h2>
              <ExhibitionList items={work.exhibitions} />
            </section>
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
