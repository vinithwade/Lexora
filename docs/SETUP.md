# Lexora — Developer Setup

The product/vision overview lives in the [root README](../README.md). This doc is the technical setup, run, and deploy guide.

## Tech

- Next.js 15 (App Router) + TypeScript + Tailwind
- Supabase (Postgres + Auth + RLS)
- OpenAI Realtime API (`gpt-realtime`) over WebRTC — audio streams browser↔OpenAI directly, our server only mints ephemeral tokens
- Resend for email reminders
- Vercel Cron for the 5-min-before-meet notification scan

## One-time setup

### 1. Create the Supabase project

1. Go to <https://supabase.com> → "New project". Name it `lexora`. Pick a region close to you. Save the database password.
2. In Project Settings → API, copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (server-only)
3. Open SQL Editor → "+ New query" → paste the entire contents of [`supabase/schema.sql`](../supabase/schema.sql) → click **Run**. You should see "Success. No rows returned."
4. Authentication → Providers → confirm Email is enabled. For local dev you can switch off email confirmation (Authentication → Email → "Confirm email" off) so you can sign up and immediately get a session.
5. (Optional) To enable **Sign in with Google**: create an OAuth 2.0 client in Google Cloud Console, add `https://<your-ref>.supabase.co/auth/v1/callback` as an authorized redirect URI, paste the client ID + secret into Supabase → Authentication → Providers → Google, and add `http://localhost:3000/auth/callback` under Authentication → URL Configuration → Redirect URLs.

### 2. Get an OpenAI API key

1. <https://platform.openai.com/api-keys> → Create new secret key.
2. Make sure your account has Realtime API access.
3. Copy the key.

### 3. (Optional) Resend for email reminders

If you want the 5-min-before email reminders to work locally, sign up at <https://resend.com>, grab an API key, and verify a sender domain (or use `onboarding@resend.dev` for testing — only sends to your own verified email).

### 4. Configure env

```bash
cp .env.local.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY, CRON_SECRET (any random string)
```

### 5. Run

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## How to test the full loop

1. Sign up at `/signup` with any email + password.
2. You'll be sent to `/onboarding` — set a morning time within ±30 min of *right now* so you can immediately try the morning meet.
3. Land on `/dashboard` — the "Join meeting" button shows up because you're inside the meeting window.
4. Click it. Allow mic + camera permissions. The AI greets you, asks for your top priorities, then calls the `create_tasks` tool. Tasks appear on the dashboard.
5. Repeat with the evening meet (set evening time within ±30 min of now). The AI walks through your tasks, marks each done/skipped, and your streak ticks up if ≥70% completion.

## Project layout

```
app/
  page.tsx                  landing
  login/, signup/           auth
  onboarding/               first-run setup
  dashboard/                today's tasks + streak
  settings/                 change meet times
  meeting/[id]/             the live AI video call
  api/
    realtime/session/       mints OpenAI ephemeral tokens
    meeting/start/          create meeting row
    meeting/end/            mark complete
    meeting/message/        persist transcript turn
    meeting/tool/           handles AI tool calls (create_tasks, finish_meeting)
    cron/notify/            email reminders 5 min before
  auth/callback/            Supabase auth redirect
lib/
  supabase/                 server / client / admin / middleware helpers
  prompts.ts                morning + evening AI instructions + tool schemas
  time.ts                   timezone math
components/                 shared UI
supabase/schema.sql         the SQL to paste into Supabase
vercel.json                 cron schedule
```

## Deploying to Vercel

1. Push to GitHub.
2. Import the repo in Vercel.
3. Add the same env vars as `.env.local`. Set `NEXT_PUBLIC_APP_URL` to the deployed URL.
4. Cron starts running automatically (every minute hits `/api/cron/notify`).

## Cost rough math

- OpenAI Realtime: ~$0.30 per 5-min meet
- Supabase free tier covers <500 MAU
- Vercel free tier covers a small launch
- Resend free tier: 100 emails/day

At 1000 DAU × 2 meets/day, plan for ~$18k/month — almost entirely OpenAI.
