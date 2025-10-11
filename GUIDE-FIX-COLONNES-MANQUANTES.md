# 🔧 Guide Fix Colonnes Manquantes - Profiles

## 🎯 Problème Actuel

Les erreurs 400 proviennent de colonnes inexistantes dans la table `profiles`:
- ❌ `full_name` n'existe pas
- ❌ `nom` n'existe pas

Les requêtes actuelles:
```sql
SELECT id, email, full_name, nom FROM profiles
```

Génèrent des erreurs **HTTP 400** car ces colonnes ne sont pas dans la BDD.

---

## ✅ Solution en 3 Étapes

### Étape 1: Exécuter le Script SQL

1. **Ouvrez Supabase Dashboard**
   - Allez sur https://supabase.com/dashboard
   - Sélectionnez votre projet `terangafoncier`

2. **Ouvrez SQL Editor**
   - Menu latéral gauche → **SQL Editor**
   - Ou bouton **"New query"**

3. **Copiez le contenu du fichier**
   - Fichier: `ADD-MISSING-COLUMNS.sql` (dans la racine du projet)
   - Sélectionnez tout (Ctrl+A) et copiez (Ctrl+C)

4. **Collez dans SQL Editor**
   - Collez dans la zone de texte (Ctrl+V)

5. **Exécutez le script**
   - Cliquez sur **"Run"** (ou Ctrl+Enter)
   - ⏱️ Temps d'exécution: ~5-10 secondes

6. **Vérifiez les résultats**
   - Vous devriez voir dans les logs:
   ```
   ✅ Colonne full_name ajoutée
   ✅ Colonne nom ajoutée
   ✅ Cache PostgREST rafraîchi
   🎉 COLONNES AJOUTÉES AVEC SUCCÈS!
   ```

---

### Étape 2: Hard-Reload du Navigateur

Une fois le script exécuté avec succès:

1. **Ouvrez votre application** (localhost:5173 ou 5174)
2. **Hard-reload** pour vider le cache:
   - Windows/Linux: `Ctrl + Shift + R` ou `Ctrl + F5`
   - Mac: `Cmd + Shift + R`

---

### Étape 3: Vérification Console

1. **Ouvrez DevTools** (F12)
2. **Console Tab**
3. **Vérifiez qu'il n'y a plus d'erreurs:**
   - ❌ Plus d'erreur 400 sur `profiles?select=id,email,full_name,nom`
   - ❌ Plus d'erreur PGRST200 sur les FK relationships

---

## 📋 Ce que Fait le Script

### 1. Vérification des Colonnes Existantes
Liste toutes les colonnes actuelles de `profiles` pour diagnostic.

### 2. Ajout des Colonnes Manquantes
- Ajoute `full_name TEXT`
- Ajoute `nom TEXT` (alias pour compatibilité)
- Ajoute `first_name TEXT` (au cas où)
- Ajoute `last_name TEXT` (au cas où)

### 3. Migration des Données
Copie les données depuis `auth.users.raw_user_meta_data` si disponibles:
```sql
UPDATE profiles p
SET full_name = COALESCE(
    (SELECT u.raw_user_meta_data->>'full_name' FROM auth.users u WHERE u.id = p.id),
    (SELECT u.raw_user_meta_data->>'name' FROM auth.users u WHERE u.id = p.id),
    p.email
)
WHERE p.full_name IS NULL;
```

### 4. Rafraîchissement Cache Supabase
Force PostgREST à recharger le schéma:
```sql
NOTIFY pgrst, 'reload schema';
```

---

## 🔍 Vérification Manuelle (Optionnel)

Si vous voulez vérifier que tout fonctionne, exécutez cette requête dans SQL Editor:

```sql
-- Afficher les 5 premiers profils avec les nouvelles colonnes
SELECT 
    id,
    email,
    full_name,
    nom,
    first_name,
    last_name,
    created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 5;
```

Résultat attendu: Aucune erreur, colonnes affichées (même si NULL).

---

## ⚠️ Erreurs Possibles

### Erreur: "column already exists"
**Cause:** La colonne existe déjà
**Solution:** C'est normal ! Le script détecte et skip automatiquement

### Erreur: "permission denied"
**Cause:** Droits insuffisants
**Solution:** Utilisez un compte admin Supabase ou le compte owner du projet

### Erreur: "relation profiles does not exist"
**Cause:** La table `profiles` n'existe pas
**Solution:** Créez d'abord la table `profiles` (voir autres scripts de migration)

---

## 📊 Impact Attendu

### Avant (avec erreurs):
```
❌ GET /profiles?select=id,email,full_name,nom [400]
❌ Error: column "full_name" does not exist
```

### Après (sans erreur):
```
✅ GET /profiles?select=id,email,full_name,nom [200]
✅ Data returned successfully
```

---

## 🚀 Prochaines Étapes

Une fois ce fix appliqué:

1. ✅ Les pages admin devraient charger sans erreur 400
2. ✅ Les noms d'utilisateurs s'afficheront correctement
3. ✅ Plus besoin de fallback sur `email` pour l'affichage

Si vous voyez encore des erreurs PGRST200 (FK relationships):
- C'est normal, les FK constraints sont gérées par des requêtes séparées
- Le code actuel fait déjà des jointures manuelles en JavaScript
- Pas d'action supplémentaire nécessaire

---

## 📞 Support

Si vous rencontrez des problèmes:
1. Vérifiez les logs SQL Editor dans Supabase
2. Consultez la console browser (F12) pour les erreurs frontend
3. Relancez le script si nécessaire (il est idempotent)

---

**Date de création:** 11 Octobre 2025  
**Version:** 1.0  
**Auteur:** GitHub Copilot AI Assistant
