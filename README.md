# Mathematics Day 2025 - Student Registration Portal

Registration portal for Mathematics Day event on December 22, 2025, organized by Dare Centre.

## Features

- Student registration form with all required fields
- Responsive design matching Dare Centre branding
- Supabase integration for data storage
- Navigation bar with links to Dare Centre website
- Form validation and error handling
- Registration period validation

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Supabase Database

Create a table named `math_lead_registrations` in your Supabase database with the following schema:

```sql
CREATE TABLE math_lead_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  contact_number TEXT NOT NULL,
  email_id TEXT NOT NULL,
  college_name TEXT NOT NULL,
  department TEXT NOT NULL,
  year_semester TEXT NOT NULL,
  area_of_interest TEXT NOT NULL,
  course_interest TEXT NOT NULL,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX idx_math_lead_email ON math_lead_registrations(email_id);

-- Enable Row Level Security (optional, adjust as needed)
ALTER TABLE math_lead_registrations ENABLE ROW LEVEL SECURITY;

-- Policy to allow inserts (adjust based on your security requirements)
CREATE POLICY "Allow public inserts" ON math_lead_registrations
  FOR INSERT WITH CHECK (true);
```

### 4. Add Assets

Place the following images in the `public/assets/img/` directory:
- `dare1.png` - Dare Centre logo
- `aicraaa.jpg` - AICRA logo

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 6. Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Registration Form Fields

- **Full Name** (Required)
- **Date of Birth** (Optional)
- **Contact Number** (Required, 10 digits)
- **Email ID** (Required)
- **College Name** (Required)
- **Department / Course** (Required: B.Com, BSc, BCA, BA, MBA, Other)
- **Year / Semester** (Required)
- **Area of Interest** (Required: Edukoot, AI & Robotics, Accounting & Taxation, Digital Marketing)
- **Course Interest** (Required: Yes, No, Maybe)

## Registration Period

- **Registration Opens:** December 10, 2025
- **Registration Closes:** December 18, 2025
- **Online Submission:** December 10 - 19, 2025
- **Result Announcement:** December 22, 2025

## Competition Categories

1. **Math + AI = Innovation** - Simple projects showing Math + AI solving real-life problems
2. **Applied Maths + AI Case Challenges** - Solving real-life industry problems
3. **AI in Finance - Simulation Challenge** - Exploring Math + AI in finance

## Deployment

For subdomain deployment, configure your hosting provider to:
1. Point the subdomain to the `dist` directory after building
2. Ensure environment variables are set in production
3. Configure Supabase RLS policies appropriately

## Support

For issues or questions, contact Dare Centre at [https://darecentre.in/contact.html](https://darecentre.in/contact.html)

