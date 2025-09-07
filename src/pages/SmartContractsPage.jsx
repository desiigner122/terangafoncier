import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Shield, 
  Zap, 
  CheckCircle,
  ArrowRight,
  Award,
  Clock,
  DollarSign,
  Users,
  Code,
  Lock,
  Globe
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet-async';

const SmartContractsPage = () => {
  const contractTypes = [
    {
      icon: DollarSign,
      title: "Contrats de Vente",
      description: "Automatisation complète du processus de vente avec libération échelonnée des fonds",
      features: ["Dépôt de garantie automatique", "Conditions suspensives", "Transfert de propriété instantané"]
    },
    {
      icon: Clock,
      title: "Contrats de Location",
      description: "Gestion automatisée des baux avec prélèvements et charges",
      features: ["Loyers automatiques", "Gestion des cautions", "Renouvellement auto"]
    },
    {
      icon: Users,
      title: "Copropriété",
      description: "Gouvernance transparente et votes automatisés pour les copropriétés",
      features: ["Votes décentralisés", "Charges communes", "Travaux partagés"]
    },
    {
      icon: Award,
      title: "Investissement Fractionné",
      description: "Permettez l'investissement collaboratif sur vos biens immobiliers",
      features: ["Parts tokenisées", "Revenus distribués", "Liquidité améliorée"]
    }
  ];

  const advantages = [
    {
      icon: Shield,
      title: "Sécurité Maximale",
      description: "Code audité par des experts en cybersécurité et blockchain"
    },
    {
      icon: Zap,
      title: "Exécution Automatique",
      description: "Plus besoin d'intermédiaires, le contrat s'exécute automatiquement"
    },
    {
      icon: Globe,
      title: "Transparence Totale",
      description: "Toutes les conditions sont visibles et vérifiables par tous"
    },
    {
      icon: DollarSign,
      title: "Coûts Réduits",
      description: "Élimination des frais d'intermédiaires et de gestion manuelle"
    }
  ];

  const technicalSpecs = [
    { label: "Langage", value: "Solidity 0.8+", description: "Dernière version sécurisée" },
    { label: "Réseau", value: "Polygon", description: "Frais réduits, rapidité" },
    { label: "Audit", value: "Certifié", description: "Vérifié par des experts" },
    { label: "Gas Optimisé", value: "< 0.01$", description: "Transactions économiques" }
  ];

  const codeExample = `
// Exemple simplifié de Smart Contract Vente
contract PropertySale {
    address public seller;
    address public buyer;
    uint256 public price;
    uint256 public deposit;
    bool public contractSigned;
    
    function signContract() external payable {
        require(msg.value == deposit, "Deposit required");
        contractSigned = true;
        // Logique de vérification automatique
    }
    
    function releasePayment() external {
        require(contractSigned, "Contract not signed");
        // Transfert automatique des fonds
        payable(seller).transfer(price);
    }
}`;

  return (
    <>
      <Helmet>
        <title>Smart Contracts Immobiliers | Teranga Foncier</title>
        <meta name="description" content="Contrats intelligents pour l'immobilier. Automatisation, sécurité maximale, transparence totale. Révolutionnez vos transactions." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Hero Section */}
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white mb-6">
                <Code className="w-4 h-4 mr-2" />
                Technologie Avancée
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Smart Contracts
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Contrats intelligents qui automatisent et sécurisent toutes vos transactions immobilières. 
                Fini les intermédiaires, place à l'efficacité.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  Créer un Contrat
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline">
                  Voir le Code
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contract Types */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-6">Types de Smart Contracts</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Des contrats intelligents adaptés à tous vos besoins immobiliers
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {contractTypes.map((type, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <type.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-3">{type.title}</h3>
                          <p className="text-gray-600 mb-4">{type.description}</p>
                          <ul className="space-y-2">
                            {type.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Advantages */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Avantages des Smart Contracts</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Révolutionnez votre approche des transactions immobilières
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {advantages.map((advantage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <advantage.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{advantage.title}</h3>
                  <p className="text-gray-600">{advantage.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Specs */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Spécifications Techniques</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Une technologie de pointe pour une sécurité maximale
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {technicalSpecs.map((spec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">{spec.label}</h3>
                      <p className="text-2xl font-bold text-indigo-600 mb-2">{spec.value}</p>
                      <p className="text-sm text-gray-500">{spec.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Code Example */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gray-900 rounded-xl p-6 text-green-400 font-mono text-sm overflow-x-auto"
            >
              <pre>{codeExample}</pre>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Prêt à Automatiser Vos Contrats ?
              </h2>
              <p className="text-xl text-indigo-100 mb-8">
                Rejoignez l'avenir des transactions immobilières intelligentes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                  Créer Mon Premier Contrat
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600">
                  Documentation Technique
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SmartContractsPage;
