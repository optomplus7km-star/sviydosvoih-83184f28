-- Drop project_social_links table
DROP TABLE IF EXISTS public.project_social_links;

-- Drop project_images table  
DROP TABLE IF EXISTS public.project_images;

-- Add images array field to projects table (stores up to 10 image URLs)
ALTER TABLE public.projects 
ADD COLUMN images text[] DEFAULT '{}';

-- Add constraint to limit images to 10
ALTER TABLE public.projects
ADD CONSTRAINT projects_images_max_10 
CHECK (array_length(images, 1) IS NULL OR array_length(images, 1) <= 10);