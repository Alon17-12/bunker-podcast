# 🎙️ הבונקר — Podcast Studio Management System

> מערכת ניהול הפקות פודקאסט end-to-end לאולפן הבונקר.
> ניהול לקוחות, אחסון פרקים, פורטל לקוח עם סימון Reels, פוסט-פרודקשן, אוטומציות.

## 🏗️ Tech Stack

| שכבה | טכנולוגיה |
|---|---|
| **Framework** | Next.js 15 (App Router + Turbopack) |
| **Language** | TypeScript (strict) |
| **Styling** | Tailwind CSS v4 (RTL native) |
| **Database** | Supabase (Postgres + Auth + RLS) |
| **Video** | Bunny Stream (CDN + signed URLs + TUS upload) |
| **Automation** | Make.com (webhooks → Email + WhatsApp + Monday) |
| **Hosting** | Vercel |
| **Fonts** | Heebo (HE) + Inter (EN) + JetBrains Mono (code) |

## 🚀 Getting Started

### 1. Clone & install

```bash
git clone https://github.com/Alon17-12/bunker-podcast.git
cd bunker-podcast
npm install
```

### 2. Setup environment

```bash
cp .env.example .env.local
# Fill in real values — see "External Services Setup" below
```

### 3. Run database migrations

```bash
# Option A: Supabase CLI (recommended)
supabase link --project-ref $SUPABASE_PROJECT_ID
supabase db push

# Option B: Paste supabase/migrations/0001_initial_schema.sql into Supabase SQL Editor
```

### 4. Generate TypeScript types from DB

```bash
npm run db:types
```

### 5. Run dev server

```bash
npm run dev
# Open http://localhost:3000
```

You should see the "🔴 הבונקר" hello page with RTL Hebrew text.

## 🔧 External Services Setup

### Supabase (DB + Auth)
1. Create a new project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. From **Settings → API**, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key (secret) → `SUPABASE_SERVICE_ROLE_KEY`
3. From **Settings → General**, copy `Reference ID` → `SUPABASE_PROJECT_ID`
4. Run the migration in `supabase/migrations/0001_initial_schema.sql`

### Bunny Stream (Video)
1. Sign up at [bunny.net](https://bunny.net)
2. Create a **Stream Library** (Dashboard → Stream → Add Library)
3. From the library settings, copy:
   - `Library ID` → `BUNNY_LIBRARY_ID`
   - `API Key` → `BUNNY_API_KEY`
   - `Security Key` → `BUNNY_SECURITY_KEY`
   - `CDN Hostname` (e.g., `vz-xxx.b-cdn.net`) → `BUNNY_CDN_HOSTNAME`

### Make.com (Automation)
1. Create scenarios for each automation flow (see CTO guide)
2. For each scenario, paste the webhook URL into the matching env var

## 📁 Project Structure

```
bunker-podcast/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout — RTL, fonts, theme
│   ├── page.tsx            # Hello page
│   ├── globals.css         # Tailwind + brand vars
│   ├── admin/              # Admin app (protected)
│   ├── api/                # Route handlers
│   └── p/[token]/          # Client portal (token-based)
├── components/
│   ├── ui/                 # Shared primitives
│   └── brand/              # Logo, RecordingDot, etc.
├── lib/
│   ├── supabase/           # client.ts, server.ts, admin.ts
│   ├── bunny/              # stream.ts, signed-url.ts
│   ├── validation/         # Zod schemas
│   └── utils.ts            # Helpers (formatTime, share token, etc.)
├── types/
│   └── database.ts         # Generated Supabase types
├── supabase/
│   └── migrations/         # SQL migrations
├── middleware.ts           # Supabase auth refresh + /admin protection
└── .env.example
```

## 📋 CTO Rules

These are **non-negotiable** project rules:

1. **Bunny Stream is the only video provider.** Never embed from Drive, S3, etc.
2. **Supabase is the source of truth.** Monday/Make reflect state but don't own it.
3. **Make.com handles all automation.** No cron jobs in code.
4. **RTL + Hebrew from day one.** Never "we'll add RTL later".
5. **Token access for clients.** No passwords for clients — magic links via Email + WhatsApp.
6. **TypeScript strict everywhere.** Zod for API validation.
7. **No mock data in production.** Seed scripts for dev only.

## 🗺️ Roadmap

- [x] **Sprint 1: Foundation** ← we are here
- [ ] Sprint 2: Admin Core (Auth, CRUD, Dashboard)
- [ ] Sprint 3: Video Pipeline (Bunny Upload + Playback)
- [ ] Sprint 4: Client Portal (Timeline + Reels marking)
- [ ] Sprint 5: Feedback Flow + Make automations
- [ ] Sprint 6: Polish + first pilot episode

Full spec: [bunker-designs/cto-implementation-guide.html](https://alon17-12.github.io/bunker-designs/cto-implementation-guide.html)

---

© הבונקר 2026 · Internal project
