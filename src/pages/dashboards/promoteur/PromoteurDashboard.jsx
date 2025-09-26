import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PromoteurDashboardLayout from './PromoteurDashboardLayout';
import PromoteurOverview from './PromoteurOverview';
import PromoteurChantiers from './PromoteurChantiers';
import PromoteurVentes from './PromoteurVentes';
import PromoteurClients from './PromoteurClients';
import PromoteurFinances from './PromoteurFinances';
import PromoteurAI from './PromoteurAI';
import PromoteurBlockchain from './PromoteurBlockchain';

const PromoteurDashboard = () => {
  return (
    <PromoteurDashboardLayout>
      <Routes>
        <Route path="/" element={<PromoteurOverview />} />
        <Route path="/chantiers" element={<PromoteurChantiers />} />
        <Route path="/ventes" element={<PromoteurVentes />} />
        <Route path="/clients" element={<PromoteurClients />} />
        <Route path="/finances" element={<PromoteurFinances />} />
        <Route path="/ai" element={<PromoteurAI />} />
        <Route path="/blockchain" element={<PromoteurBlockchain />} />
      </Routes>
    </PromoteurDashboardLayout>
  );
};

export default PromoteurDashboard;
