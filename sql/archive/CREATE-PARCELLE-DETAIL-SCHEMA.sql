-- ============================================================================
-- SCHEMA PARCELLE DETAIL PAGE - Création des tables et colonnes manquantes
-- ============================================================================
-- Ce script initialise la structure nécessaire pour la page de détail d'une parcelle

-- 1. Vérifier et mettre à jour la table 'properties'
-- ============================================================================

-- Ajouter les colonnes manquantes si elles n'existent pas
ALTER TABLE IF EXISTS properties 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS nearby_landmarks JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS zoning VARCHAR(100) DEFAULT 'Zone résidentielle',
ADD COLUMN IF NOT EXISTS buildable_ratio DECIMAL(4,2) DEFAULT 0.6,
ADD COLUMN IF NOT EXISTS max_floors INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS blockchain_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS blockchain_hash TEXT,
ADD COLUMN IF NOT EXISTS blockchain_network VARCHAR(50),
ADD COLUMN IF NOT EXISTS nft_token_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS nft_minted_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS nft_contract_address TEXT,
ADD COLUMN IF NOT EXISTS nft_owner UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS ai_score DECIMAL(3,1) DEFAULT 8.5,
ADD COLUMN IF NOT EXISTS ai_location_score DECIMAL(3,1) DEFAULT 9.0,
ADD COLUMN IF NOT EXISTS ai_investment_score DECIMAL(3,1) DEFAULT 8.0,
ADD COLUMN IF NOT EXISTS ai_infrastructure_score DECIMAL(3,1) DEFAULT 8.5,
ADD COLUMN IF NOT EXISTS ai_price_score DECIMAL(3,1) DEFAULT 8.0,
ADD COLUMN IF NOT EXISTS ai_growth_prediction TEXT DEFAULT '+15% dans les 5 prochaines années',
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS favorites_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS contact_requests_count INTEGER DEFAULT 0;

-- Ajouter les indexes pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_nft_token ON properties(nft_token_id);
CREATE INDEX IF NOT EXISTS idx_properties_blockchain_hash ON properties(blockchain_hash);
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);

-- 2. Créer la table 'favorites' si elle n'existe pas
-- ============================================================================

CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Ajouter les indexes
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_property_id ON favorites(property_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON favorites(created_at DESC);

-- 3. Créer la table 'contact_requests' pour les demandes de contact
-- ============================================================================

CREATE TABLE IF NOT EXISTS contact_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  sender_email VARCHAR(255) NOT NULL,
  sender_phone VARCHAR(20),
  sender_name VARCHAR(255) NOT NULL,
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, contacted, completed
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_requests_property ON contact_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status);
CREATE INDEX IF NOT EXISTS idx_contact_requests_created_at ON contact_requests(created_at DESC);

-- 4. Créer la table 'property_financing_options' pour les options de financement
-- ============================================================================

CREATE TABLE IF NOT EXISTS property_financing_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  method VARCHAR(50) NOT NULL, -- 'direct', 'installment', 'bank', 'crypto'
  bank_partner_id UUID REFERENCES profiles(id),
  bank_name VARCHAR(255),
  interest_rate DECIMAL(5,2),
  max_duration_months INTEGER,
  min_down_payment_percent DECIMAL(5,2),
  monthly_payment_fcfa INTEGER,
  crypto_discount_percent DECIMAL(5,2),
  accepted_currencies TEXT[] DEFAULT ARRAY[]::TEXT[],
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_financing_property ON property_financing_options(property_id);
CREATE INDEX IF NOT EXISTS idx_financing_method ON property_financing_options(method);
CREATE INDEX IF NOT EXISTS idx_financing_bank ON property_financing_options(bank_partner_id);

-- 5. Créer la table 'property_documents' pour les documents juridiques
-- ============================================================================

CREATE TABLE IF NOT EXISTS property_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL, -- 'title_deed', 'cadastral_plan', 'survey', etc.
  document_name VARCHAR(255) NOT NULL,
  document_url TEXT,
  file_size_bytes INTEGER,
  mime_type VARCHAR(100),
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documents_property ON property_documents(property_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON property_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_verified ON property_documents(verified);

-- 6. Créer la table 'property_blockchain_records' pour le suivi blockchain
-- ============================================================================

CREATE TABLE IF NOT EXISTS property_blockchain_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  blockchain_network VARCHAR(50) NOT NULL, -- 'Polygon', 'Ethereum', 'Binance', etc.
  transaction_hash TEXT UNIQUE,
  block_number INTEGER,
  contract_address TEXT,
  nft_token_id TEXT UNIQUE,
  mint_date TIMESTAMP,
  current_owner_address TEXT,
  verification_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  verified_at TIMESTAMP,
  verified_by UUID REFERENCES profiles(id),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blockchain_property ON property_blockchain_records(property_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_network ON property_blockchain_records(blockchain_network);
CREATE INDEX IF NOT EXISTS idx_blockchain_nft_token ON property_blockchain_records(nft_token_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_tx_hash ON property_blockchain_records(transaction_hash);

-- 7. Créer la table 'property_views' pour le suivi des vues
-- ============================================================================

CREATE TABLE IF NOT EXISTS property_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  viewer_ip_address INET,
  viewed_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_views_property ON property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_views_viewer_id ON property_views(viewer_id);
CREATE INDEX IF NOT EXISTS idx_views_timestamp ON property_views(viewed_at DESC);

-- 8. Mettre à jour les colonnes metadata dans properties
-- ============================================================================

-- Ajouter une structure JSONB pour la métadonnée structurée
ALTER TABLE IF EXISTS properties 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Exemple de structure metadata:
-- {
--   "financing": {
--     "methods": ["direct", "installment", "bank", "crypto"],
--     "bank_financing": {
--       "partner": "BICIS",
--       "rate": "8.5%",
--       "max_duration": "20 ans"
--     },
--     "installment": {
--       "min_down_payment": "30%",
--       "monthly_payment": "500000",
--       "duration": "10 ans"
--     },
--     "crypto": {
--       "discount": "5%",
--       "accepted_currencies": ["BTC", "ETH", "USDT", "USDC"]
--     }
--   },
--   "documents": {
--     "list": [
--       { "name": "Titre de propriété", "type": "PDF", "size": "2.5 MB", "verified": true }
--     ]
--   }
-- }

-- 9. Vérifier et mettre à jour la table 'features'
-- ============================================================================

ALTER TABLE IF EXISTS properties 
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '{
  "main": [],
  "utilities": [],
  "access": ["Route goudronnée", "Transport en commun à 500m", "Accès voiture"]
}'::jsonb;

-- 10. Vérifier et mettre à jour la table 'amenities'
-- ============================================================================

ALTER TABLE IF EXISTS properties 
ADD COLUMN IF NOT EXISTS amenities JSONB DEFAULT '[]'::jsonb;

-- ============================================================================
-- RLS (Row Level Security) - Politiques d'accès
-- ============================================================================

-- Politique pour la table favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can see their own favorites" ON favorites;
CREATE POLICY "Users can see their own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create favorites" ON favorites;
CREATE POLICY "Users can create favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own favorites" ON favorites;
CREATE POLICY "Users can delete their own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Politique pour la table contact_requests
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view contact requests for public properties" ON contact_requests;
CREATE POLICY "Anyone can view contact requests for public properties" ON contact_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE properties.id = contact_requests.property_id 
      AND properties.status = 'published'
    )
  );

DROP POLICY IF EXISTS "Users can create contact requests" ON contact_requests;
CREATE POLICY "Users can create contact requests" ON contact_requests
  FOR INSERT WITH CHECK (TRUE);

-- Politique pour les documents
ALTER TABLE property_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Documents are viewable for published properties" ON property_documents;
CREATE POLICY "Documents are viewable for published properties" ON property_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE properties.id = property_documents.property_id 
      AND properties.status = 'published'
    )
  );

-- ============================================================================
-- DONNÉES DE PEUPLEMENT (Sample Data)
-- ============================================================================

-- Exemple: Ajouter des options de financement pour une propriété
-- INSERT INTO property_financing_options (property_id, method, bank_name, interest_rate, max_duration_months, min_down_payment_percent)
-- SELECT id, 'bank', 'BICIS', 8.5, 240, 30 FROM properties LIMIT 1;

-- ============================================================================
-- FIN DU SCRIPT
-- ============================================================================
