-- ============================================================================
-- TEMPORARY FIX: DISABLE RLS (FOR TESTING ONLY)
-- ============================================================================
-- Use this ONLY if the main setup still doesn't work
-- This disables RLS completely - less secure but will work
-- ============================================================================

-- Disable RLS on the table
ALTER TABLE math_lead_registrations DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ⚠️ WARNING: This makes your table accessible to anyone
-- Use only for testing, then re-enable RLS with proper policies
-- ============================================================================
-- To re-enable RLS later, run:
-- ALTER TABLE math_lead_registrations ENABLE ROW LEVEL SECURITY;
-- Then create proper policies
-- ============================================================================

