import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Video, PenTool, Upload, FileText, Camera,
  MessageSquare, Calendar, Clock, CheckCircle, Eye,
  Download, Share2, Users, Monitor, Smartphone, Wifi,
  Cloud, Lock, Activity, Plus, RefreshCw, TrendingUp,
  DollarSign, Package, CreditCard, Bell, Settings,
  Award, Star, ExternalLink, Info, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { toast } from 'sonner';

const VendeurServicesDigitauxRealData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // États
  const [services, setServices] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [usage, setUsage] = useState([]);
  const [stats, setStats] = useState({
    activeServices: 0,
    totalUsage: 0,
    monthlyCost: 0,
    availableCredits: 0
  });

  // Fonction pour mapper les noms d'icônes vers les composants React
  const getIconComponent = (iconName) => {
    const iconMap = {
      'FileSignature': PenTool,
      'PenTool': PenTool,
      'Camera': Camera,
      'Video': Video,
      'ScanText': FileText,
      'FileText': FileText,
      'Cloud': Cloud,
      'Activity': Activity,
      'Megaphone': Share2,
      'Share2': Share2,
      'Scale': FileText,
      'default': Package
    };
    return iconMap[iconName] || iconMap['default'];
  };

  // Fonction pour obtenir la couleur selon la catégorie
  const getCategoryColor = (category) => {
    const colorMap = {
      'signature': 'blue',
      'visite_virtuelle': 'purple',
      'ocr': 'green',
      'stockage': 'orange',
      'marketing': 'pink',
      'juridique': 'red',
      'default': 'gray'
    };
    return colorMap[category] || colorMap['default'];
  };

  // Charger données services
  useEffect(() => {
    if (user) {
      loadServicesData();
    }
  }, [user]);

  const loadServicesData = async () => {
    try {
      setLoading(true);
      
      // Charger les services disponibles depuis Supabase
      const { data: servicesData, error: servicesError } = await supabase
        .from('digital_services')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (servicesError) throw servicesError;
      setServices(servicesData || []);

      // Charger les abonnements actifs de l'utilisateur
      const { data: subscriptionsData, error: subsError } = await supabase
        .from('service_subscriptions')
        .select(`
          *,
          service:service_id (
            id,
            name,
            slug,
            category,
            icon
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (subsError) throw subsError;
      setSubscriptions(subscriptionsData || []);

      // Charger l'historique d'utilisation du mois en cours
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: usageData, error: usageError } = await supabase
        .from('service_usage')
        .select(`
          service_id,
          action,
          status,
          created_at
        `)
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString())
        .order('created_at', { ascending: false });
      
      if (usageError) throw usageError;

      // Agréger l'utilisation par service
      const usageByService = {};
      (usageData || []).forEach(usage => {
        if (!usageByService[usage.service_id]) {
          usageByService[usage.service_id] = { count: 0, service_id: usage.service_id };
        }
        usageByService[usage.service_id].count++;
      });

      const usageArray = Object.values(usageByService);
      setUsage(usageArray);

      // Calculer les statistiques
      const activeServices = (subscriptionsData || []).filter(s => s.status === 'active').length;
      const totalUsage = usageArray.reduce((sum, u) => sum + u.count, 0);
      const monthlyCost = (subscriptionsData || []).reduce((sum, sub) => sum + (sub.plan_price || 0), 0);
      
      // Calculer les crédits disponibles (pour les services avec usage_limit)
      const creditsAvailable = (subscriptionsData || [])
        .filter(sub => sub.usage_limit !== null)
        .reduce((sum, sub) => {
          const used = usageByService[sub.service_id]?.count || 0;
          return sum + Math.max(0, (sub.usage_limit || 0) - used);
        }, 0);

      setStats({
        activeServices,
        totalUsage,
        monthlyCost,
        availableCredits: creditsAvailable
      });

      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement services:', error);
      toast.error('Erreur lors du chargement des services');
      setLoading(false);
    }
  };

  const handleSubscribe = async (serviceId, plan) => {
    try {
      // Récupérer les détails du service
      const { data: service, error: serviceError } = await supabase
        .from('digital_services')
        .select('*')
        .eq('id', serviceId)
        .single();
      
      if (serviceError) throw serviceError;

      // Extraire le prix du plan sélectionné
      const selectedPlan = service.plans.find(p => p.name.toLowerCase() === plan.toLowerCase());
      if (!selectedPlan) {
        toast.error('Plan non trouvé');
        return;
      }

      // Calculer les dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // +1 mois
      const nextBillingDate = new Date(endDate);

      // Créer l'abonnement
      const { error: subscriptionError } = await supabase
        .from('service_subscriptions')
        .insert({
          user_id: user.id,
          service_id: serviceId,
          plan_name: selectedPlan.name,
          plan_price: selectedPlan.price,
          status: 'active',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          next_billing_date: nextBillingDate.toISOString(),
          usage_limit: selectedPlan.usage_limit || null,
          auto_renew: true
        });
      
      if (subscriptionError) throw subscriptionError;

      toast.success(`Abonnement ${selectedPlan.name} activé pour ${service.name}! 🎉`);
      loadServicesData();
    } catch (error) {
      console.error('Erreur souscription:', error);
      toast.error('Erreur lors de la souscription');
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    try {
      // Demander confirmation
      if (!window.confirm('Êtes-vous sûr de vouloir annuler cet abonnement?')) {
        return;
      }

      // Mettre à jour le statut de l'abonnement
      const { error } = await supabase
        .from('service_subscriptions')
        .update({
          status: 'canceled',
          canceled_at: new Date().toISOString(),
          auto_renew: false
        })
        .eq('id', subscriptionId)
        .eq('user_id', user.id); // Sécurité: vérifier que c'est bien l'utilisateur
      
      if (error) throw error;

      toast.success('Abonnement annulé avec succès. Vous conservez l\'accès jusqu\'à la fin de la période.');
      loadServicesData();
    } catch (error) {
      console.error('Erreur annulation:', error);
      toast.error('Erreur lors de l\'annulation');
    }
  };

  const formatCFA = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getServiceColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800',
      orange: 'bg-orange-100 text-orange-800',
      red: 'bg-red-100 text-red-800',
      pink: 'bg-pink-100 text-pink-800'
    };
    return colors[color] || 'bg-gray-100 text-gray-800';
  };

  const getPlanBadge = (plan) => {
    const badges = {
      free: { label: 'Gratuit', color: 'bg-gray-100 text-gray-800' },
      basic: { label: 'Basic', color: 'bg-blue-100 text-blue-800' },
      premium: { label: 'Premium', color: 'bg-purple-100 text-purple-800' }
    };
    return badges[plan] || badges.free;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Chargement des services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <Zap className="h-8 w-8 text-white" />
            </div>
            Services Digitaux
          </h1>
          <p className="text-gray-600 mt-2">
            Boostez votre activité avec nos outils numériques
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Service
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Services Actifs',
            value: stats.activeServices,
            icon: Package,
            color: 'blue',
            trend: '+2 ce mois'
          },
          {
            label: 'Utilisation Totale',
            value: stats.totalUsage,
            icon: Activity,
            color: 'green',
            trend: '+18%'
          },
          {
            label: 'Coût Mensuel',
            value: formatCFA(stats.monthlyCost),
            icon: CreditCard,
            color: 'orange',
            trend: null
          },
          {
            label: 'Crédits Disponibles',
            value: stats.availableCredits,
            icon: Award,
            color: 'purple',
            trend: '27/50'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-l-4" style={{ borderLeftColor: `var(--${stat.color}-500)` }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    {stat.trend && (
                      <Badge variant="outline" className="mt-2 text-green-700 bg-green-50">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {stat.trend}
                      </Badge>
                    )}
                  </div>
                  <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <Eye className="h-4 w-4 mr-2" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="services">
            <Package className="h-4 w-4 mr-2" />
            Tous les Services
          </TabsTrigger>
          <TabsTrigger value="subscriptions">
            <CheckCircle className="h-4 w-4 mr-2" />
            Mes Abonnements
          </TabsTrigger>
          <TabsTrigger value="usage">
            <Activity className="h-4 w-4 mr-2" />
            Utilisation
          </TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Services actifs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Services Actifs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {subscriptions.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">Aucun service actif</p>
                ) : (
                  subscriptions.map((sub, index) => {
                    // Trouver le service correspondant depuis les données Supabase
                    const service = sub.service || services.find(s => s.id === sub.service_id);
                    if (!service) return null;
                    
                    const IconComponent = getIconComponent(service.icon);
                    const color = getCategoryColor(service.category);
                    
                    return (
                      <motion.div
                        key={sub.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 ${getServiceColor(color)} rounded-lg`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{service.name}</p>
                            <Badge className={getPlanBadge(sub.plan_name?.toLowerCase() || 'basic').color}>
                              {getPlanBadge(sub.plan_name?.toLowerCase() || 'basic').label}
                            </Badge>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-700 bg-green-50">
                          Actif
                        </Badge>
                      </motion.div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Utilisation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Utilisation ce Mois
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {usage.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">Aucune utilisation ce mois</p>
                ) : (
                  usage.map((u, index) => {
                    const service = services.find(s => s.id === u.service_id);
                    if (!service) return null;
                    
                    // Trouver la souscription pour obtenir la limite
                    const subscription = subscriptions.find(sub => sub.service_id === u.service_id);
                    const limit = subscription?.usage_limit || 0;
                    const percentage = limit > 0 ? (u.count / limit) * 100 : 0;
                    
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{service.name}</span>
                          <span className="text-sm text-gray-600">
                            {u.count}{limit > 0 ? `/${limit}` : ' (illimité)'}
                          </span>
                        </div>
                        {limit > 0 && (
                          <Progress value={percentage} className="h-2" />
                        )}
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recommandations */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              💡 <strong>Conseil:</strong> Vous utilisez 46% de vos crédits OCR. 
              Passez au plan Premium pour des crédits illimités et économisez 20%.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Tous les Services */}
        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => {
              const isSubscribed = subscriptions.some(s => s.service_id === service.id);
              const IconComponent = getIconComponent(service.icon);
              const color = getCategoryColor(service.category);
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-3 ${getServiceColor(color)} rounded-lg`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        {isSubscribed && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Actif
                          </Badge>
                        )}
                      </div>
                      <CardTitle>{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Features - Afficher les features du premier plan */}
                      {service.plans && service.plans.length > 0 && service.plans[0].features && (
                        <ul className="space-y-2">
                          {service.plans[0].features.slice(0, 4).map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Pricing - Afficher les plans disponibles */}
                      <div className="space-y-2 pt-4 border-t">
                        {service.plans && service.plans.map((plan, planIndex) => (
                          <div key={planIndex} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{plan.name}</span>
                            <span className={`font-semibold ${planIndex === service.plans.length - 1 ? 'text-purple-600' : ''}`}>
                              {formatCFA(plan.price)}{plan.period === 'monthly' ? '/mois' : ''}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      {isSubscribed ? (
                        <Button variant="outline" className="w-full">
                          <Settings className="h-4 w-4 mr-2" />
                          Gérer
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleSubscribe(service.id, 'Basic')}
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-600"
                        >
                          S'abonner
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Mes Abonnements */}
        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Abonnements Actifs</CardTitle>
              <CardDescription>
                Gérez vos abonnements et préférences de facturation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subscriptions.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Aucun abonnement actif</p>
                  <Button
                    onClick={() => setActiveTab('services')}
                    className="bg-gradient-to-r from-blue-500 to-blue-600"
                  >
                    Découvrir les Services
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {subscriptions.map((sub, index) => {
                    const service = sub.service || services.find(s => s.id === sub.service_id);
                    if (!service) return null;
                    
                    const IconComponent = getIconComponent(service.icon);
                    const color = getCategoryColor(service.category);
                    const planBadge = getPlanBadge(sub.plan_name?.toLowerCase() || 'basic');
                    const price = sub.plan_price || 0;
                    
                    return (
                      <motion.div
                        key={sub.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 ${getServiceColor(color)} rounded-lg`}>
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{service.name}</h3>
                              <p className="text-sm text-gray-600">{service.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className={planBadge.color}>
                                  {planBadge.label}
                                </Badge>
                                {sub.auto_renew && (
                                  <Badge variant="outline" className="text-blue-700 bg-blue-50">
                                    Renouvellement auto
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              {formatCFA(price)}
                            </p>
                            <p className="text-sm text-gray-600">/mois</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-sm text-gray-600">
                            <Clock className="h-4 w-4 inline mr-1" />
                            Expire le {new Date(sub.end_date).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Modifier
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelSubscription(sub.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              Annuler
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Utilisation */}
        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques d'Utilisation</CardTitle>
              <CardDescription>
                Suivez votre consommation mensuelle de services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4" />
                <p>Statistiques détaillées en cours de développement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendeurServicesDigitauxRealData;
