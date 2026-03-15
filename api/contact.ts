// Vercel serverless: POST /api/contact — contact/quote form via Gmail API (OAuth2)
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

const DEFAULT_EMAIL = "info@estalandscaping.com";
function getToEmail() {
  return process.env.GMAIL_EMAIL || DEFAULT_EMAIL;
}

function escapeHtml(s: string): string {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

const ESTA_GREEN = "#2d5a27";

function buildConfirmationEmailHtml(firstName: string, serviceName: string, contactEmail: string): string {
  const safeFirst = escapeHtml(firstName || "there");
  const safeService = escapeHtml(serviceName);
  const safeEmail = escapeHtml(contactEmail);
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; background-color: #f7f7f7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7f7f7; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden;">
          <tr>
            <td style="background: ${ESTA_GREEN}; padding: 28px 32px; text-align: center;">
              <span style="font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: 0.02em;">ESTA Landscaping</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 20px; font-size: 16px;">Hi ${safeFirst},</p>
              <p style="margin: 0 0 20px; font-size: 16px;">Thank you for reaching out. We've received your request for <strong style="color: ${ESTA_GREEN};">${safeService}</strong> and will review it shortly.</p>
              <p style="margin: 0 0 24px; font-size: 16px;">Our team will follow up with you within <strong>24–48 hours</strong>. If you have any questions in the meantime, you can reach us at <a href="mailto:${safeEmail}" style="color: ${ESTA_GREEN}; text-decoration: none;">${safeEmail}</a>.</p>
              <p style="margin: 0; font-size: 16px;">Best regards,<br><strong style="color: ${ESTA_GREEN};">The ESTA Landscaping Team</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  const redirectUri = process.env.GMAIL_REDIRECT_URI || "https://developers.google.com/oauthplayground";

  if (!clientId || !clientSecret || !refreshToken) {
    const missing = [];
    if (!clientId) missing.push("GMAIL_CLIENT_ID");
    if (!clientSecret) missing.push("GMAIL_CLIENT_SECRET");
    if (!refreshToken) missing.push("GMAIL_REFRESH_TOKEN");
    console.error("Missing:", missing.join(", "));
    return res.status(500).json({
      success: false,
      message:
        "Email is not set up yet. Missing: " +
        missing.join(", ") +
        ". Get your refresh token by visiting /api/auth/gmail (sign in with info@estalandscaping.com), then add GMAIL_REFRESH_TOKEN in Vercel → Settings → Environment Variables and redeploy.",
    });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const {
      firstName,
      lastName,
      email,
      phone,
      service,
      message,
      propertySize,
      propertyType,
      timeline,
      address,
      budgetRange,
    } = body || {};

    if (!firstName?.trim() || !lastName?.trim()) {
      return res.status(400).json({ success: false, message: "First name and last name are required." });
    }
    if (!email?.trim()) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).trim())) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }
    if (!phone?.trim()) {
      return res.status(400).json({ success: false, message: "Phone number is required." });
    }
    const serviceVal = (service ?? "").toString().trim();
    if (!serviceVal) {
      return res.status(400).json({ success: false, message: "Please select a service." });
    }
    const projectDetails = String(message ?? "").trim();
    if (!projectDetails) {
      return res.status(400).json({ success: false, message: "Please describe your project." });
    }
    if (projectDetails.length < 10) {
      return res.status(400).json({ success: false, message: "Project description should be at least 10 characters." });
    }

    const serviceLabel: Record<string, string> = {
      "lawn-care": "Lawn Care & Maintenance",
      "sod-installation": "Sod Installation",
      mulching: "Mulching",
      "seasonal-cleanup": "Seasonal Clean-Up",
      "garden-design": "Garden Bed Design",
      "custom-landscaping": "Custom Landscaping",
    };
    const serviceName = serviceLabel[serviceVal] || serviceVal;

    const submittedAt = new Date().toLocaleString("en-CA", {
      timeZone: "America/Edmonton",
      dateStyle: "medium",
      timeStyle: "short",
    });
    const subject = `New Quote Request — ${serviceName} — ${firstName} ${lastName}`;

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h2 style="color: #2d5a27; margin-bottom: 8px;">New Quote Request</h2>
  <p style="color: #666; font-size: 14px; margin-bottom: 24px;">Submitted at ${escapeHtml(submittedAt)}</p>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(String(firstName))} ${escapeHtml(String(lastName))}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="mailto:${escapeHtml(String(email))}">${escapeHtml(String(email))}</a></td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="tel:${escapeHtml(String(phone))}">${escapeHtml(String(phone))}</a></td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Service</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(serviceName)}</td></tr>
    ${propertySize ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Property size</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(String(propertySize))}</td></tr>` : ""}
    ${propertyType ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Property type</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(String(propertyType))}</td></tr>` : ""}
    ${timeline ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Timeline</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(String(timeline))}</td></tr>` : ""}
    ${address ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Address / area</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(String(address))}</td></tr>` : ""}
    ${budgetRange ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Budget range</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(String(budgetRange))}</td></tr>` : ""}
  </table>
  <p style="margin-top: 20px;"><strong>Project details</strong></p>
  <p style="white-space: pre-wrap; background: #f5f5f5; padding: 12px; border-radius: 8px;">${escapeHtml(projectDetails)}</p>
</body>
</html>`;

    const text = [
      `New Quote Request — ${serviceName}`,
      `Submitted: ${submittedAt}`,
      "",
      `Name: ${firstName} ${lastName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Service: ${serviceName}`,
      propertySize ? `Property size: ${propertySize}` : "",
      propertyType ? `Property type: ${propertyType}` : "",
      timeline ? `Timeline: ${timeline}` : "",
      address ? `Address: ${address}` : "",
      budgetRange ? `Budget: ${budgetRange}` : "",
      "",
      "Project details:",
      projectDetails,
    ]
      .filter(Boolean)
      .join("\n");

    const toEmail = getToEmail();
    const boundary = "----=_Part_" + Date.now();
    const rawMessage = [
      `From: ${toEmail}`,
      `To: ${toEmail}`,
      `Reply-To: ${String(email).trim()}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      "",
      `--${boundary}`,
      "Content-Type: text/plain; charset=UTF-8",
      "",
      text,
      `--${boundary}`,
      "Content-Type: text/html; charset=UTF-8",
      "",
      html.trim(),
      `--${boundary}--`,
    ].join("\r\n");

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: base64UrlEncode(rawMessage),
      },
    });

    // Send confirmation email to the client (non-blocking: don't fail the request if this fails)
    const clientEmail = String(email).trim();
    try {
      const confirmSubject = "Thanks for reaching out – ESTA Landscaping";
      const confirmHtml = buildConfirmationEmailHtml(
        String(firstName).trim(),
        serviceName,
        getToEmail(),
      );
      const confirmRaw = [
        `From: ${getToEmail()}`,
        `To: ${clientEmail}`,
        `Subject: ${confirmSubject}`,
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
        "",
        confirmHtml,
      ].join("\r\n");
      await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: base64UrlEncode(confirmRaw),
        },
      });
    } catch (confirmErr: unknown) {
      console.error("Confirmation email failed (main email was still sent):", confirmErr);
    }

    return res.status(200).json({
      success: true,
      message: "Your message has been sent. We'll get back to you soon.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Gmail API error:", msg);
    return res.status(500).json({
      success: false,
      message: `Something went wrong while sending your request. Please try again or contact us directly at ${getToEmail()}.`,
    });
  }
}
