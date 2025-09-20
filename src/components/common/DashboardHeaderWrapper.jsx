import React from 'react';
import UnifiedDashboardHeader from './UnifiedDashboardHeader';

// Configuration des titres et sous-titres par rôle
const DASHBOARD_CONFIG = {
  'Particulier': {
    title: 'Espace Acheteur',
    subtitle: 'Trouvez et achetez votre bien immobilier idéal'
  },
  'Vendeur': {
    title: 'Espace Vendeur',
    subtitle: 'Gérez vos parcelles et vos ventes'
  },
  'Promoteur': {
    title: 'Espace Promoteur',
    subtitle: 'Développez et commercialisez vos projets'
  },
  'Agent Foncier': {
    title: 'Espace Agent Foncier',
    subtitle: 'Accompagnez les transactions immobilières'
  },
  'Notaire': {
    title: 'Espace Notaire',
    subtitle: 'Authentifiez les actes et transactions'
  },
  'Banque': {
    title: 'Espace Bancaire',
    subtitle: 'Gérez les financements et crédits'
  },
  'Géomètre': {
    title: 'Espace Géomètre',
    subtitle: 'Délimitez et mesurez les terrains'
  },
  'Investisseur': {
    title: 'Espace Investisseur',
    subtitle: 'Découvrez les opportunités d\'investissement'
  },
  'Municipalité': {
    title: 'Espace Municipal',
    subtitle: 'Administrez les terrains communaux'
  }
};

/**
 * Hook pour obtenir la configuration d'un dashboard par rôle
 */
export const useDashboardConfig = (userRole) => {
  return DASHBOARD_CONFIG[userRole] || {
    title: 'Tableau de Bord',
    subtitle: 'Plateforme immobilière TerangaFoncier'
  };
};

/**
 * Composant wrapper qui configure automatiquement le header selon le rôle
 */
const DashboardHeaderWrapper = ({ 
  userRole, 
  customTitle, 
  customSubtitle,
  showQuickActions = true,
  showSearch = true,
  enableNotifications = true,
  customActions = []
}) => {
  const config = useDashboardConfig(userRole);
  
  return (
    <UnifiedDashboardHeader
      title={customTitle || config.title}
      subtitle={customSubtitle || config.subtitle}
      userRole={userRole}
      showQuickActions={showQuickActions}
      showSearch={showSearch}
      enableNotifications={enableNotifications}
      customActions={customActions}
    />
  );
};

/**
 * Configuration des actions rapides spécialisées par type de dashboard
 */
export const DASHBOARD_ACTIONS = {
  // Actions pour les vendeurs
  seller: [
    { icon: 'PlusCircle', label: 'Nouvelle Parcelle', onClick: () => navigate('/seller/add-parcel'), className: 'bg-green-500 text-white' },
    { icon: 'BarChart3', label: 'Analyses', onClick: () => navigate('/seller/analytics'), className: 'bg-blue-500 text-white' }
  ],
  
  // Actions pour les promoteurs
  promoter: [
    { icon: 'Building2', label: 'Nouveau Projet', onClick: () => navigate('/developer/new-project'), className: 'bg-purple-500 text-white' },
    { icon: 'Users', label: 'Prospects', onClick: () => navigate('/developer/prospects'), className: 'bg-orange-500 text-white' }
  ],
  
  // Actions pour les agents fonciers
  agent: [
    { icon: 'UserPlus', label: 'Nouveau Client', onClick: () => navigate('/agent/add-client'), className: 'bg-teal-500 text-white' },
    { icon: 'FileCheck', label: 'Dossiers', onClick: () => navigate('/agent/cases'), className: 'bg-indigo-500 text-white' }
  ]
};

export default DashboardHeaderWrapper;