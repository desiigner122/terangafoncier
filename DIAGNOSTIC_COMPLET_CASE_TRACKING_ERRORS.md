# 🚨 RAPPORT COMPLET DES ERREURS - CASE TRACKING PAGE

**Date**: 25 Octobre 2025  
**Page affectée**: `/acheteur/dossier/TF-20251021-0002`  
**Statut**: 🔴 CRITIQUE - Plusieurs fonctionnalités bloquées

---

## 📋 Liste complète des erreurs

### 1. ❌ ERREUR: Colonne message_type manquante (PGRST204)
**Symptôme**: Impossible d'envoyer un message  
**Erreur**: `Could not find the 'message_type' column of 'purchase_case_messages' in the schema cache`  
**Solution**: Exécuter `QUICK_FIX_CALENDAR_APPOINTMENTS.sql` dans Supabase
**Status**: ⏳ **À FAIRE** - Migration SQL pas encore exécutée

---

### 2. ❌ ERREUR: Storage RLS policy - Upload documents bloqué (403)
**Symptôme**: Impossible d'uploader un document  
**Erreur**: `new row violates row-level security policy`  
**Cause**: Policies du bucket `documents` bloquent l'accès  
**Solution**: Configurer les storage policies via Supabase Dashboard
**Status**: ⏳ **À FAIRE** - Nécessite intervention manuelle via Dashboard

---

### 3. ❌ ERREUR: Table user_profiles introuvable (PGRST116)
**Symptôme**: Erreur lors du chargement du profil acheteur  
**Erreur**: `Cannot coerce the result to a single JSON object` (PGRST116)  
**Cause**: Code cherche `user_profiles` qui n'existe pas (ou est mal créée)  
**Localisation**: Probablement dans un composant qui charge le profil utilisateur  
**Solution**: Vérifier si table existe, sinon la créer  
**Status**: ⏳ **À FAIRE** - Diagnostic nécessaire

---

### 4. ❌ ERREUR: Table user_notification_settings introuvable (PGRST205)
**Symptôme**: Erreur lors du chargement des paramètres de notification  
**Erreur**: `Could not find the table 'public.user_notification_settings' in the schema cache`  
**Localisation**: Probablement dans ParticulierSettings ou un composant de profil  
**Solution**: Exécuter le script de création de la table  
**Status**: ⏳ **À FAIRE** - Migration SQL nécessaire

---

### 5. ❌ ERREUR: WebSocket connection fail (NetworkError)
**Symptôme**: Messages et rendez-vous ne se synchronisent pas en temps réel  
**Erreur**: `Firefox ne peut établir de connexion avec le serveur à l'adresse wss://...`  
**Cause**: Connexion WebSocket échouée à Supabase realtime service  
**Impact**: Non-bloquant - REST API fonctionne, juste pas temps réel  
**Solution**: À corriger après MVP, pour l'instant utiliser REST polling  
**Status**: 🟡 **PRIORITÉ BAS**

---

### 6. ❌ BUG: Bouton "Contacter" sans handler (ligne 913)
**Symptôme**: Cliquer sur bouton "Contacter vendeur" ne fonctionne rien  
**Cause**: Button n'a pas de `onClick` handler  
**Localisation**: `ParticulierCaseTrackingModernRefonte.jsx:913`  
**Code**:
```jsx
<Button className="w-full mt-4" variant="outline">
  <MessageSquare className="w-4 h-4 mr-2" />
  Contacter  {/* ← NO onClick handler! */}
</Button>
```
**Solution**: Ajouter `onClick` pour ouvrir la section Messages ou dialog de contact  
**Status**: 🔴 **À FAIRE** - Code à modifier

---

## 🎯 Ordre de priorité des fixes

### 🔴 CRITIQUE (Bloquer le workflow)
1. ✅ Migration SQL pour `message_type` → Exécuter `QUICK_FIX_CALENDAR_APPOINTMENTS.sql`
2. ✅ Migration SQL pour `user_profiles` → Chercher ou créer la table
3. ✅ Migration SQL pour `user_notification_settings` → Exécuter `create-notification-settings-table.sql`
4. ✅ Storage RLS policy → Configurer via Dashboard
5. ✅ Ajouter onClick au bouton "Contacter"

### 🟡 IMPORTANT (Amélioration)
6. WebSocket realtime → À corriger après MVP (non-bloquant)

### 🟢 OPTIONNEL
7. Optimisations de performance
8. Logging et monitoring

---

## 📝 Migrations SQL à exécuter (dans l'ordre)

### 1️⃣ QUICK_FIX_CALENDAR_APPOINTMENTS.sql
```bash
QUOI: Ajoute message_type, case_id, sender_id à purchase_case_messages
RÔLE: service_role
STATUT: ⏳ À faire
```

### 2️⃣ Créer user_profiles si elle n'existe pas
```sql
-- Vérifier:
SELECT * FROM information_schema.tables 
WHERE table_name = 'user_profiles';

-- Si ne retourne rien, créer la table:
CREATE TABLE public.user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50),
  avatar_url TEXT,
  bio TEXT,
  company TEXT,
  address TEXT,
  city TEXT,
  region TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3️⃣ Créer user_notification_settings si elle n'existe pas
```bash
FICHIER: create-notification-settings-table.sql
RÔLE: service_role
```

### 4️⃣ FIX_RLS_POLICIES.sql
```bash
RÔLE: service_role
CONTIENT: Policies pour purchase_case_messages et purchase_case_documents
```

---

## 🔧 Fixe Code Frontend Requise

### Fichier: ParticulierCaseTrackingModernRefonte.jsx
**Ligne**: 913  
**Problème**: Bouton "Contacter" sans onClick

**Avant**:
```jsx
<Button className="w-full mt-4" variant="outline">
  <MessageSquare className="w-4 h-4 mr-2" />
  Contacter
</Button>
```

**Après** (option A - scroll vers Messages):
```jsx
<Button 
  className="w-full mt-4" 
  variant="outline"
  onClick={() => {
    // Scroll vers section Messages
    document.getElementById('messages-section')?.scrollIntoView({ behavior: 'smooth' });
  }}
>
  <MessageSquare className="w-4 h-4 mr-2" />
  Contacter
</Button>
```

**Après** (option B - ouvrir dialog):
```jsx
<Button 
  className="w-full mt-4" 
  variant="outline"
  onClick={() => {
    setShowContactDialog(true);
  }}
>
  <MessageSquare className="w-4 h-4 mr-2" />
  Contacter
</Button>
```

---

## 📊 Résumé des actions

| # | Erreur | Fichier | Action | Priorité |
|----|--------|---------|--------|----------|
| 1 | PGRST204 | QUICK_FIX_CALENDAR_APPOINTMENTS.sql | Exécuter SQL | 🔴 CRITICAL |
| 2 | PGRST116 user_profiles | Backend | Créer/vérifier table | 🔴 CRITICAL |
| 3 | PGRST205 user_notification_settings | create-notification-settings-table.sql | Exécuter SQL | 🔴 CRITICAL |
| 4 | RLS 403 Storage | Supabase Dashboard | Config policies | 🔴 CRITICAL |
| 5 | onClick manquant | ParticulierCaseTrackingModernRefonte.jsx:913 | Modifier code | 🔴 CRITICAL |
| 6 | WebSocket fail | Supabase config | À corriger après MVP | 🟡 LOW |

---

## ✅ Checklist d'exécution

- [ ] Exécuter QUICK_FIX_CALENDAR_APPOINTMENTS.sql
- [ ] Vérifier/créer table user_profiles
- [ ] Exécuter create-notification-settings-table.sql
- [ ] Exécuter FIX_RLS_POLICIES.sql
- [ ] Configurer storage policies via Dashboard
- [ ] Ajouter onClick au bouton "Contacter"
- [ ] Tester: envoyer message
- [ ] Tester: uploader document
- [ ] Tester: cliquer "Contacter"
- [ ] Tester: synchronisation temps réel (optionnel)

---

**Dernier commit**: 4e85ddaf  
**Prochaine action**: Exécuter les migrations SQL dans l'ordre
