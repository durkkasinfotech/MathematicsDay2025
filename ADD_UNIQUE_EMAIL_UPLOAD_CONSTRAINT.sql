-- ============================================================================
-- ADD UNIQUE CONSTRAINT TO PREVENT DUPLICATE UPLOADS PER EMAIL
-- ============================================================================
-- This ensures each email can only upload one project file
-- ============================================================================

-- Add unique constraint on email_id in math_project_uploads table
ALTER TABLE math_project_uploads 
DROP CONSTRAINT IF EXISTS math_project_uploads_email_id_unique;

ALTER TABLE math_project_uploads 
ADD CONSTRAINT math_project_uploads_email_id_unique UNIQUE (email_id);

-- Add comment
COMMENT ON CONSTRAINT math_project_uploads_email_id_unique ON math_project_uploads 
IS 'Ensures each email can only upload one project file';

-- Verify the constraint
SELECT 
    conname AS constraint_name,
    contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'math_project_uploads'::regclass
AND conname = 'math_project_uploads_email_id_unique';

-- ============================================================================
-- ✅ DONE! Each email can now only upload once
-- ============================================================================
