import React from 'react';
import { Calendar } from 'lucide-react';
import CalendarPageNew from '@/pages/common/CalendarPage';

const AcheteurCalendarPage = () => {
  return (
    <div className="space-y-6">
      {/* Header de la page */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center space-x-3">
          <Calendar className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calendrier</h1>
            <p className="text-gray-600 mt-1">Rendez-vous et planning</p>
          </div>
        </div>
      </div>

      {/* Contenu de la page */}
      <div className="bg-white rounded-lg border">
        <CalendarPageNew />
      </div>
    </div>
  );
};

export default AcheteurCalendarPage;