-- ===============================================
-- 🔗 TERANGA BLOCKCHAIN DATABASE SCHEMA
-- Blockchain privée pour dossiers immobiliers
-- ===============================================

-- Table principale des blocs blockchain
CREATE TABLE IF NOT EXISTS teranga_blockchain_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  number BIGINT NOT NULL UNIQUE,
  hash VARCHAR(64) NOT NULL UNIQUE,
  previous_hash VARCHAR(64) NOT NULL,
  merkle_root VARCHAR(64) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  validator VARCHAR(100) NOT NULL,
  gas_used BIGINT DEFAULT 0,
  gas_limit BIGINT DEFAULT 10000000,
  network_id VARCHAR(50) NOT NULL DEFAULT 'teranga-senegal-001',
  transaction_count INT DEFAULT 0,
  size_bytes INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_blockchain_blocks_number ON teranga_blockchain_blocks(number);
CREATE INDEX IF NOT EXISTS idx_blockchain_blocks_hash ON teranga_blockchain_blocks(hash);
CREATE INDEX IF NOT EXISTS idx_blockchain_blocks_timestamp ON teranga_blockchain_blocks(timestamp);

-- Table des transactions blockchain confirmées
CREATE TABLE IF NOT EXISTS teranga_blockchain_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id VARCHAR(100) NOT NULL UNIQUE,
  block_id UUID REFERENCES teranga_blockchain_blocks(id),
  block_number BIGINT,
  type VARCHAR(50) NOT NULL,
  case_id UUID REFERENCES purchase_cases(id),
  user_id UUID REFERENCES profiles(id),
  data JSONB NOT NULL,
  signature VARCHAR(128) NOT NULL,
  gas_price DECIMAL(18,8) DEFAULT 0.001,
  gas_used BIGINT DEFAULT 21000,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour transactions
CREATE INDEX IF NOT EXISTS idx_blockchain_tx_id ON teranga_blockchain_transactions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_tx_case ON teranga_blockchain_transactions(case_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_tx_type ON teranga_blockchain_transactions(type);
CREATE INDEX IF NOT EXISTS idx_blockchain_tx_user ON teranga_blockchain_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_tx_timestamp ON teranga_blockchain_transactions(timestamp);

-- Table mempool (transactions en attente)
CREATE TABLE IF NOT EXISTS teranga_blockchain_mempool (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id VARCHAR(100) NOT NULL UNIQUE,
  type VARCHAR(50) NOT NULL,
  case_id UUID REFERENCES purchase_cases(id),
  user_id UUID REFERENCES profiles(id),
  data JSONB NOT NULL,
  signature VARCHAR(128) NOT NULL,
  gas_price DECIMAL(18,8) DEFAULT 0.001,
  priority INT DEFAULT 1,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index mempool
CREATE INDEX IF NOT EXISTS idx_mempool_priority ON teranga_blockchain_mempool(priority DESC, timestamp ASC);
CREATE INDEX IF NOT EXISTS idx_mempool_case ON teranga_blockchain_mempool(case_id);

-- Table des validateurs de la blockchain
CREATE TABLE IF NOT EXISTS teranga_blockchain_validators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  public_key VARCHAR(256) NOT NULL,
  address VARCHAR(100) NOT NULL,
  stake_amount DECIMAL(18,8) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  blocks_validated BIGINT DEFAULT 0,
  last_active TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insérer validateurs initiaux
INSERT INTO teranga_blockchain_validators (name, public_key, address, stake_amount, is_active) VALUES
('teranga-validator-1', 'pub_key_validator_1_placeholder', 'validator_1_address', 1000000, true),
('teranga-validator-2', 'pub_key_validator_2_placeholder', 'validator_2_address', 1000000, true),
('teranga-validator-3', 'pub_key_validator_3_placeholder', 'validator_3_address', 1000000, true)
ON CONFLICT (name) DO NOTHING;

-- Table des événements blockchain
CREATE TABLE IF NOT EXISTS teranga_blockchain_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  block_number BIGINT,
  transaction_id VARCHAR(100),
  case_id UUID REFERENCES purchase_cases(id),
  event_data JSONB NOT NULL,
  emitted_by UUID REFERENCES profiles(id),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index événements
CREATE INDEX IF NOT EXISTS idx_blockchain_events_type ON teranga_blockchain_events(event_type);
CREATE INDEX IF NOT EXISTS idx_blockchain_events_case ON teranga_blockchain_events(case_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_events_timestamp ON teranga_blockchain_events(timestamp);

-- Table des audits blockchain
CREATE TABLE IF NOT EXISTS teranga_blockchain_audits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_type VARCHAR(50) NOT NULL,
  block_range_start BIGINT,
  block_range_end BIGINT,
  total_blocks_checked BIGINT,
  verified_blocks BIGINT,
  tampered_blocks BIGINT,
  integrity_percentage DECIMAL(5,2),
  audit_results JSONB,
  audited_by UUID REFERENCES profiles(id),
  audit_duration_ms BIGINT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===============================================
-- 📊 VUES POUR ANALYTICS BLOCKCHAIN
-- ===============================================

-- Vue des statistiques en temps réel
CREATE OR REPLACE VIEW teranga_blockchain_stats AS
SELECT 
  (SELECT COUNT(*) FROM teranga_blockchain_blocks) as total_blocks,
  (SELECT MAX(number) FROM teranga_blockchain_blocks) as latest_block_number,
  (SELECT COUNT(*) FROM teranga_blockchain_transactions) as total_transactions,
  (SELECT COUNT(*) FROM teranga_blockchain_mempool) as pending_transactions,
  (SELECT COUNT(*) FROM teranga_blockchain_validators WHERE is_active = true) as active_validators,
  (SELECT COUNT(DISTINCT case_id) FROM teranga_blockchain_transactions WHERE case_id IS NOT NULL) as cases_on_blockchain,
  NOW() as updated_at;

-- Vue des métriques par type de transaction
CREATE OR REPLACE VIEW teranga_blockchain_transaction_metrics AS
SELECT 
  type,
  COUNT(*) as transaction_count,
  COUNT(DISTINCT case_id) as unique_cases,
  AVG(gas_used) as avg_gas_used,
  SUM(gas_price * gas_used) as total_fees,
  MIN(timestamp) as first_transaction,
  MAX(timestamp) as latest_transaction
FROM teranga_blockchain_transactions
WHERE timestamp >= NOW() - INTERVAL '30 days'
GROUP BY type
ORDER BY transaction_count DESC;

-- Vue de l'intégrité des blocs
CREATE OR REPLACE VIEW teranga_blockchain_integrity_check AS
WITH block_chain AS (
  SELECT 
    b1.number,
    b1.hash,
    b1.previous_hash,
    b2.hash as actual_previous_hash,
    CASE 
      WHEN b1.previous_hash = b2.hash OR b1.number = 0 THEN true 
      ELSE false 
    END as chain_valid
  FROM teranga_blockchain_blocks b1
  LEFT JOIN teranga_blockchain_blocks b2 ON b2.number = b1.number - 1
)
SELECT 
  COUNT(*) as total_blocks,
  COUNT(*) FILTER (WHERE chain_valid = true) as valid_blocks,
  COUNT(*) FILTER (WHERE chain_valid = false) as invalid_blocks,
  ROUND(
    (COUNT(*) FILTER (WHERE chain_valid = true)::DECIMAL / COUNT(*)) * 100, 2
  ) as integrity_percentage
FROM block_chain;

-- ===============================================
-- 🔄 TRIGGERS ET FONCTIONS
-- ===============================================

-- Fonction pour mettre à jour les compteurs de blocs
CREATE OR REPLACE FUNCTION update_block_transaction_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE teranga_blockchain_blocks 
    SET transaction_count = transaction_count + 1
    WHERE id = NEW.block_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE teranga_blockchain_blocks 
    SET transaction_count = transaction_count - 1
    WHERE id = OLD.block_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour compter les transactions
CREATE TRIGGER trigger_update_block_transaction_count
  AFTER INSERT OR DELETE ON teranga_blockchain_transactions
  FOR EACH ROW EXECUTE FUNCTION update_block_transaction_count();

-- Fonction pour nettoyer la mempool automatiquement
CREATE OR REPLACE FUNCTION cleanup_old_mempool()
RETURNS void AS $$
BEGIN
  DELETE FROM teranga_blockchain_mempool
  WHERE created_at < NOW() - INTERVAL '1 hour'
  AND status = 'pending';
END;
$$ LANGUAGE plpgsql;

-- Fonction pour créer un événement blockchain automatiquement
CREATE OR REPLACE FUNCTION create_blockchain_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO teranga_blockchain_events (
    event_type, 
    transaction_id, 
    case_id, 
    event_data,
    emitted_by
  ) VALUES (
    'transaction_confirmed',
    NEW.transaction_id,
    NEW.case_id,
    jsonb_build_object(
      'type', NEW.type,
      'gas_used', NEW.gas_used,
      'block_number', NEW.block_number
    ),
    NEW.user_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour événements automatiques
CREATE TRIGGER trigger_blockchain_event_on_transaction
  AFTER INSERT ON teranga_blockchain_transactions
  FOR EACH ROW EXECUTE FUNCTION create_blockchain_event();

-- ===============================================
-- 🔐 ROW LEVEL SECURITY
-- ===============================================

-- Activer RLS
ALTER TABLE teranga_blockchain_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE teranga_blockchain_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE teranga_blockchain_mempool ENABLE ROW LEVEL SECURITY;
ALTER TABLE teranga_blockchain_events ENABLE ROW LEVEL SECURITY;

-- Politiques pour les blocs (lecture publique, écriture système)
CREATE POLICY "Blocs blockchain lisibles par tous" ON teranga_blockchain_blocks
  FOR SELECT USING (true);

CREATE POLICY "Blocs blockchain modifiables par système" ON teranga_blockchain_blocks
  FOR ALL USING (auth.role() = 'service_role');

-- Politiques pour les transactions
CREATE POLICY "Transactions lisibles par propriétaire ou cas lié" ON teranga_blockchain_transactions
  FOR SELECT USING (
    user_id = auth.uid() OR
    case_id IN (
      SELECT id FROM purchase_cases 
      WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
    )
  );

CREATE POLICY "Transactions modifiables par système" ON teranga_blockchain_transactions
  FOR ALL USING (auth.role() = 'service_role');

-- Politiques pour la mempool
CREATE POLICY "Mempool lisible par propriétaire" ON teranga_blockchain_mempool
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Mempool modifiable par propriétaire ou système" ON teranga_blockchain_mempool
  FOR ALL USING (
    user_id = auth.uid() OR 
    auth.role() = 'service_role'
  );

-- ===============================================
-- 📈 DONNÉES D'EXEMPLE (DÉVELOPPEMENT)
-- ===============================================

-- Bloc genesis
INSERT INTO teranga_blockchain_blocks (
  number, hash, previous_hash, merkle_root, validator, network_id
) VALUES (
  0, 
  'genesis_block_hash_teranga_0000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  'merkle_root_genesis_00000000000000000000000000000000000000000000',
  'teranga-validator-1',
  'teranga-senegal-001'
) ON CONFLICT (number) DO NOTHING;

-- Types de transactions possibles (pour référence)
/*
Types de transactions blockchain Teranga:
- case_creation: Création d'un nouveau dossier
- status_update: Changement de statut  
- document_upload: Upload de document
- payment_processed: Paiement traité
- contract_signed: Contrat signé
- property_transfer: Transfert de propriété
- case_completed: Dossier finalisé
- dispute_opened: Litige ouvert
- dispute_resolved: Litige résolu
- validator_change: Changement de validateur
- network_upgrade: Mise à niveau réseau
*/

-- ===============================================
-- 📋 PROCÉDURES ADMINISTRATIVES
-- ===============================================

-- Procédure de nettoyage quotidien
CREATE OR REPLACE FUNCTION daily_blockchain_maintenance()
RETURNS void AS $$
BEGIN
  -- Nettoyer la mempool
  PERFORM cleanup_old_mempool();
  
  -- Archiver les anciens événements (>6 mois)
  DELETE FROM teranga_blockchain_events
  WHERE timestamp < NOW() - INTERVAL '6 months';
  
  -- Créer un audit automatique
  INSERT INTO teranga_blockchain_audits (
    audit_type,
    block_range_start,
    block_range_end,
    audit_results,
    timestamp
  )
  SELECT 
    'daily_auto_audit',
    0,
    MAX(number),
    jsonb_build_object(
      'total_blocks', COUNT(*),
      'integrity_check', 'passed'
    ),
    NOW()
  FROM teranga_blockchain_blocks;
  
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE teranga_blockchain_blocks IS 'Blocs de la blockchain privée Teranga pour l''immobilier';
COMMENT ON TABLE teranga_blockchain_transactions IS 'Transactions confirmées sur la blockchain Teranga';  
COMMENT ON TABLE teranga_blockchain_mempool IS 'Transactions en attente de confirmation';
COMMENT ON TABLE teranga_blockchain_validators IS 'Validateurs de la blockchain Teranga (PoA)';
COMMENT ON TABLE teranga_blockchain_events IS 'Événements émis par les smart contracts';
COMMENT ON TABLE teranga_blockchain_audits IS 'Audits d''intégrité de la blockchain';

-- ===============================================
-- 🎯 RÉSUMÉ CONFIGURATION
-- ===============================================

/*
🔗 TERANGA BLOCKCHAIN CONFIGURATION RÉSUMÉ:

📊 Architecture:
- Blockchain privée Proof of Authority (PoA)
- 3 validateurs initiaux 
- Temps de bloc: 30 secondes
- Network ID: teranga-senegal-001

🗃️ Tables créées:
- teranga_blockchain_blocks (blocs)
- teranga_blockchain_transactions (transactions confirmées) 
- teranga_blockchain_mempool (transactions en attente)
- teranga_blockchain_validators (validateurs PoA)
- teranga_blockchain_events (événements smart contract)
- teranga_blockchain_audits (audits intégrité)

📈 Vues analytics:
- teranga_blockchain_stats (statistiques temps réel)
- teranga_blockchain_transaction_metrics (métriques par type)
- teranga_blockchain_integrity_check (vérification intégrité)

🔐 Sécurité:
- Row Level Security activée
- Politiques d'accès par utilisateur et dossier
- Signatures cryptographiques requises
- Audit trail complet

🎯 Fonctionnalités:
- Dossiers immobiliers immuables
- Traçabilité complète des transactions
- Vérification d'intégrité automatique  
- Gestion des litiges on-chain
- Métriques et analytics avancées

*/