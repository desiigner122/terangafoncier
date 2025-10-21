# REFONTE - PAGE DE SUIVI ACHATS & DOSSIERS

## 📋 Vue d'ensemble de la refonte

### Nouvelles pages créées:

1. **ParticulierMesAchatsRefactored.jsx** - Liste centralisée des achats
2. **ModernBuyerCaseTrackingV2.jsx** - Page dossier enrichie avec tous les participants

### Routes mises à jour dans App.jsx:

```jsx
<Route path="mes-achats" element={<ParticulierMesAchatsRefactored />} />
<Route path="cases/:caseNumber" element={<ModernBuyerCaseTrackingV2 />} />
```

---

## 🎨 Fonctionnalités de ParticulierMesAchatsRefactored

### 1. **Vue d'ensemble (KPIs)**
- Total de dossiers
- Dossiers en cours
- Dossiers complétés
- Dossiers en attente
- Total des documents
- Total des messages

### 2. **Filtrage avancé**
- Recherche par:
  - Numéro de dossier
  - Localisation du bien
  - Nom du vendeur
- Filtrage par statut:
  - Initiée
  - En vérification
  - Accord préliminaire
  - Préparation contrat
  - Complétée
  - Annulée

### 3. **Tri**
- Récemment modifié (par défaut)
- Plus ancien
- Par prix

### 4. **Liste des dossiers**
Chaque dossier affiche:
- **Bien immobilier**: Titre, localisation, prix
- **Statut**: Badge coloré
- **Dates**: Création et modification
- **Participants**: Vendeur, Notaire, Géomètre
- **Actions rapides**: Voir détails, Discuter

### 5. **Temps réel**
- Abonnement aux changements de `purchase_cases`
- Rechargement automatique des données
- Synchronisation avec le vendeur

---

## 🎯 Fonctionnalités de ModernBuyerCaseTrackingV2

### 1. **Progression du dossier**
- Barre de progression (0-100%)
- 12 étapes du workflow:
  1. Initiée
  2. Vérification acheteur
  3. Notification vendeur
  4. Accord préliminaire
  5. Préparation contrat
  6. Vérification légale
  7. Audit documents
  8. Évaluation propriété
  9. Rendez-vous notaire
  10. Processus de signature
  11. Traitement paiement
  12. Complétée

### 2. **Onglet Aperçu**
- **Propriété**: Titre, localisation, surface, prix
- **Dates**: Création, modification, durée totale
- **Statistiques**: Documents, messages, tâches

### 3. **Onglet Participants** (NOUVEAU)
Affiche tous les participants avec:
- Avatar
- Nom complet
- Email
- Téléphone
- Boutons d'actions:
  - Envoyer email
  - Envoyer message

Participants gérés:
- **Acheteur** (vous)
- **Vendeur**
- **Notaire**
- **Géomètre**
- **Agent Foncier** (optionnel)

### 4. **Onglet Documents**
- Liste complète des documents
- Date d'upload
- Téléchargement

### 5. **Onglet Tâches**
- Liste des tâches
- Checkbox pour marquer comme fait
- Dates d'échéance
- Description

### 6. **Onglet Messages** (NOUVEAU)
- Chat intégré
- Affiche tous les participants
- Avatars et noms
- Envoi de messages en temps réel
- Attachement de fichiers

---

## 🔄 Synchronisation Dashboards Vendeur/Acheteur

### Architecture de synchronisation

```
┌─────────────────────────────────────────────────────────┐
│          Supabase PostgreSQL (Source de vérité)         │
│                                                          │
│  Tables principales:                                     │
│  - purchase_cases (acheteur_id, vendeur_id, statut)    │
│  - conversation_messages                                │
│  - documents                                             │
│  - case_tasks                                            │
│  - case_payments                                         │
└─────────────────────────────────────────────────────────┘
                            ▲
                            │
                ┌───────────┼───────────┐
                │           │           │
       Realtime │    RLS    │ RLS       │
       Updates  │ Policies  │ Policies  │
                │           │           │
    ┌──────────────────┐  ┌──────────────────┐
    │ Vendeur Dashboard │  │ Buyer Dashboard  │
    │ VendeurDashboard  │  │ Particulier      │
    │ RefactoredVendeur │  │ MesAchatsRef.    │
    │ CaseTracking      │  │ ModernBuyerV2    │
    └──────────────────┘  └──────────────────┘
```

### Politique de synchronisation

#### **Onglets à synchroniser**

1. **Statut du dossier**
   - Source: `purchase_cases.status`
   - Sync: Bidirectionnelle (vendeur accepte → acheteur reçoit)
   - Latence: < 1s avec Realtime

2. **Participants**
   - Source: `purchase_cases` (seller_id, notary_id, geometre_id, agent_foncier_id)
   - Sync: Vendeur ajoute → Acheteur voit
   - Latence: < 1s

3. **Documents**
   - Source: Table `documents` (case_id)
   - Sync: N'importe qui peut uploader → Tous voient
   - Sync: Bidirectionnelle
   - Latence: < 2s

4. **Tâches**
   - Source: Table `case_tasks` (case_id, assigned_to, completed)
   - Sync: Assignataire peut marquer comme fait
   - Sync: Bidirectionnelle
   - Latence: < 1s

5. **Messagerie**
   - Source: `conversation_messages` (case_id, sender_id)
   - Sync: Temps réel
   - Latence: < 500ms

6. **Paiements**
   - Source: `case_payments` (case_id, status)
   - Sync: Acheteur initie → Vendeur reçoit notification
   - Sync: Unilatérale pour paiement, bidirectionnelle pour statut

### Implémentation avec RealtimeSyncService

```javascript
// Subscribe aux changements pour acheteur
const unsubscribe = RealtimeSyncService.subscribeToBuyerRequests(
  user.id,
  (payload) => {
    console.log('Update detected:', payload);
    loadCaseData(); // Rafraîchir les données
  }
);

// Subscribe aux changements pour vendeur
const unsubscribe = RealtimeSyncService.subscribeToVendorRequests(
  user.id,
  (payload) => {
    console.log('Update detected:', payload);
    loadRequests(); // Rafraîchir les données
  }
);
```

### Champs synchronisés par onglet

**Aperçu (Overview)**
```javascript
{
  case_number: string,
  status: string (12 étapes),
  created_at: timestamp,
  updated_at: timestamp,
  total_price: number,
  seller_id, buyer_id, notary_id, geometre_id, agent_foncier_id
}
```

**Participants**
```javascript
{
  buyer_id → profiles,
  seller_id → profiles,
  notary_id → profiles,
  geometre_id → profiles,
  agent_foncier_id → profiles
}
```

**Documents**
```javascript
{
  id, case_id, name, file_url, file_type, uploaded_by,
  created_at, size
}
```

**Tâches**
```javascript
{
  id, case_id, title, description, assigned_to,
  due_date, completed, completed_at, completed_by
}
```

**Messages**
```javascript
{
  id, case_id, sender_id, sender_type, content,
  created_at, read_at
}
```

**Paiements**
```javascript
{
  id, case_id, amount, status, method,
  created_at, confirmed_at
}
```

---

## 🔒 RLS Policies Requises

### Pour les acheteurs (Particulier)

```sql
-- Voir ses propres dossiers
CREATE POLICY "buyers_view_own_cases"
ON purchase_cases FOR SELECT
USING (auth.uid() = buyer_id);

-- Voir les documents de ses dossiers
CREATE POLICY "buyers_view_case_documents"
ON documents FOR SELECT
USING (
  CASE WHEN case_id IS NOT NULL THEN
    EXISTS(
      SELECT 1 FROM purchase_cases
      WHERE purchase_cases.id = documents.case_id
      AND purchase_cases.buyer_id = auth.uid()
    )
  END
);

-- Envoyer des messages
CREATE POLICY "buyers_send_messages"
ON conversation_messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND sender_type = 'buyer' AND
  EXISTS(
    SELECT 1 FROM purchase_cases
    WHERE purchase_cases.id = case_id
    AND purchase_cases.buyer_id = auth.uid()
  )
);
```

### Pour les vendeurs

```sql
-- Voir les dossiers où ils sont vendeurs
CREATE POLICY "sellers_view_cases"
ON purchase_cases FOR SELECT
USING (auth.uid() = seller_id);

-- Modifier le statut
CREATE POLICY "sellers_update_case_status"
ON purchase_cases FOR UPDATE
USING (auth.uid() = seller_id)
WITH CHECK (auth.uid() = seller_id);
```

---

## ✅ Checklist de synchronisation

- [ ] RLS policies activées sur purchase_cases
- [ ] RLS policies activées sur documents
- [ ] RLS policies activées sur conversation_messages
- [ ] RLS policies activées sur case_tasks
- [ ] RLS policies activées sur case_payments
- [ ] Realtime enabled pour toutes les tables
- [ ] RealtimeSyncService configuré pour les deux dashboards
- [ ] Tests end-to-end de synchronisation

---

## 🧪 Tests recommandés

1. **Test acheteur crée demande → vendeur la reçoit**
   - Ouvrir dashboard vendeur
   - Dans dashboard acheteur: créer nouvelle demande
   - Vérifier que vendeur voit en temps réel

2. **Test vendeur accepte → acheteur reçoit**
   - Vendeur accepte demande
   - Acheteur reçoit notification
   - Statut se met à jour en temps réel

3. **Test ajout participant**
   - Vendeur assigne notaire
   - Acheteur voit notaire dans onglet Participants
   - Notaire reçoit invitation

4. **Test upload document**
   - Acheteur upload document
   - Vendeur le voit immédiatement
   - Réciproque pour vendeur → acheteur

5. **Test messagerie**
   - Conversation entre acheteur et vendeur
   - Messages arrivent en temps réel
   - Historique persistant

---

## 📊 Metrics de suivi

- Latence de synchronisation: < 1s (objectif)
- Taux de disponibilité Realtime: > 99.9%
- Nombre de messages par dossier: illimité
- Nombre de documents par dossier: illimité
- Participants par dossier: 5 (acheteur, vendeur, notaire, géomètre, agent)

---

## 🚀 Déploiement

1. Commit des nouvelles pages:
   ```bash
   git add src/pages/dashboards/particulier/ParticulierMesAchatsRefactored.jsx
   git add src/pages/dashboards/particulier/ModernBuyerCaseTrackingV2.jsx
   git commit -m "feat: refactor buyer dashboard with enhanced case tracking"
   ```

2. Mettre à jour les routes dans App.jsx

3. Tester en local avec `npm run dev`

4. Build production:
   ```bash
   npm run build
   ```

5. Déployer sur terangafoncier.sn

---

## 📝 Notes

- Les pages utilisent une palette de couleurs cohérente pour les statuts
- Les animations utilisent Framer Motion pour une meilleure UX
- Tous les appels Supabase ont une gestion d'erreur appropriée
- Les données sont enrichies localement (join dans l'app)
- L'authentification est vérifiée via `UnifiedAuthContext`
