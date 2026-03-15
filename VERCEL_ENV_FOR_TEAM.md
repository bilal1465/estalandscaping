# Add Gmail env vars in Vercel (for the person who manages Vercel)

So the contact form on **estalandscaping.com** can send emails to **info@estalandscaping.com** via Gmail, these 3 environment variables must be set in the Vercel project. **Do not put them in code or in vercel.json** — they are secrets.

## Steps

1. **Open the Vercel project**  
   Log in to [vercel.com](https://vercel.com) and open the project that deploys **estalandscaping.com**.

2. **Go to Environment Variables**  
   **Project → Settings → Environment Variables** (or **Settings** in the top nav, then **Environment Variables** in the left sidebar).

3. **Add these 3 variables**  
   Use the same values as in the project’s `.env.local` (the developer who ran the Gmail OAuth flow has them).

   | Name | Value | Notes |
   |------|--------|--------|
   | **GMAIL_CLIENT_ID** | *(from .env.local)* | Google OAuth 2.0 Client ID |
   | **GMAIL_CLIENT_SECRET** | *(from .env.local)* | Google OAuth 2.0 Client secret |
   | **GMAIL_REFRESH_TOKEN** | *(from .env.local)* | Refresh token from the one-time Gmail auth flow |

   - Click **Add** (or **Add New**) for each.
   - **Name**: type exactly `GMAIL_CLIENT_ID`, then `GMAIL_CLIENT_SECRET`, then `GMAIL_REFRESH_TOKEN`.
   - **Value**: paste the value from `.env.local` for each.
   - **Environments**: leave **Production** (and **Preview** if you want contact form to work on preview deploys) checked.
   - Save.

4. **Redeploy**  
   After saving the variables, trigger a new deployment (**Deployments** → … on latest deployment → **Redeploy**) so the new env vars are used.

5. **Verify**  
   - Open **https://estalandscaping.com/api/gmail-status** — it should show `"configured": true`.
   - Open **https://estalandscaping.com/api/test-email** — it should return success and a test email should arrive at **info@estalandscaping.com**.

---

**Summary for your friend:**  
Add these 3 env vars in Vercel → Project → **Settings** → **Environment Variables**: **GMAIL_CLIENT_ID**, **GMAIL_CLIENT_SECRET**, **GMAIL_REFRESH_TOKEN**. Use the same values as in the repo’s `.env.local`. Then redeploy. No code or `vercel.json` changes needed.
