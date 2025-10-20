# Plan de Correction Complet - Demandes d'Achat et Messagerie

## Problèmes Identifiés

### 1. Infos acheteur manquantes sur la demande (Vendeur)
- **Fichier**: `src/pages/dashboards/vendeur/VendeurPurchaseRequests.jsx`
- **Problème**: Les infos de l'acheteur (nom, email, tel) ne s'affichent pas correctement
- **Cause**: Le profil de l'acheteur n'est pas enrichi correctement, ou la colonne `phone` n'existe pas
- **Solution**: 
  - Améliorer la requête `loadRequests` pour inclure le phone et mieux enrichir les données
  - Ajouter un fallback pour les champs manquants
  - Afficher les infos de manière plus visible

### 2. Pas de message de succès quand le vendeur accepte l'offre
- **Fichier**: `src/pages/dashboards/vendeur/VendeurPurchaseRequests.jsx` (fonction `handleAccept`)
- **Problème**: Le toast existe mais n'est pas assez visible
- **Solution**: Améliorer le toast et ajouter un refresh visuel immédiat

### 3. Non-actualisation côté acheteur quand vendeur accepte/refuse
- **Fichier**: `src/pages/dashboards/particulier/ParticulierDemandesTerrains.jsx`
- **Problème**: Les changements de statut ne se reflètent pas en temps réel
- **Cause**: Pas de subscription Realtime sur les transactions/purchase_cases
- **Solution**: 
  - Ajouter une subscription Realtime pour les transactions liées à l'acheteur
  - Mettre à jour l'état local quand il y a un changement

### 4. Redirection vers "page en cours de développement" au lieu du dossier
- **Fichier**: `src/pages/dashboards/vendeur/VendeurPurchaseRequests.jsx` (ligne du bouton "Voir le dossier")
- **Problème**: La navigation utilise `/vendeur/cases/:caseNumber` mais le sidebar n'a pas de route dynamique pour cela
- **Cause**: Le sidebar utilise `renderActiveComponent()` qui ne gère que les tabs statiques
- **Solution**:
  - Soit changer la navigation pour utiliser la route racine `/vendeur/cases/:caseNumber`
  - Soit ajouter un nouveau système de routing dans le sidebar pour les routes dynamiques

### 5. Système de messagerie désactivé
- **Fichier**: À créer ou activer
- **Problème**: Aucune messagerie entre vendeur et acheteur
- **Solution**:
  - Créer une table `purchase_case_messages` si elle n'existe pas
  - Implémenter une composante de messagerie dans le dossier
  - Ajouter une subscription Realtime pour les messages
  - Ajouter une route `/vendeur/cases/:caseNumber` qui affiche le dossier complet avec messagerie

## Implémentations à Faire

### Phase 1: Enrichissement des données
- [ ] Améliorer la requête de chargement des profils acheteurs
- [ ] Inclure le phone si existe
- [ ] Afficher les infos acheteur de manière plus visible

### Phase 2: Messagerie en base de données
- [ ] Créer/Vérifier table `purchase_case_messages`
- [ ] Créer/Vérifier table `purchase_case_documents`
- [ ] Créer index et RLS policies

### Phase 3: Activer temps réel côté acheteur
- [ ] Ajouter subscription Realtime dans `ParticulierDemandesTerrains`
- [ ] Écouter les changes de `purchase_cases`
- [ ] Écouter les changes de `transactions`

### Phase 4: Fixer la navigation du dossier
- [ ] Modifier `navigate(`/vendeur/cases/${caseNumber}`)` pour utiliser une URL absolue (hors sidebar)
- [ ] Ou créer une modal/page overlay au sein du sidebar

### Phase 5: Implémenter la messagerie UI
- [ ] Créer composante `PurchaseCaseMessaging`
- [ ] Implémenter envoi/réception de messages
- [ ] Ajouter support des fichiers
- [ ] Intégrer dans `RefactoredVendeurCaseTracking`

## Fichiers à Modifier

1. `src/pages/dashboards/vendeur/VendeurPurchaseRequests.jsx` - Enrichir données + fixer navigation
2. `src/pages/dashboards/particulier/ParticulierDemandesTerrains.jsx` - Ajouter Realtime
3. `src/pages/dashboards/vendeur/RefactoredVendeurCaseTracking.jsx` - Ajouter messagerie
4. `src/components/modals/` - Créer nouvelle modal ou composante
5. `src/App.jsx` - Ajouter route `/vendeur/cases/:caseNumber` en dehors du sidebar (optionnel)

## Structure Réactif (Realtime)

```
Vendeur accepte → UPDATE transactions/purchase_cases
→ Realtime event sur l'acheteur
→ L'acheteur voit le changement en temps réel
```

## API de Messagerie

```
POST /purchase_case_messages
{
  case_id: UUID,
  sent_by: UUID,
  message: string,
  attachments: JSON,
  created_at: timestamp
}

GET /purchase_case_messages?case_id=...
```

