import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Upload, 
  Download, 
  Search, 
  Filter, 
  Star, 
  Trash2, 
  Eye, 
  Share, 
  MoreVertical,
  FolderOpen,
  File,
  Image,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  Plus,
  Grid3X3,
  List,
  Calendar,
  User
} from 'lucide-react';
import { useUser } from '@/hooks/useUserFixed';

const DocumentsPage = () => {
  const { user, profile } = useUser();
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterType, setFilterType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Données simulées pour les dossiers
  const mockFolders = [
    { id: 1, name: 'Contrats', icon: FileText, count: 12, color: 'bg-blue-500' },
    { id: 2, name: 'Factures', icon: FileSpreadsheet, count: 8, color: 'bg-green-500' },
    { id: 3, name: 'Photos Terrains', icon: Image, count: 24, color: 'bg-purple-500' },
    { id: 4, name: 'Documents Officiels', icon: FileText, count: 6, color: 'bg-red-500' },
    { id: 5, name: 'Archives', icon: FolderOpen, count: 15, color: 'bg-gray-500' }
  ];

  // Données simulées pour les documents
  const mockDocuments = [
    {
      id: 1,
      name: 'Contrat_Terrain_Almadies_2024.pdf',
      type: 'pdf',
      size: '2.5 MB',
      createdAt: new Date('2024-01-15'),
      modifiedAt: new Date('2024-01-20'),
      owner: 'Vous',
      folder: 'Contrats',
      isStarred: true,
      isShared: false,
      thumbnail: null
    },
    {
      id: 2,
      name: 'Facture_Notaire_Janvier.pdf',
      type: 'pdf',
      size: '1.2 MB',
      createdAt: new Date('2024-01-22'),
      modifiedAt: new Date('2024-01-22'),
      owner: 'Me. Diallo',
      folder: 'Factures',
      isStarred: false,
      isShared: true,
      thumbnail: null
    },
    {
      id: 3,
      name: 'Photo_Terrain_Vue_Aerienne.jpg',
      type: 'image',
      size: '4.8 MB',
      createdAt: new Date('2024-01-10'),
      modifiedAt: new Date('2024-01-10'),
      owner: 'Vous',
      folder: 'Photos Terrains',
      isStarred: false,
      isShared: false,
      thumbnail: '/api/YOUR_API_KEY/150/100'
    },
    {
      id: 4,
      name: 'Acte_Propriete_Original.pdf',
      type: 'pdf',
      size: '3.1 MB',
      createdAt: new Date('2024-01-05'),
      modifiedAt: new Date('2024-01-05'),
      owner: 'Administration',
      folder: 'Documents Officiels',
      isStarred: true,
      isShared: false,
      thumbnail: null
    },
    {
      id: 5,
      name: 'Plan_Cadastral_Zone_A.pdf',
      type: 'pdf',
      size: '5.2 MB',
      createdAt: new Date('2024-01-08'),
      modifiedAt: new Date('2024-01-08'),
      owner: 'Géomètre Sall',
      folder: 'Documents Officiels',
      isStarred: false,
      isShared: true,
      thumbnail: null
    },
    {
      id: 6,
      name: 'Estimation_Terrain_2024.xlsx',
      type: 'spreadsheet',
      size: '890 KB',
      createdAt: new Date('2024-01-25'),
      modifiedAt: new Date('2024-01-26'),
      owner: 'Vous',
      folder: 'Factures',
      isStarred: false,
      isShared: false,
      thumbnail: null
    }
  ];

  useEffect(() => {
    // Simuler le chargement des documents
    setTimeout(() => {
      setFolders(mockFolders);
      setDocuments(mockDocuments);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Obtenir l'icône du type de fichier
  const getFileIcon = (type) => {
    const icons = {
      pdf: FileText,
      image: Image,
      video: FileVideo,
      audio: FileAudio,
      spreadsheet: FileSpreadsheet,
      default: File
    };
    return icons[type] || icons.default;
  };

  // Filtrer les documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = !selectedFolder || doc.folder === selectedFolder.name;
    
    if (filterType === 'all') return matchesSearch && matchesFolder;
    if (filterType === 'starred') return matchesSearch && matchesFolder && doc.isStarred;
    if (filterType === 'shared') return matchesSearch && matchesFolder && doc.isShared;
    if (filterType === 'mine') return matchesSearch && matchesFolder && doc.owner === 'Vous';
    
    return matchesSearch && matchesFolder;
  });

  // Formater la date
  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Gérer l'upload de fichier
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    
    // Simuler l'upload
    setTimeout(() => {
      const newDocuments = files.map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        type: file.type.includes('image') ? 'image' : file.type.includes('pdf') ? 'pdf' : 'default',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        createdAt: new Date(),
        modifiedAt: new Date(),
        owner: 'Vous',
        folder: selectedFolder?.name || 'Documents',
        isStarred: false,
        isShared: false,
        thumbnail: null
      }));

      setDocuments(prev => [...newDocuments, ...prev]);
      setIsUploading(false);
    }, 2000);
  };

  // Basculer le statut favori
  const toggleStar = (docId) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, isStarred: !doc.isStarred } : doc
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            Documents
          </h1>
          <p className="text-gray-600 mt-2">Gérez tous vos documents et fichiers</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
          </Button>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Button asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? 'Upload...' : 'Uploader'}
            </label>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar avec dossiers */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Dossiers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant={!selectedFolder ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedFolder(null)}
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Tous les documents
            </Button>
            
            {folders.map((folder) => (
              <Button
                key={folder.id}
                variant={selectedFolder?.id === folder.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedFolder(folder)}
              >
                <folder.icon className="w-4 h-4 mr-2" />
                <span className="flex-1 text-left">{folder.name}</span>
                <Badge variant="secondary" className="ml-2">
                  {folder.count}
                </Badge>
              </Button>
            ))}

            <Button variant="ghost" className="w-full justify-start text-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau dossier
            </Button>
          </CardContent>
        </Card>

        {/* Zone principale des documents */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filtres et recherche */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input 
                      placeholder="Rechercher des documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Tabs value={filterType} onValueChange={setFilterType}>
                  <TabsList>
                    <TabsTrigger value="all">Tous</TabsTrigger>
                    <TabsTrigger value="mine">Mes docs</TabsTrigger>
                    <TabsTrigger value="starred">Favoris</TabsTrigger>
                    <TabsTrigger value="shared">Partagés</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          {/* Liste des documents */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {selectedFolder ? selectedFolder.name : 'Tous les documents'}
                </CardTitle>
                <div className="text-sm text-gray-500">
                  {filteredDocuments.length} document(s)
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredDocuments.map((document) => {
                    const FileIcon = getFileIcon(document.type);
                    
                    return (
                      <motion.div
                        key={document.id}
                        whileHover={{ scale: 1.02 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                              {document.thumbnail ? (
                                <img 
                                  src={document.thumbnail} 
                                  alt={document.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                <FileIcon className="w-6 h-6 text-primary" />
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => toggleStar(document.id)}
                              >
                                <Star className={`w-4 h-4 ${
                                  document.isStarred ? 'text-yellow-500 fill-current' : 'text-gray-400'
                                }`} />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-sm truncate" title={document.name}>
                              {document.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {document.size} â€¢ {formatDate(document.modifiedAt)}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              {document.isShared && (
                                <Badge variant="secondary" className="text-xs">
                                  <Share className="w-3 h-3 mr-1" />
                                  Partagé
                                </Badge>
                              )}
                            </div>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredDocuments.map((document) => {
                    const FileIcon = getFileIcon(document.type);
                    
                    return (
                      <motion.div
                        key={document.id}
                        whileHover={{ backgroundColor: '#f9fafb' }}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded">
                          <FileIcon className="w-5 h-5 text-primary" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{document.name}</h4>
                          <p className="text-sm text-gray-500">
                            {document.owner} â€¢ {document.size} â€¢ {formatDate(document.modifiedAt)}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {document.isShared && (
                            <Share className="w-4 h-4 text-blue-500" />
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toggleStar(document.id)}
                          >
                            <Star className={`w-4 h-4 ${
                              document.isStarred ? 'text-yellow-500 fill-current' : 'text-gray-400'
                            }`} />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
              
              {filteredDocuments.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-500 mb-2">Aucun document trouvé</h3>
                  <p className="text-gray-400">
                    {searchTerm ? 'Essayez de modifier votre recherche' : 'Commencez par uploader vos premiers documents'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;

