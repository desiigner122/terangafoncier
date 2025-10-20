# Guide Détaillé - Déployer le Système de Messagerie

## PROBLÈME IDENTIFIÉ

L'erreur `ERROR: 42703: column "sent_by" does not exist` indique que la table `purchase_case_messages` n'a pas été créée correctement ou qu'il y a une issue avec l'ordre d'exécution du SQL.

## SOLUTION - Déployer par étapes

### ÉTAPE 1: Vérifier les tables existantes

Exécuter dans Supabase SQL Editor:

```sql
-- Vérifier la structure de purchase_cases
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'purchase_cases' 
ORDER BY ordinal_position;
```

**Résultat attendu:** Vous devriez voir les colonnes: id, buyer_id, seller_id, etc.

---

### ÉTAPE 2: Vérifier auth.users

```sql
-- Vérifier si auth.users est accessible
SELECT COUNT(*) as user_count FROM auth.users LIMIT 1;
```

**Résultat attendu:** Un nombre > 0

---

### ÉTAPE 3: Créer la table de messages (SIMPLE)

Si les étapes 1-2 passent, exécuter:

```sql
-- Créer la table purchase_case_messages
CREATE TABLE IF NOT EXISTS purchase_case_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
  sent_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  attachments JSONB DEFAULT NULL,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Vérifier que la table est créée
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'purchase_case_messages' 
ORDER BY ordinal_position;
```

**Résultat attendu:** Vous verrez les colonnes: id, case_id, sent_by, message, attachments, read_at, created_at, updated_at

---

### ÉTAPE 4: Créer la table des documents

```sql
-- Créer la table purchase_case_documents
CREATE TABLE IF NOT EXISTS purchase_case_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Vérifier que la table est créée
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'purchase_case_documents' 
ORDER BY ordinal_position;
```

---

### ÉTAPE 5: Créer les indexes

```sql
-- Indexes pour purchase_case_messages
CREATE INDEX idx_case_messages_case_id ON purchase_case_messages(case_id);
CREATE INDEX idx_case_messages_sent_by ON purchase_case_messages(sent_by);
CREATE INDEX idx_case_messages_created_at ON purchase_case_messages(created_at);
CREATE INDEX idx_case_messages_read_at ON purchase_case_messages(read_at);
CREATE INDEX idx_purchase_case_messages_case_created ON purchase_case_messages(case_id, created_at DESC);

-- Indexes pour purchase_case_documents
CREATE INDEX idx_case_documents_case_id ON purchase_case_documents(case_id);
CREATE INDEX idx_case_documents_type ON purchase_case_documents(document_type);
CREATE INDEX idx_case_documents_status ON purchase_case_documents(status);
CREATE INDEX idx_purchase_case_documents_case_type ON purchase_case_documents(case_id, document_type);
```

---

### ÉTAPE 6: Activer RLS et créer les policies

```sql
-- Activer RLS sur les deux tables
ALTER TABLE purchase_case_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_case_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour purchase_case_messages
CREATE POLICY "Users can view messages in their cases" ON purchase_case_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = purchase_case_messages.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
    )
  );

CREATE POLICY "Users can create messages in their cases" ON purchase_case_messages
  FOR INSERT WITH CHECK (
    sent_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = purchase_case_messages.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
    )
  );

CREATE POLICY "Users can update their message read status" ON purchase_case_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = purchase_case_messages.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = purchase_case_messages.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
    )
  );

-- RLS Policies pour purchase_case_documents
CREATE POLICY "Users can view documents in their cases" ON purchase_case_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = purchase_case_documents.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
    )
  );

CREATE POLICY "Users can upload documents in their cases" ON purchase_case_documents
  FOR INSERT WITH CHECK (
    uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = purchase_case_documents.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
    )
  );
```

---

### ÉTAPE 7: Créer les triggers

```sql
-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_purchase_case_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER purchase_case_messages_updated_at_trigger
  BEFORE UPDATE ON purchase_case_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_purchase_case_messages_updated_at();

-- Trigger pour mettre à jour purchase_cases.updated_at quand un message est ajouté
CREATE OR REPLACE FUNCTION update_case_on_new_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE purchase_cases
  SET updated_at = now()
  WHERE id = NEW.case_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER case_updated_on_new_message_trigger
  AFTER INSERT ON purchase_case_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_case_on_new_message();
```

---

### ÉTAPE 8: Créer la view et la fonction

```sql
-- View pour obtenir les messages avec info sender
CREATE OR REPLACE VIEW purchase_case_messages_detailed AS
SELECT 
  pcm.*,
  p.email as sender_email,
  p.first_name as sender_first_name,
  p.last_name as sender_last_name,
  (
    SELECT CASE 
      WHEN pc.buyer_id = pcm.sent_by THEN 'buyer'
      WHEN pc.seller_id = pcm.sent_by THEN 'seller'
      ELSE 'unknown'
    END
    FROM purchase_cases pc
    WHERE pc.id = pcm.case_id
  ) as sender_role
FROM purchase_case_messages pcm
LEFT JOIN profiles p ON p.id = pcm.sent_by;

-- Fonction pour récupérer les messages non lus
CREATE OR REPLACE FUNCTION get_unread_messages_count(user_id UUID)
RETURNS TABLE(case_id UUID, unread_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pcm.case_id,
    COUNT(*) as unread_count
  FROM purchase_case_messages pcm
  WHERE pcm.read_at IS NULL
    AND pcm.sent_by != user_id
    AND EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = pcm.case_id
      AND (pc.buyer_id = user_id OR pc.seller_id = user_id)
    )
  GROUP BY pcm.case_id;
END;
$$ LANGUAGE plpgsql;
```

---

### ÉTAPE 9: Ajouter les colonnes manquantes à purchase_cases

```sql
-- Ajouter les colonnes si elles n'existent pas
ALTER TABLE purchase_cases ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE purchase_cases ADD COLUMN IF NOT EXISTS buyer_unread_count INTEGER DEFAULT 0;
ALTER TABLE purchase_cases ADD COLUMN IF NOT EXISTS seller_unread_count INTEGER DEFAULT 0;

-- Vérifier que les colonnes sont ajoutées
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'purchase_cases' 
AND column_name IN ('last_message_at', 'buyer_unread_count', 'seller_unread_count')
ORDER BY ordinal_position;
```

---

## RECOMMANDATION

✅ **À faire en priorité:**

1. Exécuter ÉTAPE 1-2 pour vérifier les tables existantes
2. Si OK, exécuter ÉTAPE 3 seule et tester
3. Si la table se crée, continuer avec ÉTAPE 4-9 une à une
4. Après chaque étape majeure, vérifier le succès avant de continuer

❌ **À ÉVITER:**

- N'exécuter pas le fichier CREATE_MESSAGING_SYSTEM.sql complet d'un coup
- Si une étape échoue, debug d'abord avant de continuer

## DEBUGGING

Si une étape échoue:

```sql
-- Voir l'erreur détaillée
SELECT * FROM pg_stat_statements WHERE query LIKE '%purchase_case_messages%';

-- Vérifier les tables existantes
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'purchase%'
ORDER BY table_name;

-- Vérifier les erreurs RLS
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check 
FROM pg_policies 
WHERE tablename LIKE 'purchase_case%';
```

## STATUT

- ✅ Composant React: Créé et intégré
- ✅ Structure SQL: Préparée
- ⏳ Déploiement SQL: En attente d'exécution manuelle par étapes
- ⏳ Test Realtime: En attente
