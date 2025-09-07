import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUserFixed';
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
 * With protection against infinite loading loops
 */
const DashboardRedirectFixed = () => {
  const { user, profile, loading } = useUser();
  const [renderTimeout, setRenderTimeout] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});

  // Protection contre les boucles infinies
  useEffect(() => {
    const timer = setTimeout(() => {
      setRenderTimeout(true);
      setDebugInfo({
        user: user ? { id: user.id, role: user.role, metadata: user.user_metadata } : null,
        profile: profile ? { id: profile.id, role: profile.role } : null,
        loading,
        timestamp: new Date().toISOString()
      });
    }, 5000); // 5 secondes max de chargement

    return () => clearTimeout(timer);
  }, [user, profile, loading]);

  // Affichage d'urgence si bloqué en chargement
  if (renderTimeout && loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Problème de Chargement Détecté</h3>
          <p className="text-gray-600 mb-4">Le dashboard semble bloqué en chargement.</p>
          
          <div className="bg-gray-100 p-3 rounded text-xs text-left mb-4">
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
          
          <div className="space-y-2">
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Recharger la Page
            </button>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
            >
              Réinitialiser & Reconnexion
            </button>
            <a 
              href="/debug-dashboard"
              className="block w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 text-center"
            >
              Mode Debug
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Chargement normal avec timeout
  if (loading && !renderTimeout) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du tableau de bord...</p>
          <div className="text-xs text-gray-500 mt-2">
            <div>État: {loading ? 'Chargement' : 'Chargé'}</div>
            <div>User: {user ? 'Connecté' : 'Non connecté'}</div>
            <div>Profile: {profile ? 'Chargé' : 'Non chargé'}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Get user role from profile, user metadata, or fallback to default
  const userRole = profile?.role || user.user_metadata?.role || user.role || 'PARTICULIER_SENEGAL';
  
  console.log('🎯 DashboardRedirectFixed - User Role:', userRole, 'Profile:', profile, 'User:', user);
  
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
      console.warn('🔄 Unknown role:', userRole, 'Redirecting to default dashboard');
      return <ModernAcheteurDashboard />;
  }
};

export default DashboardRedirectFixed;
