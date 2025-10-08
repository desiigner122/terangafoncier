# 🔧 GUIDE RAPIDE : Corriger l'Erreur RLS Storage

## ⚡ 3 ÉTAPES SIMPLES

---

### ÉTAPE 1 : Ouvrir SQL Editor

1. Aller sur : **https://supabase.com/dashboard**
2. Se connecter
3. Sélectionner le projet **TerangaFoncier**
4. Dans le menu gauche, cliquer sur **SQL Editor**

---

### ÉTAPE 2 : Copier-Coller le Script

1. Ouvrir le fichier : `supabase-migrations/fix-storage-policies.sql`
2. **Tout sélectionner** (Ctrl+A)
3. **Copier** (Ctrl+C)
4. Retourner dans Supabase SQL Editor
5. **Coller** (Ctrl+V) dans la zone de texte
6. **Cliquer sur "Run"** (ou F5)

---

### ÉTAPE 3 : Vérifier

1. Aller dans **Storage** (menu gauche)
2. Cliquer sur le bucket **property-photos**
3. Aller dans l'onglet **Policies**
4. Vérifier que vous voyez **4 nouvelles politiques** :
   - ✅ Anyone can view photos
   - ✅ Authenticated users can upload photos
   - ✅ Authenticated users can update photos
   - ✅ Authenticated users can delete photos

5. Cliquer sur le bucket **property-documents**
6. Aller dans l'onglet **Policies**
7. Vérifier que vous voyez **4 nouvelles politiques** :
   - ✅ Authenticated users can view documents
   - ✅ Authenticated users can upload documents
   - ✅ Authenticated users can update documents
   - ✅ Authenticated users can delete documents

---

## ✅ C'EST FAIT !

L'erreur **"new row violates row-level security policy"** est corrigée.

**Maintenant, testez l'upload :**
1. Aller sur `/vendeur/add-property`
2. Remplir le formulaire
3. **Étape 7** : Uploader 3 photos
4. **Étape 8** : Cocher "Titre foncier" + Uploader PDF
5. Cliquer "Publier"

**✅ Ça devrait fonctionner !**

---

## 🎨 Nouvelles Fonctionnalités IA

### Dans l'Étape 1 :
- Bouton **"✨ Générer avec l'IA"**
- Génère une description professionnelle automatiquement

### Dans l'Étape 8 :
- Section **"✨ Vérification Intelligente IA"**
- Analyse prix, photos, description
- Score de qualité sur 100
- Prédiction chances de vente

---

**Durée totale :** 2 minutes  
**Difficulté :** Facile 🟢  
**Résultat :** Upload fonctionne + IA active ✨
