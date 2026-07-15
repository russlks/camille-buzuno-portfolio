import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import WorkDetail from "../../components/works/WorkDetail";
import { WORKS, getWork, workNeighbors } from "../../lib/works";

export function generateStaticParams() {
  return WORKS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = getWork(slug);
  return {
    title: work
      ? `${work.title} — Camille Buzuno`
      : "Work — Camille Buzuno",
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();
  const { prev, next } = workNeighbors(slug);

  return (
    <div className="relative min-h-screen text-fg">
      <SiteHeader />
      <WorkDetail work={work} prev={prev} next={next} />
    </div>
  );
}
