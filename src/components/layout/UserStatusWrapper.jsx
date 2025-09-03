import React from 'react';
import { useAuth } from '@/context/SupabaseAuthContext';
import useUserStatusMonitor from '@/hooks/useUserStatusMonitor';

/**
 * Composant wrapper qui surveille les changements de statut des utilisateurs
 * Doit envelopper toutes les routes protégées
 */
const UserStatusWrapper = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  // Activer le monitoring seulement si l'utilisateur est connecté
  useUserStatusMonitor();

  // Ne pas afficher le contenu pendant le chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default UserStatusWrapper;
