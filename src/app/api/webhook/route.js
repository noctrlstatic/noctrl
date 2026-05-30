import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";
import { sendCustomerConfirmation, sendOwnerNotification } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function decrementStock(items) {
  for (const item of items) {
    const { data: product } = await supabase.from("products").select("quantity").eq("id", item.id).single();
    if (product && product.quantity >= item.cartQty) {
      await supabase.from("products").update({ quantity: product.quantity - item.cartQty }).eq("id", item.id);
    }
  }
}

export async function POST(req) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Firma mancante" }, { status: 400 });
  }

  let body;
  try {
    body = await req.text();
  } catch {
    return NextResponse.json({ error: "Impossibile leggere il body" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Firma non valida: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    if (!session.metadata?.items) {
      console.warn("⚠️ Webhook: nessun metadata.items nella sessione", session.id);
      return NextResponse.json({ received: true });
    }

    const items = JSON.parse(session.metadata.items);

    const { data: existing } = await supabase.from("orders").select("id").eq("stripeSessionId", session.id).single();
    if (existing) {
      console.log(`⏭️ Ordine per sessione ${session.id} già esistente, skippato`);
      return NextResponse.json({ received: true });
    }

    const customerEmail = session.customer_details?.email || "";
    const customerName = session.customer_details?.name || "";

    const { data: order, error } = await supabase.from("orders").insert({
      stripeSessionId: session.id,
      customerEmail,
      customerName,
      items,
      shipping: {
        name: session.shipping_details?.name || "",
        address: session.shipping_details?.address?.line1 || "",
        city: session.shipping_details?.address?.city || "",
        zip: session.shipping_details?.address?.postal_code || "",
        phone: session.customer_details?.phone || "",
      },
      total: session.amount_total ? session.amount_total / 100 : 0,
      status: "In elaborazione",
      tracking: "",
    }).select().single();

    if (error) throw error;

    await decrementStock(items);

    console.log(`✅ Webhook: ordine #${order.id} salvato (sessione ${session.id})`);

    if (customerEmail) {
      await sendCustomerConfirmation({
        email: customerEmail,
        name: customerName,
        orderId: order.id,
        items,
        total: order.total,
      });
      await sendOwnerNotification({
        orderId: order.id,
        customerEmail,
        items,
        total: order.total,
      });
    }
  }

  return NextResponse.json({ received: true });
}
