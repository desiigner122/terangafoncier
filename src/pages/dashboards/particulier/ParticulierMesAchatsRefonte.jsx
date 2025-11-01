/**
 * Page Mes Achats - Version Refonte Moderne 2025
 * Liste des demandes d'achat avec design moderne et synchronisation temps réel
 * @author Teranga Foncier Team
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Clock, CheckCircle, XCircle, Eye, ArrowRight, MessageSquare,
  DollarSign, Calendar, Filter, Search, Download, Home, Building2,
  MapPin, TrendingUp, AlertCircle, Plus, Users, Phone, Mail, Package,
  ChevronRight, Star, Briefcase, FileCheck, ClipboardList, Sparkles,
  Activity, BarChart3, Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import WorkflowStatusService from '@/services/WorkflowStatusService';
import RealtimeNotificationService from '@/services/RealtimeNotificationService';
import PurchaseWorkflowService from '@/services/PurchaseWorkflowService';
import NotificationService from '@/services/NotificationService';
import BuyerCounterOfferResponseModal from '@/components/modals/BuyerCounterOfferResponseModal';

const ParticulierMesAchatsRefonte = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [purchaseCases, setPurchaseCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    pending: 0,
    negotiation: 0,
    rejected: 0
  });

  // États pour le modal de réponse aux contre-offres
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedNegotiation, setSelectedNegotiation] = useState(null);
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);

  useEffect(() => {
    if (user) {
      loadPurchaseCases();
      setupRealtimeSubscriptions();
    }

    return () => {
      RealtimeNotificationService.unsubscribeAll();
    };
  }, [user]);

  useEffect(() => {
    filterCases();
  }, [searchTerm, activeFilter, purchaseCases]);

  // ========================================
  // HANDLERS POUR LES CONTRE-OFFRES
  // ========================================

  const handleAcceptCounterOffer = async (negotiationId) => {
    setIsSubmittingResponse(true);
    try {
      console.log('✅ [BUYER] Acceptation contre-offre:', negotiationId);
      
      // 1. Mettre à jour le statut de la négociation
      const { error: updateError } = await supabase
        .from('negotiations')
        .update({ 
          status: 'accepted',
          responded_at: new Date().toISOString()
        })
        .eq('id', negotiationId);

      if (updateError) throw updateError;

      // 2. Récupérer la négociation avec les détails
      const { data: negotiation } = await supabase
        .from('negotiations')
        .select('*')
        .eq('id', negotiationId)
        .single();

      if (!negotiation) throw new Error('Négociation introuvable');

      // 3. Créer le dossier d'achat (purchase_case) avec le prix négocié
      const result = await PurchaseWorkflowService.createPurchaseCase({
        request_id: negotiation.request_id,
        buyer_id: user.id,
        seller_id: negotiation.initiated_by, // Le vendeur qui a fait la contre-offre
        parcelle_id: selectedRequest.parcel_id,
        purchase_price: negotiation.proposed_price, // Prix négocié accepté
        payment_method: selectedRequest.type || 'one_time',
        initiation_method: 'negotiation_accepted'
      });

      if (!result.success) throw new Error(result.error);

      // 4. Mettre à jour le statut de la demande
      await supabase
        .from('requests')
        .update({ status: 'accepted' })
        .eq('id', negotiation.request_id);

      // 5. Notifier le vendeur
      await NotificationService.sendNotification({
        user_id: negotiation.initiated_by,
        type: 'negotiation_accepted',
        title: 'Contre-offre acceptée ! 🎉',
        message: `L'acheteur a accepté votre contre-offre de ${negotiation.proposed_price.toLocaleString()} FCFA`,
        link: `/vendeur/cases/${result.case.case_number}`,
        metadata: {
          request_id: negotiation.request_id,
          negotiation_id: negotiationId,
          case_number: result.case.case_number
        }
      });

      toast.success(`Contre-offre acceptée ! Dossier créé : ${result.case.case_number}`);
      setShowCounterOfferModal(false);
      setSelectedRequest(null);
      setSelectedNegotiation(null);
      await loadPurchaseCases();
      
    } catch (error) {
      console.error('❌ Erreur acceptation contre-offre:', error);
      toast.error('Erreur lors de l\'acceptation: ' + error.message);
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  const handleRejectCounterOffer = async (negotiationId, reason) => {
    setIsSubmittingResponse(true);
    try {
      console.log('❌ [BUYER] Refus contre-offre:', negotiationId, reason);
      
      // 1. Mettre à jour le statut de la négociation
      const { error: updateError } = await supabase
        .from('negotiations')
        .update({ 
          status: 'rejected',
          responded_at: new Date().toISOString(),
          metadata: { reject_reason: reason }
        })
        .eq('id', negotiationId);

      if (updateError) throw updateError;

      // 2. Récupérer la négociation pour notifier le vendeur
      const { data: negotiation } = await supabase
        .from('negotiations')
        .select('*')
        .eq('id', negotiationId)
        .single();

      if (negotiation) {
        await NotificationService.sendNotification({
          user_id: negotiation.initiated_by,
          type: 'negotiation_rejected',
          title: 'Contre-offre refusée',
          message: `L'acheteur a refusé votre contre-offre. Raison: ${reason}`,
          link: `/vendeur/demandes`,
          metadata: {
            request_id: negotiation.request_id,
            negotiation_id: negotiationId,
            reason
          }
        });
      }

      toast.success('Contre-offre refusée - Le vendeur a été notifié');
      setShowCounterOfferModal(false);
      setSelectedRequest(null);
      setSelectedNegotiation(null);
      await loadPurchaseCases();
      
    } catch (error) {
      console.error('❌ Erreur refus contre-offre:', error);
      toast.error('Erreur lors du refus: ' + error.message);
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  const handleCounterToCounterOffer = async (negotiationId, counterOffer) => {
    setIsSubmittingResponse(true);
    try {
      console.log('💬 [BUYER] Nouvelle contre-offre:', negotiationId, counterOffer);
      
      // 1. Créer une nouvelle négociation en réponse
      const { data: newNegotiation, error: createError } = await supabase
        .from('negotiations')
        .insert({
          request_id: selectedRequest.id,
          conversation_id: selectedNegotiation.conversation_id,
          initiated_by: user.id, // Cette fois c'est l'acheteur qui propose
          original_price: selectedNegotiation.proposed_price, // Le prix du vendeur devient la référence
          proposed_price: counterOffer.new_price,
          offer_message: counterOffer.message || 'Nouvelle contre-offre de l\'acheteur',
          status: 'pending',
          parent_negotiation_id: negotiationId // Lien avec la négociation précédente
        })
        .select()
        .single();

      if (createError) throw createError;

      // 2. Mettre à jour l'ancienne négociation comme "counter_offer"
      await supabase
        .from('negotiations')
        .update({ 
          status: 'counter_offer',
          responded_at: new Date().toISOString()
        })
        .eq('id', negotiationId);

      // 3. Mettre à jour le statut de la demande
      await supabase
        .from('requests')
        .update({ status: 'negotiation' })
        .eq('id', selectedRequest.id);

      // 4. Notifier le vendeur
      await NotificationService.sendNotification({
        user_id: selectedNegotiation.initiated_by,
        type: 'counter_offer_received',
        title: 'Nouvelle contre-offre reçue 💬',
        message: `L'acheteur propose ${counterOffer.new_price.toLocaleString()} FCFA`,
        link: `/vendeur/demandes`,
        metadata: {
          request_id: selectedRequest.id,
          negotiation_id: newNegotiation.id,
          price: counterOffer.new_price
        }
      });

      toast.success('Votre contre-offre a été envoyée au vendeur !');
      setShowCounterOfferModal(false);
      setSelectedRequest(null);
      setSelectedNegotiation(null);
      await loadPurchaseCases();
      
    } catch (error) {
      console.error('❌ Erreur envoi contre-offre:', error);
      toast.error('Erreur lors de l\'envoi: ' + error.message);
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  // ========================================
  // CHARGEMENT DES DONNÉES
  // ========================================

  const loadPurchaseCases = async () => {
    try {
      setLoading(true);
      console.log('🚀 [DEBUG] Exécution de loadPurchaseCases - Version 4 avec requests');
      console.log('👤 User ID:', user.id);

      // ✅ 1. Charger depuis purchase_cases (dossiers acceptés)
      const { data: casesData, error: casesError } = await supabase
        .from('purchase_cases')
        .select('*')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });
      
      console.log('📊 Données purchase_cases:', { count: casesData?.length, error: casesError });

      // ✅ 2. Charger depuis requests (demandes en attente)
      const { data: requestsData, error: requestsError } = await supabase
        .from('requests')
        .select('*')
        .eq('user_id', user.id)
        .in('type', ['one_time', 'installment', 'bank'])
        .order('created_at', { ascending: false });
      
      console.log('📊 Données requests:', { count: requestsData?.length, error: requestsError });

      if (casesError && requestsError) {
        console.error('❌ Erreur chargement:', { casesError, requestsError });
        toast.error('Erreur lors du chargement des demandes');
        setLoading(false);
        return;
      }

      // ✅ 3. Enrichir purchase_cases avec relations
      let enrichedCases = [];
      if (casesData && casesData.length > 0) {
        enrichedCases = await Promise.all(
          casesData.map(async (caseItem) => {
            // Charger la request
            let request = null;
            if (caseItem.request_id) {
              const { data: reqData } = await supabase
                .from('requests')
                .select('*')
                .eq('id', caseItem.request_id)
                .single();
              request = reqData;
            }

            // Charger la propriété (parcels)
            let property = null;
            if (caseItem.parcelle_id) {
              const { data: propData } = await supabase
                .from('parcels')
                .select('*')
                .eq('id', caseItem.parcelle_id)
                .single();
              property = propData;
            }

            // Charger le vendeur (profiles)
            let seller = null;
            if (caseItem.seller_id) {
              const { data: sellerData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', caseItem.seller_id)
                .single();
              seller = sellerData;
            }

            // Charger l'acheteur (profiles)
            let buyer = null;
            if (caseItem.buyer_id) {
              const { data: buyerData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', caseItem.buyer_id)
                .single();
              buyer = buyerData;
            }

            return {
              ...caseItem,
              request,
              property,
              seller,
              buyer,
              source: 'purchase_case'
            };
          })
        );
      }

      // ✅ 4. Enrichir requests avec données parcelles/vendeur + negotiations
      let enrichedRequests = [];
      if (requestsData && requestsData.length > 0) {
        enrichedRequests = await Promise.all(
          requestsData.map(async (req) => {
            // Charger la propriété
            let property = null;
            if (req.parcel_id) {
              const { data: propData } = await supabase
                .from('parcels')
                .select('*')
                .eq('id', req.parcel_id)
                .single();
              property = propData;
            }

            // Charger le vendeur depuis la parcelle
            let seller = null;
            if (property?.owner_id) {
              const { data: sellerData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', property.owner_id)
                .single();
              seller = sellerData;
            }

            // ✅ Charger les négociations pour cette demande
            const { data: negotiations } = await supabase
              .from('negotiations')
              .select('*')
              .eq('request_id', req.id)
              .order('created_at', { ascending: false });

            // Dernière contre-offre du vendeur
            const latestNegotiation = negotiations?.[0];
            const hasCounterOffer = latestNegotiation && latestNegotiation.status === 'pending';

            // Créer structure similaire à purchase_case
            return {
              id: req.id,
              case_number: `REQ-${req.id.slice(0, 8).toUpperCase()}`,
              buyer_id: req.user_id,
              seller_id: property?.owner_id || null,
              parcelle_id: req.parcel_id,
              status: req.status || 'pending',
              type: req.type,
              offered_price: req.offered_price,
              created_at: req.created_at,
              updated_at: req.updated_at,
              request: req,
              property,
              seller,
              buyer: null, // Current user is buyer, already have their data
              source: 'request',
              negotiations: negotiations || [],
              latestNegotiation,
              hasCounterOffer
            };
          })
        );
      }

      // ✅ 5. Combiner les deux sources
      const allCases = [...enrichedCases, ...enrichedRequests]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      console.log('📋 Toutes les demandes chargées:', { 
        cases: enrichedCases?.length, 
        requests: enrichedRequests?.length,
        total: allCases.length 
      });
      
      setPurchaseCases(allCases);
      calculateStats(allCases);
      setLoading(false);
    } catch (error) {
      console.error('❌ Erreur globale:', error);
      toast.error('Erreur inattendue: ' + error?.message);
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    try {
      // Subscribe to purchase_cases changes
      const subscription = supabase
        .channel('purchase_cases_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'purchase_cases',
            filter: `buyer_id=eq.${user.id}`
          },
          (payload) => {
            console.log('📡 [REALTIME] Changement dossier:', payload);
            toast.info('Liste mise à jour');
            loadPurchaseCases();
          }
        )
        .subscribe();

      console.log('✅ Realtime subscriptions activées');
    } catch (error) {
      console.error('Erreur setup realtime:', error);
    }
  };

  const calculateStats = (cases) => {
    const total = cases.length;
    const active = cases.filter(c => 
      !['completed', 'cancelled', 'archived', 'rejected'].includes(c.status)
    ).length;
    const completed = cases.filter(c => c.status === 'completed').length;
    const pending = cases.filter(c => 
      ['initiated', 'pending', 'waiting_response'].includes(c.status)
    ).length;
    const negotiation = cases.filter(c => c.status === 'negotiation').length;
    const rejected = cases.filter(c => c.status === 'rejected').length;

    setStats({ total, active, completed, pending, negotiation, rejected });
  };

  const filterCases = () => {
    let filtered = [...purchaseCases];

    // Filter by status
    if (activeFilter !== 'all') {
      filtered = filtered.filter(c => {
        if (activeFilter === 'active') {
          return !['completed', 'cancelled', 'archived', 'rejected'].includes(c.status);
        }
        if (activeFilter === 'completed') {
          return c.status === 'completed';
        }
        if (activeFilter === 'pending') {
          return ['initiated', 'pending', 'waiting_response'].includes(c.status);
        }
        if (activeFilter === 'negotiation') {
          return c.status === 'negotiation';
        }
        if (activeFilter === 'rejected') {
          return c.status === 'rejected';
        }
        return true;
      });
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.case_number?.toLowerCase().includes(term) ||
        c.property?.title?.toLowerCase().includes(term) ||
        c.property?.name?.toLowerCase().includes(term) ||
        c.property?.location?.toLowerCase().includes(term) ||
        c.seller?.full_name?.toLowerCase().includes(term)
      );
    }

    setFilteredCases(filtered);
  };

  const getStatusInfo = (status) => {
    const label = WorkflowStatusService.getLabel(status) || status || 'Inconnu';
    const colorClass = WorkflowStatusService.getColor(status) || 'bg-gray-100 text-gray-800';
    
    // Map color class to simple color name for backward compatibility
    let color = 'gray';
    if (colorClass.includes('blue')) color = 'blue';
    else if (colorClass.includes('green')) color = 'green';
    else if (colorClass.includes('red')) color = 'red';
    else if (colorClass.includes('purple')) color = 'purple';
    else if (colorClass.includes('yellow')) color = 'yellow';
    
    return {
      label,
      color,
      icon: AlertCircle
    };
  };

  const getProgressPercentage = (status) => {
    return WorkflowStatusService.calculateProgressFromStatus(status) || 0;
  };

  const formatPrice = (price) => {
    if (!price) return 'Prix non défini';
    const numPrice = typeof price === 'string' ? parseInt(price) : price;
    if (isNaN(numPrice)) return 'Prix non défini';
    return `${numPrice.toLocaleString('fr-FR')} FCFA`;
  };

  const navigateToCaseDetail = (caseItem) => {
    // Utiliser case_number si disponible, sinon l'id
    const identifier = caseItem.case_number || caseItem.id;
    navigate(`/acheteur/dossier/${identifier}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement de vos achats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header moderne avec gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Briefcase className="w-8 h-8" />
                Mes Achats
              </h1>
              <p className="text-blue-100 mt-2">
                Suivez toutes vos demandes d'achat de propriétés en temps réel
              </p>
            </div>
            <Button
              onClick={() => navigate('/acheteur/recherche')}
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouvelle demande
            </Button>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-none bg-white/10 backdrop-blur-sm text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total</p>
                    <p className="text-3xl font-bold mt-1">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-white/10 backdrop-blur-sm text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">En cours</p>
                    <p className="text-3xl font-bold mt-1">{stats.active}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Activity className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-white/10 backdrop-blur-sm text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Complétés</p>
                    <p className="text-3xl font-bold mt-1">{stats.completed}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-white/10 backdrop-blur-sm text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">En attente</p>
                    <p className="text-3xl font-bold mt-1">{stats.pending}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de recherche */}
        <Card className="border-none shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Rechercher par numéro, propriété, localisation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs pour filtrer */}
        <Tabs value={activeFilter} onValueChange={setActiveFilter} className="space-y-6">
          <TabsList className="bg-white/50 backdrop-blur-sm p-1 rounded-xl shadow-md flex-wrap justify-start gap-2">
            <TabsTrigger value="all" className="rounded-lg px-4 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              Tous ({stats.total})
            </TabsTrigger>
            <TabsTrigger value="pending" className="rounded-lg px-4 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
              En attente ({stats.pending})
            </TabsTrigger>
            <TabsTrigger value="negotiation" className="rounded-lg px-4 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              Négociations ({stats.negotiation})
            </TabsTrigger>
            <TabsTrigger value="active" className="rounded-lg px-4 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
              Actifs ({stats.active})
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-lg px-4 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
              Complétés ({stats.completed})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="rounded-lg px-4 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-rose-500 data-[state=active]:text-white">
              Refusées ({stats.rejected})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeFilter} className="mt-6">
            {/* Liste des dossiers */}
            {filteredCases.length === 0 ? (
              <Card className="border-none shadow-lg">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <ClipboardList className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchTerm || activeFilter !== 'all' 
                      ? 'Aucun dossier trouvé'
                      : 'Aucun achat en cours'
                    }
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm || activeFilter !== 'all'
                      ? 'Essayez de modifier vos filtres de recherche'
                      : 'Commencez par rechercher une propriété qui vous intéresse'
                    }
                  </p>
                  {!searchTerm && activeFilter === 'all' && (
                    <Button onClick={() => navigate('/acheteur/recherche')}>
                      <Search className="w-4 h-4 mr-2" />
                      Rechercher une propriété
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {filteredCases.map((caseItem, index) => {
                const statusInfo = getStatusInfo(caseItem.status);
                const StatusIcon = statusInfo.icon;
                const progress = getProgressPercentage(caseItem.status);
                const property = caseItem.property;
                const seller = caseItem.seller;

                return (
                  <motion.div
                    key={caseItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className="border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                      onClick={() => navigateToCaseDetail(caseItem)}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Image de la propriété */}
                          <div className="md:w-48 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {property?.image_url || property?.photo_url ? (
                              <img
                                src={property.image_url || property.photo_url}
                                alt={property.title || property.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Building2 className="w-12 h-12 text-gray-300" />
                              </div>
                            )}
                          </div>

                          {/* Détails du dossier */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {property?.title || property?.name || 'Propriété'}
                                  </h3>
                                  <Badge 
                                    variant="secondary"
                                    className={cn(
                                      "font-medium",
                                      statusInfo.color === 'green' && "bg-green-100 text-green-800",
                                      statusInfo.color === 'blue' && "bg-blue-100 text-blue-800",
                                      statusInfo.color === 'yellow' && "bg-yellow-100 text-yellow-800",
                                      statusInfo.color === 'red' && "bg-red-100 text-red-800",
                                      statusInfo.color === 'purple' && "bg-purple-100 text-purple-800"
                                    )}
                                  >
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {statusInfo.label}
                                  </Badge>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                  <div className="flex items-center gap-1">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    <span className="font-medium">{caseItem.case_number}</span>
                                  </div>
                                  {property?.location && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-4 h-4 text-green-600" />
                                      <span>{property.location}</span>
                                    </div>
                                  )}
                                  {(property?.area || property?.size || property?.surface) && (
                                    <div className="flex items-center gap-1">
                                      <Package className="w-4 h-4 text-orange-600" />
                                      <span>{property.area || property.size || property.surface} m²</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span>
                                      {format(new Date(caseItem.created_at), 'dd MMM yyyy', { locale: fr })}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 mb-3">
                                  <div className="text-2xl font-bold text-blue-600">
                                    {formatPrice(caseItem.purchase_price || property?.price)}
                                  </div>
                                  {seller && (
                                    <div className="flex items-center gap-2">
                                      <Avatar className="w-6 h-6">
                                        <AvatarImage src={seller.avatar_url} />
                                        <AvatarFallback className="text-xs">
                                          {seller.full_name?.charAt(0) || 'V'}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm text-gray-600">
                                        {seller.full_name || `${seller.first_name} ${seller.last_name}`}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Contre-offre du vendeur */}
                                {caseItem.hasCounterOffer && caseItem.latestNegotiation && (
                                  <div className="mb-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                      <MessageSquare className="w-4 h-4 text-purple-600" />
                                      <span className="text-sm font-semibold text-purple-900">Contre-offre du vendeur</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-lg font-bold text-purple-700">
                                          {formatPrice(caseItem.latestNegotiation.proposed_price)}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                          Votre offre : {formatPrice(caseItem.latestNegotiation.original_price)}
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          className="bg-emerald-600 hover:bg-emerald-700"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedRequest(caseItem);
                                            setSelectedNegotiation(caseItem.latestNegotiation);
                                            setShowCounterOfferModal(true);
                                          }}
                                        >
                                          <CheckCircle className="w-4 h-4 mr-1" />
                                          Accepter
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="border-red-300 text-red-600 hover:bg-red-50"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedRequest(caseItem);
                                            setSelectedNegotiation(caseItem.latestNegotiation);
                                            setShowCounterOfferModal(true);
                                          }}
                                        >
                                          <XCircle className="w-4 h-4 mr-1" />
                                          Refuser
                                        </Button>
                                      </div>
                                    </div>
                                    {caseItem.latestNegotiation.offer_message && (
                                      <p className="text-sm text-gray-700 mt-2 italic">
                                        "{caseItem.latestNegotiation.offer_message}"
                                      </p>
                                    )}
                                  </div>
                                )}

                                {/* Progress bar */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">Progression</span>
                                    <span className="font-medium text-gray-700">{Math.round(progress)}%</span>
                                  </div>
                                  <Progress value={progress} className="h-2" />
                                </div>
                              </div>

                              {/* Actions */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="flex-shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigateToCaseDetail(caseItem);
                                }}
                              >
                                <ChevronRight className="w-5 h-5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de réponse aux contre-offres */}
      <BuyerCounterOfferResponseModal
        request={selectedRequest}
        negotiation={selectedNegotiation}
        isOpen={showCounterOfferModal}
        onClose={() => {
          setShowCounterOfferModal(false);
          setSelectedRequest(null);
          setSelectedNegotiation(null);
        }}
        onAccept={handleAcceptCounterOffer}
        onReject={handleRejectCounterOffer}
        onCounter={handleCounterToCounterOffer}
        isSubmitting={isSubmittingResponse}
      />
    </div>
  );
};

export default ParticulierMesAchatsRefonte;
