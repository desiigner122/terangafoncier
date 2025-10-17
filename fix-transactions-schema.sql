-- 🔧 CORRECTION DU SCHÉMA DE LA TABLE TRANSACTIONS
-- Pour que CheckoutPage.jsx puisse créer des demandes d'achat

-- ========================================
-- 1. AJOUTER LES COLONNES MANQUANTES
-- ========================================

-- Colonne buyer_id (référence au profil acheteur)
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS buyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Colonne seller_id (référence au profil vendeur)
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Colonne parcel_id (référence au terrain)
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS parcel_id UUID REFERENCES parcels(id) ON DELETE SET NULL;

-- Colonne buyer_info (informations acheteur en JSONB)
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS buyer_info JSONB DEFAULT '{}'::jsonb;

-- Colonne transaction_type (type de transaction)
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS transaction_type TEXT DEFAULT 'purchase';

-- Colonne payment_method (méthode de paiement)
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- ========================================
-- 2. CRÉER DES INDEX POUR PERFORMANCE
-- ========================================

CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_parcel_id ON transactions(parcel_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_method ON transactions(payment_method);

-- ========================================
-- 3. COMMENTER LES COLONNES
-- ========================================

COMMENT ON COLUMN transactions.buyer_id IS 'ID du profil acheteur';
COMMENT ON COLUMN transactions.seller_id IS 'ID du profil vendeur';
COMMENT ON COLUMN transactions.parcel_id IS 'ID du terrain (parcelle)';
COMMENT ON COLUMN transactions.buyer_info IS 'Informations de l''acheteur (nom, email, téléphone) en JSONB';
COMMENT ON COLUMN transactions.transaction_type IS 'Type de transaction: purchase, sale, rent, etc.';
COMMENT ON COLUMN transactions.payment_method IS 'Méthode de paiement: one-time, installments, bank_financing';

-- ========================================
-- 4. VÉRIFICATION
-- ========================================

-- Voir la nouvelle structure
SELECT 
  '✅ NOUVELLE STRUCTURE TRANSACTIONS' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'transactions'
ORDER BY ordinal_position;
