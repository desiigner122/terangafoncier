import React, { useState, useEffect } from 'react';
import { FaDownload, FaFileExcel, FaFilePdf, FaFileAlt, FaCalendarAlt, FaFilter, FaDatabase } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const BulkExportPage = () => {
  const [loading, setLoading] = useState(false);
  const [exportType, setExportType] = useState('users');
  const [format, setFormat] = useState('csv');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    userType: ''
  });
  const [exportHistory, setExportHistory] = useState([]);

  // Options d'export disponibles
  const exportOptions = {
    users: {
      label: 'Utilisateurs',
      description: 'Exporter la liste des utilisateurs avec leurs profils',
      fields: ['ID', 'Nom', 'Email', 'Type', 'Date inscription', 'Statut', 'Dernière connexion']
    },
    properties: {
      label: 'Propriétés',
      description: 'Exporter toutes les propriétés du système',
      fields: ['ID', 'Titre', 'Propriétaire', 'Prix', 'Location', 'Statut', 'Date création']
    },
    transactions: {
      label: 'Transactions',
      description: 'Exporter l\'historique des transactions financières',
      fields: ['ID', 'Utilisateur', 'Montant', 'Type', 'Statut', 'Date', 'Référence']
    },
    support_tickets: {
      label: 'Tickets Support',
      description: 'Exporter les tickets de support client',
      fields: ['ID', 'Utilisateur', 'Sujet', 'Priorité', 'Statut', 'Date création', 'Assigné à']
    },
    analytics: {
      label: 'Analytics',
      description: 'Exporter les données d\'analyse et statistiques',
      fields: ['Date', 'Visites', 'Inscriptions', 'Revenus', 'Propriétés ajoutées']
    },
    financial_reports: {
      label: 'Rapports Financiers',
      description: 'Exporter les rapports financiers détaillés',
      fields: ['Période', 'Revenus', 'Commissions', 'Frais', 'Bénéfices nets']
    }
  };

  // Charger l'historique des exports
  useEffect(() => {
    fetchExportHistory();
  }, []);

  const fetchExportHistory = async () => {
    try {
      // Simuler un historique pour l'instant
      const mockHistory = [
        {
          id: 1,
          type: 'users',
          format: 'csv',
          dateCreated: new Date(Date.now() - 86400000).toISOString(),
          status: 'completed',
          fileSize: '2.4 MB',
          downloadCount: 3
        },
        {
          id: 2,
          type: 'properties',
          format: 'excel',
          dateCreated: new Date(Date.now() - 172800000).toISOString(),
          status: 'completed',
          fileSize: '5.1 MB',
          downloadCount: 1
        },
        {
          id: 3,
          type: 'transactions',
          format: 'pdf',
          dateCreated: new Date(Date.now() - 259200000).toISOString(),
          status: 'processing',
          fileSize: '-',
          downloadCount: 0
        }
      ];
      setExportHistory(mockHistory);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    }
  };

  // Générer un export
  const generateExport = async () => {
    try {
      setLoading(true);

      // Simuler l'API call d'export
      const exportData = await mockExportData(exportType, format, dateRange, filters);
      
      if (exportData) {
        downloadFile(exportData, `${exportType}_${new Date().toISOString().split('T')[0]}.${format}`);
        toast.success('Export généré avec succès');
        
        // Ajouter à l'historique
        const newExport = {
          id: Date.now(),
          type: exportType,
          format,
          dateCreated: new Date().toISOString(),
          status: 'completed',
          fileSize: '1.2 MB',
          downloadCount: 1
        };
        setExportHistory([newExport, ...exportHistory]);
      }
    } catch (error) {
      console.error('Erreur export:', error);
      toast.error('Erreur lors de la génération de l\'export');
    } finally {
      setLoading(false);
    }
  };

  // Mock data pour l'export
  const mockExportData = async (type, format, dateRange, filters) => {
    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockData = {
      users: [
        ['ID', 'Nom', 'Email', 'Type', 'Date inscription', 'Statut'],
        ['1', 'Admin Teranga', 'admin@teranga.com', 'admin', '2024-01-01', 'actif'],
        ['2', 'Jean Dupont', 'jean@example.com', 'particulier', '2024-01-15', 'actif'],
        ['3', 'Marie Martin', 'marie@example.com', 'agence', '2024-01-20', 'actif']
      ],
      properties: [
        ['ID', 'Titre', 'Propriétaire', 'Prix', 'Location', 'Statut'],
        ['1', 'Villa moderne Dakar', 'Jean Dupont', '150000000', 'Dakar-Plateau', 'active'],
        ['2', 'Appartement Almadies', 'Marie Martin', '85000000', 'Almadies', 'active']
      ],
      transactions: [
        ['ID', 'Utilisateur', 'Montant', 'Type', 'Statut', 'Date'],
        ['1', 'Jean Dupont', '25000', 'commission', 'completed', '2024-01-15'],
        ['2', 'Marie Martin', '15000', 'listing_fee', 'completed', '2024-01-20']
      ]
    };

    const data = mockData[type] || mockData.users;
    
    if (format === 'csv') {
      return data.map(row => row.join(',')).join('\n');
    } else if (format === 'json') {
      const headers = data[0];
      const rows = data.slice(1);
      return JSON.stringify(rows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      }), null, 2);
    }
    
    return data.map(row => row.join(',')).join('\n');
  };

  // Télécharger le fichier
  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { 
      type: format === 'json' ? 'application/json' : 'text/csv' 
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'excel':
        return <FaFileExcel className="w-5 h-5 text-green-600" />;
      case 'pdf':
        return <FaFilePdf className="w-5 h-5 text-red-600" />;
      case 'json':
        return <FaDatabase className="w-5 h-5 text-blue-600" />;
      default:
        return <FaFileAlt className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'completed': 'bg-green-100 text-green-800',
      'processing': 'bg-yellow-100 text-yellow-800',
      'failed': 'bg-red-100 text-red-800'
    };

    return badges[status] || badges.processing;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Export de Données
        </h1>
        <p className="text-gray-600">
          Exportez les données de la plateforme dans différents formats
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration d'export */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Nouvelle Export
            </h3>

            {/* Type d'export */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type de données à exporter
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(exportOptions).map(([key, option]) => (
                  <div
                    key={key}
                    onClick={() => setExportType(key)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      exportType === key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h4 className="font-medium text-gray-900 mb-1">{option.label}</h4>
                    <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                    <div className="text-xs text-gray-500">
                      Champs: {option.fields.slice(0, 3).join(', ')}
                      {option.fields.length > 3 && '...'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Format */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Format d'export
              </label>
              <div className="flex gap-4">
                {[
                  { value: 'csv', label: 'CSV', icon: <FaFileAlt /> },
                  { value: 'excel', label: 'Excel', icon: <FaFileExcel /> },
                  { value: 'json', label: 'JSON', icon: <FaDatabase /> },
                  { value: 'pdf', label: 'PDF', icon: <FaFilePdf /> }
                ].map((formatOption) => (
                  <button
                    key={formatOption.value}
                    onClick={() => setFormat(formatOption.value)}
                    className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
                      format === formatOption.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {formatOption.icon}
                    <span className="ml-2">{formatOption.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Période */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Période (optionnel)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Date de début</label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Date de fin</label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Filtres spécifiques */}
            {exportType === 'users' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Filtres utilisateurs
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={filters.userType}
                    onChange={(e) => setFilters({...filters, userType: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Tous les types</option>
                    <option value="particulier">Particuliers</option>
                    <option value="agence">Agences</option>
                    <option value="admin">Administrateurs</option>
                  </select>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="active">Actifs</option>
                    <option value="inactive">Inactifs</option>
                    <option value="banned">Bannis</option>
                  </select>
                </div>
              </div>
            )}

            {/* Bouton d'export */}
            <button
              onClick={generateExport}
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Génération en cours...
                </>
              ) : (
                <>
                  <FaDownload className="mr-2" />
                  Générer l'export
                </>
              )}
            </button>
          </div>
        </div>

        {/* Historique des exports */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Historique des Exports
            </h3>

            {exportHistory.length === 0 ? (
              <div className="text-center py-8">
                <FaDownload className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Aucun export récent</p>
              </div>
            ) : (
              <div className="space-y-4">
                {exportHistory.map((export_item) => (
                  <div key={export_item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        {getFormatIcon(export_item.format)}
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900">
                            {exportOptions[export_item.type]?.label || export_item.type}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {new Date(export_item.dateCreated).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(export_item.status)}`}>
                        {export_item.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Taille: {export_item.fileSize}</span>
                      <span>{export_item.downloadCount} téléchargements</span>
                    </div>

                    {export_item.status === 'completed' && (
                      <button className="mt-2 w-full text-xs text-blue-600 hover:text-blue-800 font-medium">
                        Télécharger à nouveau
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Statistiques */}
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Statistiques
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Exports ce mois</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Données exportées</span>
                <span className="font-medium">45.2 MB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Format le plus utilisé</span>
                <span className="font-medium">CSV (67%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkExportPage;