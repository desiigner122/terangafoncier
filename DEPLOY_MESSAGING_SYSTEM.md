# Déploiement du Système de Messagerie

## Instructions pour exécuter le schéma dans Supabase

### Étape 1: Accéder à Supabase SQL Editor
1. Aller sur [app.supabase.com](https://app.supabase.com)
2. Sélectionner votre projet Teranga Foncier
3. Cliquer sur "SQL Editor" dans le menu latéral gauche
4. Cliquer sur "+ New Query"

### Étape 2: Copier et exécuter le fichier SQL
1. Ouvrir le fichier `CREATE_MESSAGING_SYSTEM.sql`
2. Copier tout le contenu
3. Coller dans l'éditeur SQL Supabase
4. Cliquer sur "Run" (le bouton bleu avec l'icône de lecture)

### Étape 3: Vérifier la création
Après exécution, vous devriez voir le message: **"Messaging system successfully created!"**

### Tables créées
- ✅ `purchase_case_messages` - Messages entre acheteur et vendeur
- ✅ `purchase_case_documents` - Documents du dossier
- ✅ Index de performance (8 au total)
- ✅ RLS Policies (6 au total pour sécurité)
- ✅ Triggers (2: update_at et case cascade)
- ✅ Views (purchase_case_messages_detailed)
- ✅ Functions (get_unread_messages_count)

### Colonnes ajoutées à purchase_cases
- `last_message_at` - Timestamp du dernier message
- `buyer_unread_count` - Nombre de messages non lus pour l'acheteur
- `seller_unread_count` - Nombre de messages non lus pour le vendeur

## Contenu du SQL

Le fichier `CREATE_MESSAGING_SYSTEM.sql` contient:

```
1. CREATE TABLE purchase_case_messages
   - id (UUID)
   - case_id (FK → purchase_cases)
   - sent_by (FK → auth.users)
   - message (TEXT)
   - attachments (JSONB)
   - read_at (TIMESTAMP)
   - created_at, updated_at (TIMESTAMP)

2. CREATE TABLE purchase_case_documents
   - id (UUID)
   - case_id (FK → purchase_cases)
   - uploaded_by (FK → auth.users)
   - document_type (VARCHAR)
   - file_url, file_name (TEXT)
   - status (VARCHAR: pending, approved, rejected, signed)
   - created_at, updated_at (TIMESTAMP)

3. Indexes pour performance
   - idx_case_messages_case_id
   - idx_case_messages_sent_by
   - idx_case_messages_created_at
   - idx_case_messages_read_at
   - idx_case_documents_case_id
   - idx_case_documents_type
   - idx_case_documents_status
   - idx_purchase_case_messages_case_created
   - idx_purchase_case_documents_case_type

4. RLS Policies (Row Level Security)
   - Users can view messages in their cases
   - Users can create messages in their cases
   - Users can update their message read status
   - Users can view documents in their cases
   - Users can upload documents in their cases

5. Triggers
   - update_purchase_case_messages_updated_at
   - case_updated_on_new_message (cascade update)

6. View
   - purchase_case_messages_detailed (avec sender info)

7. Function
   - get_unread_messages_count(user_id UUID)
```

## Prochaines étapes

### 1. Frontend - Realtime Subscriptions
Le composant `PurchaseCaseMessaging.jsx` est déjà configuré pour:
- ✅ Charger les messages existants
- ✅ S'abonner aux nouveaux messages en temps réel (Realtime)
- ✅ Marquer automatiquement les messages comme lus
- ✅ Afficher les documents du dossier
- ✅ Permettre l'envoi de nouveaux messages
- ✅ Afficher la date/heure de chaque message
- ✅ Identifier le rôle de l'expéditeur (acheteur/vendeur)

### 2. Vérifier l'intégration
Sur la page `/vendeur/cases/:caseNumber`:
- Une nouvelle tab "Messages" avec un icône de chat
- Clic sur la tab affiche le composant PurchaseCaseMessaging
- Les messages se chargent depuis la BD
- Les nouveaux messages apparaissent en temps réel

### 3. Tester le flux complet
1. Connectez-vous en tant que vendeur
2. Allez dans "Demandes d'achat"
3. Cliquez sur une demande acceptée
4. Cliquez sur la tab "Messages"
5. Envoyez un message test
6. Le message devrait apparaître instantanément
7. Basculez à l'acheteur et vérifiez qu'il voit le message en temps réel

### 4. Problèmes possibles

**Si les messages n'apparaissent pas:**
- Vérifier que les RLS policies permettent l'accès
- Vérifier que auth.uid() retourne l'ID utilisateur correct
- Vérifier dans la console Supabase que les messages sont insérés

**Si Realtime ne fonctionne pas:**
- Vérifier que Realtime est activé dans les settings Supabase
- Vérifier que le channel est souscrit correctement
- Vérifier que les messages ont un created_at valide

## SQL Debug Commands

Si vous avez besoin de tester:

```sql
-- Vérifier les messages créés
SELECT * FROM purchase_case_messages ORDER BY created_at DESC LIMIT 10;

-- Vérifier les documents
SELECT * FROM purchase_case_documents ORDER BY created_at DESC LIMIT 10;

-- Vérifier les messages avec info sender
SELECT * FROM purchase_case_messages_detailed ORDER BY created_at DESC LIMIT 10;

-- Compter les messages non lus par dossier
SELECT case_id, COUNT(*) FROM purchase_case_messages 
WHERE read_at IS NULL 
GROUP BY case_id;

-- Vérifier les RLS policies
SELECT * FROM pg_policies WHERE tablename IN ('purchase_case_messages', 'purchase_case_documents');

-- Vérifier les triggers
SELECT * FROM pg_trigger WHERE tgrelname IN ('purchase_case_messages', 'purchase_case_documents');
```

## Status des Implémentations

✅ **Complété:**
- Database schema (tables, indexes, RLS, triggers)
- React component (PurchaseCaseMessaging.jsx)
- Integration dans RefactoredVendeurCaseTracking
- Buyer/Seller profile loading
- Realtime subscription setup

⏳ **À faire:**
- Exécuter CREATE_MESSAGING_SYSTEM.sql dans Supabase
- Tester Realtime subscriptions
- Vérifier RLS policies
- Fix favorites system (3 items restants)

📋 **En attente de déploiement SQL:**
- Tables creation
- Policies activation
- Triggers registration
- View creation
- Index creation
