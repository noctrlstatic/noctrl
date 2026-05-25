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

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const targetId = parseInt(id);
    const body = await req.json();
    const products = await readProducts();
    
    const index = products.findIndex(p => p.id === targetId);
    if (index === -1) {
      return NextResponse.json({ error: "Prodotto non trovato" }, { status: 404 });
    }
    
    const existing = products[index];
    
    // Gestione array images: se fornito body.images usalo, altrimenti verifica se esiste existing.images, altrimenti crea un array con existing.image
    let newImages = existing.images || [existing.image];
    if (Array.isArray(body.images) && body.images.length > 0) {
      newImages = body.images;
    } else if (body.image) {
      newImages = [body.image];
    }
    
    const updatedProduct = {
      ...existing,
      name: body.name !== undefined ? body.name : existing.name,
      price: body.price !== undefined ? parseFloat(body.price) : existing.price,
      oldPrice: body.oldPrice !== undefined ? (body.oldPrice ? parseFloat(body.oldPrice) : null) : existing.oldPrice,
      category: body.category !== undefined ? body.category : existing.category,
      image: newImages[0],
      images: newImages,
      isNew: body.isNew !== undefined ? !!body.isNew : existing.isNew,
      quantity: body.quantity !== undefined ? parseInt(body.quantity) : existing.quantity
    };
    
    products[index] = updatedProduct;
    await writeProducts(products);
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Errore PUT /api/products/[id]:", error);
    return NextResponse.json({ error: "Impossibile aggiornare il prodotto" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const targetId = parseInt(id);
    let products = await readProducts();
    
    const index = products.findIndex(p => p.id === targetId);
    if (index === -1) {
      return NextResponse.json({ error: "Prodotto non trovato" }, { status: 404 });
    }
    
    products = products.filter(p => p.id !== targetId);
    await writeProducts(products);
    
    return NextResponse.json({ message: "Prodotto eliminato con successo" });
  } catch (error) {
    console.error("Errore DELETE /api/products/[id]:", error);
    return NextResponse.json({ error: "Impossibile eliminare il prodotto" }, { status: 500 });
  }
}
