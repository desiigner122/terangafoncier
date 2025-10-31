/**
 * Page de suivi de dossier d'achat - Vendeur (Version Ultra-Complète)
 * Avec: Timeline, RDV, Génération contrats, Validation documents, Paiements
 * @author Teranga Foncier Team
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Home, User, FileText, MessageSquare, Calendar, DollarSign,
  MapPin, Phone, Mail, Download, Check, X, Clock, CheckCircle, AlertCircle,
  Package, Building2, Eye, Plus, Send, Banknote, Receipt, CreditCard, TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import AppointmentScheduler from '@/components/purchase/AppointmentScheduler';
import ContractGenerator from '@/components/purchase/ContractGenerator';
import TimelineTrackerModern from '@/components/purchase/TimelineTrackerModern';
import useRealtimeCaseSync from '@/hooks/useRealtimeCaseSync';
import WorkflowStatusService from '@/services/WorkflowStatusService';

const VendeurCaseTrackingModern = () => {
  const { caseNumber } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [purchaseCase, setPurchaseCase] = useState(null);
  const [purchaseRequest, setPurchaseRequest] = useState(null);
  const [property, setProperty] = useState(null);
  const [buyer, setBuyer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [history, setHistory] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Real-time sync hook for case changes
  useRealtimeCaseSync(purchaseCase?.id, () => loadCaseData());

  useEffect(() => {
    if (user && caseNumber) {
      loadCaseData();
    }
  }, [user, caseNumber]);

  const loadCaseData = async () => {
    try {
      setLoading(true);

      // ✅ CORRECTION 1: Charger d'abord le dossier par case_number
      const { data: caseData, error: caseError } = await supabase
        .from('purchase_cases')
        .select('*')
        .eq('case_number', caseNumber)
        .single();

      if (caseError) {
        console.error('❌ Erreur chargement dossier:', caseError);
        toast.error('Dossier introuvable');
        return;
      }

      setPurchaseCase(caseData);

      // ✅ CORRECTION 2: Charger la demande d'achat en utilisant le request_id
      if (caseData?.request_id) {
        const { data: requestData, error: requestError } = await supabase
          .from('requests')
          .select('*')
          .eq('id', caseData.request_id)
          .single();

        if (requestError) {
          console.warn('⚠️ Erreur chargement demande:', requestError);
        } else {
          setPurchaseRequest(requestData);
        }
      }

      // ✅ CORRECTION 3: Charger la parcelle (property) en utilisant parcel_id
      if (caseData?.parcel_id) {
        const { data: propertyData, error: propertyError } = await supabase
          .from('parcels')
          .select('*')
          .eq('id', caseData.parcel_id)
          .single();

        if (propertyError) {
          console.warn('⚠️ Erreur chargement parcelle:', propertyError);
        } else {
          setProperty(propertyData);
        }
      }

      // ✅ CORRECTION 4: Charger le profil de l'acheteur
      if (purchaseRequest?.user_id) {
        const { data: buyerData, error: buyerError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', purchaseRequest.user_id)
          .single();

        if (buyerError) {
          console.warn('⚠️ Erreur chargement acheteur:', buyerError);
        } else {
          setBuyer(buyerData);
        }
      }

      // ✅ CORRECTION 5: Charger documents avec try-catch
      try {
        const { data: docsData, error: docsError } = await supabase
          .from('documents_administratifs')
          .select('*')
          .eq('purchase_request_id', caseData.request_id)
          .order('created_at', { ascending: false });

        if (docsError && !['PGRST205', '42P01'].includes(docsError.code)) {
          console.warn('⚠️ Erreur documents:', docsError);
        }
        setDocuments(docsData || []);
      } catch (error) {
        console.warn('⚠️ Erreur chargement documents:', error);
        setDocuments([]);
      }

      // ✅ CORRECTION 6: Charger rendez-vous avec try-catch
      try {
        const { data: aptsData, error: aptsError } = await supabase
          .from('calendar_appointments')
          .select('*')
          .eq('purchase_request_id', caseData.request_id)
          .order('start_time', { ascending: true });

        if (aptsError && !['PGRST205', '42P01'].includes(aptsError.code)) {
          console.warn('⚠️ Erreur rendez-vous:', aptsError);
        }
        setAppointments(aptsData || []);
      } catch (error) {
        console.warn('⚠️ Erreur chargement rendez-vous:', error);
        setAppointments([]);
      }

      // ✅ CORRECTION 7: Charger historique avec try-catch
      try {
        const { data: historyData, error: historyError } = await supabase
          .from('purchase_case_history')
          .select('*')
          .eq('case_id', caseData.id)
          .order('created_at', { ascending: false });

        if (historyError && !['PGRST205', '42P01'].includes(historyError.code)) {
          console.warn('⚠️ Erreur historique:', historyError);
        }
        setHistory(historyData || []);
      } catch (error) {
        console.warn('⚠️ Erreur chargement historique:', error);
        setHistory([]);
      }

      // ✅ CORRECTION 8: Charger paiements avec try-catch
      try {
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('payments')
          .select('*')
          .eq('user_id', purchaseRequest?.user_id)
          .order('created_at', { ascending: false });

        if (paymentsError && !['PGRST205', '42P01'].includes(paymentsError.code)) {
          console.warn('⚠️ Erreur paiements:', paymentsError);
        }
        setPayments(paymentsData || []);
      } catch (error) {
        console.warn('⚠️ Erreur chargement paiements:', error);
        setPayments([]);
      }

    } catch (error) {
      console.error('❌ Erreur chargement dossier:', error);
      toast.error('Erreur lors du chargement du dossier');
    } finally {
      setLoading(false);
    }
  };

  const acceptOffer = async () => {
    try {
      // ✅ CORRECTION: Update purchase_cases table instead of purchase_requests
      const { error } = await supabase
        .from('purchase_cases')
        .update({ 
          status: 'accepted',
          seller_status: 'accepted',
          updated_at: new Date().toISOString(),
        })
        .eq('id', purchaseCase.id);

      if (error) throw error;

      toast.success('Offre acceptée avec succès');
      loadCaseData();
    } catch (error) {
      console.error('❌ Erreur acceptation:', error);
      toast.error('Erreur lors de l\'acceptation de l\'offre');
    }
  };

  const rejectOffer = async () => {
    try {
      // ✅ CORRECTION: Update purchase_cases table instead of purchase_requests
      const { error } = await supabase
        .from('purchase_cases')
        .update({ 
          status: 'rejected',
          seller_status: 'rejected',
          updated_at: new Date().toISOString(),
        })
        .eq('id', purchaseCase.id);

      if (error) throw error;

      toast.success('Offre rejetée');
      loadCaseData();
    } catch (error) {
      console.error('❌ Erreur rejet:', error);
      toast.error('Erreur lors du rejet de l\'offre');
    }
  };

  const validateDocument = async (docId, approved) => {
    try {
      const { error } = await supabase
        .from('documents_administratifs')
        .update({ 
          status: approved ? 'approved' : 'rejected',
          reviewed_by: user.id,
          review_notes: approved ? 'Document approuvé' : 'Document rejeté',
        })
        .eq('id', docId);

      if (error && !['PGRST205', '42P01'].includes(error.code)) {
        throw error;
      }

      toast.success(approved ? 'Document approuvé' : 'Document rejeté');
      loadCaseData();
    } catch (error) {
      console.error('❌ Erreur validation document:', error);
      toast.error('Erreur lors de la validation');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      // ✅ CORRECTION: Use case_id instead of purchase_request_id
      const messageData = {
        case_id: purchaseCase?.id,
        sender_id: user.id,
        receiver_id: buyer?.id,
        content: newMessage.trim(),
        status: 'sent',
      };

      const { error } = await supabase
        .from('messages')
        .insert([messageData]);

      if (error && !['PGRST205', '42P01'].includes(error.code)) {
        throw error;
      }

      setNewMessage('');
      toast.success('Message envoyé');
      loadCaseData();
    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  const calculateProgress = () => {
    // Utiliser le workflow unifié basé sur WorkflowStatusService
    const currentStatus = (purchaseCase?.status || purchaseCase?.workflow_stage || purchaseRequest?.workflow_stage || 'initiated');
    const order = WorkflowStatusService.chronologicalOrder || [];
    const idx = order.indexOf(WorkflowStatusService.normalizeStatus ? WorkflowStatusService.normalizeStatus(currentStatus) : currentStatus);
    if (idx === -1) return 0;
    return Math.round(((idx + 1) / order.length) * 100);
  };

  const calculatePaymentsProgress = () => {
    if (!payments || payments.length === 0) return 0;
    const paid = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
    const total = purchaseCase?.offered_price || purchaseCase?.amount || purchaseRequest?.offered_price || 1;
    return (paid / total) * 100;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      under_review: 'bg-blue-100 text-blue-800',
      completed: 'bg-emerald-100 text-emerald-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!purchaseCase) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Dossier introuvable</h2>
        <Button onClick={() => navigate('/vendeur/overview')}>
          Retour au tableau de bord
        </Button>
      </div>
    );
  }

  const progress = calculateProgress();
  const paymentsProgress = calculatePaymentsProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/vendeur/overview')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au tableau de bord
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{property?.title}</h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {property?.location}
              </p>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600">
                {formatPrice(purchaseCase?.offered_price || purchaseCase?.amount || 0)}
              </div>
              <p className="text-sm text-gray-500">Offre de l'acheteur</p>
              <p className="text-xs text-gray-400 mt-1">
                Prix initial: {formatPrice(property?.price)}
              </p>
            </div>
          </div>

          {/* Barre de progression */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progression de la vente</span>
                <span className="text-sm font-bold text-purple-600">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </CardContent>
          </Card>

          {/* Actions si offre en attente */}
          {(purchaseCase?.status === 'pending' || purchaseCase?.seller_status === 'pending') && (
            <Card className="mt-4 border-yellow-300 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Offre en attente de votre décision</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      L'acheteur propose {formatPrice(purchaseCase?.offered_price || purchaseCase?.amount || 0)} pour cette propriété
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={rejectOffer} variant="outline" className="gap-2">
                      <X className="w-4 h-4" />
                      Refuser
                    </Button>
                    <Button onClick={acceptOffer} className="gap-2 bg-green-600 hover:bg-green-700">
                      <Check className="w-4 h-4" />
                      Accepter l'offre
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-3 gap-6">
          {/* Colonne gauche */}
          <div className="col-span-2 space-y-6">
            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Suivi de la vente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TimelineTrackerModern
                  currentStatus={purchaseCase?.status || 'initiated'}
                  paymentMethod={purchaseCase?.payment_method || 'one_time'}
                  financingApproved={purchaseCase?.financing_approved || false}
                  completedStages={WorkflowStatusService.getCompletedStages(purchaseCase?.status || 'initiated')}
                  history={history}
                />
              </CardContent>
            </Card>

            {/* Tabs */}
            <Card>
              <CardContent className="pt-6">
                <Tabs defaultValue="documents">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="documents">
                      <FileText className="w-4 h-4 mr-2" />
                      Documents
                    </TabsTrigger>
                    <TabsTrigger value="messages">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Messages
                    </TabsTrigger>
                    <TabsTrigger value="payments">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Paiements
                    </TabsTrigger>
                    <TabsTrigger value="history">
                      <Clock className="w-4 h-4 mr-2" />
                      Historique
                    </TabsTrigger>
                  </TabsList>

                  {/* Documents avec validation */}
                  <TabsContent value="documents" className="space-y-4">
                    <h3 className="font-semibold">Documents à valider</h3>
                    <div className="space-y-3">
                      {documents.filter(d => d.status === 'pending' || d.status === 'under_review').length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                          <p>Aucun document en attente de validation</p>
                        </div>
                      ) : (
                        documents
                          .filter(d => d.status === 'pending' || d.status === 'under_review')
                          .map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{doc.title}</p>
                                  <p className="text-xs text-gray-500">
                                    {format(new Date(doc.created_at), 'dd MMM yyyy', { locale: fr })}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" onClick={() => validateDocument(doc.id, false)}>
                                  <X className="w-4 h-4 mr-1" />
                                  Rejeter
                                </Button>
                                <Button size="sm" onClick={() => validateDocument(doc.id, true)}>
                                  <Check className="w-4 h-4 mr-1" />
                                  Approuver
                                </Button>
                              </div>
                            </div>
                          ))
                      )}
                    </div>

                    <h3 className="font-semibold mt-6">Tous les documents</h3>
                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{doc.title}</p>
                              <p className="text-xs text-gray-500">
                                {format(new Date(doc.created_at), 'dd MMM yyyy', { locale: fr })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(doc.status)}>
                              {doc.status}
                            </Badge>
                            <Button size="sm" variant="ghost">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Messages */}
                  <TabsContent value="messages" className="space-y-4">
                    <ScrollArea className="h-96 pr-4">
                      <div className="space-y-3">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={cn(
                              'flex',
                              msg.sender_id === user.id ? 'justify-end' : 'justify-start'
                            )}
                          >
                            <div
                              className={cn(
                                'max-w-md rounded-2xl px-4 py-2',
                                msg.sender_id === user.id
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              )}
                            >
                              <p className="text-sm">{msg.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {format(new Date(msg.created_at), 'HH:mm')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    <div className="flex gap-2 pt-4 border-t">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Écrire un message..."
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      />
                      <Button onClick={sendMessage}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Paiements */}
                  <TabsContent value="payments" className="space-y-4">
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Paiements reçus</span>
                        <span className="text-sm font-bold text-green-600">
                          {Math.round(paymentsProgress)}%
                        </span>
                      </div>
                      <Progress value={paymentsProgress} className="h-3" />
                    </div>

                    <div className="space-y-3">
                      {payments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                              <Banknote className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{payment.description}</p>
                              <p className="text-xs text-gray-500">
                                {format(new Date(payment.created_at), 'dd MMM yyyy', { locale: fr })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">{formatPrice(payment.amount)}</p>
                            <Badge className={getStatusColor(payment.status)}>
                              {payment.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Historique */}
                  <TabsContent value="history" className="space-y-3">
                    {history.map((event) => (
                      <div key={event.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{event.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {format(new Date(event.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Colonne droite */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <AppointmentScheduler
                  purchaseRequestId={purchaseCase?.id}
                  userId={user.id}
                  onAppointmentCreated={loadCaseData}
                />

                <ContractGenerator
                  purchaseRequest={purchaseRequest}
                  buyer={buyer}
                  seller={user}
                  property={property}
                  onContractGenerated={loadCaseData}
                />

                <Button variant="outline" className="w-full gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Contacter l'acheteur
                </Button>
              </CardContent>
            </Card>

            {/* Infos acheteur */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acheteur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={buyer?.avatar_url} />
                    <AvatarFallback>
                      {buyer?.first_name?.[0]}{buyer?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {buyer?.first_name} {buyer?.last_name}
                    </p>
                    <p className="text-sm text-gray-500">Acquéreur</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    {buyer?.email}
                  </div>
                  {buyer?.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      {buyer?.phone}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Rendez-vous */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prochains rendez-vous</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointments.filter(a => new Date(a.start_time) > new Date()).slice(0, 3).map((apt) => (
                    <div key={apt.id} className="p-3 bg-purple-50 rounded-lg">
                      <p className="font-medium text-sm">{apt.title}</p>
                      <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(apt.start_time), 'dd MMM yyyy à HH:mm', { locale: fr })}
                      </p>
                    </div>
                  ))}
                  {appointments.filter(a => new Date(a.start_time) > new Date()).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Aucun rendez-vous planifié
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendeurCaseTrackingModern;
