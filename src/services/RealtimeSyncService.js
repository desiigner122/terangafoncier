/**
 * Service de synchronisation real-time
 * Permet aux dashboards acheteur et vendeur de se synchroniser en temps réel
 * via les Supabase subscriptions
 * 
 * @author Teranga Foncier Team
 */

import { supabase } from '@/lib/supabaseClient';

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
    console.log(`🔄 [REALTIME] Subscribe aux purchase_case changes pour request: ${requestId}`);

    const subscription = supabase
      .from('purchase_cases')
      .on('*', (payload) => {
        console.log('📨 [REALTIME] Purchase case update:', payload);
        
        // Vérifier que c'est la bonne request
        if (payload.new?.request_id === requestId || payload.old?.request_id === requestId) {
          callback(payload);
        }
      })
      .subscribe();

    this.subscriptions.push(subscription);

    // Retourner une fonction pour unsubscribe
    return () => {
      console.log(`🔴 [REALTIME] Unsubscribe purchase_cases pour request: ${requestId}`);
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
    console.log(`🔄 [REALTIME] Subscribe aux transaction changes:`, transactionIds);

    const subscription = supabase
      .from('transactions')
      .on('*', (payload) => {
        console.log('📨 [REALTIME] Transaction update:', payload);
        
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
      console.log(`🔴 [REALTIME] Unsubscribe transactions`);
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
    console.log(`🔄 [REALTIME] Subscribe aux notifications pour user: ${userId}`);

    const subscription = supabase
      .from(`notifications:user_id=eq.${userId}`)
      .on('INSERT', (payload) => {
        console.log('📨 [REALTIME] Nouvelle notification:', payload);
        callback(payload);
      })
      .subscribe();

    this.subscriptions.push(subscription);

    return () => {
      console.log(`🔴 [REALTIME] Unsubscribe notifications`);
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
    console.log(`🔄 [REALTIME] Subscribe aux messages pour conversation: ${conversationId}`);

    const subscription = supabase
      .from(`messages:conversation_id=eq.${conversationId}`)
      .on('INSERT', (payload) => {
        console.log('📨 [REALTIME] Nouveau message:', payload);
        callback(payload);
      })
      .subscribe();

    this.subscriptions.push(subscription);

    return () => {
      console.log(`🔴 [REALTIME] Unsubscribe messages`);
      supabase.removeSubscription(subscription);
      this.subscriptions = this.subscriptions.filter(s => s !== subscription);
    };
  }

  /**
   * Unsubscribe de tous les subscriptions
   * À appeler lors du unmount d'un composant
   */
  static unsubscribeAll() {
    console.log(`🔴 [REALTIME] Unsubscribing from all ${this.subscriptions.length} subscriptions`);
    this.subscriptions.forEach(sub => {
      try {
        supabase.removeSubscription(sub);
      } catch (error) {
        console.warn('⚠️ Erreur unsubscribe:', error);
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
    console.log(`🔄 [REALTIME] Subscribe aux demandes vendeur:`, parcelIds);

    const subscription = supabase
      .from('transactions')
      .on('*', (payload) => {
        // Vérifier que c'est une des parcelles
        if (parcelIds.includes(payload.new?.parcel_id) || parcelIds.includes(payload.old?.parcel_id)) {
          console.log('📨 [REALTIME] Vendor request update:', payload);
          callback(payload);
        }
      })
      .subscribe();

    this.subscriptions.push(subscription);

    return () => {
      console.log(`🔴 [REALTIME] Unsubscribe vendor requests`);
      supabase.removeSubscription(subscription);
      this.subscriptions = this.subscriptions.filter(s => s !== subscription);
    };
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
    console.log(`🔄 [REALTIME] Subscribe aux demandes acheteur: ${buyerId}`);

    const subscription = supabase
      .from(`purchase_cases:buyer_id=eq.${buyerId}`)
      .on('*', (payload) => {
        console.log('📨 [REALTIME] Buyer request update:', payload);
        callback(payload);
      })
      .subscribe();

    this.subscriptions.push(subscription);

    return () => {
      console.log(`🔴 [REALTIME] Unsubscribe buyer requests`);
      supabase.removeSubscription(subscription);
      this.subscriptions = this.subscriptions.filter(s => s !== subscription);
    };
  }
}

export default RealtimeSyncService;
