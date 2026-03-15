// POST /api/auth/gmail/tokens — exchange authorization code for refresh token
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const redirectUri = process.env.GMAIL_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return res.status(500).json({
      error: "GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, or GMAIL_REDIRECT_URI is not set.",
    });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
  const code = body.code?.trim();

  if (!code) {
    return res.status(400).json({ error: "Missing code in request body." });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      return res.status(400).json({
        error:
          "No refresh_token in response. Revoke app access at https://myaccount.google.com/permissions and run the flow again with prompt=consent.",
        access_token: tokens.access_token ? "(present)" : undefined,
      });
    }

    return res.status(200).json({
      success: true,
      refresh_token: tokens.refresh_token,
      message:
        "Add GMAIL_REFRESH_TOKEN to .env.local and to Vercel → Settings → Environment Variables, then redeploy.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Token exchange error:", msg);
    return res.status(500).json({
      error: "Failed to exchange code for tokens.",
      details: String(msg),
    });
  }
}
