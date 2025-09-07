import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { getDefaultDashboard } from '@/lib/enhancedRbacConfig';
import ModernAdminDashboard from '@/pages/admin/ModernAdminDashboard';
import ModernAcheteurDashboard from '@/pages/dashboards/ModernAcheteurDashboard';
import ModernVendeurDashboard from '@/pages/dashboards/ModernVendeurDashboard';
import ModernPromoteurDashboard from '@/pages/dashboards/ModernPromoteurDashboard';
import ModernBanqueDashboard from '@/pages/dashboards/ModernBanqueDashboard';
import ModernNotaireDashboard from '@/pages/dashboards/ModernNotaireDashboard';
import ModernGeometreDashboard from '@/pages/dashboards/ModernGeometreDashboard';
import ModernAgentFoncierDashboard from '@/pages/dashboards/ModernAgentFoncierDashboard';
import ModernMairieDashboard from '@/pages/dashboards/ModernMairieDashboard';
import ModernInvestisseurDashboard from '@/pages/dashboards/ModernInvestisseurDashboard';

/**
 * Component that redirects users to their role-specific dashboard
 * Based on the enhanced RBAC system with 15 different user roles
 */
const DashboardRedirect = () => {
  const { user, profile, loading } = useUser();

  // Débuggage pour identifier les boucles
  useEffect(() => {
    console.log('🔄 DashboardRedirect render:', {
      loading,
      user: user ? { id: user.id, role: user.role } : null,
      profile: profile ? { id: profile.id, role: profile.role } : null,
      userRole: profile?.role || user?.user_metadata?.role || user?.role || 'PARTICULIER_SENEGAL'
    });
  }, [user, profile, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du tableau de bord...</p>
          <p className="text-sm text-gray-500 mt-2">
            État: {loading ? 'Chargement' : 'Chargé'} | 
            User: {user ? 'Connecté' : 'Non connecté'} | 
            Profile: {profile ? 'Chargé' : 'Non chargé'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Get user role from profile, user metadata, or fallback to default
  const userRole = profile?.role || user.user_metadata?.role || user.role || 'PARTICULIER_SENEGAL';
  
  console.log('DashboardRedirect - User Role:', userRole, 'Profile:', profile, 'User:', user);
  
  // Determine which dashboard component to render based on role
  switch (userRole) {
    case 'ADMIN':
      return <ModernAdminDashboard />;
    
    case 'PARTICULIER_SENEGAL':
    case 'PARTICULIER_DIASPORA':
    case 'Acheteur':
      return <ModernAcheteurDashboard />;
    
    case 'VENDEUR_PARTICULIER':
    case 'VENDEUR_PROFESSIONNEL':
    case 'Vendeur':
      return <ModernVendeurDashboard />;
    
    case 'PROMOTEUR':
    case 'ARCHITECTE':
    case 'CONSTRUCTEUR':
    case 'Promoteur':
      return <ModernPromoteurDashboard />;
    
    case 'BANQUE':
    case 'Banque':
      return <ModernBanqueDashboard />;
    
    case 'NOTAIRE':
    case 'Notaire':
      return <ModernNotaireDashboard />;
    
    case 'GEOMETRE':
    case 'Géomètre':
      return <ModernGeometreDashboard />;
    
    case 'AGENT_FONCIER':
    case 'Agent Foncier':
      return <ModernAgentFoncierDashboard />;
    
    case 'MAIRIE':
    case 'Mairie':
      return <ModernMairieDashboard />;
    
    case 'INVESTISSEUR_IMMOBILIER':
    case 'INVESTISSEUR_AGRICOLE':
    case 'Investisseur':
      return <ModernInvestisseurDashboard />;
    
    case 'AGRICULTEUR':
    case 'Agriculture':
      // Agriculture dashboard exclu - redirection vers dashboard acheteur par défaut
      return <ModernAcheteurDashboard />;
    
    default:
      // Fallback to acheteur dashboard for unknown roles
      return <ModernAcheteurDashboard />;
  }
};

export default DashboardRedirect;
