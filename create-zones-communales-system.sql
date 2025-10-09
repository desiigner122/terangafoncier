-- Tables pour le système de zones communales

-- Table des zones communales
CREATE TABLE IF NOT EXISTS zones_communales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    commune VARCHAR(100) NOT NULL,
    quartier VARCHAR(100),
    superficie_totale INTEGER NOT NULL, -- en m²
    parcelles_disponibles INTEGER NOT NULL,
    parcelle_min_taille INTEGER, -- taille minimale d'une parcelle en m²
    parcelle_max_taille INTEGER, -- taille maximale d'une parcelle en m²
    prix_metre_carre BIGINT NOT NULL, -- prix par m² en FCFA
    description TEXT,
    coordonnees_gps VARCHAR(100),
    viabilise BOOLEAN DEFAULT false,
    equipements_disponibles JSONB DEFAULT '[]'::jsonb, -- eau, électricité, assainissement, etc.
    date_ouverture_candidature TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_limite_candidature TIMESTAMP WITH TIME ZONE NOT NULL,
    statut VARCHAR(20) DEFAULT 'disponible' CHECK (statut IN ('disponible', 'en_cours', 'complet', 'ferme')),
    documents_requis JSONB DEFAULT '[]'::jsonb,
    criteres_selection JSONB DEFAULT '{}'::jsonb,
    agent_responsable_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des candidatures pour les zones communales
CREATE TABLE IF NOT EXISTS candidatures_zones_communales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES zones_communales(id) ON DELETE CASCADE,
    numero_candidature VARCHAR(50) UNIQUE NOT NULL,
    superficie_souhaitee INTEGER NOT NULL, -- en m²
    budget_disponible BIGINT NOT NULL, -- budget en FCFA
    profession VARCHAR(100),
    revenus_mensuels BIGINT, -- revenus en FCFA
    projet_description TEXT NOT NULL,
    financement_type VARCHAR(50) CHECK (financement_type IN ('fonds_propres', 'pret_bancaire', 'mixte')),
    delai_construction VARCHAR(50) CHECK (delai_construction IN ('6_mois', '1_an', '2_ans', 'plus_2_ans')),
    documents_fournis JSONB DEFAULT '[]'::jsonb,
    statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'en_cours', 'acceptee', 'refusee', 'en_attente_paiement', 'validee')),
    score_evaluation INTEGER, -- score d'évaluation de la candidature
    commentaire_admin TEXT,
    date_evaluation TIMESTAMP WITH TIME ZONE,
    evaluateur_id UUID REFERENCES auth.users(id),
    parcelle_attribuee_numero VARCHAR(50),
    montant_total BIGINT, -- montant total à payer
    echances_paiement JSONB, -- plan de paiement
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contrainte unique: un utilisateur ne peut candidater qu'une fois par zone
    UNIQUE(user_id, zone_id)
);

-- Table des paiements pour les zones communales
CREATE TABLE IF NOT EXISTS paiements_zones_communales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    candidature_id UUID REFERENCES candidatures_zones_communales(id) ON DELETE CASCADE,
    montant BIGINT NOT NULL,
    type_paiement VARCHAR(50) DEFAULT 'acompte' CHECK (type_paiement IN ('acompte', 'echeance', 'solde')),
    methode_paiement VARCHAR(50) CHECK (methode_paiement IN ('virement', 'cheque', 'especes', 'mobile_money')),
    reference_paiement VARCHAR(100),
    statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'confirme', 'refuse', 'rembourse')),
    date_paiement TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirme_par UUID REFERENCES auth.users(id),
    date_confirmation TIMESTAMP WITH TIME ZONE,
    commentaire TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Triggers pour updated_at
CREATE TRIGGER update_zones_communales_updated_at 
    BEFORE UPDATE ON zones_communales 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidatures_zones_communales_updated_at 
    BEFORE UPDATE ON candidatures_zones_communales 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_paiements_zones_communales_updated_at 
    BEFORE UPDATE ON paiements_zones_communales 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_zones_communales_commune ON zones_communales(commune);
CREATE INDEX IF NOT EXISTS idx_zones_communales_statut ON zones_communales(statut);
CREATE INDEX IF NOT EXISTS idx_zones_communales_date_limite ON zones_communales(date_limite_candidature);

CREATE INDEX IF NOT EXISTS idx_candidatures_zones_user_id ON candidatures_zones_communales(user_id);
CREATE INDEX IF NOT EXISTS idx_candidatures_zones_zone_id ON candidatures_zones_communales(zone_id);
CREATE INDEX IF NOT EXISTS idx_candidatures_zones_statut ON candidatures_zones_communales(statut);

CREATE INDEX IF NOT EXISTS idx_paiements_zones_candidature_id ON paiements_zones_communales(candidature_id);
CREATE INDEX IF NOT EXISTS idx_paiements_zones_statut ON paiements_zones_communales(statut);

-- RLS Policies

-- Zones communales
ALTER TABLE zones_communales ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut voir les zones disponibles
CREATE POLICY "Anyone can view available zones_communales" ON zones_communales
    FOR SELECT USING (statut = 'disponible');

-- Les admins peuvent tout gérer
CREATE POLICY "Admins can manage all zones_communales" ON zones_communales
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'agent_foncier')
        )
    );

-- Candidatures zones communales
ALTER TABLE candidatures_zones_communales ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs voient leurs candidatures
CREATE POLICY "Users can view own candidatures_zones_communales" ON candidatures_zones_communales
    FOR SELECT USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer leurs candidatures
CREATE POLICY "Users can insert own candidatures_zones_communales" ON candidatures_zones_communales
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent modifier leurs candidatures en attente
CREATE POLICY "Users can update own pending candidatures_zones_communales" ON candidatures_zones_communales
    FOR UPDATE USING (auth.uid() = user_id AND statut = 'en_attente');

-- Les admins peuvent tout voir et gérer
CREATE POLICY "Admins can manage all candidatures_zones_communales" ON candidatures_zones_communales
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'agent_foncier')
        )
    );

-- Paiements zones communales
ALTER TABLE paiements_zones_communales ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs voient leurs paiements via leurs candidatures
CREATE POLICY "Users can view own paiements_zones_communales" ON paiements_zones_communales
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM candidatures_zones_communales 
            WHERE id = candidature_id 
            AND user_id = auth.uid()
        )
    );

-- Les admins peuvent tout gérer
CREATE POLICY "Admins can manage all paiements_zones_communales" ON paiements_zones_communales
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'agent_foncier')
        )
    );

-- Commentaires des tables
COMMENT ON TABLE zones_communales IS 'Zones d''aménagement communal disponibles pour candidature';
COMMENT ON TABLE candidatures_zones_communales IS 'Candidatures des particuliers pour obtenir une parcelle dans une zone communale';
COMMENT ON TABLE paiements_zones_communales IS 'Suivi des paiements pour les attributions de parcelles communales';

COMMENT ON COLUMN zones_communales.equipements_disponibles IS 'Liste des équipements disponibles (eau, électricité, etc.) en JSON';
COMMENT ON COLUMN zones_communales.criteres_selection IS 'Critères de sélection des candidatures en JSON';
COMMENT ON COLUMN candidatures_zones_communales.score_evaluation IS 'Score d''évaluation de la candidature (0-100)';
COMMENT ON COLUMN candidatures_zones_communales.echances_paiement IS 'Plan de paiement avec dates et montants en JSON';