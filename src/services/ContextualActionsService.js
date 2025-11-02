/**
 * ContextualActionsService.js
 * 
 * Détermine quelles actions sont disponibles selon :
 * - Le statut du dossier (purchase_cases.status)
 * - Le rôle de l'utilisateur
 * - Les permissions calculées
 */

/**
 * Workflow states mapping
 * Référence: WorkflowStatusService statuses
 */
const WORKFLOW_STATES = {
  INITIATED: 'initiated',
  BUYER_VERIFICATION: 'buyer_verification',
  SELLER_NOTIFICATION: 'seller_notification',
  SELLER_ACCEPTANCE: 'seller_acceptance',
  NOTARY_ASSIGNMENT: 'notary_assignment',
  DOCUMENT_COLLECTION: 'document_collection',
  TITLE_VERIFICATION: 'title_verification',
  CONTRACT_PREPARATION: 'contract_preparation',
  DEPOSIT_PENDING: 'deposit_pending',
  CONTRACT_VALIDATION: 'contract_validation',
  APPOINTMENT_SCHEDULING: 'appointment_scheduling',
  FINAL_PAYMENT: 'final_payment',
  SIGNATURE: 'signature',
  REGISTRATION: 'registration',
  COMPLETED: 'completed'
};

/**
 * Action categories
 */
const ACTION_CATEGORIES = {
  DOCUMENTS: 'documents',
  PAYMENTS: 'payments',
  APPOINTMENTS: 'appointments',
  VALIDATIONS: 'validations',
  OPTIONAL: 'optional'
};

/**
 * Get available actions for a user based on case status and role
 */
export const getAvailableActions = (purchaseCase, userRole, permissions) => {
  const status = purchaseCase?.status || 'initiated';
  const actions = {
    [ACTION_CATEGORIES.DOCUMENTS]: [],
    [ACTION_CATEGORIES.PAYMENTS]: [],
    [ACTION_CATEGORIES.APPOINTMENTS]: [],
    [ACTION_CATEGORIES.VALIDATIONS]: [],
    [ACTION_CATEGORIES.OPTIONAL]: []
  };

  switch (userRole) {
    case 'buyer':
      return getBuyerActionsInternal(status, purchaseCase, permissions, actions);
    case 'seller':
      return getSellerActionsInternal(status, purchaseCase, permissions, actions);
    case 'notaire':
      return getNotaireActions(status, purchaseCase, permissions, actions);
    case 'agent':
      return getAgentActions(status, purchaseCase, permissions, actions);
    case 'geometre':
      return getGeometreActions(status, purchaseCase, permissions, actions);
    default:
      return actions;
  }
};

/**
 * BUYER ACTIONS
 */
const getBuyerActionsInternal = (status, purchaseCase, permissions, actions) => {
  // CRITICAL: Choose notary (MUST be done before workflow can progress)
  // Available from initiated onwards if not already assigned
  if (!purchaseCase.notaire_id) {
    // Notaire requis pour tous les statuts avant 'completed' et 'cancelled'
    const isActiveCase = !['completed', 'cancelled', 'rejected', 'archived', 'seller_declined', 'negotiation_failed'].includes(status);
    
    if (isActiveCase) {
      actions[ACTION_CATEGORIES.VALIDATIONS].unshift({
        id: 'select_notary',
        label: '⚠️ Sélectionner un notaire',
        icon: 'UserPlus',
        description: 'OBLIGATOIRE - Choisissez un notaire pour poursuivre',
        handler: 'onSelectNotary',
        priority: 'high',
        required: true,
        variant: 'default',
        className: 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
      });
    }
  }

  // OPTIONAL: Choose agent/surveyor (available early in workflow)
  const earlyStatuses = ['initiated', 'buyer_verification', 'seller_notification', 'preliminary_agreement', 'negotiation'];
  if (earlyStatuses.includes(status)) {
    if (!purchaseCase.hasAgent) {
      actions[ACTION_CATEGORIES.OPTIONAL].push({
        id: 'choose_agent',
        label: 'Choisir un agent foncier',
        icon: 'Building2',
        description: 'Un agent peut faciliter les négociations',
        handler: 'onChooseAgent'
      });
    }
    if (!purchaseCase.hasSurveying) {
      actions[ACTION_CATEGORIES.OPTIONAL].push({
        id: 'request_surveying',
        label: 'Commander un bornage',
        icon: 'Ruler',
        description: 'Vérifier les limites de la parcelle',
        handler: 'onRequestSurveying'
      });
    }
  }

  // DOCUMENTS: Upload identity during buyer_verification
  if (status === 'buyer_verification' || status === 'initiated') {
    actions[ACTION_CATEGORIES.DOCUMENTS].push({
      id: 'upload_identity',
      label: 'Uploader pièce d\'identité',
      icon: 'Upload',
      description: 'CNI ou passeport requis',
      handler: 'onUploadBuyerIdentity',
      docType: 'buyer_id'
    });
  }

  // PAYMENTS: Deposit payment
  if (['deposit_payment', 'preliminary_agreement', 'title_verification', 'initiated', 'buyer_verification', 'seller_notification'].includes(status)) {
    actions[ACTION_CATEGORIES.PAYMENTS].push({
      id: 'pay_deposit',
      label: 'Payer acompte (10%)',
      icon: 'CreditCard',
      amount: purchaseCase.deposit_amount || (purchaseCase.offered_price * 0.10),
      description: 'Paiement de l\'acompte',
      handler: 'onPayDeposit'
    });
  }

  // PAYMENTS: Notary fees
  if (['notary_fees_calculation', 'payment_request', 'fees_payment_pending', 'contract_preparation', 'title_verification', 'property_survey', 'certificate_verification', 'tax_clearance', 'land_survey'].includes(status)) {
    actions[ACTION_CATEGORIES.PAYMENTS].push({
      id: 'pay_notary_fees',
      label: 'Payer frais de notaire',
      icon: 'Receipt',
      amount: purchaseCase.notary_fees || (purchaseCase.offered_price * 0.05),
      description: 'Frais notaire et enregistrement',
      handler: 'onPayNotaryFees'
    });
  }

  // DOCUMENTS: Review contract
  if (['contract_preparation', 'signing_appointment'].includes(status)) {
    actions[ACTION_CATEGORIES.DOCUMENTS].push({
      id: 'review_contract',
      label: 'Consulter le contrat',
      icon: 'Eye',
      description: 'Lire le contrat avant signature',
      handler: 'onReviewContract'
    });
  }

  // APPOINTMENTS: Confirm appointment
  if (['signing_appointment'].includes(status)) {
    actions[ACTION_CATEGORIES.APPOINTMENTS].push({
      id: 'confirm_appointment',
      label: 'Confirmer rendez-vous',
      icon: 'Calendar',
      description: 'Confirmer votre disponibilité',
      handler: 'onConfirmAppointment'
    });
  }

  // PAYMENTS: Final payment before signature
  if (['final_payment_pending', 'signing_appointment'].includes(status)) {
    const depositPaid = purchaseCase.deposit_amount || (purchaseCase.offered_price * 0.10);
    const balance = (purchaseCase.offered_price || 0) - depositPaid;
    
    actions[ACTION_CATEGORIES.PAYMENTS].push({
      id: 'pay_balance',
      label: 'Payer le solde',
      icon: 'CreditCard',
      amount: purchaseCase.balance_amount || balance,
      description: 'Paiement du solde restant',
      handler: 'onPayBalance'
    });
  }

  // PAYMENTS: Notary fees
  if ([WORKFLOW_STATES.CONTRACT_PREPARATION, WORKFLOW_STATES.CONTRACT_VALIDATION].includes(status)) {
    actions[ACTION_CATEGORIES.PAYMENTS].push({
      id: 'pay_notary_fees',
      label: 'Payer frais de notaire',
      icon: 'CreditCard',
      amount: purchaseCase.notaire_fees || 0,
      description: 'Honoraires du notaire',
      handler: 'onPayNotaryFees'
    });
  }

  // VALIDATIONS: Review and sign contract
  if (status === WORKFLOW_STATES.CONTRACT_VALIDATION) {
    actions[ACTION_CATEGORIES.VALIDATIONS].push({
      id: 'review_contract',
      label: 'Consulter projet de contrat',
      icon: 'FileText',
      description: 'Vérifier le contrat avant signature',
      handler: 'onReviewContract'
    });
  }

  // APPOINTMENTS: Confirm signature appointment
  if (status === WORKFLOW_STATES.APPOINTMENT_SCHEDULING) {
    actions[ACTION_CATEGORIES.APPOINTMENTS].push({
      id: 'confirm_appointment',
      label: 'Confirmer RDV signature',
      icon: 'Calendar',
      description: 'Confirmer votre disponibilité',
      handler: 'onConfirmAppointment'
    });
  }

  // PAYMENTS: Final payment before signature
  if (status === WORKFLOW_STATES.FINAL_PAYMENT) {
    actions[ACTION_CATEGORIES.PAYMENTS].push({
      id: 'pay_balance',
      label: 'Payer le solde',
      icon: 'CreditCard',
      amount: purchaseCase.balance_amount || 0,
      description: 'Paiement du solde restant',
      handler: 'onPayBalance'
    });
  }

  return actions;
};

/**
 * SELLER ACTIONS
 */
const getSellerActionsInternal = (status, purchaseCase, permissions, actions) => {
  // CRITICAL: Choose notary (MUST be done before workflow can progress)
  // Seller can also suggest/select a notary if buyer hasn't yet
  if (!purchaseCase.notaire_id) {
    // Notaire requis pour tous les statuts avant 'completed' et 'cancelled'
    const isActiveCase = !['completed', 'cancelled', 'rejected', 'archived', 'seller_declined', 'negotiation_failed'].includes(status);
    
    if (isActiveCase) {
      actions[ACTION_CATEGORIES.VALIDATIONS].unshift({
        id: 'select_notary',
        label: '⚠️ Proposer un notaire',
        icon: 'UserPlus',
        description: 'RECOMMANDÉ - Proposez un notaire de confiance',
        handler: 'onSelectNotary',
        priority: 'high',
        variant: 'default',
        className: 'bg-orange-600 hover:bg-orange-700 text-white'
      });
    }
  }

  // VALIDATIONS: Accept offer (if applicable)
  if (['seller_notification', 'preliminary_agreement', 'negotiation'].includes(status)) {
    actions[ACTION_CATEGORIES.VALIDATIONS].push({
      id: 'accept_offer',
      label: 'Accepter l\'offre',
      icon: 'CheckCircle',
      description: 'Accepter la proposition d\'achat',
      handler: 'onAcceptOffer'
    });
  }

  // DOCUMENTS: Upload title deed and ownership documents
  if (['initiated', 'buyer_verification', 'seller_notification', 'preliminary_agreement', 'title_verification', 'property_survey'].includes(status)) {
    actions[ACTION_CATEGORIES.DOCUMENTS].push({
      id: 'upload_title_deed',
      label: 'Uploader titre foncier',
      icon: 'Upload',
      description: 'Titre de propriété et documents légaux',
      handler: 'onUploadTitleDeed',
      docType: 'title_deed'
    });
  }

  // VALIDATIONS: Validate contract
  if (['contract_preparation', 'signing_appointment'].includes(status)) {
    actions[ACTION_CATEGORIES.VALIDATIONS].push({
      id: 'validate_contract',
      label: 'Valider le contrat',
      icon: 'FileCheck',
      description: 'Approuver le contrat de vente',
      handler: 'onValidateContract'
    });
  }

  // APPOINTMENTS: Confirm signature appointment
  if (['signing_appointment'].includes(status)) {
    actions[ACTION_CATEGORIES.APPOINTMENTS].push({
      id: 'confirm_appointment',
      label: 'Confirmer RDV signature',
      icon: 'Calendar',
      description: 'Confirmer votre présence',
      handler: 'onConfirmAppointment'
    });
  }

  return actions;
};

/**
 * NOTAIRE ACTIONS
 */
const getNotaireActions = (status, purchaseCase, permissions, actions) => {
  // PAYMENTS: Set notary fees (after acceptance, before contract)
  // Notaire doit définir ses honoraires et débours après avoir accepté le dossier
  if ([
    WORKFLOW_STATES.CONTRACT_PREPARATION,
    WORKFLOW_STATES.DOCUMENT_COLLECTION,
    WORKFLOW_STATES.TITLE_VERIFICATION,
    'notary_assignment',
    'document_collection',
    'title_verification'
  ].includes(status)) {
    // Only show if notaire hasn't set fees yet or can update them
    const hasSetFees = purchaseCase?.notaire_fees && purchaseCase?.notaire_fees > 0;
    
    actions[ACTION_CATEGORIES.PAYMENTS].push({
      id: 'set_notary_fees',
      label: hasSetFees ? 'Modifier frais notariaux' : '💰 Définir frais notariaux',
      icon: 'DollarSign',
      description: hasSetFees 
        ? 'Mettre à jour honoraires et débours'
        : 'REQUIS - Fixer honoraires et débours',
      handler: 'onSetNotaryFees',
      priority: hasSetFees ? 'normal' : 'high',
      required: !hasSetFees,
      variant: hasSetFees ? 'outline' : 'default',
      className: hasSetFees ? '' : 'bg-blue-600 hover:bg-blue-700 text-white'
    });
  }

  // VALIDATIONS: Verify buyer identity
  if (status === WORKFLOW_STATES.BUYER_VERIFICATION && permissions.canVerifyDocuments) {
    actions[ACTION_CATEGORIES.VALIDATIONS].push({
      id: 'verify_buyer_identity',
      label: 'Vérifier identité acheteur',
      icon: 'CheckCircle',
      description: 'Contrôler pièces d\'identité',
      handler: 'onVerifyBuyerIdentity'
    });
  }

  // VALIDATIONS: Verify title deed at cadastre
  if (status === WORKFLOW_STATES.TITLE_VERIFICATION) {
    actions[ACTION_CATEGORIES.VALIDATIONS].push({
      id: 'verify_title_cadastre',
      label: 'Contrôler titre au cadastre',
      icon: 'FileSearch',
      description: 'Vérifier authenticité du titre',
      handler: 'onVerifyTitleCadastre'
    });
  }

  // DOCUMENTS: Generate contract
  if (status === WORKFLOW_STATES.CONTRACT_PREPARATION && permissions.canGenerateContract) {
    actions[ACTION_CATEGORIES.DOCUMENTS].push({
      id: 'generate_contract',
      label: 'Générer acte de vente',
      icon: 'FileText',
      description: 'Créer l\'acte notarié',
      handler: 'onGenerateContract'
    });
  }

  // APPOINTMENTS: Schedule signature meeting
  if (status === WORKFLOW_STATES.APPOINTMENT_SCHEDULING && permissions.canScheduleAppointment) {
    actions[ACTION_CATEGORIES.APPOINTMENTS].push({
      id: 'schedule_appointment',
      label: 'Proposer dates de RDV',
      icon: 'Calendar',
      description: 'Organiser la signature',
      handler: 'onScheduleAppointment'
    });
  }

  // VALIDATIONS: Confirm fees received
  if ([WORKFLOW_STATES.CONTRACT_VALIDATION, WORKFLOW_STATES.FINAL_PAYMENT].includes(status)) {
    actions[ACTION_CATEGORIES.PAYMENTS].push({
      id: 'confirm_fees_received',
      label: 'Confirmer réception honoraires',
      icon: 'CheckCircle',
      description: 'Valider paiement des frais',
      handler: 'onConfirmFeesReceived'
    });
  }

  // VALIDATIONS: Register deed
  if (status === WORKFLOW_STATES.REGISTRATION) {
    actions[ACTION_CATEGORIES.VALIDATIONS].push({
      id: 'register_deed',
      label: 'Enregistrer acte aux impôts',
      icon: 'FileCheck',
      description: 'Finaliser l\'enregistrement',
      handler: 'onRegisterDeed'
    });
  }

  return actions;
};

/**
 * AGENT ACTIONS
 */
const getAgentActions = (status, purchaseCase, permissions, actions) => {
  // Available throughout most of the workflow
  if (![WORKFLOW_STATES.COMPLETED].includes(status)) {
    actions[ACTION_CATEGORIES.VALIDATIONS].push({
      id: 'facilitate_negotiation',
      label: 'Faciliter négociation',
      icon: 'MessageSquare',
      description: 'Coordonner entre parties',
      handler: 'onFacilitateNegotiation'
    });
  }

  // PAYMENTS: Track commission
  if ([WORKFLOW_STATES.FINAL_PAYMENT, WORKFLOW_STATES.SIGNATURE].includes(status)) {
    actions[ACTION_CATEGORIES.PAYMENTS].push({
      id: 'track_commission',
      label: 'Suivre commission (5%)',
      icon: 'CreditCard',
      amount: purchaseCase.agent_commission || 0,
      description: 'Vérifier paiement commission',
      handler: 'onTrackCommission'
    });
  }

  return actions;
};

/**
 * GEOMETRE ACTIONS
 */
const getGeometreActions = (status, purchaseCase, permissions, actions) => {
  const mission = purchaseCase.surveyingMission;
  if (!mission) return actions;

  // VALIDATIONS: Accept/decline mission
  if (mission.status === 'pending') {
    actions[ACTION_CATEGORIES.VALIDATIONS].push({
      id: 'accept_mission',
      label: 'Accepter mission',
      icon: 'CheckCircle',
      description: 'Confirmer intervention',
      handler: 'onAcceptMission'
    });
    actions[ACTION_CATEGORIES.VALIDATIONS].push({
      id: 'decline_mission',
      label: 'Décliner mission',
      icon: 'XCircle',
      description: 'Refuser intervention',
      handler: 'onDeclineMission',
      variant: 'outline'
    });
  }

  // APPOINTMENTS: Schedule site visit
  if (['accepted', 'in_progress'].includes(mission.status)) {
    actions[ACTION_CATEGORIES.APPOINTMENTS].push({
      id: 'schedule_site_visit',
      label: 'Planifier visite terrain',
      icon: 'Calendar',
      description: 'Organiser le bornage',
      handler: 'onScheduleSiteVisit'
    });
  }

  // DOCUMENTS: Upload results
  if (mission.status === 'in_progress') {
    actions[ACTION_CATEGORIES.DOCUMENTS].push({
      id: 'upload_survey_plan',
      label: 'Uploader plan de bornage',
      icon: 'Upload',
      description: 'Plan topographique',
      handler: 'onUploadSurveyPlan',
      docType: 'survey_plan'
    });
    actions[ACTION_CATEGORIES.DOCUMENTS].push({
      id: 'upload_certificate',
      label: 'Uploader certificat',
      icon: 'Upload',
      description: 'Certificat topographique',
      handler: 'onUploadCertificate',
      docType: 'survey_certificate'
    });
  }

  // VALIDATIONS: Complete mission
  if (mission.status === 'in_progress') {
    actions[ACTION_CATEGORIES.VALIDATIONS].push({
      id: 'complete_mission',
      label: 'Clôturer mission',
      icon: 'CheckCircle',
      description: 'Finaliser le bornage',
      handler: 'onCompleteMission'
    });
  }

  return actions;
};

/**
 * Public wrapper for getBuyerActions
 * @param {Object} purchaseCase - The purchase case object
 * @param {Object} permissions - Optional permissions object with flags like canSelectNotary, canPayDeposit, etc.
 * @returns {Object} Actions grouped by category
 */
const getBuyerActions = (purchaseCase, permissions = {}) => {
  const status = purchaseCase?.status || 'initiated';
  const actions = {
    [ACTION_CATEGORIES.DOCUMENTS]: [],
    [ACTION_CATEGORIES.PAYMENTS]: [],
    [ACTION_CATEGORIES.APPOINTMENTS]: [],
    [ACTION_CATEGORIES.VALIDATIONS]: [],
    [ACTION_CATEGORIES.OPTIONAL]: []
  };
  
  console.log('🔍 [ContextualActions] getBuyerActions appelé:', {
    status,
    hasNotary: !!purchaseCase?.notaire_id,
    permissions
  });
  
  const result = getBuyerActionsInternal(status, purchaseCase, permissions, actions);
  
  console.log('✅ [ContextualActions] getBuyerActions résultat:', {
    validations: result.validations?.length || 0,
    documents: result.documents?.length || 0,
    payments: result.payments?.length || 0,
    appointments: result.appointments?.length || 0,
    optional: result.optional?.length || 0
  });
  
  return result;
};

/**
 * Public wrapper for getSellerActions
 * @param {Object} purchaseCase - The purchase case object
 * @param {Object} permissions - Optional permissions object
 * @returns {Object} Actions grouped by category
 */
const getSellerActions = (purchaseCase, permissions = {}) => {
  const status = purchaseCase?.status || 'initiated';
  const actions = {
    [ACTION_CATEGORIES.DOCUMENTS]: [],
    [ACTION_CATEGORIES.PAYMENTS]: [],
    [ACTION_CATEGORIES.APPOINTMENTS]: [],
    [ACTION_CATEGORIES.VALIDATIONS]: [],
    [ACTION_CATEGORIES.OPTIONAL]: []
  };
  
  console.log('🔍 [ContextualActions] getSellerActions appelé:', {
    status,
    hasNotary: !!purchaseCase?.notaire_id,
    permissions
  });
  
  const result = getSellerActionsInternal(status, purchaseCase, permissions, actions);
  
  console.log('✅ [ContextualActions] getSellerActions résultat:', {
    validations: result.validations?.length || 0,
    documents: result.documents?.length || 0,
    appointments: result.appointments?.length || 0,
    optional: result.optional?.length || 0
  });
  
  return result;
};

// Export named functions for direct use
export { getBuyerActions, getSellerActions, getNotaireActions };

export default {
  getAvailableActions,
  getBuyerActions,
  getSellerActions,
  getNotaireActions,
  ACTION_CATEGORIES,
  WORKFLOW_STATES
};
