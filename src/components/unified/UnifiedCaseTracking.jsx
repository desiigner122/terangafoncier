/**
 * UnifiedCaseTracking.jsx
 * 
 * Composant unifié de suivi de dossier d'achat
 * S'adapte automatiquement selon le rôle de l'utilisateur:
 * - Acheteur (Buyer)
 * - Vendeur (Seller)
 * - Notaire
 * - Agent Foncier (FACULTATIF)
 * - Géomètre (FACULTATIF)
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Users, FileText, MessageSquare, Calendar,
  CreditCard, Clock, CheckCircle, AlertCircle, Building2,
  MapPin, Ruler, Upload, Download, Phone, Mail,
  Star, TrendingUp, Shield, Send, Paperclip
} from 'lucide-react';

// Composants UI
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

// Services
import unifiedCaseTrackingService from '@/services/UnifiedCaseTrackingService';
import { useAuth } from '@/hooks/useAuth';

// Composants spécialisés
import TimelineTrackerModern from '@/components/buyer/TimelineTrackerModern';
import AppointmentScheduler from '@/components/shared/AppointmentScheduler';
import AgentSelectionModal from '@/components/modals/AgentSelectionModal';
import GeometreSelectionModal from '@/components/modals/GeometreSelectionModal';

// Métadonnées des statuts
const STATUS_META = {
  pending: { label: 'En attente', color: 'bg-yellow-500', icon: Clock },
  accepted: { label: 'Acceptée', color: 'bg-blue-500', icon: CheckCircle },
  preliminary_agreement: { label: 'Accord préliminaire', color: 'bg-purple-500', icon: FileText },
  notary_selection: { label: 'Choix notaire', color: 'bg-indigo-500', icon: Building2 },
  notary_assigned: { label: 'Notaire assigné', color: 'bg-green-500', icon: CheckCircle },
  document_audit: { label: 'Vérification documents', color: 'bg-orange-500', icon: FileText },
  contract_preparation: { label: 'Préparation contrat', color: 'bg-cyan-500', icon: FileText },
  contract_draft: { label: 'Projet de contrat', color: 'bg-violet-500', icon: FileText },
  contract_review: { label: 'Relecture contrat', color: 'bg-pink-500', icon: FileText },
  appointment_scheduled: { label: 'RDV planifié', color: 'bg-teal-500', icon: Calendar },
  payment_processing: { label: 'Paiements en cours', color: 'bg-amber-500', icon: CreditCard },
  payment_completed: { label: 'Paiements complétés', color: 'bg-lime-500', icon: CheckCircle },
  signing_process: { label: 'Signature en cours', color: 'bg-emerald-500', icon: FileText },
  property_transfer: { label: 'Transfert propriété', color: 'bg-sky-500', icon: TrendingUp },
  completed: { label: 'Terminé', color: 'bg-green-600', icon: CheckCircle },
  cancelled: { label: 'Annulé', color: 'bg-red-500', icon: AlertCircle }
};

// Icônes par rôle
const ROLE_ICONS = {
  buyer: '👤',
  seller: '🏘️',
  notaire: '⚖️',
  agent: '🏢',
  geometre: '📐'
};

const ROLE_LABELS = {
  buyer: 'Acheteur',
  seller: 'Vendeur',
  notaire: 'Notaire',
  agent: 'Agent Foncier',
  geometre: 'Géomètre'
};

const UnifiedCaseTracking = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // États
  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showGeometreModal, setShowGeometreModal] = useState(false);

  // Charger les données du dossier
  useEffect(() => {
    if (caseId && user) {
      loadCaseData();
    }
  }, [caseId, user]);

  const loadCaseData = async () => {
    try {
      setLoading(true);
      const data = await unifiedCaseTrackingService.getCaseWithAllParticipants(caseId, user.id);
      
      setCaseData(data);
      setUserRole(data.userRole);
      setPermissions(data.permissions);

      toast.success('Dossier chargé');
    } catch (error) {
      console.error('Erreur chargement dossier:', error);
      toast.error(error.message || 'Erreur lors du chargement');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  // Envoyer un message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSendingMessage(true);
      // TODO: Implémenter l'envoi de message
      setNewMessage('');
      toast.success('Message envoyé');
    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setSendingMessage(false);
    }
  };

  // Choisir un agent (ACHETEUR uniquement)
  const handleChooseAgent = () => {
    setShowAgentModal(true);
  };

  // Demander un bornage (ACHETEUR uniquement)
  const handleRequestSurveying = () => {
    setShowGeometreModal(true);
  };

  // Callback après sélection agent
  const handleAgentSelected = (agent) => {
    loadCaseData(); // Recharger les données
    toast.success('Agent assigné avec succès !');
  };

  // Callback après sélection géomètre
  const handleGeometreSelected = (result) => {
    loadCaseData(); // Recharger les données
    toast.success('Mission de bornage demandée !');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement du dossier...</p>
        </div>
      </div>
    );
  }

  if (!caseData || !userRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Accès refusé</h2>
            <p className="text-muted-foreground mb-4">
              Vous n'êtes pas autorisé à voir ce dossier.
            </p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { purchaseCase, participants, profiles, surveyingMission, hasAgent, hasSurveying } = caseData;
  const statusInfo = STATUS_META[purchaseCase.status] || STATUS_META.pending;
  const StatusIcon = statusInfo.icon;

  // Calculer la progression
  const calculateProgress = () => {
    const statuses = Object.keys(STATUS_META);
    const currentIndex = statuses.indexOf(purchaseCase.status);
    return ((currentIndex + 1) / statuses.length) * 100;
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>

          <Badge variant="secondary" className="text-sm">
            {ROLE_ICONS[userRole]} Vous êtes {ROLE_LABELS[userRole]}
          </Badge>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              Dossier d'achat - {purchaseCase.parcelle?.title || 'Parcelle'}
            </h1>
            <p className="text-muted-foreground">
              {purchaseCase.case_number} • Créé le {new Date(purchaseCase.created_at).toLocaleDateString('fr-FR')}
            </p>
          </div>

          <div className="text-right">
            <Badge className={`${statusInfo.color} text-white mb-2`}>
              <StatusIcon className="w-4 h-4 mr-1" />
              {statusInfo.label}
            </Badge>
            <Progress value={calculateProgress()} className="w-48" />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(calculateProgress())}% complété
            </p>
          </div>
        </div>
      </motion.div>

      {/* Participants Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Participants du dossier
            </CardTitle>
            <CardDescription>
              {hasAgent || hasSurveying ? 
                `${Object.values(participants).filter(p => p).length} acteurs impliqués` :
                '3 acteurs principaux (acheteur, vendeur, notaire)'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Acheteur */}
              <ParticipantCard 
                participant={participants.buyer}
                role="buyer"
                profile={null}
                isCurrentUser={userRole === 'buyer'}
              />

              {/* Vendeur */}
              <ParticipantCard 
                participant={participants.seller}
                role="seller"
                profile={null}
                isCurrentUser={userRole === 'seller'}
              />

              {/* Notaire */}
              {participants.notaire && (
                <ParticipantCard 
                  participant={participants.notaire}
                  role="notaire"
                  profile={profiles.notaire}
                  isCurrentUser={userRole === 'notaire'}
                />
              )}

              {/* Agent Foncier - FACULTATIF */}
              {hasAgent && participants.agent && (
                <ParticipantCard 
                  participant={participants.agent}
                  role="agent"
                  profile={profiles.agent}
                  isCurrentUser={userRole === 'agent'}
                  isFacultative
                />
              )}

              {/* Géomètre - FACULTATIF */}
              {hasSurveying && participants.geometre && (
                <ParticipantCard 
                  participant={participants.geometre}
                  role="geometre"
                  profile={profiles.geometre}
                  isCurrentUser={userRole === 'geometre'}
                  isFacultative
                />
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="timeline">Progression</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          {permissions?.canViewPayments && (
            <TabsTrigger value="payments">Paiements</TabsTrigger>
          )}
          <TabsTrigger value="appointments">Rendez-vous</TabsTrigger>
        </TabsList>

        {/* Tab: Vue d'ensemble */}
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Informations parcelle */}
            <PropertyInfoCard parcelle={purchaseCase.parcelle} />

            {/* Actions spécifiques au rôle */}
            <RoleSpecificActions 
              userRole={userRole}
              permissions={permissions}
              purchaseCase={purchaseCase}
              hasAgent={hasAgent}
              hasSurveying={hasSurveying}
              surveyingMission={surveyingMission}
              onChooseAgent={handleChooseAgent}
              onRequestSurveying={handleRequestSurveying}
            />
          </div>
        </TabsContent>

        {/* Tab: Progression */}
        <TabsContent value="timeline">
          <TimelineTrackerModern caseId={caseId} />
        </TabsContent>

        {/* Tab: Documents */}
        <TabsContent value="documents">
          <DocumentsSection 
            caseId={caseId}
            userRole={userRole}
            permissions={permissions}
          />
        </TabsContent>

        {/* Tab: Messages */}
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>
                Conversation entre tous les participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 pr-4 mb-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Aucun message pour le moment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, idx) => (
                      <MessageBubble key={idx} message={msg} currentUserId={user.id} />
                    ))}
                  </div>
                )}
              </ScrollArea>

              <Separator className="my-4" />

              <div className="flex gap-2">
                <Textarea 
                  placeholder="Votre message à tous les participants..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={3}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={sendingMessage || !newMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Paiements */}
        {permissions?.canViewPayments && (
          <TabsContent value="payments">
            <PaymentsSection 
              purchaseCase={purchaseCase}
              userRole={userRole}
              hasAgent={hasAgent}
              hasSurveying={hasSurveying}
              surveyingMission={surveyingMission}
            />
          </TabsContent>
        )}

        {/* Tab: Rendez-vous */}
        <TabsContent value="appointments">
          <AppointmentScheduler caseId={caseId} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AgentSelectionModal
        isOpen={showAgentModal}
        onClose={() => setShowAgentModal(false)}
        caseId={caseId}
        onAgentSelected={handleAgentSelected}
      />

      <GeometreSelectionModal
        isOpen={showGeometreModal}
        onClose={() => setShowGeometreModal(false)}
        caseId={caseId}
        onGeometreSelected={handleGeometreSelected}
      />
    </div>
  );
};

// Composant: Carte participant
const ParticipantCard = ({ participant, role, profile, isCurrentUser, isFacultative }) => {
  if (!participant) return null;

  return (
    <Card className={`${isFacultative ? 'border-dashed' : ''} ${isCurrentUser ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-4 text-center">
        <Avatar className="mx-auto mb-2">
          <AvatarImage src={participant.avatar_url} />
          <AvatarFallback>{ROLE_ICONS[role]}</AvatarFallback>
        </Avatar>
        <p className="font-semibold text-sm mb-1">{participant.full_name}</p>
        <Badge variant="outline" className="mb-2">
          {ROLE_LABELS[role]}
        </Badge>
        {isFacultative && (
          <Badge variant="secondary" className="text-xs mb-2 block">Facultatif</Badge>
        )}
        {isCurrentUser && (
          <Badge variant="default" className="text-xs mb-2 block">Vous</Badge>
        )}
        <div className="space-y-1 text-xs text-muted-foreground">
          {participant.email && (
            <div className="flex items-center justify-center gap-1">
              <Mail className="w-3 h-3" />
              <span className="truncate">{participant.email}</span>
            </div>
          )}
          {participant.phone && (
            <div className="flex items-center justify-center gap-1">
              <Phone className="w-3 h-3" />
              <span>{participant.phone}</span>
            </div>
          )}
        </div>
        {profile && profile.rating > 0 && (
          <div className="flex items-center justify-center gap-1 mt-2">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold">{profile.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({profile.reviews_count})</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Composant: Informations parcelle
const PropertyInfoCard = ({ parcelle }) => {
  if (!parcelle) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Informations Parcelle
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label className="text-muted-foreground">Titre</Label>
          <p className="font-semibold">{parcelle.title}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground">Surface</Label>
            <p className="font-semibold">{parcelle.surface_area} m²</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Prix</Label>
            <p className="font-semibold text-lg">
              {new Intl.NumberFormat('fr-FR').format(parcelle.price)} FCFA
            </p>
          </div>
        </div>
        <div>
          <Label className="text-muted-foreground">Localisation</Label>
          <p className="font-semibold">{parcelle.location}, {parcelle.region}</p>
        </div>
        {parcelle.title_deed_number && (
          <div>
            <Label className="text-muted-foreground">Titre Foncier</Label>
            <p className="font-mono text-sm">{parcelle.title_deed_number}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// À suivre dans le prochain fichier...
export default UnifiedCaseTracking;
