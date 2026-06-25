import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { product, quantity, unit, name, company, email, phone, country, message, spec, port, incoterm } = body;

  // Save to Supabase
  const { error: dbError } = await supabase.from("inquiries").insert([{
    name, email, phone, company, country,
    product, quantity, unit, spec, port, incoterm, message,
    status: "new"
  }]);

  if (dbError) console.error("Supabase error:", dbError);

  // Send email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#F5F0E8;border-radius:16px;overflow:hidden;">
      <div style="background:#0D1B2A;padding:28px 32px;">
        <h2 style="color:#E8A020;margin:0;font-size:22px;">New Quote Inquiry</h2>
        <p style="color:rgba(255,255,255,0.5);margin:6px 0 0;font-size:13px;">Shumitra Exports — via website</p>
      </div>
      <div style="padding:28px 32px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(13,27,42,0.1);color:#888;font-size:12px;text-transform:uppercase;width:140px;">Product</td><td style="padding:10px 0;border-bottom:1px solid rgba(13,27,42,0.1);color:#0D1B2A;font-weight:600;">${product || "—"}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(13,27,42,0.1);color:#888;font-size:12px;text-transform:uppercase;">Quantity</td><td style="padding:10px 0;border-bottom:1px solid rgba(13,27,42,0.1);color:#0D1B2A;font-weight:600;">${quantity || "—"} ${unit || ""}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(13,27,42,0.1);color:#888;font-size:12px;text-transform:uppercase;">Spec</td><td style="padding:10px 0;border-bottom:1px solid rgba(13,27,42,0.1);color:#0D1B2A;font-weight:600;">${spec || "—"}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(13,27,42,0.1);color:#888;font-size:12px;text-transform:uppercase;">Port</td><td style="padding:10px 0;border-bottom:1px solid rgba(13,27,42,0.1);color:#0D1B2A;font-weight:600;">${port || "—"}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(13,27,42,0.1);color:#888;font-size:12px;text-transform:uppercase;">Incoterm</td><td style="padding:10px 0;border-bottom:1px solid rgba(13,27,42,0.1);color:#0D1B2A;font-weight:600;">${incoterm || "—"}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(13,27,42,0.1);color:#888;font-size:12px;text-transform:uppercase;">Name</td><td style="padding:10px 0;border-bottom:1px solid rgba(13,27,42,0.1);color:#0D1B2A;font-weight:600;">${name}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(13,27,42,0.1);color:#888;font-size:12px;text-transform:uppercase;">Company</td><td style="padding:10px 0;border-bottom:1px solid rgba(13,27,42,0.1);color:#0D1B2A;font-weight:600;">${company || "—"}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(13,27,42,0.1);color:#888;font-size:12px;text-transform:uppercase;">Email</td><td style="padding:10px 0;border-bottom:1px solid rgba(13,27,42,0.1);color:#0D1B2A;font-weight:600;">${email}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(13,27,42,0.1);color:#888;font-size:12px;text-transform:uppercase;">Phone</td><td style="padding:10px 0;border-bottom:1px solid rgba(13,27,42,0.1);color:#0D1B2A;font-weight:600;">${phone || "—"}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(13,27,42,0.1);color:#888;font-size:12px;text-transform:uppercase;">Country</td><td style="padding:10px 0;border-bottom:1px solid rgba(13,27,42,0.1);color:#0D1B2A;font-weight:600;">${country || "—"}</td></tr>
          <tr><td style="padding:10px 0;color:#888;font-size:12px;text-transform:uppercase;">Notes</td><td style="padding:10px 0;color:#0D1B2A;">${message || "—"}</td></tr>
        </table>
      </div>
      <div style="background:#0D1B2A;padding:16px 32px;text-align:center;">
        <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;">Shumitra Exports · Silasya Fusion Pvt Ltd · info@silasya.com</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Shumitra Exports Website" <${process.env.SMTP_USER}>`,
      to: "info@silasya.com",
      replyTo: email,
      subject: `Quote Request: ${product} — ${quantity} ${unit} — ${country}`,
      html,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    // Still return success if saved to DB even if email fails
    return NextResponse.json({ success: !dbError, error: "Email failed but saved to DB" });
  }
}
