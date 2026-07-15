import React, { useState, useEffect } from 'react';
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
import { toast } from 'sonner';
import VendeurSupabaseService from '@/services/VendeurSupabaseService';
import NegotiationModal from '@/components/modals/NegotiationModal';
import RequestDetailsModal from '@/components/modals/RequestDetailsModal';

const VendeurPurchaseRequests = ({ user: propsUser }) => {
  // FIX: Accepter user via props (passé par le sidebar) au lieu de outletContext
  const user = propsUser;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  
  // États pour les modals
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isNegotiating, setIsNegotiating] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    loadRequests();

    // 🔄 REALTIME: Rechargement automatique quand une offre change pour ce vendeur
    const channel = supabase
      .channel(`vendeur-purchase-requests-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'financial_transactions' },
        () => {
          loadRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Actions sur les demandes
  // ========================================
  // 🎯 HANDLERS WORKFLOW COMPLETS
  // ========================================
  
  const handleAccept = async (requestId) => {
    setActionLoading(requestId);
    try {
      const request = requests.find(r => r.id === requestId);

      // Accepter l'offre (met à jour financial_transactions.status = 'accepted')
      const result = await VendeurSupabaseService.acceptOffer(requestId);
      if (!result.success) throw new Error(result.error || 'Erreur lors de l\'acceptation');

      // Notifier l'acheteur (best-effort, non bloquant)
      if (request?.user_id) {
        try {
          await supabase.from('notifications').insert({
            user_id: request.user_id,
            title: '✅ Offre acceptée',
            message: `Votre offre de ${formatCurrency(request.offered_price)} pour "${request.parcels?.title || request.parcels?.name || 'la propriété'}" a été acceptée par le vendeur.`,
            type: 'purchase_accepted',
            read: false
          });
        } catch (notifError) {
          console.warn('⚠️ [ACCEPT] Notification non envoyée (non bloquant):', notifError);
        }
      }

      // Mise à jour locale immédiate
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestId ? { ...req, status: 'accepted' } : req
        )
      );

      toast.success('✅ Offre acceptée avec succès');
      await loadRequests();
    } catch (error) {
      console.error('❌ [ACCEPT] Erreur:', error);
      toast.error('Erreur lors de l\'acceptation: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId) => {
    setActionLoading(requestId);
    try {
      const request = requests.find(r => r.id === requestId);

      // Refuser l'offre (met à jour financial_transactions.status = 'rejected')
      const result = await VendeurSupabaseService.rejectOffer(requestId);
      if (!result.success) throw new Error(result.error || 'Erreur lors du refus');

      // Notifier l'acheteur (best-effort, non bloquant)
      if (request?.user_id) {
        try {
          await supabase.from('notifications').insert({
            user_id: request.user_id,
            title: '❌ Offre refusée',
            message: `Votre offre pour "${request.parcels?.title || request.parcels?.name || 'la propriété'}" a été refusée par le vendeur.`,
            type: 'purchase_rejected',
            read: false
          });
        } catch (notifError) {
          console.warn('⚠️ [REJECT] Notification non envoyée (non bloquant):', notifError);
        }
      }

      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestId ? { ...req, status: 'rejected' } : req
        )
      );

      toast.success('Offre refusée avec succès');
      await loadRequests();
    } catch (error) {
      console.error('❌ Erreur refus:', error);
      toast.error('Erreur lors du refus de l\'offre: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleNegotiate = (request) => {
    console.log('💬 [NEGOTIATE] Ouverture modal de négociation pour:', request.id);
    setSelectedRequest(request);
    setShowNegotiationModal(true);
  };
  
  const handleSubmitNegotiation = async (counterOffer) => {
    setIsNegotiating(true);
    try {
      const property = selectedRequest?.parcels || selectedRequest?.properties;

      // 1. Enregistrer la contre-offre comme une nouvelle transaction financière
      //    (pas de table dédiée aux négociations : on modélise la contre-offre
      //    du vendeur comme une financial_transactions liée à l'offre initiale)
      const { error: negotiationError } = await supabase
        .from('financial_transactions')
        .insert({
          user_id: selectedRequest.user_id,
          property_id: selectedRequest.parcel_id,
          type: 'counter_offer',
          transaction_type: 'counter_offer',
          amount: counterOffer.new_price,
          currency: 'XOF',
          status: 'pending',
          category: 'negotiation',
          description: counterOffer.message || `Contre-offre du vendeur: ${counterOffer.new_price} FCFA`,
          reference: selectedRequest.id,
          client_name: selectedRequest.buyer_name
        });

      if (negotiationError) throw negotiationError;

      // 2. Mettre l'offre initiale en négociation
      const { error: txError } = await supabase
        .from('financial_transactions')
        .update({ status: 'negotiation' })
        .eq('id', selectedRequest.id);

      if (txError) throw txError;

      // 3. Notifier l'acheteur (best-effort, non bloquant)
      try {
        await supabase.from('notifications').insert({
          user_id: selectedRequest.user_id,
          title: '💬 Contre-offre reçue',
          message: `Le vendeur propose ${formatCurrency(counterOffer.new_price)} pour "${property?.title || property?.name || 'votre propriété'}".`,
          type: 'purchase_negotiation',
          read: false
        });
      } catch (notifError) {
        console.warn('⚠️ [NEGOTIATE] Notification non envoyée (non bloquant):', notifError);
      }

      // 4. Fermer modal et recharger
      setShowNegotiationModal(false);
      setSelectedRequest(null);
      await loadRequests();

      toast.success('💬 Contre-offre envoyée avec succès ! L\'acheteur sera notifié.');

    } catch (error) {
      console.error('❌ [NEGOTIATE] Erreur:', error);
      toast.error('Erreur lors de l\'envoi de la contre-offre: ' + error.message);
    } finally {
      setIsNegotiating(false);
    }
  };

  const handleViewDetails = (request) => {
    console.log('👁️ [DETAILS] Ouverture modal détails pour:', request.id);
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleContact = (request) => {
    if (request.buyer_email) {
      window.location.href = `mailto:${request.buyer_email}`;
    } else {
      toast.error('Email de l\'acheteur non disponible');
    }
  };

  const handleGenerateContract = (request) => {
    toast.info('Génération de contrat à venir ! 📄');
    // TODO: Générer PDF du contrat de vente
  };

  const loadRequests = async () => {
    try {
      setLoading(true);

      // 1. Offres d'achat reçues (financial_transactions liées aux propriétés du vendeur)
      const offersResult = await VendeurSupabaseService.getVendeurOffers(user.id);
      if (!offersResult.success) throw new Error(offersResult.error || 'Erreur de chargement des offres');

      const offers = offersResult.data || [];
      if (offers.length === 0) {
        setRequests([]);
        setLoading(false);
        return;
      }

      // 2. Compléter les infos propriété (surface / statut, non fournis par getVendeurOffers)
      const propertyIds = [...new Set(offers.map(o => o.property_id).filter(Boolean))];
      const { data: propertiesExtra } = propertyIds.length > 0
        ? await supabase
            .from('properties')
            .select('id, title, name, price, location, surface, status')
            .in('id', propertyIds)
        : { data: [] };
      const propertyMap = Object.fromEntries((propertiesExtra || []).map(p => [p.id, p]));

      // 3. Profils des acheteurs
      const buyerIds = [...new Set(offers.map(o => o.user_id).filter(Boolean))];
      const { data: buyerProfiles } = buyerIds.length > 0
        ? await supabase
            .from('profiles')
            .select('id, first_name, last_name, full_name, email, phone')
            .in('id', buyerIds)
        : { data: [] };
      const buyerMap = Object.fromEntries((buyerProfiles || []).map(b => [b.id, b]));

      // 4. Transformer les offres en demandes affichables
      const enrichedRequests = offers.map(offer => {
        const buyer = buyerMap[offer.user_id];
        const property = propertyMap[offer.property_id] || offer.property || null;

        return {
          id: offer.id,
          user_id: offer.user_id,
          parcel_id: offer.property_id,
          status: offer.status || 'pending',
          created_at: offer.created_at,
          payment_method: offer.channel || offer.category || 'other',
          offered_price: offer.amount,
          offer_price: offer.amount,
          message: offer.description || '',
          buyer_name: buyer?.full_name || `${buyer?.first_name || ''} ${buyer?.last_name || ''}`.trim() || offer.client_name || 'Acheteur',
          buyer_email: buyer?.email || '',
          buyer_phone: buyer?.phone || '',
          parcels: property,
          properties: property,
          profiles: buyer,
          buyer: buyer,
          transactions: [offer]
        };
      });

      setRequests(enrichedRequests);
    } catch (error) {
      console.error('❌ Erreur chargement demandes:', error);
      toast.error('Erreur lors du chargement des demandes d\'achat');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les demandes par statut réel (financial_transactions.status)
  const filteredRequests = requests.filter(request => {
    let matchesTab = false;

    if (activeTab === 'all') {
      matchesTab = true;
    } else if (activeTab === 'pending') {
      matchesTab = request.status === 'pending';
    } else if (activeTab === 'accepted') {
      matchesTab = request.status === 'accepted';
    } else if (activeTab === 'negotiation') {
      matchesTab = request.status === 'negotiation';
    } else if (activeTab === 'completed') {
      matchesTab = request.status === 'completed';
    } else if (activeTab === 'rejected') {
      matchesTab = request.status === 'rejected';
    }

    const matchesSearch = searchTerm === '' ||
      request.buyer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.buyer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.parcels?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Statistiques basées sur le statut réel des offres
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    accepted: requests.filter(r => r.status === 'accepted').length,
    negotiation: requests.filter(r => r.status === 'negotiation').length,
    completed: requests.filter(r => r.status === 'completed').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
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
      accepted: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle2, label: 'Acceptée' },
      negotiation: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: TrendingUp, label: 'En négociation' },
      completed: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2, label: 'Complétée' },
      rejected: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle, label: 'Refusée' },
      cancelled: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle, label: 'Annulée' }
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
                  Demandes d'Achat Reçues
                </h1>
                <p className="text-slate-600 mt-1">Gérez les offres de vos acheteurs en temps réel</p>
              </div>
            </div>
          </div>
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
        <TabsList className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex flex-wrap">
          <TabsTrigger value="all" className="rounded-lg px-4 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
            Toutes ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="pending" className="rounded-lg px-4 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
            En attente ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="accepted" className="rounded-lg px-4 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
            Acceptées ({stats.accepted})
          </TabsTrigger>
          <TabsTrigger value="negotiation" className="rounded-lg px-4 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            En négociation ({stats.negotiation})
          </TabsTrigger>
          <TabsTrigger value="completed" className="rounded-lg px-4 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
            Complétées ({stats.completed})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="rounded-lg px-4 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
            Refusées ({stats.rejected})
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
                              <DropdownMenuItem onClick={() => handleViewDetails(request)}>
                                <Eye className="w-4 h-4 mr-2" />
                                Voir détails
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleContact(request)}>
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Contacter l'acheteur
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleGenerateContract(request)}>
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

                        {/* Actions selon le statut */}
                        {request.status === 'accepted' && (
                          <div className="flex gap-2">
                            <div className="flex-1 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-blue-600" />
                              <p className="text-sm text-blue-700 font-medium">
                                Offre acceptée — contactez l'acheteur pour finaliser la vente
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50"
                              onClick={() => handleContact(request)}
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Contacter
                            </Button>
                          </div>
                        )}

                        {request.status === 'completed' && (
                          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                            <p className="text-sm text-emerald-700 font-medium">
                              ✓ Vente finalisée
                            </p>
                          </div>
                        )}

                        {/* Standard actions for pending requests */}
                        {request.status === 'pending' && (
                          <div className="flex gap-2 flex-wrap">
                            <Button 
                              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl"
                              onClick={() => handleAccept(request.id)}
                              disabled={actionLoading === request.id}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              {actionLoading === request.id ? 'Traitement...' : 'Accepter l\'offre'}
                            </Button>
                            <Button 
                              variant="outline" 
                              className="rounded-xl border-slate-200"
                              onClick={() => handleNegotiate(request)}
                              disabled={actionLoading}
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Négocier
                            </Button>
                            <Button 
                              variant="outline" 
                              className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                              onClick={() => handleReject(request.id)}
                              disabled={actionLoading === request.id}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Refuser
                            </Button>
                          </div>
                        )}
                        
                        {/* Demande en négociation */}
                        {request.status === 'negotiation' && (
                          <div className="flex gap-2 flex-wrap">
                            <Button 
                              variant="outline"
                              className="rounded-xl border-orange-200"
                              onClick={() => handleNegotiate(request)}
                              disabled={actionLoading}
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Répondre à la négociation
                            </Button>
                            <Button 
                              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl"
                              onClick={() => handleAccept(request.id)}
                              disabled={actionLoading === request.id}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Accepter la contre-offre
                            </Button>
                          </div>
                        )}
                        
                        {/* Demande refusée/annulée */}
                        {['rejected', 'cancelled'].includes(request.status) && (
                          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-sm text-red-700 font-medium">
                              ✗ Demande refusée ou annulée
                            </p>
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
      
      {/* Modals */}
      <NegotiationModal
        request={selectedRequest}
        isOpen={showNegotiationModal}
        onClose={() => {
          setShowNegotiationModal(false);
          setSelectedRequest(null);
        }}
        onSubmit={handleSubmitNegotiation}
        isSubmitting={isNegotiating}
      />
      
      <RequestDetailsModal
        request={selectedRequest}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedRequest(null);
        }}
      />
    </div>
  );
};

export default VendeurPurchaseRequests;
