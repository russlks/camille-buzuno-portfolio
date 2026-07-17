import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import NextChapterTransition from "../components/NextChapterTransition";
import ContinueExploring from "../components/ContinueExploring";
import {
  EXHIBITIONS,
  EXHIBITIONS_INTRO,
  type ExhibitionStatus,
} from "@/data/exhibitions";

export const metadata: Metadata = {
  title: "Exhibitions — Camille Buzuno",
};

const GROUPS: { status: ExhibitionStatus; label: string }[] = [
  { status: "current", label: "Currently on View" },
  { status: "upcoming", label: "Upcoming" },
  { status: "past", label: "Past Exhibitions" },
];

export default function ExhibitionsPage() {
  const groups = GROUPS.map((g) => ({
    ...g,
    items: EXHIBITIONS.filter((e) => e.status === g.status).sort(
      (a, b) => Number(b.year) - Number(a.year)
    ),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="relative min-h-screen text-fg">
      <SiteHeader />

      <main className="exhib">
        <header className="exhib-head">
          <h1 className="exhib-title">Exhibitions</h1>
          <div className="exhib-intro">
            {EXHIBITIONS_INTRO.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </header>

        {groups.map((g) => (
          <section className="cv-section" key={g.status}>
            <h2 className="cv-section-title">{g.label}</h2>
            <div className="cv-rows">
              {g.items.map((e, i) => {
                const place = [e.venue, e.city, e.country]
                  .filter(Boolean)
                  .join(", ");
                return (
                  <div className="cv-row" key={i}>
                    <div className="cv-row-date">
                      {e.dates || String(e.year)}
                    </div>
                    <div className="cv-row-body">
                      <span className="cv-item-title">
                        {e.link ? (
                          <a
                            href={e.link}
                            target="_blank"
                            rel="noreferrer"
                            className="cv-link"
                          >
                            {e.title}
                          </a>
                        ) : (
                          e.title
                        )}
                      </span>
                      {e.kind ? (
                        <span className="cv-item-org">{e.kind}</span>
                      ) : null}
                      {place ? (
                        <span className="cv-item-loc">{place}</span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        <ContinueExploring
          primary={{ href: "/works", label: "Works" }}
          background
        />
      </main>

      {/* Arrival only — Exhibitions is the final chapter (no onward transition). */}
      <NextChapterTransition chapter="Exhibitions" />
    </div>
  );
}
