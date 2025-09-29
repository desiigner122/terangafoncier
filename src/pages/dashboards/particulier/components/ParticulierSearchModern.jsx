import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search,
  MapPin,
  DollarSign,
  Home,
  Building2,
  Building,
  Briefcase,
  Filter,
  SlidersHorizontal,
  Calendar,
  Bed,
  Bath,
  Square,
  Wifi,
  Car,
  Shield,
  Zap,
  Star,
  ChevronDown,
  X
} from 'lucide-react';

const ParticulierSearchModern = () => {
  const [searchFilters, setSearchFilters] = useState({
    propertyType: '',
    location: '',
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
    surface: '',
    features: []
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const propertyTypes = [
    { id: 'villa', name: 'Villa', icon: Home, color: 'text-emerald-600' },
    { id: 'apartment', name: 'Appartement', icon: Building2, color: 'text-blue-600' },
    { id: 'office', name: 'Bureau', icon: Briefcase, color: 'text-purple-600' },
    { id: 'studio', name: 'Studio', icon: Building, color: 'text-orange-600' }
  ];

  const locations = [
    'Almadies', 'Plateau', 'Mamelles', 'Ouakam', 'Ngor', 'Yoff', 'Parcelles Assainies',
    'Grand Dakar', 'Medina', 'HLM', 'Liberté', 'Point E', 'Mermoz', 'Sacré-Cœur'
  ];

  const features = [
    { id: 'wifi', name: 'WiFi', icon: Wifi },
    { id: 'parking', name: 'Parking', icon: Car },
    { id: 'security', name: 'Sécurité 24h', icon: Shield },
    { id: 'generator', name: 'Générateur', icon: Zap },
    { id: 'garden', name: 'Jardin', icon: Home },
    { id: 'pool', name: 'Piscine', icon: Home },
    { id: 'terrace', name: 'Terrasse', icon: Home },
    { id: 'furnished', name: 'Meublé', icon: Home }
  ];

  const priceRanges = [
    { min: 0, max: 10000000, label: 'Moins de 10M FCFA' },
    { min: 10000000, max: 25000000, label: '10M - 25M FCFA' },
    { min: 25000000, max: 50000000, label: '25M - 50M FCFA' },
    { min: 50000000, max: 100000000, label: '50M - 100M FCFA' },
    { min: 100000000, max: null, label: 'Plus de 100M FCFA' }
  ];

  const suggestedSearches = [
    {
      title: 'Villa 4 chambres Almadies',
      filters: { propertyType: 'villa', location: 'Almadies', bedrooms: '4' },
      popular: true
    },
    {
      title: 'Appartement F3 Plateau',
      filters: { propertyType: 'apartment', location: 'Plateau', bedrooms: '3' },
      popular: true
    },
    {
      title: 'Bureau moderne Point E',
      filters: { propertyType: 'office', location: 'Point E' },
      popular: false
    },
    {
      title: 'Studio meublé Mamelles',
      filters: { propertyType: 'studio', location: 'Mamelles', features: ['furnished'] },
      popular: false
    }
  ];

  const handleFeatureToggle = (featureId) => {
    setSearchFilters(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(id => id !== featureId)
        : [...prev.features, featureId]
    }));
  };

  const handleSearch = () => {
    console.log('Recherche avec filtres:', searchFilters);
    // Logique de recherche
  };

  const handleSuggestedSearch = (filters) => {
    setSearchFilters(prev => ({ ...prev, ...filters }));
  };

  const clearFilters = () => {
    setSearchFilters({
      propertyType: '',
      location: '',
      priceMin: '',
      priceMax: '',
      bedrooms: '',
      bathrooms: '',
      surface: '',
      features: []
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Recherche Avancée de Biens Immobiliers
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Utilisez notre système de recherche intelligent avec IA pour trouver le bien parfait selon vos critères
        </p>
      </motion.div>

      {/* Main Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg"
      >
        {/* Property Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Type de Bien</label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {propertyTypes.map((type) => (
              <motion.button
                key={type.id}
                className={`flex items-center p-4 rounded-xl border-2 transition-all duration-300 ${
                  searchFilters.propertyType === type.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSearchFilters(prev => ({ ...prev, propertyType: type.id }))}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <type.icon className={`h-6 w-6 ${type.color} mr-3`} />
                <span className="font-medium text-gray-900">{type.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Location and Price */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchFilters.location}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
              >
                <option value="">Toutes les zones</option>
                {locations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prix Minimum</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Ex: 25000000"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchFilters.priceMin}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, priceMin: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prix Maximum</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Ex: 100000000"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchFilters.priceMax}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, priceMax: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Quick Price Ranges */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Gammes de Prix Populaires</label>
          <div className="flex flex-wrap gap-2">
            {priceRanges.map((range, index) => (
              <motion.button
                key={index}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
                onClick={() => setSearchFilters(prev => ({
                  ...prev,
                  priceMin: range.min.toString(),
                  priceMax: range.max ? range.max.toString() : ''
                }))}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {range.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="mb-6">
          <motion.button
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            whileHover={{ scale: 1.05 }}
          >
            <SlidersHorizontal className="h-5 w-5 mr-2" />
            Filtres Avancés
            <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
          </motion.button>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 pt-6 mb-6"
          >
            {/* Rooms and Surface */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chambres</label>
                <div className="relative">
                  <Bed className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchFilters.bedrooms}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
                  >
                    <option value="">Toutes</option>
                    <option value="1">1 chambre</option>
                    <option value="2">2 chambres</option>
                    <option value="3">3 chambres</option>
                    <option value="4">4 chambres</option>
                    <option value="5+">5+ chambres</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salles de Bain</label>
                <div className="relative">
                  <Bath className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchFilters.bathrooms}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, bathrooms: e.target.value }))}
                  >
                    <option value="">Toutes</option>
                    <option value="1">1 salle de bain</option>
                    <option value="2">2 salles de bain</option>
                    <option value="3">3+ salles de bain</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Surface (m²)</label>
                <div className="relative">
                  <Square className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ex: 150"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchFilters.surface}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, surface: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Équipements et Services</label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {features.map((feature) => (
                  <motion.button
                    key={feature.id}
                    className={`flex items-center p-3 rounded-xl border-2 transition-all duration-300 ${
                      searchFilters.features.includes(feature.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleFeatureToggle(feature.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <feature.icon className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{feature.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Search Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center"
            onClick={handleSearch}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Search className="h-5 w-5 mr-2" />
            Rechercher les Biens
          </motion.button>

          <motion.button
            className="px-8 py-4 border-2 border-gray-300 text-gray-600 rounded-xl font-semibold hover:border-gray-400 transition-all duration-300 flex items-center justify-center"
            onClick={clearFilters}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <X className="h-5 w-5 mr-2" />
            Effacer les Filtres
          </motion.button>
        </div>
      </motion.div>

      {/* Suggested Searches */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recherches Suggérées</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {suggestedSearches.map((suggestion, index) => (
            <motion.button
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 text-left"
              onClick={() => handleSuggestedSearch(suggestion.filters)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center">
                <Search className="h-5 w-5 text-gray-400 mr-3" />
                <span className="font-medium text-gray-900">{suggestion.title}</span>
                {suggestion.popular && (
                  <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    Populaire
                  </span>
                )}
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400 rotate-[-90deg]" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* AI Search Assistant */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-8 border border-purple-200/50"
      >
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Assistant IA de Recherche</h3>
            <p className="text-gray-600 mb-4">
              Décrivez votre bien idéal en langage naturel et notre IA vous aidera à trouver les meilleures options.
            </p>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Ex: Je cherche une villa 4 chambres près de la mer avec piscine..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <motion.button
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Recherche IA
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ParticulierSearchModern;