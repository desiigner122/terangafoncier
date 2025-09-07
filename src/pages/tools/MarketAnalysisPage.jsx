import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { TrendingUp, BarChart3, PieChart, MapPin, Calendar, DollarSign, Users, Home, ArrowUp, ArrowDown, Eye, Download } from 'lucide-react';

const MarketAnalysisPage = () => {
  const [selectedRegion, setSelectedRegion] = useState('dakar');
  const [selectedPeriod, setSelectedPeriod] = useState('12months');

  const regions = [
    { value: 'dakar', label: 'Dakar', growth: 12.5 },
    { value: 'thies', label: 'Thiès', growth: 8.3 },
    { value: 'saint-louis', label: 'Saint-Louis', growth: 6.7 },
    { value: 'kaolack', label: 'Kaolack', growth: 5.2 },
    { value: 'ziguinchor', label: 'Ziguinchor', growth: 7.8 }
  ];

  const periods = [
    { value: '3months', label: '3 derniers mois' },
    { value: '6months', label: '6 derniers mois' },
    { value: '12months', label: '12 derniers mois' },
    { value: '24months', label: '2 dernières années' }
  ];

  const marketData = {
    dakar: {
      averagePrice: 185000,
      growth: 12.5,
      transactions: 2847,
      hotAreas: ['Almadies', 'Mermoz', 'Plateau'],
      priceRange: { min: 120000, max: 350000 },
      demand: 'Très élevée',
      supply: 'Limitée'
    },
    thies: {
      averagePrice: 95000,
      growth: 8.3,
      transactions: 1523,
      hotAreas: ['Centre-ville', 'Mbour', 'Pout'],
      priceRange: { min: 65000, max: 150000 },
      demand: 'Élevée',
      supply: 'Modérée'
    },
    'saint-louis': {
      averagePrice: 78000,
      growth: 6.7,
      transactions: 892,
      hotAreas: ['Île de Saint-Louis', 'Sor', 'Ndar'],
      priceRange: { min: 50000, max: 120000 },
      demand: 'Modérée',
      supply: 'Élevée'
    }
  };

  const propertyTypes = [
    { type: 'Terrains', percentage: 45, color: 'bg-blue-500' },
    { type: 'Villas', percentage: 28, color: 'bg-green-500' },
    { type: 'Appartements', percentage: 18, color: 'bg-purple-500' },
    { type: 'Commercial', percentage: 9, color: 'bg-yellow-500' }
  ];

  const monthlyTrends = [
    { month: 'Jan', price: 175000, transactions: 234 },
    { month: 'Fév', price: 178000, transactions: 267 },
    { month: 'Mar', price: 180000, transactions: 298 },
    { month: 'Avr', price: 182000, transactions: 312 },
    { month: 'Mai', price: 183000, transactions: 289 },
    { month: 'Jun', price: 185000, transactions: 345 },
    { month: 'Jul', price: 187000, transactions: 356 },
    { month: 'Aoû', price: 188000, transactions: 334 },
    { month: 'Sep', price: 190000, transactions: 378 },
    { month: 'Oct', price: 192000, transactions: 389 },
    { month: 'Nov', price: 194000, transactions: 412 },
    { month: 'Déc', price: 195000, transactions: 445 }
  ];

  const insights = [
    {
      title: "Croissance du marché foncier",
      description: "Le marché immobilier sénégalais affiche une croissance de 12.5% à Dakar",
      trend: "up",
      value: "+12.5%",
      color: "text-green-600"
    },
    {
      title: "Demande vs Offre",
      description: "La demande dépasse l'offre de 35% dans la région de Dakar",
      trend: "up",
      value: "+35%",
      color: "text-blue-600"
    },
    {
      title: "Prix moyen au m²",
      description: "Augmentation du prix moyen de 8% par rapport à l'année précédente",
      trend: "up",
      value: "185k CFA/m²",
      color: "text-purple-600"
    },
    {
      title: "Transactions sécurisées",
      description: "98% des transactions passent par des notaires certifiés",
      trend: "up",
      value: "98%",
      color: "text-emerald-600"
    }
  ];

  const currentData = marketData[selectedRegion] || marketData.dakar;

  return (
    <>
      <Helmet>
        <title>Analyses de Marché Immobilier - Teranga Foncier</title>
        <meta name="description" content="Analyses et tendances du marché immobilier sénégalais. Prix moyens, évolution, insights et données certifiées pour sécuriser vos investissements." />
        <meta name="keywords" content="marché immobilier sénégal, prix terrains dakar, tendances foncier, analyse investissement" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        {/* Hero Section */}
        <section className="relative py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-indigo-600/10"></div>
          <div className="container mx-auto px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl">
                  <TrendingUp className="h-12 w-12 text-white" />
                </div>
              </div>
              
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                Analyses de Marché Immobilier
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Accédez aux données et tendances du marché immobilier sénégalais.
                <br />
                <span className="text-purple-600 font-semibold">Données certifiées • Insights experts • Prédictions IA</span>
              </p>
            </motion.div>
          </div>
        </section>

        {/* Market Insights Cards */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`text-2xl font-bold ${insight.color}`}>
                      {insight.value}
                    </div>
                    {insight.trend === 'up' ? (
                      <ArrowUp className="h-6 w-6 text-green-500" />
                    ) : (
                      <ArrowDown className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{insight.title}</h3>
                  <p className="text-gray-600 text-sm">{insight.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Analysis Dashboard */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Controls */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8">
                <h2 className="text-3xl font-bold text-white mb-6">Tableau de Bord du Marché</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Région</label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-white/20"
                    >
                      {regions.map(region => (
                        <option key={region.value} value={region.value}>
                          {region.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Période</label>
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-white/20"
                    >
                      {periods.map(period => (
                        <option key={period.value} value={period.value}>
                          {period.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {/* Key Metrics */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                    <div className="flex items-center mb-4">
                      <DollarSign className="h-8 w-8 text-blue-600 mr-3" />
                      <div>
                        <div className="text-sm text-gray-600">Prix moyen /m²</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {currentData.averagePrice.toLocaleString()} CFA
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-green-600">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      +{currentData.growth}% cette année
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
                    <div className="flex items-center mb-4">
                      <Users className="h-8 w-8 text-green-600 mr-3" />
                      <div>
                        <div className="text-sm text-gray-600">Transactions</div>
                        <div className="text-2xl font-bold text-green-600">
                          {currentData.transactions.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">Cette année</div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
                    <div className="flex items-center mb-4">
                      <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
                      <div>
                        <div className="text-sm text-gray-600">Demande</div>
                        <div className="text-2xl font-bold text-purple-600">
                          {currentData.demand}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">Offre: {currentData.supply}</div>
                  </div>
                </div>

                {/* Price Trends Chart */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <BarChart3 className="h-6 w-6 mr-3" />
                    Évolution des Prix (12 derniers mois)
                  </h3>
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-end justify-between h-64 gap-2">
                      {monthlyTrends.map((data, index) => (
                        <div key={data.month} className="flex flex-col items-center flex-1">
                          <div
                            className="bg-gradient-to-t from-purple-500 to-indigo-500 rounded-t-lg w-full transition-all duration-500 hover:from-purple-600 hover:to-indigo-600"
                            style={{
                              height: `${(data.price / 200000) * 100}%`,
                              minHeight: '20px'
                            }}
                            title={`${data.price.toLocaleString()} CFA`}
                          ></div>
                          <div className="text-xs text-gray-600 mt-2">{data.month}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-4">
                      <span>175k CFA</span>
                      <span>185k CFA</span>
                      <span>195k CFA</span>
                    </div>
                  </div>
                </div>

                {/* Property Types Distribution */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                      <PieChart className="h-6 w-6 mr-3" />
                      Répartition par Type
                    </h3>
                    <div className="space-y-4">
                      {propertyTypes.map((type, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center"
                        >
                          <div className="flex-1">
                            <div className="flex justify-between mb-2">
                              <span className="font-medium text-gray-700">{type.type}</span>
                              <span className="text-gray-600">{type.percentage}%</span>
                            </div>
                            <div className="bg-gray-200 rounded-full h-3">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${type.percentage}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                className={`h-3 rounded-full ${type.color}`}
                              ></motion.div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                      <MapPin className="h-6 w-6 mr-3" />
                      Zones en Demande
                    </h3>
                    <div className="space-y-4">
                      {currentData.hotAreas.map((area, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-gray-800">{area}</div>
                              <div className="text-sm text-gray-600">Zone à forte demande</div>
                            </div>
                            <div className="flex items-center text-green-600">
                              <ArrowUp className="h-4 w-4 mr-1" />
                              <span className="text-sm font-semibold">+15%</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price Range */}
                <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Fourchette de Prix</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Prix minimum</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {currentData.priceRange.min.toLocaleString()} CFA/m²
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Prix maximum</div>
                      <div className="text-2xl font-bold text-indigo-600">
                        {currentData.priceRange.max.toLocaleString()} CFA/m²
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-gray-200">
                  <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger le rapport
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir détails complets
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                Besoin d'analyses personnalisées ?
              </h2>
              <p className="text-xl text-purple-100 mb-8">
                Obtenez des rapports détaillés et des conseils d'experts pour vos investissements
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  Rapport personnalisé
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-purple-600 transition-colors">
                  Consulter un expert
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default MarketAnalysisPage;
