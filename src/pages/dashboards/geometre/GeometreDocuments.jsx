import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Upload, 
  Search, 
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Share2,
  Lock,
  Unlock,
  Calendar,
  User,
  Tag,
  FolderOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GeometreDocuments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  // Documents simulés
  const documents = [
    {
      id: 1,
      name: 'Plan topographique - Parcelle 1247',
      type: 'Plan CAD',
      category: 'topographie',
      size: '2.4 MB',
      format: 'DWG',
      dateCreated: '2025-09-20',
      lastModified: '2025-09-25',
      client: 'SARL Sénégal Construction',
      status: 'finalisé',
      isPrivate: false,
      thumbnail: '/api/placeholder/150/100'
    },
    {
      id: 2,
      name: 'Rapport de levé GPS - Zone Industrielle',
      type: 'Rapport',
      category: 'mesures',
      size: '856 KB',
      format: 'PDF',
      dateCreated: '2025-09-18',
      lastModified: '2025-09-24',
      client: 'Ministère de l\'Urbanisme',
      status: 'en_cours',
      isPrivate: true,
      thumbnail: '/api/placeholder/150/100'
    },
    {
      id: 3,
      name: 'Certificat de bornage - Résidence Les Almadies',
      type: 'Certificat',
      category: 'cadastral',
      size: '1.2 MB',
      format: 'PDF',
      dateCreated: '2025-09-15',
      lastModified: '2025-09-23',
      client: 'Promoteur Almadies SA',
      status: 'approuvé',
      isPrivate: false,
      thumbnail: '/api/placeholder/150/100'
    },
    {
      id: 4,
      name: 'Modèle 3D - Terrain Parcelles',
      type: 'Modèle 3D',
      category: 'modelisation',
      size: '15.7 MB',
      format: 'OBJ',
      dateCreated: '2025-09-12',
      lastModified: '2025-09-22',
      client: 'Direction du Cadastre',
      status: 'révision',
      isPrivate: true,
      thumbnail: '/api/placeholder/150/100'
    },
    {
      id: 5,
      name: 'Contrat de prestation - Lotissement Keur Massar',
      type: 'Contrat',
      category: 'administratif',
      size: '425 KB',
      format: 'DOCX',
      dateCreated: '2025-09-10',
      lastModified: '2025-09-21',
      client: 'Mairie de Keur Massar',
      status: 'signé',
      isPrivate: false,
      thumbnail: '/api/placeholder/150/100'
    },
    {
      id: 6,
      name: 'Données LiDAR - Forêt de Mbao',
      type: 'Données LiDAR',
      category: 'mesures',
      size: '234 MB',
      format: 'LAS',
      dateCreated: '2025-09-08',
      lastModified: '2025-09-20',
      client: 'Ministère de l\'Environnement',
      status: 'traitement',
      isPrivate: true,
      thumbnail: '/api/placeholder/150/100'
    }
  ];

  const categories = [
    { value: 'all', label: 'Tous les documents' },
    { value: 'topographie', label: 'Topographie' },
    { value: 'cadastral', label: 'Cadastral' },
    { value: 'mesures', label: 'Mesures & Levés' },
    { value: 'modelisation', label: 'Modélisation 3D' },
    { value: 'administratif', label: 'Administratif' }
  ];

  const statusColors = {
    'finalisé': 'bg-green-100 text-green-800',
    'en_cours': 'bg-blue-100 text-blue-800',
    'approuvé': 'bg-emerald-100 text-emerald-800',
    'révision': 'bg-orange-100 text-orange-800',
    'signé': 'bg-purple-100 text-purple-800',
    'traitement': 'bg-yellow-100 text-yellow-800'
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const DocumentCard = ({ document: doc }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <FileText className="h-8 w-8 text-blue-600" />
          {doc.isPrivate && <Lock className="h-4 w-4 text-gray-500" />}
        </div>
        <Badge className={statusColors[doc.status]}>
          {doc.status.replace('_', ' ')}
        </Badge>
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
        {doc.name}
      </h3>
      
      <div className="space-y-1 text-sm text-gray-600 mb-3">
        <p>Client: {doc.client}</p>
        <p>Format: {doc.format} • {doc.size}</p>
        <p>Modifié: {new Date(doc.lastModified).toLocaleDateString('fr-FR')}</p>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex space-x-2">
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex space-x-1">
          <Button size="sm" variant="ghost">
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-800">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600">Gestion centralisée de vos documents géométriques</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Upload className="h-4 w-4 mr-2" />
          Télécharger un document
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-blue-600">{documents.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-orange-600">
                  {documents.filter(d => d.status === 'en_cours' || d.status === 'révision').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Privés</p>
                <p className="text-2xl font-bold text-purple-600">
                  {documents.filter(d => d.isPrivate).length}
                </p>
              </div>
              <Lock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taille totale</p>
                <p className="text-2xl font-bold text-green-600">256 MB</p>
              </div>
              <FolderOpen className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher des documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-60">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Plus de filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Onglets de contenu */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="recent">Récents</TabsTrigger>
          <TabsTrigger value="shared">Partagés</TabsTrigger>
          <TabsTrigger value="private">Privés</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map(doc => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments
              .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
              .slice(0, 6)
              .map(doc => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="shared" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments
              .filter(doc => !doc.isPrivate)
              .map(doc => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="private" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments
              .filter(doc => doc.isPrivate)
              .map(doc => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun document trouvé</h3>
          <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
        </div>
      )}
    </div>
  );
};

export default GeometreDocuments;