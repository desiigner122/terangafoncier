import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Ruler, 
  Satellite,
  Camera,
  Shield,
  Award,
  CheckCircle,
  ArrowRight,
  Zap,
  Globe,
  Target,
  Clock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet-async';

const GeometresPage = () => {
  const geometreServices = [
    {
      icon: MapPin,
      title: "Géolocalisation GPS Précise",
      description: "Relevés topographiques avec GPS différentiel pour une précision optimale",
      features: ["GPS RTK centimétrique", "Coordonnées UTM 28N", "Géoréférencement précis"]
    },
    {
      icon: Ruler,
      title: "Bornage et Délimitation",
      description: "Matérialisation des limites de propriétés selon les normes sénégalaises",
      features: ["Bornes en béton", "Plans de bornage", "Procès-verbaux officiels"]
    },
    {
      icon: Camera,
      title: "Levés Topographiques",
      description: "Mesures terrain avec théodolite et station totale moderne",
      features: ["Station totale", "Carnet de terrain", "Plans topographiques"]
    },
    {
      icon: Shield,
      title: "Certification Numérique",
      description: "Tous vos relevés certifiés et sécurisés numériquement",
      features: ["Signature numérique", "Horodatage sécurisé", "Archivage digital"]
    }
  ];

  const tools = [
    {
      name: "Station Totale Leica",
      description: "Équipement topographique de précision pour levés terrain",
      specs: ["Précision ±2mm", "Portée 3km", "Laser infrarouge"]
    },
    {
      name: "GPS RTK Trimble",
      description: "Récepteur GPS haute précision pour géoréférencement",
      specs: ["Précision centimétrique", "WAAS/SBAS", "Temps réel"]
    },
    {
      name: "AutoCAD Sénégal",
      description: "Logiciel de DAO adapté aux normes cadastrales sénégalaises",
      specs: ["Plans conformes", "Bibliothèques locales", "Export DWG/PDF"]
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Efficacité Terrain",
      description: "Réduisez vos délais d'intervention de 50% avec nos outils"
    },
    {
      icon: Target,
      title: "Conformité Légale",
      description: "Tous vos travaux respectent la réglementation sénégalaise"
    },
    {
      icon: Globe,
      title: "Couverture Nationale",
      description: "Intervention sur tout le territoire sénégalais"
    },
    {
      icon: Shield,
      title: "Validation DDHPJ",
      description: "Plans et documents conformes aux exigences DDHPJ"
    }
  ];

  const pricingTiers = [
    {
      name: "Starter",
      price: "50,000",
      period: "/mission",
      features: [
        "Bornage simple",
        "Plan topographique",
        "Procès-verbal",
        "Géoréférencement GPS"
      ]
    },
    {
      name: "Professional",
      price: "150,000",
      period: "/mission",
      features: [
        "Levé topographique complet",
        "Plan cadastral détaillé",
        "Coordonnées UTM précises",
        "Rapport technique",
        "Certification numérique"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "500,000",
      period: "/projet",
      features: [
        "Projet d'aménagement complet",
        "Équipe de géomètres dédiée",
        "Formation équipes",
        "Support technique continu",
        "Plans directeurs urbains"
      ]
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Reconnaissance Terrain",
      description: "Visite préliminaire et définition du périmètre d'intervention"
    },
    {
      step: "02",
      title: "Levés Topographiques",
      description: "Mesures terrain avec station totale et GPS"
    },
    {
      step: "03",
      title: "Traitement Bureau",
      description: "Calculs, dessins DAO et préparation des plans"
    },
    {
      step: "04",
      title: "Livraison Certifiée",
      description: "Remise des documents avec certification numérique"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Géomètres - Solutions Technologiques Avancées | Teranga Foncier</title>
        <meta name="description" content="Outils révolutionnaires pour géomètres : drones, LiDAR, IA, blockchain. Précision centimétrique, certification légale, gain de temps." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Hero Section */}
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white mb-6">
                <MapPin className="w-4 h-4 mr-2" />
                Services Professionnels
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Géomètres Sénégal
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Services topographiques professionnels conformes aux normes sénégalaises : 
                bornage, levés terrain, plans cadastraux et certification numérique.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  Demander un Devis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline">
                  Nos Références
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-6">Services Révolutionnaires</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                La technologie au service de la précision géométrique
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {geometreServices.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <service.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                          <p className="text-gray-600 mb-4">{service.description}</p>
                          <ul className="space-y-2">
                            {service.features.map((feature, idx) => (
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

        {/* Tools Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Outils Professionnels</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Équipements de dernière génération pour une précision maximale
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {tools.map((tool, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="h-full text-center">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3">{tool.name}</h3>
                      <p className="text-gray-600 mb-4">{tool.description}</p>
                      <ul className="space-y-2">
                        {tool.specs.map((spec, idx) => (
                          <li key={idx} className="text-sm text-gray-600">
                            • {spec}
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

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Avantages Concurrentiels</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Pourquoi choisir nos solutions technologiques
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Comment Ça Marche</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Un processus simplifié pour des résultats professionnels
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
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Tarifs Transparents</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choisissez l'offre qui correspond à vos besoins
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {pricingTiers.map((tier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className={`h-full ${tier.popular ? 'border-green-500 shadow-lg scale-105' : ''}`}>
                    <CardContent className="p-6 text-center">
                      {tier.popular && (
                        <Badge className="bg-green-500 text-white mb-4">
                          Le Plus Populaire
                        </Badge>
                      )}
                      <h3 className="text-2xl font-bold mb-4">{tier.name}</h3>
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-green-600">{tier.price}</span>
                        <span className="text-gray-600"> FCFA{tier.period}</span>
                      </div>
                      <ul className="space-y-3 mb-6">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className={`w-full ${tier.popular ? 'bg-green-600 hover:bg-green-700' : ''}`}
                        variant={tier.popular ? 'default' : 'outline'}
                      >
                        Commencer
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Prêt à Révolutionner Vos Relevés ?
              </h2>
              <p className="text-xl text-green-100 mb-8">
                Rejoignez les géomètres qui ont choisi l'innovation
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  Essai Gratuit 14 Jours
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  Demander une Démo
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default GeometresPage;
