/**
 * Service de gestion du workflow des dossiers d'achat
 * Mappe les vrais statuts de la BD aux labels et UI
 */

export class WorkflowStatusService {
  // Mapping des statuts BD aux labels français
  static statusLabels = {
    // Phase 1: Initiation
    initiated: 'Dossier créé',
    buyer_verification: 'Vérification acheteur',
    seller_notification: 'Notification vendeur',
    // Phase 2: Pré-contractuelle
    preliminary_agreement: 'Accord préliminaire',
    deposit_payment: 'Versement des arrhes',
    title_verification: 'Vérification titres propriété',
    // Phase 3: Due Diligence
    property_survey: 'Enquête au Conservateur',
    certificate_verification: 'Vérification certificats',
    tax_clearance: 'Situation fiscale',
    land_survey: 'Bornage et métrés',
    // Phase 4: Frais et Fiscalité
    notary_fees_calculation: 'Calcul frais notaire',
    payment_request: 'Demande de paiement',
    fees_payment_pending: 'Paiement en attente',
    // Phase 5: Contractuelle
    contract_preparation: 'Préparation contrat',
    signing_appointment: 'Rendez-vous signature',
    // Phase 6: Paiement Final
    final_payment_pending: 'Paiement du solde',
    // Phase 7: Post-contractuelle
    property_registration: 'Enregistrement au Livre Foncier',
    property_transfer: 'Transfert propriété',
    // Phase 8: Finalisation
    completed: 'Complété',
    // Statuts spéciaux
    negotiation: 'Phase de négociation',
    cancelled: 'Annulé',
    rejected: 'Rejeté',
    seller_declined: 'Vendeur décline',
    negotiation_failed: 'Négociation échouée',
    legal_issues_found: 'Problèmes légaux détectés',
    archived: 'Archivé',
    // Anciens statuts (rétrocompatibilité)
    legal_verification: 'Vérification légale',
    document_audit: 'Audit documents',
    property_evaluation: 'Évaluation propriété',
    notary_appointment: 'RDV notaire',
    signing_process: 'Process de signature',
    payment_processing: 'Traitement paiement',
  };

  // Mapping des statuts aux couleurs
  static statusColors = {
    // Phase 1: Initiation
    initiated: 'bg-blue-100 text-blue-800',
    buyer_verification: 'bg-cyan-100 text-cyan-800',
    seller_notification: 'bg-indigo-100 text-indigo-800',
    // Phase 2: Pré-contractuelle
    preliminary_agreement: 'bg-violet-100 text-violet-800',
    deposit_payment: 'bg-green-100 text-green-800',
    title_verification: 'bg-blue-100 text-blue-800',
    // Phase 3: Due Diligence
    property_survey: 'bg-cyan-100 text-cyan-800',
    certificate_verification: 'bg-teal-100 text-teal-800',
    tax_clearance: 'bg-amber-100 text-amber-800',
    land_survey: 'bg-orange-100 text-orange-800',
    // Phase 4: Frais et Fiscalité
    notary_fees_calculation: 'bg-pink-100 text-pink-800',
    payment_request: 'bg-red-100 text-red-800',
    fees_payment_pending: 'bg-yellow-100 text-yellow-800',
    // Phase 5: Contractuelle
    contract_preparation: 'bg-fuchsia-100 text-fuchsia-800',
    signing_appointment: 'bg-purple-100 text-purple-800',
    // Phase 6: Paiement Final
    final_payment_pending: 'bg-lime-100 text-lime-800',
    // Phase 7: Post-contractuelle
    property_registration: 'bg-blue-100 text-blue-800',
    property_transfer: 'bg-green-100 text-green-800',
    // Phase 8: Finalisation
    completed: 'bg-emerald-100 text-emerald-800',
    // Statuts spéciaux
    negotiation: 'bg-purple-100 text-purple-800',
    cancelled: 'bg-red-100 text-red-800',
    rejected: 'bg-red-100 text-red-800',
    seller_declined: 'bg-orange-100 text-orange-800',
    negotiation_failed: 'bg-red-100 text-red-800',
    legal_issues_found: 'bg-red-100 text-red-800',
    archived: 'bg-gray-100 text-gray-800',
    // Anciens statuts (rétrocompatibilité)
    legal_verification: 'bg-pink-100 text-pink-800',
    document_audit: 'bg-rose-100 text-rose-800',
    property_evaluation: 'bg-orange-100 text-orange-800',
    notary_appointment: 'bg-amber-100 text-amber-800',
    signing_process: 'bg-yellow-100 text-yellow-800',
    payment_processing: 'bg-lime-100 text-lime-800',
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
    // Anciennes étapes (versions précédentes) → nouvelles étapes unifiées
    document_collection: 'document_audit',
    title_verification: 'legal_verification',
    deposit_pending: 'payment_processing',
    contract_validation: 'legal_verification',
    appointment_scheduling: 'notary_appointment',
    final_payment: 'payment_processing',
    signature: 'signing_process',
    transfer_initiated: 'property_transfer',
    registration: 'property_transfer',
    suspended: 'archived',
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

  // Mapping statut → phase (mis à jour pour 18 étapes)
  static statusToPhase = {
    // Phase 0: Initiation
    initiated: 0,
    buyer_verification: 0,
    seller_notification: 0,
    // Phase 1: Pré-contractuelle
    preliminary_agreement: 1,
    deposit_payment: 1,
    title_verification: 1,
    // Phase 2: Due Diligence
    property_survey: 2,
    certificate_verification: 2,
    tax_clearance: 2,
    land_survey: 2,
    // Phase 3: Frais et Fiscalité
    notary_fees_calculation: 3,
    payment_request: 3,
    fees_payment_pending: 3,
    // Phase 4: Contractuelle
    contract_preparation: 4,
    signing_appointment: 4,
    // Phase 5: Paiement Final
    final_payment_pending: 5,
    // Phase 6: Post-contractuelle
    property_registration: 6,
    property_transfer: 6,
    // Phase 7: Finalisation
    completed: 7,
    // Statuts spéciaux
    negotiation: 1,
    cancelled: 7,
    rejected: 7,
    seller_declined: 7,
    negotiation_failed: 7,
    legal_issues_found: 7,
    archived: 7,
    // Anciens statuts (rétrocompatibilité)
    legal_verification: 2,
    document_audit: 2,
    property_evaluation: 2,
    notary_appointment: 4,
    signing_process: 4,
    payment_processing: 5,
  };

  // Ordre chronologique des statuts (18 étapes)
  static chronologicalOrder = [
    // Phase 1: Initiation (3 étapes)
    'initiated',
    'buyer_verification',
    'seller_notification',
    // Phase 2: Pré-contractuelle (3 étapes)
    'preliminary_agreement',
    'deposit_payment',
    'title_verification',
    // Phase 3: Due Diligence (4 étapes)
    'property_survey',
    'certificate_verification',
    'tax_clearance',
    'land_survey',
    // Phase 4: Frais et Fiscalité (3 étapes)
    'notary_fees_calculation',
    'payment_request',
    'fees_payment_pending',
    // Phase 5: Contractuelle (2 étapes)
    'contract_preparation',
    'signing_appointment',
    // Phase 6: Paiement Final (1 étape)
    'final_payment_pending',
    // Phase 7: Post-contractuelle (2 étapes)
    'property_registration',
    'property_transfer',
    // Phase 8: Finalisation (1 étape)
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

  /**
   * Configuration des actions notaire par étape
   * Chaque action définit le bouton à afficher au notaire selon l'étape actuelle
   */
  static notaryActions = {
    'buyer_verification': {
      label: 'Valider identité acheteur',
      action: 'validate_buyer',
      nextStatus: 'seller_notification',
      icon: 'CheckCircle',
      color: 'blue',
      description: 'Vérifier documents identité, capacité juridique'
    },
    'seller_notification': {
      label: 'Notifier le vendeur',
      action: 'notify_seller',
      nextStatus: 'preliminary_agreement',
      icon: 'Bell',
      color: 'indigo',
      description: 'Informer le vendeur de l\'offre d\'achat'
    },
    'preliminary_agreement': {
      label: 'Générer promesse de vente',
      action: 'generate_preliminary_agreement',
      nextStatus: 'deposit_payment',
      icon: 'FileText',
      color: 'purple',
      description: 'Rédiger et faire signer la promesse de vente'
    },
    'deposit_payment': {
      label: 'Demander versement des arrhes (10%)',
      action: 'request_deposit_payment',
      nextStatus: 'title_verification',
      icon: 'DollarSign',
      color: 'green',
      requiresPayment: true,
      paymentType: 'deposit',
      description: 'Demander à l\'acheteur de verser les arrhes'
    },
    'title_verification': {
      label: 'Vérifier titres de propriété',
      action: 'verify_title',
      nextStatus: 'property_survey',
      icon: 'Shield',
      color: 'blue',
      description: 'Contrôler la légalité des titres fonciers'
    },
    'property_survey': {
      label: 'Lancer enquête au Conservateur',
      action: 'initiate_property_survey',
      nextStatus: 'certificate_verification',
      icon: 'Search',
      color: 'cyan',
      description: 'Vérifier inscription au Livre Foncier'
    },
    'certificate_verification': {
      label: 'Obtenir certificats',
      action: 'request_certificates',
      nextStatus: 'tax_clearance',
      icon: 'FileCheck',
      color: 'teal',
      description: 'Certificats de non-gage et non-expropriation'
    },
    'tax_clearance': {
      label: 'Vérifier situation fiscale',
      action: 'verify_tax_status',
      nextStatus: 'land_survey',
      icon: 'Receipt',
      color: 'amber',
      description: 'Contrôler que les impôts fonciers sont à jour'
    },
    'land_survey': {
      label: 'Commander bornage et métrés',
      action: 'order_land_survey',
      nextStatus: 'notary_fees_calculation',
      icon: 'Map',
      color: 'orange',
      description: 'Faire établir le plan cadastral et limites'
    },
    'notary_fees_calculation': {
      label: 'Calculer frais de notaire',
      action: 'calculate_notary_fees',
      nextStatus: 'payment_request',
      icon: 'Calculator',
      color: 'pink',
      description: 'Droits 10%, honoraires 5%, taxes 2.5%'
    },
    'payment_request': {
      label: 'Envoyer demande de paiement frais',
      action: 'request_notary_fees_payment',
      nextStatus: 'fees_payment_pending',
      icon: 'Send',
      color: 'red',
      requiresPayment: true,
      paymentType: 'notary_fees',
      description: 'Demander le paiement des frais de notaire'
    },
    'fees_payment_pending': {
      label: 'Attendre paiement...',
      action: null,
      nextStatus: 'contract_preparation',
      icon: 'Clock',
      color: 'gray',
      disabled: true,
      description: 'En attente du paiement par l\'acheteur'
    },
    'contract_preparation': {
      label: 'Rédiger acte de vente',
      action: 'draft_sales_contract',
      nextStatus: 'signing_appointment',
      icon: 'FileEdit',
      color: 'violet',
      description: 'Préparer l\'acte authentique de vente'
    },
    'signing_appointment': {
      label: 'Planifier rendez-vous signature',
      action: 'schedule_signing',
      nextStatus: 'final_payment_pending',
      icon: 'Calendar',
      color: 'indigo',
      description: 'Organiser la signature de l\'acte chez le notaire'
    },
    'final_payment_pending': {
      label: 'Demander paiement du solde',
      action: 'request_final_payment',
      nextStatus: 'property_registration',
      icon: 'CreditCard',
      color: 'green',
      requiresPayment: true,
      paymentType: 'final_payment',
      description: 'Demander le versement du solde du prix de vente'
    },
    'property_registration': {
      label: 'Enregistrer au Livre Foncier',
      action: 'register_property',
      nextStatus: 'property_transfer',
      icon: 'Book',
      color: 'blue',
      description: 'Inscrire la vente au Conservateur foncier'
    },
    'property_transfer': {
      label: 'Organiser remise des clés',
      action: 'transfer_property',
      nextStatus: 'completed',
      icon: 'Key',
      color: 'emerald',
      description: 'Remettre les clés et documents à l\'acheteur'
    },
    'completed': {
      label: 'Dossier complété',
      action: null,
      nextStatus: null,
      icon: 'CheckCircle2',
      color: 'green',
      disabled: true,
      description: 'Transaction finalisée avec succès'
    }
  };

  /**
   * Obtenir l'action notaire pour une étape donnée
   */
  static getNotaryAction(status) {
    const normalized = this.normalizeStatus(status);
    return this.notaryActions[normalized] || null;
  }

  /**
   * Vérifier si une étape requiert un paiement
   */
  static requiresPayment(status) {
    const action = this.getNotaryAction(status);
    return action?.requiresPayment || false;
  }

  /**
   * Obtenir le type de paiement pour une étape
   */
  static getPaymentType(status) {
    const action = this.getNotaryAction(status);
    return action?.paymentType || null;
  }
}

export default WorkflowStatusService;
