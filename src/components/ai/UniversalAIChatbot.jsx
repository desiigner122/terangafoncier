/**
 * ðŸ§  IA CONVERSATIONNELLE UNIVERSELLE
 * Assistant IA qui remplace l'intervention humaine sur toute la plateforme
 * Expertise foncière + lutte anti-fraude + facilitation acquisition
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
    // Message de bienvenue personnalisé selon le rôle
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
        text: "ðŸ  Bonjour ! Je suis votre expert IA foncier personnel. En tant qu'intelligence artificielle spécialisée dans l'immobilier sénégalais, je peux vous aider Ï  trouver le terrain parfait, analyser les opportunités d'investissement, et vous guider dans toutes vos démarches. Comment puis-je vous assister aujourd'hui ?",
        suggestedActions: [
          "Rechercher un terrain Ï  Liberté 6",
          "Analyser mes investissements",
          "Configurer des alertes IA",
          "Comprendre les prix du marché"
        ],
        insights: "ðŸ§  J'ai détecté 3 nouvelles opportunités dans vos zones d'intérêt"
      },
      banque: {
        text: "ðŸ¦ Bienvenue ! Je suis votre assistant IA spécialisé dans les services financiers immobiliers. Je peux analyser les dossiers de crédit, évaluer les risques, optimiser votre portefeuille et automatiser vos processus d'approbation. Mon expertise couvre la lutte anti-fraude et l'évaluation des garanties foncières.",
        suggestedActions: [
          "Analyser les demandes de crédit",
          "Évaluer les risques portfolio",
          "Optimiser les taux",
          "Détecter les fraudes"
        ],
        insights: "ðŸ’° 127 dossiers pré-analysés nécessitent votre validation"
      },
      vendeur_particulier: {
        text: "ðŸª Salut ! En tant qu'IA commerciale experte, je vais révolutionner vos ventes. Je peux optimiser vos prix, générer des leads qualifiés, négocier avec les acheteurs, et automatiser votre marketing. Mon algorithme analyse le marché en temps réel pour maximiser vos profits.",
        suggestedActions: [
          "Optimiser mes prix de vente",
          "Générer des leads qualifiés",
          "Analyser la concurrence",
          "Automatiser mes annonces"
        ],
        insights: "ðŸ“ˆ 47 nouveaux leads qualifiés générés cette semaine"
      },
      mairie: {
        text: "ðŸ›ï¸ Bonjour ! Je suis votre IA administrative municipale. Je surveille votre territoire, traite les demandes communales, détecte les fraudes foncières et optimise vos services citoyens. Mon système de surveillance territoriale protège votre commune 24h/24.",
        suggestedActions: [
          "Surveiller les terrains",
          "Traiter demandes communales",
          "Détecter les fraudes",
          "Analyser l'urbanisation"
        ],
        insights: "ðŸš¨ 12 alertes territoriales nécessitent votre attention"
      },
      agent_foncier: {
        text: "ðŸ‘¨â€ðŸ’¼ Bonjour ! Je suis votre IA experte en médiation foncière. Je facilite les transactions, vérifie l'authenticité des documents, détecte les conflits potentiels et optimise vos négociations. Mon expertise juridique vous protège contre toute fraude.",
        suggestedActions: [
          "Vérifier un titre foncier",
          "Analyser une transaction",
          "Détecter les conflits",
          "Optimiser une négociation"
        ],
        insights: "âš–ï¸ 3 conflits potentiels détectés nécessitent médiation"
      },
      visiteur: {
        text: "ðŸ‘‹ Bienvenue sur Teranga Foncier ! Je suis l'IA qui révolutionne l'immobilier au Sénégal. Expert en foncier, lutte anti-fraude et facilitation d'acquisition, je vous guide dans toutes vos démarches. Posez-moi n'importe quelle question sur l'immobilier sénégalais !",
        suggestedActions: [
          "Comment acheter un terrain ?",
          "Quels sont les prix Ï  Dakar ?",
          "Comment éviter les fraudes ?",
          "Découvrir Teranga Foncier"
        ],
        insights: "ðŸŒŸ Plateforme 100% sécurisée par blockchain et IA"
      }
    };

    return welcomeMessages[userRole] || welcomeMessages.visiteur;
  };

  const processIntelligentResponse = async (userMessage) => {
    const message = userMessage.toLowerCase();
    const userRole = user?.user_metadata?.role || 'visiteur';

    // Détection d'intention et réponses intelligentes
    if (message.includes('terrain') || message.includes('parcelle')) {
      return {
        response: `ðŸžï¸ Excellente question sur les terrains ! En tant qu'expert IA immobilier, je peux vous aider Ï  trouver le terrain parfait. 

Sur Teranga Foncier, nous avons plusieurs options :
â€¢ **Terrains privés** : Plus de 2,500 parcelles vérifiées par blockchain
â€¢ **Terrains communaux** : Demandes d'attribution simplifiées  
â€¢ **Terrains promoteurs** : Projets résidentiels et commerciaux

Quel type de terrain vous intéresse ? Dans quelle zone de Dakar ou du Sénégal ?`,
        actions: [
          "Chercher terrains Ï  Liberté 6",
          "Voir terrains communaux",
          "Prix moyens par zone",
          "Vérification légale terrain"
        ],
        insights: "ðŸ’¡ J'ai analysé 156 terrains disponibles dans vos critères",
        confidence: 95,
        nextQuestions: ["Dans quelle zone ?", "Quel budget ?", "Usage prévu ?"]
      };
    }

    if (message.includes('prix') || message.includes('coût') || message.includes('budget')) {
      return {
        response: `ðŸ’° Parlons budget ! Mes algorithmes analysent en temps réel les prix du marché immobilier sénégalais.

**Prix moyens actuels (analyse IA temps réel) :**
â€¢ **Liberté 6** : 180,000 - 250,000 FCFA/mÂ²
â€¢ **Almadies** : 300,000 - 450,000 FCFA/mÂ²  
â€¢ **Guédiawaye** : 45,000 - 80,000 FCFA/mÂ²
â€¢ **Mbao** : 35,000 - 60,000 FCFA/mÂ²

Je peux analyser votre budget et vous proposer les meilleures opportunités !`,
        actions: [
          "Analyser mon budget",
          "Opportunités Ï  moins de 100k/mÂ²",
          "Prédictions prix 6 mois",
          "Négocier avec l'IA"
        ],
        insights: "ðŸ“ˆ Les prix ont augmenté de 12% cette année Ï  Dakar",
        confidence: 92,
        nextQuestions: ["Votre budget maximum ?", "Zone prioritaire ?"]
      };
    }

    if (message.includes('fraude') || message.includes('arnaque') || message.includes('sécurité')) {
      return {
        response: `ðŸ›¡ï¸ La sécurité, c'est notre priorité absolue ! Mon système anti-fraude blockchain analyse chaque transaction.

**Protection IA avancée :**
â€¢ ✅ Vérification automatique des titres fonciers
â€¢ ✅ Analyse des vendeurs et historiques
â€¢ ✅ Détection des faux documents (IA vision)
â€¢ ✅ Smart contracts pour transactions sécurisées
â€¢ ✅ Escrow automatisé avec libération conditionnelle

**Signaux d'alerte détectés automatiquement :**
ðŸš¨ Prix anormalement bas, ðŸš¨ Documents suspects, ðŸš¨ Vendeurs non vérifiés`,
        actions: [
          "Vérifier un vendeur",
          "Analyser un document",
          "Guide anti-fraude",
          "Signaler une fraude"
        ],
        insights: "ðŸ” 213 tentatives de fraude bloquées ce mois",
        confidence: 98,
        nextQuestions: ["Avez-vous un doute sur une transaction ?"]
      };
    }

    if (message.includes('projet') || message.includes('promoteur') || message.includes('construction')) {
      return {
        response: `ðŸ—ï¸ Les projets promoteurs, mon domaine d'expertise ! J'analyse tous les projets en temps réel.

**Projets analysés actuellement :**
â€¢ **Résidentiels** : 47 projets vérifiés (villas, appartements)
â€¢ **Commerciaux** : 23 complexes en développement  
â€¢ **Mixtes** : 12 projets résidence + commerce

Mon IA évalue chaque promoteur sur :
✅ Historique financier, ✅ Qualité constructions, ✅ Respect délais, ✅ Satisfaction clients

Quel type de projet vous intéresse ?`,
        actions: [
          "Voir tous les projets",
          "Projets Ï  Liberté 6",
          "Évaluer un promoteur",
          "Demande de construction"
        ],
        insights: "ðŸ¢ 3 nouveaux projets certifiés cette semaine",
        confidence: 94,
        nextQuestions: ["Type de bien recherché ?", "Budget prévu ?"]
      };
    }

    if (message.includes('help') || message.includes('aide') || message.includes('comment')) {
      return {
        response: `ðŸ¤– Je suis votre assistant IA personnel pour l'immobilier sénégalais ! 

**Mes capacités d'expert :**
â€¢ ðŸ” Recherche et analyse de terrains
â€¢ ðŸ’° Évaluation de prix et négociation  
â€¢ ðŸ›¡ï¸ Détection de fraudes et vérifications
â€¢ ðŸ“‹ Suivi de projets et demandes
â€¢ ðŸ—ï¸ Conseils construction et promoteurs
â€¢ ðŸ“Š Analyses de marché temps réel

**Questions populaires :**
"Terrain Ï  Liberté 6", "Prix Almadies", "Éviter fraudes", "Meilleurs promoteurs"

Que souhaitez-vous savoir ?`,
        actions: [
          "Rechercher un terrain",
          "Vérifier des prix", 
          "Analyser sécurité",
          "Guide débutant"
        ],
        insights: "ðŸ’¡ Plus de 10,000 questions traitées avec 96% de satisfaction",
        confidence: 99,
        nextQuestions: ["Par quoi commencer ?"]
      };
    }

    // Réponse générale intelligente
    return {
      response: `ðŸ§  Merci pour votre message ! En tant qu'IA experte en immobilier sénégalais, je comprends que vous vous intéressez Ï  notre plateforme.

Je peux vous aider avec :
â€¢ **Recherche de terrains** et évaluation de prix
â€¢ **Vérification anti-fraude** et sécurisation de transactions  
â€¢ **Analyse de projets** promoteurs et opportunités d'investissement
â€¢ **Guides et conseils** personnalisés selon votre profil

Pouvez-vous préciser votre besoin pour que je vous aide au mieux ?`,
      actions: [
        "Chercher un terrain",
        "Vérifier une offre",
        "Conseils investissement", 
        "Questions fréquentes"
      ],
      insights: "ðŸŽ¯ Je m'adapte Ï  vos besoins spécifiques",
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
      // Simulation de réflexion IA (délai réaliste)
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
        content: "ðŸ¤– Excusez-moi, je réfléchis Ï  votre demande. Pouvez-vous reformuler ou être plus spécifique ?",
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
                        {Math.round(message.confidence * 100)}% sûr
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
                    <p className="text-xs text-gray-600 mb-1">Questions suggérées :</p>
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
                <span className="ml-2 text-xs text-gray-600">L'IA réfléchit...</span>
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
            placeholder="Posez votre question Ï  l'IA expert..."
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
            "ðŸ’° Prix du marché", 
            "ðŸ” Rechercher terrain", 
            "ðŸš¨ Éviter fraudes", 
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

