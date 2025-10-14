# 🔧 Erreur de Contrainte Role - Solution

## ❌ Erreur Rencontrée

```
ERROR: new row for relation "profiles" violates check constraint "profiles_role_check"
Role: Particulier ❌ (REFUSÉ)
```

## 🔍 Cause

La table `profiles` a une **contrainte CHECK** qui limite les valeurs possibles pour la colonne `role`. Le rôle `'Particulier'` n'est **pas dans la liste autorisée**.

## ✅ Solution

### Option 1: Utiliser 'Acheteur' (RECOMMANDÉ)

Le script `fix-database-quick-v2.sql` (déjà copié dans votre presse-papier) va essayer `'Acheteur'` au lieu de `'Particulier'`.

**Dans Supabase SQL Editor:**
1. **Effacez** l'ancien script
2. **Collez** le nouveau avec `Ctrl+V`
3. **Cliquez** sur "Run"

### Option 2: Voir les Rôles Valides (si Option 1 échoue)

Si le script échoue encore, il affichera une table avec les **rôles valides** existants dans votre base.

Vous verrez quelque chose comme:
```
📊 RÔLES EXISTANTS:
role                | nombre_users
--------------------|-------------
Admin               | 5
Vendeur             | 12
Acheteur            | 8
Notaire             | 3
```

### Option 3: Modifier le Script

Si `'Acheteur'` ne marche pas, éditez le script ligne 27:

```sql
-- Remplacez cette ligne:
v_role := 'Acheteur';

-- Par un des rôles affichés dans la table, par exemple:
v_role := 'Admin';  -- ou 'Vendeur', 'Notaire', etc.
```

---

## 📋 Rôles Probables dans TerangaFoncier

D'après votre code, les rôles valides sont probablement:

| Rôle | Description | Permissions |
|------|-------------|-------------|
| `Admin` | Administrateur | Toutes |
| `Acheteur` | Acheteur/Particulier | Acheter, voir propriétés |
| `Vendeur` | Vendeur | Vendre, gérer annonces |
| `Vendeur Particulier` | Vendeur particulier | Vendre occasionnellement |
| `Vendeur Pro` | Vendeur professionnel | Vendre en volume |
| `Notaire` | Notaire | Valider transactions |
| `Géomètre` | Géomètre | Vérifier parcelles |
| `Banque` | Institution bancaire | Financement |
| `Municipalité` | Autorité locale | Gestion zones |
| `Agent Foncier` | Agent immobilier | Intermédiaire |
| `Promoteur` | Promoteur immobilier | Développer projets |

---

## 🎯 Pourquoi 'Particulier' ne marche pas?

Dans votre système:
- ✅ **Route**: `/acheteur` (dans le code React)
- ✅ **Role DB**: `'Acheteur'` (dans Supabase)
- ❌ **"Particulier"**: Juste un alias/label d'affichage

**Correction à faire**: Utiliser `'Acheteur'` dans la base de données.

---

## 🚀 Actions Immédiates

### MAINTENANT:

1. **Dans Supabase SQL Editor** (devrait être ouvert):
   - Effacez le script actuel
   - Collez avec `Ctrl+V` (nouveau script déjà copié)
   - Cliquez sur "Run"

2. **Regardez les résultats**:
   - ✅ "Profil créé avec rôle: Acheteur"
   - 📊 Table des rôles existants
   - ✅ Profil visible avec email et rôle

3. **Si ça marche**:
   - Retournez dans votre app (localhost:5173)
   - Rafraîchissez avec `Ctrl+Shift+R`
   - Vérifiez la console (F12) - erreurs disparues!

---

## 🔄 Si le Script Échoue Encore

Exécutez **UNIQUEMENT** ce diagnostic:

```sql
-- Copier/coller ceci dans SQL Editor
SELECT 
  pg_get_constraintdef(oid) AS contrainte_role
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass
  AND conname LIKE '%role%';
```

**Envoyez-moi le résultat** et je vous donnerai le rôle exact à utiliser.

---

## 📝 Fichiers Mis à Jour

| Fichier | Description | Status |
|---------|-------------|--------|
| `fix-database-quick-v2.sql` | ✅ Nouveau script avec rôle 'Acheteur' | **Utiliser celui-ci** |
| `fix-database-quick.sql` | ❌ Ancien script avec 'Particulier' | Obsolète |
| `diagnostic-roles.sql` | 🔍 Script de diagnostic seul | Si besoin |

---

## 💡 Notes Importantes

### Différence Particulier vs Acheteur

Dans votre code React:
```jsx
// Routes
<Route path="acheteur" ...>  // ✅ URL route

// Protection
allowedRoles={['Acheteur','Particulier']}  // ✅ Les 2 acceptés
```

Dans votre base de données:
```sql
-- Valeur réelle stockée
role = 'Acheteur'  -- ✅ Nom officiel

-- Alias d'affichage (optionnel)
display_name = 'Particulier'  -- Juste pour l'UI
```

**Solution longue**: Ajouter 'Particulier' à la contrainte CHECK, mais ce n'est pas nécessaire si 'Acheteur' marche!

---

## ✅ Checklist Finale

Après avoir exécuté le nouveau script:

- [ ] Script exécuté sans erreur CHECK constraint
- [ ] Message: "✅ Profil créé avec rôle: Acheteur"
- [ ] Table affichée avec les rôles existants
- [ ] Profil visible avec email `family.diallo@teranga-foncier.sn`
- [ ] Application rafraîchie (Ctrl+Shift+R)
- [ ] Console sans erreur "Cannot coerce to single JSON object"
- [ ] Page accessible sans crash

**Si tous cochés → Problème résolu! 🎉**

---

## 🆘 Debug Rapide

### Si vous voyez encore l'erreur après le script v2:

**Copiez-moi le message EXACT** qui commence par:
```
ERROR: new row for relation "profiles" violates check constraint...
```

Et je vous dirai quel rôle exact utiliser! 🎯
