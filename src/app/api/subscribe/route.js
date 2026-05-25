import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/subscribers.json");

// Helper function to validate email address
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function readSubscribers() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeSubscribers(subscribers) {
  await fs.writeFile(filePath, JSON.stringify(subscribers, null, 2), "utf-8");
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

    const subscribers = await readSubscribers();

    // Check if email already exists
    const exists = subscribers.some(s => s.email === cleanEmail);
    if (exists) {
      return NextResponse.json({ error: "Questo indirizzo email è già registrato nel network" }, { status: 400 });
    }

    const newSubscriber = {
      id: Date.now(),
      email: cleanEmail,
      date: new Date().toISOString()
    };

    subscribers.push(newSubscriber);
    await writeSubscribers(subscribers);

    return NextResponse.json({ success: true, subscriber: newSubscriber }, { status: 201 });
  } catch (error) {
    console.error("Errore POST /api/subscribe:", error);
    return NextResponse.json({ error: "Impossibile completare la registrazione" }, { status: 500 });
  }
}
