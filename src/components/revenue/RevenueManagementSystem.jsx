import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  CreditCard, 
  Target, 
  Calendar, 
  Award, 
  Zap, 
  Star, 
  Building
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const RevenueManagementSystem = () => {
  const { user } = useAuth();
  const [revenueData, setRevenueData] = useState({
    monthly: {
      transactions: 850000,
      subscriptions: 450000,
      services: 180000,
      partnerships: 120000
    },
    quarterly: {
      target: 15000000,
      achieved: 12500000,
      progress: 83.3
    },
    commissions: {
      particulier: 2.0,
      pro: 1.5,
      primo: 1.0
    },
    subscriptions: {
      premium: 15000,
      pro: 35000,
      entreprise: 75000
    }
  });

  const [userSubscription, setUserSubscription] = useState(null);

  useEffect(() => {
    // Simuler la récupération des données utilisateur
    if (user?.role === 'Vendeur Pro') {
      setUserSubscription('pro');
    } else if (user?.role === 'Vendeur Particulier') {
      setUserSubscription('premium');
    }
  }, [user]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const subscriptionPlans = [
    {
      id: 'premium',
      name: 'Particulier Premium',
      price: 15000,
      period: 'mois',
      icon: Star,
      color: 'bg-blue-500',
      features: [
        'Recherche avancée avec alertes',
        'Accès prioritaire aux nouvelles annonces',
        'Support client prioritaire',
        'Historique des prix détaillé'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Vendeur Pro',
      price: 35000,
      period: 'mois',
      icon: Zap,
      color: 'bg-orange-500',
      features: [
        'Annonces illimitées',
        'Boost de visibilité',
        'Statistiques avancées',
        'Outils marketing intégrés'
      ],
      popular: true
    },
    {
      id: 'entreprise',
      name: 'Entreprise',
      price: 75000,
      period: 'mois',
      icon: Building,
      color: 'bg-purple-500',
      features: [
        'API d\'intégration',
        'Gestion multi-utilisateurs',
        'Dashboard personnalisé',
        'Manager dédié'
      ],
      popular: false
    }
  ];

  const services = [
    { name: 'Certification express', price: 25000, icon: Award },
    { name: 'Géolocalisation précise', price: 10000, icon: Target },
    { name: 'Visite virtuelle 360°', price: 15000, icon: Calendar },
    { name: 'Photos professionnelles', price: 20000, icon: CreditCard }
  ];

  const handleSubscribe = (planId) => {
    window.safeGlobalToast({
      title: "Abonnement en cours",
      description: "Redirection vers le paiement...",
      variant: "default"
    });
  };

  const handleServicePurchase = (serviceName) => {
    window.safeGlobalToast({
      title: "Service ajouté",
      description: `${serviceName} sera appliqué à votre prochaine annonce`,
      variant: "default"
    });
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Dashboard Revenus (Admin only) */}
      {(user.role === 'Admin' || user.role === 'Super Admin') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div>
              <h1 className="text-3xl font-bold">Dashboard Revenus</h1>
              <p className="text-muted-foreground">Suivi des performances financières</p>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Revenus Mensuel</p>
                    <p className="text-2xl font-bold">{formatCurrency(
                      revenueData.monthly.transactions + 
                      revenueData.monthly.subscriptions + 
                      revenueData.monthly.services + 
                      revenueData.monthly.partnerships
                    )}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                    <p className="text-2xl font-bold">{formatCurrency(revenueData.monthly.transactions)}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Abonnements</p>
                    <p className="text-2xl font-bold">{formatCurrency(revenueData.monthly.subscriptions)}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Objectif Trimestriel</p>
                    <p className="text-2xl font-bold">{revenueData.quarterly.progress}%</p>
                  </div>
                  <Target className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progression objectifs */}
          <Card>
            <CardHeader>
              <CardTitle>Progression des Objectifs Trimestriels</CardTitle>
              <CardDescription>
                {formatCurrency(revenueData.quarterly.achieved)} / {formatCurrency(revenueData.quarterly.target)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={revenueData.quarterly.progress} className="w-full" />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>Réalisé</span>
                <span>{revenueData.quarterly.progress}%</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Section Utilisateur - Abonnements et Services */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="subscriptions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions" className="space-y-6">
            <div className="flex items-center gap-3">
              <Star className="h-6 w-6 text-yellow-500" />
              <div>
                <h2 className="text-2xl font-bold">Plans d'Abonnement</h2>
                <p className="text-muted-foreground">Choisissez le plan qui correspond à vos besoins</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => {
                const Icon = plan.icon;
                const isCurrentPlan = userSubscription === plan.id;
                
                return (
                  <motion.div
                    key={plan.id}
                    whileHover={{ scale: 1.02 }}
                    className="relative"
                  >
                    <Card className={`relative ${plan.popular ? 'border-2 border-orange-500' : ''} ${isCurrentPlan ? 'bg-green-50 border-green-500' : ''}`}>
                      {plan.popular && (
                        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-orange-500">
                          Plus Populaire
                        </Badge>
                      )}
                      {isCurrentPlan && (
                        <Badge className="absolute -top-2 right-4 bg-green-500">
                          Actuel
                        </Badge>
                      )}
                      
                      <CardHeader className="text-center">
                        <div className={`mx-auto p-3 rounded-full ${plan.color} text-white w-fit`}>
                          <Icon className="h-8 w-8" />
                        </div>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <div className="text-3xl font-bold">
                          {formatCurrency(plan.price)}
                          <span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        
                        <Button 
                          className="w-full" 
                          variant={isCurrentPlan ? "outline" : "default"}
                          disabled={isCurrentPlan}
                          onClick={() => handleSubscribe(plan.id)}
                        >
                          {isCurrentPlan ? 'Plan Actuel' : `S'abonner`}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-blue-500" />
              <div>
                <h2 className="text-2xl font-bold">Services Additionnels</h2>
                <p className="text-muted-foreground">Améliorez vos annonces avec nos services premium</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service, index) => {
                const Icon = service.icon;
                
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Icon className="h-8 w-8 text-blue-500" />
                            <div>
                              <h3 className="font-semibold">{service.name}</h3>
                              <p className="text-2xl font-bold text-green-600">
                                {formatCurrency(service.price)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full" 
                          onClick={() => handleServicePurchase(service.name)}
                        >
                          Ajouter ce service
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Section Commissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Grille Tarifaire
          </CardTitle>
          <CardDescription>
            Nos commissions transparentes selon votre profil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800">Particulier</h4>
              <p className="text-2xl font-bold text-blue-600">{revenueData.commissions.particulier}%</p>
              <p className="text-sm text-blue-600">Commission standard</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-800">Vendeur Pro</h4>
              <p className="text-2xl font-bold text-orange-600">{revenueData.commissions.pro}%</p>
              <p className="text-sm text-orange-600">Tarif préférentiel</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800">Primo-vendeur</h4>
              <p className="text-2xl font-bold text-green-600">{revenueData.commissions.primo}%</p>
              <p className="text-sm text-green-600">6 premiers mois</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueManagementSystem;
