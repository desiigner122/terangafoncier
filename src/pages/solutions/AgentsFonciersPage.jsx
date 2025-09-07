import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  TrendingUp, 
  Users, 
  MapPin,
  Shield,
  Phone,
  Award,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Clock,
  Target
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet-async';

const AgentsFonciersPage = () => {
  const agentServices = [
    {
      icon: MapPin,
      title: "Prospection Intelligente",
      description: "Outils IA pour identifier les meilleures opportunités foncières",
      features: ["Analyse prédictive", "Cartographie avancée", "Alertes automatiques"]
    },
    {
      icon: Users,
      title: "Gestion Client CRM",
      description: "Plateforme complète pour gérer votre portefeuille clients",
      features: ["Base de données centralisée", "Suivi des interactions", "Automatisation marketing"]
    },
    {
      icon: DollarSign,
      title: "Outils de Vente",
      description: "Accélérez vos ventes avec nos outils blockchain",
      features: ["Contrats intelligents", "Paiements sécurisés", "Documentation automatique"]
    },
    {
      icon: Award,
      title: "Formation & Certification",
      description: "Développez vos compétences avec nos programmes",
      features: ["Formations blockchain", "Certification agent", "Mise à jour continue"]
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "Augmentez vos Revenus",
      description: "Commissions attractives et bonus de performance"
    },
    {
      icon: Shield,
      title: "Transactions Sécurisées",
      description: "Blockchain et smart contracts pour zéro risque"
    },
    {
      icon: Clock,
      title: "Gain de Temps",
      description: "Automatisation des tâches répétitives"
    },
    {
      icon: Target,
      title: "Ciblage Précis",
      description: "IA pour identifier les meilleurs prospects"
    }
  ];

  const commissionTiers = [
    {
      tier: "Bronze",
      commission: "3%",
      minSales: "0-10 ventes/mois",
      benefits: ["Formation de base", "Support email", "Outils standards"]
    },
    {
      tier: "Silver",
      commission: "4%",
      minSales: "11-25 ventes/mois",
      benefits: ["Formation avancée", "Support prioritaire", "Outils premium"]
    },
    {
      tier: "Gold",
      commission: "5%",
      minSales: "26+ ventes/mois",
      benefits: ["Formation expert", "Manager dédié", "Outils exclusifs"]
    }
  ];

  const successStories = [
    {
      name: "Amadou Diallo",
      location: "Dakar",
      sales: "45 ventes en 6 mois",
      revenue: "2.8M FCFA",
      testimonial: "Grâce aux outils IA, j'ai triplé mes ventes en 6 mois !"
    },
    {
      name: "Fatou Sene",
      location: "Thiès",
      sales: "32 ventes en 4 mois",
      revenue: "1.9M FCFA",
      testimonial: "La blockchain a révolutionné ma façon de travailler."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Agents Fonciers - Solutions Professionnelles | Teranga Foncier</title>
        <meta name="description" content="Outils avancés pour agents fonciers : CRM, prospection IA, blockchain, formations. Augmentez vos revenus avec nos solutions innovantes." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Hero Section */}
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white mb-6">
                <Briefcase className="w-4 h-4 mr-2" />
                Solutions Professionnelles
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Agents Fonciers
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Révolutionnez votre activité d'agent foncier avec nos outils avancés : 
                IA, blockchain, CRM intégré et formations certifiantes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Devenir Agent Partenaire
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline">
                  Voir la Démo
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-6">Nos Services Dédiés</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Une suite complète d'outils pour maximiser votre efficacité
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {agentServices.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <service.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                          <p className="text-gray-600 mb-4">{service.description}</p>
                          <ul className="space-y-2">
                            {service.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Avantages Exclusifs</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Rejoignez notre réseau d'agents partenaires et bénéficiez d'avantages uniques
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Commission Tiers */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Structure de Commissions</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Plus vous vendez, plus vous gagnez avec notre système progressif
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {commissionTiers.map((tier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className={`h-full ${index === 1 ? 'border-blue-500 shadow-lg scale-105' : ''}`}>
                    <CardContent className="p-6 text-center">
                      <h3 className="text-2xl font-bold mb-2">{tier.tier}</h3>
                      <div className="text-4xl font-bold text-blue-600 mb-2">{tier.commission}</div>
                      <p className="text-gray-600 mb-4">{tier.minSales}</p>
                      <ul className="space-y-2">
                        {tier.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Témoignages de Réussite</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Découvrez comment nos agents partenaires transforment leur activité
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {successStories.map((story, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{story.name.charAt(0)}</span>
                        </div>
                        <div className="ml-3">
                          <h3 className="font-semibold">{story.name}</h3>
                          <p className="text-sm text-gray-600">{story.location}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Ventes</p>
                          <p className="font-semibold">{story.sales}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Revenus</p>
                          <p className="font-semibold text-green-600">{story.revenue}</p>
                        </div>
                      </div>
                      <blockquote className="text-gray-700 italic">
                        "{story.testimonial}"
                      </blockquote>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Prêt à Révolutionner Votre Activité ?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Rejoignez notre réseau d'agents partenaires et multipliez vos revenus
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Devenir Agent Partenaire
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Phone className="w-5 h-5 mr-2" />
                  Nous Contacter
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AgentsFonciersPage;
