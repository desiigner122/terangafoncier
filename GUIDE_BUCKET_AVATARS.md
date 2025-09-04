# 🔧 GUIDE MANUEL - CRÉATION BUCKET AVATARS SUPABASE

## 📋 INSTRUCTIONS ÉTAPE PAR ÉTAPE

### 1. **Accéder à Supabase Dashboard**
1. Ouvrez votre navigateur
2. Allez sur: https://supabase.com/dashboard/sign-in
3. Connectez-vous à votre compte
4. Sélectionnez le projet "Teranga Foncier"

### 2. **Accéder au SQL Editor**
1. Dans le menu latéral gauche, cliquez sur **"SQL Editor"**
2. Cliquez sur **"New query"** ou **"+ Nouvelle requête"**

### 3. **Exécuter le Script SQL**
Copiez-collez exactement ce code dans l'éditeur SQL :

```sql
-- CREATION BUCKET AVATARS TERANGA FONCIER
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars', 
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- POLITIQUES DE SÉCURITÉ
CREATE POLICY "Public Avatar Access" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'avatars');

CREATE POLICY "User Avatar Upload" ON storage.objects  
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- VERIFICATION
SELECT 'Bucket avatars créé avec succès ✅' as status;
SELECT name, public, file_size_limit FROM storage.buckets WHERE name = 'avatars';
```

### 4. **Exécuter la Requête**
1. Cliquez sur le bouton **"Run"** ou **"Exécuter"** (généralement en haut à droite)
2. Vérifiez que vous voyez le message de succès dans les résultats

### 5. **Vérification du Succès**
Vous devriez voir dans les résultats :
```
✅ status: "Bucket avatars créé avec succès ✅"
✅ name: "avatars", public: true, file_size_limit: 5242880
```

## 🎯 RÉSULTAT ATTENDU

Après exécution :
- ✅ **Bucket "avatars"** créé et configuré
- ✅ **Upload public** autorisé (5MB max)
- ✅ **Formats supportés** : JPG, PNG, WEBP, GIF
- ✅ **Photos de profil** fonctionnelles dans l'app

## 🚀 TEST DANS L'APPLICATION

1. Retournez sur http://localhost:5174/
2. Allez dans **Profil** ou **Paramètres**
3. Essayez d'uploader une photo de profil
4. L'erreur "Bucket avatars non disponible" devrait disparaître

## ❓ EN CAS DE PROBLÈME

Si vous rencontrez des erreurs :

1. **Bucket existe déjà** : Normal, le script gère ce cas
2. **Erreur de permissions** : Vérifiez que vous êtes admin du projet
3. **Politique existe** : Normal, le script évite les doublons

## 📞 SUPPORT

Si problème persistant :
- Vérifiez les logs dans l'onglet "Logs" de Supabase
- Consultez la section "Storage" pour voir le bucket créé
- Testez l'upload directement depuis l'interface Supabase

---

**⚡ Action requise : Exécutez ce script SQL maintenant pour débloquer les photos de profil !**
