import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { getDefaultDashboard } from '@/lib/enhancedRbacConfig';
import ModernAdminDashboard from '@/pages/admin/ModernAdminDashboard';
import AcheteurDashboard from '@/pages/dashboards/AcheteurDashboard';
import VendeurDashboard from '@/pages/dashboards/VendeurDashboard';
import PromoteurDashboard from '@/pages/dashboards/PromoteurDashboard';
import BanqueDashboard from '@/pages/dashboards/BanqueDashboard';
import NotaireDashboard from '@/pages/dashboards/NotaireDashboard';
import GeometreDashboard from '@/pages/dashboards/GeometreDashboard';
import AgentFoncierDashboard from '@/pages/dashboards/AgentFoncierDashboard';
import MairieDashboard from '@/pages/dashboards/MairieDashboard';
import InvestisseurDashboard from '@/pages/dashboards/InvestisseurDashboard';

/**
 * Component that redirects users to their role-specific dashboard
 * Based on the enhanced RBAC system with 15 different user roles
 */
const DashboardRedirect = () => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Get user role from user metadata or profile
  const userRole = user.user_metadata?.role || user.role || 'PARTICULIER_SENEGAL';
  
  // Determine which dashboard component to render based on role
  switch (userRole) {
    case 'ADMIN':
      return <ModernAdminDashboard />;
    
    case 'PARTICULIER_SENEGAL':
    case 'PARTICULIER_DIASPORA':
      return <AcheteurDashboard />;
    
    case 'VENDEUR_PARTICULIER':
    case 'VENDEUR_PROFESSIONNEL':
      return <VendeurDashboard />;
    
    case 'PROMOTEUR':
    case 'ARCHITECTE':
    case 'CONSTRUCTEUR':
      return <PromoteurDashboard />;
    
    case 'BANQUE':
      return <BanqueDashboard />;
    
    case 'NOTAIRE':
      return <NotaireDashboard />;
    
    case 'GEOMETRE':
      return <GeometreDashboard />;
    
    case 'AGENT_FONCIER':
      return <AgentFoncierDashboard />;
    
    case 'MAIRIE':
      return <MairieDashboard />;
    
    case 'INVESTISSEUR_IMMOBILIER':
    case 'INVESTISSEUR_AGRICOLE':
      return <InvestisseurDashboard />;
    
    default:
      // Fallback to acheteur dashboard for unknown roles
      return <AcheteurDashboard />;
  }
};

export default DashboardRedirect;
