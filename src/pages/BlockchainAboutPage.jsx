import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Blocks, 
  Target, 
  Users, 
  Globe, 
  Award, 
  TrendingUp, 
  Shield, 
  Rocket, 
  Heart, 
  Star,
  Brain,
  Database,
  Eye,
  Zap,
  Building,
  Landmark,
  CheckCircle,
  ArrowRight,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Quote
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';

const BlockchainAboutPage = () => {
  const [activeTimeline, setActiveTimeline] = useState(0);

  const companyStats = [
    { label: "Années d'Expérience", value: "5+", icon: Calendar, color: "text-blue-600" },
    { label: "Transactions Blockchain", value: "2.8K+", icon: Database, color: "text-purple-600" },
    { label: "Clients Satisfaits", value: "8.2K+", icon: Users, color: "text-green-600" },
    { label: "Pays Couverts", value: "50+", icon: Globe, color: "text-orange-600" },
    { label: "Smart Contracts", value: "892", icon: Zap, color: "text-cyan-600" },
    { label: "Projets Surveillés", value: "456", icon: Eye, color: "text-pink-600" }
  ];

  const coreValues = [
    {
      icon: Shield,
      title: "Sécurité Blockchain",
      description: "Nous utilisons la technologie blockchain pour garantir la sécurité et la transparence de toutes les transactions immobilières.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Heart,
      title: "Impact Social",
      description: "Notre mission est de démocratiser l'accès Ï  la propriété foncière pour tous les Sénégalais, notamment la diaspora.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: Brain,
      title: "Innovation IA",
      description: "L'intelligence artificielle guide nos décisions et améliore continuellement l'expérience utilisateur.",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Globe,
      title: "Vision Globale",
      description: "Nous connectons le Sénégal au monde en facilitant les investissements immobiliers transfrontaliers.",
      color: "from-emerald-500 to-teal-500"
    }
  ];

  const timeline = [
    {
      year: "2019",
      title: "Création de Teranga Foncier",
      description: "Lancement de la première plateforme immobilière digitale du Sénégal",
      icon: Rocket,
      color: "bg-blue-500"
    },
    {
      year: "2020",
      title: "Partenariats Institutionnels",
      description: "Signature d'accords avec les principales mairies du Sénégal",
      icon: Landmark,
      color: "bg-emerald-500"
    },
    {
      year: "2021",
      title: "Expansion Diaspora",
      description: "Ouverture des services Ï  la diaspora sénégalaise mondiale",
      icon: Globe,
      color: "bg-purple-500"
    },
    {
      year: "2022",
      title: "Intelligence Artificielle",
      description: "Intégration de l'IA pour le suivi de construction par satellite",
      icon: Brain,
      color: "bg-orange-500"
    },
    {
      year: "2023",
      title: "Blockchain & NFT",
      description: "Lancement des titres de propriété tokenisés sur blockchain",
      icon: Blocks,
      color: "bg-indigo-500"
    },
    {
      year: "2024",
      title: "Smart Contracts",
      description: "Déploiement des contrats intelligents pour l'automatisation",
      icon: Zap,
      color: "bg-cyan-500"
    }
  ];

  const teamMembers = [
    {
      name: "Abdoulaye Diémé",
      role: "Fondateur & CEO",
      speciality: "Blockchain & Développement Full-Stack",
      experience: "8+ ans",
      education: "Expert en Technologies Web & Blockchain",
      image: "/api/YOUR_API_KEY/120/120",
      color: "from-blue-500 to-purple-500",
      description: "Entrepreneur passionné et développeur full-stack expérimenté, Abdoulaye révolutionne l'immobilier sénégalais en combinant blockchain et intelligence artificielle pour démocratiser l'accès au foncier."
    }
  ];

  const partnerships = [
    { name: "Ministère de l'Urbanisme", type: "Institution", logo: "/api/YOUR_API_KEY/80/80" },
    { name: "Banque Atlantique", type: "Financier", logo: "/api/YOUR_API_KEY/80/80" },
    { name: "Ethereum Foundation", type: "Technologique", logo: "/api/YOUR_API_KEY/80/80" },
    { name: "APIX", type: "Promotion Investissement", logo: "/api/YOUR_API_KEY/80/80" },
    { name: "Chambre de Commerce", type: "Business", logo: "/api/YOUR_API_KEY/80/80" },
    { name: "Ordre des Notaires", type: "Juridique", logo: "/api/YOUR_API_KEY/80/80" }
  ];

  const testimonials = [
    {
      quote: "Teranga Foncier a révolutionné notre façon de gérer les terrains communaux. La blockchain apporte une transparence inégalée.",
      author: "Maire de Guédiawaye",
      role: "Autorité Municipale",
      rating: 5
    },
    {
      quote: "Grâce Ï  leur plateforme, j'ai pu investir depuis la France en toute sérénité. Le suivi IA de ma construction est exceptionnel.",
      author: "Aminata Diallo",
      role: "Diaspora - Paris",
      rating: 5
    },
    {
      quote: "Les smart contracts ont simplifié nos processus d'évaluation et de financement. Un vrai game-changer pour le secteur bancaire.",
      author: "Directeur Crédit Immobilier",
      role: "Banque Atlantique",
      rating: 5
    }
  ];

  return (
    <>
      <SEO 
        title="À Propos - Notre Mission pour le Foncier au Sénégal"
        description="Découvrez la mission de Teranga Foncier : sécuriser le marché immobilier sénégalais avec la blockchain. Notre vision, notre équipe et notre technologie au service du foncier."
        keywords="mission teranga foncier, vision immobilier sénégal, équipe blockchain, histoire foncier sénégal, à propos de nous"
        canonicalUrl="https://www.terangafoncier.sn/about"
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-6 py-2">
                <Blocks className="w-4 h-4 mr-2" />
                Pionnier Blockchain Immobilier
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Révolutionner l'Immobilier
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  par la Blockchain
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
                Depuis 2019, nous connectons le Sénégal au monde grâce Ï  la première plateforme 
                blockchain immobilière d'Afrique de l'Ouest
              </p>

              {/* Company Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
                {companyStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                      <CardContent className="p-4 text-center">
                        <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                        <div className="text-xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-white/70">{stat.label}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Notre Mission & Vision
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Démocratiser l'accès Ï  la propriété foncière grâce Ï  la technologie blockchain
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-0 bg-gradient-to-br from-blue-50 to-purple-50 p-8">
                  <CardHeader className="pb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                      <Target className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Notre Mission</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      Faciliter l'accès Ï  la propriété foncière pour tous les Sénégalais, 
                      qu'ils vivent au pays ou Ï  l'étranger, en utilisant la technologie blockchain 
                      pour garantir transparence, sécurité et efficacité dans toutes les transactions immobilières.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="border-0 bg-gradient-to-br from-emerald-50 to-teal-50 p-8">
                  <CardHeader className="pb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mb-4">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Notre Vision</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      Devenir la référence africaine en matière de technologie blockchain appliquée 
                      Ï  l'immobilier, en créant un écosystème où chaque citoyen peut investir, 
                      construire et prospérer grâce Ï  des outils numériques innovants.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Nos Valeurs Fondamentales
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Les principes qui guident notre action quotidienne et notre vision de l'innovation
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {coreValues.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-0">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${value.color} flex items-center justify-center mb-6`}>
                        <value.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Notre Parcours d'Innovation
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                5 années d'évolution continue vers l'excellence technologique
              </p>
            </motion.div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>

              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                          <Badge className="mb-3 bg-blue-100 text-blue-800 border-0">
                            {item.year}
                          </Badge>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-gray-600">{item.description}</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Timeline Node */}
                    <div className="relative z-10">
                      <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center shadow-lg`}>
                        <item.icon className="h-8 w-8 text-white" />
                      </div>
                    </div>

                    <div className="w-1/2"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Le Fondateur
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Un entrepreneur visionnaire qui révolutionne l'immobilier sénégalais
              </p>
            </motion.div>

            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-md"
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <CardContent className="p-8 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden">
                      <img 
                        src="/api/YOUR_API_KEY/120/120" 
                        alt="Abdoulaye Diémé"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Abdoulaye Diémé</h3>
                    <p className="text-blue-600 font-medium mb-4">Fondateur & CEO</p>
                    
                    <div className="space-y-3 mb-6 text-sm text-gray-600">
                      <div className="flex items-center justify-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span>Blockchain & Développement Full-Stack</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>8+ ans d'expérience</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        <span>Expert en Technologies Web & Blockchain</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Entrepreneur passionné et développeur full-stack expérimenté, Abdoulaye révolutionne 
                      l'immobilier sénégalais en combinant blockchain et intelligence artificielle pour 
                      démocratiser l'accès au foncier.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Partnerships */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Nos Partenaires de Confiance
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Un écosystème collaboratif pour révolutionner l'immobilier au Sénégal
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {partnerships.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <Card className="hover:shadow-lg transition-all duration-300 border-0">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                        <img 
                          src={partner.logo} 
                          alt={partner.name}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">{partner.name}</h4>
                      <p className="text-xs text-gray-500">{partner.type}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {}
        <section className="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Ce Que Disent Nos Partenaires
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                La confiance de nos clients et partenaires institutionnels
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card className="bg-white/10 backdrop-blur-lg border-white/20 h-full">
                    <CardContent className="p-6">
                      <Quote className="h-8 w-8 text-white/50 mb-4" />
                      <p className="text-white/90 italic mb-6 leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{testimonial.author}</div>
                        <div className="text-white/70 text-sm">{testimonial.role}</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Rejoignez la Révolution Blockchain
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Découvrez comment notre technologie peut transformer votre projet immobilier au Sénégal
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold"
                >
                  <Link to="/register">
                    Commencer Maintenant
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <Button 
                  asChild
                  variant="outline" 
                  size="lg"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
                >
                  <Link to="/contact">
                    Discuter avec un Expert
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

export default BlockchainAboutPage;
