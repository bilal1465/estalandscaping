// GET /api/gmail-status — check if Gmail is configured (for debugging)
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const missing: string[] = [];
  if (!process.env.GMAIL_CLIENT_ID) missing.push("GMAIL_CLIENT_ID");
  if (!process.env.GMAIL_CLIENT_SECRET) missing.push("GMAIL_CLIENT_SECRET");
  if (!process.env.GMAIL_REFRESH_TOKEN) missing.push("GMAIL_REFRESH_TOKEN");
  if (!process.env.GMAIL_REDIRECT_URI) missing.push("GMAIL_REDIRECT_URI (optional but recommended)");

  const configured = missing.length === 0;
  const toEmail = process.env.GMAIL_EMAIL || "info@estalandscaping.com";

  return res.status(200).json({
    configured,
    toEmail,
    missing,
    nextStep: !configured
      ? "Add the missing variables in Vercel → Settings → Environment Variables. Get GMAIL_REFRESH_TOKEN by visiting https://estalandscaping.com/api/auth/gmail (sign in with info@estalandscaping.com, then copy the token from the callback page)."
      : "Gmail is configured. Contact form submissions should send to " + toEmail,
  });
}
