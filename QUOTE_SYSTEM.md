# ESTA Landscaping — Quote / Inquiry System

## Summary of changes

- **UI:** The basic contact form was replaced with a premium **multi-step “Request a Quote”** flow:
  - **Step 1** — Contact details (first name, last name, email, phone)
  - **Step 2** — Service details (visual service cards, optional property size, property type, timeline)
  - **Step 3** — Project information (description, optional address, optional budget range)
  - **Step 4** — Review and submit
- Progress indicator, trust badges (No obligation, 24h response, Calgary, 150+ projects), and a contact card (phone, email, “Typically responds within 24 hours”) are included.
- **Validation:** Step-level validation (required fields per step) and full schema validation on submit. User-friendly error messages.
- **API:** The `/api/contact` serverless handler was refactored to accept the full quote payload, validate it, and send a structured HTML email to the business inbox. Optional customer confirmation email is supported via env.
- **Email:** All quote requests are sent to **info.estalandscaping@gmail.com** with a clear subject and body (all fields, submission time). HTML is escaped for safety.
- **Reliability:** Missing env vars and SendGrid errors return clear JSON error messages; frontend shows loading, success, and error states (no silent failure).

---

## Where the form submission logic lives

| Layer | Location | Role |
|-------|----------|------|
| **Frontend** | `client/src/components/quote-request-section.tsx` | Multi-step form UI, `submitQuoteRequest()` which `POST`s to `/api/contact`, loading/success/error state |
| **API** | `api/contact.ts` (Vercel serverless) | Handles POST, validates body, sends email via SendGrid, returns `{ success: true }` or `{ error: "..." }` |
| **Schema** | `shared/schema.ts` | `quoteRequestSchema` and `QuoteRequest` type used for validation on client and reference for API |

The home page uses **QuoteRequestSection** instead of the old ContactSection (`client/src/pages/home.tsx`). The “Request Quote Online” CTA in `quote-section.tsx` scrolls to `#contact`, which is the new quote section.

---

## Environment variables required

Set these in your Vercel project (or local env for serverless):

| Variable | Required | Description |
|----------|----------|-------------|
| `SENDGRID_API_KEY` | **Yes** | SendGrid API key (create in SendGrid dashboard). |
| `SENDGRID_FROM_EMAIL` | **Yes** | Verified sender email in SendGrid (e.g. `noreply@yourdomain.com` or a verified single sender). Must be verified or emails will not send. |
| `SENDGRID_SEND_CONFIRMATION` | No | Set to `"true"` to send an automatic confirmation email to the customer after a successful quote request. |
| `VITE_API_URL` | No | If the frontend is served from a different origin than the API, set this to the API base URL so `fetch` hits the correct host. Leave empty when frontend and API are same origin (e.g. Vercel deployment). |

---

## Email service

- **Provider:** **SendGrid** (`@sendgrid/mail`).
- **To:** All quote requests go to **info.estalandscaping@gmail.com** (hardcoded in `api/contact.ts`).
- **From / Reply-To:** From address is `SENDGRID_FROM_EMAIL`; reply-to is set to the customer’s email so you can reply directly from your inbox.

---

## Making production inbox delivery reliable

1. **SendGrid account and API key**
   - Sign up at [sendgrid.com](https://sendgrid.com) and create an API key with “Mail Send” permission.
   - Add `SENDGRID_API_KEY` to your Vercel project (and optionally locally).

2. **Verify sender identity**
   - In SendGrid: **Settings → Sender Authentication**.
   - Either verify a single sender (email address) or authenticate a domain.
   - Set `SENDGRID_FROM_EMAIL` to that verified sender (e.g. `noreply@yourdomain.com` or a Gmail you verified).

3. **Deploy and test**
   - Deploy to Vercel with the env vars set.
   - Submit a test quote from the live site.
   - Check:
     - **info.estalandscaping@gmail.com** receives the structured quote email.
     - If `SENDGRID_SEND_CONFIRMATION=true`, the customer receives the auto-reply.

4. **If emails don’t arrive**
   - Check Vercel function logs for SendGrid errors (e.g. 403 = invalid API key or sender not verified).
   - In SendGrid dashboard: **Activity** to see bounces/blocks.
   - Ensure the “From” email is exactly the verified sender and that you’re not hitting SendGrid’s free-tier limits.

5. **Optional: customer confirmation**
   - Set `SENDGRID_SEND_CONFIRMATION=true` in Vercel if you want automatic “We’ve received your request” emails to customers.

---

## Testing the quote form and email flow

### Option A — Local API server (no Vercel CLI)

1. **Add SendGrid credentials**  
   Copy `.env.example` to `.env` and set `SENDGRID_API_KEY` and `SENDGRID_FROM_EMAIL`.

2. **Start the local contact API** (one terminal):
   ```bash
   cd estalandscaping && npx tsx scripts/run-contact-api.ts
   ```
   Server runs at `http://localhost:3001/api/contact`.

3. **Send a test request** (another terminal):
   ```bash
   cd estalandscaping && node scripts/test-contact-api.mjs http://localhost:3001
   ```
   With valid credentials you should see success and an email at **info.estalandscaping@gmail.com**.

4. **Test the form in the browser**  
   Run `npm run dev`, set `VITE_API_URL=http://localhost:3001` so the form posts to the local API, then submit the quote form.

### Option B — Full stack with Vercel CLI

Run `npx vercel dev`, then open the app and submit the form or run `node scripts/test-contact-api.mjs http://localhost:3000`.

### Verified

- Without SendGrid env vars the API returns **500** with a clear “Email service is not configured” message.
- With valid env vars it sends the email and returns **200** `{ "success": true }`.

---

## Optional: quick inquiry vs full quote

The current implementation is the **full multi-step quote flow** only. A separate “Quick Inquiry” (short form for callback) was not added; it can be added later as a second path (e.g. tab or link that shows a minimal form and posts to the same or a dedicated endpoint).
