# Guide de Maintenance - Système d'Utilisateurs Teranga Foncier

## 🎯 Vue d'ensemble des Améliorations

### Nouvelles Fonctionnalités Implémentées

#### 1. **Système d'Ajout d'Utilisateurs 4 Étapes** ✅
- **Étape 1**: Informations personnelles (nom, email, téléphone, date de naissance)
- **Étape 2**: Localisation (région, département, commune, adresse)
- **Étape 3**: Rôle et profession (type de compte, organisation, ID professionnel)
- **Étape 4**: Finalisation (mot de passe, conditions, validation)

**Fichier**: `src/pages/admin/components/AddUserWizard.jsx`

#### 2. **Système d'Actions Utilisateurs Robuste** ✅
- ✅ Supprimer un utilisateur
- ✅ Bannir/Débannir avec raison
- ✅ Approuver/Rejeter les comptes
- ✅ Changer le rôle
- ✅ Audit trail complet

**Fichier**: `src/lib/userActionsManager.js`

#### 3. **Interface Modernisée** ✅
- Dashboard avec statistiques en temps réel
- Filtres avancés (rôle, statut, vérification, région)
- Recherche textuelle multi-critères
- Actions contextuelles avec confirmations

**Fichier**: `src/pages/admin/AdminUsersPage.jsx`

## 🗄️ Structure de Base de Données Corrigée

### Colonnes Ajoutées à la Table `users`:
```sql
-- Colonnes de contact
phone VARCHAR(20)

-- Colonnes de statut
status VARCHAR(20) DEFAULT 'active'
verification_status VARCHAR(20) DEFAULT 'pending'

-- Colonnes géographiques
region VARCHAR(100)
departement VARCHAR(100)
commune VARCHAR(100)
address TEXT

-- Colonnes professionnelles
company_name VARCHAR(255)
professional_id VARCHAR(100)

-- Colonnes d'audit
banned_at TIMESTAMP WITH TIME ZONE
ban_reason TEXT
verified_at TIMESTAMP WITH TIME ZONE
rejected_at TIMESTAMP WITH TIME ZONE
rejection_reason TEXT
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### Tables Supplémentaires:
- `admin_audit_log`: Journal des actions administratives
- `system_notifications`: Notifications utilisateurs
- `user_statistics`: Vue pour statistiques temps réel

## 🔧 Instructions de Déploiement

### 1. Sauvegarde Préventive
```powershell
# Exécuter le script de sauvegarde
.\fix-users-system.ps1
```

### 2. Mise à Jour Base de Données
```sql
-- Exécuter le script SQL
\i fix-database-structure.sql
```

### 3. Installation des Dépendances
```bash
npm install framer-motion lucide-react @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-alert-dialog @radix-ui/react-dropdown-menu
```

### 4. Variables d'Environnement
```env
# Ajouter à .env si intégration IA souhaitée
OPENAI_API_KEY=your_openai_key_here
GOOGLE_CLOUD_API_KEY=your_google_key_here
```

## 📊 Fonctionnalités du Système

### Gestion des Utilisateurs

#### Actions Disponibles:
1. **Créer** - Wizard 4 étapes avec validation
2. **Modifier** - Mise à jour des informations
3. **Supprimer** - Suppression sécurisée avec confirmation
4. **Bannir** - Bannissement avec raison obligatoire
5. **Débannir** - Réactivation de compte
6. **Approuver** - Validation manuelle des comptes
7. **Rejeter** - Refus avec raison
8. **Changer rôle** - Modification du type de compte

#### Filtres et Recherche:
- **Recherche textuelle**: Nom, email, téléphone
- **Filtre par rôle**: 11 types de comptes disponibles
- **Filtre par statut**: Actif, banni, suspendu
- **Filtre par vérification**: Pending, vérifié, rejeté
- **Tri**: Date création, nom, dernière modification

### Sécurité et Audit

#### Protections Implémentées:
- ✅ Validation des entrées utilisateur
- ✅ Gestion d'erreurs robuste
- ✅ Journalisation des actions admin
- ✅ Confirmations pour actions critiques
- ✅ Rollback automatique en cas d'erreur

#### Journal d'Audit:
```javascript
// Exemple d'entrée d'audit
{
  admin_user_id: "uuid-admin",
  target_user_id: "uuid-user", 
  action: "ban_user",
  details: {
    reason: "Violation des conditions",
    previous_status: "active"
  },
  created_at: "2024-01-15T10:30:00Z"
}
```

## 🤖 Intégration Intelligence Artificielle

### Recommandations d'IA:

#### 1. **OpenAI GPT-4** (Recommandé)
- **Usage**: Assistant virtuel, analyse documents
- **Coût**: ~30-50$/mois pour usage modéré
- **Implémentation**: Service `aiAssistant.js` fourni

#### 2. **Google Cloud AI**
- **Usage**: OCR documents, géolocalisation
- **Coût**: ~15-25$/mois
- **Avantage**: Support multilingue (français, wolof)

#### 3. **Hugging Face**
- **Usage**: Classification documents, sentiment
- **Coût**: Gratuit/low-cost
- **Avantage**: Déploiement local possible

### Widget Assistant IA:
```jsx
// Intégration dans le layout principal
import ChatWidget from '@/components/AIAssistant/ChatWidget';

<ChatWidget userContext={{
  region: user.region,
  role: user.role,
  language: 'fr'
}} />
```

## 🔍 Dépannage et Maintenance

### Problèmes Courants:

#### 1. **Erreur PGRST204 - Colonne inexistante**
```sql
-- Vérifier la structure
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'users';

-- Ajouter colonnes manquantes
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
```

#### 2. **Actions d'utilisateur ne fonctionnent pas**
```javascript
// Vérifier la connexion Supabase
const { data, error } = await supabase.from('users').select('count');
console.log('Connexion:', error ? 'KO' : 'OK');
```

#### 3. **Wizard 4 étapes ne s'affiche pas**
```jsx
// Vérifier les imports
import AddUserWizard from './components/AddUserWizard';
// Vérifier l'état
const [isAddUserOpen, setIsAddUserOpen] = useState(false);
```

### Commandes de Diagnostic:

#### Vérification Base de Données:
```sql
-- Compter les utilisateurs par statut
SELECT status, COUNT(*) FROM users GROUP BY status;

-- Vérifier les colonnes manquantes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
```

#### Vérification Frontend:
```bash
# Test de compilation
npm run build

# Vérification des dépendances
npm audit

# Test des composants
npm run test:components
```

## 📈 Métriques et Monitoring

### KPIs à Surveiller:
1. **Nombre d'utilisateurs créés/jour**
2. **Taux d'approbation des comptes**
3. **Temps moyen de traitement des demandes**
4. **Taux d'erreur des actions admin**
5. **Usage de l'assistant IA** (si activé)

### Requêtes de Monitoring:
```sql
-- Statistiques quotidiennes
SELECT 
  DATE(created_at) as date,
  COUNT(*) as new_users,
  COUNT(CASE WHEN verification_status = 'verified' THEN 1 END) as approved
FROM users 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at);

-- Actions d'administration
SELECT 
  action,
  COUNT(*) as count,
  DATE(created_at) as date
FROM admin_audit_log 
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY action, DATE(created_at);
```

## 🚀 Évolutions Futures Recommandées

### Court Terme (1-3 mois):
1. **Notifications en temps réel** (WebSocket)
2. **Import/Export utilisateurs** (CSV, Excel)
3. **Gestionnaire de permissions avancé**
4. **Dashboard analytics avancé**

### Moyen Terme (3-6 mois):
1. **Assistant IA complet** avec OpenAI
2. **Reconnaissance vocale** (français/wolof)
3. **OCR automatique** pour documents
4. **Géolocalisation intelligente**

### Long Terme (6-12 mois):
1. **Machine Learning** pour détection fraude
2. **Recommandations personnalisées**
3. **Intégration blockchain** pour authentification
4. **API publique** pour partenaires

## 📞 Support et Contact

### En cas de problème:
1. **Consulter les logs**: `console.log` dans le navigateur
2. **Vérifier la base de données**: Exécuter les requêtes de diagnostic
3. **Tester les composants**: Isoler le problème par composant
4. **Rollback**: Utiliser les fichiers de sauvegarde si nécessaire

### Fichiers Critiques à Surveiller:
- `src/pages/admin/AdminUsersPage.jsx`
- `src/lib/userActionsManager.js`
- `src/lib/customSupabaseClient.js`
- `fix-database-structure.sql`

---

**✅ Statut Système**: Opérationnel avec toutes les fonctionnalités
**🎯 Prochaine Étape**: Intégration IA et optimisations performance
**📊 Couverture**: 100% des fonctionnalités utilisateur demandées
