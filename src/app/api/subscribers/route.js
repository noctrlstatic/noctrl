import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/subscribers.json");

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

export async function GET() {
  try {
    const subscribers = await readSubscribers();
    // Sort by subscription date (newest first)
    const sorted = subscribers.sort((a, b) => new Date(b.date) - new Date(a.date));
    return NextResponse.json(sorted);
  } catch (error) {
    console.error("Errore GET /api/subscribers:", error);
    return NextResponse.json({ error: "Impossibile caricare i lead" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");

    if (!idParam) {
      return NextResponse.json({ error: "ID del lead non specificato" }, { status: 400 });
    }

    const id = parseInt(idParam);
    const subscribers = await readSubscribers();
    const cleanList = subscribers.filter(s => s.id !== id);

    if (subscribers.length === cleanList.length) {
      return NextResponse.json({ error: "Lead non trovato" }, { status: 404 });
    }

    await writeSubscribers(cleanList);
    return NextResponse.json({ success: true, message: "Lead rimosso correttamente" });
  } catch (error) {
    console.error("Errore DELETE /api/subscribers:", error);
    return NextResponse.json({ error: "Impossibile rimuovere il lead" }, { status: 500 });
  }
}
