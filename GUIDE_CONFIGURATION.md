# 🔧 GUIDE DE CONFIGURATION - TERANGA FONCIER
# ==========================================

## 🌍 VARIABLES D'ENVIRONNEMENT

### Créer le fichier `.env`
```bash
# 🚀 Configuration de base
VITE_APP_NAME=Teranga Foncier
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production

# 🌐 URLs et domaines
VITE_API_BASE_URL=https://api.teranga-foncier.sn
VITE_APP_URL=https://teranga-foncier.sn
VITE_ADMIN_URL=https://admin.teranga-foncier.sn

# 🔐 Authentification
VITE_JWT_SECRET=your-super-secret-jwt-key-here
VITE_SESSION_TIMEOUT=7200
VITE_REFRESH_TOKEN_LIFETIME=604800

# 📧 Configuration email
VITE_SMTP_HOST=smtp.gmail.com
VITE_SMTP_PORT=587
VITE_SMTP_USER=noreply@teranga-foncier.sn
VITE_SMTP_PASS=your-smtp-password
VITE_FROM_EMAIL=noreply@teranga-foncier.sn

# 💾 Base de données
VITE_DB_HOST=localhost
VITE_DB_PORT=5432
VITE_DB_NAME=teranga_foncier
VITE_DB_USER=postgres
VITE_DB_PASS=your-db-password

# 🪣 Stockage (Supabase/AWS)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SUPABASE_SERVICE_KEY=your-supabase-service-key

# 🗺️ Services géographiques
VITE_MAPBOX_TOKEN=your-mapbox-token
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key

# 💳 Paiements
VITE_STRIPE_PUBLIC_KEY=pk_live_your-stripe-public-key
VITE_PAYPAL_CLIENT_ID=your-paypal-client-id
VITE_WAVE_API_KEY=your-wave-api-key

# 🤖 Intelligence Artificielle
VITE_OPENAI_API_KEY=your-openai-api-key
VITE_TENSORFLOW_MODEL_URL=https://storage.googleapis.com/your-models

# ⛓️ Blockchain
VITE_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your-infura-key
VITE_CONTRACT_ADDRESS=0xYourSmartContractAddress
VITE_PRIVATE_KEY=your-ethereum-private-key

# 📊 Analytics et monitoring
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://your-sentry-dsn
VITE_HOTJAR_ID=your-hotjar-id

# 📱 PWA et notifications
VITE_VAPID_PUBLIC_KEY=your-vapid-public-key
VITE_VAPID_PRIVATE_KEY=your-vapid-private-key
VITE_FCM_SERVER_KEY=your-fcm-server-key

# 🔔 Services tiers
VITE_TWILIO_ACCOUNT_SID=your-twilio-sid
VITE_TWILIO_AUTH_TOKEN=your-twilio-token
VITE_SENDGRID_API_KEY=your-sendgrid-key

# 🏛️ Services gouvernementaux (Sénégal)
VITE_DGID_API_KEY=your-dgid-api-key
VITE_CADASTRE_API_URL=https://cadastre.gouv.sn/api
VITE_NINEA_API_KEY=your-ninea-api-key
```

---

## 🚀 DÉPLOIEMENT PAR PLATEFORME

### 1. 🌐 **Vercel (Recommandé)**
```bash
# Installation
npm install -g vercel

# Configuration
vercel --cwd . --confirm

# Déploiement
vercel --prod

# Variables d'environnement
vercel env add VITE_API_BASE_URL
vercel env add VITE_SUPABASE_URL
# ... ajouter toutes les variables
```

### 2. 🌍 **Netlify**
```bash
# Installation
npm install -g netlify-cli

# Build local
npm run build

# Déploiement
netlify deploy --prod --dir=dist

# Configuration des variables
netlify env:set VITE_API_BASE_URL "https://api.teranga-foncier.sn"
```

### 3. 🐳 **Docker**
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 4. ☁️ **AWS S3 + CloudFront**
```bash
# Installation AWS CLI
aws configure

# Sync vers S3
aws s3 sync dist/ s3://teranga-foncier-bucket/ --delete

# Invalidation CloudFront
aws cloudfront create-invalidation --distribution-id EXXXXXXXXXX --paths "/*"
```

---

## 🔧 CONFIGURATION SERVEUR

### 1. 🌐 **Nginx Configuration**
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name teranga-foncier.sn www.teranga-foncier.sn;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name teranga-foncier.sn www.teranga-foncier.sn;

    ssl_certificate /etc/letsencrypt/live/teranga-foncier.sn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/teranga-foncier.sn/privkey.pem;

    root /var/www/teranga-foncier;
    index index.html;

    # PWA Support
    location /manifest.json {
        add_header Cache-Control "public, max-age=86400";
    }

    location /sw.js {
        add_header Cache-Control "no-cache";
    }

    # Assets caching
    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Strict-Transport-Security "max-age=63072000" always;
}
```

### 2. 🔐 **SSL/TLS avec Let's Encrypt**
```bash
# Installation Certbot
sudo apt install certbot python3-certbot-nginx

# Génération certificat
sudo certbot --nginx -d teranga-foncier.sn -d www.teranga-foncier.sn

# Renouvellement automatique
sudo crontab -e
# Ajouter : 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 📊 MONITORING ET ANALYTICS

### 1. 📈 **Google Analytics 4**
```javascript
// Dans index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 2. 🐛 **Sentry pour le monitoring d'erreurs**
```bash
npm install @sentry/react @sentry/tracing
```

### 3. 📊 **Logs avec Winston**
```javascript
// logger.js
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

---

## 🔐 SÉCURITÉ

### 1. 🛡️ **Headers de sécurité**
```javascript
// Dans vite.config.js
export default {
  server: {
    headers: {
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'X-Content-Type-Options': 'nosniff',
      'Strict-Transport-Security': 'max-age=63072000'
    }
  }
}
```

### 2. 🔑 **Gestion des tokens JWT**
```javascript
// auth.js
const JWT_EXPIRATION = process.env.VITE_SESSION_TIMEOUT || 3600;
const REFRESH_EXPIRATION = process.env.VITE_REFRESH_TOKEN_LIFETIME || 604800;
```

### 3. 🚫 **Rate Limiting**
```javascript
// server/middleware/rateLimit.js
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

---

## 📱 CONFIGURATION PWA

### 1. 📋 **Manifest.json optimisé**
```json
{
  "name": "Teranga Foncier",
  "short_name": "TerangaF",
  "description": "Plateforme foncière digitale du Sénégal",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3B82F6",
  "orientation": "portrait-primary",
  "categories": ["business", "finance", "productivity"],
  "lang": "fr-SN"
}
```

### 2. 🔔 **Service Worker avancé**
```javascript
// sw.js - Stratégies de cache
const CACHE_NAME = 'teranga-foncier-v1';
const API_CACHE = 'api-cache-v1';

// Cache strategy for API calls
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      caches.open(API_CACHE).then(cache => {
        return fetch(event.request).then(response => {
          cache.put(event.request, response.clone());
          return response;
        }).catch(() => cache.match(event.request));
      })
    );
  }
});
```

---

## 🚀 COMMANDES DE DÉPLOIEMENT

### Script de déploiement automatisé
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Déploiement Teranga Foncier..."

# 1. Tests
npm run test

# 2. Build
npm run build

# 3. Optimisation
npm run optimize

# 4. Upload
if [ "$1" = "vercel" ]; then
    vercel --prod
elif [ "$1" = "netlify" ]; then
    netlify deploy --prod --dir=dist
elif [ "$1" = "aws" ]; then
    aws s3 sync dist/ s3://teranga-foncier/ --delete
    aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*"
fi

echo "✅ Déploiement terminé!"
```

---

## 📋 CHECKLIST PRÉ-DÉPLOIEMENT

### Technique
- [ ] Variables d'environnement configurées
- [ ] Build de production testé
- [ ] SSL/TLS configuré
- [ ] CDN configuré pour les assets
- [ ] Monitoring en place
- [ ] Sauvegarde automatique

### Sécurité
- [ ] Headers de sécurité configurés
- [ ] Rate limiting activé
- [ ] Validation des inputs
- [ ] Authentification sécurisée
- [ ] Chiffrement des données sensibles

### Performance
- [ ] Compression gzip activée
- [ ] Cache navigateur configuré
- [ ] Images optimisées
- [ ] Lazy loading implémenté
- [ ] Code splitting configuré

### SEO et Accessibilité
- [ ] Meta tags optimisés
- [ ] Schema.org implémenté
- [ ] Accessibilité WCAG AA
- [ ] Performance Lighthouse > 90

### Conformité
- [ ] RGPD compliance
- [ ] Mentions légales
- [ ] Politique de confidentialité
- [ ] CGU validées juridiquement
