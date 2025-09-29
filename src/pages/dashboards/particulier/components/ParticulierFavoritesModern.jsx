import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  X,
  Home,
  Building2,
  Building,
  Briefcase,
  Trash2,
  Download,
  Plus,
  AlertCircle,
  CheckCircle,
  BookmarkPlus
} from 'lucide-react';

const ParticulierFavoritesModern = () => {
  const [favorites, setFavorites] = useState([
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
      addedDate: '2024-01-15',
      priceHistory: [
        { date: '2024-01-01', price: 90000000 },
        { date: '2024-01-15', price: 85000000 }
      ],
      status: 'available',
      alerts: {
        priceChange: true,
        newPhotos: false,
        similarProperties: true
      }
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
      addedDate: '2024-01-10',
      priceHistory: [
        { date: '2024-01-01', price: 45000000 }
      ],
      status: 'available',
      alerts: {
        priceChange: false,
        newPhotos: true,
        similarProperties: false
      }
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
      addedDate: '2024-01-08',
      priceHistory: [
        { date: '2024-01-01', price: 130000000 },
        { date: '2024-01-08', price: 120000000 }
      ],
      status: 'negotiation',
      alerts: {
        priceChange: true,
        newPhotos: false,
        similarProperties: true
      }
    },
    {
      id: 4,
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
      addedDate: '2024-01-05',
      priceHistory: [
        { date: '2024-01-01', price: 65000000 }
      ],
      status: 'available',
      alerts: {
        priceChange: false,
        newPhotos: false,
        similarProperties: true
      }
    }
  ]);

  const [selectedFavorites, setSelectedFavorites] = useState([]);
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');

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

  const removeFavorite = (propertyId) => {
    setFavorites(prev => prev.filter(fav => fav.id !== propertyId));
  };

  const toggleSelectFavorite = (propertyId) => {
    setSelectedFavorites(prev => 
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const removeSelectedFavorites = () => {
    setFavorites(prev => prev.filter(fav => !selectedFavorites.includes(fav.id)));
    setSelectedFavorites([]);
  };

  const contactAgent = (agent) => {
    console.log('Contact agent:', agent);
  };

  const scheduleVisit = (propertyId) => {
    console.log('Schedule visit for property:', propertyId);
  };

  const shareProperty = (property) => {
    console.log('Share property:', property);
  };

  const getPriceChange = (priceHistory) => {
    if (priceHistory.length < 2) return null;
    const latest = priceHistory[priceHistory.length - 1];
    const previous = priceHistory[priceHistory.length - 2];
    const change = latest.price - previous.price;
    const changePercent = ((change / previous.price) * 100).toFixed(1);
    return { change, changePercent };
  };

  const filteredFavorites = favorites.filter(fav => {
    if (filterBy === 'all') return true;
    if (filterBy === 'available') return fav.status === 'available';
    if (filterBy === 'negotiation') return fav.status === 'negotiation';
    if (filterBy === 'price-alerts') return fav.alerts.priceChange;
    return true;
  });

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    switch(sortBy) {
      case 'recent':
        return new Date(b.addedDate) - new Date(a.addedDate);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

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
            Mes Biens Favoris
          </h1>
          <p className="text-gray-600">
            {favorites.length} biens sauvegardés • {selectedFavorites.length} sélectionnés
          </p>
        </div>

        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          {selectedFavorites.length > 0 && (
            <motion.button
              className="flex items-center px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              onClick={removeSelectedFavorites}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer ({selectedFavorites.length})
            </motion.button>
          )}

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="all">Tous les favoris</option>
            <option value="available">Disponibles</option>
            <option value="negotiation">En négociation</option>
            <option value="price-alerts">Alertes prix</option>
          </select>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Plus récent</option>
            <option value="price-low">Prix croissant</option>
            <option value="price-high">Prix décroissant</option>
            <option value="alphabetical">Alphabétique</option>
          </select>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm">Total Favoris</p>
              <p className="text-3xl font-bold">{favorites.length}</p>
            </div>
            <Heart className="h-8 w-8 text-pink-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Valeur Totale</p>
              <p className="text-3xl font-bold">
                {formatPrice(favorites.reduce((sum, fav) => sum + fav.price, 0))}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Disponibles</p>
              <p className="text-3xl font-bold">
                {favorites.filter(fav => fav.status === 'available').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Alertes Prix</p>
              <p className="text-3xl font-bold">
                {favorites.filter(fav => fav.alerts.priceChange).length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-200" />
          </div>
        </div>
      </motion.div>

      {favorites.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white rounded-2xl border border-gray-200"
        >
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucun bien en favoris
          </h3>
          <p className="text-gray-600 mb-6">
            Commencez à sauvegarder vos biens préférés pour les retrouver facilement
          </p>
          <motion.button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Parcourir les Biens
          </motion.button>
        </motion.div>
      ) : (
        /* Favorites Grid */
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          layout
        >
          <AnimatePresence>
            {sortedFavorites.map((favorite) => {
              const PropertyIcon = getPropertyIcon(favorite.type);
              const priceChange = getPriceChange(favorite.priceHistory);
              
              return (
                <motion.div
                  key={favorite.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  whileHover={{ y: -5 }}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-200">
                    {/* Selection Checkbox */}
                    <div className="absolute top-4 left-4">
                      <motion.button
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          selectedFavorites.includes(favorite.id)
                            ? 'bg-blue-600 border-blue-600'
                            : 'bg-white border-gray-300'
                        }`}
                        onClick={() => toggleSelectFavorite(favorite.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {selectedFavorites.includes(favorite.id) && (
                          <CheckCircle className="h-4 w-4 text-white" />
                        )}
                      </motion.button>
                    </div>

                    {/* Status and Alerts */}
                    <div className="absolute top-4 right-4 flex flex-col space-y-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        favorite.status === 'available' ? 'bg-green-100 text-green-700' :
                        favorite.status === 'negotiation' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {favorite.status === 'available' ? 'Disponible' :
                         favorite.status === 'negotiation' ? 'En négociation' : 'Vendu'}
                      </span>
                      
                      {favorite.alerts.priceChange && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Prix changé
                        </span>
                      )}
                      
                      {favorite.alerts.newPhotos && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                          Nouvelles photos
                        </span>
                      )}
                    </div>

                    {/* Added Date */}
                    <div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 px-2 py-1 rounded">
                      Ajouté le {new Date(favorite.addedDate).toLocaleDateString('fr-FR')}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <PropertyIcon className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-500">
                          {getPropertyTypeLabel(favorite.type)}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                      {favorite.title}
                    </h3>

                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      {favorite.location}
                    </div>

                    {/* Price with Change */}
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatPrice(favorite.price)}
                      </div>
                      {priceChange && (
                        <div className={`flex items-center text-sm ${
                          priceChange.change < 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <TrendingUp className={`h-4 w-4 mr-1 ${
                            priceChange.change < 0 ? 'rotate-180' : ''
                          }`} />
                          {priceChange.change < 0 ? '-' : '+'}{formatPrice(Math.abs(priceChange.change))}
                          <span className="ml-1">({priceChange.changePercent}%)</span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex items-center space-x-4 text-gray-600 text-sm mb-4">
                      {favorite.bedrooms > 0 && (
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          {favorite.bedrooms}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        {favorite.bathrooms}
                      </div>
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        {favorite.surface}m²
                      </div>
                    </div>

                    {/* Agent */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{favorite.agent.name}</p>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 mr-1" />
                            <span className="text-xs text-gray-600">{favorite.agent.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <motion.button
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={() => removeFavorite(favorite.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="h-4 w-4" />
                        </motion.button>

                        <motion.button
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => shareProperty(favorite)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Share2 className="h-4 w-4" />
                        </motion.button>
                        
                        <motion.button
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          onClick={() => contactAgent(favorite.agent)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Phone className="h-4 w-4" />
                        </motion.button>
                        
                        <motion.button
                          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          onClick={() => scheduleVisit(favorite.id)}
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
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Actions Panel */}
      {favorites.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions sur vos Favoris</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="h-6 w-6 text-gray-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Exporter la Liste</p>
                <p className="text-sm text-gray-600">PDF ou Excel</p>
              </div>
            </motion.button>

            <motion.button
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageSquare className="h-6 w-6 text-gray-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Contacter en Masse</p>
                <p className="text-sm text-gray-600">Tous les agents</p>
              </div>
            </motion.button>

            <motion.button
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <BookmarkPlus className="h-6 w-6 text-gray-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Créer Alerte</p>
                <p className="text-sm text-gray-600">Biens similaires</p>
              </div>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ParticulierFavoritesModern;