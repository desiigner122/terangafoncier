import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  MapPin,
  DollarSign,
  Camera,
  Clock,
  CheckCircle,
  AlertTriangle,
  Share2,
  Shield,
  Brain,
  Star,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const VendeurProperties = ({ stats }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [properties] = useState([
    {
      id: 1,
      title: 'Terrain résidentiel Sacré-Cœur',
      location: 'Sacré-Cœur, Dakar',
      price: 85000000,
      size: '500m²',
      type: 'Terrain',
      status: 'active',
      photos: 8,
      views: 145,
      inquiries: 3,
      datePosted: '2024-02-15',
      aiScore: 92,
      blockchainVerified: true,
      smartContract: true,
      priceRecommendation: 82000000,
      marketPosition: 'optimal'
    },
    {
      id: 2,
      title: 'Villa moderne Almadies',
      location: 'Almadies, Dakar',
      price: 350000000,
      size: '300m²',
      type: 'Villa',
      status: 'active',
      photos: 15,
      views: 89,
      inquiries: 7,
      datePosted: '2024-02-20',
      aiScore: 88,
      blockchainVerified: true,
      smartContract: false,
      priceRecommendation: 345000000,
      marketPosition: 'competitive'
    },
    {
      id: 3,
      title: 'Appartement haut standing Mermoz',
      location: 'Mermoz, Dakar',
      price: 125000000,
      size: '120m²',
      type: 'Appartement',
      status: 'pending',
      photos: 12,
      views: 67,
      inquiries: 2,
      datePosted: '2024-02-25',
      aiScore: 85,
      blockchainVerified: false,
      smartContract: false,
      priceRecommendation: 130000000,
      marketPosition: 'underpriced'
    },
    {
      id: 4,
      title: 'Maison familiale Ouakam',
      location: 'Ouakam, Dakar',
      price: 180000000,
      size: '200m²',
      type: 'Maison',
      status: 'sold',
      photos: 10,
      views: 234,
      inquiries: 12,
      datePosted: '2024-01-10',
      aiScore: 90,
      blockchainVerified: true,
      smartContract: true,
      priceRecommendation: 180000000,
      marketPosition: 'optimal'
    },
    {
      id: 5,
      title: 'Studio moderne Plateau',
      location: 'Plateau, Dakar',
      price: 65000000,
      size: '45m²',
      type: 'Studio',
      status: 'draft',
      photos: 5,
      views: 0,
      inquiries: 0,
      datePosted: '2024-02-28',
      aiScore: 78,
      blockchainVerified: false,
      smartContract: false,
      priceRecommendation: 68000000,
      marketPosition: 'underpriced'
    }
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'pending': return 'En attente';
      case 'sold': return 'Vendu';
      case 'draft': return 'Brouillon';
      default: return status;
    }
  };

  const getAIScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getMarketPositionColor = (position) => {
    switch (position) {
      case 'optimal': return 'text-green-600 bg-green-100';
      case 'competitive': return 'text-blue-600 bg-blue-100';
      case 'underpriced': return 'text-orange-600 bg-orange-100';
      case 'overpriced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || property.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewProperty = (property) => {
    console.log('Voir propriété:', property.title);
  };

  const handleEditProperty = (property) => {
    console.log('Modifier propriété:', property.title);
  };

  const handleDeleteProperty = (property) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${property.title}" ?`)) {
      console.log('Supprimer propriété:', property.title);
    }
  };

  const handleShareProperty = (property) => {
    console.log('Partager propriété:', property.title);
  };

  const handleAIAnalysis = (property) => {
    console.log('Analyse IA pour:', property.title);
  };

  const handleBlockchainVerification = (property) => {
    console.log('Vérification blockchain pour:', property.title);
  };

  return (
    <div className="space-y-6">
      {/* Header avec stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes Propriétés</h1>
          <p className="text-gray-600">Gérez votre portefeuille immobilier avec IA et blockchain</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 mt-4 md:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une propriété
        </Button>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Actives</p>
                <p className="text-2xl font-bold text-green-600">
                  {properties.filter(p => p.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vues totales</p>
                <p className="text-2xl font-bold text-blue-600">
                  {properties.reduce((sum, p) => sum + p.views, 0)}
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Certifiés blockchain</p>
                <p className="text-2xl font-bold text-blue-600">
                  {properties.filter(p => p.blockchainVerified).length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par titre ou localisation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="sold">Vendu</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Plus de filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des propriétés */}
      <div className="space-y-4">
        {filteredProperties.map((property) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                {/* Titre et badges */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {property.title}
                  </h3>
                  <Badge className={getStatusColor(property.status)}>
                    {getStatusText(property.status)}
                  </Badge>
                  <Badge className={getAIScoreColor(property.aiScore)}>
                    <Brain className="h-3 w-3 mr-1" />
                    IA: {property.aiScore}
                  </Badge>
                  <Badge className={getMarketPositionColor(property.marketPosition)}>
                    {property.marketPosition}
                  </Badge>
                  {property.blockchainVerified && (
                    <Badge className="bg-blue-100 text-blue-800">
                      <Shield className="h-3 w-3 mr-1" />
                      Vérifié
                    </Badge>
                  )}
                  {property.smartContract && (
                    <Badge className="bg-green-100 text-green-800">
                      Smart Contract
                    </Badge>
                  )}
                </div>

                {/* Détails de la propriété */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Prix</p>
                    <p className="font-semibold text-lg text-gray-900">
                      {formatCurrency(property.price)}
                    </p>
                    {property.priceRecommendation !== property.price && (
                      <p className="text-purple-600 text-xs">
                        IA: {formatCurrency(property.priceRecommendation)}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-600">Localisation</p>
                    <p className="font-medium flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {property.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Taille</p>
                    <p className="font-medium">{property.size}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Type</p>
                    <p className="font-medium">{property.type}</p>
                  </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Camera className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold text-gray-900">{property.photos}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Photos</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Eye className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold text-gray-900">{property.views}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Vues</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold text-gray-900">{property.inquiries}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Demandes</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-2 mt-4 lg:mt-0 lg:ml-6">
                <Button size="sm" variant="outline" onClick={() => handleViewProperty(property)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Voir
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleEditProperty(property)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleAIAnalysis(property)}>
                  <Brain className="h-4 w-4 mr-2" />
                  Analyse IA
                </Button>
                {!property.blockchainVerified && (
                  <Button size="sm" variant="outline" onClick={() => handleBlockchainVerification(property)}>
                    <Shield className="h-4 w-4 mr-2" />
                    Vérifier
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => handleShareProperty(property)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDeleteProperty(property)}
                  className="text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune propriété trouvée
            </h3>
            <p className="text-gray-600 mb-4">
              Aucune propriété ne correspond à vos critères de recherche.
            </p>
            <Button onClick={() => setSearchTerm('')}>
              Réinitialiser les filtres
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VendeurProperties;