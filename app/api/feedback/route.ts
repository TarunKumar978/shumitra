import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";

const db = mysql.createPool({ host:"localhost", user:"root", password:"Shumitra@2025!", database:"shumitra" });

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
    const [data] = await db.query("SELECT * FROM feedback ORDER BY created_at DESC") as any[];
    return NextResponse.json({ data });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}

export async function POST(req: NextRequest) {
  // POST is PUBLIC — called from website feedback form, no token needed
  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    await db.query(
      "INSERT INTO feedback (id, name, rating, message, approved) VALUES (?, ?, ?, ?, ?)",
      [id, body.name, body.rating, body.message, false]
    );

    // Send email to both addresses
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", port: 465, secure: true,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      const stars = "⭐".repeat(Math.min(body.rating || 1, 5));
      await transporter.sendMail({
        from: `"Shumitra Website" <${process.env.SMTP_USER}>`,
        to: "tarun.k@silasya.com, info@silasya.com",
        subject: `New Feedback ${stars} — ${body.name}`,
        html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#F5F0E8;border-radius:16px;overflow:hidden;">
          <div style="background:#0D1B2A;padding:24px 28px;">
            <h2 style="color:#E8A020;margin:0;font-size:20px;">New Feedback Received</h2>
            <p style="color:rgba(255,255,255,0.5);margin:4px 0 0;font-size:13px;">Shumitra Exports — via website</p>
          </div>
          <div style="padding:24px 28px;">
            <p style="margin:0 0 8px;color:#0D1B2A;"><b>Name:</b> ${body.name}</p>
            <p style="margin:0 0 8px;color:#0D1B2A;"><b>Rating:</b> ${stars} (${body.rating}/5)</p>
            <p style="margin:0 0 8px;color:#0D1B2A;"><b>Message:</b></p>
            <p style="background:white;padding:16px;border-radius:10px;color:#0D1B2A;line-height:1.6;">${body.message}</p>
            <p style="color:#888;font-size:12px;margin-top:16px;">Login to admin panel to approve and show on homepage.</p>
          </div>
        </div>`,
      });
      console.log("✅ Feedback email sent");
    } catch (emailErr) {
      console.error("❌ Feedback email failed:", emailErr);
    }

    return NextResponse.json({ success: true, data: [{ id, ...body }] });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}

export async function PATCH(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id, ...updates } = await req.json();
    const fields = Object.keys(updates).map(k => `\`${k}\` = ?`).join(", ");
    await db.query(`UPDATE feedback SET ${fields} WHERE id = ?`, [...Object.values(updates), id]);
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await req.json();
    await db.query("DELETE FROM feedback WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}
