import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Eye,
  TrendingUp,
  Filter,
  Search,
  Calendar,
  DollarSign,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  MoreVertical,
  MessageSquare,
  FileText,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/lib/supabaseClient';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const VendeurPurchaseRequestsModern = () => {
  const outletContext = useOutletContext();
  const { user } = outletContext || {};
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      console.log('🔍 [VENDEUR] Chargement demandes pour user:', user.id);

      // Récupérer les parcelles du vendeur
      const { data: sellerParcels, error: parcelsError } = await supabase
        .from('parcels')
        .select('id')
        .eq('seller_id', user.id);

      if (parcelsError) throw parcelsError;

      const parcelIds = sellerParcels?.map(p => p.id) || [];
      console.log('🏠 [VENDEUR] Parcelles trouvées:', parcelIds.length, parcelIds);

      if (parcelIds.length === 0) {
        setRequests([]);
        setLoading(false);
        return;
      }

      // Charger depuis transactions au lieu de requests
      const { data: transactionsData, error } = await supabase
        .from('transactions')
        .select('*')
        .in('parcel_id', parcelIds)
        .eq('transaction_type', 'purchase')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!transactionsData || transactionsData.length === 0) {
        setRequests([]);
        setLoading(false);
        return;
      }

      // Charger les parcelles
      const { data: parcelsData } = await supabase
        .from('parcels')
        .select('id, title, name, price, location, surface, status')
        .in('id', parcelIds);

      // Charger les profils acheteurs
      const buyerIds = [...new Set(transactionsData.map(t => t.buyer_id).filter(Boolean))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', buyerIds);

      // Transformer les transactions
      const enrichedRequests = transactionsData.map(transaction => {
        const buyer = profilesData?.find(p => p.id === transaction.buyer_id);
        const parcel = parcelsData?.find(p => p.id === transaction.parcel_id);
        const buyerInfo = transaction.buyer_info || {};
        
        return {
          id: transaction.id,
          user_id: transaction.buyer_id,
          parcel_id: transaction.parcel_id,
          status: transaction.status,
          created_at: transaction.created_at,
          updated_at: transaction.updated_at,
          payment_method: transaction.payment_method,
          offered_price: transaction.amount,
          offer_price: transaction.amount,
          request_type: transaction.payment_method || 'general',
          message: transaction.description || '',
          buyer_info: buyerInfo,
          buyer_name: buyerInfo.full_name || `${buyer?.first_name || ''} ${buyer?.last_name || ''}`.trim() || 'Acheteur',
          buyer_email: buyerInfo.email || buyer?.email || '',
          buyer_phone: buyerInfo.phone || buyer?.phone || '',
          parcels: parcel,
          properties: parcel,
          profiles: buyer,
          buyer: buyer,
          transactions: [transaction]
        };
      });

      console.log('✅ [VENDEUR] Transactions chargées:', enrichedRequests.length, enrichedRequests);
      setRequests(enrichedRequests);
    } catch (error) {
      console.error('❌ Erreur chargement demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les demandes
  const filteredRequests = requests.filter(request => {
    const matchesTab = activeTab === 'all' || request.status === activeTab;
    const matchesSearch = searchTerm === '' || 
      request.buyer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.buyer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.parcels?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Statistiques
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    completed: requests.filter(r => r.status === 'completed').length,
    revenue: requests.filter(r => r.status === 'completed').reduce((sum, r) => sum + (r.offered_price || 0), 0)
  };

  // Helpers
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'one-time': return <Wallet className="w-4 h-4" />;
      case 'installments': return <Calendar className="w-4 h-4" />;
      case 'bank-financing': return <Building2 className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'one-time': return 'Comptant';
      case 'installments': return 'Échelonné';
      case 'bank-financing': return 'Financement';
      default: return 'Autre';
    }
  };

  const getStatusBadge = (status) => {
    const configs = {
      pending: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock, label: 'En attente' },
      completed: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2, label: 'Complétée' },
      rejected: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle, label: 'Refusée' }
    };
    const config = configs[status] || configs.pending;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} border`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatTimeAgo = (date) => {
    if (!date) return 'N/A';
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* En-tête moderne */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Demandes d'Achat
                </h1>
                <p className="text-slate-600 mt-1">Gérez vos offres en temps réel</p>
              </div>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
            <Sparkles className="w-4 h-4 mr-2" />
            Nouvelle demande
          </Button>
        </div>

        {/* Statistiques modernes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-slate-500">TOTAL</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-sm text-slate-600 mt-1">Demandes reçues</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-sm border border-amber-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-amber-100 rounded-xl">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-xs font-medium text-amber-600">EN ATTENTE</span>
            </div>
            <p className="text-3xl font-bold text-amber-900">{stats.pending}</p>
            <p className="text-sm text-amber-700 mt-1">À traiter rapidement</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 shadow-sm border border-emerald-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-emerald-600">COMPLÉTÉES</span>
            </div>
            <p className="text-3xl font-bold text-emerald-900">{stats.completed}</p>
            <p className="text-sm text-emerald-700 mt-1">Ventes finalisées</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 shadow-lg text-white"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold">{formatCurrency(stats.revenue)}</p>
            <p className="text-sm text-blue-100 mt-1">Revenu total</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Barre de recherche et filtres */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Rechercher par acheteur, email ou terrain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 border-slate-200 focus:border-blue-500 rounded-xl"
            />
          </div>
          <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200">
            <Filter className="w-4 h-4 mr-2" />
            Filtres avancés
          </Button>
        </div>
      </motion.div>

      {/* Onglets et liste */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white p-2 rounded-xl shadow-sm border border-slate-200">
          <TabsTrigger value="all" className="rounded-lg px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
            Toutes ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="pending" className="rounded-lg px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
            En attente ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="completed" className="rounded-lg px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
            Complétées ({stats.completed})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-slate-600 mt-4 font-medium">Chargement des demandes...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-16 text-center shadow-sm border border-slate-200"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Aucune demande trouvée</h3>
              <p className="text-slate-600">
                {searchTerm || activeTab !== 'all'
                  ? 'Essayez de modifier vos filtres de recherche'
                  : 'Vous n\'avez pas encore reçu de demandes d\'achat'}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence>
                {filteredRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex gap-6">
                      {/* Avatar acheteur */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <User className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      {/* Contenu */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-slate-900">
                                {request.buyer_name}
                              </h3>
                              {getStatusBadge(request.status)}
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                {getPaymentMethodIcon(request.payment_method)}
                                <span className="ml-1">{getPaymentMethodLabel(request.payment_method)}</span>
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              {request.buyer_email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-4 h-4" />
                                  {request.buyer_email}
                                </span>
                              )}
                              {request.buyer_phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-4 h-4" />
                                  {request.buyer_phone}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatTimeAgo(request.created_at)}
                              </span>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="rounded-xl">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                Voir détails
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Contacter l'acheteur
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <FileText className="w-4 h-4 mr-2" />
                                Générer contrat
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Terrain */}
                        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 mb-4 border border-slate-200">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <Building2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900">
                                {request.parcels?.title || request.parcels?.name || 'Propriété'}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                                {request.parcels?.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {request.parcels.location}
                                  </span>
                                )}
                                {request.parcels?.surface && (
                                  <span>{request.parcels.surface} m²</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-slate-600">Offre</p>
                              <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                {formatCurrency(request.offered_price)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl">
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Accepter l'offre
                            </Button>
                            <Button variant="outline" className="rounded-xl border-slate-200">
                              Négocier
                            </Button>
                            <Button variant="outline" className="rounded-xl border-red-200 text-red-600 hover:bg-red-50">
                              <XCircle className="w-4 h-4 mr-2" />
                              Refuser
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendeurPurchaseRequestsModern;
