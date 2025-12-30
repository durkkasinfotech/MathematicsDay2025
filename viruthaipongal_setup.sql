-- ==========================================
-- VIRUTHAI PONGAL 2026 - DATABASE SETUP (UPDATED)
-- ==========================================

-- 1. Create a sequence for the registration numbers
CREATE SEQUENCE IF NOT EXISTS viruthaipongal_reg_seq START 1;

-- 2. Create the Registrations Table
CREATE TABLE IF NOT EXISTS viruthaipongal_registrations (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    registration_no TEXT UNIQUE DEFAULT ('VP2026-' || LPAD(nextval('viruthaipongal_reg_seq')::text, 4, '0')),
    full_name TEXT NOT NULL,
    college_name TEXT NOT NULL,
    email_id TEXT UNIQUE NOT NULL,
    contact_number TEXT NOT NULL,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create the Video Submissions Table
-- Altered to include instagram_link as mandatory
CREATE TABLE IF NOT EXISTS viruthaipongal_submissions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email_id TEXT UNIQUE NOT NULL REFERENCES viruthaipongal_registrations(email_id) ON DELETE CASCADE,
    drive_link TEXT NOT NULL,
    instagram_link TEXT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Alternative Alter Command if table already exists:
-- ALTER TABLE viruthaipongal_submissions ADD COLUMN instagram_link TEXT NOT NULL;

-- 4. Disable Row Level Security (RLS) 
ALTER TABLE viruthaipongal_registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE viruthaipongal_submissions DISABLE ROW LEVEL SECURITY;

-- 5. Grant Permissions
GRANT ALL ON TABLE viruthaipongal_registrations TO anon, authenticated, service_role;
GRANT ALL ON TABLE viruthaipongal_submissions TO anon, authenticated, service_role;
GRANT ALL ON SEQUENCE viruthaipongal_reg_seq TO anon, authenticated, service_role;

-- ==========================================
-- SETUP COMPLETE
-- ==========================================
