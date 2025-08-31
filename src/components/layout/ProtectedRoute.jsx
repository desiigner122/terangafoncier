
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/SupabaseAuthContext';
import { LoadingSpinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/use-toast';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user) {
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
    
    const requiresVerification = ['Particulier', 'Vendeur Particulier', 'Vendeur Pro', 'Investisseur', 'Promoteur', 'Agriculteur'].includes(profile.user_type);

    if (requiresVerification) {
        if (profile.verification_status === 'unverified') {
            return <Navigate to="/verify" state={{ from: location }} replace />;
        }
        if (profile.verification_status === 'pending') {
            return <Navigate to="/pending-verification" state={{ from: location }} replace />;
        }
        if (profile.verification_status === 'rejected') {
            return <Navigate to="/verify" state={{ from: location, error: "Your previous submission was rejected. Please resubmit." }} replace />;
        }
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

  if (!profile || profile.role !== 'Admin') {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { profile, loading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (!profile || !allowedRoles.includes(profile.role)) {
    toast({
        variant: 'destructive',
        title: 'Accès Interdit',
        description: 'Vous n\'avez pas les permissions requises pour accéder à cette page.',
    });
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children;
};


export default ProtectedRoute;
