// Système de gestion en temps réel des changements d'utilisateur
import { supabase } from './supabaseClient';

class UserStatusManager {
  constructor() {
    this.subscribers = new Set();
    this.isListening = false;
  }

  // Démarrer l'écoute des changements en temps réel
  startListening() {
    if (this.isListening) return;
    
    this.subscription = supabase
      .channel('user_changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'users',
        filter: 'verification_status=in.(banned,verified,pending,rejected)'
      }, (payload) => {
        console.log('🔄 Changement utilisateur détecté:', payload);
        this.notifySubscribers({
          type: 'USER_STATUS_CHANGED',
          user: payload.new,
          oldUser: payload.old,
          timestamp: new Date().toISOString()
        });
      })
      .on('postgres_changes', {
        event: 'UPDATE', 
        schema: 'public',
        table: 'users',
        filter: 'role=neq.null'
      }, (payload) => {
        console.log('🔄 Changement rôle détecté:', payload);
        this.notifySubscribers({
          type: 'USER_ROLE_CHANGED',
          user: payload.new,
          oldUser: payload.old,
          timestamp: new Date().toISOString()
        });
      })
      .subscribe();

    this.isListening = true;
    console.log('✅ Écoute des changements utilisateur démarrée');
  }

  // Arrêter l'écoute
  stopListening() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.isListening = false;
      console.log('⛔ Écoute des changements utilisateur arrêtée');
    }
  }

  // S'abonner aux changements
  subscribe(callback) {
    this.subscribers.add(callback);
    
    // Auto-démarrer l'écoute
    if (!this.isListening) {
      this.startListening();
    }

    // Retourner fonction de désabonnement
    return () => {
      this.subscribers.delete(callback);
      if (this.subscribers.size === 0) {
        this.stopListening();
      }
    };
  }

  // Notifier tous les abonnés
  notifySubscribers(change) {
    this.subscribers.forEach(callback => {
      try {
        callback(change);
      } catch (error) {
        console.error('❌ Erreur notification subscriber:', error);
      }
    });
  }

  // Forcer une vérification de session utilisateur
  async checkUserSession(userId) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, verification_status, role, full_name')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Erreur vérification session:', error);
        return null;
      }

      return user;
    } catch (error) {
      console.error('❌ Erreur checkUserSession:', error);
      return null;
    }
  }

  // Invalider la session d'un utilisateur banni
  async invalidateBannedUserSession(userId) {
    try {
      // Forcer la déconnexion côté Supabase Auth
      const { error } = await supabase.auth.admin.signOut(userId);
      
      if (error) {
        console.warn('⚠️ Impossible de forcer la déconnexion:', error);
      }

      // Notifier tous les clients connectés
      this.notifySubscribers({
        type: 'USER_SESSION_INVALIDATED',
        userId,
        reason: 'banned',
        timestamp: new Date().toISOString()
      });

      console.log('✅ Session utilisateur invalidée:', userId);
    } catch (error) {
      console.error('❌ Erreur invalidation session:', error);
    }
  }

  // Action de bannissement avec invalidation de session
  async banUser(userId, reason = 'Violation des conditions d\'utilisation') {
    try {
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({
          verification_status: 'banned',
          ban_reason: reason,
          banned_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      // Invalider la session
      await this.invalidateBannedUserSession(userId);

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('❌ Erreur bannissement:', error);
      return { success: false, error: error.message };
    }
  }

  // Action de dé-bannissement
  async unbanUser(userId) {
    try {
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({
          verification_status: 'verified',
          ban_reason: null,
          banned_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('❌ Erreur dé-bannissement:', error);
      return { success: false, error: error.message };
    }
  }

  // Mettre à jour le rôle avec propagation
  async updateUserRole(userId, newRole) {
    try {
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({
          role: newRole,
          user_type: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('❌ Erreur mise à jour rôle:', error);
      return { success: false, error: error.message };
    }
  }
}

// Instance singleton
const userStatusManager = new UserStatusManager();

export default userStatusManager;
