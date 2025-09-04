// Configuration des rôles et permissions
export const ROLES = {
  ADMIN: 'Admin',
  AGENT_FONCIER: 'Agent Foncier',
  PARTICULIER: 'Particulier',
  VENDEUR_PARTICULIER: 'Vendeur Particulier',
  VENDEUR_PRO: 'Vendeur Pro',
  BANQUE: 'Banque',
  MAIRIE: 'Mairie',
  NOTAIRE: 'Notaire',
  GEOMETRE: 'Geometre',
  INVESTISSEUR: 'Investisseur',
  PROMOTEUR: 'Promoteur',
  AGRICULTEUR: 'Agriculteur'
};

// Groupes de rôles pour simplifier les permissions
export const ROLE_GROUPS = {
  VENDEURS: [ROLES.VENDEUR_PARTICULIER, ROLES.VENDEUR_PRO],
  PROFESSIONNELS: [ROLES.BANQUE, ROLES.MAIRIE, ROLES.NOTAIRE, ROLES.GEOMETRE],
  USERS: [ROLES.PARTICULIER, ROLES.INVESTISSEUR, ROLES.PROMOTEUR, ROLES.AGRICULTEUR],
  ALL_EXCEPT_ADMIN: [
    ROLES.AGENT_FONCIER, ROLES.PARTICULIER, ROLES.VENDEUR_PARTICULIER, 
    ROLES.VENDEUR_PRO, ROLES.BANQUE, ROLES.MAIRIE, ROLES.NOTAIRE, 
    ROLES.GEOMETRE, ROLES.INVESTISSEUR, ROLES.PROMOTEUR, ROLES.AGRICULTEUR
  ]
};

// Configuration des permissions par page/fonctionnalité
export const PERMISSIONS = {
  // Pages générales
  DASHBOARD: [...ROLE_GROUPS.ALL_EXCEPT_ADMIN],
  PROFILE: [...ROLE_GROUPS.ALL_EXCEPT_ADMIN],
  SETTINGS: [...ROLE_GROUPS.ALL_EXCEPT_ADMIN],
  NOTIFICATIONS: [...ROLE_GROUPS.ALL_EXCEPT_ADMIN],
  MESSAGING: [...ROLE_GROUPS.ALL_EXCEPT_ADMIN],
  
  // Pages spécifiques aux particuliers
  MY_REQUESTS: [ROLES.PARTICULIER],
  FAVORITES: [ROLES.PARTICULIER, ROLES.INVESTISSEUR],
  REQUEST_MUNICIPAL_LAND: [ROLES.PARTICULIER],
  DIGITAL_VAULT: [ROLES.PARTICULIER],
  
  // Pages spécifiques aux vendeurs
  SELL_PROPERTY: [...ROLE_GROUPS.VENDEURS, ROLES.MAIRIE],
  MY_LISTINGS: [...ROLE_GROUPS.VENDEURS],
  ADD_PARCEL: [...ROLE_GROUPS.VENDEURS, ROLES.MAIRIE],
  
  // Pages admin
  ADMIN_DASHBOARD: [ROLES.ADMIN],
  ADMIN_USERS: [ROLES.ADMIN],
  ADMIN_PARCELS: [ROLES.ADMIN],
  ADMIN_REPORTS: [ROLES.ADMIN],
  ADMIN_BLOG: [ROLES.ADMIN],
  ADMIN_AUDIT: [ROLES.ADMIN],
  ADMIN_SETTINGS: [ROLES.ADMIN],
  ADMIN_CONTRACTS: [ROLES.ADMIN],
  ADMIN_SYSTEM_REQUESTS: [ROLES.ADMIN],
  ADMIN_USER_REQUESTS: [ROLES.ADMIN],
  
  // Pages agent foncier
  AGENT_DASHBOARD: [ROLES.AGENT_FONCIER],
  AGENT_CLIENTS: [ROLES.AGENT_FONCIER],
  AGENT_PARCELS: [ROLES.AGENT_FONCIER],
  AGENT_TASKS: [ROLES.AGENT_FONCIER],
  
  // Pages par profession
  INVESTMENTS: [ROLES.INVESTISSEUR],
  MARKET_ANALYSIS: [ROLES.INVESTISSEUR],
  OPPORTUNITIES: [ROLES.INVESTISSEUR],
  ROI_CALCULATOR: [ROLES.INVESTISSEUR],
  DUE_DILIGENCE: [ROLES.INVESTISSEUR],
  
  PROJECTS: [ROLES.PROMOTEUR],
  CONSTRUCTION_TRACKING: [ROLES.PROMOTEUR],
  SALES: [ROLES.PROMOTEUR],
  
  MY_LANDS: [ROLES.AGRICULTEUR],
  LOGBOOK: [ROLES.AGRICULTEUR],
  SOIL_ANALYSIS: [ROLES.AGRICULTEUR],
  WEATHER: [ROLES.AGRICULTEUR],
  EQUIPMENT: [ROLES.AGRICULTEUR],
  
  FUNDING_REQUESTS: [ROLES.BANQUE],
  GUARANTEES: [ROLES.BANQUE],
  LAND_VALUATION: [ROLES.BANQUE],
  COMPLIANCE: [ROLES.BANQUE],
  
  MAIRIE_REQUESTS: [ROLES.MAIRIE],
  LAND_MANAGEMENT: [ROLES.MAIRIE],
  CADASTRE: [ROLES.MAIRIE],
  DISPUTES: [ROLES.MAIRIE],
  URBAN_PLAN: [ROLES.MAIRIE],
  MAIRIE_REPORTS: [ROLES.MAIRIE],
  TERRAIN_OVERSIGHT: [ROLES.MAIRIE],
  TERRAIN_ANALYTICS: [ROLES.MAIRIE],
  
  CASES: [ROLES.NOTAIRE],
  AUTHENTICATION: [ROLES.NOTAIRE],
  ARCHIVES: [ROLES.NOTAIRE],
  COMPLIANCE_CHECK: [ROLES.NOTAIRE],
  
  SURVEYS: [ROLES.GEOMETRE],
  MEASUREMENTS: [ROLES.GEOMETRE],
  CERTIFICATIONS: [ROLES.GEOMETRE],
  TECHNICAL_REPORTS: [ROLES.GEOMETRE],
  
  // Dashboards solution spécialisés
  VENDEUR_DASHBOARD: [...ROLE_GROUPS.VENDEURS],
  INVESTISSEURS_DASHBOARD: [ROLES.INVESTISSEUR],
  PROMOTEURS_DASHBOARD: [ROLES.PROMOTEUR],
  AGRICULTEURS_DASHBOARD: [ROLES.AGRICULTEUR],
  BANQUES_DASHBOARD: [ROLES.BANQUE],
  MAIRIES_DASHBOARD: [ROLES.MAIRIE],
  NOTAIRES_DASHBOARD: [ROLES.NOTAIRE],
  GEOMETRE_DASHBOARD: [ROLES.GEOMETRE]
};

// Fonction pour vérifier les permissions
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  
  // L'admin a accès à tout sauf aux pages spécifiques des autres rôles
  if (userRole === ROLES.ADMIN) {
    const adminRestrictedPages = [
      'MY_REQUESTS', 'FAVORITES', 'REQUEST_MUNICIPAL_LAND', 'DIGITAL_VAULT',
      'SELL_PROPERTY', 'MY_LISTINGS', 'ADD_PARCEL',
      ...Object.keys(PERMISSIONS).filter(key => 
        key.includes('DASHBOARD') && !key.includes('ADMIN') ||
        key.includes('INVESTMENTS') || key.includes('PROJECTS') || 
        key.includes('MY_LANDS') || key.includes('FUNDING_') ||
        key.includes('MAIRIE_') || key.includes('CASES') ||
        key.includes('SURVEYS')
      )
    ];
    return !adminRestrictedPages.includes(permission);
  }
  
  const allowedRoles = PERMISSIONS[permission] || [];
  return allowedRoles.includes(userRole);
};

// Fonction pour obtenir le dashboard par défaut selon le rôle
export const getDefaultDashboard = (userRole) => {
  switch (userRole) {
    case ROLES.ADMIN:
      return '/admin';
    case ROLES.AGENT_FONCIER:
      return '/agent';
    case ROLES.PARTICULIER:
      return '/dashboard';
    case ROLES.VENDEUR_PARTICULIER:
    case ROLES.VENDEUR_PRO:
      return '/solutions/vendeur/dashboard';
    case ROLES.INVESTISSEUR:
      return '/solutions/investisseurs/dashboard';
    case ROLES.PROMOTEUR:
      return '/solutions/promoteurs/dashboard';
    case ROLES.AGRICULTEUR:
      return '/solutions/agriculteurs/dashboard';
    case ROLES.BANQUE:
      return '/solutions/banques/dashboard';
    case ROLES.MAIRIE:
      return '/solutions/mairies/dashboard';
    case ROLES.NOTAIRE:
      return '/solutions/notaires/dashboard';
    case ROLES.GEOMETRE:
      return '/solutions/geometre/dashboard';
    default:
      return '/dashboard';
  }
};

// Messages d'erreur selon le contexte
export const getAccessDeniedMessage = (userRole, permission) => {
  if (userRole === ROLES.ADMIN) {
    return "Cette fonctionnalité est réservée aux utilisateurs de terrain. En tant qu'administrateur, vous avez accès aux outils de gestion globale.";
  }
  
  const roleNames = {
    [ROLES.PARTICULIER]: 'particuliers',
    [ROLES.VENDEUR_PARTICULIER]: 'vendeurs particuliers',
    [ROLES.VENDEUR_PRO]: 'vendeurs professionnels',
    [ROLES.BANQUE]: 'banques',
    [ROLES.MAIRIE]: 'mairies',
    [ROLES.NOTAIRE]: 'notaires',
    [ROLES.GEOMETRE]: 'géomètres',
    [ROLES.INVESTISSEUR]: 'investisseurs',
    [ROLES.PROMOTEUR]: 'promoteurs',
    [ROLES.AGRICULTEUR]: 'agriculteurs',
    [ROLES.AGENT_FONCIER]: 'agents fonciers'
  };
  
  const allowedRoles = PERMISSIONS[permission] || [];
  const allowedRoleNames = allowedRoles.map(role => roleNames[role]).join(', ');
  
  return `Cette page est réservée aux ${allowedRoleNames}. Votre rôle actuel (${roleNames[userRole] || userRole}) ne vous permet pas d'y accéder.`;
};
