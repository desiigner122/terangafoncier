import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';

const InstallmentsPaymentPage = () => {
  const { state } = useLocation();
  const { user, profile } = useAuth();
  const context = state || {};
  const backLink = useMemo(() => {
    if (context.parcelleId) return { to: `/parcelle/${context.parcelleId}`, label: 'Retour à la parcelle' };
    if (context.projectId) return { to: `/project/${context.projectId}`, label: 'Retour au projet' };
    return null;
  }, [context]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {(context.parcelleId || context.projectId) && (
        <div className="p-3 rounded-md bg-purple-50 border border-purple-200 text-sm text-purple-800 flex items-center justify-between">
          <div>
            Contexte importé: {context.parcelleId ? `Parcelle #${context.parcelleId}` : `Projet ${context.projectId}`} · Méthode: paiement échelonné
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
          <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary"/> Paiement échelonné</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          {user && (
            <div className="p-3 rounded-md bg-muted/40 border text-foreground">
              Informations acheteur pré-remplies: <span className="font-medium">{profile?.full_name || profile?.name || user.email}</span> · <span className="font-mono">{user.email}</span>
            </div>
          )}
          <p>Payez votre terrain en plusieurs mensualités selon un plan convenu avec le vendeur ou le promoteur.</p>
          <ul className="list-disc pl-5">
            <li>Simulation d'échéancier</li>
            <li>Signature d'un calendrier de paiement</li>
            <li>Suivi des versements</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstallmentsPaymentPage;
