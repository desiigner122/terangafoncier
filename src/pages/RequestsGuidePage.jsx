import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Hammer,
  FileText,
  Shield,
  Database,
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Zap,
  Search,
  Heart,
  Calendar,
  MapPin,
  Camera,
  CreditCard,
  Smartphone,
  Globe,
  Target,
  Award,
  Sparkles,
  Building2,
  Send,
  Star,
  Eye,
  Blocks,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const RequestsGuidePage = () => {
  const navigate = useNavigate();

  const requestFeatures = [
    {
      icon: Search,
      title: "Matching Intelligent",
      description: "Notre IA trouve automatiquement les promoteurs les plus adaptés à votre projet selon vos critères."
    },
    {
      icon: Shield,
      title: "Sécurité Blockchain",
      description: "Toutes les transactions et accords sont sécurisés par la blockchain pour une transparence totale."
    },
    {
      icon: Star,
      title: "Promoteurs Vérifiés",
      description: "Tous nos promoteurs sont certifiés blockchain avec historique de réalisations vérifiables."
    },
    {
      icon: Clock,
      title: "Suivi Temps Réel",
      description: "Suivez l'avancement de votre projet avec photos quotidiennes et rapports automatisés."
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Soumission de Demande",
      description: "Décrivez votre projet avec tous les détails : localisation, budget, type de construction, délais souhaités.",
      icon: FileText,
      color: "bg-blue-500"
    },
    {
      step: "02", 
      title: "Analyse IA & Blockchain",
      description: "Notre IA analyse votre demande et la inscrit sur blockchain pour garantir son authenticité.",
      icon: Brain,
      color: "bg-green-500"
    },
    {
      step: "03",
      title: "Matching Promoteurs",
      description: "Nous identifions et contactons les meilleurs promoteurs correspondant à vos critères.",
      icon: Users,
      color: "bg-purple-500"
    },
    {
      step: "04",
      title: "Propositions & Négociation",
      description: "Recevez plusieurs propositions détaillées et négociez directement avec les promoteurs.",
      icon: TrendingUp,
      color: "bg-yellow-500"
    },
    {
      step: "05",
      title: "Signature & Suivi",
      description: "Signature des contrats smart et suivi automatisé de la construction via blockchain.",
      icon: Award,
      color: "bg-red-500"
    }
  ];

  const benefits = [
    {
      icon: Target,
      title: "Matching Précis",
      description: "98% de satisfaction grâce à notre algorithme de matching avancé"
    },
    {
      icon: Clock,
      title: "Gain de Temps",
      description: "Réduction de 70% du temps de recherche de promoteurs qualifiés"
    },
    {
      icon: CreditCard,
      title: "Meilleurs Prix",
      description: "Économies moyennes de 15% grâce à la mise en concurrence"
    },
    {
      icon: Shield,
      title: "Sécurité Totale",
      description: "Contrats sécurisés et paiements automatisés par blockchain"
    }
  ];

  const requestTypes = [
    {
      title: "Villa Individuelle",
      description: "Construction de maisons individuelles personnalisées",
      icon: Building2,
      examples: ["Villa moderne", "Maison traditionnelle", "Éco-construction"],
      budget: "50M - 200M FCFA"
    },
    {
      title: "Immeuble Résidentiel",
      description: "Projets d'appartements et résidences collectives",
      icon: Building2,
      examples: ["Immeuble R+4", "Résidence sécurisée", "Logements sociaux"],
      budget: "200M - 2Md FCFA"
    },
    {
      title: "Commercial & Bureaux",
      description: "Espaces commerciaux et bureaux modernes",
      icon: Building2,
      examples: ["Centre commercial", "Immeuble bureaux", "Entrepôt"],
      budget: "100M - 5Md FCFA"
    },
    {
      title: "Projets Spéciaux",
      description: "Constructions spécialisées et innovantes",
      icon: Sparkles,
      examples: ["Hôtel", "Clinique", "École"], 
      budget: "300M - 10Md FCFA"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Helmet>
        <title>Guide des Demandes - Construction Blockchain | Teranga Foncier</title>
        <meta name="description" content="Découvrez comment soumettre votre demande de construction et être mis en relation avec les meilleurs promoteurs via notre plateforme blockchain." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-900 via-blue-900 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <div className="bg-yellow-500 p-4 rounded-full">
                <Hammer className="w-12 h-12 text-black" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Demandes de <span className="text-yellow-400">Construction</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Trouvez le promoteur idéal pour votre projet grâce à notre plateforme blockchain intelligente
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
                onClick={() => navigate('/promoter-requests')}
              >
                <Send className="w-5 h-5 mr-2" />
                Faire une Demande
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-purple-900"
              >
                <Eye className="w-5 h-5 mr-2" />
                Voir les Demandes
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Request Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi Utiliser Notre Plateforme ?
            </h2>
            <p className="text-xl text-gray-600">
              Une solution innovante pour connecter clients et promoteurs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {requestFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-purple-600" />
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

      {/* Types of Requests */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Types de Demandes
            </h2>
            <p className="text-xl text-gray-600">
              Nous couvrons tous types de projets de construction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {requestTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <type.icon className="w-8 h-8 text-purple-600 mr-3" />
                      <CardTitle className="text-lg">{type.title}</CardTitle>
                    </div>
                    <p className="text-gray-600">{type.description}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Exemples:</h4>
                        <div className="flex flex-wrap gap-1">
                          {type.examples.map((example, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {example}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="border-t pt-3">
                        <p className="text-sm font-semibold text-purple-600">{type.budget}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comment ça Marche ?
            </h2>
            <p className="text-xl text-gray-600">
              Le processus simplifié de demande de construction
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
                    <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-8 rounded-lg">
                      <div className="text-center">
                        <div className={`${step.color} text-white p-6 rounded-full inline-flex mb-4`}>
                          <step.icon className="w-12 h-12" />
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900">{step.step}</h4>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-l from-blue-100 to-purple-100 p-8 rounded-lg">
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Les Avantages Clients
            </h2>
            <p className="text-xl text-gray-600">
              Des résultats concrets et mesurables pour vos projets
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
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
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

      {/* Technology & Security */}
      <section className="py-16 bg-gradient-to-r from-purple-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Sécurité & Technologie
            </h2>
            <p className="text-xl opacity-90">
              Une plateforme de pointe pour vos demandes de construction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Blocks className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-xl font-bold mb-2">Blockchain Sécurisée</h3>
              <p className="opacity-90">Toutes les demandes et contrats sont sécurisés sur blockchain</p>
            </div>
            <div className="text-center">
              <Brain className="w-16 h-16 mx-auto mb-4 text-green-400" />
              <h3 className="text-xl font-bold mb-2">IA de Matching</h3>
              <p className="opacity-90">Algorithmes avancés pour trouver le promoteur parfait</p>
            </div>
            <div className="text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-bold mb-2">Paiements Sécurisés</h3>
              <p className="opacity-90">Smart contracts pour des transactions automatisées</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-yellow-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-black mb-6">
            Prêt à Lancer Votre Projet ?
          </h2>
          <p className="text-xl text-black mb-8 opacity-90">
            Soumettez votre demande et trouvez le promoteur idéal en quelques clics
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-black text-yellow-500 hover:bg-gray-800"
              onClick={() => navigate('/promoter-requests')}
            >
              <Send className="w-5 h-5 mr-2" />
              Faire une Demande
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-black text-black hover:bg-black hover:text-yellow-500"
              onClick={() => navigate('/promoters-projects')}
            >
              <Building2 className="w-5 h-5 mr-2" />
              Voir les Projets
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RequestsGuidePage;
