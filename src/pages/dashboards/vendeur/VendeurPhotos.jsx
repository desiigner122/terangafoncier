import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Camera, 
  Upload, 
  Image, 
  Trash2, 
  Edit, 
  Eye, 
  Star,
  MoreVertical,
  Grid3X3,
  List,
  Search,
  Filter,
  Download,
  Share2,
  Tag,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  ZoomIn,
  Settings,
  Wand2,
  Building
} from 'lucide-react';

const VendeurPhotos = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [photos, setPhotos] = useState([
    {
      id: 1,
      url: '/api/placeholder/300/200',
      property: 'Villa Moderne Almadies',
      propertyId: 1,
      title: 'Vue d\'ensemble de la villa',
      tags: ['extérieur', 'vue principale'],
      uploadDate: '2024-01-15',
      size: '2.3 MB',
      dimensions: '1920x1080',
      isMain: true,
      quality: 95,
      views: 1240
    },
    {
      id: 2,
      url: '/api/placeholder/300/200',
      property: 'Villa Moderne Almadies',
      propertyId: 1,
      title: 'Salon principal',
      tags: ['intérieur', 'salon'],
      uploadDate: '2024-01-15',
      size: '1.8 MB',
      dimensions: '1920x1080',
      isMain: false,
      quality: 92,
      views: 890
    },
    {
      id: 3,
      url: '/api/placeholder/300/200',
      property: 'Terrain Sacré-Cœur',
      propertyId: 2,
      title: 'Vue aérienne du terrain',
      tags: ['extérieur', 'terrain', 'vue aérienne'],
      uploadDate: '2024-01-14',
      size: '3.1 MB',
      dimensions: '2048x1365',
      isMain: true,
      quality: 98,
      views: 675
    },
    {
      id: 4,
      url: '/api/placeholder/300/200',
      property: 'Appartement Plateau',
      propertyId: 3,
      title: 'Cuisine moderne',
      tags: ['intérieur', 'cuisine'],
      uploadDate: '2024-01-13',
      size: '2.0 MB',
      dimensions: '1920x1080',
      isMain: false,
      quality: 90,
      views: 450
    },
    {
      id: 5,
      url: '/api/placeholder/300/200',
      property: 'Villa Moderne Almadies',
      propertyId: 1,
      title: 'Piscine et jardin',
      tags: ['extérieur', 'piscine', 'jardin'],
      uploadDate: '2024-01-15',
      size: '2.7 MB',
      dimensions: '1920x1080',
      isMain: false,
      quality: 94,
      views: 1120
    }
  ]);

  const properties = [
    { id: 'all', name: 'Toutes les propriétés' },
    { id: 1, name: 'Villa Moderne Almadies' },
    { id: 2, name: 'Terrain Sacré-Cœur' },
    { id: 3, name: 'Appartement Plateau' }
  ];

  const filteredPhotos = photos.filter(photo => {
    const matchesProperty = selectedProperty === 'all' || photo.propertyId === selectedProperty;
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesProperty && matchesSearch;
  });

  const handlePhotoSelect = (photoId) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setIsUploading(true);
    
    // Simulation d'upload
    setTimeout(() => {
      setIsUploading(false);
      // Ici on ajouterait les nouvelles photos à la liste
    }, 2000);
  };

  const getQualityColor = (quality) => {
    if (quality >= 95) return 'text-green-600';
    if (quality >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const totalPhotos = photos.length;
  const totalViews = photos.reduce((sum, photo) => sum + photo.views, 0);
  const averageQuality = Math.round(photos.reduce((sum, photo) => sum + photo.quality, 0) / photos.length);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Camera className="mr-3 h-8 w-8 text-blue-600" />
            Gestion des Photos
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez et optimisez toutes les photos de vos propriétés
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="photo-upload"
          />
          <label htmlFor="photo-upload">
            <Button asChild className="cursor-pointer">
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Ajouter des photos
              </span>
            </Button>
          </label>
        </div>
      </div>

      {/* Indicateurs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total photos</p>
                  <p className="text-2xl font-bold text-blue-600">{totalPhotos}</p>
                </div>
                <Image className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vues totales</p>
                  <p className="text-2xl font-bold text-green-600">{totalViews.toLocaleString()}</p>
                </div>
                <Eye className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Qualité moyenne</p>
                  <p className={`text-2xl font-bold ${getQualityColor(averageQuality)}`}>{averageQuality}%</p>
                </div>
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En attente</p>
                  <p className="text-2xl font-bold text-orange-600">3</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filtres et contrôles */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher des photos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              {selectedPhotos.length > 0 && (
                <div className="flex items-center space-x-2 mr-4">
                  <Badge variant="secondary">{selectedPhotos.length} sélectionnées</Badge>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Télécharger
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Supprimer
                  </Button>
                </div>
              )}
              
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload en cours */}
      {isUploading && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Upload className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Upload en cours...</p>
                <Progress value={65} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Galerie de photos */}
      <Card>
        <CardContent className="p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white rounded-lg border hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-t-lg flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                        <Button size="sm" variant="secondary">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex space-x-1">
                      {photo.isMain && (
                        <Badge className="bg-yellow-500">Principal</Badge>
                      )}
                      <Badge variant="secondary" className={getQualityColor(photo.quality)}>
                        {photo.quality}%
                      </Badge>
                    </div>

                    {/* Sélection */}
                    <div className="absolute top-2 right-2">
                      <input
                        type="checkbox"
                        checked={selectedPhotos.includes(photo.id)}
                        onChange={() => handlePhotoSelect(photo.id)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                    </div>
                  </div>

                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 truncate">{photo.title}</h4>
                    <p className="text-sm text-gray-600 truncate flex items-center mt-1">
                      <Building className="w-3 h-3 mr-1" />
                      {photo.property}
                    </p>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-xs text-gray-500">
                        <div className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {photo.views} vues
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {photo.dimensions}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {photo.tags.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {photo.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{photo.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Vue liste */
            <div className="space-y-4">
              {filteredPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedPhotos.includes(photo.id)}
                    onChange={() => handlePhotoSelect(photo.id)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{photo.title}</h4>
                      {photo.isMain && <Badge className="bg-yellow-500">Principal</Badge>}
                    </div>
                    <p className="text-sm text-gray-600">{photo.property}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span>{photo.dimensions}</span>
                      <span>{photo.size}</span>
                      <span>{photo.views} vues</span>
                      <span>Qualité: {photo.quality}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommandations IA pour les photos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wand2 className="w-5 h-5 mr-2" />
            Recommandations IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">📸 Photos manquantes</h4>
              <p className="text-sm text-blue-800">
                Ajoutez des photos de la cuisine pour "Villa Moderne Almadies" pour augmenter l'engagement de 35%.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">🎨 Amélioration qualité</h4>
              <p className="text-sm text-purple-800">
                3 photos ont une qualité inférieure à 85%. Une retouche pourrait améliorer les conversions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendeurPhotos;