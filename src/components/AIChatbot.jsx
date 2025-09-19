import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2, 
  HelpCircle, 
  Sparkles, 
  Coffee, 
  Clock, 
  CheckCircle2
} from 'lucide-react';
import aiManager from '@/lib/aiManager';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '👋 Bonjour ! Je suis votre assistant IA Teranga Foncier. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date(),
      suggestions: [
        'Comment acheter un terrain ?',
        'Procédures administratives',
        'Contact avec un notaire',
        'Rechercher par région'
      ]
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Réponses prédéfinies intelligentes
  const getAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('terrain') || message.includes('acheter')) {
      return {
        content: '🏡 Pour acheter un terrain au Sénégal :\n\n1. Vérifiez le statut foncier\n2. Obtenez un certificat de non-gage\n3. Contactez un notaire\n4. Négociez le prix\n5. Signez l\'acte de vente\n\nVoulez-vous que je vous mette en contact avec nos partenaires ?',
        suggestions: ['Trouver un notaire', 'Voir les terrains disponibles', 'Guide complet']
      };
    }
    
    if (message.includes('notaire') || message.includes('acte')) {
      return {
        content: '⚖️ Nos notaires partenaires peuvent vous aider :\n\n• Rédaction d\'actes authentiques\n• Vérification de titres fonciers\n• Conseils juridiques\n• Sécurisation des transactions\n\nTarifs transparents et service rapide garanti.',
        suggestions: ['Liste des notaires', 'Prendre RDV', 'Tarifs']
      };
    }
    
    if (message.includes('région') || message.includes('dakar') || message.includes('thiès')) {
      return {
        content: '📍 Recherche par région :\n\n🏙️ Dakar : 2,847 biens\n🌆 Thiès : 1,293 biens\n🏞️ Saint-Louis : 687 biens\n🌊 Ziguinchor : 445 biens\n\nQuelle région vous intéresse le plus ?',
        suggestions: ['Voir Dakar', 'Voir Thiès', 'Toutes les régions']
      };
    }
    
    if (message.includes('prix') || message.includes('coût') || message.includes('tarif')) {
      return {
        content: '💰 Information sur les prix :\n\n• Terrain urbain Dakar : 150,000 - 800,000 FCFA/m²\n• Terrain périphérie : 50,000 - 200,000 FCFA/m²\n• Frais notariaux : 3-5% du prix\n• Taxes : 7% (droits d\'enregistrement)\n\nPrix indicatifs, variables selon localisation.',
        suggestions: ['Calculateur de frais', 'Estimation gratuite', 'Financement']
      };
    }
    
    if (message.includes('procédure') || message.includes('étapes') || message.includes('comment')) {
      return {
        content: '📋 Procédures simplifiées :\n\n✅ 1. Recherche du bien\n✅ 2. Vérification légale\n✅ 3. Négociation\n✅ 4. Promesse de vente\n✅ 5. Financement\n✅ 6. Acte définitif\n\nChaque étape est accompagnée par nos experts.',
        suggestions: ['Guide détaillé', 'Suivi personnalisé', 'Questions fréquentes']
      };
    }
    
    // Réponse par défaut
    return {
      content: '🤖 Je comprends votre question ! Voici les domaines où je peux vous aider :\n\n• Achat/vente de terrains\n• Procédures administratives\n• Contact avec professionnels\n• Recherche par critères\n• Estimation de prix\n• Conseils juridiques\n\nPosez-moi une question plus spécifique !',
      suggestions: ['Acheter un terrain', 'Vendre mon bien', 'Trouver un expert', 'Guide complet']
    };
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = newMessage;
    setNewMessage('');
    setIsTyping(true);

    try {
      let aiResponse;
      
      if (aiManager.isEnabled) {
        // Utiliser l'IA réelle OpenAI
        const response = await aiManager.generateContextualResponse(currentMessage, {
          pathname: '/chatbot',
          contextualQuestions: ['Comment acheter un terrain ?', 'Procédures administratives', 'Contact avec un notaire']
        });
        
        aiResponse = {
          content: response,
          suggestions: ['Plus d\'infos', 'Parler à un agent', 'Voir les parcelles', 'Calculer les frais']
        };
      } else {
        // Fallback sur réponses prédéfinies
        aiResponse = getAIResponse(currentMessage);
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erreur chatbot IA:', error);
      
      // Message d'erreur convivial
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: '🤖 Désolé, je rencontre un petit problème technique. Pourriez-vous reformuler votre question ?',
        timestamp: new Date(),
        suggestions: ['Recommencer', 'Contacter le support']
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setIsTyping(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setNewMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
        
        {/* Badge de notification */}
        <motion.div
          className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Sparkles className="h-2 w-2 text-white" />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`fixed bottom-6 right-6 z-50 ${isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'}`}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
    >
      <Card className="h-full flex flex-col shadow-2xl border-0 bg-white">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bot className="h-8 w-8" />
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <CardTitle className="text-lg">Assistant IA</CardTitle>
              <p className="text-sm opacity-90">Teranga Foncier</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-white/20"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
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
                      <div className={`p-3 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      
                      {/* Suggestions */}
                      {message.suggestions && (
                        <div className="mt-2 space-y-1">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs mr-1 mb-1"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ml-2 mr-2 ${
                      message.type === 'user' ? 'order-1 bg-blue-500' : 'order-2 bg-gray-200'
                    }`}>
                      {message.type === 'user' ? 
                        <User className="h-4 w-4 text-white" /> : 
                        <Bot className="h-4 w-4 text-gray-600" />
                      }
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-gray-500"
                >
                  <Bot className="h-4 w-4" />
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre question..."
                  className="flex-1 min-h-[44px] max-h-32 resize-none"
                  rows={1}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 mt-2 text-center">
                Assistant IA disponible 24h/24 • Réponses instantanées
              </p>
            </div>
          </>
        )}
      </Card>
    </motion.div>
  );
};

export default AIChatbot;

