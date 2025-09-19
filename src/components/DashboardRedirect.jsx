import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';

const DashboardRedirect = () => {
  const { user, session, loading, profile } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de votre dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session || !user) {
    return <Navigate to="/login" replace />;
  }

  // Récupérer le rôle depuis le profile (normalisé) avec fallback aux métadonnées
  const userRole = (profile?.role || user.user_metadata?.role || '').toLowerCase();
  
  console.log('🎯 DashboardRedirect - Rôle utilisateur:', profile?.role || user.user_metadata?.role, '→ normalisé:', userRole);
  
  // Redirection basée sur le rôle
  switch (userRole) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'acheteur':
      return <Navigate to="/acheteur" replace />;
    case 'particulier':
    case 'particular':
      return <Navigate to="/acheteur" replace />;
    case 'vendeur':
      return <Navigate to="/vendeur" replace />;
    case 'investisseur':
      return <Navigate to="/investisseur" replace />;
    case 'promoteur':
      return <Navigate to="/promoteur" replace />;
    case 'municipalite':
      return <Navigate to="/municipalite" replace />;
    case 'notaire':
      return <Navigate to="/notaire" replace />;
    case 'geometre':
      return <Navigate to="/geometre" replace />;
    case 'banque':
      return <Navigate to="/banque" replace />;
    case 'agent_foncier':
    case 'agent foncier':
      return <Navigate to="/agent-foncier" replace />;
    case 'lotisseur':
      return <Navigate to="/lotisseur" replace />;
    case 'mairie':
      return <Navigate to="/mairie" replace />;
    default:
      console.warn('⚠️ Rôle non reconnu:', userRole, '- Redirection vers sélection de rôle');
      // Si aucun rôle valide, rediriger vers sélection de rôle
      return <Navigate to="/select-role" replace />;
  }
};

export default DashboardRedirect;
