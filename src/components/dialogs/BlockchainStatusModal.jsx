import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  CheckCircle, 
  XCircle,
  Clock,
  Hash,
  Database,
  Copy,
  ExternalLink
} from 'lucide-react';

/**
 * BlockchainStatusModal - Modal affichant le statut blockchain d'une propriété
 * @param {boolean} open - État d'ouverture du modal
 * @param {function} onOpenChange - Callback pour changer l'état
 * @param {object} property - Propriété vérifiée
 * @param {object} status - Statut blockchain
 */
const BlockchainStatusModal = ({ open, onOpenChange, property, status }) => {
  if (!status || !property) return null;

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    window.safeGlobalToast({
      title: "Copié",
      description: `${label} copié dans le presse-papiers.`
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Statut Blockchain
          </DialogTitle>
          <DialogDescription>
            Vérification de "{property.title}" sur TerangaChain
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Statut Principal */}
          <div className={`p-6 rounded-lg text-center ${
            status.verified 
              ? 'bg-green-50 border-2 border-green-200' 
              : 'bg-red-50 border-2 border-red-200'
          }`}>
            {status.verified ? (
              <>
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-green-800 mb-2">
                  Vérifié sur Blockchain
                </h3>
                <p className="text-green-700">
                  Cette propriété est authentifiée et sécurisée par TerangaChain
                </p>
              </>
            ) : (
              <>
                <XCircle className="h-16 w-16 text-red-600 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-red-800 mb-2">
                  Non Vérifié
                </h3>
                <p className="text-red-700">
                  Cette propriété n'a pas encore été vérifiée sur la blockchain
                </p>
              </>
            )}
          </div>

          {/* Détails Blockchain */}
          {status.verified && (
            <div className="space-y-3">
              {/* Transaction Hash */}
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Hash de Transaction
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(status.transactionHash, 'Hash')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs font-mono bg-gray-50 p-2 rounded break-all">
                  {status.transactionHash}
                </p>
              </div>

              {/* Block Number */}
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Numéro de Bloc
                  </span>
                  <Badge className="bg-blue-600">
                    #{status.blockNumber.toLocaleString('fr-FR')}
                  </Badge>
                </div>
              </div>

              {/* Network */}
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Réseau</span>
                  <Badge variant="outline" className="border-blue-600 text-blue-600">
                    {status.network}
                  </Badge>
                </div>
              </div>

              {/* Confirmations */}
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Confirmations</span>
                  <Badge className="bg-green-600">
                    {status.confirmations}
                  </Badge>
                </div>
              </div>

              {/* Timestamp */}
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Date de Vérification
                  </span>
                  <span className="text-sm text-gray-900 font-medium">
                    {formatDate(status.timestamp)}
                  </span>
                </div>
              </div>

              {/* Explorer Link */}
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => {
                  window.open(`https://explorer.terangachain.io/tx/${status.transactionHash}`, '_blank');
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Voir sur TerangaChain Explorer
              </Button>
            </div>
          )}

          {/* Action si non vérifié */}
          {!status.verified && (
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Shield className="h-4 w-4 mr-2" />
              Vérifier Maintenant sur Blockchain
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlockchainStatusModal;
