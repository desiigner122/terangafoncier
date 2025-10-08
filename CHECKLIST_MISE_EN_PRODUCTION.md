# ✅ CHECKLIST MISE EN PRODUCTION - TERANGA FONCIER

## 📌 AVANT DE COMMENCER

**Temps estimé total : 30-45 minutes**
**Pré-requis :**
- ✅ Accès Supabase Dashboard
- ✅ Projet en cours d'exécution (`npm run dev`)
- ✅ Compte admin et compte vendeur de test

---

## 🗄️ PARTIE 1 : BASE DE DONNÉES (15 min)

### ÉTAPE 1.1 : Vérifier les extensions PostgreSQL ⏱️ 2 min
```
□ Aller sur Supabase Dashboard
□ Database → Extensions
□ Vérifier que ces extensions sont activées :
  □ uuid-ossp
  □ postgis (ou PostGIS)
  □ pg_trgm
□ Si manquantes, les activer via SQL Editor :
```

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

---

### ÉTAPE 1.2 : Exécuter SCRIPT_COMPLET_UNIQUE.sql ⏱️ 5 min
```
□ Ouvrir Supabase Dashboard
□ Aller dans SQL Editor
□ Cliquer "New Query"
□ Ouvrir le fichier : supabase-migrations/SCRIPT_COMPLET_UNIQUE.sql
□ Copier TOUT le contenu (Ctrl+A, Ctrl+C)
□ Coller dans SQL Editor
□ Cliquer "RUN" (en bas à droite)
□ Attendre 10-15 secondes
```

**✅ VÉRIFICATION ATTENDUE :**
```
Query completed successfully in XXms

À la fin, vous devriez voir :
========================
RÉSUMÉ DE LA CONFIGURATION
========================
TABLES CRÉÉES: 2
- properties
- property_photos

COLONNES PROPERTIES: ~60
COLONNES PROPERTY_PHOTOS: 10

INDEX CRÉÉS: 16
TRIGGERS CRÉÉS: 4
POLITIQUES RLS: 10
POLITIQUES STORAGE: 8

✅ CONFIGURATION TERMINÉE !
```

**❌ EN CAS D'ERREUR :**
- Si "extension does not exist" → Faire l'étape 1.1 d'abord
- Si "table already exists" → Ajouter `DROP TABLE IF EXISTS` en début de script
- Si "bucket does not exist" → Ignorer cette erreur, nous créons les buckets après

---

### ÉTAPE 1.3 : Exécuter TABLES_COMPLEMENTAIRES.sql ⏱️ 3 min
```
□ Rester dans SQL Editor
□ Cliquer "New Query"
□ Ouvrir le fichier : supabase-migrations/TABLES_COMPLEMENTAIRES.sql
□ Copier TOUT le contenu
□ Coller dans SQL Editor
□ Cliquer "RUN"
□ Attendre 5-10 secondes
```

**✅ VÉRIFICATION ATTENDUE :**
```
========================
RÉSUMÉ
========================
TABLES COMPLÉMENTAIRES CRÉÉES: 3
- subscriptions
- notifications
- messages

POLITIQUES RLS CRÉÉES: 12

✅ TABLES COMPLÉMENTAIRES CRÉÉES !
```

---

### ÉTAPE 1.4 : Vérifier les tables créées ⏱️ 2 min
```
□ Aller dans Table Editor (menu gauche)
□ Vérifier que ces 5 tables existent :
  □ properties
  □ property_photos
  □ subscriptions
  □ notifications
  □ messages
```

**✅ Si toutes les tables sont là : PARFAIT ! Passez à la partie 2.**

---

## 📦 PARTIE 2 : STORAGE BUCKETS (5 min)

### ÉTAPE 2.1 : Créer bucket property-photos ⏱️ 2 min
```
□ Aller dans Storage (menu gauche)
□ Cliquer "Create a new bucket"
□ Remplir :
  Name: property-photos
  Public bucket: ✅ COCHER (très important !)
  File size limit: 5 MB
  Allowed MIME types: image/jpeg, image/png, image/webp, image/jpg
□ Cliquer "Create bucket"
```

**✅ VÉRIFICATION :**
- Le bucket "property-photos" apparaît dans la liste
- Badge "Public" affiché

---

### ÉTAPE 2.2 : Créer bucket property-documents ⏱️ 2 min
```
□ Cliquer "Create a new bucket"
□ Remplir :
  Name: property-documents
  Public bucket: ❌ NE PAS COCHER
  File size limit: 10 MB
  Allowed MIME types: application/pdf
□ Cliquer "Create bucket"
```

**✅ VÉRIFICATION :**
- Le bucket "property-documents" apparaît dans la liste
- Badge "Private" affiché

---

### ÉTAPE 2.3 : Vérifier les politiques Storage ⏱️ 1 min
```
□ Cliquer sur "property-photos"
□ Aller dans l'onglet "Policies"
□ Vous devriez voir 4 politiques :
  □ property-photos_insert_policy
  □ property-photos_select_policy
  □ property-photos_update_policy
  □ property-photos_delete_policy
```

**✅ Si les 4 politiques sont là : PARFAIT ! Sinon, elles seront créées automatiquement.**

---

## 🧪 PARTIE 3 : TESTS APPLICATION (15 min)

### ÉTAPE 3.1 : Démarrer l'application ⏱️ 1 min
```
□ Ouvrir terminal PowerShell
□ Aller dans le dossier du projet : cd "C:\Users\Smart Business\Desktop\terangafoncier"
□ Exécuter : npm run dev
□ Attendre que le serveur démarre
□ Vérifier URL : http://localhost:5173
```

**✅ VÉRIFICATION :**
```
VITE v4.5.0  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

### ÉTAPE 3.2 : Test connexion vendeur ⏱️ 2 min
```
□ Ouvrir navigateur : http://localhost:5173
□ Se connecter avec un compte vendeur
□ Vérifier redirection vers : /vendeur/overview
□ Vérifier que la page s'affiche (pas de page blanche)
□ Vérifier sidebar gauche avec tous les liens
```

**✅ VÉRIFICATION :**
- Dashboard affiche des cartes statistiques
- Sidebar avec icônes et labels
- Header avec notifications et messages
- Aucune erreur dans la console (F12)

---

### ÉTAPE 3.3 : Test navigation complète ⏱️ 3 min
```
□ Cliquer sur chaque lien de la sidebar et vérifier qu'une page s'affiche :
  □ Vue d'ensemble → /vendeur/overview
  □ CRM → /vendeur/crm
  □ Mes Propriétés → /vendeur/properties
  □ Anti-Fraude → /vendeur/anti-fraud
  □ Vérification GPS → /vendeur/gps-verification
  □ Services Digitaux → /vendeur/digital-services
  □ Ajouter Terrain → /vendeur/add-property
  □ Gestion Photos → /vendeur/photos
  □ Analytics → /vendeur/analytics
  □ Assistant IA → /vendeur/ai-assistant
  □ Blockchain → /vendeur/blockchain
  □ Messages → /vendeur/messages
  □ Paramètres → /vendeur/settings
```

**✅ VÉRIFICATION :**
- Toutes les pages s'affichent (pas de 404)
- Pas d'erreur dans la console
- Navigation fluide

**❌ SI ERREUR "Component not defined" :**
- Vérifier que tous les imports sont présents dans `src/App.jsx`
- Redémarrer le serveur (`Ctrl+C` puis `npm run dev`)

---

### ÉTAPE 3.4 : Test ajout terrain + validation ⏱️ 8 min

#### 3.4.1 : Ajout terrain (vendeur)
```
□ Cliquer "Ajouter Terrain" dans sidebar
□ Remplir le formulaire :
  
  ÉTAPE 1 - Informations de base :
  □ Titre : Test Terrain Dakar
  □ Description : Terrain de test pour validation (minimum 50 caractères)
  □ Type : Terrain nu
  
  ÉTAPE 2 - Dimensions et prix :
  □ Surface : 500
  □ Prix : 50000000
  
  ÉTAPE 3 - Localisation :
  □ Adresse : Almadies, Dakar
  □ Latitude : 14.7167
  □ Longitude : -17.4677
  
  ÉTAPE 4 - Caractéristiques :
  □ Cocher : Viabilisé, Clôturé
  
  ÉTAPE 5 - Commodités :
  □ Cocher : Eau, Électricité
  
  ÉTAPE 6 - Photos :
  □ Upload 3 photos (n'importe lesquelles, format JPG/PNG)
  
  ÉTAPE 7 - Documents :
  □ Cocher : ✅ Titre foncier disponible
  
  ÉTAPE 8 - Vérification :
  □ Vérifier le récapitulatif
  □ Cliquer "Publier l'annonce"
```

**✅ VÉRIFICATION CRITIQUE :**
1. Un toast vert apparaît en haut à droite :
   ```
   🎉 Terrain publié avec succès !
   ✅ Votre bien est en cours de vérification...
   ```
2. Après 2 secondes, redirection automatique vers `/vendeur/properties`
3. Le terrain apparaît dans la liste avec badge "En attente de validation"

**❌ SI ERREUR :**
- "Upload failed" → Vérifier que les buckets Storage existent (Partie 2)
- Pas de redirection → Vérifier la console (F12) pour erreurs
- Terrain non visible → Vérifier que la table `properties` existe (Partie 1)

---

#### 3.4.2 : Validation admin
```
□ Se déconnecter du compte vendeur
□ Se connecter avec un compte admin
□ Aller sur : http://localhost:5173/admin/validation
□ Vérifier que la page s'affiche
```

**✅ VÉRIFICATION :**
- 4 cartes statistiques en haut :
  - "1 bien en attente"
  - Valeur totale affichée
  - Nombre de photos
  - Avec titre foncier
- Carte du terrain avec :
  - Photo principale
  - Score de complétion (ex: 88%)
  - Détails du bien
  - 3 boutons : Approuver, Rejeter, Prévisualiser

---

#### 3.4.3 : Test approbation
```
□ Cliquer sur "Approuver"
□ Attendre 1-2 secondes
```

**✅ VÉRIFICATION :**
1. Toast de confirmation : "Propriété approuvée avec succès"
2. La carte du terrain disparaît de la liste
3. Statistique "Biens en attente" passe à 0

**Vérifier dans la base de données :**
```
□ Aller dans Supabase → Table Editor → properties
□ Trouver le terrain (Test Terrain Dakar)
□ Vérifier les colonnes :
  □ verification_status = 'verified'
  □ status = 'active'
  □ published_at = (date actuelle)
  □ verified_at = (date actuelle)
```

---

#### 3.4.4 : Test rejet (optionnel)
```
□ Ajouter un autre terrain (répéter 3.4.1)
□ Retourner sur /admin/validation
□ Cliquer sur "Rejeter"
□ Une modal s'ouvre
□ Écrire raison : "Photos de mauvaise qualité"
□ Cliquer "Confirmer le rejet"
```

**✅ VÉRIFICATION :**
1. Toast : "Propriété rejetée"
2. Modal se ferme
3. Carte disparaît

**Vérifier dans la base de données :**
```
□ Aller dans Supabase → Table Editor → properties
□ Trouver le terrain
□ Vérifier :
  □ verification_status = 'rejected'
  □ verification_notes = 'Photos de mauvaise qualité'
```

---

### ÉTAPE 3.5 : Test notifications et messages ⏱️ 1 min
```
□ Retourner sur dashboard vendeur
□ Regarder le header en haut à droite
□ Vérifier les badges notifications et messages
```

**✅ VÉRIFICATION :**
- Si aucune donnée : badges cachés ou à "0" → **C'EST NORMAL !**
- Les compteurs affichent les vraies données
- Cliquer sur l'icône cloche → Dropdown "Aucune notification"
- Cliquer sur l'icône message → Dropdown "Aucun message"

**Pour tester avec des données réelles :**
```sql
-- Exécuter dans Supabase SQL Editor
-- Remplacer 'VOTRE_USER_ID' par votre vrai UUID

-- Créer une notification
INSERT INTO notifications (user_id, type, title, message, priority)
VALUES ('VOTRE_USER_ID', 'property_approved', 'Terrain approuvé', 'Votre terrain Test Terrain Dakar a été approuvé !', 'high');

-- Rafraîchir la page vendeur
-- Le badge notification devrait afficher "1"
```

---

## 📊 PARTIE 4 : VÉRIFICATION FINALE (5 min)

### CHECKLIST COMPLÈTE :

#### Base de données ✅
- [ ] Extension uuid-ossp activée
- [ ] Extension postgis activée
- [ ] Extension pg_trgm activée
- [ ] Table `properties` créée (~60 colonnes)
- [ ] Table `property_photos` créée
- [ ] Table `subscriptions` créée
- [ ] Table `notifications` créée
- [ ] Table `messages` créée
- [ ] Politiques RLS actives sur toutes les tables

#### Storage ✅
- [ ] Bucket `property-photos` créé (Public)
- [ ] Bucket `property-documents` créé (Privé)
- [ ] Politiques Storage actives (4 par bucket)

#### Application ✅
- [ ] Serveur démarre sans erreur (`npm run dev`)
- [ ] Connexion vendeur fonctionne
- [ ] Dashboard vendeur s'affiche correctement
- [ ] 13 pages vendeur accessibles (aucun 404)
- [ ] Page admin `/admin/validation` accessible
- [ ] Sidebar avec tous les liens
- [ ] Header avec icônes notifications/messages

#### Workflow complet ✅
- [ ] Ajout terrain fonctionne (8 étapes)
- [ ] Upload photos réussi
- [ ] Toast de succès s'affiche avec description
- [ ] Redirection automatique vers `/vendeur/properties`
- [ ] Terrain visible avec statut "En attente"
- [ ] Page admin affiche le terrain
- [ ] Bouton "Approuver" fonctionne
- [ ] Statut change dans la base de données
- [ ] Bouton "Rejeter" fonctionne (modal + raison)

#### Données réelles ✅
- [ ] Badges sidebar avec compteurs réels (ou cachés si 0)
- [ ] Dropdown notifications fonctionnel
- [ ] Dropdown messages fonctionnel
- [ ] Aucune donnée mockée visible

---

## 🎯 RÉSULTAT ATTENDU

### ✅ SI TOUT EST VALIDÉ :

**🎉 FÉLICITATIONS ! Votre plateforme est prête pour la production !**

Vous avez maintenant :
- ✅ Base de données complète avec 5 tables
- ✅ Storage fonctionnel pour photos et documents
- ✅ Dashboard vendeur 100% opérationnel
- ✅ Page admin de validation fonctionnelle
- ✅ Workflow complet : ajout → validation → publication
- ✅ Données réelles partout (notifications, messages, stats)
- ✅ Aucun lien 404
- ✅ Système professionnel et crédible

**Prochaines étapes (optionnelles) :**
1. Implémenter le système d'abonnement (UI dans Paramètres)
2. Intégrer paiements Orange Money / Wave
3. Configurer notifications email après validation
4. Auditer les 13 pages vendeur pour fonctionnalités avancées
5. Ajouter des données de test pour démonstrations

---

## ❌ EN CAS DE PROBLÈME

### Problème : "Table does not exist"
**Solution :**
1. Vérifier que SCRIPT_COMPLET_UNIQUE.sql a bien été exécuté
2. Aller dans Table Editor pour voir les tables créées
3. Si manquantes, ré-exécuter le script

---

### Problème : "Bucket not found" lors de l'upload
**Solution :**
1. Aller dans Storage
2. Vérifier que `property-photos` existe
3. Vérifier qu'il est bien Public (badge "Public")
4. Si manquant, recréer manuellement (Partie 2)

---

### Problème : "RLS policy violation"
**Solution :**
1. Aller dans Table Editor → properties
2. Cliquer sur "RLS" en haut
3. Vérifier que "Enable RLS" est activé
4. Vérifier que les politiques existent (5 pour properties)
5. Si manquantes, ré-exécuter le script SQL

---

### Problème : Page blanche après connexion
**Solution :**
1. Ouvrir console (F12)
2. Regarder les erreurs en rouge
3. Si "Component is not defined" :
   - Vérifier imports dans `src/App.jsx`
   - Vérifier que les fichiers `*RealData.jsx` existent
4. Redémarrer le serveur : Ctrl+C puis `npm run dev`

---

### Problème : Pas de redirection après publication
**Solution :**
1. Vérifier que `useNavigate` est importé dans `VendeurAddTerrainRealData.jsx`
2. Vérifier la console pour erreurs
3. Vérifier que le terrain a bien été créé dans la table `properties`

---

### Problème : Compteurs à 0 dans sidebar/header
**Ce n'est pas un problème !** Les compteurs affichent les vraies données.
- 0 notifications = Aucune notification dans la base
- 0 messages = Aucun message dans la base
- 0 propriétés = Aucune propriété dans la base

Pour tester avec des données :
1. Ajouter un terrain
2. Créer des notifications/messages avec SQL (voir ÉTAPE 3.5)

---

### Problème : Erreur "column does not exist"
**Solution :**
Le script SQL a peut-être échoué partiellement.
1. Aller dans SQL Editor
2. Exécuter un DROP complet :
```sql
DROP TABLE IF EXISTS property_photos CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
```
3. Ré-exécuter SCRIPT_COMPLET_UNIQUE.sql
4. Ré-exécuter TABLES_COMPLEMENTAIRES.sql

---

## 📞 SUPPORT

### Commandes utiles :

**Voir les logs en temps réel :**
```powershell
npm run dev
# Regarder la console pour erreurs
```

**Vérifier les tables Supabase :**
```
Supabase Dashboard → Table Editor
```

**Vérifier les logs Supabase :**
```
Supabase Dashboard → Logs → Explorer
```

**Restart complet :**
```powershell
# Terminal
Ctrl + C (arrêter serveur)
npm run dev (redémarrer)

# Navigateur
Ctrl + Shift + R (hard refresh)
```

---

## 🎓 NOTES IMPORTANTES

1. **Les scripts SQL sont idempotents** : Vous pouvez les ré-exécuter sans problème, ils contiennent des `DROP TABLE IF EXISTS`.

2. **Les buckets Storage doivent être créés manuellement** : Supabase ne permet pas de créer des buckets via SQL.

3. **Les compteurs à 0 sont normaux** : C'est le comportement attendu quand il n'y a pas de données. Cela prouve que le système fonctionne correctement.

4. **Les politiques RLS sont critiques** : Ne jamais les désactiver en production. Elles garantissent la sécurité des données.

5. **Toujours tester avec plusieurs comptes** : Admin + Vendeur minimum.

---

**🔥 Bonne mise en production !** 🚀

*Document créé avec passion par un Senior Developer* 💪
