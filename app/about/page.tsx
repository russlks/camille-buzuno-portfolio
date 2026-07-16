import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import ShellAbout from "../components/about/ShellAbout";
import NextChapterTransition from "../components/NextChapterTransition";

export const metadata: Metadata = {
  title: "About — Camille Buzuno",
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen text-fg">
      <SiteHeader />
      <ShellAbout />
      <NextChapterTransition
        chapter="About"
        next={{ href: "/cv", label: "Curriculum Vitae" }}
      />
    </div>
  );
}
