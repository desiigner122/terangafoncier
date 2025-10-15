# 🔍 GUIDE DE TEST AVEC CONSOLE

## Étape 1: Ouvrir la console du navigateur

1. Dans votre navigateur, appuyez sur **F12**
2. Allez dans l'onglet **Console**
3. Effacez la console (clic droit → Clear console)

## Étape 2: Recharger l'application

1. Appuyez sur **Ctrl+R** pour recharger
2. Attendez que l'application soit chargée

## Étape 3: Tester le paiement échelonné

1. Allez sur une parcelle
2. Cliquez sur "Paiement échelonné"
3. Remplissez le formulaire :
   - Prix total : Pré-rempli (readonly)
   - Apport initial : 2000000
   - Revenus mensuels : 500000
   - Durée : 12 mois
   - Fréquence : Mensuelle
   - Date premier paiement : Choisissez une date
4. Cliquez sur **"Créer le plan de paiement"**

## Étape 4: Observer la console

Vous devriez voir ces logs dans l'ordre :

```
📤 Envoi payload: {user_id: "...", type: "installment_payment", ...}
📥 Réponse Supabase: {reqRows: [...], reqError: null}
✅ Request créée: {id: "...", type: "installment_payment", ...}
✅ Transaction créée avec succès
✅ Dialog state set to true
```

## Scénarios possibles :

### ✅ Scénario A: Succès
```
📤 Envoi payload: {...}
📥 Réponse Supabase: {reqRows: [Object], reqError: null}
✅ Request créée: {id: "abc123...", ...}
✅ Transaction créée avec succès
✅ Dialog state set to true
```
→ **Le Dialog DEVRAIT s'afficher**
→ Si le Dialog ne s'affiche pas malgré ce log, c'est un problème de React state/render

### ❌ Scénario B: Erreur Supabase
```
📤 Envoi payload: {...}
📥 Réponse Supabase: {reqRows: null, reqError: {message: "..."}}
❌ Erreur création demande: Error: ...
```
→ **Vérifier le message d'erreur**
→ Peut être : contrainte, colonne manquante, RLS policy

### ❌ Scénario C: Erreur Transaction
```
📤 Envoi payload: {...}
📥 Réponse Supabase: {reqRows: [Object], reqError: null}
✅ Request créée: {id: "abc123...", ...}
❌ Erreur création demande: Error: ... (transaction)
```
→ **Problème avec la table transactions**
→ Vérifier les colonnes et RLS policies de la table transactions

### ❌ Scénario D: Pas de log du tout
```
(Rien dans la console)
```
→ **Le bouton n'est pas cliqué ou est désactivé**
→ Vérifier que `hasContext` est true
→ Vérifier que tous les champs requis sont remplis

## Étape 5: Vérifier le Dialog

Si vous voyez le log `✅ Dialog state set to true` mais pas de Dialog :

1. Inspectez la page (F12 → Elements)
2. Cherchez : `<div role="dialog"`
3. Si présent mais invisible, c'est un problème CSS
4. Si absent, c'est un problème de rendu React

## Étape 6: Vérifier la base de données

Dans Supabase SQL Editor :

```sql
-- Voir les dernières requests
SELECT 
    id,
    type,
    payment_type,
    status,
    offered_price,
    created_at
FROM public.requests
ORDER BY created_at DESC
LIMIT 5;
```

- Si la request apparaît → Insertion réussie, problème d'affichage
- Si pas de request → Insertion a échoué, regarder les logs console

## Étape 7: Vérifier "Mes Achats"

1. Allez dans `/acheteur/mes-achats`
2. La demande devrait être visible
3. Si pas visible, ouvrez la console et regardez les erreurs de chargement

## Étape 8: Vérifier Dashboard Vendeur

1. Connectez-vous avec le compte vendeur (propriétaire de la parcelle)
2. Allez dans Dashboard Vendeur
3. Menu "Demandes d'Achat" devrait avoir un badge
4. Cliquez → La demande devrait apparaître

## Messages attendus :

### Si tout fonctionne :
```
✅ Dialog "Demande Envoyée !" visible
✅ 2 boutons : "Rester ici" et "Voir mes achats"
✅ Clic "Voir mes achats" → Navigation vers /acheteur/mes-achats
✅ La demande apparaît dans la liste
✅ Badge vendeur s'incrémente
```

### Si problème :
```
❌ Pas de Dialog
❌ Erreur dans la console
❌ Demande pas dans "Mes Achats"
❌ Demande pas dans Dashboard Vendeur
```

## Partagez-moi :

1. **Tous les logs** de la console (copiez-collez)
2. **Le résultat** de la requête SQL (dernières requests)
3. **Le comportement** : Dialog visible ? Demande dans "Mes Achats" ?

---

**Avec ces informations, je pourrai identifier le problème exact !** 🎯
