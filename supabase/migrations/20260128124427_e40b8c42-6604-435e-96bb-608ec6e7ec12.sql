-- Add display_order column to projects for ordering
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;

-- Create an index for efficient ordering
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON public.projects(display_order);

-- Initialize display_order based on created_at for existing projects
WITH ordered_projects AS (
  SELECT id, 
    ROW_NUMBER() OVER (ORDER BY created_at) - 1 as new_order
  FROM public.projects
)
UPDATE public.projects p
SET display_order = op.new_order
FROM ordered_projects op
WHERE p.id = op.id;