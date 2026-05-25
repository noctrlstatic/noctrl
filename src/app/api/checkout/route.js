import { NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(req) {
  try {
    const stripe = getStripe();
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrello vuoto" }, { status: 400 });
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.cartQty,
    }));

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}?success=true`,
      cancel_url: `${origin}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Errore checkout:", error);
    return NextResponse.json({ error: "Errore durante il checkout" }, { status: 500 });
  }
}
