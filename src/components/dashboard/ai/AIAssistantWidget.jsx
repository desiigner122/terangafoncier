import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Zap,
  Target,
  BarChart3,
  Lightbulb,
  Activity,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const AIAssistantWidget = ({ userRole, dashboardData }) => {
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(0);

  useEffect(() => {
    generateAIRecommendations();
  }, [userRole, dashboardData]);

  const generateAIRecommendations = async () => {
    setAiProcessing(true);
    
    // Simulation IA - En production, appel API IA réelle
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const recommendations = getRecommendationsByRole(userRole);
    setAiRecommendations(recommendations);
    setConfidenceScore(Math.floor(Math.random() * 20) + 80); // 80-100%
    setAiProcessing(false);
  };

  const getRecommendationsByRole = (role) => {
    const baseRecommendations = {
      'Particulier': [
        {
          type: 'opportunity',
          title: 'Zone Almadies sous-évaluée détectée',
          description: 'Les prix vont augmenter de 18% dans les 6 prochains mois selon nos modèles prédictifs.',
          confidence: 94,
          action: 'Voir les terrains disponibles',
          priority: 'high',
          category: 'Investissement'
        },
        {
          type: 'financial',
          title: 'Optimisation financement détectée',
          description: 'Votre profil est éligible à un crédit à 6.5% au lieu de 8.5% standard.',
          confidence: 87,
          action: 'Simuler crédit',
          priority: 'medium',
          category: 'Financement'
        },
        {
          type: 'alert',
          title: 'Nouvelle zone communale Thiès',
          description: 'Attribution dans 48h. Votre profil correspond aux critères.',
          confidence: 91,
          action: 'Soumettre demande',
          priority: 'urgent',
          category: 'Communal'
        }
      ],
      'Vendeur Particulier': [
        {
          type: 'pricing',
          title: 'Prix optimal détecté',
          description: 'Votre terrain à Liberté 6 peut être vendu 15% au-dessus du prix initial.',
          confidence: 89,
          action: 'Ajuster prix',
          priority: 'high',
          category: 'Pricing'
        },
        {
          type: 'marketing',
          title: 'Meilleur timing publication',
          description: 'Publier demain entre 14h-17h pour 23% plus de vues.',
          confidence: 76,
          action: 'Programmer publication',
          priority: 'medium',
          category: 'Marketing'
        }
      ],
      'Investisseur': [
        {
          type: 'portfolio',
          title: 'Diversification recommandée',
          description: 'Votre portfolio est concentré à 78% sur Dakar. Diversifier vers Thiès.',
          confidence: 92,
          action: 'Voir opportunités Thiès',
          priority: 'medium',
          category: 'Portfolio'
        },
        {
          type: 'roi',
          title: 'ROI exceptionnel détecté',
          description: 'Projet promoteur Zone B: ROI prévu 28% sur 2 ans.',
          confidence: 85,
          action: 'Analyser projet',
          priority: 'high',
          category: 'Opportunité'
        }
      ],
      'Promoteur': [
        {
          type: 'demand',
          title: 'Demande forte détectée',
          description: '47 demandes construction reçues zone Almadies cette semaine.',
          confidence: 95,
          action: 'Créer projet groupé',
          priority: 'high',
          category: 'Demande'
        }
      ],
      'Municipalité': [
        {
          type: 'revenue',
          title: 'Optimisation revenus',
          description: 'Ajuster prix zone C (+12%) basé sur demande actuelle.',
          confidence: 88,
          action: 'Réviser tarification',
          priority: 'medium',
          category: 'Revenue'
        }
      ]
    };

    return baseRecommendations[role] || [];
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };
    return colors[priority] || 'bg-gray-500';
  };

  const getTypeIcon = (type) => {
    const icons = {
      opportunity: Target,
      financial: TrendingUp,
      alert: AlertCircle,
      pricing: BarChart3,
      marketing: Lightbulb,
      portfolio: Activity,
      roi: TrendingUp,
      demand: Activity,
      revenue: TrendingUp
    };
    const IconComponent = icons[type] || Brain;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle className="text-lg">TerangaIA Assistant</CardTitle>
              <CardDescription>
                Recommandations intelligentes basées sur l'IA
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-blue-50">
              Confiance: {confidenceScore}%
            </Badge>
            {aiProcessing && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-sm text-gray-500">Analyse...</span>
              </div>
            )}
          </div>
        </div>
        <Progress value={confidenceScore} className="h-1" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {aiProcessing ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Brain className="h-8 w-8 animate-pulse text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">IA en cours d'analyse...</p>
              </div>
            </div>
          ) : (
            aiRecommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(rec.priority)} mt-2`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {getTypeIcon(rec.type)}
                      <h4 className="font-medium text-sm">{rec.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {rec.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                    <div className="flex items-center justify-between">
                      <button className="text-xs text-blue-600 hover:underline">
                        {rec.action}
                      </button>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-gray-500">{rec.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
        
        {!aiProcessing && aiRecommendations.length > 0 && (
          <div className="mt-4 pt-3 border-t">
            <button 
              onClick={generateAIRecommendations}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center space-x-1"
            >
              <Zap className="h-4 w-4" />
              <span>Actualiser les recommandations IA</span>
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAssistantWidget;
