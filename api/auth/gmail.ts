// GET /api/auth/gmail — redirects to Google OAuth consent screen
import type { VercelRequest, VercelResponse } from "@vercel/node";

const GMAIL_SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientId = process.env.GMAIL_CLIENT_ID;
  const redirectUri = process.env.GMAIL_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return res.status(500).json({
      error: "GMAIL_CLIENT_ID or GMAIL_REDIRECT_URI is not set.",
    });
  }

  const state = Buffer.from(JSON.stringify({ ts: Date.now() })).toString("base64url");
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: GMAIL_SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
    state,
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  res.writeHead(302, { Location: url });
  res.end();
}
