"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  subscribePurchase,
  getPurchaseSnapshot,
  closePurchase,
} from "../../lib/purchaseStore";
import { formatPrice } from "@/data/commerce";

type Status = "form" | "sending" | "done";

const INCLUDES = [
  "Certificate of Authenticity",
  "Signed by the artist",
  "Worldwide insured shipping",
  "Museum-quality protective packaging",
];

const genKey = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/* Shared purchase-request modal. Opened (with the selected artwork) from any
   "Buy Original" button via the purchase store. Gallery-quiet, request-based —
   it never charges: it submits an email request to the artist. */
export default function PurchaseModal() {
  const active = useSyncExternalStore(
    subscribePurchase,
    getPurchaseSnapshot,
    () => null
  );
  const [artwork, setArtwork] = useState(active);
  const [prevActive, setPrevActive] = useState(active);
  const [status, setStatus] = useState<Status>("form");
  const [error, setError] = useState<string | null>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  // One idempotency key per opened request; the server uses it to guarantee a
  // single email even if the submission is retried or double-fired.
  const idempotencyKeyRef = useRef<string>("");
  // Synchronous guard so two rapid submits can't both get past the async
  // status update ("one click = one email").
  const submittingRef = useRef(false);

  const open = active !== null;

  // Opening: load the artwork and reset the form (adjust state during render).
  if (active !== prevActive) {
    setPrevActive(active);
    if (active) {
      setArtwork(active);
      setStatus("form");
      setError(null);
      submittingRef.current = false;
      idempotencyKeyRef.current = genKey();
    }
  }

  const close = () => {
    if (status === "sending") return; // don't close mid-submit
    closePurchase();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 140);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!artwork) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    // Duplicate-submit guards: synchronous ref + status flag.
    if (submittingRef.current || status === "sending") return;
    submittingRef.current = true;
    setError(null);
    setStatus("sending");
    const fd = new FormData(form);
    const payload = {
      artworkId: artwork!.id,
      idempotencyKey: idempotencyKeyRef.current,
      fullName: String(fd.get("fullName") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      country: String(fd.get("country") || ""),
      city: String(fd.get("city") || ""),
      postalCode: String(fd.get("postalCode") || ""),
      street: String(fd.get("street") || ""),
      notes: String(fd.get("notes") || ""),
      agree: fd.get("agree") === "on",
      hp_check: String(fd.get("hp_check") || ""), // honeypot (must stay empty)
    };
    try {
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data?.error ||
            "Something went wrong while sending your request. Please try again or contact me directly."
        );
        setStatus("form");
        return;
      }
      setStatus("done");
    } catch {
      setError(
        "Something went wrong while sending your request. Please try again or contact me directly."
      );
      setStatus("form");
    } finally {
      submittingRef.current = false;
    }
  }

  const dims = `${artwork.widthCm} × ${artwork.heightCm} cm`;
  const priceLabel = formatPrice(artwork.price, artwork.currency);

  return (
    <div className={`iq${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="iq-scrim"
        aria-label="Close"
        tabIndex={open ? 0 : -1}
        onClick={close}
      />
      <div
        className="iq-panel iq-panel--purchase"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pm-title"
        onTransitionEnd={(e) => {
          if (!open && e.propertyName === "opacity") setArtwork(null);
        }}
      >
        <div className="iq-head">
          <p className="label-mono iq-eyebrow">Acquire Original</p>
          <button
            type="button"
            className="iq-close"
            aria-label="Close"
            onClick={close}
          >
            ✕
          </button>
        </div>

        {/* Artwork summary — filled in automatically from the selected work. */}
        <div className="iq-artwork">
          <span className="iq-artwork-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={artwork.thumbnail} alt={artwork.displayTitle} />
          </span>
          <div className="iq-artwork-meta">
            <h2 id="pm-title" className="iq-artwork-title">
              {artwork.displayTitle}
            </h2>
            <p className="iq-artwork-line">
              {artwork.year} · {artwork.displayedMedium}
            </p>
            <p className="iq-artwork-line">{dims}</p>
            <p className="iq-artwork-price">{priceLabel}</p>
            <p
              className="iq-artwork-status"
              data-status={artwork.status.toLowerCase()}
            >
              {artwork.status}
            </p>
            <p className="iq-artwork-ship">Worldwide shipping included</p>
          </div>
        </div>

        {status === "done" ? (
          <div className="iq-done">
            <p className="iq-done-text">
              Thank you for your purchase request.
              <br />
              <br />
              Your request has been successfully received.
              <br />
              <br />
              I will personally contact you within 24 hours to confirm
              availability, prepare your official invoice, and arrange shipping.
              <br />
              <br />
              You have not been charged yet.
            </p>
            <button type="button" className="iq-submit" onClick={close}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="iq-includes">
              <p className="iq-includes-title">Every original artwork includes</p>
              <ul>
                {INCLUDES.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>

            <form className="iq-form" onSubmit={onSubmit} noValidate={false}>
              {/* Honeypot — hidden from humans, catches bots. Named `hp_check`
                  (not "website") and flagged so browser autofill and password
                  managers leave it empty; otherwise real buyers get flagged as
                  spam and their request is silently dropped. */}
              <input
                type="text"
                name="hp_check"
                className="iq-hp"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                data-lpignore="true"
                data-1p-ignore="true"
                data-form-type="other"
              />

              <p className="iq-section">Customer information</p>
              <label className="iq-field iq-field--full">
                <span className="iq-label">Full name *</span>
                <input
                  ref={firstFieldRef}
                  name="fullName"
                  type="text"
                  required
                  autoComplete="name"
                  className="iq-input"
                />
              </label>
              <div className="iq-grid">
                <label className="iq-field">
                  <span className="iq-label">Email *</span>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="iq-input"
                  />
                </label>
                <label className="iq-field">
                  <span className="iq-label">Phone number (optional)</span>
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className="iq-input"
                  />
                </label>
              </div>

              <p className="iq-section">Shipping address</p>
              <div className="iq-grid">
                <label className="iq-field">
                  <span className="iq-label">Country *</span>
                  <input
                    name="country"
                    type="text"
                    required
                    autoComplete="country-name"
                    className="iq-input"
                  />
                </label>
                <label className="iq-field">
                  <span className="iq-label">City *</span>
                  <input
                    name="city"
                    type="text"
                    required
                    autoComplete="address-level2"
                    className="iq-input"
                  />
                </label>
                <label className="iq-field">
                  <span className="iq-label">Postal code *</span>
                  <input
                    name="postalCode"
                    type="text"
                    required
                    autoComplete="postal-code"
                    className="iq-input"
                  />
                </label>
                <label className="iq-field">
                  <span className="iq-label">Street address *</span>
                  <input
                    name="street"
                    type="text"
                    required
                    autoComplete="address-line1"
                    className="iq-input"
                  />
                </label>
              </div>

              <label className="iq-field iq-field--full">
                <span className="iq-label">Additional notes (optional)</span>
                <textarea name="notes" rows={3} className="iq-input iq-textarea" />
              </label>

              <label className="iq-agree">
                <input
                  type="checkbox"
                  name="agree"
                  required
                  className="iq-agree-box"
                />
                <span>
                  I agree to the Terms &amp; Privacy Policy and understand that
                  this form submits a purchase request. Payment will be arranged
                  separately after the artwork’s availability is confirmed.
                </span>
              </label>

              {error ? (
                <p className="iq-error" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="iq-actions">
                <button
                  type="submit"
                  className="iq-submit"
                  disabled={status === "sending"}
                >
                  {status === "sending"
                    ? "Sending…"
                    : "Submit Purchase Request"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
