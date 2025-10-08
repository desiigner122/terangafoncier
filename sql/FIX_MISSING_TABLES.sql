-- =============================================================================
-- CORRECTION DES TABLES MANQUANTES
-- =============================================================================
-- Date: 2025-10-07
-- Description: Création des tables manquantes causant les erreurs
-- Tables: property_inquiries, purchase_requests, crm_contacts
-- Fix: RLS profiles recursion
-- =============================================================================

-- =============================================================================
-- FIX 1: RÉCURSION INFINIE SUR PROFILES
-- =============================================================================

-- Désactiver temporairement pour recréer les policies
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les policies existantes qui causent la récursion
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Réactiver RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Créer des policies SIMPLES sans récursion
CREATE POLICY "profiles_select_own" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- =============================================================================
-- FIX 2: TABLE PROPERTY_INQUIRIES
-- =============================================================================

CREATE TABLE IF NOT EXISTS property_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  buyer_name VARCHAR(255) NOT NULL,
  buyer_email VARCHAR(255) NOT NULL,
  buyer_phone VARCHAR(50),
  message TEXT NOT NULL,
  inquiry_type VARCHAR(50) DEFAULT 'general' CHECK (inquiry_type IN ('general', 'visit', 'offer', 'info')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'replied', 'closed')),
  response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  responded_by UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_property_inquiries_vendor ON property_inquiries(vendor_id);
CREATE INDEX IF NOT EXISTS idx_property_inquiries_buyer ON property_inquiries(buyer_id);
CREATE INDEX IF NOT EXISTS idx_property_inquiries_property ON property_inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_property_inquiries_status ON property_inquiries(status);

-- RLS
ALTER TABLE property_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "property_inquiries_vendor_view" 
  ON property_inquiries FOR SELECT 
  USING (vendor_id = auth.uid());

CREATE POLICY "property_inquiries_buyer_view" 
  ON property_inquiries FOR SELECT 
  USING (buyer_id = auth.uid());

CREATE POLICY "property_inquiries_buyer_insert" 
  ON property_inquiries FOR INSERT 
  WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "property_inquiries_vendor_update" 
  ON property_inquiries FOR UPDATE 
  USING (vendor_id = auth.uid());

-- Trigger
CREATE TRIGGER update_property_inquiries_updated_at 
  BEFORE UPDATE ON property_inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- FIX 3: TABLE PURCHASE_REQUESTS
-- =============================================================================

CREATE TABLE IF NOT EXISTS purchase_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_type VARCHAR(50) DEFAULT 'purchase' CHECK (request_type IN ('purchase', 'rent', 'visit', 'info')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'negotiating', 'completed', 'canceled')),
  offer_price DECIMAL(15, 2),
  message TEXT,
  documents JSONB DEFAULT '[]'::jsonb,
  financing_type VARCHAR(50) CHECK (financing_type IN ('cash', 'mortgage', 'installment', 'other')),
  preferred_visit_date TIMESTAMP WITH TIME ZONE,
  vendor_response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  accepted_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_purchase_requests_vendor ON purchase_requests(vendor_id);
CREATE INDEX IF NOT EXISTS idx_purchase_requests_buyer ON purchase_requests(buyer_id);
CREATE INDEX IF NOT EXISTS idx_purchase_requests_property ON purchase_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_purchase_requests_status ON purchase_requests(status);

-- RLS
ALTER TABLE purchase_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "purchase_requests_vendor_view" 
  ON purchase_requests FOR SELECT 
  USING (vendor_id = auth.uid());

CREATE POLICY "purchase_requests_buyer_view" 
  ON purchase_requests FOR SELECT 
  USING (buyer_id = auth.uid());

CREATE POLICY "purchase_requests_buyer_insert" 
  ON purchase_requests FOR INSERT 
  WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "purchase_requests_vendor_update" 
  ON purchase_requests FOR UPDATE 
  USING (vendor_id = auth.uid());

CREATE POLICY "purchase_requests_buyer_update" 
  ON purchase_requests FOR UPDATE 
  USING (buyer_id = auth.uid());

-- Trigger
CREATE TRIGGER update_purchase_requests_updated_at 
  BEFORE UPDATE ON purchase_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- FIX 4: TABLE CRM_CONTACTS (CORRECTION STRUCTURE)
-- =============================================================================

-- Supprimer l'ancienne table si elle existe avec mauvaise structure
DROP TABLE IF EXISTS crm_contacts CASCADE;

-- Recréer avec la bonne structure
CREATE TABLE crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  position VARCHAR(100),
  source VARCHAR(100) CHECK (source IN ('website', 'referral', 'social', 'direct', 'other')),
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost')),
  score INTEGER DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
  notes TEXT,
  tags TEXT[],
  last_contact_at TIMESTAMP WITH TIME ZONE,
  next_followup_at TIMESTAMP WITH TIME ZONE,
  assigned_to UUID REFERENCES auth.users(id),
  properties_interested JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_crm_contacts_vendor ON crm_contacts(vendor_id);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_status ON crm_contacts(status);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_email ON crm_contacts(email);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_phone ON crm_contacts(phone);

-- RLS
ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crm_contacts_vendor_all" 
  ON crm_contacts 
  USING (vendor_id = auth.uid());

CREATE POLICY "crm_contacts_vendor_insert" 
  ON crm_contacts FOR INSERT 
  WITH CHECK (vendor_id = auth.uid());

-- Trigger
CREATE TRIGGER update_crm_contacts_updated_at 
  BEFORE UPDATE ON crm_contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- DONNÉES DE TEST (OPTIONNEL)
-- =============================================================================

-- Insérer quelques données de test pour vérifier que tout fonctionne
-- (Commenté par défaut - décommenter si besoin)

/*
-- Test: Property Inquiries
INSERT INTO property_inquiries (
  property_id, vendor_id, buyer_id, buyer_name, buyer_email, message, status
) SELECT 
  p.id,
  p.owner_id,
  (SELECT id FROM auth.users WHERE email LIKE '%@test.com' LIMIT 1),
  'Jean Dupont',
  'jean.dupont@test.com',
  'Je suis intéressé par cette propriété. Pouvez-vous me donner plus d''informations?',
  'pending'
FROM properties p LIMIT 1;

-- Test: Purchase Requests
INSERT INTO purchase_requests (
  property_id, vendor_id, buyer_id, request_type, status, offer_price, message
) SELECT 
  p.id,
  p.owner_id,
  (SELECT id FROM auth.users WHERE email LIKE '%@test.com' LIMIT 1),
  'purchase',
  'pending',
  p.price * 0.95,
  'Je souhaite faire une offre d''achat pour cette propriété.'
FROM properties p LIMIT 1;

-- Test: CRM Contacts
INSERT INTO crm_contacts (
  vendor_id, name, email, phone, status, score, notes
) SELECT 
  id,
  'Marie Martin',
  'marie.martin@example.com',
  '+221 77 123 4567',
  'qualified',
  75,
  'Prospect intéressé par des terrains à Dakar'
FROM auth.users WHERE email LIKE '%vendeur%' LIMIT 1;
*/

-- =============================================================================
-- VÉRIFICATION FINALE
-- =============================================================================

SELECT 
  'Fix completed!' AS status,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'property_inquiries') AS property_inquiries_exists,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'purchase_requests') AS purchase_requests_exists,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'crm_contacts') AS crm_contacts_exists,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'profiles') AS profiles_policies_count;

-- =============================================================================
-- TERMINÉ! ✅
-- =============================================================================
-- Vous pouvez maintenant:
-- 1. Rafraîchir votre navigateur (CTRL+F5)
-- 2. Tester les fonctionnalités CRM
-- 3. Vérifier que les erreurs "table not found" ont disparu
-- =============================================================================
