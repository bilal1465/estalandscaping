// api/contact.ts
import { randomUUID } from "crypto";
import { insertContactRequestSchema } from "../shared/schema";
import { z } from "zod";
import sgMail from "@sendgrid/mail";

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

// In-memory store (temporary, disappears after function ends)
const contactRequests = new Map<string, any>();

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    try {
      // Validate request body
      const validatedData = insertContactRequestSchema.parse(req.body);

      // Create request object
      const id = randomUUID();
      const request = {
        ...validatedData,
        id,
        createdAt: new Date().toISOString(),
      };
      contactRequests.set(id, request);

      // Build email content
      const html = `
        <h2>New Contact Request</h2>
        <p><b>Name:</b> ${validatedData.firstName} ${validatedData.lastName}</p>
        <p><b>Email:</b> ${validatedData.email}</p>
        <p><b>Phone:</b> ${validatedData.phone}</p>
        <p><b>Service Interested:</b> ${validatedData.service}</p>
        <p><b>Property Size:</b> ${validatedData.propertySize}</p>
        <p><b>Message:</b><br/>${validatedData.message}</p>
        <p><i>Submitted at: ${request.createdAt}</i></p>
      `;

      // Send email with SendGrid
      await sgMail.send({
        to: process.env.SENDGRID_TO_EMAIL as string, // primary inbox
        from: process.env.SENDGRID_FROM_EMAIL as string, // must be verified sender
        subject: "New Contact Request - Esta Landscaping",
        html,
        bcc: "contact.estalandscaping@gmail.com", // copy in Gmail inbox
        replyTo: validatedData.email, // makes "Reply" go to the customer
      });

      return res.status(200).json({ success: true, id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, errors: error.errors });
      }
      console.error("SendGrid error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to send email" });
    }
  }

  if (req.method === "GET") {
    const allRequests = Array.from(contactRequests.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return res.status(200).json(allRequests);
  }

  return res
    .status(405)
    .json({ success: false, message: "Method Not Allowed" });
}
