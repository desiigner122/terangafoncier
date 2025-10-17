import React from 'react';
import { useTitleByRoute } from '@/hooks/usePageTitle';

/**
 * Composant wrapper pour mettre à jour les titles automatiquement
 * Doit être utilisé à l'intérieur du Router (après Routes)
 */
export const TitleUpdater = () => {
  useTitleByRoute();
  return null;
};

export default TitleUpdater;
