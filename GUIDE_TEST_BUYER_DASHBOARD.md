# GUIDE DE TEST - NOUVELLES PAGES ACHETEUR

## 🚀 Démarrage rapide

### 1. Démarrer le serveur local

```bash
npm run dev
# Le serveur sera à http://localhost:5173
```

### 2. Se connecter en tant qu'acheteur

1. Aller à http://localhost:5173/login
2. Entrer les identifiants d'un acheteur:
   - Email: `acheteur@test.com` (ou créer un compte)
   - Password: `password123`

3. Naviguer à `/acheteur`

---

## 📋 Test 1: Page "Mes Achats" (Liste)

### URL
```
http://localhost:5173/acheteur/mes-achats
```

### Ce qu'on doit voir

✅ **Header**
- Titre: "Mes Achats"
- Bouton "+ Nouvelle demande"
- KPIs: Total, En cours, Complétées, En attente, Documents, Messages

✅ **Filtres et recherche**
- Champ de recherche (par numéro, localisation, vendeur)
- Dropdown "Filtrer par statut"
- Dropdown "Trier par"

✅ **Liste des dossiers**
- Chaque dossier affiche:
  - Logo maison + titre propriété
  - Localisation
  - Prix
  - Statut (badge coloré)
  - Dates création/modification
  - Participants (Vendeur, Notaire, Géomètre)
  - Boutons "Voir" et "Discuter"

### Tests à faire

1. **Filtrage par statut**
   - Cliquer "Initiée" → voir que les dossiers initiés
   - Cliquer "Complétée" → voir les complétés
   - Cliquer "Tous les statuts" → reset

2. **Recherche**
   - Taper numéro de cas (ex: "CASE-001")
   - Taper localisation (ex: "Dakar")
   - Taper email vendeur (ex: "vendeur@")

3. **Tri**
   - "Récemment modifié" → dossiers récents en haut
   - "Plus ancien" → inversé
   - "Prix" → ordre décroissant

4. **Cliquer "Voir"**
   - Doit naviguer à `/acheteur/cases/{case_number}`

5. **Cliquer "Discuter"**
   - Doit naviguer à `/acheteur/messages?case={case_number}`

6. **Bouton "+ Nouvelle demande"**
   - Doit naviguer à `/acheteur/creer-demande` (ou form)

### Erreurs à vérifier

- ❌ Chargement infini?
- ❌ Erreur de console (F12)?
- ❌ Dossier ne s'affiche pas?
- ❌ Participants manquants?

---

## 🎯 Test 2: Page Dossier Détail (ModernBuyerCaseTrackingV2)

### URL
```
http://localhost:5173/acheteur/cases/CASE-001
# Remplacer CASE-001 par un vrai case_number
```

### Ce qu'on doit voir

✅ **Header**
- Bouton retour
- Titre: "Dossier #CASE-001"
- Propriété et localisation
- Badge statut

✅ **Barre de progression**
- Barre visuelle 0-100%
- Pourcentage
- Minibarres colorées (12 étapes)

✅ **Onglets** (5 onglets)
1. **Aperçu**
2. **Participants**
3. **Documents**
4. **Tâches**
5. **Messages**

---

### Test Onglet 1: Aperçu

**Voir 3 cartes:**

1. **Propriété**
   - Titre: "Aperçu"
   - Titre bien
   - Localisation
   - Surface
   - Prix (gros chiffres bleu)

2. **Dates**
   - Titre: "Dates"
   - Créée le (date)
   - Modifiée le (date)
   - Durée (X jours)

3. **Statistiques**
   - Titre: "Statistiques"
   - Documents (nombre)
   - Messages (nombre)
   - Tâches (nombre)

**Tests:**
- [ ] Tous les chiffres sont présents
- [ ] Dates formatées correctement (FR)
- [ ] Prix s'affiche en CFA
- [ ] Icônes s'affichent

---

### Test Onglet 2: Participants

**Voir 5 cartes (une par rôle):**

1. **Acheteur** (toi, connecté)
   - Avatar
   - Nom complet
   - Email
   - Téléphone
   - Boutons: Email, Message

2. **Vendeur**
   - Si assigné: affiche infos
   - Si pas assigné: "Non assigné"

3. **Notaire**
   - Si assigné: affiche infos
   - Si pas assigné: "Non assigné"

4. **Géomètre**
   - Si assigné: affiche infos
   - Si pas assigné: "Non assigné"

5. **Agent Foncier**
   - Si assigné: affiche infos
   - Si pas assigné: "Non assigné"

**Tests:**
- [ ] Ton avatar et infos sont correctes
- [ ] Vendeur affiche son nom et email
- [ ] Participants non assignés affichent "Non assigné"
- [ ] Clique "Email" → ouvre client mail? (ou copie email)
- [ ] Clique "Message" → ouvre chat avec participant

---

### Test Onglet 3: Documents

**Voir liste des documents:**
- Icône fichier
- Nom document
- Date upload
- Bouton télécharger

**S'il n'y a pas de documents:**
- "Aucun document" + icône

**Tests:**
- [ ] Documents listés s'il y en a
- [ ] Dates formatées correctement
- [ ] Clique télécharger → télécharge fichier

---

### Test Onglet 4: Tâches

**Voir liste des tâches:**
- Checkbox (☐ ou ☑)
- Titre tâche
- Description
- Date d'échéance

**S'il n'y a pas de tâches:**
- "Aucune tâche" + icône

**Tests:**
- [ ] Tâches listées s'il y en a
- [ ] Checkbox change état au clic
- [ ] Dates d'échéance sont visibles
- [ ] Tasks complétées ont strikethrough

---

### Test Onglet 5: Messages

**Voir chat:**
- Historique des messages
- Acheteur à droite, autres à gauche
- Avatars
- Noms
- Horodatage

**Zone de saisie:**
- Textarea "Votre message..."
- Bouton "Attacher fichier"
- Bouton "Envoyer"

**Tests:**
- [ ] Messages existants affichés
- [ ] Ton message à droite, autres à gauche
- [ ] Avatars affichés
- [ ] Tape message → clique Envoyer → message envoyé
- [ ] Nouveau message apparaît en temps réel
- [ ] Textarea vide après envoi

---

## 🔄 Test 3: Synchronisation en temps réel

### Scénario 1: Vendeur accepte demande

1. **Acheteur**: Ouvre `/acheteur/mes-achats`
2. **Autre navigateur (vendeur)**: Accepte la demande
3. **Acheteur**: Sans rafraîchir, la demande change de statut

**Test:**
- [ ] Statut se met à jour < 1s
- [ ] Pas besoin de F5

### Scénario 2: Vendeur assigne notaire

1. **Acheteur**: Ouvre `/acheteur/cases/CASE-001`
2. **Autre navigateur (vendeur)**: Assigne notaire
3. **Acheteur**: Onglet "Participants" se met à jour

**Test:**
- [ ] Notaire apparaît dans liste
- [ ] Sans F5
- [ ] < 1s

### Scénario 3: Message en temps réel

1. **Acheteur**: Ouvre onglet "Messages"
2. **Autre navigateur (vendeur)**: Envoie message
3. **Acheteur**: Message apparaît

**Test:**
- [ ] Message visible sans F5
- [ ] < 500ms

---

## 🐛 Débogage

### Si la page charge pas (404)

```
GET /acheteur/mes-achats → 404
```

**Solutions:**
1. Vérifier que tu es connecté (check cookie)
2. Vérifier que tu es "Acheteur" role
3. Vérifier app.jsx a les routes

```javascript
<Route path="mes-achats" element={<ParticulierMesAchatsRefactored />} />
<Route path="cases/:caseNumber" element={<ModernBuyerCaseTrackingV2 />} />
```

### Si données ne chargent pas

**Console (F12):**
```javascript
// Vérifier erreurs Supabase
// Chercher "❌ Error loading"

// Vérifier RLS policies
// Chercher "401 Unauthorized"
```

**Solutions:**
1. Vérifier `user` est correct (F12 → console)
2. Vérifier RLS policies sur `purchase_cases`
3. Vérifier `buyer_id` dans purchase_cases

### Si synchronisation ne marche pas

**Console:**
```javascript
// Chercher "🔄 Real-time update detected"
// Si pas d'update, Realtime est down
```

**Solutions:**
1. Vérifier Realtime est activé dans Supabase
2. Vérifier table `purchase_cases` a "Realtime" enabled
3. Vérifier RealtimeSyncService subscribeToBuyerRequests()

---

## ✅ Checklist de test complète

### Acheteur - Page Liste

- [ ] Page se charge
- [ ] KPIs affichent les bons chiffres
- [ ] Recherche fonctionne
- [ ] Filtrage par statut fonctionne
- [ ] Tri par date/prix fonctionne
- [ ] Clic "Voir" → navigate to details
- [ ] Clic "Discuter" → navigate to messages
- [ ] Clic "+ Nouvelle" → navigate to form
- [ ] Pas d'erreur console

### Acheteur - Page Détail

- [ ] Page se charge
- [ ] Barre progression visible
- [ ] Onglet "Aperçu":
  - [ ] Propriété affichée
  - [ ] Dates correctes
  - [ ] Statistiques correctes
- [ ] Onglet "Participants":
  - [ ] Tous les rôles affichés
  - [ ] Infos correctes
  - [ ] "Non assigné" pour participants vides
- [ ] Onglet "Documents":
  - [ ] Documents listés (ou "Aucun")
  - [ ] Téléchargement fonctionne
- [ ] Onglet "Tâches":
  - [ ] Tâches listées (ou "Aucune")
  - [ ] Checkbox fonctionne
- [ ] Onglet "Messages":
  - [ ] Messages historique affichés
  - [ ] Envoi nouveau message fonctionne
  - [ ] Nouveau message visible immédiatement
- [ ] Pas d'erreur console

### Synchronisation

- [ ] Changement vendeur → acheteur voit < 1s
- [ ] Pas de délai visible
- [ ] Temps réel fonctionne

---

## 📸 Screenshots à prendre

Pour documentation:
1. Liste des achats (mes-achats)
2. Détail cas (aperçu tab)
3. Participants tab
4. Messages tab
5. Synchronisation en temps réel (show console logs)

---

## 📝 Rapport de test

Après avoir testé, compléter:

```
Date: __________
Testeur: __________
Environnement: local / staging / production

Tests réussis: __/20
Tests échoués: __/20

Bugs trouvés:
1. ____________________________
2. ____________________________

Feedback:
____________________________
____________________________

Prêt pour production: OUI / NON
```

---

## 🎬 Prochaines étapes

- [ ] Tester page vendeur (RefactoredVendeurCaseTrackingV2 à créer)
- [ ] Tester synchronisation entre acheteur et vendeur
- [ ] Créer dashboards notaire/géomètre
- [ ] Tester notifications
- [ ] Performance testing (1000+ dossiers)
- [ ] Déployer en staging
- [ ] Déployer en production
