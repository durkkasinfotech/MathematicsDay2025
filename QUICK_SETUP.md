# Quick Setup - Supabase Integration

## ✅ Step-by-Step Setup (5 minutes)

### 1. Create Supabase Project
- Go to https://supabase.com
- Sign up/Login
- Click "New Project"
- Fill details and create

### 2. Run SQL Setup
- In Supabase dashboard → **SQL Editor**
- Click "New query"
- Copy ALL content from `SUPABASE_SETUP.sql`
- Paste and click **Run**
- Should see: "Success. No rows returned"

### 3. Get API Keys
- Go to **Settings** → **API**
- Copy:
  - **Project URL** (looks like: https://xxxxx.supabase.co)
  - **anon public** key (long string starting with eyJ...)

### 4. Create .env File
Create `.env` file in project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Replace with your actual values!**

### 5. Restart Server
```bash
npm run dev
```

### 6. Test Registration
1. Fill the form
2. Submit
3. Check browser console - should see: "✅ Registration stored successfully"
4. Check Supabase → **Table Editor** → `math_lead_registrations`
5. Your data should be there! 🎉

## 🔍 Verify It's Working

### In Browser Console:
- Should see: "✅ Supabase client initialized successfully"
- After submit: "✅ Registration stored successfully in database"

### In Supabase Dashboard:
- Go to **Table Editor**
- Select `math_lead_registrations` table
- See your registration data

## ❌ Troubleshooting

**"Supabase credentials are not set"**
→ Check `.env` file exists and has correct variable names

**"relation does not exist"**
→ Run `SUPABASE_SETUP.sql` again in SQL Editor

**Data not appearing in table**
→ Check browser console for errors
→ Verify RLS policy is created (Settings → Authentication → Policies)

**Form submits but shows error**
→ Check Supabase logs: Logs → Postgres Logs

## ✅ Success Checklist

- [ ] Supabase project created
- [ ] SQL setup script run successfully
- [ ] `.env` file created with correct credentials
- [ ] Dev server restarted
- [ ] Browser console shows "Supabase client initialized"
- [ ] Form submission works
- [ ] Data appears in Supabase table

That's it! Your registration form is now connected to Supabase! 🚀

