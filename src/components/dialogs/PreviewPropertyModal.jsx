import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import {
  MapPin,
  Home,
  Maximize,
  Eye,
  Heart,
  Share2,
  Edit,
  Trash2,
  CheckCircle,
  Shield,
  Brain,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Star
} from 'lucide-react';

/**
 * PreviewPropertyModal - Modal de prévisualisation complète d'une propriété
 * Affiche carousel photos, détails, carte, statistiques, et actions
 * 
 * @param {boolean} open - État d'ouverture du modal
 * @param {function} onOpenChange - Callback pour changer l'état
 * @param {object} property - Propriété à prévisualiser
 * @param {function} onEdit - Callback pour éditer la propriété
 * @param {function} onShare - Callback pour partager la propriété
 * @param {function} onDelete - Callback pour supprimer la propriété
 */
const PreviewPropertyModal = ({ 
  open, 
  onOpenChange, 
  property,
  onEdit,
  onShare,
  onDelete 
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!property) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Images pour le carousel (utiliser les vraies photos de Supabase Storage)
  const images = property.photos?.length > 0 
    ? property.photos.map(photo => ({
        original: photo.url || photo,
        thumbnail: photo.thumbnail || photo.url || photo,
        description: photo.caption || ''
      }))
    : [
        {
          original: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
          thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=150',
          description: property.title
        },
        {
          original: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
          thumbnail: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=150',
          description: 'Vue extérieure'
        },
        {
          original: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
          thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=150',
          description: 'Vue détaillée'
        }
      ];

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'sold': 'bg-blue-100 text-blue-800',
      'draft': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'active': 'En vente',
      'pending': 'En attente',
      'sold': 'Vendu',
      'draft': 'Brouillon'
    };
    return labels[status] || status;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Colonne Gauche - Carousel Photos */}
          <div className="bg-gray-100 relative">
            <ImageGallery
              items={images}
              showPlayButton={false}
              showFullscreenButton={true}
              showIndex={true}
              onSlide={(currentIndex) => setActiveImageIndex(currentIndex)}
              slideInterval={5000}
              additionalClass="property-preview-gallery"
            />
            
            {/* Overlay Badges */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <Badge className={getStatusColor(property.status)}>
                {getStatusLabel(property.status)}
              </Badge>
              {property.blockchainVerified && (
                <Badge className="bg-blue-600 text-white">
                  <Shield className="h-3 w-3 mr-1" />
                  Blockchain
                </Badge>
              )}
              {property.aiOptimized && (
                <Badge className="bg-purple-600 text-white">
                  <Brain className="h-3 w-3 mr-1" />
                  IA Optimisé
                </Badge>
              )}
            </div>

            {/* Compteur Photos */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {activeImageIndex + 1} / {images.length}
            </div>
          </div>

          {/* Colonne Droite - Détails */}
          <div className="p-6 flex flex-col">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-bold flex items-start justify-between">
                <span>{property.title}</span>
                {property.aiScore && (
                  <Badge className="bg-purple-100 text-purple-800 text-lg px-3">
                    <Star className="h-4 w-4 mr-1" />
                    {property.aiScore}
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>

            {/* Prix */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-green-600">
                  {formatCurrency(property.price)}
                </span>
                {property.pricePerSqm && (
                  <span className="text-gray-500">
                    {formatCurrency(property.pricePerSqm)}/m²
                  </span>
                )}
              </div>
              {property.priceRecommendation && property.priceRecommendation !== property.price && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-purple-600">
                    Prix IA recommandé: {formatCurrency(property.priceRecommendation)}
                  </span>
                </div>
              )}
            </div>

            {/* Informations Principales */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Localisation</p>
                  <p className="font-medium">{property.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Maximize className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Surface</p>
                  <p className="font-medium">{property.size}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Home className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="font-medium">{property.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Publié le</p>
                  <p className="font-medium">{formatDate(property.datePosted || property.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {property.description}
                </p>
              </div>
            )}

            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-600">{property.views || 0}</span>
                </div>
                <p className="text-xs text-gray-600">Vues</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Heart className="h-4 w-4 text-red-600" />
                  <span className="text-2xl font-bold text-red-600">{property.likes || 0}</span>
                </div>
                <p className="text-xs text-gray-600">Favoris</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">{property.interested || 0}</span>
                </div>
                <p className="text-xs text-gray-600">Intéressés</p>
              </div>
            </div>

            {/* Carte Google Maps (Placeholder) */}
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Localisation</h4>
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">Carte Google Maps</p>
                  <p className="text-xs">{property.location}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    (Intégration Google Maps API à venir)
                  </p>
                </div>
              </div>
            </div>

            {/* Visite Virtuelle 3D (Placeholder) */}
            {property.virtualTour && (
              <div className="mb-6">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Visite Virtuelle 3D Disponible
                </h4>
                <Button className="w-full" variant="outline">
                  Lancer la Visite Virtuelle
                </Button>
              </div>
            )}

            {/* Boutons Actions */}
            <div className="mt-auto pt-4 border-t">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => {
                    onEdit && onEdit(property);
                    onOpenChange(false);
                  }}
                  className="w-full"
                  variant="outline"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Éditer
                </Button>

                <Button 
                  onClick={() => {
                    onShare && onShare(property);
                  }}
                  className="w-full"
                  variant="outline"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </div>

              <Button 
                onClick={() => {
                  onDelete && onDelete(property);
                  onOpenChange(false);
                }}
                className="w-full mt-3"
                variant="destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer la propriété
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewPropertyModal;
