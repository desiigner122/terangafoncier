import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Upload, 
  Brain, 
  Image, 
  Trash2, 
  Eye, 
  Download,
  Star,
  CheckCircle2,
  AlertCircle,
  Zap,
  Target,
  Palette
} from 'lucide-react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import VendeurSupabaseService from '@/services/VendeurSupabaseService';

const VendeurPhotos = () => {
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploadProgress, setUploadProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) loadPhotos();
  }, [user]);

  const loadPhotos = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const result = await VendeurSupabaseService.getUserPhotos(user.id);
      if (result.success) {
        setPhotos(result.data || []);
      } else {
        console.error('Erreur chargement photos:', result.error);
        setPhotos([]);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setPhotos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!confirm('Supprimer cette photo ?')) return;
    
    const result = await VendeurSupabaseService.deletePhoto(photoId);
    if (result.success) {
      await loadPhotos(); // Recharger
    }
  };

  const photoCategories = [
    { id: 'all', name: 'Toutes', count: photos.length },
    { id: 'exterior', name: 'Extérieur', count: photos.filter(p => p.type === 'exterior').length },
    { id: 'interior', name: 'Intérieur', count: photos.filter(p => p.type === 'interior').length },
    { id: 'aerial', name: 'Aérienne', count: photos.filter(p => p.type === 'aerial').length }
  ];

  const filteredPhotos = selectedCategory === 'all' 
    ? photos 
    : photos.filter(p => p.type === selectedCategory);

  const aiFeatures = [
    {
      icon: Brain,
      title: 'Analyse Qualité IA',
      description: 'Évaluation automatique de la qualité photo',
      color: 'text-purple-600'
    },
    {
      icon: Palette,
      title: 'Amélioration Auto',
      description: 'Retouches automatiques optimisées',
      color: 'text-blue-600'
    },
    {
      icon: Target,
      title: 'Suggestions Pro',
      description: 'Recommandations pour photos parfaites',
      color: 'text-green-600'
    },
    {
      icon: Zap,
      title: 'Traitement Rapide',
      description: 'Optimisation en temps réel',
      color: 'text-orange-600'
    }
  ];

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      setUploadProgress(0);
      // Simulation upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setUploadProgress(null), 1000);
            return 100;
          }
          return prev + 20;
        });
      }, 300);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    return 'text-orange-600 bg-orange-50';
  };

  const getStatusBadge = (status) => {
    const badges = {
      approved: { color: 'bg-green-100 text-green-800', text: 'Approuvée' },
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'En attente' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rejetée' }
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="space-y-6">
      {/* Header avec upload */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion Photos IA</h1>
          <p className="text-gray-600">Optimisez vos photos avec l'intelligence artificielle</p>
        </div>
        
        <div className="flex gap-3">
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Upload className="h-4 w-4 mr-2" />
              Télécharger Photos
            </Button>
          </label>
          <Button variant="outline">
            <Camera className="h-4 w-4 mr-2" />
            Prendre Photo
          </Button>
        </div>
      </div>

      {/* Progress Upload */}
      {uploadProgress !== null && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-purple-600 animate-pulse" />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span>Analyse IA en cours...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fonctionnalités IA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {aiFeatures.map((feature, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <feature.icon className={`h-5 w-5 ${feature.color}`} />
                <h3 className="font-semibold text-sm">{feature.title}</h3>
              </div>
              <p className="text-xs text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        {photoCategories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            {category.name}
            <Badge variant="secondary" className="text-xs">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Galerie Photos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map(photo => (
          <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img 
                src={photo.url} 
                alt={`Photo ${photo.id}`}
                className="w-full h-48 object-cover"
              />
              {photo.isMain && (
                <Badge className="absolute top-2 left-2 bg-yellow-500">
                  <Star className="h-3 w-3 mr-1" />
                  Photo Principale
                </Badge>
              )}
              <div className="absolute top-2 right-2">
                <Badge className={`${getScoreColor(photo.aiScore)} border-0`}>
                  {photo.aiScore}% IA
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Badge className={getStatusBadge(photo.status).color}>
                    {getStatusBadge(photo.status).text}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Brain className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{photo.aiAnalysis}</p>
                </div>
                
                {photo.suggestions.length > 0 && (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {photo.suggestions.map((suggestion, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Appliquer IA
                </Button>
                {!photo.isMain && (
                  <Button size="sm" variant="outline">
                    <Star className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics Footer */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-sm text-gray-600">Photos Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">89%</div>
              <div className="text-sm text-gray-600">Score IA Moyen</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">18</div>
              <div className="text-sm text-gray-600">Optimisées IA</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">6</div>
              <div className="text-sm text-gray-600">À Améliorer</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendeurPhotos;