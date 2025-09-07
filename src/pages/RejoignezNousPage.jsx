import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Star, 
  Globe, 
  Award, 
  Zap, 
  Building2, 
  Home, 
  Briefcase, 
  Calculator, 
  Target, 
  Shield, 
  Heart, 
  TrendingUp, 
  Eye, 
  FileText, 
  Send
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet-async';

const RejoignezNousPage = () => {
  const [activeRole, setActiveRole] = useState(0);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    role: '',
    entreprise: '',
    localisation: '',
    experience: '',
    message: ''
  });

  const roles = [
    {
      title: "Diaspora",
      icon: Globe,
      description: "Investir depuis l'étranger",
      benefits: ["Achat à distance sécurisé", "Suivi construction 24/7", "Garanties internationales", "Support multilingue"],
      color: "from-blue-500 to-cyan-500",
      link: "/diaspora",
      commission: "Service gratuit"
    },
    {
      title: "Banques",
      icon: Building2,
      description: "Partenariat financier",
      benefits: ["15K+ clients qualifiés", "ROI +34% prouvé", "API intégration", "Co-marketing premium"],
      color: "from-emerald-500 to-teal-500",
      link: "/banques",
      commission: "Partenariat exclusif"
    },
    {
      title: "Notaires",
      icon: FileText,
      description: "Digitaliser votre étude",
      benefits: ["+156% croissance digitale", "Dossiers OHADA intégrés", "Signature électronique", "Formation incluse"],
      color: "from-purple-500 to-indigo-500",
      link: "/notaires",
      commission: "2-4% par acte"
    },
    {
      title: "Géomètres",
      icon: Target,
      description: "Équipements et missions",
      benefits: ["Drones/GPS fournis", "+234% missions", "Formation technique", "Couverture territoriale"],
      color: "from-orange-500 to-red-500",
      link: "/geometres",
      commission: "40-60% missions"
    },
    {
      title: "Agents Fonciers",
      icon: Home,
      description: "Réseau immobilier",
      benefits: ["Territoire exclusif", "+278% revenus", "CRM professionnel", "Formation commerciale"],
      color: "from-pink-500 to-rose-500",
      link: "/agents-fonciers",
      commission: "3-7% commission"
    },
    {
      title: "Vendeurs",
      icon: Users,
      description: "Vendre votre bien",
      benefits: ["Estimation IA gratuite", "Marketing diaspora", "Prix optimisé +34%", "Vente garantie"],
      color: "from-yellow-500 to-orange-500",
      link: "/vendeurs",
      commission: "3% commission"
    },
    {
      title: "Promoteurs",
      icon: Building2,
      description: "Booster vos ventes",
      benefits: ["15K+ diaspora", "+245% pré-ventes", "Marketing 360°", "Garantie objectifs"],
      color: "from-indigo-500 to-purple-500",
      link: "/promoteurs",
      commission: "2-7% selon package"
    }
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: "Appelez-nous",
      content: "+221 77 593 42 41",
      description: "Lun-Ven 8h-18h, Sam 9h-13h",
      action: "tel:+221775934241"
    },
    {
      icon: Mail,
      title: "Écrivez-nous",
      content: "contact@terangafoncier.com",
      description: "Réponse sous 2h en semaine",
      action: "mailto:contact@terangafoncier.com"
    },
    {
      icon: MessageSquare,
      title: "Chat en direct",
      content: "Support instantané",
      description: "Disponible 7j/7 de 8h à 22h",
      action: "#chat"
    },
    {
      icon: MapPin,
      title: "Bureau principal",
      content: "Almadies, Dakar",
      description: "Rendez-vous sur RDV uniquement",
      action: "#"
    }
  ];

  const whyJoinReasons = [
    {
      icon: TrendingUp,
      title: "Leader du marché",
      description: "N°1 de l'immobilier diaspora avec 15,000+ clients actifs",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Sécurité garantie",
      description: "Transactions sécurisées, assurances, garanties légales",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Zap,
      title: "Innovation technologique",
      description: "IA, blockchain, réalité virtuelle pour l'immobilier de demain",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Award,
      title: "Expertise reconnue",
      description: "15 ans d'expérience, équipe de 50+ professionnels",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Globe,
      title: "Réseau international",
      description: "Présence dans 25+ pays, partenariats mondiaux",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Heart,
      title: "Impact social",
      description: "Développement économique du Sénégal par la diaspora",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const testimonials = [
    {
      name: "Mamadou Diallo",
      role: "Agent Foncier - Thiès",
      avatar: "MD",
      content: "En 8 mois avec Teranga, j'ai triplé mes revenus. Le territoire exclusif et les outils CRM changent tout.",
      rating: 5,
      commission: "+278% revenus"
    },
    {
      name: "Dr. Aïcha Ndiaye",
      role: "Notaire - Dakar",
      avatar: "AN",
      content: "La digitalisation de mon étude m'a fait gagner 60% de temps. Les formations sont excellentes.",
      rating: 5,
      commission: "+156% croissance"
    },
    {
      name: "Ibrahima Sarr",
      role: "Géomètre - Saint-Louis",
      avatar: "IS",
      content: "Équipements fournis, missions garanties. J'ai quadruplé mon activité en 6 mois.",
      rating: 5,
      commission: "+234% missions"
    },
    {
      name: "Groupe SOPIC",
      role: "Promoteur - Saly",
      avatar: "SP",
      content: "85% de pré-commercialisation grâce au réseau diaspora. ROI exceptionnel.",
      rating: 5,
      commission: "+267% performance"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <>
      <Helmet>
        <title>Rejoignez-nous - Teranga Foncier | Devenez partenaire du leader immobilier diaspora</title>
        <meta name="description" content="Rejoignez le réseau Teranga Foncier : 7 façons de collaborer, 15K+ clients diaspora, formations incluses, commissions attractives. Candidature en 2 minutes." />
        <meta property="og:title" content="Rejoignez-nous - Opportunités partenariat immobilier" />
        <meta property="og:description" content="Diaspora, banques, notaires, géomètres, agents, vendeurs, promoteurs : trouvez votre place dans l'écosystème leader." />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 pt-24 pb-20">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.08'%3E%3Cpath d='M0 0h60v60H0V0zm30 30h30v30H30V30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 text-lg font-medium">
                  🚀 Rejoignez l'écosystème leader
                </Badge>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900">
                  Construisons l'avenir de{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    l'immobilier
                  </span>
                  <br />
                  ensemble
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                  7 façons de collaborer avec le leader de l'immobilier diaspora. 
                  15,000+ clients, formations incluses, commissions attractives.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg"
                    onClick={() => FileText.getElementById('roles').scrollIntoView({ behavior: 'smooth' })}
                  >
                    Découvrir les opportunités
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
                    onClick={() => FileText.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })}
                  >
                    Candidature express
                    <Send className="ml-2 w-5 h-5" />
                  </Button>
                </div>

                {/* Trust Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">15K+</div>
                    <div className="text-sm text-gray-600">Clients diaspora</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">50+</div>
                    <div className="text-sm text-gray-600">Professionnels</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">25+</div>
                    <div className="text-sm text-gray-600">Pays couverts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">15</div>
                    <div className="text-sm text-gray-600">Ans d'expérience</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pourquoi nous rejoindre */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Pourquoi rejoindre Teranga Foncier ?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Plus qu'un partenariat, une opportunité de croissance exceptionnelle
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {whyJoinReasons.map((reason, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${reason.color} flex items-center justify-center mx-auto mb-4`}>
                        <reason.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {reason.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {reason.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Roles et Opportunités */}
        <section id="roles" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                7 façons de collaborer avec nous
              </h2>
              <p className="text-xl text-gray-600">
                Trouvez l'opportunité qui correspond à votre profil et vos objectifs
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Roles List */}
              <div className="space-y-4">
                {roles.map((role, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`cursor-pointer transition-all duration-300 ${
                      activeRole === index ? 'scale-105' : ''
                    }`}
                    onClick={() => setActiveRole(index)}
                  >
                    <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                      activeRole === index ? 'ring-2 ring-blue-500 shadow-2xl' : ''
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${role.color} flex items-center justify-center flex-shrink-0`}>
                            <role.icon className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="text-xl font-bold text-gray-900">
                                {role.title}
                              </h3>
                              <Badge className="bg-green-500 text-white text-xs">
                                {role.commission}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-2">
                              {role.description}
                            </p>
                            {activeRole === index && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                                className="space-y-2 mt-3"
                              >
                                {role.benefits.map((benefit, bIndex) => (
                                  <div key={bIndex} className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-sm text-gray-700">{benefit}</span>
                                  </div>
                                ))}
                                <div className="flex gap-2 mt-4">
                                  <Button 
                                    asChild
                                    size="sm"
                                    className={`bg-gradient-to-r ${role.color} text-white`}
                                  >
                                    <Link to={role.link}>En savoir plus</Link>
                                  </Button>
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setFormData(prev => ({ ...prev, role: role.title }));
                                      FileText.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' });
                                    }}
                                  >
                                    Postuler
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Role Details */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:sticky lg:top-8"
              >
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                  <div className="text-center">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${roles[activeRole].color} flex items-center justify-center mx-auto mb-6`}>
                      {React.createElement(roles[activeRole].icon, { className: "w-10 h-10 text-white" })}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {roles[activeRole].title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {roles[activeRole].description}
                    </p>
                    <Badge className="bg-green-500 text-white mb-6">
                      {roles[activeRole].commission}
                    </Badge>
                    <div className="space-y-3 mb-6">
                      {roles[activeRole].benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        asChild
                        className={`flex-1 bg-gradient-to-r ${roles[activeRole].color} text-white hover:opacity-90`}
                      >
                        <Link to={roles[activeRole].link}>
                          Découvrir
                          <Eye className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                      <Button 
                        className="flex-1"
                        variant="outline"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, role: roles[activeRole].title }));
                          FileText.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Candidater
                        <Send className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Témoignages */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Ils ont rejoint notre réseau
              </h2>
              <p className="text-xl text-gray-600">
                Découvrez les succès de nos partenaires
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {testimonial.avatar}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                          <p className="text-sm text-gray-600">{testimonial.role}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <Badge className="bg-green-500 text-white text-xs">
                          {testimonial.commission}
                        </Badge>
                      </div>
                      <p className="text-gray-700 italic leading-relaxed">
                        "{testimonial.content}"
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Plusieurs façons de nous contacter
              </h2>
              <p className="text-xl text-gray-600">
                Choisissez le canal qui vous convient le mieux
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                        <method.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {method.title}
                      </h3>
                      <p className="text-lg font-semibold text-blue-600 mb-2">
                        {method.content}
                      </p>
                      <p className="text-sm text-gray-600">
                        {method.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact-form" className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Candidature express
              </h2>
              <p className="text-xl text-gray-600">
                Rejoignez notre réseau en 2 minutes. Réponse sous 24h garantie.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          name="nom"
                          value={formData.nom}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Votre nom complet"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+221 XX XXX XX XX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rôle d'intérêt *
                        </label>
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Sélectionnez un rôle</option>
                          {roles.map((role, index) => (
                            <option key={index} value={role.title}>{role.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Entreprise/Organisation
                        </label>
                        <input
                          type="text"
                          name="entreprise"
                          value={formData.entreprise}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nom de votre entreprise"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Localisation *
                        </label>
                        <input
                          type="text"
                          name="localisation"
                          value={formData.localisation}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ville, Pays"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expérience professionnelle
                      </label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Sélectionnez votre expérience</option>
                        <option value="debutant">Débutant (0-2 ans)</option>
                        <option value="intermediaire">Intermédiaire (3-7 ans)</option>
                        <option value="experimente">Expérimenté (8-15 ans)</option>
                        <option value="expert">Expert (15+ ans)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message (optionnel)
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Parlez-nous de votre projet, vos objectifs, vos questions..."
                      ></textarea>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="terms"
                        required
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-700">
                        J'accepte les{" "}
                        <Link to="/mentions-legales" className="text-blue-600 hover:underline">
                          conditions générales
                        </Link>{" "}
                        et la{" "}
                        <Link to="/confidentialite" className="text-blue-600 hover:underline">
                          politique de confidentialité
                        </Link>
                      </label>
                    </div>

                    <Button 
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold"
                    >
                      Envoyer ma candidature
                      <Send className="ml-2 w-5 h-5" />
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Réponse sous 24h</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span>Données sécurisées</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <span>Sans engagement</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
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
                Votre réussite commence aujourd'hui
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Rejoignez l'écosystème qui transforme l'immobilier sénégalais. 
                15,000+ professionnels nous font déjà confiance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg"
                  onClick={() => FileText.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })}
                >
                  Candidature express
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg" 
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
                  onClick={() => FileText.getElementById('roles').scrollIntoView({ behavior: 'smooth' })}
                >
                  Explorer les rôles
                  <Eye className="ml-2 w-5 h-5" />
                </Button>
              </div>
              
              {/* Contact Info */}
              <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>contact@terangafoncier.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>+221 77 593 42 41</span>
                </div>
              </div>
              
              {/* Guarantee */}
              <div className="mt-8 inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <Clock className="w-5 h-5" />
                <span className="text-sm">Réponse garantie sous 24h • Sans engagement</span>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default RejoignezNousPage;
