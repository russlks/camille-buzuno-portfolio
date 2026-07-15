import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import OysterNav from "../components/OysterNav";

export const metadata: Metadata = {
  title: "Contact — Camille Buzuno",
};

// Placeholder email / handle — confirm the real values.
const CHANNELS: { name: string; value: string; href: string | null }[] = [
  {
    name: "Email",
    value: "hello@camillebuzuno.com",
    href: "mailto:hello@camillebuzuno.com",
  },
  {
    name: "Instagram",
    value: "@camillebuzuno",
    href: "https://www.instagram.com/camillebuzuno/",
  },
  { name: "Behance", value: "In preparation", href: null },
  { name: "LinkedIn", value: "In preparation", href: null },
];

export default function ContactPage() {
  return (
    <div className="relative flex min-h-screen flex-col text-fg">
      <SiteHeader />

      <main className="contact">
        <div className="contact-body">
          <p className="label-mono contact-eyebrow">Contact</p>

          {/* The oyster returns — a quiet, smaller signature echoing Home. */}
          <div className="contact-oyster">
            <OysterNav decorative />
          </div>

          <p className="contact-lede">
            Whether you&apos;re a gallery, curator, collector, brand, or simply
            want to say hello, I&apos;d love to hear from you.
          </p>

          <ul className="contact-list">
            {CHANNELS.map((c) => {
              const external = c.href?.startsWith("http");
              const inner = (
                <>
                  <span className="contact-name">{c.name}</span>
                  <span className="contact-value">{c.value}</span>
                </>
              );
              return (
                <li key={c.name} className="contact-item">
                  {c.href ? (
                    <a
                      href={c.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      className="contact-link"
                    >
                      {inner}
                    </a>
                  ) : (
                    <span className="contact-link is-soon">{inner}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <p className="contact-closing">
          Thank you for taking the time to explore my work.
        </p>
      </main>

      <footer className="contact-footer">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
          <span className="label-mono !text-[0.6rem]">© 2026 Camille Buzuno</span>
          <span className="label-mono !text-[0.6rem]">Artist Portfolio</span>
        </div>
      </footer>
    </div>
  );
}
