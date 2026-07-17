import SoundLink from "./SoundLink";

/* The large editorial "Continue Exploring" navigation panel used at the end of
   chapters. A thin top rule, a small mono eyebrow, one dominant destination
   (the whole area clickable), and a Home ← / Contact → row that stays visible
   on every screen. Optionally carries the same faint mermaid engraving behind
   it as the Artist Statement panel. */
export default function ContinueExploring({
  primary,
  left = { href: "/", label: "Home" },
  right = { href: "/contact", label: "Contact" },
  background = false,
}: {
  primary: { href: string; label: string };
  left?: { href: string; label: string };
  right?: { href: string; label: string };
  background?: boolean;
}) {
  return (
    <nav
      aria-label="Continue exploring"
      className="relative mt-32 border-t border-hair pt-14 sm:mt-44"
    >
      {background ? (
        <div className="continue-bg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/mermaid-teal.svg"
            alt=""
            className="continue-bg__fig"
          />
        </div>
      ) : null}

      <div className="relative z-[1]">
        <p className="label-mono">Continue Exploring</p>

        <SoundLink
          href={primary.href}
          note={0}
          className="group mt-7 inline-flex items-baseline gap-3 text-fg transition-colors duration-300 hover:text-accent"
        >
          <span className="text-[clamp(1.7rem,4.5vw,2.5rem)] font-light leading-none tracking-tight">
            {primary.label}
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
            href={left.href}
            note={2}
            className="group label-mono inline-flex items-center gap-2 transition-colors duration-300 hover:!text-accent"
          >
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-x-1"
            >
              ←
            </span>
            {left.label}
          </SoundLink>
          <SoundLink
            href={right.href}
            note={4}
            className="group label-mono inline-flex items-center gap-2 transition-colors duration-300 hover:!text-accent"
          >
            {right.label}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </SoundLink>
        </div>
      </div>
    </nav>
  );
}
