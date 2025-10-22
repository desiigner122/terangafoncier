/**
 * MODERN BUYER CASE TRACKING V2
 * Page de suivi dossier complète avec tous les participants
 * - Acheteur, Vendeur, Notaire, Géomètre, Agent foncier
 * - Timeline collaborative
 * - Gestion des documents
 * - Messagerie intégrée
 * - Suivi des paiements
 * @author Teranga Foncier
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { WorkflowActionButton } from '@/components/workflow/WorkflowActionButton';
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
  Send,
  Paperclip,
  Share2,
  AlertTriangle,
  CheckSquare,
  Square,
  Loader,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ModernBuyerCaseTrackingV2 = () => {
  const { caseNumber } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // STATE
  const [caseData, setCaseData] = useState(null);
  const [propertyData, setPropertyData] = useState(null);
  const [participants, setParticipants] = useState({});
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // WORKFLOW STAGES
  const workflowStages = [
    { key: 'initiated', label: 'Initiée', color: 'bg-blue-500' },
    { key: 'buyer_verification', label: 'Vérification', color: 'bg-purple-500' },
    { key: 'seller_notification', label: 'Notification', color: 'bg-orange-500' },
    { key: 'preliminary_agreement', label: 'Accord', color: 'bg-yellow-500' },
    { key: 'contract_preparation', label: 'Contrat', color: 'bg-cyan-500' },
    { key: 'legal_verification', label: 'Légal', color: 'bg-indigo-500' },
    { key: 'document_audit', label: 'Docs', color: 'bg-pink-500' },
    { key: 'property_evaluation', label: 'Évaluation', color: 'bg-green-500' },
    { key: 'notary_appointment', label: 'Notaire', color: 'bg-teal-500' },
    { key: 'signing_process', label: 'Signature', color: 'bg-violet-500' },
    { key: 'payment_processing', label: 'Paiement', color: 'bg-amber-500' },
    { key: 'completed', label: 'Complétée', color: 'bg-green-600' },
  ];

  const currentStageIndex = workflowStages.findIndex(s => s.key === caseData?.status);
  const progress = ((currentStageIndex + 1) / workflowStages.length) * 100;

  // PARTICIPANT ROLES CONFIG
  const participantRoles = [
    { key: 'buyer', label: 'Acheteur', icon: User, color: 'bg-blue-100 text-blue-800' },
    { key: 'seller', label: 'Vendeur', icon: Home, color: 'bg-orange-100 text-orange-800' },
    { key: 'notary', label: 'Notaire', icon: Scale, color: 'bg-purple-100 text-purple-800' },
    { key: 'geometre', label: 'Géomètre', icon: MapPin, color: 'bg-green-100 text-green-800' },
    { key: 'agent', label: 'Agent Foncier', icon: Users, color: 'bg-teal-100 text-teal-800' },
  ];

  // LOAD DATA
  useEffect(() => {
    if (user && caseNumber) {
      loadCaseData();
    }
  }, [user, caseNumber]);

  // Real-time subscription for case updates
  useEffect(() => {
    if (!caseData?.id) return;

    const subscription = supabase
      .channel(`case_${caseData.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'purchase_cases', filter: `id=eq.${caseData.id}` },
        (payload) => {
          console.log('🔄 Case update detected:', payload);
          loadCaseData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [caseData?.id]);

  const loadCaseData = async () => {
    try {
      setLoading(true);

      // Load case
      const { data: purchaseCase, error: caseError } = await supabase
        .from('purchase_cases')
        .select('*')
        .eq('case_number', caseNumber)
        .maybeSingle();

      if (caseError) throw caseError;

      if (!purchaseCase) {
        toast.error('Dossier non trouvé');
        navigate('/acheteur/mes-achats');
        return;
      }

      setCaseData(purchaseCase);

      // Load property
      if (purchaseCase.parcelle_id) {
        const { data: property } = await supabase
          .from('parcels')
          .select('*')
          .eq('id', purchaseCase.parcelle_id)
          .maybeSingle();
        setPropertyData(property);
      }

      // Base participants map
      const participantMap = {
        buyer: null,
        seller: null,
        notary: null,
        geometre: null,
        agent: null,
      };

      // Buyer profile
      if (purchaseCase.buyer_id) {
        const { data: buyerProfile } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, full_name, email, phone, avatar_url')
          .eq('id', purchaseCase.buyer_id)
          .maybeSingle();
        
        // Normalize profile data to have first_name/last_name
        if (buyerProfile && !buyerProfile.first_name && buyerProfile.full_name) {
          const nameParts = (buyerProfile.full_name || '').split(' ');
          buyerProfile.first_name = nameParts[0] || '';
          buyerProfile.last_name = nameParts.slice(1).join(' ') || '';
        }
        
        participantMap.buyer = buyerProfile || null;
      }

      // Seller profile
      if (purchaseCase.seller_id) {
        console.log('🔍 Loading seller profile for:', purchaseCase.seller_id);
        const { data: sellerProfile, error: sellerError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, full_name, email, phone, avatar_url')
          .eq('id', purchaseCase.seller_id)
          .maybeSingle();
        if (sellerError) {
          console.warn('❌ Seller profile error:', sellerError);
        } else {
          console.log('✅ Seller profile loaded:', sellerProfile);
        }
        
        // Normalize profile data
        if (sellerProfile && !sellerProfile.first_name && sellerProfile.full_name) {
          const nameParts = (sellerProfile.full_name || '').split(' ');
          sellerProfile.first_name = nameParts[0] || '';
          sellerProfile.last_name = nameParts.slice(1).join(' ') || '';
        }
        
        participantMap.seller = sellerProfile || null;
      }

      // Additional participants via dedicated table(s)
      const participantSources = [
        {
          table: 'purchase_case_participants',
          select:
            'role, user_id, profiles:user_id(id, first_name, last_name, email, phone, avatar_url)',
        },
        {
          table: 'case_participants',
          select:
            'role, profile_id, profiles:profile_id(id, first_name, last_name, email, phone, avatar_url)',
        },
      ];

      let participantRows = [];
      for (const source of participantSources) {
        const { data, error } = await supabase
          .from(source.table)
          .select(source.select)
          .eq('case_id', purchaseCase.id);

        if (!error) {
          participantRows = data || [];
          break;
        }
      }

      const roleMap = {
        buyer: 'buyer',
        acheteur: 'buyer',
        seller: 'seller',
        vendeur: 'seller',
        notary: 'notary',
        notaire: 'notary',
        geometre: 'geometre',
        surveyor: 'geometre',
        agent: 'agent',
        agent_foncier: 'agent',
        'agent foncier': 'agent',
      };

      participantRows.forEach((row) => {
        const normalizedRole = roleMap[(row.role || '').toLowerCase()];
        if (!normalizedRole) return;
        const profile = row.profiles || null;
        if (profile) {
          participantMap[normalizedRole] = profile;
        }
      });

      setParticipants(participantMap);
      console.log('📊 Participants map set:', {
        buyer: participantMap.buyer?.first_name,
        seller: participantMap.seller?.first_name,
        notary: participantMap.notary?.first_name,
        geometre: participantMap.geometre?.first_name,
        agent: participantMap.agent?.first_name,
      });

      // Load documents with fallback
      let documentsData = [];
      const documentQueries = [
        () =>
          supabase
            .from('purchase_case_documents')
            .select('*')
            .eq('case_id', purchaseCase.id)
            .order('created_at', { ascending: false }),
        () =>
          supabase
            .from('case_documents')
            .select('*')
            .eq('case_id', purchaseCase.id)
            .order('created_at', { ascending: false }),
      ];

      for (const query of documentQueries) {
        const { data, error } = await query();
        if (!error) {
          documentsData = data || [];
          break;
        }
      }
      setDocuments(documentsData);

      // Load messages with fallback
      let messagesData = [];
      const messageQueries = [
        () =>
          supabase
            .from('purchase_case_messages')
            .select('*')
            .eq('case_id', purchaseCase.id)
            .order('created_at', { ascending: true }),
        () =>
          supabase
            .from('case_messages')
            .select('*')
            .eq('case_id', purchaseCase.id)
            .order('created_at', { ascending: true }),
        () =>
          supabase
            .from('conversation_messages')
            .select('*')
            .eq('case_id', purchaseCase.id)
            .order('created_at', { ascending: true }),
      ];

      for (const query of messageQueries) {
        const { data, error } = await query();
        if (!error) {
          messagesData = data || [];
          break;
        }
      }

      if (messagesData.length > 0) {
        const senderField = messagesData[0].sent_by
          ? 'sent_by'
          : messagesData[0].sender_id
          ? 'sender_id'
          : null;

        if (senderField) {
          const senderIds = Array.from(
            new Set(messagesData.map((msg) => msg[senderField]).filter(Boolean))
          );

          if (senderIds.length > 0) {
            const { data: senderProfiles } = await supabase
              .from('profiles')
              .select('id, first_name, last_name, email, avatar_url')
              .in('id', senderIds);

            const senderMap = {};
            senderProfiles?.forEach((profile) => {
              senderMap[profile.id] = profile;
            });

            messagesData = messagesData.map((msg) => {
              const senderId = senderField === 'sent_by' ? msg.sent_by : msg.sender_id;
              return {
                ...msg,
                sender_id: senderId,
                sender: senderMap[senderId] || null,
                content: msg.content || msg.message || msg.text || msg.body || '',
              };
            });
          } else {
            messagesData = messagesData.map((msg) => ({
              ...msg,
              sender_id: senderField === 'sent_by' ? msg.sent_by : msg.sender_id,
              sender: null,
              content: msg.content || msg.message || msg.text || msg.body || '',
            }));
          }
        } else {
          messagesData = messagesData.map((msg) => ({
            ...msg,
            sender_id: msg.sender_id || msg.sent_by || null,
            sender: null,
            content: msg.content || msg.message || msg.text || msg.body || '',
          }));
        }
      }

      setMessages(messagesData);

      // Tasks & payments (not yet available on current schema)
      setTasks([]);
      setPayments([]);

      console.log('✅ Case data loaded');
    } catch (error) {
      console.error('❌ Error loading case:', error);
      toast.error('Erreur lors du chargement du dossier');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !caseData?.id || !user?.id) return;

    try {
      setSendingMessage(true);

      const messageAttempts = [
        {
          table: 'purchase_case_messages',
          payload: {
            case_id: caseData.id,
            sent_by: user.id,
            message: newMessage.trim(),
            created_at: new Date().toISOString(),
          },
        },
        {
          table: 'case_messages',
          payload: {
            case_id: caseData.id,
            sender_id: user.id,
            content: newMessage.trim(),
            created_at: new Date().toISOString(),
          },
        },
        {
          table: 'conversation_messages',
          payload: {
            case_id: caseData.id,
            sender_id: user.id,
            content: newMessage.trim(),
            created_at: new Date().toISOString(),
          },
        },
      ];

      let sent = false;
      let lastError = null;

      for (const attempt of messageAttempts) {
        const { error } = await supabase.from(attempt.table).insert(attempt.payload);
        if (!error) {
          sent = true;
          break;
        }
        lastError = error;
        console.warn(`[BUYER CASE] Impossible d\'insérer le message dans ${attempt.table}`, error);
      }

      if (!sent) {
        throw lastError || new Error('Impossible d\'enregistrer le message');
      }

      setNewMessage('');
      toast.success('Message envoyé');
      loadCaseData();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">Dossier non trouvé</h2>
        <Button onClick={() => navigate('/acheteur/mes-achats')} className="mt-6">
          Retour aux dossiers
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* HEADER */}
      <motion.div
        className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/acheteur/mes-achats')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Dossier #{caseData.case_number}
              </h1>
              <p className="text-slate-600 mt-1">
                {propertyData?.title || 'Propriété'} · {propertyData?.location}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <Badge className="text-lg px-4 py-2">
                {workflowStages.find(s => s.key === caseData.status)?.label}
              </Badge>
              {/* Seller Status Badge - NEW */}
              {caseData.seller_status && (
                <Badge
                  className={`px-3 py-1 text-sm font-medium ${
                    caseData.seller_status === 'accepted'
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : caseData.seller_status === 'declined'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  }`}
                >
                  {caseData.seller_status === 'accepted'
                    ? '✓ Vendeur accepté'
                    : caseData.seller_status === 'declined'
                    ? '✗ Vendeur refusé'
                    : '⏳ En attente du vendeur'}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* PROGRESS BAR */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-900">Progression du dossier</h3>
              <span className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-1 mt-4">
              {workflowStages.map((stage, idx) => (
                <div
                  key={stage.key}
                  className={`h-2 rounded-full transition-all ${
                    idx <= currentStageIndex ? stage.color : 'bg-slate-200'
                  }`}
                  title={stage.label}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* WORKFLOW ACTION BUTTON */}
        <WorkflowActionButton 
          caseData={caseData} 
          userRole="buyer" 
          onActionComplete={() => loadCaseData()}
        />

        {/* TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="tasks">Tâches</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Property Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Propriété
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600">Titre</p>
                    <p className="font-semibold text-slate-900">{propertyData?.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Localisation</p>
                    <p className="font-semibold text-slate-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {propertyData?.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Surface</p>
                    <p className="font-semibold text-slate-900">{propertyData?.surface} m²</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Prix</p>
                    <p className="font-bold text-2xl text-blue-600">
                      {caseData.total_price?.toLocaleString('fr-FR')} CFA
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Dates Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600">Créée le</p>
                    <p className="font-semibold text-slate-900">
                      {format(new Date(caseData.created_at), 'dd MMMM yyyy', { locale: fr })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Modifiée le</p>
                    <p className="font-semibold text-slate-900">
                      {format(new Date(caseData.updated_at), 'dd MMMM yyyy', { locale: fr })}
                    </p>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-slate-600">Durée</p>
                    <p className="font-semibold text-slate-900">
                      {Math.floor(
                        (new Date(caseData.updated_at) - new Date(caseData.created_at)) / (1000 * 60 * 60 * 24)
                      )}{' '}
                      jours
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Statistiques
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600">Documents</p>
                    <p className="font-bold text-2xl text-green-600">{documents.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Messages</p>
                    <p className="font-bold text-2xl text-blue-600">{messages.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Tâches</p>
                    <p className="font-bold text-2xl text-purple-600">{tasks.length}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* PARTICIPANTS TAB */}
          <TabsContent value="participants" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {participantRoles.map((role) => {
                const participant = participants[role.key];
                console.log(`🧑 Rendering ${role.key}:`, participant ? `${participant.first_name} ${participant.last_name}` : 'NOT LOADED');
                return (
                  <Card key={role.key}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <role.icon className="w-5 h-5" />
                        {role.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {participant ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-16 h-16">
                              <AvatarImage src={participant.avatar_url} />
                              <AvatarFallback>
                                {participant.first_name?.charAt(0)}{participant.last_name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-slate-900">
                                {participant.first_name} {participant.last_name}
                              </p>
                              <p className="text-sm text-slate-600">{participant.email}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {participant.phone && (
                              <p className="flex items-center gap-2 text-sm text-slate-600">
                                <Phone className="w-4 h-4" />
                                {participant.phone}
                              </p>
                            )}
                            <div className="flex gap-2 mt-4">
                              <Button variant="outline" size="sm" className="flex-1">
                                <Mail className="w-4 h-4 mr-2" />
                                Email
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Message
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <p className="text-slate-600">Non assigné</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* DOCUMENTS TAB */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documents ({documents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <p className="text-slate-600 text-center py-8">Aucun document</p>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="font-medium text-slate-900">{doc.name}</p>
                            <p className="text-xs text-slate-600">
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

          {/* TASKS TAB */}
          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5" />
                  Tâches ({tasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tasks.length === 0 ? (
                  <p className="text-slate-600 text-center py-8">Aucune tâche</p>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <button className="flex-shrink-0">
                          {task.completed ? (
                            <CheckSquare className="w-5 h-5 text-green-500" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              task.completed ? 'line-through text-slate-500' : 'text-slate-900'
                            }`}
                          >
                            {task.title}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">{task.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-600">
                            {format(new Date(task.due_date), 'dd MMM', { locale: fr })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* MESSAGES TAB */}
          <TabsContent value="messages" className="space-y-6">
            <Card className="flex flex-col h-96">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Messagerie ({messages.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-slate-600 text-center py-8">Aucun message</p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.sender_id === user.id ? 'flex-row-reverse' : ''}`}
                    >
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={msg.sender?.avatar_url} />
                        <AvatarFallback>
                          {msg.sender
                            ? `${msg.sender.first_name?.charAt(0) || ''}${msg.sender.last_name?.charAt(0) || ''}` || 'M'
                            : msg.sender_id === user.id
                            ? 'MOI'
                            : 'TF'}
                        </AvatarFallback>
                      </Avatar>
                      <div className={msg.sender_id === user.id ? 'text-right' : ''}>
                        <p className="text-xs text-slate-600 mb-1">
                          {msg.sender
                            ? `${msg.sender.first_name || ''} ${msg.sender.last_name || ''}`.trim()
                            : msg.sender_id === user.id
                            ? 'Vous'
                            : 'Collaborateur'}
                        </p>
                        <p
                          className={`px-3 py-2 rounded-lg text-sm ${
                            msg.sender_id === user.id
                              ? 'bg-blue-500 text-white rounded-br-none'
                              : 'bg-slate-100 text-slate-900 rounded-bl-none'
                          }`}
                        >
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
              <div className="border-t p-4 space-y-3">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="resize-none h-20"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ModernBuyerCaseTrackingV2;
