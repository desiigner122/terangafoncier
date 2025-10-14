# 🚨 CORRECTION URGENTE - ERREURS SUPABASE

## ❌ Problème Actuel

Votre application ne peut pas charger car:
1. **Profil manquant** - L'utilisateur `3f3083ba...` n'existe pas dans la table `profiles`
2. **Colonne manquante** - La colonne `metadata` n'existe pas dans la table `requests`

## ✅ Solution Immédiate (5 minutes)

### Option A: Script Rapide (RECOMMANDÉ)

**Utilisez**: `fix-database-quick.sql` (plus court, corrige juste vos erreurs)

1. **Ouvrir** → https://supabase.com/dashboard/project/ndenqikcogzrkrjnlvns/editor
2. **Copier** le contenu de `fix-database-quick.sql`
3. **Coller** dans l'éditeur SQL
4. **Cliquer** sur "Run" (bouton vert en bas à droite)
5. **Vérifier** les 3 tables de résultats ✅

### Option B: Script Complet

**Utilisez**: `fix-database-errors.sql` (plus long, mais corrige tout + ajoute sécurités)

Mêmes étapes que Option A

### Option C: PowerShell Automatique

```powershell
# Exécuter dans PowerShell
cd "c:\Users\Smart Business\Desktop\terangafoncier"
.\apply-database-fix.ps1
```

Ce script va:
- ✅ Copier le SQL dans votre presse-papier
- ✅ Ouvrir Supabase Dashboard automatiquement
- ✅ Vous guider étape par étape

---

## 📋 Étapes Détaillées (si besoin d'aide)

### 1️⃣ Ouvrir Supabase SQL Editor

```
https://supabase.com/dashboard/project/ndenqikcogzrkrjnlvns/editor
```

Ou:
- Aller sur https://supabase.com/dashboard
- Sélectionner votre projet "terangafoncier"
- Menu gauche → Cliquer sur l'icône **`{ }`** (SQL Editor)

### 2️⃣ Créer une Nouvelle Requête

- Cliquer sur **"+ New query"** en haut à gauche
- Ou cliquer sur le bouton **"+"**

### 3️⃣ Copier le Script

**Windows**:
```powershell
# Méthode 1: PowerShell
Get-Content "c:\Users\Smart Business\Desktop\terangafoncier\fix-database-quick.sql" | Set-Clipboard
```

**Ou manuellement**:
- Ouvrir `fix-database-quick.sql` dans VS Code
- Sélectionner tout (Ctrl+A)
- Copier (Ctrl+C)

### 4️⃣ Coller et Exécuter

- Dans l'éditeur SQL Supabase: **Ctrl+V**
- Cliquer sur le bouton vert **"Run"** en bas à droite
- Ou appuyer sur **Ctrl+Enter**

### 5️⃣ Vérifier les Résultats

Vous devriez voir **3 tables** apparaître en bas:

**Table 1 - Profil créé**:
```
id                                   | email              | role        | full_name | status
-------------------------------------|--------------------|-----------  |-----------|------------
3f3083ba-4f40-4045-b6e6-7f009a6c2cb2 | votre@email.com    | Particulier | Nom       | ✅ Profil OK
```

**Table 2 - Colonne metadata**:
```
column_name | data_type | is_nullable | column_default | status
------------|-----------|-------------|----------------|---------------
metadata    | jsonb     | YES         | '{}'::jsonb    | ✅ Colonne OK
```

**Table 3 - Table requests**:
```
total_requests | status
---------------|-------------------
0              | ✅ Table requests OK
```

### 6️⃣ Tester l'Application

1. Retourner dans votre navigateur (localhost:5173)
2. **Rafraîchir la page** (Ctrl+Shift+R ou F5)
3. Vérifier la console (F12) → Onglet Console
4. **Les erreurs devraient avoir disparu!** ✅

---

## 🔍 Vérification Manuelle (si toujours des erreurs)

Si après le script vous avez toujours des erreurs, exécutez ces requêtes **UNE PAR UNE** dans SQL Editor:

### Vérifier le profil
```sql
SELECT * FROM profiles WHERE id = '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2';
```
**Résultat attendu**: 1 ligne avec email et role

### Vérifier la colonne metadata
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'requests' AND column_name = 'metadata';
```
**Résultat attendu**: 1 ligne `metadata | jsonb`

### Vérifier la table support_tickets
```sql
SELECT COUNT(*) FROM support_tickets;
```
**Résultat attendu**: Un nombre (peut être 0)

---

## ❓ FAQ

### Q: "ERROR: relation 'requests' does not exist"
**A**: La table `requests` n'existe pas. Utilisez le script complet `fix-database-errors.sql` au lieu du quick

### Q: "ERROR: permission denied for table profiles"
**A**: Vous n'êtes pas connecté avec le bon compte. Vérifiez que vous êtes owner du projet Supabase

### Q: Le script s'exécute mais les erreurs persistent
**A**: 
1. Vérifiez que les 3 tables de résultats s'affichent
2. Videz le cache du navigateur (Ctrl+Shift+Delete)
3. Rafraîchissez avec Ctrl+Shift+R (pas juste F5)
4. Si ça ne marche toujours pas, partagez le message d'erreur exact

### Q: "NOTICE: ❌ User introuvable dans auth.users"
**A**: Le user n'existe pas dans la base auth. Créez un nouveau compte ou connectez-vous avec un compte existant

---

## 🆘 Besoin d'Aide?

Si le script ne fonctionne pas:

1. **Copiez** le message d'erreur EXACT de Supabase
2. **Screenshot** de l'éditeur SQL avec l'erreur
3. **Vérifiez** que vous êtes bien connecté au bon projet (ndenqikcogzrkrjnlvns)

---

## 📊 Fichiers Disponibles

| Fichier | Description | Quand l'utiliser |
|---------|-------------|------------------|
| `fix-database-quick.sql` | ⚡ Script rapide (30 lignes) | **MAINTENANT** - Corrige vos 2 erreurs |
| `fix-database-errors.sql` | 📦 Script complet (280 lignes) | Après le quick, pour sécuriser |
| `apply-database-fix.ps1` | 🤖 Script PowerShell auto | Si vous préférez l'automation |

---

## ✅ Checklist

Après avoir exécuté le script:

- [ ] Script exécuté sans erreurs
- [ ] 3 tables de résultats affichées avec ✅
- [ ] Application rafraîchie (Ctrl+Shift+R)
- [ ] Console sans erreurs "Fetch error"
- [ ] Page `/acheteur/buy/one-time` accessible
- [ ] Sidebar s'affiche correctement

**Si tous les ✅ sont cochés → Problème résolu! 🎉**

---

## 🎯 Résumé Ultra-Rapide

```bash
1. Ouvrir → https://supabase.com/dashboard/project/ndenqikcogzrkrjnlvns/editor
2. Copier → fix-database-quick.sql
3. Coller → Dans l'éditeur SQL
4. Run → Cliquer sur bouton vert
5. Vérifier → 3 tables avec ✅
6. Rafraîchir → Ctrl+Shift+R
7. ✅ Fini!
```
