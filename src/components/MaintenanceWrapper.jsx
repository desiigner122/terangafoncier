/**
 * COMPOSANT WRAPPER MAINTENANCE
 * 
 * Affiche la page de maintenance si le mode est activé,
 * sinon affiche l'application normale
 */

import React from 'react';
import { useMaintenanceMode } from '@/contexts/MaintenanceContext';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import MaintenancePage from '@/components/MaintenancePage';
import { RefreshCw } from 'lucide-react';

const MaintenanceWrapper = ({ children }) => {
  const { isMaintenanceMode, loading, isUserAllowed } = useMaintenanceMode();
  const { user } = useAuth();

  // Afficher un spinner pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Vérification du statut du système...</p>
        </div>
      </div>
    );
  }

  // Si le mode maintenance est activé
  if (isMaintenanceMode) {
    // Vérifier si l'utilisateur est autorisé à accéder
    const userRole = user?.role || 'guest';
    
    if (isUserAllowed(userRole)) {
      // Utilisateur autorisé (admin) - afficher l'app avec un bandeau
      return (
        <div>
          {/* Bandeau de maintenance pour les admins */}
          <div className="bg-orange-600 text-white px-4 py-2 text-center text-sm font-medium">
            🔧 MODE MAINTENANCE ACTIVÉ - Visible uniquement par les administrateurs
          </div>
          {children}
        </div>
      );
    } else {
      // Utilisateur non autorisé - afficher la page de maintenance
      return <MaintenancePage />;
    }
  }

  // Mode normal - afficher l'application
  return children;
};

export default MaintenanceWrapper;