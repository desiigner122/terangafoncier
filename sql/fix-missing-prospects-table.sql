-- =============================================================================
-- FIX: TABLE PROSPECTS MANQUANTE
-- =============================================================================
-- Date: 2025-10-07
-- Description: Création de la table prospects si elle n'existe pas
-- Cette table est probablement référencée par d'autres tables existantes
-- =============================================================================

-- Créer la table prospects
CREATE TABLE IF NOT EXISTS prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Informations de contact
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  
  -- Informations du prospect
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost')),
  source VARCHAR(100), -- website, referral, social, etc.
  score INTEGER DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
  
  -- Besoins/Préférences
  property_type VARCHAR(100), -- résidentiel, commercial, terrain, etc.
  budget_min DECIMAL(15, 2),
  budget_max DECIMAL(15, 2),
  location_preference TEXT,
  notes TEXT,
  
  -- Suivi
  last_contact_at TIMESTAMP WITH TIME ZONE,
  next_follow_up_at TIMESTAMP WITH TIME ZONE,
  assigned_to UUID REFERENCES auth.users(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_prospects_user_id ON prospects(user_id);
CREATE INDEX IF NOT EXISTS idx_prospects_status ON prospects(status);
CREATE INDEX IF NOT EXISTS idx_prospects_assigned_to ON prospects(assigned_to);
CREATE INDEX IF NOT EXISTS idx_prospects_created_at ON prospects(created_at DESC);

-- RLS
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own prospects" ON prospects
  FOR SELECT USING (user_id = auth.uid() OR assigned_to = auth.uid());

CREATE POLICY "Users create prospects" ON prospects
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own prospects" ON prospects
  FOR UPDATE USING (user_id = auth.uid() OR assigned_to = auth.uid());

-- Trigger updated_at
CREATE TRIGGER update_prospects_updated_at 
  BEFORE UPDATE ON prospects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE prospects IS 'Prospects et leads immobiliers';
