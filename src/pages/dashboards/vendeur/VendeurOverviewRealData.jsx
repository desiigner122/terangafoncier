/**
 * VENDEUR OVERVIEW REAL DATA - VERSION AVEC DONNÉES RÉELLES SUPABASE
 * Dashboard principal avec stats en temps réel, IA et Blockchain
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Building, 
  Users, 
  MessageSquare, 
  Eye, 
  Star, 
  DollarSign,
  Calendar,
  ArrowUp,
  ArrowDown,
  Plus,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  Brain,
  Shield,
  Sparkles,
  Clock,
  Heart,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

const VendeurOverviewRealData = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    pendingProperties: 0,
    soldProperties: 0,
    totalViews: 0,
    totalVisitors: 0,
    totalFavorites: 0,
    totalInquiries: 0,
    pendingInquiries: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    averagePrice: 0,
    conversionRate: 0,
    aiOptimizedCount: 0,
    blockchainVerifiedCount: 0,
    averageCompletion: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [topProperties, setTopProperties] = useState([]);
  const [monthlyGrowth, setMonthlyGrowth] = useState({ views: 0, inquiries: 0, revenue: 0 });

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Charger toutes les propriétés du vendeur
      const { data: properties, error: propError } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          status,
          verification_status,
          price,
          surface,
          views_count,
          favorites_count,
          contact_requests_count,
          ai_analysis,
          blockchain_verified,
          is_featured,
          created_at,
          updated_at
        `)
        .eq('owner_id', user.id);

      if (propError) throw propError;

      // Calculer les stats
      const stats = {
        totalProperties: properties.length,
        activeProperties: properties.filter(p => p.status === 'active').length,
        pendingProperties: properties.filter(p => p.verification_status === 'pending').length,
        soldProperties: properties.filter(p => p.status === 'sold').length,
        totalViews: properties.reduce((sum, p) => sum + (p.views_count || 0), 0),
        totalFavorites: properties.reduce((sum, p) => sum + (p.favorites_count || 0), 0),
        totalInquiries: properties.reduce((sum, p) => sum + (p.contact_requests_count || 0), 0),
        totalRevenue: properties
          .filter(p => p.status === 'sold')
          .reduce((sum, p) => sum + (p.price || 0), 0),
        averagePrice: properties.length > 0 
          ? properties.reduce((sum, p) => sum + (p.price || 0), 0) / properties.length 
          : 0,
        aiOptimizedCount: properties.filter(p => p.ai_analysis && Object.keys(p.ai_analysis).length > 0).length,
        blockchainVerifiedCount: properties.filter(p => p.blockchain_verified).length,
      };

      // Charger les messages en attente
      // NOTE: Table 'contact_requests' n'existe pas - Utiliser 'requests' à la place
      const { data: messages, error: msgError } = await supabase
        .from('requests')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('status', 'pending');

      if (!msgError) {
        stats.pendingInquiries = messages?.length || 0;
      }

      // Top 3 propriétés par vues
      const topProps = [...properties]
        .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
        .slice(0, 3)
        .map(p => ({
          id: p.id,
          title: p.title,
          views: p.views_count || 0,
          inquiries: p.contact_requests_count || 0,
          aiOptimized: p.ai_analysis && Object.keys(p.ai_analysis).length > 0,
          blockchainVerified: p.blockchain_verified || false
        }));

      setTopProperties(topProps);

      // Calculer croissance mensuelle (comparaison avec mois précédent)
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const recentProps = properties.filter(p => new Date(p.created_at) >= oneMonthAgo);
      const oldProps = properties.filter(p => new Date(p.created_at) < oneMonthAgo);

      const recentViews = recentProps.reduce((sum, p) => sum + (p.views_count || 0), 0);
      const oldViews = oldProps.reduce((sum, p) => sum + (p.views_count || 0), 0);

      const growth = {
        views: oldViews > 0 ? ((recentViews - oldViews) / oldViews * 100).toFixed(1) : 0,
        inquiries: 0, // À calculer avec historique
        revenue: 0 // À calculer avec historique
      };

      setMonthlyGrowth(growth);

      // Taux de conversion
      stats.conversionRate = stats.totalViews > 0 
        ? ((stats.totalInquiries / stats.totalViews) * 100).toFixed(1)
        : 0;

      // Revenus mensuels (propriétés vendues ce mois)
      stats.monthlyRevenue = properties
        .filter(p => p.status === 'sold' && new Date(p.updated_at) >= oneMonthAgo)
        .reduce((sum, p) => sum + (p.price || 0), 0);

      // Completion moyenne
      stats.averageCompletion = properties.length > 0
        ? Math.round(properties.reduce((sum, p) => sum + calculateCompletion(p), 0) / properties.length)
        : 0;

      setDashboardStats(stats);

      // Charger activités récentes
      await loadRecentActivities();

    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      toast.error('Erreur lors du chargement du dashboard');
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletion = (property) => {
    let score = 0;
    const checks = [
      property.title,
      property.description,
      property.price,
      property.surface,
      property.location,
      property.images && property.images.length >= 3,
      property.features && Object.keys(property.features).length > 0,
      property.ai_analysis && Object.keys(property.ai_analysis).length > 0
    ];

    checks.forEach(check => {
      if (check) score += 12.5;
    });

    return Math.round(score);
  };

  const loadRecentActivities = async () => {
    try {
      // Charger dernières modifications de propriétés
      const { data: recentProps } = await supabase
        .from('properties')
        .select('id, title, created_at, updated_at, status, verification_status, ai_analysis, blockchain_verified')
        .eq('owner_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(10);

      // Charger nouvelles demandes de contact
      // NOTE: Table 'contact_requests' n'existe pas - Commenté temporairement
      // const { data: recentContacts } = await supabase
      //   .from('contact_requests')
      //   .select('id, created_at, property_id, properties!inner(title)')
      //   .eq('property_owner_id', user.id)
      //   .order('created_at', { ascending: false })
      //   .limit(5);

      const activities = [];

      // Ajouter activités de propriétés
      if (recentProps) {
        recentProps.forEach(prop => {
          const createdDate = new Date(prop.created_at);
          const updatedDate = new Date(prop.updated_at);
          const timeDiff = Math.abs(Date.now() - updatedDate.getTime());
          const timeAgo = formatTimeAgo(timeDiff);

          if (prop.blockchain_verified && timeDiff < 86400000) { // Moins de 24h
            activities.push({
              id: `blockchain-${prop.id}`,
              type: 'blockchain',
              message: `NFT créé pour ${prop.title}`,
              time: timeAgo,
              icon: Shield,
              color: 'text-orange-600'
            });
          }

          if (prop.ai_analysis && Object.keys(prop.ai_analysis).length > 0 && timeDiff < 86400000) {
            activities.push({
              id: `ai-${prop.id}`,
              type: 'ai_optimization',
              message: `Optimisation IA terminée pour ${prop.title}`,
              time: timeAgo,
              icon: Brain,
              color: 'text-purple-600'
            });
          }

          if (prop.verification_status === 'verified' && timeDiff < 172800000) { // Moins de 48h
            activities.push({
              id: `verified-${prop.id}`,
              type: 'verification',
              message: `${prop.title} approuvée par l'administration`,
              time: timeAgo,
              icon: CheckCircle,
              color: 'text-green-600'
            });
          }
        });
      }

      // Ajouter activités de contacts
      if (recentContacts) {
        recentContacts.slice(0, 3).forEach(contact => {
          const timeDiff = Math.abs(Date.now() - new Date(contact.created_at).getTime());
          activities.push({
            id: `contact-${contact.id}`,
            type: 'new_inquiry',
            message: `Nouvelle demande pour ${contact.properties.title}`,
            time: formatTimeAgo(timeDiff),
            icon: MessageSquare,
            color: 'text-blue-600'
          });
        });
      }

      // Trier par temps et limiter à 8 activités
      const sortedActivities = activities
        .sort((a, b) => parseTimeAgo(a.time) - parseTimeAgo(b.time))
        .slice(0, 8);

      setRecentActivities(sortedActivities);

    } catch (error) {
      console.error('Erreur chargement activités:', error);
    }
  };

  const formatTimeAgo = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}j`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}min`;
    return 'maintenant';
  };

  const parseTimeAgo = (timeStr) => {
    if (timeStr === 'maintenant') return 0;
    const value = parseInt(timeStr);
    if (timeStr.includes('min')) return value;
    if (timeStr.includes('h')) return value * 60;
    if (timeStr.includes('j')) return value * 1440;
    return 0;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price).replace('XOF', 'FCFA');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Activity className="mr-3 h-8 w-8 text-blue-600" />
            Vue d'ensemble
          </h1>
          <p className="text-gray-600 mt-1">
            Tableau de bord principal de votre activité vendeur
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button variant="outline" size="sm" onClick={() => navigate('/vendeur/analytics')}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Rapport
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            onClick={() => navigate('/vendeur/add-property')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau bien
          </Button>
        </div>
      </div>

      {/* Statistiques principales avec badges IA/Blockchain */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Biens</p>
                  <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalProperties}</p>
                  <div className="flex items-center mt-2 space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {dashboardStats.activeProperties} actifs
                    </Badge>
                    {dashboardStats.pendingProperties > 0 && (
                      <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-700">
                        {dashboardStats.pendingProperties} en attente
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Building className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vues Total</p>
                  <p className="text-3xl font-bold text-green-600">{dashboardStats.totalViews.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    {parseFloat(monthlyGrowth.views) > 0 ? (
                      <>
                        <ArrowUp className="w-3 h-3 text-green-600 mr-1" />
                        <span className="text-xs text-green-600 font-semibold">+{monthlyGrowth.views}%</span>
                      </>
                    ) : (
                      <span className="text-xs text-gray-500">Pas de données antérieures</span>
                    )}
                  </div>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenus Total</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatPrice(dashboardStats.totalRevenue).slice(0, -5)}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs text-gray-600">
                      Moy: {formatPrice(dashboardStats.averagePrice).slice(0, -5)}
                    </span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Messages</p>
                  <p className="text-3xl font-bold text-orange-600">{dashboardStats.totalInquiries}</p>
                  <div className="flex items-center mt-2">
                    {dashboardStats.pendingInquiries > 0 ? (
                      <Badge variant="destructive" className="text-xs">
                        {dashboardStats.pendingInquiries} en attente
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Tous traités
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activité récente */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0`}>
                        <activity.icon className={`w-5 h-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{activity.message}</p>
                        <p className="text-xs text-gray-500">Il y a {activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Aucune activité récente</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance et badges IA/Blockchain */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Taux de conversion</span>
                  <span className="font-bold text-lg">{dashboardStats.conversionRate}%</span>
                </div>
                <Progress value={parseFloat(dashboardStats.conversionRate)} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {dashboardStats.totalInquiries} demandes / {dashboardStats.totalViews} vues
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Complétion moyenne</span>
                  <span className="font-bold text-lg">{dashboardStats.averageCompletion}%</span>
                </div>
                <Progress value={dashboardStats.averageCompletion} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  Plus vos annonces sont complètes, mieux elles performent
                </p>
              </div>

              <div className="pt-4 border-t space-y-3">
                {/* Badge IA */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <Brain className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">IA Activée</p>
                      <p className="text-xs text-gray-600">Optimisation intelligente</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">{dashboardStats.aiOptimizedCount}</p>
                    <p className="text-xs text-gray-500">biens</p>
                  </div>
                </div>

                {/* Badge Blockchain */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-100">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <Shield className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Blockchain</p>
                      <p className="text-xs text-gray-600">Propriétés tokenisées</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-orange-600">{dashboardStats.blockchainVerifiedCount}</p>
                    <p className="text-xs text-gray-500">NFTs</p>
                  </div>
                </div>

                {/* Score global */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-100">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                      <Sparkles className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Score Global</p>
                      <p className="text-xs text-gray-600">Performance vendeur</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-600">
                      {((dashboardStats.averageCompletion + parseFloat(dashboardStats.conversionRate) * 5) / 15).toFixed(1)}/10
                    </p>
                    <div className="flex items-center justify-end mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${
                            i < Math.floor((dashboardStats.averageCompletion + parseFloat(dashboardStats.conversionRate) * 5) / 30)
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top propriétés avec badges IA/Blockchain */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Top 3 propriétés les plus vues
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => navigate(`/parcelle/${property.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">{property.title}</h4>
                        <div className="flex items-center space-x-2">
                          {property.aiOptimized && (
                            <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                              <Brain className="w-3 h-3 mr-1" />
                              IA
                            </Badge>
                          )}
                          {property.blockchainVerified && (
                            <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              NFT
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-2">
                        <div className="text-2xl font-bold text-blue-600">#{index + 1}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-blue-200">
                      <div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <Eye className="w-4 h-4 mr-1" />
                          <span className="text-xs font-medium">Vues</span>
                        </div>
                        <p className="text-lg font-bold text-blue-700">{property.views}</p>
                      </div>
                      <div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          <span className="text-xs font-medium">Demandes</span>
                        </div>
                        <p className="text-lg font-bold text-green-700">{property.inquiries}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Building className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Aucune propriété pour le moment</p>
                <Button 
                  className="mt-4"
                  onClick={() => navigate('/vendeur/add-property')}
                >
                  Ajouter votre première propriété
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Objectifs du mois */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Objectifs du mois
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Nouvelles vues</span>
                  <span className="text-sm font-bold">{dashboardStats.totalViews} / 10000</span>
                </div>
                <Progress value={(dashboardStats.totalViews / 10000) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Conversions</span>
                  <span className="text-sm font-bold">{dashboardStats.soldProperties} / 5</span>
                </div>
                <Progress value={(dashboardStats.soldProperties / 5) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Revenus mois</span>
                  <span className="text-sm font-bold">
                    {formatPrice(dashboardStats.monthlyRevenue).slice(0, -8)}M / 500M
                  </span>
                </div>
                <Progress value={(dashboardStats.monthlyRevenue / 500000000) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VendeurOverviewRealData;
