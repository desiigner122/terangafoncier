# ⚡ ACTION IMMÉDIATE - 3 SCRIPTS À EXÉCUTER

## 🚨 PROBLÈME

```
❌ Erreur : "Could not find the 'address' column"
❌ Bouton "Publier" tourne indéfiniment
❌ Cause : Table properties n'existe pas !
```

---

## ✅ SOLUTION (5 MINUTES)

### 1️⃣ Ouvrir Supabase SQL Editor

https://supabase.com/dashboard → Projet TerangaFoncier → SQL Editor

---

### 2️⃣ Exécuter 3 Scripts

#### ✅ SCRIPT 1 : Créer table `properties`
```
Fichier : supabase-migrations/create-properties-table.sql
Action  : Copier TOUT → Coller dans SQL Editor → Run
```

#### ✅ SCRIPT 2 : Créer table `property_photos`
```
Fichier : supabase-migrations/create-property-photos-table.sql
Action  : Copier TOUT → Coller dans SQL Editor → Run
```

#### ✅ SCRIPT 3 : Corriger RLS Storage
```
Fichier : supabase-migrations/fix-storage-policies.sql
Action  : Copier TOUT → Coller dans SQL Editor → Run
```

---

### 3️⃣ Tester

```bash
1. Aller sur /vendeur/add-property
2. Étape 1 : Tester bouton "✨ Générer avec l'IA"
3. Étape 7 : Uploader 3+ photos
4. Étape 8 : Cocher "Titre foncier" + Voir IA validation
5. Cliquer "Publier"
6. ✅ Devrait afficher : "Terrain ajouté avec succès !"
```

---

## 🎯 L'IA EST DÉJÀ LÀ !

### Étape 1 : Bouton "✨ Générer avec l'IA"
- Génère description automatique
- Basée sur type, surface, ville

### Étape 8 : Section "✨ Vérification Intelligente IA"
- Analyse prix/m²
- Vérifie photos
- Score qualité 95/100

**Mais vous ne pouvez pas la voir car le formulaire ne se soumet pas !**

Une fois les 3 scripts exécutés → Tout fonctionne ✨

---

**Temps requis :** 5 minutes  
**Difficulté :** Facile (copier-coller)  
**Résultat :** Formulaire 100% fonctionnel avec IA
