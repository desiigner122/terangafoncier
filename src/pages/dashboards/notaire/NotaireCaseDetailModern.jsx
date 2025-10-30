/**
 * NotaireCaseDetailModern.jsx
 * 
 * Page de suivi détaillé optimisée pour le notaire
 * Version simplifiée qui fonctionne avec le système purchase_case_participants
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, FileText, Users, MessageSquare, Calendar, DollarSign,
  CheckCircle, Clock, AlertCircle, TrendingUp, MapPin, Phone, Mail
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
// import ContextualActionsPanel from '@/components/unified/ContextualActionsPanel';
// import PurchaseCaseMessaging from '@/components/messaging/PurchaseCaseMessaging';

const STATUS_META = {
  initiated: { label: 'Initié', color: 'bg-gray-500', progress: 10 },
  buyer_verification: { label: 'Vérification acheteur', color: 'bg-blue-500', progress: 20 },
  seller_notification: { label: 'Notification vendeur', color: 'bg-indigo-500', progress: 30 },
  document_collection: { label: 'Collecte documents', color: 'bg-purple-500', progress: 40 },
  title_verification: { label: 'Vérification titre', color: 'bg-pink-500', progress: 50 },
  contract_preparation: { label: 'Préparation contrat', color: 'bg-cyan-500', progress: 60 },
  preliminary_agreement: { label: 'Accord préliminaire', color: 'bg-teal-500', progress: 65 },
  deposit_pending: { label: 'Acompte en attente', color: 'bg-yellow-500', progress: 70 },
  contract_validation: { label: 'Validation contrat', color: 'bg-orange-500', progress: 75 },
  appointment_scheduling: { label: 'Planification RDV', color: 'bg-amber-500', progress: 80 },
  final_payment: { label: 'Paiement final', color: 'bg-lime-500', progress: 85 },
  signature: { label: 'Signature', color: 'bg-green-500', progress: 90 },
  registration: { label: 'Enregistrement', color: 'bg-emerald-500', progress: 95 },
  completed: { label: 'Terminé', color: 'bg-green-600', progress: 100 },
  cancelled: { label: 'Annulé', color: 'bg-red-500', progress: 0 }
};

const NotaireCaseDetailModern = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (caseId && user) {
      loadCaseDetails();
    }
  }, [caseId, user]);

  const loadCaseDetails = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading case details for:', caseId);

      // Charger le dossier complet avec toutes les relations
      const { data: purchaseCase, error } = await supabase
        .from('purchase_cases')
        .select(`
          *,
          buyer:profiles!buyer_id(id, full_name, email, phone, avatar_url),
          seller:profiles!seller_id(id, full_name, email, phone, avatar_url),
          parcelle:parcels!parcelle_id(id, title, location, surface)
        `)
        .eq('id', caseId)
        .single();

      if (error) throw error;

      console.log('✅ Case loaded:', purchaseCase);
      setCaseData(purchaseCase);
    } catch (error) {
      console.error('❌ Error loading case:', error);
      window.safeGlobalToast?.({
        title: "Erreur",
        description: "Impossible de charger le dossier",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <AlertCircle className="h-16 w-16 text-gray-400" />
        <p className="text-xl text-gray-600">Dossier introuvable</p>
        <Button onClick={() => navigate('/notaire/cases')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux dossiers
        </Button>
      </div>
    );
  }

  const statusConfig = STATUS_META[caseData.status] || STATUS_META.initiated;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/notaire/cases')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {caseData.case_number}
                </h1>
                <Badge className={statusConfig.color}>
                  {statusConfig.label}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {caseData.parcelle?.title} - {caseData.parcelle?.location}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Progression</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {statusConfig.progress}%
              </span>
            </div>
            <Progress value={statusConfig.progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* Informations générales */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Informations du dossier
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Numéro de dossier</p>
                      <p className="font-semibold">{caseData.case_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Statut</p>
                      <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Prix proposé</p>
                      <p className="font-semibold text-lg text-green-600">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'XOF',
                          minimumFractionDigits: 0
                        }).format(caseData.proposed_price || 0)}
                      </p>
                    </div>
                    {caseData.final_price && (
                      <div>
                        <p className="text-sm text-gray-500">Prix final</p>
                        <p className="font-semibold text-lg text-blue-600">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'XOF',
                            minimumFractionDigits: 0
                          }).format(caseData.final_price)}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Date de création</p>
                      <p className="font-semibold">
                        {new Date(caseData.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dernière mise à jour</p>
                      <p className="font-semibold">
                        {new Date(caseData.updated_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Informations terrain */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Terrain
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Titre</p>
                      <p className="font-semibold">{caseData.parcelle?.title || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Localisation</p>
                      <p className="font-semibold">{caseData.parcelle?.location || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Surface</p>
                      <p className="font-semibold">{caseData.parcelle?.surface || 'N/A'} m²</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions contextuelles - TODO: Implémenter */}
                <Card>
                  <CardHeader>
                    <CardTitle>Actions disponibles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <FileText className="h-4 w-4" />
                        Préparer le contrat
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Calendar className="h-4 w-4" />
                        Planifier la signature
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Valider les documents
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="messages">
                <Card>
                  <CardHeader>
                    <CardTitle>Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">La messagerie sera bientôt disponible.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>Documents du dossier</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">Gestion des documents à venir...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">Timeline à venir...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Participants */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Participants
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Acheteur */}
                {caseData.buyer && (
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Avatar>
                      <AvatarFallback className="bg-blue-500 text-white">
                        {caseData.buyer.full_name?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Acheteur</p>
                      <p className="font-semibold">{caseData.buyer.full_name || caseData.buyer.email}</p>
                      {caseData.buyer.email && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Mail className="h-3 w-3" />
                          {caseData.buyer.email}
                        </p>
                      )}
                      {caseData.buyer.phone && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {caseData.buyer.phone}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Vendeur */}
                {caseData.seller && (
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Avatar>
                      <AvatarFallback className="bg-green-500 text-white">
                        {caseData.seller.full_name?.charAt(0) || 'V'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Vendeur</p>
                      <p className="font-semibold">{caseData.seller.full_name || caseData.seller.email}</p>
                      {caseData.seller.email && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Mail className="h-3 w-3" />
                          {caseData.seller.email}
                        </p>
                      )}
                      {caseData.seller.phone && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {caseData.seller.phone}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotaireCaseDetailModern;
