-- Add display_order column to groups for ordering
ALTER TABLE public.groups 
ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;

-- Create an index for efficient ordering
CREATE INDEX IF NOT EXISTS idx_groups_display_order ON public.groups(parent_group_id, display_order);

-- Initialize display_order based on created_at for existing groups
WITH ordered_groups AS (
  SELECT id, 
    ROW_NUMBER() OVER (PARTITION BY parent_group_id ORDER BY created_at) - 1 as new_order
  FROM public.groups
)
UPDATE public.groups g
SET display_order = og.new_order
FROM ordered_groups og
WHERE g.id = og.id;