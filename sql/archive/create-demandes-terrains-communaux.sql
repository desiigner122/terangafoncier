-- Table pour les demandes de terrains communaux
CREATE TABLE IF NOT EXISTS demandes_terrains_communaux (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    numero_demande VARCHAR(50) UNIQUE NOT NULL,
    commune VARCHAR(100) NOT NULL,
    quartier VARCHAR(100) NOT NULL,
    superficie_souhaitee INTEGER, -- en m²
    budget_max BIGINT, -- en FCFA
    usage_prevu VARCHAR(50) NOT NULL CHECK (usage_prevu IN ('habitation', 'commerce', 'mixte', 'industriel')),
    priorite VARCHAR(20) DEFAULT 'normale' CHECK (priorite IN ('normale', 'urgente', 'tres_urgente')),
    description TEXT,
    statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'en_cours', 'acceptee', 'refusee', 'en_revision')),
    commentaire_admin TEXT,
    date_traitement TIMESTAMP WITH TIME ZONE,
    agent_responsable_id UUID REFERENCES auth.users(id),
    documents_fournis JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_demandes_terrains_communaux_updated_at 
    BEFORE UPDATE ON demandes_terrains_communaux 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index pour les requêtes courantes
CREATE INDEX IF NOT EXISTS idx_demandes_terrains_communaux_user_id ON demandes_terrains_communaux(user_id);
CREATE INDEX IF NOT EXISTS idx_demandes_terrains_communaux_statut ON demandes_terrains_communaux(statut);
CREATE INDEX IF NOT EXISTS idx_demandes_terrains_communaux_commune ON demandes_terrains_communaux(commune);
CREATE INDEX IF NOT EXISTS idx_demandes_terrains_communaux_created_at ON demandes_terrains_communaux(created_at);

-- RLS Policies
ALTER TABLE demandes_terrains_communaux ENABLE ROW LEVEL SECURITY;

-- Policy pour que les utilisateurs voient seulement leurs demandes
CREATE POLICY "Users can view own demandes_terrains_communaux" ON demandes_terrains_communaux
    FOR SELECT USING (auth.uid() = user_id);

-- Policy pour que les utilisateurs puissent créer leurs demandes
CREATE POLICY "Users can insert own demandes_terrains_communaux" ON demandes_terrains_communaux
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy pour que les utilisateurs puissent modifier leurs demandes en attente
CREATE POLICY "Users can update own pending demandes_terrains_communaux" ON demandes_terrains_communaux
    FOR UPDATE USING (auth.uid() = user_id AND statut = 'en_attente');

-- Policy pour les admins (voir toutes les demandes)
CREATE POLICY "Admins can view all demandes_terrains_communaux" ON demandes_terrains_communaux
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'agent_foncier')
        )
    );

-- Policy pour les admins (mettre à jour toutes les demandes)
CREATE POLICY "Admins can update all demandes_terrains_communaux" ON demandes_terrains_communaux
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'agent_foncier')
        )
    );

COMMENT ON TABLE demandes_terrains_communaux IS 'Table pour gérer les demandes d''attribution de terrains communaux par les particuliers';
COMMENT ON COLUMN demandes_terrains_communaux.numero_demande IS 'Numéro unique de la demande (ex: DTC-2024-001)';
COMMENT ON COLUMN demandes_terrains_communaux.superficie_souhaitee IS 'Superficie souhaitée en mètres carrés';
COMMENT ON COLUMN demandes_terrains_communaux.budget_max IS 'Budget maximum en FCFA';
COMMENT ON COLUMN demandes_terrains_communaux.usage_prevu IS 'Usage prévu du terrain (habitation, commerce, mixte, industriel)';
COMMENT ON COLUMN demandes_terrains_communaux.priorite IS 'Niveau de priorité de la demande';
COMMENT ON COLUMN demandes_terrains_communaux.statut IS 'Statut de traitement de la demande';
COMMENT ON COLUMN demandes_terrains_communaux.documents_fournis IS 'Liste des documents fournis (JSON array)';