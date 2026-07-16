import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import ShellAbout from "../components/about/ShellAbout";

export const metadata: Metadata = {
  title: "About — Camille Buzuno",
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen text-fg">
      <SiteHeader />
      <ShellAbout />
    </div>
  );
}
