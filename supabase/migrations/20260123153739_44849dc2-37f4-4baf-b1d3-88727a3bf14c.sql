-- Add validation trigger for feedback table to enforce server-side input validation
-- This prevents bypassing client-side validation

CREATE OR REPLACE FUNCTION public.validate_feedback_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate name length (2-100 characters)
  IF char_length(TRIM(NEW.name)) < 2 OR char_length(TRIM(NEW.name)) > 100 THEN
    RAISE EXCEPTION 'Name must be between 2 and 100 characters';
  END IF;
  
  -- Validate topic length (3-200 characters)
  IF char_length(TRIM(NEW.topic)) < 3 OR char_length(TRIM(NEW.topic)) > 200 THEN
    RAISE EXCEPTION 'Topic must be between 3 and 200 characters';
  END IF;
  
  -- Validate message length (10-2000 characters)
  IF char_length(TRIM(NEW.message)) < 10 OR char_length(TRIM(NEW.message)) > 2000 THEN
    RAISE EXCEPTION 'Message must be between 10 and 2000 characters';
  END IF;
  
  -- Validate email format if provided
  IF NEW.email IS NOT NULL AND NEW.email != '' THEN
    IF char_length(NEW.email) > 255 THEN
      RAISE EXCEPTION 'Email must be less than 255 characters';
    END IF;
    IF NEW.email !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
      RAISE EXCEPTION 'Invalid email format';
    END IF;
  END IF;
  
  -- Trim whitespace from inputs
  NEW.name := TRIM(NEW.name);
  NEW.topic := TRIM(NEW.topic);
  NEW.message := TRIM(NEW.message);
  IF NEW.email IS NOT NULL THEN
    NEW.email := TRIM(NEW.email);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to run validation before insert
CREATE TRIGGER feedback_validation_trigger
  BEFORE INSERT ON public.feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_feedback_insert();

-- Update feedback INSERT policy to be more restrictive (remove WITH CHECK true)
DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.feedback;

CREATE POLICY "Anyone can submit feedback" 
ON public.feedback 
FOR INSERT 
WITH CHECK (
  char_length(TRIM(name)) BETWEEN 2 AND 100 AND
  char_length(TRIM(topic)) BETWEEN 3 AND 200 AND
  char_length(TRIM(message)) BETWEEN 10 AND 2000 AND
  (email IS NULL OR char_length(email) <= 255)
);