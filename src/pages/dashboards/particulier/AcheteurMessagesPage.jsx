import React from 'react';
import { MessageSquare } from 'lucide-react';
import MessagesPageNew from '@/pages/common/MessagesPage';

const AcheteurMessagesPage = () => {
  return (
    <div className="space-y-6">
      {/* Header de la page */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center space-x-3">
          <MessageSquare className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-1">Communications et échanges</p>
          </div>
        </div>
      </div>

      {/* Contenu de la page */}
      <div className="bg-white rounded-lg border">
        <MessagesPageNew />
      </div>
    </div>
  );
};

export default AcheteurMessagesPage;