-- Create validation trigger for groups table
CREATE OR REPLACE FUNCTION public.validate_group_insert_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Validate name length (2-100 characters)
  IF char_length(TRIM(COALESCE(NEW.name, ''))) < 2 OR char_length(TRIM(COALESCE(NEW.name, ''))) > 100 THEN
    RAISE EXCEPTION 'Group name must be between 2 and 100 characters';
  END IF;
  
  -- Validate description length if provided (max 2000 characters)
  IF NEW.description IS NOT NULL AND char_length(TRIM(NEW.description)) > 2000 THEN
    RAISE EXCEPTION 'Description must be less than 2000 characters';
  END IF;
  
  -- Validate contact_email format if provided
  IF NEW.contact_email IS NOT NULL AND NEW.contact_email != '' THEN
    IF char_length(NEW.contact_email) > 255 THEN
      RAISE EXCEPTION 'Email must be less than 255 characters';
    END IF;
    IF NEW.contact_email !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
      RAISE EXCEPTION 'Invalid email format';
    END IF;
  END IF;
  
  -- Validate website URL format if provided (basic check)
  IF NEW.website IS NOT NULL AND NEW.website != '' THEN
    IF char_length(NEW.website) > 500 THEN
      RAISE EXCEPTION 'Website URL must be less than 500 characters';
    END IF;
    IF NEW.website !~ '^https?://' THEN
      RAISE EXCEPTION 'Website URL must start with http:// or https://';
    END IF;
  END IF;
  
  -- Validate image_url format if provided
  IF NEW.image_url IS NOT NULL AND NEW.image_url != '' THEN
    IF char_length(NEW.image_url) > 1000 THEN
      RAISE EXCEPTION 'Image URL must be less than 1000 characters';
    END IF;
  END IF;
  
  -- Trim whitespace from inputs
  NEW.name := TRIM(NEW.name);
  IF NEW.description IS NOT NULL THEN
    NEW.description := TRIM(NEW.description);
  END IF;
  IF NEW.contact_email IS NOT NULL THEN
    NEW.contact_email := TRIM(NEW.contact_email);
  END IF;
  IF NEW.website IS NOT NULL THEN
    NEW.website := TRIM(NEW.website);
  END IF;
  IF NEW.image_url IS NOT NULL THEN
    NEW.image_url := TRIM(NEW.image_url);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for groups
DROP TRIGGER IF EXISTS validate_group_trigger ON public.groups;
CREATE TRIGGER validate_group_trigger
BEFORE INSERT OR UPDATE ON public.groups
FOR EACH ROW
EXECUTE FUNCTION public.validate_group_insert_update();

-- Create validation trigger for projects table
CREATE OR REPLACE FUNCTION public.validate_project_insert_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Validate title length (2-200 characters)
  IF char_length(TRIM(COALESCE(NEW.title, ''))) < 2 OR char_length(TRIM(COALESCE(NEW.title, ''))) > 200 THEN
    RAISE EXCEPTION 'Project title must be between 2 and 200 characters';
  END IF;
  
  -- Validate description length if provided (max 5000 characters)
  IF NEW.description IS NOT NULL AND char_length(TRIM(NEW.description)) > 5000 THEN
    RAISE EXCEPTION 'Description must be less than 5000 characters';
  END IF;
  
  -- Validate requirements length if provided (max 2000 characters)
  IF NEW.requirements IS NOT NULL AND char_length(TRIM(NEW.requirements)) > 2000 THEN
    RAISE EXCEPTION 'Requirements must be less than 2000 characters';
  END IF;
  
  -- Validate resources length if provided (max 2000 characters)
  IF NEW.resources IS NOT NULL AND char_length(TRIM(NEW.resources)) > 2000 THEN
    RAISE EXCEPTION 'Resources must be less than 2000 characters';
  END IF;
  
  -- Validate status values
  IF NEW.status NOT IN ('open', 'in_progress', 'closed') THEN
    RAISE EXCEPTION 'Status must be one of: open, in_progress, closed';
  END IF;
  
  -- Validate participants counts are non-negative
  IF NEW.target_participants IS NOT NULL AND NEW.target_participants < 0 THEN
    RAISE EXCEPTION 'Target participants cannot be negative';
  END IF;
  IF NEW.current_participants IS NOT NULL AND NEW.current_participants < 0 THEN
    RAISE EXCEPTION 'Current participants cannot be negative';
  END IF;
  
  -- Trim whitespace from inputs
  NEW.title := TRIM(NEW.title);
  IF NEW.description IS NOT NULL THEN
    NEW.description := TRIM(NEW.description);
  END IF;
  IF NEW.requirements IS NOT NULL THEN
    NEW.requirements := TRIM(NEW.requirements);
  END IF;
  IF NEW.resources IS NOT NULL THEN
    NEW.resources := TRIM(NEW.resources);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for projects
DROP TRIGGER IF EXISTS validate_project_trigger ON public.projects;
CREATE TRIGGER validate_project_trigger
BEFORE INSERT OR UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.validate_project_insert_update();