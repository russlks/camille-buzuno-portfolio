"use client";

import { useEffect, useRef, useState } from "react";
import { BUDGET_OPTIONS, INQUIRY_SERVICE_OPTIONS } from "@/data/services";

type Status = "form" | "sending" | "done";

export default function InquiryModal({
  open,
  onClose,
  initialService,
}: {
  open: boolean;
  onClose: () => void;
  initialService?: string;
}) {
  const [status, setStatus] = useState<Status>("form");
  const [error, setError] = useState<string | null>(null);
  const [prevOpen, setPrevOpen] = useState(open);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Reset the form to a fresh state each time the modal opens (adjusting state
  // during render — the React-recommended pattern, not an effect).
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setStatus("form");
      setError(null);
    }
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 120);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Something went wrong. Please try again.");
        setStatus("form");
        return;
      }
      setStatus("done");
    } catch {
      setError("Could not send your request. Please check your connection.");
      setStatus("form");
    }
  }

  return (
    <div
      className={`iq${open ? " is-open" : ""}`}
      aria-hidden={open ? undefined : true}
      inert={open ? undefined : true}
    >
      <button
        type="button"
        className="iq-scrim"
        aria-label="Close"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <div
        className="iq-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="iq-title"
      >
        <div className="iq-head">
          <p className="label-mono iq-eyebrow">Project Inquiry</p>
          <button
            type="button"
            className="iq-close"
            aria-label="Close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {status === "done" ? (
          <div className="iq-done">
            <p className="iq-done-text">
              Thank you. Your project request has been received. I will review it
              and reply within two business days.
            </p>
            <button type="button" className="iq-submit" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form className="iq-form" onSubmit={onSubmit}>
            <h2 id="iq-title" className="iq-title">
              Tell me about your project
            </h2>

            <div className="iq-grid">
              <label className="iq-field">
                <span className="iq-label">Full name</span>
                <input
                  ref={firstFieldRef}
                  name="fullName"
                  type="text"
                  required
                  autoComplete="name"
                  className="iq-input"
                />
              </label>
              <label className="iq-field">
                <span className="iq-label">Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="iq-input"
                />
              </label>
              <label className="iq-field">
                <span className="iq-label">Company or brand</span>
                <input
                  name="company"
                  type="text"
                  autoComplete="organization"
                  className="iq-input"
                />
              </label>
              <label className="iq-field">
                <span className="iq-label">Selected service</span>
                <select
                  name="service"
                  defaultValue={initialService ?? INQUIRY_SERVICE_OPTIONS[0]}
                  className="iq-input iq-select"
                  key={initialService ?? "default"}
                >
                  {INQUIRY_SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="iq-field">
                <span className="iq-label">Desired launch date</span>
                <input
                  name="launchDate"
                  type="text"
                  placeholder="e.g. Autumn 2026, or a specific date"
                  className="iq-input"
                />
              </label>
              <label className="iq-field">
                <span className="iq-label">Approximate budget</span>
                <select
                  name="budget"
                  defaultValue=""
                  className="iq-input iq-select"
                >
                  <option value="" disabled>
                    Select a range
                  </option>
                  {BUDGET_OPTIONS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="iq-field iq-field--full">
              <span className="iq-label">Project description</span>
              <textarea
                name="description"
                required
                rows={4}
                className="iq-input iq-textarea"
                placeholder="What are you making, and what do you need?"
              />
            </label>
            <label className="iq-field iq-field--full">
              <span className="iq-label">Reference links</span>
              <input
                name="references"
                type="text"
                className="iq-input"
                placeholder="Links to references, moodboards or your work"
              />
            </label>
            <label className="iq-field iq-field--full">
              <span className="iq-label">Additional details</span>
              <textarea
                name="additional"
                rows={3}
                className="iq-input iq-textarea"
              />
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
                {status === "sending" ? "Sending…" : "Send Request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
