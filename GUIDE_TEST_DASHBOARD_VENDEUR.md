# 🧪 GUIDE DE TEST - DASHBOARD VENDEUR
## Validation des corrections après Option A ou Option B

*Date: 7 Octobre 2025*  
*Version: 1.0*

---

## 📋 CHECKLIST TESTS - OPTION A (10 bugs)

### **TEST 1: Navigation vers détail propriété** ✅
**Bug corrigé**: `handleViewProperty()`  
**Fichier**: `VendeurProperties.jsx`

**Procédure**:
1. Aller sur `/dashboard/vendeur/properties`
2. Cliquer sur bouton "👁️ Voir" d'une propriété
3. ✅ **Attendu**: Redirection vers `/dashboard/parcel/:id`
4. ✅ **Attendu**: Page détail s'affiche avec toutes les infos

**Validation**:
- [ ] URL change correctement
- [ ] Page détail charge sans erreur
- [ ] Images s'affichent
- [ ] Bouton "Acheter" visible
- [ ] Informations vendeur présentes

---

### **TEST 2: Navigation vers édition propriété** ✅
**Bug corrigé**: `handleEditProperty()`  
**Fichier**: `VendeurProperties.jsx`

**Procédure**:
1. Sur page Properties
2. Cliquer sur bouton "✏️ Modifier"
3. ✅ **Attendu**: Redirection vers `/dashboard/edit-parcel/:id`
4. ✅ **Attendu**: Formulaire pré-rempli avec données existantes

**Validation**:
- [ ] Navigation fonctionne
- [ ] Formulaire affiche données correctes
- [ ] Tous les champs éditables
- [ ] Bouton "Enregistrer" présent
- [ ] Upload nouvelles photos possible

---

### **TEST 3: Suppression propriété** ✅
**Bug corrigé**: `handleDeleteProperty()`  
**Fichier**: `VendeurProperties.jsx`

**Procédure**:
1. Sur page Properties
2. Cliquer sur bouton "🗑️ Supprimer"
3. ✅ **Attendu**: Modal confirmation s'ouvre
4. Confirmer la suppression
5. ✅ **Attendu**: Toast "Propriété supprimée"
6. ✅ **Attendu**: Propriété disparaît de la liste

**Validation**:
- [ ] Modal AlertDialog (pas `confirm()` natif)
- [ ] Suppression enregistrée dans Supabase
- [ ] Toast notification affiché
- [ ] Liste rechargée automatiquement
- [ ] Propriété n'apparaît plus

**Test Supabase**:
```sql
-- Vérifier suppression
SELECT * FROM parcels WHERE id = 'ID_SUPPRIMÉ';
-- Doit retourner 0 lignes
```

---

### **TEST 4: Partage propriété social** ✅
**Bug corrigé**: `handleShareProperty()`  
**Fichier**: `VendeurProperties.jsx`

**Procédure**:
1. Sur page Properties
2. Cliquer sur bouton "📤 Partager"
3. ✅ **Attendu**: Modal partage s'ouvre

**Validation modal**:
- [ ] Bouton WhatsApp présent et fonctionne
- [ ] Bouton Facebook présent et fonctionne
- [ ] Bouton Email présent et fonctionne
- [ ] Bouton "Copier lien" présent
- [ ] Lien copié dans clipboard
- [ ] Toast "Lien copié" affiché

**Test liens**:
- [ ] WhatsApp: Ouvre app/web avec message pré-rempli
- [ ] Facebook: Ouvre dialog partage
- [ ] Email: Ouvre client email avec sujet/corps
- [ ] Copier: `navigator.clipboard.writeText()` fonctionne

---

### **TEST 5: Sauvegarder brouillon** ✅
**Bug corrigé**: `handleSaveDraft()`  
**Fichier**: `VendeurAddTerrain.jsx`

**Procédure**:
1. Aller sur `/dashboard/add-parcel`
2. Remplir formulaire partiellement (nom + localisation uniquement)
3. Cliquer bouton "💾 Sauvegarder brouillon"
4. ✅ **Attendu**: Toast "Brouillon sauvegardé"
5. ✅ **Attendu**: Redirection vers "Mes Annonces"

**Validation**:
- [ ] INSERT Supabase avec `status: 'draft'`
- [ ] Toast confirmation
- [ ] Redirection automatique
- [ ] Brouillon apparaît dans liste avec badge "Brouillon"

**Test Supabase**:
```sql
-- Vérifier brouillon créé
SELECT * FROM parcels 
WHERE seller_id = 'USER_ID' 
AND status = 'draft'
ORDER BY created_at DESC 
LIMIT 1;
```

---

### **TEST 6: Sauvegarder paramètres** ✅
**Bug corrigé**: `handleSaveSettings()`  
**Fichier**: `VendeurSettings.jsx`

**Procédure**:
1. Aller sur `/dashboard/vendeur/settings`
2. Modifier email de notification
3. Changer préférences notifications (activer/désactiver)
4. Cliquer "💾 Enregistrer"
5. ✅ **Attendu**: Toast "Paramètres sauvegardés"

**Validation**:
- [ ] UPDATE Supabase table `profiles`
- [ ] Toast confirmation
- [ ] Page rechargée avec nouvelles valeurs
- [ ] Modifications persistées

**Test Supabase**:
```sql
-- Vérifier update
SELECT notification_email, notification_preferences 
FROM profiles 
WHERE id = 'USER_ID';
```

**Test persistance**:
- [ ] Recharger page → Nouvelles valeurs affichées
- [ ] Déconnexion/reconnexion → Paramètres conservés

---

### **TEST 7: Bouton Appeler CRM** ✅
**Bug corrigé**: Bouton "Appeler" CRM  
**Fichier**: `VendeurCRM.jsx`

**Procédure**:
1. Aller sur `/dashboard/vendeur/crm`
2. Cliquer sur bouton "📞 Appeler" d'un contact
3. ✅ **Attendu**: Application téléphone s'ouvre (mobile) ou dialog (desktop)

**Validation**:
- [ ] Lien `tel:+221XXXXXXXX` fonctionne
- [ ] Sur mobile: App téléphone s'ouvre
- [ ] Sur desktop: Dialog système ou Skype
- [ ] Numéro correctement formaté

**Test différents formats**:
- [ ] +221 77 123 45 67
- [ ] 00221771234567
- [ ] 771234567

---

### **TEST 8: Bouton Email CRM** ✅
**Bug corrigé**: Bouton "Email" CRM  
**Fichier**: `VendeurCRM.jsx`

**Procédure**:
1. Sur page CRM
2. Cliquer sur bouton "✉️ Email" d'un contact
3. ✅ **Attendu**: Client email s'ouvre

**Validation**:
- [ ] Lien `mailto:contact@example.com` fonctionne
- [ ] Client email par défaut s'ouvre
- [ ] Destinataire pré-rempli
- [ ] Sujet optionnel présent

**Test avec sujet/corps**:
```javascript
mailto:contact@example.com?subject=Suivi%20Propriété&body=Bonjour
```

---

### **TEST 9: Navigation page Photos** ✅
**Bug corrigé**: `handleAddPhotos()`  
**Fichier**: `ModernVendeurDashboard.jsx`

**Procédure**:
1. Sur dashboard vendeur
2. Cliquer sur bouton "📷 Ajouter Photos IA"
3. ✅ **Attendu**: Redirection vers `/dashboard/vendeur/photos`

**Validation**:
- [ ] Navigation fonctionne
- [ ] Page photos charge
- [ ] Upload photos possible
- [ ] Galerie existante affichée

---

### **TEST 10: Navigation page Analytics** ✅
**Bug corrigé**: `handleViewAnalytics()`  
**Fichier**: `ModernVendeurDashboard.jsx`

**Procédure**:
1. Sur dashboard vendeur
2. Cliquer sur bouton "📊 Voir Analytics"
3. ✅ **Attendu**: Redirection vers `/dashboard/vendeur/analytics`

**Validation**:
- [ ] Navigation fonctionne
- [ ] Page analytics charge
- [ ] Graphiques affichés
- [ ] Statistiques présentes

---

## 🧪 TESTS END-TO-END - WORKFLOWS COMPLETS

### **Workflow 1: Ajout terrain complet**
**Étapes**:
1. Connexion en tant que Vendeur
2. Dashboard → "➕ Ajouter Bien"
3. Remplir formulaire (4 étapes)
4. Upload 3 photos
5. Upload 1 document PDF
6. Soumettre

**Validation**:
- [ ] Toutes les étapes fonctionnent
- [ ] Photos uploadées sur Storage
- [ ] Documents uploadés sur Storage
- [ ] Terrain créé dans Supabase
- [ ] Redirection vers "Mes Annonces"
- [ ] Terrain apparaît dans liste avec status "pending_verification"

---

### **Workflow 2: Modification terrain**
**Étapes**:
1. Liste annonces
2. Cliquer "Modifier" sur une annonce
3. Changer prix de 85M → 90M
4. Ajouter 2 nouvelles photos
5. Enregistrer

**Validation**:
- [ ] Page edit charge avec données
- [ ] Modifications sauvegardées
- [ ] Nouvelles photos ajoutées
- [ ] Anciennes photos conservées
- [ ] Prix mis à jour
- [ ] Toast confirmation
- [ ] Retour liste annonces

---

### **Workflow 3: Partage social**
**Étapes**:
1. Liste annonces
2. Cliquer "Partager" sur une annonce
3. Tester chaque bouton partage

**Validation WhatsApp**:
- [ ] Ouvre WhatsApp Web/App
- [ ] Message contient titre terrain
- [ ] Lien vers détail inclus

**Validation Facebook**:
- [ ] Ouvre dialog Facebook
- [ ] Preview image s'affiche
- [ ] Description présente

**Validation Email**:
- [ ] Client email s'ouvre
- [ ] Sujet = Titre terrain
- [ ] Corps = Description + lien

**Validation Copier lien**:
- [ ] Lien copié dans clipboard
- [ ] Toast "Lien copié"
- [ ] Lien fonctionnel

---

### **Workflow 4: Suppression terrain**
**Étapes**:
1. Liste annonces
2. Cliquer "Supprimer"
3. Confirmer modal
4. Vérifier suppression

**Validation**:
- [ ] Modal AlertDialog s'ouvre
- [ ] Boutons "Annuler" et "Supprimer"
- [ ] Clic "Annuler" → Rien ne se passe
- [ ] Clic "Supprimer" → DELETE Supabase
- [ ] Toast "Propriété supprimée"
- [ ] Terrain disparaît de liste
- [ ] Photos Storage supprimées ?

---

### **Workflow 5: Brouillon → Publication**
**Étapes**:
1. Créer terrain en brouillon
2. Retourner liste annonces
3. Cliquer "Modifier" sur brouillon
4. Compléter formulaire
5. Publier

**Validation**:
- [ ] Brouillon badge "Brouillon" visible
- [ ] Modification ouvre formulaire pré-rempli
- [ ] Complétion des champs manquants
- [ ] Publication change `status: 'active'`
- [ ] Badge devient "Actif"

---

## 🔍 TESTS SUPABASE

### **Test 1: Vérifier structure données**
```sql
-- Propriété complète
SELECT 
  id,
  name,
  status,
  price,
  seller_id,
  images,
  documents,
  created_at,
  updated_at
FROM parcels
WHERE seller_id = 'USER_ID'
ORDER BY created_at DESC;
```

**Attendu**:
- [ ] Tous les champs remplis
- [ ] `images`: Array d'URLs Storage
- [ ] `documents`: Array d'URLs Storage
- [ ] `status`: 'draft', 'pending_verification', 'active', 'sold'
- [ ] Timestamps correctes

---

### **Test 2: Vérifier RLS policies**
```sql
-- En tant que vendeur, voir uniquement ses annonces
SELECT * FROM parcels;
-- Doit retourner uniquement annonces du vendeur connecté

-- En tant que acheteur, voir toutes annonces actives
SELECT * FROM parcels WHERE status = 'active';
-- Doit retourner toutes annonces actives
```

---

### **Test 3: Vérifier Storage buckets**
```sql
-- Lister fichiers uploadés
SELECT * FROM storage.objects 
WHERE bucket_id = 'parcel-images'
AND name LIKE 'USER_ID/%';
```

**Attendu**:
- [ ] Fichiers présents
- [ ] Naming convention respectée: `{user_id}/{timestamp}_{filename}`
- [ ] Tailles fichiers cohérentes
- [ ] Métadonnées correctes

---

## 🎨 TESTS UI/UX

### **Test responsive mobile**
**Procédure**:
1. Ouvrir DevTools
2. Mode mobile (iPhone 12 Pro)
3. Tester chaque page

**Validation**:
- [ ] Sidebar mobile fonctionne
- [ ] Formulaires responsive
- [ ] Tableaux deviennent cards
- [ ] Boutons taille suffisante (44x44px)
- [ ] Textes lisibles

---

### **Test navigation clavier**
**Procédure**:
1. Navigation avec `Tab`
2. Activation avec `Enter` ou `Space`

**Validation**:
- [ ] Focus visible
- [ ] Ordre logique
- [ ] Skip links présents
- [ ] Modals piégent focus

---

### **Test accessibilité**
**Outils**: Lighthouse, axe DevTools

**Validation**:
- [ ] Score accessibilité > 90
- [ ] Contraste texte/fond suffisant
- [ ] Labels présents sur inputs
- [ ] `aria-label` sur icônes
- [ ] Headings hiérarchie correcte

---

## 🚀 TESTS PERFORMANCE

### **Test chargement pages**
**Procédure**: Lighthouse Performance

**Attendu**:
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Score Performance > 80

---

### **Test upload fichiers**
**Procédure**: Upload image 5MB

**Validation**:
- [ ] Progress bar affiché
- [ ] Upload complète sans erreur
- [ ] Temps < 5s (connexion normale)
- [ ] Preview image s'affiche après upload

---

## ✅ CHECKLIST FINALE

### **Option A (10 bugs corrigés)**
- [ ] Test 1: Navigation détail propriété ✅
- [ ] Test 2: Navigation édition ✅
- [ ] Test 3: Suppression Supabase ✅
- [ ] Test 4: Partage social ✅
- [ ] Test 5: Brouillon ✅
- [ ] Test 6: Paramètres ✅
- [ ] Test 7: Appeler CRM ✅
- [ ] Test 8: Email CRM ✅
- [ ] Test 9: Navigation photos ✅
- [ ] Test 10: Navigation analytics ✅

**Validation globale**:
- [ ] 0 console.error dans DevTools
- [ ] Toutes les actions ont feedback (toast/modal)
- [ ] Navigation cohérente
- [ ] Données persistées Supabase
- [ ] UI responsive

---

### **Option B (79 bugs corrigés)**
- [ ] Tous tests Option A ✅
- [ ] 23 boutons ModernVendeurDashboard fonctionnels
- [ ] 8 workflows end-to-end complets
- [ ] Intégration OpenAI active
- [ ] Blockchain TerangaChain connectée
- [ ] NFT minting opérationnel
- [ ] Pagination implémentée
- [ ] Loading states partout
- [ ] Error handling complet
- [ ] Dark mode fonctionne
- [ ] Mobile 100% responsive

---

## 📊 RAPPORT DE TEST

**Template à remplir**:

```markdown
# Rapport de Test - Dashboard Vendeur

**Date**: [DATE]
**Testeur**: [NOM]
**Option testée**: [A / B / C]
**Environnement**: [Dev / Staging / Production]

## Résultats

### Tests passés
- ✅ Test 1: ...
- ✅ Test 2: ...

### Tests échoués
- ❌ Test 5: [Description erreur]
- ❌ Test 7: [Description erreur]

### Bugs découverts
1. **[TITRE BUG]**
   - Sévérité: [Critique/Majeur/Mineur]
   - Steps to reproduce: ...
   - Attendu: ...
   - Obtenu: ...

## Métriques
- Tests passés: X/10 (Option A) ou X/79 (Option B)
- Taux de réussite: XX%
- Temps total: XX heures

## Recommandations
- [ ] ...
- [ ] ...
```

---

## 🎉 VALIDATION FINALE

**Dashboard prêt pour production si**:
- ✅ 100% tests Option A passés (ou Option B selon choix)
- ✅ 0 console.error dans DevTools
- ✅ Toutes données persistées Supabase
- ✅ UI responsive mobile
- ✅ Performance Lighthouse > 80
- ✅ Accessibilité > 90

**Félicitations ! Dashboard Vendeur opérationnel ! 🎉🚀**

---

*Guide de test créé le : 7 Octobre 2025*  
*Version : 1.0*  
*Prochaine révision : Après corrections*
