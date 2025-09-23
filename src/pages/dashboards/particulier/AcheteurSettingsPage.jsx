import React from 'react';
import { Settings } from 'lucide-react';
import SettingsPageNew from '@/pages/common/SettingsPageNew';
import ModernDashboardLayout from '@/components/dashboard/ModernDashboardLayout';

const AcheteurSettingsPage = () => {
  return (
    <ModernDashboardLayout>
      <div className="space-y-6">
        {/* Header de la page */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
              <p className="text-gray-600 mt-1">Configuration du compte</p>
            </div>
          </div>
        </div>

        {/* Contenu de la page */}
        <div className="bg-white rounded-lg border">
          <SettingsPageNew />
        </div>
      </div>
    </ModernDashboardLayout>
  );
};

export default AcheteurSettingsPage;