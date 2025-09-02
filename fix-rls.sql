-- Script de correction pour supprimer les politiques RLS problématiques
-- À exécuter IMMÉDIATEMENT dans l'éditeur SQL de Supabase

-- Supprimer toutes les politiques qui causent la récursion infinie
DROP POLICY IF EXISTS "Admins can do everything on notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can do everything on parcels" ON public.parcels;
DROP POLICY IF EXISTS "Admins can do everything on requests" ON public.requests;
DROP POLICY IF EXISTS "Admins can do everything on audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admins can do everything on users" ON public.users;

-- Supprimer aussi les autres politiques pour simplifier
DROP POLICY IF EXISTS "Users can read their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can read their own parcels" ON public.parcels;
DROP POLICY IF EXISTS "Users can read their own requests" ON public.requests;
DROP POLICY IF EXISTS "Users can read their own profile" ON public.users;

-- Désactiver temporairement RLS sur toutes les tables pour permettre l'accès
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.parcels DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Créer des politiques simples et sécurisées sans récursion
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Supprimer d'abord toutes les politiques existantes pour éviter les conflits
DROP POLICY IF EXISTS "Authenticated users can read users" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;

-- Politique simple pour les utilisateurs connectés
CREATE POLICY "Authenticated users can read users" 
ON public.users FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.users FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.users FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- Pour les autres tables, on autorise tout pour les utilisateurs authentifiés (temporaire)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can access notifications" ON public.notifications;
CREATE POLICY "Authenticated users can access notifications" 
ON public.notifications FOR ALL 
TO authenticated 
USING (true);

ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can access parcels" ON public.parcels;
CREATE POLICY "Authenticated users can access parcels" 
ON public.parcels FOR ALL 
TO authenticated 
USING (true);

ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can access requests" ON public.requests;
CREATE POLICY "Authenticated users can access requests" 
ON public.requests FOR ALL 
TO authenticated 
USING (true);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can access audit_logs" ON public.audit_logs;
CREATE POLICY "Authenticated users can access audit_logs" 
ON public.audit_logs FOR ALL 
TO authenticated 
USING (true);
