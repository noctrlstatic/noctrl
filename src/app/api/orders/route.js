import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/orders.json");

async function readOrders() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeOrders(orders) {
  await fs.writeFile(filePath, JSON.stringify(orders, null, 2), "utf-8");
}

export async function GET() {
  try {
    const orders = await readOrders();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Impossibile recuperare ordini" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const orders = await readOrders();

    const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;

    const order = {
      id: newId,
      items: body.items,
      shipping: body.shipping,
      total: body.total,
      date: new Date().toISOString(),
      status: "In elaborazione",
      tracking: "",
    };

    orders.push(order);
    await writeOrders(orders);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Errore POST /api/orders:", error);
    return NextResponse.json({ error: "Impossibile creare ordine" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const orders = await readOrders();
    const index = orders.findIndex(o => o.id === body.id);

    if (index === -1) {
      return NextResponse.json({ error: "Ordine non trovato" }, { status: 404 });
    }

    if (body.status) orders[index].status = body.status;
    if (body.tracking !== undefined) orders[index].tracking = body.tracking;

    await writeOrders(orders);
    return NextResponse.json(orders[index]);
  } catch (error) {
    console.error("Errore PUT /api/orders:", error);
    return NextResponse.json({ error: "Impossibile aggiornare ordine" }, { status: 500 });
  }
}
