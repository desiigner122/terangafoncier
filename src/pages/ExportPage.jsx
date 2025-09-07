import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, FileSpreadsheet, Calendar, Users, Building,
  Settings, Filter, Eye, Trash2, RefreshCw, CheckCircle,
  BarChart3, TrendingUp, MapPin, CreditCard, Clock,
  AlertCircle, FileText, Database, Share2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Progress } from '@/components/ui/progress';
import { Helmet } from 'react-helmet-async';
import ModernSidebar from '@/components/layout/ModernSidebar';
import { useUser } from '@/hooks/useUser';

const ExportPage = () => {
  const { user, profile } = useUser();
  const [activeTab, setActiveTab] = useState('contacts');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [selectedColumns, setSelectedColumns] = useState({});
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [exportFormat, setExportFormat] = useState('excel');

  // Configuration des exports disponibles
  const exportConfigs = {
    contacts: {
      title: 'Contacts CRM',
      description: 'Export de tous les contacts et prospects',
      icon: Users,
      color: 'text-blue-500',
      totalRecords: 247,
      columns: [
        { id: 'name', label: 'Nom complet', selected: true },
        { id: 'email', label: 'Email', selected: true },
        { id: 'phone', label: 'Téléphone', selected: true },
        { id: 'role', label: 'Rôle', selected: true },
        { id: 'status', label: 'Statut', selected: true },
        { id: 'location', label: 'Localisation', selected: false },
        { id: 'interests', label: 'Centres d\'intérêt', selected: false },
        { id: 'dealValue', label: 'Valeur potentielle', selected: true },
        { id: 'lastContact', label: 'Dernier contact', selected: false },
        { id: 'score', label: 'Score qualité', selected: false },
        { id: 'notes', label: 'Notes', selected: false }
      ]
    },
    properties: {
      title: 'Propriétés & Terrains',
      description: 'Export de l\'inventaire complet',
      icon: Building,
      color: 'text-green-500',
      totalRecords: 156,
      columns: [
        { id: 'title', label: 'Titre', selected: true },
        { id: 'type', label: 'Type de bien', selected: true },
        { id: 'location', label: 'Localisation', selected: true },
        { id: 'price', label: 'Prix', selected: true },
        { id: 'surface', label: 'Surface', selected: true },
        { id: 'status', label: 'Statut', selected: true },
        { id: 'seller', label: 'Vendeur', selected: false },
        { id: 'dateAdded', label: 'Date d\'ajout', selected: false },
        { id: 'views', label: 'Nombre de vues', selected: false },
        { id: 'features', label: 'Caractéristiques', selected: false },
        { id: 'description', label: 'Description', selected: false }
      ]
    },
    transactions: {
      title: 'Transactions',
      description: 'Historique des ventes et achats',
      icon: CreditCard,
      color: 'text-purple-500',
      totalRecords: 89,
      columns: [
        { id: 'transactionId', label: 'ID Transaction', selected: true },
        { id: 'propertyTitle', label: 'Bien vendu', selected: true },
        { id: 'buyer', label: 'Acheteur', selected: true },
        { id: 'seller', label: 'Vendeur', selected: true },
        { id: 'amount', label: 'Montant', selected: true },
        { id: 'commission', label: 'Commission', selected: false },
        { id: 'date', label: 'Date transaction', selected: true },
        { id: 'status', label: 'Statut', selected: true },
        { id: 'paymentMethod', label: 'Mode de paiement', selected: false },
        { id: 'documents', label: 'Documents', selected: false }
      ]
    },
    analytics: {
      title: 'Données Analytiques',
      description: 'Statistiques et métriques de performance',
      icon: BarChart3,
      color: 'text-orange-500',
      totalRecords: 365,
      columns: [
        { id: 'date', label: 'Date', selected: true },
        { id: 'visitors', label: 'Visiteurs', selected: true },
        { id: 'pageViews', label: 'Pages vues', selected: true },
        { id: 'leads', label: 'Leads générés', selected: true },
        { id: 'conversions', label: 'Conversions', selected: true },
        { id: 'revenue', label: 'Chiffre d\'affaires', selected: false },
        { id: 'bounceRate', label: 'Taux de rebond', selected: false },
        { id: 'avgSession', label: 'Durée moyenne session', selected: false },
        { id: 'topPages', label: 'Pages populaires', selected: false },
        { id: 'sources', label: 'Sources de trafic', selected: false }
      ]
    }
  };

  const [exportHistory] = useState([
    {
      id: 1,
      type: 'contacts',
      filename: 'contacts_export_20240315.xlsx',
      date: '2024-03-15T10:30:00Z',
      status: 'completed',
      records: 247,
      size: '2.3 MB'
    },
    {
      id: 2,
      type: 'properties',
      filename: 'properties_export_20240314.xlsx',
      date: '2024-03-14T16:45:00Z',
      status: 'completed',
      records: 156,
      size: '5.7 MB'
    },
    {
      id: 3,
      type: 'analytics',
      filename: 'analytics_export_20240313.xlsx',
      date: '2024-03-13T09:15:00Z',
      status: 'failed',
      records: 0,
      size: '0 MB'
    }
  ]);

  useEffect(() => {
    // Initialiser les colonnes sélectionnées
    const initialSelected = {};
    Object.keys(exportConfigs).forEach(key => {
      initialSelected[key] = {};
      exportConfigs[key].columns.forEach(col => {
        initialSelected[key][col.id] = col.selected;
      });
    });
    setSelectedColumns(initialSelected);
  }, []);

  const handleColumnToggle = (exportType, columnId) => {
    setSelectedColumns(prev => ({
      ...prev,
      [exportType]: {
        ...prev[exportType],
        [columnId]: !prev[exportType]?.[columnId]
      }
    }));
  };

  const handleSelectAll = (exportType, selectAll) => {
    setSelectedColumns(prev => ({
      ...prev,
      [exportType]: exportConfigs[exportType].columns.reduce((acc, col) => ({
        ...acc,
        [col.id]: selectAll
      }), {})
    }));
  };

  const performExport = async (exportType) => {
    setIsExporting(true);
    setExportProgress(0);

    const config = exportConfigs[exportType];
    const selectedCols = Object.entries(selectedColumns[exportType] || {})
      .filter(([_, selected]) => selected)
      .map(([colId, _]) => colId);

    // Simulation du processus d'export
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setExportProgress(i);
    }

    // Générer le nom du fichier
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `${exportType}_export_${timestamp}.${exportFormat === 'excel' ? 'xlsx' : 'csv'}`;

    // Simuler le téléchargement
    console.log(`Export ${exportType}:`, {
      filename,
      selectedColumns: selectedCols,
      format: exportFormat,
      dateRange,
      totalRecords: config.totalRecords
    });

    alert(`Export ${config.title} terminé !\nFichier: ${filename}\nColonnes: ${selectedCols.length}\nFormat: ${exportFormat.toUpperCase()}`);

    setIsExporting(false);
    setExportProgress(0);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="flex">
      <ModernSidebar currentPage="export" />
      <div className="flex-1 ml-80 p-6 bg-gray-50 min-h-screen">
        <Helmet>
          <title>Exports Excel - Teranga Foncier</title>
          <meta name="description" content="Centre d'export des données de Teranga Foncier" />
        </Helmet>

        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Centre d'Export</h1>
            <p className="text-gray-600">Exportez vos données en Excel ou CSV</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                <SelectItem value="csv">CSV (.csv)</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </Button>
          </div>
        </div>

        {/* Progress d'export actuel */}
        {isExporting && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Download className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">Export en cours...</h3>
                    <p className="text-sm text-blue-600">Génération du fichier {exportFormat.toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-900">{exportProgress}%</div>
                </div>
              </div>
              <Progress value={exportProgress} className="h-2" />
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="exports">Nouveaux Exports</TabsTrigger>
            <TabsTrigger value="history">Historique ({exportHistory.length})</TabsTrigger>
          </TabsList>

          {/* Nouveaux exports */}
          <TabsContent value="exports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(exportConfigs).map(([key, config]) => {
                const Icon = config.icon;
                const selectedCount = Object.values(selectedColumns[key] || {}).filter(Boolean).length;
                const totalColumns = config.columns.length;
                
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Icon className={`w-8 h-8 ${config.color}`} />
                            <div>
                              <CardTitle className="text-lg">{config.title}</CardTitle>
                              <p className="text-sm text-gray-600">{config.description}</p>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {config.totalRecords} entrées
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Sélection des colonnes */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">Colonnes à exporter ({selectedCount}/{totalColumns})</h4>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleSelectAll(key, true)}
                              >
                                Tout
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleSelectAll(key, false)}
                              >
                                Aucun
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                            {config.columns.map((column) => (
                              <div key={column.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${key}-${column.id}`}
                                  checked={selectedColumns[key]?.[column.id] || false}
                                  onCheckedChange={() => handleColumnToggle(key, column.id)}
                                />
                                <label 
                                  htmlFor={`${key}-${column.id}`}
                                  className="text-sm font-medium leading-none cursor-pointer"
                                >
                                  {column.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Options de filtrage */}
                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-3">Filtres (optionnel)</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium">Période</label>
                              <div className="flex space-x-2 mt-1">
                                <DatePicker
                                  selected={dateRange.start}
                                  onChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                                  placeholderText="Date de début"
                                  className="flex-1"
                                />
                                <DatePicker
                                  selected={dateRange.end}
                                  onChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
                                  placeholderText="Date de fin"
                                  className="flex-1"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bouton d'export */}
                        <Button 
                          className="w-full" 
                          onClick={() => performExport(key)}
                          disabled={isExporting || selectedCount === 0}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Exporter {selectedCount > 0 ? `(${selectedCount} colonnes)` : '(Sélectionnez des colonnes)'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Historique des exports */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Historique des Exports</CardTitle>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualiser
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exportHistory.map((export_item) => {
                    const config = exportConfigs[export_item.type];
                    const Icon = config?.icon || FileText;
                    
                    return (
                      <div key={export_item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Icon className={`w-8 h-8 ${config?.color || 'text-gray-500'}`} />
                          <div>
                            <h4 className="font-medium">{export_item.filename}</h4>
                            <p className="text-sm text-gray-600">
                              {config?.title} • {export_item.records} entrées • {export_item.size}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(export_item.date).toLocaleString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(export_item.status)}
                            <Badge className={getStatusColor(export_item.status)}>
                              {export_item.status === 'completed' ? 'Terminé' : 
                               export_item.status === 'failed' ? 'Échec' : 'En cours'}
                            </Badge>
                          </div>
                          
                          <div className="flex space-x-2">
                            {export_item.status === 'completed' && (
                              <>
                                <Button size="sm" variant="ghost">
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Share2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="ghost" className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {exportHistory.length === 0 && (
                    <div className="text-center py-12">
                      <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun export</h3>
                      <p className="text-gray-600">Vos exports apparaîtront ici une fois créés</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExportPage;
