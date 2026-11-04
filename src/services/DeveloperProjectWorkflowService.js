/**
 * Service de gestion des workflows pour achats de projets de promoteurs
 * Spécialisé pour VEFA, pré-commercialisation, suivi construction
 */
import { terangaBlockchain } from './TerangaBlockchainService';
import { NotificationService } from './NotificationService';
import { logger } from '@/lib/logger';

export class DeveloperProjectWorkflowService {
  constructor() {
    this.blockchainService = terangaBlockchain;
    this.notificationService = new NotificationService();
  }

  // États spécialisés pour projets promoteurs
  static PROJECT_STATUSES = {
    PROSPECT: {
      code: 'PROSPECT',
      label: 'Prospect intéressé',
      description: 'Client intéressé par le projet en pré-commercialisation',
      phase: 'PRE_VENTE',
      icon: 'Eye',
      color: '#3B82F6',
      nextSteps: ['RESERVATION', 'DECLINED']
    },
    RESERVATION: {
      code: 'RESERVATION',
      label: 'Réservation',
      description: 'Réservation avec acompte (5-10%)',
      phase: 'PRE_VENTE',
      icon: 'Bookmark',
      color: '#F59E0B',
      nextSteps: ['VEFA_CONTRACT', 'RESERVATION_CANCELLED'],
      requiredDocuments: ['acompte_reservation', 'notice_descriptive']
    },
    VEFA_CONTRACT: {
      code: 'VEFA_CONTRACT',
      label: 'Contrat VEFA signé',
      description: 'Vente en État Futur d\'Achèvement signée',
      phase: 'CONTRACTUALISATION',
      icon: 'FileSignature',
      color: '#10B981',
      nextSteps: ['CONSTRUCTION_STARTED'],
      requiredDocuments: ['contrat_vefa', 'garantie_livraison', 'assurance_dommages_ouvrage']
    },
    CONSTRUCTION_STARTED: {
      code: 'CONSTRUCTION_STARTED',
      label: 'Début construction',
      description: 'Démarrage des travaux de construction',
      phase: 'CONSTRUCTION',
      icon: 'HardHat',
      color: '#F59E0B',
      nextSteps: ['FOUNDATIONS'],
      notificationDelay: 0
    },
    FOUNDATIONS: {
      code: 'FOUNDATIONS',
      label: 'Fondations',
      description: 'Réalisation des fondations',
      phase: 'CONSTRUCTION',
      icon: 'Building',
      color: '#8B5CF6',
      nextSteps: ['STRUCTURE'],
      constructionMilestone: true,
      progressPercentage: 15
    },
    STRUCTURE: {
      code: 'STRUCTURE',
      label: 'Gros œuvre',
      description: 'Structure et gros œuvre terminés',
      phase: 'CONSTRUCTION',
      icon: 'Home',
      color: '#8B5CF6',
      nextSteps: ['ROOFING'],
      constructionMilestone: true,
      progressPercentage: 35
    },
    ROOFING: {
      code: 'ROOFING',
      label: 'Toiture',
      description: 'Couverture et étanchéité',
      phase: 'CONSTRUCTION',
      icon: 'Triangle',
      color: '#8B5CF6',
      nextSteps: ['CLOSING'],
      constructionMilestone: true,
      progressPercentage: 50
    },
    CLOSING: {
      code: 'CLOSING',
      label: 'Clos couvert',
      description: 'Bâtiment clos et couvert (hors d\'eau/hors d\'air)',
      phase: 'CONSTRUCTION',
      icon: 'Shield',
      color: '#8B5CF6',
      nextSteps: ['INTERIOR_WORKS'],
      constructionMilestone: true,
      progressPercentage: 65
    },
    INTERIOR_WORKS: {
      code: 'INTERIOR_WORKS',
      label: 'Second œuvre',
      description: 'Travaux d\'aménagement intérieur',
      phase: 'FINITIONS',
      icon: 'Palette',
      color: '#EC4899',
      nextSteps: ['FINISHING'],
      constructionMilestone: true,
      progressPercentage: 80
    },
    FINISHING: {
      code: 'FINISHING',
      label: 'Finitions',
      description: 'Finitions et équipements',
      phase: 'FINITIONS',
      icon: 'Sparkles',
      color: '#EC4899',
      nextSteps: ['PRE_DELIVERY'],
      constructionMilestone: true,
      progressPercentage: 90
    },
    PRE_DELIVERY: {
      code: 'PRE_DELIVERY',
      label: 'Pré-livraison',
      description: 'Inspection et préparation livraison',
      phase: 'LIVRAISON',
      icon: 'Search',
      color: '#10B981',
      nextSteps: ['DELIVERED'],
      requiredDocuments: ['pv_reception', 'dossier_technique']
    },
    DELIVERED: {
      code: 'DELIVERED',
      label: 'Livré',
      description: 'Projet livré, clés remises',
      phase: 'LIVRAISON',
      icon: 'Key',
      color: '#10B981',
      nextSteps: ['WARRANTY_PERIOD'],
      isTerminal: false
    },
    WARRANTY_PERIOD: {
      code: 'WARRANTY_PERIOD',
      label: 'Période de garantie',
      description: 'Période de garanties et SAV',
      phase: 'POST_LIVRAISON',
      icon: 'ShieldCheck',
      color: '#06B6D4',
      nextSteps: ['COMPLETED'],
      duration: '1 an'
    },
    COMPLETED: {
      code: 'COMPLETED',
      label: 'Projet terminé',
      description: 'Fin des garanties, projet terminé',
      phase: 'POST_LIVRAISON',
      icon: 'CheckCircle',
      color: '#10B981',
      nextSteps: [],
      isTerminal: true
    },
    // États d'exception
    RESERVATION_CANCELLED: {
      code: 'RESERVATION_CANCELLED',
      label: 'Réservation annulée',
      description: 'Annulation avant signature VEFA',
      phase: 'EXCEPTION',
      icon: 'XCircle',
      color: '#EF4444',
      nextSteps: [],
      isTerminal: true
    },
    CONSTRUCTION_DELAYED: {
      code: 'CONSTRUCTION_DELAYED',
      label: 'Retard construction',
      description: 'Retard significatif dans la construction',
      phase: 'EXCEPTION',
      icon: 'Clock',
      color: '#F59E0B',
      nextSteps: ['CONSTRUCTION_RESUMED']
    },
    CONSTRUCTION_RESUMED: {
      code: 'CONSTRUCTION_RESUMED',
      label: 'Reprise construction',
      description: 'Reprise après retard ou arrêt',
      phase: 'CONSTRUCTION',
      icon: 'Play',
      color: '#10B981',
      nextSteps: ['FOUNDATIONS', 'STRUCTURE', 'ROOFING', 'CLOSING', 'INTERIOR_WORKS']
    }
  };

  /**
   * Créer un nouveau suivi de projet promoteur
   */
  async createProjectCase(projectData) {
    try {
      const caseId = `PRJ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const caseData = {
        id: caseId,
        type: 'DEVELOPER_PROJECT',
        project_id: projectData.projectId,
        developer_id: projectData.developerId,
        client_id: projectData.clientId,
        property_type: projectData.propertyType,
        unit_number: projectData.unitNumber,
        surface_area: projectData.surfaceArea,
        sale_price: projectData.salePrice,
        reservation_amount: projectData.reservationAmount,
        expected_delivery: projectData.expectedDelivery,
        construction_phase: projectData.constructionPhase || 'PRE_CONSTRUCTION',
        current_status: 'PROSPECT',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: {
          vefaType: projectData.vefaType || 'STANDARD',
          constructionStartDate: projectData.constructionStartDate,
          deliveryGuarantee: projectData.deliveryGuarantee,
          warranty10Years: true,
          energyLabel: projectData.energyLabel,
          parkingIncluded: projectData.parkingIncluded || false
        }
      };

      // Enregistrer sur blockchain
      await this.blockchainService.recordStatusUpdate(
        caseId,
        'PROSPECT',
        null,
        caseData.client_id,
        { 
          projectId: projectData.projectId,
          developerId: projectData.developerId,
          initialData: caseData
        }
      );

      // Notification initiale
      await this.notificationService.sendNotification({
        userId: caseData.client_id,
        type: 'PROJECT_CASE_CREATED',
        title: 'Nouveau suivi de projet',
        message: `Votre suivi pour le projet ${projectData.projectName} a été créé`,
        priority: 'medium',
        caseId: caseId
      });

      return caseData;
    } catch (error) {
      logger.error('Erreur création cas projet:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour le statut d'un projet
   */
  async updateProjectStatus(caseId, newStatus, userId, additionalData = {}) {
    try {
      const statusInfo = this.PROJECT_STATUSES[newStatus];
      if (!statusInfo) {
        throw new Error(`Statut invalide: ${newStatus}`);
      }

      const updateData = {
        current_status: newStatus,
        updated_at: new Date().toISOString(),
        updated_by: userId,
        ...additionalData
      };

      // Si c'est une étape de construction, calculer le pourcentage
      if (statusInfo.constructionMilestone) {
        updateData.construction_progress = statusInfo.progressPercentage;
      }

      // Enregistrer sur blockchain avec données spécifiques
      const blockchainData = {
        statusChange: {
          from: additionalData.previousStatus,
          to: newStatus,
          timestamp: new Date().toISOString()
        }
      };

      // Ajouter des données spécifiques selon l'étape
      if (statusInfo.constructionMilestone) {
        blockchainData.constructionMilestone = {
          phase: statusInfo.phase,
          progress: statusInfo.progressPercentage,
          photos: additionalData.photos || [],
          certifications: additionalData.certifications || []
        };
      }

      if (additionalData.documents) {
        blockchainData.documents = additionalData.documents;
      }

      await this.blockchainService.recordStatusUpdate(
        caseId,
        newStatus,
        additionalData.previousStatus,
        userId,
        blockchainData
      );

      // Notification adaptée au type de statut
      await this.sendProjectNotification(caseId, newStatus, statusInfo, additionalData);

      return updateData;
    } catch (error) {
      logger.error('Erreur mise à jour statut projet:', error);
      throw error;
    }
  }

  /**
   * Envoyer notifications spécialisées pour projets
   */
  async sendProjectNotification(caseId, status, statusInfo, data = {}) {
    const notifications = [];

    // Notifications spéciales selon le statut
    switch (status) {
      case 'VEFA_CONTRACT':
        notifications.push({
          type: 'VEFA_SIGNED',
          title: '🏗️ Contrat VEFA signé !',
          message: 'Votre contrat de Vente en État Futur d\'Achèvement est signé. La construction va bientôt commencer !',
          priority: 'high'
        });
        break;

      case 'CONSTRUCTION_STARTED':
        notifications.push({
          type: 'CONSTRUCTION_STARTED',
          title: '🚧 Construction démarrée !',
          message: 'Les travaux de construction de votre logement ont officiellement commencé.',
          priority: 'high'
        });
        break;

      case 'FOUNDATIONS':
      case 'STRUCTURE':
      case 'ROOFING':
      case 'CLOSING':
      case 'INTERIOR_WORKS':
      case 'FINISHING':
        notifications.push({
          type: 'CONSTRUCTION_MILESTONE',
          title: `🏗️ Étape ${statusInfo.label} terminée`,
          message: `${statusInfo.description} (${statusInfo.progressPercentage}% d'avancement)`,
          priority: 'medium',
          metadata: {
            progress: statusInfo.progressPercentage,
            photos: data.photos || []
          }
        });
        break;

      case 'PRE_DELIVERY':
        notifications.push({
          type: 'PRE_DELIVERY',
          title: '🔍 Préparation livraison',
          message: 'Votre logement est prêt ! Nous préparons la livraison et l\'inspection finale.',
          priority: 'high'
        });
        break;

      case 'DELIVERED':
        notifications.push({
          type: 'PROJECT_DELIVERED',
          title: '🎉 Livraison effectuée !',
          message: 'Félicitations ! Votre logement vous a été livré. Profitez de votre nouveau chez-vous !',
          priority: 'high'
        });
        break;

      case 'CONSTRUCTION_DELAYED':
        notifications.push({
          type: 'CONSTRUCTION_DELAY',
          title: '⏰ Information importante',
          message: 'Un retard dans la construction a été signalé. Nous vous tiendrons informé de l\'évolution.',
          priority: 'high'
        });
        break;
    }

    // Envoyer toutes les notifications
    for (const notif of notifications) {
      await this.notificationService.sendNotification({
        userId: data.clientId || data.userId,
        caseId,
        ...notif
      });
    }
  }

  /**
   * Obtenir les étapes suivantes possibles
   */
  getNextSteps(currentStatus) {
    const statusInfo = this.PROJECT_STATUSES[currentStatus];
    return statusInfo ? statusInfo.nextSteps : [];
  }

  /**
   * Calculer le délai estimé jusqu'à la livraison
   */
  calculateDeliveryEstimate(currentStatus, constructionStartDate, originalDeliveryDate) {
    const statusInfo = this.PROJECT_STATUSES[currentStatus];
    
    if (!statusInfo.constructionMilestone) {
      return originalDeliveryDate;
    }

    // Estimation basée sur le pourcentage d'avancement
    const progress = statusInfo.progressPercentage || 0;
    const remainingProgress = 100 - progress;
    
    const startDate = new Date(constructionStartDate);
    const originalDuration = new Date(originalDeliveryDate) - startDate;
    const estimatedRemainingTime = (originalDuration * remainingProgress) / 100;
    
    return new Date(Date.now() + estimatedRemainingTime);
  }

  /**
   * Obtenir l'historique complet avec blockchain
   */
  async getProjectHistory(caseId) {
    try {
      return await this.blockchainService.getCaseHistory(caseId);
    } catch (error) {
      logger.error('Erreur récupération historique projet:', error);
      throw error;
    }
  }
}

export const developerProjectWorkflowService = new DeveloperProjectWorkflowService();
export default DeveloperProjectWorkflowService;