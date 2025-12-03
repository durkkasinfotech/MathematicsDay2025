-- ============================================================================
-- VERIFY AND CREATE TABLE - RUN THIS FIRST
-- ============================================================================
-- This script will check if table exists and create it if needed
-- ============================================================================

-- Check if table exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'math_lead_registrations'
    ) THEN
        -- Create table if it doesn't exist
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
            competition_course TEXT NOT NULL,
            course_interest TEXT NOT NULL,
            registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        RAISE NOTICE '✅ Table math_lead_registrations created successfully!';
    ELSE
        RAISE NOTICE '✅ Table math_lead_registrations already exists!';
    END IF;
END $$;

-- Verify table exists
SELECT 
    'Table Status' as status,
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'math_lead_registrations'
        ) THEN '✅ EXISTS'
        ELSE '❌ NOT FOUND'
    END as result;

-- ============================================================================
-- ✅ If you see "EXISTS" above, table is ready!
-- If you see "NOT FOUND", run SUPABASE_SETUP.sql completely
-- ============================================================================

