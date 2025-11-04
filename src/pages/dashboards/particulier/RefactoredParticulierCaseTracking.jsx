/**
 * REFACTORED - Complete Case Tracking for Buyers
 * New feature-rich interface with timeline, participants, fees, tasks, documents
 * Real-time updates and full workflow management
 * @author Teranga Foncier Team
 * @date October 17, 2025
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import AdvancedCaseTrackingService from '@/services/AdvancedCaseTrackingService';
import { RealtimeSyncService } from '@/services/RealtimeSyncService';
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
  Upload,
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
} from 'lucide-react';

const RefactoredParticulierCaseTracking = () => {
  const { caseNumber } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // STATE
  const [caseData, setCaseData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [fees, setFees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [totalFees, setTotalFees] = useState(0);

  // LOAD DATA
  useEffect(() => {
    let unsubscribe;
    
    if (user && caseNumber) {
      // Load data first, then subscribe
      loadAllData().then((caseId) => {
        // Subscribe AFTER data is loaded and we have the caseId
        if (caseId) {
          unsubscribe = RealtimeSyncService.subscribeToCaseUpdates(
            caseNumber,
            () => {
              console.log('🔄 [BUYER] Case updated, reloading...');
              loadAllData();
            }
          );
        }
      });
    }
    
    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, caseNumber]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      console.log('📁 [BUYER] Loading case:', caseNumber);

      // Get case
      const { data: cData } = await supabase
        .from('purchase_cases')
        .select('*')
        .eq('case_number', caseNumber)
        .eq('buyer_id', user.id)
        .single();

      if (!cData) throw new Error('Case not found');
      console.log('✅ [BUYER] Case data retrieved:', cData.status);
      setCaseData(cData);

      // Load all related data
      const summary = await AdvancedCaseTrackingService.getCompleteCaseSummary(cData.id);
      
      setParticipants(summary.participants || []);
      setFees(summary.fees || []);
      setTasks(summary.tasks || []);
      setDocuments(summary.documents || []);
      setTimeline(summary.timeline || []);
      setTotalFees(summary.total_fees || 0);

      console.log('✅ [BUYER] Case data loaded successfully');
      return cData.id; // Return caseId for Realtime subscription
    } catch (error) {
      console.error('❌ [BUYER] Error loading case:', error);
      toast.error('Impossible de charger le dossier');
      navigate(-1);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // WORKFLOW PROGRESS
  const getWorkflowProgress = () => {
    const statuses = ['initiated', 'buyer_verification', 'seller_notification', 'negotiation', 'preliminary_agreement', 'contract_preparation', 'legal_verification', 'document_audit', 'property_evaluation', 'notary_appointment', 'signing_process', 'payment_processing', 'property_transfer', 'completed'];
    const currentIndex = statuses.indexOf(caseData?.status || 'initiated');
    return ((currentIndex + 1) / statuses.length) * 100;
  };

  // RENDER FUNCTIONS
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin">
          <Zap className="w-12 h-12 text-blue-600" />
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
        <p className="text-lg font-semibold">Dossier non trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* HEADER */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Retour
        </Button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Dossier #{caseNumber}
            </h1>
            <p className="text-slate-600">
              Suivi complet de votre transaction immobilière
            </p>
          </div>
          
          <Badge 
            className={`text-lg px-4 py-2 ${
              caseData?.status === 'completed' ? 'bg-green-500' :
              caseData?.status === 'cancelled' ? 'bg-red-500' :
              'bg-blue-500'
            }`}
          >
            {caseData?.status?.replace(/_/g, ' ').toUpperCase()}
          </Badge>
        </div>
      </motion.div>

      {/* PROGRESS BAR */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-slate-700">Progression du dossier</h3>
            <span className="text-sm text-slate-600">{Math.round(getWorkflowProgress())}%</span>
          </div>
          <Progress value={getWorkflowProgress()} className="h-3" />
        </div>
      </motion.div>

      {/* MAIN TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white border-b">
          <TabsTrigger value="overview" className="gap-2">
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Vue Générale</span>
          </TabsTrigger>
          <TabsTrigger value="participants" className="gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Intervenants</span>
            <Badge variant="secondary" className="ml-1">{participants.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Documents</span>
            <Badge variant="secondary" className="ml-1">{documents.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="fees" className="gap-2">
            <DollarSign className="w-4 h-4" />
            <span className="hidden sm:inline">Frais</span>
            <Badge variant="secondary" className="ml-1">{fees.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-2">
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Historique</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB: OVERVIEW */}
        <TabsContent value="overview" className="space-y-6">
          <OverviewTab 
            caseData={caseData}
            participants={participants}
            fees={fees}
            tasks={tasks}
            totalFees={totalFees}
          />
        </TabsContent>

        {/* TAB: PARTICIPANTS */}
        <TabsContent value="participants" className="space-y-6">
          <ParticipantsTab participants={participants} />
        </TabsContent>

        {/* TAB: DOCUMENTS */}
        <TabsContent value="documents" className="space-y-6">
          <DocumentsTab documents={documents} caseId={caseData.id} />
        </TabsContent>

        {/* TAB: FEES */}
        <TabsContent value="fees" className="space-y-6">
          <FeesTab fees={fees} totalFees={totalFees} />
        </TabsContent>

        {/* TAB: TIMELINE */}
        <TabsContent value="timeline" className="space-y-6">
          <TimelineTab timeline={timeline} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// ====================================================
// SUB-COMPONENTS
// ====================================================

/**
 * Overview Tab - Quick summary
 */
const OverviewTab = ({ caseData, participants, fees, tasks, totalFees }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* PROPERTY INFO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-600" />
              Bien immobilier
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-slate-600">Référence</p>
              <p className="font-semibold">{caseData?.parcelle_id?.slice(0, 8)}...</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Localisation</p>
              <p className="font-semibold">{caseData?.location || 'Non spécifiée'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Prix</p>
              <p className="font-semibold text-green-600">{caseData?.agreed_price?.toLocaleString()} CFA</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* PARTICIPANTS QUICK VIEW */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Intervenants ({participants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {participants.slice(0, 4).map(p => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium capitalize">{p.role}</span>
                  <Badge variant={p.status === 'accepted' ? 'default' : 'outline'}>
                    {p.status}
                  </Badge>
                </div>
              ))}
              {participants.length > 4 && (
                <p className="text-sm text-slate-500 pt-2">
                  +{participants.length - 4} autres
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* FINANCIAL SUMMARY */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Frais totaux
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-slate-600">Montant total</p>
              <p className="text-2xl font-bold text-green-600">
                {totalFees.toLocaleString()} CFA
              </p>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm text-slate-600">Statut</p>
              <p className="font-semibold">
                {fees.filter(f => f.status === 'paid').length}/{fees.length} payés
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* TASKS */}
      <motion.div
        className="md:col-span-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-orange-600" />
              Tâches en cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.filter(t => t.status !== 'completed').length > 0 ? (
                tasks
                  .filter(t => t.status !== 'completed')
                  .slice(0, 5)
                  .map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-slate-600">{task.description}</p>
                      </div>
                      <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                        {task.priority}
                      </Badge>
                    </div>
                  ))
              ) : (
                <p className="text-slate-600">Aucune tâche en attente</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

/**
 * Participants Tab
 */
const ParticipantsTab = ({ participants }) => {
  const roleColors = {
    buyer: 'bg-blue-100 text-blue-900',
    seller: 'bg-red-100 text-red-900',
    notary: 'bg-purple-100 text-purple-900',
    surveyor: 'bg-green-100 text-green-900',
    agent: 'bg-yellow-100 text-yellow-900',
    lawyer: 'bg-indigo-100 text-indigo-900',
  };

  const roleIcons = {
    buyer: User,
    seller: Home,
    notary: FileText,
    surveyor: MapPin,
    agent: Briefcase,
    lawyer: Scale,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {participants.map((participant, index) => {
        const Icon = roleIcons[participant.role] || User;
        return (
          <motion.div
            key={participant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={roleColors[participant.role]}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6" />
                  <div className="flex-1">
                    <CardTitle className="text-lg capitalize">
                      {participant.role}
                    </CardTitle>
                    <CardDescription className={roleColors[participant.role]}>
                      {participant.full_name || 'Non spécifié'}
                    </CardDescription>
                  </div>
                  <Badge>{participant.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {participant.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <p className="text-sm">{participant.email}</p>
                  </div>
                )}
                {participant.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <p className="text-sm">{participant.phone}</p>
                  </div>
                )}
                {participant.joined_at && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <p>Rejoint le {new Date(participant.joined_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

/**
 * Documents Tab
 */
const DocumentsTab = ({ documents, caseId }) => {
  const documentTypeLabels = {
    identity: 'Pièce d\'identité',
    income_proof: 'Justificatif de revenus',
    bank_statement: 'Relevé bancaire',
    land_certificate: 'Certificat foncier',
    title_deed: 'Acte de propriété',
    tax_clearance: 'Quittance fiscale',
    survey_report: 'Rapport de géomètre',
    notary_deed: 'Acte notarié',
    contract: 'Contrat de vente',
    payment_proof: 'Preuve de paiement',
    other: 'Autre document',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Documents ({documents.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.length > 0 ? (
            documents.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
              >
                <div className="flex-1">
                  <p className="font-medium">{doc.title}</p>
                  <p className="text-sm text-slate-600">
                    {documentTypeLabels[doc.document_type]}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {doc.is_verified && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                  <Badge>{doc.status}</Badge>
                  {doc.file_url && (
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-slate-600 text-center py-8">
              Aucun document pour l'instant
            </p>
          )}
        </div>

        <motion.div
          className="mt-6 pt-6 border-t"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button className="w-full gap-2">
            <Upload className="w-4 h-4" />
            Ajouter un document
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
};

/**
 * Fees Tab
 */
const FeesTab = ({ fees, totalFees }) => {
  const feeTypeLabels = {
    surveyor_fee: 'Frais de géomètre',
    notary_fee: 'Frais de notaire',
    teranga_commission: 'Commission Teranga',
    document_fee: 'Frais de dossier',
    other: 'Autres frais',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Frais et Paiements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* SUMMARY */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
          <div>
            <p className="text-sm text-slate-600">Total des frais</p>
            <p className="text-2xl font-bold text-blue-600">
              {totalFees.toLocaleString()} CFA
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Payé</p>
            <p className="text-2xl font-bold text-green-600">
              {fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + parseFloat(f.amount), 0).toLocaleString()} CFA
            </p>
          </div>
        </div>

        {/* FEE ITEMS */}
        <div className="space-y-3">
          {fees.map((fee, index) => (
            <motion.div
              key={fee.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium">{feeTypeLabels[fee.fee_type]}</p>
                <p className="text-sm text-slate-600">{fee.description}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">
                  {parseFloat(fee.amount).toLocaleString()} CFA
                </p>
                <Badge variant={fee.status === 'paid' ? 'default' : 'outline'}>
                  {fee.status}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>

        {fees.filter(f => f.status !== 'paid').length > 0 && (
          <div className="pt-4 border-t">
            <Button className="w-full gap-2" variant="default">
              <DollarSign className="w-4 h-4" />
              Procéder au paiement
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Timeline Tab
 */
const TimelineTab = ({ timeline }) => {
  const eventIcons = {
    status_change: Clock,
    participant_added: Users,
    fee_created: DollarSign,
    task_completed: CheckCircle2,
    document_uploaded: FileText,
    message_sent: MessageSquare,
    payment_received: DollarSign,
    notification_sent: AlertCircle,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique complet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeline.length > 0 ? (
            timeline.map((event, index) => {
              const Icon = eventIcons[event.event_type] || Clock;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-4"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-1 h-12 bg-slate-200 mt-2" />
                    )}
                  </div>
                  <div className="pt-2 pb-4">
                    <p className="font-semibold">{event.title}</p>
                    <p className="text-sm text-slate-600">{event.description}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(event.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <p className="text-slate-600 text-center py-8">
              Aucun événement pour l'instant
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RefactoredParticulierCaseTracking;
