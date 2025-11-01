# Guide d'activation de Realtime pour la synchronisation automatique du timeline

## Problème
Le notaire met à jour le statut d'un dossier, mais les pages acheteur/vendeur ne se mettent pas à jour automatiquement. Il faut rafraîchir manuellement.

## Cause
Supabase Realtime n'est pas activé sur les tables nécessaires.

## Solution: Activer Realtime dans Supabase

### Étape 1: Aller dans Supabase Dashboard
1. Ouvrir https://supabase.com/dashboard
2. Sélectionner votre projet
3. Dans le menu de gauche, cliquer sur **Database** → **Replication**

### Étape 2: Activer Realtime sur les tables
Activer la réplication pour ces 3 tables:

✅ **purchase_cases** (CRITIQUE - contient le statut)
- Cette table contient `status`, `notaire_id`, etc.
- Quand le notaire change le statut, tous les acteurs doivent être notifiés

✅ **purchase_case_documents** (IMPORTANT - documents uploadés/validés)
- Notifications quand un document est ajouté/validé

✅ **purchase_case_messages** (IMPORTANT - messagerie)
- Messages en temps réel entre acteurs

### Étape 3: Vérifier l'activation
Dans la console navigateur (F12), vous devriez voir:
```
✅ Subscribed to purchase_cases realtime
✅ Subscribed to purchase_case_documents realtime
✅ Subscribed to purchase_case_messages realtime
📡 Realtime: purchase_cases changed
```

### Étape 4: Tester
1. Ouvrir 2 onglets côte à côte:
   - Onglet 1: Page notaire `/notaire/cases/[id]`
   - Onglet 2: Page acheteur `/particulier/cases/[caseId]`

2. Notaire: Changer le statut du dossier

3. Acheteur: La page doit se mettre à jour automatiquement (sans F5)
   - Le nouveau statut apparaît
   - Le timeline avance
   - La progression se met à jour

## Alternative si Realtime ne fonctionne pas

Si vous utilisez Firefox et que Realtime est bloqué par la protection anti-pistage:
1. Utiliser Chrome ou Edge pour tester
2. OU désactiver la protection anti-pistage pour localhost dans Firefox

## Note technique
Le code est déjà prêt avec le hook `useRealtimeCaseSync` qui:
- S'abonne automatiquement aux changements
- Recharge les données quand il détecte un changement
- Nettoie les abonnements quand on quitte la page

Tout ce qu'il faut faire est d'activer Realtime côté Supabase!
