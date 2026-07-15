import SiteHeader from "./components/SiteHeader";
import OysterNav from "./components/OysterNav";
import EditorialGrid from "./components/EditorialGrid";
import ParallaxPortrait from "./components/ParallaxPortrait";
import { NAV } from "./lib/nav";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <ParallaxPortrait />
      <EditorialGrid />
      <SiteHeader />

      <main className="relative flex flex-1 flex-col">
        {/* Identity — aligned to the left grid column. On desktop it rests
            slightly above centre (~22vh from the top) with generous space
            around it; on mobile it stays near the top. */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-14 sm:px-10 lg:pt-[22vh]">
          <span className="label-mono">Artist</span>
          <h1 className="mt-3 font-light leading-[0.98] tracking-tight text-fg text-[clamp(2.5rem,7vw,4.25rem)]">
            Camille
            <br />
            Buzuno
          </h1>

          {/* Mobile-only legend — maps the shell's numbers (01–09) to their
              sections so the numbering reads clearly. Museum-caption styling:
              tiny, faint, quiet; never competes with the shell. Hidden from
              screen readers (the shell already exposes an ordered nav list). */}
          <ul
            className="oyster-legend absolute left-6 top-full mt-6 sm:left-10 lg:hidden"
            aria-hidden="true"
          >
            {NAV.map((item) => (
              <li key={item.href}>
                <span className="oyster-legend-n">{item.n}</span>
                <span className="oyster-legend-dash">—</span>
                <span>
                  {item.label === "Works" ? "Selected Works" : item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Oyster — the main visual object. On desktop it fills the hero and
            sits behind the name (both have room); on mobile it stacks below so
            the two never overlap. */}
        <div className="relative z-0 flex flex-1 items-center justify-center lg:absolute lg:inset-0">
          <OysterNav />
        </div>
      </main>

      <footer className="relative">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
          <span className="label-mono !text-[0.6rem]">© 2026 Camille Buzuno</span>
          <span className="label-mono !text-[0.6rem]">Artist Portfolio</span>
        </div>
      </footer>
    </div>
  );
}
