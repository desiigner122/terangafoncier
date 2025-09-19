import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  TrendingUp, 
  Calculator,
  MapPin,
  Bell,
  Minimize2,
  Maximize2,
  BarChart3,
  Zap,
  Brain,
  Sparkles,
  DollarSign,
  Home,
  Users,
  Clock,
  Star,
  ChevronUp,
  ChevronDown,
  Copy,
  Download,
  Share2,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { aiService } from '@/services/AIService';

const GlobalAIAssistant = ({ currentPage, currentData, userProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [insights, setInsights] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef(null);

  // Messages de bienvenue contextuels
  const getWelcomeMessage = () => {
    const welcomeMessages = {
      'home': 'Bienvenue sur Teranga Foncier ! Je peux vous aider Ï  évaluer des biens, analyser le marché ou vous conseiller.',
      'parcelles': 'Je vois que vous consultez des parcelles. Voulez-vous que j\'analyse les prix ou les tendances de cette zone ?',
      'construction-requests': 'Besoin d\'aide avec les demandes de construction ? Je peux estimer les coûts ou recommander des promoteurs.',
      'dashboard': 'Voici votre tableau de bord. Je peux générer des rapports personnalisés ou analyser vos investissements.',
      'profile': 'Je peux vous aider Ï  optimiser votre profil ou vous donner des conseils d\'investissement personnalisés.'
    };
    
    return welcomeMessages[currentPage] || welcomeMessages['home'];
  };

  // Initialisation avec message de bienvenue
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 1,
        type: 'ai',
        content: getWelcomeMessage(),
        timestamp: new Date(),
        suggestions: [
          'Évaluer un bien',
          'Analyser le marché',
          'Conseils d\'investissement',
          'Calculer la rentabilité'
        ]
      }]);
    }
  }, [currentPage]);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Chargement des insights contextuels
  useEffect(() => {
    loadContextualInsights();
    loadNotifications();
  }, [currentPage, currentData]);

  const loadContextualInsights = async () => {
    if (!currentData) return;
    
    setIsAnalyzing(true);
    try {
      let contextualInsights;
      
      if (currentPage === 'parcelles' && currentData.location) {
        contextualInsights = await aiService.getMarketInsights(currentData.location);
      } else if (currentData.surface && currentData.location) {
        const analysis = await aiService.analyzePriceForProperty(currentData);
        contextualInsights = { priceAnalysis: analysis };
      }
      
      setInsights(contextualInsights);
    } catch (error) {
      console.error('Erreur lors du chargement des insights:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const userNotifications = await aiService.generateSmartNotifications(userProfile?.id);
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    try {
      const response = await aiService.generateChatResponse(currentMessage, {
        page: currentPage,
        propertyData: currentData,
        userProfile: userProfile
      });

      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: response.response,
          data: response.data,
          suggestions: response.suggestions,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      setIsTyping(false);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Désolé, j\'ai rencontré une erreur. Pouvez-vous reformuler votre question ?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCurrentMessage(suggestion);
    handleSendMessage();
  };

  const generateReport = async () => {
    setIsAnalyzing(true);
    try {
      const report = await aiService.generateMarketReport();
      // Logique pour afficher ou télécharger le rapport
      console.log('Rapport généré:', report);
    } catch (error) {
      console.error('Erreur génération rapport:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="relative">
            <Bot className="w-8 h-8 text-white" />
            {notifications.length > 0 && (
              <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 bg-red-500 text-white text-xs">
                {notifications.length}
              </Badge>
            )}
          </div>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed bottom-6 right-6 z-50 bg-white rounded-xl shadow-2xl border transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="w-6 h-6" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
          </div>
          <div>
            <h3 className="font-semibold">Assistant IA Teranga</h3>
            <p className="text-xs opacity-90">Intelligence immobilière</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-white/20"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex flex-col h-[calc(100%-64px)]">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-4 m-4 mb-0">
              <TabsTrigger value="chat" className="text-xs">
                <MessageCircle className="w-3 h-3 mr-1" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="insights" className="text-xs">
                <BarChart3 className="w-3 h-3 mr-1" />
                Insights
              </TabsTrigger>
              <TabsTrigger value="alerts" className="text-xs">
                <Bell className="w-3 h-3 mr-1" />
                Alertes
                {notifications.length > 0 && (
                  <Badge className="ml-1 w-4 h-4 p-0 bg-red-500 text-white text-xs">
                    {notifications.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="tools" className="text-xs">
                <Calculator className="w-3 h-3 mr-1" />
                Outils
              </TabsTrigger>
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat" className="flex-1 flex flex-col m-4 mt-0">
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-96">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.suggestions && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-6"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex gap-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Posez votre question..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights" className="flex-1 p-4 overflow-y-auto">
              {isAnalyzing ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Analyse en cours...</p>
                  </div>
                </div>
              ) : insights ? (
                <div className="space-y-4">
                  {insights.priceAnalysis && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Analyse de Prix
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-center p-3 bg-blue-50 rounded">
                          <div className="text-lg font-bold text-blue-600">
                            {insights.priceAnalysis.priceRange.estimated.toLocaleString()} FCFA
                          </div>
                          <div className="text-xs text-gray-600">Prix estimé</div>
                        </div>
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span>Confiance:</span>
                            <span>{Math.round(insights.priceAnalysis.analysis.confidence * 100)}%</span>
                          </div>
                          <Progress value={insights.priceAnalysis.analysis.confidence * 100} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {insights.currentTrend && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Tendance Marché
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span>Direction:</span>
                            <Badge variant="outline">{insights.currentTrend.direction}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Croissance:</span>
                            <span className="text-green-600">+{insights.currentTrend.percentage}%</span>
                          </div>
                          <p className="text-gray-600 mt-2">{insights.currentTrend.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 text-sm">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Sélectionnez une propriété pour voir les insights</p>
                </div>
              )}
            </TabsContent>

            {/* Alerts Tab */}
            <TabsContent value="alerts" className="flex-1 p-4 overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2">
                          <Bell className="w-4 h-4 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {notification.type}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {notification.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 text-sm">
                  <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Aucune nouvelle alerte</p>
                </div>
              )}
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools" className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start text-xs"
                  onClick={generateReport}
                  disabled={isAnalyzing}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Générer rapport marché
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start text-xs"
                  onClick={() => handleSuggestionClick('Calculer la rentabilité')}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculateur rentabilité
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start text-xs"
                  onClick={() => handleSuggestionClick('Analyser ma zone')}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Analyser une zone
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start text-xs"
                  onClick={() => handleSuggestionClick('Évaluer un bien')}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Évaluateur de bien
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start text-xs"
                  onClick={() => handleSuggestionClick('Conseils d\'investissement')}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Conseils IA
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </motion.div>
  );
};

export default GlobalAIAssistant;

