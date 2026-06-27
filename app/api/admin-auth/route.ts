import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";
import crypto from "crypto";

const db = mysql.createPool({ host:"localhost", user:"root", password:"", database:"shumitra" });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password, token, newPassword, name, role, session_id, duration } = body;

    if (action === "login") {
      const hash = crypto.createHash("sha256").update(password).digest("hex");
      const [rows] = await db.query(
        "SELECT id, name, email, role FROM admin_users WHERE email=? AND password_hash=? AND active=1",
        [email, hash]
      ) as any[];
      if (!rows.length) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      const user = rows[0];
      await db.query("UPDATE admin_users SET last_login=NOW() WHERE id=?", [user.id]);
      const [sess] = await db.query(
        "INSERT INTO admin_sessions (user_id, user_name, user_email, login_at) VALUES (?,?,?,NOW())",
        [user.id, user.name, user.email]
      ) as any[];
      return NextResponse.json({ success: true, user, session_id: sess.insertId });
    }

    if (action === "logout") {
      if (session_id) {
        await db.query(
          "UPDATE admin_sessions SET logout_at=NOW(), duration_minutes=TIMESTAMPDIFF(MINUTE, login_at, NOW()) WHERE id=?",
          [session_id]
        );
        await db.query(
          "UPDATE admin_users SET last_logout=NOW(), total_time_minutes=total_time_minutes+TIMESTAMPDIFF(MINUTE,(SELECT login_at FROM admin_sessions WHERE id=?),NOW()) WHERE email=?",
          [session_id, email]
        );
      }
      return NextResponse.json({ success: true });
    }

    if (action === "forgot") {
      const [rows] = await db.query("SELECT id, name FROM admin_users WHERE email=? AND active=1", [email]) as any[];
      if (!rows.length) return NextResponse.json({ error: "Email not found" }, { status: 404 });
      const resetToken = crypto.randomBytes(4).toString("hex").toUpperCase();
      const expiry = new Date(Date.now() + 3600000);
      await db.query("UPDATE admin_users SET reset_token=?, reset_expiry=? WHERE email=?", [resetToken, expiry, email]);
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", port: 465, secure: true,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });
      await transporter.sendMail({
        from: `"Shumitra Admin" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Shumitra Admin — Password Reset Token",
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
          <div style="background:#0D1B2A;padding:24px 28px;border-radius:12px 12px 0 0;">
            <h2 style="color:#E8A020;margin:0;font-size:20px;">Password Reset</h2>
          </div>
          <div style="background:#F5F0E8;padding:28px;border-radius:0 0 12px 12px;">
            <p style="color:#0D1B2A;">Hi ${rows[0].name},</p>
            <p style="color:#0D1B2A;">Your reset token is:</p>
            <div style="background:white;border:2px solid #C4930A;padding:20px;border-radius:12px;text-align:center;font-size:28px;font-weight:700;letter-spacing:8px;color:#0D1B2A;margin:16px 0;">${resetToken}</div>
            <p style="color:#888;font-size:12px;">Valid for 1 hour. Enter this on the admin login page.</p>
          </div>
        </div>`
      });
      return NextResponse.json({ success: true });
    }

    if (action === "reset") {
      const [rows] = await db.query(
        "SELECT id FROM admin_users WHERE UPPER(reset_token)=UPPER(?) AND reset_expiry > NOW()",
        [token]
      ) as any[];
      if (!rows.length) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
      const hash = crypto.createHash("sha256").update(newPassword).digest("hex");
      await db.query("UPDATE admin_users SET password_hash=?, reset_token=NULL, reset_expiry=NULL WHERE id=?", [hash, rows[0].id]);
      return NextResponse.json({ success: true });
    }

    if (action === "add_member") {
      const hash = crypto.createHash("sha256").update(password).digest("hex");
      await db.query(
        "INSERT INTO admin_users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
        [name, email, hash, role||"admin"]
      );
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", port: 465, secure: true,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });
      await transporter.sendMail({
        from: `"Shumitra Admin" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "You've been added to Shumitra Admin Panel",
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
          <div style="background:#0D1B2A;padding:24px 28px;border-radius:12px 12px 0 0;">
            <h2 style="color:#E8A020;margin:0;">Welcome to Shumitra Admin</h2>
          </div>
          <div style="background:#F5F0E8;padding:28px;border-radius:0 0 12px 12px;">
            <p>Hi ${name},</p>
            <p>You've been granted <strong>${role||"admin"}</strong> access to the Shumitra Exports admin panel.</p>
            <div style="background:white;border-radius:10px;padding:16px;margin:16px 0;">
              <p style="margin:0 0 6px;"><strong>Login URL:</strong> localhost:3000/admin</p>
              <p style="margin:0 0 6px;"><strong>Email:</strong> ${email}</p>
              <p style="margin:0;"><strong>Password:</strong> ${password}</p>
            </div>
            <p style="color:#888;font-size:12px;">Please change your password after first login.</p>
          </div>
        </div>`
      });
      return NextResponse.json({ success: true });
    }

    if (action === "remove_member") {
      await db.query("UPDATE admin_users SET active=0 WHERE email=? AND role != 'super_admin'", [email]);
      return NextResponse.json({ success: true });
    }

    if (action === "list_members") {
      const [rows] = await db.query(`
        SELECT u.id, u.name, u.email, u.role, u.active, u.last_login, u.total_time_minutes,
          (SELECT COUNT(*) FROM admin_sessions s WHERE s.user_id=u.id) as total_sessions,
          (SELECT login_at FROM admin_sessions s WHERE s.user_id=u.id AND s.logout_at IS NULL ORDER BY login_at DESC LIMIT 1) as active_since
        FROM admin_users u ORDER BY u.created_at
      `) as any[];
      return NextResponse.json({ data: rows });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
