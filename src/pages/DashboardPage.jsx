
import React from 'react';
import { useAuth } from '@/context/SupabaseAuthContext';
import { Navigate } from 'react-router-dom';

import ParticulierDashboard from '@/pages/solutions/dashboards/ParticulierDashboard';
import InvestisseursDashboardPage from '@/pages/solutions/dashboards/InvestisseursDashboardPage';
import PromoteursDashboardPage from '@/pages/solutions/dashboards/PromoteursDashboardPage';
import BanquesDashboardPage from '@/pages/solutions/dashboards/BanquesDashboardPage';
import MairiesDashboardPage from '@/pages/solutions/dashboards/MairiesDashboardPage';
import NotairesDashboardPage from '@/pages/solutions/dashboards/NotairesDashboardPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AgentDashboardPage from '@/pages/agent/AgentDashboardPage';
import VendeurDashboardPage from '@/pages/solutions/dashboards/VendeurDashboardPage';
import { LoadingSpinner } from '@/components/ui/spinner';

const DashboardPage = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  const userRole = profile.role || 'Particulier';

  switch (userRole) {
    case 'Admin':
      return <AdminDashboardPage />;
    case 'Agent Foncier':
      return <AgentDashboardPage />;
    case 'Vendeur Particulier':
    case 'Vendeur Pro':
      return <VendeurDashboardPage />;
    case 'Investisseur':
      return <InvestisseursDashboardPage />;
    case 'Promoteur':
      return <PromoteursDashboardPage />;
    case 'Banque':
      return <BanquesDashboardPage />;
    case 'Mairie':
      return <MairiesDashboardPage />;
    case 'Notaire':
      return <NotairesDashboardPage />;
    case 'Agriculteur':
    case 'Particulier':
    default:
      return <ParticulierDashboard />;
  }
};

export default DashboardPage;
