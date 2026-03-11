# KST Alumni Network — Deployment Guide

## Step 1: Set up the Supabase database

1. Go to **supabase.com** → open your KST-Alumni project
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file `supabase-schema.sql` from this folder, copy everything, paste it in, and click **Run**
5. You should see "Success. No rows returned"

## Step 2: Enable email signups in Supabase

1. In Supabase, go to **Authentication → Providers**
2. Make sure **Email** is enabled
3. Go to **Authentication → Email Templates** — customize if you want
4. Go to **Authentication → URL Configuration**
   - Set Site URL to your Vercel URL after deploy (e.g. `https://kst-alumni.vercel.app`)

## Step 3: Install and run locally (to test first)

You need Node.js installed. Download from nodejs.org if needed.

Open Terminal (Mac) or Command Prompt (Windows) and run:

```bash
cd kst-alumni
npm install
npm run dev
```

Open http://localhost:5173 — the app should load.

## Step 4: Deploy to Vercel (get a live link)

1. Go to **github.com** → create a new repository called `kst-alumni`
2. Upload all these files to that repo (drag and drop into the GitHub interface)
3. Go to **vercel.com** → click **Add New Project**
4. Import your `kst-alumni` GitHub repo
5. Click **Deploy** — Vercel auto-detects Vite/React
6. You'll get a live URL like `https://kst-alumni.vercel.app`

## Step 5: Make yourself admin

After signing up on the live site:

1. Go to Supabase → **Table Editor** → `profiles`
2. Find your row, click the **role** cell
3. Change it from `member` to `admin`
4. Save — you'll now see the Admin Panel in the app

## What each role can do

| Feature | Member | Admin |
|---------|--------|-------|
| View directory | ✓ | ✓ |
| Edit own profile | ✓ | ✓ |
| Post jobs | ✓ | ✓ |
| Create events | ✗ | ✓ |
| Delete any post | ✗ | ✓ |
| Manage member roles | ✗ | ✓ |
| Admin panel | ✗ | ✓ |

## Sharing the signup link

Once deployed, send people to:
`https://your-vercel-url.vercel.app/register`

That's it — they sign up, confirm their email, and they're in.
