# Quick Setup Guide - Mathematics Day 2025 Registration Portal

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Supabase

1. Go to your Supabase project dashboard
2. Open the SQL Editor
3. Run the SQL script from `SUPABASE_SETUP.sql` to create the registration table
4. Copy your Supabase URL and Anon Key from Settings > API

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 4: Add Images

Copy the following images to `public/assets/img/`:
- `dare1.png` - Dare Centre logo
- `aicraaa.jpg` - AICRA logo

You can copy these from the existing certificate-verification project:
```bash
# From the parent directory
cp "../certificate-verification/public/assets/img/dare1.png" "public/assets/img/"
cp "../certificate-verification/public/assets/img/aicraaa.jpg" "public/assets/img/"
```

### Step 5: Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the registration form.

## 📋 Features Implemented

✅ Complete registration form with all required fields
✅ NavBar matching cv.darecentre.in design with links to darecentre.in
✅ Responsive design for mobile and desktop
✅ Form validation (email, phone, required fields)
✅ Registration period validation (Dec 10-18, 2025)
✅ Supabase integration for data storage
✅ Error handling and success messages
✅ Competition categories display
✅ Footer with Dare Centre links

## 🗄️ Database Schema

The form stores data in the `math_lead_registrations` table with the following fields:
- Full Name
- Date of Birth (optional)
- Contact Number
- Email ID
- College Name
- Department/Course
- Year/Semester
- Area of Interest
- Course Interest
- Registration Date (auto-generated)

## 🌐 Deployment

### For Subdomain Deployment:

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your subdomain hosting

3. Ensure environment variables are set in your hosting platform

4. Configure your domain to point the subdomain to the deployed folder

## 📝 Notes

- The form validates registration dates and shows a message if registration is closed
- All navbar links redirect to darecentre.in as requested
- The form works even without Supabase (shows demo mode message)
- Data is stored in Supabase when properly configured

## 🔧 Troubleshooting

**Issue: Images not showing**
- Make sure `dare1.png` and `aicraaa.jpg` are in `public/assets/img/`
- Check browser console for 404 errors

**Issue: Form submission fails**
- Check Supabase credentials in `.env` file
- Verify the `math_lead_registrations` table exists in Supabase
- Check Supabase RLS policies allow inserts

**Issue: Build errors**
- Run `npm install` again
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

