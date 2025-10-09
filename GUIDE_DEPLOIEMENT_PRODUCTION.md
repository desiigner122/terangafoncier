# 🚀 GUIDE DÉPLOIEMENT PRODUCTION - DASHBOARD PARTICULIER

## 📋 CHECKLIST PRÉ-DÉPLOIEMENT

### ✅ 1. BASE DE DONNÉES (PRIORITÉ 1)

**Exécuter les scripts SQL dans l'ordre:**

```bash
# 1. Schéma principal
psql -f create-complete-teranga-schema.sql

# 2. Système documents
psql -f create-user-documents-system.sql

# 3. Notifications
psql -f create-notifications-system.sql

# 4. Rôles et permissions
psql -f assign-admin-role.sql
psql -f assign-banque-role.sql
```

**Vérification:**
```sql
-- Vérifier toutes les tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'demandes_terrains_communaux',
  'zones_communales', 
  'candidatures_zones_communales',
  'user_documents',
  'notifications'
);

-- Vérifier RLS activé
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE rowsecurity = true;
```

### ✅ 2. SUPABASE STORAGE

**Configuration buckets:**

```javascript
// Via Dashboard Supabase ou code
const { data, error } = await supabase.storage.createBucket('user-documents', {
  public: false,
  allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'application/msword'],
  fileSizeLimit: 10485760 // 10MB
})

// Policies Storage
CREATE POLICY "Utilisateurs peuvent uploader leurs documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### ✅ 3. VARIABLES D'ENVIRONNEMENT

**Créer `.env.production`:**

```env
# Supabase
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key

# Storage
REACT_APP_STORAGE_BUCKET=user-documents

# Notifications
REACT_APP_NOTIFICATION_WEBHOOK=https://your-webhook-url

# Debug
REACT_APP_ENVIRONMENT=production
REACT_APP_DEBUG_MODE=false
```

### ✅ 4. COMPOSANTS REACT

**Vérifier tous les fichiers fonctionnels:**

```
✅ CompleteSidebarParticulierDashboard.jsx (Outlet routing)
✅ ParticulierOverview.jsx (Admin dashboard + redirections)
✅ ParticulierDemandesTerrains.jsx (CRUD complet)
✅ ParticulierZonesCommunales_FUNCTIONAL.jsx (Candidatures)
✅ ParticulierNotifications_FUNCTIONAL.jsx (Supabase + fallback)
✅ ParticulierDocuments_FUNCTIONAL.jsx (Upload/Download)
✅ ParticulierSettings_FUNCTIONAL.jsx (4 tabs complets)
✅ ParticulierMessages.jsx (Communication)
✅ ParticulierConstructions.jsx (Demandes promoteurs)
```

**Build production:**
```bash
npm run build
# Vérifier taille bundle
npm run analyze
```

## 🔄 PROCÉDURE DE DÉPLOIEMENT

### ÉTAPE 1: BACKUP PRODUCTION
```bash
# Backup base existante
pg_dump -h your-host -U postgres teranga_db > backup_pre_deployment.sql

# Backup Storage (si applicable)
supabase storage cp --recursive user-documents/ ./backup-storage/
```

### ÉTAPE 2: DÉPLOIEMENT BASE DE DONNÉES
```bash
# 1. Connexion production
psql -h your-production-host -U postgres -d teranga_production

# 2. Exécution scripts (ORDRE IMPORTANT)
\i create-complete-teranga-schema.sql
\i create-user-documents-system.sql  
\i create-notifications-system.sql

# 3. Vérification
SELECT COUNT(*) FROM demandes_terrains_communaux;
SELECT COUNT(*) FROM zones_communales;
SELECT COUNT(*) FROM user_documents;
```

### ÉTAPE 3: CONFIGURATION SUPABASE
```bash
# Via Supabase CLI
supabase link --project-ref your-production-project

# Deploy migrations
supabase db push

# Configure Storage
supabase storage create-bucket user-documents
```

### ÉTAPE 4: DÉPLOIEMENT APPLICATION
```bash
# Build production
npm run build

# Deploy (selon votre hébergeur)
# Vercel
vercel --prod

# Netlify  
netlify deploy --prod --dir=build

# Ou serveur custom
rsync -avz build/ user@your-server:/var/www/teranga/
```

### ÉTAPE 5: VALIDATION POST-DÉPLOIEMENT
```bash
# Exécuter script de validation
node validate-workflows.mjs

# Tests manuels critiques
# 1. Connexion utilisateur
# 2. Création demande terrain
# 3. Upload document
# 4. Réception notification
# 5. Navigation entre pages
```

## 🔧 CONFIGURATION SERVEUR

### NGINX (si applicable)
```nginx
server {
    listen 80;
    server_name teranga-dashboard.com;
    
    location / {
        root /var/www/teranga/build;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
}
```

### APACHE (.htaccess)
```apache
RewriteEngine On
RewriteRule ^(?!.*\.).*$ /index.html [L]

# Security headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set X-XSS-Protection "1; mode=block"

# Cache static assets
<FilesMatch "\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
</FilesMatch>
```

## 📊 MONITORING PRODUCTION

### Métriques à surveiller
```javascript
// 1. Performance pages
- Temps chargement Dashboard < 2s
- Upload documents < 30s (10MB)
- Requêtes Supabase < 500ms

// 2. Erreurs critiques  
- Échecs connexion base
- Erreurs RLS (accès refusé)
- Uploads échoués
- Notifications non envoyées

// 3. Utilisation
- Nombre demandes/jour
- Documents uploadés/jour
- Utilisateurs actifs
- Pages les plus visitées
```

### Scripts monitoring
```bash
# Vérification santé base
#!/bin/bash
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "
SELECT 
  'demandes_terrains' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as today_records
FROM demandes_terrains_communaux
UNION ALL
SELECT 
  'notifications',
  COUNT(*),
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END)
FROM notifications;
"
```

## 🚨 PLAN D'URGENCE

### Rollback rapide
```bash
# 1. Restaurer base précédente
psql -h $HOST -U postgres -d teranga_production < backup_pre_deployment.sql

# 2. Revenir version app précédente
git checkout previous-stable-tag
npm run build
# Redeploy

# 3. DNS/CDN cache clear
cloudflare purge cache # si Cloudflare
```

### Points de défaillance critiques
```
1. ❌ Base de données inaccessible
   → Vérifier connexions Supabase
   → Check RLS policies
   
2. ❌ Upload documents échoue
   → Vérifier Storage bucket
   → Check permissions policies
   
3. ❌ Notifications non reçues
   → Vérifier table notifications
   → Check triggers database

4. ❌ Pages blanches/erreurs
   → Check console browser
   → Vérifier build production
   → Check variables environnement
```

## 📱 TESTS UTILISATEURS FINAUX

### Scenarios critiques à tester

**Scénario 1: Nouveau particulier**
```
1. Inscription → Profil créé
2. Connexion → Dashboard affiché
3. Demande terrain → Formulaire fonctionnel
4. Upload documents → Supabase Storage OK
5. Notification reçue → Admin alerté
```

**Scénario 2: Suivi demande existante**
```
1. Connexion → Demandes visibles
2. Détail demande → Statut correct
3. Messages admin → Communication OK
4. Documents demandés → Upload réussi
5. Changement statut → Notification reçue
```

**Scénario 3: Candidature zone communale**
```
1. Zones disponibles → Liste affichée
2. Candidature → Formulaire validé
3. Documents requis → Upload OK
4. Suivi candidature → Statut visible
5. Sélection → Paiement activé
```

## 🎯 CRITÈRES DE SUCCÈS

### Performance
- ✅ Dashboard charge en < 3 secondes
- ✅ Upload 10MB en < 30 secondes  
- ✅ Navigation fluide entre pages
- ✅ Pas d'erreurs JavaScript console

### Fonctionnel
- ✅ Toutes les pages accessibles
- ✅ CRUD opérations fonctionnelles
- ✅ Notifications temps réel
- ✅ Documents upload/download OK

### Sécurité
- ✅ RLS policies actives
- ✅ Accès user limité à ses données
- ✅ Admins accès complet selon rôle
- ✅ Pas de leak données sensibles

### Utilisabilité
- ✅ Interface intuitive
- ✅ Messages erreur clairs
- ✅ Responsive mobile
- ✅ Feedback utilisateur temps réel

---

## 🚀 LANCEMENT PRODUCTION

**Quand tout est ✅ :**

1. **Communication users**: Email annonçant nouveau dashboard
2. **Formation admins**: Session présentation nouvelles fonctionnalités  
3. **Support technique**: Équipe prête pour tickets utilisateurs
4. **Monitoring actif**: Surveillance métriques première semaine

**Le dashboard particulier Teranga Foncier est maintenant une plateforme administrative complète et moderne !** 🎉

---

## 📞 CONTACTS SUPPORT

- **Technique**: dev@terangafoncier.com
- **Fonctionnel**: admin@terangafoncier.com  
- **Urgence**: +221 XX XXX XXXX

**Félicitations ! Votre transformation numérique est réussie ! 🚀**