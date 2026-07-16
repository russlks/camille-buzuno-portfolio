import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import WorksArchive from "../components/works/WorksArchive";

export const metadata: Metadata = {
  title: "Selected Works — Camille Buzuno",
};

export default function WorksPage() {
  return (
    <div className="relative min-h-screen text-fg">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1060px] px-6 pb-32 pt-[13vh] sm:px-8">
        <header className="works-head">
          <span className="label-mono">Archive</span>
          <h1 className="works-title">Selected Works</h1>
        </header>
        <WorksArchive />
      </main>
    </div>
  );
}
