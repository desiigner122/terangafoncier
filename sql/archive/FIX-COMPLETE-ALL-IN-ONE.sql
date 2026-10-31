-- ============================================
-- SCRIPT COMPLET - CORRECTION FINALE
-- ============================================
-- Date: 11 octobre 2025
-- Exécuter ce script UNIQUE dans Supabase SQL Editor
-- ============================================

-- ================================================
-- PARTIE 1: Corriger le trigger notify_admins
-- ================================================

-- Supprimer l'ancien trigger
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;

-- Recréer la fonction avec full_name au lieu de name
CREATE OR REPLACE FUNCTION notify_admins_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO admin_notifications (admin_id, type, title, message, data)
    SELECT 
        id,
        'new_user',
        'Nouvel utilisateur inscrit',
        'Un nouvel utilisateur s''est inscrit: ' || COALESCE(NEW.full_name, NEW.email),
        jsonb_build_object('user_id', NEW.id, 'user_email', NEW.email)
    FROM profiles WHERE role = 'admin';
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recréer le trigger
CREATE TRIGGER on_profile_created
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION notify_admins_new_user();

-- ================================================
-- PARTIE 2: Créer le profil utilisateur manquant
-- ================================================

-- Créer le profil pour l'utilisateur courant
INSERT INTO public.profiles (id, role, email, full_name, created_at, updated_at)
SELECT 
    id,
    'admin' as role,
    email,
    COALESCE(raw_user_meta_data->>'full_name', email) as full_name,
    created_at,
    NOW() as updated_at
FROM auth.users
WHERE id = '4089e51f-85e4-4348-ae0c-f00e4f8ff497'
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    updated_at = NOW();

-- Créer tous les profils manquants pour tous les utilisateurs
INSERT INTO public.profiles (id, role, email, full_name, created_at, updated_at)
SELECT 
    au.id,
    'acheteur' as role,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', au.email) as full_name,
    au.created_at,
    NOW() as updated_at
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- PARTIE 3: Créer/Réparer table marketing_leads
-- ================================================

-- Supprimer l'ancienne table si elle existe
DROP TABLE IF EXISTS public.marketing_leads CASCADE;

-- Créer la table avec le bon schéma
CREATE TABLE public.marketing_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Informations du lead
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    
    -- Source et contexte
    source TEXT DEFAULT 'website',
    page_url TEXT,
    referrer TEXT,
    
    -- Détails de la demande
    subject TEXT,
    message TEXT,
    property_interest TEXT,
    budget_range TEXT,
    
    -- Statut du lead
    status TEXT DEFAULT 'new',
    priority TEXT DEFAULT 'medium',
    
    -- Assignation
    assigned_to UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMPTZ,
    
    -- Notes et suivi
    notes TEXT,
    tags TEXT[],
    
    -- Métadonnées
    user_agent TEXT,
    ip_address INET,
    geo_location JSONB,
    
    -- Consentement RGPD
    consent_marketing BOOLEAN DEFAULT false,
    consent_data_processing BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_contacted_at TIMESTAMPTZ,
    
    -- Soft delete
    deleted_at TIMESTAMPTZ
);

-- Index pour performances
CREATE INDEX idx_marketing_leads_email ON public.marketing_leads(email);
CREATE INDEX idx_marketing_leads_status ON public.marketing_leads(status);
CREATE INDEX idx_marketing_leads_created_at ON public.marketing_leads(created_at DESC);
CREATE INDEX idx_marketing_leads_assigned_to ON public.marketing_leads(assigned_to);
CREATE INDEX idx_marketing_leads_source ON public.marketing_leads(source);

-- Trigger pour updated_at automatique
CREATE OR REPLACE FUNCTION update_marketing_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_marketing_leads_updated_at
    BEFORE UPDATE ON public.marketing_leads
    FOR EACH ROW
    EXECUTE FUNCTION update_marketing_leads_updated_at();

-- RLS (Row Level Security)
ALTER TABLE public.marketing_leads ENABLE ROW LEVEL SECURITY;

-- Policy: Les admins peuvent tout voir
CREATE POLICY "Admins can view all leads"
    ON public.marketing_leads
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Policy: Les admins peuvent tout insérer
CREATE POLICY "Admins can insert leads"
    ON public.marketing_leads
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Policy: Les admins peuvent tout modifier
CREATE POLICY "Admins can update leads"
    ON public.marketing_leads
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Policy: Les admins peuvent tout supprimer
CREATE POLICY "Admins can delete leads"
    ON public.marketing_leads
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Policy: Permettre insertion publique
CREATE POLICY "Public can insert leads"
    ON public.marketing_leads
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Données de test
INSERT INTO public.marketing_leads (full_name, email, phone, source, subject, message, status, priority)
VALUES
    ('Mamadou Diallo', 'mamadou.diallo@example.sn', '+221771234567', 'contact_form', 'Demande de renseignements', 'Je souhaite investir dans l''immobilier à Dakar', 'new', 'high'),
    ('Fatou Sarr', 'fatou.sarr@example.sn', '+221772345678', 'website', 'Intéressée par une villa', 'Je recherche une villa 4 chambres aux Almadies', 'new', 'medium'),
    ('Abdoulaye Ba', 'abdoulaye.ba@example.sn', '+221773456789', 'blockchain_form', 'Tokenisation propriété', 'Comment puis-je tokeniser ma propriété?', 'contacted', 'high'),
    ('Awa Ndiaye', 'awa.ndiaye@example.sn', '+221774567890', 'contact_form', 'Question générale', 'Quels sont vos services pour les expatriés?', 'qualified', 'low'),
    ('Ousmane Fall', 'ousmane.fall@example.sn', '+221775678901', 'website', 'Terrain à vendre', 'J''ai un terrain à vendre à Mbour', 'new', 'medium');

-- ================================================
-- VÉRIFICATIONS FINALES
-- ================================================

-- Vérifier le profil utilisateur
SELECT 
    'PROFIL UTILISATEUR' as check_type,
    id, 
    role, 
    email, 
    full_name 
FROM public.profiles 
WHERE id = '4089e51f-85e4-4348-ae0c-f00e4f8ff497';

-- Vérifier les leads créés
SELECT 
    'MARKETING LEADS' as check_type,
    COUNT(*) as total_leads,
    COUNT(DISTINCT status) as distinct_statuses,
    COUNT(DISTINCT source) as distinct_sources
FROM public.marketing_leads;

-- Vérifier tous les triggers
SELECT 
    'TRIGGERS' as check_type,
    trigger_name, 
    event_object_table
FROM information_schema.triggers
WHERE trigger_name IN ('on_profile_created', 'trigger_update_marketing_leads_updated_at');

-- ================================================
-- RÉSULTAT ATTENDU
-- ================================================
-- ✅ Profil utilisateur créé avec role 'admin'
-- ✅ 5 leads de test insérés
-- ✅ 2 triggers fonctionnels
-- ✅ RLS policies actives
-- ================================================

-- ✅ FIN DU SCRIPT COMPLET
