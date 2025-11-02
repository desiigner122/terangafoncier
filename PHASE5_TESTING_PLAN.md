# Phase 5: Tests & Documentation - Plan de Validation

## 🎯 Objectif
Valider que le workflow complet à 3 acteurs fonctionne correctement avec toutes les fonctionnalités implémentées.

---

## ✅ Checklist de Tests End-to-End

### 1. Workflow d'Approbation Notaire

#### Test 1.1: Proposition par l'acheteur
- [ ] L'acheteur peut proposer un notaire depuis son dashboard
- [ ] `buyer_approved` est automatiquement mis à `true`
- [ ] Timeline event créé: "L'acheteur a proposé un notaire"
- [ ] Carte d'approbation apparaît côté vendeur
- [ ] Notaire ne voit PAS encore le dossier (statut pending)

#### Test 1.2: Approbation par le vendeur
- [ ] Vendeur voit la carte bleue "Notaire proposé - Approbation requise"
- [ ] Informations du notaire affichées (nom, email, téléphone)
- [ ] Statut acheteur: ✓ Approuvé par l'acheteur (vert)
- [ ] Bouton "Approuver ce notaire" visible
- [ ] Click ouvre dialog de confirmation
- [ ] Dialog affiche statut acheteur avec badge vert
- [ ] Confirmation enregistre `seller_approved: true`
- [ ] Status passe à `both_approved`
- [ ] Timeline event créé: "Le vendeur a approuvé le notaire"
- [ ] **Notification envoyée à l'acheteur**: "Le vendeur a approuvé [notaire]. Les deux parties ont approuvé."
- [ ] **Notification envoyée au notaire**: "✅ Dossier prêt à accepter - Les deux parties ont approuvé"

#### Test 1.3: Acceptation par le notaire
- [ ] Notaire reçoit notification de dossier prêt
- [ ] Notaire voit le dossier dans sa liste (via RLS policy)
- [ ] Carte jaune "Assignation en attente" affichée
- [ ] Approbations visibles: ✓ Acheteur ✓ Vendeur (tous deux verts)
- [ ] Bouton "Accepter" et "Décliner" disponibles
- [ ] Click "Accepter" ouvre dialog avec champs:
  - Honoraires notariaux (required)
  - Débours (optional)
  - Justification (optional)
- [ ] Validation: ne peut pas accepter si honoraires vides
- [ ] Acceptation réussie:
  - `notaire_status: 'accepted'`
  - `status: 'contract_preparation'`
  - `notaire_id` synchronisé dans purchase_cases (via trigger)
  - Timeline event créé: "Notaire a accepté le dossier"
  - **Notifications envoyées** à acheteur ET vendeur

#### Test 1.4: Validation des refus
- [ ] Notaire peut décliner avec raison obligatoire
- [ ] Timeline event créé avec raison du refus
- [ ] Notifications envoyées aux deux parties
- [ ] Statut assignment passe à 'declined'

### 2. Gestion des Frais Notariaux

#### Test 2.1: Définition initiale
- [ ] Après acceptation, carte "Gestion des Frais Notariaux" apparaît (bleue)
- [ ] Si frais non définis: carte jaune warning "⚠️ Frais non encore définis"
- [ ] Bouton "Définir les frais notariaux" visible
- [ ] Click ouvre dialog avec:
  - Champ honoraires (required, avec helper text)
  - Champ débours (optional, avec helper text)
  - Justification (optional, textarea)
  - Aperçu live du total en carte bleue
- [ ] Validation: honoraires > 0 requis
- [ ] Soumission réussie:
  - `quoted_fee` et `quoted_disbursements` enregistrés
  - `fees_updated_at` timestamp créé
  - Timeline event: "Frais notariaux définis"
  - Carte mise à jour avec tableau des frais

#### Test 2.2: Modification des frais
- [ ] Carte affiche frais actuels avec bouton "Modifier les frais"
- [ ] Click pré-remplit dialog avec valeurs actuelles
- [ ] Peut modifier et sauvegarder
- [ ] Timeline event: "Frais notariaux mis à jour" (avec old_fee → new_fee)
- [ ] `fees_updated_at` mis à jour

### 3. Boutons d'Action Contextuels

#### Test 3.1: Actions acheteur
- [ ] `select_notary` apparaît si pas de notaire (rouge, priorité haute, OBLIGATOIRE)
- [ ] `upload_identity` à étape buyer_verification
- [ ] `pay_deposit` aux étapes appropriées avec montant
- [ ] `pay_notary_fees` après définition des frais
- [ ] `review_contract` à étape contract_preparation
- [ ] `confirm_appointment` à signing_appointment
- [ ] `pay_balance` à final_payment avec calcul du solde

#### Test 3.2: Actions vendeur
- [ ] `select_notary` apparaît si pas de notaire (orange, RECOMMANDÉ)
- [ ] `accept_offer` aux étapes de négociation
- [ ] `upload_title_deed` pour documents de propriété
- [ ] `validate_contract` à contract_preparation
- [ ] `confirm_appointment` à signing_appointment

#### Test 3.3: Actions notaire
- [ ] `set_notary_fees` après acceptation (bleu, REQUIS si pas défini)
- [ ] `verify_buyer_identity` à buyer_verification
- [ ] `verify_title_cadastre` à title_verification
- [ ] `generate_contract` à contract_preparation
- [ ] `schedule_appointment` à appointment_scheduling
- [ ] `confirm_fees_received` à contract_validation/final_payment
- [ ] `register_deed` à registration

### 4. Notifications Automatiques

#### Test 4.1: Notifications via service
- [ ] approveNotaire() envoie notification à l'autre partie
- [ ] approveNotaire() envoie notification au notaire si both_approved
- [ ] Messages appropriés selon le contexte

#### Test 4.2: Notifications via trigger SQL
- [ ] Timeline INSERT déclenche create_notification_on_timeline()
- [ ] Notifications créées pour acheteur (sauf si c'est lui le sender)
- [ ] Notifications créées pour vendeur (sauf si c'est lui le sender)
- [ ] Notifications créées pour notaire (sauf si c'est lui le sender)
- [ ] Type de notification correct selon event_type

#### Test 4.3: Affichage notifications
- [ ] Badge avec compteur dans header
- [ ] Dropdown affiche notifications récentes
- [ ] Click sur notification marque comme lu
- [ ] Realtime: nouvelles notifications apparaissent instantanément

### 5. Realtime Synchronisation

#### Test 5.1: useRealtimeCaseSync
- [ ] Souscrit à 6 tables: purchase_cases, documents, messages, timeline, history, assignments
- [ ] Changements détectés en temps réel
- [ ] Callback appelé pour recharger données

#### Test 5.2: NotificationService subscriptions
- [ ] subscribeToUserNotifications() fonctionne
- [ ] subscribeToCaseUpdates() fonctionne
- [ ] subscribeToNotaireAssignments() fonctionne
- [ ] Multiples utilisateurs voient les changements simultanément

### 6. RLS Policies & Sécurité

#### Test 6.1: Notaire RLS
- [ ] Notaire voit seulement ses dossiers assignés
- [ ] Notaire ne voit PAS dossiers d'autres notaires
- [ ] SELECT purchase_cases fonctionne via notaire_id OU assignments
- [ ] UPDATE purchase_cases autorisé avec restrictions
- [ ] Notaire ne peut PAS changer buyer_id, seller_id
- [ ] SELECT/INSERT documents autorisés
- [ ] SELECT/INSERT messages autorisés
- [ ] INSERT timeline autorisé

#### Test 6.2: Acheteur/Vendeur RLS
- [ ] Voient leurs propres dossiers
- [ ] Voient les assignations de leurs dossiers
- [ ] Ne voient PAS dossiers d'autres utilisateurs

### 7. Triggers SQL

#### Test 7.1: sync_notaire_id_on_acceptance
- [ ] Quand notaire_status → 'accepted'
- [ ] purchase_cases.notaire_id est mis à jour automatiquement
- [ ] Log NOTICE visible dans console Supabase

#### Test 7.2: update_case_progress
- [ ] Status change déclenche calcul progress_percentage
- [ ] Pourcentage correct selon mapping (0-100%)
- [ ] Ne déclenche PAS si status identique

#### Test 7.3: create_notification_on_timeline
- [ ] INSERT dans timeline déclenche fonction
- [ ] 3 notifications créées (acheteur, vendeur, notaire)
- [ ] Sender exclu des notifications
- [ ] Type notification correct selon event_type

#### Test 7.4: update_updated_at_column
- [ ] updated_at mis à jour sur UPDATE purchase_cases
- [ ] updated_at mis à jour sur UPDATE notaire_case_assignments

---

## 🐛 Tests de Cas Limites

### Edge Case 1: Notaire refuse AVANT approbation vendeur
- [ ] Acheteur propose → buyer_approved: true
- [ ] Notaire refuse directement
- [ ] Système gère correctement (pas de both_approved)

### Edge Case 2: Deux notaires proposés successivement
- [ ] Premier notaire décline
- [ ] Deuxième notaire proposé
- [ ] Workflow redémarre correctement

### Edge Case 3: Modifications concurrentes
- [ ] Acheteur et vendeur modifient simultanément
- [ ] Pas de conflit de données
- [ ] Realtime synchronise correctement

### Edge Case 4: Notaire modifie frais plusieurs fois
- [ ] Timeline track chaque modification
- [ ] old_fee → new_fee correct dans metadata
- [ ] fees_updated_at timestamp mis à jour

---

## 📊 Tests de Performance

- [ ] Chargement dashboard < 2s avec 10 dossiers
- [ ] Realtime updates latence < 500ms
- [ ] Notifications delivered < 1s
- [ ] Timeline avec 50+ events charge rapidement

---

## 📝 Documentation à Créer

### Pour Développeurs
- [ ] Architecture diagram du workflow 3 acteurs
- [ ] Schéma base de données avec relations
- [ ] API documentation NotaireAssignmentService
- [ ] Guide d'intégration ContextualActionsService

### Pour Utilisateurs
- [ ] Guide acheteur: "Comment choisir un notaire"
- [ ] Guide vendeur: "Approuver le notaire proposé"
- [ ] Guide notaire: "Accepter et gérer un dossier"
- [ ] FAQ: Workflow d'approbation

---

## 🔍 Checklist de Déploiement

### Avant déploiement
- [ ] Tous les tests passed
- [ ] RLS policies appliquées en production
- [ ] Triggers créés en production
- [ ] Indexes performance créés
- [ ] Backup base de données

### Après déploiement
- [ ] Monitoring logs Supabase
- [ ] Vérifier notifications delivery
- [ ] Vérifier realtime connections
- [ ] Test avec comptes réels
- [ ] Hotfix ready si besoin

---

## 📈 Métriques de Succès

- ✅ 100% des approbations trackées dans timeline
- ✅ 100% des notifications delivrées en < 1s
- ✅ 0 erreurs RLS permissions
- ✅ 0 cas de notaire_id non synchronisé
- ✅ < 0.5% erreurs realtime connections

---

**Status**: 🚧 En attente de tests
**Prochaine étape**: Exécuter tests manuels dans environnement de dev
