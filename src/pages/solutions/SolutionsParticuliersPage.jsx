import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  ShieldCheck, 
  MapPin, 
  FileSearch, 
  ArrowRight, 
  LayoutDashboard, 
  Heart,
  CheckCircle,
  Eye,
  Home,
  Clock,
  CreditCard,
  Globe,
  UserCheck,
  Building2,
  DollarSign,
  Camera,
  Phone,
  LinkIcon,
  Coins
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/hooks/useUser';
import { Helmet } from 'react-helmet-async';
import { ROLES_CONFIG } from '@/lib/enhancedRbacConfig';

const SolutionsParticuliersPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleDashboardAccess = () => {
    if (user) {
      navigate('/dashboard'); // Notre nouveau système de redirection intelligente
    } else {
      navigate('/login', { state: { from: { pathname: '/dashboard' } } });
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const features = [
    {
      icon: ShieldCheck,
      title: "Achat 100% Sécurisé",
      description: "Chaque terrain sur notre plateforme est vérifié juridiquement. Nous nous assurons que tous les documents sont authentiques et que le vendeur est le véritable propriétaire.",
      stats: "100% des terrains vérifiés"
    },
    {
      icon: MapPin,
      title: "Géolocalisation Précise",
      description: "Visualisez avec précision l'emplacement exact de votre futur terrain grâce à notre technologie de cartographie satellite avancée.",
      stats: "Précision GPS au mètre près"
    },
    {
      icon: FileSearch,
      title: "Documentation Complète",
      description: "Accédez à tous les documents nécessaires : titre foncier, certificat d'urbanisme, plan de situation, et bien plus.",
      stats: "Tous documents fournis"
    },
    {
      icon: CreditCard,
      title: "Paiement Sécurisé",
      description: "Effectuez vos transactions en toute sécurité avec notre système de paiement protégé et nos options de financement flexibles.",
      stats: "Paiements sécurisés 24/7"
    },
    {
      icon: LinkIcon,
      title: "🆕 Contrats Intelligents",
      description: "Sécurisez vos achats avec la blockchain : paiements automatisés selon les conditions prédéfinies, traçabilité complète et sécurité maximale.",
      stats: "100% transparence blockchain",
      isNew: true
    },
    {
      icon: Coins,
      title: "🆕 Investissement Fractionné",
      description: "Investissez dans l'immobilier même avec un petit budget grâce à la tokenisation. Achetez des parts de terrains et générez des revenus locatifs.",
      stats: "Dès 10 000 FCFA",
      isNew: true
    }
  ];

  const solutions = [
    {
      title: "Catalogue de Terrains Vérifiés",
      description: "Parcourez notre sélection de terrains certifiés dans tout le Sénégal",
      icon: Home,
      href: "/parcelles",
      features: ["Terrains vérifiés", "Photos HD", "Visites virtuelles", "Prix transparents"]
    },
    {
      title: "Demandes Communales",
      description: "Accédez aux terrains communaux via un processus transparent",
      icon: Globe,
      href: "/villes",
      features: ["Processus transparent", "Contact direct mairies", "Suivi en temps réel", "Support dédié"]
    },
    {
      title: "Accompagnement Personnalisé",
      description: "Bénéficiez de l'expertise de nos agents fonciers",
      icon: UserCheck,
      href: "/agents-fonciers",
      features: ["Conseils d'experts", "Visite accompagnée", "Négociation", "Support juridique"]
    }
  ];

  const process = [
    {
      step: "01",
      title: "Recherchez",
      description: "Trouvez votre terrain idéal grâce à nos filtres avancés",
      icon: FileSearch
    },
    {
      step: "02", 
      title: "Vérifiez",
      description: "Consultez tous les documents et informations vérifiées",
      icon: Eye
    },
    {
      step: "03",
      title: "Visitez",
      description: "Planifiez une visite sur site ou virtuelle",
      icon: MapPin
    },
    {
      step: "04",
      title: "Achetez",
      description: "Finalisez votre achat en toute sécurité",
      icon: ShieldCheck
    }
  ];

  const testimonials = [
    {
      name: "Fatou Diagne",
      location: "Dakar",
      text: "Grâce à Teranga Foncier, j'ai trouvé le terrain parfait pour ma maison. Le processus était transparent et sécurisé.",
      rating: 5
    },
    {
      name: "Mamadou Ba",
      location: "Thiès", 
      text: "Excellent service ! L'équipe m'a accompagné tout au long du processus. Je recommande vivement.",
      rating: 5
    },
    {
      name: "Aïcha Ndiaye",
      location: "Saint-Louis",
      text: "Interface simple et intuitive. J'ai pu acheter mon terrain depuis l'étranger sans problème.",
      rating: 5
    }
  ];

  return (
    <>
      <Helmet>
        <title>Solutions pour Particuliers - Achat de Terrain Sécurisé | Teranga Foncier</title>
        <meta name="description" content="Achetez votre terrain en toute sécurité au Sénégal. Terrains vérifiés, documentation complète, paiement sécurisé. Trouvez le terrain de vos rêves." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-blue-600 to-purple-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30">
                    Solutions Particuliers
                  </Badge>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  Achetez Votre Terrain en <span className="text-yellow-300">Toute Sécurité</span>
                </h1>
                
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Trouvez et achetez le terrain de vos rêves au Sénégal avec notre processus 100% sécurisé. 
                  Terrains vérifiés, documentation complète, accompagnement personnalisé.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" variant="secondary" asChild className="min-w-[200px]">
                    <Link to="/parcelles">
                      Voir les Terrains
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={handleDashboardAccess}
                    className="min-w-[200px] border-white text-white hover:bg-white hover:text-primary"
                  >
                    <LayoutDashboard className="h-5 w-5 mr-2" />
                    Mon Espace
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold mb-4">Pourquoi choisir Teranga Foncier ?</h3>
                  <div className="space-y-3">
                    {[
                      "Terrains 100% vérifiés juridiquement",
                      "Documentation complète fournie", 
                      "Paiement sécurisé et flexible",
                      "Accompagnement personnalisé"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nos Garanties pour Votre Sécurité
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Nous mettons tout en œuvre pour vous offrir une expérience d'achat sécurisée et transparente
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  custom={index}
                  variants={featureVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Card className={`h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md ${
                    feature.isNew ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50' : ''
                  }`}>
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                        feature.isNew ? 'bg-purple-500/10' : 'bg-primary/10'
                      }`}>
                        <feature.icon className={`h-8 w-8 ${
                          feature.isNew ? 'text-purple-600' : 'text-primary'
                        }`} />
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pt-0">
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {feature.description}
                      </p>
                      <Badge variant="secondary" className={
                        feature.isNew ? 'bg-purple-100 text-purple-800' : 'bg-primary/10 text-primary'
                      }>
                        {feature.stats}
                      </Badge>
                      {feature.isNew && (
                        <div className="mt-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Blockchain
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nos Solutions Adaptées à Vos Besoins
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Que vous recherchiez un terrain résidentiel, commercial ou agricole, nous avons la solution
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {solutions.map((solution, index) => (
                <motion.div
                  key={solution.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                        <solution.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl font-semibold text-gray-900">
                        {solution.title}
                      </CardTitle>
                      <p className="text-gray-600">{solution.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-6">
                        {solution.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button asChild className="w-full">
                        <Link to={solution.href}>
                          Explorer
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Comment Acheter Votre Terrain
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Un processus simple en 4 étapes pour acquérir votre terrain en toute sécurité
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-6">
              {process.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-900">{step.step}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ce Que Disent Nos Clients
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Des milliers de Sénégalais nous font confiance pour leurs achats fonciers
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <div key={i} className="w-5 h-5 text-yellow-400">★</div>
                        ))}
                      </div>
                      <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.location}</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Tarification */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-green-700">Plans Particuliers</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Choisissez le plan qui correspond à vos besoins d'investissement
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Plan Sénégal */}
              <Card className="border-2 border-green-200 shadow-xl">
                <CardHeader className="text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center justify-center gap-2">
                    <Home className="w-6 h-6" />
                    Particulier Sénégal
                  </CardTitle>
                  <div className="text-3xl font-bold mt-2">
                    {ROLES_CONFIG.PARTICULIER_SENEGAL?.subscription?.basic?.price?.toLocaleString() || '15,000'} XOF
                    <span className="text-sm font-normal opacity-90">/mois</span>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Recherche terrains avancée</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Favoris et comparaisons</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Contact direct vendeurs</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Historique des prix</span>
                    </li>
                  </ul>
                  <Button 
                    onClick={handleDashboardAccess} 
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Commencer
                  </Button>
                </CardContent>
              </Card>

              {/* Plan Diaspora */}
              <Card className="border-2 border-blue-200 shadow-xl relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">POPULAIRE</Badge>
                </div>
                <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-sky-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center justify-center gap-2">
                    <Globe className="w-6 h-6" />
                    Particulier Diaspora
                  </CardTitle>
                  <div className="text-3xl font-bold mt-2">
                    {ROLES_CONFIG.PARTICULIER_DIASPORA?.subscription?.standard?.price?.toLocaleString() || '25,000'} XOF
                    <span className="text-sm font-normal opacity-90">/mois</span>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <span>Tout du plan Sénégal</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <span>Suivi construction à distance</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <span>Photos progression temps réel</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <span>Communication promoteurs</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <span>Support prioritaire</span>
                    </li>
                  </ul>
                  <Button 
                    onClick={handleDashboardAccess} 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Commencer
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section Blockchain pour Particuliers */}
        <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-800 text-sm font-medium mb-6">
                🆕 Nouvelle Technologie
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                L'Immobilier Révolutionné par la Blockchain
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Découvrez comment la technologie blockchain transforme l'achat immobilier : plus de transparence, de sécurité et d'accessibilité pour tous.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-purple-100"
              >
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Link className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Contracts Sécurisés</h3>
                <p className="text-gray-600 mb-4">
                  Vos transactions sont automatisées et sécurisées par des contrats intelligents. Paiements conditionnels, 
                  aucun risque d'arnaque.
                </p>
                <div className="text-sm text-purple-700 font-medium">• Sécurité maximale • Automatisation complète</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-purple-100"
              >
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Coins className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Investissement Fractionné</h3>
                <p className="text-gray-600 mb-4">
                  Investissez dans l'immobilier même avec un petit budget. Achetez des parts tokenisées 
                  de propriétés et générez des revenus passifs.
                </p>
                <div className="text-sm text-purple-700 font-medium">• Dès 10 000 FCFA • Revenus passifs</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-purple-100"
              >
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Transparence Totale</h3>
                <p className="text-gray-600 mb-4">
                  Tous les historiques de propriété, transactions et documents sont enregistrés 
                  de manière immuable sur la blockchain.
                </p>
                <div className="text-sm text-purple-700 font-medium">• Historique complet • Données vérifiables</div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center mt-12"
            >
              <Button 
                size="lg" 
                onClick={handleDashboardAccess}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl"
              >
                Découvrir les Fonctionnalités Blockchain <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-blue-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Prêt à Trouver Votre Terrain Idéal ?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Rejoignez des milliers de propriétaires satisfaits et réalisez votre rêve immobilier
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild className="min-w-[200px]">
                  <Link to="/parcelles">
                    Voir les Terrains
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="min-w-[200px] border-white text-white hover:bg-white hover:text-primary">
                  <Link to="/contact">
                    Parler à un Expert
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

export default SolutionsParticuliersPage;
