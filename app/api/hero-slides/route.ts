import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const db = mysql.createPool({ host:"localhost", user:"root", password:"", database:"shumitra" });

export async function GET() {
  try {
    const [data] = await db.query("SELECT * FROM hero_slides WHERE active=1 ORDER BY sort_order, id") as any[];
    return NextResponse.json({ data });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}

export async function POST(req: NextRequest) {
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
  try {
    const { id, ...updates } = await req.json();
    const fields = Object.keys(updates).map(k => `\`${k}\` = ?`).join(", ");
    await db.query(`UPDATE hero_slides SET ${fields} WHERE id = ?`, [...Object.values(updates), id]);
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await db.query("DELETE FROM hero_slides WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}
