/**
 * Composant pour afficher les détails du financement bancaire
 * Affiche conditionnellement si payment_method='bank_financing'
 */
import React from 'react';
import { Building2, CheckCircle2, AlertCircle, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export const BankFinancingSection = ({
  paymentMethod,
  financingApproved,
  loanAmount,
  approvedAmount,
  bankName,
  estimatedDisbursementDate,
  conditions = [],
}) => {
  // Ne pas afficher si pas financement bancaire
  if (paymentMethod !== 'bank_financing') {
    return null;
  }

  const loanPercentage = loanAmount && approvedAmount ? (approvedAmount / loanAmount) * 100 : 0;

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-lg">Financement Bancaire</CardTitle>
          </div>
          <Badge
            className={cn(
              'flex items-center gap-1',
              financingApproved
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            )}
          >
            {financingApproved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Approuvé
              </>
            ) : (
              <>
                <Clock className="w-4 h-4" />
                En attente
              </>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Infos banque */}
        {bankName && (
          <div>
            <p className="text-sm text-gray-600">Banque</p>
            <p className="font-semibold text-lg">{bankName}</p>
          </div>
        )}

        {/* Montants */}
        {loanAmount && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Montant demandé</p>
              <p className="font-semibold text-lg">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'XOF',
                }).format(loanAmount)}
              </p>
            </div>
            {approvedAmount && (
              <div>
                <p className="text-sm text-gray-600">Montant approuvé</p>
                <p className={cn(
                  'font-semibold text-lg',
                  approvedAmount >= loanAmount ? 'text-green-600' : 'text-orange-600'
                )}>
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'XOF',
                  }).format(approvedAmount)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Barre de progression */}
        {loanAmount && approvedAmount && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Taux d'approbation</p>
              <span className="text-sm font-semibold text-purple-600">
                {Math.round(loanPercentage)}%
              </span>
            </div>
            <Progress
              value={loanPercentage}
              className={cn(
                'h-2',
                loanPercentage >= 100 ? 'bg-green-100' : 'bg-yellow-100'
              )}
            />
          </div>
        )}

        {/* Date de déblocage estimée */}
        {estimatedDisbursementDate && (
          <div className="border-t border-purple-200 pt-4">
            <p className="text-sm text-gray-600">Déblocage estimé</p>
            <p className="font-semibold">
              {new Date(estimatedDisbursementDate).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        )}

        {/* Conditions */}
        {conditions && conditions.length > 0 && (
          <div className="border-t border-purple-200 pt-4">
            <p className="text-sm font-medium mb-3">Conditions de financement:</p>
            <div className="space-y-2">
              {conditions.map((condition, index) => (
                <div
                  key={index}
                  className="flex gap-2 p-2 bg-white rounded border border-purple-100"
                >
                  <AlertCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{condition}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status message */}
        {!financingApproved && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex gap-2">
              <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-yellow-800">Approbation en cours</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Votre demande de financement est en cours de traitement. Nous vous informerons dès que la décision sera prise.
                </p>
              </div>
            </div>
          </div>
        )}

        {financingApproved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-800">Financement approuvé ✅</p>
                <p className="text-sm text-green-700 mt-1">
                  Votre financement a été approuvé. Vous pouvez procéder aux étapes suivantes.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BankFinancingSection;
