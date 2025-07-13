/*
  # Add password column to employees table

  1. Changes
    - Add `password` column to `employees` table
    - Update existing employees with default passwords
    - Add constraint to ensure password is not null

  2. Security
    - Password column added for direct authentication
    - Existing RLS policies remain unchanged
*/

-- Add password column to employees table
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS password TEXT;

-- Update existing employees with default passwords (should be changed by admin)
UPDATE public.employees 
SET password = 'password123' 
WHERE password IS NULL;

-- Make password column required for new employees
ALTER TABLE public.employees 
ALTER COLUMN password SET NOT NULL;