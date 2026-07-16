import SectionPlaceholder from "../components/SectionPlaceholder";
import NextChapterTransition from "../components/NextChapterTransition";

export default function Page() {
  return (
    <>
      <SectionPlaceholder href="/exhibitions" />
      {/* Arrival only — Exhibitions is the final chapter (no onward transition). */}
      <NextChapterTransition chapter="Exhibitions" />
    </>
  );
}
