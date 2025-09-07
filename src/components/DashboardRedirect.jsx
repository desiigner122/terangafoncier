import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';

const DashboardRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const userRole = user.role;
    
    // Redirection vers le dashboard approprié selon le rôle
    const dashboardRoutes = {
      'admin': '/admin-dashboard',
      'agent_foncier': '/dashboard/agent-foncier',
      'mairie': '/dashboard/mairie',
      'geometre': '/dashboard/geometre',
      'banque': '/dashboard/banque',
      'vendeur_particulier': '/dashboard/vendeur',
      'promoteur': '/dashboard/promoteur',
      'investisseur': '/dashboard/investisseur',
      'particulier': '/dashboard/particulier',
      'diaspora': '/dashboard/particulier' // Même dashboard que particulier
    };

    const targetRoute = dashboardRoutes[userRole] || '/dashboard/particulier';
    navigate(targetRoute, { replace: true });
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirection vers votre tableau de bord...</p>
      </div>
    </div>
  );
};

export default DashboardRedirect;
