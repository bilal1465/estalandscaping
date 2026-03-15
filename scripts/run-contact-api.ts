/**
 * Run the quote/contact and Gmail API handlers locally for testing (no Vercel CLI needed).
 * Serves: /api/quote, /api/contact, /api/auth/gmail, /api/auth/gmail/tokens, /api/auth/save-token,
 *         /api/test-email, /api/gmail-status.
 * Usage:
 *   1. Copy .env.example to .env.local and set GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REDIRECT_URI.
 *   2. CONTACT_API_PORT=3000 npx tsx scripts/run-contact-api.ts
 *   3. In another terminal: npm run dev
 *   4. Open http://localhost:3000/api/auth/gmail (or the port you set) to get GMAIL_REFRESH_TOKEN.
 */

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { google } from "googleapis";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

function loadEnvFile(envPath: string): boolean {
  const resolved = path.resolve(projectRoot, path.basename(envPath));
  if (!fs.existsSync(resolved)) return false;
  const content = fs.readFileSync(resolved, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
      value = value.slice(1, -1);
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
    process.env[key] = value;
  }
  return true;
}

// Load .env first, then .env.local so .env.local overrides
const envPath = path.join(projectRoot, ".env");
const envLocalPath = path.join(projectRoot, ".env.local");
if (loadEnvFile(envPath)) console.log("Loaded .env");
if (loadEnvFile(envLocalPath)) console.log("Loaded .env.local");

const PORT = Number(process.env.CONTACT_API_PORT) || 3001;

type Handler = (req: { method?: string; url?: string; body?: unknown }, res: VercelRes) => Promise<void>;
interface VercelRes {
  _status: number;
  _headers: Record<string, string>;
  setHeader(name: string, value: string): void;
  status(code: number): VercelRes;
  writeHead(statusCode: number, headers?: Record<string, string>): void;
  end(chunk?: unknown): void;
  json(body: unknown): void;
}

function createVercelRes(res: http.ServerResponse): VercelRes {
  return {
    _status: 200,
    _headers: {} as Record<string, string>,
    setHeader(name: string, value: string) {
      this._headers[name.toLowerCase()] = value;
    },
    status(code: number) {
      this._status = code;
      return this;
    },
    writeHead(statusCode: number, headers?: Record<string, string>) {
      res.writeHead(statusCode, headers);
    },
    end(chunk?: unknown) {
      if (!res.writableEnded) {
        if (this._status && !res.headersSent) res.writeHead(this._status, this._headers);
        res.end(chunk);
      }
    },
    json(body: unknown) {
      if (res.writableEnded) return;
      this.setHeader("content-type", "application/json");
      if (!res.headersSent) res.writeHead(this._status, { ...this._headers, "content-type": "application/json" });
      res.end(JSON.stringify(body));
    },
  };
}

// POST /api/auth/save-token — write refresh token to .env.local and send test email (local only)
async function handleSaveToken(
  req: { body?: { refresh_token?: string } },
  res: VercelRes,
): Promise<void> {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const token = typeof req.body === "object" && req.body && String(req.body.refresh_token || "").trim();
  if (!token) {
    return res.status(400).json({ success: false, message: "Missing refresh_token in body." });
  }

  const envPath = path.join(projectRoot, ".env.local");
  let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  const line = `GMAIL_REFRESH_TOKEN=${token}`;
  if (/^\s*GMAIL_REFRESH_TOKEN\s*=/.m.test(content)) {
    content = content.replace(/^\s*GMAIL_REFRESH_TOKEN\s*=.*$/m, line);
  } else {
    content = content.trimEnd() + (content ? "\n" : "") + line + "\n";
  }
  fs.writeFileSync(envPath, content, "utf8");
  process.env.GMAIL_REFRESH_TOKEN = token;

  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const redirectUri = process.env.GMAIL_REDIRECT_URI || "https://estalandscaping.com/callback";
  const toEmail = process.env.GMAIL_EMAIL || "info@estalandscaping.com";

  if (!clientId || !clientSecret) {
    return res.status(200).json({
      success: true,
      saved: true,
      testEmailSent: false,
      message: "Token saved to .env.local. Gmail client not fully configured; run /api/test-email after setting GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET.",
    });
  }

  const base64UrlEncode = (str: string): string =>
    Buffer.from(str, "utf8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

  const rawMessage = [
    `From: ${toEmail}`,
    `To: ${toEmail}`,
    `Subject: Test - Contact Form Working`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
    "",
    "<p>Your ESTA Landscaping contact form is fully configured!</p>",
  ].join("\r\n");

  try {
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    oauth2Client.setCredentials({ refresh_token: token });
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: base64UrlEncode(rawMessage) },
    });
    return res.status(200).json({
      success: true,
      saved: true,
      testEmailSent: true,
      message: "Token saved to .env.local and test email sent to " + toEmail,
      to: toEmail,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Test email after save-token:", msg);
    return res.status(200).json({
      success: true,
      saved: true,
      testEmailSent: false,
      message: "Token saved to .env.local. Test email failed: " + msg,
    });
  }
}

function handleEnvCheck(_req: unknown, res: VercelRes) {
  res.status(200).json({
    GMAIL_CLIENT_ID: process.env.GMAIL_CLIENT_ID?.trim() ? "set" : "missing",
    GMAIL_CLIENT_SECRET: process.env.GMAIL_CLIENT_SECRET?.trim() ? "set" : "missing",
    GMAIL_REDIRECT_URI: process.env.GMAIL_REDIRECT_URI?.trim() ? "set" : "missing",
  });
}

const ROUTES: Array<{ method: string; path: string; handler: () => Promise<{ default: Handler }> | Handler }> = [
  { method: "GET", path: "/api/env-check", handler: async () => ({ default: handleEnvCheck as Handler }) },
  { method: "GET", path: "/api/auth/gmail", handler: () => import("../api/auth/gmail.ts") },
  { method: "POST", path: "/api/auth/gmail/tokens", handler: () => import("../api/auth/gmail/tokens.ts") },
  { method: "POST", path: "/api/auth/save-token", handler: async () => ({ default: handleSaveToken as Handler }) },
  { method: "GET", path: "/api/test-email", handler: () => import("../api/test-email.ts") },
  { method: "GET", path: "/api/gmail-status", handler: () => import("../api/gmail-status.ts") },
  { method: "POST", path: "/api/quote", handler: () => import("../api/quote.ts") },
  { method: "POST", path: "/api/contact", handler: () => import("../api/contact.ts") },
];

const server = http.createServer(async (req, res) => {
  const rawUrl = req.url || "/";
  const [pathname] = rawUrl.split("?");
  const url = pathname.replace(/\/$/, "") || "/";
  const method = req.method || "GET";

  const route = ROUTES.find((r) => r.method === method && r.path === url);
  if (!route) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  const vercelRes = createVercelRes(res);
  let body: unknown = {};
  if (method === "POST" || method === "PUT" || method === "PATCH") {
    let raw = "";
    for await (const chunk of req) raw += chunk;
    try {
      body = raw ? JSON.parse(raw) : {};
    } catch {
      vercelRes.status(400).json({ success: false, message: "Invalid JSON body" });
      return;
    }
  }

  const vercelReq: { method?: string; url?: string; body?: unknown } = { method, url: rawUrl, body };

  if (method === "OPTIONS") {
    vercelRes.status(204).end();
    return;
  }

  try {
    const mod = await route.handler();
    const handler = typeof mod === "function" ? mod : (mod as { default: Handler }).default;
    await handler(vercelReq, vercelRes);
    if (!res.writableEnded) vercelRes.end();
  } catch (err) {
    console.error(err);
    if (!res.writableEnded) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  }
});

server.listen(PORT, () => {
  const hasClientId = Boolean(process.env.GMAIL_CLIENT_ID?.trim());
  const hasClientSecret = Boolean(process.env.GMAIL_CLIENT_SECRET?.trim());
  const hasRedirectUri = Boolean(process.env.GMAIL_REDIRECT_URI?.trim());
  console.log(`Local API running at http://localhost:${PORT}`);
  console.log("  GMAIL_CLIENT_ID:      " + (hasClientId ? "set" : "MISSING"));
  console.log("  GMAIL_CLIENT_SECRET:  " + (hasClientSecret ? "set" : "MISSING"));
  console.log("  GMAIL_REDIRECT_URI:   " + (hasRedirectUri ? "set" : "MISSING"));
  console.log("");
  console.log("  GET  /api/env-check           — verify env vars loaded");
  console.log("  GET  /api/auth/gmail         — start Gmail OAuth (get refresh token)");
  console.log("  POST /api/auth/gmail/tokens  — exchange code for token");
  console.log("  POST /api/auth/save-token    — save token to .env.local + send test email");
  console.log("  GET  /api/test-email         — send test email");
  console.log("  GET  /api/gmail-status       — check Gmail config");
  console.log("  POST /api/quote              — quote form");
  console.log("  POST /api/contact            — contact form");
  console.log("");
  console.log("For local OAuth: set GMAIL_REDIRECT_URI=http://localhost:PORT/callback in .env.local (PORT = Vite dev server, e.g. 5173) and add that URI in Google Cloud Console. Set VITE_API_URL=http://localhost:" + PORT + " so the callback page can save the token.");
  if (!hasClientId || !hasClientSecret || !hasRedirectUri) {
    console.warn("WARNING: Gmail auth will fail until GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, and GMAIL_REDIRECT_URI are set in .env.local");
  }
});
