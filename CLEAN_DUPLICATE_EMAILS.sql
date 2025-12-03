-- ============================================================================
-- CLEAN DUPLICATE EMAILS - RUN THIS FIRST IF YOU GET DUPLICATE ERROR
-- ============================================================================
-- This script removes duplicate email registrations
-- Keeps the FIRST registration (oldest), deletes the rest
-- ============================================================================

-- Remove duplicate emails (keep the first registration, delete others)
DO $$
DECLARE
    duplicate_record RECORD;
    deleted_count INTEGER := 0;
BEGIN
    -- Find and delete duplicate emails, keeping only the oldest registration
    FOR duplicate_record IN 
        SELECT email_id, MIN(created_at) as first_registration, COUNT(*) as total_count
        FROM math_lead_registrations
        GROUP BY email_id
        HAVING COUNT(*) > 1
    LOOP
        -- Delete duplicates, keeping only the first one (oldest created_at)
        DELETE FROM math_lead_registrations
        WHERE email_id = duplicate_record.email_id
        AND created_at > duplicate_record.first_registration;
        
        GET DIAGNOSTICS deleted_count = ROW_COUNT;
        RAISE NOTICE 'Cleaned % duplicate(s) for email: %', deleted_count, duplicate_record.email_id;
    END LOOP;
    
    RAISE NOTICE '✅ Duplicate cleanup complete!';
END $$;

-- Now add unique constraint
ALTER TABLE math_lead_registrations 
DROP CONSTRAINT IF EXISTS math_lead_registrations_email_id_key;

ALTER TABLE math_lead_registrations 
ADD CONSTRAINT math_lead_registrations_email_id_key UNIQUE (email_id);

-- ============================================================================
-- ✅ DONE! Now each email can only be registered once
-- ============================================================================

