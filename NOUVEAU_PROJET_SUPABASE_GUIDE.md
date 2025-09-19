# 🔧 Guide de Configuration Nouveau Projet Supabase

## ⚠️ Problème Identifié
Les URLs Supabase actuelles ne sont plus accessibles :
- ❌ `https://ndenqikcogzrkrjnlvns.supabase.co` (URL principale)  
- ❌ `https://upqthvkkgmykydxrpupm.supabase.co` (URL alternative)

**Cause probable :** Les projets Supabase ont été supprimés ou suspendus.

## 🎯 Solution : Créer un Nouveau Projet Supabase

### Étape 1 : Créer le Projet
1. Allez sur https://app.supabase.com
2. Connectez-vous ou créez un compte
3. Cliquez "New Project"
4. Choisissez :
   - **Name:** terangafoncier-production
   - **Database Password:** [Générer un mot de passe fort]
   - **Region:** Central EU (Francfort) ou Paris
5. Cliquez "Create new project"

### Étape 2 : Récupérer les Nouvelles Clés
Une fois le projet créé, allez dans **Settings → API** :

```bash
# Remplacez dans .env
VITE_SUPABASE_URL="https://VOTRE_NOUVEAU_PROJET.supabase.co"
VITE_SUPABASE_ANON_KEY="VOTRE_NOUVELLE_CLE_ANON"
```

### Étape 3 : Configurer l'Authentification
Dans **Authentication → Settings** :
- ✅ Activer "Enable email confirmations"
- ✅ Configurer "Site URL": https://votre-domaine.com
- ✅ Ajouter les "Redirect URLs" nécessaires

### Étape 4 : Créer la Structure de Base de Données

Exécutez ce SQL dans **SQL Editor** :

```sql
-- Créer la table profiles
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT CHECK (role IN ('Admin', 'Particulier', 'Vendeur', 'Promoteur', 'Banque', 'Notaire', 'Mairie')) DEFAULT 'Particulier',
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer la table properties
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price_fcfa INTEGER,
    location TEXT,
    surface_m2 INTEGER,
    owner_id UUID REFERENCES profiles(id),
    status TEXT DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer la table annonces
CREATE TABLE annonces (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price_fcfa INTEGER,
    location TEXT,
    surface_m2 INTEGER,
    seller_id UUID REFERENCES profiles(id),
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE annonces ENABLE ROW LEVEL SECURITY;

-- Politiques de base (à ajuster selon besoins)
CREATE POLICY "Profils publics" ON profiles FOR SELECT USING (true);
CREATE POLICY "Utilisateur peut voir son profil" ON profiles FOR ALL USING (auth.uid() = id);

-- Fonction pour créer automatiquement un profil
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    new.id, 
    new.email,
    new.raw_user_meta_data->>'name',
    COALESCE(new.raw_user_meta_data->>'role', 'Particulier')
  );
  RETURN new;
END;
$$ language plpgsql security definer;

-- Trigger pour créer le profil automatiquement
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
```

### Étape 5 : Tester la Nouvelle Configuration

Après mise à jour du .env, exécutez :
```bash
node test-supabase-connection.mjs
```

## 🔒 Sécurité Production

### Variables d'environnement à configurer :
```bash
# Supabase
VITE_SUPABASE_URL="https://NOUVEAU_PROJET.supabase.co"
VITE_SUPABASE_ANON_KEY="NOUVELLE_CLE_ANON"

# OpenAI (optionnel)
VITE_OPENAI_API_KEY="votre_cle_openai"

# Blockchain (si utilisé)
VITE_POLYGON_RPC_URL="https://polygon-rpc.com"
```

### Activer les fonctionnalités nécessaires :
- ✅ **Authentication** : Email + Password
- ✅ **Database** : PostgreSQL avec RLS
- ✅ **Storage** : Pour les avatars/images (si nécessaire)
- ✅ **Edge Functions** : Si l'app utilise des fonctions serverless

## 📝 Fichiers à Mettre à Jour

Après création du nouveau projet, mettre à jour :
1. `.env` (variables principales)
2. `.env.production` 
3. `scripts/test-account-system.js`
4. `scripts/cleanup-database.js`
5. Tous les autres scripts avec anciennes URLs

## ✅ Validation

Une fois configuré :
1. ✅ Connexion Supabase opérationnelle
2. ✅ Création de compte utilisateur fonctionne
3. ✅ Authentification fonctionne
4. ✅ Tables créées et accessibles
5. ✅ Politiques RLS configurées

---

**🎯 Objectif Final :** Application prête pour vrais utilisateurs avec base de données Supabase propre et fonctionnelle.