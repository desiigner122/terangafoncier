import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';

const PurchaseUnitsPage = () => {
  const { state } = useLocation();
  const context = state || {};
  const backLink = useMemo(() => {
    if (context.projectId) return { to: `/project/${context.projectId}`, label: 'Retour au projet' };
    return null;
  }, [context]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {(context.projectId || context.unitType) && (
        <div className="p-3 rounded-md bg-blue-50 border border-blue-200 text-sm text-blue-800 flex items-center justify-between">
          <div>
            Contexte importé: {context.projectId ? `Projet ${context.projectId}` : ''} {context.unitType ? `· Type: ${context.unitType}` : ''}
          </div>
          {backLink && (
            <Link to={backLink.to} className="inline-flex items-center text-blue-700 hover:underline">
              <ArrowLeft className="w-4 h-4 mr-1"/> {backLink.label}
            </Link>
          )}
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Home className="h-5 w-5 text-primary"/> Acheter Appart/Villa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Réservez et achetez une unité (appartement, villa) dans un projet de promoteur.</p>
          <ul className="list-disc pl-5">
            <li>Choix de l'unité</li>
            <li>Options de paiement (comptant, échelonné, financement)</li>
            <li>Suivi administratif</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseUnitsPage;
