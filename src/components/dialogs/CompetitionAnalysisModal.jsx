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
  Target, 
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Zap,
  Shield
} from 'lucide-react';

/**
 * CompetitionAnalysisModal - Modal affichant l'analyse de la concurrence
 * @param {boolean} open - État d'ouverture du modal
 * @param {function} onOpenChange - Callback pour changer l'état
 * @param {object} data - Données de l'analyse concurrence
 */
const CompetitionAnalysisModal = ({ open, onOpenChange, data }) => {
  if (!data) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Analyse de la Concurrence
          </DialogTitle>
          <DialogDescription>
            Analyse comparative de votre position sur le marché
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vue d'ensemble */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-blue-900">{data.totalCompetitors}</p>
              <p className="text-sm text-blue-700">Concurrents Actifs</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-xl font-bold text-green-900">{formatCurrency(data.averagePrice)}</p>
              <p className="text-sm text-green-700">Prix Moyen Marché</p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-purple-900">{data.marketShare}%</p>
              <p className="text-sm text-purple-700">Part de Marché</p>
            </div>
          </div>

          {/* Position sur le marché */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Votre Position sur le Marché
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Part de marché</span>
                  <span className="text-sm font-medium">{data.marketShare}%</span>
                </div>
                <Progress value={data.marketShare} className="h-2" />
              </div>
              <p className="text-xs text-gray-600">
                {data.marketShare >= 20 && "Excellente position ! Vous êtes parmi les leaders du marché."}
                {data.marketShare >= 10 && data.marketShare < 20 && "Position solide. Continuez à optimiser vos annonces."}
                {data.marketShare < 10 && "Opportunités de croissance importantes disponibles."}
              </p>
            </div>
          </div>

          {/* Analyse SWOT */}
          <div className="grid grid-cols-2 gap-4">
            {/* Forces */}
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Forces
              </h4>
              <ul className="space-y-2">
                {data.strengths.map((strength, index) => (
                  <li key={index} className="text-sm text-green-800 flex items-start gap-2">
                    <Zap className="h-3 w-3 mt-1 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Faiblesses */}
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Faiblesses
              </h4>
              <ul className="space-y-2">
                {data.weaknesses.map((weakness, index) => (
                  <li key={index} className="text-sm text-red-800 flex items-start gap-2">
                    <TrendingDown className="h-3 w-3 mt-1 flex-shrink-0" />
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunités */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Opportunités
              </h4>
              <ul className="space-y-2">
                {data.opportunities.map((opportunity, index) => (
                  <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                    <Zap className="h-3 w-3 mt-1 flex-shrink-0" />
                    <span>{opportunity}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Menaces */}
            <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
              <h4 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Menaces
              </h4>
              <ul className="space-y-2">
                {data.threats.map((threat, index) => (
                  <li key={index} className="text-sm text-yellow-800 flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-1 flex-shrink-0" />
                    <span>{threat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommandations Stratégiques */}
          <div className="border-2 border-purple-200 rounded-lg p-4 bg-gradient-to-r from-purple-50 to-blue-50">
            <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Recommandations Stratégiques IA
            </h3>
            <div className="space-y-2">
              <div className="bg-white rounded p-3 border border-purple-100">
                <p className="text-sm text-gray-700">
                  <strong>1. Optimisation Prix :</strong> Vos prix sont {data.marketShare >= 15 ? 'compétitifs' : 'légèrement au-dessus'} de la moyenne du marché. 
                  {data.marketShare < 15 && ' Considérez un ajustement de -5% pour augmenter la visibilité.'}
                </p>
              </div>
              <div className="bg-white rounded p-3 border border-purple-100">
                <p className="text-sm text-gray-700">
                  <strong>2. Différenciation :</strong> Vos atouts blockchain sont uniques. Mettez-les en avant dans vos annonces.
                </p>
              </div>
              <div className="bg-white rounded p-3 border border-purple-100">
                <p className="text-sm text-gray-700">
                  <strong>3. Marketing :</strong> Augmentez votre présence sur les réseaux sociaux pour atteindre {data.totalCompetitors * 2} prospects par mois.
                </p>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <p className="text-sm text-gray-700">
              <strong>Conclusion :</strong> Avec {data.totalCompetitors} concurrents actifs et une part de marché de {data.marketShare}%, 
              vous êtes {data.marketShare >= 15 ? 'bien positionné' : 'en phase de croissance'} sur le marché. 
              Continuez à utiliser l'IA et la blockchain comme avantages compétitifs majeurs.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompetitionAnalysisModal;
