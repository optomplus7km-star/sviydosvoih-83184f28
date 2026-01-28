-- Drop existing trigger and function for groups validation
DROP TRIGGER IF EXISTS validate_group_data ON public.groups;
DROP FUNCTION IF EXISTS public.validate_group_data();

-- Create updated validation function with 5000 character limit for description
CREATE OR REPLACE FUNCTION public.validate_group_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate name
  IF char_length(TRIM(NEW.name)) < 2 OR char_length(TRIM(NEW.name)) > 200 THEN
    RAISE EXCEPTION 'Group name must be between 2 and 200 characters';
  END IF;
  
  -- Validate description length if provided (max 5000 characters)
  IF NEW.description IS NOT NULL AND char_length(TRIM(NEW.description)) > 5000 THEN
    RAISE EXCEPTION 'Description must be less than 5000 characters';
  END IF;
  
  -- Validate contact_email format if provided
  IF NEW.contact_email IS NOT NULL AND NEW.contact_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Validate website format if provided  
  IF NEW.website IS NOT NULL AND NEW.website !~ '^https?://' THEN
    RAISE EXCEPTION 'Website must start with http:// or https://';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Recreate the trigger
CREATE TRIGGER validate_group_data
  BEFORE INSERT OR UPDATE ON public.groups
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_group_data();