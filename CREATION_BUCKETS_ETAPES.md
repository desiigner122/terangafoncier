# 🚀 CRÉATION DES BUCKETS - ÉTAPE PAR ÉTAPE

## ✅ Méthode Recommandée : Via Supabase Dashboard

### **Étape 1 : Accéder au Dashboard**

1. Ouvrir [Supabase Dashboard](https://supabase.com/dashboard)
2. Connexion avec vos identifiants
3. Sélectionner le projet : `ndenqikcogzrkrjnlvns`

### **Étape 2 : Créer les buckets**

#### **Bucket 1 : parcel-images** 🖼️

1. Aller dans **Storage** (menu gauche)
2. Cliquer sur **New Bucket**
3. Remplir :
   - **Name** : `parcel-images`
   - **Public bucket** : ✅ Coché (public)
   - **File size limit** : `10485760` (10 MB)
   - **Allowed MIME types** : 
     ```
     image/jpeg
     image/jpg
     image/png
     image/webp
     image/gif
     image/heic
     image/heif
     ```
4. Cliquer **Create bucket**

#### **Bucket 2 : parcel-documents** 📄

1. Cliquer sur **New Bucket**
2. Remplir :
   - **Name** : `parcel-documents`
   - **Public bucket** : ❌ Décoché (privé)
   - **File size limit** : `20971520` (20 MB)
   - **Allowed MIME types** : 
     ```
     application/pdf
     application/msword
     application/vnd.openxmlformats-officedocument.wordprocessingml.document
     application/vnd.ms-excel
     application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
     image/jpeg
     image/jpg
     image/png
     ```
3. Cliquer **Create bucket**

#### **Bucket 3 : profile-avatars** 👤

1. Cliquer sur **New Bucket**
2. Remplir :
   - **Name** : `profile-avatars`
   - **Public bucket** : ✅ Coché (public)
   - **File size limit** : `5242880` (5 MB)
   - **Allowed MIME types** : 
     ```
     image/jpeg
     image/jpg
     image/png
     image/webp
     ```
3. Cliquer **Create bucket**

#### **Bucket 4 : transaction-receipts** 🧾

1. Cliquer sur **New Bucket**
2. Remplir :
   - **Name** : `transaction-receipts`
   - **Public bucket** : ❌ Décoché (privé)
   - **File size limit** : `10485760` (10 MB)
   - **Allowed MIME types** : 
     ```
     application/pdf
     image/jpeg
     image/jpg
     image/png
     ```
3. Cliquer **Create bucket**

#### **Bucket 5 : verification-documents** ✅

1. Cliquer sur **New Bucket**
2. Remplir :
   - **Name** : `verification-documents`
   - **Public bucket** : ❌ Décoché (privé)
   - **File size limit** : `15728640` (15 MB)
   - **Allowed MIME types** : 
     ```
     application/pdf
     image/jpeg
     image/jpg
     image/png
     ```
3. Cliquer **Create bucket**

---

### **Étape 3 : Configurer les RLS Policies**

1. Aller dans **SQL Editor** (menu gauche)
2. Cliquer **New query**
3. Copier-coller le contenu complet de :
   ```
   supabase-migrations/CREATE_STORAGE_BUCKETS.sql
   ```
4. Cliquer **Run** (ou F5)
5. Vérifier qu'il n'y a pas d'erreurs

---

### **Étape 4 : Vérifier la création**

#### **Via Dashboard** :
1. Retourner dans **Storage**
2. Vérifier que les 5 buckets apparaissent :
   - ✅ parcel-images (public)
   - ✅ parcel-documents (privé)
   - ✅ profile-avatars (public)
   - ✅ transaction-receipts (privé)
   - ✅ verification-documents (privé)

#### **Via SQL** :
1. Dans **SQL Editor**, exécuter :
```sql
SELECT 
  id,
  name,
  public,
  file_size_limit / 1048576 AS max_size_mb,
  array_length(allowed_mime_types, 1) AS mime_types_count,
  created_at
FROM storage.buckets
ORDER BY created_at DESC;
```

2. Résultat attendu :
```
id                        | name                    | public | max_size_mb | mime_types_count | created_at
--------------------------|-------------------------|--------|-------------|------------------|------------
verification-documents    | verification-documents  | false  | 15          | 4               | 2025-10-06
transaction-receipts      | transaction-receipts    | false  | 10          | 4               | 2025-10-06
profile-avatars           | profile-avatars         | true   | 5           | 4               | 2025-10-06
parcel-documents          | parcel-documents        | false  | 20          | 9               | 2025-10-06
parcel-images             | parcel-images           | true   | 10          | 7               | 2025-10-06
```

---

### **Étape 5 : Vérifier les Policies**

Dans **SQL Editor**, exécuter :

```sql
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;
```

Résultat attendu : **20 policies** créées (4 par bucket)

---

## 🧪 TESTER LES BUCKETS

### **Test 1 : Upload depuis le Dashboard**

1. Dans **Storage**, cliquer sur `parcel-images`
2. Cliquer **Upload file**
3. Sélectionner une image test
4. Vérifier qu'elle apparaît dans le bucket

### **Test 2 : Tester depuis l'application**

1. Démarrer l'application :
   ```powershell
   npm run dev
   ```

2. Se connecter en tant que **Vendeur**

3. Aller dans **"Ajouter Bien"**

4. Remplir le formulaire et ajouter des photos

5. Soumettre le formulaire

6. Vérifier dans Supabase Dashboard :
   - Les images apparaissent dans `parcel-images`
   - Les documents apparaissent dans `parcel-documents`

---

## ⚠️ DÉPANNAGE

### **Problème : "Bucket already exists"**

✅ **Normal** - Le bucket existe déjà, pas d'action nécessaire.

### **Problème : "new row violates row-level security policy"**

❌ **Solution** :
1. Vérifier que les policies sont créées (Étape 3)
2. Vérifier que le chemin du fichier commence par `{user_id}/`
3. Vérifier que l'utilisateur est bien authentifié

### **Problème : "File size exceeds limit"**

❌ **Solution** :
- Compresser l'image avant l'upload
- Vérifier que la limite est bien configurée (Étape 2)

### **Problème : "Invalid MIME type"**

❌ **Solution** :
- Vérifier que le type de fichier est dans la liste autorisée
- Convertir le fichier si nécessaire

---

## 📋 CHECKLIST

Cochez au fur et à mesure :

**Création des buckets** :
- [ ] parcel-images créé (public, 10 MB)
- [ ] parcel-documents créé (privé, 20 MB)
- [ ] profile-avatars créé (public, 5 MB)
- [ ] transaction-receipts créé (privé, 10 MB)
- [ ] verification-documents créé (privé, 15 MB)

**Configuration** :
- [ ] Script SQL exécuté (RLS policies)
- [ ] Vérification buckets (5 buckets visibles)
- [ ] Vérification policies (20 policies créées)

**Tests** :
- [ ] Upload test depuis Dashboard (OK)
- [ ] Upload test depuis application (OK)
- [ ] Vérification permissions (OK)

---

## 🎉 RÉSULTAT FINAL

Une fois toutes les étapes complétées :

✅ **5 buckets créés et configurés**  
✅ **20 RLS policies actives**  
✅ **Sécurité optimale**  
✅ **Prêt pour la production**

---

**Temps estimé : 10-15 minutes** ⏱️

*Dernière mise à jour : 6 Octobre 2025*
