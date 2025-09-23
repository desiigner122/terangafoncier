import React from 'react';
import { FileText } from 'lucide-react';
import DocumentsPageNew from '@/pages/common/DocumentsPage';

const AcheteurDocumentsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header de la page */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center space-x-3">
          <FileText className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
            <p className="text-gray-600 mt-1">Gestion documentaire</p>
          </div>
        </div>
      </div>

      {/* Contenu de la page */}
      <div className="bg-white rounded-lg border">
        <DocumentsPageNew />
      </div>
    </div>
  );
};

export default AcheteurDocumentsPage;