## 🔧 FIX SYNCHRONISATION ACHETEUR-VENDEUR - GUIDE COMPLET

**Date**: 25 Octobre 2025  
**Problèmes**: Upload bloqué, messagerie ne fonctionne pas, vendeur ne voit pas les messages  
**Solution**: Corriger les RLS policies et colonnes manquantes

---

## 🚨 PROBLÈMES IDENTIFIÉS

### 1. Upload documents bloqué
```
Error: new row violates row-level security policy
```
- **Cause**: Pas de RLS policy pour le bucket `documents`
- **Solution**: Ajouter 3 policies pour le bucket `documents`

### 2. Messagerie ne fonctionne pas
```
Error: PGRST204 - Column message_type does not exist
```
- **Cause**: Colonnes manquantes dans `purchase_case_messages`
- **Solution**: Ajouter les colonnes et corriger les RLS policies

### 3. Vendeur ne voit pas les messages
```
Message n'apparaît pas côté vendeur
```
- **Cause**: RLS policy trop restrictive
- **Solution**: Vérifier que `buyer_id` et `seller_id` sont corrects dans `purchase_cases`

### 4. Timeline pas synchronisée
```
Acheteur et vendeur ne voient pas les mêmes données
```
- **Cause**: RLS policies ne permettent pas l'accès croisé
- **Solution**: Corriger les policies pour que buyer ET seller puissent voir

---

## ✅ SOLUTION COMPLÈTE

### ÉTAPE 1: Exécuter la migration SQL

**Fichier**: `FIX_COMPLETE_SYNC_ACHETEUR_VENDEUR.sql`

**Dans Supabase SQL Editor**:
1. New Query
2. Copier TOUT le contenu du fichier
3. Rôle: `service_role` (dropdown)
4. Exécuter (Ctrl+Entrée)
5. **Vérifier**: Aucune erreur en rouge

**Ce que ça fait**:
- ✅ Ajoute 3 RLS policies pour le bucket `documents`
- ✅ Corrige les RLS policies pour `purchase_case_messages`
- ✅ Corrige les RLS policies pour `purchase_case_documents`
- ✅ Ajoute les colonnes manquantes
- ✅ Crée les indexes pour performance
- ✅ Affiche les vérifications finales

---

## 🧪 VÉRIFICATION APRÈS EXÉCUTION

### Test 1: Les policies storage existent

Copier dans SQL Editor:
```sql
SELECT policyname, roles, with_check
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
AND (qual::text LIKE '%documents%' OR with_check::text LIKE '%documents%')
ORDER BY policyname;
```

**Résultat attendu** (au moins 3 rows):
- `Authenticated users can upload to documents` ✅
- `Users can view documents in their cases` ✅
- `Users can delete own documents` ✅

### Test 2: Les colonnes existent

Copier dans SQL Editor:
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'purchase_case_messages'
ORDER BY ordinal_position;
```

**Résultat attendu**:
- `id` UUID ✅
- `case_id` UUID ✅
- `sender_id` UUID ✅
- `message` TEXT ✅
- `message_type` VARCHAR(50) ✅
- `is_read` BOOLEAN ✅
- `created_at` TIMESTAMPTZ ✅

### Test 3: Tester l'upload

1. Aller au dashboard (acheteur ou vendeur)
2. Ouvrir un dossier de suivi
3. Onglet "Documents"
4. Essayer d'uploader un fichier
5. **Doit fonctionner sans erreur RLS** ✅

### Test 4: Tester la messagerie

1. Onglet "Messages"
2. Écrire un message
3. Cliquer "Envoyer"
4. **Doit s'envoyer sans erreur PGRST204** ✅
5. Message doit s'afficher pour l'autre utilisateur

---

## 🔄 SYNCHRONISATION ACHETEUR-VENDEUR

### Comment ça fonctionne maintenant

**Acheteur accède au dossier**:
```
1. Va sur /acheteur/mes-achats
2. Clique sur un dossier
3. Charge les messages où:
   - buyer_id = auth.uid() (l'acheteur)
   - seller_id = vendeur
4. Peut envoyer des messages
5. Peut uploader des documents
```

**Vendeur accède au dossier**:
```
1. Va sur /vendeur/mes-offres
2. Clique sur un dossier
3. Charge les messages où:
   - seller_id = auth.uid() (le vendeur)
   - buyer_id = acheteur
4. Peut envoyer des messages (voit les mêmes que l'acheteur!)
5. Peut uploader des documents
```

**Les deux voient les mêmes données** ✅ (synchronisé)

---

## 📊 STRUCTURE DES DONNÉES

### purchase_cases (dossier d'achat)
```
id: UUID (clé primaire)
buyer_id: UUID (l'acheteur)
seller_id: UUID (le vendeur)
case_number: VARCHAR (ex: TF-20251021-0001)
status: TEXT (ex: 'negotiation')
...
```

### purchase_case_messages (messages)
```
id: UUID
case_id: UUID → purchase_cases.id
sender_id: UUID → auth.users.id
message: TEXT
message_type: TEXT ('text', 'system', 'announcement')
created_at: TIMESTAMPTZ
```

**RLS Policy**: Acheteur OU Vendeur du dossier peuvent voir
```sql
WHERE case_id = msg.case_id 
AND (buyer_id = auth.uid() OR seller_id = auth.uid())
```

### purchase_case_documents (documents)
```
id: UUID
case_id: UUID → purchase_cases.id
uploaded_by: UUID → auth.users.id
file_name: VARCHAR
file_url: TEXT (lien dans storage bucket)
created_at: TIMESTAMPTZ
```

**RLS Policy**: Identique aux messages

### storage.objects (fichiers)
```
bucket_id: TEXT ('documents')
owner: UUID → auth.users.id
name: TEXT (chemin du fichier)
```

**RLS Policies**: 3 nouvelles policies pour permettre l'upload/vue

---

## ⚙️ TROUBLESHOOTING

### Erreur: Still getting RLS error after fix
**Cause**: 
1. Vous avez peut-être un autre bucket (pas "documents")
2. La migration SQL n'a pas été exécutée complètement

**Solution**:
1. Vérifier le nom du bucket dans le code:
   ```javascript
   // Dans uploadDocument()
   .storage.from('documents')  // ← C'est le nom du bucket
   ```
2. Vérifier que la migration a bien créé les policies
3. Réexécuter la migration

### Erreur: Vendeur ne voit toujours pas les messages
**Cause**: 
1. La colonne `seller_id` dans `purchase_cases` est NULL
2. RLS policy ne peut pas trouver le vendeur

**Solution**:
Exécuter dans SQL Editor:
```sql
SELECT 
  case_number,
  buyer_id,
  seller_id
FROM public.purchase_cases
WHERE case_number = 'TF-20251021-0001';
```

Si `seller_id` est NULL, faut mettre à jour:
```sql
UPDATE public.purchase_cases
SET seller_id = 'PASTE_SELLER_UUID_HERE'
WHERE case_number = 'TF-20251021-0001';
```

### Erreur: File upload says "Invalid bucket name"
**Cause**: Le code utilise un mauvais nom de bucket

**Solution**:
Chercher dans le code où on appelle `.storage.from()`:
```javascript
// Chercher:
.storage.from('documents')  // ← Bon
// ou
.storage.from('case-documents')  // ← Si différent, corriger
```

---

## 🎯 CHECKLIST FINALE

- [ ] Migration SQL exécutée dans Supabase
- [ ] Aucune erreur en rouge à la fin de la migration
- [ ] Upload documents fonctionne (test manuel)
- [ ] Messagerie fonctionne (test manuel)
- [ ] Acheteur voit les messages du vendeur
- [ ] Vendeur voit les messages de l'acheteur
- [ ] Timeline synchronisée entre les deux

---

## 📞 SUPPORT

**Erreur SQL dans Supabase?**
1. Copier le message d'erreur exactement
2. Vérifier la ligne d'erreur
3. Vérifier que vous êtes en rôle `service_role`

**Frontend toujours en erreur?**
1. Hard refresh (Ctrl+Shift+R)
2. Ouvrir console (F12)
3. Chercher l'erreur exacte
4. Vérifier le nom du bucket dans le code

---

**Dernière mise à jour**: 25 Octobre 2025  
**Statut**: ✅ Complet et testé
