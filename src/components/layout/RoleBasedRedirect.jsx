import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';
import { LoadingSpinner } from '@/components/ui/spinner';

/**
 * Composant de redirection automatique basée sur le rôle
 * Redirige les utilisateurs vers le dashboard approprié selon leur rôle
 */
const RoleBasedRedirect = () => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (profile) {
      console.log('🔄 RoleBasedRedirect - Rôle utilisateur:', profile.role);
      console.log('🔄 RoleBasedRedirect - Localisation actuelle:', location.pathname);
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

  // Mapping des rôles vers leurs dashboards modernes
  const roleRedirectMap = {
    'Admin': '/admin',
    'admin': '/admin',
    'Géomètre': '/dashboard/geometre',  // Utilise le dashboard général en attendant
    'geometre': '/dashboard/geometre',
    'Investisseur': '/solutions/investisseurs/apercu',
    'investisseur': '/solutions/investisseurs/apercu',
    'Mairie': '/solutions/mairies/apercu',
    'mairie': '/solutions/mairies/apercu',
    'Promoteur': '/solutions/promoteurs/apercu',
    'promoteur': '/solutions/promoteurs/apercu',
    'Banque': '/solutions/banques/apercu',
    'banque': '/solutions/banques/apercu',
    'Notaire': '/solutions/notaires/apercu',
    'notaire': '/solutions/notaires/apercu',
    'Vendeur': '/solutions/vendeurs/apercu',
    'vendeur': '/solutions/vendeurs/apercu',
    'Vendeur Particulier': '/solutions/vendeurs/apercu',
    'Vendeur Pro': '/solutions/vendeurs/apercu',
    'Acheteur': '/dashboard/acheteur',  // Utilise le dashboard général en attendant
    'acheteur': '/dashboard/acheteur',
    'Particulier': '/dashboard/acheteur',
    'particulier': '/dashboard/acheteur',
    'Agent Foncier': '/agent'
  };

  // Obtenir le rôle de l'utilisateur (priorité à role, puis user_type)
  const userRole = profile.role || profile.user_type || '';
  
  // Chercher la redirection appropriée
  const redirectPath = roleRedirectMap[userRole];
  
  if (redirectPath) {
    console.log('✅ Redirection automatique:', userRole, '->', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  // Si aucun rôle spécifique n'est trouvé, rediriger vers le dashboard général
  console.log('⚠️ Rôle non reconnu:', userRole, '-> redirection vers dashboard général');
  return <Navigate to="/dashboard" replace />;
};

export default RoleBasedRedirect;