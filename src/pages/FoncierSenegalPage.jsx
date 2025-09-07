import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen,
  MapPin,
  FileText,
  Building2,
  Users,
  Scale,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Globe,
  Landmark,
  Home,
  TreePine,
  Factory,
  School,
  ArrowRight,
  Download,
  Play,
  HelpCircle,
  Info,
  Star,
  Award,
  Target,
  Blocks
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Helmet } from 'react-helmet-async';

const FoncierSenegalPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const landTypes = [
    {
      type: "Domaine National",
      description: "Terres appartenant à l'État sénégalais",
      percentage: "95%",
      icon: Landmark,
      color: "from-blue-500 to-cyan-500",
      characteristics: [
        "Gestion par l'État",
        "Attribution par affectation",
        "Droits d'usage transmissibles",
        "Contrôle de l'utilisation"
      ]
    },
    {
      type: "Propriété Privée",
      description: "Terres avec titre de propriété complet",
      percentage: "3%",
      icon: Home,
      color: "from-green-500 to-emerald-500",
      characteristics: [
        "Titre de propriété définitif",
        "Droits complets (usus, fructus, abusus)",
        "Transmissible par héritage",
        "Aliénable et hypothécable"
      ]
    },
    {
      type: "Terres Coutumières",
      description: "Terres régies par le droit traditionnel",
      percentage: "2%",
      icon: Users,
      color: "from-orange-500 to-red-500",
      characteristics: [
        "Gestion communautaire",
        "Droits collectifs",
        "Transmission familiale",
        "Règles traditionnelles"
      ]
    }
  ];

  const procedures = [
    {
      title: "Demande de Terrain Communal",
      description: "Procédure pour obtenir un terrain via les mairies",
      duration: "2-6 mois",
      cost: "Variable selon la commune",
      steps: [
        "Dépôt de demande à la mairie",
        "Constitution du dossier",
        "Examen par la commission",
        "Délibération du conseil municipal",
        "Attribution et signature de l'acte"
      ],
      documents: [
        "Demande manuscrite",
        "Copie CNI",
        "Certificat de résidence",
        "Plan de situation",
        "Justificatifs de revenus"
      ]
    },
    {
      title: "Achat de Titre Foncier",
      description: "Acquisition d'une propriété privée titrée",
      duration: "3-12 mois",
      cost: "Frais notariaux + droits d'enregistrement",
      steps: [
        "Vérification du titre",
        "Négociation du prix",
        "Signature de l'avant-contrat",
        "Finalisation chez le notaire",
        "Enregistrement aux services fonciers"
      ],
      documents: [
        "Titre foncier original",
        "Certificat de non-hypothèque",
        "Quitus fiscal",
        "Plan topographique",
        "Acte de vente notarié"
      ]
    },
    {
      title: "Bail Emphytéotique",
      description: "Bail de longue durée sur domaine national",
      duration: "6-18 mois",
      cost: "Redevance annuelle",
      steps: [
        "Demande d'affectation",
        "Étude de faisabilité",
        "Approbation administrative",
        "Signature du bail",
        "Enregistrement et publicité"
      ],
      documents: [
        "Projet d'investissement",
        "Étude d'impact",
        "Garanties financières",
        "Plan d'aménagement",
        "Engagement de mise en valeur"
      ]
    }
  ];

  const challenges = [
    {
      problem: "Complexité Administrative",
      description: "Procédures longues et bureaucratiques",
      impact: "Délais étendus, coûts élevés",
      solution: "Digitalisation avec blockchain",
      icon: Clock
    },
    {
      problem: "Insécurité Juridique",
      description: "Risques de double attribution",
      impact: "Conflits fonciers, litiges",
      solution: "Registre blockchain inaltérable",
      icon: Shield
    },
    {
      problem: "Manque de Transparence",
      description: "Informations dispersées et peu accessibles",
      impact: "Corruption, inéquité",
      solution: "Plateforme transparente et ouverte",
      icon: Globe
    },
    {
      problem: "Accès Limité",
      description: "Difficultés pour la diaspora",
      impact: "Exclusion des investissements",
      solution: "Accès digital mondial",
      icon: Users
    }
  ];

  const regions = [
    { name: "Dakar", plots: 2847, demand: "Très Élevée", price: "Élevé" },
    { name: "Thiès", plots: 1653, demand: "Élevée", price: "Moyen" },
    { name: "Saint-Louis", plots: 892, demand: "Moyenne", price: "Moyen" },
    { name: "Kaolack", plots: 745, demand: "Moyenne", price: "Abordable" },
    { name: "Ziguinchor", plots: 634, demand: "Faible", price: "Abordable" },
    { name: "Tambacounda", plots: 523, demand: "Faible", price: "Très Abordable" }
  ];

  const faqs = [
    {
      question: "Puis-je acheter un terrain au Sénégal en tant qu'étranger ?",
      answer: "Oui, les étrangers peuvent acquérir des droits fonciers au Sénégal, notamment par bail emphytéotique ou en créant une société sénégalaise. La blockchain facilite ces transactions transfrontalières."
    },
    {
      question: "Quelle est la différence entre titre foncier et permis d'occuper ?",
      answer: "Le titre foncier offre une propriété pleine et définitive, tandis que le permis d'occuper est temporaire et peut être révoqué. Notre plateforme clarifie ces distinctions."
    },
    {
      question: "Comment vérifier l'authenticité d'un titre foncier ?",
      answer: "Avec notre système blockchain, chaque titre est vérifié automatiquement. L'historique complet est consultable en temps réel, éliminant les risques de falsification."
    },
    {
      question: "Combien coûte l'acquisition d'un terrain communal ?",
      answer: "Les coûts varient selon la commune et la zone. Notre plateforme affiche les prix en temps réel et permet des comparaisons transparentes entre différentes options."
    },
    {
      question: "Peut-on construire immédiatement après l'acquisition ?",
      answer: "Cela dépend du type de droit acquis et des autorisations d'urbanisme. Notre système intègre ces informations pour chaque terrain disponible."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Système Foncier Sénégalais | Teranga Foncier - Guide Complet</title>
        <meta name="description" content="Guide complet du système foncier sénégalais. Comprenez les procédures, types de terrains et solutions blockchain pour investir au Sénégal." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Badge className="mb-6 bg-green-500/20 text-green-300 border-green-500/30">
                  🏛️ Système Foncier Sénégalais
                </Badge>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                  Comprendre le
                  <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                    {" "}Foncier Sénégalais
                  </span>
                </h1>
                
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Guide complet pour naviguer dans le système foncier sénégalais 
                  et maximiser vos investissements immobiliers en toute sécurité.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                    <Link to="#guide">
                      <BookOpen className="mr-2 h-5 w-5" />
                      Commencer le Guide
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                    <Link to="/foncier-blockchain">
                      <Blocks className="mr-2 h-5 w-5" />
                      Solutions Blockchain
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Overview Stats */}
        <section className="py-16 bg-white/5 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-white mb-2">196,722</div>
                <div className="text-gray-300">km² de superficie</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-white mb-2">14</div>
                <div className="text-gray-300">Régions administratives</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-white mb-2">557</div>
                <div className="text-gray-300">Communes</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-white mb-2">95%</div>
                <div className="text-gray-300">Domaine national</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section id="guide" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm">
                <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
                  Vue d'ensemble
                </TabsTrigger>
                <TabsTrigger value="types" className="data-[state=active]:bg-blue-600">
                  Types de Terrains
                </TabsTrigger>
                <TabsTrigger value="procedures" className="data-[state=active]:bg-blue-600">
                  Procédures
                </TabsTrigger>
                <TabsTrigger value="challenges" className="data-[state=active]:bg-blue-600">
                  Défis & Solutions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardHeader>
                        <CardTitle className="text-2xl text-white flex items-center gap-3">
                          <MapPin className="h-6 w-6" />
                          Organisation Territoriale
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 mb-6">
                          Le Sénégal est organisé en 14 régions administratives, chacune avec 
                          ses spécificités foncières et ses opportunités d'investissement.
                        </p>
                        
                        <div className="space-y-4">
                          {regions.slice(0, 6).map((region, index) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b border-white/10">
                              <div>
                                <span className="text-white font-medium">{region.name}</span>
                                <span className="text-gray-400 text-sm ml-2">
                                  {region.plots} terrains disponibles
                                </span>
                              </div>
                              <div className="text-right">
                                <Badge 
                                  className={`${
                                    region.demand === 'Très Élevée' ? 'bg-red-500/20 text-red-300' :
                                    region.demand === 'Élevée' ? 'bg-orange-500/20 text-orange-300' :
                                    region.demand === 'Moyenne' ? 'bg-yellow-500/20 text-yellow-300' :
                                    'bg-green-500/20 text-green-300'
                                  }`}
                                >
                                  {region.demand}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                      <CardHeader>
                        <CardTitle className="text-2xl text-white flex items-center gap-3">
                          <Scale className="h-6 w-6" />
                          Cadre Juridique
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 mb-6">
                          Le système foncier sénégalais est régi par plusieurs textes 
                          fondamentaux qui définissent les droits et obligations.
                        </p>
                        
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                            <div>
                              <h4 className="text-white font-medium">Loi sur le Domaine National (1964)</h4>
                              <p className="text-gray-400 text-sm">Organise la gestion des terres du domaine national</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                            <div>
                              <h4 className="text-white font-medium">Code de l'Urbanisme</h4>
                              <p className="text-gray-400 text-sm">Règles d'aménagement et de construction</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                            <div>
                              <h4 className="text-white font-medium">Loi sur les Collectivités Locales</h4>
                              <p className="text-gray-400 text-sm">Compétences des mairies en matière foncière</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                            <div>
                              <h4 className="text-white font-medium">Décrets d'Application</h4>
                              <p className="text-gray-400 text-sm">Modalités pratiques de mise en œuvre</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>

              <TabsContent value="types" className="mt-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  {landTypes.map((land, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                    >
                      <Card className="bg-white/10 backdrop-blur-sm border-white/20 h-full">
                        <CardHeader>
                          <div className={`w-16 h-16 bg-gradient-to-r ${land.color} rounded-xl flex items-center justify-center mb-4`}>
                            <land.icon className="h-8 w-8 text-white" />
                          </div>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl text-white">{land.type}</CardTitle>
                            <Badge className="bg-blue-500/20 text-blue-300">
                              {land.percentage}
                            </Badge>
                          </div>
                          <p className="text-gray-300">{land.description}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {land.characteristics.map((char, charIndex) => (
                              <div key={charIndex} className="flex items-center gap-3">
                                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                                <span className="text-gray-300 text-sm">{char}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="procedures" className="mt-8">
                <div className="space-y-8">
                  {procedures.map((procedure, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                        <CardHeader>
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div>
                              <CardTitle className="text-2xl text-white mb-2">
                                {procedure.title}
                              </CardTitle>
                              <p className="text-gray-300">{procedure.description}</p>
                            </div>
                            <div className="flex gap-4">
                              <Badge className="bg-blue-500/20 text-blue-300">
                                <Clock className="w-4 h-4 mr-1" />
                                {procedure.duration}
                              </Badge>
                              <Badge className="bg-green-500/20 text-green-300">
                                {procedure.cost}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid lg:grid-cols-2 gap-8">
                            <div>
                              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Étapes de la Procédure
                              </h4>
                              <div className="space-y-3">
                                {procedure.steps.map((step, stepIndex) => (
                                  <div key={stepIndex} className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                                      {stepIndex + 1}
                                    </div>
                                    <span className="text-gray-300 text-sm">{step}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Documents Requis
                              </h4>
                              <div className="space-y-3">
                                {procedure.documents.map((doc, docIndex) => (
                                  <div key={docIndex} className="flex items-center gap-3">
                                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                                    <span className="text-gray-300 text-sm">{doc}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="challenges" className="mt-8">
                <div className="space-y-8">
                  {challenges.map((challenge, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                        <CardContent className="p-6">
                          <div className="grid lg:grid-cols-4 gap-6 items-center">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                                <challenge.icon className="h-6 w-6 text-red-400" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-white">
                                  {challenge.problem}
                                </h3>
                                <p className="text-gray-300 text-sm">
                                  {challenge.description}
                                </p>
                              </div>
                            </div>
                            
                            <div>
                              <Badge className="mb-2 bg-orange-500/20 text-orange-300">
                                Impact
                              </Badge>
                              <p className="text-gray-300 text-sm">
                                {challenge.impact}
                              </p>
                            </div>
                            
                            <div>
                              <Badge className="mb-2 bg-green-500/20 text-green-300">
                                Notre Solution
                              </Badge>
                              <p className="text-gray-300 text-sm">
                                {challenge.solution}
                              </p>
                            </div>
                            
                            <div className="text-center">
                              <Button asChild size="sm" className="bg-blue-600 text-white">
                                <Link to="/foncier-blockchain">
                                  <Blocks className="mr-2 h-4 w-4" />
                                  En Savoir Plus
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white/5 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Questions Fréquentes
              </h2>
              <p className="text-gray-300 max-w-3xl mx-auto">
                Réponses aux questions les plus courantes sur le système foncier sénégalais
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg px-6">
                    <AccordionTrigger className="text-white hover:text-blue-300">
                      <span className="text-left">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Prêt à Investir dans le Foncier Sénégalais ?
              </h2>
              <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
                Utilisez nos solutions blockchain pour naviguer facilement dans le système foncier 
                et sécuriser vos investissements immobiliers au Sénégal.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  <Link to="/terrains">
                    <MapPin className="mr-2 h-5 w-5" />
                    Explorer les Terrains
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Link to="/contact">
                    <HelpCircle className="mr-2 h-5 w-5" />
                    Obtenir de l'Aide
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

export default FoncierSenegalPage;
