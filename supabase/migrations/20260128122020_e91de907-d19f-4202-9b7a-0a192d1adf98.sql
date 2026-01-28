-- Drop trigger first, then function
DROP TRIGGER IF EXISTS validate_group_trigger ON public.groups;
DROP FUNCTION IF EXISTS public.validate_group_insert_update();