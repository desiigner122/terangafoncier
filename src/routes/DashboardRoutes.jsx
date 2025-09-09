import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Dashboard Imports
import ParticulierDashboard from '@/pages/dashboards/particulier/ParticulierDashboard';
import VendeurDashboard from '@/pages/dashboards/vendeur/VendeurDashboard';
import InvestisseurDashboard from '@/pages/dashboards/investisseur/InvestisseurDashboard';
import PromoteurDashboard from '@/pages/dashboards/promoteur/PromoteurDashboard';
import MunicipaliteDashboard from '@/pages/dashboards/municipalite/MunicipaliteDashboard';
import AdminDashboard from '@/pages/dashboards/admin/AdminDashboard';
import NotaireDashboard from '@/pages/dashboards/notaires/NotaireDashboard';
import GeometreDashboard from '@/pages/dashboards/geometres/GeometreDashboard';
import BanqueDashboard from '@/pages/dashboards/banques/BanqueDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Role-based Dashboard Selector
const DashboardSelector = () => {
  const { user } = useAuth();

  const dashboardMap = {
    'particulier': <ParticulierDashboard />,
    'vendeur': <VendeurDashboard />,
    'investisseur': <InvestisseurDashboard />,
    'promoteur': <PromoteurDashboard />,
    'municipalite': <MunicipaliteDashboard />,
    'admin': <AdminDashboard />,
    'notaire': <NotaireDashboard />,
    'geometre': <GeometreDashboard />,
    'banque': <BanqueDashboard />
  };

  return dashboardMap[user?.role] || <Navigate to="/select-role" replace />;
};

const DashboardRoutes = () => {
  return (
    <Routes>
      {/* Automatic Role-based Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardSelector />
          </ProtectedRoute>
        }
      />

      {/* Specific Dashboard Routes */}
      <Route
        path="/dashboard/particulier"
        element={
          <ProtectedRoute allowedRoles={['particulier', 'admin']}>
            <ParticulierDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/vendeur"
        element={
          <ProtectedRoute allowedRoles={['vendeur', 'admin']}>
            <VendeurDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/investisseur"
        element={
          <ProtectedRoute allowedRoles={['investisseur', 'admin']}>
            <InvestisseurDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/promoteur"
        element={
          <ProtectedRoute allowedRoles={['promoteur', 'admin']}>
            <PromoteurDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/municipalite"
        element={
          <ProtectedRoute allowedRoles={['municipalite', 'admin']}>
            <MunicipaliteDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/notaire"
        element={
          <ProtectedRoute allowedRoles={['notaire', 'admin']}>
            <NotaireDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/geometre"
        element={
          <ProtectedRoute allowedRoles={['geometre', 'admin']}>
            <GeometreDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/banque"
        element={
          <ProtectedRoute allowedRoles={['banque', 'admin']}>
            <BanqueDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="/dashboard/*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default DashboardRoutes;
