import React from 'react';
import { Bell } from 'lucide-react';
import NotificationsPageNew from '@/pages/common/NotificationsPage';

const AcheteurNotificationsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header de la page */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center space-x-3">
          <Bell className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">Alertes et notifications</p>
          </div>
        </div>
      </div>

      {/* Contenu de la page */}
      <div className="bg-white rounded-lg border">
        <NotificationsPageNew />
      </div>
    </div>
  );
};

export default AcheteurNotificationsPage;