/**
 * VendeurAnalytics - Wrapper pour la version RealData
 * 
 * Ce fichier garantit que tous les imports pointent vers la version
 * avec vraies données (VendeurAnalyticsRealData.jsx)
 */

import React from 'react';
import VendeurAnalyticsRealData from './VendeurAnalyticsRealData';

/**
 * Affiche la page analytics vendeur avec données réelles depuis Supabase
 */
const VendeurAnalytics = () => {
  return <VendeurAnalyticsRealData />;
};

export default VendeurAnalytics;
