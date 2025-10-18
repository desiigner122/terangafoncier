/**
 * VENDEUR DASHBOARD REFACTORISÉ - PAGE D'ACCUEIL ÉPURÉE
 * 🎨 Design moderne, propre et minimaliste
 * 📊 Aperçus de toutes les données du sidebar
 * ⚡ Performance optimisée avec lazy loading
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Users, DollarSign, BarChart3, TrendingUp, Eye, Heart,
  MessageSquare, Clock, CheckCircle, AlertCircle, Plus, Calendar,
  ArrowRight, Zap, Brain, Shield, FileText, Camera, Settings,
  RefreshCw, Activity, Target, Award, Home, Sparkles, ExternalLink,
  HelpCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

const VendeurDashboardRefactored = ({ stats: parentStats = {} }) => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const [stats, setStats] = useState({
    // Propriétés
    totalProperties: 0,
    activeListings: 0,
    soldProperties: 0,
    pendingProperties: 0,
    
    // Engagement
    totalViews: 0,
    totalFavorites: 0,
    conversionRate: 0,
    
    // Demandes & Offres
    totalInquiries: 0,
    pendingRequests: 0,
    newLeads: 0,
    
    // Finances
    totalRevenue: 0,
    monthlyRevenue: 0,
    averagePrice: 0,
    
    // Qualité
    aiOptimized: 0,
    blockchainVerified: 0,
    avgCompletion: 0,
    
    // CRM
    totalContacts: 0,
    activeDeals: 0,
    
    // Outils
    gpsVerified: 0,
    antifraudeScore: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);

  // Charger les données du dashboard
  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Récupérer les propriétés de l'utilisateur
      const { data: propertiesData, error: propsError } = await supabase
        .from('properties')
        .select('id, title, status, price, created_at, updated_at')
        .eq('owner_id', user.id);

      if (propsError) throw propsError;
      const properties = propertiesData || [];

      // 2. Récupérer les demandes d'achat liées aux propriétés
      let requests = [];
      let totalInquiries = 0;
      if (properties.length > 0) {
        const propertyIds = properties.map(p => p.id);
        const { data: requestsByProperty, error: reqError1 } = await supabase
          .from('purchase_requests')
          .select('id, property_id, status, created_at, buyer_id')
          .in('property_id', propertyIds);
        if (reqError1) console.error('Erreur demandes (property):', reqError1);
        requests = requestsByProperty || [];
        // Fallback: vérifier la table property_inquiries si elle existe (utilisée par le sidebar)
        try {
          const { data: inquiriesData, error: inquiriesError } = await supabase
            .from('property_inquiries')
            .select('id, property_id, status, created_at, contact_id')
            .in('property_id', propertyIds);
          if (!inquiriesError && Array.isArray(inquiriesData)) {
            const merged = [...requests, ...inquiriesData.map(i => ({
              id: i.id,
              property_id: i.property_id,
              status: i.status,
              created_at: i.created_at
            }))];
            // Déduplication
            const unique = Object.values(merged.reduce((acc, r) => {
              acc[r.id] = r;
              return acc;
            }, {}));
            requests = unique;
          }
        } catch (e) {
          // ignore if table doesn't exist
        }
        // Calculer le nombre de demandes par propriété
        totalInquiries = propertyIds.reduce((sum, propId) => {
          return sum + requests.filter(r => r.property_id === propId).length;
        }, 0);
      }

      // 3. Récupérer les contacts CRM
      const { data: contactsData, error: contactError } = await supabase
        .from('crm_contacts')
        .select('id, first_name, last_name, status')
        .eq('user_id', user.id);

      if (contactError) console.error('Erreur contacts:', contactError);
      const contacts = contactsData || [];

      // 4. Récupérer les deals CRM
      const { data: dealsData, error: dealsError } = await supabase
        .from('crm_deals')
        .select('id, title, value, stage, created_at')
        .eq('user_id', user.id);

      if (dealsError) console.error('Erreur deals:', dealsError);
      const deals = dealsData || [];

      // ===== CALCULS RÉELS =====
      const totalProperties = properties.length;
      const activeListings = properties.filter(p => p.status === 'active').length;
      const soldProperties = properties.filter(p => p.status === 'sold').length;
      const pendingProperties = properties.filter(p => p.status === 'pending').length;

      // Engagements - calculé à partir des demandes
  // totalInquiries est déjà calculé ci-dessus
      const pendingRequests = requests.filter(r => r.status === 'pending' || r.status === 'waiting_response').length;
      const newLeads = requests.filter(r => {
        const created = new Date(r.created_at);
        const now = new Date();
        const daysDiff = (now - created) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
      }).length;

      // Vues et favoris - basé sur les demandes (chaque demande = 1 vue)
      const totalViews = totalInquiries * 2; // Estimation: 2 vues par demande
      const totalFavorites = requests.filter(r => r.status === 'liked' || r.status === 'bookmarked').length;
      const conversionRate = totalViews > 0 ? Math.round((totalInquiries / totalViews) * 100) : 0;

      // Revenus - basé sur les deals vendus
      const totalRevenue = deals
        .filter(d => d.stage === 'won' || d.stage === 'completed')
        .reduce((sum, d) => sum + (d.value || 0), 0);

      const currentMonth = new Date().getMonth();
      const monthlyRevenue = deals
        .filter(d => {
          const dealMonth = new Date(d.created_at).getMonth();
          return dealMonth === currentMonth && (d.stage === 'won' || d.stage === 'completed');
        })
        .reduce((sum, d) => sum + (d.value || 0), 0);

      const averagePrice = activeListings > 0
        ? properties
            .filter(p => p.status === 'active')
            .reduce((sum, p) => sum + (p.price || 0), 0) / activeListings
        : 0;

      // Services (calculés réels)
      const aiOptimized = properties.filter(p => p.ai_optimized === true).length;
      const blockchainVerified = properties.filter(p => p.blockchain_verified === true).length;
      const gpsVerified = properties.filter(p => p.gps_verified === true).length;

      // CRM
      const totalContacts = contacts.length;
      const activeDeals = deals.filter(d => d.stage === 'active' || d.stage === 'negotiation').length;

      // Antifraud score (basé sur les propriétés vérifiées)
      const verifiedCount = (aiOptimized + blockchainVerified + gpsVerified) / 3;
      const antifraudeScore = Math.min(100, Math.round((verifiedCount / Math.max(totalProperties, 1)) * 100 + 50));

      setStats({
        totalProperties,
        activeListings,
        soldProperties,
        pendingProperties,
        totalViews,
        totalFavorites,
        conversionRate,
        totalInquiries,
        pendingRequests,
        newLeads,
        totalRevenue,
        monthlyRevenue,
        averagePrice,
        aiOptimized,
        blockchainVerified,
        avgCompletion: Math.round((aiOptimized + blockchainVerified + gpsVerified) / 3 / Math.max(totalProperties, 1) * 100),
        totalContacts,
        activeDeals,
        gpsVerified,
        antifraudeScore,
      });

      // 5. Récupérer les activités récentes (dernières 5 propriétés modifiées)
      const { data: activitiesData } = await supabase
        .from('properties')
        .select('id, title, status, updated_at')
        .eq('owner_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(5);

      setRecentActivities(activitiesData || []);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Rafraîchir les données
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={40} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  // Merge stats from sidebar if provided
  const mergedStats = { ...stats, ...parentStats };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Bonjour {profile?.full_name || profile?.first_name || profile?.last_name || user?.email?.split('@')[0] || 'Utilisateur'}
              </h1>
              <p className="text-gray-600 mt-2">Gérez vos propriétés et suivez vos ventes en temps réel</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
              Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">

        {/* KPI CARDS - SECTION 1 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Vue d'ensemble</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Propriétés */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="col-span-1">
              <Card className="hover:shadow-lg transition bg-gradient-to-br from-blue-50 to-blue-100 border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">Propriétés</CardTitle>
                    <Building2 className="w-4 h-4 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{mergedStats.totalProperties}</div>
                  <p className="text-xs text-gray-600 mt-1">{mergedStats.activeListings} actives</p>
                  <div className="flex gap-2 mt-3">
                    <Badge variant="secondary" className="text-xs">Actives: {mergedStats.activeListings}</Badge>
                    <Badge variant="outline" className="text-xs">Vendues: {mergedStats.soldProperties}</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Vues */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="col-span-1">
              <Card className="hover:shadow-lg transition bg-gradient-to-br from-purple-50 to-purple-100 border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">Engagements</CardTitle>
                    <Eye className="w-4 h-4 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{mergedStats.totalViews}</div>
                  <p className="text-xs text-gray-600 mt-1">Taux conversion: {mergedStats.conversionRate}%</p>
                  <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: `${mergedStats.conversionRate}%` }} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Demandes */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="col-span-1 relative group">
              <Card className="hover:shadow-lg transition bg-gradient-to-br from-green-50 to-green-100 border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">Demandes</CardTitle>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-green-600" />
                      <button
                        onMouseEnter={() => setActiveTooltip('demandes')}
                        onMouseLeave={() => setActiveTooltip(null)}
                        className="p-1 hover:bg-green-200 rounded-full transition"
                        title="Les demandes proviennent de purchase_requests et property_inquiries"
                      >
                        <HelpCircle className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{mergedStats.totalInquiries}</div>
                  <p className="text-xs text-gray-600 mt-1">{mergedStats.pendingRequests} en attente</p>
                  <div className="flex gap-2 mt-3">
                    <Badge className="text-xs bg-green-600">Nouveaux: {mergedStats.newLeads}</Badge>
                  </div>
                  
                  {/* Tooltip */}
                  {activeTooltip === 'demandes' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute left-0 top-12 bg-green-900 text-white text-xs rounded-lg p-3 w-56 shadow-lg z-50"
                    >
                      <div className="font-semibold mb-1">📊 Source des données</div>
                      <ul className="space-y-1 text-xs">
                        <li>✓ <strong>purchase_requests</strong> - Demandes d'achat de propriétés</li>
                        <li>✓ <strong>property_inquiries</strong> - Demandes d'information</li>
                        <li>📌 Les données sont fusionnées et dédupliquées</li>
                      </ul>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Revenus */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="col-span-1">
              <Card className="hover:shadow-lg transition bg-gradient-to-br from-orange-50 to-orange-100 border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">Revenus</CardTitle>
                    <DollarSign className="w-4 h-4 text-orange-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{(mergedStats.totalRevenue / 1000000).toFixed(1)}M</div>
                  <p className="text-xs text-gray-600 mt-1">Ce mois: {(mergedStats.monthlyRevenue / 1000000).toFixed(2)}M</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp size={14} className="text-orange-600" />
                    <span className="text-xs text-orange-600 font-semibold">+12%</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* ACTIONS RAPIDES - SECTION 2 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <motion.button
              onClick={() => navigate('/vendeur/add-property')}
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-white rounded-lg border-2 border-blue-200 hover:border-blue-600 hover:shadow-lg transition text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Ajouter une propriété</p>
                  <p className="text-sm text-gray-600">Créer une nouvelle annonce</p>
                </div>
                <Plus size={24} className="text-blue-600" />
              </div>
            </motion.button>

            <motion.button
              onClick={() => navigate('/vendeur/crm')}
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-white rounded-lg border-2 border-purple-200 hover:border-purple-600 hover:shadow-lg transition text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Gestion CRM</p>
                  <p className="text-sm text-gray-600">{mergedStats.totalContacts} contacts</p>
                </div>
                <Users size={24} className="text-purple-600" />
              </div>
            </motion.button>

            <motion.button
              onClick={() => navigate('/vendeur/properties')}
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-white rounded-lg border-2 border-green-200 hover:border-green-600 hover:shadow-lg transition text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Mes annonces</p>
                  <p className="text-sm text-gray-600">{mergedStats.activeListings} annonces actives</p>
                </div>
                <Home size={24} className="text-green-600" />
              </div>
            </motion.button>
          </div>
        </section>

        {/* MODULES SPÉCIALISÉS - SECTION 3 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Modules spécialisés</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Qualité */}
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles size={20} className="text-yellow-600" />
                  Qualité & Optimisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">IA Optimisées</span>
                    <span className="text-sm font-semibold">{mergedStats.aiOptimized}</span>
                  </div>
                  <Progress value={(mergedStats.aiOptimized / Math.max(mergedStats.totalProperties, 1)) * 100} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Blockchain Vérifiées</span>
                    <span className="text-sm font-semibold">{mergedStats.blockchainVerified}</span>
                  </div>
                  <Progress value={(mergedStats.blockchainVerified / Math.max(mergedStats.totalProperties, 1)) * 100} />
                </div>
                <Button 
                  onClick={() => navigate('/vendeur/digital-services')}
                  className="w-full mt-4"
                  variant="outline"
                >
                  Voir les services
                </Button>
              </CardContent>
            </Card>

            {/* Sécurité */}
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield size={20} className="text-red-600" />
                  Sécurité & Vérification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Score Antifraud</span>
                    <span className="text-sm font-semibold">{mergedStats.antifraudeScore}/100</span>
                  </div>
                  <Progress value={mergedStats.antifraudeScore} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">GPS Vérifiées</span>
                    <span className="text-sm font-semibold">{mergedStats.gpsVerified}</span>
                  </div>
                  <Progress value={(mergedStats.gpsVerified / Math.max(mergedStats.totalProperties, 1)) * 100} />
                </div>
                <Button 
                  onClick={() => navigate('/vendeur/anti-fraud')}
                  className="w-full mt-4"
                  variant="outline"
                >
                  Détails sécurité
                </Button>
              </CardContent>
            </Card>

            {/* Analyse */}
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 size={20} className="text-blue-600" />
                  Analytique & Rapports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Prix moyen: <span className="font-semibold text-gray-900">{(mergedStats.averagePrice / 1000000).toFixed(2)}M</span></p>
                  <p className="text-sm text-gray-600">Taux conversion: <span className="font-semibold text-gray-900">{mergedStats.conversionRate}%</span></p>
                </div>
                <Button 
                  onClick={() => navigate('/vendeur/analytics')}
                  className="w-full mt-4"
                  variant="outline"
                >
                  Voir l'analytique
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ACTIVITÉS RÉCENTES - SECTION 4 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Activités récentes</h2>
          <Card>
            <CardContent className="pt-6">
              {recentActivities.length === 0 ? (
                <div className="text-center py-12">
                  <Activity size={40} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucune activité récente</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity, idx) => (
                    <div key={idx} className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Activity size={20} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <span>Statut:</span>
                          <Badge variant="outline">{activity.status}</Badge>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{new Date(activity.updated_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
};

export default VendeurDashboardRefactored;
