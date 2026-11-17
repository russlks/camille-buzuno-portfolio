import type { Metadata } from "next";
import LegalPage, { LegalSection, SELLER } from "../components/LegalPage";
import { CHANNELS } from "@/data/contact";
import { CONSULTATION } from "@/data/services";

export const metadata: Metadata = {
  title: "Terms — Camille Buzuno",
  description: "Terms for booking a consultation and buying original artworks from Camille Buzuno.",
  alternates: { canonical: "/terms" },
};

const EMAIL = CHANNELS.find((c) => c.name === "Email")?.value ?? "";

export default function TermsPage() {
  return (
    <LegalPage title="Terms" updated="17 November 2026">
      <LegalSection title="Seller">
        <p>
          {SELLER.name}, {SELLER.form}, trading as the artist {SELLER.brand}.
          IČO {SELLER.ico}. Registered address: {SELLER.address}. Contact:{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
      </LegalSection>

      <LegalSection title="Creative Consultation">
        <p>
          {CONSULTATION.name} is a one-on-one session for{" "}
          {CONSULTATION.priceLabel}, paid in advance through Stripe. After
          payment I contact you by email to agree the date and time.
        </p>
        <p>
          If you are a consumer, you may withdraw from this contract within 14
          days of payment without giving a reason, and you receive a full
          refund. If, at your express request, the consultation takes place
          within those 14 days, you lose the right to withdraw once it has been
          fully provided.
        </p>
      </LegalSection>

      <LegalSection title="Original artworks">
        <p>
          The “Buy” form on an artwork sends a purchase request — it is not yet
          a binding order. I confirm availability, the final price and shipping
          by email; the contract is concluded when you accept that confirmation
          and pay. Prices shown include worldwide insured shipping unless stated
          otherwise.
        </p>
        <p>
          If you are a consumer, you may withdraw from the purchase within 14
          days of receiving the artwork without giving a reason. Tell me by
          email, return the work undamaged in its original packaging within 14
          days, and I refund the price including the original delivery cost
          within 14 days of receiving it back. You pay the cost of returning
          the work.
        </p>
      </LegalSection>

      <LegalSection title="Complaints">
        <p>
          You have the statutory rights for defective performance under the
          Czech Civil Code. Write to <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and
          I will respond within 30 days.
        </p>
      </LegalSection>

      <LegalSection title="Disputes">
        <p>
          These terms are governed by Czech law. Consumers may use out-of-court
          dispute resolution at the Czech Trade Inspection Authority (Česká
          obchodní inspekce,{" "}
          <a href="https://adr.coi.cz" rel="noopener">adr.coi.cz</a>).
        </p>
      </LegalSection>
    </LegalPage>
  );
}
