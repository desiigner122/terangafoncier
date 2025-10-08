-- =============================================================================
-- TABLES SERVICES DIGITAUX - ABONNEMENTS ET USAGE
-- =============================================================================
-- Date: 2025-10-07
-- Description: Tables pour les services digitaux (signature, OCR, visite virtuelle, etc.)
-- =============================================================================

-- 1. TABLE: digital_services
-- Catalogue des services digitaux disponibles
CREATE TABLE IF NOT EXISTS digital_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informations de base
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  short_description VARCHAR(500),
  
  -- Catégorisation
  category VARCHAR(100) NOT NULL, -- signature, visite_virtuelle, ocr, stockage, marketing, juridique
  icon VARCHAR(50), -- Nom de l'icône Lucide
  color VARCHAR(50), -- Couleur hex pour UI
  
  -- Plans tarifaires (stockés en JSONB pour flexibilité)
  plans JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Exemple de structure:
  -- [
  --   {
  --     "name": "Free",
  --     "price": 0,
  --     "period": "monthly",
  --     "features": ["Feature 1", "Feature 2"],
  --     "usage_limit": 10,
  --     "is_popular": false
  --   },
  --   {
  --     "name": "Premium",
  --     "price": 19900,
  --     "period": "monthly",
  --     "features": ["Feature 1", "Feature 2", "Feature 3"],
  --     "usage_limit": null,
  --     "is_popular": true
  --   }
  -- ]
  
  -- Configuration
  api_endpoint VARCHAR(500), -- URL de l'API du service
  settings JSONB DEFAULT '{}'::jsonb, -- Paramètres additionnels
  
  -- Statut
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  
  -- Métadonnées
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLE: service_subscriptions
-- Abonnements des utilisateurs aux services
CREATE TABLE IF NOT EXISTS service_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Utilisateur et service
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES digital_services(id) ON DELETE CASCADE,
  
  -- Détails de l'abonnement
  plan_name VARCHAR(100) NOT NULL, -- Free, Basic, Premium, etc.
  plan_price DECIMAL(10, 2) NOT NULL DEFAULT 0, -- Prix en FCFA
  billing_period VARCHAR(50) DEFAULT 'monthly', -- monthly, yearly, lifetime
  
  -- Statut
  status VARCHAR(50) NOT NULL DEFAULT 'active' 
    CHECK (status IN ('active', 'paused', 'canceled', 'expired', 'trial')),
  
  -- Dates
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE, -- NULL pour lifetime
  trial_end_date TIMESTAMP WITH TIME ZONE,
  next_billing_date TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  paused_at TIMESTAMP WITH TIME ZONE,
  
  -- Limites d'usage
  usage_limit INTEGER, -- NULL = illimité
  usage_count INTEGER DEFAULT 0,
  usage_reset_date TIMESTAMP WITH TIME ZONE, -- Date de réinitialisation du compteur
  
  -- Renouvellement automatique
  auto_renew BOOLEAN DEFAULT TRUE,
  
  -- Paiement
  last_payment_id VARCHAR(255), -- ID de transaction externe (Wave, Stripe, etc.)
  last_payment_at TIMESTAMP WITH TIME ZONE,
  last_payment_amount DECIMAL(10, 2),
  
  -- Métadonnées
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contrainte: un utilisateur ne peut avoir qu'un abonnement actif par service
  UNIQUE(user_id, service_id, status) DEFERRABLE INITIALLY DEFERRED
);

-- 3. TABLE: service_usage
-- Historique d'utilisation des services
CREATE TABLE IF NOT EXISTS service_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Utilisateur et service
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES digital_services(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES service_subscriptions(id) ON DELETE SET NULL,
  
  -- Détails de l'utilisation
  action VARCHAR(255) NOT NULL, -- upload_document, generate_signature, create_virtual_tour, etc.
  resource_type VARCHAR(100), -- document, image, video, etc.
  resource_id UUID, -- ID de la ressource concernée (property, document, etc.)
  
  -- Résultat
  status VARCHAR(50) NOT NULL DEFAULT 'success' 
    CHECK (status IN ('success', 'failed', 'pending', 'canceled')),
  error_message TEXT,
  
  -- Consommation
  units_consumed INTEGER DEFAULT 1, -- Nombre d'unités consommées (crédits, pages, minutes, etc.)
  cost_amount DECIMAL(10, 2), -- Coût en FCFA si facturation à l'usage
  
  -- Métadonnées
  request_data JSONB DEFAULT '{}'::jsonb, -- Données de la requête
  response_data JSONB DEFAULT '{}'::jsonb, -- Réponse de l'API
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Durée
  duration_ms INTEGER, -- Durée de traitement en millisecondes
  
  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLE: service_invoices (Optionnel - pour facturation)
CREATE TABLE IF NOT EXISTS service_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Utilisateur et abonnement
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES service_subscriptions(id) ON DELETE SET NULL,
  
  -- Numéro de facture
  invoice_number VARCHAR(50) UNIQUE NOT NULL, -- Format: INV-2025-XXXXXX
  
  -- Montants
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_rate DECIMAL(5, 2) DEFAULT 0, -- Taux de TVA (18% au Sénégal)
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  
  -- Statut
  status VARCHAR(50) NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'paid', 'overdue', 'canceled', 'refunded')),
  
  -- Dates
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Paiement
  payment_method VARCHAR(100), -- wave, orange_money, credit_card, etc.
  payment_reference VARCHAR(255), -- Référence de transaction externe
  
  -- Lignes de facture
  line_items JSONB DEFAULT '[]'::jsonb,
  -- Exemple:
  -- [
  --   {
  --     "description": "Service Signature Électronique - Plan Premium",
  --     "quantity": 1,
  --     "unit_price": 19900,
  --     "total": 19900
  --   }
  -- ]
  
  -- Notes
  notes TEXT,
  
  -- Métadonnées
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INDEXES POUR PERFORMANCE
-- =============================================================================

-- Digital Services
CREATE INDEX IF NOT EXISTS idx_digital_services_slug ON digital_services(slug);
CREATE INDEX IF NOT EXISTS idx_digital_services_category ON digital_services(category);
CREATE INDEX IF NOT EXISTS idx_digital_services_active ON digital_services(is_active);

-- Service Subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON service_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_service_id ON service_subscriptions(service_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON service_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON service_subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing ON service_subscriptions(next_billing_date) 
  WHERE status = 'active' AND auto_renew = TRUE;

-- Service Usage
CREATE INDEX IF NOT EXISTS idx_usage_user_id ON service_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_service_id ON service_usage(service_id);
CREATE INDEX IF NOT EXISTS idx_usage_subscription_id ON service_usage(subscription_id);
CREATE INDEX IF NOT EXISTS idx_usage_created_at ON service_usage(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_user_service ON service_usage(user_id, service_id, created_at DESC);

-- Service Invoices
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON service_invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_subscription_id ON service_invoices(subscription_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON service_invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON service_invoices(due_date) 
  WHERE status = 'pending';

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

ALTER TABLE digital_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_invoices ENABLE ROW LEVEL SECURITY;

-- DIGITAL SERVICES: Tout le monde peut voir les services actifs
CREATE POLICY "Everyone views active services" ON digital_services
  FOR SELECT USING (is_active = TRUE);

-- SUBSCRIPTIONS: Les utilisateurs voient leurs propres abonnements
CREATE POLICY "Users view own subscriptions" ON service_subscriptions
  FOR SELECT USING (user_id = auth.uid());

-- SUBSCRIPTIONS: Les utilisateurs peuvent créer leurs abonnements
CREATE POLICY "Users create subscriptions" ON service_subscriptions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- SUBSCRIPTIONS: Les utilisateurs peuvent modifier leurs abonnements
CREATE POLICY "Users update own subscriptions" ON service_subscriptions
  FOR UPDATE USING (user_id = auth.uid());

-- USAGE: Les utilisateurs voient leur propre usage
CREATE POLICY "Users view own usage" ON service_usage
  FOR SELECT USING (user_id = auth.uid());

-- USAGE: Les utilisateurs peuvent enregistrer leur usage
CREATE POLICY "Users create usage records" ON service_usage
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- INVOICES: Les utilisateurs voient leurs propres factures
CREATE POLICY "Users view own invoices" ON service_invoices
  FOR SELECT USING (user_id = auth.uid());

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Trigger: Mettre à jour updated_at
CREATE TRIGGER update_digital_services_updated_at 
  BEFORE UPDATE ON digital_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_subscriptions_updated_at 
  BEFORE UPDATE ON service_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_invoices_updated_at 
  BEFORE UPDATE ON service_invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Incrémenter usage_count dans subscription
CREATE OR REPLACE FUNCTION increment_subscription_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'success' AND NEW.subscription_id IS NOT NULL THEN
    UPDATE service_subscriptions
    SET usage_count = usage_count + COALESCE(NEW.units_consumed, 1)
    WHERE id = NEW.subscription_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_usage 
  AFTER INSERT ON service_usage
  FOR EACH ROW EXECUTE FUNCTION increment_subscription_usage();

-- Trigger: Vérifier limite d'usage avant utilisation
CREATE OR REPLACE FUNCTION check_usage_limit()
RETURNS TRIGGER AS $$
DECLARE
  subscription_record RECORD;
BEGIN
  IF NEW.subscription_id IS NOT NULL THEN
    SELECT * INTO subscription_record
    FROM service_subscriptions
    WHERE id = NEW.subscription_id;
    
    IF subscription_record.usage_limit IS NOT NULL THEN
      IF subscription_record.usage_count >= subscription_record.usage_limit THEN
        RAISE EXCEPTION 'Usage limit exceeded for subscription %', NEW.subscription_id;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_usage_limit 
  BEFORE INSERT ON service_usage
  FOR EACH ROW EXECUTE FUNCTION check_usage_limit();

-- =============================================================================
-- FONCTIONS UTILITAIRES
-- =============================================================================

-- Fonction: Générer numéro de facture unique
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  year_part TEXT;
  sequence_part TEXT;
  exists_check BOOLEAN;
BEGIN
  year_part := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  LOOP
    -- Générer INV-YYYY-XXXXXX (6 chiffres aléatoires)
    sequence_part := LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
    new_number := 'INV-' || year_part || '-' || sequence_part;
    
    -- Vérifier si le numéro existe déjà
    SELECT EXISTS(SELECT 1 FROM service_invoices WHERE invoice_number = new_number) INTO exists_check;
    
    -- Si le numéro n'existe pas, le retourner
    EXIT WHEN NOT exists_check;
  END LOOP;
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Créer facture pour abonnement
CREATE OR REPLACE FUNCTION create_subscription_invoice(
  sub_id UUID
)
RETURNS UUID AS $$
DECLARE
  subscription_record RECORD;
  new_invoice_id UUID;
BEGIN
  SELECT * INTO subscription_record
  FROM service_subscriptions
  WHERE id = sub_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Subscription not found: %', sub_id;
  END IF;
  
  INSERT INTO service_invoices (
    user_id,
    subscription_id,
    invoice_number,
    subtotal,
    total,
    due_date,
    line_items
  )
  VALUES (
    subscription_record.user_id,
    sub_id,
    generate_invoice_number(),
    subscription_record.plan_price,
    subscription_record.plan_price, -- TODO: ajouter taxes
    CURRENT_DATE + INTERVAL '7 days',
    jsonb_build_array(
      jsonb_build_object(
        'description', 'Service Subscription - ' || subscription_record.plan_name,
        'quantity', 1,
        'unit_price', subscription_record.plan_price,
        'total', subscription_record.plan_price
      )
    )
  )
  RETURNING id INTO new_invoice_id;
  
  RETURN new_invoice_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction: Renouveler abonnement
CREATE OR REPLACE FUNCTION renew_subscription(
  sub_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  subscription_record RECORD;
BEGIN
  SELECT * INTO subscription_record
  FROM service_subscriptions
  WHERE id = sub_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Mettre à jour les dates
  UPDATE service_subscriptions
  SET 
    start_date = CURRENT_TIMESTAMP,
    end_date = CASE 
      WHEN billing_period = 'monthly' THEN CURRENT_TIMESTAMP + INTERVAL '1 month'
      WHEN billing_period = 'yearly' THEN CURRENT_TIMESTAMP + INTERVAL '1 year'
      ELSE NULL
    END,
    next_billing_date = CASE 
      WHEN billing_period = 'monthly' THEN CURRENT_TIMESTAMP + INTERVAL '1 month'
      WHEN billing_period = 'yearly' THEN CURRENT_TIMESTAMP + INTERVAL '1 year'
      ELSE NULL
    END,
    usage_count = 0,
    usage_reset_date = CURRENT_TIMESTAMP,
    updated_at = NOW()
  WHERE id = sub_id;
  
  -- Créer facture
  PERFORM create_subscription_invoice(sub_id);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- VUES UTILES
-- =============================================================================

-- Vue: Abonnements avec détails des services
CREATE OR REPLACE VIEW subscriptions_with_services AS
SELECT 
  s.*,
  ds.name AS service_name,
  ds.slug AS service_slug,
  ds.category AS service_category,
  ds.icon AS service_icon,
  CASE 
    WHEN s.usage_limit IS NOT NULL THEN 
      ROUND((s.usage_count::DECIMAL / s.usage_limit::DECIMAL) * 100, 2)
    ELSE NULL
  END AS usage_percentage,
  CASE 
    WHEN s.usage_limit IS NOT NULL THEN 
      s.usage_limit - s.usage_count
    ELSE NULL
  END AS remaining_usage
FROM service_subscriptions s
JOIN digital_services ds ON ds.id = s.service_id;

-- Vue: Statistiques d'usage par service
CREATE OR REPLACE VIEW usage_stats_by_service AS
SELECT 
  ds.id AS service_id,
  ds.name AS service_name,
  COUNT(u.id) AS total_uses,
  COUNT(u.id) FILTER (WHERE u.status = 'success') AS successful_uses,
  COUNT(u.id) FILTER (WHERE u.status = 'failed') AS failed_uses,
  AVG(u.duration_ms) AS avg_duration_ms,
  SUM(u.units_consumed) AS total_units_consumed,
  SUM(u.cost_amount) AS total_cost
FROM digital_services ds
LEFT JOIN service_usage u ON u.service_id = ds.id
GROUP BY ds.id, ds.name;

-- =============================================================================
-- DONNÉES INITIALES: Services digitaux
-- =============================================================================

INSERT INTO digital_services (name, slug, description, category, icon, color, plans, is_active, is_featured, display_order) VALUES
  (
    'Signature Électronique',
    'signature-electronique',
    'Signez vos documents immobiliers en ligne de manière sécurisée et légale',
    'signature',
    'PenTool',
    '#3B82F6',
    '[
      {"name": "Free", "price": 0, "period": "monthly", "features": ["5 signatures/mois", "Documents PDF", "Certificat basique"], "usage_limit": 5, "is_popular": false},
      {"name": "Basic", "price": 4900, "period": "monthly", "features": ["20 signatures/mois", "Documents PDF & Word", "Certificat avancé", "Templates"], "usage_limit": 20, "is_popular": false},
      {"name": "Premium", "price": 14900, "period": "monthly", "features": ["Signatures illimitées", "Tous formats", "Certificat premium", "Templates", "API access", "Support prioritaire"], "usage_limit": null, "is_popular": true}
    ]'::jsonb,
    TRUE,
    TRUE,
    1
  ),
  (
    'Visite Virtuelle 360°',
    'visite-virtuelle',
    'Créez des visites virtuelles immersives de vos propriétés',
    'visite_virtuelle',
    'Video',
    '#8B5CF6',
    '[
      {"name": "Basic", "price": 9900, "period": "monthly", "features": ["5 visites/mois", "Photos 360°", "Navigation basique"], "usage_limit": 5, "is_popular": false},
      {"name": "Premium", "price": 24900, "period": "monthly", "features": ["Visites illimitées", "Photos & Vidéos 360°", "Points d''intérêt", "Musique de fond", "Stats visiteurs"], "usage_limit": null, "is_popular": true}
    ]'::jsonb,
    TRUE,
    TRUE,
    2
  ),
  (
    'OCR & Analyse Documents',
    'ocr-documents',
    'Numérisez et analysez automatiquement vos documents fonciers',
    'ocr',
    'ScanText',
    '#10B981',
    '[
      {"name": "Basic", "price": 2900, "period": "monthly", "features": ["50 pages/mois", "OCR français", "Export PDF"], "usage_limit": 50, "is_popular": false},
      {"name": "Premium", "price": 9900, "period": "monthly", "features": ["500 pages/mois", "OCR multilingue", "Export PDF/Word", "Analyse IA", "Détection fraude"], "usage_limit": 500, "is_popular": true}
    ]'::jsonb,
    TRUE,
    FALSE,
    3
  ),
  (
    'Stockage Cloud Sécurisé',
    'stockage-cloud',
    'Stockez tous vos documents immobiliers en toute sécurité',
    'stockage',
    'Cloud',
    '#F59E0B',
    '[
      {"name": "Free", "price": 0, "period": "monthly", "features": ["5 GB", "Partage basique"], "usage_limit": 5368709120, "is_popular": false},
      {"name": "Basic", "price": 1900, "period": "monthly", "features": ["50 GB", "Partage avancé", "Versioning"], "usage_limit": 53687091200, "is_popular": false},
      {"name": "Premium", "price": 4900, "period": "monthly", "features": ["500 GB", "Partage illimité", "Versioning", "Backup automatique", "Encryption"], "usage_limit": 536870912000, "is_popular": true}
    ]'::jsonb,
    TRUE,
    FALSE,
    4
  ),
  (
    'Campagnes Marketing',
    'marketing-digital',
    'Boostez la visibilité de vos annonces avec nos outils marketing',
    'marketing',
    'Megaphone',
    '#EC4899',
    '[
      {"name": "Basic", "price": 14900, "period": "monthly", "features": ["5 campagnes/mois", "Email marketing", "Stats basiques"], "usage_limit": 5, "is_popular": false},
      {"name": "Premium", "price": 39900, "period": "monthly", "features": ["Campagnes illimitées", "Email + SMS + Social", "Analytics avancés", "A/B Testing", "Support dédié"], "usage_limit": null, "is_popular": true}
    ]'::jsonb,
    TRUE,
    FALSE,
    5
  ),
  (
    'Assistance Juridique',
    'assistance-juridique',
    'Consultez nos experts juridiques spécialisés en immobilier',
    'juridique',
    'Scale',
    '#EF4444',
    '[
      {"name": "Consultation", "price": 24900, "period": "one-time", "features": ["1 consultation 30min", "Rapport écrit"], "usage_limit": 1, "is_popular": false},
      {"name": "Accompagnement", "price": 149900, "period": "monthly", "features": ["Consultations illimitées", "Rédaction contrats", "Accompagnement transactions", "Urgences 24/7"], "usage_limit": null, "is_popular": true}
    ]'::jsonb,
    TRUE,
    TRUE,
    6
  )
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- NOTES IMPORTANTES
-- =============================================================================
-- 1. Les prix sont en centimes de FCFA (4900 = 4,900 FCFA = 4.9k FCFA)
-- 
-- 2. Pour intégrer les paiements:
--    - Wave Money (prioritaire au Sénégal)
--    - Orange Money
--    - Stripe (cartes internationales)
--
-- 3. Les plans sont stockés en JSONB pour flexibilité.
--    Vous pouvez facilement ajouter/modifier sans migration
--
-- 4. Le système de facturation automatique doit être implémenté
--    via Supabase Edge Functions avec un cron job
--
-- 5. Pour les webhooks de paiement, créez une Edge Function
--    qui écoute les callbacks de Wave/Orange Money/Stripe
-- =============================================================================

COMMENT ON TABLE digital_services IS 'Catalogue des services digitaux disponibles';
COMMENT ON TABLE service_subscriptions IS 'Abonnements des utilisateurs aux services';
COMMENT ON TABLE service_usage IS 'Historique d''utilisation des services';
COMMENT ON TABLE service_invoices IS 'Factures générées pour les abonnements';
COMMENT ON COLUMN service_subscriptions.usage_limit IS 'NULL = illimité, sinon nombre maximum d''utilisations';
COMMENT ON COLUMN service_usage.units_consumed IS 'Nombre d''unités consommées (crédits, pages, minutes, etc.)';
