import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const db = mysql.createPool({ host:process.env.MYSQL_HOST||"localhost", user:process.env.MYSQL_USER||"root", password:process.env.MYSQL_PASSWORD||"", database:process.env.MYSQL_DATABASE||"shumitra" });

function isAdminAuthed(req: Request): boolean {
  const token = req.headers.get("x-admin-token");
  if (!token || token === "test") return false;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const parts = decoded.split(":");
    if (parts.length < 2) return false;
    const [email, timestamp] = parts;
    if (!email || !email.includes("@")) return false;
    if (!timestamp || isNaN(parseInt(timestamp))) return false;
    if (Date.now() - parseInt(timestamp) > 18000000) return false;
    return true;
  } catch { return false; }
}

export async function GET() {
  try {
    const [rows] = await db.query("SELECT id FROM hidden_products") as any[];
    return NextResponse.json({ data: rows.map((r: any) => r.id) });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await db.query("INSERT IGNORE INTO hidden_products (id) VALUES (?)", [id]);
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await req.json();
    await db.query("DELETE FROM hidden_products WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}
