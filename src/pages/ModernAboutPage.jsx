import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Target, 
  Eye, 
  ShieldCheck, 
  Linkedin, 
  ArrowRight,
  Award,
  Globe,
  TrendingUp,
  Zap,
  Heart,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Building,
  Landmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ModernAboutPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const teamMember = {
    name: "Abdoulaye Diémé",
    role: "Fondateur & CEO",
    imgUrl: "https://horizons-cdn.hostinger.com/bcc20f7d-f81b-4a6f-9229-7d6ba486204e/b56900731c6de95f42d124444209a813.jpg",
    imgAlt: "Portrait d'Abdoulaye Diémé, fondateur de Teranga Foncier",
    linkedin: "https://www.linkedin.com/in/abdoulaye-di%C3%A9m%C3%A9-58136a1b1/",
    phone: "+221 77 593 42 41",
    email: "contact@terangafoncier.com",
    bio: "Visionnaire passionné de technologie et d'innovation, Abdoulaye Diémé a fondé Teranga Foncier pour démocratiser l'accès au foncier au Sénégal. Fort de plus de 10 ans d'expérience dans le secteur immobilier et technologique, il dirige aujourd'hui la transformation digitale du secteur foncier sénégalais."
  };

  const stats = [
    { number: "2,500+", label: "Terrains Vérifiés", icon: Landmark },
    { number: "1,200+", label: "Clients Satisfaits", icon: Users },
    { number: "45+", label: "Mairies Partenaires", icon: Building },
    { number: "24/7", label: "Support Client", icon: Heart }
  ];

  const values = [
    { 
      icon: ShieldCheck, 
      title: "Sécurité & Transparence", 
      description: "Chaque transaction est vérifiée par nos notaires et géomètres certifiés. Transparence totale sur tous les documents.",
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50"
    },
    { 
      icon: Users, 
      title: "Accessibilité Pour Tous", 
      description: "Que vous soyez au Sénégal ou en diaspora, notre plateforme vous permet d'investir facilement et en toute sécurité.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    { 
      icon: Zap, 
      title: "Innovation Continue", 
      description: "Nous révolutionnons le secteur foncier avec des technologies de pointe : IA, blockchain, réalité virtuelle.",
      color: "from-purple-500 to-indigo-500",
      bgColor: "from-purple-50 to-indigo-50"
    },
    { 
      icon: Globe, 
      title: "Impact Social", 
      description: "Notre mission va au-delà du business : faciliter l'accès à la propriété pour construire un Sénégal plus prospère.",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50"
    }
  ];

  const milestones = [
    { year: "2022", title: "Création de Teranga Foncier", description: "Lancement de la première plateforme foncière digitale du Sénégal" },
    { year: "2023", title: "1000+ Terrains Référencés", description: "Expansion nationale avec présence dans toutes les régions" },
    { year: "2024", title: "Partenariats Institutionnels", description: "Signature d'accords avec 45+ mairies et institutions" },
    { year: "2025", title: "Terrains Intelligents", description: "Lancement des solutions de paiement innovantes et accompagnement IA" }
  ];

  const achievements = [
    "🏆 Plateforme foncière #1 au Sénégal",
    "🌍 Service disponible depuis 50+ pays",
    "⚡ Processus d'achat 10x plus rapide",
    "🔒 0% de fraude sur notre plateforme",
    "💝 95% de satisfaction client",
    "🤝 150+ professionnels partenaires"
  ];

  return (
    <>
      <Helmet>
        <title>À Propos - Révolutionner le Foncier au Sénégal | Teranga Foncier</title>
        <meta name="description" content="Découvrez l'histoire de Teranga Foncier, la première plateforme foncière digitale du Sénégal. Notre mission : démocratiser l'accès à la propriété foncière." />
        <meta name="keywords" content="mission Teranga Foncier, Abdoulaye Diémé CEO, innovation foncier Sénégal, transformation digitale, investissement terrain" />
        <link rel="canonical" href="https://www.terangafoncier.com/about" />
      </Helmet>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-background"
      >
        {/* Hero Section */}
        <motion.section
          variants={itemVariants}
          className="relative pt-32 pb-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 overflow-hidden"
        >
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200">
                Innovation & Leadership
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                Révolutionner le 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600"> Foncier</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Nous transformons l'achat et la vente de terrains au Sénégal grâce à la technologie, 
                rendant l'investissement foncier accessible à tous les Sénégalais, ici et dans le monde.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700" asChild>
                  <Link to="/parcelles">
                    Voir Nos Terrains
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/contact">
                    Nous Contacter
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          variants={itemVariants}
          className="py-16 bg-white"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Founder Section */}
        <motion.section
          variants={itemVariants}
          className="py-20 bg-gray-50"
        >
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    alt={teamMember.imgAlt}
                    className="w-full h-[500px] object-cover"
                    src={teamMember.imgUrl} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold">{teamMember.name}</h3>
                    <p className="text-lg opacity-90">{teamMember.role}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Le Visionnaire</h2>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    {teamMember.bio}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Nos Réalisations</h3>
                  <div className="grid gap-3">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-lg">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700" asChild>
                    <a href={`tel:${teamMember.phone}`}>
                      <Phone className="mr-2 w-4 h-4" />
                      {teamMember.phone}
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={teamMember.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="mr-2 w-4 h-4" />
                      LinkedIn
                    </a>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section
          variants={itemVariants}
          className="py-20 bg-white"
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Nos <span className="text-emerald-600">Valeurs</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Ce qui nous guide chaque jour pour servir nos clients avec excellence
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={`p-6 h-full bg-gradient-to-br ${value.bgColor} border-0 shadow-lg hover:shadow-xl transition-shadow`}>
                    <CardContent className="p-0">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${value.color} rounded-xl flex items-center justify-center`}>
                          <value.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Timeline Section */}
        <motion.section
          variants={itemVariants}
          className="py-20 bg-gray-50"
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Notre <span className="text-emerald-600">Parcours</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Les étapes clés de notre croissance et de notre impact
              </p>
            </motion.div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-400"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    <div className="w-1/2 px-6">
                      <Card className="p-6 shadow-lg border-0 bg-white">
                        <CardContent className="p-0">
                          <div className="flex items-center gap-3 mb-3">
                            <Calendar className="w-5 h-5 text-emerald-600" />
                            <Badge className="bg-emerald-100 text-emerald-700">{milestone.year}</Badge>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                          <p className="text-gray-600">{milestone.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="relative">
                      <div className="w-4 h-4 bg-emerald-500 rounded-full border-4 border-white shadow-lg"></div>
                    </div>
                    
                    <div className="w-1/2"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          variants={itemVariants}
          className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600"
        >
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Rejoignez la Révolution Foncière
              </h2>
              <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
                Que vous soyez investisseur, professionnel ou particulier, 
                découvrez comment Teranga Foncier peut transformer votre expérience foncière.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600" asChild>
                  <Link to="/parcelles">
                    Explorer les Terrains
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100" asChild>
                  <Link to="/rejoignez-nous">
                    Devenir Partenaire
                    <Users className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </motion.div>
    </>
  );
};

export default ModernAboutPage;
