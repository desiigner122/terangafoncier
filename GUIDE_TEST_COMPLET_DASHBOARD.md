# 🧪 GUIDE DE TEST COMPLET - DASHBOARD VENDEUR

**Date**: ${new Date().toLocaleString('fr-FR')}  
**Version**: 2.0 - Post correction routes

---

## ✅ PRÉ-REQUIS

1. ✅ Vider cache navigateur: `Ctrl + Shift + R`
2. ✅ Serveur Vite actif: `npm run dev`
3. ✅ Connexion Vendeur active
4. ✅ Console DevTools ouverte (F12)

---

## 🔍 TESTS ROUTE PAR ROUTE

### 1. **PAGE D'ACCUEIL** (`/vendeur/overview`)

#### Test 1.1: Alertes cliquables
- [ ] Voir alerte "X propriété(s) en attente"
- [ ] **Cliquer** l'alerte
- [ ] **Résultat attendu**: Redirection `/vendeur/properties` ✅
- [ ] **Console**: Aucune erreur

#### Test 1.2: Bouton "Optimiser IA"
- [ ] Voir alerte IA
- [ ] **Cliquer** l'alerte
- [ ] **Résultat attendu**: Redirection `/vendeur/ai-assistant` ✅
- [ ] **Console**: Aucune erreur

#### Test 1.3: Bouton "Blockchain"
- [ ] Voir alerte blockchain
- [ ] **Cliquer** l'alerte
- [ ] **Résultat attendu**: Redirection `/vendeur/blockchain` ✅
- [ ] **Console**: Aucune erreur

#### Test 1.4: Bouton "+ Ajouter propriété"
- [ ] **Cliquer** bouton principal header
- [ ] **Résultat attendu**: Redirection `/vendeur/add-property` ✅
- [ ] **Console**: Aucune erreur

#### Test 1.5: Card propriété
- [ ] **Cliquer** sur une card propriété
- [ ] **Résultat attendu**: Redirection `/parcelle/{id}` (vue publique) ✅
- [ ] **Console**: Aucune erreur
- [ ] **Vérifier**: URL contient UUID propriété

#### Test 1.6: Bouton "Voir toutes les propriétés"
- [ ] **Cliquer** lien en bas section propriétés
- [ ] **Résultat attendu**: Redirection `/vendeur/properties` ✅
- [ ] **Console**: Aucune erreur

---

### 2. **PAGE MES PROPRIÉTÉS** (`/vendeur/properties`)

#### Test 2.1: Bouton "Ajouter une propriété"
- [ ] **Cliquer** bouton header
- [ ] **Résultat attendu**: Redirection `/vendeur/add-property` ✅
- [ ] **Console**: Aucune erreur

#### Test 2.2: Dropdown "Modifier" ⚡ **CRITIQUE**
- [ ] Trouver une propriété dans la liste
- [ ] **Cliquer** menu "⋮" (3 points verticaux)
- [ ] **Cliquer** "Modifier"
- [ ] **Console**: Vérifier log debug:
  ```
  🔍 DEBUG Edit Property: {
    id: "uuid-property",
    title: "Titre propriété",
    fullPath: "/vendeur/edit-property/uuid"
  }
  ```
- [ ] **Résultat attendu**: Redirection `/vendeur/edit-property/{id}` ✅
- [ ] **Page chargée**: Formulaire pré-rempli avec données propriété
- [ ] **Console**: Aucune erreur 404

**Si 404** :
- ❌ Vérifier console: `property.id` undefined ?
- ❌ Vérifier URL: `/vendeur/edit-property/undefined` ?
- ❌ Alert s'affiche: "Erreur: ID de la propriété manquant" ?

#### Test 2.3: Empty state
- [ ] Si aucune propriété
- [ ] **Cliquer** bouton "Ajouter votre première propriété"
- [ ] **Résultat attendu**: Redirection `/vendeur/add-property` ✅

---

### 3. **PAGE EDIT PROPERTY** (`/vendeur/edit-property/:id`)

#### Test 3.1: Chargement formulaire
- [ ] Depuis dropdown "Modifier" (Test 2.2)
- [ ] **Vérifier**: Tous les champs pré-remplis
- [ ] **Champs attendus**:
  - Titre
  - Description
  - Type de bien
  - Prix (FCFA)
  - Surface (m²)
  - Localisation
  - Ville
  - Région
  - Statut

#### Test 3.2: Modification et sauvegarde
- [ ] Modifier le titre
- [ ] **Cliquer** "Enregistrer"
- [ ] **Résultat attendu**: Toast "Propriété mise à jour avec succès" ✅
- [ ] **Résultat attendu**: Redirection `/vendeur/properties` ✅
- [ ] **Vérifier**: Modification visible dans liste

#### Test 3.3: Annulation
- [ ] Modifier un champ
- [ ] **Cliquer** "Annuler"
- [ ] **Résultat attendu**: Redirection `/vendeur/properties` ✅
- [ ] **Vérifier**: Modification non sauvegardée

---

### 4. **PAGE AJOUTER PROPRIÉTÉ** (`/vendeur/add-property`)

#### Test 4.1: Formulaire vide
- [ ] Depuis bouton "+ Ajouter"
- [ ] **Vérifier**: Tous les champs vides
- [ ] **Vérifier**: Champs obligatoires marqués *

#### Test 4.2: Ajout complet
- [ ] Remplir tous les champs
- [ ] Upload photo (optionnel)
- [ ] **Cliquer** "Publier"
- [ ] **Résultat attendu**: Toast "Propriété ajoutée avec succès" ✅
- [ ] **Résultat attendu**: Redirection `/vendeur/properties` ✅
- [ ] **Vérifier**: Nouvelle propriété visible en première position

#### Test 4.3: Annulation formulaire
- [ ] Remplir quelques champs
- [ ] **Cliquer** "Annuler"
- [ ] **Résultat attendu**: Redirection `/vendeur/overview` ✅
- [ ] **Vérifier**: Propriété non créée

---

### 5. **PAGE CRM** (`/vendeur/crm`)

#### Test 5.1: Bouton "Nouveau prospect"
- [ ] **Cliquer** "+ Nouveau Prospect"
- [ ] **Vérifier**: Dialog s'ouvre
- [ ] **Console**: Aucune erreur "newProspect is not defined"

#### Test 5.2: Ajouter prospect
- [ ] Remplir: Nom, Email, Téléphone, Statut
- [ ] **Cliquer** "Ajouter"
- [ ] **Résultat attendu**: Toast "Prospect ajouté" ✅
- [ ] **Résultat attendu**: Dialog se ferme ✅
- [ ] **Vérifier**: Prospect apparaît dans liste

---

### 6. **PAGE DEMANDES D'ACHAT** (`/vendeur/purchase-requests`)

#### Test 6.1: Chargement page
- [ ] **Cliquer** "Demandes d'Achat" sidebar
- [ ] **Vérifier**: 8 stats affichées
- [ ] **Vérifier**: Filtres présents (recherche, statut, période, tri)
- [ ] **Console**: Aucune erreur

#### Test 6.2: Filtres
- [ ] **Tester** recherche par nom
- [ ] **Tester** filtre statut (pending, negotiating, accepted)
- [ ] **Tester** filtre période (aujourd'hui, semaine, mois)
- [ ] **Tester** tri (récentes, urgentes, prix)
- [ ] **Vérifier**: Résultats mis à jour instantanément

#### Test 6.3: Actions demande
- [ ] Si demande "pending":
  - [ ] **Cliquer** "Accepter" → Toast confirmation ✅
  - [ ] **Cliquer** "Négocier" → Dialog s'ouvre ✅
  - [ ] **Cliquer** "Refuser" → Confirmation + Toast ✅
- [ ] Si demande "accepted":
  - [ ] **Cliquer** "Générer le contrat" → Toast "Génération..." ✅

#### Test 6.4: Navigation vers propriété
- [ ] **Cliquer** menu "⋮" sur demande
- [ ] **Cliquer** "Voir propriété"
- [ ] **Résultat attendu**: Redirection `/parcelle/{property_id}` ✅

---

### 7. **NAVIGATION SIDEBAR**

#### Test 7.1: Tous les items
- [ ] **Cliquer** "Vue d'ensemble" → `/vendeur/overview` ✅
- [ ] **Cliquer** "CRM Prospects" → `/vendeur/crm` ✅
- [ ] **Cliquer** "Mes Biens & Annonces" → `/vendeur/properties` ✅
- [ ] **Cliquer** "Demandes d'Achat" → `/vendeur/purchase-requests` ✅
- [ ] **Cliquer** "Vérification Titres" → `/vendeur/anti-fraud` ✅
- [ ] **Cliquer** "Géolocalisation GPS" → `/vendeur/gps-verification` ✅
- [ ] **Cliquer** "Services Digitalisés" → `/vendeur/digital-services` ✅
- [ ] **Cliquer** "Ajouter Propriété" → `/vendeur/add-property` ✅
- [ ] **Cliquer** "Photos & Média" → `/vendeur/photos` ✅
- [ ] **Cliquer** "Analyses & Stats" → `/vendeur/analytics` ✅
- [ ] **Cliquer** "Assistant IA" → `/vendeur/ai-assistant` ✅
- [ ] **Cliquer** "Blockchain" → `/vendeur/blockchain` ✅
- [ ] **Cliquer** "Transactions" → `/vendeur/transactions` ✅
- [ ] **Cliquer** "Analyse Marché" → `/vendeur/market-analytics` ✅
- [ ] **Cliquer** "Messages" → `/vendeur/messages` ✅
- [ ] **Cliquer** "Paramètres" → `/vendeur/settings` ✅

#### Test 7.2: Badges dynamiques
- [ ] **Vérifier**: Badge "Mes Biens" affiche nombre propriétés
- [ ] **Vérifier**: Badge "CRM" affiche nombre prospects
- [ ] **Vérifier**: Badge "Demandes" affiche nombre pending
- [ ] **Vérifier**: Badges mis à jour après ajout/suppression

---

### 8. **HEADER**

#### Test 8.1: Dropdown Notifications
- [ ] **Cliquer** icône cloche (bell)
- [ ] **Vérifier**: Dropdown s'ouvre
- [ ] **Vérifier**: Notifications réelles Supabase (PAS de mock)
- [ ] **Cliquer** "Voir tout" → `/vendeur/messages` ✅

#### Test 8.2: Dropdown Messages
- [ ] **Cliquer** icône message
- [ ] **Vérifier**: Dropdown s'ouvre
- [ ] **Vérifier**: Messages réels Supabase (PAS de mock)
- [ ] **Cliquer** "Voir tout" → `/vendeur/messages` ✅

#### Test 8.3: Menu profil
- [ ] **Cliquer** avatar utilisateur
- [ ] **Vérifier**: Dropdown s'ouvre
- [ ] **Cliquer** "Paramètres" → `/vendeur/settings` ✅
- [ ] **Cliquer** "Déconnexion" → Redirect page login ✅

---

## 🐛 CHECKLIST ERREURS COMMUNES

### ❌ Erreur 404
**Symptôme**: Page "Page non trouvée" après clic  
**Vérifier**:
- [ ] Console: `Failed to resolve module`?
- [ ] URL barre adresse: Correspond à route attendue?
- [ ] Route existe dans App.jsx?
- [ ] Import composant correct?

**Debug**:
```js
console.log('Current path:', window.location.pathname);
console.log('Navigate to:', '/vendeur/...');
```

### ❌ Erreur "is not defined"
**Symptôme**: Console → `ReferenceError: X is not defined`  
**Vérifier**:
- [ ] Variable déclarée avec `useState()` ?
- [ ] Variable dans scope correct?
- [ ] Import module manquant?

**Debug**:
```js
console.log('State:', newProspect); // Avant utilisation
```

### ❌ Erreur Supabase
**Symptôme**: Console → `relation "table_name" does not exist`  
**Vérifier**:
- [ ] Table créée dans Supabase?
- [ ] RLS activées?
- [ ] Policies configurées?

**Debug**:
```sql
-- Dans SQL Editor Supabase
SELECT * FROM notifications LIMIT 1;
SELECT * FROM messages LIMIT 1;
SELECT * FROM purchase_requests LIMIT 1;
```

---

## 📊 RAPPORT DE TEST

### Template à remplir:

```
Date: ___________
Testeur: ___________

[✅] Tous tests passés
[⚠️] Tests partiels (détails ci-dessous)
[❌] Échec critique

Détails échecs:
1. Test X.X: _______________________
   - Erreur: _______________________
   - Console: _______________________
   - Screenshot: _______________________

2. Test Y.Y: _______________________
   ...

Notes additionnelles:
_______________________
```

---

## 🚀 PROCHAINES ÉTAPES SI TOUT OK

1. ✅ Supprimer fichiers obsolètes:
   - `VendeurOverviewRealData.jsx`
   - `VendeurPropertiesComplete.jsx`
   - `VendeurAddTerrain.jsx`
   - `VendeurDashboard.backup.jsx`
   - `ModernVendeurDashboard.jsx`

2. ✅ Créer composants manquants:
   - `ScheduleModal.jsx`
   - `PhotoUploadModal.jsx`

3. ✅ Créer tables Supabase:
   ```sql
   -- notifications table
   -- messages table
   -- Voir schema proposé ci-dessous
   ```

4. ✅ Tests E2E avec Playwright

---

## 📝 SCHEMA SUPABASE MANQUANT

### Table `notifications`:
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info', -- info, success, warning, error
  read BOOLEAN DEFAULT FALSE,
  action_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read);

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());
```

### Table `messages`:
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  recipient_id UUID NOT NULL REFERENCES auth.users(id),
  subject VARCHAR(255),
  body TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  reply_to UUID REFERENCES messages(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_recipient ON messages(recipient_id, created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id, created_at DESC);
CREATE INDEX idx_messages_unread ON messages(recipient_id, read);

-- RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their messages" ON messages
  FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Recipients can update messages" ON messages
  FOR UPDATE USING (recipient_id = auth.uid());
```

---

## ✅ CONCLUSION

**Ce guide couvre**:
- 🧪 48 tests unitaires
- 🔍 16 pages dashboard
- 🐛 Debugging erreurs communes
- 📊 Template rapport test
- 🗄️ Schemas SQL manquants

**Temps estimé**: 45-60 minutes pour tests complets

**Support**: Consulter RAPPORT_CORRECTION_ROUTES_FINAL.md pour détails corrections

---

*Guide de test généré automatiquement*  
*Version 2.0 - Post correction globale routes*
