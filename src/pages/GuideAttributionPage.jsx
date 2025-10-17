import React from 'react';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  FileText, 
  Users, 
  Clock,
  MapPin,
  DollarSign,
  AlertTriangle,
  Info,
  Download,
  ArrowRight,
  Building2,
  Scale,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const GuideAttributionPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const eligibilityCriteria = [
    {
      category: "Résidence",
      icon: <MapPin className="w-6 h-6" />,
      criteria: [
        "Résider dans la commune depuis au moins 2 ans",
        "Justificatif de domiciliation valide",
        "Attestation de résidence délivrée par la mairie"
      ]
    },
    {
      category: "Revenus",
      icon: <DollarSign className="w-6 h-6" />,
      criteria: [
        "Revenus mensuels inférieurs à 500,000 FCFA",
        "Bulletin de salaire des 3 derniers mois",
        "Attestation de revenus pour les indépendants"
      ]
    },
    {
      category: "Logement",
      icon: <Building2 className="w-6 h-6" />,
      criteria: [
        "Ne pas être propriétaire d'un autre terrain",
        "Première demande d'attribution",
        "Engagement de construction dans les 2 ans"
      ]
    },
    {
      category: "Famille",
      icon: <Users className="w-6 h-6" />,
      criteria: [
        "Priorité aux familles nombreuses (4+ personnes)",
        "Situation matrimoniale stable",
        "Acte de naissance des enfants"
      ]
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: "Préparation du dossier",
      description: "Rassemblez tous les documents requis",
      duration: "1-2 semaines",
      documents: [
        "Demande manuscrite timbrée",
        "Photocopie de la CNI",
        "Justificatifs de revenus",
        "Attestation de domiciliation",
        "Acte de naissance",
        "Certificat de mariage (si applicable)"
      ]
    },
    {
      step: 2,
      title: "Dépôt de la demande",
      description: "Soumettez votre dossier complet à la mairie",
      duration: "1 jour",
      documents: [
        "Dossier complet en 2 exemplaires",
        "Récépissé de dépôt",
        "Numéro de suivi attribué"
      ]
    },
    {
      step: 3,
      title: "Instruction du dossier",
      description: "Examen par la commission d'attribution",
      duration: "1-3 mois",
      documents: [
        "Vérification des critères",
        "Enquête de moralité",
        "Visite sur site si nécessaire"
      ]
    },
    {
      step: 4,
      title: "Décision de la commission",
      description: "Attribution ou rejet motivé",
      duration: "2-4 semaines",
      documents: [
        "Arrêté d'attribution",
        "Notification officielle",
        "Conditions d'occupation"
      ]
    },
    {
      step: 5,
      title: "Formalités finales",
      description: "Signature et prise de possession",
      duration: "1-2 semaines",
      documents: [
        "Contrat d'occupation",
        "Plan de bornage",
        "Autorisation de construire"
      ]
    }
  ];

  const typesTerrains = [
    {
      type: "Habitat Social",
      surface: "200-400m²",
      price: "Attribution gratuite",
      conditions: "Revenus modestes, première acquisition",
      availability: "Disponible"
    },
    {
      type: "Lotissement Économique",
      surface: "300-600m²",
      price: "Prix symbolique (100-500k FCFA)",
      conditions: "Activité économique, emploi local",
      availability: "Sur demande"
    },
    {
      type: "Zone Commerciale",
      surface: "500-1000m²",
      price: "Prix de marché réduit (-30%)",
      conditions: "Projet commercial viable, emplois créés",
      availability: "Limitée"
    }
  ];

  return (
    <>
      <SEO
        title="Guide Complet Attribution - Comment Obtenir un Terrain Communal"
        description="Guide complet pour l'attribution de terrains communaux au Sénégal. Critères d'éligibilité, processus d'attribution, documents requis, conseils et témoignages."
        keywords="attribution terrain communal, guide attribution, critères éligibilité, terrains sociaux sénégal"
        canonicalUrl="https://www.terangafoncier.sn/guide-attribution"
      />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">

        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Guide d'<span className="text-yellow-400">Attribution</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Tout ce que vous devez savoir pour obtenir un terrain communal
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <FileText className="w-4 h-4" />
                <span>Processus transparent</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Scale className="w-4 h-4" />
                <span>Critères équitables</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Shield className="w-4 h-4" />
                <span>Accompagnement complet</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Critères d'éligibilité */}
      <motion.section 
        className="py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Critères d'Éligibilité
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Vérifiez si vous remplissez les conditions pour bénéficier d'une attribution de terrain communal
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {eligibilityCriteria.map((category, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                        {category.icon}
                      </div>
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.criteria.map((criterion, critIndex) => (
                        <li key={critIndex} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{criterion}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Processus étape par étape */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Processus d'Attribution
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Suivez ces 5 étapes pour maximiser vos chances d'obtenir un terrain communal
            </p>
          </motion.div>

          <div className="space-y-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <Card className="overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                          {step.step}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{step.title}</h3>
                          <div className="flex items-center gap-2 text-blue-100">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{step.duration}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-blue-100">{step.description}</p>
                    </div>
                    
                    <div className="lg:w-2/3 p-8">
                      <h4 className="font-semibold text-gray-900 mb-4">Documents et actions requis :</h4>
                      <div className="grid gap-3">
                        {step.documents.map((doc, docIndex) => (
                          <div key={docIndex} className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-500" />
                            <span className="text-gray-700">{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Types de terrains */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Types de Terrains Disponibles
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Différentes catégories de terrains selon vos besoins et votre situation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {typesTerrains.map((terrain, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl text-center">{terrain.type}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Surface :</span>
                        <span className="font-medium">{terrain.surface}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Prix :</span>
                        <span className="font-medium text-green-600">{terrain.price}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Conditions :</span>
                        <p className="text-sm mt-1">{terrain.conditions}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <Badge 
                        className={terrain.availability === 'Disponible' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                      >
                        {terrain.availability}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Conseils pratiques */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Conseils Pratiques
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Maximisez vos chances de succès avec ces recommandations d'experts
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-6 h-6" />
                    À Faire
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Préparer un dossier complet et soigné</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Déposer votre demande le plus tôt possible</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Maintenir à jour vos justificatifs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Faire le suivi régulièrement</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Avoir un projet de construction précis</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-6 h-6" />
                    À Éviter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>Présenter des documents incomplets</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>Donner de fausses informations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>Attendre le dernier moment</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>Ignorer les relances de la mairie</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>Faire plusieurs demandes simultanées</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6">
              Prêt à faire votre demande ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Suivez notre guide et maximisez vos chances d'obtenir un terrain communal
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                <Link to="/terrains-communaux">
                  <Building2 className="w-5 h-5 mr-2" />
                  Voir les terrains disponibles
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                <Link to="/municipal-requests">
                  <FileText className="w-5 h-5 mr-2" />
                  Suivre mes demandes
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

export default GuideAttributionPage;
