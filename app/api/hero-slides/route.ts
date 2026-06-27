import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const db = mysql.createPool({ host:"localhost", user:"root", password:"", database:"shumitra" });

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
    const [data] = await db.query("SELECT * FROM hero_slides WHERE active=1 ORDER BY sort_order, id") as any[];
    return NextResponse.json({ data });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const [result] = await db.query(
      "INSERT INTO hero_slides (label, subtitle, image_url, video_url, accent_color, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
      [body.label||"New Slide", body.subtitle||"", body.image_url||null, body.video_url||null, body.accent_color||"#C4930A", body.sort_order||0]
    ) as any[];
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}

export async function PATCH(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id, ...updates } = await req.json();
    const fields = Object.keys(updates).map(k => `\`${k}\` = ?`).join(", ");
    await db.query(`UPDATE hero_slides SET ${fields} WHERE id = ?`, [...Object.values(updates), id]);
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await req.json();
    await db.query("DELETE FROM hero_slides WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}
