// Service d'authentification unifié
// Remplace Supabase par Express API + Local Auth pour tests

import { api, apiClient } from '@/config/api';
import { localAuth } from './LocalAuthService';

class UnifiedAuthService {
  constructor() {
    this.currentUser = null;
    this.isLocalMode = this.detectLocalMode();
    this.loadCurrentUser();
  }

  // Détecter si on est en mode local (pour tests)
  detectLocalMode() {
    // Force l'utilisation du mode API (désactiver le mode local automatique)
    return localStorage.getItem('use_local_auth') === 'true';
  }

  // Basculer entre auth locale et API
  setLocalMode(enabled) {
    localStorage.setItem('use_local_auth', enabled.toString());
    this.isLocalMode = enabled;
    
    if (!enabled) {
      // Nettoyer l'auth locale si on bascule vers API
      localAuth.signOut();
    }
  }

  // Charger l'utilisateur actuel
  loadCurrentUser() {
    if (this.isLocalMode) {
      this.currentUser = localAuth.getCurrentUser();
    } else {
      // Charger depuis le token JWT
      const token = apiClient.getToken();
      if (token) {
        // Le token sera validé lors du prochain appel API
        this.currentUser = this.decodeTokenUser(token);
      }
    }
  }

  // Décoder l'utilisateur depuis le token JWT
  decodeTokenUser(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.userId,
        email: payload.email,
        user_metadata: {
          name: payload.name,
          role: payload.role
        },
        permissions: payload.permissions || []
      };
    } catch (error) {  
      console.error('Erreur décodage token:', error);
      return null;
    }
  }

  // Connexion
  async signIn(email, password) {
    try {
      console.log('🔐 UnifiedAuthService.signIn:', { email, isLocalMode: this.isLocalMode });
      
      if (this.isLocalMode) {
        console.log('📱 Mode local activé');
        // Utiliser l'auth locale pour les tests
        const result = localAuth.signIn(email, password);
        if (result.user) {
          this.currentUser = result.user;
        }
        return result;
      } else {
        console.log('🌐 Mode API activé - appel à l\'API Express');
        // Utiliser l'API Express
        const response = await api.login({ email, password });
        console.log('📡 Réponse API reçue:', response);
        
        // L'API retourne { success: true, data: { user, token }, message }
        if (response.success && response.data) {
          const { user, token } = response.data;
          console.log('✅ Connexion réussie:', { user: user.email, tokenLength: token.length });
          
          apiClient.setToken(token);
          this.currentUser = user;
          
          // Sauvegarder aussi localement pour la persistence
          localStorage.setItem('current_user', JSON.stringify(user));
          
          return { 
            user: user, 
            error: null 
          };
        } else {
          console.log('❌ Échec de connexion:', response);
          return {
            user: null,
            error: { message: response.message || 'Erreur de connexion' }
          };
        }
      }
    } catch (error) {
      console.error('Erreur connexion:', error);
      return { 
        user: null, 
        error: { message: error.message || 'Erreur de connexion' }
      };
    }
  }

  // Connexion rapide par rôle (mode test uniquement)
  async quickSignIn(role) {
    if (!this.isLocalMode) {
      return { 
        user: null, 
        error: { message: 'Connexion rapide disponible uniquement en mode test' }
      };
    }

    const result = localAuth.quickSignIn(role);
    if (result.user) {
      this.currentUser = result.user;
    }
    return result;
  }

  // Inscription
  async signUp(userData) {
    try {
      if (this.isLocalMode) {
        return { 
          user: null, 
          error: { message: 'Inscription non disponible en mode test' }
        };
      }

      const response = await api.register(userData);
      return { 
        user: response.user, 
        error: null 
      };
    } catch (error) {
      console.error('Erreur inscription:', error);
      return { 
        user: null, 
        error: { message: error.message || 'Erreur lors de l\'inscription' }
      };
    }
  }

  // Déconnexion
  async signOut() {
    try {
      if (this.isLocalMode) {
        localAuth.signOut();
      } else {
        await api.logout();
        apiClient.setToken(null);
        localStorage.removeItem('current_user');
      }
      
      this.currentUser = null;
      return { error: null };
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      // Force la déconnexion locale même en cas d'erreur API
      this.currentUser = null;
      apiClient.setToken(null);
      localStorage.removeItem('current_user');
      return { error: null };
    }
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser() {
    return this.currentUser;
  }

  // Vérifier si connecté
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Obtenir le profil utilisateur
  async getProfile() {
    try {
      if (this.isLocalMode) {
        return this.currentUser;
      }

      const profile = await api.getProfile();
      this.currentUser = { ...this.currentUser, ...profile };
      return this.currentUser;
    } catch (error) {
      console.error('Erreur récupération profil:', error);
      return this.currentUser;
    }
  }

  // Mettre à jour le profil
  async updateProfile(updates) {
    try {
      if (this.isLocalMode) {
        // Mise à jour locale
        this.currentUser = { ...this.currentUser, ...updates };
        localAuth.saveUser(this.currentUser);
        return { success: true };
      }

      const updatedProfile = await api.updateProfile(updates);
      this.currentUser = { ...this.currentUser, ...updatedProfile };
      return { success: true };
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      return { success: false, error: error.message };
    }
  }

  // Vérifier les permissions
  hasPermission(permission) {
    return this.currentUser?.permissions?.includes(permission) || 
           this.currentUser?.user_metadata?.role === 'admin';
  }

  // Obtenir le rôle de l'utilisateur
  getUserRole() {
    return this.currentUser?.user_metadata?.role || null;
  }

  // Obtenir le dashboard par défaut
  getDefaultDashboard() {
    const role = this.getUserRole();
    const dashboardMap = {
      'admin': '/admin',
      'particular': '/acheteur',
      'agent_foncier': '/agent-foncier',
      'notaire': '/notaire',
      'geometre': '/geometre',
      'banque': '/banque',
      'promoteur': '/promoteur',
      'lotisseur': '/lotisseur',
      'mairie': '/mairie'
    };
    
    return dashboardMap[role] || '/';
  }

  // Callback pour changement d'état d'authentification
  onAuthStateChange(callback) {
    // Simple callback pour compatibilité avec Supabase
    const unsubscribe = () => {
      // Cleanup si nécessaire
    };

    // Appeler le callback avec l'état actuel
    callback('SIGNED_IN', this.currentUser);

    return { data: { subscription: { unsubscribe } } };
  }

  // Obtenir la session actuelle
  async getSession() {
    const user = this.getCurrentUser();
    return {
      data: {
        session: user ? {
          user,
          access_token: apiClient.getToken()
        } : null
      },
      error: null
    };
  }

  // Obtenir tous les comptes de test disponibles
  getTestAccounts() {
    return this.isLocalMode ? localAuth.getAvailableAccounts() : [];
  }

  // Basculer vers un compte de test
  async switchToTestAccount(role) {
    if (!this.isLocalMode) return { success: false };
    
    const result = await this.quickSignIn(role);
    return { success: result.user !== null };
  }
}

// Instance globale
export const unifiedAuth = new UnifiedAuthService();
export default unifiedAuth;