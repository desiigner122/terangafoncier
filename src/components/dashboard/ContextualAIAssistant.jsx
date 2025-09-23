import React, { useState, useEffect, useContext } from 'react';
import { MessageSquare, Bot, X, Send, Minimize2, Maximize2, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';

// Assistant IA contextuel pour chaque page
const ContextualAIAssistant = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const location = useLocation();
  const { addNotification } = useNotifications();

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

  // Réponses intelligentes contextuelle
  const generateAIResponse = (question) => {
    const responses = {
      'private-interests': {
        'prix': 'Pour évaluer ce prix, comparons avec les transactions récentes dans le secteur. Les Almadies sont à 85-120k FCFA/m² selon l\'emplacement. Ce prix semble dans la fourchette haute.',
        'négociation': 'Je recommande une contre-offre à -15% du prix demandé, en mettant en avant vos atouts (paiement rapide, sérieux du dossier). Laissez une marge de négociation.',
        'documents': 'Vérifiez impérativement : titre foncier, certificat de non-gage, bornage géomètre, quitus fiscal. Je peux vous aider à analyser ces documents.',
        'juridique': 'Principaux risques : vice de titre, litige de bornage, servitudes cachées. Je recommande un avocat spécialisé pour l\'acte notarié.'
      },
      'municipal-applications': {
        'documents': 'D\'après votre dossier Mbour, il manque : certificat de célibat, quitus fiscal, et plan de situation. Délai supplémentaire estimé : 15 jours.',
        'délais': 'Traitement standard : 3-6 mois à Mbour, 4-8 mois à Thiès. Votre dossier Mbour est à 60% complété, prévoir encore 8 semaines.',
        'recours': 'En cas de refus, vous avez 30 jours pour un recours gracieux, puis recours contentieux devant le tribunal administratif. Success rate : 40%.',
        'coût': 'Coût total estimé Mbour : 850k FCFA (droits + taxes + géomètre). Thiès : 650k FCFA. Budget 15% supplémentaire pour imprévus.'
      },
      'promoter-reservations': {
        'paiement': 'Votre échéancier VEFA : 15% signature (✓), 25% fondations (oct 2024), 35% gros œuvre (mars 2025), 25% finitions (oct 2025). Prochaine : 11.25M FCFA.',
        'chantier': 'Villa Cité Jardin : 75% avancé, conforme au planning. Étape finitions en cours. Je recommande une visite avant paiement suivant.',
        'garanties': 'Garanties légales : parfait achèvement (1 an), bon fonctionnement (2 ans), décennale (10 ans). Vérifiez les assurances du promoteur.',
        'modifications': 'Modifications encore possibles : choix carrelage, peinture, équipements cuisine/SDB. Surcoût estimé : 5-15% selon options.'
      },
      'owned-properties': {
        'token': 'Token Almadies : +8.2% cette semaine. Basé sur éval. marché + revenus locatifs. Performance YTD : +15.7%. Bon momentum.',
        'frais': 'Frais blockchain : 0.3% par transaction. Gas fees Polygon : ~0.01 MATIC. Frais plateforme : 1.5% annuels sur revenus.',
        'dividendes': 'Rendement Plateau : 7.2% net annuel, Almadies : 5.8%. Prochaine distribution dans 12 jours : ~47k FCFA attendus.',
        'revente': 'Liquidité élevée : moyenne 72h pour vente. Prix de marché en temps réel. Commission : 2.5% + frais blockchain.'
      }
    };

    const contextKey = Object.keys(responses).find(key => location.pathname.includes(key));
    const contextResponses = contextKey ? responses[contextKey] : {};
    
    const matchedResponse = Object.entries(contextResponses).find(([key]) => 
      question.toLowerCase().includes(key)
    );

    if (matchedResponse) {
      return matchedResponse[1];
    }

    // Réponse générique intelligente
    return "C'est une excellente question ! Basé sur votre profil et vos projets en cours, je vous recommande de vérifier les dernières données de marché. Voulez-vous que je vous donne des informations plus spécifiques ?";
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

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulation réponse IA avec délai réaliste
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateAIResponse(inputValue),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

      // Notification pour réponse IA importante
      if (inputValue.toLowerCase().includes('urgent') || inputValue.toLowerCase().includes('problème')) {
        addNotification({
          title: 'Réponse IA importante',
          message: 'L\'assistant a identifié un point critique dans votre question',
          type: 'messages',
          priority: 'high'
        });
      }
    }, 1500 + Math.random() * 1000);
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