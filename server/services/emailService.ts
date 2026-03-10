/**
 * Reusable SendGrid email service for quote requests.
 * Reads SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, QUOTE_NOTIFICATION_EMAIL from env.
 */

import sgMail from "@sendgrid/mail";

const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
  sgMail.setApiKey(apiKey);
}

function escapeHtml(s: string): string {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export interface QuoteEmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  propertySize?: string;
  propertyType?: string;
  timeline?: string;
  address?: string;
  budgetRange?: string;
  /** Project description (or use projectDetails for compatibility) */
  message?: string;
  projectDetails?: string;
}

const SERVICE_LABELS: Record<string, string> = {
  "lawn-care": "Lawn Care & Maintenance",
  "sod-installation": "Sod Installation",
  mulching: "Mulching",
  "seasonal-cleanup": "Seasonal Clean-Up",
  "garden-design": "Garden Bed Design",
  "custom-landscaping": "Custom Landscaping",
};

function getServiceLabel(service: string): string {
  return SERVICE_LABELS[String(service)] || service;
}

/**
 * Send quote request email to the business inbox.
 * @throws if SendGrid is not configured or send fails
 */
export async function sendQuoteEmail(data: QuoteEmailData): Promise<void> {
  const to = process.env.QUOTE_NOTIFICATION_EMAIL || process.env.SENDGRID_FROM_EMAIL || "info.estalandscaping@gmail.com";
  const from = process.env.SENDGRID_FROM_EMAIL;
  if (!from) {
    throw new Error("SENDGRID_FROM_EMAIL is not set");
  }
  if (!apiKey) {
    throw new Error("SENDGRID_API_KEY is not set");
  }

  const projectDetails = data.message ?? data.projectDetails ?? "";
  const serviceLabel = getServiceLabel(data.service);
  const submittedAt = new Date().toLocaleString("en-CA", {
    timeZone: "America/Edmonton",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const subject = `New Quote Request — ${serviceLabel} — ${data.firstName} ${data.lastName}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h2 style="color: #2d5a27; margin-bottom: 8px;">New Quote Request</h2>
  <p style="color: #666; font-size: 14px; margin-bottom: 24px;">Submitted at ${escapeHtml(submittedAt)}</p>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Service</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(serviceLabel)}</td></tr>
    ${data.propertySize ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Property size</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.propertySize)}</td></tr>` : ""}
    ${data.propertyType ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Property type</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.propertyType)}</td></tr>` : ""}
    ${data.timeline ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Timeline</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.timeline)}</td></tr>` : ""}
    ${data.address ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Address / area</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.address)}</td></tr>` : ""}
    ${data.budgetRange ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Budget range</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.budgetRange)}</td></tr>` : ""}
  </table>
  <p style="margin-top: 20px;"><strong>Project details</strong></p>
  <p style="white-space: pre-wrap; background: #f5f5f5; padding: 12px; border-radius: 8px;">${escapeHtml(projectDetails)}</p>
</body>
</html>`;

  const text = `
New Quote Request — ${serviceLabel}
Submitted: ${submittedAt}

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Service: ${serviceLabel}
${data.propertySize ? `Property size: ${data.propertySize}\n` : ""}${data.propertyType ? `Property type: ${data.propertyType}\n` : ""}${data.timeline ? `Timeline: ${data.timeline}\n` : ""}${data.address ? `Address: ${data.address}\n` : ""}${data.budgetRange ? `Budget: ${data.budgetRange}\n` : ""}

Project details:
${projectDetails}
`;

  await sgMail.send({
    to,
    from,
    replyTo: String(data.email).trim(),
    subject,
    text,
    html,
  });
}
