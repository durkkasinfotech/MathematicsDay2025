# 🔧 Fix: Row Level Security Policy Error

## Error Message
```
Error: new row violates row-level security policy for table "math_lead_registrations"
```

## ✅ Quick Fix (1 minute)

### Step 1: Open Supabase SQL Editor
1. Go to https://app.supabase.com
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New query**

### Step 2: Run the Fix SQL
1. Open the file: `FIX_RLS_POLICY.sql`
2. Copy **ALL** the content
3. Paste into Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)

### Step 3: Verify
You should see: **"Success. No rows returned"**

### Step 4: Test Again
1. Go back to your registration form
2. Fill and submit the form
3. It should work now! ✅

## What This Does

The SQL script will:
- ✅ Remove any conflicting policies
- ✅ Create a new policy that allows public inserts
- ✅ Allow anyone to submit registrations (no login required)

## Alternative: Manual Fix in Supabase Dashboard

If you prefer using the UI:

1. Go to **Authentication** → **Policies**
2. Find table: `math_lead_registrations`
3. Click **New Policy**
4. Select:
   - **Policy name**: Allow public inserts
   - **Allowed operation**: INSERT
   - **Target roles**: public
   - **USING expression**: Leave empty or `true`
   - **WITH CHECK expression**: `true`
5. Click **Save**

## Verify Policy is Working

1. In Supabase Dashboard → **Authentication** → **Policies**
2. You should see a policy named "Allow public inserts"
3. It should allow INSERT for public role

## Still Getting Error?

1. Make sure you ran the SQL script completely
2. Check Supabase Dashboard → **Authentication** → **Policies**
3. Verify the policy exists for `math_lead_registrations` table
4. Try submitting the form again
5. Check browser console for any other errors

## After Fix

Once the policy is fixed, form submissions will work and data will be stored in the table! 🎉

