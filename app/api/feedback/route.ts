import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const db = mysql.createPool({ host:"localhost", user:"root", password:"", database:"shumitra" });

export async function GET() {
  try {
    const [data] = await db.query("SELECT * FROM feedback ORDER BY created_at DESC") as any[];
    return NextResponse.json({ data });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    await db.query(
      "INSERT INTO feedback (id, name, rating, message, approved) VALUES (?, ?, ?, ?, ?)",
      [id, body.name, body.rating, body.message, body.approved ?? false]
    );

    // Send email notification
    try {
      const nodemailer = require("nodemailer");
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      const stars = "⭐".repeat(body.rating || 1);
      await transporter.sendMail({
        from: `"Shumitra Website" <${process.env.SMTP_USER}>`,
        to: "tarun.k@silasya.com",
        subject: `New Feedback ${stars} — ${body.name}`,
        html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#F5F0E8;border-radius:16px;overflow:hidden;">
          <div style="background:#0D1B2A;padding:24px 28px;">
            <h2 style="color:#E8A020;margin:0;font-size:20px;">New Feedback Received</h2>
          </div>
          <div style="padding:24px 28px;">
            <p style="margin:0 0 8px;"><b>Name:</b> ${body.name}</p>
            <p style="margin:0 0 8px;"><b>Rating:</b> ${stars} (${body.rating}/5)</p>
            <p style="margin:0 0 8px;"><b>Message:</b></p>
            <p style="background:white;padding:16px;border-radius:10px;color:#0D1B2A;">${body.message}</p>
            <p style="color:#888;font-size:12px;margin-top:16px;">Go to admin panel to approve and show on homepage.</p>
          </div>
        </div>`,
      });
    } catch (emailErr) {
      console.error("Feedback email failed:", emailErr);
    }

    return NextResponse.json({ success: true, data: [{ id, ...body }] });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}
export async function PATCH(req: NextRequest) {
  try {
    const { id, ...updates } = await req.json();
    const fields = Object.keys(updates).map(k => `${k} = ?`).join(", ");
    await db.query(`UPDATE feedback SET ${fields} WHERE id = ?`, [...Object.values(updates), id]);
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await db.query("DELETE FROM feedback WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status:500 }); }
}
