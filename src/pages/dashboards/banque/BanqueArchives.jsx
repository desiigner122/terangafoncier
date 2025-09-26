import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Archive, 
  Search, 
  Filter, 
  Calendar, 
  Eye, 
  Download, 
  FileText, 
  Building2, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Folder,
  FolderOpen,
  Database,
  BarChart3,
  ArrowUpDown,
  MoreHorizontal,
  Star,
  Tag
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const BanqueArchives = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2024');

  // Données d'archives simulées
  const archiveStats = {
    totalDocuments: 15847,
    creditsApprouves: 1203,
    creditsRejetes: 289,
    documentsImportants: 456,
    espaceDisk: '2.8 GB'
  };

  const archivedCredits = [
    {
      id: 'CR-2023-0892',
      client: 'Amadou Diallo',
      montant: '85,000,000 FCFA',
      terrain: 'Terrain Almadies - 500m²',
      statut: 'Approuvé',
      dateApprobation: '2023-12-15',
      dateArchivage: '2024-01-20',
      notaire: 'Me Fatou Ndiaye',
      documents: 12,
      importance: 'haute',
      tokenNFT: 'TF-NFT-8923'
    },
    {
      id: 'CR-2023-0891',
      client: 'Société IMMOSN',
      montant: '250,000,000 FCFA',
      terrain: 'Complexe commercial Plateau',
      statut: 'Approuvé',
      dateApprobation: '2023-12-10',
      dateArchivage: '2024-01-18',
      notaire: 'Me Ousmane Ba',
      documents: 18,
      importance: 'haute',
      tokenNFT: 'TF-NFT-8891'
    },
    {
      id: 'CR-2023-0890',
      client: 'Fatou Sarr',
      montant: '45,000,000 FCFA',
      terrain: 'Terrain résidentiel Rufisque',
      statut: 'Rejeté',
      dateRejet: '2023-12-05',
      dateArchivage: '2024-01-15',
      motifRejet: 'Revenus insuffisants',
      documents: 8,
      importance: 'moyenne'
    },
    {
      id: 'CR-2023-0889',
      client: 'Moussa Thiam',
      montant: '120,000,000 FCFA',
      terrain: 'Villa Mermoz - 300m²',
      statut: 'Approuvé',
      dateApprobation: '2023-11-28',
      dateArchivage: '2024-01-10',
      notaire: 'Me Aïcha Ndiaye',
      documents: 15,
      importance: 'haute',
      tokenNFT: 'TF-NFT-8889'
    }
  ];

  const documentCategories = [
    { id: 'credits', label: 'Dossiers Crédit', count: 1492, icon: FileText },
    { id: 'evaluations', label: 'Évaluations', count: 892, icon: BarChart3 },
    { id: 'garanties', label: 'Garanties', count: 567, icon: Building2 },
    { id: 'juridique', label: 'Documents Juridiques', count: 234, icon: Archive },
    { id: 'blockchain', label: 'Tokens NFT', count: 1203, icon: Database }
  ];

  const getStatutColor = (statut) => {
    switch (statut.toLowerCase()) {
      case 'approuvé': return 'bg-green-100 text-green-800';
      case 'rejeté': return 'bg-red-100 text-red-800';
      case 'en cours': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'haute': return 'text-red-600';
      case 'moyenne': return 'text-yellow-600';
      case 'basse': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const handleViewCredit = (creditId) => {
    window.safeGlobalToast({
      title: "Consultation archive",
      description: `Ouverture du dossier ${creditId}`,
      variant: "success"
    });
  };

  const handleDownloadArchive = (creditId) => {
    window.safeGlobalToast({
      title: "Téléchargement en cours",
      description: `Archive ${creditId} en préparation`,
      variant: "success"
    });
  };

  const handleRestoreCredit = (creditId) => {
    window.safeGlobalToast({
      title: "Dossier restauré",
      description: `Le dossier ${creditId} a été restauré avec succès`,
      variant: "success"
    });
  };

  const filteredCredits = archivedCredits.filter(credit => {
    const matchesSearch = credit.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         credit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         credit.terrain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'approved' && credit.statut === 'Approuvé') ||
                           (selectedCategory === 'rejected' && credit.statut === 'Rejeté');
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Archives Bancaires</h2>
          <p className="text-gray-600 mt-1">
            Gestion et consultation des dossiers archivés TerangaCredit
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Archives
          </Button>
          <Button variant="outline">
            <Database className="h-4 w-4 mr-2" />
            Backup
          </Button>
        </div>
      </div>

      {/* Statistiques Archives */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Archive className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-xl font-bold">{archiveStats.totalDocuments.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Crédits Approuvés</p>
                <p className="text-xl font-bold">{archiveStats.creditsApprouves.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Crédits Rejetés</p>
                <p className="text-xl font-bold">{archiveStats.creditsRejetes.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Documents Importants</p>
                <p className="text-xl font-bold">{archiveStats.documentsImportants}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Espace Utilisé</p>
                <p className="text-xl font-bold">{archiveStats.espaceDisk}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="credits" className="space-y-4">
        <TabsList>
          <TabsTrigger value="credits">Dossiers Crédit</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
        </TabsList>

        <TabsContent value="credits" className="space-y-4">
          {/* Filtres et recherche */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Rechercher par client, référence, terrain..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="approved">Approuvés</SelectItem>
                    <SelectItem value="rejected">Rejetés</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Liste des dossiers archivés */}
          <div className="space-y-4">
            {filteredCredits.map((credit) => (
              <motion.div
                key={credit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{credit.id}</h3>
                      <Badge className={getStatutColor(credit.statut)}>
                        {credit.statut}
                      </Badge>
                      <Star className={`h-4 w-4 ${getImportanceColor(credit.importance)}`} />
                      {credit.tokenNFT && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700">
                          {credit.tokenNFT}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Client</p>
                        <p className="font-medium">{credit.client}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Montant</p>
                        <p className="font-medium">{credit.montant}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Terrain</p>
                        <p className="font-medium">{credit.terrain}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">
                          {credit.statut === 'Approuvé' ? 'Date approbation' : 'Date rejet'}
                        </p>
                        <p className="font-medium">
                          {credit.dateApprobation || credit.dateRejet}
                        </p>
                      </div>
                    </div>

                    {credit.notaire && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-600">Notaire : </span>
                        <span className="font-medium">{credit.notaire}</span>
                      </div>
                    )}

                    {credit.motifRejet && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-600">Motif de rejet : </span>
                        <span className="text-red-600 font-medium">{credit.motifRejet}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {credit.documents} docs
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleViewCredit(credit.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Consulter
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadArchive(credit.id)}>
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRestoreCredit(credit.id)}>
                          <Archive className="h-4 w-4 mr-2" />
                          Restaurer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                  <div className="flex items-center space-x-4">
                    <span>Archivé le {credit.dateArchivage}</span>
                    <span>ID: {credit.id}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3" />
                    <span>Archive permanente</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <category.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.label}</h3>
                      <p className="text-2xl font-bold text-blue-600">{category.count}</p>
                      <p className="text-xs text-gray-500">documents archivés</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="blockchain" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2 text-purple-600" />
                Archives Blockchain TerangaChain
              </CardTitle>
              <CardDescription>
                Tokens NFT et transactions blockchain archivées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">1,203</div>
                    <div className="text-sm text-gray-600">NFT Tokens</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">15,847</div>
                    <div className="text-sm text-gray-600">Transactions</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">100%</div>
                    <div className="text-sm text-gray-600">Vérifiées</div>
                  </div>
                </div>

                <div className="text-center py-12 text-gray-500">
                  <Database className="h-12 w-12 mx-auto mb-4" />
                  <p>Interface de consultation blockchain en développement</p>
                  <p className="text-sm">Accès aux hashes et métadonnées NFT</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BanqueArchives;