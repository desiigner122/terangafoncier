// Service d'authentification unifié - Version Supabase
// Utilise Supabase comme authentification principale avec fallback API

import { supabase } from '@/lib/supabaseClient';
import { localAuth } from './LocalAuthService';
import { logger } from '@/lib/logger';

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
        logger.error('Erreur récupération session Supabase:', error);
        return;
      }
      
      if (session) {
        this.session = session;
        this.currentUser = session.user;
        logger.debug('✅ Session Supabase restaurée:', session.user.email);
      }
    } catch (error) {
      logger.error('Erreur initialisation auth Supabase:', error);
    }
  }

  // Obtenir la session actuelle
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        logger.error('Erreur getSession:', error);
        return { data: { session: null }, error };
      }
      
      this.session = session;
      this.currentUser = session?.user || null;
      
      return { data: { session }, error: null };
    } catch (error) {
      logger.error('Erreur getSession:', error);
      return { data: { session: null }, error };
    }
  }

  // Écouter les changements d'état d'authentification
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      logger.debug('🔄 Auth state change:', event, session?.user?.email);
      
      this.session = session;
      this.currentUser = session?.user || null;
      
      callback(event, session);
    });
  }

  // Connexion avec email/password
  async signIn(email, password) {
    try {
      logger.debug('🔐 Tentative connexion Supabase:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        logger.error('❌ Erreur connexion Supabase:', error);
        return { user: null, error };
      }

      logger.debug('✅ Connexion Supabase réussie:', data.user.email);
      
      this.session = data.session;
      this.currentUser = data.user;

      return { 
        user: data.user, 
        session: data.session,
        error: null 
      };
    } catch (error) {
      logger.error('❌ Erreur inattendue connexion:', error);
      return { user: null, error };
    }
  }

  // Inscription avec email/password
  async signUp({ email, password, firstName, lastName, role }) {
    try {
      // Seuls les rôles « libres » peuvent être choisis à l'inscription.
      // Les rôles institutionnels (banque, mairie, notaire, géomètre, agent,
      // admin) sont attribués par un administrateur après vérification.
      const SELF_SERVICE_ROLES = ['particulier', 'particular', 'vendeur', 'investisseur', 'promoteur'];
      const requested = String(role || 'particulier').toLowerCase();
      role = SELF_SERVICE_ROLES.includes(requested) ? requested : 'particulier';
      
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
        logger.error('❌ Erreur inscription Supabase:', error);
        return { user: null, error };
      }

      logger.debug('✅ Inscription Supabase réussie:', data.user?.email);
      
      this.session = data.session;
      this.currentUser = data.user;

      return { 
        user: data.user, 
        session: data.session,
        error: null 
      };
    } catch (error) {
      logger.error('❌ Erreur inattendue inscription:', error);
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
        logger.error('Erreur déconnexion Supabase:', error);
        return { error };
      }
      
      logger.debug('✅ Déconnexion Supabase réussie');
      return { error: null };
    } catch (error) {
      logger.error('❌ Erreur inattendue déconnexion:', error);
      return { error };
    }
  }

  // Mettre à jour le profil
  async updateProfile(fields) {
    try {
      if (!this.currentUser) {
        return { success: false, error: 'Aucun utilisateur connecté' };
      }

      // Les champs privilégiés (rôle, statut…) ne sont jamais modifiables ici :
      // ils sont verrouillés côté base par un trigger, on les retire aussi côté client.
      const safeFields = { ...fields };
      ['role', 'user_type', 'verification_status', 'is_verified', 'banned', 'is_active', 'status', 'id', 'email']
        .forEach((k) => delete safeFields[k]);

      // Source de vérité : la table `profiles` (protégée par RLS).
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ ...safeFields, updated_at: new Date().toISOString() })
        .eq('id', this.currentUser.id);

      if (profileError) {
        logger.error('Erreur mise à jour profil Supabase:', profileError);
        return { success: false, error: profileError.message };
      }

      // Copie d'affichage dans user_metadata (non utilisée pour les droits).
      const { data, error } = await supabase.auth.updateUser({
        data: { ...this.currentUser.user_metadata, ...safeFields }
      });

      if (error) {
        logger.warn('Metadata non synchronisées:', error.message);
        return { success: true, user: this.currentUser };
      }

      this.currentUser = data.user;
      return { success: true, user: data.user };
    } catch (error) {
      logger.error('❌ Erreur inattendue mise à jour profil:', error);
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
  // ⚠️ SÉCURITÉ : aucun identifiant n'est codé en dur ici. Les comptes de test ne
  // sont exposés qu'en mode développement et leurs identifiants proviennent de
  // variables d'environnement (jamais committées). En production : liste vide.
  getTestAccounts() {
    if (!import.meta.env.DEV) {
      return [];
    }

    const accounts = [
      {
        email: import.meta.env.VITE_TEST_ADMIN_EMAIL,
        password: import.meta.env.VITE_TEST_ADMIN_PASSWORD,
        role: 'admin',
        name: 'Admin Teranga'
      },
      {
        email: import.meta.env.VITE_TEST_VENDEUR_EMAIL,
        password: import.meta.env.VITE_TEST_VENDEUR_PASSWORD,
        role: 'vendeur',
        name: 'Vendeur Test'
      },
      {
        email: import.meta.env.VITE_TEST_ACHETEUR_EMAIL,
        password: import.meta.env.VITE_TEST_ACHETEUR_PASSWORD,
        role: 'particulier',
        name: 'Acheteur Test'
      }
    ].filter(acc => acc.email && acc.password);

    if (accounts.length === 0) {
      logger.warn(
        'ℹ️ Aucun compte de test configuré. Définissez VITE_TEST_*_EMAIL / ' +
        'VITE_TEST_*_PASSWORD dans votre .env de développement pour les activer.'
      );
    }

    return accounts;
  }

  // Basculer entre auth locale et Supabase (pour compatibilité)
  // ⚠️ SÉCURITÉ : le mode local (LocalAuthService, mots de passe en clair) est
  // strictement interdit en production — il ne peut être activé qu'en dev.
  setLocalMode(enabled) {
    if (enabled && !import.meta.env.DEV) {
      logger.error('⛔ Mode auth local interdit en production. Ignoré.');
      this.isLocalMode = false;
      return;
    }

    this.isLocalMode = enabled;
    logger.debug(`🔄 Mode auth changé: ${enabled ? 'Local (DEV)' : 'Supabase'}`);
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