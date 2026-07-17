import { ARTWORKS } from "@/data/artworks";
import { formatPrice } from "@/data/commerce";

/* Purchase-request endpoint. Request-based (no charge): validates the input,
   resolves the artwork's OFFICIAL title/price on the server (never trusting the
   browser), then emails the request to the artist and a confirmation to the
   customer via Resend. Secrets stay server-side. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isEmail = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string
  );

async function sendEmail(
  label: string,
  payload: {
    apiKey: string;
    from: string;
    to: string;
    replyTo?: string;
    subject: string;
    text: string;
    html: string;
  }
) {
  const requestBody = {
    from: payload.from,
    to: [payload.to],
    reply_to: payload.replyTo,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  };
  console.log(`[purchase] calling Resend (${label})`, {
    from: payload.from,
    to: payload.to,
    replyTo: payload.replyTo,
    subject: payload.subject,
  });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${payload.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  // Always read the body so we can log Resend's exact response / error.
  const raw = await res.text();
  let parsed: unknown = raw;
  try {
    parsed = raw ? JSON.parse(raw) : {};
  } catch {
    /* keep raw string */
  }

  if (!res.ok) {
    console.error(`[purchase] Resend rejected the ${label} email`, {
      status: res.status,
      response: parsed,
    });
    throw new Error(`Resend ${label} email failed (HTTP ${res.status})`);
  }

  const id =
    parsed && typeof parsed === "object" && "id" in parsed
      ? (parsed as { id?: string }).id
      : undefined;
  console.log(`[purchase] Resend accepted the ${label} email`, {
    status: res.status,
    id,
    response: parsed,
  });
  return parsed;
}

export async function POST(req: Request) {
  console.log("[purchase] request received");
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot — a bot filled the hidden field. Silently accept and drop.
  // The field is named `hp_check` (not "website"/"url"/etc.) so browser
  // autofill and password managers won't populate it and get real buyers
  // wrongly flagged as spam.
  if (typeof body.hp_check === "string" && body.hp_check.trim() !== "") {
    console.warn(
      "[purchase] honeypot triggered — dropping submission without sending",
      { hp_check: body.hp_check }
    );
    return Response.json({ ok: true });
  }

  const s = (k: string) =>
    typeof body[k] === "string" ? (body[k] as string).trim() : "";
  const firstName = s("firstName");
  const lastName = s("lastName");
  const email = s("email");
  const country = s("country");
  const city = s("city");
  const postalCode = s("postalCode");
  const street = s("street");
  const phone = s("phone");
  const apartment = s("apartment");
  const notes = s("notes");
  const agree = body.agree === true;
  const artworkId = s("artworkId");

  if (
    !firstName ||
    !lastName ||
    !email ||
    !country ||
    !city ||
    !postalCode ||
    !street
  ) {
    return Response.json(
      { error: "Please complete all required fields." },
      { status: 400 }
    );
  }
  if (!isEmail(email)) {
    return Response.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (!agree) {
    return Response.json(
      { error: "Please agree to the terms to submit your request." },
      { status: 400 }
    );
  }

  // Server is the source of truth for the artwork's title and price.
  const art = ARTWORKS.find((a) => a.id === artworkId);
  if (!art) {
    return Response.json(
      { error: "That artwork could not be found." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.PURCHASE_EMAIL_TO;
  const from = process.env.PURCHASE_EMAIL_FROM;
  // Log presence only (never the secret values) so misconfiguration is visible
  // in the Vercel Runtime Logs.
  console.log("[purchase] email env presence", {
    RESEND_API_KEY: Boolean(apiKey),
    PURCHASE_EMAIL_TO: Boolean(to),
    PURCHASE_EMAIL_FROM: Boolean(from),
  });
  if (!apiKey || !to || !from) {
    console.error(
      "[purchase] email delivery not configured (set RESEND_API_KEY, PURCHASE_EMAIL_TO, PURCHASE_EMAIL_FROM)."
    );
    return Response.json(
      {
        error:
          "Something went wrong while sending your request. Please try again or contact me directly.",
      },
      { status: 500 }
    );
  }

  const priceLabel = formatPrice(art.price, art.currency);
  const dims = `${art.widthCm} × ${art.heightCm} cm`;
  const when =
    new Date().toLocaleString("en-GB", {
      timeZone: "Europe/Prague",
      dateStyle: "full",
      timeStyle: "short",
    }) + " (Europe/Prague)";
  const source =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "camille-buzuno-portfolio.vercel.app";
  const fullName = `${firstName} ${lastName}`;

  // ---- Email to the artist ----
  const ownerText = [
    "NEW ARTWORK PURCHASE REQUEST",
    "",
    "Artwork details:",
    `- Title: ${art.displayTitle}`,
    `- Year: ${art.year}`,
    `- Medium: ${art.displayedMedium}`,
    `- Dimensions: ${dims}`,
    `- Price: ${priceLabel}`,
    `- Availability: ${art.status}`,
    "",
    "Customer details:",
    `- First name: ${firstName}`,
    `- Last name: ${lastName}`,
    `- Email: ${email}`,
    ...(phone ? [`- Phone: ${phone}`] : []),
    "",
    "Shipping address:",
    `- Country: ${country}`,
    `- City: ${city}`,
    `- Postal code: ${postalCode}`,
    `- Street address: ${street}`,
    ...(apartment ? [`- Apartment / Suite: ${apartment}`] : []),
    "",
    "Additional notes:",
    notes || "No additional notes",
    "",
    `Submitted: ${when}`,
    `Source: ${source}`,
    "",
    "Note: The customer has NOT been charged. This is a purchase request only.",
  ].join("\n");

  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 16px 4px 0;color:#55686a;white-space:nowrap;vertical-align:top">${esc(
      label
    )}</td><td style="padding:4px 0;color:#0c0e0f">${esc(value)}</td></tr>`;
  const ownerHtml = `<div style="font-family:Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;color:#0c0e0f">
    <p style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#0d8f88;margin:0 0 8px">New Artwork Purchase Request</p>
    <h2 style="font-weight:400;font-size:22px;margin:0 0 20px">${esc(art.displayTitle)}</h2>
    <h3 style="font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#93a2a2;border-bottom:1px solid #eee;padding-bottom:6px">Artwork details</h3>
    <table style="font-size:14px;line-height:1.5;border-collapse:collapse">
      ${row("Title", art.displayTitle)}${row("Year", String(art.year))}${row("Medium", art.displayedMedium)}${row("Dimensions", dims)}${row("Price", priceLabel)}${row("Availability", art.status)}
    </table>
    <h3 style="font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#93a2a2;border-bottom:1px solid #eee;padding-bottom:6px;margin-top:22px">Customer</h3>
    <table style="font-size:14px;line-height:1.5;border-collapse:collapse">
      ${row("Name", fullName)}${row("Email", email)}${phone ? row("Phone", phone) : ""}
    </table>
    <h3 style="font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#93a2a2;border-bottom:1px solid #eee;padding-bottom:6px;margin-top:22px">Shipping address</h3>
    <table style="font-size:14px;line-height:1.5;border-collapse:collapse">
      ${row("Country", country)}${row("City", city)}${row("Postal code", postalCode)}${row("Street", street)}${apartment ? row("Apartment / Suite", apartment) : ""}
    </table>
    <h3 style="font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#93a2a2;border-bottom:1px solid #eee;padding-bottom:6px;margin-top:22px">Additional notes</h3>
    <p style="font-size:14px;line-height:1.6;white-space:pre-wrap;margin:8px 0">${esc(notes || "No additional notes")}</p>
    <p style="font-size:12px;color:#93a2a2;margin-top:22px">Submitted: ${esc(when)}<br/>Source: ${esc(source)}</p>
    <p style="font-size:13px;color:#0c0e0f;background:#f3f7f7;border-left:2px solid #0d8f88;padding:10px 14px;margin-top:18px">The customer has <strong>not</strong> been charged. This is a purchase request only.</p>
  </div>`;

  // ---- Confirmation to the customer ----
  const custText = [
    `Thank you for your interest in “${art.displayTitle}”.`,
    "",
    "Your purchase request has been successfully received.",
    "",
    "I will personally contact you within 24 hours to confirm the artwork’s availability, prepare the official invoice, and arrange shipping.",
    "",
    "You have not been charged yet.",
    "",
    "Purchase summary:",
    `- Artwork: ${art.displayTitle}`,
    `- Price: ${priceLabel}`,
    "- Worldwide shipping included",
    "",
    "Camille Buzuno",
  ].join("\n");
  const custHtml = `<div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0c0e0f;line-height:1.6">
    <p style="font-size:16px;margin:0 0 16px">Thank you for your interest in <strong>“${esc(art.displayTitle)}”</strong>.</p>
    <p style="margin:0 0 16px">Your purchase request has been successfully received.</p>
    <p style="margin:0 0 16px">I will personally contact you within 24 hours to confirm the artwork’s availability, prepare the official invoice, and arrange shipping.</p>
    <p style="margin:0 0 20px"><strong>You have not been charged yet.</strong></p>
    <div style="border-top:1px solid #eee;border-bottom:1px solid #eee;padding:16px 0;margin:20px 0">
      <p style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#0d8f88;margin:0 0 10px">Purchase summary</p>
      <table style="font-size:14px;border-collapse:collapse">
        ${row("Artwork", art.displayTitle)}${row("Price", priceLabel)}<tr><td style="padding:4px 16px 4px 0;color:#55686a">Shipping</td><td style="padding:4px 0;color:#0c0e0f">Worldwide shipping included</td></tr>
      </table>
    </div>
    <p style="margin:20px 0 0">Camille Buzuno</p>
  </div>`;

  try {
    // The artist's copy is required; if it fails, report an error (never 200).
    await sendEmail("artist", {
      apiKey,
      from,
      to,
      replyTo: email,
      subject: `New Artwork Purchase Request — ${art.displayTitle}`,
      text: ownerText,
      html: ownerHtml,
    });
  } catch (e) {
    console.error("[purchase] owner email failed — returning 500:", e);
    return Response.json(
      {
        error:
          "Something went wrong while sending your request. Please try again or contact me directly.",
      },
      { status: 500 }
    );
  }

  // The customer confirmation is best-effort — the request was already received.
  try {
    await sendEmail("customer", {
      apiKey,
      from,
      to: email,
      replyTo: to,
      subject: `Your purchase request — ${art.displayTitle}`,
      text: custText,
      html: custHtml,
    });
  } catch (e) {
    console.error("[purchase] customer confirmation email failed:", e);
  }

  return Response.json({ ok: true });
}
