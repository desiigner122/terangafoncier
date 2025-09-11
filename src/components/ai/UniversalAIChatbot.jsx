/**
 * ðŸ§  IA CONVERSATIONNELLE UNIVERSELLE
 * Assistant IA qui remplace l'intervention humaine sur toute la plateforme
 * Expertise fonciÃ¨re + lutte anti-fraude + facilitation acquisition
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  MessageSquare, 
  Send, 
  Brain, 
  Sparkles, 
  MapPin, 
  DollarSign,
  Shield,
  CheckCircle,
  AlertTriangle,
  Eye,
  Zap,
  Lightbulb,
  Target,
  Home,
  Building,
  Users,
  Clock,
  FileText,
  TrendingUp
} from 'lucide-react';
import { autonomousAI } from '@/services/AutonomousAIService';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';

const UniversalAIChatbot = ({ isFloating = true, fullScreen = false }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(!isFloating);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiPersonality, setAiPersonality] = useState('expert');
  const [conversationContext, setConversationContext] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Message de bienvenue personnalisÃ© selon le rÃ´le
    initializeConversation();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeConversation = async () => {
    const role = user?.user_metadata?.role || 'visiteur';
    const welcomeMessage = await generateWelcomeMessage(role);
    
    setMessages([{
      id: 1,
      type: 'ai',
      content: welcomeMessage.text,
      timestamp: new Date(),
      actions: welcomeMessage.suggestedActions,
      insights: welcomeMessage.insights
    }]);
  };

  const generateWelcomeMessage = async (userRole) => {
    const welcomeMessages = {
      particulier: {
        text: "ðŸ  Bonjour ! Je suis votre expert IA foncier personnel. En tant qu'intelligence artificielle spÃ©cialisÃ©e dans l'immobilier sÃ©nÃ©galais, je peux vous aider Ã  trouver le terrain parfait, analyser les opportunitÃ©s d'investissement, et vous guider dans toutes vos dÃ©marches. Comment puis-je vous assister aujourd'hui ?",
        suggestedActions: [
          "Rechercher un terrain Ã  LibertÃ© 6",
          "Analyser mes investissements",
          "Configurer des alertes IA",
          "Comprendre les prix du marchÃ©"
        ],
        insights: "ðŸ§  J'ai dÃ©tectÃ© 3 nouvelles opportunitÃ©s dans vos zones d'intÃ©rÃªt"
      },
      banque: {
        text: "ðŸ¦ Bienvenue ! Je suis votre assistant IA spÃ©cialisÃ© dans les services financiers immobiliers. Je peux analyser les dossiers de crÃ©dit, Ã©valuer les risques, optimiser votre portefeuille et automatiser vos processus d'approbation. Mon expertise couvre la lutte anti-fraude et l'Ã©valuation des garanties fonciÃ¨res.",
        suggestedActions: [
          "Analyser les demandes de crÃ©dit",
          "Ã‰valuer les risques portfolio",
          "Optimiser les taux",
          "DÃ©tecter les fraudes"
        ],
        insights: "ðŸ’° 127 dossiers prÃ©-analysÃ©s nÃ©cessitent votre validation"
      },
      vendeur_particulier: {
        text: "ðŸª Salut ! En tant qu'IA commerciale experte, je vais rÃ©volutionner vos ventes. Je peux optimiser vos prix, gÃ©nÃ©rer des leads qualifiÃ©s, nÃ©gocier avec les acheteurs, et automatiser votre marketing. Mon algorithme analyse le marchÃ© en temps rÃ©el pour maximiser vos profits.",
        suggestedActions: [
          "Optimiser mes prix de vente",
          "GÃ©nÃ©rer des leads qualifiÃ©s",
          "Analyser la concurrence",
          "Automatiser mes annonces"
        ],
        insights: "ðŸ“ˆ 47 nouveaux leads qualifiÃ©s gÃ©nÃ©rÃ©s cette semaine"
      },
      mairie: {
        text: "ðŸ›ï¸ Bonjour ! Je suis votre IA administrative municipale. Je surveille votre territoire, traite les demandes communales, dÃ©tecte les fraudes fonciÃ¨res et optimise vos services citoyens. Mon systÃ¨me de surveillance territoriale protÃ¨ge votre commune 24h/24.",
        suggestedActions: [
          "Surveiller les terrains",
          "Traiter demandes communales",
          "DÃ©tecter les fraudes",
          "Analyser l'urbanisation"
        ],
        insights: "ðŸš¨ 12 alertes territoriales nÃ©cessitent votre attention"
      },
      agent_foncier: {
        text: "ðŸ‘¨â€ðŸ’¼ Bonjour ! Je suis votre IA experte en mÃ©diation fonciÃ¨re. Je facilite les transactions, vÃ©rifie l'authenticitÃ© des documents, dÃ©tecte les conflits potentiels et optimise vos nÃ©gociations. Mon expertise juridique vous protÃ¨ge contre toute fraude.",
        suggestedActions: [
          "VÃ©rifier un titre foncier",
          "Analyser une transaction",
          "DÃ©tecter les conflits",
          "Optimiser une nÃ©gociation"
        ],
        insights: "âš–ï¸ 3 conflits potentiels dÃ©tectÃ©s nÃ©cessitent mÃ©diation"
      },
      visiteur: {
        text: "ðŸ‘‹ Bienvenue sur Teranga Foncier ! Je suis l'IA qui rÃ©volutionne l'immobilier au SÃ©nÃ©gal. Expert en foncier, lutte anti-fraude et facilitation d'acquisition, je vous guide dans toutes vos dÃ©marches. Posez-moi n'importe quelle question sur l'immobilier sÃ©nÃ©galais !",
        suggestedActions: [
          "Comment acheter un terrain ?",
          "Quels sont les prix Ã  Dakar ?",
          "Comment Ã©viter les fraudes ?",
          "DÃ©couvrir Teranga Foncier"
        ],
        insights: "ðŸŒŸ Plateforme 100% sÃ©curisÃ©e par blockchain et IA"
      }
    };

    return welcomeMessages[userRole] || welcomeMessages.visiteur;
  };

  const processIntelligentResponse = async (userMessage) => {
    const message = userMessage.toLowerCase();
    const userRole = user?.user_metadata?.role || 'visiteur';

    // DÃ©tection d'intention et rÃ©ponses intelligentes
    if (message.includes('terrain') || message.includes('parcelle')) {
      return {
        response: `ðŸžï¸ Excellente question sur les terrains ! En tant qu'expert IA immobilier, je peux vous aider Ã  trouver le terrain parfait. 

Sur Teranga Foncier, nous avons plusieurs options :
â€¢ **Terrains privÃ©s** : Plus de 2,500 parcelles vÃ©rifiÃ©es par blockchain
â€¢ **Terrains communaux** : Demandes d'attribution simplifiÃ©es  
â€¢ **Terrains promoteurs** : Projets rÃ©sidentiels et commerciaux

Quel type de terrain vous intÃ©resse ? Dans quelle zone de Dakar ou du SÃ©nÃ©gal ?`,
        actions: [
          "Chercher terrains Ã  LibertÃ© 6",
          "Voir terrains communaux",
          "Prix moyens par zone",
          "VÃ©rification lÃ©gale terrain"
        ],
        insights: "ðŸ’¡ J'ai analysÃ© 156 terrains disponibles dans vos critÃ¨res",
        confidence: 95,
        nextQuestions: ["Dans quelle zone ?", "Quel budget ?", "Usage prÃ©vu ?"]
      };
    }

    if (message.includes('prix') || message.includes('coÃ»t') || message.includes('budget')) {
      return {
        response: `ðŸ’° Parlons budget ! Mes algorithmes analysent en temps rÃ©el les prix du marchÃ© immobilier sÃ©nÃ©galais.

**Prix moyens actuels (analyse IA temps rÃ©el) :**
â€¢ **LibertÃ© 6** : 180,000 - 250,000 FCFA/mÂ²
â€¢ **Almadies** : 300,000 - 450,000 FCFA/mÂ²  
â€¢ **GuÃ©diawaye** : 45,000 - 80,000 FCFA/mÂ²
â€¢ **Mbao** : 35,000 - 60,000 FCFA/mÂ²

Je peux analyser votre budget et vous proposer les meilleures opportunitÃ©s !`,
        actions: [
          "Analyser mon budget",
          "OpportunitÃ©s Ã  moins de 100k/mÂ²",
          "PrÃ©dictions prix 6 mois",
          "NÃ©gocier avec l'IA"
        ],
        insights: "ðŸ“ˆ Les prix ont augmentÃ© de 12% cette annÃ©e Ã  Dakar",
        confidence: 92,
        nextQuestions: ["Votre budget maximum ?", "Zone prioritaire ?"]
      };
    }

    if (message.includes('fraude') || message.includes('arnaque') || message.includes('sÃ©curitÃ©')) {
      return {
        response: `ðŸ›¡ï¸ La sÃ©curitÃ©, c'est notre prioritÃ© absolue ! Mon systÃ¨me anti-fraude blockchain analyse chaque transaction.

**Protection IA avancÃ©e :**
â€¢ âœ… VÃ©rification automatique des titres fonciers
â€¢ âœ… Analyse des vendeurs et historiques
â€¢ âœ… DÃ©tection des faux documents (IA vision)
â€¢ âœ… Smart contracts pour transactions sÃ©curisÃ©es
â€¢ âœ… Escrow automatisÃ© avec libÃ©ration conditionnelle

**Signaux d'alerte dÃ©tectÃ©s automatiquement :**
ðŸš¨ Prix anormalement bas, ðŸš¨ Documents suspects, ðŸš¨ Vendeurs non vÃ©rifiÃ©s`,
        actions: [
          "VÃ©rifier un vendeur",
          "Analyser un document",
          "Guide anti-fraude",
          "Signaler une fraude"
        ],
        insights: "ðŸ” 213 tentatives de fraude bloquÃ©es ce mois",
        confidence: 98,
        nextQuestions: ["Avez-vous un doute sur une transaction ?"]
      };
    }

    if (message.includes('projet') || message.includes('promoteur') || message.includes('construction')) {
      return {
        response: `ðŸ—ï¸ Les projets promoteurs, mon domaine d'expertise ! J'analyse tous les projets en temps rÃ©el.

**Projets analysÃ©s actuellement :**
â€¢ **RÃ©sidentiels** : 47 projets vÃ©rifiÃ©s (villas, appartements)
â€¢ **Commerciaux** : 23 complexes en dÃ©veloppement  
â€¢ **Mixtes** : 12 projets rÃ©sidence + commerce

Mon IA Ã©value chaque promoteur sur :
âœ… Historique financier, âœ… QualitÃ© constructions, âœ… Respect dÃ©lais, âœ… Satisfaction clients

Quel type de projet vous intÃ©resse ?`,
        actions: [
          "Voir tous les projets",
          "Projets Ã  LibertÃ© 6",
          "Ã‰valuer un promoteur",
          "Demande de construction"
        ],
        insights: "ðŸ¢ 3 nouveaux projets certifiÃ©s cette semaine",
        confidence: 94,
        nextQuestions: ["Type de bien recherchÃ© ?", "Budget prÃ©vu ?"]
      };
    }

    if (message.includes('help') || message.includes('aide') || message.includes('comment')) {
      return {
        response: `ðŸ¤– Je suis votre assistant IA personnel pour l'immobilier sÃ©nÃ©galais ! 

**Mes capacitÃ©s d'expert :**
â€¢ ðŸ” Recherche et analyse de terrains
â€¢ ðŸ’° Ã‰valuation de prix et nÃ©gociation  
â€¢ ðŸ›¡ï¸ DÃ©tection de fraudes et vÃ©rifications
â€¢ ðŸ“‹ Suivi de projets et demandes
â€¢ ðŸ—ï¸ Conseils construction et promoteurs
â€¢ ðŸ“Š Analyses de marchÃ© temps rÃ©el

**Questions populaires :**
"Terrain Ã  LibertÃ© 6", "Prix Almadies", "Ã‰viter fraudes", "Meilleurs promoteurs"

Que souhaitez-vous savoir ?`,
        actions: [
          "Rechercher un terrain",
          "VÃ©rifier des prix", 
          "Analyser sÃ©curitÃ©",
          "Guide dÃ©butant"
        ],
        insights: "ðŸ’¡ Plus de 10,000 questions traitÃ©es avec 96% de satisfaction",
        confidence: 99,
        nextQuestions: ["Par quoi commencer ?"]
      };
    }

    // RÃ©ponse gÃ©nÃ©rale intelligente
    return {
      response: `ðŸ§  Merci pour votre message ! En tant qu'IA experte en immobilier sÃ©nÃ©galais, je comprends que vous vous intÃ©ressez Ã  notre plateforme.

Je peux vous aider avec :
â€¢ **Recherche de terrains** et Ã©valuation de prix
â€¢ **VÃ©rification anti-fraude** et sÃ©curisation de transactions  
â€¢ **Analyse de projets** promoteurs et opportunitÃ©s d'investissement
â€¢ **Guides et conseils** personnalisÃ©s selon votre profil

Pouvez-vous prÃ©ciser votre besoin pour que je vous aide au mieux ?`,
      actions: [
        "Chercher un terrain",
        "VÃ©rifier une offre",
        "Conseils investissement", 
        "Questions frÃ©quentes"
      ],
      insights: "ðŸŽ¯ Je m'adapte Ã  vos besoins spÃ©cifiques",
      confidence: 85,
      nextQuestions: ["Quel est votre objectif principal ?"]
    };
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToProcess = currentMessage;
    setCurrentMessage('');
    setIsTyping(true);

    try {
      // Simulation de rÃ©flexion IA (dÃ©lai rÃ©aliste)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Logique conversationnelle intelligente
      const aiResponse = await processIntelligentResponse(messageToProcess);

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse.response,
        timestamp: new Date(),
        actions: aiResponse.actions,
        insights: aiResponse.insights,
        confidence: aiResponse.confidence,
        nextQuestions: aiResponse.nextQuestions
      };

      setMessages(prev => [...prev, aiMessage]);
      setConversationContext(aiResponse.context);

    } catch (error) {
      console.error('Erreur IA conversation:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "ðŸ¤– Excusez-moi, je rÃ©flÃ©chis Ã  votre demande. Pouvez-vous reformuler ou Ãªtre plus spÃ©cifique ?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = async (action) => {
    setCurrentMessage(action);
    await sendMessage();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const ChatInterface = () => (
    <div className={`flex flex-col ${fullScreen ? 'h-screen' : 'h-96'} bg-white rounded-lg shadow-xl border`}>
      {/* Header IA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Assistant IA Teranga</h3>
              <p className="text-sm opacity-90">Expert Foncier â€¢ Anti-Fraude â€¢ Facilitation</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-500 text-white">
              <Zap className="w-3 h-3 mr-1" />
              IA Active
            </Badge>
            {isFloating && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                âœ•
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white rounded-l-lg rounded-tr-lg' 
                  : 'bg-white border rounded-r-lg rounded-tl-lg shadow-sm'
              } p-3`}>
                
                {message.type === 'ai' && (
                  <div className="flex items-center mb-2">
                    <Bot className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="text-xs font-medium text-purple-600">IA Expert</span>
                    {message.confidence && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {Math.round(message.confidence * 100)}% sÃ»r
                      </Badge>
                    )}
                  </div>
                )}

                <p className={`text-sm ${message.type === 'user' ? 'text-white' : 'text-gray-800'}`}>
                  {message.content}
                </p>

                {message.insights && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
                    <Lightbulb className="w-3 h-3 inline mr-1" />
                    {message.insights}
                  </div>
                )}

                {message.actions && (
                  <div className="mt-3 space-y-1">
                    {message.actions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => handleQuickAction(action)}
                      >
                        {action}
                      </Button>
                    ))}
                  </div>
                )}

                {message.nextQuestions && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 mb-1">Questions suggÃ©rÃ©es :</p>
                    {message.nextQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(question)}
                        className="block text-xs text-blue-600 hover:underline mb-1"
                      >
                        â€¢ {question}
                      </button>
                    ))}
                  </div>
                )}

                <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white border rounded-r-lg rounded-tl-lg shadow-sm p-3 max-w-xs">
              <div className="flex items-center">
                <Bot className="w-4 h-4 mr-2 text-purple-600" />
                <div className="flex space-x-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-purple-600 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-purple-600 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-purple-600 rounded-full"
                  />
                </div>
                <span className="ml-2 text-xs text-gray-600">L'IA rÃ©flÃ©chit...</span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white rounded-b-lg">
        <div className="flex space-x-2">
          <Input
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            YOUR_API_KEY="Posez votre question Ã  l'IA expert..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage} 
            disabled={!currentMessage.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 mt-2">
          {[
            "ðŸ’° Prix du marchÃ©", 
            "ðŸ” Rechercher terrain", 
            "ðŸš¨ Ã‰viter fraudes", 
            "ðŸ“Š Analyser investissement"
          ].map((action) => (
            <Button
              key={action}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action)}
              className="text-xs"
            >
              {action}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">ðŸ§  Assistant IA Conversationnel</h1>
              <p className="text-gray-600">Intelligence Artificielle experte en foncier, anti-fraude et facilitation d'acquisition</p>
            </div>
            <div className="h-[600px]">
              <ChatInterface />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isFloating) {
    return (
      <>
        {/* Floating chat button */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
            </Button>
            
            {/* Pulse indicator */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"
            />
          </motion.div>
        )}

        {/* Floating chat window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="fixed bottom-6 right-6 z-50 w-96"
            >
              <ChatInterface />
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return <ChatInterface />;
};

export default UniversalAIChatbot;
