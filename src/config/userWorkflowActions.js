/**
 * Configuration des actions pour Acheteurs et Vendeurs
 * Actions disponibles par rôle et par étape du workflow
 * AVANT que le notaire ne prenne la main
 */

export const buyerActions = {
  // Phase 0: Initiation - Acheteur attend réponse vendeur
  'seller_notification': {
    label: 'En attente du vendeur',
    action: 'wait_seller_response',
    nextStatus: null, // Pas de changement, attente passive
    icon: 'Clock',
    color: 'gray',
    disabled: true,
    description: 'Le vendeur examine votre offre d\'achat',
    canCancel: true, // Peut annuler sa demande
  },

  // Phase 1: Pré-contractuelle - Actions acheteur
  'preliminary_agreement': {
    label: 'Signer l\'accord préliminaire',
    action: 'sign_preliminary_agreement',
    nextStatus: 'deposit_payment',
    icon: 'FileSignature',
    color: 'blue',
    description: 'Signer la promesse de vente',
    requiresDocument: true,
    documentType: 'preliminary_agreement',
  },

  'deposit_payment': {
    label: 'Payer les arrhes (10%)',
    action: 'pay_deposit',
    nextStatus: 'title_verification',
    icon: 'CreditCard',
    color: 'green',
    description: 'Verser les arrhes pour sécuriser l\'achat',
    requiresPayment: true,
    paymentType: 'deposit',
    paymentMethods: ['wave', 'orange_money', 'bank_transfer', 'card'],
  },

  // Phase 3: Après due diligence - Payer frais notaire
  'fees_payment_pending': {
    label: 'Payer les frais de notaire',
    action: 'pay_notary_fees',
    nextStatus: 'contract_preparation',
    icon: 'Banknote',
    color: 'amber',
    description: 'Régler les frais de notaire (17.5%)',
    requiresPayment: true,
    paymentType: 'notary_fees',
    paymentMethods: ['wave', 'orange_money', 'bank_transfer', 'card'],
  },

  // Phase 4: Contractuelle - Signer contrat
  'contract_preparation': {
    label: 'En attente du contrat',
    action: 'wait_contract',
    nextStatus: null,
    icon: 'FileText',
    color: 'gray',
    disabled: true,
    description: 'Le notaire prépare le contrat de vente',
  },

  'signing_appointment': {
    label: 'Confirmer RDV signature',
    action: 'confirm_signing_appointment',
    nextStatus: 'final_payment_pending',
    icon: 'Calendar',
    color: 'purple',
    description: 'Confirmer votre disponibilité pour la signature',
    requiresAppointment: true,
  },

  // Phase 5: Paiement Final
  'final_payment_pending': {
    label: 'Payer le solde (90%)',
    action: 'pay_final_amount',
    nextStatus: 'property_registration',
    icon: 'Landmark',
    color: 'green',
    description: 'Verser le solde du prix d\'achat',
    requiresPayment: true,
    paymentType: 'final_payment',
    paymentMethods: ['wave', 'orange_money', 'bank_transfer', 'card'],
    criticalAction: true,
  },

  // Phase 6: Post-contractuelle - Attente administrative
  'property_registration': {
    label: 'Enregistrement en cours',
    action: 'wait_registration',
    nextStatus: null,
    icon: 'FileCheck',
    color: 'gray',
    disabled: true,
    description: 'Le notaire enregistre au Livre Foncier',
  },

  'property_transfer': {
    label: 'Transfert en cours',
    action: 'wait_transfer',
    nextStatus: null,
    icon: 'ArrowRightLeft',
    color: 'gray',
    disabled: true,
    description: 'Transfert de propriété en cours',
  },
};

export const sellerActions = {
  // Phase 0: Initiation - Vendeur reçoit offre
  'seller_notification': {
    label: 'Accepter l\'offre d\'achat',
    action: 'accept_purchase_offer',
    nextStatus: 'preliminary_agreement',
    icon: 'CheckCircle',
    color: 'green',
    description: 'Accepter l\'offre et créer le dossier',
    canDecline: true, // Peut décliner l'offre
  },

  // Phase 1: Pré-contractuelle - Actions vendeur
  'preliminary_agreement': {
    label: 'Signer l\'accord préliminaire',
    action: 'sign_preliminary_agreement',
    nextStatus: 'deposit_payment',
    icon: 'FileSignature',
    color: 'blue',
    description: 'Signer la promesse de vente',
    requiresDocument: true,
    documentType: 'preliminary_agreement',
  },

  'deposit_payment': {
    label: 'En attente des arrhes',
    action: 'wait_deposit',
    nextStatus: null,
    icon: 'Clock',
    color: 'gray',
    disabled: true,
    description: 'L\'acheteur doit verser les arrhes',
  },

  'title_verification': {
    label: 'Fournir documents propriété',
    action: 'provide_property_documents',
    nextStatus: 'property_survey',
    icon: 'Upload',
    color: 'blue',
    description: 'Uploader titres fonciers et documents légaux',
    requiresDocuments: true,
    documentTypes: ['title_deed', 'land_certificate', 'tax_receipts'],
  },

  // Phase 2: Due Diligence - Fournir documents
  'property_survey': {
    label: 'Autoriser visite Conservateur',
    action: 'authorize_survey',
    nextStatus: 'certificate_verification',
    icon: 'Key',
    color: 'cyan',
    description: 'Autoriser l\'enquête au Livre Foncier',
  },

  'certificate_verification': {
    label: 'Fournir certificats manquants',
    action: 'provide_certificates',
    nextStatus: 'tax_clearance',
    icon: 'FileCheck',
    color: 'teal',
    description: 'Fournir certificats de non-hypothèque, conformité',
    requiresDocuments: true,
    documentTypes: ['non_mortgage_cert', 'compliance_cert'],
  },

  'tax_clearance': {
    label: 'Régler taxes foncières',
    action: 'settle_property_taxes',
    nextStatus: 'land_survey',
    icon: 'Receipt',
    color: 'amber',
    description: 'Payer toutes taxes foncières en souffrance',
    requiresProof: true,
  },

  'land_survey': {
    label: 'Autoriser bornage',
    action: 'authorize_land_survey',
    nextStatus: 'notary_fees_calculation',
    icon: 'MapPin',
    color: 'orange',
    description: 'Permettre géomètre de faire le bornage',
  },

  // Phase 3-4: Attente notaire et acheteur
  'notary_fees_calculation': {
    label: 'En attente du notaire',
    action: 'wait_notary_fees',
    nextStatus: null,
    icon: 'Calculator',
    color: 'gray',
    disabled: true,
    description: 'Le notaire calcule les frais',
  },

  'fees_payment_pending': {
    label: 'En attente paiement acheteur',
    action: 'wait_buyer_payment',
    nextStatus: null,
    icon: 'Clock',
    color: 'gray',
    disabled: true,
    description: 'L\'acheteur doit payer les frais de notaire',
  },

  'contract_preparation': {
    label: 'En attente du contrat',
    action: 'wait_contract',
    nextStatus: null,
    icon: 'FileText',
    color: 'gray',
    disabled: true,
    description: 'Le notaire prépare le contrat final',
  },

  'signing_appointment': {
    label: 'Confirmer RDV signature',
    action: 'confirm_signing_appointment',
    nextStatus: 'final_payment_pending',
    icon: 'Calendar',
    color: 'purple',
    description: 'Confirmer votre disponibilité pour la signature',
    requiresAppointment: true,
  },

  // Phase 5: Paiement final - Attente
  'final_payment_pending': {
    label: 'En attente du solde',
    action: 'wait_final_payment',
    nextStatus: null,
    icon: 'Hourglass',
    color: 'gray',
    disabled: true,
    description: 'L\'acheteur doit verser le solde',
  },

  // Phase 6: Post-contractuelle - Attente administrative
  'property_registration': {
    label: 'Enregistrement en cours',
    action: 'wait_registration',
    nextStatus: null,
    icon: 'FileCheck',
    color: 'gray',
    disabled: true,
    description: 'Le notaire enregistre au Livre Foncier',
  },

  'property_transfer': {
    label: 'Remettre les clés',
    action: 'handover_property',
    nextStatus: 'completed',
    icon: 'Key',
    color: 'green',
    description: 'Remettre les clés et finaliser le transfert',
    finalAction: true,
  },
};

/**
 * Obtenir l'action disponible pour un utilisateur selon son rôle et le statut
 */
export function getUserAction(userRole, currentStatus) {
  if (userRole === 'buyer' || userRole === 'Acheteur') {
    return buyerActions[currentStatus] || null;
  }
  
  if (userRole === 'seller' || userRole === 'Vendeur' || userRole === 'vendeur') {
    return sellerActions[currentStatus] || null;
  }
  
  return null;
}

/**
 * Vérifier si l'utilisateur peut agir sur cette étape
 */
export function canUserAct(userRole, currentStatus, userId, caseData) {
  const action = getUserAction(userRole, currentStatus);
  
  if (!action) return false;
  if (action.disabled) return false;
  
  // Vérifier que l'utilisateur est bien partie du dossier
  if (userRole === 'buyer' && caseData.buyer_id !== userId) return false;
  if (userRole === 'seller' && caseData.seller_id !== userId) return false;
  
  return true;
}

/**
 * Obtenir toutes les actions passées et futures pour l'utilisateur
 */
export function getUserWorkflowActions(userRole, currentStatus) {
  const actions = userRole === 'buyer' ? buyerActions : sellerActions;
  const actionKeys = Object.keys(actions);
  
  const currentIndex = actionKeys.indexOf(currentStatus);
  
  return {
    completed: currentIndex >= 0 ? actionKeys.slice(0, currentIndex) : [],
    current: currentStatus,
    upcoming: currentIndex >= 0 ? actionKeys.slice(currentIndex + 1) : actionKeys,
  };
}

export default {
  buyerActions,
  sellerActions,
  getUserAction,
  canUserAct,
  getUserWorkflowActions,
};
