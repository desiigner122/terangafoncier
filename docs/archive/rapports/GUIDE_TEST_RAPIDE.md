# 🧪 GUIDE DE TEST RAPIDE - DASHBOARD VENDEUR

**Date**: 16 Octobre 2025  
**Temps de test estimé**: 10-15 minutes  
**Pré-requis**: Compte vendeur + au moins 1 demande d'achat

---

## 🎯 OBJECTIF

Valider que toutes les corrections fonctionnent correctement en conditions réelles.

---

## 📋 TESTS À EFFECTUER

### Test 1: Acceptation d'une Offre ✅
**Durée**: 2 minutes

**Étapes**:
1. Se connecter avec compte vendeur: `heritage.fall@teranga-foncier.sn`
2. Naviguer vers "Demandes d'Achat"
3. Repérer une demande avec statut "En attente"
4. Cliquer sur bouton vert **"Accepter l'offre"**

**Résultat Attendu**:
- ✅ Loading spinner s'affiche
- ✅ Toast vert apparaît: "🎉 Offre acceptée ! Dossier créé: TF-YYYYMMDD-XXXX"
- ✅ Toast bleu apparaît: "🚀 Workflow d'achat lancé ! Dossier: TF-YYYYMMDD-XXXX"
- ✅ La demande disparaît de l'onglet "En attente"
- ✅ La demande apparaît dans l'onglet "Complétées" (avec badge vert "Acceptée")

**Vérification DB** (optionnel):
```sql
-- Ouvrir Supabase SQL Editor
SELECT * FROM purchase_cases 
WHERE case_number LIKE 'TF-%' 
ORDER BY created_at DESC 
LIMIT 1;
-- Doit retourner le dossier créé avec status='preliminary_agreement'
```

**Si ça ne fonctionne pas**:
- ❌ Erreur "Transaction incomplète" → Vérifier que la transaction a buyer_id, seller_id, parcel_id
- ❌ Rien ne se passe → Ouvrir la console (F12) et copier l'erreur

---

### Test 2: Négociation d'une Offre 💬
**Durée**: 3 minutes

**Étapes**:
1. Repérer une demande avec statut "En attente"
2. Cliquer sur bouton blanc **"Négocier"**
3. **Modal de négociation s'ouvre** ✅
4. Vérifier l'affichage:
   - Box bleue à gauche: "Offre de l'acheteur: XX,XXX,XXX FCFA"
   - Box verte à droite: "Votre contre-offre: XX,XXX,XXX FCFA"
5. Modifier le prix (ex: augmenter de 10%)
6. Observer:
   - La différence s'affiche automatiquement en vert ("+X,XXX,XXX (+10%)")
7. Remplir le message:
   ```
   Je propose ce prix car le terrain nécessite des travaux d'aménagement 
   estimés à 3,000,000 FCFA.
   ```
8. (Optionnel) Ajouter conditions:
   ```
   - Paiement comptant uniquement
   - Libération du terrain dans 30 jours
   ```
9. Vérifier date de validité (défaut: 7 jours)
10. Cliquer **"Envoyer la contre-offre"**

**Résultat Attendu**:
- ✅ Bouton affiche "Envoi en cours..." avec spinner
- ✅ Modal se ferme automatiquement
- ✅ Toast vert: "💬 Contre-offre envoyée avec succès ! L'acheteur sera notifié."
- ✅ Badge de la demande change: "En négociation" (bleu)
- ✅ Liste se recharge automatiquement

**Vérification DB** (optionnel):
```sql
SELECT * FROM purchase_case_negotiations 
ORDER BY created_at DESC 
LIMIT 1;
-- Doit retourner la contre-offre avec status='pending'
```

**Si ça ne fonctionne pas**:
- ❌ Modal ne s'ouvre pas → Vérifier console (F12)
- ❌ Bouton "Envoyer" désactivé → Prix doit être > 0
- ❌ Erreur lors de l'envoi → Copier message d'erreur

---

### Test 3: Voir Détails d'une Demande 👁️
**Durée**: 3 minutes

**Étapes**:
1. Repérer n'importe quelle demande
2. Cliquer sur les **trois points verticaux** (⋮) à droite
3. Cliquer **"Voir détails"**
4. **Modal de détails s'ouvre** ✅

**Vérifier Onglet "Aperçu"**:
- ✅ En-tête coloré avec: Statut | Montant | Mode de paiement
- ✅ Box "Informations générales": ID, Date de création
- ✅ Box "Montants": Prix demandé vs Offre acheteur
- ✅ Différence calculée en % (vert si positif, rouge si négatif)
- ✅ Message de l'acheteur (si présent)

**Vérifier Onglet "Acheteur"**:
- ✅ Avatar rond avec icône User
- ✅ Nom complet
- ✅ Email clickable avec bouton "Envoyer un email"
- ✅ Téléphone clickable avec bouton "Appeler"

**Action**: Cliquer bouton **"Envoyer un email"**
- ✅ Client email s'ouvre (Gmail, Outlook, etc.)
- ✅ Destinataire pré-rempli avec email acheteur

**Vérifier Onglet "Propriété"**:
- ✅ Titre de la parcelle
- ✅ Localisation avec icône MapPin
- ✅ Surface (m²)
- ✅ Prix demandé
- ✅ Statut de la parcelle

**Vérifier Onglet "Paiement"**:
- ✅ Icône selon type (Wallet/Calendar/Building2)
- ✅ Mode de paiement affiché: "Paiement Comptant", "Paiement Échelonné", ou "Financement Bancaire"
- ✅ Détails du paiement (si disponibles dans metadata)
- ✅ Services additionnels avec checkboxes (Notaire, Arpentage, etc.)

**Fermer le modal**:
- Cliquer bouton **"Fermer"** ou cliquer en dehors du modal
- ✅ Modal se ferme proprement

**Si ça ne fonctionne pas**:
- ❌ Menu dropdown ne s'ouvre pas → Cliquer exactement sur les trois points
- ❌ Modal ne s'ouvre pas → Vérifier console
- ❌ Infos manquantes → Normal si metadata pas complète (Phase 3)

---

### Test 4: Contact Acheteur 📧📞
**Durée**: 2 minutes

**Étapes**:
1. Ouvrir détails d'une demande (Test 3)
2. Aller dans onglet "Acheteur"
3. **Test Email**:
   - Cliquer bouton **"Envoyer un email"**
   - ✅ Client email s'ouvre
   - ✅ Destinataire pré-rempli
4. **Test Téléphone**:
   - Cliquer bouton **"Appeler"**
   - ✅ Si sur mobile: App téléphone s'ouvre
   - ✅ Si sur desktop: Demande confirmation (selon navigateur)

**Alternative via Dropdown**:
1. Fermer le modal
2. Cliquer trois points (⋮) sur une demande
3. Cliquer **"Contacter l'acheteur"**
4. ✅ Client email s'ouvre (comme avant)

**Si ça ne fonctionne pas**:
- ❌ Email vide → L'acheteur n'a pas fourni d'email (normal si ancien)
- ❌ Téléphone ne fonctionne pas → Vérifier format (doit être +221XXXXXXXXX)

---

### Test 5: Filtres et Recherche 🔍
**Durée**: 2 minutes

**Test Onglets**:
1. Cliquer onglet **"Toutes"** → ✅ Affiche toutes les demandes
2. Cliquer onglet **"En attente"** → ✅ Filtre uniquement status='pending'
3. Cliquer onglet **"Complétées"** → ✅ Filtre uniquement status='completed' ou 'accepted'

**Test Recherche**:
1. Taper nom d'un acheteur dans la barre de recherche
2. ✅ Liste filtrée en temps réel
3. Effacer la recherche
4. Taper un email
5. ✅ Liste filtrée par email
6. Taper un nom de terrain
7. ✅ Liste filtrée par nom de parcelle

**Test Statistiques**:
1. Observer les 4 cartes en haut:
   - **Total**: Nombre total de demandes
   - **En attente**: Nombre avec status='pending' (fond orange)
   - **Complétées**: Nombre avec status='completed' (fond vert)
   - **Revenu total**: Somme des montants complétés (fond bleu dégradé)
2. Accepter une demande
3. ✅ Statistiques se mettent à jour automatiquement

---

### Test 6: Responsive Mobile 📱
**Durée**: 2 minutes

**Étapes**:
1. Ouvrir DevTools (F12)
2. Cliquer icône "Toggle device toolbar" (Ctrl+Shift+M)
3. Sélectionner "iPhone 12 Pro" ou "iPad"
4. Recharger la page

**Vérifier**:
- ✅ Dashboard s'affiche correctement
- ✅ Statistiques passent en colonne
- ✅ Demandes affichées en liste verticale
- ✅ Boutons accessibles (pas trop petits)
- ✅ Modals scrollables si contenu long
- ✅ Onglets dans modals cliquables

---

## ⚠️ PROBLÈMES CONNUS

### 1. Metadata Incomplète
**Symptôme**: Onglet "Paiement" affiche "Aucun détail disponible"  
**Cause**: Transactions créées avant Phase 3 (Metadata structurée)  
**Solution**: Phase 3 à venir - Normal pour l'instant

### 2. Type de Paiement "unknown"
**Symptôme**: Badge affiche "unknown" au lieu de "Comptant/Échelonné/Financement"  
**Cause**: Anciennes transactions sans `payment_method`  
**Solution**: Exécuter script SQL de correction (déjà disponible dans `fix-incomplete-transactions.sql`)

### 3. Bouton "Générer Contrat" Inactif
**Symptôme**: Toast "Génération de contrat à venir"  
**Cause**: Fonctionnalité Phase 4 (pas encore développée)  
**Solution**: Normal - À implémenter dans Phase 4

---

## 📊 SCORECARD DE TEST

Cochez après chaque test réussi:

```
[ ] Test 1: Acceptation offre
[ ] Test 2: Négociation (ouverture modal)
[ ] Test 2: Négociation (soumission contre-offre)
[ ] Test 3: Voir détails (onglet Aperçu)
[ ] Test 3: Voir détails (onglet Acheteur)
[ ] Test 3: Voir détails (onglet Propriété)
[ ] Test 3: Voir détails (onglet Paiement)
[ ] Test 4: Envoyer email
[ ] Test 4: Appeler téléphone
[ ] Test 5: Filtres par onglet
[ ] Test 5: Recherche
[ ] Test 5: Statistiques
[ ] Test 6: Responsive mobile

Score: ____ / 13
```

**Interprétation**:
- 13/13: 🟢 **PARFAIT** - Tout fonctionne!
- 10-12/13: 🟡 **BON** - Quelques ajustements mineurs
- 7-9/13: 🟠 **MOYEN** - Problèmes à investiguer
- < 7/13: 🔴 **CRITIQUE** - Contacter développeur

---

## 🐛 RAPPORT DE BUG

Si vous rencontrez un problème, remplissez ce template:

```
## Bug Report

**Date**: _______________
**Test**: Test X - [Nom du test]
**Symptôme**: [Décrivez ce qui ne fonctionne pas]
**Étapes pour reproduire**:
1. ...
2. ...
3. ...

**Résultat attendu**: [Ce qui devrait se passer]
**Résultat actuel**: [Ce qui se passe réellement]

**Console Errors** (F12 → Console):
[Copier-coller les erreurs ici]

**Screenshots**:
[Ajouter captures d'écran si possible]

**Environnement**:
- Navigateur: [Chrome 120 / Firefox 115 / Safari 17]
- OS: [Windows 11 / macOS Sonoma / Ubuntu 22.04]
- Résolution: [1920x1080 / 1366x768 / Mobile]
```

Envoyer à: [Email du développeur principal]

---

## ✅ VALIDATION FINALE

Une fois tous les tests passés:

1. ✅ Tous les boutons fonctionnent
2. ✅ Modals s'ouvrent et se ferment proprement
3. ✅ Données s'affichent correctement
4. ✅ Workflow complet fonctionne (acceptation → DB → toast → recharge)
5. ✅ Négociation enregistrée dans DB
6. ✅ Filtres et recherche opérationnels
7. ✅ Responsive sur mobile

**Résultat**: 🎉 **PHASE 1 VALIDÉE - PRÊT POUR PRODUCTION** 🎉

---

## 📞 SUPPORT

**Questions/Problèmes**:
- 📧 Email: [À définir]
- 💬 Chat: [À définir]
- 🐛 Bug tracker: GitHub Issues

**Documentation**:
- 📄 Audit complet: `AUDIT_DEMANDES_ACHAT_ACTIONS_MANQUANTES.md`
- 📄 Corrections Phase 1: `CORRECTIONS_APPLIQUEES_PHASE1.md`
- 📄 Résumé exécutif: `RESUME_EXECUTIF_CORRECTIONS.md`

---

**Bonne chance avec les tests! 🚀**
