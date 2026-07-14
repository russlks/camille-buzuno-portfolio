import Link from "next/link";
import SiteHeader from "./SiteHeader";
import { NAV } from "../lib/nav";

/**
 * Minimal route stub. Names the section (per the agreed architecture) and
 * nothing more — no invented content. Full pages are built later.
 */
export default function SectionPlaceholder({ href }: { href: string }) {
  const item = NAV.find((n) => n.href === href);
  if (!item) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center">
        <span className="label-mono !text-accent">{item.n}</span>
        <h1 className="text-4xl font-light tracking-tight text-fg sm:text-5xl">
          {item.label}
        </h1>
        <span className="label-mono !text-[0.6rem]">In preparation</span>
        <Link
          href="/"
          className="label-mono mt-6 !text-[0.62rem] transition-colors hover:!text-accent"
        >
          ← Home
        </Link>
      </main>
    </div>
  );
}
