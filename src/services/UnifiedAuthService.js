// Service d'authentification unifié - Version Supabase
// Utilise Supabase comme authentification principale avec fallback API

import { supabase } from '@/lib/supabaseClient';
import { localAuth } from './LocalAuthService';

class UnifiedAuthService {
  constructor() {
    this.currentUser = null;
    this.session = null;
    this.isLocalMode = false; // Désactivé par défaut - on utilise Supabase
    this.initializeAuth();
  }

  // Initialisation de l'authentification Supabase
  async initializeAuth() {
    try {
      // Récupérer la session actuelle
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erreur récupération session Supabase:', error);
        return;
      }
      
      if (session) {
        this.session = session;
        this.currentUser = session.user;
        console.log('✅ Session Supabase restaurée:', session.user.email);
      }
    } catch (error) {
      console.error('Erreur initialisation auth Supabase:', error);
    }
  }

  // Obtenir la session actuelle
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erreur getSession:', error);
        return { data: { session: null }, error };
      }
      
      this.session = session;
      this.currentUser = session?.user || null;
      
      return { data: { session }, error: null };
    } catch (error) {
      console.error('Erreur getSession:', error);
      return { data: { session: null }, error };
    }
  }

  // Écouter les changements d'état d'authentification
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state change:', event, session?.user?.email);
      
      this.session = session;
      this.currentUser = session?.user || null;
      
      callback(event, session);
    });
  }

  // Connexion avec email/password
  async signIn(email, password) {
    try {
      console.log('🔐 Tentative connexion Supabase:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ Erreur connexion Supabase:', error);
        return { user: null, error };
      }

      console.log('✅ Connexion Supabase réussie:', data.user.email);
      
      this.session = data.session;
      this.currentUser = data.user;

      return { 
        user: data.user, 
        session: data.session,
        error: null 
      };
    } catch (error) {
      console.error('❌ Erreur inattendue connexion:', error);
      return { user: null, error };
    }
  }

  // Inscription avec email/password
  async signUp({ email, password, firstName, lastName, role }) {
    try {
      console.log('📝 Tentative inscription Supabase:', { email, role });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            user_type: role || 'particulier',
            name: `${firstName} ${lastName}`.trim()
          }
        }
      });

      if (error) {
        console.error('❌ Erreur inscription Supabase:', error);
        return { user: null, error };
      }

      console.log('✅ Inscription Supabase réussie:', data.user?.email);
      
      this.session = data.session;
      this.currentUser = data.user;

      return { 
        user: data.user, 
        session: data.session,
        error: null 
      };
    } catch (error) {
      console.error('❌ Erreur inattendue inscription:', error);
      return { user: null, error };
    }
  }

  // Déconnexion
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      
      this.session = null;
      this.currentUser = null;
      
      if (error) {
        console.error('Erreur déconnexion Supabase:', error);
        return { error };
      }
      
      console.log('✅ Déconnexion Supabase réussie');
      return { error: null };
    } catch (error) {
      console.error('❌ Erreur inattendue déconnexion:', error);
      return { error };
    }
  }

  // Mettre à jour le profil
  async updateProfile(fields) {
    try {
      if (!this.currentUser) {
        return { success: false, error: 'Aucun utilisateur connecté' };
      }

      const { data, error } = await supabase.auth.updateUser({
        data: {
          ...this.currentUser.user_metadata,
          ...fields
        }
      });

      if (error) {
        console.error('Erreur mise à jour profil Supabase:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Profil Supabase mis à jour');
      this.currentUser = data.user;
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('❌ Erreur inattendue mise à jour profil:', error);
      return { success: false, error: error.message };
    }
  }

  // Méthodes de compatibilité pour les tests
  
  // Connexion rapide (mode test) - utilise les vrais comptes Supabase
  async quickSignIn(role) {
    const testAccounts = this.getTestAccounts();
    const account = testAccounts.find(acc => acc.role === role);
    
    if (!account) {
      return { user: null, error: new Error(`Aucun compte de test pour le rôle: ${role}`) };
    }
    
    return await this.signIn(account.email, account.password);
  }

  // Obtenir les comptes de test disponibles
  getTestAccounts() {
    return [
      {
        email: 'admin@teranga.com',
        password: 'admin123',
        role: 'admin',
        name: 'Admin Teranga'
      },
      {
        email: 'vendeur@teranga.com', 
        password: 'vendeur123',
        role: 'vendeur',
        name: 'Moussa Diop'
      },
      {
        email: 'acheteur@teranga.com',
        password: 'acheteur123',
        role: 'particulier', 
        name: 'Fatou Sall'
      }
    ];
  }

  // Basculer entre auth locale et Supabase (pour compatibilité)
  setLocalMode(enabled) {
    this.isLocalMode = enabled;
    console.log(`🔄 Mode auth changé: ${enabled ? 'Local' : 'Supabase'}`);
    
    if (enabled) {
      // Si on active le mode local, utiliser LocalAuthService
      console.log('⚠️ Mode local activé - utilisation LocalAuthService');
    } else {
      // Mode Supabase par défaut
      console.log('✅ Mode Supabase activé');
    }
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser() {
    if (this.isLocalMode) {
      return localAuth.getCurrentUser();
    }
    return this.currentUser;
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return !!this.getCurrentUser();
  }
}

// Export singleton
export const unifiedAuth = new UnifiedAuthService();
export default unifiedAuth;