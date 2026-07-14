import SiteHeader from "./components/SiteHeader";
import OysterNav from "./components/OysterNav";
import EditorialGrid from "./components/EditorialGrid";
import ParallaxPortrait from "./components/ParallaxPortrait";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <ParallaxPortrait />
      <EditorialGrid />
      <SiteHeader />

      <main className="relative flex flex-1 flex-col">
        {/* Identity */}
        <div className="relative z-10 px-6 pt-10 sm:px-10 sm:pt-14">
          <span className="label-mono">Artist</span>
          <h1 className="mt-3 text-5xl font-light leading-[0.98] tracking-tight text-fg sm:text-6xl">
            Camille
            <br />
            Buzuno
          </h1>
        </div>

        {/* Oyster navigation — the centerpiece */}
        <div className="relative -mt-8 flex flex-1 items-center justify-center">
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
