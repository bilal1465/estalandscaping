# SendGrid setup — ESTA Landscaping quote emails

## 1. Install SendGrid

Already in the project:

```bash
npm install @sendgrid/mail
```

## 2. Environment variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and set:

- **SENDGRID_API_KEY** — Your SendGrid API key (from SendGrid dashboard → Settings → API Keys).  
  **Do not commit this file or expose the key on the frontend.**

- **SENDGRID_FROM_EMAIL** — `info.estalandscaping@gmail.com` (must be verified in SendGrid as a sender).

- **QUOTE_NOTIFICATION_EMAIL** — `info.estalandscaping@gmail.com` (where quote emails are sent).

## 3. Verify sender in SendGrid

SendGrid requires the “from” address to be verified:

1. Go to [SendGrid](https://sendgrid.com) → **Settings** → **Sender Authentication**.
2. Use **Single Sender Verification** and add `info.estalandscaping@gmail.com`.
3. Complete the verification (email link). Then use that address as `SENDGRID_FROM_EMAIL`.

## 4. Test email delivery

**Option A — Local API**

```bash
# Terminal 1: start the API (loads .env)
npx tsx scripts/run-contact-api.ts

# Terminal 2: send a test quote
node scripts/test-contact-api.mjs http://localhost:3001
```

**Option B — Deployed (Vercel)**

In the Vercel project, set `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, and `QUOTE_NOTIFICATION_EMAIL` in **Environment Variables**, then deploy. Submit the quote form on the live site.

## 5. Final checklist

- [ ] `@sendgrid/mail` is installed
- [ ] `.env` has `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, `QUOTE_NOTIFICATION_EMAIL` (do not commit `.env`)
- [ ] Sender `info.estalandscaping@gmail.com` is verified in SendGrid
- [ ] Quote form submits to `POST /api/quote`
- [ ] Success response shows “Quote request sent successfully”
- [ ] Test email arrives at `info.estalandscaping@gmail.com`
- [ ] No API keys or secrets are used in frontend code
