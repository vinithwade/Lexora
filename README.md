# Lexora

**Your AI accountability coach — on call twice a day.**

Plan your day in the morning. Walk your wins in the evening. Keep the streak alive.

---

## The problem we're solving

Most people don't fail because they lack a to-do app. They fail because nobody is *watching*. Founders, operators, and solo builders wake up with a hundred directions to run in, pick the loudest one instead of the most important one, and end the day unsure whether they actually moved forward.

Accountability is the thing that works — a coach, a co-founder, a standup — but real accountability is expensive, scheduled around other people, and easy to ghost. Streak apps don't talk back. Productivity tools track tasks but never ask *"did you actually do it?"*

**Lexora is the accountability partner that shows up every day, costs almost nothing, and never lets you quietly skip.**

## What Lexora is

Lexora is a real-time AI coach you actually *talk to* — a short face-to-face voice call, twice a day:

- **Morning meet (~90 seconds).** You tell Lexora what matters today. It pushes back, narrows you to your top 3–5 priorities, and pins them to your dashboard.
- **Evening meet (~5 minutes).** Lexora walks every task with you, marks each one honestly — done, skipped, or carried over — and updates your streak.

That's the whole loop. Plan → ship → review → repeat. The streak only survives if you actually do the work, so it *means* something.

## Who it's for

Founders, indie hackers, operators, and anyone running their own day with no one above them to answer to. If your calendar is empty but your ambition isn't, Lexora is the structure you've been improvising.

## What you get

- 🎙️ **Real conversations, not forms.** Voice-first meetings that feel like talking to a sharp coach — not filling out another tracker.
- 🎯 **The 3-task rule.** Lexora forces focus. Fewer priorities, actually finished, beats a bloated list you ignore.
- 🔥 **A streak that's earned.** Your streak only ticks when you genuinely hit your day. No participation trophies.
- 📊 **Honest reviews.** The evening coach doesn't let you wave off what you skipped — it names it, so tomorrow is sharper.
- ⏰ **Two appointments you can't snooze.** Set your morning and evening times once; Lexora reminds you and is waiting when it's time.
- 📈 **Insights over time.** Watch your consistency, completion rate, and momentum compound week over week.

## What we're aiming to build

We're not building another habit tracker. We're building the **default operating system for self-driven people** — the daily rhythm that turns intention into shipped work.

The bigger bet: most ambitious people already have the talent. What they're missing is a *system that holds them to it.* If we get the daily loop right, everything else compounds. Here's where we're taking it:

- **A coach that knows you.** Lexora should remember last week, notice when you keep dodging the same task, and adjust how it pushes you — like a coach who's been with you for months, not a fresh chat every time.
- **Teams and squads.** Shared streaks, visible commitments, and a morning cadence a whole startup runs on together.
- **The work, not just the words.** Connect the tools where work actually happens so reviews are grounded in reality, not just self-report.
- **Coaching that gets smarter.** Patterns across thousands of days, turned back into better questions, better nudges, and better days for every user.

The north star: **you end every day knowing you moved the right things forward — and a year of those days adds up to something you're proud of.**

## Where we are

Lexora is an **early-stage MVP** — the core daily loop is live and working, and we're shaping it fast. Things will change quickly. That's the point: we're building in the open, learning from real days, and shipping every week.

---

## For developers

This is a Next.js + Supabase app; the live meetings run on OpenAI's Realtime API.

```bash
npm install
cp .env.local.example .env.local   # add your Supabase + OpenAI keys
npm run dev                         # http://localhost:3000
```

Full setup (Supabase project + schema, API keys, deploy, and the daily-loop walkthrough) lives in [`docs/SETUP.md`](docs/SETUP.md).
