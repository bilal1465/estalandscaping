# Why you're not receiving contact form emails — fix checklist

Emails from the form go to **info@estalandscaping.com**. If you're not receiving them, follow these steps.

---

## Step 1: Check what’s missing

Open this URL in your browser (use your live site URL if deployed):

- **Production:** https://estalandscaping.com/api/gmail-status  
- **Local:** http://localhost:3001/api/gmail-status (with your local API running)

You’ll see something like:

```json
{
  "configured": false,
  "toEmail": "info@estalandscaping.com",
  "missing": ["GMAIL_REFRESH_TOKEN"],
  "nextStep": "Add the missing variables..."
}
```

If **configured** is `false`, the **missing** array lists the env vars that are not set. Fix those first.

---

## Step 2: Get the refresh token (one-time)

You must have **GMAIL_REFRESH_TOKEN** set. To get it:

1. **Google Cloud Console**  
   - Go to [Google Cloud Console](https://console.cloud.google.com/) → your project.  
   - **APIs & Services** → **Credentials** → your OAuth 2.0 Client.  
   - Under **Authorized redirect URIs** add: **`https://estalandscaping.com/callback`**  
   - Save.

2. **Start the OAuth flow**  
   Open in your browser (use your real domain if different):

   **https://estalandscaping.com/api/auth/gmail**

3. **Sign in** with **info@estalandscaping.com** and allow the app to send email.

4. **Copy the refresh token**  
   You’ll be redirected to a page that shows your **refresh token**. Copy the whole value.

5. **Add it in Vercel**  
   - Vercel → your project → **Settings** → **Environment Variables**.  
   - Add **GMAIL_REFRESH_TOKEN** with the pasted value.  
   - Save.

6. **Redeploy**  
   **Deployments** → latest deployment → **⋮** → **Redeploy**.

---

## Step 3: Confirm env vars on Vercel

In **Settings → Environment Variables** you should have:

- **GMAIL_CLIENT_ID**
- **GMAIL_CLIENT_SECRET**
- **GMAIL_REDIRECT_URI** = `https://estalandscaping.com/callback`
- **GMAIL_EMAIL** = `info@estalandscaping.com`
- **GMAIL_REFRESH_TOKEN** = (the token from Step 2)

Redeploy after any change to env vars.

---

## Step 4: Test again

1. Open **https://estalandscaping.com/api/gmail-status** again.  
   You should see **"configured": true**.

2. Send a test from the site: fill out the contact/quote form and submit.

3. Check **info@estalandscaping.com**:
   - **Inbox** and **Spam / Junk**.
   - If using Google Workspace, also check **Promotions** and **Updates**.

---

## Step 5: Optional — send a test email from the API

Open in your browser:

**https://estalandscaping.com/api/test-email**

If Gmail is configured, you’ll get a JSON success response and a test email at **info@estalandscaping.com** with subject **"Test - Contact Form Working"**. Check spam if you don’t see it.

---

## If you still don’t receive emails

- **Form shows an error**  
  Read the red message on the form. It will mention the missing env var (e.g. GMAIL_REFRESH_TOKEN). Add it in Vercel and redeploy.

- **Form says “Message sent” but no email**  
  - Check **Spam** and other tabs for **info@estalandscaping.com**.  
  - Confirm **/api/gmail-status** returns **"configured": true**.  
  - Try **/api/test-email** and see if that email arrives.

- **“Invalid grant” or “Token expired”**  
  The refresh token may be revoked. Do **Step 2** again (visit **/api/auth/gmail**, sign in, copy the new token, update **GMAIL_REFRESH_TOKEN** in Vercel, redeploy).
