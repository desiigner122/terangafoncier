/**
 * Page Gestion des Dossiers Notaires - Version Moderne
 * Utilise le workflow réel (19 statuts) et intègre TimelineTrackerModern
 * Avec Realtime notifications Supabase pour mises à jour en temps réel
 * @author Teranga Foncier Team
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Users, Eye, Edit, Trash2, Plus, Search, Filter, Calendar,
  Clock, CheckCircle, AlertTriangle, XCircle, ArrowRight, MapPin,
  DollarSign, FileText, Phone, Mail, Download, MessageSquare,
  Package, ChevronRight, Bell, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import TimelineTrackerModern from '@/components/purchase/TimelineTrackerModern';
import BankFinancingSection from '@/components/purchase/BankFinancingSection';
import WorkflowStatusService from '@/services/WorkflowStatusService';

const NotaireCasesModernReal = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    in_progress: 0,
    completed: 0,
    blocked: 0
  });

  // Initialiser les subscriptions Realtime
  useEffect(() => {
    if (user) {
      loadCases();
      setupRealtimeSubscriptions();
    }

    return () => {
      // Cleanup subscriptions
      supabase.removeAllChannels();
    };
  }, [user]);

  // Filtrer les cas quand search/filter change
  useEffect(() => {
    filterCases();
  }, [searchTerm, statusFilter, cases]);

  const setupRealtimeSubscriptions = () => {
    try {
      // 1. Subscribe to purchase_cases changes
      const purchaseCasesChannel = supabase
        .channel(`notaire-purchase-cases-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'purchase_cases',
            filter: `assigned_notary_id=eq.${user.id}`
          },
          (payload) => {
            console.log('🔔 [REALTIME] Changement purchase_cases pour notaire:', payload);
            toast.info('Changement détecté dans les dossiers');
            loadCases();
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ Realtime subscription à purchase_cases activée');
          }
        });

      // 2. Subscribe to case status updates
      const statusUpdateChannel = supabase
        .channel(`notaire-case-status-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'purchase_cases',
            filter: `assigned_notary_id=eq.${user.id}`
          },
          (payload) => {
            const { new: newCase, old: oldCase } = payload;
            if (newCase.status !== oldCase?.status) {
              console.log(`📊 [REALTIME] Statut changé: ${oldCase?.status} → ${newCase.status}`);
              toast.info(`Dossier ${newCase.case_number}: Statut mis à jour`);
              loadCases();
            }
          }
        )
        .subscribe();

      // 3. Subscribe to new messages
      const messagesChannel = supabase
        .channel(`notaire-messages-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'purchase_case_messages',
            filter: `receiver_id=eq.${user.id}`
          },
          (payload) => {
            console.log('💬 [REALTIME] Nouveau message:', payload);
            toast.info('Vous avez reçu un nouveau message');
            loadCases();
          }
        )
        .subscribe();

    } catch (error) {
      console.error('Erreur setup Realtime subscriptions:', error);
    }
  };

  const loadCases = async () => {
    setIsLoading(true);
    try {
      // Charger tous les dossiers assignés au notaire via notaire_case_assignments
      const { data: casesData, error: casesError } = await supabase
        .from('purchase_cases')
        .select(`
          id,
          case_number,
          status,
          phase,
          progress_percentage,
          created_at,
          updated_at,
          buyer_id,
          seller_id,
          parcel_id,
          payment_method,
          financing_approved,
          agreed_price,
          purchase_price,
          notaire_id,
          buyer:profiles!buyer_id(id, full_name, email, phone, avatar_url),
          seller:profiles!seller_id(id, full_name, email, phone, avatar_url),
          parcel:parcels(id, title, location, surface_area, price),
          notaire_assignment:notaire_case_assignments!inner(
            id,
            status,
            notaire_status,
            buyer_approved,
            seller_approved,
            quoted_fee,
            quoted_disbursements,
            justification
          )
        `)
        .eq('notaire_assignment.notaire_id', user.id)
        .order('updated_at', { ascending: false });

      if (casesError) throw casesError;

      // Transformer les données avec les informations d'assignation
      const transformedCases = casesData.map(caseData => ({
        id: caseData.id,
        case_number: caseData.case_number,
        status: caseData.status || 'initiated',
        phase: caseData.phase || 0,
        progress: caseData.progress_percentage || 0,
        created_at: caseData.created_at,
        updated_at: caseData.updated_at,
        buyer: caseData.buyer,
        seller: caseData.seller,
        property: caseData.parcel,
        payment_method: caseData.payment_method || 'one_time',
        financing_approved: caseData.financing_approved || false,
        price: caseData.agreed_price || caseData.purchase_price || 0,
        workflow_stage: caseData.status,
        // Informations d'assignation notaire
        assignment: caseData.notaire_assignment?.[0] || null,
        notaire_status: caseData.notaire_assignment?.[0]?.notaire_status || 'pending',
        buyer_approved: caseData.notaire_assignment?.[0]?.buyer_approved || false,
        seller_approved: caseData.notaire_assignment?.[0]?.seller_approved || false,
        quoted_fee: caseData.notaire_assignment?.[0]?.quoted_fee || 0,
        quoted_disbursements: caseData.notaire_assignment?.[0]?.quoted_disbursements || 0
      }));

      setCases(transformedCases);

      // Calculer les stats avec les statuts d'assignation
      const newStats = {
        total: transformedCases.length,
        in_progress: transformedCases.filter(c => {
          // En cours = accepté par le notaire et pas encore complété
          return c.notaire_status === 'accepted' && 
                 !['completed', 'property_transfer', 'cancelled', 'rejected'].includes(c.status);
        }).length,
        completed: transformedCases.filter(c => c.status === 'completed').length,
        blocked: transformedCases.filter(c => 
          c.status === 'blocked' || 
          c.status === 'legal_issues_found' ||
          c.notaire_status === 'pending' // En attente d'acceptation
        ).length
      };
      setStats(newStats);

    } catch (error) {
      console.error('Erreur chargement dossiers:', error);
      toast.error('Erreur lors du chargement des dossiers');
    } finally {
      setIsLoading(false);
    }
  };

  const filterCases = () => {
    let filtered = cases;

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.case_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.buyer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.seller?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.property?.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrer par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    setFilteredCases(filtered);
  };

  const formatPrice = (price) => {
    if (!price) return '—';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status) => {
    const config = WorkflowStatusService.getColorConfig(status);
    return config.bgColor;
  };

  if (isLoading && cases.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Dossiers Notariaux</h1>
              <p className="text-gray-600 mt-1">Suivi des dossiers d'achat de propriétés assignés</p>
            </div>
            <Button onClick={loadCases} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </Button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">En cours</p>
                      <p className="text-2xl font-bold text-yellow-600">{stats.in_progress}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
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
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Finalisés</p>
                      <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
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
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Bloqués</p>
                      <p className="text-2xl font-bold text-red-600">{stats.blocked}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher par n° dossier, acheteur, vendeur, propriété..."
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Filter className="w-5 h-5 text-gray-600 mt-2.5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-lg bg-white text-sm"
                >
                  <option value="all">Tous les statuts</option>
                  {WorkflowStatusService.getAllStatuses().map(status => (
                    <option key={status} value={status}>
                      {WorkflowStatusService.getLabel(status)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des dossiers */}
        {filteredCases.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium text-gray-500">Aucun dossier trouvé</p>
              {searchTerm || statusFilter !== 'all' ? (
                <Button variant="outline" onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }} className="mt-4">
                  Réinitialiser filtres
                </Button>
              ) : (
                <p className="text-sm text-gray-400 mt-2">Aucun dossier notarial assigné pour le moment</p>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence>
              {filteredCases.map((caseData, index) => (
                <motion.div
                  key={caseData.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      {/* Header du dossier */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">
                              Dossier #{caseData.case_number}
                            </h3>
                            <Badge className={cn(getStatusColor(caseData.status))}>
                              {WorkflowStatusService.getLabel(caseData.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {caseData.property?.title} — {caseData.property?.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {formatPrice(caseData.price)}
                          </div>
                          <div className="text-xs text-gray-500">Prix convenu</div>
                        </div>
                      </div>

                      {/* Informations parties */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Acheteur</p>
                          <p className="text-sm font-medium">{caseData.buyer?.full_name}</p>
                          <p className="text-xs text-gray-500">{caseData.buyer?.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Vendeur</p>
                          <p className="text-sm font-medium">{caseData.seller?.full_name}</p>
                          <p className="text-xs text-gray-500">{caseData.seller?.email}</p>
                        </div>
                      </div>

                      {/* Progression */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Progression - Phase {caseData.phase}</span>
                          <span className="text-sm font-bold text-blue-600">{Math.round(caseData.progress)}%</span>
                        </div>
                        <Progress value={caseData.progress} className="h-2" />
                      </div>

                      {/* Timeline */}
                      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                        <TimelineTrackerModern
                          currentStatus={caseData.workflow_stage}
                          paymentMethod={caseData.payment_method}
                          financingApproved={caseData.financing_approved}
                          completedStages={WorkflowStatusService.getCompletedStages(caseData.workflow_stage)}
                          compact={true}
                        />
                      </div>

                      {/* Financement bancaire si applicable */}
                      {caseData.payment_method === 'bank_financing' && (
                        <div className="mb-4">
                          <BankFinancingSection
                            paymentMethod={caseData.payment_method}
                            financingApproved={caseData.financing_approved}
                          />
                        </div>
                      )}

                      {/* Dates importantes */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-600">Créé</p>
                          <p className="font-medium">{format(new Date(caseData.created_at), 'dd MMM yyyy', { locale: fr })}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Mis à jour</p>
                          <p className="font-medium">{format(new Date(caseData.updated_at), 'dd MMM yyyy', { locale: fr })}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Phase</p>
                          <p className="font-medium">{caseData.phase}/4</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => setSelectedCase(caseData)}
                              className="flex-1"
                              variant="default"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Voir détails
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Dossier #{caseData.case_number}</DialogTitle>
                            </DialogHeader>
                            {selectedCase && (
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Acheteur</h4>
                                  <p>{selectedCase.buyer?.full_name}</p>
                                  <p className="text-sm text-gray-600">{selectedCase.buyer?.email}</p>
                                  <p className="text-sm text-gray-600">{selectedCase.buyer?.phone}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Vendeur</h4>
                                  <p>{selectedCase.seller?.full_name}</p>
                                  <p className="text-sm text-gray-600">{selectedCase.seller?.email}</p>
                                  <p className="text-sm text-gray-600">{selectedCase.seller?.phone}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Propriété</h4>
                                  <p>{selectedCase.property?.title}</p>
                                  <p className="text-sm text-gray-600">{selectedCase.property?.location}</p>
                                  <p className="text-sm text-gray-600">{selectedCase.property?.surface_area}m²</p>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button variant="outline" size="sm" className="gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Messages
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="w-4 h-4" />
                          Documents
                        </Button>
                      </div>
                    </div>
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

export default NotaireCasesModernReal;
