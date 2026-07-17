import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";

export const metadata: Metadata = {
  title: "Consultation confirmed — Camille Buzuno",
};

// Verify the payment with Stripe server-side so we never show a confirmation
// for an unpaid or spoofed session.
async function isPaid(sessionId?: string): Promise<boolean> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !sessionId) return false;
  try {
    const res = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      { headers: { Authorization: `Bearer ${key}` }, cache: "no-store" }
    );
    if (!res.ok) return false;
    const s = await res.json();
    return s?.payment_status === "paid" || s?.status === "complete";
  } catch {
    return false;
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const paid = await isPaid(session_id);

  return (
    <div className="relative min-h-screen text-fg">
      <SiteHeader />
      <main className="svc-status">
        {paid ? (
          <div className="svc-status-inner">
            <span className="svc-status-mark" aria-hidden="true">
              ✓
            </span>
            <h1 className="svc-status-title">Your consultation is confirmed.</h1>
            <p className="svc-status-text">
              Thank you for booking a creative consultation with Camille Buzuno.
              You will receive an email with the next steps and scheduling
              information.
            </p>
            <Link href="/" className="svc-cta svc-cta--primary">
              Return to Website
            </Link>
          </div>
        ) : (
          <div className="svc-status-inner">
            <h1 className="svc-status-title">We couldn’t confirm your booking.</h1>
            <p className="svc-status-text">
              If you completed payment, your confirmation email is on its way.
              Otherwise you can return to the services page and try again.
            </p>
            <Link href="/commercial" className="svc-cta svc-cta--primary">
              Return to Services
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
