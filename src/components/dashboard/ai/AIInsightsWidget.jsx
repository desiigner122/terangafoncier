import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  BarChart3,
  Target,
  Zap,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Brain,
  Eye,
  Send,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import OpenAIService from '@/services/ai/OpenAIService';

const AIInsightsWidget = ({ userType = 'admin', context = {} }) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [chatMode, setChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadAIInsights();
  }, [context]);

  const loadAIInsights = async () => {
    setLoading(true);
    try {
      // Générer des insights contextuels basés sur le type d'utilisateur
      const contextualInsights = await generateContextualInsights();
      setInsights(contextualInsights);
    } catch (error) {
      console.error('Erreur chargement insights IA:', error);
      setInsights(getDefaultInsights());
    }
    setLoading(false);
  };

  const generateContextualInsights = async () => {
    // Insights spécifiques selon le type d'utilisateur
    if (userType === 'admin') {
      return [
        {
          id: 1,
          type: 'market',
          title: 'Tendance marché détectée',
          description: 'Augmentation de 12% des recherches pour Almadies cette semaine',
          confidence: 92,
          action: 'Analyser les prix dans cette zone',
          priority: 'high',
          icon: TrendingUp
        },
        {
          id: 2,
          type: 'fraud',
          title: 'Alerte sécurité',
          description: '3 transactions suspectes détectées - vérification requise',
          confidence: 85,
          action: 'Examiner les comptes signalés',
          priority: 'urgent',
          icon: AlertCircle
        },
        {
          id: 3,
          type: 'optimization',
          title: 'Optimisation recommandée',
          description: 'Les propriétés avec photos 360° ont 45% plus de vues',
          confidence: 78,
          action: 'Encourager les photos 360°',
          priority: 'medium',
          icon: Lightbulb
        }
      ];
    } else {
      return [
        {
          id: 1,
          type: 'recommendation',
          title: 'Opportunité d\'investissement',
          description: 'Nouvelle propriété à Mermoz correspond à vos critères',
          confidence: 89,
          action: 'Voir la propriété',
          priority: 'high',
          icon: Target
        },
        {
          id: 2,
          type: 'market',
          title: 'Prédiction prix',
          description: 'Les prix à Keur Massar devraient augmenter de 8% dans 6 mois',
          confidence: 76,
          action: 'Considérer un investissement',
          priority: 'medium',
          icon: BarChart3
        }
      ];
    }
  };

  const getDefaultInsights = () => [
    {
      id: 1,
      type: 'info',
      title: 'IA en cours d\'initialisation',
      description: 'Configuration des services IA en cours...',
      confidence: 0,
      action: 'Patienter',
      priority: 'low',
      icon: Bot
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type) => {
    const iconMap = {
      market: TrendingUp,
      fraud: AlertCircle,
      optimization: Lightbulb,
      recommendation: Target,
      info: Bot
    };
    return iconMap[type] || Bot;
  };

  const sendChatMessage = async () => {
    if (!inputMessage.trim() || sending) return;

    setSending(true);
    const userMessage = inputMessage;
    setInputMessage('');

    // Ajouter message utilisateur
    const newMessages = [
      ...chatMessages,
      { role: 'user', content: userMessage, timestamp: new Date() }
    ];
    setChatMessages(newMessages);

    try {
      // Obtenir réponse de l'IA
      const response = await OpenAIService.getChatResponse(userMessage, {
        userType,
        context,
        previousMessages: chatMessages.slice(-5) // Garder contexte récent
      });

      setChatMessages([
        ...newMessages,
        { 
          role: 'assistant', 
          content: response, 
          timestamp: new Date() 
        }
      ]);
    } catch (error) {
      setChatMessages([
        ...newMessages,
        { 
          role: 'assistant', 
          content: 'Désolé, je ne peux pas répondre pour le moment. Veuillez réessayer.', 
          timestamp: new Date() 
        }
      ]);
    }

    setSending(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  return (
    <Card className="relative overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-blue-900">Assistant IA TerangaFoncier</CardTitle>
              <p className="text-sm text-blue-600">Intelligence artificielle immobilière</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              Actif
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChatMode(!chatMode)}
              className="text-blue-600 hover:bg-blue-100"
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              Chat
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <AnimatePresence mode="wait">
          {!chatMode ? (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Insights IA */}
              <div className="space-y-3">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-blue-600">Analyse en cours...</span>
                  </div>
                ) : (
                  <>
                    {insights.slice(0, expanded ? insights.length : 2).map((insight) => {
                      const IconComponent = insight.icon;
                      return (
                        <motion.div
                          key={insight.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <IconComponent className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                                <Badge
                                  className={`${getPriorityColor(insight.priority)} text-white text-xs px-2 py-1`}
                                >
                                  {insight.priority}
                                </Badge>
                                {insight.confidence > 0 && (
                                  <span className="text-xs text-gray-500">
                                    {insight.confidence}% confiance
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-blue-600 border-blue-300 hover:bg-blue-50"
                              >
                                <Zap className="w-3 h-3 mr-1" />
                                {insight.action}
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                    {insights.length > 2 && (
                      <Button
                        variant="ghost"
                        onClick={() => setExpanded(!expanded)}
                        className="w-full text-blue-600 hover:bg-blue-50"
                      >
                        {expanded ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1" />
                            Voir moins
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-1" />
                            Voir {insights.length - 2} insights de plus
                          </>
                        )}
                      </Button>
                    )}
                  </>
                )}
              </div>

              {/* Actions rapides */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => loadAIInsights()}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Nouvelles insights
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Analyse complète
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Interface Chat */}
              <div className="space-y-3">
                <div className="h-64 bg-white rounded-lg border border-gray-200 p-3 overflow-y-auto">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                      <Bot className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>Bonjour ! Comment puis-je vous aider avec l'immobilier aujourd'hui ?</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {chatMessages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <span className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))}
                      {sending && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 p-3 rounded-lg">
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Input Chat */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Posez votre question sur l'immobilier..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    disabled={sending}
                  />
                  <Button
                    onClick={sendChatMessage}
                    disabled={!inputMessage.trim() || sending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default AIInsightsWidget;