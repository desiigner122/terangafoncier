/**
 * Page de suivi de dossier d'achat - Acheteur (Version Ultra-Complète)
 * Avec: Timeline, RDV, Génération contrats, Documents, Messagerie, Paiements
 * Utilise la table purchase_cases avec le vrai workflow (19 statuts)
 * @author Teranga Foncier Team
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Home, User, FileText, MessageSquare, Calendar, DollarSign,
  MapPin, Phone, Mail, Download, Upload, Send, Clock, CheckCircle,
  AlertCircle, Package, Building2, Eye, Edit, Trash2, Plus, X,
  FileCheck, CreditCard, Receipt, Banknote, TrendingUp, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import BankFinancingSection from '@/components/purchase/BankFinancingSection';
import WorkflowStatusService from '@/services/WorkflowStatusService';
import RealtimeNotificationService from '@/services/RealtimeNotificationService';

const ParticulierCaseTrackingModern = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [purchaseCase, setPurchaseCase] = useState(null);
  const [seller, setSeller] = useState(null);
  const [property, setProperty] = useState(null);
  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [history, setHistory] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (user && caseId) {
      loadCaseData();
      setupRealtimeSubscriptions();
    }

    return () => {
      // Cleanup subscriptions
      RealtimeNotificationService.unsubscribeAll();
    };
  }, [user, caseId]);

  const loadCaseData = async () => {
    try {
      setLoading(true);

      // 1. Charger le dossier d'achat depuis purchase_cases
      const { data: caseData, error: caseError } = await supabase
        .from('purchase_cases')
        .select('*')
        .eq('id', caseId)
        .single();

      if (caseError) throw caseError;
      setPurchaseCase(caseData);

      // 2. Charger les infos du vendeur
      if (caseData?.seller_id) {
        const { data: sellerData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', caseData.seller_id)
          .single();
        setSeller(sellerData);
      }

      // 2b. Charger les infos de la propriété
      if (caseData?.parcelle_id) {
        const { data: propertyData } = await supabase
          .from('parcelles')
          .select('*')
          .eq('id', caseData.parcelle_id)
          .single();
        setProperty(propertyData);
      }

      // 3. Charger les messages
      const { data: messagesData } = await supabase
        .from('purchase_case_messages')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });
      setMessages(messagesData || []);

      // 4. Charger les documents
      const { data: docsData } = await supabase
        .from('purchase_case_documents')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });
      setDocuments(docsData || []);

      // 5. Charger les rendez-vous
      const { data: aptsData } = await supabase
        .from('calendar_appointments')
        .select('*')
        .eq('case_id', caseId)
        .order('start_time', { ascending: true });
      setAppointments(aptsData || []);

      // 6. Charger l'historique
      const { data: historyData } = await supabase
        .from('purchase_case_history')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });
      setHistory(historyData || []);

      // 7. Charger les paiements
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });
      setPayments(paymentsData || []);

    } catch (error) {
      console.error('Erreur chargement dossier:', error);
      toast.error('Erreur lors du chargement du dossier');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        case_id: caseId,
        sender_id: user.id,
        message: newMessage.trim(),
        message_type: 'text',
      };

      const { error } = await supabase
        .from('purchase_case_messages')
        .insert([messageData]);

      if (error) throw error;

      setNewMessage('');
      toast.success('Message envoyé');
      loadCaseData();
    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  const setupRealtimeSubscriptions = () => {
    try {
      // Setup Realtime pour le dossier spécifique
      RealtimeNotificationService.setupCaseTracking(caseId, (payload) => {
        console.log('📡 [REALTIME] Mise à jour dossier acheteur:', payload);
        toast.info('Mise à jour du dossier détectée');
        // Rechargement optionnel des données (peut être commenté pour éviter trop de reloads)
        // loadCaseData();
      });

      console.log('✅ Realtime subscriptions initialisées pour l\'acheteur');
    } catch (error) {
      console.error('Erreur setup Realtime:', error);
    }
  };

  const uploadDocument = async (file, documentType) => {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `documents/${caseId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: docData, error: docError } = await supabase
        .from('purchase_case_documents')
        .insert([{
          case_id: caseId,
          uploaded_by: user.id,
          document_type: documentType,
          title: file.name,
          file_url: filePath,
          file_size: file.size,
          file_type: file.type,
          storage_path: filePath,
          status: 'pending',
        }])
        .select()
        .single();

      if (docError) throw docError;

      toast.success('Document téléchargé avec succès');
      loadCaseData();
    } catch (error) {
      console.error('Erreur upload document:', error);
      toast.error('Erreur lors du téléchargement du document');
    }
  };

  const calculateProgress = () => {
    if (purchaseCase?.progress_percentage !== undefined) {
      return purchaseCase.progress_percentage;
    }
    return WorkflowStatusService.calculateProgressFromStatus(purchaseCase?.status || 'initiated');
  };

  const calculatePaymentsProgress = () => {
    if (!payments || payments.length === 0) return 0;
    const paid = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
    const total = purchaseCase?.purchase_price || purchaseCase?.negotiated_price || 1;
    return (paid / total) * 100;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const getStatusColor = (status) => {
    return WorkflowStatusService.getColor(status);
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
        <Button onClick={() => navigate('/acheteur/mes-achats')}>
          Retour à mes achats
        </Button>
      </div>
    );
  }

  const progress = calculateProgress();
  const paymentsProgress = calculatePaymentsProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/acheteur/mes-achats')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à mes achats
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dossier d'achat #{purchaseCase?.case_number || 'N/A'}
              </h1>
              <div className="mt-2">
                <Badge className={cn('mt-2', getStatusColor(purchaseCase?.status))}>
                  {WorkflowStatusService.getLabel(purchaseCase?.status || 'initiated')}
                </Badge>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {formatPrice(purchaseCase?.negotiated_price || purchaseCase?.purchase_price || 0)}
              </div>
              <p className="text-sm text-gray-500">Prix de vente</p>
            </div>
          </div>

          {/* Barre de progression globale */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progression du dossier - Phase {purchaseCase?.phase || 1}</span>
                <span className="text-sm font-bold text-blue-600">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche - Infos principales */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image de la propriété */}
            <Card className="overflow-hidden">
              <div className="w-full h-64 md:h-80 relative bg-gray-100 flex items-center justify-center">
                {property?.images?.[0] ? (
                  <img
                    src={property.images[0]}
                    alt={property?.title || purchaseCase?.case_number}
                    className="w-full h-full object-cover"
                  />
                ) : property?.photo_url ? (
                  <img
                    src={property.photo_url}
                    alt={property?.title || purchaseCase?.case_number}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <Building2 className="w-16 h-16 text-gray-300 mb-2" />
                    <span className="text-gray-400 text-sm">Aucune image disponible</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Infos de la propriété */}
            {property && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Propriété
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Titre</p>
                    <p className="text-lg font-semibold">{property.title || 'Propriété'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Localisation</p>
                      <p className="font-medium">{property.location || property.commune || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Surface</p>
                      <p className="font-medium">{property.surface || property.area || 'N/A'} m²</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Suivi du dossier
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

            {/* Financement Bancaire (si applicable) */}
            <BankFinancingSection
              paymentMethod={purchaseCase?.payment_method}
              financingApproved={purchaseCase?.financing_approved}
              bankName={purchaseCase?.metadata?.bank_name || null}
              loanAmount={purchaseCase?.metadata?.loan_amount || null}
              approvedAmount={purchaseCase?.metadata?.approved_amount || null}
              estimatedDisbursementDate={purchaseCase?.metadata?.estimated_disbursement_date || null}
              conditions={purchaseCase?.metadata?.financing_conditions || []}
            />

            {/* Tabs pour documents, messages, etc */}
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

                  {/* Tab Documents */}
                  <TabsContent value="documents" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Documents du dossier</h3>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Télécharger un document</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Type de document</Label>
                              <Input type="file" onChange={(e) => uploadDocument(e.target.files[0], 'other')} />
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="space-y-3">
                      {documents.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                          <p>Aucun document</p>
                        </div>
                      ) : (
                        documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{doc.title}</p>
                                <p className="text-xs text-gray-500">
                                  {doc.document_type} • {format(new Date(doc.created_at), 'dd MMM yyyy', { locale: fr })}
                                </p>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>

                  {/* Tab Messages */}
                  <TabsContent value="messages" className="space-y-4">
                    <ScrollArea className="h-96 pr-4">
                      <div className="space-y-3">
                        {messages.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>Aucun message</p>
                          </div>
                        ) : (
                          messages.map((msg) => (
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
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                )}
                              >
                                <p className="text-sm">{msg.message}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {format(new Date(msg.created_at), 'HH:mm')}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
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

                  {/* Tab Paiements */}
                  <TabsContent value="payments" className="space-y-4">
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Montant versé</span>
                        <span className="text-sm font-bold text-green-600">
                          {Math.round(paymentsProgress)}%
                        </span>
                      </div>
                      <Progress value={paymentsProgress} className="h-3" />
                    </div>

                    <div className="space-y-3">
                      {payments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-20" />
                          <p>Aucun paiement enregistré</p>
                        </div>
                      ) : (
                        payments.map((payment) => (
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
                        ))
                      )}
                    </div>
                  </TabsContent>

                  {/* Tab Historique */}
                  <TabsContent value="history" className="space-y-3">
                    {history.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>Aucun historique</p>
                      </div>
                    ) : (
                      history.map((event) => (
                        <div key={event.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{event.new_status || event.status}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {format(new Date(event.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Colonne droite - Actions et infos */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <AppointmentScheduler
                  caseId={caseId}
                  userId={user.id}
                  onAppointmentCreated={loadCaseData}
                />

                <ContractGenerator
                  purchaseCase={purchaseCase}
                  buyer={user}
                  seller={seller}
                  onContractGenerated={loadCaseData}
                />

                <Button variant="outline" className="w-full gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Contacter le vendeur
                </Button>

                <Button variant="outline" className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  Télécharger le dossier
                </Button>
              </CardContent>
            </Card>

            {/* Infos vendeur */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vendeur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={seller?.avatar_url} alt={seller?.full_name} />
                    <AvatarFallback>
                      {seller?.full_name?.split(' ')?.map(n => n[0]).join('').toUpperCase() || 'V'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {seller?.full_name || seller?.first_name && seller?.last_name 
                        ? `${seller.first_name} ${seller.last_name}` 
                        : 'Vendeur'}
                    </p>
                    <p className="text-sm text-gray-500">Propriétaire</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    {seller?.email || 'N/A'}
                  </div>
                  {seller?.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      {seller?.phone}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Prochains rendez-vous */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prochains rendez-vous</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointments.filter(a => new Date(a.start_time) > new Date()).slice(0, 3).map((apt) => (
                    <div key={apt.id} className="p-3 bg-blue-50 rounded-lg">
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

export default ParticulierCaseTrackingModern;
