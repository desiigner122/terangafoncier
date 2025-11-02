/**
 * NotaireCaseDetailModern.jsx
 * 
 * Page de suivi détaillé optimisée pour le notaire
 * Version simplifiée qui fonctionne avec le système purchase_case_participants
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, FileText, Users, MessageSquare, Calendar, DollarSign,
  CheckCircle, Clock, AlertCircle, TrendingUp, MapPin, Phone, Mail,
  Send, Paperclip, Download, Upload, Eye, Trash2, User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import TimelineTrackerModern from '@/components/purchase/TimelineTrackerModern';
import PurchaseCaseMessaging from '@/components/messaging/PurchaseCaseMessaging';
import WorkflowStatusService from '@/services/WorkflowStatusService';
import ContractGenerator from '@/components/purchase/ContractGenerator';
import AppointmentScheduler from '@/components/purchase/AppointmentScheduler';
import useRealtimeCaseSync from '@/hooks/useRealtimeCaseSync';
import AdvancedCaseTrackingService from '@/services/AdvancedCaseTrackingService';
import ActionButtonsSection from '@/components/notaire/ActionButtonsSection';
import PaymentRequestModal from '@/components/modals/PaymentRequestModal';
import PurchaseWorkflowService from '@/services/PurchaseWorkflowService';
import NotaireAssignmentService from '@/services/NotaireAssignmentService';
import { toast } from 'sonner';

const STATUS_META = {
  initiated: { label: 'Initié', color: 'bg-gray-500', progress: 10 },
  buyer_verification: { label: 'Vérification acheteur', color: 'bg-blue-500', progress: 20 },
  seller_notification: { label: 'Notification vendeur', color: 'bg-indigo-500', progress: 30 },
  document_collection: { label: 'Collecte documents', color: 'bg-purple-500', progress: 40 },
  title_verification: { label: 'Vérification titre', color: 'bg-pink-500', progress: 50 },
  contract_preparation: { label: 'Préparation contrat', color: 'bg-cyan-500', progress: 60 },
  preliminary_agreement: { label: 'Accord préliminaire', color: 'bg-teal-500', progress: 65 },
  deposit_pending: { label: 'Acompte en attente', color: 'bg-yellow-500', progress: 70 },
  contract_validation: { label: 'Validation contrat', color: 'bg-orange-500', progress: 75 },
  appointment_scheduling: { label: 'Planification RDV', color: 'bg-amber-500', progress: 80 },
  final_payment: { label: 'Paiement final', color: 'bg-lime-500', progress: 85 },
  signature: { label: 'Signature', color: 'bg-green-500', progress: 90 },
  registration: { label: 'Enregistrement', color: 'bg-emerald-500', progress: 95 },
  completed: { label: 'Terminé', color: 'bg-green-600', progress: 100 },
  cancelled: { label: 'Annulé', color: 'bg-red-500', progress: 0 }
};

const NotaireCaseDetailModern = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [documents, setDocuments] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [showContractDialog, setShowContractDialog] = useState(false);
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentModalData, setPaymentModalData] = useState(null);

  // Use unified realtime sync hook
  useRealtimeCaseSync(caseId, () => {
    loadCaseDetails();
    loadDocuments();
  });

  // Ensure notary participant is marked active (not pending) for this case
  const ensureNotaryParticipantActive = async () => {
    try {
      if (!user?.id) return;
      
      // D'abord vérifier si le notaire existe dans les participants
      const { data: existingParticipant } = await supabase
        .from('purchase_case_participants')
        .select('id, status')
        .eq('case_id', caseId)
        .eq('user_id', user.id)
        .eq('role', 'notary')
        .maybeSingle();

      if (!existingParticipant) {
        // Insérer le notaire comme participant actif
        await supabase
          .from('purchase_case_participants')
          .insert({
            case_id: caseId,
            user_id: user.id,
            role: 'notary',
            status: 'active'
          });
      } else if (existingParticipant.status === 'pending') {
        // Mettre à jour de pending vers active
        await supabase
          .from('purchase_case_participants')
          .update({ status: 'active' })
          .eq('case_id', caseId)
          .eq('user_id', user.id)
          .eq('role', 'notary');
      }
    } catch (e) {
      console.warn('⚠️ Erreur sync participant notaire:', e);
      // silencieux si RLS empêche l'update
    }
  };

  useEffect(() => {
    if (caseId && user) {
      loadCaseDetails();
    }
  }, [caseId, user]);

  const loadCaseDetails = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading case details for:', caseId);

      // Charger le dossier complet avec toutes les relations et l'assignation notaire
      const { data: purchaseCase, error } = await supabase
        .from('purchase_cases')
        .select(`
          *,
          buyer:profiles!buyer_id(id, full_name, email, phone, avatar_url),
          seller:profiles!seller_id(id, full_name, email, phone, avatar_url),
          parcelle:parcels!parcelle_id(id, title, location, surface),
          notaire_assignment:notaire_case_assignments(
            id,
            status,
            notaire_status,
            buyer_approved,
            seller_approved,
            quoted_fee,
            quoted_disbursements,
            justification,
            decline_reason,
            created_at,
            updated_at
          )
        `)
        .eq('id', caseId)
        .single();

      if (error) throw error;

      console.log('✅ Case loaded:', purchaseCase);
      console.log('📋 Assignment status:', purchaseCase.notaire_assignment);
      
      setCaseData(purchaseCase);

      // Charger les documents
      loadDocuments();

      // Charger le timeline
      const { data: timelineData } = await supabase
        .from('purchase_case_timeline')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false});
      setTimeline(timelineData || []);
      console.log('📊 Timeline chargé:', timelineData?.length, 'événements');

  // S'assurer que le notaire n'est pas marqué "en attente" côté participants
  ensureNotaryParticipantActive();

    } catch (error) {
      console.error('❌ Error loading case:', error);
      window.safeGlobalToast?.({
        title: "Erreur",
        description: "Impossible de charger le dossier",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = async ({ action, nextStatus }) => {
    try {
      const result = await PurchaseWorkflowService.updateCaseStatus(
        caseData.id,
        nextStatus,
        user.id,
        `Action: ${action}`
      );
      
      if (result.success) {
        toast.success('Action effectuée avec succès');
        await loadCaseDetails();
      } else {
        toast.error(result.error || 'Erreur lors de l\'action');
      }
    } catch (error) {
      console.error('Error executing action:', error);
      toast.error('Erreur lors de l\'exécution de l\'action');
    }
  };

  const handlePaymentRequestClick = ({ paymentType, nextStatus }) => {
    setPaymentModalData({ paymentType, nextStatus });
    setShowPaymentModal(true);
  };

  const handlePaymentRequestSuccess = async () => {
    setShowPaymentModal(false);
    setPaymentModalData(null);
    await loadCaseDetails();
    toast.success('Demande de paiement envoyée avec succès');
  };

  // Handlers pour accepter/décliner l'assignation notaire
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [quotedFee, setQuotedFee] = useState('');
  const [quotedDisbursements, setQuotedDisbursements] = useState('');
  const [justification, setJustification] = useState('');
  const [declineReason, setDeclineReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAcceptAssignment = async () => {
    try {
      setIsSubmitting(true);

      const assignment = caseData?.notaire_assignment?.[0];
      if (!assignment) {
        toast.error('Aucune assignation trouvée');
        return;
      }

      const result = await NotaireAssignmentService.acceptAssignment(
        assignment.id,
        user.id,
        parseFloat(quotedFee) || 0,
        parseFloat(quotedDisbursements) || 0,
        justification
      );

      if (result.success) {
        toast.success('Assignation acceptée avec succès');
        setShowAcceptDialog(false);
        setQuotedFee('');
        setQuotedDisbursements('');
        setJustification('');
        await loadCaseDetails();
      } else {
        toast.error(result.error || 'Erreur lors de l\'acceptation');
      }
    } catch (error) {
      console.error('Error accepting assignment:', error);
      toast.error('Erreur lors de l\'acceptation de l\'assignation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeclineAssignment = async () => {
    try {
      setIsSubmitting(true);

      const assignment = caseData?.notaire_assignment?.[0];
      if (!assignment) {
        toast.error('Aucune assignation trouvée');
        return;
      }

      if (!declineReason.trim()) {
        toast.error('Veuillez fournir une raison pour le refus');
        return;
      }

      const result = await NotaireAssignmentService.declineAssignment(
        assignment.id,
        user.id,
        declineReason
      );

      if (result.success) {
        toast.success('Assignation refusée');
        setShowDeclineDialog(false);
        setDeclineReason('');
        await loadCaseDetails();
      } else {
        toast.error(result.error || 'Erreur lors du refus');
      }
    } catch (error) {
      console.error('Error declining assignment:', error);
      toast.error('Erreur lors du refus de l\'assignation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const { data: docsData, error } = await supabase
        .from('purchase_case_documents')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('📄 Documents loaded:', docsData?.length, docsData);

      // Charger les profils des uploaders
      if (docsData && docsData.length > 0) {
        const uploaderIds = [...new Set(docsData.map(d => d.uploaded_by).filter(Boolean))];
        
        console.log('👤 Loading profiles for uploader IDs:', uploaderIds);
        
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', uploaderIds);

        console.log('👤 Uploader profiles loaded:', profilesData);

        // Mapper les profils aux documents
        const profilesMap = {};
        (profilesData || []).forEach(profile => {
          profilesMap[profile.id] = profile;
        });

        const docsWithUploaders = docsData.map(doc => ({
          ...doc,
          uploader: profilesMap[doc.uploaded_by] || null,
          uploaded_by_name: profilesMap[doc.uploaded_by]?.full_name || profilesMap[doc.uploaded_by]?.email || 'Utilisateur'
        }));

        console.log('✅ Documents with uploaders:', docsWithUploaders);
        setDocuments(docsWithUploaders);
      } else {
        setDocuments([]);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      setDocuments([]);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      
      const oldStatus = caseData?.status;
      
      const { error } = await supabase
        .from('purchase_cases')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', caseId);

      if (error) throw error;

      // Enregistrer l'événement dans le timeline
      await AdvancedCaseTrackingService.logTimelineEvent(
        caseId,
        'status_change',
        `Statut mis à jour: ${WorkflowStatusService.getLabel(newStatus)}`,
        {
          old_status: oldStatus,
          new_status: newStatus,
          to_status: newStatus,
          changed_by: 'notary',
          changed_by_id: user?.id
        }
      );

      // Recharger les données
      await loadCaseDetails();
      
      window.safeGlobalToast?.({
        title: "Statut mis à jour",
        description: `Le dossier est maintenant en: ${WorkflowStatusService.getLabel(newStatus)}`,
        variant: "success"
      });

      setShowStatusDialog(false);
    } catch (error) {
      console.error('Error updating status:', error);
      const isConstraint = error?.code === '23514';
      window.safeGlobalToast?.({
        title: isConstraint ? "Statut non autorisé par la base" : "Erreur",
        description: isConstraint
          ? "Veuillez exécuter le script SQL FIX_ALL_RLS_AND_CONSTRAINTS.sql dans Supabase pour mettre à jour la contrainte des statuts."
          : "Impossible de mettre à jour le statut",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const advanceToNextStatus = async () => {
    try {
      const list = WorkflowStatusService.chronologicalOrder || [];
      const current = caseData?.status;
      if (!current) return;
      const idx = list.indexOf(current);
      const next = idx >= 0 && idx + 1 < list.length ? list[idx + 1] : null;
      if (!next || next === current) return;
      await handleStatusUpdate(next);
    } catch (e) {
      // errors are handled in handleStatusUpdate
    }
  };

  const handleValidateDocuments = async () => {
    try {
      // Valider tous les documents en attente
      const { error } = await supabase
        .from('purchase_case_documents')
        .update({ status: 'approved' })
        .eq('case_id', caseId)
        .eq('status', 'pending');

      if (error) throw error;

      await loadDocuments();
      
      window.safeGlobalToast?.({
        title: "Documents validés",
        description: "Tous les documents en attente ont été validés",
        variant: "success"
      });

      // Avancer automatiquement au prochain statut
      await advanceToNextStatus();
    } catch (error) {
      console.error('Error validating documents:', error);
      window.safeGlobalToast?.({
        title: "Erreur",
        description: "Impossible de valider les documents",
        variant: "destructive"
      });
    }
  };

  const getAvailableStatusTransitions = () => {
    if (!caseData?.status) return [];
    
    const currentIndex = WorkflowStatusService.chronologicalOrder.indexOf(caseData.status);
    if (currentIndex === -1) return WorkflowStatusService.chronologicalOrder;
    
    // Permettre d'avancer au statut suivant ou de revenir en arrière
    return WorkflowStatusService.chronologicalOrder.slice(
      Math.max(0, currentIndex - 1),
      Math.min(WorkflowStatusService.chronologicalOrder.length, currentIndex + 3)
    );
  };

  const handleDeleteDocument = async (documentId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;
    
    try {
      const { error } = await supabase
        .from('purchase_case_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      await loadDocuments();
      
      window.safeGlobalToast?.({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès",
        variant: "success"
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      window.safeGlobalToast?.({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive"
      });
    }
  };

  const handleDownloadDocument = (doc) => {
    if (doc.file_url) {
      window.open(doc.file_url, '_blank');
    } else {
      window.safeGlobalToast?.({
        title: "Document non disponible",
        description: "L'URL du document n'est pas disponible",
        variant: "destructive"
      });
    }
  };

  const handlePreviewDocument = (doc) => {
    if (doc.file_url) {
      // Ouvrir dans un nouvel onglet pour preview
      window.open(doc.file_url, '_blank');
    } else {
      window.safeGlobalToast?.({
        title: "Aperçu non disponible",
        description: "L'URL du document n'est pas disponible",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <AlertCircle className="h-16 w-16 text-gray-400" />
        <p className="text-xl text-gray-600">Dossier introuvable</p>
        <Button onClick={() => navigate('/notaire/cases')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux dossiers
        </Button>
      </div>
    );
  }

  const statusConfig = STATUS_META[caseData.status] || STATUS_META.initiated;
  
  // Calculer le vrai pourcentage basé sur les événements timeline
  const calculateRealProgress = () => {
    if (!timeline || timeline.length === 0) {
      // Fallback: utiliser la position dans chronologicalOrder
      const stages = WorkflowStatusService.chronologicalOrder;
      const currentIndex = stages.indexOf(caseData?.status || 'initiated');
      return Math.round(((currentIndex + 1) / stages.length) * 100);
    }
    
    // Compter les étapes complétées via les événements timeline
    const stages = WorkflowStatusService.chronologicalOrder;
    const completedStages = timeline.filter(event => {
      if (event.event_type !== 'status_change') return false;
      const targetStatus = event.metadata?.to_status || event.metadata?.new_status;
      return stages.includes(targetStatus);
    });
    
    // Utiliser les statuts uniques complétés
    const uniqueCompletedStatuses = new Set(
      completedStages.map(evt => evt.metadata?.to_status || evt.metadata?.new_status)
    );
    
    return Math.round((uniqueCompletedStatuses.size / stages.length) * 100);
  };
  
  const realProgress = calculateRealProgress();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/notaire/cases')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {caseData.case_number}
                </h1>
                <Badge className={statusConfig.color}>
                  {statusConfig.label}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {caseData.parcelle?.title} - {caseData.parcelle?.location}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Progression</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {realProgress}%
              </span>
            </div>
            <Progress value={realProgress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Assignment Pending Alert */}
            {caseData?.notaire_assignment?.[0]?.notaire_status === 'pending' && (
              <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                    <AlertCircle className="h-5 w-5" />
                    Nouvelle assignation en attente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Ce dossier vous a été assigné. Veuillez l'accepter ou le décliner.
                  </p>
                  
                  {/* Informations d'approbation */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`h-4 w-4 ${caseData.notaire_assignment[0].buyer_approved ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className={caseData.notaire_assignment[0].buyer_approved ? 'text-green-700 dark:text-green-400' : 'text-gray-500'}>
                        Approuvé par l'acheteur
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`h-4 w-4 ${caseData.notaire_assignment[0].seller_approved ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className={caseData.notaire_assignment[0].seller_approved ? 'text-green-700 dark:text-green-400' : 'text-gray-500'}>
                        Approuvé par le vendeur
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowAcceptDialog(true)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accepter
                    </Button>
                    <Button
                      onClick={() => setShowDeclineDialog(true)}
                      variant="outline"
                      className="flex-1 border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Décliner
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              {/* Action Buttons Section */}
              <ActionButtonsSection
                currentStatus={caseData.status}
                caseData={caseData}
                onActionClick={handleActionClick}
                onPaymentRequestClick={handlePaymentRequestClick}
                loading={updatingStatus}
              />

              <TabsContent value="overview" className="space-y-4">
                {/* Informations générales */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Informations du dossier
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Numéro de dossier</p>
                      <p className="font-semibold">{caseData.case_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Statut</p>
                      <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Prix d'achat</p>
                      <p className="font-semibold text-lg text-green-600">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'XOF',
                          minimumFractionDigits: 0
                        }).format(caseData.purchase_price || 0)}
                      </p>
                    </div>
                    {caseData.notaire_fees && (
                      <div>
                        <p className="text-sm text-gray-500">Frais de notaire</p>
                        <p className="font-semibold text-lg text-blue-600">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'XOF',
                            minimumFractionDigits: 0
                          }).format(caseData.notaire_fees)}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Date de création</p>
                      <p className="font-semibold">
                        {new Date(caseData.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dernière mise à jour</p>
                      <p className="font-semibold">
                        {new Date(caseData.updated_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Informations terrain */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Terrain
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Titre</p>
                      <p className="font-semibold">{caseData.parcelle?.title || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Localisation</p>
                      <p className="font-semibold">{caseData.parcelle?.location || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Surface</p>
                      <p className="font-semibold">{caseData.parcelle?.surface || 'N/A'} m²</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions contextuelles */}
                <Card>
                  <CardHeader>
                    <CardTitle>Actions disponibles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {/* Générer/Préparer Contrat */}
                      <Dialog open={showContractDialog} onOpenChange={setShowContractDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full justify-start gap-2">
                            <FileText className="h-4 w-4" />
                            Préparer le contrat
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Génération de contrat</DialogTitle>
                            <DialogDescription>
                              Générez les documents officiels pour ce dossier
                            </DialogDescription>
                          </DialogHeader>
                          <ContractGenerator
                            purchaseRequest={{ id: caseId }}
                            buyer={caseData?.buyer}
                            seller={caseData?.seller}
                            property={caseData?.parcelle}
                            onContractGenerated={() => {
                              setShowContractDialog(false);
                              loadDocuments();
                            }}
                          />
                        </DialogContent>
                      </Dialog>

                      {/* Planifier RDV/Signature */}
                      <Dialog open={showAppointmentDialog} onOpenChange={setShowAppointmentDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full justify-start gap-2">
                            <Calendar className="h-4 w-4" />
                            Planifier la signature
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Planifier un rendez-vous</DialogTitle>
                            <DialogDescription>
                              Créez un rendez-vous de signature avec toutes les parties
                            </DialogDescription>
                          </DialogHeader>
                          <AppointmentScheduler
                            purchaseRequestId={caseId}
                            userId={user?.id}
                            onAppointmentCreated={() => {
                              setShowAppointmentDialog(false);
                              window.safeGlobalToast?.({
                                title: "Rendez-vous créé",
                                description: "Le rendez-vous a été planifié avec succès",
                                variant: "success"
                              });
                            }}
                          />
                        </DialogContent>
                      </Dialog>

                      {/* Valider Documents */}
                      {documents.some((d) => d.status === 'pending') && (
                        <Button 
                          variant="outline" 
                          className="w-full justify-start gap-2"
                          onClick={handleValidateDocuments}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Valider les documents
                        </Button>
                      )}

                      {/* Changer le statut */}
                      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full justify-start gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Changer le statut
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Mettre à jour le statut du dossier</DialogTitle>
                            <DialogDescription>
                              Statut actuel: {WorkflowStatusService.getLabel(caseData?.status)}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Nouveau statut</Label>
                              <div className="grid gap-2">
                                {getAvailableStatusTransitions().map((status) => (
                                  <Button
                                    key={status}
                                    variant={caseData?.status === status ? "default" : "outline"}
                                    className="justify-start"
                                    onClick={() => handleStatusUpdate(status)}
                                    disabled={updatingStatus || caseData?.status === status}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    {WorkflowStatusService.getLabel(status)}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2"
                        onClick={() => setActiveTab('documents')}
                      >
                        <Upload className="h-4 w-4" />
                        Télécharger un document
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="messages">
                <PurchaseCaseMessaging
                  caseId={caseId}
                  caseNumber={caseData?.case_number}
                  buyerInfo={{
                    id: caseData?.buyer?.id,
                    name: caseData?.buyer?.full_name || caseData?.buyer?.email
                  }}
                  sellerInfo={{
                    id: caseData?.seller?.id,
                    name: caseData?.seller?.full_name || caseData?.seller?.email
                  }}
                />
              </TabsContent>

              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Documents du dossier
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => setActiveTab('documents')}
                      >
                        <Upload className="h-4 w-4" />
                        Uploader
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {documents.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="h-16 w-16 mx-auto mb-3 opacity-20" />
                        <p className="font-medium">Aucun document pour le moment</p>
                        <p className="text-sm mt-1">Les documents ajoutés au dossier apparaîtront ici</p>
                        <Button 
                          className="mt-4 gap-2" 
                          variant="outline"
                          onClick={() => window.safeGlobalToast?.({
                            title: "Upload de document",
                            description: "Fonctionnalité en cours de développement",
                            variant: "default"
                          })}
                        >
                          <Upload className="h-4 w-4" />
                          Ajouter le premier document
                        </Button>
                      </div>
                    ) : (
                      <ScrollArea className="h-[500px]">
                        <div className="space-y-3">
                          {documents.map((doc) => (
                            <Card key={doc.id} className="border-l-4 border-l-blue-500">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex items-start gap-3 flex-1">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-sm truncate">
                                        {doc.file_name || 'Document sans nom'}
                                      </h4>
                                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                                          {doc.document_type || doc.file_type || doc.mime_type || 'Type inconnu'}
                                        </span>
                                        {doc.file_size && (
                                          <span>{(doc.file_size / 1024).toFixed(0)} Ko</span>
                                        )}
                                        {doc.created_at && (
                                          <span>
                                            {new Date(doc.created_at).toLocaleDateString('fr-FR', {
                                              day: 'numeric',
                                              month: 'short',
                                              year: 'numeric'
                                            })}
                                          </span>
                                        )}
                                      </div>
                                      {doc.uploaded_by_name && (
                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                          <User className="h-3 w-3" />
                                          Ajouté par {doc.uploaded_by_name}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      title="Prévisualiser"
                                      onClick={() => handlePreviewDocument(doc)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      title="Télécharger"
                                      onClick={() => handleDownloadDocument(doc)}
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50" 
                                      title="Supprimer"
                                      onClick={() => handleDeleteDocument(doc.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    )}

                    {documents.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{documents.length} document(s) au total</span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => window.safeGlobalToast?.({
                              title: "Upload de document",
                              description: "Fonctionnalité en cours de développement",
                              variant: "default"
                            })}
                          >
                            <Upload className="h-4 w-4" />
                            Ajouter un document
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique du dossier</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TimelineTrackerModern
                      currentStatus={caseData?.status || 'initiated'}
                      paymentMethod={caseData?.payment_method || 'one_time'}
                      financingApproved={caseData?.financing_approved || false}
                      completedStages={WorkflowStatusService.getCompletedStages(caseData?.status || 'initiated')}
                      history={[]}
                      timeline={timeline}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Participants */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Participants
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Acheteur */}
                {caseData.buyer && (
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Avatar>
                      <AvatarFallback className="bg-blue-500 text-white">
                        {caseData.buyer.full_name?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Acheteur</p>
                      <p className="font-semibold">{caseData.buyer.full_name || caseData.buyer.email}</p>
                      {caseData.buyer.email && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Mail className="h-3 w-3" />
                          {caseData.buyer.email}
                        </p>
                      )}
                      {caseData.buyer.phone && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {caseData.buyer.phone}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Vendeur */}
                {caseData.seller && (
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Avatar>
                      <AvatarFallback className="bg-green-500 text-white">
                        {caseData.seller.full_name?.charAt(0) || 'V'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Vendeur</p>
                      <p className="font-semibold">{caseData.seller.full_name || caseData.seller.email}</p>
                      {caseData.seller.email && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Mail className="h-3 w-3" />
                          {caseData.seller.email}
                        </p>
                      )}
                      {caseData.seller.phone && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {caseData.seller.phone}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Request Modal */}
      <PaymentRequestModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setPaymentModalData(null);
        }}
        caseData={caseData}
        paymentType={paymentModalData?.paymentType}
        nextStatus={paymentModalData?.nextStatus}
        onSuccess={handlePaymentRequestSuccess}
      />

      {/* Accept Assignment Dialog */}
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Accepter l'assignation</DialogTitle>
            <DialogDescription>
              Veuillez fournir vos honoraires et débours pour ce dossier
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="quotedFee">Honoraires (FCFA)</Label>
              <input
                id="quotedFee"
                type="number"
                value={quotedFee}
                onChange={(e) => setQuotedFee(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 500000"
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="quotedDisbursements">Débours (FCFA)</Label>
              <input
                id="quotedDisbursements"
                type="number"
                value={quotedDisbursements}
                onChange={(e) => setQuotedDisbursements(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 50000"
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="justification">Justification (optionnel)</Label>
              <Textarea
                id="justification"
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Détails des honoraires et débours..."
                rows={3}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAcceptDialog(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleAcceptAssignment}
                disabled={isSubmitting || !quotedFee}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Envoi...' : 'Accepter'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Decline Assignment Dialog */}
      <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Décliner l'assignation</DialogTitle>
            <DialogDescription>
              Veuillez indiquer la raison de votre refus
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="declineReason">Raison du refus</Label>
              <Textarea
                id="declineReason"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Ex: Conflit d'intérêt, surcharge de travail, etc."
                rows={4}
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowDeclineDialog(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleDeclineAssignment}
                disabled={isSubmitting || !declineReason.trim()}
                variant="destructive"
                className="flex-1"
              >
                {isSubmitting ? 'Envoi...' : 'Décliner'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotaireCaseDetailModern;
