import React, { useState, useEffect, useContext } from 'react';
import { MessageSquare, Bot, X, Send, Minimize2, Maximize2, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import OpenAIService from '@/services/ai/OpenAIService';

// Assistant IA contextuel pour chaque page
const ContextualAIAssistant = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const location = useLocation();
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  // Configuration contextuelle par page
  const getPageContext = () => {
    const path = location.pathname;
    
    if (path.includes('private-interests')) {
      return {
        title: 'Assistant Terrains Privés',
        expertise: 'négociation immobilière',
        suggestions: [
          'Comment évaluer ce prix ?',
          'Stratégie de négociation ?',
          'Documents à vérifier ?',
          'Risques juridiques ?'
        ],
        welcomeMessage: "Je vous aide pour vos négociations de terrains privés. Posez-moi vos questions sur l'évaluation, la négociation ou les aspects juridiques !",
        color: 'blue'
      };
    }
    
    if (path.includes('municipal-applications')) {
      return {
        title: 'Assistant Demandes Communales',
        expertise: 'procédures administratives',
        suggestions: [
          'Documents manquants ?',
          'Délais de traitement ?',
          'Recours possible ?',
          'Coût total estimé ?'
        ],
        welcomeMessage: "Je vous accompagne dans vos démarches administratives. Questions sur les documents, délais, ou procédures ?",
        color: 'green'
      };
    }
    
    if (path.includes('promoter-reservations')) {
      return {
        title: 'Assistant Projets VEFA',
        expertise: 'constructions VEFA',
        suggestions: [
          'Échéancier paiement ?',
          'Suivi du chantier ?',
          'Garanties constructeur ?',
          'Modifications possibles ?'
        ],
        welcomeMessage: "Expert en VEFA, je vous guide sur les paiements, le suivi de chantier et vos droits d'acheteur !",
        color: 'orange'
      };
    }
    
    if (path.includes('owned-properties')) {
      return {
        title: 'Assistant Blockchain & NFT',
        expertise: 'tokenisation immobilière',
        suggestions: [
          'Valeur du token ?',
          'Frais blockchain ?',
          'Dividendes attendus ?',
          'Revente possible ?'
        ],
        welcomeMessage: "Spécialiste blockchain immobilier, je vous explique la tokenisation, les rendements et les aspects techniques !",
        color: 'purple'
      };
    }
    
    return {
      title: 'Assistant Teranga Foncier',
      expertise: 'immobilier sénégalais',
      suggestions: [
        'Par où commencer ?',
        'Meilleur investissement ?',
        'Risques à éviter ?',
        'Tendances du marché ?'
      ],
      welcomeMessage: "Bonjour ! Je suis votre assistant immobilier intelligent. Comment puis-je vous aider aujourd'hui ?",
      color: 'blue'
    };
  };

  const pageContext = getPageContext();

  // Réponse IA générée par le service OpenAI réel (avec repli en mode simulation si aucune clé API n'est configurée)
  const generateAIResponse = async (question) => {
    return OpenAIService.getChatResponse(question, {
      page: pageContext.title,
      expertise: pageContext.expertise,
      path: location.pathname
    });
  };

  // Initialisation avec message de bienvenue
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 1,
        type: 'ai',
        content: pageContext.welcomeMessage,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, pageContext.welcomeMessage]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const questionText = inputValue;
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: questionText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const aiContent = await generateAIResponse(questionText);

      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);

      // Enregistre l'échange dans l'historique IA (best effort, ne bloque pas l'UI)
      if (user?.id) {
        supabase
          .from('ai_chat_history')
          .insert([
            { user_id: user.id, role: 'user', content: questionText },
            { user_id: user.id, role: 'assistant', content: aiContent }
          ])
          .then(({ error }) => {
            if (error) console.error('Erreur enregistrement historique IA:', error);
          });
      }

      // Notification pour réponse IA importante
      if (questionText.toLowerCase().includes('urgent') || questionText.toLowerCase().includes('problème')) {
        addNotification({
          title: 'Réponse IA importante',
          message: 'L\'assistant a identifié un point critique dans votre question',
          type: 'messages',
          priority: 'high'
        });
      }
    } catch (error) {
      console.error('Erreur assistant IA contextuel:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'ai',
        content: "Désolé, je ne peux pas répondre pour le moment. Veuillez réessayer.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
  };

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Button
          onClick={() => setIsOpen(true)}
          className={`rounded-full p-4 shadow-lg bg-${pageContext.color}-600 hover:bg-${pageContext.color}-700`}
          size="lg"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Card className={`w-96 ${isMinimized ? 'h-16' : 'h-[500px]'} shadow-xl border-${pageContext.color}-200`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 bg-${pageContext.color}-50 border-b`}>
          <div className="flex items-center space-x-2">
            <Bot className={`h-5 w-5 text-${pageContext.color}-600`} />
            <h3 className="font-semibold text-sm">{pageContext.title}</h3>
            <Badge variant="secondary" className="text-xs">{pageContext.expertise}</Badge>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto" style={{ height: '320px' }}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.content}
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Suggestions rapides */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-1">
                  {pageContext.suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Posez votre question..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ContextualAIAssistant;