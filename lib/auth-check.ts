// Simple token-based API protection
// Admin token is stored in a header for protected routes

const ADMIN_TOKEN_HEADER = "x-admin-token";

// Generate a session token on login, store in localStorage
// Check it on protected API calls

export function requireAdminToken(req: Request): boolean {
  const token = req.headers.get(ADMIN_TOKEN_HEADER);
  if (!token) return false;
  // Token format: base64(email:timestamp:hash)
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const [email, timestamp] = decoded.split(":");
    // Token valid for 24 hours
    if (Date.now() - parseInt(timestamp) > 86400000) return false;
    return !!email;
  } catch { return false; }
}
