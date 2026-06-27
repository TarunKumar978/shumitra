import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import mysql from "mysql2/promise";

const db = mysql.createPool({ host:"localhost", user:"root", password:"Shumitra@2025!", database:"shumitra" });

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { product, quantity, unit, name, company, email, phone, country, message, spec, port, incoterm } = body;

  let dbError = null;
  try {
    const id = crypto.randomUUID();
    await db.query(
      "INSERT INTO inquiries (id, name, email, phone, company, country, product, quantity, unit, spec, port, incoterm, message, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, name, email, phone||null, company||null, country||null, product||null, quantity||null, unit||null, spec||null, port||null, incoterm||null, message||null, "new"]
    );
  } catch (e: any) { dbError = e.message; console.error("MySQL error:", e); }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  console.log("📧 SMTP_USER:", smtpUser);
  console.log("📧 SMTP_PASS length:", smtpPass?.length);

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: `"Shumitra Exports" <${smtpUser}>`,
      to: "tarun.k@silasya.com",
      replyTo: email,
      subject: `New Quote Request: ${product} — ${name} — ${country}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#0D1B2A;padding:24px 28px;border-radius:12px 12px 0 0;">
            <h2 style="color:#E8A020;margin:0;font-size:20px;">New Quote Inquiry</h2>
            <p style="color:rgba(255,255,255,0.5);margin:4px 0 0;font-size:13px;">Shumitra Exports — via website</p>
          </div>
          <div style="background:#F5F0E8;padding:24px 28px;border-radius:0 0 12px 12px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#888;font-size:12px;width:120px;">Product</td><td style="padding:8px 0;color:#0D1B2A;font-weight:600;">${product||"—"}</td></tr>
              <tr><td style="padding:8px 0;color:#888;font-size:12px;">Quantity</td><td style="padding:8px 0;color:#0D1B2A;font-weight:600;">${quantity||"—"} ${unit||""}</td></tr>
              <tr><td style="padding:8px 0;color:#888;font-size:12px;">Name</td><td style="padding:8px 0;color:#0D1B2A;font-weight:600;">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#888;font-size:12px;">Company</td><td style="padding:8px 0;color:#0D1B2A;font-weight:600;">${company||"—"}</td></tr>
              <tr><td style="padding:8px 0;color:#888;font-size:12px;">Email</td><td style="padding:8px 0;color:#0D1B2A;font-weight:600;">${email}</td></tr>
              <tr><td style="padding:8px 0;color:#888;font-size:12px;">Phone</td><td style="padding:8px 0;color:#0D1B2A;font-weight:600;">${phone||"—"}</td></tr>
              <tr><td style="padding:8px 0;color:#888;font-size:12px;">Country</td><td style="padding:8px 0;color:#0D1B2A;font-weight:600;">${country||"—"}</td></tr>
              <tr><td style="padding:8px 0;color:#888;font-size:12px;">Message</td><td style="padding:8px 0;color:#0D1B2A;">${message||"—"}</td></tr>
            </table>
          </div>
        </div>`,
    });
    console.log("✅ Email sent successfully!");
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ Email error:", err.message);
    return NextResponse.json({ success: !dbError, error: "Email failed: " + err.message });
  }
}
