import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import des dashboards principaux
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import ParticularDashboard from '../pages/dashboards/ParticularDashboard';
import VendeurDashboard from '../pages/dashboards/VendeurDashboard';
import InvestisseurDashboard from '../pages/dashboards/InvestisseurDashboard';

import MunicipaliteDashboard from '../pages/dashboards/MunicipaliteDashboard';
import NotaireDashboard from '../pages/dashboards/NotaireDashboard';
import GeometreDashboard from '../pages/dashboards/GeometreDashboard';
import BanqueDashboard from '../pages/dashboards/BanqueDashboard';

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="/particulier/*" element={<ParticularDashboard />} />
      <Route path="/vendeur/*" element={<VendeurDashboard />} />
      <Route path="/investisseur/*" element={<InvestisseurDashboard />} />

      <Route path="/municipalite/*" element={<MunicipaliteDashboard />} />
      <Route path="/notaire/*" element={<NotaireDashboard />} />
      <Route path="/geometre/*" element={<GeometreDashboard />} />
      <Route path="/banque/*" element={<BanqueDashboard />} />
    </Routes>
  );
};

export default DashboardRoutes;