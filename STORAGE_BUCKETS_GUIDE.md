# 📦 GUIDE D'UTILISATION - SUPABASE STORAGE BUCKETS

*Date: 6 Octobre 2025*  
*Status: ✅ Configuration complète*

---

## 🎯 VUE D'ENSEMBLE

Ce guide explique comment utiliser les buckets Supabase Storage créés pour le dashboard vendeur de Teranga Foncier.

### **5 Buckets créés** :
1. 🖼️ **parcel-images** - Images des terrains (public)
2. 📄 **parcel-documents** - Documents légaux (privé)
3. 👤 **profile-avatars** - Photos de profil (public)
4. 🧾 **transaction-receipts** - Reçus de paiement (privé)
5. ✅ **verification-documents** - Documents KYC (privé)

---

## 🚀 INSTALLATION

### **Méthode 1 : Via Script PowerShell** (Recommandé)

```powershell
# 1. Configurer les variables d'environnement
$env:VITE_SUPABASE_URL = "https://votre-projet.supabase.co"
$env:VITE_SUPABASE_SERVICE_ROLE_KEY = "votre-service-role-key"

# 2. Exécuter le script
.\scripts\create-storage-buckets.ps1
```

### **Méthode 2 : Via Supabase Dashboard**

1. Aller sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionner votre projet
3. Aller dans **Storage**
4. Cliquer sur **New Bucket** pour chaque bucket
5. Configurer selon les spécifications ci-dessous

### **Méthode 3 : Via SQL** (Avancé)

```sql
-- Exécuter dans SQL Editor de Supabase
\i supabase-migrations/CREATE_STORAGE_BUCKETS.sql
```

---

## 📦 CONFIGURATION DES BUCKETS

### **1. parcel-images** 🖼️

**Usage** : Photos des terrains (façade, intérieur, environnement)

| Paramètre | Valeur |
|-----------|--------|
| **ID** | `parcel-images` |
| **Visibilité** | 🌍 Public |
| **Taille max** | 10 MB |
| **Formats acceptés** | JPEG, PNG, WebP, GIF, HEIC |

**Structure des chemins** :
```
parcel-images/{user_id}/{timestamp}_{filename}
```

**Exemple** :
```
parcel-images/123e4567-e89b-12d3-a456-426614174000/1696598400000_terrain_facade.jpg
```

**RLS Policies** :
- ✅ Tout le monde peut voir (public)
- ✅ Seul le propriétaire peut uploader
- ✅ Seul le propriétaire peut modifier/supprimer

---

### **2. parcel-documents** 📄

**Usage** : Documents légaux (titres fonciers, actes, certificats)

| Paramètre | Valeur |
|-----------|--------|
| **ID** | `parcel-documents` |
| **Visibilité** | 🔒 Privé |
| **Taille max** | 20 MB |
| **Formats acceptés** | PDF, Word, Excel, JPEG, PNG |

**Structure des chemins** :
```
parcel-documents/{user_id}/{timestamp}_{filename}
```

**Exemple** :
```
parcel-documents/123e4567-e89b-12d3-a456-426614174000/1696598400000_titre_foncier.pdf
```

**RLS Policies** :
- 🔒 Seul le propriétaire ou l'acheteur peut voir
- ✅ Seul le propriétaire peut uploader
- ✅ Seul le propriétaire peut modifier/supprimer

---

### **3. profile-avatars** 👤

**Usage** : Photos de profil des utilisateurs

| Paramètre | Valeur |
|-----------|--------|
| **ID** | `profile-avatars` |
| **Visibilité** | 🌍 Public |
| **Taille max** | 5 MB |
| **Formats acceptés** | JPEG, PNG, WebP |

**Structure des chemins** :
```
profile-avatars/{user_id}/avatar.jpg
```

**Exemple** :
```
profile-avatars/123e4567-e89b-12d3-a456-426614174000/avatar.jpg
```

**RLS Policies** :
- ✅ Tout le monde peut voir (public)
- ✅ Seul le propriétaire peut uploader
- ✅ Seul le propriétaire peut modifier/supprimer

---

### **4. transaction-receipts** 🧾

**Usage** : Reçus et justificatifs de paiement

| Paramètre | Valeur |
|-----------|--------|
| **ID** | `transaction-receipts` |
| **Visibilité** | 🔒 Privé |
| **Taille max** | 10 MB |
| **Formats acceptés** | PDF, JPEG, PNG |

**Structure des chemins** :
```
transaction-receipts/{transaction_id}/{timestamp}_receipt.pdf
```

**Exemple** :
```
transaction-receipts/trans_123/1696598400000_receipt.pdf
```

**RLS Policies** :
- 🔒 Seul l'acheteur ou le vendeur peut voir
- ✅ Seul l'acheteur peut uploader son reçu

---

### **5. verification-documents** ✅

**Usage** : Documents KYC et vérification anti-fraude

| Paramètre | Valeur |
|-----------|--------|
| **ID** | `verification-documents` |
| **Visibilité** | 🔒 Privé |
| **Taille max** | 15 MB |
| **Formats acceptés** | PDF, JPEG, PNG |

**Structure des chemins** :
```
verification-documents/{user_id}/{doc_type}_{timestamp}.pdf
```

**Exemple** :
```
verification-documents/123e4567/cni_front_1696598400000.pdf
verification-documents/123e4567/cni_back_1696598400000.pdf
```

**RLS Policies** :
- 🔒 Seul le propriétaire ou les admins peuvent voir
- ✅ Seul le propriétaire peut uploader

---

## 💻 UTILISATION DANS LE CODE

### **Upload d'une image de terrain**

```javascript
import { supabase } from '@/lib/supabase';

const uploadParcelImage = async (file, userId) => {
  try {
    // 1. Générer nom de fichier unique
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `${userId}/${timestamp}_${cleanFileName}`;
    
    // 2. Upload vers Supabase Storage
    const { data, error } = await supabase.storage
      .from('parcel-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // 3. Obtenir l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('parcel-images')
      .getPublicUrl(fileName);
    
    return publicUrl;
  } catch (error) {
    console.error('Erreur upload image:', error);
    throw error;
  }
};
```

### **Upload d'un document privé**

```javascript
const uploadParcelDocument = async (file, userId) => {
  try {
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `${userId}/${timestamp}_${cleanFileName}`;
    
    // Upload vers bucket privé
    const { data, error } = await supabase.storage
      .from('parcel-documents')
      .upload(fileName, file);
    
    if (error) throw error;
    
    // Pour les fichiers privés, utiliser getSignedUrl
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from('parcel-documents')
      .createSignedUrl(fileName, 3600); // 1 heure
    
    if (urlError) throw urlError;
    
    return {
      path: fileName,
      signedUrl: signedUrlData.signedUrl
    };
  } catch (error) {
    console.error('Erreur upload document:', error);
    throw error;
  }
};
```

### **Récupérer l'URL d'un fichier privé**

```javascript
const getPrivateFileUrl = async (filePath, bucketName) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, 3600); // Expire dans 1 heure
    
    if (error) throw error;
    
    return data.signedUrl;
  } catch (error) {
    console.error('Erreur récupération URL:', error);
    throw error;
  }
};
```

### **Supprimer un fichier**

```javascript
const deleteFile = async (filePath, bucketName) => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    
    if (error) throw error;
    
    console.log('Fichier supprimé avec succès');
  } catch (error) {
    console.error('Erreur suppression fichier:', error);
    throw error;
  }
};
```

---

## 🔒 SÉCURITÉ - RLS POLICIES

### **Vérifier les policies actives**

```sql
SELECT 
  policyname,
  cmd,
  roles,
  qual
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;
```

### **Tester les permissions**

```javascript
// Test upload (doit réussir pour le propriétaire)
const testUpload = async () => {
  const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
  const { data, error } = await supabase.storage
    .from('parcel-images')
    .upload(`${userId}/test.txt`, testFile);
  
  console.log('Test upload:', error ? '❌ Échec' : '✅ Succès');
};

// Test accès (doit échouer pour non-propriétaire)
const testAccess = async (otherUserId) => {
  const { data, error } = await supabase.storage
    .from('parcel-documents')
    .download(`${otherUserId}/document.pdf`);
  
  console.log('Test accès:', error ? '✅ Bloqué (normal)' : '❌ Autorisé (problème)');
};
```

---

## 🧪 TESTS

### **Test 1 : Upload image terrain**

```javascript
// Dans AddParcelPage.jsx
const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files);
  
  for (const file of files) {
    const url = await uploadParcelImage(file, user.id);
    console.log('Image uploadée:', url);
  }
};
```

### **Test 2 : Upload document privé**

```javascript
// Dans AddParcelPage.jsx
const handleDocumentUpload = async (e) => {
  const files = Array.from(e.target.files);
  
  for (const file of files) {
    const { path, signedUrl } = await uploadParcelDocument(file, user.id);
    console.log('Document uploadé:', path);
  }
};
```

### **Test 3 : Vérifier les buckets**

```powershell
# Via PowerShell
$response = Invoke-RestMethod `
  -Uri "https://votre-projet.supabase.co/storage/v1/bucket" `
  -Headers @{
    "apikey" = "votre-anon-key"
    "Authorization" = "Bearer votre-anon-key"
  }

$response | Format-Table id, name, public, file_size_limit
```

---

## 📊 MONITORING

### **Vérifier l'usage du storage**

```sql
-- Dans Supabase SQL Editor
SELECT 
  bucket_id,
  COUNT(*) as file_count,
  SUM(metadata->>'size')::bigint / 1048576 as total_mb
FROM storage.objects
GROUP BY bucket_id
ORDER BY total_mb DESC;
```

### **Lister les fichiers d'un utilisateur**

```sql
SELECT 
  name,
  bucket_id,
  metadata->>'size' as size_bytes,
  created_at
FROM storage.objects
WHERE name LIKE 'user-id-here/%'
ORDER BY created_at DESC;
```

---

## ⚠️ DÉPANNAGE

### **Erreur : "Bucket already exists"**

✅ Normal, le bucket existe déjà. Ignorez l'erreur.

### **Erreur : "new row violates row-level security policy"**

❌ Problème de RLS. Vérifiez que :
1. L'utilisateur est authentifié
2. Le chemin du fichier commence par `{user_id}/`
3. Les policies sont correctement créées

**Solution** :
```sql
-- Vérifier les policies
SELECT * FROM pg_policies WHERE tablename = 'objects';

-- Recréer les policies si nécessaire
\i supabase-migrations/CREATE_STORAGE_BUCKETS.sql
```

### **Erreur : "File size exceeds limit"**

❌ Le fichier dépasse la taille maximale.

**Limites** :
- Images terrains : 10 MB
- Documents : 20 MB
- Avatars : 5 MB

**Solution** : Compresser le fichier ou diviser en plusieurs parties.

### **Erreur : "Invalid MIME type"**

❌ Le type de fichier n'est pas autorisé.

**Solution** : Vérifier les `allowed_mime_types` du bucket et convertir le fichier si nécessaire.

---

## 🎯 PROCHAINES ÉTAPES

1. ✅ Créer les buckets (fait)
2. ✅ Configurer les RLS policies (fait)
3. ⏳ Tester l'upload depuis le dashboard vendeur
4. ⏳ Vérifier les permissions en production
5. ⏳ Monitorer l'usage du storage
6. ⏳ Configurer la compression d'images (optionnel)
7. ⏳ Mettre en place le nettoyage automatique (optionnel)

---

## 📚 RESSOURCES

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase Storage API Reference](https://supabase.com/docs/reference/javascript/storage)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**✅ Configuration complète et prête à l'emploi !**

*Dernière mise à jour : 6 Octobre 2025*
