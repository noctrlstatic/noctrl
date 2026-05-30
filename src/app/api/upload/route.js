import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/api-auth";

export async function POST(req) {
  const authError = requireAdmin(req);
  if (authError) return authError;
  try {
    const formData = await req.formData();
    const files = formData.getAll("files"); // Multiple files input name "files"
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Nessun file caricato" }, { status: 400 });
    }
    
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    
    const savedUrls = [];
    
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const filePath = path.join(uploadDir, uniqueName);
      
      await fs.writeFile(filePath, buffer);
      savedUrls.push(`/uploads/${uniqueName}`);
    }
    
    return NextResponse.json({ success: true, urls: savedUrls });
  } catch (error) {
    console.error("Errore upload:", error);
    return NextResponse.json({ error: "Errore durante il caricamento dei file" }, { status: 500 });
  }
}
