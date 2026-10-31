# 🔍 STRUCTURE PROFILES DÉCOUVERTE

## 📋 **COLONNES IDENTIFIÉES**

Basé sur l'erreur PostgreSQL qui montre la structure exacte :

```
Failing row contains (null, test@terangafoncier.sn, null, null, particulier, null, null, null, f, 2025-10-11 09:17:13.635162+00, 2025-10-11 09:17:13.635162+00, null, null, null, null)
```

### **STRUCTURE DÉDUITE :**

| Position | Valeur dans erreur | Colonne probable | Type | Notes |
|----------|-------------------|------------------|------|-------|
| 1 | `null` | **id** | UUID/PK | **REQUIS** - Primary Key |
| 2 | `test@terangafoncier.sn` | **email** | VARCHAR | ✅ Fourni |
| 3 | `null` | **?** | ? | Peut-être name, full_name, ou autre |
| 4 | `null` | **?** | ? | |
| 5 | `particulier` | **role** | VARCHAR | ✅ Fourni |
| 6 | `null` | **?** | ? | Peut-être status |
| 7 | `null` | **?** | ? | |
| 8 | `null` | **?** | ? | |
| 9 | `f` | **?** | BOOLEAN | Valeur par défaut false |
| 10 | `2025-10-11...` | **created_at** | TIMESTAMP | ✅ Auto-généré |
| 11 | `2025-10-11...` | **updated_at** | TIMESTAMP | ✅ Auto-généré |
| 12 | `null` | **?** | ? | |
| 13 | `null` | **?** | ? | |
| 14 | `null` | **?** | ? | |
| 15 | `null` | **?** | ? | |

## 🔧 **SOLUTION**

### **1. Problème ID**
```javascript
// ❌ AVANT 
{ email: 'test@test.com', role: 'particulier' }

// ✅ APRÈS
{ 
  id: crypto.randomUUID(), // ou gen_random_uuid() dans SQL
  email: 'test@test.com', 
  role: 'particulier' 
}
```

### **2. Alternatives pour contourner RLS**

#### **Option A: Utiliser service key (plus puissante)**
```javascript
const supabase = createClient(url, SERVICE_KEY); // Au lieu d'ANON_KEY
```

#### **Option B: S'autentifier d'abord**
```javascript
await supabase.auth.signUp({ email: 'admin@test.com', password: 'temp123' });
```

#### **Option C: Requête SQL directe**
```sql
-- Via l'interface Supabase SQL Editor (contourne RLS)
INSERT INTO profiles (id, email, role) VALUES (gen_random_uuid(), 'test@test.com', 'particulier');
```

## 🎯 **PROCHAINE ÉTAPE**

Essayer l'insertion avec un UUID généré pour résoudre le problème `id` requis.
