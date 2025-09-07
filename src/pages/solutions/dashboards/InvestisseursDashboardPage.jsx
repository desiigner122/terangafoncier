import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  Building2, 
  BarChart3,
  Users,
  ArrowRight,
  Star,
  Shield,
  Zap,
  Coins
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

const InvestisseursDashboardPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  const investmentOpportunities = [
    {
      id: 1,
      title: "Terrain Résidentiel - Almadies",
      price: "45,000,000",
      currency: "XOF",
      location: "Almadies, Dakar",
      roi: "12%",
      minInvestment: "500,000",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
      status: "Disponible",
      investors: 24
    },
    {
      id: 2,
      title: "Complexe Commercial - Plateau",
      price: "120,000,000",
      currency: "XOF",
      location: "Plateau, Dakar",
      roi: "15%",
      minInvestment: "1,000,000",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop",
      status: "En cours",
      investors: 67
    },
    {
      id: 3,
      title: "Zone Industrielle - Diamniadio",
      price: "85,000,000", 
      currency: "XOF",
      location: "Diamniadio",
      roi: "18%",
      minInvestment: "750,000",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
      status: "Nouveau",
      investors: 12
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "Rendements Élevés",
      description: "Profitez de rendements attractifs avec des projets immobiliers soigneusement sélectionnés.",
      stats: "Jusqu'à 20% de ROI"
    },
    {
      icon: Shield,
      title: "Investissement Sécurisé",
      description: "Tous nos projets sont vérifiés et sécurisés par notre équipe d'experts juridiques.",
      stats: "100% Légal"
    },
    {
      icon: Users,
      title: "Investissement Fractionné",
      description: "Investissez dans l'immobilier même avec un petit budget grâce à notre système fractionné.",
      stats: "Dès 100,000 XOF"
    },
    {
      icon: Coins,
      title: "🆕 Blockchain & Tokens",
      description: "Investissez via la blockchain avec des tokens représentant vos parts d'investissement.",
      stats: "Technologie sécurisée",
      isNew: true
    }
  ];

  return (
    <>
      <Helmet>
        <title>Plateforme d'Investissement Immobilier | Teranga Foncier</title>
        <meta name="description" content="Investissez dans l'immobilier sénégalais avec Teranga Foncier. Rendements attractifs, investissements sécurisés et fractionnés." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-background"
      >
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 text-center bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-green-600/10 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2070&auto=format&fit=crop" 
              className="w-full h-full object-cover opacity-10" 
              alt="Investissement immobilier moderne" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="container mx-auto px-4 relative z-10"
          >
            <Badge className="mb-6 bg-purple-100 text-purple-700 hover:bg-purple-200">
              <Zap className="mr-2 h-4 w-4" />
              Plateforme d'Investissement Immobilier
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
              Investissez dans l'Immobilier Sénégalais
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Découvrez des opportunités d'investissement immobilier exceptionnelles avec des rendements attractifs et un accès facilité via la blockchain.
            </p>
            
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-xl"
            >
              Commencer à Investir
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pourquoi Investir avec Teranga Foncier ?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Notre plateforme révolutionne l'investissement immobilier au Sénégal avec la technologie blockchain
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          benefit.isNew 
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                            : 'bg-primary/10'
                        }`}>
                          <benefit.icon className={`h-6 w-6 ${
                            benefit.isNew ? 'text-white' : 'text-primary'
                          }`} />
                        </div>
                        {benefit.isNew && (
                          <Badge className="ml-2 bg-purple-100 text-purple-700 text-xs">
                            NOUVEAU
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground mb-4">{benefit.description}</p>
                      <div className="text-sm font-medium text-primary">{benefit.stats}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Investment Opportunities */}
        <section className="py-16 md:py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Opportunités d'Investissement
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvrez nos projets immobiliers sélectionnés avec soin pour maximiser vos rendements
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {investmentOpportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all">
                    <div className="aspect-video relative">
                      <img 
                        src={opportunity.image} 
                        alt={opportunity.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className={`absolute top-4 right-4 ${
                        opportunity.status === 'Disponible' ? 'bg-green-500' :
                        opportunity.status === 'En cours' ? 'bg-blue-500' :
                        'bg-purple-500'
                      }`}>
                        {opportunity.status}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">{opportunity.title}</h3>
                      <p className="text-muted-foreground mb-4">{opportunity.location}</p>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Valeur totale</span>
                          <span className="font-semibold">{Number(opportunity.price).toLocaleString()} {opportunity.currency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">ROI estimé</span>
                          <span className="font-semibold text-green-600">{opportunity.roi}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Investissement min.</span>
                          <span className="font-semibold">{Number(opportunity.minInvestment).toLocaleString()} XOF</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Investisseurs</span>
                          <span className="font-semibold">{opportunity.investors}</span>
                        </div>
                      </div>
                      
                      <Button className="w-full" onClick={handleGetStarted}>
                        Investir Maintenant
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Card className="p-8 md:p-12 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-green-600/5 border-none">
                <CardContent className="p-0">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Prêt à Commencer Votre Parcours d'Investissement ?
                  </h2>
                  <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Rejoignez des milliers d'investisseurs qui font confiance à Teranga Foncier pour faire fructifier leur patrimoine immobilier.
                  </p>
                  <Button 
                    size="lg" 
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    Créer Mon Compte Investisseur
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default InvestisseursDashboardPage;
