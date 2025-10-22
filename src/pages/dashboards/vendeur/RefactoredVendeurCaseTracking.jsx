/**
 * MODERN SELLER CASE TRACKING V2
 * Page de suivi dossier moderne côté vendeur
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
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
import { Textarea } from '@/components/ui/textarea';
import { WorkflowActionButton } from '@/components/workflow/WorkflowActionButton';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Home,
  Loader,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Scale,
  Send,
  TrendingUp,
  User,
} from 'lucide-react';

const workflowStages = [
  { key: 'initiated', label: 'Initiée', color: 'bg-blue-500' },
  { key: 'seller_review', label: 'Révision vendeur', color: 'bg-orange-500' },
  { key: 'buyer_verification', label: 'Vérifications', color: 'bg-purple-500' },
  { key: 'contract_preparation', label: 'Préparation contrat', color: 'bg-cyan-500' },
  { key: 'notary_appointment', label: 'Notaire', color: 'bg-teal-500' },
  { key: 'signing_process', label: 'Signature', color: 'bg-indigo-500' },
  { key: 'payment_processing', label: 'Paiement', color: 'bg-amber-500' },
  { key: 'completed', label: 'Complétée', color: 'bg-green-600' },
];

const participantRoles = [
  { key: 'seller', label: 'Vous (Vendeur)', icon: Home },
  { key: 'buyer', label: 'Acheteur', icon: User },
  { key: 'notary', label: 'Notaire', icon: Scale },
  { key: 'geometre', label: 'Géomètre', icon: MapPin },
  { key: 'agent', label: 'Agent Foncier', icon: MessageSquare },
];

const sellerStatusStyles = {
  accepted: 'bg-green-100 text-green-700 border border-green-200',
  declined: 'bg-red-100 text-red-700 border border-red-200',
  pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  default: 'bg-slate-100 text-slate-700 border border-slate-200',
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '—';
  const numeric = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(numeric)) return '—';
  return numeric.toLocaleString('fr-FR');
};

const RefactoredVendeurCaseTracking = () => {
  const { caseNumber } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [caseData, setCaseData] = useState(null);
  const [propertyData, setPropertyData] = useState(null);
  const [participants, setParticipants] = useState({});
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [decisionLoading, setDecisionLoading] = useState(false);

  const loadCaseData = async () => {
    if (!user?.id || !caseNumber) return;
    try {
      setLoading(true);
      const { data: purchaseCase, error: caseError } = await supabase
        .from('purchase_cases')
        .select('*')
        .eq('case_number', caseNumber)
        .eq('seller_id', user.id)
        .maybeSingle();

      if (caseError) throw caseError;
      if (!purchaseCase) {
        toast.error('Dossier introuvable pour ce vendeur');
        navigate('/vendeur/purchase-requests');
        return;
      }
      setCaseData(purchaseCase);

      if (purchaseCase.parcelle_id) {
        const { data: property } = await supabase
          .from('parcels')
          .select('*')
          .eq('id', purchaseCase.parcelle_id)
          .maybeSingle();
        setPropertyData(property || null);
      }

      const participantMap = { seller: null, buyer: null, notary: null, geometre: null, agent: null };

      if (purchaseCase.seller_id) {
        const { data: sellerProfile } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, phone, avatar_url')
          .eq('id', purchaseCase.seller_id)
          .maybeSingle();
        participantMap.seller = sellerProfile;
      }

      if (purchaseCase.buyer_id) {
        console.log('🔍 Loading buyer profile for:', purchaseCase.buyer_id);
        const { data: buyerProfile, error: buyerError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, phone, avatar_url')
          .eq('id', purchaseCase.buyer_id)
          .maybeSingle();
        if (buyerError) {
          console.warn('❌ Buyer profile error:', buyerError);
        } else {
          console.log('✅ Buyer profile loaded:', buyerProfile);
        }
        participantMap.buyer = buyerProfile;
      }

      const { data: participantRows } = await supabase
        .from('purchase_case_participants')
        .select('role, user_id, profiles:user_id(id, first_name, last_name, email, phone, avatar_url)')
        .eq('case_id', purchaseCase.id);

      if (participantRows) {
        const roleMap = { seller: 'seller', buyer: 'buyer', notaire: 'notary', geometre: 'geometre', 'agent foncier': 'agent' };
        participantRows.forEach(row => {
          const normalized = roleMap[(row.role || '').toLowerCase()];
          if (normalized && row.profiles) {
            participantMap[normalized] = row.profiles;
          }
        });
      }
      setParticipants(participantMap);
      console.log('📊 Vendor participants map set:', {
        seller: participantMap.seller?.first_name,
        buyer: participantMap.buyer?.first_name,
        notary: participantMap.notary?.first_name,
        geometre: participantMap.geometre?.first_name,
        agent: participantMap.agent?.first_name,
      });

      const { data: docsData } = await supabase
        .from('purchase_case_documents')
        .select('*')
        .eq('case_id', purchaseCase.id)
        .order('created_at', { ascending: false });
      setDocuments(docsData || []);

      const { data: msgsData } = await supabase
        .from('purchase_case_messages')
        .select('*')
        .eq('case_id', purchaseCase.id)
        .order('created_at', { ascending: true });
      
      let messagesData = msgsData || [];
      if (messagesData.length > 0) {
        const senderIds = Array.from(new Set(messagesData.map(m => m.sent_by).filter(Boolean)));
        if (senderIds.length > 0) {
          const { data: senderProfiles } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email, avatar_url')
            .in('id', senderIds);
          const senderMap = {};
          senderProfiles?.forEach(p => { senderMap[p.id] = p; });
          messagesData = messagesData.map(m => ({
            ...m,
            sender: senderMap[m.sent_by] || null,
            content: m.message || '',
          }));
        }
      }
      setMessages(messagesData);
      setTasks([]);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement du dossier');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !caseData?.id || !user?.id) return;
    try {
      setSendingMessage(true);
      const { error } = await supabase.from('purchase_case_messages').insert({
        case_id: caseData.id,
        sent_by: user.id,
        message: newMessage.trim(),
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
      setNewMessage('');
      toast.success('Message envoyé');
      loadCaseData();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur envoi message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSellerDecision = async (decision) => {
    if (!caseData?.id || !user?.id) return;
    try {
      setDecisionLoading(true);
      const updatePayload = {
        seller_status: decision === 'accept' ? 'accepted' : 'declined',
        updated_at: new Date().toISOString(),
      };
      if (decision === 'decline') {
        updatePayload.status = 'seller_declined';
      }
      const { error } = await supabase
        .from('purchase_cases')
        .update(updatePayload)
        .eq('id', caseData.id)
        .eq('seller_id', user.id);
      if (error) throw error;
      toast.success(decision === 'accept' ? 'Accepté' : 'Refusé');
      await loadCaseData();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur traitement');
    } finally {
      setDecisionLoading(false);
    }
  };

  useEffect(() => {
    loadCaseData();
  }, [user?.id, caseNumber]);

  useEffect(() => {
    if (!caseData?.id) return;
    const channel = supabase
      .channel(`seller_case_${caseData.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'purchase_cases', filter: `id=eq.${caseData.id}` }, (payload) => {
        console.log('🔔 Real-time update received:', payload);
        loadCaseData();
      })
      .subscribe();
    return () => { channel.unsubscribe(); };
  }, [caseData?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <AlertCircle className="w-14 h-14 text-red-500" />
        <h2 className="text-2xl font-bold text-slate-900">Dossier non trouvé</h2>
        <Button onClick={() => navigate('/vendeur/purchase-requests')}>Retour</Button>
      </div>
    );
  }

  const normalizedSellerStatus = (caseData.seller_status || 'pending').toLowerCase();
  const sellerBadgeClass = sellerStatusStyles[normalizedSellerStatus] || sellerStatusStyles.default;
  const currentStageIndex = workflowStages.findIndex(s => s.key === caseData.status);
  const safeStageIndex = currentStageIndex >= 0 ? currentStageIndex : 0;
  const progress = ((safeStageIndex + 1) / workflowStages.length) * 100;
  const currentStage = workflowStages[safeStageIndex] || workflowStages[0];
  const buyerContact = participants.buyer;

  const isDecisionPending = ['pending', '', null, undefined].includes(normalizedSellerStatus);
  const isDecisionAccepted = normalizedSellerStatus === 'accepted';
  const isDecisionDeclined = normalizedSellerStatus === 'declined';

  console.log('🔔 Seller Decision Status:', {
    raw: caseData.seller_status,
    normalized: normalizedSellerStatus,
    isPending: isDecisionPending,
    isAccepted: isDecisionAccepted,
    isDeclined: isDecisionDeclined,
  });

  const formattedPrice = formatCurrency(caseData.purchase_price ?? propertyData?.price);
  const createdAt = caseData.created_at ? format(new Date(caseData.created_at), 'dd MMMM yyyy', { locale: fr }) : '—';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <motion.div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Button variant="ghost" onClick={() => navigate('/vendeur/purchase-requests')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dossier #{caseData.case_number}</h1>
              <p className="text-slate-600 mt-1">Vue vendeur</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className={sellerBadgeClass}>
                {isDecisionAccepted ? 'Accepté' : isDecisionDeclined ? 'Refusé' : 'En attente'}
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* WORKFLOW ACTION BUTTON */}
        <WorkflowActionButton 
          caseData={caseData} 
          userRole="seller" 
          onActionComplete={() => loadCaseData()}
        />

        {/* OLD ACCEPT/DECLINE BUTTON - Keeping for backward compatibility if seller_status is pending */}
        {isDecisionPending && caseData.status === 'seller_notification' && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-yellow-900">Décision requise (seller_status)</h3>
                <p className="text-sm text-yellow-800">Confirmez ou refusez cette demande</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => handleSellerDecision('accept')} disabled={decisionLoading} className="bg-green-600">
                  Accepter
                </Button>
                <Button onClick={() => handleSellerDecision('decline')} variant="outline" disabled={decisionLoading}>
                  Refuser
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Progression</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-slate-600">Étape: {currentStage.label}</p>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="tasks">Tâches</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Propriété</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><p className="text-slate-600">Titre</p><p className="font-semibold">{propertyData?.title || '—'}</p></div>
                  <div><p className="text-slate-600">Localisation</p><p className="font-semibold">{propertyData?.location || '—'}</p></div>
                  <div><p className="text-slate-600">Prix</p><p className="text-xl font-bold text-blue-600">{formattedPrice} CFA</p></div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Acheteur</CardTitle></CardHeader>
                <CardContent>
                  {buyerContact ? (
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={buyerContact.avatar_url} />
                        <AvatarFallback>{buyerContact.first_name?.[0]}{buyerContact.last_name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{buyerContact.first_name} {buyerContact.last_name}</p>
                        <p className="text-sm text-slate-600">{buyerContact.email}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-600">—</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="participants">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {participantRoles.map(role => {
                const participant = participants[role.key];
                const Icon = role.icon;
                return (
                  <Card key={role.key}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="w-5 h-5" />
                        {role.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {participant ? (
                        <div>
                          <p className="font-semibold">{participant.first_name} {participant.last_name}</p>
                          <p className="text-sm text-slate-600">{participant.email}</p>
                          {participant.phone && <p className="text-sm text-slate-600">{participant.phone}</p>}
                        </div>
                      ) : (
                        <p className="text-slate-600">Non assigné</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader><CardTitle>Documents ({documents.length})</CardTitle></CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <p className="text-slate-600">Aucun document</p>
                ) : (
                  <div className="space-y-2">
                    {documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                        <p className="text-sm">{doc.title || 'Document'}</p>
                        <Button variant="ghost" size="sm">Télécharger</Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader><CardTitle>Tâches</CardTitle></CardHeader>
              <CardContent>
                <p className="text-slate-600">Aucune tâche</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card className="flex flex-col h-96">
              <CardHeader className="border-b">
                <CardTitle>Messagerie ({messages.length})</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-slate-600 text-center">Aucun message</p>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className={`flex gap-3 ${msg.sent_by === user.id ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={msg.sender?.avatar_url} />
                        <AvatarFallback>{msg.sender?.first_name?.[0]}{msg.sender?.last_name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="px-3 py-2 rounded-lg text-sm bg-slate-100">{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
              <div className="border-t p-4 space-y-3">
                <Textarea placeholder="Message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} className="h-20" />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim() || sendingMessage} className="w-full">
                  <Send className="w-4 h-4" /> Envoyer
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RefactoredVendeurCaseTracking;
