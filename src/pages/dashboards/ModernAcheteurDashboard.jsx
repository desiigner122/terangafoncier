import React, { useMemo, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, Building2, Landmark, Banknote, CreditCard, Timer, Heart, FileText, 
  ShoppingCart, ArrowRight, Star, Shield, Layers, Rocket, Bell, Search, 
  Calendar, Folder, TrendingUp, Bookmark, Clock, Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';

const ModernAcheteurDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [favCount, setFavCount] = useState(0);
  const [savedSearchesCount, setSavedSearchesCount] = useState(0);
  const [requestsCount, setRequestsCount] = useState(0);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState([]);

  // Fake metrics/data until wired to real services
  const kpis = useMemo(() => ([
    { label: 'Favoris', value: favCount, icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50' },
    { label: 'Alertes actives', value: savedSearchesCount, icon: Bell, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Demandes envoyées', value: requestsCount, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Notifications', value: unreadNotifCount, icon: Bell, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]), [favCount, savedSearchesCount, requestsCount, unreadNotifCount]);

  const recentActivity = [
    { type: 'save', title: 'Parcelle 500 m² - Almadies', when: 'il y a 2j', to: '/parcelle/147' },
    { type: 'view', title: 'Résidence Les Palmiers', when: 'hier', to: '/project/PROJ-001' },
    { type: 'request', title: 'Demande communale - Zone Nord', when: 'il y a 3j', to: '/my-requests' },
  ];

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        // Favorites count from users.favorites array
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('favorites')
          .eq('id', user.id)
          .single();
        if (!profileError && profile?.favorites) {
          setFavCount(Array.isArray(profile.favorites) ? profile.favorites.length : 0);
        } else {
          setFavCount(0);
        }

        // Saved searches count
        const { count: searchesCount } = await supabase
          .from('saved_searches')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        setSavedSearchesCount(searchesCount || 0);

        // Requests count (all requests by user)
        const { count: reqCount } = await supabase
          .from('requests')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        setRequestsCount(reqCount || 0);

        // Unread notifications count and latest notifications
        const [{ count: unreadCount }, { data: notifs }] = await Promise.all([
          supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('read', false),
          supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5)
        ]);
        setUnreadNotifCount(unreadCount || 0);
        setRecentNotifications(notifs || []);
      } catch (e) {
        console.warn('Erreur chargement KPIs/notifications:', e);
      }
    };
    loadData();
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Bienvenue sur votre espace Acheteur</h1>
          <p className="text-gray-600 mt-1">Accédez rapidement au marché, aux projets des promoteurs et à vos parcours d'achat.</p>
        </div>

        {/* KPI stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpis.map((k, i) => (
            <Card key={i} className={`hover:shadow ${k.bg}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">{k.label}</div>
                  <div className="text-2xl font-bold text-gray-900">{k.value}</div>
                </div>
                <k.icon className={`w-6 h-6 ${k.color}`} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="w-5 h-5 text-blue-600" />
                Parcelles des vendeurs
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-3">Explorez les terrains disponibles sur le marché privé.</p>
              <Button onClick={() => navigate('/parcelles-vendeurs')} className="w-full">
                Découvrir
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Layers className="w-5 h-5 text-purple-600" />
                Projets des promoteurs
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-3">Précommandez des appartements/villas en construction.</p>
              <Button onClick={() => navigate('/promoters-projects')} className="w-full">
                Voir les projets
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Landmark className="w-5 h-5 text-emerald-600" />
                Demandes communales
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-3">Faites une demande d'attribution de terrain communal.</p>
              <Button onClick={() => navigate('/request-municipal-land')} variant="secondary" className="w-full">
                Démarrer une demande
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Purchase flows */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Paiement comptant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Achetez rapidement un terrain avec paiement unique et remises possibles.</p>
              <div className="flex gap-2">
                <Button asChild>
                  <Link to="/buy/one-time">Commencer</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/favorites">Mes favoris</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-purple-600" />
                Paiement échelonné
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Répartissez le paiement sur plusieurs mois avec contrat sécurisé.</p>
              <div className="flex gap-2">
                <Button asChild>
                  <Link to="/buy/installments">Configurer</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/transactions">Mes transactions</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="w-5 h-5 text-emerald-600" />
                Financement bancaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Obtenez un crédit immobilier auprès de nos banques partenaires.</p>
              <div className="flex gap-2">
                <Button asChild>
                  <Link to="/buy/bank-financing">Simuler</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/documents">Mes documents</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Promoter flows + data widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" />
                Acheter un logement (promoteur)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Réservez un appartement ou une villa dans un projet en cours.</p>
              <div className="flex gap-2">
                <Button asChild>
                  <Link to="/promoters/purchase-units">Acheter un logement</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/promoters/payment-plans">Plans de paiement</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                Coffre-fort numérique & suivi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" asChild>
                  <Link to="/digital-vault">Coffre-fort</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/my-requests">Mes demandes</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/saved-searches">Recherches sauvegardées</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/notifications">Notifications</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-600" />
                Dernières activités
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((it, idx) => (
                  <Link key={idx} to={it.to} className="flex items-start justify-between p-2 rounded hover:bg-gray-50">
                    <div className="text-sm text-gray-800">{it.title}</div>
                    <div className="text-xs text-gray-500">{it.when}</div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications stream */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Notifications récentes
                <Badge variant="secondary" className="ml-2">{recentNotifications.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {recentNotifications.map((n) => (
                  <Link key={n.id} to={n.link || '/notifications'} className="flex items-start justify-between py-3 hover:bg-gray-50 px-2 rounded">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{n.title || 'Notification'}</div>
                      <div className="text-xs text-gray-600">{n.content || n.detail || ''}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-rose-600" />
                Favoris & recherches
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Parcelles favorites</span>
                <Badge>{favCount}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Projets favoris</span>
                <Badge>3</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Recherches sauvegardées</span>
                <Badge>{savedSearchesCount}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button variant="outline" asChild>
                  <Link to="/favorites">Voir favoris</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/saved-searches">Voir recherches</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ModernAcheteurDashboard;