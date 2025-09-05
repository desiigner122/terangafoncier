
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Banknote, 
  Building2, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  Globe2, 
  Home, 
  Camera, 
  Shield, 
  Zap
} from 'lucide-react';

const solutions = [
  {
    icon: Banknote,
    title: "Pour les Banques",
    description: "Évaluation de garanties foncières, suivi de portefeuille d'actifs, diligence raisonnable accélérée et sécurisée.",
    link: "/solutions/banques",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    cta: "Découvrir les outils bancaires",
    features: ["Évaluation automatisée", "Portfolio tracking", "Due diligence rapide"]
  },
  {
    icon: Building2,
    title: "Pour les Promoteurs",
    description: "Identification de terrains stratégiques, gestion projets diaspora, construction à distance avec suivi temps réel.",
    link: "/solutions/promoteurs",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    cta: "Explorer les solutions promoteurs",
    features: ["Terrains stratégiques", "Projets diaspora", "Suivi temps réel"],
    isNew: true
  },
  {
    icon: TrendingUp,
    title: "Pour les Investisseurs",
    description: "Accès à des opportunités foncières vérifiées, analyse de rendement potentiel, constitution de portefeuille diversifié.",
    link: "/solutions/investisseurs",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    cta: "Voir les opportunités",
    features: ["Opportunités vérifiées", "Analyse ROI", "Portfolio diversifié"]
  },
  {
    icon: Users,
    title: "Pour les Vendeurs",
    description: "Vendez votre bien rapidement au meilleur prix. Touchez des milliers d'acheteurs qualifiés au Sénégal et dans la diaspora.",
    link: "/solutions/vendeurs",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    cta: "Découvrir les avantages",
    features: ["Vente rapide", "Prix optimal", "Marché diaspora"]
  }
];

const diasporaSolutions = [
  {
    icon: Globe2,
    title: "Construction à Distance",
    description: "Construisez votre maison au Sénégal depuis l'étranger avec un suivi en temps réel",
    features: ["Suivi temps réel", "Photos/vidéos", "Paiements sécurisés"],
    color: "text-blue-600",
    bg: "bg-gradient-to-br from-blue-50 to-blue-100"
  },
  {
    icon: Home,
    title: "Gestion de Patrimoine",
    description: "Gérez vos biens immobiliers au Sénégal depuis votre pays de résidence",
    features: ["Gestion locative", "Maintenance", "Reporting mensuel"],
    color: "text-green-600",
    bg: "bg-gradient-to-br from-green-50 to-green-100"
  },
  {
    icon: Camera,
    title: "Visites Virtuelles",
    description: "Visitez et inspectez vos propriétés grâce à la réalité virtuelle",
    features: ["VR immersive", "Visites live", "FileTextation 4K"],
    color: "text-purple-600",
    bg: "bg-gradient-to-br from-purple-50 to-purple-100"
  },
  {
    icon: Shield,
    title: "Sécurité Juridique",
    description: "Protection juridique complète pour tous vos investissements",
    features: ["Conformité légale", "Assurance", "Support 24/7"],
    color: "text-red-600",
    bg: "bg-gradient-to-br from-red-50 to-red-100"
  }
];

const SolutionsOverviewSection = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 }
    })
  };

  return (
    <div className="container mx-auto px-4 space-y-16">
      {/* Solutions Principales */}
      <div>
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Des Solutions Sur Mesure pour Chaque Acteur du Foncier
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Teranga Foncier offre des outils et services spécialisés pour répondre aux besoins spécifiques de chaque acteur, en mettant l'accent sur la sécurité et la transparence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={index}
              className="flex"
            >
              <Card className={`w-full flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ${solution.border} hover:scale-105 transform transition-transform`}>
                <CardHeader className={`p-6 ${solution.bg} relative`}>
                  {solution.isNew && (
                    <Badge className="absolute top-2 right-2 bg-orange-500 text-white">
                      <Zap className="w-3 h-3 mr-1" />
                      Nouveau
                    </Badge>
                  )}
                  <div className={`p-3 rounded-full ${solution.color} bg-white inline-block mb-3 shadow`}>
                    <solution.icon className="h-7 w-7" />
                  </div>
                  <CardTitle className={`text-xl font-semibold ${solution.color}`}>
                    {solution.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex-grow">
                  <CardDescription className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {solution.description}
                  </CardDescription>
                  {solution.features && (
                    <div className="space-y-2">
                      {solution.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-xs text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-current rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <div className="p-6 pt-0">
                  <Button asChild variant="link" className={`p-0 ${solution.color} hover:underline font-medium`}>
                    <Link to={solution.link}>
                      {solution.cta} <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Nouvelles Solutions Diaspora */}
      <div>
        <div className="text-center mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <Zap className="w-4 h-4" />
            Nouveauté 2025
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Solutions Spéciales Diaspora Sénégalaise
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Des services innovants conçus spécialement pour la diaspora sénégalaise qui souhaite investir et construire au pays, avec un suivi transparent depuis l'étranger.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {diasporaSolutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={index}
              className="flex"
            >
              <Card className="w-full flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-0 hover:scale-105 transform">
                <CardHeader className={`p-6 ${solution.bg}`}>
                  <div className={`p-3 rounded-full ${solution.color} bg-white inline-block mb-3 shadow-lg`}>
                    <solution.icon className="h-7 w-7" />
                  </div>
                  <CardTitle className={`text-xl font-semibold ${solution.color}`}>
                    {solution.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex-grow bg-white">
                  <CardDescription className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {solution.description}
                  </CardDescription>
                  <div className="space-y-2">
                    {solution.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-xs text-muted-foreground">
                        <div className={`w-1.5 h-1.5 ${solution.color.replace('text-', 'bg-')} rounded-full mr-2`}></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <div className="p-6 pt-0 bg-white">
                  <Button variant="outline" className={`w-full ${solution.color} border-current hover:bg-current hover:text-white transition-colors`}>
                    En savoir plus
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* CTA Diaspora */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-4">
                  🇸🇳 Première Plateforme de Construction à Distance d'Afrique de l'Ouest
                </h3>
                <p className="text-blue-100 mb-6 leading-relaxed">
                  Rejoignez plus de 2,3 millions de Sénégalais de la diaspora qui font confiance à Teranga Foncier pour leurs projets immobiliers au pays. Construisez, investissez et gérez vos biens en toute sérénité.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                    <Globe2 className="w-5 h-5 mr-2" />
                    Découvrir les Services Diaspora
                  </Button>
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                    <Camera className="w-5 h-5 mr-2" />
                    Voir une Démo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SolutionsOverviewSection;
  