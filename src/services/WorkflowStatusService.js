/**
 * Service de gestion du workflow des dossiers d'achat
 * Mappe les vrais statuts de la BD aux labels et UI
 */

export class WorkflowStatusService {
  // Mapping des statuts BD aux labels français
  static statusLabels = {
    initiated: 'Dossier créé',
    buyer_verification: 'Vérification acheteur',
    seller_notification: 'Notification vendeur',
    negotiation: 'Phase de négociation',
    preliminary_agreement: 'Accord préalable',
    contract_preparation: 'Préparation contrat',
    legal_verification: 'Vérification légale',
    document_audit: 'Audit documents',
    property_evaluation: 'Évaluation propriété',
    notary_appointment: 'RDV notaire',
    signing_process: 'Process de signature',
    payment_processing: 'Traitement paiement',
    property_transfer: 'Transfert propriété',
    completed: 'Complété',
    cancelled: 'Annulé',
    rejected: 'Rejeté',
    seller_declined: 'Vendeur décline',
    negotiation_failed: 'Négociation échouée',
    legal_issues_found: 'Problèmes légaux détectés',
    archived: 'Archivé',
  };

  // Mapping des statuts aux couleurs
  static statusColors = {
    initiated: 'bg-blue-100 text-blue-800',
    buyer_verification: 'bg-cyan-100 text-cyan-800',
    seller_notification: 'bg-indigo-100 text-indigo-800',
    negotiation: 'bg-purple-100 text-purple-800',
    preliminary_agreement: 'bg-violet-100 text-violet-800',
    contract_preparation: 'bg-fuchsia-100 text-fuchsia-800',
    legal_verification: 'bg-pink-100 text-pink-800',
    document_audit: 'bg-rose-100 text-rose-800',
    property_evaluation: 'bg-orange-100 text-orange-800',
    notary_appointment: 'bg-amber-100 text-amber-800',
    signing_process: 'bg-yellow-100 text-yellow-800',
    payment_processing: 'bg-lime-100 text-lime-800',
    property_transfer: 'bg-green-100 text-green-800',
    completed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
    rejected: 'bg-red-100 text-red-800',
    seller_declined: 'bg-orange-100 text-orange-800',
    negotiation_failed: 'bg-red-100 text-red-800',
    legal_issues_found: 'bg-red-100 text-red-800',
    archived: 'bg-gray-100 text-gray-800',
  };

  // Statuts terminaux (processus ne continuera pas)
  static terminalStatuses = ['completed', 'cancelled', 'rejected', 'seller_declined', 'negotiation_failed', 'legal_issues_found', 'archived'];

  // Alias pour normaliser les statuts provenant de sources hétérogènes
  static statusAliases = {
    new: 'initiated',
    pending: 'initiated',
    waiting_response: 'seller_notification',
    seller_reviewing: 'seller_notification',
    awaiting_seller: 'seller_notification',
    in_progress: 'negotiation',
    negotiating: 'negotiation',
    discussion: 'negotiation',
    accepted: 'preliminary_agreement',
    approved: 'preliminary_agreement',
    validation: 'legal_verification',
    documents_pending: 'document_audit',
    document_review: 'document_audit',
    dossier_complement: 'document_audit',
    financing: 'payment_processing',
    payment: 'payment_processing',
    payment_in_progress: 'payment_processing',
    finished: 'completed',
    done: 'completed',
    canceled: 'cancelled',
    declined: 'rejected',
    refused: 'rejected',
    legal_issue: 'legal_issues_found',
  };

  static normalizeStatus(status) {
    if (!status) {
      return 'initiated';
    }

    const stringified = String(status).trim();
    const withSeparators = stringified.replace(/([a-z0-9])([A-Z])/g, '$1_$2');

    const normalizedBase = withSeparators
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

    const canonical = normalizedBase.replace(/[\s-]+/g, '_');

    if (this.statusLabels[canonical]) {
      return canonical;
    }

    if (this.statusAliases[canonical]) {
      return this.statusAliases[canonical];
    }

    return canonical;
  }

  // Mapping statut → phase
  static statusToPhase = {
    initiated: 0,
    buyer_verification: 0,
    seller_notification: 0,
    negotiation: 1,
    preliminary_agreement: 1,
    contract_preparation: 2,
    legal_verification: 2,
    document_audit: 2,
    property_evaluation: 2,
    notary_appointment: 3,
    signing_process: 3,
    payment_processing: 3,
    property_transfer: 3,
    completed: 4,
    cancelled: 4,
    rejected: 4,
    seller_declined: 4,
    negotiation_failed: 4,
    legal_issues_found: 4,
    archived: 4,
  };

  // Ordre chronologique des statuts
  static chronologicalOrder = [
    'initiated',
    'buyer_verification',
    'seller_notification',
    'negotiation',
    'preliminary_agreement',
    'contract_preparation',
    'legal_verification',
    'document_audit',
    'property_evaluation',
    'notary_appointment',
    'signing_process',
    'payment_processing',
    'property_transfer',
    'completed',
  ];

  /**
   * Obtenir le label français d'un statut
   */
  static getLabel(status) {
    const normalized = this.normalizeStatus(status);
    return this.statusLabels[normalized] || normalized;
  }

  /**
   * Obtenir la couleur d'un statut
   */
  static getColor(status) {
    const normalized = this.normalizeStatus(status);
    return this.statusColors[normalized] || 'bg-gray-100 text-gray-800';
  }

  /**
   * Vérifier si un statut est terminal
   */
  static isTerminal(status) {
    const normalized = this.normalizeStatus(status);
    return this.terminalStatuses.includes(normalized);
  }

  /**
   * Calculer le pourcentage de progression basé sur le statut
   * @param {string} status - Le statut actuel
   * @returns {number} Pourcentage 0-100
   */
  static calculateProgressFromStatus(status) {
    const normalized = this.normalizeStatus(status);
    const index = this.chronologicalOrder.indexOf(normalized);
    if (index === -1) return 0;
    return Math.round(((index + 1) / this.chronologicalOrder.length) * 100);
  }

  /**
   * Obtenir les étapes complétées jusqu'au statut actuel
   */
  static getCompletedStages(currentStatus) {
    const normalized = this.normalizeStatus(currentStatus);
    const index = this.chronologicalOrder.indexOf(normalized);
    if (index === -1) return [];
    return this.chronologicalOrder.slice(0, index + 1);
  }

  /**
   * Obtenir les étapes restantes
   */
  static getRemainingStages(currentStatus) {
    const normalized = this.normalizeStatus(currentStatus);
    const index = this.chronologicalOrder.indexOf(normalized);
    if (index === -1) return this.chronologicalOrder;
    return this.chronologicalOrder.slice(index + 1);
  }

  /**
   * Vérifier si le dossier doit attendre une approbation bancaire
   */
  static requiresBankApproval(paymentMethod) {
    return paymentMethod === 'bank_financing';
  }

  /**
   * Obtenir les étapes spéciales en fonction du type de paiement
   */
  static getSpecialSteps(paymentMethod) {
    const specialSteps = {};

    if (paymentMethod === 'bank_financing') {
      specialSteps.bankApproval = {
        label: 'Approbation bancaire',
        description: 'En attente de l\'approbation de financement',
        icon: 'building-bank',
      };
    }

    if (paymentMethod === 'installments') {
      specialSteps.paymentPlan = {
        label: 'Plan de paiement',
        description: 'Échelonnement du paiement',
        icon: 'calendar-range',
      };
    }

    return specialSteps;
  }

  /**
   * Obtenir l'étape suivante recommandée
   */
  static getNextStage(currentStatus, paymentMethod = null) {
    const normalized = this.normalizeStatus(currentStatus);
    const index = this.chronologicalOrder.indexOf(normalized);
    if (index === -1 || index >= this.chronologicalOrder.length - 1) {
      return null;
    }

    // Si financement bancaire et pas encore approuvé, l'étape spéciale est requise
    if (paymentMethod === 'bank_financing' && !this.requiresBankApprovalPassed(normalized)) {
      return 'bank_approval_check';
    }

    return this.chronologicalOrder[index + 1];
  }

  /**
   * Vérifier si l'approbation bancaire a été passée
   */
  static requiresBankApprovalPassed(currentStatus) {
    // Après signing_process, on assume que l'approbation est passée
    const signingIndex = this.chronologicalOrder.indexOf('signing_process');
    const normalized = this.normalizeStatus(currentStatus);
    const currentIndex = this.chronologicalOrder.indexOf(normalized);
    return currentIndex >= signingIndex;
  }

  /**
   * Obtenir un résumé du dossier
   */
  static getSummary(purchaseCase) {
    const normalizedStatus = this.normalizeStatus(purchaseCase.status || purchaseCase.current_status);
    return {
      currentStatus: normalizedStatus,
      currentStatusLabel: this.getLabel(normalizedStatus),
      currentPhase: purchaseCase.phase || this.statusToPhase[normalizedStatus],
      progressPercentage: purchaseCase.progress_percentage || this.calculateProgressFromStatus(normalizedStatus),
      isTerminal: this.isTerminal(normalizedStatus),
      completedStages: this.getCompletedStages(normalizedStatus),
      remainingStages: this.getRemainingStages(normalizedStatus),
      nextStage: this.getNextStage(normalizedStatus, purchaseCase.payment_method),
      requiresBankApproval: this.requiresBankApproval(purchaseCase.payment_method),
      bankApprovalStatus: purchaseCase.financing_approved,
      specialSteps: this.getSpecialSteps(purchaseCase.payment_method),
    };
  }

  static getStatusInfo(status) {
    const normalized = this.normalizeStatus(status);
    return {
      key: normalized,
      label: this.getLabel(normalized),
      colorClass: this.getColor(normalized),
      isTerminal: this.isTerminal(normalized),
    };
  }

  static getKnownStatuses() {
    return Object.keys(this.statusLabels);
  }
}

export default WorkflowStatusService;
