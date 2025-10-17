# 📋 ÉTAPES DE CORRECTION SQL - À EXÉCUTER MAINTENANT

## 🎯 Objectif
Corriger les transactions existantes qui manquent de `parcel_id`, `seller_id`, `buyer_id`, et `transaction_type`.

---

## ⚡ ACTIONS IMMÉDIATES

### Étape 1: Ouvrir Supabase SQL Editor
1. Aller sur https://supabase.com/dashboard
2. Sélectionner votre projet Teranga Foncier
3. Cliquer sur "SQL Editor" dans le menu de gauche
4. Cliquer "New Query"

---

### Étape 2: Diagnostic - Identifier les Transactions Incomplètes

**Copier et exécuter ce code**:

```sql
-- Voir combien de transactions sont incomplètes
SELECT 
  COUNT(*) as total_incomplete
FROM transactions t
WHERE 
  t.transaction_type IS NULL 
  OR t.buyer_id IS NULL 
  OR t.seller_id IS NULL 
  OR t.parcel_id IS NULL;
```

**Résultat attendu**: Un nombre (ex: 5, 10, 20 transactions incomplètes)

---

### Étape 3: Voir les Détails des Transactions à Corriger

**Copier et exécuter ce code**:

```sql
-- Voir les détails des transactions incomplètes
SELECT 
  t.id,
  t.user_id,
  t.request_id,
  t.transaction_type,
  t.buyer_id,
  t.seller_id,
  t.parcel_id,
  t.status,
  t.amount,
  t.description,
  t.created_at,
  r.parcel_id as request_parcel_id,
  r.user_id as request_user_id,
  p.seller_id as parcel_seller_id
FROM transactions t
LEFT JOIN requests r ON t.request_id = r.id
LEFT JOIN parcels p ON r.parcel_id = p.id
WHERE 
  t.transaction_type IS NULL 
  OR t.buyer_id IS NULL 
  OR t.seller_id IS NULL 
  OR t.parcel_id IS NULL
ORDER BY t.created_at DESC;
```

**Vérifier**: 
- ✅ `request_parcel_id` a une valeur → On peut copier dans `parcel_id`
- ✅ `request_user_id` a une valeur → On peut copier dans `buyer_id`
- ✅ `parcel_seller_id` a une valeur → On peut copier dans `seller_id`

---

### Étape 4: 🚨 CORRECTION - Appliquer le Fix

**⚠️ ATTENTION**: Cette requête va **MODIFIER** les transactions existantes. Assurez-vous d'avoir vérifié l'Étape 3 avant de continuer.

**Copier et exécuter ce code**:

```sql
-- Appliquer la correction
UPDATE transactions SET
  transaction_type = COALESCE(transaction_type, 'purchase'),
  buyer_id = COALESCE(buyer_id, r.user_id),
  seller_id = COALESCE(seller_id, p.seller_id),
  parcel_id = COALESCE(parcel_id, r.parcel_id)
FROM requests r
JOIN parcels p ON r.parcel_id = p.id
WHERE 
  transactions.request_id = r.id
  AND (
    transactions.transaction_type IS NULL 
    OR transactions.buyer_id IS NULL 
    OR transactions.seller_id IS NULL 
    OR transactions.parcel_id IS NULL
  );
```

**Résultat attendu**: 
```
UPDATE X
```
Où X = le nombre de transactions corrigées (devrait être égal au nombre de l'Étape 2)

---

### Étape 5: Vérification - Confirmer que Tout est Corrigé

**Copier et exécuter ce code**:

```sql
-- Vérifier que toutes les transactions sont maintenant complètes
SELECT 
  COUNT(*) as total_transactions,
  COUNT(CASE WHEN transaction_type IS NOT NULL THEN 1 END) as with_type,
  COUNT(CASE WHEN buyer_id IS NOT NULL THEN 1 END) as with_buyer,
  COUNT(CASE WHEN seller_id IS NOT NULL THEN 1 END) as with_seller,
  COUNT(CASE WHEN parcel_id IS NOT NULL THEN 1 END) as with_parcel,
  COUNT(CASE 
    WHEN transaction_type IS NOT NULL 
    AND buyer_id IS NOT NULL 
    AND seller_id IS NOT NULL 
    AND parcel_id IS NOT NULL 
    THEN 1 
  END) as complete_transactions
FROM transactions;
```

**Résultat attendu**:
```
total_transactions = complete_transactions
```

**Exemple**:
```
total_transactions: 25
with_type: 25
with_buyer: 25
with_seller: 25
with_parcel: 25
complete_transactions: 25  ✅ PARFAIT!
```

---

### Étape 6: Vérifier les Transactions d'Heritage (Vendeur)

**Copier et exécuter ce code**:

```sql
-- Voir toutes les transactions où Heritage est le vendeur
SELECT 
  t.id,
  t.transaction_type,
  t.buyer_id,
  t.seller_id,
  t.parcel_id,
  t.status,
  t.amount,
  t.description,
  t.created_at,
  p.title as parcel_title,
  p.location as parcel_location
FROM transactions t
LEFT JOIN parcels p ON t.parcel_id = p.id
WHERE t.seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'
ORDER BY t.created_at DESC;
```

**Résultat attendu**: Vous devriez voir **toutes** les demandes d'achat, y compris les nouvelles qui étaient invisibles avant.

---

### Étape 7: Test Final - Dashboard Vendeur

1. **Se connecter** avec le compte vendeur:
   - Email: `heritage.fall@teranga-foncier.sn`
   - Mot de passe: [votre mot de passe]

2. **Naviguer** vers le Dashboard Vendeur → Section "Demandes d'Achat"

3. **Vérifier**:
   - ✅ Toutes les demandes apparaissent maintenant
   - ✅ Les nouvelles demandes créées aujourd'hui sont visibles
   - ✅ Les boutons (Accepter, Refuser, Négocier) fonctionnent
   - ✅ Le statut s'affiche correctement (En attente, Accepté, Refusé, etc.)

---

## 🎉 RÉSULTAT ATTENDU

### Avant la Correction
- ❌ Transactions incomplètes: X (nombre > 0)
- ❌ Demandes invisibles dans le dashboard vendeur
- ❌ Workflow non fonctionnel

### Après la Correction
- ✅ Transactions incomplètes: 0
- ✅ Toutes les demandes visibles dans le dashboard vendeur
- ✅ Workflow complet opérationnel:
  - Accepter → Crée un dossier `purchase_case` avec numéro `TF-YYYYMMDD-XXXX`
  - Refuser → Met à jour le statut à `seller_declined`
  - Négocier → Ouvre le processus de négociation
  - Détails → Affiche toutes les informations
  - Contacter → Affiche email et téléphone de l'acheteur

---

## 🐛 En Cas de Problème

### Problème 1: "UPDATE 0" (Aucune transaction corrigée)
**Cause**: Pas de transactions incomplètes OU les transactions n'ont pas de `request_id`

**Solution**: 
1. Vérifier l'Étape 2 (diagnostic) → Si 0, c'est normal
2. Si > 0, vérifier que les transactions ont un `request_id` valide

---

### Problème 2: Les demandes ne s'affichent toujours pas
**Vérifier**:
1. Le `parcel_id` de la transaction correspond bien à une parcelle du vendeur
2. Le `transaction_type` est bien 'purchase', 'request', ou 'offer'
3. La parcelle appartient bien au vendeur (vérifier `parcels.seller_id`)

**Debug SQL**:
```sql
-- Vérifier les parcelles du vendeur Heritage
SELECT id, title, location, seller_id 
FROM parcels 
WHERE seller_id = '06125976-5ea1-403a-b09e-aebbe1311111';

-- Vérifier si les transactions pointent vers ces parcelles
SELECT t.id, t.parcel_id, p.title, p.seller_id
FROM transactions t
LEFT JOIN parcels p ON t.parcel_id = p.id
WHERE t.seller_id = '06125976-5ea1-403a-b09e-aebbe1311111';
```

---

### Problème 3: Erreur "permission denied"
**Cause**: RLS (Row Level Security) bloque l'UPDATE

**Solution**: Vous devez être connecté en tant qu'admin dans Supabase SQL Editor (c'est normalement le cas par défaut)

---

## 📞 Support

Si vous rencontrez un problème:
1. Copier le message d'erreur complet
2. Copier le résultat de l'Étape 3 (détails des transactions)
3. Me contacter avec ces informations

---

**Status**: ⏳ En Attente d'Exécution SQL  
**Priorité**: 🔴 HAUTE - À exécuter dès que possible  
**Durée Estimée**: 5 minutes

---

## ✅ Checklist

- [ ] Étape 1: Ouvrir Supabase SQL Editor
- [ ] Étape 2: Exécuter diagnostic (COUNT)
- [ ] Étape 3: Voir détails des transactions incomplètes
- [ ] Étape 4: Exécuter UPDATE pour correction
- [ ] Étape 5: Vérifier que tout est corrigé (complete_transactions = total_transactions)
- [ ] Étape 6: Voir les transactions d'Heritage
- [ ] Étape 7: Tester dans le Dashboard Vendeur
- [ ] Étape 8: Créer une nouvelle demande d'achat pour tester le nouveau code
- [ ] Étape 9: Vérifier que la nouvelle demande apparaît immédiatement
- [ ] Étape 10: Tester les boutons (Accepter, Refuser, Négocier)

---

**Une fois toutes les étapes complétées, le problème sera 100% résolu! 🎉**
