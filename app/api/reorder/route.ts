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

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { type, ids } = await req.json();
    const table = type === "hero" ? "hero_slides" : "products";
    for (let i = 0; i < ids.length; i++) {
      await db.query("UPDATE " + table + " SET sort_order = ? WHERE id = ?", [i, ids[i]]);
    }
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}
