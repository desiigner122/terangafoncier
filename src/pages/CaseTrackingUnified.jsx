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

// Composants auxiliaires
import {
  RoleSpecificActions,
  DocumentsSection,
  PaymentsSection,
  MessageBubble
} from '@/components/unified/UnifiedCaseTrackingComponents.jsx';

// Modals de sélection
import AgentSelectionModal from '@/components/modals/AgentSelectionModal.jsx';
import GeometreSelectionModal from '@/components/modals/GeometreSelectionModal.jsx';

// Composants existants
import TimelineTrackerModern from '@/components/purchase/TimelineTrackerModern.jsx';
import AppointmentScheduler from '@/components/purchase/AppointmentScheduler.jsx';

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

// Métadonnées des statuts
const STATUS_META = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  preliminary_agreement: { label: 'Accord préliminaire', color: 'bg-blue-100 text-blue-800', icon: '🤝' },
  notary_assigned: { label: 'Notaire assigné', color: 'bg-purple-100 text-purple-800', icon: '⚖️' },
  document_audit: { label: 'Audit documents', color: 'bg-indigo-100 text-indigo-800', icon: '📋' },
  payment_completed: { label: 'Paiement complété', color: 'bg-green-100 text-green-800', icon: '💰' },
  contract_draft: { label: 'Contrat rédigé', color: 'bg-cyan-100 text-cyan-800', icon: '📄' },
  property_transfer: { label: 'Transfert propriété', color: 'bg-orange-100 text-orange-800', icon: '🏠' },
  completed: { label: 'Complété', color: 'bg-emerald-100 text-emerald-800', icon: '✅' },
  rejected: { label: 'Rejeté', color: 'bg-red-100 text-red-800', icon: '❌' },
  cancelled: { label: 'Annulé', color: 'bg-gray-100 text-gray-800', icon: '🚫' }
};

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

  // États des modals
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showGeometreModal, setShowGeometreModal] = useState(false);

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

  const handleRequestSurveying = () => {
    setShowGeometreModal(true);
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
   * Calculer la progression (%)
   */
  const calculateProgress = () => {
    if (!caseData) return 0;
    const statuses = ['pending', 'preliminary_agreement', 'notary_assigned', 'document_audit', 
                     'payment_completed', 'contract_draft', 'property_transfer', 'completed'];
    const currentIndex = statuses.indexOf(caseData.status);
    return currentIndex >= 0 ? ((currentIndex + 1) / statuses.length) * 100 : 0;
  };

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
  const statusMeta = STATUS_META[caseData.status] || STATUS_META.pending;

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
            <Badge className={statusMeta.color}>
              <span className="mr-2">{statusMeta.icon}</span>
              {statusMeta.label}
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

          {/* Actions spécifiques au rôle */}
          <Card>
            <CardHeader>
              <CardTitle>Vos actions</CardTitle>
            </CardHeader>
            <CardContent>
              <RoleSpecificActions
                userRole={userRole}
                purchaseCase={caseData}
                permissions={permissions}
                hasAgent={caseData?.has_agent}
                hasSurveying={caseData?.has_surveying}
                surveyingMission={surveyingMission}
                onChooseAgent={handleChooseAgent}
                onRequestSurveying={handleRequestSurveying}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline */}
        <TabsContent value="timeline">
          <TimelineTrackerModern caseId={caseData?.id || caseIdentifier} />
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
          <Card>
            <CardHeader>
              <CardTitle>Messagerie</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Fonctionnalité à intégrer avec purchase_case_messages
              </p>
              {/* TODO: Intégrer composant de messagerie */}
            </CardContent>
          </Card>
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
