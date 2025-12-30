-- ==========================================
-- VIRUTHAI PONGAL 2026 - DB ALTERATIONS
-- ==========================================

-- 1. Remove old unified field
ALTER TABLE viruthaipongal_registrations DROP COLUMN IF EXISTS college_name;

-- 2. Add specific categorization fields
ALTER TABLE viruthaipongal_registrations 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'School',
ADD COLUMN IF NOT EXISTS standard TEXT,
ADD COLUMN IF NOT EXISTS degree TEXT,
ADD COLUMN IF NOT EXISTS major TEXT,
ADD COLUMN IF NOT EXISTS institute_name TEXT;

-- ==========================================
-- UPDATE COMPLETE
-- ==========================================
