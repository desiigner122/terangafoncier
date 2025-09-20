# 🔄 GUIDE DE RÉINITIALISATION COMPLÈTE SUPABASE

## Vue d'ensemble
Ce guide vous permet de supprimer tous les comptes utilisateur existants et de créer un ensemble standardisé de comptes types pour Teranga Foncier.

## ⚠️ ATTENTION - Lecture obligatoire
- **Cette opération est IRRÉVERSIBLE**
- **Tous les utilisateurs actuels seront supprimés**
- **Créez une sauvegarde complète avant exécution**
- **Exécutez uniquement en environnement de développement/test d'abord**

## 📋 Prérequis
- Accès Supabase avec privilèges `service_role`
- SQL Editor dans le dashboard Supabase
- Environnement de test pour validation

## 🚀 Procédure d'exécution

### Étape 1: Sauvegarde (Recommandée)
```sql
-- Sauvegarder manuellement les données critiques si nécessaire
-- ou utiliser la sauvegarde automatique incluse dans reset-supabase-users.sql
```

### Étape 2: Suppression complète
1. Ouvrir le SQL Editor dans Supabase Dashboard
2. Coller le contenu de `reset-supabase-users.sql`
3. **Vérifier que vous êtes en mode service_role**
4. Exécuter le script
5. Vérifier les messages de confirmation

### Étape 3: Création des comptes types
1. Dans le même SQL Editor
2. Coller le contenu de `create-standard-accounts.sql`
3. Exécuter le script
4. Vérifier la création des 11 comptes

## 👥 Comptes créés

| Rôle | Email | Mot de passe | Description |
|------|-------|-------------|-------------|
| Admin | admin@terangafoncier.sn | TempPass2024! | Administrateur système |
| Particulier | particulier@terangafoncier.sn | TempPass2024! | Client acheteur |
| Vendeur Particulier | vendeur.particulier@terangafoncier.sn | TempPass2024! | Vendeur individuel |
| Vendeur Pro | vendeur.pro@terangafoncier.sn | TempPass2024! | Vendeur professionnel |
| Notaire | notaire@terangafoncier.sn | TempPass2024! | Notaire |
| Agent Foncier | agent.foncier@terangafoncier.sn | TempPass2024! | Agent foncier |
| Géomètre | geometre@terangafoncier.sn | TempPass2024! | Géomètre expert |
| Promoteur | promoteur@terangafoncier.sn | TempPass2024! | Promoteur immobilier |
| Mairie | mairie@terangafoncier.sn | TempPass2024! | Administration municipale |
| Investisseur | investisseur@terangafoncier.sn | TempPass2024! | Investisseur |
| Banque | banque@terangafoncier.sn | TempPass2024! | Institution bancaire |

## ✅ Vérifications post-création

### 1. Vérifier la création des comptes
```sql
SELECT email, role, user_type, verification_status 
FROM public.profiles 
ORDER BY role;
```

### 2. Tester la connexion
- Essayer de se connecter avec chaque compte
- Vérifier l'accès aux dashboards correspondants
- Confirmer les permissions par rôle

### 3. Vérifier la cohérence des rôles
```sql
SELECT 
    p.email,
    p.role as profile_role,
    (u.raw_user_meta_data->>'role') as auth_role,
    CASE 
        WHEN lower(p.role) = lower(u.raw_user_meta_data->>'role') 
        THEN '✅ Cohérent' 
        ELSE '❌ Incohérent' 
    END as status
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
ORDER BY p.email;
```

## 🔧 Actions post-installation

### 1. Changer les mots de passe
- Se connecter avec chaque compte
- Modifier le mot de passe temporaire
- Utiliser des mots de passe sécurisés

### 2. Personnaliser les profils
- Mettre à jour les informations personnelles
- Ajouter des photos de profil si nécessaire
- Configurer les préférences

### 3. Tester les fonctionnalités
- Dashboard de chaque rôle
- Navigation entre les pages
- Permissions et restrictions

## 🐛 Dépannage

### Erreur de permissions
```sql
-- Vérifier les politiques RLS
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

### Incohérence de rôles
```sql
-- Normaliser les rôles si nécessaire
UPDATE public.profiles 
SET role = CASE 
    WHEN lower(role) = 'admin' THEN 'Admin'
    WHEN lower(role) = 'particulier' THEN 'Particulier'
    -- etc.
END 
WHERE role IS NOT NULL;
```

### Problèmes d'authentification
- Vérifier que `email_confirmed_at` est défini
- Contrôler que `is_active = true` dans profiles
- Valider que les identités sont créées

## 📞 Support
En cas de problème:
1. Vérifier les logs dans Supabase Dashboard
2. Examiner les messages d'erreur SQL
3. Consulter la documentation Supabase Auth
4. Tester en mode debug avec console.log côté application

## 🔄 Rollback (Récupération)
Si vous avez des sauvegardes:
```sql
-- Restaurer les profils (adapter le suffix de timestamp)
INSERT INTO public.profiles 
SELECT * FROM profiles_backup_YYYY_MM_DD_HH24_MI_SS;
```