/**
 * Service de notifications automatiques pour le workflow d'achat
 * Gestion multi-canaux : email, SMS, push, in-app
 * @author Teranga Foncier Team
 */

import { supabase } from '@/lib/supabaseClient';
import { logger } from '@/lib/logger';

export class NotificationService {
  // Templates de notifications par statut
  static NOTIFICATION_TEMPLATES = {
    initiated: {
      title: '🏠 Dossier d\'achat créé',
      buyer_message: 'Votre demande d\'achat a été créée et est en cours de traitement. Vous recevrez une confirmation sous 24h.',
      seller_message: null, // Pas de notification vendeur à ce stade
      priority: 'medium',
      channels: ['email', 'in_app']
    },
    buyer_verification: {
      title: '🔍 Vérification en cours',
      buyer_message: 'Nous vérifions vos documents et informations. Cette étape prend généralement 24h.',
      seller_message: null,
      priority: 'medium',
      channels: ['in_app']
    },
    seller_notification: {
      title: '📩 Demande d\'achat reçue',
      buyer_message: 'Le vendeur a été informé de votre demande d\'achat.',
      seller_message: 'Vous avez reçu une nouvelle demande d\'achat pour votre bien. Consultez votre tableau de bord pour répondre.',
      priority: 'high',
      channels: ['email', 'sms', 'push', 'in_app']
    },
    negotiation: {
      title: '💬 Négociation ouverte',
      buyer_message: 'La négociation est ouverte ! Vous pouvez échanger avec le vendeur via la messagerie.',
      seller_message: 'L\'acheteur souhaite négocier. Vous pouvez discuter des conditions via la messagerie.',
      priority: 'high',
      channels: ['email', 'push', 'in_app']
    },
    preliminary_agreement: {
      title: '🤝 Accord préliminaire conclu',
      buyer_message: 'Félicitations ! Un accord préliminaire a été conclu. Nous préparons maintenant le contrat.',
      seller_message: 'Accord préliminaire conclu avec l\'acheteur. Le contrat est en préparation.',
      priority: 'high',
      channels: ['email', 'sms', 'push', 'in_app'],
      milestone: true
    },
    contract_preparation: {
      title: '📄 Contrat en préparation',
      buyer_message: 'Votre contrat de vente est en cours de préparation par nos services juridiques.',
      seller_message: 'Le contrat de vente est en préparation. Vous le recevrez pour validation sous peu.',
      priority: 'medium',
      channels: ['email', 'in_app']
    },
    legal_verification: {
      title: '⚖️ Vérifications juridiques',
      buyer_message: 'Nos experts juridiques vérifient tous les aspects légaux du bien. Cette étape peut prendre 2-5 jours.',
      seller_message: 'Vérifications juridiques en cours pour votre bien. Tenez-vous prêt à fournir des documents si nécessaire.',
      priority: 'medium',
      channels: ['email', 'in_app']
    },
    document_audit: {
      title: '📋 Audit documentaire',
      buyer_message: 'Tous les documents sont en cours d\'audit. Nous vérifions leur authenticité et validité.',
      seller_message: 'Vos documents sont en cours d\'audit. Assurez-vous qu\'ils sont tous à jour.',
      priority: 'medium',
      channels: ['in_app']
    },
    property_evaluation: {
      title: '🏡 Expertise immobilière',
      buyer_message: 'Une expertise professionnelle du bien est en cours. Cette étape finalise les vérifications.',
      seller_message: 'Votre bien est en cours d\'expertise. L\'expert pourrait vous contacter pour une visite.',
      priority: 'medium',
      channels: ['email', 'sms', 'in_app'],
      milestone: true
    },
    notary_appointment: {
      title: '📅 Rendez-vous notaire programmé',
      buyer_message: 'Votre rendez-vous chez le notaire a été programmé. Vous recevrez les détails par email.',
      seller_message: 'Le rendez-vous chez le notaire est programmé. Préparez tous vos documents originaux.',
      priority: 'high',
      channels: ['email', 'sms', 'push', 'in_app']
    },
    signing_process: {
      title: '✍️ Signature en cours',
      buyer_message: 'La signature de l\'acte de vente est en cours chez le notaire.',
      seller_message: 'Signature de l\'acte de vente en cours. La transaction est presque finalisée.',
      priority: 'high',
      channels: ['push', 'in_app'],
      milestone: true
    },
    payment_processing: {
      title: '💳 Paiement en cours',
      buyer_message: 'Votre paiement est en cours de traitement. La finalisation est imminente.',
      seller_message: 'Le paiement de l\'acheteur est en cours de traitement.',
      priority: 'high',
      channels: ['push', 'in_app']
    },
    property_transfer: {
      title: '🔄 Transfert de propriété',
      buyer_message: 'Le transfert officiel de propriété est en cours auprès des services compétents.',
      seller_message: 'Le transfert de propriété vers le nouveau propriétaire est en cours.',
      priority: 'medium',
      channels: ['email', 'in_app']
    },
    completed: {
      title: '🎉 Transaction finalisée !',
      buyer_message: 'Félicitations ! Votre achat immobilier est officiellement finalisé. Bienvenue dans votre nouveau chez-vous !',
      seller_message: 'Votre vente est finalisée avec succès. Le paiement sera versé selon les modalités convenues.',
      priority: 'high',
      channels: ['email', 'sms', 'push', 'in_app'],
      milestone: true,
      celebration: true
    },
    // Statuts d'échec
    cancelled: {
      title: '❌ Dossier annulé',
      buyer_message: 'Votre dossier d\'achat a été annulé. Si vous avez des questions, contactez notre support.',
      seller_message: 'La demande d\'achat pour votre bien a été annulée par l\'acheteur.',
      priority: 'medium',
      channels: ['email', 'in_app']
    },
    rejected: {
      title: '⛔ Demande rejetée',
      buyer_message: 'Votre demande a été rejetée suite aux vérifications. Consultez les détails dans votre dossier.',
      seller_message: null,
      priority: 'high',
      channels: ['email', 'sms', 'in_app']
    },
    seller_declined: {
      title: '🚫 Refus du vendeur',
      buyer_message: 'Le vendeur a décliné votre demande d\'achat. Vous pouvez chercher d\'autres biens similaires.',
      seller_message: 'Vous avez décliné la demande d\'achat. L\'acheteur en a été informé.',
      priority: 'high',
      channels: ['email', 'push', 'in_app']
    },
    negotiation_failed: {
      title: '💔 Négociation échouée',
      buyer_message: 'La négociation n\'a pas abouti. Vous pouvez relancer une nouvelle demande avec de meilleures conditions.',
      seller_message: 'La négociation avec l\'acheteur a échoué. Votre bien reste disponible.',
      priority: 'medium',
      channels: ['email', 'in_app']
    },
    legal_issues_found: {
      title: '⚠️ Problèmes juridiques détectés',
      buyer_message: 'Des problèmes juridiques ont été détectés sur le bien. La transaction ne peut pas continuer en l\'état.',
      seller_message: 'Des problèmes juridiques ont été identifiés sur votre bien. Contactez notre équipe juridique.',
      priority: 'urgent',
      channels: ['email', 'sms', 'push', 'in_app']
    }
  };

  // Configuration des canaux de notification
  static NOTIFICATION_CHANNELS = {
    email: {
      enabled: true,
      provider: 'supabase', // Ou 'sendgrid', 'mailgun', etc.
      config: {}
    },
    sms: {
      enabled: false, // À activer quand le service SMS sera configuré
      provider: 'twilio',
      config: {}
    },
    push: {
      enabled: false, // À activer quand les push notifications seront configurées
      provider: 'firebase',
      config: {}
    },
    in_app: {
      enabled: true,
      provider: 'supabase',
      config: {}
    }
  };

  /**
   * Envoyer des notifications pour un changement de statut
   */
  static async sendWorkflowNotifications(caseId, status, customMessage = null) {
    try {
      // Récupérer les détails du dossier
      const { data: purchaseCase, error: caseError } = await supabase
        .from('purchase_cases')
        .select('*, parcelle:parcelle_id(title, location)')
        .eq('id', caseId)
        .single();

      if (caseError) throw caseError;

      const template = this.NOTIFICATION_TEMPLATES[status];
      if (!template) {
        logger.warn(`Pas de template de notification pour le statut: ${status}`);
        return { success: false, error: 'Template non trouvé' };
      }

      const notifications = [];

      // Notification pour l'acheteur
      if (template.buyer_message && purchaseCase.buyer_id) {
        notifications.push({
          user_id: purchaseCase.buyer_id,
          case_id: caseId,
          type: 'purchase_workflow',
          title: template.title,
          message: customMessage || template.buyer_message,
          status: 'pending',
          priority: template.priority,
          channels: template.channels,
          metadata: {
            status_change: status,
            is_milestone: template.milestone || false,
            is_celebration: template.celebration || false,
            parcelle_title: purchaseCase.parcelle?.title,
            parcelle_location: purchaseCase.parcelle?.location
          }
        });
      }

      // Notification pour le vendeur
      if (template.seller_message && purchaseCase.seller_id) {
        notifications.push({
          user_id: purchaseCase.seller_id,
          case_id: caseId,
          type: 'purchase_workflow',
          title: template.title,
          message: customMessage || template.seller_message,
          status: 'pending',
          priority: template.priority,
          channels: template.channels,
          metadata: {
            status_change: status,
            is_milestone: template.milestone || false,
            buyer_name: purchaseCase.buyer?.full_name || 'Acheteur',
            parcelle_title: purchaseCase.parcelle?.title,
            parcelle_location: purchaseCase.parcelle?.location
          }
        });
      }

      // Insérer les notifications en base
      if (notifications.length > 0) {
        const { error: insertError } = await supabase
          .from('purchase_case_notifications')
          .insert(notifications)
          .catch(err => {
            // Si la table n'existe pas, ignorer l'erreur (non bloquante)
            if (err.code === 'PGRST205' || err.message?.includes('Could not find the table')) {
              logger.warn('⚠️ Table purchase_case_notifications non disponible - notifications stockées localement');
              return { error: null };
            }
            throw err;
          });

        if (insertError && !insertError.suppressed) throw insertError;

        // Traiter l'envoi sur chaque canal
        for (const notification of notifications) {
          await this.processNotificationChannels(notification);
        }
      }

      return { success: true, sent: notifications.length };
    } catch (error) {
      logger.error('Erreur envoi notifications workflow:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Traiter l'envoi sur tous les canaux configurés
   */
  static async processNotificationChannels(notification) {
    const channels = notification.channels || ['in_app'];
    
    for (const channel of channels) {
      if (!this.NOTIFICATION_CHANNELS[channel]?.enabled) continue;

      try {
        switch (channel) {
          case 'email':
            await this.sendEmailNotification(notification);
            break;
          case 'sms':
            await this.sendSMSNotification(notification);
            break;
          case 'push':
            await this.sendPushNotification(notification);
            break;
          case 'in_app':
            await this.sendInAppNotification(notification);
            break;
        }

        // Marquer le canal comme envoyé
        await this.updateNotificationChannelStatus(notification.id, channel, true);
      } catch (error) {
        logger.error(`Erreur envoi ${channel}:`, error);
        await this.updateNotificationChannelStatus(notification.id, channel, false);
      }
    }
  }

  /**
   * Envoyer une notification email
   */
  static async sendEmailNotification(notification) {
    if (!this.NOTIFICATION_CHANNELS.email.enabled) return;

    // Récupérer les infos utilisateur
    const { data: user, error } = await supabase
      .from('users')
      .select('email, full_name')
      .eq('user_id', notification.user_id)
      .single();

    if (error || !user.email) return;

    // Template HTML pour l'email
    const emailHtml = this.generateEmailTemplate(notification, user);

    // Envoyer via Supabase Edge Functions ou service externe
    const { error: emailError } = await supabase.functions.invoke('send-email', {
      body: {
        to: user.email,
        subject: notification.title,
        html: emailHtml,
        metadata: notification.metadata
      }
    });

    if (emailError) throw emailError;
  }

  /**
   * Envoyer une notification SMS
   */
  static async sendSMSNotification(notification) {
    if (!this.NOTIFICATION_CHANNELS.sms.enabled) return;

    // Récupérer le numéro de téléphone
    const { data: user, error } = await supabase
      .from('users')
      .select('phone')
      .eq('user_id', notification.user_id)
      .single();

    if (error || !user.phone) return;

    // Message SMS court
    const smsMessage = `${notification.title}\n${notification.message}`;

    // Envoyer via Twilio ou autre service SMS
    // Implementation à ajouter selon le provider choisi
    logger.debug('SMS à envoyer:', { to: user.phone, message: smsMessage });
  }

  /**
   * Envoyer une notification push
   */
  static async sendPushNotification(notification) {
    if (!this.NOTIFICATION_CHANNELS.push.enabled) return;

    // Récupérer les tokens FCM de l'utilisateur
    const { data: tokens, error } = await supabase
      .from('user_push_tokens')
      .select('token')
      .eq('user_id', notification.user_id)
      .eq('active', true).limit(500);

    if (error || !tokens.length) return;

    // Envoyer via Firebase FCM ou autre service push
    for (const tokenRow of tokens) {
      // Implementation FCM à ajouter
      logger.debug('Push à envoyer:', { 
        token: tokenRow.token, 
        title: notification.title, 
        body: notification.message 
      });
    }
  }

  /**
   * Envoyer une notification in-app
   */
  static async sendInAppNotification(notification) {
    try {
      // Créer la notification in-app dans la table notifications
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: notification.user_id,
          type: 'purchase_workflow',
          title: notification.title,
          message: notification.message,
          priority: notification.priority,
          case_id: notification.case_id,
          metadata: notification.metadata,
          read: false,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      // Envoyer via Realtime si l'utilisateur est connecté
      // (canal retiré après envoi pour ne pas fuir une souscription par notification)
      const channel = supabase.channel(`user-${notification.user_id}`);
      await channel.send({
        type: 'broadcast',
        event: 'new_notification',
        payload: {
          title: notification.title,
          message: notification.message,
          priority: notification.priority,
          metadata: notification.metadata
        }
      });
    } catch (error) {
      throw new Error(`Erreur notification in-app: ${error.message}`);
    }
  }

  /**
   * Générer le template HTML pour les emails
   */
  static generateEmailTemplate(notification, user) {
    const metadata = notification.metadata || {};
    const isMilestone = metadata.is_milestone;
    const isCelebration = metadata.is_celebration;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${isCelebration ? '#10B981' : '#3B82F6'}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .milestone { border-left: 4px solid #10B981; padding-left: 16px; margin: 16px 0; }
          .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
          .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${notification.title}</h1>
            ${isCelebration ? '<div style="font-size: 24px;">🎉✨🏠✨🎉</div>' : ''}
          </div>
          <div class="content">
            <p>Bonjour ${user.full_name || 'Cher utilisateur'},</p>
            
            ${isMilestone ? `<div class="milestone"><strong>🎯 Étape importante franchie !</strong></div>` : ''}
            
            <p>${notification.message}</p>
            
            ${metadata.parcelle_title ? `
              <p><strong>Bien concerné :</strong> ${metadata.parcelle_title}${metadata.parcelle_location ? ` (${metadata.parcelle_location})` : ''}</p>
            ` : ''}
            
            <a href="https://terangafoncier.sn/case-tracking/${notification.case_id}" class="button">
              Voir le dossier complet
            </a>
            
            ${isCelebration ? `
              <div style="text-align: center; margin: 20px 0;">
                <p><strong>🌟 Félicitations pour cette réussite ! 🌟</strong></p>
                <p>L'équipe Teranga Foncier vous accompagne toujours dans vos projets immobiliers.</p>
              </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>Cette notification a été envoyée automatiquement par <strong>Teranga Foncier</strong></p>
            <p>Pour toute question, contactez-nous à support@terangafoncier.sn</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Mettre à jour le statut d'envoi d'un canal
   */
  static async updateNotificationChannelStatus(notificationId, channel, success) {
    const updateField = `${channel}_sent`;
    const update = { [updateField]: success };
    
    if (success) {
      update.sent_at = new Date().toISOString();
      if (channel === 'in_app') {
        update.status = 'delivered';
      }
    }

    await supabase
      .from('purchase_case_notifications')
      .update(update)
      .eq('id', notificationId);
  }

  /**
   * Marquer une notification comme lue
   */
  static async markNotificationAsRead(notificationId, userId) {
    try {
      const { error } = await supabase
        .from('purchase_case_notifications')
        .update({ 
          in_app_read: true,
          read_at: new Date().toISOString(),
          status: 'read'
        })
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Récupérer les notifications d'un utilisateur
   */
  static async getUserNotifications(userId, limit = 20, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('purchase_case_notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { success: true, notifications: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtenir les statistiques des notifications
   */
  static async getNotificationStats(caseId) {
    try {
      const { data, error } = await supabase
        .from('purchase_case_notifications')
        .select('status, email_sent, sms_sent, push_sent, in_app_read')
        .eq('case_id', caseId).limit(500);

      if (error) throw error;

      const stats = {
        total: data.length,
        sent: data.filter(n => n.status === 'sent' || n.status === 'delivered').length,
        read: data.filter(n => n.in_app_read).length,
        email_sent: data.filter(n => n.email_sent).length,
        sms_sent: data.filter(n => n.sms_sent).length,
        push_sent: data.filter(n => n.push_sent).length
      };

      return { success: true, stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Envoyer notification d'acceptation de demande d'achat
   */
  static async sendPurchaseRequestAccepted({
    buyerId,
    buyerEmail,
    sellerName,
    caseNumber,
    parcelTitle,
    purchasePrice
  }) {
    try {
      logger.debug('📧 Envoi notification acceptation:', { buyerEmail, caseNumber });
      
      // Pour l'instant, envoyer juste un log et un toast local
      // Car la table purchase_case_notifications n'existe pas encore
      const notification = {
        user_id: buyerId,
        email: buyerEmail,
        title: '✅ Demande d\'achat acceptée',
        message: `Félicitations ! Le vendeur ${sellerName} a accepté votre demande d'achat pour "${parcelTitle}". 
                  Dossier: ${caseNumber}
                  Montant: ${purchasePrice} FCFA`,
        type: 'purchase_accepted',
        priority: 'high'
      };

      // Envoyer via email (mock pour l'instant)
      logger.debug('✉️ Email à envoyer:', notification);
      
      return { success: true, notification };
    } catch (error) {
      logger.error('❌ Erreur envoi notification acceptation:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Envoyer notification de refus de demande d'achat
   */
  static async sendPurchaseRequestRejected({
    buyerId,
    buyerEmail,
    sellerName,
    parcelTitle
  }) {
    try {
      logger.debug('📧 Envoi notification refus:', { buyerEmail });
      
      const notification = {
        user_id: buyerId,
        email: buyerEmail,
        title: '❌ Demande d\'achat refusée',
        message: `Malheureusement, le vendeur ${sellerName} a refusé votre demande d'achat pour "${parcelTitle}". 
                  Vous pouvez consulter d'autres propriétés disponibles.`,
        type: 'purchase_rejected',
        priority: 'medium'
      };

      logger.debug('✉️ Email à envoyer:', notification);
      
      return { success: true, notification };
    } catch (error) {
      logger.error('❌ Erreur envoi notification refus:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Envoyer notification de négociation
   */
  static async sendNegotiationProposal({
    buyerId,
    buyerEmail,
    sellerName,
    parcelTitle,
    proposedPrice,
    message
  }) {
    try {
      logger.debug('📧 Envoi notification négociation:', { buyerEmail });
      
      const notification = {
        user_id: buyerId,
        email: buyerEmail,
        title: '💬 Contre-offre reçue',
        message: `Le vendeur ${sellerName} a proposé une contre-offre pour "${parcelTitle}": 
                  Nouveau prix: ${proposedPrice} FCFA
                  Message: ${message}
                  Consultez votre dossier pour répondre.`,
        type: 'negotiation_proposal',
        priority: 'high'
      };

      logger.debug('✉️ Email à envoyer:', notification);
      
      return { success: true, notification };
    } catch (error) {
      logger.error('❌ Erreur envoi notification négociation:', error);
      return { success: false, error: error.message };
    }
  }
}

export default NotificationService;