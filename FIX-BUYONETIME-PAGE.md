# Fix OneTimePaymentPage - Sidebar + Prix

## 🐛 Problèmes identifiés

### Problème 1: Pas de Sidebar Particulier
**Constat**: La page `/buy/one-time` n'utilise pas le layout avec sidebar du dashboard particulier

**Impact**: 
- ❌ Navigation incohérente avec le reste du dashboard
- ❌ Utilisateur perd le contexte de navigation
- ❌ Pas d'accès aux autres fonctionnalités du dashboard

### Problème 2: Prix de la parcelle non affiché correctement
**Constat**: Le prix n'apparaît pas clairement dans le résumé

**Impact**:
- ❌ Utilisateur ne voit pas le prix total
- ❌ Champs de prix vide ou confus
- ❌ Manque de transparence dans le processus d'achat

## 🔍 Analyse du fichier actuel

### Structure actuelle (`OneTimePaymentPage.jsx`)

**Ligne 1-15**: Imports
- ✅ Composants UI importés
- ❌ **PAS de ParticulierLayout importé**
- ❌ **PAS de Sidebar**

**Ligne 16-40**: État du composant
```javascript
const [price, setPrice] = useState(
  context.paymentInfo?.totalPrice?.toString() || 
  context.parcelle?.price?.toString() || 
  ''  // ← Peut être vide!
);
```

**Ligne 163-188**: Rendu du composant
```jsx
return (
  <div className="max-w-7xl mx-auto space-y-6 p-6">  // ← PAS DE LAYOUT
    {/* Contenu directement rendu */}
  </div>
);
```

**Problèmes constatés**:
1. Pas de `<ParticulierLayout>` wrapper
2. Pas de Sidebar visible
3. Prix peut être vide si mal passé en state

## ✅ Solutions

### Solution 1: Wrapper avec ParticulierLayout

**Fichier**: `src/pages/buy/OneTimePaymentPage.jsx`

**Imports à ajouter** (ligne 1):
```javascript
import ParticulierLayout from '@/components/layout/ParticulierLayout';
```

**Structure à modifier** (ligne 163):
```jsx
// AVANT
return (
  <div className="max-w-7xl mx-auto space-y-6 p-6">
    {/* Contenu */}
  </div>
);

// APRÈS
return (
  <ParticulierLayout>
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Contenu */}
    </div>
  </ParticulierLayout>
);
```

### Solution 2: Afficher le prix clairement

**Card "Résumé Financier"** (ligne ~615):

**AVANT**:
```jsx
<div className="space-y-4">
  {totals.basePrice > 0 ? (
    <>
      <div className="space-y-3">
        {/* Prix affiché seulement si totals.basePrice > 0 */}
```

**APRÈS**: Ajouter fallback pour afficher le prix même si `totals` n'est pas calculé
```jsx
<div className="space-y-4">
  {(totals.basePrice > 0 || context.parcelle?.price) ? (
    <>
      <div className="flex justify-between text-lg">
        <span className="font-semibold">Prix de vente:</span>
        <span className="font-bold text-blue-600">
          {(context.parcelle?.price || totals.basePrice).toLocaleString()} FCFA
        </span>
      </div>
```

### Solution 3: Pre-remplir le champ prix

**Ligne 212-223**: Input du prix

**AVANT**:
```jsx
<Input 
  value={price} 
  onChange={(e) => setPrice(e.target.value)}
  placeholder="Prix du vendeur"
  disabled={!!context.parcelle?.price}
/>
```

**APRÈS**: S'assurer que le prix est pré-rempli
```jsx
<Input 
  value={price || context.parcelle?.price?.toString() || ''} 
  onChange={(e) => setPrice(e.target.value)}
  placeholder="Prix du vendeur"
  disabled={!!context.parcelle?.price}
/>
{!price && context.parcelle?.price && (
  <div className="text-xs text-amber-600 mt-1">
    ⚠️ Prix auto-rempli: {context.parcelle.price.toLocaleString()} FCFA
  </div>
)}
```

## 🔧 Corrections à appliquer

### Correction 1: Ajouter ParticulierLayout

**Fichier**: `src/pages/buy/OneTimePaymentPage.jsx`

**Ligne 1** (après les imports existants):
```javascript
import ParticulierLayout from '@/components/layout/ParticulierLayout';
```

**Ligne 163** (wrapper du return):
```javascript
return (
  <ParticulierLayout>
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* ... tout le contenu existant ... */}
    </div>
  </ParticulierLayout>
);
```

### Correction 2: Améliorer l'affichage du prix

**Ligne ~615** (Card Résumé Financier):

Remplacer:
```jsx
{totals.basePrice > 0 ? (
```

Par:
```jsx
{(totals.basePrice > 0 || context.parcelle?.price || price) ? (
```

Ajouter après le titre de la card:
```jsx
<CardContent>
  {/* NOUVEAU: Affichage immédiat du prix de la parcelle */}
  {context.parcelle && (
    <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">Bien sélectionné:</span>
        <Badge variant="outline" className="bg-white">
          {context.parcelle.surface || 'N/A'} m²
        </Badge>
      </div>
      <div className="text-lg font-bold text-gray-900">
        {context.parcelle.title || 'Terrain'}
      </div>
      <div className="text-sm text-gray-600 mt-1">
        {context.parcelle.location || 'Dakar, Sénégal'}
      </div>
      <div className="mt-3 pt-3 border-t border-blue-200">
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-gray-700">Prix de vente:</span>
          <span className="text-2xl font-bold text-blue-600">
            {(context.parcelle.price || price || 0).toLocaleString()} FCFA
          </span>
        </div>
      </div>
    </div>
  )}
  
  {/* Reste du contenu existant */}
  <div className="space-y-4">
```

### Correction 3: Fix Input prix

**Ligne 212**:

```jsx
<Input 
  value={price} 
  onChange={(e) => setPrice(e.target.value)}
  placeholder="Prix du vendeur"
  disabled={!!context.parcelle?.price}
/>
{context.parcelle?.price && (
  <div className="text-xs text-green-600 mt-1 flex items-center">
    <CheckCircle className="w-3 h-3 mr-1" />
    Prix fixé par le vendeur: {context.parcelle.price.toLocaleString()} FCFA
  </div>
)}
```

## 📋 Checklist de test

### Test 1: Navigation depuis ParcelleDetailPage
1. ✅ Aller sur `/parcelle/9a2dce41-8e2c-4888-b3d8-0dce41339b5a`
2. ✅ Cliquer sur "Acheter Maintenant" → Choisir "Paiement Direct"
3. ✅ Vérifier redirection vers `/buy/one-time`
4. ✅ **VÉRIFIER**: Sidebar Particulier visible à gauche
5. ✅ **VÉRIFIER**: Prix affiché: "27 500 000 FCFA"

### Test 2: Affichage du prix
Dans `/buy/one-time`:
1. ✅ Card "Résumé Financier" affiche le prix immédiatement
2. ✅ Box "Bien sélectionné" avec:
   - Titre: "Terrain Résidentiel"
   - Location: "Dakar, Sénégal"
   - Surface: "500 m²"
   - **Prix: 27 500 000 FCFA** (en gros, bleu)
3. ✅ Input "Prix de vente affiché" pré-rempli et disabled
4. ✅ Message: "Prix fixé par le vendeur"

### Test 3: Sidebar Particulier
1. ✅ Sidebar visible avec menu:
   - Vue d'ensemble
   - Rechercher Terrains
   - Mes Favoris
   - Mes Demandes
   - Messages
   - Assistant IA
   - Paramètres
2. ✅ Logo "Teranga Foncier" visible en haut
3. ✅ Bouton "Déconnexion" en bas
4. ✅ Navigation fonctionne (cliquer sur items)

### Test 4: Calculs financiers
1. ✅ Remplir "Prix proposé/négocié": 26 000 000
2. ✅ Sélectionner mode de paiement: "Virement bancaire"
3. ✅ Cocher "Assurance transaction"
4. ✅ Sélectionner "Vérification Standard"
5. ✅ **VÉRIFIER**: Total calculé correctement:
   - Prix de base: 27 500 000 FCFA
   - Frais de paiement: 5 000 FCFA
   - Assurance (1%): 275 000 FCFA
   - Vérification: 25 000 FCFA
   - **TOTAL**: 27 805 000 FCFA

## 🎯 Résultat attendu

### AVANT corrections:
- ❌ Page pleine largeur sans sidebar
- ❌ Prix peut être vide
- ❌ Navigation confuse (retour difficile)
- ❌ Incohérent avec le reste du dashboard

### APRÈS corrections:
- ✅ Sidebar Particulier visible et fonctionnelle
- ✅ Prix affiché en grand et clair
- ✅ Navigation cohérente avec le dashboard
- ✅ Contexte d'achat bien visible (parcelle, localisation, surface)
- ✅ UX homogène sur toute la plateforme

## 📊 Métriques

- **Fichiers à modifier**: 1 (`OneTimePaymentPage.jsx`)
- **Imports à ajouter**: 1 (`ParticulierLayout`)
- **Lignes à modifier**: ~10 lignes
- **Composants à wrapper**: 1 (le return principal)
- **Affichage du prix**: +1 card d'information
- **Temps estimé**: 10 minutes

---

**Date**: 14 octobre 2025  
**Priorité**: 🔴 HAUTE  
**Status**: ⏳ En attente d'application
