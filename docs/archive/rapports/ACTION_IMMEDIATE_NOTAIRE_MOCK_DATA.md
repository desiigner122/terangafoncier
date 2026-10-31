# ⚡ ACTION IMMÉDIATE - ÉLIMINER MOCK DATA DASHBOARD NOTAIRE

**Date**: 8 octobre 2025  
**Urgence**: HAUTE  
**Temps requis**: 2h30

---

## 🎯 OBJECTIF

**Passer de 75% → 100% données Supabase réelles**

---

## 🚨 PROBLÈMES IDENTIFIÉS

### 1. Routes actives avec mock data (2)
- ❌ `/notaire/archives` → NotaireArchives.jsx (MOCK)
- ❌ `/notaire/compliance` → NotaireCompliance.jsx (MOCK)

### 2. Fichiers obsolètes encombrants (6+)
- NotaireTransactions.jsx
- NotaireCases.jsx  
- NotaireAnalytics.jsx
- NotaireBlockchain.jsx
- NotaireAuthentication.jsx
- NotaireCRM.jsx
- + possiblement autres

---

## 📋 PLAN D'ACTION EN 3 ÉTAPES

### ✅ ÉTAPE 1: Moderniser Archives (45 min)

**Créer**: `NotaireArchivesModernized.jsx`

**Fonctionnalités**:
- Liste archives avec search_vector (full-text)
- Filtres: année, type, client
- Tri: date archivage, montant, durée
- Actions: Voir détails, Télécharger PDF, Restaurer
- Stats: Total archives, volume affaires, durée moyenne

**Code pattern**:
```javascript
import { NotaireSupabaseService } from '@/services/NotaireSupabaseService';

const loadArchives = async () => {
  setIsLoading(true);
  const result = await NotaireSupabaseService.getArchives(user.id, {
    search: searchTerm,
    year: yearFilter,
    type: typeFilter
  });
  if (result.success) {
    setArchives(result.data);
  }
  setIsLoading(false);
};
```

**Table Supabase**: `archived_acts`
```sql
- act_number (TEXT)
- title (TEXT)
- client_name (TEXT)
- completion_date (DATE)
- archive_date (TIMESTAMP)
- notary_fees (NUMERIC)
- document_count (INTEGER)
- notes (TEXT)
- search_vector (TSVECTOR) -- Full-text search
```

---

### ✅ ÉTAPE 2: Moderniser Compliance (45 min)

**Créer**: `NotaireComplianceModernized.jsx`

**Fonctionnalités**:
- Dashboard conformité avec score global
- Liste vérifications réglementaires
- Findings par catégorie
- Actions correctives avec statut
- Historique checks avec tendances
- Alertes non-conformité

**Code pattern**:
```javascript
const loadCompliance = async () => {
  const result = await NotaireSupabaseService.getComplianceChecks(user.id);
  if (result.success) {
    setChecks(result.data);
    const avgScore = result.data.reduce((sum, c) => sum + c.compliance_score, 0) / result.data.length;
    setGlobalScore(avgScore);
  }
};
```

**Table Supabase**: `compliance_checks`
```sql
- check_number (TEXT)
- check_type (TEXT) -- 'regulatory', 'quality', 'security'
- check_status (TEXT) -- 'pending', 'completed', 'failed'
- compliance_score (INTEGER) -- 0-100
- findings (JSONB)
- corrective_actions (JSONB)
- check_date (TIMESTAMP)
- completed_date (TIMESTAMP)
```

---

### ✅ ÉTAPE 3: Nettoyage et Routes (30 min)

#### 3.1. Mettre à jour App.jsx (5 min)
```javascript
// Ajouter imports
import NotaireArchivesModernized from '@/pages/dashboards/notaire/NotaireArchivesModernized';
import NotaireComplianceModernized from '@/pages/dashboards/notaire/NotaireComplianceModernized';

// Remplacer routes (2 endroits: /notaire ET /solutions/notaires/dashboard)
<Route path="archives" element={<NotaireArchivesModernized />} />
<Route path="compliance" element={<NotaireComplianceModernized />} />
```

#### 3.2. Renommer fichiers obsolètes (10 min)
```powershell
cd "c:\Users\Smart Business\Desktop\terangafoncier\src\pages\dashboards\notaire"

# Renommer en .backup.jsx
Rename-Item "NotaireArchives.jsx" "NotaireArchives.backup.jsx"
Rename-Item "NotaireCompliance.jsx" "NotaireCompliance.backup.jsx"
Rename-Item "NotaireTransactions.jsx" "NotaireTransactions.backup.jsx"
Rename-Item "NotaireCases.jsx" "NotaireCases.backup.jsx"
Rename-Item "NotaireAnalytics.jsx" "NotaireAnalytics.backup.jsx"
Rename-Item "NotaireBlockchain.jsx" "NotaireBlockchain.backup.jsx"
Rename-Item "NotaireAuthentication.jsx" "NotaireAuthentication.backup.jsx"
Rename-Item "NotaireCRM.jsx" "NotaireCRM.backup.jsx"
```

#### 3.3. Vérifier erreurs (5 min)
```bash
# Lint check
npm run lint

# Build check
npm run build --dry-run
```

#### 3.4. Tests fonctionnels (10 min)
- [ ] Page archives charge données Supabase
- [ ] Recherche full-text fonctionne
- [ ] Filtres année/type fonctionnent
- [ ] Page compliance affiche scores
- [ ] Actions correctives visibles
- [ ] Aucune erreur console

---

## 🔧 SERVICES SUPABASE À AJOUTER

### Pour Archives (si manquant)
```javascript
// NotaireSupabaseService.js

static async getArchives(notaireId, filters = {}) {
  try {
    let query = supabase
      .from('archived_acts')
      .select('*')
      .eq('notaire_id', notaireId);

    if (filters.search) {
      query = query.textSearch('search_vector', filters.search);
    }

    if (filters.year) {
      query = query.gte('archive_date', `${filters.year}-01-01`)
                   .lte('archive_date', `${filters.year}-12-31`);
    }

    if (filters.type) {
      query = query.eq('act_type', filters.type);
    }

    const { data, error } = await query.order('archive_date', { ascending: false });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Erreur récupération archives:', error);
    return { success: false, error: error.message };
  }
}
```

### Pour Compliance (existe déjà)
✅ `NotaireSupabaseService.getComplianceChecks()` déjà disponible

---

## 📊 PROGRESSION ATTENDUE

### Avant
```
9/12 pages (75%) ✅ Supabase
2/12 pages (17%) ❌ Mock data
1/12 pages (8%)  ⚠️ À valider
6+ fichiers obsolètes présents
```

### Après
```
11/12 pages (92%) ✅ Supabase
0/12 pages (0%)   ❌ Mock data
1/12 pages (8%)   ⚠️ AI à valider
0 fichiers obsolètes (renommés .backup)
```

---

## ⏱️ TIMELINE

| Tâche | Durée | Cumul |
|-------|-------|-------|
| NotaireArchivesModernized.jsx | 45 min | 45 min |
| NotaireComplianceModernized.jsx | 45 min | 1h30 |
| Update routes App.jsx | 5 min | 1h35 |
| Renommer fichiers obsolètes | 10 min | 1h45 |
| Vérifier erreurs lint | 5 min | 1h50 |
| Tests fonctionnels | 10 min | 2h00 |
| Documentation finale | 10 min | 2h10 |
| **TOTAL** | **2h10** | |

---

## ✅ CHECKLIST VALIDATION

### Avant de démarrer
- [ ] Supabase accessible
- [ ] Tables `archived_acts` et `compliance_checks` existent
- [ ] NotaireSupabaseService.js ouvert
- [ ] App.jsx accessible

### Pendant développement
- [ ] Archives: Full-text search testé
- [ ] Archives: Filtres année/type testés
- [ ] Compliance: Score calculé correctement
- [ ] Compliance: Actions correctives affichées
- [ ] Routes mises à jour (2 endroits)
- [ ] Zéro erreur lint

### Après livraison
- [ ] Test en local réussi
- [ ] Fichiers obsolètes renommés
- [ ] Documentation mise à jour
- [ ] Commit propre avec message clair
- [ ] Pull request créé (si applicable)

---

## 🎯 CRITÈRES DE SUCCÈS

1. ✅ **Zéro mock data** dans dashboard notaire
2. ✅ **100% Supabase** (sauf AI à valider)
3. ✅ **Zéro fichier obsolète** non renommé
4. ✅ **Zéro erreur** lint/build
5. ✅ **Tests fonctionnels** passés

---

## 🚀 COMMANDE DE DÉMARRAGE

```bash
# Prêt à démarrer ?
echo "Dashboard notaire - Élimination mock data"
echo "Étape 1/3: Créer NotaireArchivesModernized.jsx"
echo "GO !"
```

---

**Statut**: 🔴 EN ATTENTE  
**Prêt à exécuter**: OUI  
**Temps estimé**: 2h10  
**Impact**: Dashboard 100% production ready
