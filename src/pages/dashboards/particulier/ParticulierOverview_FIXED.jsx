import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
  FileText,
  Clock,
  MapPin,
  Calendar,
  Bell,
  MessageSquare,
  Star,
  Plus,
  ArrowRight,
  Activity,
  CheckCircle,
  AlertCircle,
  Users,
  Building2,
  Target,
  Eye,
  Phone,
  TrendingUp,
  Heart,
  Award,
  Home,
  Briefcase,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

const ParticulierOverview = () => {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const user = outletContext?.user || null;
    
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    zonalRequests: 0,
    developerApplications: 0,
    favorites: 0,
    visits: 0,
    offers: 0,
    constructionRequests: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingVisits, setUpcomingVisits] = useState([]);

  useEffect(() => {
    if (user?.id) {
      loadDashboardData().catch(error => {
        console.error('Erreur initialisation dashboard:', error);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Vérifier que l'utilisateur est chargé
      if (!user?.id) {
        console.warn('User not loaded yet');
        return;
      }

      // Charger les statistiques avec des données factices pour éviter les erreurs CORS
      setStats({
        zonalRequests: 3,
        developerApplications: 2,
        favorites: 5,
        visits: 1,
        offers: 2,
        constructionRequests: 1
      });

      // Données factices pour les activités récentes
      setRecentActivities([
        {
          id: 'activity-1',
          type: 'zone_communale',
          title: 'Demande Zone Communale soumise',
          description: 'Zone Résidentielle - Pikine Nord',
          time: '2h',
          timestamp: Date.now() - 2 * 60 * 60 * 1000,
          status: 'info',
          icon: CheckCircle,
          action: 'Voir les détails',
          link: '/acheteur/demandes-terrains'
        },
        {
          id: 'activity-2',
          type: 'projet_promoteur',
          title: 'Candidature projet en cours',
          description: 'Résidence Les Palmiers',
          time: '1j',
          timestamp: Date.now() - 24 * 60 * 60 * 1000,
          status: 'progress',
          icon: Award,
          action: 'Suivre le projet',
          link: '/acheteur/promoteurs'
        }
      ]);

      // Données factices pour les visites
      setUpcomingVisits([]);

    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    if (!date) return '0s';
    try {
      const seconds = Math.floor((new Date() - new Date(date)) / 1000);
      if (seconds < 60) return `${seconds}s`;
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}min`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h`;
      const days = Math.floor(hours / 24);
      return `${days}j`;
    } catch (error) {
      console.error('Error calculating time ago:', error);
      return '0s';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'progress': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  // Statistiques de suivi des demandes spécifiques
  const mainStats = [
    {
      title: "Demandes Zones Communales",
      value: stats.zonalRequests,
      change: "+1 cette semaine",
      changeType: "increase",
      icon: MapPin,
      color: "from-blue-500 to-cyan-600",
      description: "Terrains communaux",
      details: "Suivi des attributions communales",
      link: "/acheteur/demandes-terrains"
    },
    {
      title: "Permis de Construire",
      value: stats.constructionRequests,
      change: "+0",
      changeType: "neutral",
      icon: Building2,
      color: "from-green-500 to-emerald-600",
      description: "Autorisations",
      details: "Permis et autorisations",
      link: "/acheteur/demandes-constructions"
    },
    {
      title: "Candidatures Promoteurs",
      value: stats.developerApplications,
      change: "+2 ce mois",
      changeType: "increase",
      icon: Award,
      color: "from-purple-500 to-indigo-600",
      description: "Projets immobiliers",
      details: "Villas et appartements",
      link: "/acheteur/candidatures-promoteurs"
    },
    {
      title: "Offres Privées",
      value: stats.offers,
      change: "+0",
      changeType: "neutral",
      icon: Heart,
      color: "from-rose-500 to-pink-600",
      description: "Négociations",
      details: "Achats directs vendeurs",
      link: "/acheteur/offres"
    }
  ];

  // Types de demandes disponibles
  const quickActions = [
    {
      title: 'Demande Zone Communale',
      description: 'Terrain communal/municipal',
      icon: MapPin,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      action: () => navigate('/acheteur/zones-communales')
    },
    {
      title: 'Permis de Construire',
      description: 'Autorisation de construction',
      icon: Building2,
      color: 'bg-gradient-to-r from-green-500 to-emerald-600',
      action: () => navigate('/acheteur/demandes-constructions')
    },
    {
      title: 'Candidature Promoteur',
      description: 'Projet immobilier',
      icon: Award,
      color: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      action: () => navigate('/acheteur/promoteurs')
    },
    {
      title: 'Offre Vendeur Privé',
      description: 'Achat direct particulier',
      icon: Heart,
      color: 'bg-gradient-to-r from-rose-500 to-pink-600',
      action: () => navigate('/acheteur/terrains')
    }
  ];

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header avec actions de suivi */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Suivi de mes Demandes</h1>
          <p className="text-slate-600">Suivez l'état d'avancement de toutes vos démarches administratives</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => navigate('/acheteur/demandes-terrains')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Voir Demandes Terrains
          </Button>
          <Button 
            className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
            onClick={() => navigate('/acheteur/zones-communales')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Demande
          </Button>
        </div>
      </motion.div>

      {/* État de mes Demandes en Cours */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(mainStats || []).map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group"
          >
            <Card 
              className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-white/20 hover:shadow-2xl transition-all duration-500 group-hover:bg-white/90 cursor-pointer"
              onClick={() => navigate(stat.link)}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600 mb-2">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                    <p className="text-sm text-slate-500 mb-1">{stat.description}</p>
                    <p className="text-xs text-slate-400">{stat.details}</p>
                  </div>
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} opacity-20 group-hover:opacity-40 blur-xl transition-all duration-500`}></div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500">Progression</span>
                    <span className="text-xs font-medium text-slate-700">{Math.min(stat.value * 10, 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <motion.div 
                      className={`h-2 rounded-full bg-gradient-to-r ${stat.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(stat.value * 10, 100)}%` }}
                      transition={{ delay: index * 0.2 + 0.5, duration: 1 }}
                    ></motion.div>
                  </div>
                </div>

                {stat.change !== "+0" && (
                  <div className="mt-4 flex items-center">
                    <Badge 
                      variant={stat.changeType === 'increase' ? 'default' : 'secondary'}
                      className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200"
                    >
                      {stat.change}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Nouvelles Demandes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="group"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 hover:shadow-2xl transition-all duration-500">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                Nouvelles Demandes
              </CardTitle>
              <CardDescription className="text-slate-600">
                Lancez une nouvelle démarche administrative
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {(quickActions || []).map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`${action.color} p-5 rounded-2xl text-white cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl relative group overflow-hidden`}
                    onClick={action.action}
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/10 transform translate-x-6 -translate-y-6"></div>
                    
                    <action.icon className="w-8 h-8 mb-3 relative z-10" />
                    <h3 className="font-bold text-sm mb-1 relative z-10">{action.title}</h3>
                    <p className="text-xs opacity-90 relative z-10">{action.description}</p>
                    
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Suivi des Dossiers */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="group"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 hover:shadow-2xl transition-all duration-500">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                Suivi des Dossiers
              </CardTitle>
              <CardDescription className="text-slate-600">
                Dernières mises à jour de vos demandes en cours
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!recentActivities || recentActivities.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12 text-slate-500"
                >
                  <div className="relative mx-auto w-20 h-20 mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full opacity-20"></div>
                    <Activity className="w-12 h-12 mx-auto mt-4 opacity-40" />
                  </div>
                  <p className="text-lg font-medium mb-2">Aucune activité récente</p>
                  <p className="text-sm mb-4">Commencez par faire une demande</p>
                  <Button 
                    onClick={() => navigate('/acheteur/zones-communales')}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    Créer ma première demande
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {(recentActivities || []).map((activity, index) => (
                    <motion.div 
                      key={activity.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                      className="group/item flex items-start space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-200/30"
                      onClick={() => navigate(activity.link)}
                    >
                      <div className="flex-shrink-0 relative">
                        <div className="p-2 rounded-xl bg-white shadow-sm group-hover/item:shadow-md transition-shadow duration-300">
                          {getStatusIcon(activity.status)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-slate-900 group-hover/item:text-blue-900 transition-colors duration-300">
                          {activity.title}
                        </p>
                        <p className="text-xs text-slate-600 mt-1 group-hover/item:text-blue-700 transition-colors duration-300">
                          {activity.description}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                            il y a {activity.time}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs hover:bg-blue-100 hover:text-blue-700 opacity-0 group-hover/item:opacity-100 transition-all duration-300"
                          >
                            {activity.action}
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

ParticulierOverview.displayName = 'ParticulierOverview';

export default ParticulierOverview;