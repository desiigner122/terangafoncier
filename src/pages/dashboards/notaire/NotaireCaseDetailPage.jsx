/**
 * NotaireCaseDetailPage.jsx
 * 
 * Page de suivi détaillé d'un dossier pour le notaire
 * Utilise le composant UnifiedCaseTracking qui s'adapte automatiquement au rôle notaire
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UnifiedCaseTracking from '@/components/unified/UnifiedCaseTracking';

const NotaireCaseDetailPage = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header avec bouton retour */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/notaire/cases')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux dossiers
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Suivi du dossier
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Vue détaillée avec actions contextuelles
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal - UnifiedCaseTracking */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <UnifiedCaseTracking />
      </div>
    </div>
  );
};

export default NotaireCaseDetailPage;
