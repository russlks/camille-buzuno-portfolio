import { CONSULTATION } from "@/data/services";

/* Creates a Stripe Checkout Session on the server. The secret key never leaves
   the server; the client only ever receives the hosted-checkout URL. If Stripe
   is not configured, this returns an error — it never simulates a payment. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return Response.json(
      { error: "Payments aren’t available right now. Please try again later." },
      { status: 503 }
    );
  }

  // Only the fixed-price consultation goes through Checkout.
  const svc = CONSULTATION;
  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    new URL(req.url).origin;

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set(
    "success_url",
    `${origin}/commercial/success?session_id={CHECKOUT_SESSION_ID}`
  );
  params.set("cancel_url", `${origin}/commercial/cancelled`);
  params.set("billing_address_collection", "auto");
  params.set("submit_type", "book");
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", svc.currency ?? "eur");
  params.set(
    "line_items[0][price_data][unit_amount]",
    String(svc.amount ?? 0)
  );
  params.set("line_items[0][price_data][product_data][name]", svc.name);
  params.set(
    "line_items[0][price_data][product_data][description]",
    svc.summary
  );
  params.set("metadata[service]", svc.id);

  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const data = await res.json();
    if (!res.ok || !data?.url) {
      console.error("Stripe checkout error:", data?.error?.message ?? data);
      return Response.json(
        { error: "Could not start checkout. Please try again." },
        { status: 502 }
      );
    }
    return Response.json({ url: data.url });
  } catch (e) {
    console.error("Stripe checkout request failed:", e);
    return Response.json(
      { error: "Could not reach the payment provider." },
      { status: 502 }
    );
  }
}
