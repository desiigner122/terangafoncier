import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getActionForStage } from '@/config/workflowActions';

/**
 * Composant qui affiche le bouton d'action approprié pour l'étape actuelle
 * selon le rôle de l'utilisateur (buyer, seller, notary, geometre)
 */
export const WorkflowActionButton = ({ 
  caseData, 
  userRole, 
  onActionComplete 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const action = getActionForStage(userRole, caseData.status);

  // Si pas d'action pour ce rôle à cette étape, ne rien afficher
  if (!action) {
    return null;
  }

  const handleAction = async (targetStage) => {
    setLoading(true);
    setError(null);

    try {
      // Mettre à jour le statut du dossier
      const { error: updateError } = await supabase
        .from('purchase_cases')
        .update({ 
          status: targetStage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', caseData.id);

      if (updateError) throw updateError;

      // Créer une entrée dans l'historique (si la table existe)
      await supabase
        .from('case_history')
        .insert({
          case_id: caseData.id,
          action: `${userRole}_validated_${caseData.status}`,
          stage: targetStage,
          performed_by: (await supabase.auth.getUser()).data.user.id,
          metadata: {
            previous_stage: caseData.status,
            new_stage: targetStage,
          },
        })
        .maybeSingle();

      // Callback de succès
      if (onActionComplete) {
        onActionComplete(targetStage);
      }
    } catch (err) {
      console.error('Error updating case status:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!action.rejectOption) return;
    handleAction(action.rejectOption.nextStage);
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Action requise
            </h3>
            <p className="text-sm text-blue-800 mt-1">{action.description}</p>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={() => handleAction(action.nextStage)}
              disabled={loading}
              className={action.buttonColor}
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {action.label}
                </>
              )}
            </Button>

            {action.rejectOption && (
              <Button
                onClick={handleReject}
                disabled={loading}
                variant="outline"
                className={action.rejectOption.buttonColor}
              >
                {action.rejectOption.label}
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
