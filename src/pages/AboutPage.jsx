import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  User,
  Code,
  Briefcase,
  Shield,
  Target,
  Users,
  Award,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  CheckCircle2,
  ArrowRight,
  Linkedin,
  Github,
  Globe
} from 'lucide-react';

const AboutPage = () => {
  const achievements = [
    {
      icon: Code,
      title: "Développeur Full-Stack",
      description: "Expert en technologies modernes : React, Node.js, Python, PostgreSQL"
    },
    {
      icon: Briefcase,
      title: "Chef de Projet Digital",
      description: "Gestion de projets complexes avec méthodologies agiles"
    },
    {
      icon: Shield,
      title: "Lutte contre la fraude",
      description: "Spécialiste en sécurisation des transactions foncières"
    },
    {
      icon: Target,
      title: "Vision claire",
      description: "Démocratiser l'accès au foncier pour tous les Sénégalais"
    }
  ];

  const missions = [
    {
      icon: Shield,
      title: "Sécuriser les transactions",
      description: "Vérifications approfondies de tous les titres fonciers et documents légaux"
    },
    {
      icon: Users,
      title: "Accompagner la diaspora",
      description: "Faciliter l'investissement foncier pour les Sénégalais de l'étranger"
    },
    {
      icon: CheckCircle2,
      title: "Garantir la transparence",
      description: "Processus transparent avec suivi en temps réel de chaque transaction"
    },
    {
      icon: Globe,
      title: "Moderniser le secteur",
      description: "Digitalisation complète du marché foncier sénégalais"
    }
  ];

  const timeline = [
    {
      date: "Septembre 2024",
      title: "Fondation de Teranga Foncier",
      description: "Lancement de la plateforme avec la vision de révolutionner le marché foncier sénégalais"
    },
    {
      date: "Octobre 2024",
      title: "Premiers partenariats",
      description: "Collaboration avec notaires, géomètres et agents fonciers certifiés"
    },
    {
      date: "Novembre 2024",
      title: "Expansion régionale",
      description: "Extension des services à toutes les régions du Sénégal"
    },
    {
      date: "Décembre 2024",
      title: "Innovation technologique",
      description: "Intégration IA et blockchain pour plus de sécurité"
    }
  ];

  const stats = [
    { number: "2024", label: "Année de fondation" },
    { number: "1000+", label: "Utilisateurs actifs" },
    { number: "500+", label: "Terrains vérifiés" },
    { number: "98%", label: "Taux de satisfaction" }
  ];

  return (
    <>
      <Helmet>
        <title>À propos - Abdoulaye Dièmé, Fondateur | Teranga Foncier</title>
        <meta name="description" content="Découvrez l'histoire d'Abdoulaye Dièmé, développeur Full-Stack et fondateur de Teranga Foncier. Notre mission : lutter contre la fraude foncière au Sénégal." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pt-20">
        
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                À propos de Teranga Foncier
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Une vision, une mission : révolutionner le marché foncier sénégalais
              </p>
              
              {/* Stats */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                  >
                    <div className="text-2xl font-bold">{stat.number}</div>
                    <div className="text-sm opacity-80">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop&crop=face"
                    alt="Abdoulaye Dièmé, Fondateur de Teranga Foncier"
                    className="rounded-2xl shadow-xl w-full max-w-md mx-auto"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <Award className="h-8 w-8 text-blue-600" />
                      <div>
                        <div className="font-semibold text-gray-900">Fondateur</div>
                        <div className="text-sm text-gray-600">Septembre 2024</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Badge className="bg-blue-100 text-blue-800 mb-4">Fondateur & CEO</Badge>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Abdoulaye Dièmé
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Développeur Full-Stack passionné et Chef de Projet Digital expérimenté, 
                  j'ai fondé Teranga Foncier en septembre 2024 avec une mission claire : 
                  <strong className="text-gray-900"> lutter contre la fraude foncière au Sénégal</strong> 
                  en démocratisant l'accès à un marché immobilier transparent et sécurisé.
                </p>
                
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Fort de mon expertise en technologies modernes et de ma compréhension 
                  profonde des défis du marché foncier sénégalais, j'ai créé une plateforme 
                  qui combine innovation technologique et excellence du service pour offrir 
                  à chaque Sénégalais, qu'il soit au pays ou dans la diaspora, 
                  la possibilité d'investir en toute confiance.
                </p>

                {/* Achievements */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-white shadow-sm"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <achievement.icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{achievement.title}</div>
                        <div className="text-xs text-gray-600">{achievement.description}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Contact Info */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                    <a href="mailto:contact@terangafoncier.com">
                      <Mail className="h-4 w-4 mr-2" />
                      Me contacter
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="tel:+221775934241">
                      <Phone className="h-4 w-4 mr-2" />
                      +221 77 593 42 41
                    </a>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Notre Mission
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Révolutionner le marché foncier sénégalais par la technologie et la transparence
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {missions.map((mission, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group border-t-4 border-t-blue-500">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                        <mission.icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg text-gray-900">{mission.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 text-center">
                      <p className="text-gray-600">{mission.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Notre Parcours
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Les étapes clés de notre développement
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200"></div>
                
                <div className="space-y-8">
                  {timeline.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="relative flex items-start gap-6"
                    >
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 relative z-10">
                        {index + 1}
                      </div>
                      <div className="bg-white rounded-lg p-6 shadow-md flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-600">{item.date}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Nos Valeurs
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Les principes qui guident chacune de nos actions
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Intégrité</h3>
                <p className="text-gray-600">
                  Transparence totale dans nos processus et nos tarifs. 
                  Nous nous engageons à fournir des informations exactes et vérifiées.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Engagement</h3>
                <p className="text-gray-600">
                  Dédié au service de la communauté sénégalaise, nous mettons 
                  notre expertise au service de votre réussite.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-10 w-10 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Excellence</h3>
                <p className="text-gray-600">
                  Recherche constante de l'amélioration de nos services pour 
                  offrir la meilleure expérience utilisateur.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">
                Rejoignez notre communauté
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Faites partie de la révolution du marché foncier sénégalais
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold" asChild>
                  <Link to="/register">
                    <Users className="h-5 w-5 mr-2" />
                    Créer un compte
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold" asChild>
                  <Link to="/contact">
                    <Mail className="h-5 w-5 mr-2" />
                    Nous contacter
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

export default AboutPage;
