import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, ArrowLeft } from 'lucide-react';

const PaymentPlansPage = () => {
  const { state } = useLocation();
  const context = state || {};
  const backLink = useMemo(() => {
    if (context.projectId) return { to: `/project/${context.projectId}`, label: 'Retour au projet' };
    return null;
  }, [context]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {(context.projectId || context.unitType) && (
        <div className="p-3 rounded-md bg-purple-50 border border-purple-200 text-sm text-purple-800 flex items-center justify-between">
          <div>
            Contexte importé: {context.projectId ? `Projet ${context.projectId}` : ''} {context.unitType ? `· Type: ${context.unitType}` : ''}
          </div>
          {backLink && (
            <Link to={backLink.to} className="inline-flex items-center text-purple-700 hover:underline">
              <ArrowLeft className="w-4 h-4 mr-1"/> {backLink.label}
            </Link>
          )}
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary"/> Plan de paiement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Découvrez les plans de paiement proposés par les promoteurs pour les appartements et villas.</p>
          <ul className="list-disc pl-5">
            <li>Calendriers et taux</li>
            <li>Conditions d'éligibilité</li>
            <li>Modalités et documents requis</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPlansPage;
