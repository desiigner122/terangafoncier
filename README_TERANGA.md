# 🏠 Teranga Foncier - Plateforme Immobilière Intelligente

Application web complète pour la gestion immobilière au Sénégal, intégrant IA, blockchain et géolocalisation.

## 🚀 Démarrage Rapide

### Installation

```bash
# Cloner le repository
git clone https://github.com/desiigner122/terangafoncier.git
cd terangafoncier

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés API

# Lancer en développement
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## 🔑 Configuration des Variables d'Environnement

### ✅ Obligatoires (Déjà configurées en production)

```bash
# Supabase (Base de données)
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### ⚠️ Intelligence Artificielle (À configurer)

```bash
# OpenAI GPT-4 - Analyses IA, descriptions auto, chatbot
VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxx
```

**📖 Guide complet** : [CONFIGURATION_VERCEL_OPENAI.md](./CONFIGURATION_VERCEL_OPENAI.md)

**🚀 Configuration sur Vercel** :
1. Dashboard Vercel → Settings → Environment Variables
2. Ajouter `VITE_OPENAI_API_KEY`
3. Obtenir clé sur : https://platform.openai.com/api-keys
4. Coût : ~$0.03/1000 tokens (GPT-4)

**🆓 Mode sans clé** : Simulation IA gratuite pour démo

### 🔧 Optionnelles

```bash
# Blockchain/NFT
VITE_WALLETCONNECT_PROJECT_ID=xxxxx

# Géolocalisation
VITE_GOOGLE_MAPS_API_KEY=AIzaSyxxxxx

# IPFS/NFT Storage
VITE_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**📝 Guide détaillé** : [ENV_VARIABLES_GUIDE.md](./ENV_VARIABLES_GUIDE.md)

## ✨ Fonctionnalités Principales

### 🏢 Dashboards Multi-Rôles
- **Vendeur** : Gestion propriétés, analytics, IA assistant
- **Acheteur** : Recherche, favoris, demandes de financement
- **Notaire** : Dossiers, signatures, blockchain
- **Agent Foncier** : Vérifications, rapports GPS
- **Administrateur** : Gestion globale, modération

### 🤖 Intelligence Artificielle (GPT-4)
- Analyse automatique de propriétés
- Génération de descriptions optimisées SEO
- Estimation de prix par analyse de marché
- Chatbot intelligent pour assistance
- Recommandations personnalisées

### ⛓️ Blockchain & NFT
- Tokenisation de propriétés
- Certificats de propriété vérifiables
- Historique immuable des transactions
- Smart contracts pour sécurité

### 📍 Géolocalisation
- Vérification GPS des terrains
- Cartes interactives
- Rapports de localisation
- Détection anti-fraude géographique

### 💬 Communication Temps Réel
- Messagerie instantanée
- Notifications push
- Suivi des demandes
- Historique conversations

### 📊 Analytics & Reporting
- Tableaux de bord personnalisés
- Statistiques de performance
- Rapports exportables
- Insights IA

## 🛠️ Technologies

### Frontend
- **React 18** avec Vite
- **Tailwind CSS** pour le styling
- **Framer Motion** pour animations
- **Shadcn/ui** pour composants UI
- **React Router** pour navigation

### Backend & Services
- **Supabase** (PostgreSQL, Auth, Storage, Realtime)
- **OpenAI GPT-4** (IA)
- **Polygon** (Blockchain)
- **IPFS/Pinata** (Stockage décentralisé)
- **Google Maps** (Géolocalisation)

### Déploiement
- **Vercel** (Frontend)
- **Supabase** (Backend)
- **GitHub Actions** (CI/CD)

## 📱 Responsive Design

Application entièrement responsive :
- 📱 Mobile-first design
- 💻 Tablette optimisée
- 🖥️ Desktop full-featured
- 🔄 PWA ready (Progressive Web App)

## 🔐 Sécurité

- ✅ Authentification Supabase (JWT)
- ✅ Row Level Security (RLS)
- ✅ Variables d'environnement sécurisées
- ✅ HTTPS obligatoire
- ✅ Protection CSRF
- ✅ Validation backend

## 📂 Structure du Projet

```
terangafoncier/
├── src/
│   ├── components/          # Composants réutilisables
│   ├── pages/               # Pages de l'application
│   │   ├── dashboards/      # Dashboards par rôle
│   │   │   ├── vendeur/     # Dashboard vendeur
│   │   │   ├── acheteur/    # Dashboard acheteur
│   │   │   ├── notaire/     # Dashboard notaire
│   │   │   └── admin/       # Dashboard admin
│   │   └── public/          # Pages publiques
│   ├── services/            # Services API
│   │   ├── ai/              # Services IA (OpenAI)
│   │   ├── blockchain/      # Services blockchain
│   │   └── supabase/        # Client Supabase
│   ├── contexts/            # Contextes React
│   ├── hooks/               # Hooks personnalisés
│   ├── utils/               # Utilitaires
│   └── lib/                 # Librairies
├── public/                  # Assets statiques
├── supabase/               # Migrations & functions
└── docs/                   # Documentation

```

## 🚀 Déploiement Production

### Vercel (Frontend)

1. **Connecter repository GitHub** sur Vercel
2. **Configurer variables d'environnement** :
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_OPENAI_API_KEY=sk-proj-xxxxx
   ```
3. **Deploy** : Automatique sur chaque push

### Supabase (Backend)

1. **Créer projet** sur https://supabase.com
2. **Exécuter migrations** :
   ```bash
   supabase db push
   ```
3. **Configurer RLS policies**
4. **Activer Realtime** sur tables nécessaires

## 📖 Documentation

- **[Guide Variables d'Environnement](./ENV_VARIABLES_GUIDE.md)** - Configuration complète
- **[Configuration OpenAI sur Vercel](./CONFIGURATION_VERCEL_OPENAI.md)** - Guide IA
- **[Architecture](./ARCHITECTURE.md)** - Structure détaillée
- **[API Reference](./API_REFERENCE.md)** - Documentation API

## 🧪 Tests

```bash
# Lancer tests unitaires
npm test

# Tests E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

## 👥 Équipe

- **Développement** : desiigner122
- **Design** : Teranga Foncier Team

## 📞 Support

- **Email** : support@terangafoncier.com
- **Documentation** : [Voir guides](./docs/)
- **Issues** : [GitHub Issues](https://github.com/desiigner122/terangafoncier/issues)

## 🎯 Roadmap

### Phase 1 - MVP ✅
- [x] Authentification multi-rôles
- [x] Dashboards basiques
- [x] Gestion propriétés
- [x] Messagerie temps réel

### Phase 2 - IA & Blockchain 🚧
- [x] Intégration OpenAI GPT-4
- [x] Analyses IA propriétés
- [x] Chatbot intelligent
- [ ] **Configuration production IA** ← ACTUEL
- [ ] Tokenisation blockchain
- [ ] NFT certificats

### Phase 3 - Fonctionnalités Avancées 📋
- [ ] Paiements en ligne
- [ ] Visites virtuelles 360°
- [ ] Signatures électroniques
- [ ] App mobile native
- [ ] API publique

## ⚡ Performance

- ⚡ Lighthouse Score : 95+
- 🚀 First Contentful Paint : <1s
- 📦 Bundle size optimisé
- 🔄 Code splitting automatique
- 💾 Cache intelligent

## 🌍 Langues

- 🇫🇷 Français (Principal)
- 🇬🇧 Anglais (À venir)

---

**Made with ❤️ in Senegal 🇸🇳**

**🚀 État actuel** : Production active avec mode simulation IA  
**🎯 Priorité** : Configuration OpenAI en production  
**📅 Dernière mise à jour** : Octobre 2025
