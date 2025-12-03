# Supabase Integration Guide

This guide will help you set up Supabase for the Mathematics Day 2025 Registration Form.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in your project details:
   - **Name**: Math Lead Registration (or any name you prefer)
   - **Database Password**: Choose a strong password (save it securely)
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be set up (takes 1-2 minutes)

## Step 2: Set Up the Database

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `SUPABASE_SETUP.sql`
4. Paste it into the SQL Editor
5. Click "Run" (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

## Step 3: Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll find:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys" → "anon public")

## Step 4: Configure Environment Variables

1. In the project root directory, create a file named `.env`
2. Copy the contents from `.env.example`
3. Replace the placeholder values with your actual Supabase credentials:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important**: 
- Replace `xxxxxxxxxxxxx` with your actual project reference ID
- Replace the anon key with your actual anon/public key
- Do NOT commit the `.env` file to git (it's already in .gitignore)

## Step 5: Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the registration form in your browser
3. Fill out the form with test data
4. Submit the form
5. Check your Supabase dashboard:
   - Go to **Table Editor**
   - Select the `math_lead_registrations` table
   - You should see your test registration

## Step 6: Verify Database Setup

1. In Supabase dashboard, go to **Table Editor**
2. You should see the `math_lead_registrations` table
3. Check that all columns are present:
   - id
   - full_name
   - date_of_birth
   - contact_number
   - email_id
   - college_name
   - department
   - year_semester
   - area_of_interest
   - competition_course
   - course_interest
   - registration_date
   - created_at

## Troubleshooting

### Error: "Supabase credentials are not set"
- Make sure you created a `.env` file (not `.env.example`)
- Check that the variable names are exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your development server after creating/updating `.env`

### Error: "relation does not exist"
- Run the SQL setup script again in Supabase SQL Editor
- Make sure the table name is exactly `math_lead_registrations`

### Error: "new row violates row-level security policy"
- Check that the RLS policy is created correctly
- In Supabase, go to **Authentication** → **Policies** and verify the policy exists

### Error: "duplicate key value violates unique constraint"
- This means the email is already registered
- The form will show a user-friendly error message

### Form submits but data doesn't appear
- Check the browser console for errors
- Verify your Supabase credentials are correct
- Check Supabase logs: **Logs** → **Postgres Logs**

## Security Notes

- The `anon` key is safe to use in client-side code
- Row Level Security (RLS) is enabled to protect your data
- Only INSERT operations are allowed for public users
- Consider adding authentication if you need to view registrations

## Production Deployment

When deploying to production:

1. Set environment variables in your hosting platform:
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables
   - Other platforms: Check their documentation

2. Make sure to use the same Supabase project or create a new one for production

3. Update the `.env` file with production credentials (if using a different project)

## Support

For issues or questions:
- Supabase Documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Check the console for detailed error messages

