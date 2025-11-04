/**
 * Native Notifications - Phase 4
 * Gère les notifications natives du navigateur/système
 * @author Teranga Foncier Team
 */

/**
 * Vérifie si les notifications sont supportées
 * @returns {boolean}
 */
export const isNotificationSupported = () => {
  return 'Notification' in window;
};

/**
 * Obtient le statut actuel de permission
 * @returns {'granted' | 'denied' | 'default'}
 */
export const getNotificationPermission = () => {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
};

/**
 * Demande la permission pour les notifications
 * @returns {Promise<'granted' | 'denied' | 'default'>}
 */
export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    console.warn('⚠️ Notifications non supportées par ce navigateur');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('🔔 Permission notifications:', permission);
    return permission;
  } catch (error) {
    console.error('❌ Erreur demande permission notifications:', error);
    return 'denied';
  }
};

/**
 * Configuration par défaut des notifications
 */
const DEFAULT_NOTIFICATION_CONFIG = {
  icon: '/icon-192x192.png', // PWA icon
  badge: '/icon-96x96.png',
  vibrate: [200, 100, 200], // Vibration pattern: vibrate 200ms, pause 100ms, vibrate 200ms
  requireInteraction: false, // Auto-close après quelques secondes
  silent: false, // Jouer le son
  tag: 'teranga-foncier', // Tag pour grouper les notifications
  renotify: true, // Notifier même si tag existe déjà
};

/**
 * Envoie une notification native
 * @param {string} title - Titre de la notification
 * @param {Object} options - Options de notification
 * @param {string} options.body - Corps du message
 * @param {string} options.icon - URL de l'icône
 * @param {string} options.tag - Tag pour grouper/remplacer notifications
 * @param {boolean} options.requireInteraction - Nécessite interaction utilisateur
 * @param {number[]} options.vibrate - Pattern de vibration
 * @param {Object} options.data - Données custom (ex: caseId, url)
 * @returns {Promise<Notification|null>}
 */
export const sendNotification = async (title, options = {}) => {
  // Vérifier support
  if (!isNotificationSupported()) {
    console.warn('⚠️ Notifications non supportées');
    return null;
  }

  // Vérifier permission
  const permission = getNotificationPermission();
  if (permission !== 'granted') {
    console.warn('⚠️ Permission notifications non accordée:', permission);
    return null;
  }

  // Fusionner config par défaut
  const notificationOptions = {
    ...DEFAULT_NOTIFICATION_CONFIG,
    ...options,
  };

  try {
    // Créer notification
    const notification = new Notification(title, notificationOptions);

    // Event: Click sur notification
    notification.onclick = (event) => {
      event.preventDefault();
      
      // Naviguer vers URL si fournie
      if (options.data?.url) {
        window.focus();
        window.location.href = options.data.url;
      } else {
        window.focus();
      }
      
      notification.close();
      console.log('🖱️ Notification cliquée:', title);
    };

    // Event: Notification fermée
    notification.onclose = () => {
      console.log('❌ Notification fermée:', title);
    };

    // Event: Erreur
    notification.onerror = (error) => {
      console.error('❌ Erreur notification:', error);
    };

    console.log('🔔 Notification envoyée:', title, notificationOptions);
    return notification;

  } catch (error) {
    console.error('❌ Erreur création notification:', error);
    return null;
  }
};

/**
 * Notifications prédéfinies pour événements courants
 */

/**
 * Notification: Nouveau message reçu
 */
export const notifyNewMessage = async (senderName, messagePreview, caseId) => {
  return sendNotification('💬 Nouveau message', {
    body: `${senderName}: ${messagePreview.substring(0, 100)}`,
    tag: `message-${caseId}`,
    data: {
      type: 'new_message',
      caseId,
      url: `/dashboard/particulier/case/${caseId}#messages`,
    },
  });
};

/**
 * Notification: Changement de statut du dossier
 */
export const notifyStatusChange = async (caseReference, oldStatus, newStatus, caseId) => {
  return sendNotification('📋 Mise à jour du dossier', {
    body: `Dossier ${caseReference}: ${newStatus}`,
    tag: `status-${caseId}`,
    data: {
      type: 'status_change',
      caseId,
      oldStatus,
      newStatus,
      url: `/dashboard/particulier/case/${caseId}`,
    },
  });
};

/**
 * Notification: Notaire assigné
 */
export const notifyNotaryAssigned = async (notaryName, caseReference, caseId) => {
  return sendNotification('⚖️ Notaire assigné', {
    body: `${notaryName} a été assigné à votre dossier ${caseReference}`,
    tag: `notary-${caseId}`,
    requireInteraction: true, // Important - nécessite clic
    data: {
      type: 'notary_assigned',
      caseId,
      url: `/dashboard/particulier/case/${caseId}`,
    },
  });
};

/**
 * Notification: Frais notaire définis
 */
export const notifyNotaryFeesSet = async (amount, caseReference, caseId) => {
  return sendNotification('💰 Frais notaire définis', {
    body: `Le notaire a défini les frais: ${amount.toLocaleString()} FCFA pour ${caseReference}`,
    tag: `fees-${caseId}`,
    requireInteraction: true,
    data: {
      type: 'notary_fees',
      caseId,
      amount,
      url: `/dashboard/particulier/case/${caseId}`,
    },
  });
};

/**
 * Notification: Nouveau rendez-vous
 */
export const notifyNewAppointment = async (appointmentDate, caseReference, caseId) => {
  return sendNotification('📅 Nouveau rendez-vous', {
    body: `Rendez-vous prévu le ${appointmentDate} pour ${caseReference}`,
    tag: `appointment-${caseId}`,
    requireInteraction: true,
    data: {
      type: 'appointment',
      caseId,
      url: `/dashboard/particulier/case/${caseId}#appointments`,
    },
  });
};

/**
 * Notification: Paiement requis
 */
export const notifyPaymentRequired = async (amount, paymentType, caseReference, caseId) => {
  return sendNotification('💳 Paiement requis', {
    body: `${paymentType}: ${amount.toLocaleString()} FCFA pour ${caseReference}`,
    tag: `payment-${caseId}`,
    requireInteraction: true,
    vibrate: [300, 100, 300, 100, 300], // Pattern plus long pour paiement
    data: {
      type: 'payment_required',
      caseId,
      amount,
      paymentType,
      url: `/dashboard/particulier/case/${caseId}`,
    },
  });
};

/**
 * Notification: Document requis
 */
export const notifyDocumentRequired = async (documentType, caseReference, caseId) => {
  return sendNotification('📄 Document requis', {
    body: `Veuillez fournir: ${documentType} pour ${caseReference}`,
    tag: `document-${caseId}`,
    data: {
      type: 'document_required',
      caseId,
      documentType,
      url: `/dashboard/particulier/case/${caseId}#documents`,
    },
  });
};

/**
 * Notification: Dossier complété
 */
export const notifyCaseCompleted = async (caseReference, caseId) => {
  return sendNotification('🎉 Dossier finalisé !', {
    body: `Félicitations ! Votre dossier ${caseReference} est maintenant complété.`,
    tag: `completed-${caseId}`,
    requireInteraction: true,
    vibrate: [200, 100, 200, 100, 200, 100, 500], // Pattern festif
    data: {
      type: 'case_completed',
      caseId,
      url: `/dashboard/particulier/case/${caseId}`,
    },
  });
};

/**
 * Ferme toutes les notifications avec un tag spécifique
 */
export const closeNotificationsByTag = (tag) => {
  // Note: Les notifications natives ne peuvent être fermées programmatiquement
  // Cette fonction est un placeholder pour future amélioration
  console.log('🔕 Close notifications with tag:', tag);
};

/**
 * Test de notification (pour debugging)
 */
export const testNotification = async () => {
  const permission = await requestNotificationPermission();
  
  if (permission === 'granted') {
    return sendNotification('🧪 Test Notification', {
      body: 'Les notifications fonctionnent correctement !',
      tag: 'test',
      requireInteraction: false,
    });
  }
  
  return null;
};
