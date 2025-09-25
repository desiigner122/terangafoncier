import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Plus,
  Edit3,
  Trash2,
  Eye,
  MapPin,
  DollarSign,
  Calendar,
  Filter,
  Search,
  Grid,
  List,
  Star,
  MessageSquare,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Bath,
  Bed,
  Square,
  Building
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

const VendeurPropertiesComplete = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  // Mock data pour les propriétés
  const [properties, setProperties] = useState([
    {
      id: 1,
      title: "Villa Moderne Almadies",
      type: "Villa",
      status: "active",
      price: 250000000,
      location: "Almadies, Dakar",
      bedrooms: 4,
      bathrooms: 3,
      area: 350,
      images: 12,
      views: 1250,
      favorites: 45,
      inquiries: 12,
      createdAt: "2024-01-15",
      lastModified: "2024-01-20",
      featured: true,
      aiOptimized: true,
      completion: 95
    },
    {
      id: 2,
      title: "Terrain Résidentiel Sacré-Cœur",
      type: "Terrain",
      status: "pending",
      price: 125000000,
      location: "Sacré-Cœur, Dakar",
      area: 500,
      images: 8,
      views: 890,
      favorites: 28,
      inquiries: 7,
      createdAt: "2024-01-10",
      lastModified: "2024-01-18",
      featured: false,
      aiOptimized: false,
      completion: 75
    },
    {
      id: 3,
      title: "Appartement Moderne Plateau",
      type: "Appartement",
      status: "active",
      price: 95000000,
      location: "Plateau, Dakar",
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      images: 15,
      views: 2100,
      favorites: 67,
      inquiries: 23,
      createdAt: "2024-01-05",
      lastModified: "2024-01-22",
      featured: true,
      aiOptimized: true,
      completion: 100
    }
  ]);

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    draft: 'bg-gray-100 text-gray-800',
    sold: 'bg-blue-100 text-blue-800'
  };

  const statusLabels = {
    active: 'Actif',
    pending: 'En attente',
    draft: 'Brouillon',
    sold: 'Vendu'
  };

  const filteredProperties = properties.filter(property => {
    const matchesFilter = activeFilter === 'all' || property.status === activeFilter;
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.lastModified) - new Date(a.lastModified);
      case 'price-high':
        return b.price - a.price;
      case 'price-low':
        return a.price - b.price;
      case 'views':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price).replace('XOF', 'FCFA');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const PropertyCard = ({ property }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white">
        <div className="relative">
          {/* Badge de statut */}
          <div className="absolute top-3 left-3 z-10">
            <Badge className={`${statusColors[property.status]} border-0`}>
              {statusLabels[property.status]}
            </Badge>
          </div>
          
          {/* Badges spéciaux */}
          <div className="absolute top-3 right-3 z-10 flex gap-2">
            {property.featured && (
              <Badge className="bg-orange-100 text-orange-800 border-0">
                <Star className="w-3 h-3 mr-1" />
                Vedette
              </Badge>
            )}
            {property.aiOptimized && (
              <Badge className="bg-purple-100 text-purple-800 border-0">
                <TrendingUp className="w-3 h-3 mr-1" />
                IA
              </Badge>
            )}
          </div>

          {/* Image placeholder */}
          <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="w-12 h-12 text-blue-300 mx-auto mb-2" />
              <p className="text-sm text-blue-600">{property.images} photos</p>
            </div>
          </div>

          {/* Barre de progression de completion */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-2">
            <div className="flex items-center justify-between text-xs">
              <span>Profil: {property.completion}%</span>
              <Progress value={property.completion} className="flex-1 mx-2 h-1" />
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
              {property.title}
            </h3>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              {property.location}
            </div>
          </div>

          <div className="mb-3">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {formatPrice(property.price)}
            </div>
            {property.type !== 'Terrain' && (
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  {property.bedrooms}
                </div>
                <div className="flex items-center">
                  <Bath className="w-4 h-4 mr-1" />
                  {property.bathrooms}
                </div>
                <div className="flex items-center">
                  <Square className="w-4 h-4 mr-1" />
                  {property.area}m²
                </div>
              </div>
            )}
            {property.type === 'Terrain' && (
              <div className="flex items-center text-sm text-gray-600">
                <Square className="w-4 h-4 mr-1" />
                {property.area}m²
              </div>
            )}
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-3 gap-3 mb-4 text-center">
            <div className="bg-blue-50 rounded-lg p-2">
              <div className="flex items-center justify-center mb-1">
                <Eye className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-sm font-semibold text-blue-900">{property.views}</div>
              <div className="text-xs text-blue-600">Vues</div>
            </div>
            <div className="bg-green-50 rounded-lg p-2">
              <div className="flex items-center justify-center mb-1">
                <Star className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-sm font-semibold text-green-900">{property.favorites}</div>
              <div className="text-xs text-green-600">Favoris</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-2">
              <div className="flex items-center justify-center mb-1">
                <MessageSquare className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-sm font-semibold text-orange-900">{property.inquiries}</div>
              <div className="text-xs text-orange-600">Messages</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              Voir
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Edit3 className="w-4 h-4 mr-2" />
              Modifier
            </Button>
            <Button variant="outline" size="sm" className="px-3">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Date de modification */}
          <div className="text-xs text-gray-500 mt-2 text-center">
            Modifié le {formatDate(property.lastModified)}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const PropertyListItem = ({ property }) => (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-4 hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Image miniature */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <ImageIcon className="w-8 h-8 text-blue-300" />
            </div>

            {/* Informations principales */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
                <Badge className={`${statusColors[property.status]} border-0 text-xs`}>
                  {statusLabels[property.status]}
                </Badge>
                {property.featured && (
                  <Badge className="bg-orange-100 text-orange-800 border-0 text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Vedette
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                {property.location}
              </div>

              <div className="text-xl font-bold text-blue-600 mb-2">
                {formatPrice(property.price)}
              </div>

              {property.type !== 'Terrain' && (
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    {property.bedrooms} ch.
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-1" />
                    {property.bathrooms} sdb
                  </div>
                  <div className="flex items-center">
                    <Square className="w-4 h-4 mr-1" />
                    {property.area}m²
                  </div>
                </div>
              )}
            </div>

            {/* Statistiques */}
            <div className="flex gap-6 text-center">
              <div>
                <div className="text-lg font-semibold text-blue-600">{property.views}</div>
                <div className="text-xs text-gray-500">Vues</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-600">{property.favorites}</div>
                <div className="text-xs text-gray-500">Favoris</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-orange-600">{property.inquiries}</div>
                <div className="text-xs text-gray-500">Messages</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Voir
              </Button>
              <Button variant="outline" size="sm">
                <Edit3 className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Home className="mr-3 h-8 w-8 text-blue-600" />
            Mes Biens & Annonces
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez toutes vos propriétés en un seul endroit
          </p>
        </div>
        
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un bien
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Biens</p>
                <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
              </div>
              <Building className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Biens Actifs</p>
                <p className="text-2xl font-bold text-green-600">
                  {properties.filter(p => p.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vues</p>
                <p className="text-2xl font-bold text-blue-600">
                  {properties.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
                </p>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Messages</p>
                <p className="text-2xl font-bold text-orange-600">
                  {properties.reduce((sum, p) => sum + p.inquiries, 0)}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par titre ou localisation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtres */}
            <div className="flex gap-3">
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="draft">Brouillons</SelectItem>
                  <SelectItem value="sold">Vendus</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Plus récents</SelectItem>
                  <SelectItem value="price-high">Prix décroissant</SelectItem>
                  <SelectItem value="price-low">Prix croissant</SelectItem>
                  <SelectItem value="views">Plus vus</SelectItem>
                </SelectContent>
              </Select>

              {/* Boutons d'affichage */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des propriétés */}
      <AnimatePresence mode="wait">
        {sortedProperties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune propriété trouvée
            </h3>
            <p className="text-gray-600 mb-6">
              Ajustez vos filtres ou ajoutez votre première propriété.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un bien
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {sortedProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div>
                <AnimatePresence>
                  {sortedProperties.map((property) => (
                    <PropertyListItem key={property.id} property={property} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendeurPropertiesComplete;