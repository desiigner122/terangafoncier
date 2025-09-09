import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  TrendingUp, 
  Clock,
  Building,
  Home,
  Store,
  DollarSign,
  Users,
  Calendar,
  Filter,
  Search,
  Heart,
  Share2,
  Eye,
  ArrowRight
} from 'lucide-react';

const OpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    location: 'all',
    priceRange: 'all',
    riskLevel: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('trending');

  useEffect(() => {
    // Simulation des opportunités d'investissement
    const mockOpportunities = [
      {
        id: 1,
        title: "Résidence Luxury Almadies",
        location: "Almadies, Dakar",
        type: "residential",
        price: 1200000,
        expectedReturn: 18.5,
        riskLevel: "medium",
        duration: "24 mois",
        description: "Projet de résidence haut standing avec vue mer",
        images: ["/api/placeholder/300/200"],
        investmentMin: 50000,
        totalNeeded: 800000,
        currentFunding: 320000,
        investors: 23,
        timeLeft: "45 jours",
        trending: true,
        featured: true,
        tags: ["Vue mer", "Haut standing", "Proche centre"],
        developer: "Teranga Développement",
        completionDate: "Q2 2026"
      },
      {
        id: 2,
        title: "Centre Commercial VDN",
        location: "VDN, Dakar",
        type: "commercial",
        price: 2500000,
        expectedReturn: 22.0,
        riskLevel: "high",
        duration: "36 mois",
        description: "Centre commercial moderne dans zone d'affaires",
        images: ["/api/placeholder/300/200"],
        investmentMin: 100000,
        totalNeeded: 1500000,
        currentFunding: 650000,
        investors: 15,
        timeLeft: "18 jours",
        trending: true,
        featured: false,
        tags: ["Commercial", "Zone d'affaires", "Fort trafic"],
        developer: "Sénégal Commerce SA",
        completionDate: "Q4 2026"
      },
      {
        id: 3,
        title: "Lotissement Mermoz Extension",
        location: "Mermoz, Dakar",
        type: "land",
        price: 450000,
        expectedReturn: 15.2,
        riskLevel: "low",
        duration: "18 mois",
        description: "Terrain viabilisé en zone résidentielle en expansion",
        images: ["/api/placeholder/300/200"],
        investmentMin: 25000,
        totalNeeded: 300000,
        currentFunding: 180000,
        investors: 31,
        timeLeft: "12 jours",
        trending: false,
        featured: true,
        tags: ["Terrain", "Viabilisé", "Zone résidentielle"],
        developer: "Foncier Plus",
        completionDate: "Q1 2026"
      },
      {
        id: 4,
        title: "Bureaux Moderne Plateau",
        location: "Plateau, Dakar",
        type: "office",
        price: 1800000,
        expectedReturn: 20.8,
        riskLevel: "medium",
        duration: "30 mois",
        description: "Immeuble de bureaux dans le district financier",
        images: ["/api/placeholder/300/200"],
        investmentMin: 75000,
        totalNeeded: 1200000,
        currentFunding: 480000,
        investors: 18,
        timeLeft: "28 jours",
        trending: false,
        featured: false,
        tags: ["Bureaux", "District financier", "Moderne"],
        developer: "Business Centers Ltd",
        completionDate: "Q3 2026"
      },
      {
        id: 5,
        title: "Villa Familiale Sacré-Coeur",
        location: "Sacré-Coeur, Dakar",
        type: "residential",
        price: 680000,
        expectedReturn: 16.5,
        riskLevel: "low",
        duration: "20 mois",
        description: "Villa familiale dans quartier prisé",
        images: ["/api/placeholder/300/200"],
        investmentMin: 30000,
        totalNeeded: 450000,
        currentFunding: 200000,
        investors: 28,
        timeLeft: "35 jours",
        trending: true,
        featured: false,
        tags: ["Villa", "Familiale", "Quartier prisé"],
        developer: "Habitat Sénégal",
        completionDate: "Q1 2026"
      },
      {
        id: 6,
        title: "Complexe Industriel Diamniadio",
        location: "Diamniadio",
        type: "industrial",
        price: 3200000,
        expectedReturn: 25.0,
        riskLevel: "high",
        duration: "48 mois",
        description: "Zone industrielle moderne avec infrastructures",
        images: ["/api/placeholder/300/200"],
        investmentMin: 150000,
        totalNeeded: 2000000,
        currentFunding: 800000,
        investors: 12,
        timeLeft: "60 jours",
        trending: false,
        featured: true,
        tags: ["Industriel", "Diamniadio", "Infrastructure"],
        developer: "Industrie Moderne SA",
        completionDate: "Q2 2027"
      }
    ];
    
    setOpportunities(mockOpportunities);
  }, []);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'residential': return Home;
      case 'commercial': return Store;
      case 'office': return Building;
      case 'land': return MapPin;
      case 'industrial': return Building;
      default: return Building;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'residential': return 'Résidentiel';
      case 'commercial': return 'Commercial';
      case 'office': return 'Bureaux';
      case 'land': return 'Terrain';
      case 'industrial': return 'Industriel';
      default: return type;
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskLabel = (risk) => {
    switch (risk) {
      case 'low': return 'Faible';
      case 'medium': return 'Moyen';
      case 'high': return 'Élevé';
      default: return risk;
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filters.type === 'all' || opp.type === filters.type;
    const matchesRisk = filters.riskLevel === 'all' || opp.riskLevel === filters.riskLevel;
    
    return matchesSearch && matchesType && matchesRisk;
  });

  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    switch (sortBy) {
      case 'trending': return b.trending - a.trending;
      case 'return': return b.expectedReturn - a.expectedReturn;
      case 'price_low': return a.price - b.price;
      case 'price_high': return b.price - a.price;
      case 'time': return parseInt(a.timeLeft) - parseInt(b.timeLeft);
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Opportunités d'Investissement
          </h1>
          <p className="text-gray-600">
            Découvrez les meilleures opportunités immobilières du moment
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une opportunité..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            
            <select
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">Tous types</option>
              <option value="residential">Résidentiel</option>
              <option value="commercial">Commercial</option>
              <option value="office">Bureaux</option>
              <option value="land">Terrain</option>
              <option value="industrial">Industriel</option>
            </select>

            <select
              value={filters.riskLevel}
              onChange={(e) => setFilters({...filters, riskLevel: e.target.value})}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">Tous risques</option>
              <option value="low">Faible risque</option>
              <option value="medium">Risque moyen</option>
              <option value="high">Risque élevé</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="trending">Tendance</option>
              <option value="return">Rendement</option>
              <option value="price_low">Prix croissant</option>
              <option value="price_high">Prix décroissant</option>
              <option value="time">Temps restant</option>
            </select>

            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
              <Filter className="h-4 w-4 mr-2" />
              Filtrer
            </button>
          </div>
        </motion.div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedOpportunities.map((opportunity, index) => {
            const TypeIcon = getTypeIcon(opportunity.type);
            const fundingPercentage = (opportunity.currentFunding / opportunity.totalNeeded) * 100;
            
            return (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Image and Badges */}
                <div className="relative h-48 bg-gradient-to-r from-purple-400 to-pink-400">
                  {opportunity.featured && (
                    <div className="absolute top-4 left-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      <Star className="h-3 w-3 inline mr-1" />
                      Featured
                    </div>
                  )}
                  {opportunity.trending && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      <TrendingUp className="h-3 w-3 inline mr-1" />
                      Trending
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="flex items-center text-white">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{opportunity.location}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                        <Heart className="h-4 w-4 text-white" />
                      </button>
                      <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                        <Share2 className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg mr-3">
                        <TypeIcon className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-sm text-gray-600">
                        {getTypeLabel(opportunity.type)}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(opportunity.riskLevel)}`}>
                      {getRiskLabel(opportunity.riskLevel)}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {opportunity.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {opportunity.description}
                  </p>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Rendement attendu</p>
                      <p className="text-lg font-bold text-green-600">
                        {opportunity.expectedReturn}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Investissement min.</p>
                      <p className="text-lg font-bold text-gray-900">
                        {(opportunity.investmentMin / 1000).toFixed(0)}K FCFA
                      </p>
                    </div>
                  </div>

                  {/* Funding Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Financement</span>
                      <span>{fundingPercentage.toFixed(0)}% collecté</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${fundingPercentage}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                        className="bg-purple-600 h-2 rounded-full"
                      ></motion.div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{opportunity.currentFunding.toLocaleString()} FCFA</span>
                      <span>{opportunity.totalNeeded.toLocaleString()} FCFA</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{opportunity.investors} investisseurs</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{opportunity.timeLeft}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {opportunity.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Investir
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg border border-purple-600 hover:bg-purple-50 transition-colors flex items-center mx-auto">
            Voir plus d'opportunités
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default OpportunitiesPage;
