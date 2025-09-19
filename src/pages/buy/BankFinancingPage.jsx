import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';

const BankFinancingPage = () => {
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
        <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-sm text-emerald-800 flex items-center justify-between">
          <div>
            Contexte importé: {context.parcelleId ? `Parcelle #${context.parcelleId}` : `Projet ${context.projectId}`} · Méthode: financement bancaire
          </div>
          {backLink && (
            <Link to={backLink.to} className="inline-flex items-center text-emerald-700 hover:underline">
              <ArrowLeft className="w-4 h-4 mr-1"/> {backLink.label}
            </Link>
          )}
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Banknote className="h-5 w-5 text-primary"/> Financement bancaire</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          {user && (
            <div className="p-3 rounded-md bg-muted/40 border text-foreground">
              Informations acheteur pré-remplies: <span className="font-medium">{profile?.full_name || profile?.name || user.email}</span> · <span className="font-mono">{user.email}</span>
            </div>
          )}
          <p>Constituez votre dossier et demandez un financement bancaire pour l'achat de votre terrain.</p>
          <ul className="list-disc pl-5">
            <li>Pré-qualification</li>
            <li>Dossier justificatif (revenus, garanties, etc.)</li>
            <li>Suivi de la décision de la banque</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankFinancingPage;
