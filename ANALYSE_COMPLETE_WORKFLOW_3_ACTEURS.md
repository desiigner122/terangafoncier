# 🔍 Analyse Complète - Workflow 3 Acteurs

**Date**: 2 novembre 2025  
**Contexte**: Problèmes identifiés avec le workflow acheteur-vendeur-notaire

---

## 🚨 Problèmes Identifiés

### 1. **Timeline saute des étapes automatiquement**
- **Symptôme**: Des événements timeline sont créés sans action utilisateur
- **Cause probable**: Triggers SQL ou code frontend qui avance automatiquement
- **Impact**: Confusion utilisateur, perte de contrôle du workflow

### 2. **Notaire ne voit pas ses dossiers**
- **Symptôme**: Dashboard notaire vide malgré assignment
- **Cause identifiée**: 
  - ❌ Requête utilise `assigned_notary_id` mais colonne = `notaire_id`
  - ❌ Ne vérifie pas `notaire_case_assignments` table
- **Fichier**: `NotaireCasesModernReal.jsx` ligne 164
- **Impact**: Notaire ne peut pas travailler sur ses dossiers

### 3. **Workflow d'approbation notaire absent**
- **Symptôme**: Pas de système d'acceptation/refus par le notaire
- **Workflow attendu**:
  ```
  1. Acheteur propose notaire → status: pending
  2. Vendeur approuve → status: buyer_approved
  3. Notaire reçoit notification
  4. Notaire accepte → status: notaire_accepted → case avance
     OU
     Notaire refuse → status: notaire_declined → retour sélection
  ```
- **Actuellement**: Notaire assigné automatiquement sans possibilité de refuser
- **Impact**: Notaire forcé d'accepter tous les dossiers

### 4. **Notaire ne peut pas fixer ses frais**
- **Symptôme**: Pas de bouton pour définir les honoraires
- **Attendu**: Modal lors de l'acceptation du dossier pour saisir:
  - Honoraires de base
  - Frais additionnels
  - Délai estimé
- **Impact**: Prix non personnalisés, perte de flexibilité

### 5. **Notifications temps réel absentes**
- **Symptôme**: Pas de notifications sur l'icône header
- **Attendu**: Notification badge pour:
  - Nouveaux messages
  - Timeline updates
  - Actions requises
  - Changement de statut
- **Impact**: Acteurs ne savent pas quand agir

### 6. **Synchronisation temps réel incomplète**
- **Symptôme**: Updates Supabase Realtime ne fonctionnent pas partout
- **Impact**: Un acteur change quelque chose, l'autre ne le voit pas

---

## � Workflow Actuel vs Attendu

### Workflow ACTUEL (Problématique)
```
1. Acheteur clique "Sélectionner notaire"
   └─> Modal s'ouvre, liste des notaires
   
2. Acheteur clique "Confirmer le choix"
   └─> notaire_case_assignments créé (status: pending)
   └─> purchase_cases.notaire_id = [notaire_id]
   └─> purchase_cases.status = 'contract_preparation' ❌ TROP TÔT!
   └─> Timeline: "Préparation du contrat" ❌ FAUX!
   
3. Notaire ne voit rien sur son dashboard ❌
   └─> Requête SQL incorrecte
   
4. Vendeur ne sait pas qu'un notaire a été proposé ❌
   └─> Pas de notification
   └─> Pas de bouton d'approbation
   
5. Notaire ne peut ni accepter ni refuser ❌
   └─> Assigné de force
```

### Workflow ATTENDU (Correct)
```
1. Acheteur clique "Proposer un notaire"
   └─> Modal s'ouvre, liste des notaires
   
2. Acheteur clique "Proposer ce notaire"
   └─> notaire_case_assignments créé
       ├─> status: 'pending'
       ├─> proposed_by: [acheteur_id]
       ├─> proposed_by_role: 'buyer'
       ├─> buyer_approved: true
       ├─> seller_approved: false
       └─> notaire_status: 'pending'
   └─> purchase_cases.status RESTE à 'buyer_verification' ✅
   └─> Timeline: "Acheteur a proposé un notaire"
   └─> Notification → Vendeur: "Veuillez approuver le notaire proposé"
   
3. Vendeur reçoit notification
   └─> Bouton "Voir le notaire proposé" sur son dashboard
   └─> Voir profil notaire (nom, contact, honoraires estimés)
   └─> Bouton "Approuver" / "Proposer un autre notaire"
   
4. Vendeur approuve
   └─> notaire_case_assignments.seller_approved = true
   └─> notaire_case_assignments.status = 'both_approved'
   └─> Timeline: "Vendeur a approuvé le notaire"
   └─> Notification → Notaire: "Nouveau dossier en attente"
   └─> Notification → Acheteur: "Le vendeur a approuvé votre choix"
   
5. Notaire voit le dossier sur son dashboard
   └─> Badge "EN ATTENTE" visible
   └─> Bouton "Voir détails du dossier"
   
6. Notaire ouvre le dossier
   └─> Voir infos: acheteur, vendeur, parcelle, prix
   └─> Bouton "Accepter le dossier" (avec modal frais)
   └─> Bouton "Refuser le dossier" (avec modal raison)
   
7a. Notaire ACCEPTE
   └─> Modal: Saisir frais notariaux
       ├─> Honoraires de base
       ├─> Frais de dossier
       ├─> Taxes
       └─> Délai estimé (jours)
   └─> notaire_case_assignments.notaire_status = 'accepted'
   └─> notaire_case_assignments.quoted_fee = [montant]
   └─> notaire_case_assignments.fee_breakdown = {details}
   └─> purchase_cases.status = 'contract_preparation' ✅ MAINTENANT!
   └─> Timeline: "Notaire [nom] a accepté le dossier"
   └─> Notification → Acheteur & Vendeur: "Le notaire a accepté"
   
7b. Notaire REFUSE
   └─> Modal: Saisir raison du refus
       ├─> Conflit d'intérêts
       ├─> Charge de travail
       ├─> Autre (texte libre)
   └─> notaire_case_assignments.notaire_status = 'declined'
   └─> notaire_case_assignments.notaire_decline_reason = [raison]
   └─> purchase_cases.status = 'buyer_verification' ✅ RETOUR
   └─> Timeline: "Notaire [nom] a refusé le dossier"
   └─> Notification → Acheteur & Vendeur: "Le notaire a refusé, sélectionnez un autre"
   └─> Acheteur voit à nouveau bouton "Sélectionner un notaire"
```

---

## 🔍 Points Critiques à Vérifier

### 1. Triggers SQL Automatiques
**Localisation**: Fichiers `*.sql` dans le projet

**À chercher**:
```sql
-- Triggers qui pourraient auto-avancer le workflow
CREATE TRIGGER auto_advance_status ...
CREATE TRIGGER update_timeline_on_status_change ...
CREATE FUNCTION advance_workflow_stage() ...
```

**Action**: 
- Lister tous les triggers sur `purchase_cases`
- Vérifier s'ils créent des timeline events automatiquement
- Désactiver ceux qui forcent l'avancement

**Requête SQL de diagnostic**:
```sql
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table IN ('purchase_cases', 'purchase_case_timeline', 'notaire_case_assignments');
```

### 2. Code Frontend qui Auto-Avance
**Fichiers à vérifier**:
- `NotaireAssignmentService.js` lignes 295-365
- `CaseTrackingUnified.jsx` 
- `UnifiedCaseTrackingService.js`

**Pattern à chercher**:
```javascript
// ❌ Code qui avance automatiquement
await supabase
  .from('purchase_cases')
  .update({ status: 'next_status' })
  .eq('id', caseId);

// Sans vérification de l'état actuel ou sans action utilisateur
```

### 3. RLS Policies pour Notaires
**Problème potentiel**: Notaire ne peut pas voir ses dossiers

**À vérifier**:
```sql
-- Policy SELECT sur purchase_cases pour notaires
SELECT policyname, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'purchase_cases'
  AND policyname LIKE '%notaire%';
```

**Policy attendue**:
```sql
CREATE POLICY "Notaires voient leurs dossiers assignés"
ON purchase_cases FOR SELECT
TO authenticated
USING (
  notaire_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM notaire_case_assignments
    WHERE case_id = purchase_cases.id
    AND notaire_id = auth.uid()
    AND notaire_status IN ('pending', 'accepted')
  )
);
```

### 4. Notifications Manquantes
**Événements qui DOIVENT générer une notification**:

| Événement | Destinataire(s) | Type |
|-----------|----------------|------|
| Notaire proposé | Vendeur | `assignment_proposed` |
| Notaire approuvé par vendeur | Notaire + Acheteur | `assignment_approved` |
| Notaire accepte dossier | Acheteur + Vendeur | `assignment_accepted` |
| Notaire refuse dossier | Acheteur + Vendeur | `assignment_declined` |
| Document uploadé | Notaire | `document_uploaded` |
| Paiement reçu | Notaire + Vendeur | `payment_received` |
| Contrat généré | Acheteur + Vendeur | `contract_ready` |
| Message envoyé | Destinataire | `message_received` |
| RDV programmé | Tous | `appointment_scheduled` |

**Table de notifications à créer** (si absente):
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  related_case_id UUID REFERENCES purchase_cases(id),
  related_entity_type VARCHAR(50), -- 'message', 'document', 'payment', etc.
  related_entity_id UUID,
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_unread 
ON notifications(user_id, is_read, created_at DESC);
```

### 5. Realtime Subscriptions
**À vérifier dans chaque dashboard**:

```javascript
// ✅ Doit être présent dans:
// - CaseTrackingUnified.jsx
// - NotaireCaseDetailModern.jsx
// - ParticulierCaseTracking.jsx (acheteur)
// - VendeurCaseTracking.jsx

useEffect(() => {
  if (!caseId) return;
  
  const channel = supabase
    .channel(`case:${caseId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'purchase_cases',
      filter: `id=eq.${caseId}`
    }, (payload) => {
      console.log('🔔 Case updated:', payload);
      loadCaseData(); // Recharger les données
    })
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'purchase_case_timeline',
      filter: `case_id=eq.${caseId}`
    }, (payload) => {
      console.log('🔔 Timeline updated:', payload);
      loadTimeline(); // Recharger timeline
    })
    .subscribe();
    
  return () => {
    channel.unsubscribe();
  };
}, [caseId]);
```

---

## �📋 Architecture Actuelle

### Tables Principales

#### `purchase_cases`
```sql
- id UUID
- case_number VARCHAR
- status VARCHAR (contrainte: 19 valeurs)
- buyer_id UUID → profiles
- seller_id UUID → profiles
- notaire_id UUID → profiles  ⚠️ Pas 'assigned_notary_id'
- parcel_id UUID → parcels
- agreed_price DECIMAL
- payment_method VARCHAR
- phase INTEGER
- progress_percentage INTEGER
```

#### `notaire_case_assignments`
```sql
- id UUID
- case_id UUID → purchase_cases
- notaire_id UUID → profiles
- proposed_by UUID → profiles
- proposed_by_role VARCHAR (buyer, seller, system)
- status VARCHAR (pending, buyer_approved, seller_approved, both_approved, 
                  notaire_accepted, notaire_declined, expired, cancelled)
- buyer_approved BOOLEAN
- seller_approved BOOLEAN
- notaire_status VARCHAR (pending, accepted, declined, expired)
- quoted_fee DECIMAL
- fee_breakdown JSONB
- assignment_score INTEGER
- distance_km DECIMAL
- expires_at TIMESTAMP
```

#### `purchase_case_timeline`
```sql
- id UUID
- case_id UUID
- event_type VARCHAR
- title TEXT
- description TEXT
- triggered_by UUID → auth.users
- old_value JSONB
- new_value JSONB
- metadata JSONB
- created_at TIMESTAMP
```

### Services Clés

#### `NotaireAssignmentService.js`
**Statut**: ✅ Service complet existant

**Méthodes disponibles**:
- ✅ `findBestNotaires(caseId, options)` - Trouve notaires disponibles avec scoring
- ✅ `proposeNotaire(caseId, notaireId, options)` - Créer assignment (status: pending)
- ✅ `approveNotaire(assignmentId, userId, role)` - Acheteur/Vendeur approuve
- ✅ `acceptAssignment(assignmentId, notaireId, options)` - Notaire accepte avec frais
- ✅ `declineAssignment(assignmentId, notaireId, reason)` - Notaire refuse avec raison
- ✅ `getCaseAssignments(caseId)` - Liste assignments pour un case
- ✅ `getPendingAssignments(notaireId)` - Liste assignments en attente pour un notaire
- ✅ `createReview(caseId, notaireId, reviewerId, reviewData)` - Créer avis notaire
- ✅ `getNotaireReviews(notaireId, limit)` - Récupérer avis d'un notaire
- ✅ `searchNotaires(filters)` - Recherche notaires avec filtres

**⚠️ Points d'attention**:
- La méthode `proposeNotaire` met à jour `purchase_cases.status` trop tôt
- Doit attendre que notaire accepte avant de changer vers 'contract_preparation'

#### `ContextualActionsService.js`
- `getBuyerActions(caseData, permissions)` - Actions pour acheteur
- `getSellerActions(caseData, permissions)` - Actions pour vendeur
- `getNotaryActions(caseData, permissions)` - Actions pour notaire ⚠️ À vérifier

#### `WorkflowStatusService.js`
- 18 statuts définis
- Mapping statut → étape workflow
- Validation transitions

---

## 🎯 Plan de Correction Prioritaire

### Phase 1: Fix Dashboard Notaire (URGENT)
**Fichier**: `NotaireCasesModernReal.jsx`

**Changement requis**:
```javascript
// ❌ AVANT (ligne 164)
.eq('assigned_notary_id', user.id)

// ✅ APRÈS - Option 1: Via notaire_id direct
.eq('notaire_id', user.id)

// ✅ APRÈS - Option 2: Via notaire_case_assignments (MIEUX)
// Requête avec JOIN sur notaire_case_assignments
.select(`
  *,
  notaire_assignments:notaire_case_assignments!inner(
    id,
    status,
    notaire_status,
    quoted_fee
  )
`)
.eq('notaire_assignments.notaire_id', user.id)
.in('notaire_assignments.notaire_status', ['pending', 'accepted'])
```

### Phase 2: Implémenter Workflow Approbation Notaire
**Fichiers à modifier**:
1. `NotaireCaseDetailModern.jsx` - Ajouter boutons Accepter/Refuser
2. `ContextualActionsService.js` - Ajouter actions notaire
3. `NotaireAssignmentService.js` - Vérifier/compléter méthodes

**Workflow à implémenter**:
```javascript
// État 1: Notaire reçoit proposition
notaire_case_assignments.notaire_status = 'pending'
→ Bouton: "Accepter le dossier" / "Refuser"

// État 2a: Notaire accepte
→ Modal: Saisir frais notariaux
→ notaire_case_assignments.notaire_status = 'accepted'
→ notaire_case_assignments.quoted_fee = [montant]
→ purchase_cases.status = 'contract_preparation'
→ Timeline event: "Notaire a accepté le dossier"

// État 2b: Notaire refuse
→ Modal: Saisir raison refus
→ notaire_case_assignments.notaire_status = 'declined'
→ notaire_case_assignments.notaire_decline_reason = [raison]
→ purchase_cases.status = retour à 'buyer_verification'
→ Timeline event: "Notaire a refusé, nouvelle sélection requise"
```

### Phase 3: Système de Notifications
**Fichiers**:
1. `NotificationService.js` - Service centralisé
2. `HeaderNotifications.jsx` - Composant icône + badge
3. `useNotifications.jsx` - Hook React

**Types de notifications**:
- `timeline_update` - Nouvel événement timeline
- `message_received` - Nouveau message
- `action_required` - Action utilisateur requise
- `status_changed` - Changement statut dossier
- `assignment_received` - Notaire reçoit dossier
- `assignment_approved` - Acheteur/Vendeur approuve
- `payment_received` - Paiement confirmé

### Phase 4: Synchronisation Temps Réel
**Supabase Realtime subscriptions**:

```javascript
// CaseTrackingUnified.jsx
useEffect(() => {
  const channel = supabase
    .channel(`case:${caseId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'purchase_cases',
      filter: `id=eq.${caseId}`
    }, handleCaseUpdate)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'purchase_case_timeline',
      filter: `case_id=eq.${caseId}`
    }, handleTimelineUpdate)
    .subscribe();
    
  return () => channel.unsubscribe();
}, [caseId]);
```

### Phase 5: Audit Boutons d'Actions
**À vérifier pour chaque rôle**:

#### Acheteur
- ✅ Sélectionner notaire
- ✅ Uploader pièce identité
- ✅ Payer acompte
- ✅ Signer contrat préliminaire
- ⚠️ Approuver choix notaire du vendeur (si vendeur propose)
- ⚠️ Voir frais notariaux après acceptation

#### Vendeur
- ✅ Sélectionner notaire
- ✅ Uploader titre foncier
- ⚠️ Approuver choix notaire de l'acheteur
- ⚠️ Signer contrat préliminaire
- ⚠️ Confirmer réception paiement

#### Notaire
- ❌ Accepter/Refuser dossier
- ❌ Définir frais notariaux
- ⚠️ Vérifier documents
- ⚠️ Générer contrat préliminaire
- ⚠️ Programmer RDV signature
- ⚠️ Valider signature
- ⚠️ Initier transfert de propriété

---

## 🛠️ Prochaines Actions Immédiates

1. **Fix Dashboard Notaire** (30 min)
   - Corriger requête dans `NotaireCasesModernReal.jsx`
   - Tester avec compte notaire

2. **Ajouter boutons Accepter/Refuser** (1h)
   - Modifier `NotaireCaseDetailModern.jsx`
   - Créer `NotaryAcceptDeclineModal.jsx`
   - Connecter à `NotaireAssignmentService`

3. **Implémenter notifications basiques** (2h)
   - Créer `NotificationService.js`
   - Ajouter badge header
   - Connecter aux événements timeline

4. **Activer Realtime partout** (1h)
   - Ajouter subscriptions dans tous les dashboards
   - Gérer les updates automatiques

5. **Audit complet boutons** (2h)
   - Tester chaque rôle
   - Documenter actions manquantes
   - Implémenter les gaps

---

## ✅ Checklist de Validation

### Dashboard Notaire
- [ ] Notaire voit ses dossiers assignés
- [ ] Compteurs corrects (total, en cours, terminés)
- [ ] Filtres fonctionnent
- [ ] Temps réel activé

### Workflow Notaire
- [ ] Bouton "Accepter" visible quand status=pending
- [ ] Modal frais notariaux s'ouvre
- [ ] Frais enregistrés dans DB
- [ ] Statut case avance après acceptation
- [ ] Bouton "Refuser" visible
- [ ] Modal raison refus s'ouvre
- [ ] Statut case retourne en arrière
- [ ] Timeline events créés correctement

### Notifications
- [ ] Badge apparaît sur icône header
- [ ] Compteur correct
- [ ] Dropdown liste notifications
- [ ] Click marque comme lu
- [ ] Temps réel: nouvelle notif apparaît instantanément

### Synchronisation
- [ ] 2 navigateurs ouverts: acheteur + vendeur
- [ ] Acheteur fait action → Vendeur voit changement immédiat
- [ ] Timeline update en temps réel
- [ ] Messages synchronisés

### Actions par Rôle
- [ ] Acheteur: toutes actions disponibles selon statut
- [ ] Vendeur: toutes actions disponibles selon statut
- [ ] Notaire: toutes actions disponibles selon statut
- [ ] Aucun bouton ne fait rien (tous connectés)

---

## 📊 Métriques de Succès

- ✅ Dashboard notaire affiche dossiers: 0 → X dossiers
- ✅ Taux d'acceptation notaire: mesurable (avant: 100% forcé)
- ✅ Délai notification → action: < 5 secondes
- ✅ Synchronisation temps réel: < 2 secondes
- ✅ Timeline events: tous intentionnels (pas d'auto-avance)

---

**Prochaine étape**: Commencer par le fix le plus urgent → Dashboard Notaire
