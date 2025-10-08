import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  DollarSign, 
  TrendingUp, 
  Users,
  Target,
  Lightbulb,
  CheckCircle 
} from 'lucide-react';

/**
 * AIAnalysisModal - Modal affichant l'analyse IA complète d'une propriété
 * @param {boolean} open - État d'ouverture du modal
 * @param {function} onOpenChange - Callback pour changer l'état
 * @param {object} property - Propriété analysée
 * @param {object} analysis - Résultats de l'analyse IA
 */
const AIAnalysisModal = ({ open, onOpenChange, property, analysis }) => {
  if (!analysis || !property) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getDemandColor = (demand) => {
    const colors = {
      'Élevé': 'bg-green-100 text-green-800',
      'Moyen': 'bg-yellow-100 text-yellow-800',
      'Faible': 'bg-red-100 text-red-800'
    };
    return colors[demand] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Analyse IA Complète
          </DialogTitle>
          <DialogDescription>
            Analyse intelligente de "{property.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Score Global */}
          <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(analysis.score)}`}>
              {analysis.score}
            </div>
            <p className="text-gray-600 font-medium">Score IA Global</p>
            <Progress value={analysis.score} className="h-2 mt-3" />
          </div>

          {/* Optimisation Prix */}
          <div className="border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Optimisation du Prix
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-600">Prix Actuel</p>
                <p className="text-lg font-bold">{formatCurrency(analysis.pricing.current)}</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="text-sm text-gray-600">Prix Recommandé IA</p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(analysis.pricing.recommended)}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded">
              <span className="text-sm font-medium">Confiance IA</span>
              <Badge className="bg-blue-600">{analysis.pricing.confidence}%</Badge>
            </div>
          </div>

          {/* Analyse Marché */}
          <div className="border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Analyse du Marché
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600 mb-2">Demande</p>
                <Badge className={getDemandColor(analysis.market.demand)}>
                  {analysis.market.demand}
                </Badge>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600 mb-1">Concurrence</p>
                <p className="text-xl font-bold text-gray-900">
                  {analysis.market.competition}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600 mb-1">Délai Vente</p>
                <p className="text-xl font-bold text-gray-900">
                  {analysis.market.averageSaleTime}j
                </p>
              </div>
            </div>
          </div>

          {/* Recommandations IA */}
          <div className="border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Recommandations IA
            </h3>
            <div className="space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-yellow-50 rounded">
                  <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Résumé */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Conclusion :</strong> Cette propriété présente un score de {analysis.score}/100. 
              {analysis.score >= 90 && " Excellente opportunité de vente rapide !"}
              {analysis.score >= 75 && analysis.score < 90 && " Bon potentiel avec quelques améliorations."}
              {analysis.score < 75 && " Quelques optimisations recommandées."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIAnalysisModal;
