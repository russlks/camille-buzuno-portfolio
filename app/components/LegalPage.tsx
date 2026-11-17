import SiteHeader from "./SiteHeader";

/* Общая вёрстка юридических страниц (Privacy, Terms): шапка сайта,
   узкая колонка текста и тот же подвал, что на главной. */
export const SELLER = {
  name: "Kamilya Buzunova",
  brand: "Camille Buzuno",
  form: "self-employed individual (OSVČ)",
  ico: "21918376",
  address: "Vysočanská 237/101, 190 00 Praha 9, Czech Republic",
};

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-lg font-medium">{title}</h2>
      <div className="space-y-3 text-[0.95rem] leading-relaxed opacity-85">
        {children}
      </div>
    </section>
  );
}

export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col text-fg">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-20 pt-10 sm:px-10">
        <p className="label-mono">Camille Buzuno</p>
        <h1 className="mt-3 text-3xl font-medium sm:text-4xl">{title}</h1>
        <p className="label-mono mt-3 !text-[0.65rem] opacity-60">
          Last updated: {updated}
        </p>
        {children}
      </main>
      <footer className="relative">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
          <span className="label-mono !text-[0.6rem]">© 2026 Camille Buzuno</span>
          <span className="label-mono flex gap-4 !text-[0.6rem]">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
