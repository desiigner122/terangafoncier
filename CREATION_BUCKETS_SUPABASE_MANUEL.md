# 📦 CRÉATION MANUELLE DES BUCKETS SUPABASE

## ❌ PROBLÈME

Les buckets `property-photos` et `property-documents` n'existent pas dans Supabase Storage.

**Erreur actuelle :**
```
StorageApiError: Bucket not found
```

---

## ✅ SOLUTION : Créer les Buckets via Dashboard

### 🔗 ÉTAPE 1 : Accéder au Dashboard

1. Ouvrir : https://supabase.com/dashboard
2. Se connecter
3. Sélectionner le projet **TerangaFoncier**
4. Aller dans **Storage** (menu gauche)

---

### 📸 ÉTAPE 2 : Créer le Bucket `property-photos`

**Cliquer sur "+ New Bucket"**

**Configuration :**
- **Name:** `property-photos`
- **Public bucket:** ✅ **OUI** (cocher la case)
- **File size limit:** `5 MB`
- **Allowed MIME types:** 
  ```
  image/jpeg
  image/png
  image/webp
  image/jpg
  ```

**Cliquer sur "Create bucket"**

---

### 📄 ÉTAPE 3 : Créer le Bucket `property-documents`

**Cliquer sur "+ New Bucket"**

**Configuration :**
- **Name:** `property-documents`
- **Public bucket:** ❌ **NON** (ne PAS cocher)
- **File size limit:** `10 MB`
- **Allowed MIME types:**
  ```
  application/pdf
  image/jpeg
  image/png
  image/jpg
  ```

**Cliquer sur "Create bucket"**

---

### 🔐 ÉTAPE 4 : Configurer les Politiques RLS

#### Pour `property-photos` :

1. Cliquer sur le bucket `property-photos`
2. Aller dans **Policies**
3. Créer 4 politiques :

**a) SELECT (Lecture publique) :**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-photos');
```

**b) INSERT (Upload vendeurs) :**
```sql
CREATE POLICY "Vendors can upload property photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**c) UPDATE (Modification vendeurs) :**
```sql
CREATE POLICY "Vendors can update their property photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'property-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**d) DELETE (Suppression vendeurs) :**
```sql
CREATE POLICY "Vendors can delete their property photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'property-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Pour `property-documents` :

1. Cliquer sur le bucket `property-documents`
2. Aller dans **Policies**
3. Créer 4 politiques :

**a) SELECT (Propriétaires seulement) :**
```sql
CREATE POLICY "Owners can view their documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'property-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**b) INSERT (Upload vendeurs) :**
```sql
CREATE POLICY "Vendors can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**c) UPDATE (Modification vendeurs) :**
```sql
CREATE POLICY "Vendors can update their documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'property-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**d) DELETE (Suppression vendeurs) :**
```sql
CREATE POLICY "Vendors can delete their documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'property-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## ✅ VÉRIFICATION

Après avoir créé les buckets :

1. Retourner dans **Storage**
2. Vérifier que vous voyez :
   - 📸 `property-photos` (🌍 Public)
   - 📄 `property-documents` (🔒 Private)
3. Cliquer sur chaque bucket
4. Vérifier que les **4 politiques RLS** apparaissent dans l'onglet **Policies**

---

## 🧪 TEST

Pour tester, essayer d'uploader une photo dans le formulaire :

1. Aller sur `/vendeur/add-property`
2. Remplir les étapes 1-6
3. **Étape 7 : Photos** → Uploader 3 photos
4. **Étape 8 : Documents** → Uploader le titre foncier (PDF)
5. Soumettre

**Si succès :** Les fichiers apparaissent dans Storage > Buckets

**Si échec :** Vérifier les politiques RLS

---

## 📊 STRUCTURE DES FICHIERS

### Photos :
```
property-photos/
  ├── {user_id}/
      ├── {property_id}/
          ├── image1.jpg
          ├── image2.png
          └── image3.webp
```

### Documents :
```
property-documents/
  ├── {user_id}/
      ├── {property_id}/
          ├── titre-foncier.pdf
          ├── plan-bornage.pdf
          └── permis-construire.pdf
```

---

**Date :** 5 Octobre 2025  
**Status :** 📋 Attente création manuelle buckets  
**Next :** Créer les buckets puis tester l'upload
