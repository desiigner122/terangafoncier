import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Upload, Download, Search, Filter, MoreVertical,
  Eye, Edit, Trash2, Share, Star, Clock, User, Calendar,
  File, Image, Archive, FolderOpen, Plus, Grid, List
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Helmet } from 'react-helmet-async';
import ModernSidebar from '@/components/layout/ModernSidebar';
import { useUser } from '@/hooks/useUser';

const DocumentsPage = () => {
  const { user, profile } = useUser();
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Données simulées des documents
  const [documents] = useState([
    {
      id: 1,
      name: 'Titre Foncier - Terrain Mbour',
      type: 'PDF',
      size: '2.4 MB',
      uploadDate: '2024-03-15',
      category: 'legal',
      shared: true,
      starred: true,
      thumbnail: null
    },
    {
      id: 2,
      name: 'Photos Terrain - Dakar',
      type: 'Images',
      size: '15.2 MB',
      uploadDate: '2024-03-14',
      category: 'media',
      shared: false,
      starred: false,
      thumbnail: '/api/placeholder/150/100'
    },
    {
      id: 3,
      name: 'Contrat de Vente',
      type: 'PDF',
      size: '1.8 MB',
      uploadDate: '2024-03-12',
      category: 'contracts',
      shared: true,
      starred: false,
      thumbnail: null
    },
    {
      id: 4,
      name: 'Plans Architecturaux',
      type: 'PDF',
      size: '8.7 MB',
      uploadDate: '2024-03-10',
      category: 'plans',
      shared: false,
      starred: true,
      thumbnail: null
    }
  ]);

  const categories = [
    { id: 'all', label: 'Tous les documents', count: documents.length },
    { id: 'legal', label: 'Documents légaux', count: documents.filter(d => d.category === 'legal').length },
    { id: 'contracts', label: 'Contrats', count: documents.filter(d => d.category === 'contracts').length },
    { id: 'media', label: 'Photos & Vidéos', count: documents.filter(d => d.category === 'media').length },
    { id: 'plans', label: 'Plans & Dessins', count: documents.filter(d => d.category === 'plans').length }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.category === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files) {
      console.log('Fichiers à uploader:', files);
      // Logique d'upload ici
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-8 h-8 text-red-500" />;
      case 'Images':
        return <Image className="w-8 h-8 text-blue-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="flex">
      <ModernSidebar currentPage="documents" />
      <div className="flex-1 ml-80 p-6 bg-gray-50 min-h-screen">
        <Helmet>
          <title>Documents - Teranga Foncier</title>
          <meta name="description" content="Gestion des documents de Teranga Foncier" />
        </Helmet>

        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Documents</h1>
            <p className="text-gray-600">Gérez tous vos documents importants</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            
            <label htmlFor="file-upload">
              <Button asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Uploader
                </span>
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
            />
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Rechercher des documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.label} ({category.count})
              </option>
            ))}
          </select>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Documents</p>
                  <p className="text-2xl font-bold">{documents.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Partagés</p>
                  <p className="text-2xl font-bold">{documents.filter(d => d.shared).length}</p>
                </div>
                <Share className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Favoris</p>
                  <p className="text-2xl font-bold">{documents.filter(d => d.starred).length}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Espace utilisé</p>
                  <p className="text-2xl font-bold">28.1 MB</p>
                </div>
                <Archive className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des documents */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocuments.map((document) => (
              <motion.div
                key={document.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      {getFileIcon(document.type)}
                      <div className="flex items-center space-x-1">
                        {document.starred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                        {document.shared && <Share className="w-4 h-4 text-green-500" />}
                      </div>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mb-2 truncate" title={document.name}>
                      {document.name}
                    </h3>
                    
                    <div className="space-y-1 text-sm text-gray-500">
                      <p>{document.size}</p>
                      <p>{formatDate(document.uploadDate)}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <Badge variant="secondary" className="text-xs">
                        {document.type}
                      </Badge>
                      
                      <Button size="sm" variant="ghost">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200">
                    <tr className="text-left">
                      <th className="px-6 py-3 text-sm font-medium text-gray-900">Nom</th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-900">Type</th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-900">Taille</th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-900">Date</th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-900">Statut</th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDocuments.map((document) => (
                      <tr key={document.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            {getFileIcon(document.type)}
                            <div>
                              <div className="font-medium text-gray-900">{document.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="secondary">{document.type}</Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{document.size}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{formatDate(document.uploadDate)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {document.starred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                            {document.shared && <Share className="w-4 h-4 text-green-500" />}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun document trouvé
            </h3>
            <p className="text-gray-500 mb-4">
              Aucun document ne correspond à vos critères de recherche
            </p>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Uploader votre premier document
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;
