/**
 * REFONTE - PARTICULIER MES ACHATS
 * Page de suivi centralisée de tous les achats/dossiers de l'acheteur
 * - Liste complète avec filtres et recherche
 * - Statuts en temps réel
 * - Actions rapides
 * - KPIs et statistiques
 * @author Teranga Foncier
 * @date October 21, 2025
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertCircle,
  Home,
  FileText,
  MessageSquare,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Eye,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Users,
  MapPin,
  ArrowRight,
  Download,
  Share2,
} from 'lucide-react';
import RealtimeSyncService from '@/services/RealtimeSyncService';

const ParticulierMesAchatsRefactored = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // STATE
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('updated');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    pending: 0,
    documents: 0,
    messages: 0,
  });

  // STATUS CONFIGURATION
  const statusConfig = {
    initiated: { label: 'Initiée', color: 'bg-blue-100 text-blue-800', icon: '📋' },
    buyer_verification: { label: 'En vérification', color: 'bg-purple-100 text-purple-800', icon: '🔍' },
    seller_notification: { label: 'Notification vendeur', color: 'bg-orange-100 text-orange-800', icon: '📢' },
    preliminary_agreement: { label: 'Accord préliminaire', color: 'bg-yellow-100 text-yellow-800', icon: '🤝' },
    contract_preparation: { label: 'Préparation contrat', color: 'bg-cyan-100 text-cyan-800', icon: '📄' },
    legal_verification: { label: 'Vérification légale', color: 'bg-indigo-100 text-indigo-800', icon: '⚖️' },
    document_audit: { label: 'Audit documents', color: 'bg-pink-100 text-pink-800', icon: '📑' },
    property_evaluation: { label: 'Évaluation propriété', color: 'bg-green-100 text-green-800', icon: '🏠' },
    notary_appointment: { label: 'Rendez-vous notaire', color: 'bg-teal-100 text-teal-800', icon: '⚖️' },
    signing_process: { label: 'Processus de signature', color: 'bg-violet-100 text-violet-800', icon: '✍️' },
    payment_processing: { label: 'Traitement du paiement', color: 'bg-amber-100 text-amber-800', icon: '💳' },
    completed: { label: 'Complétée', color: 'bg-green-100 text-green-800', icon: '✅' },
    cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800', icon: '❌' },
  };

  // LOAD DATA
  useEffect(() => {
    if (user) {
      loadCases();
      const unsubscribe = RealtimeSyncService.subscribeToBuyerRequests(user.id, () => {
        console.log('🔄 Real-time update detected, reloading cases...');
        loadCases();
      });
      return unsubscribe;
    }
  }, [user]);

  const loadCases = async () => {
    try {
      setLoading(true);
      console.log('📋 [BUYER DASHBOARD] Loading cases for user:', user.id);

      // Load purchase cases for this buyer
      const { data: purchaseCases, error: casesError } = await supabase
        .from('purchase_cases')
        .select(`
          id,
          case_number,
          status,
          created_at,
          updated_at,
          seller_id,
          buyer_id,
          parcelle_id,
          purchase_price,
          notary_id,
          geometre_id,
          agent_foncier_id
        `)
        .eq('buyer_id', user.id)
        .order('updated_at', { ascending: false });

      if (casesError) throw casesError;

      // Load related data
      const propertyIds = purchaseCases?.map(c => c.parcelle_id).filter(Boolean) || [];
      const sellerIds = purchaseCases?.map(c => c.seller_id).filter(Boolean) || [];
      const notaryIds = purchaseCases?.map(c => c.notary_id).filter(Boolean) || [];
      const geometreIds = purchaseCases?.map(c => c.geometre_id).filter(Boolean) || [];
      const agentIds = purchaseCases?.map(c => c.agent_foncier_id).filter(Boolean) || [];

      let properties = {}, sellers = {}, notaries = {}, geometres = {}, agents = {};

      // Fetch all related data in parallel
      if (propertyIds.length > 0) {
        const { data } = await supabase
          .from('parcels')
          .select('id, title, location, price, surface')
          .in('id', propertyIds);
        data?.forEach(p => properties[p.id] = p);
      }

      if (sellerIds.length > 0) {
        const { data } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, phone, avatar_url')
          .in('id', sellerIds);
        data?.forEach(p => sellers[p.id] = p);
      }

      if (notaryIds.length > 0) {
        const { data } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, phone, avatar_url')
          .in('id', notaryIds);
        data?.forEach(p => notaries[p.id] = p);
      }

      if (geometreIds.length > 0) {
        const { data } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, phone, avatar_url')
          .in('id', geometreIds);
        data?.forEach(p => geometres[p.id] = p);
      }

      if (agentIds.length > 0) {
        const { data } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, phone, avatar_url')
          .in('id', agentIds);
        data?.forEach(p => agents[p.id] = p);
      }

      // Enrich cases with related data
      const enrichedCases = purchaseCases.map(c => ({
        ...c,
        property: properties[c.parcelle_id],
        seller: sellers[c.seller_id],
        notary: notaries[c.notary_id],
        geometre: geometres[c.geometre_id],
        agent: agents[c.agent_foncier_id],
      }));

      setCases(enrichedCases);

      // Calculate stats
      const newStats = {
        total: purchaseCases.length,
        active: purchaseCases.filter(c => !['completed', 'cancelled'].includes(c.status)).length,
        completed: purchaseCases.filter(c => c.status === 'completed').length,
        pending: purchaseCases.filter(c => c.status === 'initiated').length,
        documents: 0, // Will be counted from documents table
        messages: 0, // Will be counted from messages table
      };

      // Count documents per case
      const caseIds = purchaseCases.map(c => c.id);
      if (caseIds.length > 0) {
        const { data: docs } = await supabase
          .from('purchase_case_documents')
          .select('case_id', { count: 'exact' })
          .in('case_id', caseIds);
        newStats.documents = docs?.length || 0;

        // Count messages per case
        const { data: msgs } = await supabase
          .from('purchase_case_messages')
          .select('case_id', { count: 'exact' })
          .in('case_id', caseIds);
        newStats.messages = msgs?.length || 0;
      }

      setStats(newStats);
      console.log('✅ Cases loaded:', newStats);
    } catch (error) {
      console.error('❌ Error loading cases:', error);
      toast.error('Erreur lors du chargement des dossiers');
    } finally {
      setLoading(false);
    }
  };

  // FILTERS & SEARCH
  const filtered = cases.filter(c => {
    const matchesSearch = 
      !searchTerm ||
      c.case_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.property?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.seller?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // SORT
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'updated') return new Date(b.updated_at) - new Date(a.updated_at);
    if (sortBy === 'created') return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === 'price') return (b.purchase_price || 0) - (a.purchase_price || 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* HEADER */}
      <motion.div
        className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Mes Achats</h1>
              <p className="text-slate-600">Suivi de vos dossiers d'acquisition immobilière</p>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Total</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-600 font-medium">En cours</p>
              <p className="text-2xl font-bold text-purple-900">{stats.active}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Complétées</p>
              <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-yellow-600 font-medium">En attente</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
            </div>
            <div className="bg-cyan-50 rounded-lg p-4">
              <p className="text-sm text-cyan-600 font-medium">Documents</p>
              <p className="text-2xl font-bold text-cyan-900">{stats.documents}</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-4">
              <p className="text-sm text-pink-600 font-medium">Messages</p>
              <p className="text-2xl font-bold text-pink-900">{stats.messages}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CONTROLS */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Rechercher par numéro, localisation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="initiated">Initiée</SelectItem>
                <SelectItem value="buyer_verification">En vérification</SelectItem>
                <SelectItem value="preliminary_agreement">Accord préliminaire</SelectItem>
                <SelectItem value="contract_preparation">Préparation contrat</SelectItem>
                <SelectItem value="completed">Complétée</SelectItem>
                <SelectItem value="cancelled">Annulée</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Récemment modifié</SelectItem>
                <SelectItem value="created">Plus ancien</SelectItem>
                <SelectItem value="price">Prix</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* CASES LIST */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin">
              <AlertCircle className="w-8 h-8 text-slate-400" />
            </div>
          </div>
        ) : sorted.length === 0 ? (
          <Card className="text-center py-12">
            <Home className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">Aucun dossier</h3>
            <p className="text-slate-600 mb-6">Faites une offre sur un terrain pour créer un dossier d'achat</p>
          </Card>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {sorted.map((caseItem, idx) => (
                <motion.div
                  key={caseItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => navigate(`/acheteur/cases/${caseItem.case_number}`)}
                  >
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        {/* PROPERTY INFO */}
                        <div className="md:col-span-2">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              <Home className="w-12 h-12 text-slate-400" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-900">
                                {caseItem.property?.title || 'Propriété'}
                              </h3>
                              <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                                <MapPin className="w-4 h-4" />
                                {caseItem.property?.location || 'Localisation'}
                              </p>
                              <p className="text-sm font-medium text-slate-900 mt-2">
                                {(caseItem.purchase_price || 0)?.toLocaleString('fr-FR')} CFA
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* STATUS & DATES */}
                        <div>
                          <Badge className={statusConfig[caseItem.status]?.color}>
                            {statusConfig[caseItem.status]?.label}
                          </Badge>
                          <p className="text-xs text-slate-600 mt-2">
                            <span className="font-medium">Créée:</span>{' '}
                            {format(new Date(caseItem.created_at), 'dd MMM yyyy', { locale: fr })}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            <span className="font-medium">Modifiée:</span>{' '}
                            {format(new Date(caseItem.updated_at), 'dd MMM yyyy', { locale: fr })}
                          </p>
                        </div>

                        {/* PARTICIPANTS */}
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-3">Participants</p>
                          <div className="space-y-2 text-sm">
                            {caseItem.seller && (
                              <p className="flex items-center gap-1 text-slate-600">
                                <Users className="w-4 h-4" />
                                <span className="font-medium">Vendeur:</span> {caseItem.seller?.first_name}
                              </p>
                            )}
                            {caseItem.notary && (
                              <p className="flex items-center gap-1 text-slate-600">
                                <FileText className="w-4 h-4" />
                                <span className="font-medium">Notaire:</span> {caseItem.notary?.first_name}
                              </p>
                            )}
                            {caseItem.geometre && (
                              <p className="flex items-center gap-1 text-slate-600">
                                <MapPin className="w-4 h-4" />
                                <span className="font-medium">Géomètre:</span> {caseItem.geometre?.first_name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex flex-col justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/acheteur/cases/${caseItem.case_number}`);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Voir
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/acheteur/messages?case=${caseItem.case_number}`);
                            }}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Discuter
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticulierMesAchatsRefactored;
