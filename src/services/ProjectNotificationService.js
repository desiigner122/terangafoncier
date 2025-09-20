/**
 * Service de notifications spécialisé pour projets promoteurs
 * Gère les notifications VEFA, construction, livraison
 */
import { NotificationService } from './NotificationService';

export class ProjectNotificationService extends NotificationService {
  constructor() {
    super();
    this.projectTemplates = this.initializeProjectTemplates();
  }

  initializeProjectTemplates() {
    return {
      // Phase pré-vente
      PROSPECT_WELCOME: {
        title: "🏗️ Bienvenue sur votre projet !",
        template: "Merci de votre intérêt pour {projectName}. Votre conseiller {agentName} vous contactera sous 24h.",
        priority: "medium",
        channels: ["email", "sms", "push"],
        category: "PRE_VENTE"
      },

      RESERVATION_CONFIRMED: {
        title: "✅ Réservation confirmée !",
        template: "Votre réservation pour l'unité {unitNumber} de {projectName} est confirmée. Acompte de {reservationAmount} FCFA reçu.",
        priority: "high",
        channels: ["email", "sms", "push", "whatsapp"],
        category: "PRE_VENTE",
        attachments: ["reservation_receipt", "project_brochure"]
      },

      VEFA_CONTRACT_READY: {
        title: "📋 Contrat VEFA prêt",
        template: "Votre contrat de Vente en État Futur d'Achèvement est prêt pour signature. RDV programmé le {appointmentDate}.",
        priority: "high",
        channels: ["email", "sms", "push"],
        category: "CONTRACTUALISATION"
      },

      VEFA_CONTRACT_SIGNED: {
        title: "🎉 Contrat VEFA signé !",
        template: "Félicitations ! Votre contrat VEFA pour {projectName} unité {unitNumber} est signé. Construction prévue dès {constructionStartDate}.",
        priority: "high",
        channels: ["email", "sms", "push", "whatsapp"],
        category: "CONTRACTUALISATION",
        attachments: ["vefa_contract", "delivery_guarantee", "construction_schedule"]
      },

      // Phase construction
      CONSTRUCTION_STARTED: {
        title: "🚧 Construction démarrée !",
        template: "Les travaux de votre logement ont officiellement commencé ! Suivez l'avancement en temps réel sur votre espace client.",
        priority: "high",
        channels: ["email", "sms", "push", "whatsapp"],
        category: "CONSTRUCTION",
        multimedia: ["construction_site_photos"]
      },

      FOUNDATIONS_COMPLETED: {
        title: "🏗️ Fondations terminées",
        template: "Étape fondations terminée avec succès ! Progression : 15%. Prochaine étape : gros œuvre prévu le {nextMilestoneDate}.",
        priority: "medium",
        channels: ["email", "push"],
        category: "CONSTRUCTION",
        multimedia: ["milestone_photos", "technical_report"]
      },

      STRUCTURE_COMPLETED: {
        title: "🏠 Gros œuvre terminé",
        template: "Le gros œuvre de votre logement est terminé ! Progression : 35%. Votre futur chez-vous prend forme !",
        priority: "medium",
        channels: ["email", "push"],
        category: "CONSTRUCTION",
        multimedia: ["structure_photos", "progress_video"]
      },

      ROOFING_COMPLETED: {
        title: "🏠 Toiture installée",
        template: "La toiture de votre logement est posée ! Progression : 50%. Votre futur chez-vous est maintenant hors d'eau.",
        priority: "medium",
        channels: ["email", "push"],
        category: "CONSTRUCTION",
        multimedia: ["roofing_photos"]
      },

      CLOSING_COMPLETED: {
        title: "🛡️ Clos et couvert",
        template: "Votre logement est maintenant clos et couvert ! Progression : 65%. Début des travaux d'aménagement intérieur.",
        priority: "medium",
        channels: ["email", "push"],
        category: "CONSTRUCTION",
        multimedia: ["closing_photos"]
      },

      INTERIOR_WORKS_STARTED: {
        title: "🎨 Aménagement intérieur",
        template: "Début des travaux d'aménagement intérieur ! Progression : 80%. Votre logement prend vie !",
        priority: "medium",
        channels: ["email", "push"],
        category: "FINITIONS",
        multimedia: ["interior_photos"]
      },

      FINISHING_COMPLETED: {
        title: "✨ Finitions terminées",
        template: "Les finitions de votre logement sont terminées ! Progression : 95%. Préparation de la livraison en cours.",
        priority: "high",
        channels: ["email", "sms", "push"],
        category: "FINITIONS",
        multimedia: ["finishing_photos", "virtual_tour"]
      },

      // Phase livraison
      PRE_DELIVERY_INSPECTION: {
        title: "🔍 Inspection pré-livraison",
        template: "Inspection pré-livraison programmée le {inspectionDate} à {inspectionTime}. Votre présence est requise.",
        priority: "high",
        channels: ["email", "sms", "push"],
        category: "LIVRAISON",
        attachments: ["inspection_checklist"]
      },

      DELIVERY_SCHEDULED: {
        title: "🗝️ Livraison programmée !",
        template: "Votre livraison est programmée le {deliveryDate} à {deliveryTime}. RDV pour remise des clés !",
        priority: "high",
        channels: ["email", "sms", "push", "whatsapp"],
        category: "LIVRAISON",
        attachments: ["delivery_guide", "warranty_info"]
      },

      KEYS_DELIVERED: {
        title: "🎉 Félicitations, vous êtes chez vous !",
        template: "Votre logement vous a été livré ! Bienvenue chez vous ! N'hésitez pas à nous contacter pour toute question.",
        priority: "high",
        channels: ["email", "sms", "push", "whatsapp"],
        category: "LIVRAISON",
        multimedia: ["delivery_photos"],
        attachments: ["warranty_certificate", "maintenance_guide", "community_guide"]
      },

      // Phase post-livraison
      WARRANTY_REMINDER: {
        title: "📋 Rappel période de garantie",
        template: "Rappel : vous êtes en période de garantie jusqu'au {warrantyEndDate}. Signalez tout défaut sans délai.",
        priority: "medium",
        channels: ["email", "push"],
        category: "POST_LIVRAISON",
        attachments: ["warranty_terms"]
      },

      WARRANTY_EXPIRING: {
        title: "⏰ Fin de garantie proche",
        template: "Votre garantie se termine le {warrantyEndDate}. Effectuez une inspection finale si nécessaire.",
        priority: "medium",
        channels: ["email", "sms"],
        category: "POST_LIVRAISON"
      },

      // Notifications exceptionnelles
      CONSTRUCTION_DELAY: {
        title: "⏰ Information importante",
        template: "Un retard de {delayDuration} a été identifié. Nouvelle date de livraison : {newDeliveryDate}. Compensations prévues selon contrat.",
        priority: "high",
        channels: ["email", "sms", "push", "phone_call"],
        category: "EXCEPTION",
        attachments: ["delay_explanation", "compensation_details"]
      },

      PAYMENT_REMINDER: {
        title: "💳 Échéance de paiement",
        template: "Rappel : échéance de {paymentAmount} FCFA due le {dueDate} pour l'étape {milestoneType}.",
        priority: "high",
        channels: ["email", "sms", "push"],
        category: "PAIEMENT",
        attachments: ["payment_invoice", "payment_methods"]
      },

      PAYMENT_OVERDUE: {
        title: "🚨 Paiement en retard",
        template: "Votre paiement de {paymentAmount} FCFA est en retard. Contactez-nous rapidement pour régulariser.",
        priority: "urgent",
        channels: ["email", "sms", "push", "phone_call"],
        category: "PAIEMENT"
      },

      TECHNICAL_ISSUE: {
        title: "🔧 Intervention technique",
        template: "Une intervention technique est nécessaire sur votre logement. RDV programmé le {interventionDate}.",
        priority: "high",
        channels: ["email", "sms", "push"],
        category: "MAINTENANCE"
      }
    };
  }

  /**
   * Envoyer une notification spécialisée projet
   */
  async sendProjectNotification(notificationType, recipientId, projectData, customData = {}) {
    try {
      const template = this.projectTemplates[notificationType];
      if (!template) {
        throw new Error(`Template de notification non trouvé : ${notificationType}`);
      }

      // Personnaliser le message
      let message = template.template;
      const allData = { ...projectData, ...customData };
      
      Object.entries(allData).forEach(([key, value]) => {
        const placeholder = `{${key}}`;
        if (message.includes(placeholder)) {
          message = message.replace(new RegExp(placeholder, 'g'), value);
        }
      });

      // Préparer les données de notification
      const notificationData = {
        userId: recipientId,
        type: notificationType,
        title: template.title,
        message: message,
        priority: template.priority,
        category: template.category,
        channels: template.channels,
        metadata: {
          projectId: projectData.projectId,
          vefaCaseId: projectData.vefaCaseId,
          unitNumber: projectData.unitNumber,
          milestone: projectData.currentMilestone,
          ...customData
        }
      };

      // Ajouter les pièces jointes si spécifiées
      if (template.attachments) {
        notificationData.attachments = template.attachments;
      }

      // Ajouter le contenu multimédia si spécifié
      if (template.multimedia) {
        notificationData.multimedia = template.multimedia;
      }

      // Envoyer sur tous les canaux spécifiés
      const results = [];
      for (const channel of template.channels) {
        try {
          const result = await this.sendToChannel(channel, notificationData);
          results.push({ channel, success: true, result });
        } catch (channelError) {
          console.error(`Erreur envoi ${channel}:`, channelError);
          results.push({ channel, success: false, error: channelError.message });
        }
      }

      // Enregistrer en base
      await this.saveProjectNotification({
        ...notificationData,
        deliveryResults: results,
        createdAt: new Date().toISOString()
      });

      return {
        success: true,
        notificationType,
        deliveryResults: results
      };

    } catch (error) {
      console.error('Erreur envoi notification projet:', error);
      throw error;
    }
  }

  /**
   * Programmer des notifications automatiques basées sur les étapes
   */
  async scheduleConstructionNotifications(vefaCaseId, constructionSchedule) {
    try {
      const scheduledNotifications = [];

      constructionSchedule.milestones.forEach((milestone, index) => {
        // Notification de début d'étape (1 jour avant)
        const startNotification = {
          scheduleDate: new Date(new Date(milestone.startDate) - 24 * 60 * 60 * 1000),
          notificationType: `${milestone.type}_STARTING`,
          recipientId: constructionSchedule.clientId,
          projectData: {
            vefaCaseId,
            projectName: constructionSchedule.projectName,
            unitNumber: constructionSchedule.unitNumber,
            milestoneType: milestone.name,
            startDate: milestone.startDate
          }
        };

        // Notification de fin d'étape (jour prévu)
        const completionNotification = {
          scheduleDate: new Date(milestone.endDate),
          notificationType: `${milestone.type}_COMPLETED`,
          recipientId: constructionSchedule.clientId,
          projectData: {
            vefaCaseId,
            projectName: constructionSchedule.projectName,
            unitNumber: constructionSchedule.unitNumber,
            progress: milestone.progress,
            nextMilestoneDate: index < constructionSchedule.milestones.length - 1 
              ? constructionSchedule.milestones[index + 1].startDate 
              : null
          }
        };

        scheduledNotifications.push(startNotification, completionNotification);
      });

      // Programmer toutes les notifications
      for (const notification of scheduledNotifications) {
        await this.scheduleNotification(notification);
      }

      return scheduledNotifications.length;

    } catch (error) {
      console.error('Erreur programmation notifications:', error);
      throw error;
    }
  }

  /**
   * Notifications push avec géolocalisation pour visites chantier
   */
  async sendLocationBasedNotification(recipientId, projectLocation, notificationType = 'SITE_VISIT_INVITE') {
    try {
      const locationData = {
        title: "📍 Visitez votre futur logement !",
        message: `Vous êtes près du chantier de ${projectLocation.projectName}. Souhaitez-vous programmer une visite ?`,
        data: {
          projectLocation,
          actionButtons: [
            {
              action: 'SCHEDULE_VISIT',
              title: 'Programmer une visite'
            },
            {
              action: 'VIEW_PROGRESS',
              title: 'Voir l\'avancement'
            }
          ]
        }
      };

      return await this.sendNotification({
        userId: recipientId,
        type: notificationType,
        ...locationData,
        channels: ['push']
      });

    } catch (error) {
      console.error('Erreur notification géolocalisée:', error);
      throw error;
    }
  }

  /**
   * Sauvegarder notification projet en base
   */
  async saveProjectNotification(notificationData) {
    // Implémentation sauvegarde en base
    // Cette fonction serait connectée à Supabase
    console.log('Sauvegarde notification projet:', notificationData);
  }

  /**
   * Envoyer notification vers canal spécifique
   */
  async sendToChannel(channel, data) {
    switch (channel) {
      case 'email':
        return await this.sendEmailNotification(data);
      case 'sms':
        return await this.sendSMSNotification(data);
      case 'push':
        return await this.sendPushNotification(data);
      case 'whatsapp':
        return await this.sendWhatsAppNotification(data);
      case 'phone_call':
        return await this.schedulePhoneCall(data);
      default:
        throw new Error(`Canal non supporté : ${channel}`);
    }
  }
}

export const projectNotificationService = new ProjectNotificationService();
export default ProjectNotificationService;