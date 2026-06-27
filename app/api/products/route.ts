import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const db = mysql.createPool({ host:"localhost", user:"root", password:"", database:"shumitra" });

export async function GET() {
  try {
    const [products] = await db.query("SELECT * FROM products WHERE active = 1 ORDER BY created_at") as any[];
    const [varieties] = await db.query("SELECT * FROM varieties") as any[];
    const data = products.map((p: any) => ({
      ...p,
      varieties: varieties.filter((v: any) => v.product_id === p.id),
    }));
    return NextResponse.json({ data });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    await db.query(
      `INSERT INTO products (id, name, emoji, category, tagline, description, hero_color, hero_image, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, body.name, body.emoji||null, body.category||null, body.tagline||null, body.description||null, body.hero_color||"#C4930A", body.hero_image||null, body.active !== false ? 1 : 0]
    );
    return NextResponse.json({ success: true, data: { id } });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, created_at, varieties, ...updates } = await req.json();
    const fields = Object.keys(updates).map(k => `\`${k}\` = ?`).join(", ");
    await db.query(`UPDATE products SET ${fields} WHERE id = ?`, [...Object.values(updates), id]);
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await db.query("DELETE FROM products WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}
