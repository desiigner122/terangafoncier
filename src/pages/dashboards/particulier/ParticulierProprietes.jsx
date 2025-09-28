import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Home,
  Building2,
  MapPin,
  Eye,
  Heart,
  Share2,
  Filter,
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  Star,
  Bath,
  Car,
  Wifi,
  TreePine,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  User,
  Plus,
  ArrowUpDown,
  TrendingUp,
  Camera,
  CreditCard,
  Banknote,
  ShoppingCart,
  Landmark
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

const ParticulierProprietes = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    location: 'all',
    priceRange: [0, 100000000],
    bedrooms: 'all',
    amenities: []
  });
  const [sortBy, setSortBy] = useState('recent');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fonction pour gérer l'achat avec différentes options
  const handlePurchase = (property, paymentType) => {
    const purchaseData = {
      propertyId: property.id,
      propertyTitle: property.title,
      price: property.price,
      paymentType: paymentType
    };
    
    // Rediriger vers la page de paiement appropriée
    switch(paymentType) {
      case 'direct':
        navigate('/buy/one-time', { state: purchaseData });
        break;
      case 'installment':
        navigate('/buy/installments', { state: purchaseData });
        break;
      case 'bank':
        navigate('/buy/bank-financing', { state: purchaseData });
        break;
      default:
        navigate(`/parcelle/${property.id}`);
    }
  };

  // Liste des propriétés avec options de financement
  const properties = [
    {
      id: 1,
      title: "Villa moderne avec piscine",
      location: "Almadies, Dakar",
      price: 85000000,
      type: "Villa",
      status: "available",
      bedrooms: 4,
      bathrooms: 3,
      surface: "250m²",
      parking: true,
      garden: true,
      swimming_pool: true,
      wifi: true,
      image: "/api/placeholder/400/300",
      images: 12,
      addedAt: "2024-03-20",
      views: 156,
      favorites: 23,
      rating: 4.8,
      financing: ["direct", "installment", "bank"], // Options de financement disponibles
      agent: {
        name: "Fatou Diop",
        phone: "+221 77 123 45 67",
        email: "fatou.diop@teranga.sn",
        avatar: "/api/placeholder/40/40"
      },
      features: ["Climatisation", "Sécurité 24h/24", "Vue mer", "Cuisine équipée"],
      description: "Magnifique villa moderne située dans le quartier prisé des Almadies..."
    },
    {
      id: 2,
      title: "Appartement neuf 3 pièces",
      location: "Plateau, Dakar",
      price: 45000000,
      type: "Appartement",
      status: "available",
      bedrooms: 3,
      bathrooms: 2,
      surface: "120m²",
      parking: true,
      garden: false,
      swimming_pool: false,
      wifi: true,
      image: "/api/placeholder/400/300",
      images: 8,
      addedAt: "2024-03-18",
      views: 89,
      favorites: 15,
      rating: 4.6,
      financing: ["direct", "installment"], // Financement limité
      agent: {
        name: "Mamadou Ba",
        phone: "+221 76 987 65 43",
        email: "mamadou.ba@teranga.sn",
        avatar: "/api/placeholder/40/40"
      },
      features: ["Vue panoramique", "Ascenseur", "Balcon", "Proche commodités"],
      description: "Appartement neuf au cœur du plateau avec vue panoramique sur la ville..."
    },
    {
      id: 3,
      title: "Terrain constructible vue mer",
      location: "Saly, Mbour",
      price: 15000000,
      type: "Terrain",
      status: "available",
      bedrooms: null,
      bathrooms: null,
      surface: "500m²",
      parking: false,
      garden: false,
      swimming_pool: false,
      wifi: false,
      image: "/api/placeholder/400/300",
      images: 6,
      addedAt: "2024-03-17",
      views: 234,
      favorites: 41,
      rating: 4.9,
      financing: ["direct", "installment", "bank"], // Toutes options pour terrains
      agent: {
        name: "Aissatou Ndiaye",
        phone: "+221 78 555 44 33",
        email: "aissatou.ndiaye@teranga.sn",
        avatar: "/api/placeholder/40/40"
      },
      features: ["Vue mer", "Titre foncier", "Viabilisé", "Accès direct plage"],
      description: "Terrain exceptionnel avec vue imprenable sur la mer, idéal pour villa de luxe..."
    },
    {
      id: 4,
      title: "Duplex standing avec terrasse",
      location: "Mermoz, Dakar",
      price: 65000000,
      type: "Duplex",
      status: "negotiable",
      bedrooms: 5,
      bathrooms: 4,
      surface: "180m²",
      parking: true,
      garden: false,
      swimming_pool: false,
      wifi: true,
      image: "/api/placeholder/400/300",
      images: 10,
      addedAt: "2024-03-15",
      views: 112,
      favorites: 18,
      rating: 4.7,
      financing: ["direct", "installment", "bank"],
      agent: {
        name: "Ousmane Diallo",
        phone: "+221 77 888 99 00",
        email: "ousmane.diallo@teranga.sn",
        avatar: "/api/placeholder/40/40"
      },
      features: ["Grande terrasse", "Double séjour", "Suite parentale", "Garage"],
      description: "Duplex de standing avec grande terrasse panoramique dans quartier résidentiel..."
    },
    {
      id: 5,
      title: "Studio meublé centre-ville",
      location: "Médina, Dakar",
      price: 25000000,
      type: "Studio",
      status: "available",
      bedrooms: 1,
      bathrooms: 1,
      surface: "35m²",
      parking: false,
      garden: false,
      swimming_pool: false,
      wifi: true,
      image: "/api/placeholder/400/300",
      images: 5,
      addedAt: "2024-03-14",
      views: 67,
      favorites: 8,
      rating: 4.3,
      financing: ["direct", "installment"],
      agent: {
        name: "Aminata Sow",
        phone: "+221 76 444 55 66",
        email: "aminata.sow@teranga.sn",
        avatar: "/api/placeholder/40/40"
      },
      features: ["Meublé", "Proche transports", "Sécurisé", "Cuisine équipée"],
      description: "Studio moderne entièrement meublé au cœur de la Médina..."
    },
    {
      id: 6,
      title: "Maison traditionnelle rénovée",
      location: "Yoff, Dakar",
      price: 55000000,
      type: "Maison",
      status: "available",
      bedrooms: 6,
      bathrooms: 3,
      surface: "200m²",
      parking: true,
      garden: true,
      swimming_pool: false,
      wifi: true,
      image: "/api/placeholder/400/300",
      images: 9,
      addedAt: "2024-03-12",
      views: 143,
      favorites: 28,
      rating: 4.5,
      agent: {
        name: "Ibrahima Fall",
        phone: "+221 77 222 33 44",
        email: "ibrahima.fall@teranga.sn",
        avatar: "/api/placeholder/40/40"
      },
      features: ["Architecture traditionnelle", "Cour intérieure", "Rénovée", "Proche mer"],
      description: "Magnifique maison traditionnelle entièrement rénovée avec cour intérieure...",
      financing: ["direct", "bank"]
    },
    {
      id: 7,
      title: "Terrain Résidentiel Premium - Almadies",
      location: "Almadies, Dakar",
      price: 85000000,
      type: "Terrain",
      status: "available",
      bedrooms: null,
      bathrooms: null,
      surface: "500m²",
      parking: false,
      garden: false,
      swimming_pool: false,
      wifi: false,
      image: "/api/placeholder/400/300",
      images: 8,
      addedAt: "2024-03-20",
      views: 312,
      favorites: 47,
      rating: 4.9,
      financing: ["direct", "installment", "bank"],
      agent: {
        name: "Amadou FALL",
        phone: "+221 77 123 45 67",
        email: "amadou.fall@email.com",
        avatar: "/api/placeholder/40/40",
        type: "Particulier Vendeur"
      },
      features: ["Vue mer", "Titre foncier", "Zone résidentielle", "Viabilisé"],
      description: "Magnifique terrain avec vue imprenable sur l'océan dans le quartier huppé des Almadies..."
    },
    {
      id: 8,
      title: "Terrain Commercial - Plateau Dakar",
      location: "Plateau, Dakar",
      price: 120000000,
      type: "Terrain",
      status: "available",
      bedrooms: null,
      bathrooms: null,
      surface: "300m²",
      parking: false,
      garden: false,
      swimming_pool: false,
      wifi: false,
      image: "/api/placeholder/400/300",
      images: 6,
      addedAt: "2024-03-18",
      views: 189,
      favorites: 28,
      rating: 4.7,
      financing: ["direct", "installment", "bank"],
      agent: {
        name: "IMMOBILIER DAKAR PREMIUM",
        phone: "+221 33 824 56 78",
        email: "contact@dakar-premium.sn",
        avatar: "/api/placeholder/40/40",
        type: "Agence Professionnelle"
      },
      features: ["Centre-ville", "Grande superficie", "Accès facile", "Titre foncier"],
      description: "Emplacement stratégique au cœur des affaires avec fort potentiel commercial..."
    },
    {
      id: 9,
      title: "Terrain Agricole Thiès - 2000m²",
      location: "Thiès, Thiès",
      price: 15000000,
      type: "Terrain",
      status: "available",
      bedrooms: null,
      bathrooms: null,
      surface: "2000m²",
      parking: false,
      garden: false,
      swimming_pool: false,
      wifi: false,
      image: "/api/placeholder/400/300",
      images: 5,
      addedAt: "2024-03-15",
      views: 156,
      favorites: 18,
      rating: 4.4,
      financing: ["direct", "installment", "bank"],
      agent: {
        name: "SENEGAL AGRO DEVELOPPEMENT",
        phone: "+221 33 951 78 90",
        email: "contact@senegal-agro.sn",
        avatar: "/api/placeholder/40/40",
        type: "Promoteur"
      },
      features: ["Terrain fertile", "Accès route", "Eau disponible", "Titre foncier"],
      description: "Grande parcelle agricole idéale pour l'agriculture moderne ou développement rural..."
    }
  ];

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.agent.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filters.type === 'all' || property.type.toLowerCase() === filters.type.toLowerCase();
    const matchesLocation = filters.location === 'all' || property.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesPrice = property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1];
    const matchesBedrooms = filters.bedrooms === 'all' || 
                           (property.bedrooms && property.bedrooms.toString() === filters.bedrooms);
    
    return matchesSearch && matchesType && matchesLocation && matchesPrice && matchesBedrooms;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'negotiable': return 'bg-blue-100 text-blue-800';
      case 'sold': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'negotiable': return 'Négociable';
      case 'sold': return 'Vendu';
      case 'pending': return 'En attente';
      default: return 'Inconnu';
    }
  };

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M FCFA`;
    }
    return `${(price / 1000).toFixed(0)}K FCFA`;
  };

  const PropertyCard = ({ property }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
        <div className="relative">
          <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
            <Building2 className="w-16 h-16 text-white opacity-80" />
          </div>
          
          {/* Actions overlay */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90">
              <Heart className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Images count */}
          <div className="absolute top-3 left-3">
            <div className="flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
              <Camera className="w-3 h-3" />
              {property.images}
            </div>
          </div>
          
          {/* Status badge */}
          <div className="absolute bottom-3 left-3">
            <Badge className={getStatusColor(property.status)}>
              {getStatusText(property.status)}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{property.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-slate-600 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            {property.location}
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4 text-sm text-slate-600">
              {property.bedrooms && (
                <span className="flex items-center gap-1">
                  <Home className="w-4 h-4" />
                  {property.bedrooms}
                </span>
              )}
              {property.bathrooms && (
                <span className="flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  {property.bathrooms}
                </span>
              )}
              <span>{property.surface}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Eye className="w-3 h-3" />
              {property.views}
            </div>
          </div>
          
          {/* Amenities */}
          <div className="flex items-center gap-2 mb-4">
            {property.parking && <Car className="w-4 h-4 text-blue-600" />}
            {property.garden && <TreePine className="w-4 h-4 text-green-600" />}
            {property.swimming_pool && <div className="w-4 h-4 bg-blue-600 rounded-full"></div>}
            {property.wifi && <Wifi className="w-4 h-4 text-purple-600" />}
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-bold text-xl text-slate-900">{formatPrice(property.price)}</p>
              <p className="text-sm text-slate-500">{property.price.toLocaleString()} FCFA</p>
            </div>
            <Badge variant="outline">{property.type}</Badge>
          </div>
          
          {/* Agent info */}
          <div className="flex items-center gap-2 mb-4 p-2 bg-slate-50 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">{property.agent.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{property.agent.name}</p>
              <p className="text-xs text-slate-600">Agent immobilier</p>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                <Phone className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                <Mail className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          {/* Options d'achat avec paiement */}
          <div className="space-y-2">
            <div className="text-xs text-gray-600 font-medium mb-2">Options d'achat disponibles :</div>
            <div className="grid grid-cols-1 gap-1">
              {property.financing?.includes('direct') && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs justify-start"
                  onClick={() => handlePurchase(property, 'direct')}
                >
                  <Banknote className="w-3 h-3 mr-2" />
                  Paiement Direct (-5%)
                </Button>
              )}
              {property.financing?.includes('installment') && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs justify-start"
                  onClick={() => handlePurchase(property, 'installment')}
                >
                  <Calendar className="w-3 h-3 mr-2" />
                  Paiement Échelonné
                </Button>
              )}
              {property.financing?.includes('bank') && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs justify-start"
                  onClick={() => handlePurchase(property, 'bank')}
                >
                  <Landmark className="w-3 h-3 mr-2" />
                  Financement Bancaire
                </Button>
              )}
            </div>
            
            <div className="flex gap-2 mt-3">
              <Button className="flex-1" variant="outline" size="sm" onClick={() => navigate(`/parcelle/${property.id}`)}>
                <Eye className="w-4 h-4 mr-1" />
                Détails
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600" size="sm">
                <Heart className="w-4 h-4 mr-1" />
                Favoris
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const PropertyListItem = ({ property }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <Card className="mb-4 hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="w-32 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 relative">
              <Building2 className="w-8 h-8 text-white" />
              <div className="absolute top-2 right-2 bg-black/60 text-white px-1 py-0.5 rounded text-xs">
                {property.images}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                  <div className="flex items-center text-sm text-slate-600 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.location}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge className={getStatusColor(property.status)}>
                    {getStatusText(property.status)}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{property.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                {property.bedrooms && <span>{property.bedrooms} chambres</span>}
                {property.bathrooms && <span>{property.bathrooms} SDB</span>}
                <span>{property.surface}</span>
                <span>{property.views} vues</span>
                <span>{property.favorites} favoris</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {property.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {property.features.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{property.features.length - 3}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-bold text-xl text-slate-900">{formatPrice(property.price)}</p>
                    <Badge variant="outline">{property.type}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{property.agent.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{property.agent.name}</p>
                      <p className="text-xs text-slate-600">Agent</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Voir
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Heart className="w-4 h-4 mr-1" />
                    Sauver
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header avec options de paiement */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Acheter Propriétés & Terrains</h1>
          <p className="text-slate-600 mt-1 mb-3">{filteredProperties.length} biens avec options de paiement flexibles</p>
          
          {/* Options de paiement disponibles */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
              <Banknote className="w-3 h-3 mr-1" />
              Paiement Direct (-5%)
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
              <Calendar className="w-3 h-3 mr-1" />
              Paiement Échelonné (5 ans)
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
              <Landmark className="w-3 h-3 mr-1" />
              Financement Bancaire (25 ans)
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Rechercher par titre, localisation ou agent..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type de bien" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="appartement">Appartement</SelectItem>
                <SelectItem value="terrain">Terrain</SelectItem>
                <SelectItem value="duplex">Duplex</SelectItem>
                <SelectItem value="maison">Maison</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Plus récent</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
                <SelectItem value="rating">Note</SelectItem>
                <SelectItem value="views">Popularité</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filtres avancés
            </Button>
          </div>
          
          {/* Advanced Filters */}
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-t pt-4 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Prix (FCFA)</label>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters({...filters, priceRange: value})}
                    max={100000000}
                    step={5000000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>{formatPrice(filters.priceRange[0])}</span>
                    <span>{formatPrice(filters.priceRange[1])}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Chambres</label>
                  <Select value={filters.bedrooms} onValueChange={(value) => setFilters({...filters, bedrooms: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Nombre de chambres" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="1">1 chambre</SelectItem>
                      <SelectItem value="2">2 chambres</SelectItem>
                      <SelectItem value="3">3 chambres</SelectItem>
                      <SelectItem value="4">4 chambres</SelectItem>
                      <SelectItem value="5">5+ chambres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Localisation</label>
                  <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Zone géographique" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les zones</SelectItem>
                      <SelectItem value="dakar">Dakar</SelectItem>
                      <SelectItem value="almadies">Almadies</SelectItem>
                      <SelectItem value="plateau">Plateau</SelectItem>
                      <SelectItem value="mermoz">Mermoz</SelectItem>
                      <SelectItem value="yoff">Yoff</SelectItem>
                      <SelectItem value="saly">Saly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Équipements</label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { key: 'parking', label: 'Parking', icon: Car },
                    { key: 'garden', label: 'Jardin', icon: TreePine },
                    { key: 'swimming_pool', label: 'Piscine', icon: Building2 },
                    { key: 'wifi', label: 'Wi-Fi', icon: Wifi }
                  ].map((amenity) => (
                    <div key={amenity.key} className="flex items-center space-x-2">
                      <Checkbox 
                        id={amenity.key}
                        checked={filters.amenities.includes(amenity.key)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilters({...filters, amenities: [...filters.amenities, amenity.key]});
                          } else {
                            setFilters({...filters, amenities: filters.amenities.filter(a => a !== amenity.key)});
                          }
                        }}
                      />
                      <label htmlFor={amenity.key} className="text-sm flex items-center gap-1">
                        <amenity.icon className="w-4 h-4" />
                        {amenity.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Properties Grid/List */}
      {filteredProperties.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">Aucune propriété trouvée</h3>
            <p className="text-slate-500 mb-6">
              Aucun bien ne correspond à vos critères de recherche.
              Essayez d'ajuster vos filtres.
            </p>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600"
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  type: 'all',
                  location: 'all',
                  priceRange: [0, 100000000],
                  bedrooms: 'all',
                  amenities: []
                });
              }}
            >
              Réinitialiser les filtres
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }>
          {filteredProperties.map((property) => 
            viewMode === 'grid' 
              ? <PropertyCard key={property.id} property={property} />
              : <PropertyListItem key={property.id} property={property} />
          )}
        </div>
      )}

      {/* Summary Stats */}
      {filteredProperties.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{filteredProperties.length}</p>
                <p className="text-sm text-slate-600">Biens disponibles</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {formatPrice(Math.round(filteredProperties.reduce((acc, p) => acc + p.price, 0) / filteredProperties.length))}
                </p>
                <p className="text-sm text-slate-600">Prix moyen</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(filteredProperties.reduce((acc, p) => acc + p.rating, 0) / filteredProperties.length * 10) / 10}
                </p>
                <p className="text-sm text-slate-600">Note moyenne</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {new Set(filteredProperties.map(p => p.location.split(',')[1]?.trim())).size}
                </p>
                <p className="text-sm text-slate-600">Zones couvertes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ParticulierProprietes;