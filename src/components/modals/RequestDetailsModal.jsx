import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Home, 
  CreditCard, 
  FileText, 
  Clock, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Wallet,
  Building2,
  CheckCircle2,
  AlertCircle,
  Info,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const RequestDetailsModal = ({ request, isOpen, onClose }) => {
  if (!request) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd MMMM yyyy à HH:mm', { locale: fr });
    } catch {
      return 'N/A';
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        color: 'bg-amber-100 text-amber-700 border-amber-300', 
        icon: Clock, 
        label: 'En attente' 
      },
      accepted: { 
        color: 'bg-emerald-100 text-emerald-700 border-emerald-300', 
        icon: CheckCircle2, 
        label: 'Acceptée' 
      },
      rejected: { 
        color: 'bg-red-100 text-red-700 border-red-300', 
        icon: AlertCircle, 
        label: 'Refusée' 
      },
      negotiation: { 
        color: 'bg-blue-100 text-blue-700 border-blue-300', 
        icon: TrendingUp, 
        label: 'En négociation' 
      },
      completed: { 
        color: 'bg-green-100 text-green-700 border-green-300', 
        icon: CheckCircle2, 
        label: 'Complétée' 
      }
    };
    return configs[status] || configs.pending;
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      'cash': 'Paiement Comptant',
      'one-time': 'Paiement Comptant',
      'installments': 'Paiement Échelonné',
      'bank_financing': 'Financement Bancaire',
      'bank-financing': 'Financement Bancaire',
      'unknown': 'Non défini'
    };
    return labels[method] || method || 'Non défini';
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'cash':
      case 'one-time':
        return Wallet;
      case 'installments':
        return Calendar;
      case 'bank_financing':
      case 'bank-financing':
        return Building2;
      default:
        return CreditCard;
    }
  };

  const statusConfig = getStatusConfig(request.status);
  const StatusIcon = statusConfig.icon;
  const PaymentIcon = getPaymentMethodIcon(request.payment_method);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <FileText className="w-7 h-7 text-blue-600" />
            Détails de la Demande d'Achat
          </DialogTitle>
        </DialogHeader>
        
        {/* En-tête récapitulatif */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Statut</p>
              <Badge className={`${statusConfig.color} border px-3 py-1`}>
                <StatusIcon className="w-4 h-4 mr-2" />
                {statusConfig.label}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Montant proposé</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(request.offered_price || request.offer_price)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Mode de paiement</p>
              <Badge variant="outline" className="px-3 py-1">
                <PaymentIcon className="w-4 h-4 mr-2" />
                {getPaymentMethodLabel(request.payment_method)}
              </Badge>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2 py-3">
              <Info className="w-4 h-4" />
              Aperçu
            </TabsTrigger>
            <TabsTrigger value="buyer" className="flex items-center gap-2 py-3">
              <User className="w-4 h-4" />
              Acheteur
            </TabsTrigger>
            <TabsTrigger value="property" className="flex items-center gap-2 py-3">
              <Home className="w-4 h-4" />
              Propriété
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2 py-3">
              <CreditCard className="w-4 h-4" />
              Paiement
            </TabsTrigger>
          </TabsList>
          
          {/* Onglet Aperçu */}
          <TabsContent value="overview" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Informations générales */}
              <div className="border rounded-xl p-5 space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Informations Générales
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">ID Transaction:</span>
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                      {request.id?.substring(0, 8)}...
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Date de création:</span>
                    <span className="font-medium">{formatDate(request.created_at)}</span>
                  </div>
                  {request.updated_at && request.updated_at !== request.created_at && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Dernière mise à jour:</span>
                      <span className="font-medium">{formatDate(request.updated_at)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Montants */}
              <div className="border rounded-xl p-5 space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Montants
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Prix demandé:</span>
                    <span className="font-medium">{formatCurrency(request.parcels?.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Offre acheteur:</span>
                    <span className="font-bold text-lg text-blue-600">
                      {formatCurrency(request.offered_price || request.offer_price)}
                    </span>
                  </div>
                  {request.parcels?.price && request.offered_price && (
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-slate-600">Différence:</span>
                      <span className={`font-medium ${
                        request.offered_price >= request.parcels.price 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {request.offered_price >= request.parcels.price ? '+' : ''}
                        {formatCurrency(request.offered_price - request.parcels.price)}
                        {' '}
                        ({((request.offered_price - request.parcels.price) / request.parcels.price * 100).toFixed(1)}%)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Message */}
            {request.message && (
              <div className="border rounded-xl p-5 bg-slate-50">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  Message de l'acheteur
                </h3>
                <p className="text-slate-700 whitespace-pre-wrap">{request.message}</p>
              </div>
            )}
          </TabsContent>
          
          {/* Onglet Acheteur */}
          <TabsContent value="buyer" className="space-y-4 mt-6">
            <div className="border rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{request.buyer_name || 'Acheteur'}</h3>
                  <p className="text-sm text-slate-600">Informations de contact</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Email */}
                {request.buyer_email && (
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-600 mb-1">Email</p>
                      <a 
                        href={`mailto:${request.buyer_email}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {request.buyer_email}
                      </a>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.location.href = `mailto:${request.buyer_email}`}
                    >
                      Envoyer un email
                    </Button>
                  </div>
                )}
                
                {/* Téléphone */}
                {request.buyer_phone && (
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-600 mb-1">Téléphone</p>
                      <a 
                        href={`tel:${request.buyer_phone}`}
                        className="font-medium text-green-600 hover:underline"
                      >
                        {request.buyer_phone}
                      </a>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.location.href = `tel:${request.buyer_phone}`}
                    >
                      Appeler
                    </Button>
                  </div>
                )}
                
                {/* Informations additionnelles */}
                {request.buyer_info && Object.keys(request.buyer_info).length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-semibold mb-3">Informations supplémentaires</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(request.buyer_info).map(([key, value]) => {
                        if (key === 'full_name' || key === 'email' || key === 'phone') return null;
                        return (
                          <div key={key} className="flex justify-between">
                            <span className="text-slate-600 capitalize">{key.replace('_', ' ')}:</span>
                            <span className="font-medium">{value || 'Non renseigné'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Onglet Propriété */}
          <TabsContent value="property" className="space-y-4 mt-6">
            <div className="border rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {request.parcels?.title || request.parcels?.name || 'Propriété'}
                  </h3>
                  <p className="text-sm text-slate-600">Détails de la parcelle</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Localisation */}
                {request.parcels?.location && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Localisation</p>
                      <p className="font-medium">{request.parcels.location}</p>
                    </div>
                  </div>
                )}
                
                {/* Surface */}
                {request.parcels?.surface && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                    <Home className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Surface</p>
                      <p className="font-medium">{request.parcels.surface} m²</p>
                    </div>
                  </div>
                )}
                
                {/* Prix demandé */}
                {request.parcels?.price && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Prix demandé</p>
                      <p className="font-medium text-lg">{formatCurrency(request.parcels.price)}</p>
                    </div>
                  </div>
                )}
                
                {/* Statut parcelle */}
                {request.parcels?.status && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Statut</p>
                      <Badge variant="outline">{request.parcels.status}</Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Onglet Paiement */}
          <TabsContent value="payment" className="space-y-4 mt-6">
            <div className="border rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <PaymentIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {getPaymentMethodLabel(request.payment_method)}
                  </h3>
                  <p className="text-sm text-slate-600">Mode de paiement choisi</p>
                </div>
              </div>
              
              {/* Détails du paiement */}
              {request.metadata?.payment_details && Object.keys(request.metadata.payment_details).length > 0 ? (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-slate-700 mb-3">Détails du paiement</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(request.metadata.payment_details).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-600 capitalize">
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className="font-medium text-sm">
                          {typeof value === 'number' && key.includes('amount') 
                            ? formatCurrency(value)
                            : typeof value === 'boolean'
                            ? (value ? 'Oui' : 'Non')
                            : value || 'N/A'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
                  <Info className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">
                    Aucun détail de paiement supplémentaire disponible
                  </p>
                </div>
              )}
              
              {/* Services additionnels */}
              {request.metadata?.additional_services && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-sm text-slate-700 mb-3">Services additionnels</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(request.metadata.additional_services).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                        {value ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-slate-400" />
                        )}
                        <span className="text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Footer avec actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={onClose} className="flex-1">
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsModal;
