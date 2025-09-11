/**
 * ðŸš€ INTÃ‰GRATION SERVICES PRIORITÃ‰ 3
 * Fichier d'intÃ©gration des nouveaux services
 */

import { blockchainSyncService } from './services/TerangaBlockchainSyncService.js';
import { intelligentNotifications } from './services/TerangaIntelligentNotifications.js';
import UnifiedDashboard from './components/dashboards/UnifiedDashboard.jsx';

// Configuration globale des services
export const PRIORITY_3_CONFIG = {
  version: '1.0.0',
  services: {
    blockchainSync: {
      enabled: true,
      autoStart: true,
      syncInterval: 30000
    },
    intelligentNotifications: {
      enabled: true,
      pushNotifications: true,
      emailNotifications: true
    },
    unifiedDashboard: {
      enabled: true,
      realtimeUpdates: true,
      refreshInterval: 30000
    }
  }
};

// Fonction d'initialisation des services PrioritÃ© 3
export async function initializePriority3Services(userId) {
  console.log('ðŸš€ Initialisation services PrioritÃ© 3...');
  
  try {
    // 1. Initialiser la synchronisation blockchain
    if (PRIORITY_3_CONFIG.services.blockchainSync.enabled) {
      await blockchainSyncService.startAutoSync();
      console.log('âœ… Synchronisation blockchain initialisÃ©e');
    }
    
    // 2. Initialiser les notifications intelligentes
    if (PRIORITY_3_CONFIG.services.intelligentNotifications.enabled) {
      await intelligentNotifications.initialize(userId);
      console.log('âœ… Notifications intelligentes initialisÃ©es');
    }
    
    // 3. Enregistrer le service worker
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('âœ… Service worker enregistrÃ©');
    }
    
    console.log('ðŸŽ‰ Tous les services PrioritÃ© 3 initialisÃ©s avec succÃ¨s !');
    
    return {
      success: true,
      services: {
        blockchainSync: blockchainSyncService,
        notifications: intelligentNotifications
      }
    };
    
  } catch (error) {
    console.error('âŒ Erreur initialisation PrioritÃ© 3:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Export des composants
export {
  blockchainSyncService,
  intelligentNotifications,
  UnifiedDashboard
};
