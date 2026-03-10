// Vercel serverless: POST /api/quote — quote form submission
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sendQuoteEmail } from "../server/services/emailService";

const QUOTE_NOTIFICATION_EMAIL = "info.estalandscaping@gmail.com";

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

    // Validation
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
    if (!service?.trim()) {
      return res.status(400).json({ success: false, message: "Please select a service." });
    }
    const projectDetails = String(message ?? "").trim();
    if (!projectDetails) {
      return res.status(400).json({ success: false, message: "Please describe your project." });
    }
    if (projectDetails.length < 10) {
      return res.status(400).json({ success: false, message: "Project description should be at least 10 characters." });
    }

    const formData = {
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      service: String(service).trim(),
      propertySize: propertySize ? String(propertySize).trim() : undefined,
      propertyType: propertyType ? String(propertyType).trim() : undefined,
      timeline: timeline ? String(timeline).trim() : undefined,
      address: address ? String(address).trim() : undefined,
      budgetRange: budgetRange ? String(budgetRange).trim() : undefined,
      message: projectDetails,
      projectDetails,
    };

    await sendQuoteEmail(formData);

    return res.status(200).json({
      success: true,
      message: "Quote request sent successfully",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    const responseBody = (err as { response?: { body?: unknown } })?.response?.body;
    console.error("Quote email error:", responseBody || msg);

    return res.status(500).json({
      success: false,
      message:
        process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL
          ? "Failed to send quote request. Please try again or contact us directly."
          : "Email service is not configured. Please try again later or contact us directly.",
    });
  }
}
