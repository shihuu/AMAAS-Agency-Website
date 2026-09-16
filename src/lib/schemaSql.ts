/**
 * Complete Supabase SQL Schema and RLS Policies for AMAAS Agency CMS.
 * Embedded directly to ensure offline/fail-safe clipboard copying.
 */
export const SUPABASE_SCHEMA_SQL = `-- ==============================================================================
-- AMAAS AGENCY CMS - COMPLETE SUPABASE SQL SCHEMA & RLS POLICIES
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ADMIN USERS TABLE (Role-Based Authorization)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT admin_users_user_id_key UNIQUE (user_id),
  CONSTRAINT admin_users_email_key UNIQUE (email)
);

-- 3. INQUIRIES TABLE (Consultation submissions)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  service TEXT,
  budget TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT,
  short_description TEXT,
  full_description TEXT,
  category TEXT DEFAULT 'Full-Stack Web App',
  client_name TEXT,
  project_type TEXT,
  technologies JSONB DEFAULT '[]'::jsonb,
  thumbnail_url TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  project_url TEXT,
  case_study_url TEXT,
  github_url TEXT,
  project_date TEXT DEFAULT '2026',
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  status TEXT DEFAULT 'completed',
  tags JSONB DEFAULT '[]'::jsonb,
  case_study JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  number TEXT,
  title TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  icon_url TEXT DEFAULT 'Layout',
  features JSONB DEFAULT '[]'::jsonb,
  starting_price TEXT,
  cta_text TEXT DEFAULT 'Start Your Project',
  cta_url TEXT DEFAULT '#contact',
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. PRICING PACKAGES TABLE
CREATE TABLE IF NOT EXISTS public.pricing_packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  currency TEXT DEFAULT '$',
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  cta_text TEXT DEFAULT 'Start Your Project',
  cta_url TEXT DEFAULT '#contact',
  badge TEXT,
  featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  company TEXT,
  role TEXT,
  testimonial TEXT NOT NULL,
  photo_url TEXT,
  rating INT DEFAULT 5,
  featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. WEBSITE CONTENT TABLE
CREATE TABLE IF NOT EXISTS public.website_content (
  id TEXT PRIMARY KEY,
  section TEXT NOT NULL,
  content_key TEXT NOT NULL,
  content_value TEXT NOT NULL,
  content_type TEXT DEFAULT 'text',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. MEDIA ASSETS TABLE
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Helper function to check if current user is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'superadmin', 'owner')
  );
END;
$$;

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- A. ADMIN USERS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admin users readable by self or admin" ON public.admin_users;
CREATE POLICY "Admin users readable by self or admin" ON public.admin_users
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Admin users manageable by admin" ON public.admin_users;
CREATE POLICY "Admin users manageable by admin" ON public.admin_users
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- B. INQUIRIES POLICIES
-- Anyone (anon/public) can insert an inquiry from the consultation form.
-- ONLY authenticated admins can read, update, or delete inquiries.
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can submit inquiry" ON public.inquiries;
CREATE POLICY "Anyone can submit inquiry" ON public.inquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view inquiries" ON public.inquiries;
CREATE POLICY "Admins can view inquiries" ON public.inquiries
  FOR SELECT TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update inquiries" ON public.inquiries;
CREATE POLICY "Admins can update inquiries" ON public.inquiries
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete inquiries" ON public.inquiries;
CREATE POLICY "Admins can delete inquiries" ON public.inquiries
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- C. PROJECTS POLICIES
-- Public can view published projects. Admins have full access.
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
CREATE POLICY "Public can view published projects" ON public.projects
  FOR SELECT TO anon, authenticated
  USING (published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage projects" ON public.projects;
CREATE POLICY "Admins manage projects" ON public.projects
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;
CREATE POLICY "Admins can delete projects" ON public.projects
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- D. SERVICES POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view active services" ON public.services;
CREATE POLICY "Public can view active services" ON public.services
  FOR SELECT TO anon, authenticated
  USING (active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage services" ON public.services;
CREATE POLICY "Admins manage services" ON public.services
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- E. PRICING PACKAGES POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view active pricing" ON public.pricing_packages;
CREATE POLICY "Public can view active pricing" ON public.pricing_packages
  FOR SELECT TO anon, authenticated
  USING (active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage pricing" ON public.pricing_packages;
CREATE POLICY "Admins manage pricing" ON public.pricing_packages
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- F. TESTIMONIALS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view active testimonials" ON public.testimonials;
CREATE POLICY "Public can view active testimonials" ON public.testimonials
  FOR SELECT TO anon, authenticated
  USING (active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage testimonials" ON public.testimonials;
CREATE POLICY "Admins manage testimonials" ON public.testimonials
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- G. WEBSITE CONTENT POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view website content" ON public.website_content;
CREATE POLICY "Public can view website content" ON public.website_content
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins manage website content" ON public.website_content;
CREATE POLICY "Admins manage website content" ON public.website_content
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- H. MEDIA ASSETS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view media assets" ON public.media_assets;
CREATE POLICY "Public can view media assets" ON public.media_assets
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins manage media assets" ON public.media_assets;
CREATE POLICY "Admins manage media assets" ON public.media_assets
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- STORAGE BUCKET: website-assets
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('website-assets', 'website-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can read website-assets" ON storage.objects;
CREATE POLICY "Public can read website-assets" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'website-assets');

DROP POLICY IF EXISTS "Admins can upload to website-assets" ON storage.objects;
CREATE POLICY "Admins can upload to website-assets" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'website-assets' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update website-assets" ON storage.objects;
CREATE POLICY "Admins can update website-assets" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'website-assets' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete from website-assets" ON storage.objects;
CREATE POLICY "Admins can delete from website-assets" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'website-assets' AND public.is_admin());
`;
