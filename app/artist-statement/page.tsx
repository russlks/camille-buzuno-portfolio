import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SoundLink from "../components/SoundLink";

export const metadata: Metadata = {
  title: "Artist Statement — Camille Buzuno",
};

const PARAGRAPHS = [
  "My artistic practice is centered around the language of the human body, silhouette, and color. The relationship between these three elements allows me to communicate what matters most to me.",
  "The first thing I look for is an immediate impression. I want my work to contain an element of surprise. It is not always about beauty; sometimes it is about creating a strange or unsettling feeling before the viewer has time to analyze what they see.",
  "The second is the subject I explore. To me, a successful work is both obvious and elusive at the same time. I like when meaning feels accessible without requiring the viewer to search for it, yet never becomes overly literal or predictable. My paintings often explore emotional and psychological states, which are deeply individual by nature. That is why I enjoy listening to people's interpretations of my work. For me, those conversations become a continuation of the artwork itself.",
  "When I paint the human body, I place more meaning into it than I am able to consciously analyze. It often feels as though my hands are capable of communicating more than I can express through language—sometimes even more than I am able to understand myself.",
];

export default function ArtistStatementPage() {
  return (
    <div className="relative min-h-screen text-fg">
      <SiteHeader />

      {/* Portrait — a quiet atmospheric presence on the left, sitting behind
          everything (below the mermaid and the text). It emerges slowly on
          load, is heavily softened (low opacity, blur, desaturated, low
          contrast) and dissolves rightward into the page via a soft gradient
          mask — never a hero image. Hidden on phones for readability. See
          .portrait-bg in globals.css. */}
      <div aria-hidden="true" className="portrait-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/portrait/portrait-bg.jpg" alt="" className="portrait-bg__img" />
      </div>

      {/* Vitruvian Mermaid — decorative background only. A teal duotone
          engraving set very low, the figure centered behind the text with the
          frame bleeding past the edges, and a slow breathing drift. Inert to
          pointer events; neutralised to soft light in dark mode (see
          .mermaid-bg in globals.css). */}
      <div aria-hidden="true" className="mermaid-bg">
        <div className="mermaid-bg__pos">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mermaid-teal.svg" alt="" className="mermaid-bg__fig" />
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-[680px] px-6 pb-40 pt-[15vh] sm:px-8">
        <p className="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-faint">
          Artist Statement
        </p>

        <div className="mt-10 space-y-7 text-[1.08rem] font-light leading-[1.85] text-fg sm:mt-12 sm:text-[1.16rem]">
          {PARAGRAPHS.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* Continue Exploring — end-of-chapter navigation. Not a footer: a
            quiet invitation onward, with Selected Works as the primary next
            destination and Home / Contact kept secondary. */}
        <nav
          aria-label="Continue exploring"
          className="mt-32 border-t border-hair pt-14 sm:mt-44"
        >
          <p className="label-mono">Continue Exploring</p>

          <SoundLink
            href="/works"
            note={0}
            className="group mt-7 inline-flex items-baseline gap-3 text-fg transition-colors duration-300 hover:text-accent"
          >
            <span className="text-[clamp(1.7rem,4.5vw,2.5rem)] font-light leading-none tracking-tight">
              Selected Works
            </span>
            <span
              aria-hidden="true"
              className="text-[1.35rem] transition-transform duration-300 group-hover:translate-x-1.5"
            >
              →
            </span>
          </SoundLink>

          <div className="mt-12 flex items-center justify-between">
            <SoundLink
              href="/"
              note={2}
              className="group label-mono inline-flex items-center gap-2 transition-colors duration-300 hover:!text-accent"
            >
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-x-1"
              >
                ←
              </span>
              Home
            </SoundLink>
            <SoundLink
              href="/contact"
              note={4}
              className="group label-mono inline-flex items-center gap-2 transition-colors duration-300 hover:!text-accent"
            >
              Contact
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </SoundLink>
          </div>
        </nav>
      </main>
    </div>
  );
}
