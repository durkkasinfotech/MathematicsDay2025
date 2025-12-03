# .env File Setup Instructions

## ⚠️ Important: Fix "Supabase is not configured" Error

### Step 1: Create .env File

1. Go to project root: `E:\Certificate&QR\Math Lead\`
2. Create a new file named exactly: `.env` (with the dot at the beginning)
3. Make sure it's in the same folder as `package.json`

### Step 2: Add Your Supabase Credentials

Open `.env` file and add these lines (replace with YOUR actual values):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key-here
```

### Step 3: Important Format Rules

✅ **CORRECT:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.example
```

❌ **WRONG (has spaces):**
```env
VITE_SUPABASE_URL = https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

❌ **WRONG (quotes):**
```env
VITE_SUPABASE_URL="https://abcdefghijklmnop.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Step 4: Get Your Supabase Credentials

1. Go to https://app.supabase.com
2. Select your project (or create new one)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **anon public** key → Use for `VITE_SUPABASE_ANON_KEY`

### Step 5: Restart Dev Server

**IMPORTANT:** After creating/updating `.env` file:

1. **STOP** the current dev server (press `Ctrl+C` in terminal)
2. **START** again:
   ```bash
   npm run dev
   ```

### Step 6: Verify It's Working

1. Open browser console (F12)
2. You should see:
   ```
   🔍 Environment Check:
   VITE_SUPABASE_URL: ✅ Loaded
   VITE_SUPABASE_ANON_KEY: ✅ Loaded
   ✅ Supabase client initialized successfully
   ```

3. If you see ❌ Missing, check:
   - `.env` file is in correct location
   - No typos in variable names
   - No spaces around `=`
   - Server was restarted

## Common Issues

### Issue: Still shows "Supabase is not configured"

**Solution:**
1. Make sure `.env` file is in root folder (same as `package.json`)
2. Check file name is exactly `.env` (not `.env.txt` or `env`)
3. Restart dev server completely
4. Check browser console for detailed error messages

### Issue: "VITE_SUPABASE_URL: ❌ Missing"

**Solution:**
- Check `.env` file has `VITE_SUPABASE_URL=` (not `SUPABASE_URL=`)
- Must start with `VITE_` for Vite to load it
- No spaces: `VITE_SUPABASE_URL=https://...` ✅
- With spaces: `VITE_SUPABASE_URL = https://...` ❌

### Issue: File not found

**Solution:**
- Create `.env` file manually
- Make sure it's in: `E:\Certificate&QR\Math Lead\.env`
- Not in: `E:\Certificate&QR\Math Lead\src\.env`

## Example .env File Content

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Replace with your actual values!**

## After Setup

Once `.env` is configured correctly:
- Form submissions will save to Supabase table
- Check data in: Supabase Dashboard → Table Editor → `math_lead_registrations`

