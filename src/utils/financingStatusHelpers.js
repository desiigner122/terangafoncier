/**
 * 🏦 Helper Functions pour les Statuts de Financement Bancaire
 * 
 * Système de double suivi :
 * - Côté Banque (blue) : Traitement de la demande de prêt
 * - Côté Vendeur (amber) : Réponse du propriétaire du terrain
 */

import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Shield, 
  Users,
  Building2
} from 'lucide-react';

/**
 * Retourne la configuration du badge pour le statut côté BANQUE
 * @param {string} status - Le statut bancaire (pending, under_review, approved, rejected, conditional)
 * @returns {object} { label, color, icon }
 */
export const getBankStatusBadge = (status) => {
  const statuses = {
    pending: { 
      label: 'En cours d\'étude', 
      color: 'bg-blue-100 text-blue-800', 
      icon: Clock 
    },
    en_attente: { 
      label: 'En cours d\'étude', 
      color: 'bg-blue-100 text-blue-800', 
      icon: Clock 
    },
    under_review: { 
      label: 'Analyse en cours', 
      color: 'bg-yellow-100 text-yellow-800', 
      icon: FileText 
    },
    en_cours_etude: { 
      label: 'Analyse en cours', 
      color: 'bg-yellow-100 text-yellow-800', 
      icon: FileText 
    },
    approved: { 
      label: 'Approuvé par la banque', 
      color: 'bg-green-100 text-green-800', 
      icon: CheckCircle 
    },
    pre_approuve: { 
      label: 'Pré-approuvé', 
      color: 'bg-emerald-100 text-emerald-800', 
      icon: CheckCircle 
    },
    rejected: { 
      label: 'Refusé par la banque', 
      color: 'bg-red-100 text-red-800', 
      icon: AlertCircle 
    },
    refuse: { 
      label: 'Refusé par la banque', 
      color: 'bg-red-100 text-red-800', 
      icon: AlertCircle 
    },
    conditional: { 
      label: 'Accord conditionnel', 
      color: 'bg-purple-100 text-purple-800', 
      icon: Shield 
    }
  };
  
  return statuses[status] || statuses.pending;
};

/**
 * Retourne la configuration du badge pour le statut côté VENDEUR
 * @param {string} status - Le statut vendeur (pending, accepted, rejected, negotiating)
 * @returns {object} { label, color, icon }
 */
export const getVendorStatusBadge = (status) => {
  const statuses = {
    pending: { 
      label: 'En attente vendeur', 
      color: 'bg-amber-100 text-amber-800', 
      icon: Clock 
    },
    accepted: { 
      label: 'Accepté par vendeur', 
      color: 'bg-green-100 text-green-800', 
      icon: CheckCircle 
    },
    rejected: { 
      label: 'Refusé par vendeur', 
      color: 'bg-red-100 text-red-800', 
      icon: AlertCircle 
    },
    negotiating: { 
      label: 'En négociation', 
      color: 'bg-blue-100 text-blue-800', 
      icon: Users 
    },
    processing: { 
      label: 'En traitement', 
      color: 'bg-indigo-100 text-indigo-800', 
      icon: Clock 
    },
    completed: { 
      label: 'Finalisé', 
      color: 'bg-emerald-100 text-emerald-800', 
      icon: CheckCircle 
    }
  };
  
  return statuses[status] || statuses.pending;
};

/**
 * Retourne l'icône appropriée pour le type de paiement
 * @param {string} paymentType - Type de paiement (one_time, installments, bank_financing)
 * @returns {React.Component} Icône Lucide
 */
export const getPaymentTypeIcon = (paymentType) => {
  const icons = {
    one_time: Clock,
    installments: FileText,
    bank_financing: Building2
  };
  
  return icons[paymentType] || Clock;
};

/**
 * Formate un montant en FCFA
 * @param {number} amount - Montant à formater
 * @returns {string} Montant formaté
 */
export const formatCurrency = (amount) => {
  if (!amount) return '0 FCFA';
  return new Intl.NumberFormat('fr-SN', { 
    style: 'currency', 
    currency: 'XOF',
    maximumFractionDigits: 0 
  }).format(amount);
};

/**
 * Retourne un message informatif sur le double suivi
 * @returns {string} Message explicatif
 */
export const getDoubleTrackingInfo = () => {
  return `
    🏦 CÔTÉ BANQUE : Suivez l'avancement de votre demande de prêt
    👤 CÔTÉ VENDEUR : Suivez la réponse du propriétaire du terrain
    
    Ces deux processus sont indépendants et peuvent évoluer en parallèle.
  `;
};

/**
 * Détermine si une demande nécessite une action de l'utilisateur
 * @param {string} bankStatus - Statut bancaire
 * @param {string} vendorStatus - Statut vendeur
 * @returns {boolean} true si action requise
 */
export const requiresUserAction = (bankStatus, vendorStatus) => {
  const actionRequiredStatuses = ['conditional', 'negotiating'];
  return actionRequiredStatuses.includes(bankStatus) || actionRequiredStatuses.includes(vendorStatus);
};

/**
 * Retourne un score de progression global (0-100)
 * @param {string} bankStatus - Statut bancaire
 * @param {string} vendorStatus - Statut vendeur
 * @returns {number} Score de progression
 */
export const getProgressScore = (bankStatus, vendorStatus) => {
  const bankScores = {
    pending: 10,
    en_attente: 10,
    under_review: 30,
    en_cours_etude: 30,
    conditional: 60,
    pre_approuve: 70,
    approved: 100,
    rejected: 0,
    refuse: 0
  };
  
  const vendorScores = {
    pending: 10,
    processing: 30,
    negotiating: 50,
    accepted: 100,
    rejected: 0,
    completed: 100
  };
  
  const bankScore = bankScores[bankStatus] || 10;
  const vendorScore = vendorScores[vendorStatus] || 10;
  
  // Moyenne pondérée (60% banque, 40% vendeur)
  return Math.round((bankScore * 0.6) + (vendorScore * 0.4));
};
