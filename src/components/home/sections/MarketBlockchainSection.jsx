import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Blocks, 
  Shield, 
  Zap, 
  Globe, 
  BarChart3, 
  ArrowRight,
  Clock,
  MapPin,
  Eye,
  Coins,
  Database,
  Brain,
  Sparkles,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import StatsService from '@/services/StatsService';
import PropertyService from '@/services/PropertyService';

const MarketBlockchainSection = () => {
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [cryptoMetrics, setCryptoMetrics] = useState([
    { title: "Volume Blockchain (24h)", value: "—", change: "", icon: Blocks, color: "text-blue-500" },
    { title: "Transactions Smart Contract", value: "—", change: "", icon: Zap, color: "text-purple-500" },
    { title: "NFT Propriétés", value: "—", change: "", icon: Sparkles, color: "text-teal-500" },
    { title: "Certificats Vérifiés", value: "—", change: "", icon: Brain, color: "text-green-500" }
  ]);
  const [liveUpdates, setLiveUpdates] = useState([]);

  useEffect(() => {
    let active = true;

    (async () => {
      const [regions, { stats: chain }] = await Promise.all([
        StatsService.getRegionMarket(),
        StatsService.getBlockchainStats()
      ]);
      if (!active) return;

      const m = regions.map(r => ({
        key: r.region,
        name: r.region,
        price: r.avgPricePerM2 ? r.avgPricePerM2.toLocaleString('fr-FR') : '—',
        change: '',
        transactions: `${r.count}`,
        volume: `${r.count}`,
        smartContracts: `${r.smartContracts}`,
        verifications: `${r.verificationRate}`
      }));
      setMarkets(m);
      setSelectedMarket(m[0]?.key || null);

      setCryptoMetrics([
        { title: "Volume Blockchain (24h)", value: `${chain.volume24h.toLocaleString('fr-FR')} FCFA`, change: "", icon: Blocks, color: "text-blue-500" },
        { title: "Transactions Smart Contract", value: `${chain.transactions}`, change: "", icon: Zap, color: "text-purple-500" },
        { title: "NFT Propriétés", value: `${chain.nftProperties}`, change: "", icon: Sparkles, color: "text-teal-500" },
        { title: "Certificats Vérifiés", value: `${chain.verifiedCertificates}/${chain.certificates}`, change: "", icon: Brain, color: "text-green-500" }
      ]);
    })();

    // Activité récente : dernières propriétés réelles
    PropertyService.getProperties({ limit: 4 }).then(({ properties }) => {
      if (!active) return;
      setLiveUpdates((properties || []).map(p => ({
        type: 'listing',
        message: `Terrain vérifié : ${p.title || p.name} (${p.region || 'Sénégal'})`,
        time: p.created_at ? new Date(p.created_at).toLocaleDateString('fr-FR') : '',
        icon: Shield
      })));
    });

    return () => { active = false; };
  }, []);

  const currentMarket = markets.find(mk => mk.key === selectedMarket);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Particules de fond */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 border border-blue-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 border border-purple-300 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-teal-300 rounded-full animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header avec indicateur temps réel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 font-medium">DONNÉES PLATEFORME</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              🔗 Market Blockchain
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Suivez le marché immobilier sénégalais en temps réel avec notre technologie blockchain. 
            Données vérifiées, transparentes et automatisées par l'IA.
          </p>
        </motion.div>

        {/* Métriques crypto en temps réel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {cryptoMetrics.map((metric, index) => (
            <Card key={index} className="bg-white/70 backdrop-blur-sm border border-white/20 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 group-hover:scale-110 transition-transform`}>
                    <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                    <TrendingUp className="h-3 w-3" />
                    {metric.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.title}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sélecteur de marché et données principales */}
          <div className="lg:col-span-2">
            <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Analyse de Marché IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Sélecteur de zone */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {markets.map((market) => (
                    <Button
                      key={market.key}
                      variant={selectedMarket === market.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedMarket(market.key)}
                      className={`${
                        selectedMarket === market.key
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                          : 'hover:bg-blue-50'
                      } transition-all duration-300`}
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      {market.name}
                    </Button>
                  ))}
                </div>

                {/* Données de marché sélectionné */}
                {currentMarket && (
                  <motion.div
                    key={selectedMarket}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                          {currentMarket.price} FCFA/m²
                        </div>
                        <div className="flex items-center justify-center gap-1 text-green-600 font-semibold">
                          <TrendingUp className="h-4 w-4" />
                          {currentMarket.change}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Prix Moyen</div>
                      </div>
                      
                      <div className="text-center p-4 bg-gradient-to-r from-teal-50 to-green-50 rounded-xl">
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                          {currentMarket.transactions}
                        </div>
                        <div className="text-sm text-gray-600">Transactions Blockchain</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-xl font-bold text-blue-600">{currentMarket.volume}</div>
                        <div className="text-xs text-gray-600">Volume 30j</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-xl font-bold text-purple-600">{currentMarket.smartContracts}</div>
                        <div className="text-xs text-gray-600">Smart Contracts</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-xl font-bold text-green-600">{currentMarket.verifications}%</div>
                        <div className="text-xs text-gray-600">Vérifications</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-900/5 to-purple-900/5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Données certifiées blockchain</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <Shield className="h-3 w-3 mr-1" />
                        Vérifié
                      </Badge>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Activité en temps réel */}
          <div>
            <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Activité Live
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {liveUpdates.map((update, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                    >
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <update.icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 leading-relaxed">
                          {update.message}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{update.time}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Link to="/tools/market-analysis">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold">
                      <Eye className="h-4 w-4 mr-2" />
                      Analyse Complète IA
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              🚀 Rejoignez la Révolution Blockchain
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Accédez à des données de marché exclusives, des analyses IA avancées et des opportunités d'investissement vérifiées par blockchain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/terrains">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3">
                  <Blocks className="h-4 w-4 mr-2" />
                  Explorer les Terrains
                </Button>
              </Link>
              <Link to="/tools/market-analysis">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3 bg-black/20 backdrop-blur-sm">
                  <Brain className="h-4 w-4 mr-2" />
                  Analyses IA Gratuites
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MarketBlockchainSection;
