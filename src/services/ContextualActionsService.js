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
  const status = purchaseCase?.status || purchaseCase?.current_status || 'initiated';
  const actions = {
    [ACTION_CATEGORIES.DOCUMENTS]: [],
    [ACTION_CATEGORIES.PAYMENTS]: [],
    [ACTION_CATEGORIES.APPOINTMENTS]: [],
    [ACTION_CATEGORIES.VALIDATIONS]: [],
    [ACTION_CATEGORIES.OPTIONAL]: []
  };

  switch (userRole) {
    case 'buyer':
      return getBuyerActions(status, purchaseCase, permissions, actions);
    case 'seller':
      return getSellerActions(status, purchaseCase, permissions, actions);
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
const getBuyerActions = (status, purchaseCase, permissions, actions) => {
  // OPTIONAL: Choose agent/surveyor (available early in workflow)
  if ([WORKFLOW_STATES.INITIATED, WORKFLOW_STATES.BUYER_VERIFICATION].includes(status)) {
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
  if (status === WORKFLOW_STATES.BUYER_VERIFICATION) {
    actions[ACTION_CATEGORIES.DOCUMENTS].push({
      id: 'upload_buyer_identity',
      label: 'Uploader pièce d\'identité',
      icon: 'Upload',
      description: 'CNI ou passeport requis',
      handler: 'onUploadBuyerIdentity',
      docType: 'buyer_id'
    });
  }

  // PAYMENTS: Deposit payment
  if (status === WORKFLOW_STATES.DEPOSIT_PENDING && permissions.canConfirmPayment) {
    actions[ACTION_CATEGORIES.PAYMENTS].push({
      id: 'pay_deposit',
      label: 'Payer acompte (15%)',
      icon: 'CreditCard',
      amount: purchaseCase.deposit_amount || (purchaseCase.final_price * 0.15),
      description: 'Paiement de l\'acompte',
      handler: 'onPayDeposit'
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
const getSellerActions = (status, purchaseCase, permissions, actions) => {
  // VALIDATIONS: Accept offer (if applicable)
  if (status === WORKFLOW_STATES.SELLER_NOTIFICATION) {
    actions[ACTION_CATEGORIES.VALIDATIONS].push({
      id: 'accept_offer',
      label: 'Accepter l\'offre',
      icon: 'CheckCircle',
      description: 'Confirmer la vente',
      handler: 'onAcceptOffer'
    });
  }

  // DOCUMENTS: Upload title deed
  if ([WORKFLOW_STATES.DOCUMENT_COLLECTION, WORKFLOW_STATES.TITLE_VERIFICATION].includes(status)) {
    actions[ACTION_CATEGORIES.DOCUMENTS].push({
      id: 'upload_title_deed',
      label: 'Uploader titre foncier',
      icon: 'Upload',
      description: 'Titre de propriété obligatoire',
      handler: 'onUploadTitleDeed',
      docType: 'seller_title'
    });
  }

  // VALIDATIONS: Validate contract
  if (status === WORKFLOW_STATES.CONTRACT_VALIDATION && permissions.canValidateContract) {
    actions[ACTION_CATEGORIES.VALIDATIONS].push({
      id: 'validate_contract',
      label: 'Valider le contrat',
      icon: 'CheckCircle',
      description: 'Approuver le contrat proposé',
      handler: 'onValidateContract'
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

  return actions;
};

/**
 * NOTAIRE ACTIONS
 */
const getNotaireActions = (status, purchaseCase, permissions, actions) => {
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

export default {
  getAvailableActions,
  ACTION_CATEGORIES,
  WORKFLOW_STATES
};
