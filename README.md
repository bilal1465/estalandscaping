ESTA Landscaping

Marketing site and lead-capture system for ESTA Landscaping, a landscaping and snow removal company operating in Calgary, Alberta.

Live: estalandscaping.vercel.app

About

The business was handling incoming work through phone calls and a basic contact form, which meant chasing customers for details before a quote could even be estimated. This site replaces that with a structured multi-step quote request flow that collects service type, property details, timeline, and budget up front, then delivers a formatted summary straight to the business inbox.

The result is that a quote request arrives complete instead of arriving as "hi, how much for a yard?"

Features
Multi-step quote request flow — four stages covering contact details, service selection, project information, and a review step before submission, with a progress indicator throughout.
Two-layer validation — per-step checks so users can't advance past an incomplete stage, plus full schema validation against a shared Zod schema on submit.
Transactional email delivery — submissions are sent as structured HTML email via SendGrid, with the customer's address set as reply-to so the business can respond directly from its inbox. HTML is escaped on the way out.
Explicit failure states — missing configuration and provider errors return clear JSON messages, and the frontend surfaces loading, success, and error states rather than failing silently.
Optional customer confirmation — an automatic acknowledgement email to the customer, toggled by environment variable.
Shared types across client and server — the quote schema lives in shared/ and is imported by both sides, so the form and the API can't drift apart.
Animation and performance work — scroll and transition animations via Framer Motion and GSAP, with scroll-jank profiling and fixes applied.

Tech stack
Layer	Technologies
Frontend	React 18, TypeScript, Vite, Wouter, TanStack Query
Styling & UI	Tailwind CSS, Radix UI primitives, Framer Motion, GSAP, Lucide
Forms & validation	React Hook Form, Zod, drizzle-zod
Backend	Vercel serverless functions, Express (local services)
Database	PostgreSQL (Neon serverless) via Drizzle ORM
Email	SendGrid, with Nodemailer and Gmail API paths available
Hosting	Vercel
