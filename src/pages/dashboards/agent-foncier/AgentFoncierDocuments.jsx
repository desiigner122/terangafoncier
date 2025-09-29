import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Search, 
  Download, 
  Upload, 
  Eye, 
  Edit,
  Filter,
  SortAsc,
  SortDesc,
  Archive,
  Trash2,
  Share2,
  Copy,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  FileImage,
  FileText as FilePdf,
  FileSpreadsheet,
  Folder,
  FolderOpen,
  Star,
  Calendar,
  User,
  MapPin,
  Tag,
  Paperclip,
  Send,
  History,
  Lock,
  Unlock,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

const AgentFoncierDocuments = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const documents = [
    {
      id: 1,
      nom: 'Titre Foncier TF-2024-001',
      type: 'Titre Foncier',
      format: 'PDF',
      taille: '2.4 MB',
      client: 'M. Amadou Diallo',
      statut: 'validé',
      date: '15/09/2024',
      dateModification: '16/09/2024',
      location: 'Almadies, Dakar',
      priority: 'haute',
      tags: ['Urgent', 'Résidentiel', 'VIP'],
      version: '1.2',
      commentaires: 3,
      partage: ['admin@teranga.com', 'client@example.com'],
      signature: true,
      blockchain: true,
      description: 'Titre de propriété pour terrain résidentiel aux Almadies'
    },
    {
      id: 2,
      nom: 'Acte de Vente AV-2024-012',
      type: 'Acte de Vente',
      format: 'PDF',
      taille: '1.8 MB',
      client: 'Société IMMOGO',
      statut: 'en_cours',
      date: '20/09/2024',
      dateModification: '24/09/2024',
      location: 'Parcelles Assainies',
      priority: 'moyenne',
      tags: ['Commercial', 'Société'],
      version: '2.1',
      commentaires: 7,
      partage: ['legal@immogo.com'],
      signature: false,
      blockchain: false,
      description: 'Acte de vente pour complexe commercial'
    },
    {
      id: 3,
      nom: 'Permis de Construire PC-2024-089',
      type: 'Permis de Construire',
      format: 'PDF',
      taille: '3.2 MB',
      client: 'M. Cheikh Ba',
      statut: 'en_attente',
      date: '18/09/2024',
      dateModification: '22/09/2024',
      location: 'Rufisque',
      priority: 'moyenne',
      tags: ['Construction', 'Permis'],
      version: '1.0',
      commentaires: 2,
      partage: [],
      signature: false,
      blockchain: true,
      description: 'Permis pour construction villa familiale'
    },
    {
      id: 4,
      nom: 'Rapport d\'Expertise RE-2024-156',
      type: 'Rapport d\'Expertise',
      format: 'DOCX',
      taille: '4.1 MB',
      client: 'Banque Atlantique',
      statut: 'validé',
      date: '12/09/2024',
      dateModification: '12/09/2024',
      location: 'Thiès',
      priority: 'haute',
      tags: ['Banque', 'Expertise', 'Hypothèque'],
      version: '3.0',
      commentaires: 12,
      partage: ['credit@atlantique.sn', 'risk@atlantique.sn'],
      signature: true,
      blockchain: true,
      description: 'Expertise pour crédit hypothécaire'
    },
    {
      id: 5,
      nom: 'Plan Cadastral PL-2024-203',
      type: 'Plan Cadastral',
      format: 'DWG',
      taille: '8.7 MB',
      client: 'Ministère de l\'Urbanisme',
      statut: 'validé',
      date: '10/09/2024',
      dateModification: '11/09/2024',
      location: 'Dakar Plateau',
      priority: 'haute',
      tags: ['Gouvernement', 'Cadastre', 'Officiel'],
      version: '1.0',
      commentaires: 1,
      partage: ['cadastre@urbanisme.gov.sn'],
      signature: true,
      blockchain: true,
      description: 'Plan cadastral officiel zone administrative'
    },
    {
      id: 6,
      nom: 'Certificat de Conformité CC-2024-078',
      type: 'Certificat de Conformité', 
      format: 'PDF',
      taille: '1.2 MB',
      client: 'Green Development SARL',
      statut: 'expiré',
      date: '05/09/2024',
      dateModification: '05/09/2024',
      location: 'Saly',
      priority: 'faible',
      tags: ['Environnement', 'Conformité'],
      version: '1.0',
      commentaires: 0,
      partage: [],
      signature: false,
      blockchain: false,
      description: 'Certificat conformité environnementale'
    }
  ];

  const folders = [
    {
      id: 1,
      nom: 'Titres Fonciers',
      count: 24,
      icon: FolderOpen,
      color: 'text-blue-600',
      description: 'Documents de propriété foncière'
    },
    {
      id: 2,
      nom: 'Actes de Vente',
      count: 18,
      icon: Folder,
      color: 'text-green-600',
      description: 'Contrats et actes de vente'
    },
    {
      id: 3,
      nom: 'Permis & Autorisations',
      count: 12,
      icon: Folder,
      color: 'text-orange-600',
      description: 'Permis de construire et autorisations'
    },
    {
      id: 4,
      nom: 'Rapports d\'Expertise',
      count: 31,
      icon: Folder,
      color: 'text-purple-600',
      description: 'Rapports d\'évaluation et d\'expertise'
    },
    {
      id: 5,
      nom: 'Plans & Cadastre',
      count: 15,
      icon: Folder,
      color: 'text-indigo-600',
      description: 'Plans cadastraux et topographiques'
    },
    {
      id: 6,
      nom: 'Archives',
      count: 89,
      icon: Archive,
      color: 'text-gray-600',
      description: 'Documents archivés'
    }
  ];

  const documentStats = [
    {
      title: 'Total Documents',
      value: '247',
      change: '+12',
      icon: FileText,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'En Attente',
      value: '23',
      change: '+3',
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      title: 'Validés',
      value: '189',
      change: '+8',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Sécurisés',
      value: '156',
      change: '+15',
      icon: Lock,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  // Fonctions utilitaires
  const getFileIcon = (format) => {
    switch (format.toLowerCase()) {
      case 'pdf': return FilePdf;  
      case 'docx': 
      case 'doc': return FileText;
      case 'xlsx':
      case 'xls': return FileSpreadsheet;
      case 'jpg':
      case 'jpeg':
      case 'png': return FileImage;
      default: return FileText;
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'validé': return 'bg-green-100 text-green-800';
      case 'en_cours': return 'bg-blue-100 text-blue-800';
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      case 'expiré': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDocuments = documents
    .filter(doc => {
      if (activeTab === 'tous') return true;
      if (activeTab === 'recents') return new Date(doc.date) > new Date(Date.now() - 7*24*60*60*1000);
      if (activeTab === 'partages') return doc.partage.length > 0;
      if (activeTab === 'favoris') return doc.priority === 'haute';
      return doc.statut === activeTab;
    })
    .filter(doc => 
      doc.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'nom') return order * a.nom.localeCompare(b.nom);
      if (sortBy === 'date') return order * (new Date(a.date) - new Date(b.date));
      if (sortBy === 'taille') return order * (parseFloat(a.taille) - parseFloat(b.taille));
      return 0;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full bg-gray-50 p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <FileText className="h-8 w-8 mr-3 text-blue-600" />
            Gestion Documents
          </h1>
          <p className="text-gray-600">Centre de gestion documentaire foncière</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Document
          </Button>
        </div>
      </div>

      {/* Statistiques Documents */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {documentStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium">{stat.change} ce mois</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Dossiers */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <Folder className="h-4 w-4 mr-2" />
                Dossiers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {folders.map((folder, index) => (
                  <motion.button
                    key={folder.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedFolder(folder.id === selectedFolder ? null : folder.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedFolder === folder.id ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <folder.icon className={`h-4 w-4 ${folder.color}`} />
                        <div>
                          <div className="font-medium text-sm text-gray-900">{folder.nom}</div>
                          <div className="text-xs text-gray-500">{folder.count} documents</div>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-80"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-3 py-1"
                  >
                    <option value="date">Date</option>
                    <option value="nom">Nom</option>
                    <option value="taille">Taille</option>
                  </select>
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="tous">Tous</TabsTrigger>
                  <TabsTrigger value="recents">Récents</TabsTrigger>
                  <TabsTrigger value="en_attente">En attente</TabsTrigger>
                  <TabsTrigger value="validé">Validés</TabsTrigger>
                  <TabsTrigger value="partages">Partagés</TabsTrigger>
                  <TabsTrigger value="favoris">Favoris</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {filteredDocuments.map((doc, index) => {
                  const FileIcon = getFileIcon(doc.format);
                  
                  return (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-green-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="relative">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              doc.format === 'PDF' ? 'bg-red-100' :
                              doc.format === 'DOCX' ? 'bg-blue-100' :
                              doc.format === 'DWG' ? 'bg-purple-100' : 'bg-gray-100'
                            }`}>
                              <FileIcon className={`h-6 w-6 ${
                                doc.format === 'PDF' ? 'text-red-600' :
                                doc.format === 'DOCX' ? 'text-blue-600' :
                                doc.format === 'DWG' ? 'text-purple-600' : 'text-gray-600'
                              }`} />
                            </div>
                            {doc.blockchain && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <Lock className="h-2 w-2 text-white" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 truncate">{doc.nom}</h4>
                              {doc.signature && <CheckCircle className="h-4 w-4 text-green-500" />}
                              {doc.priority === 'haute' && <Star className="h-4 w-4 text-yellow-500" />}
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span className="truncate">{doc.client}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{doc.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{doc.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                <span>{doc.taille}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getStatusColor(doc.statut)} variant="secondary">
                                {doc.statut === 'validé' ? 'Validé' :
                                 doc.statut === 'en_cours' ? 'En cours' :
                                 doc.statut === 'en_attente' ? 'En attente' : 'Expiré'}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                v{doc.version}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {doc.format}
                              </Badge>
                              {doc.commentaires > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {doc.commentaires} commentaires
                                </Badge>
                              )}
                            </div>
                            
                            {doc.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {doc.tags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                  >
                                    <Tag className="h-2 w-2" />
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            <p className="text-sm text-gray-500 line-clamp-2">{doc.description}</p>
                            
                            {doc.partage.length > 0 && (
                              <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                                <Share2 className="h-3 w-3" />
                                <span>Partagé avec {doc.partage.length} personne(s)</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 ml-4">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" title="Prévisualiser">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Télécharger">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Partager">
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Copier">
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Modifier">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="text-xs text-gray-500 text-right">
                            <div>Modifié: {doc.dateModification}</div>
                            {doc.blockchain && (
                              <div className="flex items-center gap-1 text-green-600">
                                <Lock className="h-3 w-3" />
                                <span>Blockchain</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                
                {filteredDocuments.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucun document trouvé
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Aucun document ne correspond à vos critères de recherche
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un document
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default AgentFoncierDocuments;