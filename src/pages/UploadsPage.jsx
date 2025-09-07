import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, FileText, Image, Video, FileSpreadsheet,
  Folder, Search, Filter, MoreVertical, Download,
  Trash2, Eye, Share2, Copy, Check, X, AlertCircle,
  HardDrive, Clock, User, Calendar,
  FolderPlus, Grid, List, SortAsc, SortDesc
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useDropzone } from 'react-dropzone';
import { Helmet } from 'react-helmet-async';
import ModernSidebar from '@/components/layout/ModernSidebar';
import { useUser } from '@/hooks/useUser';

const UploadsPage = () => {
  const { user, profile } = useUser();
  const [activeTab, setActiveTab] = useState('files');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  // Simulated file data
  const [files, setFiles] = useState([
    {
      id: 1,
      name: 'Plan_Terrain_Mbour.pdf',
      type: 'pdf',
      size: 2456789,
      uploadDate: '2024-03-15T14:30:00Z',
      uploadedBy: {
        name: 'Moussa Seck',
        avatar: null
      },
      category: 'documents',
      tags: ['plan', 'terrain', 'mbour'],
      downloads: 12,
      shared: true,
      url: '/uploads/documents/plan_terrain_mbour.pdf'
    },
    {
      id: 2,
      name: 'Photos_Propriete_Almadies.zip',
      type: 'zip',
      size: 15678912,
      uploadDate: '2024-03-15T10:15:00Z',
      uploadedBy: {
        name: 'Aminata Diallo',
        avatar: null
      },
      category: 'images',
      tags: ['photos', 'almadies', 'propriété'],
      downloads: 5,
      shared: false,
      url: '/uploads/images/photos_propriete_almadies.zip'
    },
    {
      id: 3,
      name: 'Contrat_Vente_Template.docx',
      type: 'docx',
      size: 89456,
      uploadDate: '2024-03-14T16:45:00Z',
      uploadedBy: {
        name: 'Admin Teranga',
        avatar: null
      },
      category: 'templates',
      tags: ['contrat', 'template', 'vente'],
      downloads: 34,
      shared: true,
      url: '/uploads/templates/contrat_vente_template.docx'
    },
    {
      id: 4,
      name: 'Video_Visite_Saly.mp4',
      type: 'mp4',
      size: 98765432,
      uploadDate: '2024-03-14T09:20:00Z',
      uploadedBy: {
        name: 'Fatou Ba',
        avatar: null
      },
      category: 'videos',
      tags: ['visite', 'saly', 'video'],
      downloads: 8,
      shared: true,
      url: '/uploads/videos/video_visite_saly.mp4'
    },
    {
      id: 5,
      name: 'Liste_Contacts_Export.xlsx',
      type: 'xlsx',
      size: 567890,
      uploadDate: '2024-03-13T11:30:00Z',
      uploadedBy: {
        name: 'CRM System',
        avatar: null
      },
      category: 'exports',
      tags: ['export', 'contacts', 'crm'],
      downloads: 3,
      shared: false,
      url: '/uploads/exports/liste_contacts_export.xlsx'
    }
  ]);

  const [folders] = useState([
    { id: 1, name: 'Documents Légaux', fileCount: 15, size: 45678901 },
    { id: 2, name: 'Plans et Cartes', fileCount: 28, size: 123456789 },
    { id: 3, name: 'Photos Propriétés', fileCount: 156, size: 567890123 },
    { id: 4, name: 'Vidéos Marketing', fileCount: 8, size: 890123456 },
    { id: 5, name: 'Templates', fileCount: 12, size: 3456789 }
  ]);

  const [storageStats] = useState({
    used: 2.4, // GB
    total: 10, // GB
    files: files.length,
    folders: folders.length
  });

  const fileTypeIcons = {
    pdf: { icon: FileText, color: 'text-red-500' },
    docx: { icon: FileText, color: 'text-blue-500' },
    xlsx: { icon: FileSpreadsheet, color: 'text-green-500' },
    zip: { icon: Folder, color: 'text-yellow-500' },
    mp4: { icon: Video, color: 'text-purple-500' },
    jpg: { icon: Image, color: 'text-pink-500' },
    png: { icon: Image, color: 'text-pink-500' }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const fileId = Date.now() + Math.random();
      
      // Simuler l'upload avec progress
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: 0
      }));

      const uploadSimulation = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev[fileId] + 10;
          if (newProgress >= 100) {
            clearInterval(uploadSimulation);
            
            // Ajouter le fichier à la liste après upload
            const newFile = {
              id: fileId,
              name: file.name,
              type: file.name.split('.').pop().toLowerCase(),
              size: file.size,
              uploadDate: new Date().toISOString(),
              uploadedBy: {
                name: profile?.name || 'Utilisateur',
                avatar: null
              },
              category: 'recent',
              tags: [],
              downloads: 0,
              shared: false,
              url: URL.createObjectURL(file)
            };
            
            setFiles(prev => [newFile, ...prev]);
            
            // Nettoyer le progress
            setTimeout(() => {
              setUploadProgress(prev => {
                const { [fileId]: removed, ...rest } = prev;
                return rest;
              });
            }, 1000);
            
            return { ...prev, [fileId]: 100 };
          }
          return { ...prev, [fileId]: newProgress };
        });
      }, 200);
    });
  }, [profile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 100 * 1024 * 1024 // 100MB max
  });

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || file.category === filterType || file.type === filterType;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'size':
        comparison = a.size - b.size;
        break;
      case 'date':
        comparison = new Date(a.uploadDate) - new Date(b.uploadDate);
        break;
      case 'downloads':
        comparison = a.downloads - b.downloads;
        break;
      default:
        comparison = 0;
    }
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  const toggleFileSelection = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const deleteFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setSelectedFiles(prev => prev.filter(id => id !== fileId));
  };

  const downloadFile = (file) => {
    // Logique de téléchargement
    console.log('Téléchargement:', file.name);
    alert(`Téléchargement de ${file.name} en cours...`);
  };

  const shareFile = (file) => {
    // Logique de partage
    setFiles(prev => prev.map(f => 
      f.id === file.id ? { ...f, shared: !f.shared } : f
    ));
  };

  const getFileIcon = (type) => {
    const config = fileTypeIcons[type] || { icon: FileText, color: 'text-gray-500' };
    return config;
  };

  return (
    <div className="flex">
      <ModernSidebar currentPage="uploads" />
      <div className="flex-1 ml-80 p-6 bg-gray-50 min-h-screen">
        <Helmet>
          <title>Gestion des Fichiers - Teranga Foncier</title>
          <meta name="description" content="Centre de gestion des fichiers et uploads de Teranga Foncier" />
        </Helmet>

        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Fichiers</h1>
            <p className="text-gray-600">
              {storageStats.files} fichiers • {storageStats.folders} dossiers • {storageStats.used}GB utilisés
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            
            <Button>
              <FolderPlus className="w-4 h-4 mr-2" />
              Nouveau Dossier
            </Button>
          </div>
        </div>

        {/* Statistiques de stockage */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <HardDrive className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Stockage</h3>
                  <p className="text-gray-600">
                    {storageStats.used}GB utilisés sur {storageStats.total}GB
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round((storageStats.used / storageStats.total) * 100)}%
                </div>
                <div className="text-sm text-gray-500">Utilisé</div>
              </div>
            </div>
            <Progress 
              value={(storageStats.used / storageStats.total) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="files">Fichiers ({files.length})</TabsTrigger>
            <TabsTrigger value="folders">Dossiers ({folders.length})</TabsTrigger>
          </TabsList>

          {/* Zone d'upload */}
          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    isDragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  {isDragActive ? (
                    <div>
                      <h3 className="text-lg font-semibold text-blue-600 mb-2">
                        Déposez vos fichiers ici
                      </h3>
                      <p className="text-gray-600">Relâchez pour commencer l'upload</p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Glissez-déposez vos fichiers ici
                      </h3>
                      <p className="text-gray-600 mb-4">
                        ou cliquez pour sélectionner des fichiers
                      </p>
                      <Button>
                        <Upload className="w-4 h-4 mr-2" />
                        Choisir des fichiers
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        Taille maximum: 100MB par fichier
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Progress des uploads en cours */}
            {Object.keys(uploadProgress).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Uploads en cours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(uploadProgress).map(([fileId, progress]) => (
                      <div key={fileId} className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Upload className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Upload en cours...</span>
                            <span className="text-sm text-gray-500">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Liste des fichiers */}
          <TabsContent value="files" className="space-y-6">
            {/* Filtres et recherche */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Rechercher fichiers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
                
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Type de fichier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="documents">Documents</SelectItem>
                    <SelectItem value="images">Images</SelectItem>
                    <SelectItem value="videos">Vidéos</SelectItem>
                    <SelectItem value="exports">Exports</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="name">Nom</SelectItem>
                    <SelectItem value="size">Taille</SelectItem>
                    <SelectItem value="downloads">Téléchargements</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </Button>
              </div>

              {selectedFiles.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{selectedFiles.length} sélectionnés</Badge>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Partager
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              )}
            </div>

            {/* Affichage des fichiers */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFiles.map((file) => {
                  const typeConfig = getFileIcon(file.type);
                  const Icon = typeConfig.icon;
                  const isSelected = selectedFiles.includes(file.id);
                  
                  return (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all ${
                          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-lg'
                        }`}
                        onClick={() => toggleFileSelection(file.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <Icon className={`w-8 h-8 ${typeConfig.color}`} />
                            <div className="flex items-center space-x-1">
                              {file.shared && (
                                <Share2 className="w-4 h-4 text-blue-500" />
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Menu d'actions
                                }}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <h3 className="font-medium text-sm mb-2 line-clamp-2">
                            {file.name}
                          </h3>
                          
                          <div className="text-xs text-gray-500 space-y-1">
                            <div>{formatFileSize(file.size)}</div>
                            <div>{formatDate(file.uploadDate)}</div>
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-4 h-4">
                                <AvatarFallback className="text-xs">
                                  {file.uploadedBy.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="truncate">{file.uploadedBy.name}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3 pt-3 border-t">
                            <Badge variant="secondary" className="text-xs">
                              {file.downloads} téléchargements
                            </Badge>
                            
                            <div className="flex space-x-1">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadFile(file);
                                }}
                              >
                                <Download className="w-3 h-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  shareFile(file);
                                }}
                              >
                                <Share2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-gray-200 bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left">
                            <input 
                              type="checkbox"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedFiles(filteredFiles.map(f => f.id));
                                } else {
                                  setSelectedFiles([]);
                                }
                              }}
                              checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Nom</th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Taille</th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Modifié</th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Uploadé par</th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredFiles.map((file) => {
                          const typeConfig = getFileIcon(file.type);
                          const Icon = typeConfig.icon;
                          const isSelected = selectedFiles.includes(file.id);
                          
                          return (
                            <tr 
                              key={file.id} 
                              className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                            >
                              <td className="px-6 py-4">
                                <input 
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleFileSelection(file.id)}
                                />
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <Icon className={`w-6 h-6 ${typeConfig.color}`} />
                                  <div>
                                    <div className="font-medium text-gray-900">{file.name}</div>
                                    <div className="text-sm text-gray-500">
                                      {file.tags.map(tag => `#${tag}`).join(' ')}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {formatFileSize(file.size)}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {formatDate(file.uploadDate)}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarFallback className="text-xs">
                                      {file.uploadedBy.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-gray-900">{file.uploadedBy.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="ghost" onClick={() => downloadFile(file)}>
                                    <Download className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => shareFile(file)}>
                                    <Share2 className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => deleteFile(file.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {filteredFiles.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun fichier trouvé</h3>
                <p className="text-gray-600">
                  {searchTerm || filterType !== 'all' 
                    ? 'Aucun fichier ne correspond à vos critères'
                    : 'Commencez par uploader des fichiers'
                  }
                </p>
              </div>
            )}
          </TabsContent>

          {/* Dossiers */}
          <TabsContent value="folders" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {folders.map((folder) => (
                <motion.div
                  key={folder.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Folder className="w-12 h-12 text-blue-500" />
                        <Button size="sm" variant="ghost">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-2">{folder.name}</h3>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>{folder.fileCount} fichiers</div>
                        <div>{formatFileSize(folder.size)}</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UploadsPage;
