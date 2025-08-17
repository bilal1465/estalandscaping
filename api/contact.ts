// vercel/functions/api/contact.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { firstName, lastName, email, phone, service, propertySize, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const msg = {
      to: "info.estalandscaping@gmail.com", // your business inbox
      from: process.env.SENDGRID_FROM_EMAIL!, // must be a verified sender/domain
      subject: `New Contact Request from ${firstName} ${lastName}`,
      text: `
New message from your website:

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone || "N/A"}
Service: ${service || "N/A"}
Property Size: ${propertySize || "N/A"}

Message:
${message}
      `,
      html: `
        <h2>New Website Contact Request</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Service:</strong> ${service || "N/A"}</p>
        <p><strong>Property Size:</strong> ${propertySize || "N/A"}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `
    };

    await sgMail.send(msg);

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("SendGrid error:", err.response?.body || err.message);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
