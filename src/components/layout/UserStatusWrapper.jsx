import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';
import useUserStatusMonitor from '@/hooks/useUserStatusMonitor';

/**
 * Composant wrapper qui surveille les changements de statut des utilisateurs
 * Doit envelopper toutes les routes protÃ©gÃ©es
 */
const UserStatusWrapper = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Activer le monitoring seulement si l'utilisateur est connectÃ©
  const monitoringStatus = useUserStatusMonitor();

  // Ne pas afficher le contenu pendant le chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si utilisÃ© comme Route element, utiliser Outlet, sinon children
  return children ? <>{children}</> : <Outlet />;
};

export default UserStatusWrapper;


