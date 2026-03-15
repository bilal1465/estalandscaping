# Vercel environment variables (do not put secrets in vercel.json)

Set these in the **Vercel Dashboard** — never commit secrets to the repo.

## Where to add them

1. Open [Vercel Dashboard](https://vercel.com) → your **ESTA Landscaping** project.
2. Go to **Settings** → **Environment Variables**.
3. Add each variable below. Choose **Production** (and optionally **Preview** / **Development**).
4. **Redeploy** the project after saving (Deployments → ⋮ → Redeploy).

## Variables to add

| Name | Value | Notes |
|------|--------|--------|
| **GMAIL_CLIENT_ID** | Same as in your .env.local (from Google Cloud Console) | OAuth 2.0 Client ID |
| **GMAIL_CLIENT_SECRET** | Same as in your .env.local (from Google Cloud Console) | OAuth 2.0 Client secret — do not commit |
| **GMAIL_REDIRECT_URI** | `https://estalandscaping.com/callback` | Must match Google OAuth redirect URI |
| **GMAIL_EMAIL** | `info@estalandscaping.com` | Inbox that receives contact form submissions |
| **GMAIL_REFRESH_TOKEN** | *(paste after one-time auth flow)* | Get it by visiting `/api/auth/gmail` and completing the flow; then paste the token here |

## One-time: get the refresh token

1. Deploy the app with the four variables above (leave **GMAIL_REFRESH_TOKEN** empty for now).
2. Open **https://estalandscaping.com/api/auth/gmail** in your browser (or locally `http://localhost:5173/api/auth/gmail` if you run the API locally).
3. Sign in with **info@estalandscaping.com** and allow access.
4. You’ll be redirected to **https://estalandscaping.com/callback** with a page that shows your **refresh token**.
5. Copy it and add **GMAIL_REFRESH_TOKEN** in Vercel (and in `.env.local` for local dev).
6. Redeploy so the new variable is used.

## Google Cloud: redirect URI

In Google Cloud Console → APIs & Services → Credentials → your OAuth 2.0 Client:

- Add **Authorized redirect URI**: `https://estalandscaping.com/callback`

Without this, the OAuth flow will fail after sign-in.
