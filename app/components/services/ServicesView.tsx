"use client";

import { useState } from "react";
import { CONSULTATION, CUSTOM_SERVICES } from "@/data/services";
import InquiryModal from "./InquiryModal";

export default function ServicesView() {
  const [modalOpen, setModalOpen] = useState(false);
  const [service, setService] = useState<string | undefined>(undefined);
  const [booking, setBooking] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);

  const openInquiry = (s?: string) => {
    setService(s);
    setModalOpen(true);
  };

  async function book() {
    setBookError(null);
    setBooking(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: CONSULTATION.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) {
        setBookError(data?.error || "Booking isn’t available right now.");
        setBooking(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setBookError("Could not start checkout. Please try again.");
      setBooking(false);
    }
  }

  return (
    <main className="svc">
      <header className="svc-head">
        <p className="label-mono">Work With Me</p>
        <h1 className="svc-title">Creative direction, made personal.</h1>
        <p className="svc-lede">
          From a single conversation to a complete visual identity — a few clear
          ways to work together. Start with a consultation, or request a bespoke
          package for larger projects.
        </p>
      </header>

      {/* Fixed-price consultation — Stripe Checkout. */}
      <section className="svc-section">
        <div className="svc-consult">
          <div className="svc-consult-text">
            <p className="label-mono svc-kicker">Start Here</p>
            <h2 className="svc-consult-name">{CONSULTATION.name}</h2>
            <p className="svc-summary">{CONSULTATION.summary}</p>
          </div>
          <div className="svc-consult-action">
            <button
              type="button"
              className="svc-cta svc-cta--primary"
              onClick={book}
              disabled={booking}
            >
              {booking ? "Redirecting…" : CONSULTATION.cta}
            </button>
            <p className="svc-note">Secure checkout via Stripe.</p>
            {bookError ? (
              <p className="svc-error" role="alert">
                {bookError}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Custom creative services — inquiry form, never "Buy now". */}
      <section className="svc-section">
        <h2 className="svc-section-title">Custom Creative Services</h2>
        <div className="svc-grid">
          {CUSTOM_SERVICES.map((s) => (
            <article className="svc-card" key={s.id}>
              <h3 className="svc-card-name">{s.name}</h3>
              <p className="svc-summary">{s.summary}</p>
              <button
                type="button"
                className="svc-cta svc-cta--card"
                onClick={() => openInquiry(s.name)}
              >
                {s.cta}
                <span aria-hidden="true" className="svc-cta-arrow">
                  →
                </span>
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* General CTA. */}
      <section className="svc-final">
        <h2 className="svc-final-title">Have something else in mind?</h2>
        <p className="svc-final-text">
          Tell me about your project and I’ll prepare a custom proposal.
        </p>
        <button
          type="button"
          className="svc-cta svc-cta--primary"
          onClick={() => openInquiry("Something else")}
        >
          Start a Project
        </button>
      </section>

      <InquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialService={service}
      />
    </main>
  );
}
