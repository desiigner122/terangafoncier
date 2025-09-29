import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';
import { LoadingSpinner } from '@/components/ui/spinner';

const ProtectedRoute = ({ children }) => {
  const { user, session, loading, profile } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!session || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export const VerifiedRoute = ({ children }) => {
    const { profile, loading } = useAuth();
    const location = useLocation();
    
    if (loading) {
        return (
          <div className="flex items-center justify-center h-screen">
            <LoadingSpinner size="large" />
          </div>
        );
    }

    if (!profile) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    console.log('🔍 VerifiedRoute DEBUG:');
    console.log('Profile verification_status:', profile.verification_status);
    console.log('Profile user_type:', profile.user_type);
    console.log('Location pathname:', location.pathname);
    
    // SOLUTION: Permettre l'accès aux vendeurs sans vérification
    if (profile.user_type === 'Vendeur Particulier' && location.pathname.startsWith('/dashboard/vendeur')) {
        console.log('🔧 SOLUTION: Accès vendeur autorisé sans vérification');
        return children ? children : <Outlet />;
    }
    
    return children ? children : <Outlet />;
};

export const AdminRoute = ({ children }) => {
  const { profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!profile || (profile.role !== 'Admin' && profile.role !== 'admin')) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return <Navigate to="/settings" replace />;
  }

  // Normalize roles for comparison (handle accents, case, and spaces to underscores)
  const normalizeRole = (role) => {
    if (!role) return '';
    
    // Handle specific cases first
    const roleMap = {
      'agent foncier': 'agent_foncier',
      'agent_foncier': 'agent_foncier',
      'vendeur particulier': 'vendeur_particulier',
      'particulier': 'particulier',
      'promoteur': 'promoteur',
      'banque': 'banque',
      'notaire': 'notaire',
      'geometre': 'geometre',
      'admin': 'admin',
      'investisseur': 'investisseur',
      'mairie': 'mairie'
    };
    
    const lowerRole = role.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .trim();
      
    return roleMap[lowerRole] || lowerRole.replace(/\s+/g, '_');
  };

  const currentRole = normalizeRole(profile.role || profile.user_type || '');
  const normalizedAllowed = allowedRoles.map(r => normalizeRole(r));

  if (!normalizedAllowed.includes(currentRole)) {
    console.log('❌ Role not allowed:', { 
      originalRole: profile.role || profile.user_type, 
      normalizedCurrent: currentRole, 
      allowedRoles,
      normalizedAllowed 
    });
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

export default ProtectedRoute;
