/**
 * Service de synchronisation real-time
 * Permet aux dashboards acheteur et vendeur de se synchroniser en temps réel
 * via les Supabase subscriptions
 * 
 * @author Teranga Foncier Team
 */

import { supabase } from '@/lib/supabaseClient';
import { logger } from '@/lib/logger';

export class RealtimeSyncService {
  static subscriptions = [];

  /**
   * Subscribe aux changements de purchase_cases pour une demande
   * Utile pour mettre à jour l'acheteur quand le vendeur accepte
   * 
   * @param {string} requestId - ID de la transaction/request
   * @param {function} callback - Fonction appelée quand il y a un changement
   * @returns {function} Fonction pour unsubscribe
   */
  static subscribeToPurchaseCaseUpdates(requestId, callback) {
    logger.debug(`🔄 [REALTIME] Subscribe aux purchase_case changes pour request: ${requestId}`);

    const subscription = supabase
      .from('purchase_cases')
      .on('*', (payload) => {
        logger.debug('📨 [REALTIME] Purchase case update:', payload);
        
        // Vérifier que c'est la bonne request
        if (payload.new?.request_id === requestId || payload.old?.request_id === requestId) {
          callback(payload);
        }
      })
      .subscribe();

    this.subscriptions.push(subscription);

    // Retourner une fonction pour unsubscribe
    return () => {
      logger.debug(`🔴 [REALTIME] Unsubscribe purchase_cases pour request: ${requestId}`);
      supabase.removeSubscription(subscription);
      this.subscriptions = this.subscriptions.filter(s => s !== subscription);
    };
  }

  /**
   * Subscribe aux changements de transactions
   * Utile pour les changements de status côté vendeur
   * 
   * @param {string[]} transactionIds - IDs des transactions à surveiller
   * @param {function} callback - Fonction appelée quand il y a un changement
   * @returns {function} Fonction pour unsubscribe
   */
  static subscribeToTransactionUpdates(transactionIds, callback) {
    logger.debug(`🔄 [REALTIME] Subscribe aux transaction changes:`, transactionIds);

    const subscription = supabase
      .from('transactions')
      .on('*', (payload) => {
        logger.debug('📨 [REALTIME] Transaction update:', payload);
        
        // Vérifier que c'est une des transactions suivies
        if (
          transactionIds.includes(payload.new?.id) ||
          transactionIds.includes(payload.old?.id)
        ) {
          callback(payload);
        }
      })
      .subscribe();

    this.subscriptions.push(subscription);

    return () => {
      logger.debug(`🔴 [REALTIME] Unsubscribe transactions`);
      supabase.removeSubscription(subscription);
      this.subscriptions = this.subscriptions.filter(s => s !== subscription);
    };
  }

  /**
   * Subscribe aux changements de notifications
   * Utile pour afficher les notifications en temps réel
   * 
   * @param {string} userId - ID de l'utilisateur
   * @param {function} callback - Fonction appelée quand il y a une nouvelle notif
   * @returns {function} Fonction pour unsubscribe
   */
  static subscribeToNotifications(userId, callback) {
    logger.debug(`🔄 [REALTIME] Subscribe aux notifications pour user: ${userId}`);

    const subscription = supabase
      .from(`notifications:user_id=eq.${userId}`)
      .on('INSERT', (payload) => {
        logger.debug('📨 [REALTIME] Nouvelle notification:', payload);
        callback(payload);
      })
      .subscribe();

    this.subscriptions.push(subscription);

    return () => {
      logger.debug(`🔴 [REALTIME] Unsubscribe notifications`);
      supabase.removeSubscription(subscription);
      this.subscriptions = this.subscriptions.filter(s => s !== subscription);
    };
  }

  /**
   * Subscribe aux changements de messages
   * Utile pour la messagerie en temps réel
   * 
   * @param {string} conversationId - ID de la conversation
   * @param {function} callback - Fonction appelée quand il y a un nouveau message
   * @returns {function} Fonction pour unsubscribe
   */
  static subscribeToMessages(conversationId, callback) {
    logger.debug(`🔄 [REALTIME] Subscribe aux messages pour conversation: ${conversationId}`);

    const subscription = supabase
      .from(`messages:conversation_id=eq.${conversationId}`)
      .on('INSERT', (payload) => {
        logger.debug('📨 [REALTIME] Nouveau message:', payload);
        callback(payload);
      })
      .subscribe();

    this.subscriptions.push(subscription);

    return () => {
      logger.debug(`🔴 [REALTIME] Unsubscribe messages`);
      supabase.removeSubscription(subscription);
      this.subscriptions = this.subscriptions.filter(s => s !== subscription);
    };
  }

  /**
   * Unsubscribe de tous les subscriptions
   * À appeler lors du unmount d'un composant
   */
  static unsubscribeAll() {
    logger.debug(`🔴 [REALTIME] Unsubscribing from all ${this.subscriptions.length} subscriptions`);
    this.subscriptions.forEach(sub => {
      try {
        supabase.removeSubscription(sub);
      } catch (error) {
        logger.warn('⚠️ Erreur unsubscribe:', error);
      }
    });
    this.subscriptions = [];
  }

  /**
   * Subscribe aux changements de statut de demandes pour un vendeur
   * Utile pour la page VendeurPurchaseRequests
   * 
   * @param {string[]} parcelIds - IDs des parcelles du vendeur
   * @param {function} callback - Fonction appelée quand il y a un changement
   * @returns {function} Fonction pour unsubscribe
   */
  static subscribeToVendorRequests(parcelIds, callback) {
    logger.debug(`🔄 [REALTIME] Subscribe aux demandes vendeur:`, parcelIds);

    try {
      const subscription = supabase
        .channel('vendor-requests')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transactions'
          },
          (payload) => {
            // Vérifier que c'est une des parcelles (si parcelIds fourni)
            if (parcelIds.length === 0 || 
                parcelIds.includes(payload.new?.parcel_id) || 
                parcelIds.includes(payload.old?.parcel_id)) {
              logger.debug('📨 [REALTIME] Vendor request update:', payload);
              callback(payload);
            }
          }
        )
        .subscribe();

      this.subscriptions.push(subscription);

      return async () => {
        try {
          logger.debug(`🔴 [REALTIME] Unsubscribe vendor requests`);
          await supabase.channel('vendor-requests').unsubscribe();
          this.subscriptions = this.subscriptions.filter(s => s !== subscription);
          logger.debug(`✅ [REALTIME] Vendor unsubscribe successful`);
        } catch (err) {
          logger.debug(`⚠️ [REALTIME] Vendor unsubscribe error (acceptable):`, err.message);
        }
      };
    } catch (error) {
      logger.error('❌ [REALTIME] Error subscribing to vendor requests:', error);
      return () => {};
    }
  }

  /**
   * Subscribe aux changements de demandes pour un acheteur
   * Utile pour la page ParticulierMesAchats
   * 
   * @param {string} buyerId - ID de l'acheteur
   * @param {function} callback - Fonction appelée quand il y a un changement
   * @returns {function} Fonction pour unsubscribe
   */
  static subscribeToBuyerRequests(buyerId, callback) {
    logger.debug(`� [REALTIME] Creating subscription for buyer: ${buyerId}`);

    try {
      const subscription = supabase
        .channel(`buyer-requests-${buyerId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'purchase_cases'
          },
          (payload) => {
            logger.debug('� [REALTIME] CALLBACK TRIGGERED!');
            logger.debug('   Event type:', payload.eventType);
            logger.debug('   New data:', payload.new);
            logger.debug('   Old data:', payload.old);
            logger.debug('   🔄 Calling callback to reload...');
            callback(payload);
          }
        )
        .subscribe((status) => {
          logger.debug(`🟢 [REALTIME] Subscription status: ${status}`);
        });

      this.subscriptions.push(subscription);
      logger.debug(`🟢 [REALTIME] Subscription established successfully`);

      return async () => {
        try {
          logger.debug(`🔴 [REALTIME] Unsubscribe buyer requests`);
          await supabase.channel(`buyer-requests-${buyerId}`).unsubscribe();
          this.subscriptions = this.subscriptions.filter(s => s !== subscription);
          logger.debug(`✅ [REALTIME] Unsubscribe successful`);
        } catch (err) {
          logger.debug(`⚠️ [REALTIME] Unsubscribe error (acceptable):`, err.message);
        }
      };
    } catch (error) {
      logger.error('🔴 [REALTIME] Error subscribing to buyer requests:', error);
      return () => {}; // Return empty cleanup function
    }
  }
}

export default RealtimeSyncService;
