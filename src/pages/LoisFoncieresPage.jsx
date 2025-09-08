import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Scale, 
  BookOpen, 
  Shield, 
  Calendar, 
  Users, 
  Gavel,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Building,
  Globe,
  Download
} from 'lucide-react';

const LoisFoncieresPage = () => {
  const loisPrincipales = [
    {
      title: "Loi n° 2011-07 du 30 mars 2011",
      subtitle: "Portant régime de la propriété foncière",
      description: "Loi fondamentale qui organise le régime foncier au Sénégal",
      icon: Scale,
      color: "blue",
      annee: "2011",
      articles: "95 articles",
      details: [
        "Définit les différents types de propriété",
        "Organise l'immatriculation foncière",
        "Règle les droits coutumiers",
        "Établit les procédures d'expropriation"
      ]
    },
    {
      title: "Code de l'Urbanisme",
      subtitle: "Planification et aménagement urbain",
      description: "Réglemente l'utilisation des sols urbains et l'aménagement",
      icon: Building,
      color: "green",
      annee: "2008",
      articles: "120 articles",
      details: [
        "Plans d'urbanisme directeur",
        "Permis de construire",
        "Zones d'aménagement concerté",
        "Règles de construction"
      ]
    },
    {
      title: "Loi sur le Domaine National",
      subtitle: "Gestion des terres rurales",
      description: "Organise la gestion des terres rurales et leur affectation",
      icon: MapPin,
      color: "orange",
      annee: "1964",
      articles: "52 articles",
      details: [
        "Classification des terres",
        "Affectation par les collectivités",
        "Droits d'usage traditionnels",
        "Désaffectation et réaffectation"
      ]
    },
    {
      title: "Code des Obligations Civiles",
      subtitle: "Contrats et transactions foncières",
      description: "Règles générales des contrats appliquées aux transactions foncières",
      icon: FileText,
      color: "purple",
      annee: "1967",
      articles: "850 articles",
      details: [
        "Formation des contrats",
        "Nullités et vices du consentement",
        "Exécution des obligations",
        "Responsabilité contractuelle"
      ]
    }
  ];

  const proceduresJuridiques = [
    {
      procedure: "Immatriculation Foncière",
      duree: "6-18 mois",
      cout: "Variable selon la superficie",
      etapes: [
        "Demande d'immatriculation",
        "Enquête contradictoire",
        "Bornage officiel",
        "Délivrance du titre foncier"
      ]
    },
    {
      procedure: "Morcellement",
      duree: "3-6 mois",
      cout: "Frais de géomètre + taxes",
      etapes: [
        "Demande d'autorisation",
        "Plan de morcellement",
        "Enquête publique",
        "Autorisation administrative"
      ]
    },
    {
      procedure: "Changement de Destination",
      duree: "2-4 mois",
      cout: "Frais administratifs",
      etapes: [
        "Demande motivée",
        "Étude d'impact",
        "Avis des services techniques",
        "Décision administrative"
      ]
    }
  ];

  const droitsCoutumiers = [
    {
      titre: "Droit de Première Installation",
      description: "Droit reconnu au premier occupant d'une terre vierge",
      protection: "Protégé par la Constitution",
      conditions: ["Installation effective", "Mise en valeur", "Reconnaissance communautaire"]
    },
    {
      titre: "Droit d'Héritage Familial",
      description: "Transmission des droits fonciers selon les règles coutumières",
      protection: "Codifié dans la loi foncière",
      conditions: ["Filiation établie", "Respect des règles familiales", "Non-abandon prolongé"]
    },
    {
      titre: "Droit de Pacage",
      description: "Droit collectif d'usage des pâturages communs",
      protection: "Reconnu par l'État",
      conditions: ["Usage traditionnel", "Gestion collective", "Respect de l'environnement"]
    }
  ];

  const innovations2024 = [
    {
      title: "Digitalisation des Procédures",
      description: "Dématérialisation complète des démarches foncières",
      impact: "Réduction de 70% des délais",
      status: "En cours de déploiement",
      icon: Globe
    },
    {
      title: "Blockchain pour la Traçabilité",
      description: "Enregistrement immuable des transactions foncières",
      impact: "Sécurisation totale des titres",
      status: "Phase pilote",
      icon: Shield
    },
    {
      title: "Géolocalisation Satellite",
      description: "Cartographie précise par satellite et GPS",
      impact: "Précision centimétrique",
      status: "Opérationnel",
      icon: MapPin
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pt-24">
      <Helmet>
        <title>Lois Foncières - Cadre Juridique | Teranga Foncier</title>
        <meta name="description" content="Guide complet des lois foncières au Sénégal : réglementation, procédures juridiques, droits coutumiers et innovations 2024." />
      </Helmet>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-purple-100 text-purple-700">
            ⚖️ Cadre Juridique
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Lois Foncières
            <span className="block text-purple-600">du Sénégal</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprendre le cadre juridique foncier sénégalais : lois, règlements, 
            procédures et innovations pour sécuriser vos transactions immobilières.
          </p>
        </motion.div>

        {/* Lois Principales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Textes Législatifs Principaux</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {loisPrincipales.map((loi, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 bg-${loi.color}-100 rounded-lg flex items-center justify-center mr-4`}>
                        <loi.icon className={`w-6 h-6 text-${loi.color}-600`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{loi.title}</CardTitle>
                        <p className="text-sm text-gray-600">{loi.subtitle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">{loi.annee}</Badge>
                      <p className="text-xs text-gray-500">{loi.articles}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{loi.description}</p>
                  <div className="space-y-2">
                    {loi.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-4">
                    <FileText className="w-4 h-4 mr-2" />
                    Consulter le Texte
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Procédures Juridiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Procédures Juridiques Courantes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {proceduresJuridiques.map((proc, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{proc.procedure}</CardTitle>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-blue-600">
                      <Clock className="w-3 h-3 mr-1" />
                      {proc.duree}
                    </Badge>
                    <span className="text-sm text-gray-600">{proc.cout}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {proc.etapes.map((etape, etapeIndex) => (
                      <div key={etapeIndex} className="flex items-center">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-semibold text-purple-600">{etapeIndex + 1}</span>
                        </div>
                        <span className="text-sm">{etape}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Droits Coutumiers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Droits Coutumiers Reconnus</h2>
          <div className="space-y-6">
            {droitsCoutumiers.map((droit, index) => (
              <Card key={index} className="border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-bold text-lg mb-2">{droit.titre}</h3>
                      <p className="text-gray-600 text-sm">{droit.description}</p>
                    </div>
                    <div>
                      <div className="flex items-center mb-2">
                        <Shield className="w-4 h-4 text-green-600 mr-2" />
                        <span className="font-medium text-sm">Protection Légale</span>
                      </div>
                      <p className="text-sm text-gray-600">{droit.protection}</p>
                    </div>
                    <div>
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mr-2" />
                        <span className="font-medium text-sm">Conditions</span>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {droit.conditions.map((condition, condIndex) => (
                          <li key={condIndex} className="flex items-center">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                            {condition}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Innovations 2024 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Innovations Juridiques 2024</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {innovations2024.map((innovation, index) => (
              <Card key={index} className="bg-gradient-to-br from-purple-50 to-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <innovation.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold">{innovation.title}</h3>
                      <Badge variant="outline" className="text-xs">{innovation.status}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{innovation.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-600 font-medium">{innovation.impact}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Assistance Juridique */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center mb-4">
                    <Gavel className="w-8 h-8 mr-3" />
                    <h2 className="text-2xl font-bold">Assistance Juridique Gratuite</h2>
                  </div>
                  <p className="text-purple-100 mb-4">
                    Bénéficiez de l'accompagnement de nos juristes spécialisés en droit foncier 
                    pour toutes vos questions et démarches juridiques.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm">Experts juristes certifiés</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">Disponibles 24h/7j</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      <span className="text-sm">Conseils juridiques gratuits</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 mb-4">
                    Consulter un Juriste
                    <Gavel className="ml-2 h-5 w-5" />
                  </Button>
                  <p className="text-sm text-purple-200">Réponse sous 2h garantie</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <Card className="bg-gray-50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Ressources Juridiques</h2>
              <p className="text-gray-600 mb-6">
                Accédez à notre bibliothèque complète de textes de lois et guides pratiques
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Bibliothèque Juridique
                </Button>
                <Button size="lg" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Guide PDF Complet
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LoisFoncieresPage;
