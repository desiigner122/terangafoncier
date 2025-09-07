// Système de gestion en temps réel des changements d'utilisateur - Version Mock
// Mode test uniquement - Supabase désactivé

class UserStatusManager {
  constructor() {
    this.subscribers = new Set();
    this.isListening = false;
    console.log('UserStatusManager: Mode test - Supabase désactivé');
  }

  // Démarrer l'écoute des changements en temps réel (Mock)
  startListening() {
    if (this.isListening) return;
    
    // Mock subscription - pas de vraie connexion Supabase
    this.subscription = {
      unsubscribe: () => {
        console.log('UserStatusManager: Mock unsubscribe');
      }
    };
    
    this.isListening = true;
    console.log('UserStatusManager: Mock listening started');
  }

  // Arrêter l'écoute (Mock)
  stopListening() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.isListening = false;
      console.log('UserStatusManager: Mock listening stopped');
    }
  }

  // S'abonner aux changements (Mock)
  subscribe(callback) {
    this.subscribers.add(callback);
    
    // Auto-démarrer l'écoute mock
    if (!this.isListening) {
      this.startListening();
    }

    console.log('UserStatusManager: Mock subscription added');
    return () => {
      this.subscribers.delete(callback);
      console.log('UserStatusManager: Mock subscription removed');
    };
  }

  // Se désabonner (Mock)
  unsubscribe(callback) {
    this.subscribers.delete(callback);
    console.log('UserStatusManager: Mock subscription removed');
  }

  // Notifier tous les abonnés (Mock)
  notifySubscribers(event) {
    console.log('UserStatusManager: Mock notification:', event);
    this.subscribers.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('UserStatusManager: Error in subscriber callback:', error);
      }
    });
  }

  // Vérifier la session utilisateur (Mock)
  async checkUserSession(userId) {
    console.log('UserStatusManager: Mock checkUserSession for:', userId);
    return {
      id: userId,
      verification_status: 'verified',
      role: 'particulier',
      email: 'test@example.com',
      full_name: 'Test User'
    };
  }

  // Mock invalidation de session
  async invalidateBannedUserSession(userId) {
    console.log('UserStatusManager: Mock invalidateBannedUserSession for:', userId);
    
    this.notifySubscribers({
      type: 'USER_SESSION_INVALIDATED',
      userId,
      reason: 'banned',
      timestamp: new Date().toISOString()
    });
  }

  // Mock bannissement
  async banUser(userId, reason = 'Violation des conditions d\'utilisation') {
    console.log('UserStatusManager: Mock banUser for:', userId, 'reason:', reason);
    
    this.notifySubscribers({
      type: 'USER_STATUS_CHANGED',
      user: { id: userId, verification_status: 'banned' },
      timestamp: new Date().toISOString()
    });
  }

  // Mock débannissement
  async unbanUser(userId) {
    console.log('UserStatusManager: Mock unbanUser for:', userId);
    
    this.notifySubscribers({
      type: 'USER_STATUS_CHANGED',
      user: { id: userId, verification_status: 'verified' },
      timestamp: new Date().toISOString()
    });
  }

  // Mock vérification d'utilisateur
  async verifyUser(userId) {
    console.log('UserStatusManager: Mock verifyUser for:', userId);
    
    this.notifySubscribers({
      type: 'USER_STATUS_CHANGED',
      user: { id: userId, verification_status: 'verified' },
      timestamp: new Date().toISOString()
    });
  }

  // Mock rejet d'utilisateur
  async rejectUser(userId, reason = 'Documents insuffisants') {
    console.log('UserStatusManager: Mock rejectUser for:', userId, 'reason:', reason);
    
    this.notifySubscribers({
      type: 'USER_STATUS_CHANGED',
      user: { id: userId, verification_status: 'rejected' },
      timestamp: new Date().toISOString()
    });
  }

  // Mock changement de rôle
  async changeUserRole(userId, newRole) {
    console.log('UserStatusManager: Mock changeUserRole for:', userId, 'newRole:', newRole);
    
    this.notifySubscribers({
      type: 'USER_ROLE_CHANGED',
      user: { id: userId, role: newRole },
      timestamp: new Date().toISOString()
    });
  }

  // Mock surveillance de bannissement
  async monitorBannedUsers() {
    console.log('UserStatusManager: Mock monitorBannedUsers');
    return [];
  }

  // Mock initialisation du manager
  async initializeManager() {
    console.log('UserStatusManager: Mock initialization completed');
    return true;
  }

  // Mock nettoyage
  cleanup() {
    this.stopListening();
    this.subscribers.clear();
    console.log('UserStatusManager: Mock cleanup completed');
  }
}

// Instance singleton
const userStatusManager = new UserStatusManager();

// Auto-initialisation mock
userStatusManager.initializeManager().then(() => {
  console.log('✅ UserStatusManager mock initialized');
}).catch(error => {
  console.error('❌ UserStatusManager mock initialization failed:', error);
});

export default userStatusManager;