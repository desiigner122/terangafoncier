-- ============================================
-- FIX TABLE MARKETING_LEADS
-- ============================================
-- Date: 11 octobre 2025
-- Problème: Colonne 'email' manquante (erreur PGRST204)
-- Solution: Créer ou réparer la table marketing_leads
-- ============================================

-- 1. Supprimer l'ancienne table si elle existe (ATTENTION: perte de données)
DROP TABLE IF EXISTS public.marketing_leads CASCADE;

-- 2. Créer la table marketing_leads avec TOUTES les colonnes nécessaires
CREATE TABLE public.marketing_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Informations du lead
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    
    -- Source et contexte
    source TEXT DEFAULT 'website', -- website, contact_form, blockchain_form, etc.
    page_url TEXT, -- URL de la page d'origine
    referrer TEXT, -- Referrer HTTP
    
    -- Détails de la demande
    subject TEXT,
    message TEXT,
    property_interest TEXT, -- ID ou type de propriété
    budget_range TEXT, -- Ex: "50M-100M FCFA"
    
    -- Statut du lead
    status TEXT DEFAULT 'new', -- new, contacted, qualified, converted, lost
    priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
    
    -- Assignation
    assigned_to UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMPTZ,
    
    -- Notes et suivi
    notes TEXT,
    tags TEXT[], -- Array de tags pour catégorisation
    
    -- Métadonnées
    user_agent TEXT,
    ip_address INET,
    geo_location JSONB, -- {city, country, lat, lng}
    
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

-- 3. Index pour performances
CREATE INDEX idx_marketing_leads_email ON public.marketing_leads(email);
CREATE INDEX idx_marketing_leads_status ON public.marketing_leads(status);
CREATE INDEX idx_marketing_leads_created_at ON public.marketing_leads(created_at DESC);
CREATE INDEX idx_marketing_leads_assigned_to ON public.marketing_leads(assigned_to);
CREATE INDEX idx_marketing_leads_source ON public.marketing_leads(source);

-- 4. Trigger pour updated_at automatique
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

-- 5. RLS (Row Level Security)
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

-- Policy: Permettre insertion publique (formulaires de contact)
CREATE POLICY "Public can insert leads"
    ON public.marketing_leads
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- 6. Données de test (optionnel)
INSERT INTO public.marketing_leads (full_name, email, phone, source, subject, message, status, priority)
VALUES
    ('Mamadou Diallo', 'mamadou.diallo@example.sn', '+221771234567', 'contact_form', 'Demande de renseignements', 'Je souhaite investir dans l''immobilier à Dakar', 'new', 'high'),
    ('Fatou Sarr', 'fatou.sarr@example.sn', '+221772345678', 'website', 'Intéressée par une villa', 'Je recherche une villa 4 chambres aux Almadies', 'new', 'medium'),
    ('Abdoulaye Ba', 'abdoulaye.ba@example.sn', '+221773456789', 'blockchain_form', 'Tokenisation propriété', 'Comment puis-je tokeniser ma propriété?', 'contacted', 'high'),
    ('Awa Ndiaye', 'awa.ndiaye@example.sn', '+221774567890', 'contact_form', 'Question générale', 'Quels sont vos services pour les expatriés?', 'qualified', 'low'),
    ('Ousmane Fall', 'ousmane.fall@example.sn', '+221775678901', 'website', 'Terrain à vendre', 'J''ai un terrain à vendre à Mbour', 'new', 'medium');

-- 7. Vérification
SELECT 
    COUNT(*) as total_leads,
    COUNT(DISTINCT status) as distinct_statuses,
    COUNT(DISTINCT source) as distinct_sources
FROM public.marketing_leads;

-- 8. Afficher la structure de la table
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'marketing_leads'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ============================================
-- INSTRUCTIONS
-- ============================================
-- 1. Copier tout ce script
-- 2. Ouvrir Supabase Dashboard → SQL Editor
-- 3. Coller et exécuter
-- 4. Vérifier les résultats
-- 5. Redémarrer l'application: npm run dev
-- 6. Tester le formulaire de contact
-- ============================================

-- ✅ FIN DU SCRIPT
