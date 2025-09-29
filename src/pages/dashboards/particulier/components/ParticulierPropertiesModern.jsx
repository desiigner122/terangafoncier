import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart,
  Share2,
  Eye,
  MapPin,
  Bed,
  Bath,
  Square,
  Car,
  Wifi,
  Shield,
  Star,
  Clock,
  Phone,
  MessageSquare,
  Calendar,
  TrendingUp,
  Filter,
  Grid3X3,
  List,
  SlidersHorizontal,
  ChevronDown,
  Home,
  Building2,
  Building,
  Briefcase
} from 'lucide-react';

const ParticulierPropertiesModern = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);

  // Données simulées des biens
  const properties = [
    {
      id: 1,
      title: 'Villa Moderne Almadies Vue Mer',
      type: 'villa',
      price: 85000000,
      location: 'Almadies, Dakar',
      bedrooms: 5,
      bathrooms: 4,
      surface: 320,
      features: ['wifi', 'parking', 'security', 'garden', 'pool'],
      images: ['/api/placeholder/400/300'],
      agent: {
        name: 'Mamadou Diop',
        phone: '+221 77 123 45 67',
        rating: 4.8
      },
      favorite: true,
      views: 47,
      posted: '2 jours',
      status: 'available'
    },
    {
      id: 2,
      title: 'Appartement F4 Standing Mamelles',
      type: 'apartment',
      price: 45000000,
      location: 'Mamelles, Dakar',
      bedrooms: 4,
      bathrooms: 3,
      surface: 150,
      features: ['wifi', 'parking', 'security', 'furnished'],
      images: ['/api/placeholder/400/300'],
      agent: {
        name: 'Aïcha Fall',
        phone: '+221 78 987 65 43',
        rating: 4.9
      },
      favorite: false,
      views: 23,
      posted: '1 semaine',
      status: 'available'
    },
    {
      id: 3,
      title: 'Bureau Open Space Plateau',
      type: 'office',
      price: 120000000,
      location: 'Plateau, Dakar',
      bedrooms: 0,
      bathrooms: 2,
      surface: 450,
      features: ['wifi', 'parking', 'security', 'generator', 'elevator'],
      images: ['/api/placeholder/400/300'],
      agent: {
        name: 'Omar Ndiaye',
        phone: '+221 76 555 44 33',
        rating: 4.7
      },
      favorite: true,
      views: 89,
      posted: '3 jours',
      status: 'negotiation'
    },
    {
      id: 4,
      title: 'Studio Meublé Point E',
      type: 'studio',
      price: 18000000,
      location: 'Point E, Dakar',
      bedrooms: 1,
      bathrooms: 1,
      surface: 45,
      features: ['wifi', 'furnished', 'security'],
      images: ['/api/placeholder/400/300'],
      agent: {
        name: 'Fatou Sall',
        phone: '+221 77 666 55 44',
        rating: 4.6
      },
      favorite: false,
      views: 12,
      posted: '5 jours',
      status: 'available'
    },
    {
      id: 5,
      title: 'Villa Familiale HLM Grand Yoff',
      type: 'villa',
      price: 65000000,
      location: 'HLM Grand Yoff, Dakar',
      bedrooms: 4,
      bathrooms: 3,
      surface: 250,
      features: ['parking', 'security', 'garden'],
      images: ['/api/placeholder/400/300'],
      agent: {
        name: 'Ibrahima Ba',
        phone: '+221 78 222 11 00',
        rating: 4.5
      },
      favorite: true,
      views: 31,
      posted: '1 jour',
      status: 'available'
    },
    {
      id: 6,
      title: 'Appartement F3 Mermoz Pyrotechnie',
      type: 'apartment',
      price: 35000000,
      location: 'Mermoz, Dakar',
      bedrooms: 3,
      bathrooms: 2,
      surface: 110,
      features: ['wifi', 'parking', 'security'],
      images: ['/api/placeholder/400/300'],
      agent: {
        name: 'Khadija Diallo',
        phone: '+221 77 888 99 00',
        rating: 4.8
      },
      favorite: false,
      views: 18,
      posted: '4 jours',
      status: 'available'
    }
  ];

  const getPropertyIcon = (type) => {
    switch(type) {
      case 'villa': return Home;
      case 'apartment': return Building2;
      case 'office': return Briefcase;
      case 'studio': return Building;
      default: return Home;
    }
  };

  const getPropertyTypeLabel = (type) => {
    switch(type) {
      case 'villa': return 'Villa';
      case 'apartment': return 'Appartement';
      case 'office': return 'Bureau';
      case 'studio': return 'Studio';
      default: return type;
    }
  };

  const formatPrice = (price) => {
    return (price / 1000000).toFixed(0) + 'M FCFA';
  };

  const getFeatureIcon = (feature) => {
    switch(feature) {
      case 'wifi': return Wifi;
      case 'parking': return Car;
      case 'security': return Shield;
      default: return Home;
    }
  };

  const toggleFavorite = (propertyId) => {
    // Logique pour ajouter/retirer des favoris
    console.log('Toggle favorite for property:', propertyId);
  };

  const contactAgent = (agent) => {
    // Logique pour contacter l'agent
    console.log('Contact agent:', agent);
  };

  const scheduleVisit = (propertyId) => {
    // Logique pour programmer une visite
    console.log('Schedule visit for property:', propertyId);
  };

  const PropertyCard = ({ property }) => {
    const PropertyIcon = getPropertyIcon(property.type);
    
    return (
      <motion.div
        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
        whileHover={{ y: -5 }}
        layout
      >
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              property.status === 'available' ? 'bg-green-100 text-green-700' :
              property.status === 'negotiation' ? 'bg-orange-100 text-orange-700' :
              'bg-red-100 text-red-700'
            }`}>
              {property.status === 'available' ? 'Disponible' :
               property.status === 'negotiation' ? 'En négociation' : 'Vendu'}
            </span>
          </div>

          {/* Actions */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <motion.button
              className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                property.favorite ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600'
              }`}
              onClick={() => toggleFavorite(property.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className="h-4 w-4" />
            </motion.button>
            
            <motion.button
              className="p-2 rounded-full bg-white/80 text-gray-600 backdrop-blur-sm hover:bg-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Share2 className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Views */}
          <div className="absolute bottom-4 left-4 flex items-center text-white text-sm">
            <Eye className="h-4 w-4 mr-1" />
            {property.views} vues
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <PropertyIcon className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-500">
                {getPropertyTypeLabel(property.type)}
              </span>
            </div>
            <span className="text-xs text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {property.posted}
            </span>
          </div>

          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
            {property.title}
          </h3>

          <div className="flex items-center text-gray-600 text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            {property.location}
          </div>

          {/* Price */}
          <div className="text-2xl font-bold text-blue-600 mb-4">
            {formatPrice(property.price)}
          </div>

          {/* Details */}
          <div className="flex items-center space-x-4 text-gray-600 text-sm mb-4">
            {property.bedrooms > 0 && (
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                {property.bedrooms}
              </div>
            )}
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              {property.bathrooms}
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              {property.surface}m²
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-4">
            {property.features.slice(0, 3).map((feature) => {
              const FeatureIcon = getFeatureIcon(feature);
              return (
                <div key={feature} className="flex items-center bg-gray-100 px-2 py-1 rounded-md text-xs">
                  <FeatureIcon className="h-3 w-3 mr-1" />
                  {feature === 'wifi' ? 'WiFi' :
                   feature === 'parking' ? 'Parking' :
                   feature === 'security' ? 'Sécurité' :
                   feature}
                </div>
              );
            })}
            {property.features.length > 3 && (
              <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md text-xs">
                +{property.features.length - 3} autres
              </div>
            )}
          </div>

          {/* Agent */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{property.agent.name}</p>
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-400 mr-1" />
                  <span className="text-xs text-gray-600">{property.agent.rating}</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <motion.button
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => contactAgent(property.agent)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Phone className="h-4 w-4" />
              </motion.button>
              
              <motion.button
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                onClick={() => scheduleVisit(property.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Calendar className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const PropertyListItem = ({ property }) => {
    const PropertyIcon = getPropertyIcon(property.type);
    
    return (
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
        whileHover={{ x: 5 }}
        layout
      >
        <div className="flex space-x-6">
          {/* Image */}
          <div className="relative w-32 h-24 bg-gray-200 rounded-lg flex-shrink-0">
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                property.status === 'available' ? 'bg-green-100 text-green-700' :
                property.status === 'negotiation' ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>
                {property.status === 'available' ? 'Disponible' :
                 property.status === 'negotiation' ? 'En négociation' : 'Vendu'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <PropertyIcon className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-500">{getPropertyTypeLabel(property.type)}</span>
                  <span className="text-xs text-gray-400">• {property.posted}</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">{property.title}</h3>
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.location}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {formatPrice(property.price)}
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    className={`p-2 rounded-lg transition-colors ${
                      property.favorite ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                    }`}
                    onClick={() => toggleFavorite(property.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Share2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="flex items-center space-x-6 text-gray-600 text-sm mb-3">
              {property.bedrooms > 0 && (
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  {property.bedrooms} chambres
                </div>
              )}
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                {property.bathrooms} SDB
              </div>
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                {property.surface}m²
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {property.views} vues
              </div>
            </div>

            {/* Agent and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{property.agent.name}</p>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 mr-1" />
                    <span className="text-xs text-gray-600">{property.agent.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <motion.button
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                  onClick={() => contactAgent(property.agent)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contacter
                </motion.button>
                <motion.button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  onClick={() => scheduleVisit(property.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Visite
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Biens Immobiliers Disponibles
          </h1>
          <p className="text-gray-600">
            {properties.length} biens correspondent à vos critères de recherche
          </p>
        </div>

        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <motion.button
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm' : ''
              }`}
              onClick={() => setViewMode('grid')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Grid3X3 className="h-5 w-5" />
            </motion.button>
            <motion.button
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm' : ''
              }`}
              onClick={() => setViewMode('list')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <List className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Sort */}
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Plus récent</option>
            <option value="price-low">Prix croissant</option>
            <option value="price-high">Prix décroissant</option>
            <option value="surface">Surface</option>
            <option value="popular">Plus populaire</option>
          </select>

          <motion.button
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => setShowFilters(!showFilters)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SlidersHorizontal className="h-5 w-5 mr-2" />
            Filtres
          </motion.button>
        </div>
      </motion.div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option value="">Tous les types</option>
              <option value="villa">Villa</option>
              <option value="apartment">Appartement</option>
              <option value="office">Bureau</option>
              <option value="studio">Studio</option>
            </select>
            
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option value="">Toutes les zones</option>
              <option value="almadies">Almadies</option>
              <option value="plateau">Plateau</option>
              <option value="mamelles">Mamelles</option>
            </select>
            
            <input
              type="text"
              placeholder="Prix max (FCFA)"
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option value="">Toutes les chambres</option>
              <option value="1">1 chambre</option>
              <option value="2">2 chambres</option>
              <option value="3">3 chambres</option>
              <option value="4+">4+ chambres</option>
            </select>
          </div>
        </motion.div>
      )}

      {/* Properties Grid/List */}
      <motion.div
        layout
        className={viewMode === 'grid' 
          ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
          : 'space-y-4'
        }
      >
        {properties.map((property) => (
          viewMode === 'grid' 
            ? <PropertyCard key={property.id} property={property} />
            : <PropertyListItem key={property.id} property={property} />
        ))}
      </motion.div>

      {/* Load More */}
      <motion.div 
        className="text-center pt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Charger plus de biens
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ParticulierPropertiesModern;