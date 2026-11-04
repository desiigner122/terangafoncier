import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { LoadingSpinner } from '@/components/ui/spinner';
import { logger } from '@/lib/logger';

/**
 * Composant de redirection automatique basée sur le rôle
 * Redirige les utilisateurs vers le dashboard approprié selon leur rôle
 */
const RoleBasedRedirect = () => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (profile) {
      logger.debug('🔄 RoleBasedRedirect - Rôle utilisateur:', profile.role);
      logger.debug('🔄 RoleBasedRedirect - Localisation actuelle:', location.pathname);
    }
  }, [profile, location]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }

  // Mapping des rôles vers leurs dashboards modernes blockchain
  const roleRedirectMap = {
    'Admin': '/admin',
    'admin': '/admin',
    'Géomètre': '/geometre',
    'geometre': '/geometre',
    'Investisseur': '/investisseur',
    'investisseur': '/investisseur',
    'Mairie': '/mairie',
    'mairie': '/mairie',
    'Promoteur': '/promoteur',
    'promoteur': '/promoteur',
    'Banque': '/banque',
    'banque': '/banque',
    'Notaire': '/notaire',
    'notaire': '/notaire',
    'Vendeur': '/vendeur',
    'vendeur': '/vendeur',
    'Vendeur Particulier': '/vendeur',
    'Vendeur Pro': '/vendeur',
    'Acheteur': '/acheteur',
    'acheteur': '/acheteur',  
    'Particulier': '/acheteur',
    'particulier': '/acheteur',
    'Agent Foncier': '/agent-foncier',
    'agent_foncier': '/agent-foncier'
  };  // Obtenir le rôle de l'utilisateur (priorité à role, puis user_type)
  const userRole = profile.role || profile.user_type || '';
  
  // Chercher la redirection appropriée
  const redirectPath = roleRedirectMap[userRole];
  
  if (redirectPath) {
    logger.debug('✅ Redirection automatique:', userRole, '->', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  // Si aucun rôle spécifique n'est trouvé, rediriger vers le dashboard général
  logger.debug('⚠️ Rôle non reconnu:', userRole, '-> redirection vers dashboard général');
  return <Navigate to="/dashboard" replace />;
};

export default RoleBasedRedirect;