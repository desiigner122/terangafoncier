import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart,
  Activity,
  MapPin,
  Building,
  Home,
  Store,
  Calendar,
  Users,
  Target,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

const MarketAnalysisPage = () => {
  const [selectedRegion, setSelectedRegion] = useState('Dakar');
  const [selectedPeriod, setSelectedPeriod] = useState('6M');
  const [marketData, setMarketData] = useState({});

  useEffect(() => {
    // Simulation des donnÃ©es de marchÃ©
    const mockData = {
      Dakar: {
        averagePrice: 850000,
        priceChange: 12.5,
        volume: 245,
        volumeChange: 8.3,
        inventory: 1420,
        daysOnMarket: 45,
        demandIndex: 85,
        supplyIndex: 72
      },
      Thies: {
        averagePrice: 420000,
        priceChange: 18.2,
        volume: 89,
        volumeChange: 15.1,
        inventory: 567,
        daysOnMarket: 62,
        demandIndex: 78,
        supplyIndex: 65
      },
      'Saint-Louis': {
        averagePrice: 320000,
        priceChange: 8.7,
        volume: 34,
        volumeChange: 5.2,
        inventory: 289,
        daysOnMarket: 78,
        demandIndex: 65,
        supplyIndex: 70
      }
    };
    setMarketData(mockData);
  }, []);

  const currentData = marketData[selectedRegion] || {};

  const regions = ['Dakar', 'Thies', 'Saint-Louis', 'Kaolack', 'Ziguinchor'];
  const periods = ['1M', '3M', '6M', '1A', '2A'];

  const propertyTypes = [
    { type: 'RÃ©sidentiel', percentage: 65, color: 'bg-blue-500' },
    { type: 'Commercial', percentage: 20, color: 'bg-green-500' },
    { type: 'Bureaux', percentage: 10, color: 'bg-purple-500' },
    { type: 'Terrain', percentage: 5, color: 'bg-yellow-500' }
  ];

  const marketTrends = [
    {
      title: "Forte demande rÃ©sidentielle",
      description: "Augmentation de 25% de la demande pour les logements familiaux",
      impact: "positive",
      confidence: 92
    },
    {
      title: "DÃ©veloppement des zones pÃ©riurbaines",
      description: "Expansion vers les banlieues avec de nouveaux projets",
      impact: "positive",
      confidence: 88
    },
    {
      title: "Hausse des coÃ»ts de construction",
      description: "Augmentation des prix des matÃ©riaux de 15%",
      impact: "negative",
      confidence: 85
    },
    {
      title: "Nouvelles infrastructures",
      description: "Projets de transport amÃ©liorant l'accessibilitÃ©",
      impact: "positive",
      confidence: 78
    }
  ];

  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'positive': return CheckCircle;
      case 'negative': return AlertTriangle;
      default: return Info;
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analyse du MarchÃ© Immobilier
          </h1>
          <p className="text-gray-600">
            Insights et tendances du marchÃ© immobilier sÃ©nÃ©galais
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg mb-8"
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">RÃ©gion:</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">PÃ©riode:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {periods.map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedPeriod === period
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prix Moyen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentData.averagePrice?.toLocaleString()} FCFA
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">
                    +{currentData.priceChange}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Volume de Ventes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentData.volume}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">
                    +{currentData.volumeChange}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock Disponible</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentData.inventory}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {currentData.daysOnMarket} jours en moyenne
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Building className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Indice Demande</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentData.demandIndex}/100
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Offre: {currentData.supplyIndex}/100
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Target className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Property Types Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              RÃ©partition par Type de Bien
            </h3>
            <div className="space-y-4">
              {propertyTypes.map((type, index) => (
                <div key={type.type} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: type.color.replace('bg-', '#') }}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {type.type}
                      </span>
                      <span className="text-sm text-gray-600">
                        {type.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${type.percentage}%` }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                        className={`h-2 rounded-full ${type.color}`}
                      ></motion.div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Market Trends */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Tendances du MarchÃ©
            </h3>
            <div className="space-y-4">
              {marketTrends.map((trend, index) => {
                const ImpactIcon = getImpactIcon(trend.impact);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${getImpactColor(trend.impact)}`}>
                        <ImpactIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {trend.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {trend.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Confiance: {trend.confidence}%
                          </span>
                          <div className="w-20 bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-blue-600 h-1 rounded-full"
                              style={{ width: `${trend.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Price Evolution Chart YOUR_API_KEY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Ã‰volution des Prix - {selectedRegion}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <BarChart3 className="h-4 w-4" />
              <span>Derniers {selectedPeriod}</span>
            </div>
          </div>
          <div className="h-64 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="text-gray-600">Graphique d'Ã©volution des prix en cours de dÃ©veloppement</p>
              <p className="text-sm text-gray-500 mt-2">
                IntÃ©gration future avec APIs de donnÃ©es de marchÃ©
              </p>
            </div>
          </div>
        </motion.div>

        {/* Investment Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center mb-4">
            <Target className="h-6 w-6 mr-3" />
            <h3 className="text-xl font-semibold">
              Recommandations d'Investissement
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Zone RecommandÃ©e</h4>
              <p className="text-sm opacity-90">
                Almadies - Fort potentiel de croissance avec nouveaux dÃ©veloppements
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Type PrivilÃ©giÃ©</h4>
              <p className="text-sm opacity-90">
                RÃ©sidentiel moyen standing - Demande soutenue et rentabilitÃ© stable
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Timing</h4>
              <p className="text-sm opacity-90">
                Optimal - MarchÃ© favorable aux acheteurs avec des opportunitÃ©s
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MarketAnalysisPage;
