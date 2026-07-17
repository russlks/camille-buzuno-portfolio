/* Receives a project inquiry from the "Request This Package" / "Start a
   Project" form. Validates, then emails it to Camille via Resend when
   configured (RESEND_API_KEY + INQUIRY_TO_EMAIL). No third-party keys are ever
   exposed to the client. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isEmail = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);

export async function POST(req: Request) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const fullName = (body.fullName ?? "").trim();
  const email = (body.email ?? "").trim();
  const description = (body.description ?? "").trim();

  if (!fullName || !email || !description) {
    return Response.json(
      { error: "Please add your name, email and a short project description." },
      { status: 400 }
    );
  }
  if (!isEmail(email)) {
    return Response.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  const rows: [string, string | undefined][] = [
    ["Name", fullName],
    ["Email", email],
    ["Company / Brand", body.company?.trim()],
    ["Service", body.service?.trim()],
    ["Budget", body.budget?.trim()],
    ["Desired launch date", body.launchDate?.trim()],
    ["Reference links", body.references?.trim()],
  ];
  const text = [
    ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
    "",
    "Project description:",
    description,
    body.additional?.trim() ? `\nAdditional details:\n${body.additional.trim()}` : "",
  ]
    .join("\n")
    .trim();

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL;
  const from = process.env.INQUIRY_FROM_EMAIL;

  if (apiKey && to && from) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: email,
          subject: `New project request — ${body.service?.trim() || "General"} — ${fullName}`,
          text,
        }),
      });
      if (!r.ok) {
        console.error("Inquiry email failed:", await r.text());
        return Response.json(
          { error: "Something went wrong sending your request. Please email me directly." },
          { status: 502 }
        );
      }
    } catch (e) {
      console.error("Inquiry email request failed:", e);
      return Response.json(
        { error: "Could not send your request right now. Please email me directly." },
        { status: 502 }
      );
    }
  } else {
    // Email delivery isn't configured yet — log the submission so it isn't lost
    // and set RESEND_API_KEY / INQUIRY_TO_EMAIL / INQUIRY_FROM_EMAIL to receive.
    console.warn(
      "[inquiry] email delivery not configured; received submission:\n" + text
    );
  }

  return Response.json({ ok: true });
}
