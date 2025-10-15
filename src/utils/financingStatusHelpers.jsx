import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Shield,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Users
} from 'lucide-react';

/**
 * Obtient le badge de statut pour le côté banque
 * @param {string} bankStatus - Statut de la banque
 * @returns {JSX.Element} Badge avec icône et label
 */
export const getBankStatusBadge = (bankStatus) => {
  const statusConfig = {
    en_attente: { 
      color: 'bg-blue-100 text-blue-800 border-blue-300', 
      label: 'En attente',
      icon: Clock 
    },
    en_cours_etude: { 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300', 
      label: 'En cours d\'étude',
      icon: FileText 
    },
    analyse_en_cours: { 
      color: 'bg-amber-100 text-amber-800 border-amber-300', 
      label: 'Analyse en cours',
      icon: FileText 
    },
    pre_approuve: { 
      color: 'bg-purple-100 text-purple-800 border-purple-300', 
      label: 'Pré-approuvé',
      icon: Shield 
    },
    approuve: { 
      color: 'bg-green-100 text-green-800 border-green-300', 
      label: 'Approuvé',
      icon: CheckCircle 
    },
    approved: { 
      color: 'bg-green-100 text-green-800 border-green-300', 
      label: 'Approuvé',
      icon: CheckCircle 
    },
    rejete: { 
      color: 'bg-red-100 text-red-800 border-red-300', 
      label: 'Rejeté',
      icon: XCircle 
    },
    rejected: { 
      color: 'bg-red-100 text-red-800 border-red-300', 
      label: 'Rejeté',
      icon: XCircle 
    },
    documents_requis: { 
      color: 'bg-orange-100 text-orange-800 border-orange-300', 
      label: 'Documents requis',
      icon: AlertCircle 
    },
    under_review: { 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300', 
      label: 'Analyse en cours',
      icon: FileText 
    },
    conditional: { 
      color: 'bg-purple-100 text-purple-800 border-purple-300', 
      label: 'Accord conditionnel',
      icon: Shield 
    },
    pending: { 
      color: 'bg-blue-100 text-blue-800 border-blue-300', 
      label: 'En cours d\'étude',
      icon: Clock 
    }
  };
  
  const config = statusConfig[bankStatus] || statusConfig.en_attente;
  const Icon = config.icon;
  
  return (
    <Badge className={`${config.color} border flex items-center gap-1`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

/**
 * Obtient le badge de statut pour le côté vendeur
 * @param {string} vendorStatus - Statut du vendeur
 * @returns {JSX.Element} Badge avec icône et label
 */
export const getVendorStatusBadge = (vendorStatus) => {
  const statusConfig = {
    pending: { 
      color: 'bg-amber-100 text-amber-800 border-amber-300', 
      label: 'En attente vendeur',
      icon: Clock 
    },
    en_attente: { 
      color: 'bg-amber-100 text-amber-800 border-amber-300', 
      label: 'En attente vendeur',
      icon: Clock 
    },
    accepted: { 
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300', 
      label: 'Accepté par vendeur',
      icon: CheckCircle2 
    },
    accepte: { 
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300', 
      label: 'Accepté',
      icon: CheckCircle2 
    },
    negotiating: { 
      color: 'bg-orange-100 text-orange-800 border-orange-300', 
      label: 'En négociation',
      icon: MessageSquare 
    },
    en_negociation: { 
      color: 'bg-orange-100 text-orange-800 border-orange-300', 
      label: 'En négociation',
      icon: MessageSquare 
    },
    rejected: { 
      color: 'bg-rose-100 text-rose-800 border-rose-300', 
      label: 'Refusé par vendeur',
      icon: XCircle 
    },
    refuse: { 
      color: 'bg-rose-100 text-rose-800 border-rose-300', 
      label: 'Refusé',
      icon: XCircle 
    }
  };
  
  const config = statusConfig[vendorStatus] || statusConfig.pending;
  const Icon = config.icon;
  
  return (
    <Badge className={`${config.color} border flex items-center gap-1`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

/**
 * Formate un montant en FCFA
 * @param {number} amount - Montant à formater
 * @returns {string} Montant formaté
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'N/A';
  
  return new Intl.NumberFormat('fr-SN', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Calcule le score de progression d'une demande
 * @param {object} request - Demande de financement
 * @returns {number} Score de 0 à 100
 */
export const getProgressScore = (request) => {
  let score = 0;
  
  // Documents fournis (40%)
  if (request.documents_fournis && request.documents_requis) {
    score += (request.documents_fournis / request.documents_requis) * 40;
  }
  
  // Statut banque (30%)
  const bankScores = {
    en_attente: 5,
    en_cours_etude: 15,
    analyse_en_cours: 15,
    documents_requis: 10,
    pre_approuve: 25,
    approuve: 30,
    approved: 30,
    rejected: 0,
    rejete: 0
  };
  score += bankScores[request.bank_status] || 0;
  
  // Statut vendeur (30%)
  const vendorScores = {
    pending: 10,
    en_attente: 10,
    negotiating: 20,
    en_negociation: 20,
    accepted: 30,
    accepte: 30,
    rejected: 0,
    refuse: 0
  };
  score += vendorScores[request.vendor_status || request.status] || 0;
  
  return Math.min(Math.round(score), 100);
};

/**
 * Obtient la couleur du score de progression
 * @param {number} score - Score de 0 à 100
 * @returns {string} Classe Tailwind CSS
 */
export const getProgressColor = (score) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-blue-500';
  if (score >= 40) return 'bg-yellow-500';
  if (score >= 20) return 'bg-orange-500';
  return 'bg-red-500';
};

/**
 * Obtient le libellé du type de financement
 * @param {string} type - Type de financement
 * @returns {string} Libellé lisible
 */
export const getFinancingTypeLabel = (type) => {
  const types = {
    credit_immobilier: 'Crédit Immobilier',
    credit_terrain: 'Crédit Terrain',
    credit_construction: 'Crédit Construction',
    credit_renovation: 'Crédit Rénovation',
    investissement_locatif: 'Investissement Locatif',
    bank_financing: 'Financement Bancaire',
    one_time: 'Paiement Comptant',
    installments: 'Paiement Échelonné'
  };
  return types[type] || type;
};

/**
 * Vérifie si une demande est approuvée des deux côtés
 * @param {object} request - Demande de financement
 * @returns {boolean} True si approuvée des deux côtés
 */
export const isFullyApproved = (request) => {
  const bankApproved = ['approuve', 'approved', 'pre_approuve'].includes(request.bank_status);
  const vendorApproved = ['accepte', 'accepted'].includes(request.vendor_status || request.status);
  return bankApproved && vendorApproved;
};

/**
 * Vérifie si une demande est rejetée d'au moins un côté
 * @param {object} request - Demande de financement
 * @returns {boolean} True si rejetée
 */
export const isRejected = (request) => {
  const bankRejected = ['rejete', 'rejected'].includes(request.bank_status);
  const vendorRejected = ['refuse', 'rejected'].includes(request.vendor_status || request.status);
  return bankRejected || vendorRejected;
};

/**
 * Obtient le message d'étape suivante pour l'utilisateur
 * @param {object} request - Demande de financement
 * @returns {string} Message d'action suggérée
 */
export const getNextStepMessage = (request) => {
  // Rejeté
  if (isRejected(request)) {
    return '❌ Cette demande a été rejetée. Vous pouvez soumettre une nouvelle demande.';
  }
  
  // Approuvé des deux côtés
  if (isFullyApproved(request)) {
    return '✅ Félicitations ! Votre financement est approuvé. Contactez-nous pour finaliser.';
  }
  
  // Documents manquants
  if (request.bank_status === 'documents_requis') {
    const missing = (request.documents_requis || 0) - (request.documents_fournis || 0);
    return `📄 Veuillez fournir ${missing} document(s) supplémentaire(s) pour continuer.`;
  }
  
  // En attente vendeur
  if (request.bank_status === 'approuve' && request.vendor_status === 'pending') {
    return '⏳ Banque approuvée ! En attente de la réponse du vendeur.';
  }
  
  // En attente banque
  if (request.vendor_status === 'accepted' && request.bank_status === 'en_cours_etude') {
    return '⏳ Vendeur d\'accord ! En attente de l\'approbation bancaire.';
  }
  
  // En cours d'analyse
  return '⏳ Votre demande est en cours d\'analyse. Vous serez notifié de toute mise à jour.';
};
