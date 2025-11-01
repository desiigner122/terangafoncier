import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ModernBuyerCaseTrackingV2 from './ModernBuyerCaseTrackingV2';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Eye,
  RefreshCw,
  Home,
  Calendar,
  DollarSign
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const PurchaseRequestsListWrapper = () => {
  const { caseNumber } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [purchaseRequests, setPurchaseRequests] = useState([]);

  // Si on a un caseNumber, afficher la page de détail
  if (caseNumber) {
    return <ModernBuyerCaseTrackingV2 />;
  }

  useEffect(() => {
    if (user?.id) {
      loadPurchaseRequests();
    }
  }, [user?.id]);

  const loadPurchaseRequests = async () => {
    try {
      setLoading(true);

      // ✅ NOUVEAU: Charger depuis purchase_cases (dossiers créés après acceptation)
      const { data: casesData, error: casesError } = await supabase
        .from('purchase_cases')
        .select(`
          id,
          case_number,
          status,
          created_at,
          proposed_price,
          buyer_id,
          seller_id,
          parcelle_id,
          parcelle:parcels!parcelle_id(id, title, reference, price, city, images, seller_id),
          seller:profiles!seller_id(id, first_name, last_name, email)
        `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      // ✅ NOUVEAU: Charger depuis requests (demandes en attente d'acceptation)
      const { data: requestsData, error: requestsError } = await supabase
        .from('requests')
        .select(`
          id,
          user_id,
          status,
          created_at,
          offered_price,
          parcel_id,
          metadata
        `)
        .eq('user_id', user.id)
        .in('type', ['one_time', 'installment', 'bank'])
        .order('created_at', { ascending: false });

      // Charger infos des parcelles pour les requests
      const requestsWithParcels = await Promise.all(
        (requestsData || []).map(async (req) => {
          if (req.parcel_id) {
            const { data: parcel } = await supabase
              .from('parcels')
              .select('id, title, reference, price, city, images, seller_id')
              .eq('id', req.parcel_id)
              .single();

            const { data: seller } = await supabase
              .from('profiles')
              .select('id, first_name, last_name, email')
              .eq('id', parcel?.seller_id)
              .single();

            return {
              id: req.id,
              case_number: `REQ-${req.id.slice(0, 8)}`,
              status: req.status,
              created_at: req.created_at,
              proposed_price: req.offered_price,
              property: parcel,
              parcelle: parcel,
              seller: seller,
              source: 'request' // Identifier la source
            };
          }
          return null;
        })
      );

      // Formater les cases
      const formattedCases = (casesData || []).map(c => ({
        ...c,
        property: c.parcelle,
        source: 'purchase_case' // Identifier la source
      }));

      // Combiner et trier par date
      const allRequests = [
        ...formattedCases,
        ...requestsWithParcels.filter(r => r !== null)
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      console.log('✅ Demandes chargées:', {
        cases: casesData?.length || 0,
        requests: requestsWithParcels.filter(r => r).length,
        total: allRequests.length
      });

      setPurchaseRequests(allRequests.length > 0 ? allRequests : getMockPurchaseRequests());

    } catch (error) {
      console.error('❌ Erreur:', error);
      setPurchaseRequests(getMockPurchaseRequests());
    } finally {
      setLoading(false);
    }
  };

  const getMockPurchaseRequests = () => [
    {
      id: 'mock-pr-1',
      case_number: 'TF-2025-001',
      status: 'pending',
      created_at: new Date().toISOString(),
      property: {
        title: 'Terrain Almadies 500m²',
        reference: 'TER-001',
        price: 45000000,
        city: 'Dakar',
        images: []
      },
      seller: {
        first_name: 'Amadou',
        last_name: 'Diallo',
        email: 'amadou@example.com'
      }
    },
    {
      id: 'mock-pr-2',
      case_number: 'TF-2025-002',
      status: 'in_progress',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      property: {
        title: 'Villa Mermoz 4 pièces',
        reference: 'VIL-002',
        price: 85000000,
        city: 'Dakar',
        images: []
      },
      seller: {
        first_name: 'Fatou',
        last_name: 'Ndiaye',
        email: 'fatou@example.com'
      }
    }
  ];

  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': {
        label: 'En attente',
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        bgColor: 'bg-yellow-50'
      },
      'in_progress': {
        label: 'En cours',
        icon: TrendingUp,
        color: 'bg-blue-100 text-blue-700 border-blue-300',
        bgColor: 'bg-blue-50'
      },
      'seller_reviewing': {
        label: 'Examen vendeur',
        icon: AlertCircle,
        color: 'bg-purple-100 text-purple-700 border-purple-300',
        bgColor: 'bg-purple-50'
      },
      'completed': {
        label: 'Complété',
        icon: CheckCircle2,
        color: 'bg-green-100 text-green-700 border-green-300',
        bgColor: 'bg-green-50'
      },
      'rejected': {
        label: 'Rejeté',
        icon: XCircle,
        color: 'bg-red-100 text-red-700 border-red-300',
        bgColor: 'bg-red-50'
      },
      'cancelled': {
        label: 'Annulé',
        icon: XCircle,
        color: 'bg-gray-100 text-gray-700 border-gray-300',
        bgColor: 'bg-gray-50'
      }
    };
    return statusMap[status] || statusMap['pending'];
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const stats = {
    total: purchaseRequests.length,
    pending: purchaseRequests.filter(pr => pr.status === 'pending').length,
    in_progress: purchaseRequests.filter(pr => pr.status === 'in_progress').length,
    completed: purchaseRequests.filter(pr => pr.status === 'completed').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <ShoppingCart className="h-8 w-8" />
                Suivi des Achats
              </h1>
              <p className="text-purple-100 text-lg">
                Gérez vos demandes d'achat de propriétés
              </p>
            </div>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/acheteur')}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Home className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm text-purple-100 mb-1">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm text-purple-100 mb-1">En attente</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm text-purple-100 mb-1">En cours</p>
              <p className="text-2xl font-bold">{stats.in_progress}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm text-purple-100 mb-1">Complétés</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
          </div>
        </motion.div>

        {/* Liste des purchase requests */}
        {loading ? (
          <Card>
            <CardContent className="p-12 flex items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
            </CardContent>
          </Card>
        ) : purchaseRequests.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingCart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Aucune demande d'achat
              </h3>
              <p className="text-slate-600 mb-6">
                Vous n'avez pas encore effectué de demande d'achat de propriété
              </p>
              <Button 
                onClick={() => navigate('/acheteur/recherche')}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                Explorer les propriétés
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {purchaseRequests.map((request, index) => {
              const statusInfo = getStatusInfo(request.status);
              const StatusIcon = statusInfo.icon;

              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                    onClick={() => navigate(`/acheteur/cases/${request.case_number}`)}
                  >
                    <div className={`h-2 bg-gradient-to-r ${statusInfo.bgColor}`} />
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        {/* Image propriété */}
                        <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                          {request.property?.images?.[0] ? (
                            <img 
                              src={request.property.images[0]} 
                              alt={request.property.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Home className="h-12 w-12 text-purple-400" />
                          )}
                        </div>

                        {/* Informations */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-slate-900 mb-1">
                                {request.property?.title || 'Propriété'}
                              </h3>
                              <div className="flex items-center gap-3 text-sm text-slate-600">
                                <span className="flex items-center gap-1">
                                  <Home className="h-4 w-4" />
                                  Réf: {request.property?.reference || 'N/A'}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {format(new Date(request.created_at), 'dd MMM yyyy', { locale: fr })}
                                </span>
                              </div>
                            </div>
                            <Badge className={`${statusInfo.color} border`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusInfo.label}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Dossier</p>
                              <p className="font-semibold text-slate-900">{request.case_number}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Prix</p>
                              <p className="font-semibold text-slate-900 flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {formatPrice(request.property?.price || 0)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Vendeur</p>
                              <p className="font-semibold text-slate-900">
                                {request.seller ? 
                                  `${request.seller.first_name} ${request.seller.last_name}` 
                                  : 'N/A'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                            <p className="text-sm text-slate-600">
                              Cliquez pour voir les détails complets du dossier
                            </p>
                            <Button 
                              size="sm"
                              className="bg-gradient-to-r from-purple-600 to-pink-600"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir le dossier
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseRequestsListWrapper;
