-- Script de création des tables manquantes pour Teranga Foncier
-- Ce script doit être exécuté dans Supabase SQL Editor

-- 1. Table profiles (alias de user_profiles)
CREATE OR REPLACE VIEW public.profiles AS 
SELECT * FROM public.user_profiles;

-- 2. Table transactions
CREATE TABLE IF NOT EXISTS public.transactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    parcel_id uuid,
    amount numeric NOT NULL,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    type text DEFAULT 'purchase' CHECK (type IN ('purchase', 'sale', 'commission', 'fee')),
    description text,
    reference_number text UNIQUE,
    payment_method text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Table appointments
CREATE TABLE IF NOT EXISTS public.appointments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    agent_id uuid REFERENCES auth.users(id),
    parcel_id uuid,
    title text NOT NULL,
    description text,
    scheduled_date timestamp with time zone NOT NULL,
    duration_minutes integer DEFAULT 60,
    status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled')),
    type text DEFAULT 'viewing' CHECK (type IN ('viewing', 'consultation', 'signature', 'inspection')),
    location text,
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Table vendor_verifications pour les documents des vendeurs
CREATE TABLE IF NOT EXISTS public.vendor_verifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    document_type text NOT NULL CHECK (document_type IN ('identity', 'proof_address', 'property_titles', 'tax_certificate')),
    document_url text,
    document_data text, -- Base64 pour stockage alternatif
    filename text,
    file_size integer,
    content_type text,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by uuid REFERENCES auth.users(id),
    reviewed_at timestamp with time zone,
    rejection_reason text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, document_type)
);

-- Activer RLS sur toutes les nouvelles tables
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_verifications ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions" ON public.transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'Admin'
        )
    );

-- Politiques RLS pour appointments
CREATE POLICY "Users can view their own appointments" ON public.appointments
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = agent_id);

CREATE POLICY "Users can insert their own appointments" ON public.appointments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments" ON public.appointments
    FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = agent_id);

CREATE POLICY "Admins can view all appointments" ON public.appointments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'Admin'
        )
    );

-- Politiques RLS pour vendor_verifications
CREATE POLICY "Users can view their own verifications" ON public.vendor_verifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own verifications" ON public.vendor_verifications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own verifications" ON public.vendor_verifications
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can manage all verifications" ON public.vendor_verifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role IN ('Admin', 'Agent foncier')
        )
    );

-- Fonctions pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_verifications_updated_at
    BEFORE UPDATE ON public.vendor_verifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour obtenir les statistiques d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_dashboard_stats(user_uuid uuid)
RETURNS json AS $$
DECLARE
    stats json;
BEGIN
    SELECT json_build_object(
        'total_transactions', COALESCE((
            SELECT COUNT(*) FROM public.transactions 
            WHERE user_id = user_uuid
        ), 0),
        'pending_transactions', COALESCE((
            SELECT COUNT(*) FROM public.transactions 
            WHERE user_id = user_uuid AND status = 'pending'
        ), 0),
        'upcoming_appointments', COALESCE((
            SELECT COUNT(*) FROM public.appointments 
            WHERE user_id = user_uuid AND scheduled_date > now() AND status IN ('scheduled', 'confirmed')
        ), 0),
        'verification_status', COALESCE((
            SELECT CASE 
                WHEN COUNT(*) = 0 THEN 'not_started'
                WHEN COUNT(*) FILTER (WHERE status = 'approved') = COUNT(*) FILTER (WHERE document_type IN ('identity', 'proof_address', 'property_titles')) THEN 'approved'
                WHEN COUNT(*) FILTER (WHERE status = 'rejected') > 0 THEN 'rejected'
                ELSE 'pending'
            END
            FROM public.vendor_verifications 
            WHERE user_id = user_uuid
        ), 'not_started')
    ) INTO stats;
    
    RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Accorder les permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vendor_verifications TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_dashboard_stats TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Insérer quelques données de test
INSERT INTO public.transactions (user_id, amount, status, type, description, reference_number) VALUES
(
    (SELECT id FROM auth.users LIMIT 1), 
    500000, 
    'completed', 
    'purchase', 
    'Achat terrain Parcelle #001', 
    'TXN-' || EXTRACT(epoch FROM now())::text
),
(
    (SELECT id FROM auth.users LIMIT 1), 
    25000, 
    'pending', 
    'fee', 
    'Frais de dossier', 
    'TXN-' || (EXTRACT(epoch FROM now()) + 1)::text
);

INSERT INTO public.appointments (user_id, title, description, scheduled_date, status, type) VALUES
(
    (SELECT id FROM auth.users LIMIT 1),
    'Visite terrain agricole',
    'Visite du terrain pour évaluation',
    (now() + interval '3 days'),
    'scheduled',
    'viewing'
),
(
    (SELECT id FROM auth.users LIMIT 1),
    'Signature contrat',
    'Signature finale du contrat de vente',
    (now() + interval '7 days'),
    'confirmed',
    'signature'
);

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Tables créées avec succès: transactions, appointments, vendor_verifications, profiles (view)';
    RAISE NOTICE 'Politiques RLS configurées';
    RAISE NOTICE 'Données de test insérées';
END $$;
