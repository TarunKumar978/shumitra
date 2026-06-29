import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const db = mysql.createPool({ host:process.env.MYSQL_HOST||"localhost", user:process.env.MYSQL_USER||"root", password:process.env.MYSQL_PASSWORD||"", database:process.env.MYSQL_DATABASE||"shumitra" });

// Check admin token
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
    // Map camelCase to snake_case column names
    const colMap: Record<string,string> = { minOrder:"min_order", productId:"product_id" };
    const values: any[] = [];
    const fields = Object.keys(updates).map(k => {
      const val = updates[k];
      values.push(val === "" ? null : val);
      const col = colMap[k] || k;
      return `\`${col}\` = ?`;
    }).join(", ");
    await db.query(`UPDATE varieties SET ${fields} WHERE id = ? AND product_id = ?`, [...values, id, product_id]);
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
