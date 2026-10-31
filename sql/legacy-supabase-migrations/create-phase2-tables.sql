-- 🚀 PHASE 2 - TABLES IA & BLOCKCHAIN
-- Tables pour VendeurAI, VendeurBlockchain, VendeurPhotos, VendeurAntiFraude, VendeurGPS

-- 1. Table AI Analyses (pour toutes les analyses IA)
CREATE TABLE IF NOT EXISTS ai_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Type d'analyse
  analysis_type TEXT NOT NULL CHECK (analysis_type IN (
    'price_suggestion',
    'description_generation',
    'keywords_seo',
    'photo_optimization',
    'market_analysis',
    'selling_time_prediction',
    'title_generation',
    'competitive_analysis'
  )),
  
  -- Données
  input_data JSONB NOT NULL, -- Données envoyées à l'IA
  output_data JSONB NOT NULL, -- Résultats de l'IA
  
  -- Métriques
  confidence_score NUMERIC CHECK (confidence_score >= 0 AND confidence_score <= 100),
  tokens_used INTEGER DEFAULT 0,
  processing_time_ms INTEGER,
  cost_usd NUMERIC(10, 6),
  
  -- Métadonnées
  model_used TEXT, -- 'gpt-4-turbo', 'gpt-3.5-turbo', 'vision-1', etc.
  api_provider TEXT DEFAULT 'openai', -- 'openai', 'google', 'anthropic'
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_analyses_property ON ai_analyses(property_id);
CREATE INDEX idx_ai_analyses_vendor ON ai_analyses(vendor_id);
CREATE INDEX idx_ai_analyses_type ON ai_analyses(analysis_type);
CREATE INDEX idx_ai_analyses_created ON ai_analyses(created_at DESC);


-- 2. Table AI Chat History (chatbot assistant vendeur)
CREATE TABLE IF NOT EXISTS ai_chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  
  -- Conversation
  session_id UUID NOT NULL, -- Pour grouper les messages d'une conversation
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  
  -- Contexte
  context_data JSONB, -- Infos additionnelles (propriété en cours, page active, etc.)
  tokens_used INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_chat_vendor ON ai_chat_history(vendor_id);
CREATE INDEX idx_ai_chat_session ON ai_chat_history(session_id);
CREATE INDEX idx_ai_chat_created ON ai_chat_history(created_at DESC);


-- 3. Table Blockchain Certificates (NFT et certifications)
CREATE TABLE IF NOT EXISTS blockchain_certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Blockchain info
  blockchain_network TEXT NOT NULL DEFAULT 'polygon' CHECK (blockchain_network IN ('polygon', 'ethereum', 'binance', 'arbitrum')),
  contract_address TEXT NOT NULL,
  token_id TEXT NOT NULL,
  transaction_hash TEXT NOT NULL,
  
  -- IPFS
  ipfs_hash TEXT NOT NULL, -- Hash du contenu sur IPFS
  ipfs_url TEXT, -- URL complète Pinata/Infura
  
  -- NFT Metadata
  metadata JSONB NOT NULL, -- Métadonnées NFT (name, description, image, attributes)
  
  -- Status
  status TEXT DEFAULT 'minted' CHECK (status IN ('pending', 'minting', 'minted', 'transferred', 'burned')),
  minted_at TIMESTAMP DEFAULT NOW(),
  minted_by_wallet TEXT, -- Adresse wallet du vendeur
  
  -- Ownership
  current_owner_wallet TEXT,
  transfer_history JSONB DEFAULT '[]'::jsonb, -- [{from, to, timestamp, tx_hash}]
  
  -- Coûts
  gas_used BIGINT,
  gas_price_gwei NUMERIC,
  total_cost_eth NUMERIC(20, 10),
  total_cost_usd NUMERIC(10, 2),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_blockchain_property ON blockchain_certificates(property_id);
CREATE INDEX idx_blockchain_vendor ON blockchain_certificates(vendor_id);
CREATE INDEX idx_blockchain_network ON blockchain_certificates(blockchain_network);
CREATE INDEX idx_blockchain_token ON blockchain_certificates(token_id);
CREATE INDEX idx_blockchain_tx ON blockchain_certificates(transaction_hash);

CREATE UNIQUE INDEX idx_blockchain_unique_token ON blockchain_certificates(contract_address, token_id);


-- 4. Table Property Photos (avec analyse IA)
CREATE TABLE IF NOT EXISTS property_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Fichier
  file_path TEXT NOT NULL, -- Chemin dans Supabase Storage
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL, -- En bytes
  mime_type TEXT DEFAULT 'image/jpeg',
  
  -- Dimensions
  width INTEGER,
  height INTEGER,
  aspect_ratio NUMERIC(5, 2),
  
  -- Analyse IA
  quality_score NUMERIC(5, 2) CHECK (quality_score >= 0 AND quality_score <= 100),
  ai_enhanced BOOLEAN DEFAULT FALSE,
  detected_objects JSONB DEFAULT '[]'::jsonb, -- ['bedroom', 'kitchen', 'living_room', 'bathroom']
  detected_features JSONB DEFAULT '{}'::jsonb, -- {brightness: 75, contrast: 82, sharpness: 90}
  ai_suggestions JSONB DEFAULT '[]'::jsonb, -- ['Augmenter luminosité', 'Recadrer', 'Ajouter filtre']
  
  -- Organisation
  category TEXT CHECK (category IN ('exterior', 'interior', 'bedroom', 'kitchen', 'bathroom', 'living_room', 'garden', 'other')),
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  
  -- Variantes générées
  variants JSONB DEFAULT '{}'::jsonb, -- {thumbnail: 'path', medium: 'path', watermarked: 'path'}
  
  -- Métadonnées
  exif_data JSONB, -- Données EXIF (camera, date, location, etc.)
  uploaded_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_property_photos_property ON property_photos(property_id);
CREATE INDEX idx_property_photos_vendor ON property_photos(vendor_id);
CREATE INDEX idx_property_photos_category ON property_photos(category);
CREATE INDEX idx_property_photos_primary ON property_photos(is_primary) WHERE is_primary = TRUE;
CREATE INDEX idx_property_photos_order ON property_photos(property_id, display_order);


-- 5. Table Fraud Checks (détection fraudes par IA)
CREATE TABLE IF NOT EXISTS fraud_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Type de vérification
  check_type TEXT NOT NULL CHECK (check_type IN (
    'document_ocr',
    'gps_validation',
    'price_analysis',
    'duplicate_detection',
    'photo_authenticity',
    'identity_verification',
    'cadastre_match'
  )),
  
  -- Résultats
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'passed', 'warning', 'failed')),
  confidence_score NUMERIC(5, 2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  
  -- Détails
  findings JSONB NOT NULL DEFAULT '{}'::jsonb, -- Résultats détaillés de la vérification
  alerts JSONB DEFAULT '[]'::jsonb, -- [{type, message, severity}]
  recommendations JSONB DEFAULT '[]'::jsonb, -- Actions suggérées
  
  -- Documents analysés
  document_scans JSONB, -- {document_type, ocr_text, extracted_fields}
  
  -- IA utilisée
  ai_model_used TEXT,
  processing_time_ms INTEGER,
  
  -- Métadonnées
  checked_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP, -- Validité de la vérification (ex: 30 jours)
  checked_by UUID REFERENCES profiles(id), -- Admin qui a validé manuellement si nécessaire
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_fraud_checks_property ON fraud_checks(property_id);
CREATE INDEX idx_fraud_checks_vendor ON fraud_checks(vendor_id);
CREATE INDEX idx_fraud_checks_type ON fraud_checks(check_type);
CREATE INDEX idx_fraud_checks_status ON fraud_checks(status);
CREATE INDEX idx_fraud_checks_risk ON fraud_checks(risk_level);


-- 6. Table GPS Coordinates (vérification GPS et cadastre)
CREATE TABLE IF NOT EXISTS gps_coordinates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Coordonnées
  latitude NUMERIC(10, 8) NOT NULL,
  longitude NUMERIC(11, 8) NOT NULL,
  altitude NUMERIC(8, 2), -- En mètres
  accuracy NUMERIC(8, 2), -- Précision en mètres
  
  -- Zone géographique
  address TEXT,
  city TEXT,
  region TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Sénégal',
  
  -- Délimitation
  boundary_polygon JSONB, -- Format GeoJSON: {type: "Polygon", coordinates: [[[lng, lat], ...]]}
  surface_calculated NUMERIC(12, 2), -- Surface calculée en m²
  perimeter_calculated NUMERIC(12, 2), -- Périmètre en mètres
  
  -- Cadastre
  cadastre_reference TEXT, -- Référence parcelle cadastrale
  cadastre_section TEXT,
  cadastre_verified BOOLEAN DEFAULT FALSE,
  cadastre_verification_date TIMESTAMP,
  
  -- Validation
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMP,
  verification_method TEXT CHECK (verification_method IN ('manual', 'gps_device', 'cadastre_api', 'satellite_imagery')),
  
  -- Métadonnées
  source TEXT, -- 'mobile_gps', 'maps_api', 'cadastre', 'manual'
  metadata JSONB DEFAULT '{}'::jsonb, -- Infos additionnelles
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_gps_property ON gps_coordinates(property_id);
CREATE INDEX idx_gps_vendor ON gps_coordinates(vendor_id);
CREATE INDEX idx_gps_location ON gps_coordinates(latitude, longitude);
CREATE INDEX idx_gps_verified ON gps_coordinates(verified);
CREATE INDEX idx_gps_cadastre ON gps_coordinates(cadastre_reference);


-- 7. Table Wallet Connections (connexions wallet blockchain)
CREATE TABLE IF NOT EXISTS wallet_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Wallet info
  wallet_address TEXT NOT NULL,
  wallet_type TEXT CHECK (wallet_type IN ('metamask', 'walletconnect', 'coinbase', 'trust', 'other')),
  chain_id INTEGER NOT NULL, -- 137 (Polygon), 1 (Ethereum), etc.
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  
  -- Métadonnées
  last_connected_at TIMESTAMP DEFAULT NOW(),
  connection_count INTEGER DEFAULT 1,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_wallet_vendor ON wallet_connections(vendor_id);
CREATE INDEX idx_wallet_address ON wallet_connections(wallet_address);
CREATE UNIQUE INDEX idx_wallet_unique_active ON wallet_connections(vendor_id, wallet_address) WHERE is_active = TRUE;


-- 8. Policies RLS

-- AI Analyses
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view their own AI analyses"
  ON ai_analyses FOR SELECT
  USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can insert their own AI analyses"
  ON ai_analyses FOR INSERT
  WITH CHECK (vendor_id = auth.uid());


-- AI Chat History
ALTER TABLE ai_chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view their own chat history"
  ON ai_chat_history FOR SELECT
  USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can insert their own chat messages"
  ON ai_chat_history FOR INSERT
  WITH CHECK (vendor_id = auth.uid());


-- Blockchain Certificates
ALTER TABLE blockchain_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view their own certificates"
  ON blockchain_certificates FOR SELECT
  USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can insert their own certificates"
  ON blockchain_certificates FOR INSERT
  WITH CHECK (vendor_id = auth.uid());

CREATE POLICY "Vendors can update their own certificates"
  ON blockchain_certificates FOR UPDATE
  USING (vendor_id = auth.uid());


-- Property Photos
ALTER TABLE property_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view their own photos"
  ON property_photos FOR SELECT
  USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can insert their own photos"
  ON property_photos FOR INSERT
  WITH CHECK (vendor_id = auth.uid());

CREATE POLICY "Vendors can update their own photos"
  ON property_photos FOR UPDATE
  USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can delete their own photos"
  ON property_photos FOR DELETE
  USING (vendor_id = auth.uid());


-- Fraud Checks
ALTER TABLE fraud_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view their own fraud checks"
  ON fraud_checks FOR SELECT
  USING (vendor_id = auth.uid());

CREATE POLICY "System can insert fraud checks"
  ON fraud_checks FOR INSERT
  WITH CHECK (vendor_id = auth.uid());


-- GPS Coordinates
ALTER TABLE gps_coordinates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view their own GPS data"
  ON gps_coordinates FOR SELECT
  USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can insert their own GPS data"
  ON gps_coordinates FOR INSERT
  WITH CHECK (vendor_id = auth.uid());

CREATE POLICY "Vendors can update their own GPS data"
  ON gps_coordinates FOR UPDATE
  USING (vendor_id = auth.uid());


-- Wallet Connections
ALTER TABLE wallet_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view their own wallets"
  ON wallet_connections FOR SELECT
  USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can insert their own wallets"
  ON wallet_connections FOR INSERT
  WITH CHECK (vendor_id = auth.uid());

CREATE POLICY "Vendors can update their own wallets"
  ON wallet_connections FOR UPDATE
  USING (vendor_id = auth.uid());


-- 9. Fonctions helper

-- Fonction pour obtenir le score global de fraude d'une propriété
CREATE OR REPLACE FUNCTION get_property_fraud_score(property_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
  avg_score NUMERIC;
  check_count INTEGER;
BEGIN
  SELECT 
    AVG(confidence_score),
    COUNT(*)
  INTO avg_score, check_count
  FROM fraud_checks
  WHERE property_id = property_uuid
    AND status IN ('passed', 'warning', 'failed')
    AND checked_at >= NOW() - INTERVAL '30 days';
  
  -- Si aucune vérification, score = 0
  IF check_count = 0 THEN
    RETURN 0;
  END IF;
  
  RETURN COALESCE(avg_score, 0);
END;
$$ LANGUAGE plpgsql;


-- Fonction pour obtenir les stats IA d'un vendeur
CREATE OR REPLACE FUNCTION get_vendor_ai_stats(vendor_uuid UUID)
RETURNS TABLE (
  total_analyses BIGINT,
  total_tokens_used BIGINT,
  total_cost_usd NUMERIC,
  avg_confidence_score NUMERIC,
  analyses_by_type JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT,
    SUM(tokens_used)::BIGINT,
    SUM(cost_usd),
    AVG(confidence_score),
    jsonb_object_agg(
      analysis_type,
      count
    ) AS analyses_by_type
  FROM (
    SELECT 
      analysis_type,
      COUNT(*) as count
    FROM ai_analyses
    WHERE vendor_id = vendor_uuid
    GROUP BY analysis_type
  ) subquery
  CROSS JOIN (
    SELECT 
      tokens_used,
      cost_usd,
      confidence_score
    FROM ai_analyses
    WHERE vendor_id = vendor_uuid
  ) all_analyses;
END;
$$ LANGUAGE plpgsql;


-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Tables Phase 2 créées avec succès!';
  RAISE NOTICE '📊 Tables créées:';
  RAISE NOTICE '  - ai_analyses (Analyses IA)';
  RAISE NOTICE '  - ai_chat_history (Chatbot)';
  RAISE NOTICE '  - blockchain_certificates (NFT)';
  RAISE NOTICE '  - property_photos (Photos + IA)';
  RAISE NOTICE '  - fraud_checks (Anti-fraude)';
  RAISE NOTICE '  - gps_coordinates (GPS + Cadastre)';
  RAISE NOTICE '  - wallet_connections (Wallets Blockchain)';
  RAISE NOTICE '🔒 RLS Policies activées';
  RAISE NOTICE '⚡ Fonctions helper créées';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Prêt pour développer les pages Phase 2!';
END $$;
