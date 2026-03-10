#!/usr/bin/env node
/**
 * Test the /api/quote endpoint (quote form submission).
 * Run with: node scripts/test-contact-api.mjs [baseUrl]
 * Example: node scripts/test-contact-api.mjs http://localhost:3000
 * Default baseUrl is http://localhost:3000 (use when running vercel dev).
 *
 * Ensure .env has SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, and QUOTE_NOTIFICATION_EMAIL set.
 */

const baseUrl = process.argv[2] || "http://localhost:3000";
const url = `${baseUrl.replace(/\/$/, "")}/api/quote`;

// Example payload (matches form + user's test example)
const payload = {
  firstName: "Test",
  lastName: "User",
  email: "test@email.com",
  phone: "123-456-7890",
  service: "sod-installation",
  propertySize: "Medium",
  projectDetails: "Testing email delivery",
  message: "Testing email delivery",
};

console.log("Sending test quote request to:", url);
console.log("Payload:", JSON.stringify(payload, null, 2));

fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
})
  .then(async (res) => {
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
    console.log("\nStatus:", res.status, res.statusText);
    console.log("Response:", JSON.stringify(data, null, 2));
    if (res.ok && data.success !== false) {
      console.log("\n✓ Quote request sent successfully. Check info.estalandscaping@gmail.com for the email.");
    } else {
      console.log("\n✗ Request failed. Check SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, and QUOTE_NOTIFICATION_EMAIL in .env.");
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error("\nRequest failed:", err.message);
    console.log("\nStart the API with: npx tsx scripts/run-contact-api.ts (or npx vercel dev).");
    process.exit(1);
  });
