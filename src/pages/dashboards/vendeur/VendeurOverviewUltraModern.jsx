import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  ShoppingBag,
  Building2,
  Users,
  DollarSign,
  Clock,
  CheckCircle2,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Package
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabaseClient';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const VendeurOverviewUltraModern = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    pendingRequests: 0,
    completedDeals: 0,
    totalRevenue: 0,
    monthlyGrowth: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Récupérer les parcelles du vendeur
      const { data: sellerParcels } = await supabase
        .from('parcels')
        .select('id, title, price, location')
        .eq('seller_id', user.id);

      const parcelIds = sellerParcels?.map(p => p.id) || [];

      if (parcelIds.length > 0) {
        // Charger les transactions
        const { data: transactionsData } = await supabase
          .from('transactions')
          .select('*')
          .in('parcel_id', parcelIds)
          .eq('transaction_type', 'purchase')
          .order('created_at', { ascending: false })
          .limit(5);

        // Charger les profils acheteurs
        const buyerIds = [...new Set(transactionsData?.map(t => t.buyer_id).filter(Boolean) || [])];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .in('id', buyerIds);

        // Enrichir les demandes
        const enriched = transactionsData?.map(t => {
          const buyer = profilesData?.find(p => p.id === t.buyer_id);
          const parcel = sellerParcels?.find(p => p.id === t.parcel_id);
          const buyerInfo = t.buyer_info || {};
          
          return {
            id: t.id,
            buyer_name: buyerInfo.full_name || `${buyer?.first_name || ''} ${buyer?.last_name || ''}`.trim() || 'Acheteur',
            buyer_email: buyerInfo.email || buyer?.email || '',
            parcel_name: parcel?.title || 'Terrain',
            amount: t.amount,
            status: t.status,
            payment_method: t.payment_method,
            created_at: t.created_at
          };
        }) || [];

        setRecentRequests(enriched);

        // Calculer les stats
        const pending = transactionsData?.filter(t => t.status === 'pending').length || 0;
        const completed = transactionsData?.filter(t => t.status === 'completed').length || 0;
        const revenue = transactionsData?.filter(t => t.status === 'completed')
          .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

        setStats({
          totalProperties: sellerParcels?.length || 0,
          pendingRequests: pending,
          completedDeals: completed,
          totalRevenue: revenue,
          monthlyGrowth: 12.5 // Mock pour l'instant
        });
      }
    } catch (error) {
      console.error('❌ Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const getStatusBadge = (status) => {
    const configs = {
      pending: { color: 'bg-amber-100 text-amber-700', label: 'En attente' },
      completed: { color: 'bg-emerald-100 text-emerald-700', label: 'Complétée' }
    };
    const config = configs[status] || configs.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
              Bonjour, {user?.email?.split('@')[0]} 👋
            </h1>
            <p className="text-slate-600">Voici un aperçu de votre activité</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
            <Sparkles className="w-4 h-4 mr-2" />
            Actions rapides
          </Button>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 shadow-lg text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Building2 className="w-6 h-6" />
              </div>
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold mb-1">{stats.totalProperties}</p>
            <p className="text-blue-100">Biens en vente</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 rounded-xl">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <Badge className="bg-amber-100 text-amber-700">Urgent</Badge>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{stats.pendingRequests}</p>
            <p className="text-slate-600">Demandes en attente</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 shadow-sm border border-emerald-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-emerald-900 mb-1">{stats.completedDeals}</p>
            <p className="text-emerald-700">Ventes finalisées</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-slate-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-slate-600" />
              </div>
              <Badge className="bg-green-100 text-green-700">
                +{stats.monthlyGrowth}%
              </Badge>
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">{formatCurrency(stats.totalRevenue)}</p>
            <p className="text-slate-600">Revenu total</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Demandes récentes */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Demandes Récentes</h2>
                  <p className="text-slate-600 mt-1">Dernières offres d'achat reçues</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate('/vendeur/purchase-requests')}
                  className="rounded-xl"
                >
                  Voir tout
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {recentRequests.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600">Aucune demande récente</p>
                </div>
              ) : (
                recentRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => navigate('/vendeur/purchase-requests')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-900">{request.buyer_name}</p>
                          {getStatusBadge(request.status)}
                          <Badge className="bg-blue-100 text-blue-700 text-xs">
                            {request.payment_method === 'one-time' ? 'Comptant' : 
                             request.payment_method === 'installments' ? 'Échelonné' : 'Financement'}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">{request.parcel_name}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatDistanceToNow(new Date(request.created_at), { addSuffix: true, locale: fr })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">{formatCurrency(request.amount)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Actions rapides */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4">Actions Rapides</h3>
            <div className="space-y-3">
              <Button
                className="w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={() => navigate('/vendeur/add-property')}
              >
                <Package className="w-4 h-4 mr-2" />
                Ajouter un terrain
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl"
                onClick={() => navigate('/vendeur/purchase-requests')}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Voir les demandes
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl"
                onClick={() => navigate('/vendeur/properties')}
              >
                <Building2 className="w-4 h-4 mr-2" />
                Mes biens
              </Button>
            </div>
          </motion.div>

          {/* Performance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 shadow-lg text-white"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Performance</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-purple-100 text-sm mb-1">Taux de conversion</p>
                <p className="text-2xl font-bold">
                  {stats.totalProperties > 0 ? 
                    Math.round((stats.completedDeals / stats.totalProperties) * 100) : 0}%
                </p>
              </div>
              <div className="pt-3 border-t border-white/20">
                <p className="text-purple-100 text-sm mb-1">Croissance mensuelle</p>
                <p className="text-2xl font-bold">+{stats.monthlyGrowth}%</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VendeurOverviewUltraModern;
