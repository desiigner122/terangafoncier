import React from 'react';
import { motion } from 'framer-motion';
import { 
  Coins, 
  Shield, 
  Database, 
  CheckCircle,
  ArrowRight,
  Award,
  Globe,
  Zap,
  FileText,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const NFTPropertiesPage = () => {
  const nftBenefits = [
    {
      icon: Shield,
      title: "Propriété Certifiée",
      description: "Votre titre de propriété est gravé dans la blockchain de manière permanente et inaltérable."
    },
    {
      icon: Database,
      title: "Historique Complet",
      description: "Chaque transaction, modification ou transfert est enregistré pour une traçabilité totale."
    },
    {
      icon: Globe,
      title: "Reconnaissance Mondiale",
      description: "Votre NFT propriété est reconnu partout dans le monde grâce aux standards ERC-721."
    },
    {
      icon: Zap,
      title: "Transfert Instantané",
      description: "Vendez ou transférez votre propriété en quelques minutes, pas en semaines."
    }
  ];

  const nftFeatures = [
    {
      title: "Métadonnées Riches",
      description: "Photos HD, plans, documents légaux, géolocalisation précise",
      icon: FileText
    },
    {
      title: "Valuation Automatique",
      description: "Prix mis à jour en temps réel grâce à l'IA et aux données de marché",
      icon: TrendingUp
    },
    {
      title: "Smart Contracts Intégrés",
      description: "Conditions de vente, loyer ou location automatiquement gérées",
      icon: Coins
    },
    {
      title: "Fractionnement Possible",
      description: "Divisez votre propriété en parts pour l'investissement collaboratif",
      icon: Award
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Vérification Propriété",
      description: "Nos experts vérifient vos documents et la légalité de votre bien"
    },
    {
      step: "02", 
      title: "Création NFT",
      description: "Génération automatique de votre NFT avec toutes les métadonnées"
    },
    {
      step: "03",
      title: "Déploiement Blockchain",
      description: "Votre NFT est publié sur la blockchain Polygon pour des frais réduits"
    },
    {
      step: "04",
      title: "Certification",
      description: "Réception de votre certificat NFT et accès à votre wallet"
    }
  ];

  return (
    <>
      <Helmet>
        <title>NFT Propriétés - Tokenisation Immobilière | Teranga Foncier</title>
        <meta name="description" content="Transformez vos biens immobiliers en NFT. Propriété certifiée blockchain, transferts instantanés, reconnaissance mondiale." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
        {/* Hero Section */}
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white mb-6">
                <Coins className="w-4 h-4 mr-2" />
                Révolution NFT
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  NFT Propriétés
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transformez vos biens immobiliers en NFT uniques sur blockchain. 
                Propriété certifiée, transferts instantanés, reconnaissance mondiale.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Créer mon NFT
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline">
                  Voir la démo
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-6">Pourquoi Choisir les NFT Propriétés ?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                La tokenisation de vos biens immobiliers vous offre des avantages inédits
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {nftBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <benefit.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Fonctionnalités Avancées</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Nos NFT propriétés incluent toutes les données nécessaires pour une gestion complète
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {nftFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Comment Ça Marche ?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Un processus simple et sécurisé pour tokeniser vos biens
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Prêt à Tokeniser Vos Propriétés ?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Rejoignez la révolution de l'immobilier décentralisé
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  Commencer Maintenant
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                  Contacter un Expert
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default NFTPropertiesPage;
