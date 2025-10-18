/**
 * AnalyticsPage - Wrapper pour la version RealData
 * 
 * Ce fichier garantit que tous les imports pointent vers la version
 * avec vraies données (AnalyticsPageReal.jsx)
 */

import React from 'react';
import AnalyticsPageReal from './AnalyticsPageReal';

/**
 * Affiche la page analytics avec données réelles depuis Supabase
 */
const AnalyticsPage = () => {
  return <AnalyticsPageReal />;
};

export default AnalyticsPage; 
