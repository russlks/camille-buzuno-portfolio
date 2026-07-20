import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import DownloadPortfolio from "../components/DownloadPortfolio";
import NextChapterTransition from "../components/NextChapterTransition";
import { CHANNELS } from "@/data/contact";
import {
  EDUCATION,
  EXPERIENCE,
  SELECTED_EXHIBITIONS,
  PRIVATE_COLLECTIONS,
  INSTITUTIONAL_COLLECTIONS,
  PUBLICATIONS,
  AWARDS,
  LANGUAGES,
  CV_PDF,
  type CvEntry,
} from "@/data/cv";

// The art-portfolio PDF, served from public/. A clean, space-free, lowercase-
// stable path so the link works on Vercel; the file downloads as
// "Camille_Buzuno_Art_Portfolio.pdf" (see the button's downloadName).
const PORTFOLIO_PDF = "/Camille_Buzuno_Art_Portfolio.pdf";

export const metadata: Metadata = {
  title: "CV — Kamilya Buzunova",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="cv-section">
      <h2 className="cv-section-title">{title}</h2>
      <div className="cv-rows">{children}</div>
    </section>
  );
}

function Row({
  period,
  children,
}: {
  period: string;
  children: React.ReactNode;
}) {
  return (
    <div className="cv-row">
      <div className="cv-row-date">{period}</div>
      <div className="cv-row-body">{children}</div>
    </div>
  );
}

function DatedEntry({ e }: { e: CvEntry }) {
  return (
    <Row period={e.period}>
      <span className="cv-item-title">{e.title}</span>
      {e.org ? <span className="cv-item-org">{e.org}</span> : null}
      {e.location ? <span className="cv-item-loc">{e.location}</span> : null}
    </Row>
  );
}

export default function CvPage() {
  const contact = CHANNELS.filter((c) => c.href);
  // Reverse chronological — newest exhibitions first, regardless of data order.
  const exhibitions = [...SELECTED_EXHIBITIONS].sort(
    (a, b) => Number(b.year) - Number(a.year)
  );
  const hasCollections =
    PRIVATE_COLLECTIONS.length > 0 || INSTITUTIONAL_COLLECTIONS.length > 0;

  return (
    <div className="relative min-h-screen text-fg">
      <SiteHeader />

      <main className="cv">
        <header className="cv-head">
          <h1 className="cv-name">Kamilya Buzunova</h1>
          <p className="cv-sub label-mono">Curriculum Vitae</p>
          {/* Subtle shell-inspired line detail — two thin layered growth lines,
              one in a restrained teal. Decorative but quiet. */}
          <svg
            className="cv-shell-rule"
            viewBox="0 0 320 16"
            aria-hidden="true"
            preserveAspectRatio="none"
          >
            <path
              className="cv-shell-line"
              d="M2 11 C 70 3, 150 3, 210 8 S 300 12, 318 6"
            />
            <path
              className="cv-shell-line cv-shell-line--accent"
              d="M2 8 C 70 1, 150 1, 210 5 S 300 9, 318 3"
            />
          </svg>
        </header>

        <Section title="Education">
          {EDUCATION.map((e, i) => (
            <DatedEntry key={i} e={e} />
          ))}
        </Section>

        <Section title="Professional Experience">
          {EXPERIENCE.map((e, i) => (
            <DatedEntry key={i} e={e} />
          ))}
        </Section>

        {exhibitions.length > 0 ? (
          <Section title="Selected Exhibitions">
            {exhibitions.map((x, i) => {
              const place = [x.venue, x.city, x.country]
                .filter(Boolean)
                .join(", ");
              return (
                <Row key={i} period={String(x.year)}>
                  <span className="cv-item-title">
                    {x.link ? (
                      <a
                        href={x.link}
                        target="_blank"
                        rel="noreferrer"
                        className="cv-link"
                      >
                        {x.title}
                      </a>
                    ) : (
                      x.title
                    )}
                  </span>
                  {place ? <span className="cv-item-org">{place}</span> : null}
                  {x.dates ? (
                    <span className="cv-item-loc">{x.dates}</span>
                  ) : null}
                </Row>
              );
            })}
          </Section>
        ) : null}

        {hasCollections ? (
          <Section title="Collections">
            {PRIVATE_COLLECTIONS.length > 0 ? (
              <Row period="Private">
                {PRIVATE_COLLECTIONS.map((c, i) => (
                  <span key={i} className="cv-item-line">
                    {c}
                  </span>
                ))}
              </Row>
            ) : null}
            {INSTITUTIONAL_COLLECTIONS.length > 0 ? (
              <Row period="Institutional">
                {INSTITUTIONAL_COLLECTIONS.map((c, i) => (
                  <span key={i} className="cv-item-line">
                    {c}
                  </span>
                ))}
              </Row>
            ) : null}
          </Section>
        ) : null}

        {PUBLICATIONS.length > 0 ? (
          <Section title="Publications & Press">
            {PUBLICATIONS.map((p, i) => (
              <Row key={i} period={p.year ? String(p.year) : "—"}>
                <span className="cv-item-title">
                  {p.link ? (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className="cv-link"
                    >
                      {p.title}
                    </a>
                  ) : (
                    p.title
                  )}
                </span>
                {p.publication ? (
                  <span className="cv-item-org">{p.publication}</span>
                ) : null}
              </Row>
            ))}
          </Section>
        ) : null}

        {AWARDS.length > 0 ? (
          <Section title="Awards & Residencies">
            {AWARDS.map((a, i) => (
              <Row key={i} period={a.year ? String(a.year) : "—"}>
                <span className="cv-item-title">{a.title}</span>
                {a.org ? <span className="cv-item-org">{a.org}</span> : null}
                {a.location ? (
                  <span className="cv-item-loc">{a.location}</span>
                ) : null}
              </Row>
            ))}
          </Section>
        ) : null}

        <Section title="Languages">
          {LANGUAGES.map((l, i) => (
            <Row key={i} period={l.name}>
              <span className="cv-item-title">{l.level}</span>
            </Row>
          ))}
        </Section>

        {contact.length > 0 ? (
          <Section title="Contact">
            {contact.map((c) => (
              <Row key={c.name} period={c.name}>
                <span className="cv-item-title">
                  <a
                    href={c.href as string}
                    target={c.href?.startsWith("http") ? "_blank" : undefined}
                    rel={c.href?.startsWith("http") ? "noreferrer" : undefined}
                    className="cv-link"
                  >
                    {c.value}
                  </a>
                </span>
              </Row>
            ))}
          </Section>
        ) : null}

        <div className="cv-download">
          <DownloadPortfolio href={CV_PDF} label="Download CV" />
          <DownloadPortfolio
            href={PORTFOLIO_PDF}
            label="Download Portfolio"
            downloadName="Camille_Buzuno_Art_Portfolio.pdf"
          />
        </div>
      </main>

      <NextChapterTransition
        chapter="Curriculum Vitae"
        next={{ href: "/exhibitions", label: "Exhibitions" }}
      />
    </div>
  );
}
