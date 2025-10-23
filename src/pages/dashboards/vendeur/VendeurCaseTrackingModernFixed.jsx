/**
 * Page de suivi de dossier d'achat - Vendeur (Version Refondée)
 * Utilise les vrais statuts du workflow et supporte financement bancaire
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

const VendeurCaseTrackingModernFixed = () => {
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

  useEffect(() => {
    if (user && caseNumber) {
      loadCaseData();
      setupRealtimeSubscriptions();
    }

    return () => {
      // Cleanup subscriptions
      RealtimeNotificationService.unsubscribeAll();
    };
  }, [user, caseNumber]);

  const loadCaseData = async () => {
    try {
      setLoading(true);

      // 1. Charger le dossier d'achat (purchase_case) par case_number
      const { data: caseData, error: caseError } = await supabase
        .from('purchase_cases')
        .select('*')
        .eq('case_number', caseNumber)
        .single();

      if (caseError) {
        console.error('❌ Erreur chargement dossier:', caseError);
        toast.error('Dossier introuvable');
        setLoading(false);
        return;
      }

      setPurchaseCase(caseData);

      // 2. Charger la demande d'achat (request) si disponible
      let requestData = null;
      if (caseData?.request_id) {
        const { data: rData, error: requestError } = await supabase
          .from('requests')
          .select('*')
          .eq('id', caseData.request_id)
          .single();

        if (!requestError && rData) {
          requestData = rData;
          setPurchaseRequest(rData);
        }
      }

      // 3. Charger la parcelle (property)
      let propertyData = null;
      if (caseData?.parcel_id) {
        const { data: pData, error: propertyError } = await supabase
          .from('parcels')
          .select('*')
          .eq('id', caseData.parcel_id)
          .single();

        if (!propertyError && pData) {
          propertyData = pData;
          setProperty(pData);
        }
      }

      // 4. Charger le profil de l'acheteur
      if (requestData?.user_id) {
        const { data: buyerData, error: buyerError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', requestData.user_id)
          .single();

        if (!buyerError && buyerData) {
          setBuyer(buyerData);
        }
      }

      // 5. Charger les documents
      try {
        const { data: docsData, error: docsError } = await supabase
          .from('documents_administratifs')
          .select('*')
          .eq('purchase_request_id', caseData.request_id)
          .order('created_at', { ascending: false });

        if (!docsError) {
          setDocuments(docsData || []);
        }
      } catch (error) {
        console.warn('⚠️ Erreur documents:', error);
      }

      // 6. Charger les rendez-vous
      try {
        const { data: aptsData, error: aptsError } = await supabase
          .from('calendar_appointments')
          .select('*')
          .eq('purchase_request_id', caseData.request_id)
          .order('start_time', { ascending: true });

        if (!aptsError) {
          setAppointments(aptsData || []);
        }
      } catch (error) {
        console.warn('⚠️ Erreur rendez-vous:', error);
      }

      // 7. Charger l'historique
      try {
        const { data: historyData, error: historyError } = await supabase
          .from('purchase_case_history')
          .select('*')
          .eq('case_id', caseData.id)
          .order('created_at', { ascending: false });

        if (!historyError) {
          setHistory(historyData || []);
        }
      } catch (error) {
        console.warn('⚠️ Erreur historique:', error);
      }

      // 8. Charger les paiements (si user_id disponible)
      if (requestData?.user_id) {
        try {
          const { data: paymentsData, error: paymentsError } = await supabase
            .from('payments')
            .select('*')
            .eq('user_id', requestData.user_id)
            .order('created_at', { ascending: false });

          if (!paymentsError) {
            setPayments(paymentsData || []);
          }
        } catch (error) {
          console.warn('⚠️ Erreur paiements:', error);
        }
      }

    } catch (error) {
      console.error('❌ Erreur chargement dossier:', error);
      toast.error('Erreur lors du chargement du dossier');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    try {
      // Setup Realtime pour le dossier spécifique
      RealtimeNotificationService.setupCaseTracking(purchaseCase?.id, (payload) => {
        console.log('📡 [REALTIME] Mise à jour dossier vendeur:', payload);
        toast.info('Mise à jour du dossier détectée');
        // Rechargement optionnel des données
        // loadCaseData();
      });

      console.log('✅ Realtime subscriptions initialisées pour le vendeur');
    } catch (error) {
      console.error('Erreur setup Realtime:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        case_id: purchaseCase?.id,
        sent_by: user.id,
        message: newMessage.trim(),
      };

      const { error } = await supabase
        .from('purchase_case_messages')
        .insert([messageData]);

      if (error) throw error;

      setNewMessage('');
      toast.success('Message envoyé');
      loadCaseData();
    } catch (error) {
      console.error('❌ Erreur envoi message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  const uploadDocument = async (file, documentType) => {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `documents/${purchaseCase.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: docData, error: docError } = await supabase
        .from('documents_administratifs')
        .insert([{
          user_id: user.id,
          purchase_request_id: purchaseCase.request_id,
          file_name: file.name,
          title: file.name,
          document_type: documentType,
          file_format: file.type.split('/')[1],
          file_size: `${(file.size / 1024).toFixed(2)} KB`,
          storage_path: filePath,
          status: 'pending',
          uploaded_by: user.id,
        }])
        .select()
        .single();

      if (docError) throw docError;

      toast.success('Document téléchargé avec succès');
      loadCaseData();
    } catch (error) {
      console.error('❌ Erreur upload document:', error);
      toast.error('Erreur lors du téléchargement du document');
    }
  };

  // ✅ CORRECTION: Utiliser le vrai progress_percentage du dossier
  const calculateProgress = () => {
    if (purchaseCase?.progress_percentage !== undefined && purchaseCase?.progress_percentage !== null) {
      return purchaseCase.progress_percentage;
    }
    // Fallback: calculer à partir du statut
    return WorkflowStatusService.calculateProgressFromStatus(purchaseCase?.status || 'initiated');
  };

  const calculatePaymentsProgress = () => {
    if (!payments || payments.length === 0) return 0;
    const paid = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
    const total = purchaseCase?.purchase_price || purchaseCase?.negotiated_price || purchaseCase?.amount || 1;
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (!purchaseCase) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Dossier introuvable</h2>
        <Button onClick={() => navigate('/vendeur/purchase-requests')}>
          Retour aux demandes d'achat
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
            onClick={() => navigate('/vendeur/purchase-requests')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux demandes
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{property?.title || 'Propriété'}</h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {property?.location || 'Localisation non disponible'}
              </p>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600">
                {formatPrice(purchaseCase?.negotiated_price || purchaseCase?.purchase_price || purchaseCase?.amount || 0)}
              </div>
              <p className="text-sm text-gray-500">Montant du dossier</p>
              <Badge className={cn('mt-2', getStatusColor(purchaseCase?.status))}>
                {WorkflowStatusService.getLabel(purchaseCase?.status || 'initiated')}
              </Badge>
            </div>
          </div>

          {/* Barre de progression - Utilise le vrai progress_percentage */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progression du dossier (Phase {purchaseCase?.phase || 1})</span>
                <span className="text-sm font-bold text-purple-600">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche */}
          <div className="lg:col-span-2 space-y-6">
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

            {/* Section Financement Bancaire - Affichée si payment_method='bank_financing' */}
            <BankFinancingSection
              paymentMethod={purchaseCase?.payment_method}
              financingApproved={purchaseCase?.financing_approved}
              bankName={purchaseCase?.metadata?.bank_name || null}
              loanAmount={purchaseCase?.metadata?.loan_amount || null}
              approvedAmount={purchaseCase?.metadata?.approved_amount || null}
              estimatedDisbursementDate={purchaseCase?.metadata?.estimated_disbursement_date || null}
              conditions={purchaseCase?.metadata?.financing_conditions || []}
            />

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
                      Messages ({messages.length})
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

                  {/* Documents */}
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
                              <Label>Fichier</Label>
                              <Input 
                                type="file" 
                                onChange={(e) => e.target.files?.[0] && uploadDocument(e.target.files[0], 'other')} 
                              />
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <ScrollArea className="h-96">
                      <div className="space-y-3 pr-4">
                        {documents.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            Aucun document
                          </div>
                        ) : (
                          documents.map((doc) => (
                            <Card key={doc.id} className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                  <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                                  <div>
                                    <p className="font-medium">{doc.title}</p>
                                    <p className="text-sm text-gray-500">{doc.file_size}</p>
                                  </div>
                                </div>
                                <Badge className={getStatusColor(doc.status)}>
                                  {doc.status}
                                </Badge>
                              </div>
                            </Card>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  {/* Messages */}
                  <TabsContent value="messages" className="space-y-4">
                    <ScrollArea className="h-96 border rounded-lg p-4">
                      <div className="space-y-4 pr-4">
                        {messages.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            Aucun message
                          </div>
                        ) : (
                          messages.map((msg) => (
                            <div key={msg.id} className="flex gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={buyer?.avatar_url} alt={buyer?.full_name} />
                                <AvatarFallback>
                                  {buyer?.full_name?.split(' ')?.map(n => n[0]).join('').toUpperCase() || 'A'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{buyer?.full_name || 'Acheteur'}</p>
                                <p className="text-sm text-gray-700">{msg.content}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {msg.created_at && format(new Date(msg.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>

                    {buyer && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Votre message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <Button onClick={sendMessage} size="sm">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* Paiements */}
                  <TabsContent value="payments" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Progression des paiements</span>
                          <span className="text-sm text-gray-600">{Math.round(paymentsProgress)}%</span>
                        </div>
                        <Progress value={paymentsProgress} className="h-2" />
                      </div>

                      <ScrollArea className="h-80">
                        <div className="space-y-3 pr-4">
                          {payments.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              Aucun paiement
                            </div>
                          ) : (
                            payments.map((payment) => (
                              <Card key={payment.id} className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">{formatPrice(payment.amount)}</p>
                                    <p className="text-sm text-gray-500">
                                      {payment.created_at && format(new Date(payment.created_at), 'dd MMM yyyy', { locale: fr })}
                                    </p>
                                  </div>
                                  <Badge className={getStatusColor(payment.status)}>
                                    {payment.status}
                                  </Badge>
                                </div>
                              </Card>
                            ))
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  {/* Historique */}
                  <TabsContent value="history" className="space-y-4">
                    <ScrollArea className="h-96">
                      <div className="space-y-3 pr-4">
                        {history.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            Aucun historique
                          </div>
                        ) : (
                          history.map((entry) => (
                            <Card key={entry.id} className="p-4">
                              <div className="flex gap-3">
                                <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-sm">{entry.action}</p>
                                  <p className="text-sm text-gray-600">{entry.description}</p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {entry.created_at && format(new Date(entry.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                                  </p>
                                </div>
                              </div>
                            </Card>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Colonne droite - Infos acheteur et actions */}
          <div className="space-y-6">
            {/* Infos acheteur */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acheteur</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {buyer ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={buyer?.avatar_url} alt={buyer?.full_name} />
                        <AvatarFallback>
                          {buyer?.full_name?.split(' ')?.map(n => n[0]).join('').toUpperCase() || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {buyer?.full_name || 'Acheteur'}
                        </p>
                        <p className="text-sm text-gray-500">{buyer?.email}</p>
                      </div>
                    </div>
                    {buyer?.phone && (
                      <Button variant="outline" className="w-full" size="sm">
                        <Phone className="w-4 h-4 mr-2" />
                        {buyer?.phone}
                      </Button>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">Acheteur non disponible</p>
                )}
              </CardContent>
            </Card>

            {/* Infos propriété */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Propriété</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {property ? (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Titre</p>
                      <p className="font-semibold">{property.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Localisation</p>
                      <p className="font-semibold">{property.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Prix initial</p>
                      <p className="font-semibold text-lg">
                        {formatPrice(property.price)}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500">Propriété non disponible</p>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {purchaseCase && (
                  <>
                    <AppointmentScheduler
                      purchaseRequestId={purchaseCase.request_id}
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
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendeurCaseTrackingModernFixed;
