# 🗄️ GUIDE D'EXÉCUTION - TABLES SUPABASE MANQUANTES

## 📋 SCRIPTS SQL CRÉÉS

### ✅ 1. Support & Tickets (`create-support-tables.sql`)
**Tables créées**:
- `support_tickets` - Tickets de support des utilisateurs
- `support_responses` - Réponses dans les tickets
- `support_categories` - Catégories de tickets

**Fonctionnalités**:
- Génération automatique numéro ticket (TK-XXXXXX)
- Trigger first_response_at automatique
- Comptage temps de réponse
- RLS configuré (utilisateurs voient uniquement leurs tickets)
- 6 catégories pré-remplies

**Lignes**: ~450 lignes SQL

---

### ✅ 2. Messagerie Temps Réel (`create-messaging-tables.sql`)
**Tables créées**:
- `conversations` - Conversations vendeur/acheteur
- `messages` - Messages individuels
- `message_reactions` - Réactions emoji
- `conversation_participants` - Support multi-participants

**Fonctionnalités**:
- Compteurs unread automatiques (triggers)
- Support threading (reply_to_message_id)
- Fonction `mark_conversation_as_read()`
- Fonction `archive_conversation()`
- RLS configuré
- Optimisé pour Supabase Realtime

**Lignes**: ~650 lignes SQL

---

### ✅ 3. Services Digitaux (`create-digital-services-tables.sql`)
**Tables créées**:
- `digital_services` - Catalogue services
- `service_subscriptions` - Abonnements utilisateurs
- `service_usage` - Historique utilisation
- `service_invoices` - Facturation

**Fonctionnalités**:
- Plans tarifaires flexibles (JSONB)
- Vérification automatique limites usage (trigger)
- Génération numéro facture (INV-YYYY-XXXXXX)
- Fonction `create_subscription_invoice()`
- Fonction `renew_subscription()`
- 6 services pré-remplis (Signature, Visite 360°, OCR, etc.)

**Lignes**: ~850 lignes SQL

---

## 🚀 INSTRUCTIONS D'EXÉCUTION

### Méthode 1: Via Dashboard Supabase (Recommandé)

1. **Ouvrir Supabase Dashboard**
   - Aller sur https://supabase.com/dashboard
   - Sélectionner votre projet

2. **Ouvrir SQL Editor**
   - Menu latéral → "SQL Editor"
   - Ou raccourci: Ctrl+K puis taper "SQL"

3. **Exécuter les scripts dans l'ordre**

   **Script 1: Support**
   ```sql
   -- Copier/coller TOUT le contenu de: sql/create-support-tables.sql
   -- Cliquer sur "Run" (ou Ctrl+Enter)
   ```

   **Script 2: Messaging**
   ```sql
   -- Copier/coller TOUT le contenu de: sql/create-messaging-tables.sql
   -- Cliquer sur "Run" (ou Ctrl+Enter)
   ```

   **Script 3: Digital Services**
   ```sql
   -- Copier/coller TOUT le contenu de: sql/create-digital-services-tables.sql
   -- Cliquer sur "Run" (ou Ctrl+Enter)
   ```

4. **Vérifier l'exécution**
   - Vérifier les logs pour erreurs
   - Si succès: "Success. No rows returned"
   - Si erreur: Lire message et corriger

5. **Vérifier les tables créées**
   - Menu latéral → "Table Editor"
   - Vous devriez voir 13 nouvelles tables:
     * support_tickets
     * support_responses
     * support_categories
     * conversations
     * messages
     * message_reactions
     * conversation_participants
     * digital_services
     * service_subscriptions
     * service_usage
     * service_invoices

---

### Méthode 2: Via CLI Supabase

```bash
# 1. S'assurer que Supabase CLI est installé
supabase --version

# 2. Se connecter au projet
supabase link --project-ref YOUR_PROJECT_ID

# 3. Exécuter les scripts
supabase db push --file sql/create-support-tables.sql
supabase db push --file sql/create-messaging-tables.sql
supabase db push --file sql/create-digital-services-tables.sql

# 4. Vérifier les migrations
supabase db diff
```

---

### Méthode 3: Via psql (PostgreSQL CLI)

```bash
# 1. Récupérer la connection string depuis Supabase Dashboard
# Settings → Database → Connection string (Mode: Session)

# 2. Se connecter
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"

# 3. Exécuter les scripts
\i sql/create-support-tables.sql
\i sql/create-messaging-tables.sql
\i sql/create-digital-services-tables.sql

# 4. Lister les tables
\dt

# 5. Quitter
\q
```

---

## ✅ VÉRIFICATION POST-INSTALLATION

### 1. Vérifier les tables
```sql
-- Dashboard → SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_name IN (
    'support_tickets',
    'support_responses',
    'support_categories',
    'conversations',
    'messages',
    'message_reactions',
    'digital_services',
    'service_subscriptions',
    'service_usage',
    'service_invoices'
  )
ORDER BY table_name;
```

**Résultat attendu**: 10 lignes (10 tables principales)

---

### 2. Vérifier les données initiales

**Support Categories**:
```sql
SELECT name, slug, icon, color 
FROM support_categories 
ORDER BY display_order;
```
**Résultat attendu**: 6 catégories (Compte, Propriétés, Paiements, Technique, Fonctionnalités, Autre)

**Digital Services**:
```sql
SELECT name, slug, category, is_active 
FROM digital_services 
ORDER BY display_order;
```
**Résultat attendu**: 6 services (Signature, Visite 360°, OCR, Stockage, Marketing, Juridique)

---

### 3. Vérifier les RLS Policies

```sql
-- Vérifier que RLS est activé
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'support_tickets',
    'conversations',
    'messages',
    'service_subscriptions'
  );
```
**Résultat attendu**: Toutes les tables doivent avoir `rowsecurity = true`

---

### 4. Tester la création d'un ticket (optionnel)

```sql
-- Remplacer YOUR_USER_ID par votre auth.uid() réel
INSERT INTO support_tickets (
  user_id, 
  ticket_number, 
  subject, 
  type, 
  priority, 
  description
)
VALUES (
  'YOUR_USER_ID',
  generate_ticket_number(),
  'Test ticket',
  'question',
  'normal',
  'Ceci est un ticket de test'
)
RETURNING id, ticket_number, subject;
```

**Résultat attendu**: 1 ligne retournée avec ID, numéro TK-XXXXXX, et sujet

---

### 5. Tester la création d'un service (optionnel)

```sql
-- Vérifier qu'un service existe
SELECT id, name, slug, category 
FROM digital_services 
WHERE slug = 'signature-electronique';
```

**Résultat attendu**: 1 ligne avec service "Signature Électronique"

---

## 🔧 DÉPANNAGE

### Erreur: "relation already exists"
**Cause**: Tables déjà créées  
**Solution**: Supprimer les tables existantes ou modifier le script

```sql
-- Option 1: Supprimer toutes les tables (ATTENTION: perte de données)
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS support_responses CASCADE;
-- ... etc

-- Option 2: Modifier les scripts pour utiliser IF NOT EXISTS
-- (déjà fait dans nos scripts, donc erreur impossible normalement)
```

---

### Erreur: "permission denied"
**Cause**: Utilisateur sans permissions suffisantes  
**Solution**: Utiliser l'utilisateur `postgres` ou un admin

```sql
-- Vérifier vos permissions
SELECT current_user;

-- Si vous n'êtes pas postgres, demander à l'admin
```

---

### Erreur: "function update_updated_at_column() does not exist"
**Cause**: Fonction définie dans un script précédent non exécuté  
**Solution**: Exécuter les scripts dans l'ordre correct

```sql
-- Vérifier si la fonction existe
SELECT proname FROM pg_proc WHERE proname = 'update_updated_at_column';

-- Si vide, ré-exécuter le script qui la définit
-- (support-tables.sql contient cette fonction)
```

---

### Erreur: "could not open extension control file"
**Cause**: Extension PostgreSQL manquante (rare sur Supabase)  
**Solution**: Supabase inclut toutes les extensions nécessaires par défaut

---

## 📊 STATISTIQUES TABLES

### Tailles attendues (vide)
| Table | Lignes initiales | Taille ~  |
|-------|------------------|-----------|
| support_tickets | 0 | 0 KB |
| support_responses | 0 | 0 KB |
| support_categories | 6 | 8 KB |
| conversations | 0 | 0 KB |
| messages | 0 | 0 KB |
| digital_services | 6 | 16 KB |
| service_subscriptions | 0 | 0 KB |
| service_usage | 0 | 0 KB |
| **TOTAL** | **12** | **~24 KB** |

---

## 🔐 SÉCURITÉ

### RLS (Row Level Security) Configuré ✅
- ✅ Utilisateurs voient uniquement **leurs propres** tickets
- ✅ Utilisateurs voient uniquement **leurs propres** conversations
- ✅ Utilisateurs voient uniquement **leurs propres** messages
- ✅ Utilisateurs voient uniquement **leurs propres** abonnements
- ✅ Tout le monde peut voir les services **actifs** (catalogue)

### Triggers Configurés ✅
- ✅ `updated_at` mis à jour automatiquement
- ✅ `first_response_at` défini automatiquement (tickets)
- ✅ `unread_count_*` incrémenté automatiquement (messages)
- ✅ `usage_count` incrémenté automatiquement (services)
- ✅ Vérification `usage_limit` avant utilisation

---

## 📝 PROCHAINES ÉTAPES APRÈS INSTALLATION

### 1. ✅ Tester VendeurSupport.jsx
```bash
npm run dev
# Naviguer vers /vendeur/support
# Créer un ticket test
```

### 2. ✅ Tester VendeurMessagesRealData.jsx
```bash
# Naviguer vers /vendeur/messages
# La page ne devrait plus afficher de mock data
# (conversations vides au début, c'est normal)
```

### 3. ✅ Tester VendeurServicesDigitauxRealData.jsx
```bash
# Naviguer vers /vendeur/services
# Vous devriez voir 6 services affichés
# S'abonner à un service test
```

### 4. 🔴 Configurer Supabase Realtime (Messages)
```javascript
// Dans VendeurMessagesRealData.jsx
supabase
  .channel('messages')
  .on('postgres_changes', { 
    event: 'INSERT', 
    schema: 'public', 
    table: 'messages',
    filter: `conversation_id=eq.${conversationId}`
  }, handleNewMessage)
  .subscribe();
```

### 5. 🔴 Implémenter Paiements (Services Digitaux)
- Intégrer Wave Money API (prioritaire Sénégal)
- Créer Edge Function pour webhooks
- Tester abonnement payant

---

## 📞 SUPPORT

### Problèmes rencontrés?
1. Vérifier les logs SQL Editor
2. Vérifier les permissions utilisateur
3. Vérifier version PostgreSQL (Supabase = PostgreSQL 15+)
4. Consulter documentation Supabase: https://supabase.com/docs

### Besoin d'aide?
- Documentation Supabase: https://supabase.com/docs
- Discord Supabase: https://discord.supabase.com
- Stack Overflow: tag `supabase`

---

## ✅ CHECKLIST FINALE

Avant de passer aux corrections suivantes, vérifier:

- [ ] ✅ 3 scripts SQL créés
- [ ] ✅ 10 tables créées dans Supabase
- [ ] ✅ 6 support_categories insérées
- [ ] ✅ 6 digital_services insérés
- [ ] ✅ RLS activé sur toutes les tables
- [ ] ✅ Triggers fonctionnels
- [ ] ✅ Fonctions utilitaires créées
- [ ] ✅ VendeurSupport testé (création ticket OK)
- [ ] ✅ VendeurMessages testé (plus de mock data)
- [ ] ✅ VendeurServicesDigitaux testé (services affichés)

**Une fois cette checklist complète → Passer à la Phase 2: Débugger route edit-property**

---

**Fichier créé le**: 2025-10-07  
**Par**: AI Assistant Copilot  
**Pour**: Teranga Foncier - Corrections Urgentes
