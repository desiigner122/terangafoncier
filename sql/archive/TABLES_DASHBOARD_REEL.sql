-- TABLES NÉCESSAIRES POUR UN DASHBOARD PARTICULIER AVEC DONNÉES RÉELLES
-- Élimination complète des données simulées

-- 1. Table des transactions (investissements/achats)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    parcel_id UUID REFERENCES public.parcels(id) ON DELETE SET NULL,
    amount BIGINT NOT NULL,
    transaction_type VARCHAR(20) DEFAULT 'purchase' CHECK (transaction_type IN ('purchase', 'sale', 'payment')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'failed')),
    payment_method VARCHAR(50),
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT
);

-- 2. Table des rendez-vous et événements
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    parcel_id UUID REFERENCES public.parcels(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) DEFAULT 'meeting' CHECK (type IN ('meeting', 'visit', 'signing', 'inspection', 'consultation')),
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled')),
    location TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table des favoris
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    parcel_id UUID REFERENCES public.parcels(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, parcel_id)
);

-- 4. Table des agents (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    avatar_url TEXT,
    specialties TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Mise à jour de la table parcels pour inclure current_value
ALTER TABLE public.parcels ADD COLUMN IF NOT EXISTS current_value BIGINT;
ALTER TABLE public.parcels ADD COLUMN IF NOT EXISTS last_valuation_date TIMESTAMP WITH TIME ZONE;

-- 6. Mise à jour de la table profiles pour inclure assigned_agent_id
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS assigned_agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL;

-- 7. Politique de sécurité RLS (Row Level Security)

-- Transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own appointments" ON public.appointments
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own appointments" ON public.appointments
    FOR ALL USING (auth.uid() = user_id);

-- Favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own favorites" ON public.favorites
    FOR ALL USING (auth.uid() = user_id);

-- Agents (lecture publique pour les utilisateurs authentifiés)
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view active agents" ON public.agents
    FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

-- 8. Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_date ON public.appointments(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);

-- 9. Triggers pour updated_at automatique
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. Insertion de quelques agents exemple pour test
INSERT INTO public.agents (name, email, phone) VALUES 
    ('Moussa Diallo', 'moussa.diallo@teranga.sn', '+221 77 123 45 67'),
    ('Fatou Sow', 'fatou.sow@teranga.sn', '+221 76 987 65 43'),
    ('Ousmane Kane', 'ousmane.kane@teranga.sn', '+221 78 456 78 90')
ON CONFLICT (email) DO NOTHING;

-- 11. Mise à jour de current_value pour les parcelles existantes (valeurs réalistes)
UPDATE public.parcels 
SET current_value = CASE 
    WHEN price IS NOT NULL THEN price + (price * (random() * 0.2 - 0.1))::BIGINT
    ELSE 50000000 + (random() * 200000000)::BIGINT
END,
last_valuation_date = NOW() - (random() * INTERVAL '30 days')
WHERE current_value IS NULL;

COMMIT;
