// GET or POST /api/test-email — send a test email to GMAIL_EMAIL (info@estalandscaping.com)
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

const DEFAULT_EMAIL = "info@estalandscaping.com";

function getToEmail() {
  return process.env.GMAIL_EMAIL || DEFAULT_EMAIL;
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  const redirectUri = process.env.GMAIL_REDIRECT_URI || "https://estalandscaping.com/callback";
  const toEmail = getToEmail();

  if (!clientId || !clientSecret || !refreshToken) {
    return res.status(500).json({
      success: false,
      message:
        "Gmail not configured. Set GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN (run the one-time auth flow first).",
    });
  }

  const subject = "Test - Contact Form Working";
  const bodyText =
    "Your ESTA Landscaping contact form is fully configured!";
  const bodyHtml = `<p>Your ESTA Landscaping contact form is fully configured!</p>`;

  const rawMessage = [
    `From: ${toEmail}`,
    `To: ${toEmail}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
    "",
    bodyHtml,
  ].join("\r\n");

  try {
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: base64UrlEncode(rawMessage),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Test email sent successfully to " + toEmail,
      to: toEmail,
      subject,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Test email error:", msg);
    return res.status(500).json({
      success: false,
      message: "Failed to send test email.",
      details: String(msg),
    });
  }
}
