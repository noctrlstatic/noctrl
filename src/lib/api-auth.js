import { NextResponse } from "next/server";

if (!process.env.ADMIN_PASSWORD) {
  throw new Error("ADMIN_PASSWORD environment variable is not set");
}
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export function requireAdmin(request) {
  const authHeader = request.headers.get("x-admin-auth");
  if (authHeader !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
