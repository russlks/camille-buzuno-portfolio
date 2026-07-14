import SiteHeader from "./components/SiteHeader";
import OysterNav from "./components/OysterNav";
import FloatingNav from "./components/FloatingNav";
import EditorialGrid from "./components/EditorialGrid";
import ParallaxPortrait from "./components/ParallaxPortrait";

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
        </div>

        {/* Oyster — desktop only. Fills the hero and sits behind the name
            (both have room). Untouched from the original design. */}
        <div className="hidden lg:absolute lg:inset-0 lg:z-0 lg:flex lg:items-center lg:justify-center">
          <OysterNav />
        </div>

        {/* Floating navigation — mobile + iPad. Sections orbit a small
            organic form in open water; stacks below the name so they never
            overlap. Replaces the oyster below the `lg` breakpoint. */}
        <div className="relative z-0 flex w-full flex-1 items-center justify-center overflow-x-clip pt-6 pb-10 lg:hidden">
          <FloatingNav />
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
