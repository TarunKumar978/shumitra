import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";
import crypto from "crypto";

const db = mysql.createPool({ host:process.env.MYSQL_HOST||"localhost", user:process.env.MYSQL_USER||"root", password:process.env.MYSQL_PASSWORD||"", database:process.env.MYSQL_DATABASE||"shumitra" });

// Simple in-memory rate limiter (resets on server restart)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 }); // 15min window
    return true;
  }
  if (entry.count >= 10) return false; // max 10 attempts per 15min
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password, token, newPassword, name, role, session_id } = body;
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

    if (action === "login") {
      if (!checkRateLimit(ip)) {
        return NextResponse.json({ error: "Too many login attempts. Try again in 15 minutes." }, { status: 429 });
      }
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
      // Clear rate limit on success
      loginAttempts.delete(ip);
      return NextResponse.json({ success: true, user, session_id: (sess as any).insertId });
    }

    if (action === "logout") {
      if (session_id) {
        await db.query(
          "UPDATE admin_sessions SET logout_at=NOW(), duration_minutes=TIMESTAMPDIFF(MINUTE,login_at,NOW()) WHERE id=?",
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
      // Rate limit forgot password too
      if (!checkRateLimit(ip + "_forgot")) {
        return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
      }
      const [rows] = await db.query("SELECT id, name FROM admin_users WHERE email=? AND active=1", [email]) as any[];
      if (!rows.length) {
        // Don't reveal if email exists
        return NextResponse.json({ success: true });
      }
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
            <p>Hi ${rows[0].name},</p>
            <p>Your reset token is:</p>
            <div style="background:white;border:2px solid #C4930A;padding:20px;border-radius:12px;text-align:center;font-size:28px;font-weight:700;letter-spacing:8px;color:#0D1B2A;margin:16px 0;">${resetToken}</div>
            <p style="color:#888;font-size:12px;">Valid for 1 hour. If you didn't request this, ignore this email.</p>
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
      if (!newPassword || newPassword.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
      const hash = crypto.createHash("sha256").update(newPassword).digest("hex");
      await db.query("UPDATE admin_users SET password_hash=?, reset_token=NULL, reset_expiry=NULL WHERE id=?", [hash, rows[0].id]);
      return NextResponse.json({ success: true });
    }

    if (action === "add_member") {
      // Only authenticated admins can add members
      const token = req.headers.get("x-admin-token");
      let isAuthed = false;
      if (token) {
        try {
          const decoded = Buffer.from(token, "base64").toString("utf8");
          const [tEmail, timestamp] = decoded.split(":");
          if (tEmail && timestamp && Date.now() - parseInt(timestamp) < 86400000) isAuthed = true;
        } catch {}
      }
      if (!isAuthed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      if (!name || !email || !password || password.length < 8) {
        return NextResponse.json({ error: "Invalid member data" }, { status: 400 });
      }
      const hash = crypto.createHash("sha256").update(password).digest("hex");
      await db.query(
        "INSERT INTO admin_users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
        [name, email, hash, role || "admin"]
      );
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com", port: 465, secure: true,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        });
        await transporter.sendMail({
          from: `"Shumitra Admin" <${process.env.SMTP_USER}>`,
          to: email,
          subject: "You have been added to Shumitra Admin Panel",
          html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
            <div style="background:#0D1B2A;padding:24px 28px;border-radius:12px 12px 0 0;">
              <h2 style="color:#E8A020;margin:0;">Welcome to Shumitra Admin</h2>
            </div>
            <div style="background:#F5F0E8;padding:28px;border-radius:0 0 12px 12px;">
              <p>Hi ${name},</p>
              <p>You have been granted <strong>${role || "admin"}</strong> access to the Shumitra Exports admin panel.</p>
              <div style="background:white;border-radius:10px;padding:16px;margin:16px 0;">
                <p style="margin:0 0 6px;"><strong>Login URL:</strong> localhost:3000/admin</p>
                <p style="margin:0;"><strong>Email:</strong> ${email}</p>
              </div>
              <p>Use the password provided by your administrator. You can reset it anytime using "Forgot Password".</p>
            </div>
          </div>`
        });
      } catch(e) { console.error("Welcome email failed:", e); }
      return NextResponse.json({ success: true });
    }

    if (action === "remove_member") {
      const token = req.headers.get("x-admin-token");
      let isAuthed = false;
      if (token) {
        try {
          const decoded = Buffer.from(token, "base64").toString("utf8");
          const [tEmail, timestamp] = decoded.split(":");
          if (tEmail && timestamp && Date.now() - parseInt(timestamp) < 86400000) isAuthed = true;
        } catch {}
      }
      if (!isAuthed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      await db.query("UPDATE admin_users SET active=0 WHERE email=? AND role != 'super_admin'", [email]);
      return NextResponse.json({ success: true });
    }

    if (action === "list_members") {
      const token = req.headers.get("x-admin-token");
      let isAuthed = false;
      if (token) {
        try {
          const decoded = Buffer.from(token, "base64").toString("utf8");
          const [tEmail, timestamp] = decoded.split(":");
          if (tEmail && timestamp && Date.now() - parseInt(timestamp) < 86400000) isAuthed = true;
        } catch {}
      }
      if (!isAuthed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    console.error("Admin auth error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
