import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/products.json");

async function readProducts() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeProducts(products) {
  await fs.writeFile(filePath, JSON.stringify(products, null, 2), "utf-8");
}

export async function GET() {
  try {
    const products = await readProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Impossibile recuperare i prodotti" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const products = await readProducts();
    
    // Genera un ID incrementale univoco
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    // Fallback: se viene passato un array images usalo, altrimenti crea un array con l'immagine singola
    const imagesArray = Array.isArray(body.images) && body.images.length > 0 
      ? body.images 
      : (body.image ? [body.image] : ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=600"]);

    const newProduct = {
      id: newId,
      name: body.name || "Nuovo Prodotto",
      price: parseFloat(body.price) || 0.0,
      oldPrice: body.oldPrice ? parseFloat(body.oldPrice) : null,
      category: body.category || "Generico",
      image: imagesArray[0], // fallback per codice legacy
      images: imagesArray,
      isNew: typeof body.isNew === 'boolean' ? body.isNew : false,
      quantity: parseInt(body.quantity) >= 0 ? parseInt(body.quantity) : 0
    };
    
    products.push(newProduct);
    await writeProducts(products);
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Errore POST /api/products:", error);
    return NextResponse.json({ error: "Impossibile creare il prodotto" }, { status: 500 });
  }
}
