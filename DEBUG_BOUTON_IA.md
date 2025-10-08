# 🔍 DEBUG - Bouton "Générer avec l'IA" ne marche pas

## ❌ SYMPTÔME

Bouton "✨ Générer avec l'IA" ne fait rien quand on clique.

---

## ✅ VÉRIFICATIONS

### 1️⃣ Le bouton est-il gris (désactivé) ?

**Si OUI** → Normal ! Le bouton est désactivé jusqu'à ce que vous remplissiez :
- ✅ **Type de terrain** (Résidentiel, Commercial, Agricole, etc.)
- ✅ **Surface** (ex: 500)
- ✅ **Ville** (ex: Dakar)

**Solution :**
1. À l'**Étape 1**, sélectionner un **Type de terrain** (cliquer sur un des 5 boutons)
2. Aller à l'**Étape 2**, remplir **Ville** (Dakar)
3. Aller à l'**Étape 3**, remplir **Surface** (500)
4. **Revenir à l'Étape 1**
5. Le bouton "✨ Générer avec l'IA" devrait être **violet** (activé)
6. Cliquer dessus

---

### 2️⃣ Le bouton est violet mais rien ne se passe ?

**Vérifier la console navigateur :**

1. Ouvrir DevTools : **F12** (ou Ctrl+Shift+I)
2. Aller dans l'onglet **Console**
3. Cliquer sur le bouton "✨ Générer avec l'IA"
4. Regarder les messages

**Messages possibles :**

#### a) "Veuillez remplir le type, la surface et la ville d'abord"
→ Il manque des champs. Retour au point 1️⃣

#### b) Erreur "toast is not defined"
→ Le package `sonner` n'est pas installé
```bash
npm install sonner
```

#### c) Erreur "handleInputChange is not defined"
→ Problème de code, vérifier le fichier

#### d) Aucun message
→ Le bouton ne déclenche pas la fonction

---

### 3️⃣ Le bouton déclenche mais la description ne change pas ?

**Test manuel dans la console :**

```javascript
// Dans la console DevTools, taper :
console.log('Test IA');
```

Si ça affiche "Test IA" → La console fonctionne

**Tester le bouton :**
1. Cliquer sur "✨ Générer avec l'IA"
2. Attendre 2 secondes
3. Le champ description devrait se remplir automatiquement

**Si rien ne se passe :**
- Vérifier que vous êtes bien à l'**Étape 1**
- Vérifier que le champ "Description" est vide ou modifiable
- Rafraîchir la page (F5) et réessayer

---

## 🧪 TEST COMPLET ÉTAPE PAR ÉTAPE

### ÉTAPE 1 : Préparer les données

1. Aller sur `/vendeur/add-property`
2. **Étape 1** :
   - Cliquer sur **"Résidentiel"** (le premier bouton avec l'icône maison)
   - ✅ Le bouton devrait devenir bleu
   - ⚠️ **NE PAS** cliquer sur "Générer avec l'IA" tout de suite !

3. Cliquer sur **"Suivant"** (bas de page)

4. **Étape 2 - Localisation** :
   - Adresse : "Route des Almadies"
   - Ville : **Dakar** (sélectionner dans le menu déroulant)
   - Région : Dakar
   - Cliquer **"Suivant"**

5. **Étape 3 - Prix & Surface** :
   - Surface : **500**
   - Prix : 85000000
   - ✅ Vérifier que le prix/m² s'affiche : "170,000 FCFA/m²"

---

### ÉTAPE 2 : Retourner à l'Étape 1

1. Cliquer sur **"Précédent"** deux fois
2. Vous êtes de retour à l'**Étape 1**
3. Le bouton "✨ Générer avec l'IA" devrait maintenant être **VIOLET** (activé)

---

### ÉTAPE 3 : Générer la description

1. Cliquer sur **"✨ Générer avec l'IA"**
2. Le bouton devient gris avec "Génération..." + icône tournante
3. **Attendre 2 secondes**
4. Le champ "Description" se remplit automatiquement avec un texte comme :

```
Magnifique terrain résidentiel de 500 m² situé à Dakar.

Ce terrain offre un potentiel exceptionnel pour la construction 
d'une villa moderne.

Caractéristiques principales :
- Emplacement stratégique à Dakar
- Surface généreuse de 500 m²
- Zonage conforme aux normes
- Accès facile et viabilisé

Ce terrain représente une opportunité unique pour concrétiser 
votre projet immobilier dans un environnement en plein 
développement. Titre foncier en règle.
```

5. Un toast vert apparaît : "✨ Description générée par l'IA avec succès !"

---

## 🔧 SI ÇA NE MARCHE TOUJOURS PAS

### Solution 1 : Vérifier que les scripts SQL sont exécutés

Le formulaire a besoin des tables pour fonctionner. Exécuter dans Supabase SQL Editor :

1. `create-properties-table.sql`
2. `create-property-photos-table.sql` (version corrigée)
3. `fix-storage-policies.sql`

---

### Solution 2 : Vérifier la console pour erreurs

Ouvrir DevTools (F12) et chercher des erreurs en rouge.

**Erreurs possibles :**

```
❌ Cannot read property 'type' of undefined
→ propertyData n'est pas initialisé

❌ toast is not defined
→ npm install sonner

❌ handleInputChange is not defined  
→ Problème dans le code
```

---

### Solution 3 : Test de la fonction manuellement

Dans la console DevTools, taper :

```javascript
// Vérifier que la fonction existe
console.log(typeof generateAIDescription);
// Devrait afficher : "function"
```

---

### Solution 4 : Recharger l'application

```bash
# Arrêter le serveur (Ctrl+C)
# Relancer
npm run dev
```

---

## ✅ COMPORTEMENT ATTENDU

### Avant de cliquer :
```
Bouton : [ ✨ Générer avec l'IA ] (Violet)
Description : (Vide ou avec du texte)
```

### Pendant génération (2 secondes) :
```
Bouton : [⟳ Génération...] (Gris, désactivé)
Description : (Inchangé)
```

### Après génération :
```
Bouton : [ ✨ Générer avec l'IA ] (Violet, réactivé)
Description : (Rempli avec 400+ caractères générés)
Toast : "✨ Description générée par l'IA avec succès !"
Compteur : "458 caractères - ✓ Description suffisante"
```

---

## 🎥 VIDÉO DE DÉMO

Si vous voulez enregistrer une vidéo pour que je puisse voir :

1. Ouvrir `/vendeur/add-property`
2. Ouvrir DevTools (F12) > Console
3. Remplir Type, Ville, Surface
4. Retourner Étape 1
5. Cliquer "Générer avec l'IA"
6. Capturer ce qui se passe (ou copier les erreurs de la console)

---

## 📊 CHECKLIST DE DEBUG

```
☐ Type de terrain sélectionné (Étape 1)
☐ Ville remplie (Étape 2)
☐ Surface remplie (Étape 3)
☐ Revenu à l'Étape 1
☐ Bouton est VIOLET (pas gris)
☐ DevTools ouvert (F12)
☐ Onglet Console visible
☐ Aucune erreur rouge dans la console
☐ Clic sur le bouton
☐ Message "Génération..." apparaît
☐ Attendre 2 secondes
☐ Description se remplit
☐ Toast vert apparaît
```

Si TOUS les points sont cochés mais ça ne marche pas → Copier les erreurs de la console et me les envoyer.

---

**Résumé :** Le bouton fonctionne, mais il faut d'abord remplir Type + Ville + Surface !
