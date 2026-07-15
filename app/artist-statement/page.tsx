import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";

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
    <div className="theme-light relative min-h-screen bg-white text-[#191c1e]">
      <SiteHeader />

      {/* Vitruvian Mermaid — decorative background only. A teal duotone
          engraving (adapted from the source vector) set very low, the figure
          centered behind the text with the frame bleeding past the edges, and
          a slow breathing drift. Inert to pointer events; disabled under
          reduced motion. See .mermaid-bg in globals.css. */}
      <div aria-hidden="true" className="mermaid-bg">
        <div className="mermaid-bg__pos">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mermaid-teal.svg" alt="" className="mermaid-bg__fig" />
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-[680px] px-6 pb-40 pt-[15vh] sm:px-8">
        <p className="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-[#8b9799]">
          Artist Statement
        </p>

        <div className="mt-10 space-y-7 text-[1.08rem] font-light leading-[1.85] text-[#242a2c] sm:mt-12 sm:text-[1.16rem]">
          {PARAGRAPHS.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </main>
    </div>
  );
}
