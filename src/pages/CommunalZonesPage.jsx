import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Filter, 
  Search, 
  Calendar, 
  Users, 
  Ruler, 
  Eye,
  Heart,
  FileText,
  Building,
  Leaf,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

const CommunalZonesPage = () => {
  const [zones, setZones] = useState([]);
  const [filteredZones, setFilteredZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    region: '',
    commune: '',
    minArea: '',
    maxArea: '',
    minPrice: '',
    maxPrice: '',
    status: '',
    searchTerm: ''
  });

  // Données simulées des zones communales
  const mockZones = [
    {
      id: 1,
      title: 'Zone Résidentielle Almadies Nord',
      region: 'Dakar',
      commune: 'Almadies',
      totalArea: '15 hectares',
      availablePlots: 24,
      pricePerM2: '85000',
      status: 'Disponible',
      description: 'Zone résidentielle haut standing avec tous les équipements.',
      features: ['Électricité', 'Eau potable', 'Assainissement', 'Routes pavées', 'Éclairage public'],
      datePublished: '2024-03-15',
      deadlineApplication: '2024-06-15',
      image: '/api/placeholder/400/250',
      coordinates: { lat: 14.7451, lng: -17.5069 }
    },
    {
      id: 2,
      title: 'Zone Mixte Thiès Centre',
      region: 'Thiès',
      commune: 'Thiès',
      totalArea: '8 hectares',
      availablePlots: 36,
      pricePerM2: '45000',
      status: 'Disponible',
      description: 'Zone mixte résidentielle et commerciale au cœur de Thiès.',
      features: ['Électricité', 'Eau potable', 'Transport public', 'Centre commercial'],
      datePublished: '2024-02-20',
      deadlineApplication: '2024-05-20',
      image: '/api/placeholder/400/250',
      coordinates: { lat: 14.7886, lng: -16.9246 }
    },
    {
      id: 3,
      title: 'Zone Agricole Kaolack Sud',
      region: 'Kaolack',
      commune: 'Kaolack',
      totalArea: '25 hectares',
      availablePlots: 50,
      pricePerM2: '15000',
      status: 'En Cours',
      description: 'Zone agricole avec accès aux infrastructures d\'irrigation.',
      features: ['Irrigation', 'Accès véhicule', 'Sol fertile', 'Proximité marché'],
      datePublished: '2024-01-10',
      deadlineApplication: '2024-04-10',
      image: '/api/placeholder/400/250',
      coordinates: { lat: 14.1333, lng: -16.0667 }
    },
    {
      id: 4,
      title: 'Zone Touristique Saly Portudal',
      region: 'Thiès',
      commune: 'Mbour',
      totalArea: '12 hectares',
      availablePlots: 18,
      pricePerM2: '120000',
      status: 'Bientôt Disponible',
      description: 'Zone touristique en bord de mer avec vue océan.',
      features: ['Front de mer', 'Électricité', 'Eau potable', 'Accès plage', 'Zone touristique'],
      datePublished: '2024-03-01',
      deadlineApplication: '2024-07-01',
      image: '/api/placeholder/400/250',
      coordinates: { lat: 14.3333, lng: -16.7667 }
    },
    {
      id: 5,
      title: 'Zone Industrielle Rufisque',
      region: 'Dakar',
      commune: 'Rufisque',
      totalArea: '20 hectares',
      availablePlots: 15,
      pricePerM2: '95000',
      status: 'Disponible',
      description: 'Zone industrielle avec accès direct à l\'autoroute.',
      features: ['Accès autoroute', 'Électricité HT', 'Eau industrielle', 'Rail proche'],
      datePublished: '2024-02-05',
      deadlineApplication: '2024-08-05',
      image: '/api/placeholder/400/250',
      coordinates: { lat: 14.7167, lng: -17.2833 }
    },
    {
      id: 6,
      title: 'Zone Résidentielle Saint-Louis',
      region: 'Saint-Louis',
      commune: 'Saint-Louis',
      totalArea: '10 hectares',
      availablePlots: 28,
      pricePerM2: '35000',
      status: 'Disponible',
      description: 'Zone résidentielle dans la ville historique de Saint-Louis.',
      features: ['Patrimoine historique', 'Électricité', 'Eau potable', 'Transport'],
      datePublished: '2024-01-25',
      deadlineApplication: '2024-05-25',
      image: '/api/placeholder/400/250',
      coordinates: { lat: 16.0333, lng: -16.5000 }
    }
  ];

  // Options pour les filtres
  const regions = ['Toutes les régions', 'Dakar', 'Thiès', 'Kaolack', 'Saint-Louis', 'Diourbel', 'Fatick', 'Kaffrine', 'Kolda', 'Louga', 'Matam', 'Sédhiou', 'Tambacounda', 'Kédougou', 'Ziguinchor'];
  const communes = {
    'Dakar': ['Almadies', 'Dakar Plateau', 'Grand Dakar', 'Parcelles Assainies', 'Pikine', 'Rufisque'],
    'Thiès': ['Thiès', 'Mbour', 'Tivaouane'],
    'Kaolack': ['Kaolack', 'Kaffrine', 'Nioro du Rip'],
    'Saint-Louis': ['Saint-Louis', 'Podor', 'Dagana']
  };
  const statusOptions = ['Tous les statuts', 'Disponible', 'En Cours', 'Bientôt Disponible', 'Complet'];

  useEffect(() => {
    // Simulation du chargement des données
    setTimeout(() => {
      setZones(mockZones);
      setFilteredZones(mockZones);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Appliquer les filtres
    let filtered = zones;

    if (filters.region && filters.region !== 'Toutes les régions') {
      filtered = filtered.filter(zone => zone.region === filters.region);
    }

    if (filters.commune) {
      filtered = filtered.filter(zone => zone.commune === filters.commune);
    }

    if (filters.status && filters.status !== 'Tous les statuts') {
      filtered = filtered.filter(zone => zone.status === filters.status);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(zone => parseInt(zone.pricePerM2) >= parseInt(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(zone => parseInt(zone.pricePerM2) <= parseInt(filters.maxPrice));
    }

    if (filters.searchTerm) {
      filtered = filtered.filter(zone => 
        zone.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        zone.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    setFilteredZones(filtered);
  }, [filters, zones]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // Reset commune si la région change
      ...(key === 'region' && { commune: '' })
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Disponible': return 'bg-green-100 text-green-800';
      case 'En Cours': return 'bg-yellow-100 text-yellow-800';
      case 'Bientôt Disponible': return 'bg-blue-100 text-blue-800';
      case 'Complet': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const clearFilters = () => {
    setFilters({
      region: '',
      commune: '',
      minArea: '',
      maxArea: '',
      minPrice: '',
      maxPrice: '',
      status: '',
      searchTerm: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des zones communales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
            <Leaf className="w-8 h-8 mr-3 text-green-600" />
            Zones de Terrains Communaux
          </h1>
          <p className="text-gray-600">
            Découvrez les zones communales disponibles pour vos projets immobiliers, 
            agricoles ou commerciaux avec système de filtrage avancé.
          </p>
        </motion.div>

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-green-600" />
              Filtres de Recherche
            </h2>
            <button
              onClick={clearFilters}
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              Effacer les filtres
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Barre de recherche */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recherche
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou description..."
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                />
              </div>
            </div>

            {/* Région */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Région
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                value={filters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
              >
                {regions.map(region => (
                  <option key={region} value={region === 'Toutes les régions' ? '' : region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Commune */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commune
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                value={filters.commune}
                onChange={(e) => handleFilterChange('commune', e.target.value)}
                disabled={!filters.region}
              >
                <option value="">Toutes les communes</option>
                {filters.region && communes[filters.region]?.map(commune => (
                  <option key={commune} value={commune}>
                    {commune}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Prix minimum */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix minimum (FCFA/m²)
              </label>
              <input
                type="number"
                placeholder="Ex: 10000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </div>

            {/* Prix maximum */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix maximum (FCFA/m²)
              </label>
              <input
                type="number"
                placeholder="Ex: 100000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status === 'Tous les statuts' ? '' : status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Résultats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              {filteredZones.length} zone{filteredZones.length > 1 ? 's' : ''} trouvée{filteredZones.length > 1 ? 's' : ''}
            </h3>
          </div>
        </motion.div>

        {/* Grille des zones */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredZones.map((zone, index) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Image */}
              <div className="h-48 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                <Building className="w-16 h-16 text-white/70" />
              </div>

              <div className="p-6">
                {/* Statut */}
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(zone.status)}`}>
                    {zone.status}
                  </span>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-red-500">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-blue-500">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Titre */}
                <h3 className="font-bold text-gray-800 mb-2 text-lg">
                  {zone.title}
                </h3>

                {/* Localisation */}
                <p className="text-gray-600 text-sm mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {zone.commune}, {zone.region}
                </p>

                {/* Prix */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-2xl font-bold text-green-600">
                      {parseInt(zone.pricePerM2).toLocaleString()} FCFA
                    </span>
                    <span className="text-gray-500 text-sm">/m²</span>
                  </div>
                  <span className="text-gray-500 text-sm">{zone.totalArea}</span>
                </div>

                {/* Informations clés */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-green-600" />
                    {zone.availablePlots} parcelles
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-green-600" />
                    Jusqu'au {new Date(zone.deadlineApplication).toLocaleDateString('fr-FR')}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {zone.description}
                </p>

                {/* Caractéristiques */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {zone.features.slice(0, 3).map((feature, idx) => (
                    <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                  {zone.features.length > 3 && (
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      +{zone.features.length - 3} autres
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                    Voir les détails
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Message si aucun résultat */}
        {filteredZones.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Aucune zone trouvée
            </h3>
            <p className="text-gray-500">
              Essayez de modifier vos critères de recherche pour voir plus de résultats.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Effacer les filtres
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CommunalZonesPage;