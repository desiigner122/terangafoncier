# 🚀 GUIDE RAPIDE - CORRECTION ET TEST

## ⚡ ACTION IMMÉDIATE (2 minutes)

### ÉTAPE 1: Exécuter le diagnostic complet dans Supabase

1. **Ouvrez Supabase**: https://app.supabase.com
2. **SQL Editor** > **New query**
3. **Copiez tout** le fichier `diagnose-and-fix-all.sql`
4. **Cliquez sur Run** (F5)

✅ **Ce script va**:
- Afficher toutes vos transactions
- Corriger automatiquement les `seller_id` manquants
- Vérifier que tout est bon
- Vous donner un résumé complet

### ÉTAPE 2: Créer les tables workflow (si pas déjà fait)

1. **SQL Editor** > **New query**
2. **Copiez tout** le fichier `create-workflow-tables.sql`
3. **Cliquez sur Run** (F5)

⚠️ **Si erreur "table already exists"**: C'est normal, ignorez et passez à l'étape 3

### ÉTAPE 3: Rafraîchir l'application

1. **Retournez sur votre application**: http://localhost:5173
2. **Appuyez sur F5** pour rafraîchir
3. **Allez sur**: Dashboard Vendeur > **Demandes d'achat**

## 🎯 QUE DEVRIEZ-VOUS VOIR ?

### Sur la page "Demandes d'achat" :

```
┌─────────────────────────────────────┐
│  📋 Demandes d'achat                │
├─────────────────────────────────────┤
│                                     │
│  [Toutes] [En attente] [Complétées]│
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🏠 Terrain Pikine             │   │
│  │ 💰 45,000,000 FCFA            │   │
│  │ 👤 Amadou Diop                │   │
│  │ 📅 Il y a 2 heures            │   │
│  │                               │   │
│  │ [Accepter] [Négocier] [Refuser]│
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

## 🔍 SI VOUS NE VOYEZ TOUJOURS RIEN

### Vérifiez dans Supabase :

**Table Editor** > **transactions** :

Cherchez les colonnes :
- ✅ `transaction_type` doit être : **'purchase'**, **'request'** OU **'offer'**
- ✅ `seller_id` doit être rempli (pas NULL)
- ✅ `parcel_id` doit correspondre à une parcelle de Heritage

### Si une transaction a un autre type (ex: 'sale', 'buy', etc)

**Mettez à jour dans SQL Editor**:

```sql
UPDATE transactions
SET transaction_type = 'purchase'
WHERE id = 'VOTRE_ID_TRANSACTION';
```

## 🧪 TESTER LES BOUTONS

### 1. Cliquez sur "Accepter l'offre"

**Ce qui doit se passer**:
```
✅ Toast: "Offre acceptée ! Dossier d'achat créé avec succès"
✅ Toast: "Le workflow d'achat est lancé ! Numéro: TF-20251016-0001"
✅ La demande passe de "En attente" à "Complétées"
```

**Vérifiez dans Supabase**:
- **Table `purchase_cases`** : Un nouveau dossier créé
- **Table `purchase_case_history`** : Historique du workflow
- **Table `transactions`** : `status` = 'accepted'

### 2. Cliquez sur "Refuser"

**Ce qui doit se passer**:
```
✅ Toast: "Offre refusée avec succès"
✅ La demande disparaît de "En attente"
```

### 3. Cliquez sur "Négocier"

**Ce qui doit se passer**:
```
✅ Toast: "Négociation ouverte ! Fonctionnalité complète à venir"
✅ Un dossier workflow est créé en mode négociation
```

## 📊 VÉRIFIER QUE LE WORKFLOW FONCTIONNE

Après avoir cliqué sur "Accepter" :

**Dans Supabase** > **Table Editor** > **purchase_cases** :

Vous devriez voir :
```
case_number: TF-20251016-0001
status: initiated (puis change automatiquement)
phase: 1
buyer_id: [ID de l'acheteur]
seller_id: 06125976-5ea1-403a-b09e-aebbe1311111
```

**Regardez la console du navigateur** (F12) :
```
📋 Dossier workflow créé: TF-20251016-0001
🔗 Dossier enregistré sur blockchain Teranga
🔄 Changement statut: initiated → buyer_verification
```

## ❓ PROBLÈMES COURANTS

### "Aucune demande ne s'affiche"

1. **Exécutez** `diagnose-and-fix-all.sql` dans Supabase
2. **Regardez** le résultat de "ÉTAPE 4: DIAGNOSTIC DASHBOARD VENDEUR"
3. **Vérifiez** que le `transaction_type` est correct

### "Erreur lors de l'acceptation"

1. **Console du navigateur** (F12) : Cherchez l'erreur `❌`
2. **Vérifiez** que les tables workflow sont créées
3. **Ré-exécutez** `create-workflow-tables.sql`

### "Les boutons ne font rien"

1. **Ctrl+Shift+R** pour vider le cache
2. **Vérifiez** la console pour les erreurs
3. **Assurez-vous** que le code est sauvegardé

## 🎉 TOUT FONCTIONNE ?

Prochaines étapes:
1. ✅ Tester avec plusieurs demandes
2. ✅ Vérifier l'historique du workflow
3. ✅ Implémenter la modal de négociation
4. ✅ Ajouter l'upload de documents

---

**Besoin d'aide ?** Copiez :
- Les résultats de `diagnose-and-fix-all.sql`
- Les erreurs de la console (F12)
- Le contenu de votre table `transactions`
