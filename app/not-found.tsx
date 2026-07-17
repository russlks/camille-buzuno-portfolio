import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "./components/SiteHeader";

export const metadata: Metadata = {
  title: "Page not found — Camille Buzuno",
};

/* Custom 404 so the site's own light-default theme is used everywhere —
   replacing Next's built-in error page (which carried a prefers-color-scheme
   dark rule). Minimal and on-brand; no new visual language. */
export default function NotFound() {
  return (
    <div className="relative min-h-screen text-fg">
      <SiteHeader />
      <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center gap-5 px-6 py-24 text-center">
        <span className="label-mono !text-accent">404</span>
        <h1 className="text-4xl font-light tracking-tight text-fg sm:text-5xl">
          Page not found
        </h1>
        <span className="label-mono !text-[0.6rem]">
          The page you’re looking for doesn’t exist.
        </span>
        <Link
          href="/"
          className="label-mono mt-4 !text-[0.62rem] transition-colors hover:!text-accent"
        >
          ← Home
        </Link>
      </main>
    </div>
  );
}
