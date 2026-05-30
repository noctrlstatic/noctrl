import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { supabase } from "@/lib/supabase";

function sanitize(str) {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").trim();
}

function sanitizeImages(images) {
  if (!Array.isArray(images)) return [];
  return images.filter(img => typeof img === "string" && (img.startsWith("/") || img.startsWith("http")));
}

export async function PUT(req, { params }) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  try {
    const { id } = await params;
    const targetId = parseInt(id);
    const body = await req.json();

    const { data: existing } = await supabase.from("products").select("*").eq("id", targetId).single();
    if (!existing) {
      return NextResponse.json({ error: "Prodotto non trovato" }, { status: 404 });
    }

    let newImages = existing.images || [existing.image];
    if (Array.isArray(body.images) && body.images.length > 0) {
      newImages = body.images;
    } else if (body.image) {
      newImages = [body.image];
    }

    const updates = {};
    if (body.name !== undefined) updates.name = sanitize(body.name);
    if (body.price !== undefined) updates.price = parseFloat(body.price);
    if (body.oldPrice !== undefined) updates.oldPrice = body.oldPrice ? parseFloat(body.oldPrice) : null;
    if (body.category !== undefined) updates.category = sanitize(body.category);
    if (body.image !== undefined || body.images !== undefined) updates.image = newImages[0];
    if (body.images !== undefined) updates.images = sanitizeImages(newImages);
    if (body.isNew !== undefined) updates.isNew = !!body.isNew;
    if (body.quantity !== undefined) updates.quantity = Math.max(0, parseInt(body.quantity));

    const { data, error } = await supabase.from("products").update(updates).eq("id", targetId).select().single();
    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Errore PUT /api/products/[id]:", error);
    return NextResponse.json({ error: "Impossibile aggiornare il prodotto" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  try {
    const { id } = await params;
    const targetId = parseInt(id);

    const { error } = await supabase.from("products").delete().eq("id", targetId);
    if (error) throw error;

    return NextResponse.json({ message: "Prodotto eliminato con successo" });
  } catch (error) {
    console.error("Errore DELETE /api/products/[id]:", error);
    return NextResponse.json({ error: "Impossibile eliminare il prodotto" }, { status: 500 });
  }
}
