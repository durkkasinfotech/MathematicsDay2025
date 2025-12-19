-- ============================================================================
-- CLEAN DUPLICATE UPLOADS AND ADD UNIQUE CONSTRAINT
-- ============================================================================
-- This script:
-- 1. Identifies duplicate uploads (same email)
-- 2. Keeps the FIRST upload (oldest uploaded_at)
-- 3. Deletes the duplicates
-- 4. Adds unique constraint to prevent future duplicates
-- ============================================================================

-- Step 1: Show current duplicates (for reference)
SELECT 
    email_id, 
    COUNT(*) as upload_count,
    MIN(uploaded_at) as first_upload,
    MAX(uploaded_at) as last_upload
FROM math_project_uploads
GROUP BY email_id
HAVING COUNT(*) > 1
ORDER BY upload_count DESC;

-- Step 2: Remove duplicates, keeping only the oldest upload for each email
DO $$
DECLARE
    duplicate_record RECORD;
    deleted_count INTEGER := 0;
BEGIN
    RAISE NOTICE 'Starting duplicate cleanup for math_project_uploads...';
    
    -- Find and delete duplicate uploads, keeping only the first one (oldest uploaded_at)
    FOR duplicate_record IN 
        SELECT email_id, MIN(uploaded_at) as first_upload
        FROM math_project_uploads
        GROUP BY email_id
        HAVING COUNT(*) > 1
    LOOP
        -- Delete duplicates, keeping only the first one (oldest uploaded_at)
        DELETE FROM math_project_uploads
        WHERE email_id = duplicate_record.email_id
        AND uploaded_at > duplicate_record.first_upload;
        
        GET DIAGNOSTICS deleted_count = ROW_COUNT;
        RAISE NOTICE 'Cleaned % duplicate(s) for email: %', deleted_count, duplicate_record.email_id;
    END LOOP;
    
    RAISE NOTICE '✅ Duplicate cleanup complete!';
END $$;

-- Step 3: Verify no duplicates remain
SELECT 
    email_id, 
    COUNT(*) as upload_count
FROM math_project_uploads
GROUP BY email_id
HAVING COUNT(*) > 1;
-- Should return no rows

-- Step 4: Add unique constraint
ALTER TABLE math_project_uploads 
DROP CONSTRAINT IF EXISTS math_project_uploads_email_id_unique;

ALTER TABLE math_project_uploads 
ADD CONSTRAINT math_project_uploads_email_id_unique UNIQUE (email_id);

-- Step 5: Add comment
COMMENT ON CONSTRAINT math_project_uploads_email_id_unique ON math_project_uploads 
IS 'Ensures each email can only upload one project file';

-- Step 6: Verify the constraint was added
SELECT 
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'math_project_uploads'::regclass
AND conname = 'math_project_uploads_email_id_unique';

-- ============================================================================
-- ✅ DONE! 
-- - Duplicates removed (kept oldest upload for each email)
-- - Unique constraint added
-- - Each email can now only upload once
-- ============================================================================
