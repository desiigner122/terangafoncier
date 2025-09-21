-- ======================================================================
-- SCHÉMA DES TABLES POUR LES DONNÉES DE TEST
-- Création des tables nécessaires pour les fonctionnalités
-- ======================================================================

-- Table des propriétés immobilières
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price BIGINT NOT NULL, -- Prix en FCFA
    location VARCHAR(255) NOT NULL,
    property_type VARCHAR(50) NOT NULL, -- Villa, Appartement, Terrain, Commercial
    bedrooms INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    surface_area INTEGER, -- en m²
    status VARCHAR(20) DEFAULT 'Disponible', -- Disponible, Vendu, Réservé
    view_count INTEGER DEFAULT 0,
    images TEXT[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des projets immobiliers (pour promoteurs)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    total_units INTEGER NOT NULL,
    sold_units INTEGER DEFAULT 0,
    price_from BIGINT, -- Prix minimum en FCFA
    price_to BIGINT, -- Prix maximum en FCFA
    status VARCHAR(20) DEFAULT 'Planifié', -- Planifié, En construction, En vente, Terminé
    completion_date DATE,
    project_type VARCHAR(50) DEFAULT 'Résidentiel', -- Résidentiel, Commercial, Mixte
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des demandes de crédit (pour banques)
CREATE TABLE IF NOT EXISTS loan_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    bank_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    loan_amount BIGINT NOT NULL, -- Montant demandé en FCFA
    monthly_income BIGINT NOT NULL, -- Revenus mensuels en FCFA
    loan_duration INTEGER NOT NULL, -- Durée en mois
    interest_rate DECIMAL(4,2) DEFAULT 6.5, -- Taux d'intérêt en %
    status VARCHAR(20) DEFAULT 'En attente', -- En attente, En évaluation, Approuvé, Refusé
    application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    decision_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des actes notariés (pour notaires)
CREATE TABLE IF NOT EXISTS notarial_acts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notary_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    buyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    seller_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    act_type VARCHAR(50) NOT NULL, -- Acte de vente, Acte d'hypothèque, etc.
    sale_price BIGINT, -- Prix de vente en FCFA
    fees BIGINT, -- Frais notariaux en FCFA
    status VARCHAR(20) DEFAULT 'En cours', -- En cours, Signé, Annulé
    signature_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des certifications foncières (pour agents fonciers)
CREATE TABLE IF NOT EXISTS land_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    certification_type VARCHAR(50) NOT NULL, -- Titre Foncier, Autorisation de Construire, etc.
    status VARCHAR(20) DEFAULT 'En cours', -- En cours, Validé, Refusé
    certificate_number VARCHAR(50) UNIQUE,
    issue_date DATE,
    expiry_date DATE,
    inspection_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des favoris (pour particuliers)
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, property_id)
);

-- Table des recherches sauvegardées
CREATE TABLE IF NOT EXISTS saved_searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    search_name VARCHAR(255) NOT NULL,
    search_criteria JSONB NOT NULL,
    alert_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des transactions immobilières
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    buyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    seller_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    transaction_type VARCHAR(20) NOT NULL, -- Vente, Location
    amount BIGINT NOT NULL, -- Montant en FCFA
    commission_rate DECIMAL(4,2) DEFAULT 3.0, -- Commission en %
    commission_amount BIGINT, -- Commission en FCFA
    status VARCHAR(20) DEFAULT 'En cours', -- En cours, Finalisée, Annulée
    signed_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajout d'index pour les performances
CREATE INDEX IF NOT EXISTS idx_properties_owner ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_projects_developer ON projects(developer_id);
CREATE INDEX IF NOT EXISTS idx_loan_applications_applicant ON loan_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_loan_applications_bank ON loan_applications(bank_id);
CREATE INDEX IF NOT EXISTS idx_notarial_acts_notary ON notarial_acts(notary_id);
CREATE INDEX IF NOT EXISTS idx_land_certifications_agent ON land_certifications(agent_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller ON transactions(seller_id);

-- Activation de RLS (Row Level Security)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notarial_acts ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Politiques RLS basiques (à affiner selon les besoins)
-- Les utilisateurs peuvent voir leurs propres données et les données publiques

-- Propriétés: visibles par tous, modifiables par le propriétaire
CREATE POLICY IF NOT EXISTS "Properties are viewable by everyone" ON properties
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Users can insert their own properties" ON properties
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY IF NOT EXISTS "Users can update their own properties" ON properties
    FOR UPDATE USING (auth.uid() = owner_id);

-- Projets: visibles par tous, modifiables par le développeur
CREATE POLICY IF NOT EXISTS "Projects are viewable by everyone" ON projects
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Developers can insert their own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = developer_id);

CREATE POLICY IF NOT EXISTS "Developers can update their own projects" ON projects
    FOR UPDATE USING (auth.uid() = developer_id);

-- Demandes de crédit: visibles par l'applicant et la banque
CREATE POLICY IF NOT EXISTS "Loan applications are viewable by applicant and bank" ON loan_applications
    FOR SELECT USING (auth.uid() = applicant_id OR auth.uid() = bank_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own loan applications" ON loan_applications
    FOR INSERT WITH CHECK (auth.uid() = applicant_id);

-- Favoris: visibles et gérables uniquement par l'utilisateur
CREATE POLICY IF NOT EXISTS "Users can view their own favorites" ON user_favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own favorites" ON user_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own favorites" ON user_favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Recherches sauvegardées: privées à l'utilisateur
CREATE POLICY IF NOT EXISTS "Users can view their own saved searches" ON saved_searches
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own saved searches" ON saved_searches
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own saved searches" ON saved_searches
    FOR UPDATE USING (auth.uid() = user_id);

-- ======================================================================
-- FONCTIONS UTILITAIRES
-- ======================================================================

-- Fonction pour calculer la commission
CREATE OR REPLACE FUNCTION calculate_commission(amount BIGINT, rate DECIMAL)
RETURNS BIGINT AS $$
BEGIN
    RETURN (amount * rate / 100)::BIGINT;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour calculer automatiquement la commission
CREATE OR REPLACE FUNCTION update_commission()
RETURNS TRIGGER AS $$
BEGIN
    NEW.commission_amount = calculate_commission(NEW.amount, NEW.commission_rate);
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_commission
    BEFORE INSERT OR UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_commission();

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger à toutes les tables
CREATE TRIGGER trigger_update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_loan_applications_updated_at
    BEFORE UPDATE ON loan_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Message de confirmation
SELECT '✅ === SCHÉMA DES TABLES CRÉÉ AVEC SUCCÈS ===' as status;

-- Vérification des tables créées
SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('properties', 'projects', 'loan_applications', 'notarial_acts', 'land_certifications', 'user_favorites', 'saved_searches', 'transactions')
        THEN '✅ Table créée'
        ELSE '❌ Table manquante'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('properties', 'projects', 'loan_applications', 'notarial_acts', 'land_certifications', 'user_favorites', 'saved_searches', 'transactions')
ORDER BY table_name;