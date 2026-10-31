# 👥 GUIDE CRÉATION MANUELLE DES COMPTES - NOUVEAUX RÔLES

## 📋 Vue d'ensemble

Ce guide vous permet de créer manuellement les **6 comptes** pour les 3 nouveaux rôles dans Supabase :
- 🏛️ **2 Mairies** 
- 💰 **2 Investisseurs**
- 📐 **2 Géomètres**

## 🚀 ÉTAPE 1 : Accéder à Supabase

1. **Connectez-vous** à [supabase.com/dashboard](https://supabase.com/dashboard)
2. **Sélectionnez** votre projet Teranga Foncier
3. **Allez dans** l'onglet "Authentication" → "Users"

## 👤 ÉTAPE 2 : Créer les comptes utilisateurs

### 🏛️ MAIRIES (2 comptes)

#### **Compte 1 : Mairie de Dakar**
```
Email: urbanisme@mairie-dakar.sn
Mot de passe: password123
```
**Métadonnées utilisateur (User Metadata) :**
```json
{
  "role": "mairie",
  "full_name": "Seydou Guèye",
  "phone": "+221 33 823 55 00",
  "city": "Dakar",
  "organization": "Ville de Dakar",
  "department": "Service Urbanisme",
  "license": "MUN-2020-DKR-001",
  "specialization": "Permis de construire, Urbanisme",
  "zone_coverage": "Dakar métropolitain"
}
```

#### **Compte 2 : Commune de Thiès**
```
Email: technique@commune-thies.sn
Mot de passe: password123
```
**Métadonnées utilisateur (User Metadata) :**
```json
{
  "role": "mairie",
  "full_name": "Awa Gueye",
  "phone": "+221 33 951 10 25",
  "city": "Thiès",
  "organization": "Commune de Thiès",
  "department": "Service Technique",
  "license": "MUN-2019-THS-008",
  "specialization": "Voirie, Assainissement, Permis",
  "zone_coverage": "Région de Thiès"
}
```

### 💰 INVESTISSEURS (2 comptes)

#### **Compte 1 : Investisseur Local**
```
Email: mamadou.diagne@investor.com
Mot de passe: password123
```
**Métadonnées utilisateur (User Metadata) :**
```json
{
  "role": "investisseur",
  "full_name": "Mamadou L. Diagne",
  "phone": "+221 77 123 45 67",
  "city": "Dakar",
  "organization": "Diagne Investment",
  "investor_type": "Local",
  "portfolio_value": 500000000,
  "investment_focus": "Résidentiel, Commercial",
  "risk_profile": "Modéré",
  "min_investment": 50000000
}
```

#### **Compte 2 : Investisseur Diaspora**
```
Email: coumba.diouf@diaspora-invest.com
Mot de passe: password123
```
**Métadonnées utilisateur (User Metadata) :**
```json
{
  "role": "investisseur",
  "full_name": "Coumba N. Diouf",
  "phone": "+33 6 12 34 56 78",
  "city": "Paris (Origine: Dakar)",
  "organization": "Diaspora Real Estate",
  "investor_type": "Diaspora",
  "portfolio_value": 800000000,
  "investment_focus": "Développement, Tourisme",
  "risk_profile": "Agressif",
  "min_investment": 100000000
}
```

### 📐 GÉOMÈTRES (2 comptes)

#### **Compte 1 : Géomètre Dakar**
```
Email: alioune.cisse@geometre.sn
Mot de passe: password123
```
**Métadonnées utilisateur (User Metadata) :**
```json
{
  "role": "geometre",
  "full_name": "Alioune B. Cissé",
  "phone": "+221 77 987 65 43",
  "city": "Dakar",
  "organization": "Cabinet Cissé Topographie",
  "license": "GEO-2017-DKR-012",
  "specializations": "Topographie, Bornage, Expertise",
  "equipment": "Station totale, GPS RTK, Drone",
  "zone_coverage": "Dakar, Rufisque, Guédiawaye"
}
```

#### **Compte 2 : Géomètre Thiès**
```
Email: fatou.mbaye@geodesie.sn
Mot de passe: password123
```
**Métadonnées utilisateur (User Metadata) :**
```json
{
  "role": "geometre",
  "full_name": "Ndèye F. Mbaye",
  "phone": "+221 78 456 12 34",
  "city": "Thiès",
  "organization": "Cabinet Mbaye Géodésie",
  "license": "GEO-2019-THS-008",
  "specializations": "Cadastre, Levés urbains, Délimitation",
  "equipment": "Théodolite, Niveau, GPS différentiel",
  "zone_coverage": "Thiès, Diourbel, Kaolack"
}
```

## 🔧 ÉTAPE 3 : Créer les profils associés

Après avoir créé chaque compte utilisateur, vous devez créer un profil correspondant dans la table `profiles`.

### 📝 Instructions SQL pour les profils

Allez dans **SQL Editor** de Supabase et exécutez ces requêtes **une par une** :

#### 🏛️ Profils Mairies
```sql
-- Profil Mairie de Dakar
INSERT INTO public.profiles (
    id, 
    full_name, 
    phone, 
    city, 
    role,
    created_at, 
    updated_at
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'urbanisme@mairie-dakar.sn'),
    'Seydou Guèye',
    '+221 33 823 55 00',
    'Dakar',
    'mairie',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Profil Commune de Thiès
INSERT INTO public.profiles (
    id, 
    full_name, 
    phone, 
    city, 
    role,
    created_at, 
    updated_at
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'technique@commune-thies.sn'),
    'Awa Gueye',
    '+221 33 951 10 25',
    'Thiès',
    'mairie',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;
```

#### 💰 Profils Investisseurs
```sql
-- Profil Investisseur Local
INSERT INTO public.profiles (
    id, 
    full_name, 
    phone, 
    city, 
    role,
    created_at, 
    updated_at
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'mamadou.diagne@investor.com'),
    'Mamadou L. Diagne',
    '+221 77 123 45 67',
    'Dakar',
    'investisseur',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Profil Investisseur Diaspora
INSERT INTO public.profiles (
    id, 
    full_name, 
    phone, 
    city, 
    role,
    created_at, 
    updated_at
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'coumba.diouf@diaspora-invest.com'),
    'Coumba N. Diouf',
    '+221 77 234 56 78',
    'Paris',
    'investisseur',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;
```

#### 📐 Profils Géomètres
```sql
-- Profil Géomètre Dakar
INSERT INTO public.profiles (
    id, 
    full_name, 
    phone, 
    city, 
    role,
    created_at, 
    updated_at
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'alioune.cisse@geometre.sn'),
    'Alioune B. Cissé',
    '+221 77 987 65 43',
    'Dakar',
    'geometre',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Profil Géomètre Thiès
INSERT INTO public.profiles (
    id, 
    full_name, 
    phone, 
    city, 
    role,
    created_at, 
    updated_at
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'fatou.mbaye@geodesie.sn'),
    'Ndèye F. Mbaye',
    '+221 78 456 12 34',
    'Thiès',
    'geometre',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;
```

## ✅ ÉTAPE 4 : Vérification

### 🔍 Vérifier les comptes créés
```sql
-- Vérifier tous les nouveaux comptes
SELECT 
    email,
    raw_user_meta_data->>'role' as role,
    raw_user_meta_data->>'full_name' as nom,
    created_at
FROM auth.users 
WHERE email IN (
    'urbanisme@mairie-dakar.sn',
    'technique@commune-thies.sn',
    'mamadou.diagne@investor.com',
    'coumba.diouf@diaspora-invest.com',
    'alioune.cisse@geometre.sn',
    'fatou.mbaye@geodesie.sn'
)
ORDER BY raw_user_meta_data->>'role', email;
```

### 🔍 Vérifier les profils associés
```sql
-- Vérifier les profils créés
SELECT 
    u.email,
    p.full_name,
    p.role,
    p.city,
    p.phone
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE u.email IN (
    'urbanisme@mairie-dakar.sn',
    'technique@commune-thies.sn',
    'mamadou.diagne@investor.com',
    'coumba.diouf@diaspora-invest.com',
    'alioune.cisse@geometre.sn',
    'fatou.mbaye@geodesie.sn'
)
ORDER BY p.role, u.email;
```

## 🧪 ÉTAPE 5 : Test de connexion

1. **Allez sur votre plateforme** Teranga Foncier
2. **Testez la connexion** avec chaque email :
   - Email : `urbanisme@mairie-dakar.sn`
   - Mot de passe : `password123`
3. **Vérifiez** que la redirection se fait vers le bon dashboard selon le rôle

## 📊 RÉCAPITULATIF FINAL

Une fois terminé, vous aurez **6 nouveaux comptes** :

| Rôle | Email | Nom | Ville |
|------|--------|-----|--------|
| 🏛️ Mairie | `urbanisme@mairie-dakar.sn` | Seydou Guèye | Dakar |
| 🏛️ Mairie | `technique@commune-thies.sn` | Awa Gueye | Thiès |
| 💰 Investisseur | `mamadou.diagne@investor.com` | Mamadou L. Diagne | Dakar |
| 💰 Investisseur | `coumba.diouf@diaspora-invest.com` | Coumba N. Diouf | Paris |
| 📐 Géomètre | `alioune.cisse@geometre.sn` | Alioune B. Cissé | Dakar |
| 📐 Géomètre | `fatou.mbaye@geodesie.sn` | Ndèye F. Mbaye | Thiès |

**🔑 Mot de passe universel :** `password123`

## ⚠️ NOTES IMPORTANTES

1. **Métadonnées** : Copiez-collez exactement les JSON de métadonnées pour chaque compte
2. **Profils** : N'oubliez pas de créer les profils correspondants avec le SQL
3. **Vérification** : Testez chaque connexion avant de passer au suivant
4. **Sécurité** : Ces comptes sont pour TEST uniquement

**🎉 Vous êtes prêt à tester les nouveaux rôles !**