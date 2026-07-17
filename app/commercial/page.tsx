import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import ServicesView from "../components/services/ServicesView";

export const metadata: Metadata = {
  title: "Work With Me — Camille Buzuno",
  description:
    "Creative direction, campaign concept, visual identity and AI creative production — plus fixed-price creative consultations with Camille Buzuno.",
};

export default function CommercialPage() {
  return (
    <div className="relative min-h-screen text-fg">
      <SiteHeader />
      <ServicesView />
    </div>
  );
}
