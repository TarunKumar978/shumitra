import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const db = mysql.createPool({ host:"localhost", user:"root", password:"Shumitra@2025!", database:"shumitra" });

// Check admin token
function isAdminAuthed(req: Request): boolean {
  const token = req.headers.get("x-admin-token");
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const [email, timestamp] = decoded.split(":");
    if (!email || !timestamp) return false;
    if (Date.now() - parseInt(timestamp) > 86400000) return false; // 24h expiry
    return email.includes("@");
  } catch { return false; }
}


export async function GET() {
  try {
    const [data] = await db.query("SELECT * FROM inquiries ORDER BY created_at DESC") as any[];
    return NextResponse.json({ data });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}
export async function PATCH(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id, ...updates } = await req.json();
    const fields = Object.keys(updates).map(k => `${k} = ?`).join(", ");
    await db.query(`UPDATE inquiries SET ${fields} WHERE id = ?`, [...Object.values(updates), id]);
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}
export async function DELETE(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await req.json();
    await db.query("DELETE FROM inquiries WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}
