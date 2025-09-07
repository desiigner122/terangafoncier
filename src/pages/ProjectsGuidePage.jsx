import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Blocks,
  Shield,
  Database,
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Zap,
  Eye,
  Heart,
  Calendar,
  MapPin,
  Camera,
  FileText,
  CreditCard,
  Smartphone,
  Globe,
  Target,
  Award,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ProjectsGuidePage = () => {
  const navigate = useNavigate();

  const blockchainFeatures = [
    {
      icon: Shield,
      title: "Sécurité Maximale",
      description: "Chaque projet est sécurisé par la blockchain, garantissant l'immutabilité des informations et la transparence totale."
    },
    {
      icon: Database,
      title: "Traçabilité Complète",
      description: "Suivi en temps réel de chaque étape du projet, de la conception à la livraison, avec horodatage blockchain."
    },
    {
      icon: Blocks,
      title: "Smart Contracts",
      description: "Contrats intelligents automatisant les paiements et les validations selon l'avancement du projet."
    },
    {
      icon: Eye,
      title: "Transparence Totale",
      description: "Accès public aux informations du projet : budget, planning, avancement, qualité des matériaux."
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Inscription du Projet",
      description: "Le promoteur inscrit son projet sur la blockchain avec tous les détails techniques et financiers.",
      icon: FileText,
      color: "bg-blue-500"
    },
    {
      step: "02", 
      title: "Validation Blockchain",
      description: "Le projet est validé et horodaté sur la blockchain, créant un certificat d'authenticité immutable.",
      icon: Shield,
      color: "bg-green-500"
    },
    {
      step: "03",
      title: "Suivi en Temps Réel",
      description: "Les clients peuvent suivre l'avancement avec photos quotidiennes, rapports et validations blockchain.",
      icon: Camera,
      color: "bg-purple-500"
    },
    {
      step: "04",
      title: "Paiements Automatisés",
      description: "Les smart contracts déclenchent automatiquement les paiements selon les jalons validés.",
      icon: CreditCard,
      color: "bg-yellow-500"
    },
    {
      step: "05",
      title: "Livraison Certifiée",
      description: "La livraison est certifiée sur blockchain avec tous les documents et garanties.",
      icon: Award,
      color: "bg-red-500"
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "ROI Optimisé",
      description: "Jusqu'à 25% d'économies grâce à l'automatisation et la réduction des intermédiaires"
    },
    {
      icon: Clock,
      title: "Délais Respectés",
      description: "97% des projets blockchain livrés dans les délais grâce au suivi automatisé"
    },
    {
      icon: Users,
      title: "Confiance Renforcée",
      description: "Satisfaction client de 95% grâce à la transparence et la traçabilité"
    },
    {
      icon: Zap,
      title: "Innovation Technologique",
      description: "Technologies de pointe : IoT, IA, blockchain pour une construction 4.0"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Helmet>
        <title>Guide des Projets Blockchain - Construction Intelligente | Teranga Foncier</title>
        <meta name="description" content="Découvrez comment les projets de construction blockchain révolutionnent l'immobilier avec transparence, sécurité et innovation technologique." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <div className="bg-yellow-500 p-4 rounded-full">
                <Building2 className="w-12 h-12 text-black" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Projets <span className="text-yellow-400">Blockchain</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              La révolution de la construction immobilière : transparence, sécurité et innovation au service de vos projets
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
                onClick={() => navigate('/promoters-projects')}
              >
                <Eye className="w-5 h-5 mr-2" />
                Voir les Projets
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-900"
              >
                <FileText className="w-5 h-5 mr-2" />
                Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blockchain Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi Choisir la Blockchain ?
            </h2>
            <p className="text-xl text-gray-600">
              Une technologie révolutionnaire au service de la construction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {blockchainFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comment ça Marche ?
            </h2>
            <p className="text-xl text-gray-600">
              Le processus complet d'un projet blockchain de A à Z
            </p>
          </div>

          <div className="space-y-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} gap-8`}
              >
                <div className="flex-1">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className={`${step.color} text-white p-3 rounded-full mr-4`}>
                          <step.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-2">Étape {step.step}</Badge>
                          <h3 className="text-xl font-bold">{step.title}</h3>
                        </div>
                      </div>
                      <p className="text-gray-600">{step.description}</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="hidden lg:block">
                  <div className={`${step.color} text-white p-4 rounded-full`}>
                    <ArrowRight className="w-8 h-8" />
                  </div>
                </div>
                
                <div className="flex-1">
                  {index % 2 === 0 ? (
                    <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-8 rounded-lg">
                      <div className="text-center">
                        <div className={`${step.color} text-white p-6 rounded-full inline-flex mb-4`}>
                          <step.icon className="w-12 h-12" />
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900">{step.step}</h4>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-l from-purple-100 to-blue-100 p-8 rounded-lg">
                      <div className="text-center">
                        <div className={`${step.color} text-white p-6 rounded-full inline-flex mb-4`}>
                          <step.icon className="w-12 h-12" />
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900">{step.step}</h4>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Les Avantages Concrets
            </h2>
            <p className="text-xl text-gray-600">
              Des résultats mesurables et tangibles pour tous les acteurs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <CardContent className="p-6 text-center">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <benefit.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Technologies Utilisées
            </h2>
            <p className="text-xl opacity-90">
              Un écosystème technologique de pointe pour vos projets
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <Blocks className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <h3 className="font-bold">Blockchain</h3>
              <p className="text-sm opacity-80">Ethereum & Polygon</p>
            </div>
            <div>
              <Smartphone className="w-12 h-12 mx-auto mb-4 text-green-400" />
              <h3 className="font-bold">IoT</h3>
              <p className="text-sm opacity-80">Capteurs intelligents</p>
            </div>
            <div>
              <Globe className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <h3 className="font-bold">IA</h3>
              <p className="text-sm opacity-80">Machine Learning</p>
            </div>
            <div>
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="font-bold">AR/VR</h3>
              <p className="text-sm opacity-80">Réalité augmentée</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-yellow-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-black mb-6">
            Prêt à Révolutionner la Construction ?
          </h2>
          <p className="text-xl text-black mb-8 opacity-90">
            Découvrez les projets blockchain disponibles et investissez dans l'avenir
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-black text-yellow-500 hover:bg-gray-800"
              onClick={() => navigate('/promoters-projects')}
            >
              <Building2 className="w-5 h-5 mr-2" />
              Voir les Projets
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-black text-black hover:bg-black hover:text-yellow-500"
              onClick={() => navigate('/promoter-requests')}
            >
              <FileText className="w-5 h-5 mr-2" />
              Faire une Demande
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsGuidePage;
