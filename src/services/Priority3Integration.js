/**
 * ðŸš€ INTÉGRATION SERVICES PRIORITÉ 3
 * Fichier d'intégration des nouveaux services
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

// Fonction d'initialisation des services Priorité 3
export async function initializePriority3Services(userId) {
  console.log('ðŸš€ Initialisation services Priorité 3...');
  
  try {
    // 1. Initialiser la synchronisation blockchain
    if (PRIORITY_3_CONFIG.services.blockchainSync.enabled) {
      await blockchainSyncService.startAutoSync();
      console.log('✅ Synchronisation blockchain initialisée');
    }
    
    // 2. Initialiser les notifications intelligentes
    if (PRIORITY_3_CONFIG.services.intelligentNotifications.enabled) {
      await intelligentNotifications.initialize(userId);
      console.log('✅ Notifications intelligentes initialisées');
    }
    
    // 3. Enregistrer le service worker
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service worker enregistré');
    }
    
    console.log('ðŸŽ‰ Tous les services Priorité 3 initialisés avec succès !');
    
    return {
      success: true,
      services: {
        blockchainSync: blockchainSyncService,
        notifications: intelligentNotifications
      }
    };
    
  } catch (error) {
    console.error('âŒ Erreur initialisation Priorité 3:', error);
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
