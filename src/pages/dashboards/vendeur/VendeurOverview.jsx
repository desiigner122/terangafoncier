/**
 * VendeurOverview - Wrapper pour la version RealData
 * 
 * Ce fichier garantit que tous les imports pointent vers la version
 * avec vraies données (VendeurOverviewRealData.jsx)
 */

import React from 'react';
import VendeurOverviewRealData from './VendeurOverviewRealData';

/**
 * Affiche la page overview vendeur avec données réelles depuis Supabase
 */
const VendeurOverview = () => {
  return <VendeurOverviewRealData />;
};

export default VendeurOverview;
