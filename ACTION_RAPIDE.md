# 🚨 ACTION RAPIDE - Résoudre les problèmes

## ❌ PROBLÈME 1 : Erreur SQL "column roles does not exist"

**Solution** : Le fichier SQL a été corrigé. La colonne s'appelle `role` (singulier), pas `roles`.

### ✅ ÉTAPES :

1. **Ouvrez Supabase** : https://app.supabase.com
2. **Allez dans SQL Editor** > New query
3. **Copiez TOUT le contenu** de `create-workflow-tables.sql` (déjà corrigé)
4. **Cliquez sur Run** (F5)
5. **Vérifiez** : Vous devriez voir "✅ Tables workflow créées avec succès !"

---

## ❌ PROBLÈME 2 : La demande n'apparaît pas dans "Mes achats"

**Causes possibles** :
1. Le `seller_id` n'est pas rempli dans la transaction
2. Le `transaction_type` n'est pas 'purchase', 'request' ou 'offer'
3. Le `status` empêche l'affichage

### 🔍 DIAGNOSTIC :

1. **Dans Supabase SQL Editor**, exécutez :
```sql
-- Copier-coller le contenu de diagnostic-transaction-invisible.sql
```

2. **Regardez les résultats** et identifiez :
   - ✅ La transaction apparaît-elle dans "TRANSACTIONS POUR HERITAGE (ACHETEUR)" ?
   - ✅ Quel est son `transaction_type` ?
   - ✅ Le `seller_id` est-il NULL ou différent de celui de la parcelle ?

### 🔧 SOLUTION RAPIDE :

**Si le seller_id est NULL ou incorrect :**

1. **Dans Supabase SQL Editor**, exécutez :
```sql
-- Copier-coller le contenu de fix-seller-id.sql
```

2. Ce script va :
   - ✅ Copier le `seller_id` depuis la parcelle
   - ✅ Corriger toutes les transactions concernées
   - ✅ Afficher le nombre de corrections

3. **Rafraîchissez l'application** (F5)

### 🎯 VÉRIFICATION MANUELLE :

Si la transaction n'apparaît toujours pas :

```sql
-- 1. Trouver l'ID de la transaction créée
SELECT id, transaction_type, status, seller_id, buyer_id, parcel_id
FROM transactions
WHERE buyer_id = '06125976-5ea1-403a-b09e-aebbe1311111'
ORDER BY created_at DESC
LIMIT 1;

-- 2. Corriger manuellement si nécessaire
UPDATE transactions
SET 
  seller_id = (SELECT seller_id FROM parcels WHERE id = transactions.parcel_id),
  transaction_type = 'request'  -- ou 'purchase' ou 'offer'
WHERE id = 'METTRE_ID_ICI';
```

---

## 📊 OÙ VOIR LA DEMANDE ?

La demande devrait apparaître dans **DEUX endroits** :

### 1️⃣ Pour Heritage (ACHETEUR) :
- **Page** : Dashboard Particulier > Mes Achats
- **Route** : `/particulier/mes-achats` ou `/acheteur/mes-achats`
- **Fichier** : `src/pages/dashboards/particulier/MesAchats.jsx`

### 2️⃣ Pour le VENDEUR de la parcelle :
- **Page** : Dashboard Vendeur > Demandes d'achat
- **Route** : `/vendeur/purchase-requests`
- **Fichier** : `src/pages/dashboards/vendeur/VendeurPurchaseRequests.jsx`

---

## 🎯 CHECKLIST COMPLÈTE

- [ ] 1. Créer les tables workflow dans Supabase (`create-workflow-tables.sql`)
- [ ] 2. Exécuter le diagnostic (`diagnostic-transaction-invisible.sql`)
- [ ] 3. Corriger les seller_id si nécessaire (`fix-seller-id.sql`)
- [ ] 4. Vérifier que `transaction_type` est 'purchase', 'request' ou 'offer'
- [ ] 5. Rafraîchir l'application (F5)
- [ ] 6. Vérifier dans "Mes Achats" (acheteur)
- [ ] 7. Vérifier dans "Demandes d'achat" (vendeur)

---

## 📝 EXEMPLE DE TRANSACTION CORRECTE

```json
{
  "id": "uuid",
  "buyer_id": "06125976-5ea1-403a-b09e-aebbe1311111",  // Heritage (acheteur)
  "seller_id": "uuid-du-vendeur",                       // Vendeur de la parcelle
  "parcel_id": "uuid-de-la-parcelle",
  "transaction_type": "request",                        // ou "purchase" ou "offer"
  "status": "pending",                                  // ou "processing", "completed"
  "amount": 50000000,
  "payment_method": "cash",
  "created_at": "2025-10-16T..."
}
```

---

## 🆘 SI ÇA NE MARCHE TOUJOURS PAS

1. **Copiez les résultats** de `diagnostic-transaction-invisible.sql`
2. **Vérifiez les logs console** du navigateur (F12)
3. **Cherchez** :
   - `📊 [VENDEUR] Transactions brutes:` (pour vendeur)
   - `🔍 [ACHETEUR] Chargement transactions:` (pour acheteur)
4. **Partagez** les erreurs trouvées

---

## ✅ TOUT EST PRÊT !

Une fois les scripts exécutés :
- ✅ Les tables workflow existent
- ✅ Les seller_id sont corrects
- ✅ Les boutons Accepter/Refuser/Négocier fonctionnent
- ✅ Le système crée des dossiers avec workflow complet
- ✅ L'historique est enregistré
- ✅ Les notifications sont envoyées

**Prêt à tester !** 🚀
