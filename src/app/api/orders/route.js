import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { sendOwnerNotification } from "@/lib/email";
import { supabase } from "@/lib/supabase";

async function decrementStock(items) {
  for (const item of items) {
    const { data: product } = await supabase.from("products").select("quantity").eq("id", item.id).single();
    if (product && product.quantity >= item.cartQty) {
      await supabase.from("products").update({ quantity: product.quantity - item.cartQty }).eq("id", item.id);
    }
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase.from("orders").select("*").order("id", { ascending: false });
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json({ error: "Impossibile recuperare ordini" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (body.stripeSessionId) {
      const { data: existing } = await supabase.from("orders").select("*").eq("stripeSessionId", body.stripeSessionId).single();
      if (existing) {
        return NextResponse.json(existing, { status: 200 });
      }
    }

    const { data, error } = await supabase.from("orders").insert({
      stripeSessionId: body.stripeSessionId || null,
      customerEmail: body.customerEmail || "",
      customerName: body.customerName || "",
      items: body.items,
      shipping: body.shipping || {},
      total: body.total || 0,
      status: "In elaborazione",
      tracking: "",
    }).select().single();

    if (error) throw error;

    await decrementStock(body.items);

    if (body.customerEmail) {
      sendOwnerNotification({
        orderId: data.id,
        customerEmail: body.customerEmail,
        items: body.items,
        total: body.total,
      });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Errore POST /api/orders:", error);
    return NextResponse.json({ error: "Impossibile creare ordine" }, { status: 500 });
  }
}

export async function PUT(req) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  try {
    const body = await req.json();

    const updates = {};
    if (body.status) updates.status = body.status;
    if (body.tracking !== undefined) updates.tracking = body.tracking;

    const { data, error } = await supabase.from("orders").update(updates).eq("id", body.id).select().single();
    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Errore PUT /api/orders:", error);
    return NextResponse.json({ error: "Impossibile aggiornare ordine" }, { status: 500 });
  }
}
