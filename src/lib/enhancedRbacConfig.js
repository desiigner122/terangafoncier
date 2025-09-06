// ============================================================================
// 🏗️ SYSTÈME RBAC ÉTENDU - GESTION FONCIÈRE COMPLÈTE TERANGA FONCIER
// ============================================================================

// === RÔLES UTILISATEURS ===
export const ROLES = {
  // Administration
  ADMIN: 'admin',
  
  // Acheteurs
  PARTICULIER_SENEGAL: 'particulier_senegal',
  PARTICULIER_DIASPORA: 'particulier_diaspora',
  
  // Vendeurs
  VENDEUR_PARTICULIER: 'vendeur_particulier',
  VENDEUR_PROFESSIONNEL: 'vendeur_professionnel',
  
  // Professionnels Construction
  PROMOTEUR: 'promoteur',
  ARCHITECTE: 'architecte',
  CONSTRUCTEUR: 'constructeur',
  
  // Services Professionnels
  BANQUE: 'banque',
  NOTAIRE: 'notaire',
  GEOMETRE: 'geometre',
  AGENT_FONCIER: 'agent_foncier',
  
  // Institutions
  MAIRIE: 'mairie',
  
  // Investissement
  INVESTISSEUR_IMMOBILIER: 'investisseur_immobilier',
  INVESTISSEUR_AGRICOLE: 'investisseur_agricole'
};

// === CONFIGURATION DES RÔLES ===
export const ROLES_CONFIG = {
  [ROLES.ADMIN]: {
    name: "Administrateur",
    color: "bg-red-600",
    icon: "Shield",
    category: "administration",
    description: "Gestion complète de la plateforme",
    subscription: null
  },
  
  // === ACHETEURS ===
  [ROLES.PARTICULIER_SENEGAL]: {
    name: "Particulier Sénégal",
    color: "bg-blue-600",
    icon: "Home",
    category: "acheteurs",
    description: "Particulier résidant au Sénégal",
    subscription: {
      free: { limit_requests: 3, limit_contacts: 5 },
      basic: { price: 15000, limit_requests: 15, limit_contacts: 20 },
      premium: { price: 35000, unlimited: true }
    }
  },
  
  [ROLES.PARTICULIER_DIASPORA]: {
    name: "Particulier Diaspora",
    color: "bg-indigo-600",
    icon: "Globe",
    category: "acheteurs",
    description: "Particulier résidant à l'étranger",
    subscription: {
      free: { limit_requests: 2, limit_contacts: 3 },
      standard: { price: 25000, limit_requests: 10, limit_contacts: 15, suivi_construction: true },
      premium: { price: 50000, unlimited: true, suivi_temps_reel: true, assistance_prioritaire: true }
    }
  },
  
  // === VENDEURS ===
  [ROLES.VENDEUR_PARTICULIER]: {
    name: "Vendeur Particulier",
    color: "bg-green-600",
    icon: "UserCheck",
    category: "vendeurs",
    description: "Particulier vendant ses terrains",
    subscription: {
      free: { limit_listings: 2, basic_features: true },
      seller: { price: 20000, limit_listings: 10, featured_listings: 2 },
      pro: { price: 45000, unlimited_listings: true, priority_support: true }
    }
  },
  
  [ROLES.VENDEUR_PROFESSIONNEL]: {
    name: "Vendeur Professionnel",
    color: "bg-emerald-600",
    icon: "Building2",
    category: "vendeurs",
    description: "Société de promotion immobilière",
    subscription: {
      business: { price: 75000, unlimited_listings: true, advanced_analytics: true },
      enterprise: { price: 150000, white_label: true, api_access: true, dedicated_support: true }
    }
  },
  
  // === PROFESSIONNELS CONSTRUCTION ===
  [ROLES.PROMOTEUR]: {
    name: "Promoteur Immobilier",
    color: "bg-orange-600",
    icon: "Hammer",
    category: "construction",
    description: "Spécialiste en promotion immobilière",
    subscription: {
      contractor: { price: 60000, project_management: true, client_matching: true },
      premium: { price: 100000, advanced_tools: true, priority_access: true }
    }
  },
  
  [ROLES.ARCHITECTE]: {
    name: "Architecte",
    color: "bg-purple-600",
    icon: "PenTool",
    category: "construction",
    description: "Conception et plans architecturaux",
    subscription: {
      designer: { price: 40000, portfolio_showcase: true, client_leads: true },
      studio: { price: 80000, team_management: true, advanced_portfolio: true }
    }
  },
  
  [ROLES.CONSTRUCTEUR]: {
    name: "Constructeur",
    color: "bg-yellow-600",
    icon: "HardHat",
    category: "construction",
    description: "Entreprise de construction",
    subscription: {
      builder: { price: 50000, project_tracking: true, material_management: true },
      enterprise: { price: 90000, fleet_management: true, advanced_reporting: true }
    }
  },
  
  // === SERVICES FINANCIERS ===
  [ROLES.BANQUE]: {
    name: "Institution Bancaire",
    color: "bg-green-700",
    icon: "Banknote",
    category: "finance",
    description: "Services de financement immobilier",
    subscription: {
      financial: { price: 200000, client_matching: true, credit_tools: true },
      premium: { price: 350000, advanced_analytics: true, white_label: true }
    }
  },
  
  // === SERVICES PROFESSIONNELS ===
  [ROLES.NOTAIRE]: {
    name: "Notaire",
    color: "bg-gray-700",
    icon: "Scale",
    category: "juridique",
    description: "Services notariaux et authentification",
    subscription: {
      notary: { price: 75000, case_management: true, digital_signatures: true },
      office: { price: 125000, multi_notary: true, advanced_compliance: true }
    }
  },
  
  [ROLES.GEOMETRE]: {
    name: "Géomètre",
    color: "bg-cyan-600",
    icon: "MapPin",
    category: "technique",
    description: "Mesures et bornage des terrains",
    subscription: {
      surveyor: { price: 45000, survey_tools: true, gps_integration: true },
      expert: { price: 85000, advanced_mapping: true, drone_support: true }
    }
  },
  
  [ROLES.AGENT_FONCIER]: {
    name: "Agent Foncier",
    color: "bg-teal-600",
    icon: "UserCog",
    category: "support",
    description: "Assistance et accompagnement clients",
    subscription: {
      agent: { price: 35000, client_portfolio: true, commission_tracking: true },
      senior: { price: 65000, advanced_crm: true, performance_analytics: true }
    }
  },
  
  // === INSTITUTIONS ===
  [ROLES.MAIRIE]: {
    name: "Mairie",
    color: "bg-red-500",
    icon: "Landmark",
    category: "institution",
    description: "Administration municipale",
    subscription: null // Gratuit pour les mairies
  },
  
  // === INVESTISSEURS ===
  [ROLES.INVESTISSEUR_IMMOBILIER]: {
    name: "Investisseur Immobilier",
    color: "bg-purple-700",
    icon: "TrendingUp",
    category: "investissement",
    description: "Investissement immobilier et locatif",
    subscription: {
      investor: { price: 100000, market_analytics: true, portfolio_tools: true },
      institutional: { price: 250000, advanced_analytics: true, exclusive_deals: true }
    }
  },
  
  [ROLES.INVESTISSEUR_AGRICOLE]: {
    name: "Investisseur Agricole",
    color: "bg-green-500",
    icon: "Sprout",
    category: "investissement",
    description: "Financement de projets agricoles",
    subscription: {
      agri_investor: { price: 80000, agricultural_analytics: true, project_matching: true },
      agri_fund: { price: 180000, fund_management: true, risk_analysis: true }
    }
  }
};

// === GROUPES DE RÔLES ===
export const ROLE_GROUPS = {
  ACHETEURS: [ROLES.PARTICULIER_SENEGAL, ROLES.PARTICULIER_DIASPORA],
  VENDEURS: [ROLES.VENDEUR_PARTICULIER, ROLES.VENDEUR_PROFESSIONNEL],
  CONSTRUCTION: [ROLES.PROMOTEUR, ROLES.ARCHITECTE, ROLES.CONSTRUCTEUR],
  FINANCE: [ROLES.BANQUE, ROLES.INVESTISSEUR_IMMOBILIER, ROLES.INVESTISSEUR_AGRICOLE],
  JURIDIQUE: [ROLES.NOTAIRE, ROLES.GEOMETRE],
  SUPPORT: [ROLES.AGENT_FONCIER],
  INSTITUTIONS: [ROLES.MAIRIE],
  PROFESSIONNELS: [ROLES.PROMOTEUR, ROLES.ARCHITECTE, ROLES.CONSTRUCTEUR, ROLES.NOTAIRE, ROLES.GEOMETRE, ROLES.AGENT_FONCIER],
  TOUS_SAUF_ADMIN: Object.values(ROLES).filter(role => role !== ROLES.ADMIN)
};

// === PERMISSIONS DÉTAILLÉES ===
export const PERMISSIONS = {
  // === DASHBOARD SPÉCIALISÉS ===
  DASHBOARD_ACHETEUR: [...ROLE_GROUPS.ACHETEURS],
  DASHBOARD_VENDEUR: [...ROLE_GROUPS.VENDEURS],
  DASHBOARD_PROMOTEUR: [...ROLE_GROUPS.CONSTRUCTION],
  DASHBOARD_BANQUE: [ROLES.BANQUE],
  DASHBOARD_NOTAIRE: [ROLES.NOTAIRE],
  DASHBOARD_GEOMETRE: [ROLES.GEOMETRE],
  DASHBOARD_AGENT: [ROLES.AGENT_FONCIER],
  DASHBOARD_MAIRIE: [ROLES.MAIRIE],
  DASHBOARD_INVESTISSEUR: [...ROLE_GROUPS.FINANCE],
  
  // === FONCTIONNALITÉS ACHETEURS ===
  RECHERCHER_TERRAINS: [...ROLE_GROUPS.ACHETEURS],
  ACHETER_TERRAIN: [...ROLE_GROUPS.ACHETEURS],
  FINANCEMENT_DEMANDE: [...ROLE_GROUPS.ACHETEURS],
  DEMANDE_TERRAIN_COMMUNAL: [...ROLE_GROUPS.ACHETEURS],
  PUBLIER_DEMANDE_TERRAIN: [...ROLE_GROUPS.ACHETEURS],
  SUIVI_CONSTRUCTION: [...ROLE_GROUPS.ACHETEURS],
  APPEL_OFFRES_CONSTRUCTION: [...ROLE_GROUPS.ACHETEURS],
  
  // === FONCTIONNALITÉS VENDEURS ===
  PUBLIER_TERRAIN: [...ROLE_GROUPS.VENDEURS],
  GERER_ANNONCES: [...ROLE_GROUPS.VENDEURS],
  REPONDRE_DEMANDES: [...ROLE_GROUPS.VENDEURS],
  PROPOSER_FINANCEMENT: [...ROLE_GROUPS.VENDEURS],
  
  // === FONCTIONNALITÉS CONSTRUCTION ===
  VOIR_NOUVEAUX_ACHETEURS: [...ROLE_GROUPS.CONSTRUCTION],
  SOUMETTRE_DEVIS: [...ROLE_GROUPS.CONSTRUCTION],
  GERER_PROJETS: [...ROLE_GROUPS.CONSTRUCTION],
  TIMELINE_CONSTRUCTION: [...ROLE_GROUPS.CONSTRUCTION],
  UPLOAD_PHOTOS_CHANTIER: [...ROLE_GROUPS.CONSTRUCTION],
  
  // === FONCTIONNALITÉS BANCAIRES ===
  GERER_CREDITS: [ROLES.BANQUE],
  EVALUER_DOSSIERS: [ROLES.BANQUE],
  PROPOSER_FINANCEMENT: [ROLES.BANQUE, ...ROLE_GROUPS.VENDEURS],
  ANALYTICS_CREDIT: [ROLES.BANQUE],
  
  // === FONCTIONNALITÉS JURIDIQUES ===
  GERER_ACTES: [ROLES.NOTAIRE],
  AUTHENTIFIER_DOCUMENTS: [ROLES.NOTAIRE],
  SUIVI_DOSSIERS_NOTARIAUX: [ROLES.NOTAIRE],
  
  EFFECTUER_MESURES: [ROLES.GEOMETRE],
  CERTIFIER_BORNAGE: [ROLES.GEOMETRE],
  RAPPORTS_TECHNIQUES: [ROLES.GEOMETRE],
  
  // === FONCTIONNALITÉS SUPPORT ===
  ASSISTANCE_CLIENTS: [ROLES.AGENT_FONCIER],
  MEDIATION_CONFLITS: [ROLES.AGENT_FONCIER],
  SUIVI_SATISFACTION: [ROLES.AGENT_FONCIER],
  
  // === FONCTIONNALITÉS MAIRIES ===
  GERER_TERRAINS_COMMUNAUX: [ROLES.MAIRIE],
  VALIDER_DEMANDES_COMMUNALES: [ROLES.MAIRIE],
  PUBLIER_APPELS_OFFRES: [ROLES.MAIRIE],
  
  // === FONCTIONNALITÉS INVESTISSEURS ===
  ANALYSER_MARCHE: [...ROLE_GROUPS.FINANCE],
  FINANCER_PROJETS: [...ROLE_GROUPS.FINANCE],
  PORTFOLIO_IMMOBILIER: [ROLES.INVESTISSEUR_IMMOBILIER],
  PROJETS_AGRICOLES: [ROLES.INVESTISSEUR_AGRICOLE],
  
  // === ADMINISTRATION ===
  ADMIN_PANEL: [ROLES.ADMIN],
  GERER_UTILISATEURS: [ROLES.ADMIN],
  CONFIGURER_FRAIS: [ROLES.ADMIN],
  ANALYTICS_PLATEFORME: [ROLES.ADMIN],
  MODERATION_CONTENU: [ROLES.ADMIN]
};

// === FONCTIONS UTILITAIRES ===
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  
  // Admin a accès aux fonctions admin seulement
  if (userRole === ROLES.ADMIN) {
    return permission.startsWith('ADMIN_') || permission === 'ANALYTICS_PLATEFORME';
  }
  
  const allowedRoles = PERMISSIONS[permission] || [];
  return allowedRoles.includes(userRole);
};

export const getDefaultDashboard = (userRole) => {
  const dashboardMap = {
    [ROLES.ADMIN]: '/admin',
    [ROLES.PARTICULIER_SENEGAL]: '/dashboard/acheteur',
    [ROLES.PARTICULIER_DIASPORA]: '/dashboard/acheteur',
    [ROLES.VENDEUR_PARTICULIER]: '/dashboard/vendeur',
    [ROLES.VENDEUR_PROFESSIONNEL]: '/dashboard/vendeur',
    [ROLES.PROMOTEUR]: '/dashboard/promoteur',
    [ROLES.ARCHITECTE]: '/dashboard/construction',
    [ROLES.CONSTRUCTEUR]: '/dashboard/construction',
    [ROLES.BANQUE]: '/dashboard/banque',
    [ROLES.NOTAIRE]: '/dashboard/notaire',
    [ROLES.GEOMETRE]: '/dashboard/geometre',
    [ROLES.AGENT_FONCIER]: '/dashboard/agent',
    [ROLES.MAIRIE]: '/dashboard/mairie',
    [ROLES.INVESTISSEUR_IMMOBILIER]: '/dashboard/investisseur',
    [ROLES.INVESTISSEUR_AGRICOLE]: '/dashboard/investisseur-agricole'
  };
  
  return dashboardMap[userRole] || '/';
};

export const getRoleCategory = (role) => {
  return ROLES_CONFIG[role]?.category || 'unknown';
};

export const getSubscriptionPlans = (role) => {
  return ROLES_CONFIG[role]?.subscription || null;
};

// === PRIX ET ABONNEMENTS ===
export const SUBSCRIPTION_PRICES = {
  // Montants en XOF (Francs CFA)
  BASIC_PLANS: {
    particulier_basic: 15000,
    diaspora_standard: 25000,
    vendeur_seller: 20000,
    agent_basic: 35000
  },
  
  PREMIUM_PLANS: {
    particulier_premium: 35000,
    diaspora_premium: 50000,
    vendeur_pro: 45000,
    promoteur_premium: 100000,
    banque_premium: 350000
  },
  
  ENTERPRISE_PLANS: {
    vendeur_enterprise: 150000,
    banque_enterprise: 500000,
    investisseur_institutional: 250000
  }
};

export default {
  ROLES,
  ROLES_CONFIG,
  ROLE_GROUPS,
  PERMISSIONS,
  hasPermission,
  getDefaultDashboard,
  getRoleCategory,
  getSubscriptionPlans,
  SUBSCRIPTION_PRICES
};
