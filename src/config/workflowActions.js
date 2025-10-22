/**
 * Configuration des actions disponibles pour chaque étape du workflow
 * pour l'acheteur et le vendeur
 */

export const workflowActions = {
  // Actions pour l'acheteur
  buyer: {
    initiated: {
      label: 'Confirmer mon offre',
      description: 'Je confirme mon intérêt pour ce terrain',
      nextStage: 'buyer_verification',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
    },
    buyer_verification: {
      label: 'Documents fournis',
      description: 'J\'ai fourni tous les documents requis',
      nextStage: 'seller_notification',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
    },
    preliminary_agreement: {
      label: 'Accepter l\'accord préliminaire',
      description: 'J\'accepte les termes de l\'accord préliminaire',
      nextStage: 'contract_preparation',
      buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
    },
    contract_preparation: {
      label: 'Valider le contrat',
      description: 'J\'ai lu et validé le contrat proposé',
      nextStage: 'legal_verification',
      buttonColor: 'bg-cyan-600 hover:bg-cyan-700',
    },
    signing_process: {
      label: 'Signer le compromis',
      description: 'Je suis prêt à signer le compromis de vente',
      nextStage: 'payment_processing',
      buttonColor: 'bg-violet-600 hover:bg-violet-700',
    },
    payment_processing: {
      label: 'Confirmer le paiement',
      description: 'J\'ai effectué le virement bancaire',
      nextStage: 'completed',
      buttonColor: 'bg-amber-600 hover:bg-amber-700',
    },
  },

  // Actions pour le vendeur
  seller: {
    seller_notification: {
      label: 'Accepter la demande',
      description: 'J\'accepte de vendre à cet acheteur',
      nextStage: 'preliminary_agreement',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      rejectOption: {
        label: 'Refuser la demande',
        description: 'Je refuse cette offre',
        nextStage: 'rejected',
        buttonColor: 'bg-red-600 hover:bg-red-700',
      },
    },
    preliminary_agreement: {
      label: 'Signer l\'accord préliminaire',
      description: 'Je signe l\'accord préliminaire',
      nextStage: 'contract_preparation',
      buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
    },
    contract_preparation: {
      label: 'Valider le contrat',
      description: 'J\'approuve les termes du contrat',
      nextStage: 'legal_verification',
      buttonColor: 'bg-cyan-600 hover:bg-cyan-700',
    },
    signing_process: {
      label: 'Signer le compromis',
      description: 'Je suis prêt à signer le compromis de vente',
      nextStage: 'payment_processing',
      buttonColor: 'bg-violet-600 hover:bg-violet-700',
    },
    payment_processing: {
      label: 'Confirmer réception',
      description: 'J\'ai reçu le paiement',
      nextStage: 'completed',
      buttonColor: 'bg-amber-600 hover:bg-amber-700',
    },
  },

  // Actions pour le notaire
  notary: {
    legal_verification: {
      label: 'Valider les documents légaux',
      description: 'Tous les documents sont conformes',
      nextStage: 'document_audit',
      buttonColor: 'bg-indigo-600 hover:bg-indigo-700',
    },
    document_audit: {
      label: 'Audit terminé',
      description: 'L\'audit des documents est complet',
      nextStage: 'property_evaluation',
      buttonColor: 'bg-pink-600 hover:bg-pink-700',
    },
    notary_appointment: {
      label: 'Rendez-vous fixé',
      description: 'Le rendez-vous de signature est planifié',
      nextStage: 'signing_process',
      buttonColor: 'bg-teal-600 hover:bg-teal-700',
    },
  },

  // Actions pour le géomètre
  geometre: {
    property_evaluation: {
      label: 'Évaluation terminée',
      description: 'Le bornage et l\'évaluation sont faits',
      nextStage: 'notary_appointment',
      buttonColor: 'bg-green-600 hover:bg-green-700',
    },
  },
};

/**
 * Obtenir l'action disponible pour un rôle à une étape donnée
 */
export const getActionForStage = (role, currentStage) => {
  return workflowActions[role]?.[currentStage] || null;
};

/**
 * Vérifier si un rôle peut agir à une étape donnée
 */
export const canActOnStage = (role, currentStage) => {
  return !!workflowActions[role]?.[currentStage];
};
