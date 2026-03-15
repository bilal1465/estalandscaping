# Gmail API setup for ESTA Landscaping contact form

The contact form sends inquiries to **info@estalandscaping.com** using the Gmail API with OAuth 2.0 (refresh token). Follow these steps to get your refresh token and deploy on Vercel.

---

## 1. Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Select your project (or create one) and ensure the **Gmail API** is enabled:
   - **APIs & Services** → **Library** → search “Gmail API” → **Enable**.
3. **APIs & Services** → **Credentials** → create or use an existing **OAuth 2.0 Client ID**:
   - Application type: **Web application**.
   - Authorized redirect URIs: add **`https://developers.google.com/oauthplayground`** (required for the Playground).
   - Optional for your own domain: **`https://estalandscaping.com/callback`**.
4. Note your **Client ID** and **Client Secret**; you’ll use them in env vars.

---

## 2. Get your refresh token (OAuth 2.0 Playground)

1. Open [OAuth 2.0 Playground](https://developers.google.com/oauthplayground).
2. Click the **gear icon** (top right) and check **“Use your own OAuth credentials”**.
3. Enter your **OAuth Client ID** and **OAuth Client secret** from the previous step.
4. In the left panel, under **Step 1 – Select & authorize APIs**, find **Gmail API v1** and select:
   - **`https://www.googleapis.com/auth/gmail.send`**  
   (so the app can send email as **info@estalandscaping.com**).
5. Click **“Authorize APIs”**.
6. Sign in with **info@estalandscaping.com** (your Google Workspace account) and allow access.
7. In **Step 2 – Exchange authorization code for tokens**, click **“Exchange authorization code for tokens”**.
8. In the response, copy the **“Refresh token”** value.  
   This is what you’ll set as **GMAIL_REFRESH_TOKEN** in Vercel (and in `.env.local` for local dev).  
   Store it somewhere safe; the Playground may not show it again.

---

## 3. Environment variables

### Local development

1. Copy the template:
   ```bash
   cp .env.local.example .env.local
   ```
2. Edit `.env.local` and set:
   - **GMAIL_CLIENT_ID** — OAuth 2.0 Client ID from Google Cloud Console.
   - **GMAIL_CLIENT_SECRET** — OAuth 2.0 Client secret.
   - **GMAIL_REDIRECT_URI** — `https://estalandscaping.com/callback` or `https://developers.google.com/oauthplayground` (must match what you used if you use a custom redirect).
   - **GMAIL_REFRESH_TOKEN** — The refresh token from the Playground (Step 2 above).

### Vercel (production)

1. Open your project on [Vercel](https://vercel.com) → **Settings** → **Environment Variables**.
2. Add each variable for **Production** (and optionally Preview/Development):

   | Name                 | Value                                                                 | Notes |
   |----------------------|-----------------------------------------------------------------------|--------|
   | **GMAIL_CLIENT_ID**  | Your OAuth 2.0 Client ID                                              | From Google Cloud Console |
   | **GMAIL_CLIENT_SECRET** | Your OAuth 2.0 Client secret                                     | From Google Cloud Console |
   | **GMAIL_REDIRECT_URI**  | `https://estalandscaping.com/callback` or `https://developers.google.com/oauthplayground` | Must be authorized in the OAuth client |
   | **GMAIL_REFRESH_TOKEN** | The refresh token from OAuth Playground                          | From Step 2 above |

3. **Save** and **redeploy** the project (e.g. **Deployments** → latest deployment → **Redeploy**) so the new variables are used.

---

## 4. How it works

- The **contact/quote form** in the React app sends a **POST** request to **`/api/contact`** (Vercel serverless function).
- **`/api/contact`** (in `api/contact.ts`):
  - Validates the form payload (name, email, phone, service, message, etc.).
  - Uses **Gmail API** with your OAuth2 **refresh token** to obtain an access token and send an email **from** and **to** **info@estalandscaping.com** with the form details.
  - Sets **Reply-To** to the submitter’s email so you can reply directly from Gmail.
- The front end already has **loading state**, **success message**, and **error message**; no change needed there beyond posting to `/api/contact`.

---

## 5. Troubleshooting

- **“Email service is not configured”**  
  One of **GMAIL_CLIENT_ID**, **GMAIL_CLIENT_SECRET**, or **GMAIL_REFRESH_TOKEN** is missing in the environment (Vercel or `.env.local`). Add all three and redeploy / restart.

- **“Invalid grant” / “Token has been expired or revoked”**  
  Generate a new refresh token in the OAuth Playground (repeat Step 2) and update **GMAIL_REFRESH_TOKEN** in Vercel and/or `.env.local**.

- **Emails not received**  
  Check the inbox (and spam) for **info@estalandscaping.com**. Ensure the Gmail API scope **`gmail.send`** was authorized for that account in the Playground.

- **CORS**  
  The API handler sets `Access-Control-Allow-Origin: *` for browser requests; if you use a custom domain, you can restrict this later if needed.
