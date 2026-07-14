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
import { supabase } from '@/lib/supabaseClient';

const AIAssistantWidget = ({ userRole, dashboardData }) => {
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(0);

  useEffect(() => {
    generateAIRecommendations();
  }, [userRole, dashboardData]);

  const generateAIRecommendations = async () => {
    setAiProcessing(true);

    try {
      const recommendations = await getRecommendationsByRole(userRole);
      setAiRecommendations(recommendations);

      const averageConfidence = recommendations.length > 0
        ? Math.round(
            recommendations.reduce((sum, rec) => sum + (rec.confidence || 0), 0) / recommendations.length
          )
        : 0;
      setConfidenceScore(averageConfidence);
    } catch (error) {
      console.error('Erreur chargement recommandations IA:', error);
      setAiRecommendations([]);
      setConfidenceScore(0);
    }

    setAiProcessing(false);
  };

  // Charge les analyses IA réelles enregistrées pour ce rôle utilisateur
  const getRecommendationsByRole = async (role) => {
    const { data, error } = await supabase
      .from('ai_analyses')
      .select('id, result, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    return (data || []).map((row) => {
      const result = row.result || {};
      return {
        type: result.type || 'opportunity',
        title: result.title || 'Recommandation IA',
        description: result.description || '',
        confidence: result.confidence || 0,
        action: result.action || 'Voir le détail',
        priority: result.priority || 'medium',
        category: result.category || role || 'Général'
      };
    });
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
          ) : aiRecommendations.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Aucune recommandation IA disponible pour le moment.</p>
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
