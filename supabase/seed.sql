-- Script de création des tables manquantes pour Teranga Foncier
-- À exécuter dans l'éditeur SQL de Supabase

-- Table notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Table parcels (parcelles)
CREATE TABLE IF NOT EXISTS public.parcels (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    price numeric,
    surface numeric,
    location text,
    status text DEFAULT 'Disponible',
    owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Table requests (demandes)
CREATE TABLE IF NOT EXISTS public.requests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    request_type text NOT NULL,
    status text DEFAULT 'pending',
    details jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Table audit_logs (journaux d'audit)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    actor_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    action text NOT NULL,
    details text,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);

-- Table users (profils utilisateurs étendus)
CREATE TABLE IF NOT EXISTS public.users (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name text,
    phone text,
    role text DEFAULT 'Particulier',
    verification_status text DEFAULT 'unverified',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Activer RLS (Row Level Security)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité basiques
CREATE POLICY "Users can read their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read their own parcels" ON public.parcels FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can read their own requests" ON public.requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read their own profile" ON public.users FOR SELECT USING (auth.uid() = id);

-- Politiques pour les admins (permet tout)
CREATE POLICY "Admins can do everything on notifications" ON public.notifications FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin')
);
CREATE POLICY "Admins can do everything on parcels" ON public.parcels FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin')
);
CREATE POLICY "Admins can do everything on requests" ON public.requests FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin')
);
CREATE POLICY "Admins can do everything on audit_logs" ON public.audit_logs FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin')
);
CREATE POLICY "Admins can do everything on users" ON public.users FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin')
);
