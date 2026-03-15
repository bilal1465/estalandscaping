# Get your Gmail refresh token (one-time setup)

Use this to get **GMAIL_REFRESH_TOKEN** and add it to `.env.local`.  
**Do not put GMAIL_CLIENT_SECRET or GMAIL_REFRESH_TOKEN in vercel.json** — they would be committed to git. For production, someone with Vercel access must add them in **Vercel → Settings → Environment Variables**.

---

## Option A: Get the token using production (easiest)

1. **Google Cloud Console**  
   - Go to [Google Cloud Console](https://console.cloud.google.com/) → your project → **APIs & Services** → **Credentials**.  
   - Open your OAuth 2.0 Client.  
   - Under **Authorized redirect URIs** add: **`https://estalandscaping.com/callback`**  
   - Save.

2. **Start the auth flow**  
   Open in your browser:
   ```text
   https://estalandscaping.com/api/auth/gmail
   ```

3. **Sign in** with **info@estalandscaping.com** and allow the app to send email.

4. **Copy the refresh token**  
   You’ll be redirected to a page that shows your **refresh token**. Copy the whole value.

5. **Add it to `.env.local`**  
   Open `.env.local` in the project root and set:
   ```text
   GMAIL_REFRESH_TOKEN=paste_the_token_here
   ```
   Save the file.

6. **Production (Vercel)**  
   If you get access to the Vercel dashboard (or someone else can), add the same **GMAIL_REFRESH_TOKEN** in **Settings → Environment Variables**, and add **GMAIL_CLIENT_ID** and **GMAIL_CLIENT_SECRET** there too. Then redeploy.

---

## Option B: Get the token locally

1. **Google Cloud Console**  
   Add this redirect URI to your OAuth client: **`http://localhost:5174/callback`**  
   Save.

2. **Use a local redirect for the flow**  
   In `.env.local` set:
   ```text
   GMAIL_REDIRECT_URI=http://localhost:5174/callback
   ```
   Save. (You can change it back to `https://estalandscaping.com/callback` after you have the token.)

3. **Start the frontend**
   ```bash
   npm run dev
   ```
   Note the URL (e.g. http://localhost:5174).

4. **Start the local API** (in another terminal)
   ```bash
   npx tsx scripts/run-contact-api.ts
   ```
   It loads `.env.local` and runs the API on port 3001.

5. **Point the frontend at the local API**  
   Create or edit `.env.local` and add (use the port run-contact-api shows if different):
   ```text
   VITE_API_URL=http://localhost:3001
   ```
   Restart `npm run dev`.

6. **Open the auth URL**  
   In your browser go to:
   ```text
   http://localhost:3001/api/auth/gmail
   ```

7. **Sign in** with **info@estalandscaping.com** and allow access.

8. **Copy the refresh token**  
   You’ll be redirected to http://localhost:5174/callback?code=... and the page will show your **refresh token**. Copy it.

9. **Add it to `.env.local`**
   ```text
   GMAIL_REFRESH_TOKEN=paste_the_token_here
   ```
   Optionally set `GMAIL_REDIRECT_URI` back to `https://estalandscaping.com/callback` for production. Save.

---

## After the token is in `.env.local`

1. **Send a test email**  
   With the local API still running (`npx tsx scripts/run-contact-api.ts`), open:
   ```text
   http://localhost:3001/api/test-email
   ```
   You should see JSON like `{ "success": true, "message": "Test email sent successfully to info@estalandscaping.com" }`.  
   Check **info@estalandscaping.com** (inbox and spam) for the test email.

2. **Test the contact form**  
   On http://localhost:5174, submit the contact/quote form. Check **info@estalandscaping.com** again for the inquiry.

---

## Why not in vercel.json?

**vercel.json** is committed to git. Putting **GMAIL_CLIENT_SECRET** or **GMAIL_REFRESH_TOKEN** there would expose them to anyone with repo access. So:

- **vercel.json** only has **GMAIL_REDIRECT_URI** and **GMAIL_EMAIL** (safe to commit).
- **GMAIL_CLIENT_ID**, **GMAIL_CLIENT_SECRET**, and **GMAIL_REFRESH_TOKEN** must be set in **Vercel → Settings → Environment Variables** (or via `vercel env add`) by someone with access. They cannot be deployed from the repo safely.

**.env.local** is in **.gitignore**, so your credentials stay local and are never pushed.
