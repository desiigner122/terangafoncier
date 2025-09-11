﻿import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Eye, 
  Edit, 
  Trash2, 
  Share, 
  Heart,
  MoreVertical,
  Grid3X3,
  List,
  Maximize,
  Tag,
  Calendar,
  DollarSign,
  TrendingUp,
  Image as ImageIcon,
  FileText,
  CheckCircle
} from 'lucide-react';
import { useUser } from '@/hooks/useUserFixed';

const MesTerrainsPage = () => {
  const { user, profile } = useUser();
  const [properties, setProperties] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Statuts des propriÃ©tÃ©s
  const propertyStatuses = {
    active: { label: 'Active', color: 'bg-green-500', textColor: 'text-green-700' },
    pending: { label: 'En attente', color: 'bg-yellow-500', textColor: 'text-yellow-700' },
    sold: { label: 'Vendue', color: 'bg-blue-500', textColor: 'text-blue-700' },
    draft: { label: 'Brouillon', color: 'bg-gray-500', textColor: 'text-gray-700' },
    inactive: { label: 'Inactive', color: 'bg-red-500', textColor: 'text-red-700' }
  };

  // DonnÃ©es simulÃ©es pour les propriÃ©tÃ©s
  const mockProperties = [
    {
      id: 1,
      title: 'Terrain rÃ©sidentiel Almadies',
      description: 'Magnifique terrain de 500mÂ² situÃ© dans le quartier prisÃ© des Almadies, proche de la mer.',
      location: 'Almadies, Dakar',
      area: 500,
      price: 125000000,
      currency: 'FCFA',
      status: 'active',
      type: 'residential',
      images: ['/api/YOUR_API_KEY/400/300', '/api/YOUR_API_KEY/400/300'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      views: 45,
      favorites: 8,
      inquiries: 3,
      features: ['Proche mer', 'Zone rÃ©sidentielle', 'AccÃ¨s facile'],
      owner: profile?.role === 'VENDEUR',
      isFavorite: false
    },
    {
      id: 2,
      title: 'Terrain commercial Plateau',
      description: 'Emplacement stratÃ©gique au cÅ“ur du Plateau pour projet commercial ou bureau.',
      location: 'Plateau, Dakar',
      area: 300,
      price: 200000000,
      currency: 'FCFA',
      status: 'pending',
      type: 'commercial',
      images: ['/api/YOUR_API_KEY/400/300'],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-22'),
      views: 67,
      favorites: 12,
      inquiries: 7,
      features: ['Centre ville', 'Transport public', 'Commerce'],
      owner: profile?.role === 'VENDEUR',
      isFavorite: true
    },
    {
      id: 3,
      title: 'Terrain agricole ThiÃ¨s',
      description: 'Grande parcelle agricole fertile, idÃ©ale pour l\'agriculture moderne.',
      location: 'ThiÃ¨s, RÃ©gion de ThiÃ¨s',
      area: 2000,
      price: 50000000,
      currency: 'FCFA',
      status: 'active',
      type: 'agricultural',
      images: ['/api/YOUR_API_KEY/400/300', '/api/YOUR_API_KEY/400/300', '/api/YOUR_API_KEY/400/300'],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-18'),
      views: 23,
      favorites: 4,
      inquiries: 2,
      features: ['Sol fertile', 'Irrigation possible', 'AccÃ¨s route'],
      owner: profile?.role !== 'VENDEUR',
      isFavorite: false
    },
    {
      id: 4,
      title: 'Terrain industriel Rufisque',
      description: 'Zone industrielle avec toutes les commoditÃ©s pour projet manufacturier.',
      location: 'Rufisque, Dakar',
      area: 1500,
      price: 180000000,
      currency: 'FCFA',
      status: 'sold',
      type: 'industrial',
      images: ['/api/YOUR_API_KEY/400/300'],
      createdAt: new Date('2023-12-20'),
      updatedAt: new Date('2024-01-10'),
      views: 89,
      favorites: 15,
      inquiries: 12,
      features: ['Zone industrielle', 'Ã‰lectricitÃ© 3 phases', 'SÃ©curitÃ©'],
      owner: profile?.role === 'VENDEUR',
      isFavorite: false
    }
  ];

  useEffect(() => {
    // Simuler le chargement des propriÃ©tÃ©s
    setTimeout(() => {
      // Filtrer selon le rÃ´le de l'utilisateur
      if (profile?.role === 'VENDEUR') {
        setProperties(mockProperties.filter(p => p.owner));
      } else {
        setProperties(mockProperties);
      }
      setIsLoading(false);
    }, 1000);
  }, [profile]);

  // Filtrer les propriÃ©tÃ©s
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'favorites') return matchesSearch && property.isFavorite;
    if (activeTab === 'owned') return matchesSearch && property.owner;
    return matchesSearch && property.status === activeTab;
  });

  // Basculer le statut favori
  const toggleFavorite = (propertyId) => {
    setProperties(prev => prev.map(prop => 
      prop.id === propertyId ? { ...prop, isFavorite: !prop.isFavorite } : prop
    ));
  };

  // Formater le prix
  const formatPrice = (price, currency = 'FCFA') => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
  };

  // Obtenir l'icÃ´ne du type
  const getTypeIcon = (type) => {
    switch (type) {
      case 'residential': return 'ðŸ ';
      case 'commercial': return 'ðŸ¢';
      case 'agricultural': return 'ðŸŒ¾';
      case 'industrial': return 'ðŸ­';
      default: return 'ðŸ“';
    }
  };

  // Statistiques
  const stats = {
    total: properties.length,
    active: properties.filter(p => p.status === 'active').length,
    sold: properties.filter(p => p.status === 'sold').length,
    favorites: properties.filter(p => p.isFavorite).length,
    totalValue: properties.reduce((sum, p) => sum + p.price, 0)
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
            <MapPin className="w-8 h-8 text-primary" />
            {profile?.role === 'VENDEUR' ? 'Mes PropriÃ©tÃ©s' : 'Mes Terrains'}
          </h1>
          <p className="text-gray-600 mt-2">
            {profile?.role === 'VENDEUR' 
              ? 'GÃ©rez vos annonces et suivez leurs performances' 
              : 'Suivez vos terrains favoris et vos investissements'
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
          </Button>
          {profile?.role === 'VENDEUR' && (
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une propriÃ©tÃ©
            </Button>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.active}</div>
            <div className="text-sm text-gray-600">Actives</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.sold}</div>
            <div className="text-sm text-gray-600">Vendues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.favorites}</div>
            <div className="text-sm text-gray-600">Favoris</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-lg font-bold">{formatPrice(stats.totalValue)}</div>
            <div className="text-sm text-gray-600">Valeur totale</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input 
                  YOUR_API_KEY="Rechercher des propriÃ©tÃ©s..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">Toutes</TabsTrigger>
                <TabsTrigger value="active">Actives</TabsTrigger>
                {profile?.role !== 'VENDEUR' && <TabsTrigger value="favorites">Favoris</TabsTrigger>}
                {profile?.role === 'VENDEUR' && <TabsTrigger value="pending">En attente</TabsTrigger>}
                <TabsTrigger value="sold">Vendues</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Liste des propriÃ©tÃ©s */}
      <div className="space-y-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <Badge className={`${propertyStatuses[property.status].color} text-white border-0`}>
                        {propertyStatuses[property.status].label}
                      </Badge>
                      <span className="text-2xl">{getTypeIcon(property.type)}</span>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="bg-white/80 hover:bg-white"
                        onClick={() => toggleFavorite(property.id)}
                      >
                        <Heart className={`w-4 h-4 ${
                          property.isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'
                        }`} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="bg-white/80 hover:bg-white"
                      >
                        <Share className="w-4 h-4 text-gray-600" />
                      </Button>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      {property.images.length} photo(s)
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {property.location}
                        </p>
                      </div>

                      <p className="text-sm text-gray-700 line-clamp-2">
                        {property.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xl font-bold text-primary">
                            {formatPrice(property.price, property.currency)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {property.area}mÂ² â€¢ {(property.price / property.area).toLocaleString()} FCFA/mÂ²
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {property.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {property.favorites}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {property.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="text-xs text-gray-500">
                          Mis Ã  jour {property.updatedAt.toLocaleDateString('fr-FR')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3 mr-1" />
                            Voir
                          </Button>
                          {property.owner && (
                            <Button variant="ghost" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredProperties.map((property) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-6">
                      <img 
                        src={property.images[0]} 
                        alt={property.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{property.title}</h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {property.location}
                            </p>
                          </div>
                          <Badge className={`${propertyStatuses[property.status].color} text-white border-0`}>
                            {propertyStatuses[property.status].label}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                          {property.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div>
                              <div className="text-lg font-bold text-primary">
                                {formatPrice(property.price, property.currency)}
                              </div>
                              <div className="text-sm text-gray-600">
                                {property.area}mÂ²
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {property.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {property.favorites}
                              </span>
                              <span className="flex items-center gap-1">
                                <ImageIcon className="w-3 h-3" />
                                {property.images.length}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toggleFavorite(property.id)}
                            >
                              <Heart className={`w-4 h-4 ${
                                property.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'
                              }`} />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="w-3 h-3 mr-1" />
                              Voir
                            </Button>
                            {property.owner && (
                              <Button variant="ghost" size="sm">
                                <Edit className="w-3 h-3" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-2">Aucune propriÃ©tÃ© trouvÃ©e</h3>
            <p className="text-gray-400 mb-4">
              {searchTerm 
                ? 'Essayez de modifier votre recherche' 
                : profile?.role === 'VENDEUR' 
                  ? 'Commencez par ajouter votre premiÃ¨re propriÃ©tÃ©'
                  : 'Commencez par explorer nos terrains disponibles'
              }
            </p>
            {profile?.role === 'VENDEUR' && (
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une propriÃ©tÃ©
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MesTerrainsPage;
