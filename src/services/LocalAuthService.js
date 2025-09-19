// Système d'authentification locale avec comptes intégrés
// Permet l'accès aux dashboards sans connexion Supabase

class LocalAuthService {
  constructor() {
    // Comptes intégrés pour accès direct aux dashboards
    this.accounts = {
      'admin@local': {
        id: 'local-admin',
        email: 'admin@local',
        password: 'admin123',
        role: 'admin',
        name: 'Admin Local',
        permissions: ['read', 'write', 'delete', 'admin'],
        dashboard: '/admin'
      },
      'particulier@local': {
        id: 'local-particulier',
        email: 'particulier@local',
        password: 'part123',
        role: 'particular',
        name: 'Particulier Local',
        permissions: ['read', 'write'],
        dashboard: '/acheteur'
      },
      'agent@local': {
        id: 'local-agent',
        email: 'agent@local',
        password: 'agent123',
        role: 'agent_foncier',
        name: 'Agent Foncier Local',
        permissions: ['read', 'write', 'validate'],
        dashboard: '/agent-foncier'
      },
      'notaire@local': {
        id: 'local-notaire',
        email: 'notaire@local',
        password: 'notaire123',
        role: 'notaire',
        name: 'Notaire Local',
        permissions: ['read', 'write', 'certify'],
        dashboard: '/notaire'
      },
      'geometre@local': {
        id: 'local-geometre',
        email: 'geometre@local',
        password: 'geo123',
        role: 'geometre',
        name: 'Géomètre Local',
        permissions: ['read', 'write', 'measure'],
        dashboard: '/geometre'
      },
      'banque@local': {
        id: 'local-banque',
        email: 'banque@local',
        password: 'bank123',
        role: 'banque',
        name: 'Banque Local',
        permissions: ['read', 'write', 'finance'],
        dashboard: '/banque'
      },
      'promoteur@local': {
        id: 'local-promoteur',
        email: 'promoteur@local',
        password: 'promo123',
        role: 'promoteur',
        name: 'Promoteur Local',
        permissions: ['read', 'write', 'develop'],
        dashboard: '/promoteur'
      },
      'lotisseur@local': {
        id: 'local-lotisseur',
        email: 'lotisseur@local',
        password: 'lot123',
        role: 'lotisseur',
        name: 'Lotisseur Local',
        permissions: ['read', 'write', 'subdivide'],
        dashboard: '/lotisseur'
      },
      'mairie@local': {
        id: 'local-mairie',
        email: 'mairie@local',
        password: 'mairie123',
        role: 'mairie',
        name: 'Mairie Local',
        permissions: ['read', 'write', 'municipal'],
        dashboard: '/mairie'
      }
    };

    this.currentUser = null;
    this.loadStoredUser();
  }

  // Charger l'utilisateur depuis le localStorage
  loadStoredUser() {
    try {
      const stored = localStorage.getItem('local_auth_user');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Erreur chargement utilisateur local:', error);
      localStorage.removeItem('local_auth_user');
    }
  }

  // Sauvegarder l'utilisateur dans le localStorage
  saveUser(user) {
    localStorage.setItem('local_auth_user', JSON.stringify(user));
    this.currentUser = user;
  }

  // Connexion avec compte local
  signIn(email, password) {
    const account = this.accounts[email];
    
    if (account && account.password === password) {
      const user = {
        id: account.id,
        email: account.email,
        user_metadata: {
          name: account.name,
          role: account.role
        },
        permissions: account.permissions,
        dashboard: account.dashboard
      };
      
      this.saveUser(user);
      return { user, error: null };
    }
    
    return { 
      user: null, 
      error: { message: 'Email ou mot de passe incorrect' }
    };
  }

  // Connexion rapide par rôle (sans mot de passe)
  quickSignIn(role) {
    const account = Object.values(this.accounts).find(acc => acc.role === role);
    
    if (account) {
      const user = {
        id: account.id,
        email: account.email,
        user_metadata: {
          name: account.name,
          role: account.role
        },
        permissions: account.permissions,
        dashboard: account.dashboard
      };
      
      this.saveUser(user);
      return { user, error: null };
    }
    
    return { 
      user: null, 
      error: { message: 'Rôle non trouvé' }
    };
  }

  // Déconnexion
  signOut() {
    localStorage.removeItem('local_auth_user');
    this.currentUser = null;
    return { error: null };
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser() {
    return this.currentUser;
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Obtenir tous les comptes disponibles
  getAvailableAccounts() {
    return Object.values(this.accounts).map(account => ({
      email: account.email,
      role: account.role,
      name: account.name,
      dashboard: account.dashboard
    }));
  }

  // Vérifier les permissions
  hasPermission(permission) {
    return this.currentUser?.permissions?.includes(permission) || false;
  }

  // Obtenir le dashboard par défaut de l'utilisateur
  getDefaultDashboard() {
    return this.currentUser?.dashboard || '/';
  }
}

// Instance globale
export const localAuth = new LocalAuthService();
export default LocalAuthService;
