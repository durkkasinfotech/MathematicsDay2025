# 🔧 FIX: Supabase Not Configured Error

## Problem
Your `.env` file exists but is **EMPTY** or doesn't have the correct variables.

## ✅ Quick Fix (2 minutes)

### Step 1: Open .env File
Open: `E:\Certificate&QR\Math Lead\.env`

### Step 2: Add These Lines (Replace with YOUR values)

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-key-here
```

### Step 3: Get Your Supabase Credentials

1. Go to: https://app.supabase.com
2. Login and select your project
3. Go to: **Settings** → **API**
4. Copy:
   - **Project URL** → Paste for `VITE_SUPABASE_URL`
   - **anon public** key → Paste for `VITE_SUPABASE_ANON_KEY`

### Step 4: Save .env File

Make sure:
- ✅ No spaces around `=` (correct: `VITE_SUPABASE_URL=https://...`)
- ✅ No quotes (wrong: `VITE_SUPABASE_URL="https://..."`)
- ✅ File saved as `.env` (not `.env.txt`)

### Step 5: Restart Server

**IMPORTANT:** You MUST restart the dev server!

1. Stop current server: Press `Ctrl+C` in terminal
2. Start again:
   ```bash
   npm run dev
   ```

### Step 6: Verify

1. Open browser console (F12)
2. Look for:
   ```
   ✅ Supabase client initialized successfully
   ```

3. Or run:
   ```bash
   npm run check-env
   ```

## Example .env File

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Replace with YOUR actual values!**

## Still Not Working?

1. Check `.env` file location: Must be in `E:\Certificate&QR\Math Lead\` (same folder as `package.json`)
2. Check variable names: Must be exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Check format: No spaces, no quotes
4. Restart server after changes
5. Check browser console for detailed error messages

## After Fix

Once fixed, form submissions will save to Supabase table automatically! 🎉

