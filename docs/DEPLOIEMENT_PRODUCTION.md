# 🚀 GUIDE DE DÉPLOIEMENT PRODUCTION
## Teranga Foncier - Déploiement Complet

---

## ✅ PRÉ-REQUIS

### Outils Nécessaires
- ✅ Node.js >= 18.x
- ✅ npm >= 9.x
- ✅ Git
- ✅ Compte Supabase
- ✅ Compte Vercel/Netlify (ou serveur)

### Variables d'Environnement
Créer un fichier `.env.production`:

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_anon_key
VITE_APP_URL=https://votre-domaine.com
VITE_ENVIRONMENT=production
```

---

## 📋 ÉTAPES DE DÉPLOIEMENT

### 1️⃣ TESTS D'INTÉGRATION

```bash
# Exécuter les tests Supabase
node tests/supabase-integration.test.js

# Résultat attendu: 100% des tests passés
```

**Critères de validation:**
- ✅ Connexion Supabase OK
- ✅ NotaireSupabaseService: 8/8 tests passés
- ✅ VendeurSupabaseService: 5/5 tests passés

---

### 2️⃣ DÉPLOIEMENT BASE DE DONNÉES

#### A. Créer les Tables

1. Ouvrir Supabase Dashboard: https://supabase.com/dashboard
2. Sélectionner votre projet
3. Aller dans **SQL Editor**
4. Copier le contenu de `supabase/schema-production.sql`
5. Cliquer sur **Run**

#### B. Vérifier les Tables Créées

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Tables attendues (15):**
- `profiles`
- `terrains`
- `terrain_photos`
- `offres`
- `blockchain_transactions`
- `notaire_actes`
- `notaire_support_tickets`
- `notifications`
- `subscription_plans`
- `user_subscriptions`
- `elearning_courses`
- `course_enrollments`
- `video_meetings`
- `marketplace_products`
- `user_purchases`

#### C. Vérifier les Indexes (49 attendus)

```sql
SELECT indexname FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY indexname;
```

#### D. Activer Row Level Security (RLS)

Vérifier que RLS est activé:
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

Tous doivent avoir `rowsecurity = true`.

#### E. Insérer les Données Initiales

Les plans d'abonnement sont insérés automatiquement par le script.
Vérifier:

```sql
SELECT * FROM subscription_plans;
```

---

### 3️⃣ BUILD PRODUCTION

```bash
# Installer les dépendances
npm install --legacy-peer-deps

# Build production
npm run build

# Vérifier le build
ls -lh dist/
```

**Taille attendue:** ~5-10 MB

---

### 4️⃣ DÉPLOIEMENT FRONTEND

#### Option A: Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod

# Configurer les variables d'environnement
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

#### Option B: Netlify

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Déployer
netlify deploy --prod

# Variables d'environnement via UI Netlify
```

#### Option C: Serveur Manuel (VPS/Shared Hosting)

```bash
# 1. Upload le dossier 'dist' via FTP/SFTP

# 2. Configuration Nginx (exemple)
server {
    listen 80;
    server_name votre-domaine.com;
    root /var/www/terangafoncier/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# 3. SSL avec Let's Encrypt
sudo certbot --nginx -d votre-domaine.com
```

---

### 5️⃣ CONFIGURATION POST-DÉPLOIEMENT

#### A. Configurer Supabase Auth

Dans Supabase Dashboard > Authentication > URL Configuration:

- **Site URL:** `https://votre-domaine.com`
- **Redirect URLs:**
  ```
  https://votre-domaine.com/auth/callback
  https://votre-domaine.com/dashboard
  ```

#### B. Configurer Storage

Dans Supabase Dashboard > Storage:

1. Créer un bucket `terrain-photos`
2. Configuration:
   - Public: ✅ Oui
   - File size limit: 10 MB
   - Allowed mime types: `image/jpeg, image/png, image/webp`

#### C. Configurer Email Templates

Dans Supabase Dashboard > Authentication > Email Templates:

- **Confirmation Email** ✅
- **Magic Link** ✅
- **Reset Password** ✅

---

### 6️⃣ MONITORING & ANALYTICS

#### A. Activer MonitoringService

Le monitoring est automatique. Pour voir les métriques:

```javascript
// En mode dev, ouvrir la console:
window.__monitoring.showDashboard()
```

#### B. Créer Tables Analytics (Optionnel)

```sql
-- Table pour les événements analytics
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL,
    event_data JSONB,
    user_id UUID REFERENCES public.profiles(id),
    user_agent TEXT,
    viewport TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les alertes système
CREATE TABLE IF NOT EXISTS public.system_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_type TEXT NOT NULL,
    alert_data JSONB,
    severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_analytics_user ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_type ON public.analytics_events(event_type);
CREATE INDEX idx_alerts_severity ON public.system_alerts(severity);
```

#### C. Services Externes Recommandés

1. **Sentry** (Erreurs)
   ```bash
   npm install @sentry/react
   ```

2. **LogRocket** (Session Replay)
   ```bash
   npm install logrocket
   ```

3. **Google Analytics** (Usage)
   ```html
   <!-- Dans index.html -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   ```

---

## ✅ CHECKLIST DE VALIDATION

### Tests Fonctionnels

#### Dashboard Notaire (13 pages)
- [ ] Overview: Statistiques visibles
- [ ] Transactions: Liste chargée
- [ ] Settings: Modification profil OK
- [ ] Authentication: 2FA fonctionnel
- [ ] Archives: Documents accessibles
- [ ] Analytics: Graphiques OK
- [ ] Compliance: Données chargées
- [ ] Blockchain: Transactions listées
- [ ] Support: Tickets visibles
- [ ] Notifications: Chargement OK
- [ ] Subscriptions: Plans affichés
- [ ] E-Learning: Cours disponibles
- [ ] Visio: Création réunion OK
- [ ] Marketplace: Produits listés

#### Dashboard Vendeur (3 pages)
- [ ] Transactions Blockchain: Chargées
- [ ] Photos: Upload + Suppression OK
- [ ] Listings: CRUD complet

#### Dashboard Particulier
- [ ] Recherche terrains
- [ ] Favoris fonctionnels
- [ ] Création d'offres

#### Dashboard Admin
- [ ] Gestion utilisateurs
- [ ] Validation propriétés
- [ ] Analytics globales

### Tests de Performance
- [ ] Time to First Byte < 500ms
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Lighthouse Score > 90

### Tests de Sécurité
- [ ] HTTPS actif
- [ ] RLS Supabase configuré
- [ ] Variables d'environnement sécurisées
- [ ] Headers de sécurité configurés
- [ ] CORS configuré correctement

### Tests Cross-Browser
- [ ] Chrome ✅
- [ ] Firefox ✅
- [ ] Safari ✅
- [ ] Edge ✅

### Tests Responsive
- [ ] Desktop (1920x1080) ✅
- [ ] Tablet (768x1024) ✅
- [ ] Mobile (375x667) ✅

---

## 🔧 MAINTENANCE

### Backups Automatiques

Configurer dans Supabase Dashboard > Settings > Backups:
- Fréquence: Quotidienne
- Rétention: 7 jours

### Mises à Jour

```bash
# Vérifier les mises à jour
npm outdated

# Mettre à jour les dépendances
npm update

# Rebuild et redéployer
npm run build
vercel --prod
```

### Monitoring Continu

```bash
# Vérifier les logs Vercel
vercel logs

# Vérifier les métriques Supabase
# Dashboard > Reports
```

---

## 🆘 TROUBLESHOOTING

### Problème: Build échoue

**Solution:**
```bash
rm -rf node_modules dist
npm cache clean --force
npm install --legacy-peer-deps
npm run build
```

### Problème: Erreur Supabase Connection

**Solution:**
1. Vérifier les variables d'environnement
2. Vérifier l'URL Supabase
3. Régénérer l'anon key si nécessaire

### Problème: 404 sur routes

**Solution:**
Configurer redirections:

**Vercel** (`vercel.json`):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Netlify** (`netlify.toml`):
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 📊 MÉTRIQUES DE SUCCÈS

### Performance
- **Uptime:** > 99.9%
- **Response Time:** < 500ms (p95)
- **Error Rate:** < 0.1%

### Usage
- **MAU (Monthly Active Users):** Tracking
- **Daily Transactions:** Tracking
- **Support Tickets:** < 5% des utilisateurs

---

## 📞 SUPPORT

### Documentation
- Guide utilisateurs: `/docs/USER_GUIDE.md`
- Tests: `/docs/TESTS_UTILISATEURS.md`
- API: `/docs/API.md`

### Contacts
- **Tech Lead:** [email]
- **DevOps:** [email]
- **Support:** support@terangafoncier.com

---

## ✅ VALIDATION FINALE

- [ ] Tous les tests passés
- [ ] Schema DB déployé
- [ ] Application accessible
- [ ] Monitoring actif
- [ ] Backups configurés
- [ ] Documentation à jour
- [ ] Équipe formée

---

**🎉 Félicitations ! Votre plateforme est en production !**

Date de déploiement: _____________
Déployé par: _____________
Version: _____________
