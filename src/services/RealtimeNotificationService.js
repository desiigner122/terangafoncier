/**
 * Service Realtime Notifications - Supabase
 * Gère les subscriptions Realtime pour les mises à jour en temps réel
 * Phase 4: Intégration notifications natives
 * @author Teranga Foncier Team
 */

import { supabase } from '@/lib/supabaseClient';
import { 
  sendNotification, 
  notifyStatusChange, 
  notifyNewMessage,
  notifyNotaryAssigned,
  notifyNotaryFeesSet,
  notifyNewAppointment,
  notifyCaseCompleted,
  getNotificationPermission 
} from '@/utils/nativeNotifications';

class RealtimeNotificationService {
  /**
   * Subscribe aux changements de purchase_cases pour un acheteur
   * @param {string} buyerId - ID de l'acheteur
   * @param {Function} onUpdate - Callback quand données changent
   * @returns {string} Channel name
   */
  static subscribeBuyerCases(buyerId, onUpdate) {
    const channel = supabase
      .channel(`buyer-cases-${buyerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'purchase_cases',
          filter: `buyer_id=eq.${buyerId}`
        },
        (payload) => {
          console.log('🔔 [REALTIME] Changement détecté pour acheteur:', payload);
          onUpdate(payload);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Realtime subscription activée pour acheteur ${buyerId}`);
        } else if (status === 'CLOSED') {
          console.warn(`⚠️ Realtime subscription fermée pour acheteur ${buyerId}`);
        }
      });

    return channel;
  }

  /**
   * Subscribe aux changements de purchase_cases pour un vendeur
   * @param {string} sellerId - ID du vendeur
   * @param {Function} onUpdate - Callback quand données changent
   * @returns {string} Channel name
   */
  static subscribeSellerCases(sellerId, onUpdate) {
    const channel = supabase
      .channel(`seller-cases-${sellerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'purchase_cases',
          filter: `seller_id=eq.${sellerId}`
        },
        (payload) => {
          console.log('🔔 [REALTIME] Changement détecté pour vendeur:', payload);
          onUpdate(payload);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Realtime subscription activée pour vendeur ${sellerId}`);
        }
      });

    return channel;
  }

  /**
   * Subscribe aux changements de purchase_cases pour un notaire
   * @param {string} notaireId - ID du notaire
   * @param {Function} onUpdate - Callback quand données changent
   * @returns {string} Channel name
   */
  static subscribeNotaireCases(notaireId, onUpdate) {
    const channel = supabase
      .channel(`notaire-cases-${notaireId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'purchase_cases',
          filter: `assigned_notary_id=eq.${notaireId}`
        },
        (payload) => {
          console.log('🔔 [REALTIME] Changement détecté pour notaire:', payload);
          onUpdate(payload);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Realtime subscription activée pour notaire ${notaireId}`);
        }
      });

    return channel;
  }

  /**
   * Subscribe aux changements de statut pour un dossier spécifique
   * @param {string} caseId - ID du dossier
   * @param {Function} onStatusChange - Callback quand statut change
   * @returns {string} Channel name
   */
  static subscribeCaseStatus(caseId, onStatusChange) {
    const channel = supabase
      .channel(`case-status-${caseId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'purchase_cases',
          filter: `id=eq.${caseId}`
        },
        (payload) => {
          const { new: newData, old: oldData } = payload;
          if (newData.status !== oldData?.status) {
            console.log(`📊 [REALTIME] Statut changé pour dossier ${caseId}: ${oldData?.status} → ${newData.status}`);
            onStatusChange({
              caseId,
              oldStatus: oldData?.status,
              newStatus: newData.status,
              progress: newData.progress_percentage,
              phase: newData.phase
            });
          }
        }
      )
      .subscribe();

    return channel;
  }

  /**
   * Subscribe aux nouveaux messages pour un utilisateur
   * @param {string} userId - ID de l'utilisateur (receiver)
   * @param {Function} onNewMessage - Callback quand nouveau message
   * @returns {string} Channel name
   */
  static subscribeMessages(userId, onNewMessage) {
    const channel = supabase
      .channel(`messages-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'purchase_case_messages',
          filter: `receiver_id=eq.${userId}`
        },
        (payload) => {
          console.log('💬 [REALTIME] Nouveau message reçu:', payload);
          onNewMessage(payload.new);
        }
      )
      .subscribe();

    return channel;
  }

  /**
   * Subscribe aux nouveaux documents pour un dossier
   * @param {string} caseId - ID du dossier
   * @param {Function} onNewDocument - Callback quand nouveau document
   * @returns {string} Channel name
   */
  static subscribeDocuments(caseId, onNewDocument) {
    const channel = supabase
      .channel(`documents-${caseId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'purchase_case_documents',
          filter: `case_id=eq.${caseId}`
        },
        (payload) => {
          console.log('📄 [REALTIME] Nouveau document:', payload);
          onNewDocument(payload.new);
        }
      )
      .subscribe();

    return channel;
  }

  /**
   * Subscribe aux changements de paiement pour un dossier
   * @param {string} caseId - ID du dossier
   * @param {Function} onPaymentChange - Callback quand paiement change
   * @returns {string} Channel name
   */
  static subscribePayments(caseId, onPaymentChange) {
    const channel = supabase
      .channel(`payments-${caseId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payments',
          filter: `case_id=eq.${caseId}`
        },
        (payload) => {
          console.log('💳 [REALTIME] Changement paiement:', payload);
          onPaymentChange(payload);
        }
      )
      .subscribe();

    return channel;
  }

  /**
   * Subscribe aux rendez-vous pour un dossier
   * @param {string} caseId - ID du dossier
   * @param {Function} onAppointmentChange - Callback quand RDV change
   * @returns {string} Channel name
   */
  static subscribeAppointments(caseId, onAppointmentChange) {
    const channel = supabase
      .channel(`appointments-${caseId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calendar_appointments',
          filter: `case_id=eq.${caseId}`
        },
        (payload) => {
          console.log('📅 [REALTIME] Changement rendez-vous:', payload);
          onAppointmentChange(payload);
        }
      )
      .subscribe();

    return channel;
  }

  /**
   * Unsubscribe d'un channel spécifique
   * @param {string} channelName - Nom du channel
   */
  static unsubscribeChannel(channelName) {
    supabase.removeChannel(supabase.getChannels().find(c => c.topic === channelName));
    console.log(`🔌 Déconnexion du channel: ${channelName}`);
  }

  /**
   * Unsubscribe de tous les channels
   */
  static unsubscribeAll() {
    supabase.removeAllChannels();
    console.log('🔌 Tous les channels ont été fermés');
  }

  /**
   * Setup complet pour une page de suivi d'acheteur
   * @param {string} userId - ID de l'acheteur
   * @param {Function} onUpdate - Callback pour mise à jour
   * @returns {Object} Channels setup
   */
  static setupBuyerTracking(userId, onUpdate) {
    const channels = {
      cases: this.subscribeBuyerCases(userId, onUpdate),
      messages: this.subscribeMessages(userId, onUpdate)
    };
    return channels;
  }

  /**
   * Setup complet pour une page de suivi de vendeur
   * @param {string} userId - ID du vendeur
   * @param {Function} onUpdate - Callback pour mise à jour
   * @returns {Object} Channels setup
   */
  static setupSellerTracking(userId, onUpdate) {
    const channels = {
      cases: this.subscribeSellerCases(userId, onUpdate),
      messages: this.subscribeMessages(userId, onUpdate)
    };
    return channels;
  }

  /**
   * Setup complet pour une page de notaire
   * @param {string} userId - ID du notaire
   * @param {Function} onUpdate - Callback pour mise à jour
   * @returns {Object} Channels setup
   */
  static setupNotaireTracking(userId, onUpdate) {
    const channels = {
      cases: this.subscribeNotaireCases(userId, onUpdate),
      messages: this.subscribeMessages(userId, onUpdate)
    };
    return channels;
  }

  /**
   * Setup détaillé pour un dossier spécifique
   * @param {string} caseId - ID du dossier
   * @param {Function} onUpdate - Callback pour mise à jour
   * @returns {Object} Channels setup
   */
  static setupCaseTracking(caseId, onUpdate) {
    const channels = {
      status: this.subscribeCaseStatus(caseId, onUpdate),
      messages: this.subscribeMessages(caseId, onUpdate),
      documents: this.subscribeDocuments(caseId, onUpdate),
      payments: this.subscribePayments(caseId, onUpdate),
      appointments: this.subscribeAppointments(caseId, onUpdate)
    };
    return channels;
  }

  /**
   * Phase 4: Envoie une notification native pour un événement
   * @param {string} eventType - Type d'événement ('status_change', 'new_message', etc.)
   * @param {Object} data - Données de l'événement
   */
  static async sendNativeNotification(eventType, data) {
    // Vérifier si permissions accordées
    const permission = getNotificationPermission();
    if (permission !== 'granted') {
      console.log('⏭️ Notifications natives non autorisées, skip');
      return;
    }

    try {
      switch (eventType) {
        case 'status_change':
          await notifyStatusChange(
            data.caseReference || `Dossier ${data.caseId?.slice(0, 8)}`,
            data.oldStatus,
            data.newStatus,
            data.caseId
          );
          break;

        case 'new_message':
          await notifyNewMessage(
            data.senderName || 'Quelqu\'un',
            data.messagePreview || 'Nouveau message',
            data.caseId
          );
          break;

        case 'notary_assigned':
          await notifyNotaryAssigned(
            data.notaryName || 'Un notaire',
            data.caseReference || `Dossier ${data.caseId?.slice(0, 8)}`,
            data.caseId
          );
          break;

        case 'notary_fees':
          await notifyNotaryFeesSet(
            data.amount || 0,
            data.caseReference || `Dossier ${data.caseId?.slice(0, 8)}`,
            data.caseId
          );
          break;

        case 'new_appointment':
          await notifyNewAppointment(
            data.appointmentDate || 'Bientôt',
            data.caseReference || `Dossier ${data.caseId?.slice(0, 8)}`,
            data.caseId
          );
          break;

        case 'case_completed':
          await notifyCaseCompleted(
            data.caseReference || `Dossier ${data.caseId?.slice(0, 8)}`,
            data.caseId
          );
          break;

        default:
          // Notification générique
          await sendNotification(data.title || '🔔 Mise à jour', {
            body: data.body || 'Une mise à jour est disponible',
            tag: `generic-${data.caseId || 'notification'}`,
            data: { type: eventType, ...data }
          });
      }

      console.log('✅ Notification native envoyée:', eventType, data);
    } catch (error) {
      console.error('❌ Erreur envoi notification native:', error);
    }
  }
}

export default RealtimeNotificationService;
