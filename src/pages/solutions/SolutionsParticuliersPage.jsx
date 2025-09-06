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
  UserCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/SupabaseAuthContext';
import { Helmet } from 'react-helmet-async';

const SolutionsParticuliersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDashboardAccess = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register', { state: { from: { pathname: '/dashboard' } } });
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
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pt-0">
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {feature.description}
                      </p>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {feature.stats}
                      </Badge>
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
