/**
 * VENDEUR PHOTOS REAL DATA - VERSION AVEC DONNÉES RÉELLES SUPABASE
 * Galerie photos des terrains du vendeur (upload, géolocalisation, score de
 * qualité réel property_photos.quality_score, suppression) via
 * VendeurSupabaseService.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Image as ImageIcon, Trash2, Eye, Download, Star,
  Sparkles, Brain,
  Grid3x3, List, Search, MoreVertical,
  Camera, RefreshCw, Award,
  MapPin, Satellite, FileDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import VendeurSupabaseService from '@/services/VendeurSupabaseService';
import { toast } from 'react-hot-toast';

const VendeurPhotosRealData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const [stats, setStats] = useState({
    totalPhotos: 0,
    totalProperties: 0,
    highQuality: 0,
    avgQualityScore: null,
    withGPS: 0,
    recentUploads: 0
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    filterPhotos();
  }, [photos, searchTerm, selectedProperty]);

  // Extrait un nom de fichier lisible depuis l'URL réelle stockée (property_photos.url)
  const getPhotoDisplayName = (photo) => {
    if (!photo?.url) return 'Photo';
    try {
      const lastSegment = decodeURIComponent(photo.url.split('/').pop().split('?')[0]);
      // Le service d'upload stocke sous la forme `${timestamp}_${nomOriginal}`
      const match = lastSegment.match(/^\d+_(.+)$/);
      return match ? match[1] : lastSegment;
    } catch {
      return 'Photo';
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);

      // Charger les propriétés du vendeur (pour le sélecteur et le comptage)
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('id, title, name')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (propertiesError) throw propertiesError;
      setProperties(propertiesData || []);

      // Charger toutes les photos du vendeur (via le service réel)
      const photosResult = await VendeurSupabaseService.getUserPhotos(user.id);
      if (!photosResult.success) throw new Error(photosResult.error);
      const photosData = photosResult.data || [];
      setPhotos(photosData);

      // Calculer les stats à partir de colonnes réelles uniquement
      const totalPhotos = photosData.length;
      const scored = photosData.filter(p => typeof p.quality_score === 'number' && p.quality_score !== null);
      const highQuality = scored.filter(p => p.quality_score >= 85).length;
      const avgQuality = scored.length > 0
        ? parseFloat((scored.reduce((sum, p) => sum + p.quality_score, 0) / scored.length).toFixed(1))
        : null;
      const withGPS = photosData.filter(p => p.gps_latitude && p.gps_longitude).length;
      const recent = photosData.filter(p => {
        const uploadDate = new Date(p.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return uploadDate >= weekAgo;
      }).length;

      setStats({
        totalPhotos,
        totalProperties: propertiesData?.length || 0,
        highQuality,
        avgQualityScore: avgQuality,
        withGPS,
        recentUploads: recent
      });

    } catch (error) {
      console.error('Erreur chargement données:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const filterPhotos = () => {
    let filtered = [...photos];

    // Filtre par propriété
    if (selectedProperty) {
      filtered = filtered.filter(p => p.property_id === selectedProperty);
    }

    // Recherche (nom de fichier dérivé de l'URL réelle, ou titre de la propriété)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        getPhotoDisplayName(p).toLowerCase().includes(term) ||
        (p.property?.title || p.property?.name || '').toLowerCase().includes(term)
      );
    }

    setFilteredPhotos(filtered);
  };

  // Tente d'obtenir la position GPS réelle de l'appareil au moment de l'upload
  // (remplace l'ancienne génération aléatoire de coordonnées près de Dakar).
  // Best-effort : si l'utilisateur refuse ou si l'API n'est pas disponible, on
  // n'enregistre aucune coordonnée plutôt que d'inventer une valeur.
  const getCurrentGPSPosition = () => new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      resolve({ latitude: null, longitude: null });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }),
      () => resolve({ latitude: null, longitude: null }),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
    );
  });

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!selectedProperty) {
      toast.error('Veuillez sélectionner une propriété');
      return;
    }

    setUploading(true);

    try {
      // Une seule tentative de géolocalisation pour le lot de photos uploadées
      const gpsPosition = await getCurrentGPSPosition();

      for (const file of acceptedFiles) {
        // Vérifier la taille (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} est trop volumineux (max 10MB)`);
          continue;
        }

        const result = await VendeurSupabaseService.uploadPropertyPhoto(selectedProperty, file, {
          is_primary: false,
          gps_latitude: gpsPosition.latitude,
          gps_longitude: gpsPosition.longitude
          // quality_score volontairement omis : aucune évaluation réelle de la
          // qualité n'est disponible côté client. La colonne reste NULL tant
          // qu'aucun système de scoring réel n'est branché (voir résumé).
        });

        if (!result.success) throw new Error(result.error || 'Erreur upload');

        toast.success(`${file.name} uploadé avec succès!`);
      }

      // Recharger les données
      await loadData();
      setShowUploadDialog(false);

    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  }, [selectedProperty, user]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true
  });

  const handleDeletePhoto = async (photoId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) return;

    try {
      const result = await VendeurSupabaseService.deletePhoto(photoId);
      if (!result.success) throw new Error(result.error);

      toast.success('Photo supprimée');
      await loadData();
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleSetPrimary = async (photoId) => {
    try {
      const photo = photos.find(p => p.id === photoId);

      // Retirer primary des autres photos de la même propriété
      await supabase
        .from('property_photos')
        .update({ is_primary: false })
        .eq('property_id', photo.property_id);

      // Définir comme primary
      const { error } = await supabase
        .from('property_photos')
        .update({ is_primary: true })
        .eq('id', photoId);

      if (error) throw error;

      toast.success('Photo principale définie');
      await loadData();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  // ============ NOUVELLES FONCTIONS GPS ============

  const handleShowOnMap = (photo) => {
    if (!photo.gps_latitude || !photo.gps_longitude) {
      toast.error('Cette photo ne contient pas de coordonnées GPS');
      return;
    }

    // Ouvrir Google Maps avec les coordonnées
    const url = `https://maps.google.com/?q=${photo.gps_latitude},${photo.gps_longitude}`;
    window.open(url, '_blank');
    toast.success('Ouverture de Google Maps...');
  };

  const handleShowSatellite = (photo) => {
    if (!photo.gps_latitude || !photo.gps_longitude) {
      toast.error('Cette photo ne contient pas de coordonnées GPS');
      return;
    }

    // Ouvrir Google Maps en vue satellite
    const url = `https://maps.google.com/?q=${photo.gps_latitude},${photo.gps_longitude}&t=k&z=18`;
    window.open(url, '_blank');
    toast.success('Ouverture de la vue satellite...');
  };

  const handleDownloadGPSReport = async () => {
    try {
      // Filtrer les photos avec coordonnées GPS
      const photosWithGPS = filteredPhotos.filter(p => p.gps_latitude && p.gps_longitude);

      if (photosWithGPS.length === 0) {
        toast.error('Aucune photo avec coordonnées GPS trouvée');
        return;
      }

      // Générer un rapport CSV
      const headers = [
        'Nom du fichier',
        'Propriété',
        'Latitude',
        'Longitude',
        'Date d\'ajout',
        'Score qualité',
        'Lien Google Maps'
      ];

      const rows = photosWithGPS.map(photo => [
        getPhotoDisplayName(photo),
        photo.property?.title || photo.property?.name || photo.property_id,
        photo.gps_latitude.toFixed(6),
        photo.gps_longitude.toFixed(6),
        new Date(photo.created_at).toLocaleDateString('fr-FR'),
        photo.quality_score != null ? `${photo.quality_score}%` : '—',
        `https://maps.google.com/?q=${photo.gps_latitude},${photo.gps_longitude}`
      ]);

      // Créer le contenu CSV
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Créer un Blob et télécharger
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `rapport_gps_photos_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Rapport GPS téléchargé (${photosWithGPS.length} photos)`);
    } catch (error) {
      console.error('Erreur génération rapport:', error);
      toast.error('Erreur lors de la génération du rapport');
    }
  };

  const getQualityColor = (score) => {
    if (score === null || score === undefined) return 'text-gray-500 bg-gray-100';
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Chargement des photos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Camera className="w-8 h-8 text-purple-600" />
            Gestion Photos
            <Badge className="bg-purple-100 text-purple-700">
              <ImageIcon className="w-3 h-3 mr-1" />
              {stats.totalPhotos} photo{stats.totalPhotos > 1 ? 's' : ''}
            </Badge>
          </h1>
          <p className="text-gray-600 mt-2">
            Upload et organisation des photos de vos terrains
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleDownloadGPSReport}
            variant="outline"
            disabled={filteredPhotos.filter(p => p.gps_latitude && p.gps_longitude).length === 0}
          >
            <FileDown className="w-4 h-4 mr-2" />
            Rapport GPS
          </Button>
          <Button
            onClick={() => setShowUploadDialog(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Uploader Photos
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Photos</p>
                  <p className="text-2xl font-bold">{stats.totalPhotos}</p>
                </div>
                <ImageIcon className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Propriétés</p>
                  <p className="text-2xl font-bold">{stats.totalProperties}</p>
                </div>
                <Camera className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Haute qualité</p>
                  <p className="text-2xl font-bold">{stats.highQuality}</p>
                </div>
                <Brain className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Qualité Moy.</p>
                  <p className="text-2xl font-bold">
                    {stats.avgQualityScore !== null ? `${stats.avgQualityScore}%` : '—'}
                  </p>
                </div>
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avec GPS</p>
                  <p className="text-2xl font-bold">{stats.withGPS}</p>
                </div>
                <MapPin className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-l-4 border-l-pink-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cette semaine</p>
                  <p className="text-2xl font-bold">{stats.recentUploads}</p>
                </div>
                <Sparkles className="w-8 h-8 text-pink-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Propriété Selector */}
            <select
              value={selectedProperty || ''}
              onChange={(e) => setSelectedProperty(e.target.value || null)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Toutes les propriétés</option>
              {properties.map(prop => (
                <option key={prop.id} value={prop.id}>
                  {prop.title || prop.name}
                </option>
              ))}
            </select>

            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* View Mode */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photos Grid/List */}
      {filteredPhotos.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucune photo</h3>
            <p className="text-gray-600 mb-4">Commencez par uploader des photos</p>
            <Button onClick={() => setShowUploadDialog(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Uploader maintenant
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' : 'space-y-4'}>
          <AnimatePresence>
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {/* Image */}
                    <div className="relative group">
                      <img
                        src={photo.url}
                        alt={getPhotoDisplayName(photo)}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all rounded-t-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setSelectedPhoto(photo)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => window.open(photo.url, '_blank')}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {photo.is_primary && (
                          <Badge className="bg-yellow-500 text-white">
                            <Star className="w-3 h-3 mr-1" />
                            Principal
                          </Badge>
                        )}
                        {photo.quality_score >= 85 && (
                          <Badge className="bg-purple-100 text-purple-700">
                            <Brain className="w-3 h-3 mr-1" />
                            Haute qualité
                          </Badge>
                        )}
                      </div>

                      {/* Quality Score */}
                      <div className="absolute top-2 right-2">
                        <Badge className={getQualityColor(photo.quality_score)}>
                          {photo.quality_score != null ? `${photo.quality_score}%` : '—'}
                        </Badge>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">{getPhotoDisplayName(photo)}</p>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleSetPrimary(photo.id)}>
                              <Star className="w-4 h-4 mr-2" />
                              Définir comme principal
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSelectedPhoto(photo)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Voir détails
                            </DropdownMenuItem>
                            
                            {/* Boutons GPS - Afficher seulement si coordonnées disponibles */}
                            {photo.gps_latitude && photo.gps_longitude && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleShowOnMap(photo)}>
                                  <MapPin className="w-4 h-4 mr-2" />
                                  Voir sur la carte
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleShowSatellite(photo)}>
                                  <Satellite className="w-4 h-4 mr-2" />
                                  Vue satellite
                                </DropdownMenuItem>
                              </>
                            )}
                            
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeletePhoto(photo.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Badge variant="secondary" className="text-xs">
                          {photo.property?.title || photo.property?.name || 'Propriété'}
                        </Badge>
                        <span>{new Date(photo.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>

                      {/* Score de qualité (colonne réelle property_photos.quality_score) */}
                      {photo.quality_score != null && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>Qualité</span>
                            <span>{photo.quality_score}%</span>
                          </div>
                          <Progress value={photo.quality_score} className="h-1" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Uploader des photos</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Property Selector */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Propriété *
              </label>
              <select
                value={selectedProperty || ''}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Sélectionner une propriété</option>
                {properties.map(prop => (
                  <option key={prop.id} value={prop.id}>
                    {prop.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-purple-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              {isDragActive ? (
                <p className="text-purple-600 font-medium">Déposez les photos ici...</p>
              ) : (
                <>
                  <p className="text-gray-600 mb-2">
                    Glissez-déposez des photos ici, ou cliquez pour sélectionner
                  </p>
                  <p className="text-sm text-gray-500">
                    JPG, PNG, WEBP - Max 10MB par photo
                  </p>
                </>
              )}
            </div>

            {uploading && (
              <div className="flex items-center justify-center gap-3 text-purple-600">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Upload en cours...</span>
              </div>
            )}

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-purple-900 mb-1">
                    Géolocalisation automatique
                  </h4>
                  <p className="text-sm text-purple-700">
                    Si vous autorisez la localisation de votre appareil, vos photos seront associées à votre position actuelle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Photo Detail Dialog */}
      {selectedPhoto && (
        <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Détails de la photo</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image */}
              <div>
                <img
                  src={selectedPhoto.url}
                  alt={getPhotoDisplayName(selectedPhoto)}
                  className="w-full rounded-lg"
                />
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Informations</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nom:</span>
                      <span className="font-medium">{getPhotoDisplayName(selectedPhoto)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Propriété:</span>
                      <Badge variant="secondary">
                        {selectedPhoto.property?.title || selectedPhoto.property?.name || 'Propriété'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ajoutée le:</span>
                      <span>{new Date(selectedPhoto.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Localisation GPS:</span>
                      <span>
                        {selectedPhoto.gps_latitude && selectedPhoto.gps_longitude
                          ? `${selectedPhoto.gps_latitude.toFixed(5)}, ${selectedPhoto.gps_longitude.toFixed(5)}`
                          : 'Non renseignée'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    Score de qualité
                  </h3>
                  {selectedPhoto.quality_score != null ? (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Qualité</span>
                        <span className="font-bold">{selectedPhoto.quality_score}%</span>
                      </div>
                      <Progress value={selectedPhoto.quality_score} />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Pas encore évaluée</p>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleSetPrimary(selectedPhoto.id)}
                    className="flex-1"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Définir principal
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedPhoto.url, '_blank')}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default VendeurPhotosRealData;
