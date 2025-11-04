# 🚀 Guide d'Utilisation - Système Unifié Agent & Géomètre

**Date**: 29 Octobre 2025  
**Version**: 1.0

---

## 📋 Résumé des Fichiers Créés

### 1. **Migration SQL** ✅
- **Fichier**: `MIGRATION_AGENT_GEOMETRE_SYSTEM.sql`
- **Lignes**: 730+
- **Contenu**:
  - Tables: `agent_foncier_profiles`, `geometre_profiles`, `surveying_missions`, `agent_reviews`, `geometre_reviews`
  - Modifications: `purchase_cases` (9 nouvelles colonnes)
  - Fonctions: 7 fonctions PostgreSQL
  - Triggers: 7 triggers automatiques
  - Vues: 3 vues utiles
  - Politiques RLS complètes

### 2. **Service JavaScript** ✅
- **Fichier**: `src/services/UnifiedCaseTrackingService.js`
- **Lignes**: 670+
- **Méthodes**: 20+ méthodes
- **Fonctionnalités**:
  - Détection automatique de rôle
  - Chargement complet du dossier avec tous les participants
  - Choix agent foncier
  - Demande bornage géomètre
  - Gestion reviews
  - Paiements commissions/frais

### 3. **Composant React Principal** ✅
- **Fichier**: `src/components/unified/UnifiedCaseTracking.jsx`
- **Lignes**: 400+
- **Features**:
  - Interface adaptative selon le rôle (5 rôles)
  - Tabs: Overview, Timeline, Documents, Messages, Payments, Appointments
  - Affichage participants avec distinction facultatif/obligatoire
  - Détection automatique rôle utilisateur

### 4. **Composants Auxiliaires** ✅
- **Fichier**: `src/components/unified/UnifiedCaseTrackingComponents.jsx`
- **Lignes**: 600+
- **Composants**:
  - `RoleSpecificActions`: Actions selon rôle
  - `BuyerActions`, `SellerActions`, `NotaireActions`, `AgentActions`, `GeometreActions`
  - `DocumentsSection`: Gestion documents
  - `PaymentsSection`: Suivi paiements
  - `MessageBubble`: Messages multi-acteurs

### 5. **Modal Sélection Agent** ✅
- **Fichier**: `src/components/modals/AgentSelectionModal.jsx`
- **Lignes**: 350+
- **Features**:
  - Recherche agents disponibles
  - Filtres par région, rating
  - Affichage détaillé profil agent
  - Assignation avec commission personnalisable

### 6. **Modal Sélection Géomètre** ✅
- **Fichier**: `src/components/modals/GeometreSelectionModal.jsx`
- **Lignes**: 400+
- **Features**:
  - Choix type de mission (complète, bornage, plan, certificat)
  - Recherche géomètres disponibles
  - Affichage équipement (GPS, drone, station totale)
  - Calcul tarif selon type de mission

### 7. **Documentation** ✅
- **Fichier**: `REFONTE_PAGE_SUIVI_DOSSIER_COMPLETE.md`
- **Lignes**: 850+
- **Contenu**:
  - Workflow complet 10 phases
  - Description détaillée 5 acteurs
  - Design interface
  - Actions par rôle

---

## 🎯 Comment Utiliser

### Étape 1: Exécuter la Migration SQL

```bash
# Dans Supabase SQL Editor:
# 1. Copier le contenu de MIGRATION_AGENT_GEOMETRE_SYSTEM.sql
# 2. Coller dans l'éditeur SQL
# 3. Exécuter (Run)
# ✅ Vérifier: "Success. No rows returned"
```

**Tables créées**:
- ✅ `agent_foncier_profiles`
- ✅ `geometre_profiles`
- ✅ `surveying_missions`
- ✅ `agent_reviews`
- ✅ `geometre_reviews`

**Colonnes ajoutées à `purchase_cases`**:
- `agent_foncier_id`, `geometre_id`
- `has_agent`, `has_surveying`
- `agent_commission`, `geometre_fees`
- `agent_commission_paid`, `geometre_fees_paid`
- Timestamps correspondants

---

### Étape 2: Créer des Profils Agent/Géomètre de Test

```sql
-- Créer un agent foncier de test
INSERT INTO profiles (id, email, full_name, role)
VALUES (
  '12345678-1234-1234-1234-123456789abc',
  'agent@test.com',
  'Mamadou Diallo',
  'agent_foncier'
);

INSERT INTO agent_foncier_profiles (
  id, 
  agency_name, 
  agency_region, 
  phone, 
  commission_rate,
  is_verified,
  rating,
  total_sales_completed
)
VALUES (
  '12345678-1234-1234-1234-123456789abc',
  'Agence Teranga Immo',
  'Dakar',
  '+221 77 123 45 67',
  5.00,
  true,
  4.7,
  25
);

-- Créer un géomètre de test
INSERT INTO profiles (id, email, full_name, role)
VALUES (
  '87654321-4321-4321-4321-cba987654321',
  'geometre@test.com',
  'Ibrahima Ndiaye',
  'geometre'
);

INSERT INTO geometre_profiles (
  id,
  cabinet_name,
  phone,
  is_verified,
  rating,
  has_gps,
  has_drone,
  has_total_station,
  total_missions_completed
)
VALUES (
  '87654321-4321-4321-4321-cba987654321',
  'Cabinet Topographie Ndiaye',
  '+221 77 987 65 43',
  true,
  4.8,
  true,
  true,
  true,
  50
);
```

---

### Étape 3: Tester l'Interface

#### A. En tant qu'ACHETEUR

1. **Accéder au dossier**:
   ```
   /unified-case-tracking/:caseId
   ```

2. **Actions disponibles**:
   - ✅ Choisir un agent foncier (bouton "Choisir un agent foncier (Facultatif)")
   - ✅ Commander un bornage (bouton "Commander un bornage (Facultatif)")
   - ✅ Uploader documents
   - ✅ Confirmer paiements
   - ✅ Envoyer messages

3. **Test Choix Agent**:
   - Cliquer sur "Choisir un agent foncier"
   - Modal s'ouvre avec liste agents disponibles
   - Filtrer par région (ex: Dakar)
   - Sélectionner un agent
   - Cliquer "Choisir cet agent"
   - ✅ `has_agent = true`, `agent_foncier_id` rempli

4. **Test Demande Bornage**:
   - Cliquer sur "Commander un bornage"
   - Modal s'ouvre avec liste géomètres
   - Choisir type de mission (Complète, Bornage, Plan, Certificat)
   - Sélectionner un géomètre
   - Voir tarif estimé
   - Cliquer "Demander cette mission"
   - ✅ `has_surveying = true`, `geometre_id` rempli
   - ✅ Ligne créée dans `surveying_missions` avec status='pending'

#### B. En tant qu'AGENT FONCIER

1. **Accéder au dossier**:
   - Voir le badge "Vous êtes Agent Foncier"
   - Voir "Vous avez été choisi par l'acheteur"

2. **Actions disponibles**:
   - Faciliter négociation
   - Collecter documents
   - Suivre commission
   - Confirmer paiement commission

3. **Voir Commission**:
   - Onglet "Paiements"
   - Carte "Commission agent foncier (5%)"
   - Montant calculé automatiquement (5% du prix)

#### C. En tant que GÉOMÈTRE

1. **Accéder au dossier**:
   - Voir le badge "Vous êtes Géomètre"
   - Voir "Mission de bornage"

2. **Actions disponibles**:
   - ✅ Accepter mission
   - Décliner mission
   - Planifier visite terrain
   - Uploader plan de bornage
   - Uploader certificat topographique
   - Saisir coordonnées GPS
   - Clôturer mission

3. **Workflow**:
   ```
   pending → accepted → in_progress → completed
   ```

4. **Test Acceptation**:
   - Cliquer "Accepter mission"
   - Status passe de 'pending' à 'accepted'
   - `accepted_at` rempli
   - `active_missions_count` du géomètre incrémenté (trigger automatique)

---

### Étape 4: Vérifier les Données

```sql
-- Vérifier un dossier
SELECT 
  case_number,
  status,
  has_agent,
  has_surveying,
  agent_commission,
  geometre_fees
FROM purchase_cases
WHERE id = 'YOUR_CASE_ID';

-- Vérifier une mission de bornage
SELECT 
  mission_type,
  status,
  quoted_fee,
  accepted_at,
  completed_at
FROM surveying_missions
WHERE case_id = 'YOUR_CASE_ID';

-- Vérifier les compteurs agent
SELECT 
  agency_name,
  active_cases_count,
  total_sales_completed,
  rating
FROM agent_foncier_profiles
WHERE id = 'AGENT_ID';

-- Vérifier les compteurs géomètre
SELECT 
  cabinet_name,
  active_missions_count,
  total_missions_completed,
  rating
FROM geometre_profiles
WHERE id = 'GEOMETRE_ID';
```

---

## 🔄 Workflow Complet

### Scénario: Achat avec Agent + Géomètre

```
1. 👤 ACHETEUR crée demande d'achat
   → purchase_case créé

2. 👤 ACHETEUR choisit agent foncier (FACULTATIF)
   → Clic "Choisir un agent"
   → Modal → Sélection agent
   → has_agent = true
   → agent_foncier_id rempli
   → active_cases_count++ (trigger)

3. 👤 ACHETEUR demande bornage (FACULTATIF)
   → Clic "Commander un bornage"
   → Modal → Choix type mission
   → Sélection géomètre
   → has_surveying = true
   → geometre_id rempli
   → surveying_mission créée (status='pending')

4. 🏘️ VENDEUR accepte offre
   → status = 'preliminary_agreement'

5. 📐 GÉOMÈTRE accepte mission
   → surveying_mission.status = 'accepted'
   → active_missions_count++ (trigger)

6. 👤 ACHETEUR + 🏘️ VENDEUR choisissent notaire
   → notaire_id rempli
   → status = 'notary_assigned'

7. 📐 GÉOMÈTRE fait bornage
   → status = 'in_progress'
   → Upload plan, certificat, GPS
   → status = 'completed'
   → active_missions_count-- (trigger)
   → total_missions_completed++ (trigger)

8. 👤 ACHETEUR paie acompte
   → deposit_paid = true

9. 👤 ACHETEUR paie frais notaire
   → notaire_fees_paid = true

10. 👤 ACHETEUR paie commission agent (si agent)
    → agent_commission_paid = true

11. 👤 ACHETEUR paie frais géomètre (si bornage)
    → surveying_mission.paid = true

12. ⚖️ NOTAIRE génère contrat
    → status = 'contract_draft'

13. RDV signature
    → status = 'signing_process'

14. 👤 ACHETEUR paie solde
    → final_payment_paid = true

15. ⚖️ NOTAIRE enregistre acte
    → status = 'completed'
    → active_cases_count-- agent (trigger)
    → total_sales_completed++ agent (trigger)

16. 👤 ACHETEUR évalue:
    → agent_reviews (rating, comment)
    → geometre_reviews (rating, comment)
    → Triggers auto-update ratings
```

---

## 📊 Statistiques Auto-Calculées

### Agent Foncier
- `active_cases_count`: Mis à jour par triggers
- `total_sales_completed`: Incrémenté quand case='completed'
- `total_commission_earned`: Cumulé automatiquement
- `rating`: Moyenne des reviews (trigger)
- `reviews_count`: Nombre de reviews (trigger)

### Géomètre
- `active_missions_count`: Mis à jour par triggers
- `total_missions_completed`: Incrémenté quand mission='completed'
- `rating`: Moyenne des reviews (trigger)
- `reviews_count`: Nombre de reviews (trigger)
- `average_completion_days`: Délai moyen calculé (trigger)

---

## 🎨 Interface Adaptative

| Rôle | Badge | Icône | Actions Spécifiques |
|------|-------|-------|---------------------|
| Acheteur | "Vous êtes Acheteur" | 👤 | Choisir agent, Commander bornage, Payer |
| Vendeur | "Vous êtes Vendeur" | 🏘️ | Uploader titre, Valider contrat |
| Notaire | "Vous êtes Notaire" | ⚖️ | Vérifier docs, Générer contrat, RDV |
| Agent | "Vous êtes Agent Foncier" | 🏢 | Négociation, Commission (badge "Facultatif") |
| Géomètre | "Vous êtes Géomètre" | 📐 | Accepter mission, Upload résultats (badge "Facultatif") |

---

## ✅ Checklist de Test

- [ ] Migration SQL exécutée sans erreur
- [ ] Profils agent/géomètre de test créés
- [ ] Page UnifiedCaseTracking accessible
- [ ] Détection automatique de rôle fonctionne
- [ ] Acheteur peut choisir agent (modal s'ouvre)
- [ ] Acheteur peut demander bornage (modal s'ouvre)
- [ ] Agent voit commission dans paiements
- [ ] Géomètre voit mission et peut accepter
- [ ] Triggers mettent à jour compteurs
- [ ] Reviews mettent à jour ratings
- [ ] Paiements suivent agent/géomètre
- [ ] Messages multi-acteurs fonctionnent
- [ ] Timeline affiche tous les événements

---

## 🐛 Troubleshooting

### Erreur: "Column does not exist"
```sql
-- Vérifier que les colonnes existent
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'purchase_cases' 
  AND column_name LIKE '%agent%' OR column_name LIKE '%geometre%';
```

### Erreur: "RLS policy violation"
```sql
-- Vérifier les politiques RLS
SELECT * FROM pg_policies 
WHERE tablename IN ('agent_foncier_profiles', 'geometre_profiles', 'surveying_missions');
```

### Compteurs pas mis à jour
```sql
-- Vérifier les triggers
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_table IN ('purchase_cases', 'surveying_missions', 'agent_reviews', 'geometre_reviews');
```

---

## 📞 Support

Si problème, vérifier:
1. Migration SQL exécutée complètement
2. Politiques RLS activées
3. User authentifié dans Supabase
4. Role correct dans `profiles.role`
5. Browser console pour erreurs React

---

**Bon test ! 🚀**
