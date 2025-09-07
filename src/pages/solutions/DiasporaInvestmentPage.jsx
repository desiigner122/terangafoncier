import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  TrendingUp, 
  Shield, 
  DollarSign, 
  BarChart3, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Phone, 
  FileText, 
  Clock, 
  Star,
  Database,
  Lock,
  Coins
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DiasporaInvestmentPage = () => {
  const benefits = [
    {
      icon: Database,
      title: "Blockchain NFT",
      description: "Propriétés tokenisées en NFT avec sécurité cryptographique maximale.",
      isNew: true
    },
    {
      icon: Shield,
      title: "Sécurité Garantie",
      description: "Vérifications juridiques complètes et assurance anti-fraude."
    },
    {
      icon: Lock,
      title: "Smart Contracts",
      description: "Contrats automatisés qui exécutent les transactions sans intermédiaire.",
      isNew: true
    },
    {
      icon: TrendingUp,
      title: "ROI Transparent",
      description: "Rendements prévisibles avec reporting détaillé."
    },
    {
      icon: Coins,
      title: "Escrow Décentralisé",
      description: "Fonds sécurisés par blockchain avec libération automatique.",
      isNew: true
    },
    {
      icon: Clock,
      title: "Suivi Temps Réel",
      description: "Dashboard en ligne avec mises à jour continues."
    }
  ];

  const investmentTypes = [
    {
      title: "Résidentiel",
      roi: "12-15%",
      description: "Appartements et villas dans les zones en développement",
      minInvest: "15M FCFA"
    },
    {
      title: "Commercial",
      roi: "18-22%",
      description: "Bureaux et commerces dans les centres d'affaires",
      minInvest: "25M FCFA"
    },
    {
      title: "Terrain",
      roi: "20-30%",
      description: "Parcelles dans les zones d'extension urbaine",
      minInvest: "8M FCFA"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pt-24">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-green-100 text-green-700">
            🌍 Investissement Diaspora
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Investissez dans l'Immobilier
            <span className="block text-green-600">Sénégalais Depuis l'Étranger</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Construisez votre patrimoine immobilier au Sénégal avec des investissements 
            sécurisés et rentables, adaptés à la diaspora.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 bg-green-600 hover:bg-green-700">
              Voir les Opportunités
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              <Phone className="mr-2 h-5 w-5" />
              Consultation Gratuite
            </Button>
          </div>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow relative">
              {benefit.isNew && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 animate-pulse">
                    🆕 Nouveau
                  </Badge>
                </div>
              )}
              <CardContent className="p-6">
                <div className={`w-12 h-12 ${benefit.isNew ? 'bg-gradient-to-r from-yellow-100 to-orange-100' : 'bg-green-100'} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <benefit.icon className={`h-6 w-6 ${benefit.isNew ? 'text-orange-600' : 'text-green-600'}`} />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Section Blockchain Innovation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white rounded-3xl p-8 md:p-12">
            <div className="text-center mb-12">
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 mb-4">
                🚀 Innovation Blockchain
              </Badge>
              <h2 className="text-4xl font-bold mb-4">
                Investissement <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Blockchain</span>
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Révolutionnez vos investissements diaspora avec notre technologie blockchain de pointe
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <Database className="w-12 h-12 text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">NFT Propriétés</h3>
                <p className="text-blue-100 mb-4">Chaque investissement devient un NFT unique, prouvant votre propriété sur la blockchain.</p>
                <ul className="space-y-2 text-sm text-blue-200">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Propriété vérifiable 24/7</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Transfert mondial instantané</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Valeur certifiée blockchain</li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <Lock className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Smart Contracts</h3>
                <p className="text-blue-100 mb-4">Investissements automatisés avec contrats intelligents qui s'exécutent seuls.</p>
                <ul className="space-y-2 text-sm text-blue-200">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Pas d'intermédiaires</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Exécution automatique</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Transparence totale</li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <Coins className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Revenus Automatisés</h3>
                <p className="text-blue-100 mb-4">Recevez vos revenus locatifs automatiquement via blockchain, partout dans le monde.</p>
                <ul className="space-y-2 text-sm text-blue-200">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Paiements instantanés</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Frais réduits 90%</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Conversion auto crypto/fiat</li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0">
                <Link to="/blockchain" className="flex items-center">
                  Découvrir la Blockchain
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Investment Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Types d'Investissements</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {investmentTypes.map((type, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{type.title}</CardTitle>
                    <Badge className="bg-green-100 text-green-700">
                      {type.roi}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{type.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Min. {type.minInvest}</span>
                    <Button size="sm" variant="outline">
                      En Savoir Plus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm p-8 mb-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Nos Résultats</h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">500M+</div>
              <div className="text-gray-600">FCFA Investis</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">150+</div>
              <div className="text-gray-600">Projets Réalisés</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">18.5%</div>
              <div className="text-gray-600">ROI Moyen</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Client</div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8">
            <h2 className="text-2xl font-bold mb-4">Commencez Votre Investissement</h2>
            <p className="mb-6 opacity-90">
              Rejoignez des centaines d'investisseurs diaspora qui nous font confiance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Voir le Portefeuille
                <BarChart3 className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                Consultation Gratuite
                <Phone className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DiasporaInvestmentPage;
