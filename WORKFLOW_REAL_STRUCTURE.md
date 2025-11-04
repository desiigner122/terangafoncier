# 📋 Structure Réelle du Workflow de Dossier d'Achat

## Issue Identifiée

Les pages de suivi affichent un workflow simplifié qui ne reflète pas la réalité du processus immobilier:

❌ **Workflow simplifié (actuellement affiché):**
```
offer_submitted → offer_accepted → documents_pending → financing_approval 
→ compromis_signed → final_payment → title_transfer → completed
```

✅ **Vrai workflow (dans la BD):**
```
initiated → buyer_verification → seller_notification → negotiation 
→ preliminary_agreement → contract_preparation → legal_verification 
→ document_audit → property_evaluation → notary_appointment 
→ signing_process → payment_processing → property_transfer → completed
```

Plus: `cancelled`, `rejected`, `seller_declined`, `negotiation_failed`, `legal_issues_found`

## Structure Réelle dans `purchase_cases`

```sql
-- Statut principal du dossier
status TEXT NOT NULL CHECK (status IN (
    'initiated',              -- Dossier créé
    'buyer_verification',     -- Vérification acheteur
    'seller_notification',    -- Notification vendeur
    'negotiation',            -- Phase de négociation
    'preliminary_agreement',  -- Accord préalable
    'contract_preparation',   -- Préparation contrat
    'legal_verification',     -- Vérification légale
    'document_audit',         -- Audit documents
    'property_evaluation',    -- Évaluation propriété
    'notary_appointment',     -- RDV notaire
    'signing_process',        -- Process de signature
    'payment_processing',     -- Traitement paiement
    'property_transfer',      -- Transfert propriété
    'completed',              -- Complété
    'cancelled',              -- Annulé
    'rejected',               -- Rejeté
    'seller_declined',        -- Vendeur décline
    'negotiation_failed',     -- Négociation échouée
    'legal_issues_found'      -- Problèmes légaux
))

-- Phase du processus (0-4)
phase INTEGER DEFAULT 1

-- Pourcentage de progression (0-100)
progress_percentage INTEGER DEFAULT 0
```

## Financement Bancaire

Le financement bancaire n'est **PAS** une simple étape du workflow, c'est une **configuration du dossier**:

```sql
-- Méthode de paiement
payment_method TEXT CHECK (payment_method IN (
    'one_time',          -- Paiement unique
    'installments',      -- Échelonnement
    'bank_financing',    -- Financement bancaire
    'mixed'              -- Combiné
))

-- Approbation financement
financing_approved BOOLEAN DEFAULT false

-- Le workflow continue NORMALEMENT peu importe la méthode de paiement
-- Mais avec bank_financing, il y a une étape spéciale d'approbation
```

## Phases du Processus

```
Phase 0: Vérification initiale
  - initiated
  - buyer_verification
  - seller_notification

Phase 1: Négociation
  - negotiation
  - preliminary_agreement

Phase 2: Préparation légale
  - contract_preparation
  - legal_verification
  - document_audit
  - property_evaluation

Phase 3: Finalisaton
  - notary_appointment
  - signing_process
  - payment_processing
  - property_transfer

Phase 4: Complété/Terminal
  - completed
  - cancelled
  - rejected
  - etc.
```

## Ce Qu'il Faut Corriger

### 1. **TimelineTracker** 
- ❌ Actuellement: Affiche hardcoded stages (`offer_submitted`, `offer_accepted`, etc.)
- ✅ À faire: Utiliser les vrai stages depuis la BD + la colonne `phase`

### 2. **Calcul de progression**
- ❌ Actuellement: `(currentIndex + 1) / stages.length * 100`
- ✅ À faire: Utiliser `progress_percentage` du dossier OU calculer via `phase`

### 3. **Financement bancaire**
- ❌ Actuellement: `financing_approval` est juste une étape dans le timeline
- ✅ À faire: C'est une propriété du dossier (`payment_method` + `financing_approved`)
  - Ajouter une section spéciale si `payment_method = 'bank_financing'`
  - Afficher l'approbation de la banque comme une étape conditionnelle

### 4. **Statuts finaux**
- ❌ Actuellement: Seulement `completed` ou implicite
- ✅ À faire: Afficher clairement `cancelled`, `rejected`, `seller_declined`, etc.

## Recommandations

1. **Créer un service `WorkflowStatusService`** qui mappe les statuts BD aux labels UI
2. **Mettre à jour TimelineTracker** pour utiliser les vrai statuts
3. **Ajouter un composant BankFinancingStatus** si `payment_method = 'bank_financing'`
4. **Utiliser `progress_percentage`** pour la barre de progression
5. **Ajouter des transitions conditionnelles** basées sur le type de paiement

## Exemple de Dossier avec Financement Bancaire

```json
{
  "id": "case-123",
  "request_id": "req-456",
  "status": "payment_processing",
  "phase": 3,
  "progress_percentage": 85,
  "payment_method": "bank_financing",
  "financing_approved": true,
  "purchase_price": 50000000,
  "negotiated_price": 48000000,
  "created_at": "2025-10-20T10:00:00Z"
}
```

**Timeline pour ce dossier:**
1. ✅ initiated (phase 0)
2. ✅ buyer_verification (phase 0)
3. ✅ seller_notification (phase 0)
4. ✅ negotiation (phase 1)
5. ✅ preliminary_agreement (phase 1)
6. ✅ contract_preparation (phase 2)
7. ✅ legal_verification (phase 2)
8. ✅ document_audit (phase 2)
9. ✅ property_evaluation (phase 2)
10. ✅ notary_appointment (phase 3)
11. ✅ signing_process (phase 3)
12. 🏦 **financing_approved = true** (condi au payment_method)
13. ⏳ payment_processing (phase 3) ← CURRENT
14. ▶️ property_transfer (phase 3)
15. ⏳ completed (phase 4)

