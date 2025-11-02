/**
 * Page Unifiée de Suivi de Dossier d'Achat
 * 
 * Cette page s'adapte automatiquement au rôle de l'utilisateur :
 * - Acheteur : peut choisir agent/géomètre, uploader docs, payer
 * - Vendeur : peut valider offres, uploader titre
 * - Notaire : peut vérifier docs, générer contrat, programmer RDV
 * - Agent Foncier : peut faciliter négociation, suivre commission
 * - Géomètre : peut accepter missions, uploader résultats
 * 
 * Tous les choix et validations se font sur cette même page
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/UnifiedAuthContext.jsx';
import { ArrowLeft, Building2, User, Scale, Briefcase, Ruler } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Services
import UnifiedCaseTrackingService from '@/services/UnifiedCaseTrackingService.js';
import WorkflowStatusService from '@/services/WorkflowStatusService';
import ContextualActionsService from '@/services/ContextualActionsService';

// Composants auxiliaires
import {
  DocumentsSection,
  PaymentsSection,
  MessageBubble
} from '@/components/unified/UnifiedCaseTrackingComponents.jsx';

// Modals de sélection
import AgentSelectionModal from '@/components/modals/AgentSelectionModal.jsx';
import GeometreSelectionModal from '@/components/modals/GeometreSelectionModal.jsx';
import NotarySelectionModal from '@/components/modals/NotarySelectionModal.jsx';

// Composants existants
import TimelineTrackerModern from '@/components/purchase/TimelineTrackerModern.jsx';
import AppointmentScheduler from '@/components/purchase/AppointmentScheduler.jsx';
import PurchaseCaseMessaging from '@/components/messaging/PurchaseCaseMessaging.jsx';

// Composants Phase 3 - Paiements
import PaymentModal from '@/components/modals/PaymentModal.jsx';

// Composants Phase 6 - Actions Buyer/Seller
import UserActionButtonsSection from '@/components/shared/UserActionButtonsSection.jsx';
import SignPreliminaryAgreementModal from '@/components/modals/SignPreliminaryAgreementModal.jsx';
import UploadDocumentsModal from '@/components/modals/UploadDocumentsModal.jsx';
import ConfirmActionModal from '@/components/modals/ConfirmActionModal.jsx';

// Configuration des rôles
const ROLE_CONFIG = {
  buyer: {
    label: 'Acheteur',
    icon: User,
    color: 'bg-blue-500'
  },
  seller: {
    label: 'Vendeur',
    icon: Building2,
    color: 'bg-green-500'
  },
  notaire: {
    label: 'Notaire',
    icon: Scale,
    color: 'bg-purple-500'
  },
  agent: {
    label: 'Agent Foncier',
    icon: Briefcase,
    color: 'bg-orange-500',
    isFacultative: true
  },
  geometre: {
    label: 'Géomètre',
    icon: Ruler,
    color: 'bg-cyan-500',
    isFacultative: true
  }
};

// Affichage/statut via WorkflowStatusService

const CaseTrackingUnified = () => {
  // Support both routes: /dossier/:caseId and /cases/:caseNumber
  const params = useParams();
  const caseIdentifier = params.caseId || params.caseNumber; // UUID or case_number
  const navigate = useNavigate();
  const { user } = useAuth();

  // États principaux
  const [caseData, setCaseData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [surveyingMission, setSurveyingMission] = useState(null);
  const [timeline, setTimeline] = useState([]);

  // États des modals
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showGeometreModal, setShowGeometreModal] = useState(false);
  const [showNotaryModal, setShowNotaryModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentRequest, setSelectedPaymentRequest] = useState(null);

  // États Phase 6 - Actions Buyer/Seller
  const [showSignModal, setShowSignModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // États de la messagerie
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Service (singleton déjà instancié)
  const service = UnifiedCaseTrackingService;

  /**
   * Charger les données complètes du dossier
   */
  const loadCaseData = async () => {
    try {
      setLoading(true);
      const data = await service.getCaseWithAllParticipants(caseIdentifier, user.id);
      
      setCaseData(data.purchaseCase);
      setUserRole(data.userRole);
      setPermissions(data.permissions);
  setSurveyingMission(data.surveyingMission || null);

      console.log('✅ Données chargées:', {
        role: data.userRole,
        hasAgent: data.hasAgent,
        hasSurveying: data.hasSurveying,
        participants: Object.keys(data.participants).filter(k => data.participants[k])
      });

      // ✅ NOUVEAU: Charger les événements timeline
      if (data.purchaseCase?.id) {
        console.log('📊 [UNIFIED] Chargement timeline events...');
        const { supabase } = await import('@/lib/supabaseClient');
        const { data: timelineData, error: timelineError } = await supabase
          .from('purchase_case_timeline')
          .select('*')
          .eq('case_id', data.purchaseCase.id)
          .order('created_at', { ascending: true });
        
        if (timelineError) {
          console.error('❌ [UNIFIED] Erreur timeline:', timelineError);
        } else {
          console.log('✅ [UNIFIED] Timeline chargé:', timelineData?.length, 'événements');
          setTimeline(timelineData || []);
        }
      }
    } catch (error) {
      console.error('❌ Erreur chargement dossier:', error);
      toast.error('Impossible de charger le dossier');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Charger au montage
   */
  useEffect(() => {
    if (caseIdentifier && user?.id) {
      loadCaseData();
    }
  }, [caseIdentifier, user?.id]);

  /**
   * Callbacks après sélection agent
   */
  const handleAgentSelected = async (agent) => {
    setShowAgentModal(false);
    await loadCaseData(); // Recharger pour mettre à jour l'interface
    toast.success(`${agent.agency_name} a été assigné à votre dossier`);
  };

  /**
   * Callbacks après sélection géomètre
   */
  const handleGeometreSelected = async (mission) => {
    setShowGeometreModal(false);
    await loadCaseData(); // Recharger pour mettre à jour l'interface
    toast.success('Mission de bornage créée avec succès');
  };

  /**
   * Handlers pour les actions
   */
  const handleChooseAgent = () => {
    setShowAgentModal(true);
  };

  const handleChooseGeometre = () => {
    setShowGeometreModal(true);
  };

  const handleRequestSurveying = () => {
    setShowGeometreModal(true);
  };

  /**
   * Handler pour le paiement (Phase 3)
   */
  const handlePaymentClick = (paymentRequest) => {
    setSelectedPaymentRequest(paymentRequest);
    setShowPaymentModal(true);
  };

  /**
   * Callback après succès paiement
   */
  const handlePaymentSuccess = async () => {
    setShowPaymentModal(false);
    setSelectedPaymentRequest(null);
    await loadCaseData(); // Recharger pour mettre à jour le dossier
    toast.success('Paiement effectué avec succès !');
  };

  /**
   * Handlers Phase 6 - Actions Buyer/Seller
   */
  const handleUserActionClick = (action) => {
    console.log('🎯 [UNIFIED] Action clicked:', action);
    console.log('🎯 [UNIFIED] Action ID:', action.id);
    console.log('🎯 [UNIFIED] Action type:', action);
    
    setCurrentAction(action);

    // Router selon l'ID de l'action
    switch (action.id) {
      case 'select_notary':
        console.log('✅ [UNIFIED] Opening notary selection modal');
        setShowNotaryModal(true);
        break;
        
      case 'upload_identity':
        console.log('✅ [UNIFIED] Opening upload modal (identity)');
        // Enrichir l'action avec les types de documents requis
        setCurrentAction({
          ...action,
          documentTypes: ['identity_card', 'proof_of_address'],
          nextStatus: 'buyer_documents_submitted'
        });
        setShowUploadModal(true);
        break;
        
      case 'upload_title_deed':
        console.log('✅ [UNIFIED] Opening upload modal (title deed)');
        // Enrichir l'action avec les types de documents requis
        setCurrentAction({
          ...action,
          documentTypes: ['title_deed', 'land_certificate', 'tax_receipts'],
          nextStatus: 'seller_documents_submitted'
        });
        setShowUploadModal(true);
        break;
        
      case 'pay_deposit':
      case 'pay_notary_fees':
      case 'pay_balance':
        console.log('✅ [UNIFIED] Opening payment modal');
        const mockPaymentRequest = {
          id: `temp_${Date.now()}`,
          request_type: action.id,
          amount: action.amount || 0,
          description: action.description || action.label,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          caseId: caseData?.id
        };
        setSelectedPaymentRequest(mockPaymentRequest);
        setShowPaymentModal(true);
        break;
        
      case 'review_contract':
      case 'confirm_appointment':
      case 'validate_contract':
        console.log('✅ [UNIFIED] Opening confirm modal');
        setShowConfirmModal(true);
        break;
        
      case 'choose_agent':
      case 'request_surveying':
        console.log('✅ [UNIFIED] Action simple:', action.id);
        toast.info(action.label + ' - Fonctionnalité à implémenter');
        break;
        
      default:
        console.warn('⚠️ [UNIFIED] Action non gérée:', action.id);
        
        // Fallback sur l'ancienne logique
        if (action.requiresSignature || action.action === 'preliminary_agreement') {
          setShowSignModal(true);
        } else if (action.requiresDocuments || action.requiresDocument) {
          setShowUploadModal(true);
        } else if (action.requiresPayment) {
          const mockPaymentRequest = {
            id: `temp_${Date.now()}`,
            request_type: action.action,
            amount: action.amount || 0,
            description: action.label,
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending'
          };
          setSelectedPaymentRequest(mockPaymentRequest);
          setShowPaymentModal(true);
        } else {
          setShowConfirmModal(true);
        }
    }
  };

  const handleUserPaymentClick = (paymentRequest) => {
    setSelectedPaymentRequest(paymentRequest);
    setShowPaymentModal(true);
  };

  const handleUserDocumentUpload = async (documents) => {
    console.log('📎 Documents uploaded:', documents);
    setShowUploadModal(false);
    setCurrentAction(null);
    await loadCaseData();
    toast.success('Documents uploadés avec succès !');
  };

  const handleUserCancelAction = () => {
    setShowSignModal(false);
    setShowUploadModal(false);
    setShowConfirmModal(false);
    setCurrentAction(null);
    toast.info('Action annulée');
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSendingMessage(true);
      // TODO: Intégrer avec purchase_case_messages
      toast.info('Fonctionnalité messagerie à intégrer');
      setNewMessage('');
    } catch (error) {
      toast.error('Erreur envoi message');
    } finally {
      setSendingMessage(false);
    }
  };

  /**
   * Action handlers registry
   * Maps handler names from ContextualActionsService to actual functions
   */
  const actionHandlers = {
    // Optional actions
    onChooseAgent: handleChooseAgent,
    onRequestSurveying: handleRequestSurveying,
    
    // Document uploads (generic - handled by DocumentsSection with docType)
    onUploadBuyerIdentity: () => toast.info('Utilisez l\'onglet Documents pour uploader'),
    onUploadTitleDeed: () => toast.info('Utilisez l\'onglet Documents pour uploader'),
    onUploadSurveyPlan: () => toast.info('Utilisez l\'onglet Documents pour uploader'),
    onUploadCertificate: () => toast.info('Utilisez l\'onglet Documents pour uploader'),
    
    // Payments
    onPayDeposit: async () => {
      try {
        toast.info('Redirection vers paiement acompte...');
        // TODO: Integrate payment gateway
      } catch (error) {
        toast.error('Erreur lors du paiement');
      }
    },
    onPayNotaryFees: async () => {
      try {
        toast.info('Redirection vers paiement frais notaire...');
        // TODO: Integrate payment gateway
      } catch (error) {
        toast.error('Erreur lors du paiement');
      }
    },
    onPayBalance: async () => {
      try {
        toast.info('Redirection vers paiement du solde...');
        // TODO: Integrate payment gateway
      } catch (error) {
        toast.error('Erreur lors du paiement');
      }
    },
    
    // Validations
    onAcceptOffer: async () => {
      try {
        // Update status to seller_acceptance → buyer_verification
        await service.updateCaseStatus(caseData.id, 'buyer_verification');
        toast.success('Offre acceptée');
        await loadCaseData();
      } catch (error) {
        toast.error('Erreur lors de l\'acceptation');
      }
    },
    onValidateContract: async () => {
      try {
        await service.updateCaseStatus(caseData.id, 'appointment_scheduling');
        toast.success('Contrat validé');
        await loadCaseData();
      } catch (error) {
        toast.error('Erreur lors de la validation');
      }
    },
    onVerifyBuyerIdentity: async () => {
      try {
        await service.updateCaseStatus(caseData.id, 'seller_notification');
        toast.success('Identité vérifiée');
        await loadCaseData();
      } catch (error) {
        toast.error('Erreur lors de la vérification');
      }
    },
    onVerifyTitleCadastre: async () => {
      try {
        await service.updateCaseStatus(caseData.id, 'contract_preparation');
        toast.success('Titre vérifié au cadastre');
        await loadCaseData();
      } catch (error) {
        toast.error('Erreur lors de la vérification');
      }
    },
    onGenerateContract: async () => {
      try {
        await service.updateCaseStatus(caseData.id, 'deposit_pending');
        toast.success('Contrat généré');
        await loadCaseData();
      } catch (error) {
        toast.error('Erreur lors de la génération');
      }
    },
    onRegisterDeed: async () => {
      try {
        await service.updateCaseStatus(caseData.id, 'completed');
        toast.success('Acte enregistré - Dossier complété!');
        await loadCaseData();
      } catch (error) {
        toast.error('Erreur lors de l\'enregistrement');
      }
    },
    
    // Appointments
    onConfirmAppointment: async () => {
      try {
        toast.info('Utilisez l\'onglet Rendez-vous pour confirmer');
      } catch (error) {
        toast.error('Erreur');
      }
    },
    onScheduleAppointment: async () => {
      try {
        toast.info('Utilisez l\'onglet Rendez-vous pour planifier');
      } catch (error) {
        toast.error('Erreur');
      }
    },
    onScheduleSiteVisit: async () => {
      try {
        toast.info('Utilisez l\'onglet Rendez-vous pour planifier la visite');
      } catch (error) {
        toast.error('Erreur');
      }
    },
    
    // Review
    onReviewContract: () => {
      toast.info('Consultez l\'onglet Documents pour voir le contrat');
    },
    
    // Agent/Geometre specific
    onFacilitateNegotiation: () => {
      toast.info('Utilisez l\'onglet Messages pour communiquer');
    },
    onTrackCommission: () => {
      toast.info('Voir onglet Paiements pour le suivi');
    },
    onConfirmFeesReceived: async () => {
      try {
        toast.success('Réception des honoraires confirmée');
        await loadCaseData();
      } catch (error) {
        toast.error('Erreur');
      }
    },
    onAcceptMission: async () => {
      try {
        // TODO: Update surveying_missions status
        toast.success('Mission acceptée');
        await loadCaseData();
      } catch (error) {
        toast.error('Erreur');
      }
    },
    onDeclineMission: async () => {
      try {
        // TODO: Update surveying_missions status
        toast.info('Mission déclinée');
        await loadCaseData();
      } catch (error) {
        toast.error('Erreur');
      }
    },
    onCompleteMission: async () => {
      try {
        // TODO: Update surveying_missions status to completed
        toast.success('Mission clôturée');
        await loadCaseData();
      } catch (error) {
        toast.error('Erreur');
      }
    }
  };

  /**
   * Calculer la progression (%)
   */
  const summary = caseData ? WorkflowStatusService.getSummary(caseData) : null;
  const calculateProgress = () => summary?.progressPercentage || 0;

  /**
   * Rendu du loading
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du dossier...</p>
        </div>
      </div>
    );
  }

  /**
   * Rendu si pas de données
   */
  if (!caseData || !userRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Dossier introuvable ou vous n'avez pas accès à ce dossier.
            </p>
            <Button onClick={() => navigate(-1)} className="w-full mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const roleConfig = ROLE_CONFIG[userRole] || ROLE_CONFIG.buyer;
  const RoleIcon = roleConfig.icon;
  const statusInfo = WorkflowStatusService.getStatusInfo(caseData.status || caseData.current_status || 'initiated');

  // Get contextual actions
  const enrichedCaseData = {
    ...caseData,
    hasAgent: caseData.agent_foncier_id !== null,
    hasSurveying: caseData.surveying_mission_id !== null,
    surveyingMission
  };
  const actionsByCategory = ContextualActionsService.getAvailableActions(
    enrichedCaseData,
    userRole,
    permissions
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>

          <Badge className={`${roleConfig.color} text-white`}>
            <RoleIcon className="w-4 h-4 mr-2" />
            Vous êtes {roleConfig.label}
            {roleConfig.isFacultative && (
              <span className="ml-2 text-xs">(Facultatif)</span>
            )}
          </Badge>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Suivi de Dossier #{caseData.case_number}
            </h1>
            <p className="text-muted-foreground">
              Parcelle : {caseData.parcelle?.title || 'Non spécifiée'}
            </p>
          </div>

          <div className="text-right">
            <Badge className={statusInfo.colorClass}>
              {WorkflowStatusService.getLabel(caseData.status || caseData.current_status)}
            </Badge>
            <div className="mt-2">
              <div className="w-48 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Progression : {Math.round(calculateProgress())}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Participants Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Participants du dossier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Acheteur (toujours présent) */}
            <ParticipantCard
              title="Acheteur"
              name={caseData.buyer?.full_name || 'Non défini'}
              icon={User}
              color="text-blue-500"
            />

            {/* Vendeur (toujours présent) */}
            <ParticipantCard
              title="Vendeur"
              name={caseData.seller?.full_name || 'Non défini'}
              icon={Building2}
              color="text-green-500"
            />

            {/* Notaire (toujours présent après assignation) */}
            <ParticipantCard
              title="Notaire"
              name={caseData.notaire?.full_name || 'En attente'}
              icon={Scale}
              color="text-purple-500"
            />

            {/* Agent (facultatif) */}
            {caseData.has_agent && caseData.agent && (
              <ParticipantCard
                title="Agent Foncier"
                name={caseData.agent.full_name}
                icon={Briefcase}
                color="text-orange-500"
                isFacultative
              />
            )}

            {/* Géomètre (facultatif) */}
            {caseData.has_surveying && caseData.geometre && (
              <ParticipantCard
                title="Géomètre"
                name={caseData.geometre.full_name}
                icon={Ruler}
                color="text-cyan-500"
                isFacultative
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section actions Phase 6 - Pour Buyer et Seller */}
      {console.log('🔍 [UNIFIED] Vérification rendu UserActionButtons:', {
        userRole,
        isBuyerOrSeller: userRole === 'buyer' || userRole === 'seller',
        hasCaseData: !!caseData,
        caseId: caseData?.id,
        shouldRender: (userRole === 'buyer' || userRole === 'seller') && caseData?.id
      })}
      {(userRole === 'buyer' || userRole === 'seller') && caseData?.id && (
        <UserActionButtonsSection
          userRole={userRole}
          currentStatus={caseData.status || caseData.current_status}
          caseData={caseData}
          userId={user.id}
          onActionClick={handleUserActionClick}
          onPaymentClick={handleUserPaymentClick}
          onDocumentUpload={handleUserDocumentUpload}
          onCancelClick={handleUserCancelAction}
          loading={actionLoading}
        />
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          {permissions.canViewPayments && (
            <TabsTrigger value="payments">Paiements</TabsTrigger>
          )}
          <TabsTrigger value="appointments">RDV</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          {/* Informations parcelle */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de la parcelle</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Référence</p>
                <p className="font-medium">{caseData.parcelle?.reference || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Prix proposé</p>
                <p className="font-medium">
                  {caseData.proposed_price?.toLocaleString()} FCFA
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Surface</p>
                <p className="font-medium">{caseData.parcelle?.surface || 'N/A'} m²</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Localisation</p>
                <p className="font-medium">{caseData.parcelle?.location || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline */}
        <TabsContent value="timeline">
          <TimelineTrackerModern 
            caseId={caseData?.id || caseIdentifier}
            currentStatus={caseData?.status || 'initiated'}
            timeline={timeline}
            paymentMethod={caseData?.payment_method || 'unknown'}
          />
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents">
          <DocumentsSection
            caseData={caseData}
            userRole={userRole}
            permissions={permissions}
          />
        </TabsContent>

        {/* Messages */}
        <TabsContent value="messages">
          <PurchaseCaseMessaging
            caseId={caseData?.id || caseIdentifier}
            caseNumber={caseData?.case_number}
          />
        </TabsContent>

        {/* Paiements */}
        {permissions.canViewPayments && (
          <TabsContent value="payments">
            <PaymentsSection
              purchaseCase={caseData}
              userRole={userRole}
              hasAgent={caseData?.has_agent}
              hasSurveying={caseData?.has_surveying}
              surveyingMission={surveyingMission}
            />
          </TabsContent>
        )}

        {/* Rendez-vous */}
        <TabsContent value="appointments">
          <AppointmentScheduler caseId={caseData?.id || caseIdentifier} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AgentSelectionModal
        isOpen={showAgentModal}
        onClose={() => setShowAgentModal(false)}
        caseId={caseData?.id || caseIdentifier}
        onAgentSelected={handleAgentSelected}
      />

      <GeometreSelectionModal
        isOpen={showGeometreModal}
        onClose={() => setShowGeometreModal(false)}
        caseId={caseData?.id || caseIdentifier}
        onGeometreSelected={handleGeometreSelected}
      />

      {/* Payment Modal (Phase 3) */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedPaymentRequest(null);
        }}
        paymentRequest={selectedPaymentRequest}
        onSuccess={handlePaymentSuccess}
      />

      {/* Phase 6 Modals - Buyer/Seller Actions */}
      <SignPreliminaryAgreementModal
        isOpen={showSignModal}
        onClose={() => {
          setShowSignModal(false);
          setCurrentAction(null);
        }}
        caseData={caseData}
        userRole={userRole}
        userId={user.id}
        onSuccess={async () => {
          setShowSignModal(false);
          setCurrentAction(null);
          await loadCaseData();
          toast.success('Document signé avec succès !');
        }}
      />

      <UploadDocumentsModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setCurrentAction(null);
        }}
        caseData={caseData}
        documentTypes={currentAction?.documentTypes}
        action={currentAction}
        nextStatus={currentAction?.nextStatus}
        onSuccess={handleUserDocumentUpload}
      />

      <ConfirmActionModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setCurrentAction(null);
        }}
        caseData={caseData}
        action={currentAction}
        userRole={userRole}
        onSuccess={async () => {
          setShowConfirmModal(false);
          setCurrentAction(null);
          await loadCaseData();
          toast.success('Action confirmée avec succès !');
        }}
      />

      {/* Modal sélection notaire */}
      {showNotaryModal && caseData?.id && (
        <NotarySelectionModal
          isOpen={showNotaryModal}
          onClose={() => setShowNotaryModal(false)}
          caseId={caseData.id}
          onNotarySelected={async (notary) => {
            console.log('✅ [UNIFIED] Notaire sélectionné:', notary);
            setShowNotaryModal(false);
            await loadCaseData();
            toast.success(`Notaire ${notary.profile?.full_name || notary.email} sélectionné avec succès !`);
          }}
        />
      )}
    </div>
  );
};

/**
 * Composant ParticipantCard
 */
const ParticipantCard = ({ title, name, icon: Icon, color, isFacultative }) => (
  <div className={`border rounded-lg p-4 ${isFacultative ? 'border-dashed' : ''}`}>
    <div className="flex items-center gap-2 mb-2">
      <Icon className={`w-5 h-5 ${color}`} />
      <p className="text-sm font-medium">{title}</p>
      {isFacultative && (
        <Badge variant="outline" className="text-xs">Facultatif</Badge>
      )}
    </div>
    <p className="text-sm text-muted-foreground truncate">{name}</p>
  </div>
);

export default CaseTrackingUnified;
