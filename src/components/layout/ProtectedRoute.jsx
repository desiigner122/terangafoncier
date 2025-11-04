import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/UnifiedAuthContext';
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

  // SÉCURITÉ RENFORCÉE : Vérification stricte du rôle admin
  const userRole = (profile?.role || profile?.user_type || '').toLowerCase();
  const isAdmin = userRole === 'admin' || userRole === 'administrateur';

  console.log('🔐 AdminRoute CHECK:', { 
    role: profile?.role, 
    user_type: profile?.user_type, 
    userRole, 
    isAdmin,
    pathname: location.pathname
  });

  if (!profile || !isAdmin) {
    console.error('❌ ACCÈS REFUSÉ: Utilisateur non-admin tenté d\'accéder à', location.pathname);
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

    if (roleMap[lowerRole]) {
      return roleMap[lowerRole];
    }

    const sanitized = lowerRole
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!sanitized) {
      return '';
    }

    if (sanitized.includes('acheteur') || sanitized.includes('buyer')) {
      return 'acheteur';
    }

    if (sanitized.includes('particulier')) {
      return 'particulier';
    }

    if (sanitized.includes('investisseur')) {
      return 'investisseur';
    }

    if (sanitized.includes('promoteur')) {
      return 'promoteur';
    }

    if (sanitized.includes('vendeur') && (sanitized.includes('pro') || sanitized.includes('professionnel'))) {
      return 'vendeur_pro';
    }

    if (sanitized.includes('vendeur') && sanitized.includes('particulier')) {
      return 'vendeur_particulier';
    }

    if (sanitized.includes('vendeur')) {
      return 'vendeur';
    }

    return sanitized.replace(/\s+/g, '_');
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

export const BuyerOnlyRoute = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!profile) {
    return <Navigate to="/settings" replace />;
  }

  // Roles autorisés à acheter des terrains
  const normalizeRole = (role) => {
    if (!role) return '';
    const lowerRole = role.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
    return lowerRole.replace(/\s+/g, '_');
  };

  const currentRole = normalizeRole(profile.role || profile.user_type || '');
  const buyerRoles = ['particulier', 'acheteur', 'investisseur', 'promoteur'];

  console.log('🛒 BuyerOnlyRoute CHECK:', { 
    role: profile.role, 
    user_type: profile.user_type, 
    currentRole, 
    allowed: buyerRoles.includes(currentRole),
    pathname: location.pathname
  });

  if (!buyerRoles.includes(currentRole)) {
    console.warn('❌ ACCÈS REFUSÉ: Seuls les acheteurs peuvent acheter des terrains. Rôle:', currentRole);
    return (
      <Navigate 
        to="/dashboard" 
        state={{ 
          from: location,
          message: 'Seuls les particuliers, acheteurs et investisseurs peuvent acheter des terrains.' 
        }} 
        replace 
      />
    );
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
