import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase.from("subscribers").select("*").order("date", { ascending: false });
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Errore GET /api/subscribers:", error);
    return NextResponse.json({ error: "Impossibile caricare i lead" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");

    if (!idParam) {
      return NextResponse.json({ error: "ID del lead non specificato" }, { status: 400 });
    }

    const id = parseInt(idParam);
    const { error, count } = await supabase.from("subscribers").delete().eq("id", id);

    if (error) throw error;

    if (count === 0) {
      return NextResponse.json({ error: "Lead non trovato" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Lead rimosso correttamente" });
  } catch (error) {
    console.error("Errore DELETE /api/subscribers:", error);
    return NextResponse.json({ error: "Impossibile rimuovere il lead" }, { status: 500 });
  }
}
