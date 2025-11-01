/**
 * MODERN BUYER CASE TRACKING
 * Complete refactor aligned with seller dashboard UX
 * Timeline, workflow status, participants, fees, documents
 * Real-time updates with schema-aware queries
 * @author Teranga Foncier Team
 * @date October 21, 2025
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import TimelineTrackerModern from '@/components/purchase/TimelineTrackerModern';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  MessageSquare,
  Users,
  Calendar,
  Download,
  Eye,
  MoreVertical,
  Home,
  MapPin,
  Phone,
  Mail,
  User,
  Briefcase,
  Scale,
  Zap,
  TrendingUp,
} from 'lucide-react';

const ModernBuyerCaseTracking = () => {
  const { caseNumber } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // STATE
  const [caseData, setCaseData] = useState(null);
  const [propertyData, setPropertyData] = useState(null);
  const [seller, setSeller] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // WORKFLOW TIMELINE STAGES
  const workflowStages = [
    { key: 'initiated', label: 'Initiée', icon: Zap },
    { key: 'buyer_verification', label: 'Vérification', icon: User },
    { key: 'seller_notification', label: 'Notification', icon: MessageSquare },
    { key: 'preliminary_agreement', label: 'Accord préliminaire', icon: CheckCircle2 },
    { key: 'contract_preparation', label: 'Contrat', icon: FileText },
    { key: 'legal_verification', label: 'Vérification légale', icon: Scale },
    { key: 'document_audit', label: 'Documents', icon: FileText },
    { key: 'property_evaluation', label: 'Évaluation', icon: Home },
    { key: 'notary_appointment', label: 'Notaire', icon: Briefcase },
    { key: 'signing_process', label: 'Signature', icon: CheckCircle2 },
    { key: 'payment_processing', label: 'Paiement', icon: DollarSign },
    { key: 'completed', label: 'Complétée', icon: CheckCircle2 },
  ];

  // LOAD ALL DATA
  useEffect(() => {
    if (user && caseNumber) {
      loadAllData();
    }
  }, [user, caseNumber]);

  const loadAllData = async () => {
    try {
      setLoading(true);

      // 1. Load purchase case
      console.log('📋 [BUYER] Chargement dossier:', caseNumber);
      const { data: purchaseCase, error: caseError } = await supabase
        .from('purchase_cases')
        .select('*')
        .eq('case_number', caseNumber)
        .maybeSingle();

      if (caseError) {
        console.error('❌ [BUYER] Erreur dossier:', caseError);
        toast.error('Impossible de charger le dossier');
        return;
      }

      if (!purchaseCase) {
        toast.error('Dossier non trouvé');
        navigate('/acheteur/mes-achats');
        return;
      }

      setCaseData(purchaseCase);

      // 2. Load property (updated column/table)
      if (purchaseCase.parcel_id) {
        const { data: property } = await supabase
          .from('parcels')
          .select('*')
          .eq('id', purchaseCase.parcel_id)
          .single();
        setPropertyData(property);
      }

      // 3. Load seller
      if (purchaseCase.seller_id) {
        const { data: sellerProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', purchaseCase.seller_id)
          .single();
        setSeller(sellerProfile);
      }

      // 4. Load participants
      if (purchaseCase.id) {
        const { data: parts } = await supabase
          .from('case_participants')
          .select('*, profiles(*)')
          .eq('case_id', purchaseCase.id);
        setParticipants(parts || []);
      }

      // 5. Load documents
      if (purchaseCase.id && purchaseCase.request_id) {
        const { data: docs } = await supabase
          .from('documents_administratifs')
          .select('*')
          .eq('purchase_request_id', purchaseCase.request_id)
          .order('created_at', { ascending: false });
        setDocuments(docs || []);
      }

      // 6. Load messages
      if (purchaseCase.id) {
        const { data: msgs } = await supabase
          .from('purchase_case_messages')
          .select('*')
          .eq('case_id', purchaseCase.id)
          .order('created_at', { ascending: false })
          .limit(50);
        setMessages(msgs || []);
      }

      // 7. Load timeline events (NEW)
      if (purchaseCase.id) {
        console.log('📊 [BUYER] Chargement timeline events...');
        const { data: timelineData, error: timelineError } = await supabase
          .from('purchase_case_timeline')
          .select('*')
          .eq('case_id', purchaseCase.id)
          .order('created_at', { ascending: true });
        
        if (timelineError) {
          console.error('❌ [BUYER] Erreur timeline:', timelineError);
        } else {
          console.log('✅ [BUYER] Timeline chargé:', timelineData?.length, 'événements');
          setTimeline(timelineData || []);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('❌ [BUYER] Erreur chargement:', error);
      toast.error('Erreur lors du chargement du dossier');
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      initiated: { label: 'Initiée', color: 'bg-yellow-100 text-yellow-800' },
      buyer_verification: { label: 'Vérification', color: 'bg-blue-100 text-blue-800' },
      seller_notification: { label: 'Notification', color: 'bg-blue-100 text-blue-800' },
      preliminary_agreement: { label: 'Accord préliminaire', color: 'bg-indigo-100 text-indigo-800' },
      contract_preparation: { label: 'Contrat', color: 'bg-sky-100 text-sky-800' },
      legal_verification: { label: 'Vérification légale', color: 'bg-sky-100 text-sky-800' },
      document_audit: { label: 'Documents', color: 'bg-sky-100 text-sky-800' },
      property_evaluation: { label: 'Évaluation', color: 'bg-sky-100 text-sky-800' },
      notary_appointment: { label: 'Notaire', color: 'bg-blue-100 text-blue-800' },
      signing_process: { label: 'Signature', color: 'bg-blue-100 text-blue-800' },
      payment_processing: { label: 'Paiement', color: 'bg-amber-100 text-amber-800' },
      completed: { label: 'Complétée', color: 'bg-emerald-100 text-emerald-800' },
      cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
    };
    const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getProgressPercentage = () => {
    if (!caseData?.status) return 0;
    
    // Si on a des événements timeline, compter les étapes complétées
    if (timeline && timeline.length > 0) {
      const stages = ['initiated', 'buyer_verification', 'seller_notification', 'negotiation',
        'preliminary_agreement', 'contract_preparation', 'legal_verification', 'document_audit',
        'property_evaluation', 'notary_appointment', 'signing_process', 'payment_processing',
        'property_transfer', 'completed'];
      
      const completedStages = timeline.filter(event => {
        if (event.event_type !== 'status_change') return false;
        const targetStatus = event.metadata?.to_status || event.metadata?.new_status;
        return stages.includes(targetStatus);
      });
      
      const uniqueCompletedStatuses = new Set(
        completedStages.map(evt => evt.metadata?.to_status || evt.metadata?.new_status)
      );
      
      return Math.round((uniqueCompletedStatuses.size / stages.length) * 100);
    }
    
    // Fallback: utiliser workflowStages
    const stageIndex = workflowStages.findIndex(s => s.key === caseData.status);
    return ((stageIndex + 1) / workflowStages.length) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <Clock className="w-8 h-8 text-blue-600" />
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-6">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-800">Dossier non trouvé</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/acheteur/mes-achats')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Suivi Dossier #{caseNumber}</h1>
            <p className="text-gray-600 mt-1">
              {propertyData?.title || 'Propriété'}
            </p>
          </div>
        </div>
        <div className="text-right">
          {getStatusBadge(caseData.status)}
          <p className="text-sm text-gray-600 mt-2">
            Créé le {format(new Date(caseData.created_at), 'dd MMM yyyy', { locale: fr })}
          </p>
        </div>
      </motion.div>

      {/* PROGRESS BAR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Progression du dossier</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={getProgressPercentage()} className="h-2" />
            <p className="text-sm text-gray-600">
              Étape {workflowStages.findIndex(s => s.key === caseData.status) + 1} sur {workflowStages.length}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* TIMELINE - Utilise maintenant TimelineTrackerModern avec événements réels */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Étapes du processus</CardTitle>
          </CardHeader>
          <CardContent>
            <TimelineTrackerModern
              currentStatus={caseData.status}
              timeline={timeline}
              paymentMethod={caseData.payment_method || 'unknown'}
              compact={false}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* TABS SECTION */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="details">Détails</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* PROPERTY INFO */}
              {propertyData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Home className="w-5 h-5" />
                      Propriété
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Titre</p>
                      <p className="font-medium">{propertyData.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Localisation</p>
                      <p className="font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {propertyData.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Surface</p>
                      <p className="font-medium">{propertyData.surface} m²</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Prix</p>
                      <p className="font-bold text-green-600">
                        {propertyData.price?.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* SELLER INFO */}
              {seller && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Vendeur
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Nom</p>
                      <p className="font-medium">
                        {seller.first_name} {seller.last_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {seller.email}
                      </p>
                    </div>
                    {seller.phone && (
                      <div>
                        <p className="text-sm text-gray-600">Téléphone</p>
                        <p className="font-medium flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {seller.phone}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* PARTICIPANTS TAB */}
          <TabsContent value="participants" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Participants au dossier
                </CardTitle>
              </CardHeader>
              <CardContent>
                {participants.length === 0 ? (
                  <p className="text-gray-600">Aucun participant</p>
                ) : (
                  <div className="space-y-3">
                    {participants.map((part) => (
                      <div
                        key={part.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{part.profiles?.first_name} {part.profiles?.last_name}</p>
                          <p className="text-sm text-gray-600">{part.role}</p>
                        </div>
                        <Badge>{part.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* DOCUMENTS TAB */}
          <TabsContent value="documents" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <p className="text-gray-600">Aucun document</p>
                ) : (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium">{doc.file_name}</p>
                            <p className="text-xs text-gray-600">
                              {format(new Date(doc.created_at), 'dd MMM yyyy', { locale: fr })}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* MESSAGES TAB */}
          <TabsContent value="messages" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Historique des messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                {messages.length === 0 ? (
                  <p className="text-gray-600">Aucun message</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {messages.map((msg) => (
                      <div key={msg.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">{msg.sender_name}</p>
                        <p className="text-sm text-gray-700 mt-1">{msg.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {format(new Date(msg.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* DETAILS TAB */}
          <TabsContent value="details" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Informations du dossier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Numéro de dossier</p>
                    <p className="font-medium">{caseData.case_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Statut</p>
                    {getStatusBadge(caseData.status)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Prix d'achat</p>
                    <p className="font-medium">
                      {caseData.purchase_price?.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Méthode de paiement</p>
                    <p className="font-medium">{caseData.payment_method}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date de création</p>
                    <p className="font-medium">
                      {format(new Date(caseData.created_at), 'dd MMM yyyy', { locale: fr })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dernière mise à jour</p>
                    <p className="font-medium">
                      {format(new Date(caseData.updated_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default ModernBuyerCaseTracking;
