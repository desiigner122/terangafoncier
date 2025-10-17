import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Database, 
  Lock, 
  Coins, 
  FileText, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Globe,
  Users,
  Zap,
  Eye,
  Award,
  Target
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';

const BlockchainSolutionsPage = () => {
  const blockchainFeatures = [
    {
      icon: FileText,
      title: "NFT Propriétés",
      description: "Chaque propriété est tokenisée en NFT unique sur blockchain",
      benefits: [
        "Propriété 100% vérifiable",
        "Transfert instantané et sécurisé",
        "Valeur certifiée par smart contract",
        "Historique complet immutable"
      ],
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Lock,
      title: "Smart Contracts",
      description: "Contrats intelligents qui automatisent les transactions",
      benefits: [
        "Exécution automatique des conditions",
        "Zéro risque de manipulation",
        "Transparence totale des termes",
        "Coûts réduits sans intermédiaires"
      ],
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Coins,
      title: "Escrow Décentralisé",
      description: "Système de séquestre intelligent qui protège toutes les parties",
      benefits: [
        "Fonds sécurisés jusqu'à livraison",
        "Libération automatique des paiements",
        "Protection contre les litiges",
        "Confiance mutuelle garantie"
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Database,
      title: "Traçabilité Complète",
      description: "Historique complet et immutable de chaque transaction",
      benefits: [
        "Suivi temps réel des transactions",
        "Audit trail permanent",
        "Preuves légales incontestables",
        "Conformité réglementaire"
      ],
      color: "from-blue-500 to-cyan-500"
    }
  ];

  const technicalSpecs = [
    {
      title: "Réseau Blockchain",
      value: "Polygon (Matic)",
      description: "Frais réduits, transactions rapides"
    },
    {
      title: "Type de Token",
      value: "ERC-721 NFT",
      description: "Standard universel, compatible partout"
    },
    {
      title: "Temps de Transaction",
      value: "< 30 secondes",
      description: "Confirmation quasi-instantanée"
    },
    {
      title: "Coût de Transaction",
      value: "< 0.01 USD",
      description: "Frais minimes pour tous"
    },
    {
      title: "Sécurité",
      value: "Niveau Bancaire",
      description: "Chiffrement AES-256, multi-signature"
    },
    {
      title: "Audit",
      value: "CertiK Verified",
      description: "Smart contracts audités par experts"
    }
  ];

  const useCases = [
    {
      title: "Achat de Terrain",
      description: "Processus d'achat entièrement sécurisé par blockchain",
      steps: [
        "Sélection du terrain avec visite virtuelle",
        "Création automatique du smart contract",
        "Dépôt de garantie en escrow décentralisé",
        "Vérification notariale sur blockchain",
        "Émission automatique du NFT propriété",
        "Transfert de propriété instantané"
      ],
      duration: "24-48h",
      icon: Target
    },
    {
      title: "Investissement Diaspora",
      description: "Solution parfaite pour les Sénégalais à l'étranger",
      steps: [
        "KYC digital depuis l'étranger",
        "Paiement en crypto ou devise locale",
        "Smart contract avec conditions flexibles",
        "Suivi construction via blockchain",
        "Revenus locatifs automatisés",
        "Revente facilitée sur marketplace"
      ],
      duration: "Temps réel",
      icon: Globe
    },
    {
      title: "Promotion Immobilière",
      description: "Outils avancés pour les promoteurs",
      steps: [
        "Tokenisation du projet immobilier",
        "Financement participatif décentralisé",
        "Smart contracts avec étapes automatisées",
        "Distribution automatique des revenus",
        "Gestion transparente des fonds",
        "Reporting automatisé aux investisseurs"
      ],
      duration: "Continue",
      icon: TrendingUp
    }
  ];

  const comparison = [
    {
      feature: "Vitesse de Transaction",
      traditional: "2-6 mois",
      blockchain: "24-48 heures",
      improvement: "99% plus rapide"
    },
    {
      feature: "Coûts de Transaction",
      traditional: "5-8% du prix",
      blockchain: "0.5-1% du prix",
      improvement: "85% moins cher"
    },
    {
      feature: "Sécurité",
      traditional: "Basée sur confiance",
      blockchain: "Cryptographiquement garantie",
      improvement: "Sécurité absolue"
    },
    {
      feature: "Transparence",
      traditional: "Limitée, opaque",
      blockchain: "Totale, vérifiable",
      improvement: "100% transparent"
    },
    {
      feature: "Accessibilité",
      traditional: "Bureaux physiques",
      blockchain: "Mondiale, 24/7",
      improvement: "Accès universel"
    }
  ];

  return (
    <>
      <SEO
        title="Solutions Blockchain - Révolution de l'Immobilier Sénégalais par la Technologie"
        description="Découvrez les solutions blockchain pour le foncier au Sénégal. NFT propriétés, smart contracts, escrow décentralisé et tokenisation immobilière pour des transactions sécurisées."
        keywords="blockchain immobilier, nft propriété, smart contract foncier, escrow blockchain, immobilier sénégal"
        canonicalUrl="https://www.terangafoncier.sn/blockchain-solutions"
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 mb-6 text-lg px-4 py-2">
                🚀 Innovation Blockchain
              </Badge>
              <h1 className="text-6xl font-bold mb-6">
                La <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Blockchain</span><br />
                Révolutionne l'Immobilier
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Première plateforme foncière au Sénégal à intégrer pleinement la technologie blockchain 
                pour des transactions immobilières sécurisées, transparentes et instantanées.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0">
                  <Link to="/register" className="flex items-center">
                    Commencer Maintenant
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Link to="/demo" className="flex items-center">
                    Voir la Démo
                    <Eye className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Technologies Blockchain Intégrées
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Découvrez comment chaque aspect de notre plateforme utilise la blockchain pour votre sécurité
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {blockchainFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="h-full p-8 hover:shadow-xl transition-all duration-300 border-0 bg-white">
                    <CardContent className="p-0">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} p-4 mb-6`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mb-6 text-lg">
                        {feature.description}
                      </p>
                      <ul className="space-y-3">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center text-gray-700">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Spécifications Techniques
              </h2>
              <p className="text-xl text-gray-600">
                Infrastructure blockchain de niveau entreprise
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {technicalSpecs.map((spec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-center"
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow border-2 border-gray-100 hover:border-blue-200">
                    <CardContent className="p-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {spec.title}
                      </h3>
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {spec.value}
                      </div>
                      <p className="text-gray-600">
                        {spec.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Cas d'Usage Blockchain
              </h2>
              <p className="text-xl text-gray-600">
                Comment la blockchain simplifie vos transactions immobilières
              </p>
            </motion.div>

            <div className="space-y-12">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="p-8 bg-white border-0 shadow-lg">
                    <CardContent className="p-0">
                      <div className="flex items-center mb-6">
                        <div className="bg-blue-100 p-4 rounded-full mr-6">
                          <useCase.icon className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {useCase.title}
                          </h3>
                          <p className="text-gray-600 text-lg">
                            {useCase.description}
                          </p>
                        </div>
                        <div className="ml-auto text-right">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Durée: {useCase.duration}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {useCase.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                              {stepIndex + 1}
                            </div>
                            <span className="text-gray-700">{step}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Blockchain vs Méthodes Traditionnelles
              </h2>
              <p className="text-xl text-gray-600">
                Voyez la différence révolutionnaire
              </p>
            </motion.div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-6 text-lg font-semibold text-gray-900">Critère</th>
                    <th className="text-center py-4 px-6 text-lg font-semibold text-red-600">Méthode Traditionnelle</th>
                    <th className="text-center py-4 px-6 text-lg font-semibold text-green-600">Blockchain Teranga</th>
                    <th className="text-center py-4 px-6 text-lg font-semibold text-blue-600">Amélioration</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((item, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-6 font-semibold text-gray-900">{item.feature}</td>
                      <td className="py-4 px-6 text-center text-red-600">{item.traditional}</td>
                      <td className="py-4 px-6 text-center text-green-600 font-semibold">{item.blockchain}</td>
                      <td className="py-4 px-6 text-center">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          {item.improvement}
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Prêt à Révolutionner Vos Transactions ?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Rejoignez les milliers de Sénégalais qui ont déjà adopté la blockchain pour leurs investissements immobiliers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link to="/register" className="flex items-center">
                    Créer Mon Compte
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link to="/contact" className="flex items-center">
                    Nous Contacter
                    <Users className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlockchainSolutionsPage;
