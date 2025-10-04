# 🚀 GUIDE COMPLET DÉPLOIEMENT VERCEL - TERANGA FONCIER

## ✅ PRÉREQUIS
- [x] Backend fonctionnel en local
- [x] Compte GitHub avec le code
- [x] Compte Vercel (gratuit)
- [x] Variables d'environnement générées

## 📋 ÉTAPE 1 - PRÉPARATION BASE DE DONNÉES

### Option A: Supabase (RECOMMANDÉ - Gratuit)
1. Aller sur https://supabase.com/
2. Créer nouveau projet
3. Récupérer l'URL de connexion :
   ```
   postgresql://postgres.[password]@db.[project-id].supabase.co:5432/postgres
   ```
4. Créer les tables avec le script SQL fourni

### Option B: Neon Database (Alternative)
1. Aller sur https://neon.tech/
2. Créer base de données PostgreSQL
3. Récupérer l'URL de connexion

---

## 🔧 ÉTAPE 2 - CONFIGURATION VERCEL

### 2.1 Connecter le repository
1. Aller sur https://vercel.com/dashboard
2. Cliquer "New Project"
3. Importer depuis GitHub : `terangafoncier`
4. Sélectionner le dossier `backend`

### 2.2 Configuration du projet
```bash
Framework Preset: Other
Root Directory: backend
Build Command: npm run build
Output Directory: (laisser vide)
Install Command: npm install
```

### 2.3 Ajouter variables d'environnement
Dans `Settings > Environment Variables`, ajouter :

#### **Variables OBLIGATOIRES :**
```bash
NODE_ENV=production
JWT_SECRET=e7))j%!x)=P<{nO^2O=pr4L[bb1X;I8VIBNi5.UUaoeUdHHaaz(4qv&>xKe0|&*B
JWT_REFRESH_SECRET=Kt;(zlYVH=NM$U<VsOYU)FsBG8_?PUpvXvG]Ij9,68l^u|p1]8EhUH8[j>[b;<?c
DATABASE_TYPE=postgresql
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
```

#### **Variables OPTIONNELLES (ajouter progressivement) :**
```bash
OPENAI_API_KEY=sk-proj-...
GOOGLE_AI_API_KEY=AIza...
MAPBOX_API_KEY=pk.eyJ1...
STRIPE_SECRET_KEY=sk_live_...
```

---

## 🗄️ ÉTAPE 3 - CONFIGURATION BASE DE DONNÉES

### Script SQL pour Supabase/PostgreSQL :
```sql
-- Créer les tables principales
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'visiteur',
    telephone VARCHAR(20),
    adresse TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    derniere_connexion TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'actif'
);

CREATE TABLE IF NOT EXISTS properties (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    prix DECIMAL(15,2),
    type_propriete VARCHAR(100),
    surface DECIMAL(10,2),
    localisation VARCHAR(255),
    coordonnees_gps VARCHAR(100),
    proprietaire_id INTEGER REFERENCES users(id),
    statut VARCHAR(50) DEFAULT 'disponible',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    propriete_id INTEGER REFERENCES properties(id),
    acheteur_id INTEGER REFERENCES users(id),
    vendeur_id INTEGER REFERENCES users(id),
    montant DECIMAL(15,2),
    type_transaction VARCHAR(100),
    statut VARCHAR(50) DEFAULT 'en_attente',
    hash_blockchain VARCHAR(255),
    date_transaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour les performances
CREATE INDEX idx_properties_localisation ON properties(localisation);
CREATE INDEX idx_properties_prix ON properties(prix);
CREATE INDEX idx_users_email ON users(email);
```

---

## 🚀 ÉTAPE 4 - DÉPLOIEMENT

### 4.1 Premier déploiement
1. Dans Vercel, cliquer "Deploy"
2. Attendre la compilation
3. Vérifier l'URL générée : `https://votre-projet.vercel.app`

### 4.2 Test du déploiement
```bash
# Tester health check
curl https://votre-projet.vercel.app/health

# Tester inscription
curl -X POST https://votre-projet.vercel.app/api/auth/inscription \
  -H "Content-Type: application/json" \
  -d '{"nom":"Test","email":"test@test.com","mot_de_passe":"password123"}'
```

---

## 🔧 ÉTAPE 5 - CONFIGURATION PRODUCTION

### 5.1 Adapter le code pour PostgreSQL
Le backend est actuellement configuré pour SQLite. Pour production :

1. Mettre à jour `backend/config/database.js` :
```javascript
import pkg from 'pg';
const { Pool } = pkg;

let db = null;

export async function initDatabase() {
    try {
        db = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });
        
        console.log('✅ Connexion PostgreSQL établie');
        await createTables();
        return db;
    } catch (error) {
        console.error('❌ Erreur connexion PostgreSQL:', error);
        throw error;
    }
}
```

### 5.2 Mettre à jour les routes pour PostgreSQL
Remplacer les requêtes SQLite par PostgreSQL dans les routes.

---

## 📊 ÉTAPE 6 - MONITORING & TESTS

### 6.1 Vérifications post-déploiement
- [ ] Health check répond `200 OK`
- [ ] Base de données connectée
- [ ] Authentification fonctionne
- [ ] Routes principales accessibles
- [ ] CORS configuré correctement

### 6.2 Monitoring Vercel
- Analytics automatiques
- Logs en temps réel
- Métriques de performance
- Alertes d'erreur

---

## 🎯 CHECKLIST FINALE

### ✅ Configuration
- [ ] Repository GitHub connecté
- [ ] Variables d'environnement ajoutées
- [ ] Base de données PostgreSQL configurée
- [ ] Secrets JWT générés et sécurisés

### ✅ Déploiement
- [ ] Premier déploiement réussi
- [ ] URL de production accessible
- [ ] Health check fonctionnel
- [ ] Tests API validés

### ✅ Production
- [ ] CORS configuré pour frontend
- [ ] Rate limiting activé
- [ ] Logs configurés
- [ ] Monitoring en place

---

## 🚨 TROUBLESHOOTING

### Erreur "Module not found"
- Vérifier que toutes les dépendances sont dans `package.json`
- S'assurer que `type: "module"` est présent

### Erreur base de données
- Vérifier `DATABASE_URL` dans Vercel
- Tester la connexion depuis Supabase dashboard
- Vérifier que les tables existent

### Erreur CORS
- Ajouter `FRONTEND_URL` dans les variables Vercel
- Vérifier la configuration CORS dans `server.js`

---

## 🎉 RÉSULTAT FINAL

Une fois déployé, vous aurez :
- ✅ API backend accessible mondialement
- ✅ Base de données PostgreSQL hébergée
- ✅ Variables d'environnement sécurisées
- ✅ SSL/HTTPS automatique
- ✅ Scaling automatique
- ✅ Monitoring intégré

**URL API:** `https://votre-projet.vercel.app/api`

Prêt pour le frontend ! 🚀