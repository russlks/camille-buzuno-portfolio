import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";

export const metadata: Metadata = {
  title: "Payment not completed — Camille Buzuno",
};

export default function CancelledPage() {
  return (
    <div className="relative min-h-screen text-fg">
      <SiteHeader />
      <main className="svc-status">
        <div className="svc-status-inner">
          <h1 className="svc-status-title">Payment was not completed.</h1>
          <p className="svc-status-text">
            No charge was made. You can return to the services page and book a
            consultation whenever you’re ready.
          </p>
          <Link href="/commercial" className="svc-cta svc-cta--primary">
            Return to Services
          </Link>
        </div>
      </main>
    </div>
  );
}
