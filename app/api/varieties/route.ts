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


export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    const images = body.images ? JSON.stringify(body.images) : null;
    await db.query(
      `INSERT INTO varieties (id, product_id, name, origin, grade, min_order, moisture, packing, image, images, video, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, body.product_id, body.name, body.origin||null, body.grade||null, body.min_order||null, body.moisture||null, body.packing||null, body.image||null, images, body.video||null, body.description||null]
    );
    return NextResponse.json({ success: true, data: { id, ...body } });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}

export async function PATCH(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id, product_id, created_at, ...updates } = await req.json();
    if (updates.images && Array.isArray(updates.images)) {
      updates.images = JSON.stringify(updates.images);
    }
    const fields = Object.keys(updates).map(k => `\`${k}\` = ?`).join(", ");
    await db.query(`UPDATE varieties SET ${fields} WHERE id = ? AND product_id = ?`, [...Object.values(updates), id, product_id]);
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id, product_id } = await req.json();
    await db.query(`DELETE FROM varieties WHERE id = ? AND product_id = ?`, [id, product_id]);
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}
