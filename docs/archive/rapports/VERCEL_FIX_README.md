# Instructions pour corriger les variables d'environnement Vercel

## Problème identifié
L'application déployée sur Vercel utilise encore l'ancien projet Supabase :
- ❌ Ancienne URL : `mqcsbdaonvocwfcoqyim.supabase.co`
- ✅ Nouvelle URL : `ndenqikcogzrkrjnlvns.supabase.co`

## Solution : Mettre à jour les variables d'environnement sur Vercel

### Étape 1 : Accéder au dashboard Vercel
1. Allez sur https://vercel.com
2. Connectez-vous à votre compte
3. Sélectionnez votre projet "terangafoncier"

### Étape 2 : Accéder aux variables d'environnement
1. Dans le menu latéral, cliquez sur "Settings"
2. Cliquez sur "Environment Variables"

### Étape 3 : Supprimer les anciennes variables
1. Supprimez les variables existantes :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Étape 4 : Ajouter les nouvelles variables
Ajoutez ces deux nouvelles variables avec les valeurs suivantes :

**Variable 1 :**
- Name: `VITE_SUPABASE_URL`
- Value: `https://ndenqikcogzrkrjnlvns.supabase.co`
- Environment: `Production`, `Preview`, `Development`

**Variable 2 :**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM`
- Environment: `Production`, `Preview`, `Development`

### Étape 5 : Redeployer
1. Cliquez sur "Save"
2. Vercel va automatiquement redeployer votre application
3. Attendez que le déploiement soit terminé

### Étape 6 : Vérifier la correction
1. Allez sur https://terangafoncier.vercel.app
2. Ouvrez la console du navigateur (F12)
3. Les erreurs "Could not find the table 'public.users'" devraient disparaître

## Commande alternative (si vous avez la CLI Vercel)
Si vous avez la CLI Vercel installée, vous pouvez aussi utiliser :

```bash
# Supprimer les anciennes variables
vercel env rm VITE_SUPABASE_URL
vercel env rm VITE_SUPABASE_ANON_KEY

# Ajouter les nouvelles variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Redeployer
vercel --prod
```

## Vérification finale
Après le déploiement, testez :
1. L'inscription utilisateur
2. La connexion utilisateur
3. L'accès au profil utilisateur

Si vous rencontrez encore des problèmes, vérifiez dans la console Supabase que la table `users` existe bien dans le projet `ndenqikcogzrkrjnlvns`.
