import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "L'indirizzo email è richiesto" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json({ error: "Inserisci un indirizzo email valido" }, { status: 400 });
    }

    const { data: existing } = await supabase.from("subscribers").select("id").eq("email", cleanEmail).single();
    if (existing) {
      return NextResponse.json({ error: "Questo indirizzo email è già registrato nel network" }, { status: 400 });
    }

    const { data, error } = await supabase.from("subscribers").insert({
      email: cleanEmail,
      date: new Date().toISOString(),
    }).select().single();

    if (error) throw error;

    return NextResponse.json({ success: true, subscriber: data }, { status: 201 });
  } catch (error) {
    console.error("Errore POST /api/subscribe:", error);
    return NextResponse.json({ error: "Impossibile completare la registrazione" }, { status: 500 });
  }
}
