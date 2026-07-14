import Link from "next/link";
import { NAV } from "../lib/nav";
import ThemeToggle from "./ThemeToggle";

/**
 * Minimal institutional header. The wordmark links Home; the remaining
 * sections are presented as a slim monospace row alongside the theme switch.
 */
export default function SiteHeader() {
  const sections = NAV.filter((item) => item.href !== "/");

  return (
    <header className="sticky top-0 z-20 border-b border-hair bg-[var(--glass)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 sm:px-10">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="text-sm font-medium tracking-tight text-fg">
            Camille Buzuno
          </span>
          <span className="label-mono hidden sm:inline">Artist</span>
        </Link>

        <div className="flex items-center gap-6">
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-5">
              {sections.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="label-mono !text-[0.62rem] transition-colors hover:!text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
