// Vercel serverless: /api/contact
import type { VercelRequest, VercelResponse } from "@vercel/node";
import sgMail from "@sendgrid/mail";

const BUSINESS_EMAIL = "info.estalandscaping@gmail.com";

function escapeHtml(s: string): string {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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

  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    console.error("Missing SENDGRID_API_KEY or SENDGRID_FROM_EMAIL");
    return res.status(500).json({
      error: "Email service is not configured. Please try again later or contact us directly.",
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
      return res.status(400).json({ error: "First name and last name are required." });
    }
    if (!email?.trim()) {
      return res.status(400).json({ error: "Email is required." });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).trim())) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (!phone?.trim()) {
      return res.status(400).json({ error: "Phone number is required." });
    }
    if (!service?.trim()) {
      return res.status(400).json({ error: "Please select a service." });
    }
    if (!message?.trim()) {
      return res.status(400).json({ error: "Please describe your project." });
    }
    if (String(message).trim().length < 10) {
      return res.status(400).json({ error: "Project description should be at least 10 characters." });
    }

    sgMail.setApiKey(apiKey);

    const serviceLabel =
      {
        "lawn-care": "Lawn Care & Maintenance",
        "sod-installation": "Sod Installation",
        mulching: "Mulching",
        "seasonal-cleanup": "Seasonal Clean-Up",
        "garden-design": "Garden Bed Design",
        "custom-landscaping": "Custom Landscaping",
      }[String(service)] || service;

    const submittedAt = new Date().toLocaleString("en-CA", {
      timeZone: "America/Edmonton",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const subject = `New Quote Request — ${serviceLabel} — ${firstName} ${lastName}`;

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h2 style="color: #2d5a27; margin-bottom: 8px;">New Quote Request</h2>
  <p style="color: #666; font-size: 14px; margin-bottom: 24px;">Submitted at ${escapeHtml(submittedAt)}</p>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(firstName)} ${escapeHtml(lastName)}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Service</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(serviceLabel)}</td></tr>
    ${propertySize ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Property size</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(propertySize)}</td></tr>` : ""}
    ${propertyType ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Property type</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(propertyType)}</td></tr>` : ""}
    ${timeline ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Timeline</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(timeline)}</td></tr>` : ""}
    ${address ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Address / area</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(address)}</td></tr>` : ""}
    ${budgetRange ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Budget range</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(budgetRange)}</td></tr>` : ""}
  </table>
  <p style="margin-top: 20px;"><strong>Project details</strong></p>
  <p style="white-space: pre-wrap; background: #f5f5f5; padding: 12px; border-radius: 8px;">${escapeHtml(message)}</p>
</body>
</html>`;

    const text = `
New Quote Request — ${serviceLabel}
Submitted: ${submittedAt}

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Service: ${serviceLabel}
${propertySize ? `Property size: ${propertySize}\n` : ""}${propertyType ? `Property type: ${propertyType}\n` : ""}${timeline ? `Timeline: ${timeline}\n` : ""}${address ? `Address: ${address}\n` : ""}${budgetRange ? `Budget: ${budgetRange}\n` : ""}

Project details:
${message}
`;

    await sgMail.send({
      to: BUSINESS_EMAIL,
      from: fromEmail,
      replyTo: String(email).trim(),
      subject,
      text,
      html,
    });

    // Optional: send confirmation to customer
    const sendConfirmation = process.env.SENDGRID_SEND_CONFIRMATION === "true";
    if (sendConfirmation) {
      await sgMail.send({
        to: String(email).trim(),
        from: fromEmail,
        subject: "We received your quote request — ESTA Landscaping",
        text: "Thanks for contacting ESTA Landscaping. We've received your request and will get back to you as soon as possible.",
        html: "<p>Thanks for contacting ESTA Landscaping. We've received your request and will get back to you as soon as possible.</p>",
      });
    }

    return res.status(200).json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const response = (err as { response?: { body?: unknown } })?.response?.body;
    console.error("SendGrid error:", response || message);
    return res.status(500).json({
      error:
        "Something went wrong while sending your request. Please try again or contact us directly at " +
        BUSINESS_EMAIL,
    });
  }
}
