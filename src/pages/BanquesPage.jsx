import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  TrendingUp, 
  Shield, 
  Users, 
  DollarSign, 
  BarChart3, 
  Zap, 
  Award, 
  CheckCircle, 
  ArrowRight, 
  Globe, 
  Smartphone, 
  FileText, 
  Target, 
  Clock, 
  PieChart, 
  Activity, 
  CreditCard, 
  Star, 
  Phone, 
  Mail, 
  Calculator, 
  Briefcase,
  Database,
  Blocks,
  Link as LinkIcon,
  Lock,
  Coins,
  TrendingDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';

const BanquesPage = () => {
  const [activeMetric, setActiveMetric] = useState(0);

  const businessMetrics = [
    {
      title: "ROI Blockchain Immobilier",
      value: "+45%",
      description: "Augmentation des revenus grâce aux prêts sécurisés par NFT",
      icon: Database,
      color: "from-yellow-500 to-orange-500"
    },
    {
      title: "Nouveaux Clients Diaspora",
      value: "3.8K+",
      description: "Financement blockchain pour la diaspora sénégalaise",
      icon: Users,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Smart Contracts NFT",
      value: "89%", 
      description: "Réduction du temps de traitement grâce aux contrats intelligents",
      icon: Blocks,
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "Sécurité Blockchain",
      value: "99.9%",
      description: "Garantie anti-fraude avec tokenisation NFT des propriétés",
      icon: Shield,
      color: "from-green-500 to-emerald-500"
    }
  ];

  const advantages = [
    {
      icon: Database,
      title: "Garanties NFT Blockchain",
      description: "Propriétés tokenisées en NFT offrant sécurité maximale et traçabilité complète des transactions",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: BarChart3,
      title: "Scoring IA avancé",
      description: "Notre algorithme d'évaluation des risques améliore vos décisions de crédit de 67%",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Globe,
      title: "Marché diaspora",
      description: "Captez les +2M de Sénégalais à l'étranger avec revenus stables en devises",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Zap,
      title: "Processus digitalisé",
      description: "Intégration API complète pour un parcours client 100% dématérialisé",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Activity,
      title: "Analytics temps réel",
      description: "Tableaux de bord dédiés avec métriques de performance et opportunités",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Award,
      title: "Co-branding premium",
      description: "Visibilité renforcée auprès de notre communauté haut de gamme",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const integrationFeatures = [
    {
      title: "API Banking",
      description: "Intégration directe avec vos systèmes core banking pour traitement automatique",
      icon: Smartphone
    },
    {
      title: "Scoring Crédit IA",
      description: "Algorithme propriétaire analysant 150+ variables pour évaluer les risques",
      icon: BarChart3
    },
    {
      title: "KYC Automatisé",
      description: "Vérification d'identité et conformité réglementaire en temps réel",
      icon: Shield
    },
    {
      title: "Reporting Complet",
      description: "Rapports détaillés sur portefeuille, risques et opportunités business",
      icon: FileText
    }
  ];

  const successStories = [
    {
      bank: "Bank of Africa Sénégal",
      results: "+45% de nouveaux crédits immobiliers en 6 mois",
      details: "Partenariat exclusif sur segment diaspora",
      growth: "+45%",
      icon: Building2
    },
    {
      bank: "Banque Atlantique",
      results: "€12M de volume additionnel généré",
      details: "Intégration API complète réalisée",
      growth: "+67%",
      icon: TrendingUp
    },
    {
      bank: "Ecobank Sénégal",
      results: "2,200 nouveaux comptes diaspora",
      details: "Programme co-marketing personnalisé",
      growth: "+89%",
      icon: Users
    }
  ];

  const packages = [
    {
      name: "Essentiel",
      price: "Sur mesure",
      description: "Pour banques régionales",
      features: [
        "Accès base clients qualifiés",
        "Intégration API basique",
        "Support 5j/7",
        "Reporting mensuel",
        "Formation équipes"
      ],
      color: "from-blue-500 to-cyan-500",
      popular: false
    },
    {
      name: "Premium",
      price: "Sur mesure",
      description: "Pour banques nationales",
      features: [
        "Tout Essentiel inclus",
        "IA scoring avancé",
        "Co-branding prioritaire",
        "Support 24/7",
        "Analytics temps réel",
        "Accompagnement dédié"
      ],
      color: "from-purple-500 to-indigo-500",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Sur mesure", 
      description: "Pour groupes bancaires",
      features: [
        "Tout Premium inclus",
        "Personnalisation complète",
        "Intégration multi-pays",
        "Account manager dédié",
        "Développements sur mesure",
        "SLA garantis"
      ],
      color: "from-emerald-500 to-teal-500",
      popular: false
    }
  ];

  return (
    <>
      <SEO 
        title="Partenariat Banques - Financement Immobilier Blockchain au Sénégal"
        description="Partenariat bancaire avec Teranga Foncier. Accédez à 15K+ investisseurs qualifiés, API blockchain pour crédit immobilier sécurisé, scoring IA et augmentez vos revenus de prêts fonciers."
        keywords="financement immobilier banque sénégal, partenariat bancaire, crédit foncier, plateforme immobilière banque"
        canonicalUrl="https://www.terangafoncier.sn/banques"
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section Banques */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-24 pb-20">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Hero Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 text-sm font-medium">
                    🏦 Partenariat Bancaire Premium
                  </Badge>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                    Boostez vos{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      crédits immobiliers
                    </span>
                    <br />
                    de +34%
                  </h1>
                  
                  <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                    Accédez à +15,000 investisseurs pré-qualifiés et transformez 
                    votre portefeuille immobilier avec notre écosystème FinTech.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    asChild
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg"
                  >
                    <Link to="/contact">
                      Devenir Partenaire
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
                  >
                    Télécharger le Dossier
                    <FileText className="ml-2 w-5 h-5" />
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center gap-6 pt-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600">Conformité BCEAO</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600">API Certifiée</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600">Support 24/7</span>
                  </div>
                </div>
              </motion.div>

              {/* Hero Visual - Dashboard Banking */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                  {/* Banking Dashboard Mockup */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">Banking Dashboard</h3>
                      <Badge className="bg-green-500 text-white">En temps réel</Badge>
                    </div>
                    
                    {/* Metrics Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-lg">
                        <div className="text-2xl font-bold">+34%</div>
                        <div className="text-sm text-blue-100">Crédits immo</div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 rounded-lg">
                        <div className="text-2xl font-bold">2.5K</div>
                        <div className="text-sm text-purple-100">Nouveaux clients</div>
                      </div>
                    </div>
                    
                    {/* Chart Mockup */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Volume mensuel</span>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Jan</span>
                          <span>Fév</span>
                          <span>Mar</span>
                          <span>Avr</span>
                        </div>
                        <div className="h-20 bg-gradient-to-t from-blue-200 to-blue-400 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-xl shadow-lg"
                >
                  <DollarSign className="w-6 h-6" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-3 rounded-xl shadow-lg"
                >
                  <BarChart3 className="w-6 h-6" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Business Metrics Interactive */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Impact Business Mesurable
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Résultats concrets obtenus par nos partenaires bancaires 
                en moins de 6 mois
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {businessMetrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`cursor-pointer transition-all duration-300 ${
                    activeMetric === index ? 'scale-105' : ''
                  }`}
                  onClick={() => setActiveMetric(index)}
                >
                  <Card className={`h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                    activeMetric === index ? 'ring-2 ring-blue-500' : ''
                  }`}>
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${metric.color} flex items-center justify-center mx-auto mb-4`}>
                        <metric.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {metric.value}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {metric.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {metric.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Advantages */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Pourquoi choisir Teranga Foncier ?
              </h2>
              <p className="text-xl text-gray-600">
                6 avantages concurrentiels qui transforment votre business
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {advantages.map((advantage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${advantage.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <advantage.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {advantage.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {advantage.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Features */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Intégration Technique Simplifiée
              </h2>
              <p className="text-xl text-gray-600">
                API moderne et FileTextation complète pour une mise en place rapide
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {integrationFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Succès de nos partenaires
              </h2>
              <p className="text-xl text-gray-600">
                Des résultats exceptionnels qui parlent d'eux-mêmes
              </p>
            </motion.div>

            <div className="space-y-8">
              {successStories.map((story, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-8">
                      <div className="grid md:grid-cols-4 gap-6 items-center">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <story.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{story.bank}</h3>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            {story.results}
                          </h4>
                          <p className="text-gray-600">{story.details}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-green-600">
                            {story.growth}
                          </div>
                          <div className="text-sm text-gray-500">Croissance</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Packages Partenariat
              </h2>
              <p className="text-xl text-gray-600">
                Solutions adaptées à la taille et aux besoins de votre banque
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className={`relative ${pkg.popular ? 'scale-105' : ''}`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-1">
                        ⭐ Plus populaire
                      </Badge>
                    </div>
                  )}
                  
                  <Card className={`h-full border-0 shadow-lg ${
                    pkg.popular ? 'ring-2 ring-purple-500 shadow-xl' : ''
                  }`}>
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${pkg.color} flex items-center justify-center mx-auto mb-4`}>
                        <Briefcase className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        {pkg.name}
                      </CardTitle>
                      <div className="text-3xl font-bold text-gray-900">
                        {pkg.price}
                      </div>
                      <p className="text-gray-600">{pkg.description}</p>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <ul className="space-y-3 mb-8">
                        {pkg.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        asChild
                        className={`w-full ${
                          pkg.popular 
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' 
                            : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                        } text-white`}
                      >
                        <Link to="/contact">
                          Demander une démo
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Prêt à transformer votre portefeuille ?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Rejoignez Bank of Africa, Ecobank et +12 autres institutions 
                qui ont déjà boosté leurs revenus avec Teranga Foncier
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg"
                >
                  <Link to="/contact">
                    Démarrer le Partenariat
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  size="lg" 
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
                >
                  <Link to="/contact">
                    Planifier une Démo
                    <Phone className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
              
              {/* Contact Info */}
              <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>palaye122@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>+221 77 593 42 41</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BanquesPage;
