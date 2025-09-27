import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Download, 
  Upload, 
  Search, 
  Filter,
  Calendar,
  MapPin,
  User,
  Building,
  Folder,
  Eye,
  Edit,
  Trash2,
  Share,
  Archive,
  CheckCircle,
  Clock,
  AlertTriangle,
  PaperclipIcon,
  ImageIcon
} from 'lucide-react';

const GeometreRapports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);

  // Rapports et documents
  const reports = [
    {
      id: 1,
      title: 'Levé Topographique - Résidence Les Almadies',
      type: 'Levé Topographique',
      client: 'Fall Promotion SARL',
      location: 'Almadies, Dakar',
      date: '2024-12-10',
      status: 'Terminé',
      pages: 15,
      size: '2.3 MB',
      format: 'PDF',
      attachments: 3,
      category: 'topographie'
    },
    {
      id: 2,
      title: 'Plan Cadastral - Lotissement Diamaguène',
      type: 'Plan Cadastral',
      client: 'Mairie de Guédiawaye',
      location: 'Diamaguène, Sicap',
      date: '2024-12-08',
      status: 'En révision',
      pages: 8,
      size: '1.8 MB',
      format: 'PDF',
      attachments: 2,
      category: 'cadastre'
    },
    {
      id: 3,
      title: 'Certificat de Bornage - Villa VDN',
      type: 'Bornage',
      client: 'Amadou Cissé',
      location: 'VDN, Dakar',
      date: '2024-12-05',
      status: 'Terminé',
      pages: 6,
      size: '1.2 MB',
      format: 'PDF',
      attachments: 1,
      category: 'bornage'
    },
    {
      id: 4,
      title: 'Étude Faisabilité - Complexe Commercial',
      type: 'Étude Faisabilité',
      client: 'Teranga Invest',
      location: 'Liberté 6, Dakar',
      date: '2024-12-03',
      status: 'En cours',
      pages: 22,
      size: '4.1 MB',
      format: 'PDF',
      attachments: 5,
      category: 'etude'
    },
    {
      id: 5,
      title: 'Rapport Géotechnique - Fondations',
      type: 'Géotechnique',
      client: 'BTP Sénégal',
      location: 'Rufisque',
      date: '2024-11-28',
      status: 'Terminé',
      pages: 18,
      size: '3.2 MB',
      format: 'PDF',
      attachments: 4,
      category: 'geotechnique'
    }
  ];

  // Statistiques
  const reportStats = {
    totalReports: 127,
    thisMonth: 18,
    pending: 5,
    completed: 122,
    totalSize: '186.7 MB',
    categories: {
      topographie: 45,
      cadastre: 32,
      bornage: 28,
      etude: 15,
      geotechnique: 7
    }
  };

  // Modèles de rapports
  const reportTemplates = [
    {
      id: 1,
      name: 'Levé Topographique Standard',
      description: 'Modèle pour levés topographiques classiques',
      category: 'topographie',
      pages: 12,
      usage: 45
    },
    {
      id: 2,
      name: 'Plan Cadastral Officiel',
      description: 'Modèle conforme aux normes cadastrales',
      category: 'cadastre',
      pages: 8,
      usage: 32
    },
    {
      id: 3,
      name: 'Certificat de Bornage',
      description: 'Modèle standard de bornage',
      category: 'bornage',
      pages: 6,
      usage: 28
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'En révision': return 'bg-yellow-100 text-yellow-800';
      case 'Annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Terminé': return <CheckCircle className="w-4 h-4" />;
      case 'En cours': return <Clock className="w-4 h-4" />;
      case 'En révision': return <Edit className="w-4 h-4" />;
      case 'Annulé': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'topographie': return 'bg-blue-100 text-blue-800';
      case 'cadastre': return 'bg-green-100 text-green-800';
      case 'bornage': return 'bg-purple-100 text-purple-800';
      case 'etude': return 'bg-orange-100 text-orange-800';
      case 'geotechnique': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rapports & Documents</h1>
            <p className="text-gray-600">Gestion de vos rapports et documents techniques</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Importer
            </Button>
            <Button size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Nouveau rapport
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Rapports</p>
                  <p className="text-2xl font-bold text-gray-900">{reportStats.totalReports}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ce Mois</p>
                  <p className="text-2xl font-bold text-gray-900">{reportStats.thisMonth}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Attente</p>
                  <p className="text-2xl font-bold text-gray-900">{reportStats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Terminés</p>
                  <p className="text-2xl font-bold text-gray-900">{reportStats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Stockage</p>
                  <p className="text-2xl font-bold text-gray-900">{reportStats.totalSize}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Archive className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Liste des rapports */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Mes Rapports</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrer
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filtres par catégorie */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                  >
                    Tous ({reportStats.totalReports})
                  </Button>
                  <Button
                    variant={selectedCategory === 'topographie' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('topographie')}
                  >
                    Topographie ({reportStats.categories.topographie})
                  </Button>
                  <Button
                    variant={selectedCategory === 'cadastre' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('cadastre')}
                  >
                    Cadastre ({reportStats.categories.cadastre})
                  </Button>
                  <Button
                    variant={selectedCategory === 'bornage' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('bornage')}
                  >
                    Bornage ({reportStats.categories.bornage})
                  </Button>
                </div>

                {/* Liste des rapports */}
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{report.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {report.client}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {report.location}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(report.date)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getCategoryColor(report.category)}>
                            {report.type}
                          </Badge>
                          <Badge className={getStatusColor(report.status)}>
                            {getStatusIcon(report.status)}
                            <span className="ml-1">{report.status}</span>
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-3 text-sm">
                        <div>
                          <span className="text-gray-500">Pages:</span>
                          <span className="ml-1 font-medium">{report.pages}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Taille:</span>
                          <span className="ml-1 font-medium">{report.size}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Format:</span>
                          <span className="ml-1 font-medium">{report.format}</span>
                        </div>
                        <div className="flex items-center">
                          <PaperclipIcon className="w-4 h-4 text-gray-500 mr-1" />
                          <span className="font-medium">{report.attachments} pièces jointes</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Progress value={report.status === 'Terminé' ? 100 : report.status === 'En cours' ? 65 : 85} className="w-24 h-2" />
                          <span className="text-xs text-gray-500">
                            {report.status === 'Terminé' ? '100%' : report.status === 'En cours' ? '65%' : '85%'}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share className="w-4 h-4 mr-2" />
                            Partager
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Modèles */}
            <Card>
              <CardHeader>
                <CardTitle>Modèles de Rapports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportTemplates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-3">
                      <h4 className="font-medium text-sm mb-1">{template.name}</h4>
                      <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{template.pages} pages</span>
                        <Badge variant="secondary" className="text-xs">
                          {template.usage} utilisations
                        </Badge>
                      </div>
                      <Button size="sm" className="w-full mt-2">
                        Utiliser
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Nouveau rapport
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="w-4 h-4 mr-2" />
                    Importer documents
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Archive className="w-4 h-4 mr-2" />
                    Archiver anciens
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Export groupé
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeometreRapports;