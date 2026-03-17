// Vercel serverless: POST /api/contact — contact/quote form via Gmail API (OAuth2)
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

const DEFAULT_EMAIL = "info@estalandscaping.com";
const DISPLAY_PHONE = "(825) 733-2708";

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

function buildConfirmationEmailHtml(firstName: string, serviceName: string, companyEmail: string): string {
  const safeFirst = escapeHtml(firstName || "there");
  const safeService = escapeHtml(serviceName);
  const safeEmail = escapeHtml(companyEmail);
  const safePhone = escapeHtml(DISPLAY_PHONE);
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>We Received Your Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f5f5f0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f0; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background: ${ESTA_GREEN}; padding: 32px 40px; text-align: center;">
              <span style="font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: 0.04em;">ESTA Landscaping</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 40px 32px;">
              <p style="margin: 0 0 24px; font-size: 18px; font-weight: 600; color: #1a1a1a;">Hi ${safeFirst},</p>
              <p style="margin: 0 0 20px; font-size: 16px; color: #444;">Thank you for reaching out to ESTA Landscaping. We've received your quote request and appreciate you considering us for your project.</p>
              <p style="margin: 0 0 20px; font-size: 16px; color: #444;">Our team will review the details of your <strong style="color: ${ESTA_GREEN};">${safeService}</strong> request and get back to you within <strong>24 to 48 hours</strong>.</p>
              <p style="margin: 0 0 28px; font-size: 16px; color: #444;">If your request is urgent or you have any questions in the meantime, please don't hesitate to contact us directly:</p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 0 28px; background: #f8f8f6; border-radius: 8px; border: 1px solid #e8e6e0;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: #666;">Email</p>
                    <p style="margin: 0; font-size: 16px;"><a href="mailto:${safeEmail}" style="color: ${ESTA_GREEN}; text-decoration: none; font-weight: 500;">${safeEmail}</a></p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 20px 16px;">
                    <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: #666;">Phone</p>
                    <p style="margin: 0; font-size: 16px;"><a href="tel:${safePhone}" style="color: ${ESTA_GREEN}; text-decoration: none; font-weight: 500;">${safePhone}</a></p>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; font-size: 16px; color: #444;">We look forward to helping you create the outdoor space you have in mind.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px 32px; border-top: 1px solid #eee; background: #fafaf8;">
              <p style="margin: 0; font-size: 16px; font-weight: 600; color: ${ESTA_GREEN};">Best regards,</p>
              <p style="margin: 4px 0 0; font-size: 16px; color: #555;">The ESTA Landscaping Team</p>
            </td>
          </tr>
        </table>
        <p style="margin: 24px 0 0; font-size: 12px; color: #888;">ESTA Landscaping &middot; Calgary, AB</p>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

type InternalNotificationData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceName: string;
  propertySize: string;
  propertyType: string;
  timeline: string;
  address: string;
  budgetRange: string;
  projectDetails: string;
  submittedAt: string;
};

function buildInternalNotificationHtml(d: InternalNotificationData): string {
  const fullName = `${escapeHtml(d.firstName)} ${escapeHtml(d.lastName)}`;
  const rows: string[] = [
    `<tr><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-size: 13px; color: #666; width: 140px;">Customer name</td><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-size: 15px; color: #1a1a1a;">${fullName}</td></tr>`,
    `<tr><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-size: 13px; color: #666;">Email</td><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-size: 15px;"><a href="mailto:${escapeHtml(d.email)}" style="color: ${ESTA_GREEN}; text-decoration: none;">${escapeHtml(d.email)}</a></td></tr>`,
    `<tr><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-size: 13px; color: #666;">Phone</td><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-size: 15px;"><a href="tel:${escapeHtml(d.phone)}" style="color: ${ESTA_GREEN}; text-decoration: none;">${escapeHtml(d.phone)}</a></td></tr>`,
    `<tr><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-size: 13px; color: #666;">Service requested</td><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-size: 15px; font-weight: 600; color: ${ESTA_GREEN};">${escapeHtml(d.serviceName)}</td></tr>`,
  ];
  if (d.propertySize) rows.push(`<tr><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-size: 13px; color: #666;">Property size</td><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-size: 15px; color: #1a1a1a;">${escapeHtml(d.propertySize)}</td></tr>`);
  if (d.propertyType) rows.push(`<tr><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-size: 13px; color: #666;">Property type</td><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-size: 15px; color: #1a1a1a;">${escapeHtml(d.propertyType)}</td></tr>`);
  if (d.timeline) rows.push(`<tr><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-size: 13px; color: #666;">Timeline</td><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-size: 15px; color: #1a1a1a;">${escapeHtml(d.timeline)}</td></tr>`);
  if (d.address) rows.push(`<tr><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-size: 13px; color: #666;">Address / area</td><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-size: 15px; color: #1a1a1a;">${escapeHtml(d.address)}</td></tr>`);
  if (d.budgetRange) rows.push(`<tr><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-size: 13px; color: #666;">Budget range</td><td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-size: 15px; color: #1a1a1a;">${escapeHtml(d.budgetRange)}</td></tr>`);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>New Quote Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f0; padding: 32px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background: ${ESTA_GREEN}; padding: 28px 40px; text-align: center;">
              <span style="font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: 0.04em;">ESTA Landscaping</span>
              <p style="margin: 8px 0 0; font-size: 13px; color: rgba(255,255,255,0.9); font-weight: 400;">New quote request</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 40px 24px; text-align: right;">
              <span style="font-size: 13px; color: #888;">Submitted ${escapeHtml(d.submittedAt)}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e8e6e0; border-radius: 8px; overflow: hidden;">
                ${rows.join("")}
              </table>
              <p style="margin: 24px 0 8px; font-size: 13px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.04em;">Project details</p>
              <div style="background: #f8f8f6; border: 1px solid #e8e6e0; border-radius: 8px; padding: 16px 20px;">
                <p style="margin: 0; font-size: 15px; color: #1a1a1a; white-space: pre-wrap;">${escapeHtml(d.projectDetails)}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px 28px; border-top: 1px solid #eee; background: #fafaf8;">
              <p style="margin: 0; font-size: 12px; color: #888;">Reply directly to the customer's email to respond.</p>
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
    // ASCII-only subject to avoid encoding issues (e.g. em dash showing as mojibake in some clients)
    const subject = `New Quote Request - ${serviceName} - ${firstName} ${lastName}`;

    const html = buildInternalNotificationHtml({
      firstName: String(firstName ?? ""),
      lastName: String(lastName ?? ""),
      email: String(email ?? ""),
      phone: String(phone ?? ""),
      serviceName,
      propertySize: propertySize ? String(propertySize) : "",
      propertyType: propertyType ? String(propertyType) : "",
      timeline: timeline ? String(timeline) : "",
      address: address ? String(address) : "",
      budgetRange: budgetRange ? String(budgetRange) : "",
      projectDetails,
      submittedAt,
    });

    const text = [
      `New Quote Request - ${serviceName}`,
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
      "Content-Transfer-Encoding: 8bit",
      `Content-Type: multipart/alternative; boundary="${boundary}"; charset=utf-8`,
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
      const confirmSubject = "We Received Your Request - ESTA Landscaping";
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
        "Content-Transfer-Encoding: 8bit",
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
