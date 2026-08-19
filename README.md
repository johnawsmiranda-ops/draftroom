# Draftroom

A creative playground for writers. Capture a fleeting idea the moment it arrives — a line, a
scene, a voice thought — and come back to it when you're ready to write.

Draftroom is intentionally **not** an AI writing tool. Nothing here rewrites, generates, or
suggests your words. It only gives them a place to live.

## What's built (MVP)

1. Email/password authentication (Auth.js, JWT sessions, bcrypt password hashing)
2. Draftroom home — Write / Glimpse / Writing Dates + recent projects
3. Projects (create, list, open)
4. Glimpse Mode — text + voice capture
5. Glimpse Wall — a draggable, editorial sticky-note board (pin, edit, delete)
6. Glimpse Timeline — the same glimpses grouped by date
7. Writing Mode — documents, chapters, a distraction-light rich text editor
8. Autosave (debounced, with live word count)
9. Writing Dates — schedule a return visit; arriving shows "Welcome back" + recent glimpses
10. Lights On / Lights Off — a fullscreen, chrome-fading dark writing mode
11. Voice-to-text glimpses via the browser's Web Speech API
12. Writing atmosphere — Instrumental / Focus / Ambient / Rain / Café / Piano / Silence
    (synthesized in-browser via Web Audio, so there are no licensed audio files to swap in later)

Image and link glimpses, and raw audio playback, are intentionally deferred — the schema already
has the columns waiting for them (see below).

## Stack

- **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4
- **Auth:** Auth.js (NextAuth v5), Credentials provider, JWT sessions, bcrypt
- **Database:** Neon Postgres, accessed via Prisma
- **Hosting:** Vercel

Draftroom has its own database and its own auth — it shares nothing with any other product's
Supabase environment.

## Local setup

```bash
npm install            # also runs `prisma generate` via postinstall
cp .env.example .env   # fill in DATABASE_URL, DIRECT_URL, AUTH_SECRET
npm run db:push        # creates tables in your Neon database (use db:migrate if you prefer migrations)
npm run dev
```

> This repo was built in a sandboxed environment without access to `binaries.prisma.sh`, so
> `prisma generate` / `db:push` could not be run here. Run them yourself once you have normal
> network access — that's a one-time step and everything else is ready to go.

### Environment variables

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Neon dashboard → the **pooled** connection string |
| `DIRECT_URL` | Neon dashboard → the **direct** (unpooled) connection string — Prisma migrations need this |
| `AUTH_SECRET` | `openssl rand -base64 32` |

## Deploying

1. Create a Neon Postgres project (free tier is plenty to start). Copy the pooled and direct
   connection strings.
2. Push this repo to GitHub, then import it in Vercel.
3. In Vercel → Project Settings → Environment Variables, add `DATABASE_URL`, `DIRECT_URL`, and
   `AUTH_SECRET`. Never expose these to the client — they're only read in server code
   (`src/lib/prisma.ts`, `src/lib/auth.ts`, and files under `src/lib/actions/`).
4. Deploy. Vercel's build runs `npm install`, which triggers `prisma generate`; run
   `npx prisma db push` once (locally, pointed at the Neon `DATABASE_URL`) to create the schema
   before the first deploy.

## Database schema

`prisma/schema.prisma` defines `User → Project → { Glimpse, Document → Chapter, WritingDate,
WritingSession }`. Every row that a user owns carries `userId` directly, so every query in
`src/lib/actions/*` filters on the authenticated session's user id — that's the whole
authorization model; nothing is fetched from the client directly.

`Glimpse.audioUrl` and `Glimpse.imageUrl` are plain string columns today, unused by the MVP. When
you add object storage (S3, Cloudflare R2, or Vercel Blob) for real audio recordings or images,
you upload from a signed URL and store the resulting key/URL in those columns — no schema
migration needed, no binary data ever touches Postgres.

## Voice-to-text

The voice glimpse composer uses the browser's built-in `SpeechRecognition` API (Chrome and
Chromium-based browsers today) to transcribe speech to text live, client-side, with no server
round-trip. The transcript is saved verbatim as the glimpse's content — nothing is rewritten.
Raw audio capture (via `MediaRecorder`) is a natural next step once object storage is wired up;
`Glimpse.audioUrl` is already there for it.

## Project structure

```
src/
  app/
    (auth)/login, (auth)/signup      — auth pages
    (app)/home                        — Draftroom home
    (app)/writing-dates               — all writing dates + "Welcome back" detail page
    (app)/projects/[projectId]/
      glimpses                        — Glimpse Wall / Timeline
      write, write/[documentId]       — Writing Mode
      writing-dates                   — project-scoped writing dates
  components/                         — client components (wall, editor, atmosphere, etc.)
  lib/
    actions/                          — server actions, one file per entity, all user-scoped
    auth.ts, prisma.ts, current-user.ts
prisma/schema.prisma                  — the whole data model
```
