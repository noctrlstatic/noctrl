import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const body = await req.json();
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrello vuoto" }, { status: 400 });
    }

    for (const item of items) {
      const { data: product } = await supabase.from("products").select("name, quantity").eq("id", item.id).single();
      if (!product) {
        return NextResponse.json({ error: `Prodotto ${item.name} non trovato` }, { status: 400 });
      }
      if (product.quantity < item.cartQty) {
        return NextResponse.json({ error: `Stock insufficiente per ${item.name}` }, { status: 400 });
      }
    }

    const baseUrl = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || `https://${process.env.VERCEL_URL}` || "http://localhost:3000";

    const line_items = items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          images: item.image ? [new URL(item.image, baseUrl).href] : [],
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.cartQty,
    }));

    const itemsMeta = items.map((i) => ({
      id: i.id, name: i.name, cartQty: i.cartQty, price: i.price, image: i.image || "",
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      allow_promotion_codes: true,
      metadata: { items: JSON.stringify(itemsMeta) },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Errore checkout:", error);
    return NextResponse.json({ error: "Errore durante il checkout" }, { status: 500 });
  }
}
