/**
 * Run the quote/contact API handlers locally for testing (no Vercel CLI needed).
 * Serves both /api/quote and /api/contact.
 * Usage:
 *   1. Copy .env.example to .env and set SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, QUOTE_NOTIFICATION_EMAIL.
 *   2. npx tsx scripts/run-contact-api.ts
 *   3. In another terminal: node scripts/test-contact-api.mjs http://localhost:3001
 */

import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

// Load .env into process.env (simple parser, no dependency)
try {
  const fs = await import("node:fs");
  const envPath = path.join(projectRoot, ".env");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (match) {
        const value = match[2].replace(/^["']|["']$/g, "").trim();
        process.env[match[1]] = value;
      }
    }
    console.log("Loaded .env");
  }
} catch {
  // ignore
}

const PORT = Number(process.env.CONTACT_API_PORT) || 3001;

const ROUTES: Record<string, () => Promise<unknown>> = {
  "/api/quote": () => import("../api/quote.ts").then((m) => m.default),
  "/api/contact": () => import("../api/contact.ts").then((m) => m.default),
};

const server = http.createServer(async (req, res) => {
  const url = (req.url || "/").replace(/\/$/, "") || "/";
  const handlerFactory = ROUTES[url];
  if (!handlerFactory) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  const vercelRes = {
    _status: 200,
    _headers: {} as Record<string, string>,
    setHeader(name: string, value: string) {
      this._headers[name.toLowerCase()] = value;
    },
    status(code: number) {
      this._status = code;
      return this;
    },
    end() {
      res.writeHead(this._status, this._headers);
      res.end();
    },
    json(body: unknown) {
      res.writeHead(this._status, { ...this._headers, "content-type": "application/json" });
      res.end(JSON.stringify(body));
    },
  };

  const vercelReq: { method?: string; body?: unknown } = {
    method: req.method,
  };

  if (req.method === "OPTIONS") {
    const handler = await handlerFactory();
    await (handler as (a: unknown, b: unknown) => Promise<void>)(vercelReq, vercelRes);
    return;
  }

  if (req.method !== "POST") {
    const handler = await handlerFactory();
    await (handler as (a: unknown, b: unknown) => Promise<void>)(vercelReq, vercelRes);
    return;
  }

  let body = "";
  for await (const chunk of req) body += chunk;
  try {
    vercelReq.body = body ? JSON.parse(body) : {};
  } catch {
    vercelRes.status(400).json({ success: false, message: "Invalid JSON body" });
    return;
  }

  const handler = await handlerFactory();
  await (handler as (a: unknown, b: unknown) => Promise<void>)(vercelReq, vercelRes);
});

server.listen(PORT, () => {
  console.log(`Quote API running at http://localhost:${PORT}`);
  console.log("  POST /api/quote  — quote form (primary)");
  console.log("  POST /api/contact — legacy contact");
  console.log("Test: node scripts/test-contact-api.mjs http://localhost:" + PORT);
  if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
    console.warn("WARNING: SENDGRID_API_KEY or SENDGRID_FROM_EMAIL not set. Emails will not send.");
  }
});
