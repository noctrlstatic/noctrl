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

export async function GET() {
  try {
    const { data, error } = await supabase.from("products").select("*").order("id", { ascending: true });
    if (error) throw error;

    const products = (data || []).map(p => ({
      ...p,
      isNew: p.isNew || false,
      oldPrice: p.oldPrice || null,
      image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : p.image,
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error("Errore GET /api/products:", error);
    return NextResponse.json({ error: "Impossibile recuperare i prodotti" }, { status: 500 });
  }
}

export async function POST(req) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  try {
    const body = await req.json();

    const imagesArray = Array.isArray(body.images) && body.images.length > 0
      ? body.images
      : (body.image ? [body.image] : ["/uploads/foto/essential-graphic-tee-1.jpeg"]);

    const { data, error } = await supabase.from("products").insert({
      name: sanitize(body.name) || "Nuovo Prodotto",
      price: parseFloat(body.price) || 0,
      oldPrice: body.oldPrice ? parseFloat(body.oldPrice) : null,
      category: sanitize(body.category) || "Generico",
      image: imagesArray[0],
      images: sanitizeImages(imagesArray),
      isNew: typeof body.isNew === 'boolean' ? body.isNew : false,
      quantity: Math.max(0, parseInt(body.quantity)) || 0,
    }).select().single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Errore POST /api/products:", error);
    return NextResponse.json({ error: "Impossibile creare il prodotto" }, { status: 500 });
  }
}
