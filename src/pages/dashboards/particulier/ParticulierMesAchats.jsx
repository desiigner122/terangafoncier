import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  MessageSquare,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertCircle,
  Filter,
  Search,
  Download,
  Package,
  Home
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ParticulierMesAchats = () => {
  const outletContext = useOutletContext();
  const { user } = outletContext || {};
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    if (user) {
      loadPurchaseRequests();
    }
  }, [user]);

  const loadPurchaseRequests = async () => {
    try {
      setLoading(true);
      console.log('📊 Chargement des demandes d\'achat...');

      // Charger les requests de l'utilisateur
      const { data: requestsData, error: requestsError } = await supabase
        .from('requests')
        .select(`
          *,
          parcels:parcel_id (
            id,
            title,
            name,
            price,
            location,
            surface,
            status
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      // Charger les transactions pour chaque request
      if (requestsData && requestsData.length > 0) {
        const requestIds = requestsData.map(r => r.id);
        const { data: transactionsData } = await supabase
          .from('transactions')
          .select('*')
          .in('request_id', requestIds);

        // Associer les transactions aux requests
        const requestsWithTransactions = requestsData.map(request => ({
          ...request,
          transactions: transactionsData?.filter(t => t.request_id === request.id) || []
        }));

        setRequests(requestsWithTransactions);
        console.log('✅ Demandes d\'achat chargées:', requestsWithTransactions.length);
      } else {
        setRequests([]);
        console.log('✅ Aucune demande d\'achat trouvée');
      }
    } catch (error) {
      console.error('❌ Erreur chargement demandes:', error);
      window.safeGlobalToast({
        description: 'Erreur lors du chargement de vos demandes d\'achat',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper pour extraire payment_type (colonne ou metadata)
  const getPaymentType = (request) => {
    return request.payment_type || request.metadata?.payment_type || request.type || 'one_time';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      approved: { label: 'Approuvée', color: 'bg-green-100 text-green-800 border-green-300' },
      rejected: { label: 'Refusée', color: 'bg-red-100 text-red-800 border-red-300' },
      processing: { label: 'En cours', color: 'bg-blue-100 text-blue-800 border-blue-300' },
      completed: { label: 'Terminée', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge className={`${config.color} border`}>
        {config.label}
      </Badge>
    );
  };

  const getPaymentTypeBadge = (type) => {
    const typeConfig = {
      one_time: { label: 'Comptant', icon: DollarSign, color: 'bg-blue-50 text-blue-700' },
      installments: { label: 'Échelonné', icon: Calendar, color: 'bg-purple-50 text-purple-700' },
      bank_financing: { label: 'Financement', icon: TrendingUp, color: 'bg-green-50 text-green-700' }
    };
    const config = typeConfig[type] || typeConfig.one_time;
    const Icon = config.icon;
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </div>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd MMM yyyy', { locale: fr });
    } catch (error) {
      return 'N/A';
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesTab = activeTab === 'all' || request.status === activeTab;
    const matchesSearch = searchTerm === '' || 
      request.parcels?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.parcels?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.parcels?.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    completed: requests.filter(r => r.status === 'completed').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-8 h-8 text-blue-600" />
            Mes Demandes d'Achat
          </h1>
          <p className="text-slate-600 mt-1">
            Suivez l'état de vos demandes d'achat de terrains
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Approuvées</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Terminées</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche et filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par nom de terrain, localisation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets et liste */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                Toutes ({stats.total})
              </TabsTrigger>
              <TabsTrigger value="pending">
                En attente ({stats.pending})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approuvées ({stats.approved})
              </TabsTrigger>
              <TabsTrigger value="processing">
                En cours
              </TabsTrigger>
              <TabsTrigger value="completed">
                Terminées ({stats.completed})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-slate-600 mt-4">Chargement de vos demandes...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Aucune demande trouvée</p>
              <p className="text-slate-500 text-sm mt-1">
                Vos demandes d'achat apparaîtront ici
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Home className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-lg text-slate-900">
                          {request.parcels?.title || request.parcels?.name || 'Terrain sans titre'}
                        </h3>
                        {getStatusBadge(request.status)}
                        {getPaymentTypeBadge(request.type)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-slate-500">Date de demande</p>
                          <p className="text-sm font-medium text-slate-900">
                            {formatDate(request.created_at)}
                          </p>
                        </div>

                        {request.parcels?.location && (
                          <div>
                            <p className="text-xs text-slate-500">Localisation</p>
                            <p className="text-sm font-medium text-slate-900">
                              {request.parcels.location}
                            </p>
                          </div>
                        )}

                        {request.parcels?.surface && (
                          <div>
                            <p className="text-xs text-slate-500">Surface</p>
                            <p className="text-sm font-medium text-slate-900">
                              {request.parcels.surface} m²
                            </p>
                          </div>
                        )}

                        {request.transactions && request.transactions.length > 0 && (
                          <div>
                            <p className="text-xs text-slate-500">Montant</p>
                            <p className="text-sm font-medium text-slate-900">
                              {formatCurrency(request.transactions[0].amount)}
                            </p>
                          </div>
                        )}
                      </div>

                      {request.description && (
                        <p className="text-sm text-slate-600 mt-3">
                          {request.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="whitespace-nowrap"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowDetailDialog(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Détails
                      </Button>
                      {request.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="whitespace-nowrap text-red-600 hover:text-red-700"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Annuler
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog Détails */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la demande d'achat</DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Informations</TabsTrigger>
                <TabsTrigger value="payment">Paiement</TabsTrigger>
                <TabsTrigger value="history">Historique</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                {/* Informations générales */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">ID Demande</Label>
                    <p className="font-medium mt-1">{selectedRequest.id?.substring(0, 8)}...</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Statut</Label>
                    <div className="mt-1">
                      <Badge className={`
                        ${selectedRequest.status === 'approved' ? 'bg-green-500' : ''}
                        ${selectedRequest.status === 'pending' ? 'bg-yellow-500' : ''}
                        ${selectedRequest.status === 'rejected' ? 'bg-red-500' : ''}
                        ${selectedRequest.status === 'in_progress' ? 'bg-blue-500' : ''}
                      `}>
                        {selectedRequest.status === 'approved' && 'Approuvée'}
                        {selectedRequest.status === 'pending' && 'En attente'}
                        {selectedRequest.status === 'rejected' && 'Rejetée'}
                        {selectedRequest.status === 'in_progress' && 'En cours'}
                        {selectedRequest.status === 'completed' && 'Complétée'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600">Type de paiement</Label>
                    <p className="font-medium mt-1">
                      {getPaymentType(selectedRequest) === 'one_time' && 'Paiement unique'}
                      {getPaymentType(selectedRequest) === 'installments' && 'Paiement échelonné'}
                      {getPaymentType(selectedRequest) === 'bank_financing' && 'Financement bancaire'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Date de demande</Label>
                    <p className="font-medium mt-1">
                      {new Date(selectedRequest.created_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>

                {/* Informations propriété */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold text-lg mb-3">Propriété</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">Titre</Label>
                      <p className="font-medium mt-1">{selectedRequest.parcels?.title || selectedRequest.parcels?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Prix demandé</Label>
                      <p className="font-medium text-blue-600 mt-1">
                        {parseInt(selectedRequest.offered_price || selectedRequest.parcels?.price || 0).toLocaleString('fr-FR')} FCFA
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Localisation</Label>
                      <p className="font-medium mt-1">{selectedRequest.parcels?.location || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Surface</Label>
                      <p className="font-medium mt-1">{selectedRequest.parcels?.surface || 'N/A'} m²</p>
                    </div>
                  </div>
                </div>

                {/* Message/Note */}
                {selectedRequest.message && (
                  <div className="border-t pt-4 mt-4">
                    <Label className="text-gray-600">Message au vendeur</Label>
                    <p className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-700">
                      {selectedRequest.message}
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="payment" className="space-y-4">
                {/* Informations de paiement */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">Montant proposé</Label>
                      <p className="font-medium text-xl text-blue-600 mt-1">
                        {parseInt(selectedRequest.offered_price || 0).toLocaleString('fr-FR')} FCFA
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Type de paiement</Label>
                      <p className="font-medium mt-1">
                        {getPaymentType(selectedRequest) === 'one_time' && 'Paiement unique'}
                        {getPaymentType(selectedRequest) === 'installments' && 'Paiement échelonné'}
                        {getPaymentType(selectedRequest) === 'bank_financing' && 'Financement bancaire'}
                      </p>
                    </div>
                  </div>

                  {/* Transactions */}
                  {selectedRequest.transactions && selectedRequest.transactions.length > 0 && (
                    <div className="border-t pt-4">
                      <Label className="text-gray-600 mb-3 block">Transactions</Label>
                      <div className="space-y-2">
                        {selectedRequest.transactions.map((transaction, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                            <div>
                              <p className="font-medium">{parseInt(transaction.amount).toLocaleString('fr-FR')} FCFA</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(transaction.created_at).toLocaleString('fr-FR')}
                              </p>
                            </div>
                            <Badge className={
                              transaction.status === 'completed' ? 'bg-green-500' :
                              transaction.status === 'pending' ? 'bg-yellow-500' :
                              'bg-gray-500'
                            }>
                              {transaction.status === 'completed' ? 'Complété' : 
                               transaction.status === 'pending' ? 'En attente' : 
                               transaction.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Plan d'échelonnement si applicable */}
                  {getPaymentType(selectedRequest) === 'installments' && selectedRequest.installment_plan && (
                    <div className="border-t pt-4">
                      <Label className="text-gray-600 mb-3 block">Plan d'échelonnement</Label>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-sm text-gray-600">Nombre de versements</p>
                            <p className="font-semibold">{selectedRequest.installment_plan.number_of_installments || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Fréquence</p>
                            <p className="font-semibold">{selectedRequest.installment_plan.frequency || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Apport initial</p>
                            <p className="font-semibold">{parseInt(selectedRequest.installment_plan.down_payment || 0).toLocaleString('fr-FR')} FCFA</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Montant par versement</p>
                            <p className="font-semibold">{parseInt(selectedRequest.installment_plan.installment_amount || 0).toLocaleString('fr-FR')} FCFA</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Détails financement bancaire si applicable */}
                  {getPaymentType(selectedRequest) === 'bank_financing' && selectedRequest.bank_details && (
                    <div className="border-t pt-4">
                      <Label className="text-gray-600 mb-3 block">Détails du financement bancaire</Label>
                      <div className="p-4 bg-green-50 rounded-lg space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Banque</p>
                          <p className="font-semibold">{selectedRequest.bank_details.bank_name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Montant du prêt demandé</p>
                          <p className="font-semibold">{parseInt(selectedRequest.bank_details.loan_amount || 0).toLocaleString('fr-FR')} FCFA</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Durée du prêt</p>
                          <p className="font-semibold">{selectedRequest.bank_details.loan_duration || 'N/A'} mois</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="history">
                {/* Historique des activités */}
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Demande créée</span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-6">
                      {new Date(selectedRequest.created_at).toLocaleString('fr-FR')}
                    </p>
                  </div>

                  {selectedRequest.updated_at && selectedRequest.updated_at !== selectedRequest.created_at && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Dernière mise à jour</span>
                      </div>
                      <p className="text-xs text-muted-foreground ml-6">
                        {new Date(selectedRequest.updated_at).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  )}

                  {selectedRequest.status === 'approved' && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-700">Demande approuvée</span>
                      </div>
                      <p className="text-xs text-green-600 ml-6">
                        Le vendeur a accepté votre demande
                      </p>
                    </div>
                  )}

                  {selectedRequest.status === 'rejected' && (
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span className="font-medium text-red-700">Demande rejetée</span>
                      </div>
                      <p className="text-xs text-red-600 ml-6">
                        Le vendeur a décliné votre demande
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParticulierMesAchats;
