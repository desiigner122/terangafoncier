import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Archive, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  Clock,
  Tag,
  Folder,
  FileText,
  Star,
  SortAsc,
  SortDesc,
  ChevronDown,
  ChevronRight,
  History,
  Lock,
  Shield,
  Award,
  BookOpen,
  Hash
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';

const NotaireArchives = () => {
  const [archives, setArchives] = useState([]);
  const [filteredArchives, setFilteredArchives] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArchive, setSelectedArchive] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const archivesPerPage = 12;

  // Types d'archives
  const archiveTypes = [
    { value: 'all', label: 'Tous les types' },
    { value: 'vente_immobiliere', label: 'Ventes immobilières' },
    { value: 'succession', label: 'Successions' },
    { value: 'donation', label: 'Donations' },
    { value: 'hypotheque', label: 'Hypothèques' },
    { value: 'constitution_societe', label: 'Constitutions société' },
    { value: 'testament', label: 'Testaments' },
    { value: 'procuration', label: 'Procurations' },
    { value: 'autres', label: 'Autres actes' }
  ];

  // Années disponibles
  const availableYears = ['all', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];

  // Options de tri
  const sortOptions = [
    { value: 'date_desc', label: 'Plus récent' },
    { value: 'date_asc', label: 'Plus ancien' },
    { value: 'client_asc', label: 'Client A-Z' },
    { value: 'client_desc', label: 'Client Z-A' },
    { value: 'value_desc', label: 'Valeur décroissante' },
    { value: 'value_asc', label: 'Valeur croissante' }
  ];

  // Données simulées des archives
  const mockArchives = [
    {
      id: 'ARC-2024-001',
      title: 'Vente Villa Almadies - Famille Diallo',
      type: 'vente_immobiliere',
      client: 'Famille Diallo',
      date: '2024-01-20',
      year: '2024',
      value: 85000000,
      status: 'archived',
      documents: ['Acte de vente', 'Titre foncier', 'Plan cadastral'],
      location: 'Almadies, Dakar',
      notaryFees: 850000,
      blockchainHash: '0x1a2b3c4d5e6f7890abcdef',
      tags: ['vente', 'villa', 'almadies'],
      category: 'immobilier',
      confidentiality: 'high',
      storageLocation: 'Armoire A - Rayon 3 - Case 12'
    },
    {
      id: 'ARC-2024-002',
      title: 'Succession Terrain Parcelles - Héritiers Ndiaye',
      type: 'succession',
      client: 'Héritiers Ndiaye',
      date: '2024-01-15',
      year: '2024',
      value: 25000000,
      status: 'archived',
      documents: ['Acte de décès', 'Testament', 'Certificat hérédité', 'Acte de partage'],
      location: 'Parcelles Assainies',
      notaryFees: 375000,
      blockchainHash: '0x2b3c4d5e6f7890abcdef12',
      tags: ['succession', 'terrain', 'parcelles'],
      category: 'succession',
      confidentiality: 'high',
      storageLocation: 'Armoire B - Rayon 1 - Case 8'
    },
    {
      id: 'ARC-2023-156',
      title: 'Constitution SARLU Teranga Business',
      type: 'constitution_societe',
      client: 'SARLU Teranga Business',
      date: '2023-12-20',
      year: '2023',
      value: 10000000,
      status: 'archived',
      documents: ['Statuts', 'PV AG constitutive', 'Déclaration notariée'],
      location: 'Médina, Dakar',
      notaryFees: 500000,
      blockchainHash: '0x3c4d5e6f7890abcdef123',
      tags: ['société', 'constitution', 'sarlu'],
      category: 'commercial',
      confidentiality: 'medium',
      storageLocation: 'Armoire C - Rayon 2 - Case 5'
    },
    {
      id: 'ARC-2023-134',
      title: 'Donation Appartement - M. et Mme Seck',
      type: 'donation',
      client: 'M. et Mme Seck',
      date: '2023-11-10',
      year: '2023',
      value: 45000000,
      status: 'archived',
      documents: ['Acte de donation', 'Certificat propriété', 'Quitus fiscal'],
      location: 'Plateau, Dakar',
      notaryFees: 675000,
      blockchainHash: '0x4d5e6f7890abcdef1234',
      tags: ['donation', 'appartement', 'plateau'],
      category: 'familial',
      confidentiality: 'high',
      storageLocation: 'Armoire A - Rayon 1 - Case 15'
    },
    {
      id: 'ARC-2023-089',
      title: 'Testament Olographe - Mme Ba',
      type: 'testament',
      client: 'Succession Ba',
      date: '2023-08-15',
      year: '2023',
      value: 75000000,
      status: 'archived',
      documents: ['Testament olographe', 'Acte d\'ouverture', 'Inventaire succession'],
      location: 'Fann, Dakar',
      notaryFees: 450000,
      blockchainHash: '0x5e6f7890abcdef12345',
      tags: ['testament', 'succession', 'fann'],
      category: 'succession',
      confidentiality: 'high',
      storageLocation: 'Coffre sécurisé - Section T'
    },
    {
      id: 'ARC-2022-245',
      title: 'Hypothèque Immeuble Médina - Banque Atlantique',
      type: 'hypotheque',
      client: 'Banque Atlantique / M. Diop',
      date: '2022-09-30',
      year: '2022',
      value: 120000000,
      status: 'archived',
      documents: ['Acte d\'hypothèque', 'Mainlevée', 'Évaluation bien'],
      location: 'Médina, Dakar',
      notaryFees: 1200000,
      blockchainHash: '0x6f7890abcdef123456',
      tags: ['hypothèque', 'banque', 'médina'],
      category: 'financier',
      confidentiality: 'high',
      storageLocation: 'Armoire D - Rayon 4 - Case 2'
    }
  ];

  useEffect(() => {
    setArchives(mockArchives);
    setFilteredArchives(mockArchives);
  }, []);

  // Filtrage et tri des archives
  useEffect(() => {
    let filtered = archives;

    // Recherche textuelle
    if (searchTerm) {
      filtered = filtered.filter(archive =>
        archive.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        archive.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        archive.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        archive.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtre par année
    if (yearFilter !== 'all') {
      filtered = filtered.filter(archive => archive.year === yearFilter);
    }

    // Filtre par type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(archive => archive.type === typeFilter);
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.date) - new Date(a.date);
        case 'date_asc':
          return new Date(a.date) - new Date(b.date);
        case 'client_asc':
          return a.client.localeCompare(b.client);
        case 'client_desc':
          return b.client.localeCompare(a.client);
        case 'value_desc':
          return b.value - a.value;
        case 'value_asc':
          return a.value - b.value;
        default:
          return 0;
      }
    });

    setFilteredArchives(filtered);
    setCurrentPage(1);
  }, [searchTerm, yearFilter, typeFilter, sortBy, archives]);

  // Pagination
  const totalPages = Math.ceil(filteredArchives.length / archivesPerPage);
  const startIndex = (currentPage - 1) * archivesPerPage;
  const paginatedArchives = filteredArchives.slice(startIndex, startIndex + archivesPerPage);

  // Handlers
  const handleViewArchive = (archive) => {
    setSelectedArchive(archive);
    window.safeGlobalToast({
      title: "Archive consultée",
      description: `Consultation de l'archive ${archive.id}`,
      variant: "success"
    });
  };

  const handleDownloadArchive = (archiveId) => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Téléchargement démarré",
        description: `Archive ${archiveId} en cours de téléchargement`,
        variant: "success"
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleExportReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Rapport exporté",
        description: "Rapport d'archives généré avec succès",
        variant: "success"
      });
      setIsLoading(false);
    }, 2000);
  };

  const getConfidentialityColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidentialityIcon = (level) => {
    switch (level) {
      case 'high': return <Lock className="h-3 w-3" />;
      case 'medium': return <Shield className="h-3 w-3" />;
      case 'low': return <Eye className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  // Grouper les archives par année
  const archivesByYear = paginatedArchives.reduce((acc, archive) => {
    const year = archive.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(archive);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Archives Notariales</h2>
          <p className="text-gray-600 mt-1">
            Consultation et gestion des archives d'actes notariés
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button 
            variant="outline"
            onClick={handleExportReport}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter Rapport
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Archives</p>
                <p className="text-2xl font-bold">{archives.length}</p>
              </div>
              <Archive className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cette année</p>
                <p className="text-2xl font-bold text-blue-600">
                  {archives.filter(a => a.year === '2024').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confidentiels</p>
                <p className="text-2xl font-bold text-red-600">
                  {archives.filter(a => a.confidentiality === 'high').length}
                </p>
              </div>
              <Lock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valeur totale</p>
                <p className="text-2xl font-bold text-green-600">
                  {(archives.reduce((sum, a) => sum + a.value, 0) / 1000000000).toFixed(1)}Md
                </p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher archives..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par année" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year}>
                    {year === 'all' ? 'Toutes les années' : year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                {archiveTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center justify-end text-sm text-gray-600">
              {filteredArchives.length} archive(s) trouvée(s)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des archives groupées par année */}
      <div className="space-y-6">
        {Object.entries(archivesByYear)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([year, yearArchives]) => (
            <Card key={year}>
              <CardHeader>
                <Collapsible defaultOpen={year === '2024'}>
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between cursor-pointer">
                      <CardTitle className="flex items-center">
                        <History className="h-5 w-5 mr-2 text-purple-600" />
                        Année {year} ({yearArchives.length} archives)
                      </CardTitle>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {yearArchives.map((archive) => (
                          <motion.div
                            key={archive.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="cursor-pointer"
                            onClick={() => handleViewArchive(archive)}
                          >
                            <Card className="hover:shadow-lg transition-shadow">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  {/* En-tête de l'archive */}
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-gray-900 text-sm">
                                        {archive.title}
                                      </h4>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {archive.id}
                                      </p>
                                    </div>
                                    <Badge className={getConfidentialityColor(archive.confidentiality)}>
                                      {getConfidentialityIcon(archive.confidentiality)}
                                      <span className="ml-1 text-xs">
                                        {archive.confidentiality}
                                      </span>
                                    </Badge>
                                  </div>

                                  {/* Informations client */}
                                  <div className="flex items-center space-x-2">
                                    <Folder className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                      {archive.client}
                                    </span>
                                  </div>

                                  {/* Date et valeur */}
                                  <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center space-x-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>{archive.date}</span>
                                    </div>
                                    <span className="font-medium">
                                      {(archive.value / 1000000).toFixed(1)}M FCFA
                                    </span>
                                  </div>

                                  {/* Documents et localisation */}
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-1">
                                      <FileText className="h-3 w-3 text-gray-400" />
                                      <span className="text-xs text-gray-500">
                                        {archive.documents.length} document(s)
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      📍 {archive.storageLocation}
                                    </div>
                                  </div>

                                  {/* Tags */}
                                  <div className="flex flex-wrap gap-1">
                                    {archive.tags.slice(0, 3).map((tag) => (
                                      <Badge key={tag} variant="outline" className="text-xs">
                                        <Tag className="h-2 w-2 mr-1" />
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>

                                  {/* Hash blockchain */}
                                  {archive.blockchainHash && (
                                    <div className="bg-blue-50 p-2 rounded text-xs">
                                      <div className="flex items-center space-x-1 mb-1">
                                        <Hash className="h-3 w-3 text-blue-600" />
                                        <span className="text-blue-800 font-medium">
                                          Blockchain
                                        </span>
                                      </div>
                                      <code className="text-blue-600 break-all">
                                        {archive.blockchainHash.slice(0, 20)}...
                                      </code>
                                    </div>
                                  )}

                                  {/* Actions */}
                                  <div className="flex items-center justify-between pt-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownloadArchive(archive.id);
                                      }}
                                      disabled={isLoading}
                                    >
                                      <Download className="h-3 w-3" />
                                    </Button>
                                    <span className="text-xs text-gray-400">
                                      {archiveTypes.find(t => t.value === archive.type)?.label}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </CardHeader>
            </Card>
          ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </Button>
        </div>
      )}

      {/* Détails de l'archive sélectionnée */}
      {selectedArchive && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Détails de l'Archive - {selectedArchive.id}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedArchive(null)}
              >
                Fermer
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Informations générales</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Client:</span>
                      <span className="font-medium">{selectedArchive.client}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span>{selectedArchive.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valeur:</span>
                      <span className="font-medium">
                        {(selectedArchive.value / 1000000).toFixed(1)}M FCFA
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Honoraires:</span>
                      <span>{(selectedArchive.notaryFees / 1000).toFixed(0)}K FCFA</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Localisation</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Propriété:</span>
                      <span>{selectedArchive.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stockage:</span>
                      <span>{selectedArchive.storageLocation}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Documents</h4>
                  <div className="space-y-1">
                    {selectedArchive.documents.map((doc, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <FileText className="h-3 w-3 text-gray-400" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Sécurité</h4>
                  <div className="space-y-2">
                    <Badge className={getConfidentialityColor(selectedArchive.confidentiality)}>
                      {getConfidentialityIcon(selectedArchive.confidentiality)}
                      <span className="ml-1">
                        Confidentialité {selectedArchive.confidentiality}
                      </span>
                    </Badge>
                    {selectedArchive.blockchainHash && (
                      <div className="bg-blue-50 p-2 rounded text-xs">
                        <div className="flex items-center space-x-1 mb-1">
                          <Hash className="h-3 w-3 text-blue-600" />
                          <span className="text-blue-800 font-medium">Hash Blockchain</span>
                        </div>
                        <code className="text-blue-600 break-all">
                          {selectedArchive.blockchainHash}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotaireArchives;