/**
 * Page Mes Achats - Version Modernisée
 * Suivi des demandes d'achat avec timeline, rendez-vous, contrats
 * @author Teranga Foncier Team
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, Clock, CheckCircle, XCircle, Eye, ArrowRight, MessageSquare,
  DollarSign, Calendar, Filter, Search, Download, Home, Building2,
  MapPin, TrendingUp, AlertCircle, Plus, Users, Phone, Mail, Package,
  ChevronRight, Star, Briefcase, FileCheck, ClipboardList
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import AppointmentScheduler from '@/components/purchase/AppointmentScheduler';
import ContractGenerator from '@/components/purchase/ContractGenerator';
import TimelineTrackerModern from '@/components/purchase/TimelineTrackerModern';
import WorkflowStatusService from '@/services/WorkflowStatusService';

const STATUS_CONFIG = {
  pending: {
    label: 'En attente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: Clock,
    description: 'En attente de réponse du vendeur',
  },
  accepted: {
    label: 'Acceptée',
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: CheckCircle,
    description: 'Votre offre a été acceptée',
  },
  rejected: {
    label: 'Rejetée',
    color: 'bg-red-100 text-red-800 border-red-300',
    icon: XCircle,
    description: 'Offre refusée par le vendeur',
  },
  negotiating: {
    label: 'Négociation',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: MessageSquare,
    description: 'Négociation en cours',
  },
  documents_pending: {
    label: 'Documents',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    icon: FileText,
    description: 'Constitution du dossier',
  },
  financing: {
    label: 'Financement',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    icon: DollarSign,
    description: 'En attente de financement',
  },
  completed: {
    label: 'Finalisée',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: CheckCircle,
    description: 'Transaction terminée',
  },
  cancelled: {
    label: 'Annulée',
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    icon: XCircle,
    description: 'Transaction annulée',
  },
};

const STATUS_ALIASES = {
  waiting_response: 'pending',
  initiated: 'pending',
  seller_reviewing: 'pending',
  seller_notification: 'pending',
  buyer_verification: 'pending',
  in_progress: 'negotiating',
  negotiation: 'negotiating',
  reviewing: 'negotiating',
  analysis: 'negotiating',
  document_collection: 'documents_pending',
  document_review: 'documents_pending',
  dossier_complement: 'documents_pending',
  contract_preparation: 'documents_pending',
  legal_verification: 'documents_pending',
  financing_review: 'financing',
  financing_pending: 'financing',
  payment_processing: 'financing',
  finalized: 'completed',
  delivered: 'completed',
  closed: 'completed',
  canceled: 'cancelled',
  decline: 'rejected',
  declined: 'rejected',
  refused: 'rejected',
  approved: 'accepted',
};

const normalizeStatus = (status) => {
  if (!status) return 'pending';
  const lowered = String(status).toLowerCase();
  if (STATUS_CONFIG[lowered]) {
    return lowered;
  }
  return STATUS_ALIASES[lowered] || 'pending';
};

const ensureArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch (error) {
      return [value];
    }
  }
  return [value];
};

const ParticulierMesAchatsModern = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    completed: 0,
  });

  const mapPropertyPayload = (payload) => {
    if (!payload) {
      return null;
    }

    const fallbackLocation = [payload.commune, payload.ville, payload.region, payload.country]
      .filter(Boolean)
      .join(', ');

    const sellerPayload = payload.seller || payload.owner;

    return {
      id: payload.id,
      title: payload.title || payload.name || payload.nom || 'Propriété',
      location: payload.location || payload.adresse || fallbackLocation || 'Localisation inconnue',
      price: payload.price || payload.prix || null,
      surface: payload.surface || payload.superficie || payload.area || null,
      status: payload.status || payload.statut || null,
      images: ensureArray(payload.images || payload.photos || payload.media).filter(Boolean),
      seller: sellerPayload
        ? {
            id: sellerPayload.id,
            first_name: sellerPayload.first_name || sellerPayload.prenom,
            last_name: sellerPayload.last_name || sellerPayload.nom,
            email: sellerPayload.email || null,
            phone: sellerPayload.phone || sellerPayload.telephone || null,
            avatar_url: sellerPayload.avatar_url || sellerPayload.photo_url || null,
          }
        : null,
    };
  };

  const normalizeModernRequest = (request) => {
    const normalizedStatus = normalizeStatus(request.status || request.workflow_stage || request.stage);

    return {
      ...request,
      source: 'modern',
      status: normalizedStatus,
      workflow_stage: normalizeStatus(request.workflow_stage || normalizedStatus),
      completed_stages: ensureArray(request.completed_stages || request.completedStages),
      unread_messages: request.unread_messages || request.unreadMessages || 0,
      offered_price:
        request.offered_price ?? request.offer_amount ?? request.proposed_price ?? request.property?.price ?? 0,
      property: mapPropertyPayload(request.property),
      buyer: request.buyer || request.profile || null,
      case_id: request.case_id || request.purchase_case_id || request.id,
      case_number: request.case_number || request.case_ref || null,
    };
  };

  const mapLegacyRequest = (legacyRequest, purchaseCaseMap) => {
    const caseInfo = purchaseCaseMap[legacyRequest.id] || {};
    const propertyPayload = legacyRequest.parcel || legacyRequest.parcels || legacyRequest.property;
    const property = mapPropertyPayload(propertyPayload);
    const statusSource = caseInfo.status || legacyRequest.display_status || legacyRequest.status;
    const normalizedStatus = normalizeStatus(statusSource);

    return {
      ...legacyRequest,
      source: 'legacy',
      status: normalizedStatus,
      workflow_stage: normalizeStatus(caseInfo.workflow_stage || legacyRequest.workflow_stage || normalizedStatus),
      completed_stages: ensureArray(caseInfo.completed_stages || legacyRequest.completed_stages),
      created_at: legacyRequest.created_at,
      updated_at: legacyRequest.updated_at,
      offered_price:
        legacyRequest.offered_price ||
        legacyRequest.offer_amount ||
        legacyRequest.amount ||
        property?.price ||
        0,
      property,
      buyer: legacyRequest.buyer || legacyRequest.requester || null,
      documents: ensureArray(legacyRequest.documents).map((doc) => ({ ...doc })),
      appointments: ensureArray(legacyRequest.appointments).map((appt) => ({ ...appt })),
      unread_messages: legacyRequest.unread_messages || legacyRequest.unreadMessages || 0,
      case_id: caseInfo.id || legacyRequest.case_id || legacyRequest.purchase_case_id || legacyRequest.id,
      case_number: caseInfo.case_number || legacyRequest.case_number || legacyRequest.case_ref || null,
    };
  };

  const buildStatsFromRequests = (dataset) => {
    const base = {
      total: dataset.length,
      pending: 0,
      accepted: 0,
      completed: 0,
    };

    dataset.forEach((item) => {
      const normalized = normalizeStatus(item.status);
      if (normalized === 'pending') base.pending += 1;
      if (normalized === 'accepted') base.accepted += 1;
      if (normalized === 'completed') base.completed += 1;
    });

    return base;
  };

  const fetchLegacyRequests = async () => {
    try {
      const { data: legacyData, error: legacyError } = await supabase
        .from('requests')
        .select(`
          *,
          parcel:parcels (
            id,
            title,
            name,
            price,
            location,
            surface,
            status,
            images,
            owner:profiles!parcels_owner_id_fkey (
              id,
              first_name,
              last_name,
              email,
              phone,
              avatar_url
            )
          ),
          buyer:profiles!requests_user_id_fkey (
            id,
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (legacyError) {
        // Ignore missing table errors but surface others in console
        if (!['PGRST204', '42P01'].includes(legacyError.code)) {
          console.error('Erreur Supabase legacy requests:', legacyError);
        }
        return [];
      }

      if (!legacyData?.length) {
        return [];
      }

      const requestIds = legacyData.map((item) => item.id);
      const purchaseCaseMap = {};

      if (requestIds.length > 0) {
        const { data: caseData, error: caseError } = await supabase
          .from('purchase_cases')
          .select('id, request_id, case_number, status, workflow_stage, completed_stages, updated_at, created_at')
          .in('request_id', requestIds);

        if (!caseError && Array.isArray(caseData)) {
          caseData.forEach((caseRow) => {
            purchaseCaseMap[caseRow.request_id] = caseRow;
          });
        }
      }

      return legacyData.map((legacyItem) => mapLegacyRequest(legacyItem, purchaseCaseMap));
    } catch (error) {
      console.error('Erreur chargement demandes legacy:', error);
      return [];
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadPurchaseRequests();
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    // Subscription à purchase_cases (NOUVELLE TABLE - PRIORITAIRE)
    const purchaseCasesChannel = supabase
      .channel(`purchase-cases-buyer-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'purchase_cases',
          filter: `buyer_id=eq.${user.id}`,
        },
        () => {
          console.log('🔔 [REALTIME] Changement purchase_cases détecté');
          loadPurchaseRequests();
        }
      )
      .subscribe();

    const purchaseRequestsChannel = supabase
      .channel(`purchase-requests-buyer-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'purchase_requests',
          filter: `buyer_id=eq.${user.id}`,
        },
        () => {
          console.log('🔔 [REALTIME] Changement purchase_requests détecté');
          loadPurchaseRequests();
        }
      )
      .subscribe();

    const legacyRequestsChannel = supabase
      .channel(`legacy-requests-buyer-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'requests',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          console.log('🔔 [REALTIME] Changement requests (legacy) détecté');
          loadPurchaseRequests();
        }
      )
      .subscribe();

    return () => {
      purchaseCasesChannel.unsubscribe();
      purchaseRequestsChannel.unsubscribe();
      legacyRequestsChannel.unsubscribe();
    };
  }, [user?.id]);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, activeTab]);

  const loadPurchaseRequests = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      let aggregatedRequests = [];

      // ✅ ÉTAPE 1: Charger depuis purchase_cases (NOUVELLE TABLE - PRIORITAIRE)
      try {
        const { data: caseData, error: caseError } = await supabase
          .from('purchase_cases')
          .select('*')
          .eq('buyer_id', user.id)
          .order('created_at', { ascending: false });

        if (!caseError && caseData?.length) {
          console.log('✅ [LOAD] Purchase cases trouvées:', caseData.length);
          
          // Transformer purchase_cases en format compatible avec liste
          aggregatedRequests = caseData.map((caseItem) => ({
            id: caseItem.id,
            case_id: caseItem.id,
            case_number: caseItem.case_number,
            status: caseItem.status,
            workflow_stage: caseItem.status,
            payment_method: caseItem.payment_method,
            financing_approved: caseItem.financing_approved,
            created_at: caseItem.created_at,
            updated_at: caseItem.updated_at,
            completed_stages: [],
            source: 'purchase_cases',
            property: {
              title: `Dossier ${caseItem.case_number}`,
              location: '',
              price: caseItem.purchase_price,
              images: []
            },
            seller: {
              id: caseItem.seller_id,
              first_name: 'Vendeur',
              last_name: 'Professionnel'
            },
            appointments: [],
            documents: [],
            unread_messages: 0
          }));
        } else if (caseError && !['PGRST204', '42P01'].includes(caseError.code)) {
          console.warn('⚠️ [LOAD] Erreur purchase_cases:', caseError.code);
        }
      } catch (err) {
        console.warn('⚠️ [LOAD] Erreur chargement purchase_cases:', err.message);
      }

      // ✅ ÉTAPE 2: Essayer charger depuis purchase_requests (FALLBACK)
      if (aggregatedRequests.length === 0) {
        try {
          const { data: modernData, error: modernError } = await supabase
            .from('purchase_requests')
            .select(`
              *,
              property:properties (
                id,
                title,
                location,
                price,
                surface,
                status,
                images,
                owner_id,
                seller:profiles!properties_seller_id_fkey (
                  id,
                  first_name,
                  last_name,
                  email,
                  phone,
                  avatar_url
                )
              ),
              buyer:profiles!purchase_requests_buyer_id_fkey (
                id,
                first_name,
                last_name,
                email,
                phone
              ),
              appointments:calendar_appointments (
                id,
                title,
                start_time,
                status
              ),
              documents:documents_administratifs (
                id,
                document_type,
                status
              )
            `)
            .eq('buyer_id', user.id)
            .order('created_at', { ascending: false });

          // ⚠️ Si erreur de relation, on ignore silencieusement
          if (modernError && ['PGRST200', 'PGRST204', '42P01'].includes(modernError.code)) {
            console.warn('⚠️ [LOAD] Purchase requests schema error (expected fallback):', modernError.code);
          } else if (modernError) {
            console.error('❌ [LOAD] Erreur achat moderne:', modernError);
          }

          if (modernData?.length) {
            aggregatedRequests = modernData.map((item) => normalizeModernRequest(item));
            console.log('✅ [LOAD] Requests modernes trouvées:', aggregatedRequests.length);
          }
        } catch (modernErr) {
          console.warn('⚠️ [LOAD] Fallback sur requests legacy...');
        }
      }

      // ✅ ÉTAPE 3: Si toujours aucun résultat, charger depuis requests (legacy)
      if (aggregatedRequests.length === 0) {
        console.log('🔄 [LOAD] Chargement depuis requests (legacy)...');
        const legacyRequests = await fetchLegacyRequests();
        if (legacyRequests.length) {
          aggregatedRequests = legacyRequests;
          console.log('✅ [LOAD] Requests legacy trouvées:', aggregatedRequests.length);
        }
      }

      console.log('📊 [LOAD] Total requests finales:', aggregatedRequests.length);
      setRequests(aggregatedRequests);
      setStats(buildStatsFromRequests(aggregatedRequests));
    } catch (error) {
      console.error('❌ Erreur chargement demandes:', error);
      toast.error('Erreur lors du chargement des demandes');
      setRequests([]);
      setStats({ total: 0, pending: 0, accepted: 0, completed: 0 });
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = requests;

    // Filtrer par onglet
    if (activeTab !== 'all') {
      filtered = requests.filter((r) => normalizeStatus(r.status) === activeTab);
    }

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(r => {
        const propertyTitle = r.property?.title?.toLowerCase() || '';
        const location = r.property?.location?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        return propertyTitle.includes(search) || location.includes(search);
      });
    }

    setFilteredRequests(filtered);
  };

  const openDetails = (request) => {
    setSelectedRequest(request);
    setShowDetails(true);
  };

  const formatPrice = (price, fallback) => {
    const amount = price ?? fallback ?? 0;
    if (!amount) {
      return '—';
    }
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const getNextAppointment = (request) => {
    if (!request.appointments || request.appointments.length === 0) return null;
    
    const upcoming = request.appointments
      .filter(a => new Date(a.start_time) > new Date() && a.status !== 'cancelled')
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
    
    return upcoming[0] || null;
  };

  const getDocumentsProgress = (request) => {
    if (!request.documents || request.documents.length === 0) return { completed: 0, total: 0 };
    
    const completed = request.documents.filter(d => d.status === 'approved').length;
    const total = request.documents.length;
    
    return { completed, total };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Achats</h1>
            <p className="text-gray-600 mt-1">Suivez toutes vos demandes d'achat de propriétés</p>
          </div>

          <Button onClick={() => navigate('/acheteur/parcelles')} className="gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle demande
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En attente</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Acceptées</p>
                  <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Finalisées</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="max-w-7xl mx-auto mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher par titre ou localisation..."
                  className="pl-10"
                />
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">Toutes</TabsTrigger>
                  <TabsTrigger value="pending">En attente</TabsTrigger>
                  <TabsTrigger value="accepted">Acceptées</TabsTrigger>
                  <TabsTrigger value="completed">Finalisées</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des demandes */}
      <div className="max-w-7xl mx-auto">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">Aucune demande d'achat</p>
                <p className="text-sm mt-2">Commencez par faire une offre sur une propriété</p>
                <Button onClick={() => navigate('/acheteur/parcelles')} className="mt-4">
                  Explorer les propriétés
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredRequests.map((request) => {
              const statusKey = normalizeStatus(request.status);
              const statusConfig = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
              const StatusIcon = statusConfig.icon;
              const nextAppointment = getNextAppointment(request);
              const docsProgress = getDocumentsProgress(request);

              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex">
                      {/* Image */}
                      <div className="w-64 h-64 flex-shrink-0 relative">
                        {request.property?.images?.[0] ? (
                          <img
                            src={request.property.images[0]}
                            alt={request.property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <Home className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                        <Badge className={cn('absolute top-3 left-3', statusConfig.color)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {request.property?.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {request.property?.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {request.property?.surface} m²
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              {formatPrice(request.offered_price, request.property?.price)}
                            </div>
                            <div className="text-sm text-gray-500">
                              Prix offert
                            </div>
                          </div>
                        </div>

                        {/* Infos vendeur */}
                        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={request.property?.seller?.avatar_url} alt={request.property?.seller?.full_name} />
                            <AvatarFallback>
                              {request.property?.seller?.full_name?.split(' ')?.map(n => n[0]).join('').toUpperCase() || 'V'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {request.property?.seller?.full_name || 'Vendeur'}
                            </p>
                            <p className="text-xs text-gray-500">Vendeur</p>
                          </div>
                        </div>

                        {request.source === 'legacy' && (
                          <Badge className="mb-4 bg-amber-50 text-amber-700 border border-amber-200">
                            Dossier historique — actions limitées
                          </Badge>
                        )}

                        {/* Progression */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          {/* Prochain RDV */}
                          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-600">Prochain RDV</p>
                              <p className="text-sm font-medium truncate">
                                {nextAppointment ? format(new Date(nextAppointment.start_time), 'dd MMM', { locale: fr }) : 'Aucun'}
                              </p>
                            </div>
                          </div>

                          {/* Documents */}
                          <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                            <FileCheck className="w-5 h-5 text-purple-600" />
                            <div className="flex-1">
                              <p className="text-xs text-gray-600">Documents</p>
                              <p className="text-sm font-medium">
                                {docsProgress.completed}/{docsProgress.total}
                              </p>
                            </div>
                          </div>

                          {/* Messages */}
                          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-green-600" />
                            <div className="flex-1">
                              <p className="text-xs text-gray-600">Messages</p>
                              <p className="text-sm font-medium">
                                {request.unread_messages || 0} nouveaux
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Timeline compacte */}
                        <div className="mb-4">
                          <TimelineTrackerModern
                            currentStatus={normalizeStatus(request.workflow_stage || request.status)}
                            paymentMethod={request.payment_method || 'one_time'}
                            financingApproved={request.financing_approved || false}
                            completedStages={WorkflowStatusService.getCompletedStages(normalizeStatus(request.workflow_stage || request.status))}
                            compact={true}
                          />
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            onClick={() => navigate(`/acheteur/dossier/${request.case_id || request.id}`)}
                            className="flex-1 min-w-[150px]"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Voir le dossier
                          </Button>

                          {request.source === 'modern' ? (
                            <AppointmentScheduler
                              caseId={request.id}
                              userId={user.id}
                              onAppointmentCreated={() => loadPurchaseRequests()}
                            />
                          ) : (
                            <Button
                              variant="outline"
                              disabled
                              className="min-w-[150px] opacity-60 cursor-not-allowed"
                              title="Disponible pour les dossiers récents"
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              RDV indisponible
                            </Button>
                          )}

                          {request.source === 'modern' ? (
                            <ContractGenerator
                              purchaseCase={request}
                              buyer={user}
                              seller={request.seller}
                              onContractGenerated={() => loadPurchaseRequests()}
                            />
                          ) : (
                            <Button
                              variant="outline"
                              disabled
                              className="min-w-[150px] opacity-60 cursor-not-allowed"
                              title="Disponible pour les dossiers récents"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Contrat indisponible
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            onClick={() => navigate(`/acheteur/messages?conversation=${request.case_id || request.id}`)}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticulierMesAchatsModern;
