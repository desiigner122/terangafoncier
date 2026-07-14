import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { supabase } from '@/lib/supabaseClient';

const PLAN_ICONS = [Star, Zap, Building, Award];
const PLAN_COLORS = ['bg-blue-500', 'bg-orange-500', 'bg-purple-500', 'bg-green-500'];

const RevenueManagementSystem = () => {
  const { user } = useAuth();
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [userSubscription, setUserSubscription] = useState(null);
  const [revenueStats, setRevenueStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Grille de commissions : règles tarifaires de la plateforme (constantes métier)
  const commissions = {
    particulier: 2.0,
    pro: 1.5,
    primo: 1.0
  };

  // Services additionnels à la vente (catalogue statique, pas de table dédiée)
  const services = [
    { name: 'Certification express', price: 25000, icon: Award },
    { name: 'Géolocalisation précise', price: 10000, icon: Target },
    { name: 'Visite virtuelle 360°', price: 15000, icon: Calendar },
    { name: 'Photos professionnelles', price: 20000, icon: CreditCard }
  ];

  useEffect(() => {
    loadSubscriptionPlans();
    if (user?.id) {
      loadUserSubscription();
    }
    if (user?.role === 'Admin' || user?.role === 'Super Admin') {
      loadRevenueStats();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadSubscriptionPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('status', 'active')
        .order('price', { ascending: true });

      if (error) throw error;
      setSubscriptionPlans(data || []);
    } catch (error) {
      console.error('Erreur chargement plans abonnement:', error);
      setSubscriptionPlans([]);
    } finally {
      if (!(user?.role === 'Admin' || user?.role === 'Super Admin')) {
        setIsLoading(false);
      }
    }
  };

  const loadUserSubscription = async () => {
    try {
      const { data: subRow, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;

      if (subRow?.plan_id) {
        const { data: planRow } = await supabase
          .from('subscription_plans')
          .select('id, name')
          .eq('id', subRow.plan_id)
          .maybeSingle();
        setUserSubscription({ ...subRow, planName: planRow?.name });
      } else {
        setUserSubscription(null);
      }
    } catch (error) {
      console.error('Erreur chargement abonnement utilisateur:', error);
      setUserSubscription(null);
    }
  };

  const loadRevenueStats = async () => {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const startOfWindow = new Date();
      startOfWindow.setMonth(startOfWindow.getMonth() - 3);

      const { data, error } = await supabase
        .from('financial_transactions')
        .select('amount, category, created_at')
        .eq('status', 'completed')
        .gte('created_at', startOfWindow.toISOString());

      if (error) throw error;

      const rows = data || [];
      const monthlyRows = rows.filter(r => new Date(r.created_at) >= startOfMonth);
      const monthlyTotal = monthlyRows.reduce((sum, r) => sum + Number(r.amount || 0), 0);
      const last3MonthsTotal = rows.reduce((sum, r) => sum + Number(r.amount || 0), 0);
      const byCategory = monthlyRows.reduce((acc, r) => {
        const key = r.category || 'autre';
        acc[key] = (acc[key] || 0) + Number(r.amount || 0);
        return acc;
      }, {});

      setRevenueStats({
        monthlyTotal,
        last3MonthsTotal,
        byCategory,
        transactionCount: monthlyRows.length
      });
    } catch (error) {
      console.error('Erreur chargement statistiques revenus:', error);
      setRevenueStats(null);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const buildPlanFeatures = (plan) => {
    const features = [];
    features.push(plan.max_properties ? `${plan.max_properties} annonces maximum` : 'Annonces illimitées');
    if (plan.max_images_per_property) features.push(`${plan.max_images_per_property} photos par annonce`);
    if (plan.priority_support) features.push('Support client prioritaire');
    if (plan.featured_listings) features.push('Mise en avant des annonces');
    if (plan.analytics_access) features.push('Statistiques avancées');
    if (plan.api_access) features.push("Accès à l'API");
    if (plan.custom_branding) features.push('Image de marque personnalisée');
    return features;
  };

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

  const isAdmin = user.role === 'Admin' || user.role === 'Super Admin';

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Dashboard Revenus (Admin only) */}
      {isAdmin && (
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

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : revenueStats ? (
            <>
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Revenus du mois</p>
                        <p className="text-2xl font-bold">{formatCurrency(revenueStats.monthlyTotal)}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Transactions du mois</p>
                        <p className="text-2xl font-bold">{revenueStats.transactionCount}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Revenus 3 derniers mois</p>
                        <p className="text-2xl font-bold">{formatCurrency(revenueStats.last3MonthsTotal)}</p>
                      </div>
                      <Target className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Catégories actives</p>
                        <p className="text-2xl font-bold">{Object.keys(revenueStats.byCategory).length}</p>
                      </div>
                      <Users className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Répartition par catégorie */}
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des Revenus du Mois</CardTitle>
                  <CardDescription>Par catégorie de transaction</CardDescription>
                </CardHeader>
                <CardContent>
                  {Object.keys(revenueStats.byCategory).length === 0 ? (
                    <p className="text-sm text-muted-foreground">Aucune transaction enregistrée ce mois-ci.</p>
                  ) : (
                    <div className="space-y-3">
                      {Object.entries(revenueStats.byCategory).map(([category, amount]) => (
                        <div key={category} className="flex justify-between text-sm">
                          <span className="capitalize text-muted-foreground">{category.replace(/_/g, ' ')}</span>
                          <span className="font-semibold">{formatCurrency(amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Aucune donnée de revenus disponible pour le moment.
              </CardContent>
            </Card>
          )}
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

            {subscriptionPlans.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Aucun plan d'abonnement disponible pour le moment.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan, index) => {
                  const Icon = PLAN_ICONS[index % PLAN_ICONS.length];
                  const color = PLAN_COLORS[index % PLAN_COLORS.length];
                  const isCurrentPlan = userSubscription?.plan_id === plan.id;
                  const features = buildPlanFeatures(plan);
                  const period = plan.duration_months === 1 ? 'mois' : `${plan.duration_months || 1} mois`;

                  return (
                    <motion.div
                      key={plan.id}
                      whileHover={{ scale: 1.02 }}
                      className="relative"
                    >
                      <Card className={`relative ${isCurrentPlan ? 'bg-green-50 border-green-500' : ''}`}>
                        {isCurrentPlan && (
                          <Badge className="absolute -top-2 right-4 bg-green-500">
                            Actuel
                          </Badge>
                        )}

                        <CardHeader className="text-center">
                          <div className={`mx-auto p-3 rounded-full ${color} text-white w-fit`}>
                            <Icon className="h-8 w-8" />
                          </div>
                          <CardTitle className="text-xl">{plan.name}</CardTitle>
                          {plan.description && (
                            <CardDescription>{plan.description}</CardDescription>
                          )}
                          <div className="mt-4">
                            <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
                            <span className="text-sm font-normal text-muted-foreground">/{period}</span>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <ul className="space-y-2">
                            {features.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm">
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
            )}
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
              <p className="text-2xl font-bold text-blue-600">{commissions.particulier}%</p>
              <p className="text-sm text-blue-600">Commission standard</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-800">Vendeur Pro</h4>
              <p className="text-2xl font-bold text-orange-600">{commissions.pro}%</p>
              <p className="text-sm text-orange-600">Tarif préférentiel</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800">Primo-vendeur</h4>
              <p className="text-2xl font-bold text-green-600">{commissions.primo}%</p>
              <p className="text-sm text-green-600">6 premiers mois</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueManagementSystem;
