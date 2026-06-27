import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const db = mysql.createPool({ host:"localhost", user:"root", password:"", database:"shumitra" });

export async function GET() {
  try {
    const [data] = await db.query("SELECT * FROM testimonials ORDER BY created_at DESC") as any[];
    return NextResponse.json({ data });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    await db.query(
      "INSERT INTO testimonials (id, name, company, country, role, rating, message, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id, body.name, body.company||null, body.country||null, body.role||null, body.rating||5, body.message, body.active ?? true]
    );
    return NextResponse.json({ success: true, data: [{ id, ...body }] });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}
export async function PATCH(req: NextRequest) {
  try {
    const { id, ...updates } = await req.json();
    const fields = Object.keys(updates).map(k => `${k} = ?`).join(", ");
    await db.query(`UPDATE testimonials SET ${fields} WHERE id = ?`, [...Object.values(updates), id]);
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await db.query("DELETE FROM testimonials WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}
