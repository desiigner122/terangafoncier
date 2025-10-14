# Installation Supabase CLI sur Windows

## Méthode 1 : Via Scoop (Recommandé)

```powershell
# Installer Scoop (si pas déjà installé)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

# Installer Supabase CLI
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

## Méthode 2 : Via npm

```powershell
npm install -g supabase
```

## Méthode 3 : Téléchargement direct

1. Aller sur https://github.com/supabase/cli/releases
2. Télécharger `supabase_windows_amd64.zip`
3. Extraire dans `C:\Program Files\Supabase`
4. Ajouter au PATH

## Vérification

```powershell
supabase --version
```

## Se connecter à ton projet

```powershell
# 1. Lier le projet local au projet Supabase
supabase link --project-ref ndenqikcogzrkrjnlvns

# 2. Obtenir ton access token depuis Supabase Dashboard
# Settings > API > Project API keys > service_role key (secret)

# 3. Se connecter
supabase login

# 4. Exécuter des requêtes SQL
supabase db query "SELECT * FROM profiles LIMIT 5"

# 5. Voir les migrations
supabase db diff

# 6. Créer une migration
supabase migration new fix-vendor-policies
```

## Commandes utiles

```powershell
# Lister les tables
supabase db query "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"

# Voir les policies
supabase db query "SELECT * FROM pg_policies WHERE tablename='properties'"

# Exécuter un fichier SQL
supabase db execute --file FIX-ADMIN-PERMISSIONS.sql

# Reset la DB locale (attention !)
supabase db reset
```

## Alternative : psql direct

Si tu as PostgreSQL installé, tu peux te connecter directement :

```powershell
# Récupère la connection string depuis Supabase Dashboard
# Settings > Database > Connection string > URI

psql "postgresql://postgres:[PASSWORD]@db.ndenqikcogzrkrjnlvns.supabase.co:5432/postgres"
```

---

**Avantage du CLI** : Tu peux exécuter les scripts SQL directement depuis VS Code terminal au lieu de copier-coller dans le dashboard ! 🎯
