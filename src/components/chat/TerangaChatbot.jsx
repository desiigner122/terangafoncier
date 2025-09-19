import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Minimize2, 
  Maximize2, 
  Bot,
  User,
  Loader,
  Paperclip,
  Mic,
  MicOff,
  Image,
  MapPin,
  Calculator,
  TrendingUp,
  X,
  Lightbulb,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { terangaAI } from '@/services/TerangaAIService';

const TerangaChatbot = ({ dashboardData = {}, context = {} }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [typingIndicator, setTypingIndicator] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognition = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'fr-FR';

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'bot',
        content: getWelcomeMessage(),
        timestamp: Date.now(),
        suggestions: getInitialSuggestions()
      };
      setMessages([welcomeMessage]);
      setSuggestions(getInitialSuggestions());
    }
  }, [isOpen, user]);

  const getWelcomeMessage = () => {
    const roleMessages = {
      'particulier': `Bonjour ! Je suis l'assistant IA de Teranga Foncier. Je peux vous aider Ï  trouver le bien immobilier parfait, estimer des prix, calculer votre capacité d'emprunt et bien plus. Comment puis-je vous assister aujourd'hui ?`,
      'vendeur': `Salut ! Je suis lÏ  pour optimiser vos ventes immobilières. Je peux analyser vos prix, suggérer des améliorations, gérer votre portfolio et attirer plus d'acheteurs. Que souhaitez-vous améliorer ?`,
      'investisseur': `Bonjour ! Expert en investissement immobilier Ï  votre service. Je peux analyser vos opportunités, optimiser votre portefeuille, évaluer les risques et prédire les rendements. Parlons stratégie !`,
      'promoteur': `Salut ! Je suis spécialisé dans le développement immobilier. Planification de projets, analyse de faisabilité, recherche d'investisseurs, gestion de chantiers - je peux tout gérer. Quel projet développons-nous ?`,
      'municipalite': `Bonjour ! Je vous assiste dans la gestion urbaine et les approbations. Planification territoriale, conformité réglementaire, analyse d'impact - je simplifie vos processus. Comment puis-je aider ?`,
      'notaire': `Bonjour Maître ! Spécialiste en droit immobilier, je vous aide avec les actes, les vérifications juridiques, la conformité et la gestion de vos dossiers. Quel acte traitons-nous ?`,
      'geometre': `Salut ! Expert en topographie et géométrie, je peux analyser vos relevés, optimiser vos missions, gérer vos équipements et calculer vos tarifs. Quelle mission planifions-nous ?`,
      'banque': `Bonjour ! Spécialiste du crédit immobilier, j'évalue les risques, optimise les portefeuilles, calcule les mensualités et analyse la solvabilité. Quel dossier étudions-nous ?`,
      'admin': `Bonjour ! Vue d'ensemble de la plateforme Ï  votre disposition. Monitoring, analytics, gestion utilisateurs, reporting - je vous aide Ï  superviser efficacement.`
    };

    return roleMessages[user?.role] || `Bonjour ! Je suis l'assistant IA de Teranga Foncier. Comment puis-je vous aider aujourd'hui ?`;
  };

  const getInitialSuggestions = () => {
    const roleSuggestions = {
      'particulier': [
        'Rechercher un bien immobilier',
        'Calculer ma capacité d\'emprunt',
        'Estimer le prix d\'un bien',
        'Conseils pour premier achat'
      ],
      'vendeur': [
        'Optimiser le prix de vente',
        'Améliorer la visibilité',
        'Analyser la concurrence',
        'Stratégies marketing'
      ],
      'investisseur': [
        'Analyser une opportunité',
        'Optimiser mon portefeuille',
        'Prédictions du marché',
        'Calcul de rentabilité'
      ],
      'promoteur': [
        'Évaluer la faisabilité',
        'Trouver des investisseurs',
        'Planifier le projet',
        'Analyse des coûts'
      ],
      'municipalite': [
        'Approuver un projet',
        'Vérifier la conformité',
        'Analyser l\'impact urbain',
        'Gestion des permis'
      ],
      'notaire': [
        'Préparer un acte',
        'Vérifier la légalité',
        'Calculer les frais',
        'Gestion du planning'
      ],
      'geometre': [
        'Planifier une mission',
        'Calculer les tarifs',
        'Gérer les équipements',
        'Analyse topographique'
      ],
      'banque': [
        'Évaluer un risque crédit',
        'Calculer une mensualité',
        'Analyser la solvabilité',
        'Optimiser le taux'
      ],
      'admin': [
        'État de la plateforme',
        'Analytics utilisateurs',
        'Rapport financier',
        'Gestion des alertes'
      ]
    };

    return roleSuggestions[user?.role] || [
      'Comment ça marche ?',
      'Mes fonctionnalités',
      'Aide générale',
      'Contact support'
    ];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setTypingIndicator(true);

    try {
      // Prepare context for AI
      const aiContext = {
        userRole: user?.role,
        dashboardData,
        ...context,
        recentMessages: messages.slice(-5)
      };

      // Get AI response
      const aiResponse = await terangaAI.chatWithAI(inputMessage, aiContext, user?.role);

      // Simulate typing delay
      setTimeout(() => {
        setTypingIndicator(false);
        
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: aiResponse.response,
          timestamp: Date.now(),
          suggestions: aiResponse.suggestions,
          confidence: aiResponse.confidence,
          actions: generateQuickActions(inputMessage, aiResponse)
        };

        setMessages(prev => [...prev, botMessage]);
        setSuggestions(aiResponse.suggestions);
        setIsLoading(false);
      }, 1000 + Math.random() * 1500);

    } catch (error) {
      console.error('Chat error:', error);
      setTypingIndicator(false);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Désolé, je rencontre des difficultés techniques. Veuillez réessayer dans quelques instants.',
        timestamp: Date.now(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const generateQuickActions = (userMessage, aiResponse) => {
    const actions = [];
    
    // Analyze message intent and add relevant quick actions
    if (userMessage.toLowerCase().includes('prix') || userMessage.toLowerCase().includes('estim')) {
      actions.push({
        icon: Calculator,
        label: 'Calculatrice Prix',
        action: 'open_calculator'
      });
    }
    
    if (userMessage.toLowerCase().includes('marché') || userMessage.toLowerCase().includes('tendance')) {
      actions.push({
        icon: TrendingUp,
        label: 'Analyse Marché',
        action: 'market_analysis'
      });
    }
    
    if (userMessage.toLowerCase().includes('lieu') || userMessage.toLowerCase().includes('zone')) {
      actions.push({
        icon: MapPin,
        label: 'Voir sur Carte',
        action: 'show_map'
      });
    }

    return actions;
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const handleVoiceInput = () => {
    if (!recognition.current) return;

    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      recognition.current.start();
      setIsListening(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
          size="lg"
          className="rounded-full w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle className="h-8 w-8 text-white" />
        </Button>
        
        {/* Notification Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
        >
          <span className="text-white text-xs font-bold">IA</span>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: 50, y: 50 }}
      animate={{ 
        opacity: 1, 
        scale: isMinimized ? 0.8 : 1,
        x: 0, 
        y: 0,
        height: isMinimized ? 60 : 500
      }}
      className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 ${isMinimized ? 'w-80' : 'w-96'}`}
      style={{ maxHeight: isMinimized ? '60px' : '500px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bot className="h-8 w-8" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-semibold">Assistant IA Teranga</h3>
            <p className="text-xs opacity-90">En ligne â€¢ Réponse immédiate</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-white/20 p-1"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                        {message.type === 'user' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>
                      
                      <div className={`rounded-2xl p-3 ${message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : message.isError 
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : 'bg-gray-50 text-gray-800'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        
                        {message.confidence && (
                          <div className="mt-2 flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              Confiance: {Math.round(message.confidence * 100)}%
                            </Badge>
                            <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                          </div>
                        )}

                        {/* Quick Actions */}
                        {message.actions && message.actions.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.actions.map((action, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => handleActionClick(action.action)}
                              >
                                <action.icon className="h-3 w-3 mr-1" />
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {typingIndicator && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {suggestions.slice(0, 3).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs bg-blue-50 hover:bg-blue-100 border-blue-200"
                  >
                    <Lightbulb className="h-3 w-3 mr-1" />
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  YOUR_API_KEY="Tapez votre message..."
                  className="pr-20"
                  disabled={isLoading}
                />
                
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleVoiceInput}
                    className={`p-1 ${isListening ? 'text-red-600' : 'text-gray-400'}`}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 text-gray-400"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );

  function handleActionClick(action) {
    // Handle quick actions
    switch (action) {
      case 'open_calculator':
        // Open price calculator
        console.log('Opening calculator...');
        break;
      case 'market_analysis':
        // Show market analysis
        console.log('Opening market analysis...');
        break;
      case 'show_map':
        // Show map view
        console.log('Opening map...');
        break;
      default:
        console.log('Unknown action:', action);
    }
  }
};

export default TerangaChatbot;
