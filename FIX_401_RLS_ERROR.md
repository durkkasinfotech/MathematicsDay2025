# 🔧 Fix: 401 Error & RLS Policy Violation

## Error Messages
```
401 Unauthorized
Error: new row violates row-level security policy for table "math_lead_registrations"
```

## ✅ Complete Fix (2 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to: https://app.supabase.com
2. Select your project
3. Click **SQL Editor** (left sidebar)
4. Click **New query**

### Step 2: Run the Complete Fix SQL
1. Open file: `FIX_RLS_POLICY_COMPLETE.sql`
2. Copy **ALL** content
3. Paste into Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)
5. Wait for "Success" message

### Step 3: Verify Policy
1. Go to **Authentication** → **Policies**
2. Find table: `math_lead_registrations`
3. You should see policy: **"Allow public inserts"**
4. Check that it allows: `anon, authenticated, public`

### Step 4: Test Again
1. Go back to registration form
2. Fill and submit
3. Should work now! ✅

## What This Script Does

1. ✅ Temporarily disables RLS
2. ✅ Removes all conflicting policies
3. ✅ Re-enables RLS
4. ✅ Creates new policy that allows:
   - Anonymous users (anon)
   - Authenticated users
   - Public users
   - To INSERT data

## Alternative: Manual Fix

If SQL doesn't work, fix manually:

### Option 1: Disable RLS (Quick but less secure)
1. Go to **Table Editor**
2. Select `math_lead_registrations`
3. Click **Settings** (gear icon)
4. Toggle OFF **Enable Row Level Security**
5. Click **Save**

### Option 2: Create Policy via UI
1. Go to **Authentication** → **Policies**
2. Select table: `math_lead_registrations`
3. Click **New Policy**
4. Fill in:
   - **Name**: Allow public inserts
   - **Allowed operation**: INSERT
   - **Target roles**: Select `anon`, `authenticated`, `public`
   - **USING expression**: Leave empty
   - **WITH CHECK expression**: `true`
5. Click **Save**

## Still Getting 401 Error?

1. **Check API Key**: Make sure you're using the **anon/public** key (not service_role key)
2. **Check URL**: Verify Supabase URL is correct in `.env` file
3. **Restart Server**: Stop and restart `npm run dev`
4. **Check Browser Console**: Look for detailed error messages
5. **Check Supabase Logs**: Go to **Logs** → **Postgres Logs** for detailed errors

## Verify It's Working

After fix, you should see in browser console:
```
✅ Supabase client initialized successfully
📤 Submitting registration to Supabase...
✅ Registration stored successfully in database
```

And in Supabase Dashboard:
- Go to **Table Editor** → `math_lead_registrations`
- Your registration data should appear!

## Security Note

The policy only allows INSERT operations. Users cannot:
- ❌ Read other people's data
- ❌ Update existing data
- ❌ Delete data

This is safe for a registration form! ✅

