import type { Metadata } from "next";
import LegalPage, { LegalSection, SELLER } from "../components/LegalPage";
import { CHANNELS } from "@/data/contact";

export const metadata: Metadata = {
  title: "Privacy Policy — Camille Buzuno",
  description: "How Camille Buzuno handles personal data sent through camillebuzuno.com.",
  alternates: { canonical: "/privacy" },
};

const EMAIL = CHANNELS.find((c) => c.name === "Email")?.value ?? "";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="17 November 2026">
      <LegalSection title="Who we are">
        <p>
          The controller of your personal data is {SELLER.name}, a{" "}
          {SELLER.form} operating as the artist {SELLER.brand}, IČO {SELLER.ico},
          registered address {SELLER.address} (“I”, “me”). For any question
          about your data, write to <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
      </LegalSection>

      <LegalSection title="What I collect and why">
        <p>I only collect what you send me through this website:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Project inquiries</strong> (Commercial Production): name,
            email, company or brand, service, budget, launch date, reference
            links and project details — to reply to you and, if you ask, prepare
            a proposal.
          </li>
          <li>
            <strong>Artwork purchase requests</strong>: name, email, phone,
            delivery address and notes — to confirm availability, arrange
            payment and ship the work.
          </li>
          <li>
            <strong>Consultation booking</strong>: payment is handled by Stripe
            on its own checkout page. I receive your name, email and the payment
            confirmation, never your card details.
          </li>
        </ul>
        <p>
          The legal basis is taking steps at your request before entering into a
          contract and performing that contract (Art. 6(1)(b) GDPR), and
          meeting my accounting and tax obligations (Art. 6(1)(c) GDPR). I do
          not use your details for newsletters or advertising, and I do not
          sell them.
        </p>
      </LegalSection>

      <LegalSection title="Who processes it for me">
        <ul className="list-disc space-y-1 pl-5">
          <li>Vercel Inc. — hosts this website.</li>
          <li>Resend — delivers form submissions to my inbox by email.</li>
          <li>
            Stripe — processes consultation payments under its own privacy
            policy.
          </li>
        </ul>
        <p>
          These providers may process data outside the EU under the European
          Commission’s standard contractual clauses or an adequacy decision.
        </p>
      </LegalSection>

      <LegalSection title="How long I keep it">
        <p>
          Inquiries that do not lead to a project are kept for 24 months after
          our last contact. Orders, invoices and payment records are kept as long
          as Czech accounting and tax law requires.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          This website does not use cookies, analytics or advertising trackers.
          Your browser only stores your light/dark theme choice locally on your
          device; it is never sent to me. Stripe’s checkout page may set its own
          cookies needed for secure payment.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          You can ask me for access to your data, its correction or deletion,
          restriction of processing, data portability, or object to processing —
          just write to <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. You also have
          the right to lodge a complaint with the Czech Office for Personal Data
          Protection (Úřad pro ochranu osobních údajů,{" "}
          <a href="https://uoou.gov.cz" rel="noopener">uoou.gov.cz</a>).
        </p>
      </LegalSection>
    </LegalPage>
  );
}
