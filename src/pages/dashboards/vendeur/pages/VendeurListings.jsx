import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Edit, 
  Eye, 
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  MapPin,
  TrendingUp,
  Heart,
  Share2,
  Copy,
  Trash2,
  PauseCircle,
  PlayCircle,
  Star,
  Users,
  Camera,
  Clock
} from 'lucide-react';

const VendeurListings = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = [
    { id: 'all', name: 'Toutes', count: 12, color: 'bg-gray-100 text-gray-800' },
    { id: 'active', name: 'Actives', count: 8, color: 'bg-green-100 text-green-800' },
    { id: 'pending', name: 'En attente', count: 2, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'paused', name: 'Suspendues', count: 1, color: 'bg-blue-100 text-blue-800' },
    { id: 'expired', name: 'Expirées', count: 1, color: 'bg-red-100 text-red-800' }
  ];

  const mockListings = [
    {
      id: 1,
      title: 'Villa Moderne Almadies',
      location: 'Almadies, Dakar',
      price: '85.000.000 FCFA',
      type: 'Villa',
      bedrooms: 4,
      bathrooms: 3,
      area: 250,
      status: 'active',
      views: 1247,
      favorites: 23,
      inquiries: 8,
      photos: 15,
      createdAt: '2024-01-15',
      lastUpdate: '2024-01-20',
      daysOnMarket: 15,
      performance: 'excellent'
    },
    {
      id: 2,
      title: 'Appartement Standing Plateau',
      location: 'Plateau, Dakar',
      price: '45.000.000 FCFA',
      type: 'Appartement',
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      status: 'active',
      views: 892,
      favorites: 15,
      inquiries: 5,
      photos: 12,
      createdAt: '2024-01-10',
      lastUpdate: '2024-01-18',
      daysOnMarket: 20,
      performance: 'good'
    },
    {
      id: 3,
      title: 'Terrain Constructible Saly',
      location: 'Saly, Mbour',
      price: '25.000.000 FCFA',
      type: 'Terrain',
      bedrooms: null,
      bathrooms: null,
      area: 500,
      status: 'pending',
      views: 234,
      favorites: 4,
      inquiries: 2,
      photos: 6,
      createdAt: '2024-01-22',
      lastUpdate: '2024-01-22',
      daysOnMarket: 3,
      performance: 'new'
    }
  ];

  const getStatusBadge = (status) => {
    const option = statusOptions.find(opt => opt.id === status);
    return option ? option.color : 'bg-gray-100 text-gray-800';
  };

  const getPerformanceColor = (performance) => {
    const colors = {
      excellent: 'text-green-600',
      good: 'text-blue-600',
      average: 'text-yellow-600',
      poor: 'text-red-600',
      new: 'text-purple-600'
    };
    return colors[performance] || 'text-gray-600';
  };

  const getPerformanceIcon = (performance) => {
    if (performance === 'excellent' || performance === 'good') {
      return <TrendingUp className="h-4 w-4" />;
    }
    return <Clock className="h-4 w-4" />;
  };

  const filteredListings = mockListings.filter(listing => {
    const matchesStatus = selectedStatus === 'all' || listing.status === selectedStatus;
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Annonces</h1>
          <p className="text-gray-600">Gérez et optimisez vos listings immobiliers</p>
        </div>
        
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Annonce
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vues</p>
                <p className="text-2xl font-bold text-blue-600">2,373</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Favoris</p>
                <p className="text-2xl font-bold text-red-600">42</p>
              </div>
              <Heart className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Demandes</p>
                <p className="text-2xl font-bold text-green-600">15</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Actives</p>
                <p className="text-2xl font-bold text-purple-600">8</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une annonce..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {statusOptions.map(status => (
            <Button
              key={status.id}
              variant={selectedStatus === status.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(status.id)}
              className="flex items-center gap-2"
            >
              {status.name}
              <Badge variant="secondary" className="text-xs">
                {status.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Liste des annonces */}
      <div className="space-y-4">
        {filteredListings.map(listing => (
          <Card key={listing.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Image placeholder */}
                <div className="w-full lg:w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
                
                {/* Contenu principal */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{listing.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusBadge(listing.status)}>
                        {statusOptions.find(s => s.id === listing.status)?.name}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="font-semibold text-blue-600 text-lg">{listing.price}</span>
                    <span>{listing.type}</span>
                    {listing.bedrooms && <span>{listing.bedrooms} ch</span>}
                    {listing.bathrooms && <span>{listing.bathrooms} sdb</span>}
                    <span>{listing.area} m²</span>
                    <span>{listing.photos} photos</span>
                  </div>
                  
                  {/* Statistiques */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span>{listing.views} vues</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4 text-red-400" />
                      <span>{listing.favorites} favoris</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-green-400" />
                      <span>{listing.inquiries} demandes</span>
                    </div>
                    <div className={`flex items-center gap-1 ${getPerformanceColor(listing.performance)}`}>
                      {getPerformanceIcon(listing.performance)}
                      <span>{listing.daysOnMarket} jours</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4 mr-1" />
                      Partager
                    </Button>
                    <Button size="sm" variant="outline">
                      <Copy className="h-4 w-4 mr-1" />
                      Dupliquer
                    </Button>
                    {listing.status === 'active' ? (
                      <Button size="sm" variant="outline" className="text-blue-600">
                        <PauseCircle className="h-4 w-4 mr-1" />
                        Suspendre
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="text-green-600">
                        <PlayCircle className="h-4 w-4 mr-1" />
                        Activer
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Message si aucun résultat */}
      {filteredListings.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune annonce trouvée</h3>
              <p className="text-gray-600 mb-4">
                Essayez de modifier vos critères de recherche ou créez une nouvelle annonce.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Créer une annonce
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VendeurListings;