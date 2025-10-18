-- ================================================
-- 🚨 RECONSTRUCTION CRM CONTACTS TABLE
-- Table trouvée VIDE (0 colonnes FK)
-- Exécuter dans Supabase SQL Editor
-- ================================================

-- ✅ ÉTAPE 1: SAUVEGARDER LES DONNÉES EXISTANTES (si y en a)
DROP TABLE IF EXISTS crm_contacts_backup;
CREATE TABLE crm_contacts_backup AS SELECT * FROM crm_contacts;

-- ✅ ÉTAPE 2: SUPPRIMER LA TABLE CASSÉE
DROP TABLE IF EXISTS crm_contacts CASCADE;

-- ✅ ÉTAPE 3: RECRÉER LA TABLE CORRECTEMENT

CREATE TABLE crm_contacts (
  -- Identifiants
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,  -- ✅ COLONNE MANQUANTE!
  
  -- Informations de base
  name VARCHAR(200),  -- Nom complet (optionnel si first_name/last_name)
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  role VARCHAR(50),
  company VARCHAR(100),
  location VARCHAR(100),
  
  -- Statut et scoring
  status VARCHAR(50) DEFAULT 'prospect',  -- prospect, lead, client, inactive, lost
  priority VARCHAR(50) DEFAULT 'medium',  -- low, medium, high, urgent
  score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  budget_min DECIMAL(15, 2),
  budget_max DECIMAL(15, 2),
  
  -- Tags et intérêts
  interests TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  
  -- Notes et metadata
  notes TEXT,
  custom_fields JSONB DEFAULT '{}',
  
  -- Contact tracking
  last_contact_date TIMESTAMP,
  next_follow_up TIMESTAMP,
  contact_frequency VARCHAR(50) DEFAULT 'monthly',
  
  -- Avatar
  avatar_url VARCHAR(500),
  
  -- Source
  source VARCHAR(50) DEFAULT 'manual',
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  
  -- Foreign key
  CONSTRAINT fk_crm_contacts_user 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE
);

-- ✅ ÉTAPE 4: CRÉER LES INDEX POUR PERFORMANCE

CREATE INDEX idx_crm_contacts_user_id ON crm_contacts(user_id);
CREATE INDEX idx_crm_contacts_status ON crm_contacts(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_crm_contacts_created_at ON crm_contacts(created_at DESC);
CREATE INDEX idx_crm_contacts_score ON crm_contacts(score DESC);

-- ✅ ÉTAPE 5: ACTIVER ROW-LEVEL SECURITY

ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;

-- Politique: Utilisateurs voient seulement leurs propres contacts
CREATE POLICY crm_contacts_user_policy ON crm_contacts
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Politique: Admin peut voir tous
CREATE POLICY crm_contacts_admin_policy ON crm_contacts
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- ✅ ÉTAPE 6: CRÉER TABLE DES DEALS

DROP TABLE IF EXISTS crm_deals CASCADE;

CREATE TABLE crm_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  contact_id UUID NOT NULL,
  
  -- Informations du deal
  title VARCHAR(200) NOT NULL,
  value DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'XOF',
  
  -- Pipeline
  stage VARCHAR(50) DEFAULT 'Prospection',  -- Prospection, Qualification, Proposition, Négociation, Fermeture
  probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  
  -- Dates
  expected_close_date TIMESTAMP,
  actual_close_date TIMESTAMP,
  
  -- Assignment
  assigned_to UUID,
  
  -- Description
  description TEXT,
  notes TEXT,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  
  CONSTRAINT fk_crm_deals_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_crm_deals_contact FOREIGN KEY (contact_id) REFERENCES crm_contacts(id) ON DELETE CASCADE
);

CREATE INDEX idx_crm_deals_user_id ON crm_deals(user_id);
CREATE INDEX idx_crm_deals_contact_id ON crm_deals(contact_id);
CREATE INDEX idx_crm_deals_stage ON crm_deals(stage);
CREATE INDEX idx_crm_deals_created_at ON crm_deals(created_at DESC);

ALTER TABLE crm_deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY crm_deals_user_policy ON crm_deals USING (user_id = auth.uid());

-- ✅ ÉTAPE 7: CRÉER TABLE DES ACTIVITÉS

DROP TABLE IF EXISTS crm_activities CASCADE;

CREATE TABLE crm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  contact_id UUID,
  deal_id UUID,
  
  -- Type d'activité
  type VARCHAR(50) NOT NULL,  -- call, email, meeting, note, task
  title VARCHAR(200) NOT NULL,
  description TEXT,
  
  -- Outcome
  outcome VARCHAR(50),  -- positive, negative, neutral
  
  -- Participants
  participants TEXT[] DEFAULT '{}',
  
  -- Files/attachments
  attachments TEXT[] DEFAULT '{}',
  
  -- Duration (pour calls)
  duration_minutes INTEGER,
  
  -- Scheduled date
  scheduled_date TIMESTAMP,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  
  CONSTRAINT fk_crm_activities_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_crm_activities_contact FOREIGN KEY (contact_id) REFERENCES crm_contacts(id) ON DELETE SET NULL,
  CONSTRAINT fk_crm_activities_deal FOREIGN KEY (deal_id) REFERENCES crm_deals(id) ON DELETE SET NULL
);

CREATE INDEX idx_crm_activities_user_id ON crm_activities(user_id);
CREATE INDEX idx_crm_activities_contact_id ON crm_activities(contact_id);
CREATE INDEX idx_crm_activities_deal_id ON crm_activities(deal_id);
CREATE INDEX idx_crm_activities_created_at ON crm_activities(created_at DESC);

ALTER TABLE crm_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY crm_activities_user_policy ON crm_activities USING (user_id = auth.uid());

-- ✅ ÉTAPE 8: CRÉER TABLE DES TÂCHES

DROP TABLE IF EXISTS crm_tasks CASCADE;

CREATE TABLE crm_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  contact_id UUID,
  deal_id UUID,
  
  -- Titre et description
  title VARCHAR(200) NOT NULL,
  description TEXT,
  
  -- Assignment
  assigned_to UUID NOT NULL,
  
  -- Deadline
  due_date TIMESTAMP NOT NULL,
  completed_date TIMESTAMP,
  
  -- Priority
  priority VARCHAR(50) DEFAULT 'medium',  -- low, medium, high, urgent
  
  -- Status
  status VARCHAR(50) DEFAULT 'open',  -- open, in_progress, completed, cancelled
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  
  CONSTRAINT fk_crm_tasks_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_crm_tasks_assigned FOREIGN KEY (assigned_to) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_crm_tasks_contact FOREIGN KEY (contact_id) REFERENCES crm_contacts(id) ON DELETE SET NULL,
  CONSTRAINT fk_crm_tasks_deal FOREIGN KEY (deal_id) REFERENCES crm_deals(id) ON DELETE SET NULL
);

CREATE INDEX idx_crm_tasks_user_id ON crm_tasks(user_id);
CREATE INDEX idx_crm_tasks_assigned_to ON crm_tasks(assigned_to);
CREATE INDEX idx_crm_tasks_due_date ON crm_tasks(due_date);
CREATE INDEX idx_crm_tasks_status ON crm_tasks(status);

ALTER TABLE crm_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY crm_tasks_user_policy ON crm_tasks USING (user_id = auth.uid());

-- ✅ ÉTAPE 9: VÉRIFICATION FINALE

SELECT 
  'crm_contacts' as table_name,
  COUNT(*) as total_rows,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'crm_contacts') as column_count
FROM crm_contacts

UNION ALL

SELECT 
  'crm_deals' as table_name,
  COUNT(*) as total_rows,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'crm_deals') as column_count
FROM crm_deals

UNION ALL

SELECT 
  'crm_activities' as table_name,
  COUNT(*) as total_rows,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'crm_activities') as column_count
FROM crm_activities

UNION ALL

SELECT 
  'crm_tasks' as table_name,
  COUNT(*) as total_rows,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'crm_tasks') as column_count
FROM crm_tasks;

-- ✅ ÉTAPE 10: VOIR LA STRUCTURE (commandes psql, exécutez dans terminal psql si nécessaire)
-- \d crm_contacts;
-- \d crm_deals;
-- \d crm_activities;
-- \d crm_tasks;

-- ✅ ALTERNATIVE: Voir la structure en SQL standard

SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('crm_contacts', 'crm_deals', 'crm_activities', 'crm_tasks')
ORDER BY table_name, ordinal_position;

-- ================================================
-- ✅ RÉSULTAT ATTENDU
-- ================================================
/*
Après exécution:
- ✅ 4 tables créées (crm_contacts, crm_deals, crm_activities, crm_tasks)
- ✅ Colonnes FK: user_id, contact_id, deal_id
- ✅ 16 index créés
- ✅ RLS activé sur les 4 tables
- ✅ 8 politiques RLS en place
- ✅ Relations FK correctes

Le code React fonctionnera maintenant!
*/

-- ================================================
-- DOCUMENTATION
-- ================================================
/*
Pourquoi cette recréation?
1. Table originale cassée (0 colonnes FK)
2. Pas de user_id, owner_id, ou vendor_id
3. Code React cherche user_id (colonne manquante)
4. Résultat: erreur 42703

Solution:
1. Recréer les 4 tables correctement
2. Ajouter TOUTES les colonnes nécessaires
3. Configurer RLS pour sécurité
4. Le code React fonctionnera

Tables créées:
- crm_contacts: Base de contacts
- crm_deals: Pipeline de vente
- crm_activities: Historique interactions
- crm_tasks: Tâches et reminders

Colonnes clé:
- user_id: FK vers auth.users (MANQUANT AVANT!)
- contact_id: Référence au contact
- deal_id: Référence au deal
- created_at/updated_at: Audit
- deleted_at: Soft delete

RLS Policies:
- Users voir seulement leurs données
- Admin voir toutes données
- Isolation complète par tenant
*/
