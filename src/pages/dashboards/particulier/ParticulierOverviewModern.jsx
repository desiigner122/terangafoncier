import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  FileText, 
  Bell,
  MapPin,
  Building2,
  ShoppingCart,
  Calendar,
  Bot,
  Blocks,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Home,
  Briefcase
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { useUnreadCounts } from '@/hooks/useUnreadCounts';

const ParticulierOverviewModern = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { unreadMessagesCount, unreadNotificationsCount } = useUnreadCounts();
  
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    zonesDisponibles: 0,
    demandesTerrains: 0,
    demandesConstruction: 0,
    purchaseRequests: 0,
    documents: 0,
    nextAppointment: null
  });

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Charger zones communales disponibles
      const { data: zones } = await supabase
        .from('zones_communales')
        .select('id')
        .eq('statut', 'disponible');

      // Charger demandes terrains
      let demandesTerrains = [];
      try {
        const { data } = await supabase
          .from('demandes_terrains_communaux')
          .select('id, statut')
          .eq('user_id', user.id);
        demandesTerrains = data || [];
      } catch (err) {
        console.warn('⚠️ Table demandes_terrains_communaux manquante');
      }

      // Charger demandes construction
      let demandesConstruction = [];
      try {
        const { data } = await supabase
          .from('demandes_construction')
          .select('id, statut')
          .eq('user_id', user.id);
        demandesConstruction = data || [];
      } catch (err) {
        console.warn('⚠️ Table demandes_construction manquante');
      }

      // Charger purchase requests
      const { data: purchases } = await supabase
        .from('purchase_requests')
        .select('id, status')
        .eq('buyer_id', user.id)
        .in('status', ['pending', 'in_progress', 'seller_reviewing']);

      // Charger documents
      const { data: docs } = await supabase
        .from('documents_administratifs')
        .select('id, status')
        .eq('user_id', user.id);

      // Charger prochain RDV
      const { data: nextAppt } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .gte('scheduled_date', new Date().toISOString())
        .order('scheduled_date', { ascending: true })
        .limit(1)
        .single();

      setDashboardStats({
        zonesDisponibles: zones?.length || 0,
        demandesTerrains: demandesTerrains?.filter(d => 
          ['en_attente', 'en_cours', 'en_instruction'].includes(d.statut)
        ).length || 0,
        demandesConstruction: demandesConstruction?.filter(d => 
          ['en_attente', 'en_cours', 'en_instruction'].includes(d.statut)
        ).length || 0,
        purchaseRequests: purchases?.length || 0,
        documents: docs?.filter(d => d.status === 'En attente').length || 0,
        nextAppointment: nextAppt || null
      });

    } catch (error) {
      console.error('❌ Erreur chargement dashboard:', error);
      // Données fallback
      setDashboardStats({
        zonesDisponibles: 12,
        demandesTerrains: 0,
        demandesConstruction: 0,
        purchaseRequests: 0,
        documents: 0,
        nextAppointment: null
      });
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      id: 'zones-communales',
      title: 'Zones Communales',
      description: 'Explorer les terrains publics disponibles',
      icon: MapPin,
      color: 'from-emerald-500 to-teal-600',
      stats: `${dashboardStats.zonesDisponibles} zones disponibles`,
      badge: dashboardStats.zonesDisponibles,
      path: '/acheteur/zones-communales'
    },
    {
      id: 'demandes-terrains',
      title: 'Demandes Terrains',
      description: 'Suivez vos candidatures terrains communaux',
      icon: FileText,
      color: 'from-blue-500 to-cyan-600',
      stats: dashboardStats.demandesTerrains > 0 
        ? `${dashboardStats.demandesTerrains} demandes actives`
        : 'Aucune demande active',
      badge: dashboardStats.demandesTerrains,
      path: '/acheteur/demandes-terrains'
    },
    {
      id: 'construction',
      title: 'Projets Construction',
      description: 'Candidatures auprès des promoteurs',
      icon: Building2,
      color: 'from-orange-500 to-red-600',
      stats: dashboardStats.demandesConstruction > 0
        ? `${dashboardStats.demandesConstruction} projets en cours`
        : 'Aucun projet en cours',
      badge: dashboardStats.demandesConstruction,
      path: '/acheteur/construction'
    },
    {
      id: 'promoteurs',
      title: 'Candidatures Promoteurs',
      description: 'Suivi de vos candidatures projets',
      icon: Briefcase,
      color: 'from-indigo-500 to-purple-600',
      stats: 'Explorer les opportunités',
      badge: null,
      path: '/acheteur/promoteurs'
    },
    {
      id: 'mes-achats',
      title: 'Mes Achats',
      description: 'Suivi de vos achats de propriétés',
      icon: ShoppingCart,
      color: 'from-purple-500 to-pink-600',
      stats: dashboardStats.purchaseRequests > 0
        ? `${dashboardStats.purchaseRequests} achats en cours`
        : 'Aucun achat en cours',
      badge: dashboardStats.purchaseRequests,
      path: '/acheteur/mes-achats'
    },
    {
      id: 'messages',
      title: 'Messages',
      description: 'Communiquez avec les vendeurs',
      icon: MessageSquare,
      color: 'from-blue-600 to-indigo-600',
      stats: unreadMessagesCount > 0
        ? `${unreadMessagesCount} non lus`
        : 'Aucun nouveau message',
      badge: unreadMessagesCount,
      path: '/acheteur/messages'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Alertes et mises à jour importantes',
      icon: Bell,
      color: 'from-red-500 to-orange-600',
      stats: unreadNotificationsCount > 0
        ? `${unreadNotificationsCount} nouvelles`
        : 'Aucune notification',
      badge: unreadNotificationsCount,
      path: '/acheteur/notifications',
      badgeColor: 'bg-red-500'
    },
    {
      id: 'documents',
      title: 'Documents',
      description: 'Gérez vos documents administratifs',
      icon: FileText,
      color: 'from-slate-500 to-gray-600',
      stats: dashboardStats.documents > 0
        ? `${dashboardStats.documents} en attente`
        : 'Tous les documents à jour',
      badge: dashboardStats.documents,
      path: '/acheteur/documents'
    },
    {
      id: 'calendar',
      title: 'Calendrier',
      description: 'Gérez vos rendez-vous',
      icon: Calendar,
      color: 'from-amber-500 to-yellow-600',
      stats: dashboardStats.nextAppointment
        ? `Prochain: ${new Date(dashboardStats.nextAppointment.scheduled_date).toLocaleDateString('fr-FR')}`
        : 'Aucun RDV planifié',
      path: '/acheteur/calendar'
    },
    {
      id: 'ai',
      title: 'Assistant IA',
      description: 'Intelligence artificielle pour vous guider',
      icon: Bot,
      color: 'from-violet-500 to-purple-600',
      stats: 'Recommandations personnalisées',
      path: '/acheteur/ai'
    },
    {
      id: 'blockchain',
      title: 'Blockchain',
      description: 'Certification et traçabilité',
      icon: Blocks,
      color: 'from-cyan-500 to-blue-700',
      stats: 'Vérification sécurisée',
      path: '/acheteur/blockchain'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'success',
      icon: CheckCircle2,
      title: 'Compte activé',
      description: 'Votre profil acheteur est maintenant actif',
      time: 'Aujourd\'hui',
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'info',
      icon: Users,
      title: 'Bienvenue sur Teranga Foncier',
      description: 'Explorez les opportunités foncières au Sénégal',
      time: 'Aujourd\'hui',
      color: 'text-blue-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Bienvenue, {user?.email?.split('@')[0] || 'Acheteur'} 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Tableau de bord complet de vos activités
              </p>
            </div>
            <Home className="h-16 w-16 text-white/30" />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm text-blue-100 mb-1">Demandes actives</p>
              <p className="text-2xl font-bold">
                {dashboardStats.demandesTerrains + dashboardStats.demandesConstruction + dashboardStats.purchaseRequests}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm text-blue-100 mb-1">Zones disponibles</p>
              <p className="text-2xl font-bold">{dashboardStats.zonesDisponibles}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm text-blue-100 mb-1">Messages</p>
              <p className="text-2xl font-bold">{unreadMessagesCount}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm text-blue-100 mb-1">Documents</p>
              <p className="text-2xl font-bold">{dashboardStats.documents}</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 overflow-hidden group"
                    onClick={() => navigate(action.path)}
                  >
                    <div className={`h-2 bg-gradient-to-r ${action.color}`} />
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-lg`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        {action.badge > 0 && (
                          <Badge className={action.badgeColor || 'bg-blue-600'}>
                            {action.badge}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg mt-3">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">{action.stats}</span>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Activité Récente
            </CardTitle>
            <CardDescription>Vos dernières actions sur la plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className={`p-2 rounded-lg bg-slate-100 ${activity.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">{activity.title}</h4>
                      <p className="text-sm text-slate-600">{activity.description}</p>
                    </div>
                    <span className="text-xs text-slate-500">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              Besoin d'aide ?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 mb-4">
              Notre équipe est là pour vous accompagner dans vos démarches foncières.
            </p>
            <div className="flex gap-3">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contacter le support
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Consulter le guide
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParticulierOverviewModern;
