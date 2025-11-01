# 🔧 Guide d'Application des Migrations Paiement

## ❌ Erreur Rencontrée
```
ERROR: 42703: column "payer_id" does not exist
```

## 🔍 Diagnostic
Cette erreur survient car les migrations SQL n'ont pas été appliquées dans Supabase dans le bon ordre. La table `payment_transactions` tente de référencer `notary_payment_requests.payer_id` avant que cette table ne soit créée.

## ✅ Solution : Appliquer les Migrations dans l'Ordre

### Étape 1 : Connexion à Supabase

1. **Ouvrir Supabase Studio**
   - Aller sur https://app.supabase.com
   - Sélectionner votre projet **terangafoncier**

2. **Ouvrir l'éditeur SQL**
   - Menu latéral : **SQL Editor**
   - Cliquer sur **+ New Query**

### Étape 2 : Migration 1 - Système Notaire

**Fichier** : `create_notary_payment_system.sql`

```sql
-- Copier-coller TOUT le contenu du fichier
-- migrations/create_notary_payment_system.sql
```

**Contenu** :
- Table `notary_payment_requests` (14 colonnes dont `payer_id`)
- Indexes (5)
- Trigger `update_notary_payment_request_timestamp`
- RLS Policies (4)
- Vue `notary_payments_summary`
- Fonction `create_notary_payment_request()`

**Exécuter** :
1. Coller le contenu dans l'éditeur SQL
2. Cliquer sur **Run** (ou `Ctrl+Enter`)
3. Vérifier : **Success. No rows returned**

**Vérification** :
```sql
-- Vérifier que la table existe
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'notary_payment_requests'
ORDER BY ordinal_position;

-- Devrait retourner 26 colonnes dont payer_id
```

### Étape 3 : Migration 2 - Transactions Paiement

**Fichier** : `create_payment_transactions_table.sql`

```sql
-- Copier-coller TOUT le contenu du fichier
-- migrations/create_payment_transactions_table.sql
```

**Contenu** :
- Table `payment_transactions` (15 colonnes)
- Indexes (6)
- RLS Policies (4)
- Trigger `update_payment_transaction_updated_at`
- Fonction `mark_transaction_as_paid()`
- Fonction `mark_transaction_as_failed()`
- Vue `payment_statistics`

**Exécuter** :
1. Coller le contenu dans l'éditeur SQL
2. Cliquer sur **Run**
3. Vérifier : **Success. No rows returned**

**Vérification** :
```sql
-- Vérifier que la table existe
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'payment_transactions'
ORDER BY ordinal_position;

-- Vérifier la référence à notary_payment_requests
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'payment_transactions'
  AND tc.constraint_type = 'FOREIGN KEY';

-- Devrait afficher notary_request_id → notary_payment_requests(id)
```

### Étape 4 : Vérifications Finales

```sql
-- 1. Vérifier que toutes les tables existent
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('notary_payment_requests', 'payment_transactions')
ORDER BY table_name;

-- 2. Vérifier les RLS policies
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('notary_payment_requests', 'payment_transactions')
ORDER BY tablename, policyname;

-- 3. Vérifier les fonctions
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'create_notary_payment_request',
    'mark_transaction_as_paid',
    'mark_transaction_as_failed'
  )
ORDER BY routine_name;

-- 4. Vérifier les vues
SELECT table_name
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name IN ('notary_payments_summary', 'payment_statistics')
ORDER BY table_name;
```

**Résultats Attendus** :
- ✅ 2 tables créées
- ✅ 8 policies RLS créées (4 par table)
- ✅ 3 fonctions créées
- ✅ 2 vues créées
- ✅ 11 indexes créés

### Étape 5 : Tester en Frontend

Une fois les migrations appliquées, tester :

1. **Connexion Notaire**
   ```
   npm run dev
   → Ouvrir http://localhost:5173
   → Se connecter comme notaire
   ```

2. **Créer Demande Paiement**
   ```
   → Ouvrir un dossier en statut "deposit_payment"
   → Cliquer "Demander versement des arrhes"
   → Vérifier : Modal s'ouvre avec calcul auto
   → Soumettre
   ```

3. **Vérifier en Base**
   ```sql
   SELECT * FROM notary_payment_requests 
   ORDER BY created_at DESC 
   LIMIT 1;
   
   -- Devrait afficher la demande créée avec payer_id rempli
   ```

4. **Connexion Buyer**
   ```
   → Se connecter comme acheteur
   → Ouvrir même dossier
   → Vérifier : Alerte rouge avec demande de paiement visible
   ```

5. **Initier Paiement**
   ```
   → Cliquer "Procéder au paiement"
   → Sélectionner "Wave"
   → Confirmer
   → Vérifier : Row créée dans payment_transactions
   ```

6. **Vérifier Transaction**
   ```sql
   SELECT * FROM payment_transactions 
   ORDER BY created_at DESC 
   LIMIT 1;
   
   -- Devrait afficher :
   -- - notary_request_id (FK vers notary_payment_requests)
   -- - status = 'pending'
   -- - payment_method = 'wave'
   ```

## 🚨 Troubleshooting

### Erreur : "relation notary_payment_requests does not exist"
**Solution** : Exécuter d'abord `create_notary_payment_system.sql`

### Erreur : "column payer_id does not exist"
**Solution** : 
1. Vérifier que Migration 1 est bien appliquée
2. Vérifier la structure :
   ```sql
   \d notary_payment_requests
   ```
3. Si la colonne manque, ré-exécuter Migration 1

### Erreur : "permission denied for table"
**Solution** : Vérifier les RLS policies :
```sql
-- Désactiver temporairement RLS pour tester
ALTER TABLE notary_payment_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions DISABLE ROW LEVEL SECURITY;

-- Tester création
-- ...

-- Réactiver RLS
ALTER TABLE notary_payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
```

### Erreur : "function does not exist"
**Solution** : Ré-exécuter la partie FONCTIONS de la migration concernée

## 📊 Ordre Chronologique Complet

1. ✅ **Migration 1** : `create_notary_payment_system.sql`
   - Crée `notary_payment_requests` avec `payer_id`
   - Crée fonction `create_notary_payment_request()`

2. ✅ **Migration 2** : `create_payment_transactions_table.sql`
   - Crée `payment_transactions` avec FK vers `notary_payment_requests`
   - Crée fonctions `mark_transaction_as_paid()` et `mark_transaction_as_failed()`

3. ✅ **Frontend** : Services et composants
   - `NotaryFeesCalculator.js` utilise `notary_payment_requests`
   - `PaymentGatewayService.js` utilise `payment_transactions`

## ✅ Checklist Post-Migration

- [ ] Migration 1 exécutée sans erreur
- [ ] Migration 2 exécutée sans erreur
- [ ] 2 tables visibles dans Supabase Table Editor
- [ ] RLS activé sur les 2 tables
- [ ] 8 policies créées (4 par table)
- [ ] 3 fonctions créées
- [ ] 2 vues créées
- [ ] Frontend peut créer demandes de paiement
- [ ] Frontend peut initier transactions
- [ ] Aucune erreur console

---

**Temps Estimé** : 10-15 minutes  
**Prérequis** : Accès admin Supabase  
**Risques** : Aucun (migrations idempotentes avec IF NOT EXISTS)

