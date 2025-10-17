/**
 * REFACTORED - Seller Case Tracking Page
 * Complete case management interface for sellers
 * Accept/decline requests, manage fees, track progress
 * @author Teranga Foncier Team
 * @date October 17, 2025
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import AdvancedCaseTrackingService from '@/services/AdvancedCaseTrackingService';
import SellerAcceptanceService from '@/services/SellerAcceptanceService';
import CaseTrackingStatus from './CaseTrackingStatus';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, ArrowLeft, Check, X, FileText, Users, DollarSign, Eye, CheckCircle2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const RefactoredVendeurCaseTracking = () => {
  const { caseNumber } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [caseData, setCaseData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);

  // LOAD
  useEffect(() => {
    if (user && caseNumber) {
      loadCaseData();
    }
  }, [user, caseNumber]);

  const loadCaseData = async () => {
    try {
      setLoading(true);

      // Get case
      const { data: cData } = await supabase
        .from('purchase_cases')
        .select('*')
        .eq('case_number', caseNumber)
        .eq('seller_id', user.id)
        .single();

      if (!cData) throw new Error('Dossier non trouvé');
      setCaseData(cData);

      // Get summary
      const sum = await AdvancedCaseTrackingService.getCompleteCaseSummary(cData.id);
      setSummary(sum);

    } catch (error) {
      console.error('Error:', error);
      toast.error('Impossible de charger le dossier');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  // ACCEPT CASE
  const handleAcceptCase = async () => {
    try {
      await SellerAcceptanceService.handleSellerAcceptance(caseData.id, user.id);
      toast.success('Demande acceptée avec succès!');
      loadCaseData();
      setShowAcceptDialog(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de l\'acceptation');
    }
  };

  // DECLINE CASE
  const handleDeclineCase = async () => {
    try {
      await supabase
        .from('purchase_cases')
        .update({ seller_status: 'declined', status: 'seller_declined' })
        .eq('id', caseData.id)
        .eq('seller_id', user.id);

      toast.success('Demande refusée');
      loadCaseData();
      setShowDeclineDialog(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors du refus');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin text-blue-600 text-4xl">⟳</div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <AlertCircle className="w-12 h-12 text-red-600" />
        <p>Dossier non trouvé</p>
      </div>
    );
  }

  const isAccepted = caseData.seller_status === 'accepted';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 w-4 h-4" />
          Retour
        </Button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dossier #{caseNumber}</h1>
            <p className="text-slate-600">Vue vendeur - Gestion de la transaction</p>
          </div>

          <Badge className={`text-lg px-4 py-2 ${isAccepted ? 'bg-green-500' : caseData.seller_status === 'declined' ? 'bg-red-500' : 'bg-yellow-500'}`}>
            {isAccepted ? '✅ ACCEPTÉ' : caseData.seller_status === 'declined' ? '❌ REFUSÉ' : '⏳ EN ATTENTE'}
          </Badge>
        </div>
      </motion.div>

      {/* ACTION BUTTONS (if pending) */}
      {/* STATUS MESSAGES & ACTION BUTTONS */}
      {caseData?.status === 'pending' || caseData?.seller_status === 'pending' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <h3 className="font-bold mb-4 text-yellow-900">⏳ Votre réponse est demandée</h3>
              <div className="flex gap-4">
                <Button
                  onClick={() => setShowAcceptDialog(true)}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 gap-2"
                >
                  <Check className="w-5 h-5" />
                  Accepter la demande
                </Button>
                <Button
                  onClick={() => setShowDeclineDialog(true)}
                  size="lg"
                  variant="outline"
                  className="gap-2"
                >
                  <X className="w-5 h-5" />
                  Refuser
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : caseData?.seller_status === 'accepted' || caseData?.status === 'seller_accepted' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-bold text-green-900">✅ Demande Acceptée</h3>
                  <p className="text-sm text-green-800">
                    Vous avez accepté cette demande d'achat. 
                    {caseData?.seller_response_date && (
                      <>
                        <br />
                        Acceptée le {new Date(caseData.seller_response_date).toLocaleDateString('fr-FR')}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : caseData?.seller_status === 'declined' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <X className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="font-bold text-red-900">❌ Demande Refusée</h3>
                  <p className="text-sm text-red-800">
                    Vous avez refusé cette demande d'achat.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : null}

      {/* CASE TRACKING STATUS - Shows workflow progress like package tracking */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <CaseTrackingStatus caseData={caseData} />
      </motion.div>

      {/* TABS */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white border-b">
          <TabsTrigger value="overview">Vue Générale</TabsTrigger>
          <TabsTrigger value="participants">Intervenants</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="fees">Frais</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-6">
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* BUYER INFO */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Acheteur
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">Prix convenu:</p>
                    <p className="text-2xl font-bold text-green-600">
                      {caseData.agreed_price?.toLocaleString()} CFA
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* STATUS */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Statut
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">Demande:</p>
                    <p className="font-bold capitalize">
                      {caseData.status?.replace(/_/g, ' ')}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* FEES */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Frais totaux
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">À percevoir:</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {summary.total_fees?.toLocaleString()} CFA
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}
        </TabsContent>

        {/* PARTICIPANTS */}
        <TabsContent value="participants">
          {summary?.participants && (
            <Card>
              <CardHeader>
                <CardTitle>Intervenants ({summary.participants.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {summary.participants.map(p => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 bg-slate-50 rounded-lg border"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold capitalize">{p.role}</p>
                        <Badge>{p.status}</Badge>
                      </div>
                      <p className="text-sm">{p.full_name || 'Non spécifié'}</p>
                      {p.email && <p className="text-xs text-slate-600">{p.email}</p>}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* DOCUMENTS */}
        <TabsContent value="documents">
          {summary?.documents && (
            <Card>
              <CardHeader>
                <CardTitle>Documents ({summary.documents.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {summary.documents.map(doc => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <FileText className="w-4 h-4" />
                        <div>
                          <p className="font-medium">{doc.title}</p>
                          <p className="text-xs text-slate-600">{doc.document_type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.is_verified && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                        <Badge>{doc.status}</Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* FEES */}
        <TabsContent value="fees">
          {summary?.fees && (
            <Card>
              <CardHeader>
                <CardTitle>Frais et Paiements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded">
                  <div>
                    <p className="text-sm text-slate-600">Total</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {summary.total_fees?.toLocaleString()} CFA
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Payés</p>
                    <p className="text-2xl font-bold text-green-600">
                      {summary.fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + parseFloat(f.amount), 0).toLocaleString()} CFA
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {summary.fees.map(fee => (
                    <motion.div
                      key={fee.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-between items-center p-3 bg-slate-50 rounded"
                    >
                      <p className="font-medium">{fee.fee_type?.replace(/_/g, ' ')}</p>
                      <div className="flex items-center gap-3">
                        <p className="font-semibold">{parseFloat(fee.amount).toLocaleString()} CFA</p>
                        <Badge>{fee.status}</Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* DIALOGS */}
      <AlertDialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l'acceptation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir accepter cette demande d'achat?
              Le prix convenu est de {caseData.agreed_price?.toLocaleString()} CFA.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="gap-2 flex">
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleAcceptCase} className="bg-green-600">
              Accepter
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Refuser la demande</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir refuser cette demande d'achat?
              Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="gap-2 flex">
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeclineCase} className="bg-red-600">
              Refuser
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RefactoredVendeurCaseTracking;
