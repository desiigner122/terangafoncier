import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Building, 
  Banknote, 
  TrendingUp, 
  Leaf, 
  Globe, 
  Shield, 
  MapPin, 
  Eye, 
  Smartphone,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Clock,
  Home,
  Plane
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SolutionsPage = () => {
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

  const solutionCategories = [
    {
      id: 'particuliers',
      title: 'Pour Particuliers',
      subtitle: 'Achetez votre terrain en toute sécurité',
      icon: Users,
      color: 'primary',
      bgGradient: 'from-blue-50 to-indigo-50',
      iconBg: 'bg-blue-500',
      solutions: [
        {
          title: 'Achat de Terrain Sécurisé',
          description: 'Trouvez et achetez votre terrain idéal avec notre processus de vérification complet.',
          href: '/solutions/particuliers',
          features: ['Vérification juridique', 'Géolocalisation précise', 'Accompagnement complet']
        },
        {
          title: 'Demandes Communales',
          description: 'Accédez aux terrains communaux via notre plateforme transparente.',
          href: '/villes',
          features: ['Processus transparent', 'Suivi en temps réel', 'Contact direct mairies']
        },
        {
          title: 'Catalogue Vérifié',
          description: 'Explorez notre catalogue de parcelles certifiées et vérifiées.',
          href: '/parcels',
          features: ['Parcelles certifiées', 'Photos HD', 'Visites virtuelles']
        }
      ]
    },
    {
      id: 'diaspora',
      title: 'Solutions Diaspora',
      subtitle: 'Investissez depuis l\'étranger en toute confiance',
      icon: Globe,
      color: 'emerald',
      bgGradient: 'from-emerald-50 to-green-50',
      iconBg: 'bg-emerald-500',
      isNew: true,
      solutions: [
        {
          title: 'Investissement à Distance',
          description: 'Achetez votre terrain au Sénégal depuis n\'importe où dans le monde.',
          href: '/diaspora',
          features: ['Process digital 100%', 'Vérification à distance', 'Paiement sécurisé'],
          isNew: true
        },
        {
          title: 'Construction Temps Réel',
          description: 'Suivez vos travaux de construction en temps réel avec rapports photo/vidéo.',
          href: '/solutions/construction-distance',
          features: ['Suivi live', 'Rapports quotidiens', 'Contrôle qualité'],
          isNew: true
        },
        {
          title: 'Guide Diaspora',
          description: 'Tous les conseils et démarches pour investir sereinement depuis l\'étranger.',
          href: '/diaspora/guide',
          features: ['Guides complets', 'Conseils juridiques', 'Support 24/7']
        }
      ]
    },
    {
      id: 'professionnels',
      title: 'Pour Professionnels',
      subtitle: 'Outils avancés pour les métiers de l\'immobilier',
      icon: Building,
      color: 'blue',
      bgGradient: 'from-blue-50 to-cyan-50',
      iconBg: 'bg-blue-600',
      solutions: [
        {
          title: 'Promoteurs Immobiliers',
          description: 'Gestion complète de vos projets immobiliers et fonciers.',
          href: '/promoteurs',
          features: ['Gestion de projets', 'Analyse marché', 'Outils financiers']
        },
        {
          title: 'Banques & Finances',
          description: 'Évaluez les garanties et analysez les risques fonciers.',
          href: '/banques',
          features: ['Évaluation risques', 'Due diligence', 'Reporting avancé']
        },
        {
          title: 'Notaires',
          description: 'Authentifiez les actes et consultez les archives numériques.',
          href: '/notaires',
          features: ['Archives digitales', 'Authentification', 'Blockchain']
        }
      ]
    },
    {
      id: 'services',
      title: 'Services Spécialisés',
      subtitle: 'Expertise technique et accompagnement',
      icon: Shield,
      color: 'purple',
      bgGradient: 'from-purple-50 to-pink-50',
      iconBg: 'bg-purple-600',
      solutions: [
        {
          title: 'Géomètres Experts',
          description: 'Services de bornage, mesures et certification topographique.',
          href: '/geometres',
          features: ['Bornage précis', 'Certifications', 'Technologies GPS']
        },
        {
          title: 'Agents Fonciers',
          description: 'Accompagnement personnalisé dans vos démarches foncières.',
          href: '/agents-fonciers',
          features: ['Accompagnement', 'Expertise locale', 'Négociation']
        },
        {
          title: 'Carte Interactive',
          description: 'Explorez les zones disponibles avec notre carte satellite avancée.',
          href: '/carte-interactive',
          features: ['Vue satellite', 'Zonage détaillé', 'Analyses terrain']
        }
      ]
    }
  ];

  const stats = [
    { label: 'Terrains Vérifiés', value: '2,500+', icon: CheckCircle },
    { label: 'Clients Satisfaits', value: '1,200+', icon: Star },
    { label: 'Transactions Sécurisées', value: '850+', icon: Shield },
    { label: 'Fraudes Évitées', value: '100%', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Nos Solutions
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Des solutions innovantes pour tous les acteurs de l'écosystème foncier sénégalais
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index, duration: 0.6 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                  <div className="text-blue-100 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-16"
          >
            {solutionCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                className={`bg-gradient-to-br ${category.bgGradient} rounded-3xl p-8 relative overflow-hidden`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.3)_1px,transparent_0)] bg-[16px_16px]"></div>
                </div>
                
                <div className="relative">
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`w-16 h-16 ${category.iconBg} rounded-2xl flex items-center justify-center`}>
                      <category.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold text-gray-900">{category.title}</h2>
                        {category.isNew && (
                          <Badge className="bg-emerald-500 text-white">Nouveau</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-lg mt-1">{category.subtitle}</p>
                    </div>
                  </div>

                  {/* Solutions Grid */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {category.solutions.map((solution, index) => (
                      <Card 
                        key={solution.title}
                        className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
                              {solution.title}
                            </CardTitle>
                            {solution.isNew && (
                              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs">
                                Nouveau
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mt-2">{solution.description}</p>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          {/* Features */}
                          <div className="space-y-2 mb-6">
                            {solution.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm text-gray-600">{feature}</span>
                              </div>
                            ))}
                          </div>

                          <Button asChild className="w-full group">
                            <Link to={solution.href}>
                              Découvrir
                              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
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
              Prêt à Révolutionner Votre Expérience Foncière ?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Rejoignez des milliers d'utilisateurs qui font confiance à Teranga Foncier
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="min-w-[200px]">
                <Link to="/register">
                  Commencer Maintenant
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
  );
};

export default SolutionsPage;
