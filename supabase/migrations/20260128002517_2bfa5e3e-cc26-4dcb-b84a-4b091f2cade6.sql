-- =============================================
-- KRAKEN MORSKOI: Extended Database Schema
-- =============================================

-- 1. Project/Group Galleries (multi-image support)
CREATE TABLE public.project_images (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_thumbnail BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.group_images (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_thumbnail BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Social Links for projects and groups
CREATE TABLE public.project_social_links (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    platform TEXT NOT NULL, -- 'telegram', 'instagram', 'youtube', 'twitter', 'website', 'email'
    url TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.group_social_links (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. News/Blog articles
CREATE TABLE public.news (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    author_id UUID NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Polls/Voting system
CREATE TABLE public.polls (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_multiple_choice BOOLEAN NOT NULL DEFAULT false,
    ends_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.poll_options (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
    option_text TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.poll_votes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
    option_id UUID REFERENCES public.poll_options(id) ON DELETE CASCADE NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(poll_id, user_id, option_id)
);

-- 5. Extend projects table with new fields
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS deadline TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS target_participants INTEGER,
ADD COLUMN IF NOT EXISTS current_participants INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS resources TEXT,
ADD COLUMN IF NOT EXISTS owner_id UUID;

-- 6. Extend groups table with hierarchy support
ALTER TABLE public.groups 
ADD COLUMN IF NOT EXISTS parent_group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_private BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS owner_id UUID;

-- 7. Group membership table
CREATE TABLE public.group_members (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    user_id UUID NOT NULL,
    role TEXT NOT NULL DEFAULT 'member', -- 'owner', 'admin', 'member'
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(group_id, user_id)
);

-- =============================================
-- Enable RLS on all new tables
-- =============================================

ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS Policies
-- =============================================

-- Project Images: public read, owner/admin write
CREATE POLICY "Anyone can view project images" ON public.project_images
FOR SELECT USING (true);

CREATE POLICY "Admins can manage project images" ON public.project_images
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Group Images: public read for active groups, owner/admin write
CREATE POLICY "Anyone can view group images" ON public.group_images
FOR SELECT USING (true);

CREATE POLICY "Admins can manage group images" ON public.group_images
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Social Links: public read, admin write
CREATE POLICY "Anyone can view project social links" ON public.project_social_links
FOR SELECT USING (true);

CREATE POLICY "Admins can manage project social links" ON public.project_social_links
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view group social links" ON public.group_social_links
FOR SELECT USING (true);

CREATE POLICY "Admins can manage group social links" ON public.group_social_links
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- News: published for all, admin manages all
CREATE POLICY "Anyone can view published news" ON public.news
FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage news" ON public.news
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Polls: active polls visible to authenticated users
CREATE POLICY "Authenticated users can view active polls" ON public.polls
FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Admins can manage polls" ON public.polls
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Poll Options: visible if poll is visible
CREATE POLICY "Authenticated users can view poll options" ON public.poll_options
FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.polls WHERE polls.id = poll_options.poll_id AND polls.is_active = true)
);

CREATE POLICY "Admins can manage poll options" ON public.poll_options
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Poll Votes: users can vote and see their own votes
CREATE POLICY "Users can vote in polls" ON public.poll_votes
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own votes" ON public.poll_votes
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all votes" ON public.poll_votes
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Group Members: visible to group members and admins
CREATE POLICY "Members can view group membership" ON public.group_members
FOR SELECT TO authenticated USING (
    auth.uid() = user_id OR 
    has_role(auth.uid(), 'admin'::app_role) OR
    EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid())
);

CREATE POLICY "Users can join public groups" ON public.group_members
FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM public.groups WHERE groups.id = group_members.group_id AND groups.is_private = false)
);

CREATE POLICY "Admins can manage group members" ON public.group_members
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- Triggers for updated_at
-- =============================================

CREATE TRIGGER update_news_updated_at
    BEFORE UPDATE ON public.news
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_polls_updated_at
    BEFORE UPDATE ON public.polls
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- Indexes for performance
-- =============================================

CREATE INDEX idx_project_images_project_id ON public.project_images(project_id);
CREATE INDEX idx_group_images_group_id ON public.group_images(group_id);
CREATE INDEX idx_news_published ON public.news(is_published, published_at DESC);
CREATE INDEX idx_polls_active ON public.polls(is_active);
CREATE INDEX idx_poll_votes_poll_id ON public.poll_votes(poll_id);
CREATE INDEX idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX idx_group_members_user_id ON public.group_members(user_id);

-- =============================================
-- Storage bucket for media
-- =============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'media', 
    'media', 
    true, 
    52428800, -- 50MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view media" ON storage.objects
FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');

CREATE POLICY "Users can update their own media" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own media" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);