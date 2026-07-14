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
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

const UniversalAIChatbot = ({ isFloating = true, fullScreen = false }) => {
  // Protection contre l'absence d'AuthProvider
  let user = null;
  try {
    const auth = useAuth();
    user = auth?.user;
  } catch (error) {
    console.warn('Auth non disponible dans UniversalAIChatbot:', error.message);
  }
  const [isOpen, setIsOpen] = useState(!isFloating);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiPersonality, setAiPersonality] = useState('expert');
  const [conversationContext, setConversationContext] = useState(null);
  const messagesEndRef = useRef(null);

  // Statistiques réelles de la plateforme (aucune donnée fictive) : chargées une fois
  // depuis Supabase pour remplacer les chiffres codés en dur des réponses de l'IA.
  const [platformStats, setPlatformStats] = useState({
    propertiesCount: null,
    verifiedPropertiesCount: null,
    pendingFinancingCount: null,
    myContactsCount: null,
    communalPendingCount: null,
    disputesCount: null,
    certificatesCount: null,
    developerProjectsCount: null,
    chatHistoryCount: null,
    avgPricePerSqm: null,
    priceByRegion: []
  });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [
          { count: propertiesCount },
          { count: verifiedPropertiesCount },
          { count: pendingFinancingCount },
          { count: communalPendingCount },
          { count: disputesCount },
          { count: certificatesCount },
          { count: developerProjectsCount },
          { count: chatHistoryCount },
          { data: priceRows }
        ] = await Promise.all([
          supabase.from('properties').select('*', { count: 'exact', head: true }),
          supabase.from('properties').select('*', { count: 'exact', head: true }).eq('verification_status', 'verified'),
          supabase.from('demandes_financement').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('communal_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('disputes').select('*', { count: 'exact', head: true }),
          supabase.from('blockchain_certificates').select('*', { count: 'exact', head: true }),
          supabase.from('developer_projects').select('*', { count: 'exact', head: true }),
          supabase.from('ai_chat_history').select('*', { count: 'exact', head: true }),
          supabase.from('properties').select('region, price, surface').eq('status', 'active')
        ]);

        let avgPricePerSqm = null;
        const byRegion = {};
        (priceRows || []).forEach((row) => {
          if (row.price && row.surface && Number(row.surface) > 0) {
            const pricePerSqm = Number(row.price) / Number(row.surface);
            const region = row.region || 'Autre';
            if (!byRegion[region]) byRegion[region] = [];
            byRegion[region].push(pricePerSqm);
          }
        });
        const allValues = Object.values(byRegion).flat();
        if (allValues.length > 0) {
          avgPricePerSqm = allValues.reduce((a, b) => a + b, 0) / allValues.length;
        }
        const priceByRegion = Object.entries(byRegion).map(([region, values]) => ({
          region,
          avgPricePerSqm: values.reduce((a, b) => a + b, 0) / values.length
        })).slice(0, 4);

        let myContactsCount = null;
        if (user?.id) {
          const { count } = await supabase
            .from('crm_contacts')
            .select('*', { count: 'exact', head: true })
            .eq('owner_id', user.id);
          myContactsCount = count;
        }

        if (active) {
          setPlatformStats({
            propertiesCount: propertiesCount ?? 0,
            verifiedPropertiesCount: verifiedPropertiesCount ?? 0,
            pendingFinancingCount: pendingFinancingCount ?? 0,
            myContactsCount,
            communalPendingCount: communalPendingCount ?? 0,
            disputesCount: disputesCount ?? 0,
            certificatesCount: certificatesCount ?? 0,
            developerProjectsCount: developerProjectsCount ?? 0,
            chatHistoryCount: chatHistoryCount ?? 0,
            avgPricePerSqm,
            priceByRegion
          });
        }
      } catch (error) {
        console.error('Erreur chargement statistiques plateforme (chatbot IA):', error);
      }
    })();
    return () => { active = false; };
  }, [user]);

  useEffect(() => {
    // Message de bienvenue personnalisé selon le rôle.
    // Se régénère quand les statistiques réelles finissent de charger (messages.length <= 1
    // garantit qu'on ne réinitialise pas une conversation déjà entamée par l'utilisateur).
    if (messages.length <= 1) {
      initializeConversation();
    }
  }, [user, platformStats]);

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
    const s = platformStats;
    const welcomeMessages = {
      particulier: {
        text: "ðŸ  Bonjour ! Je suis votre expert IA foncier personnel. En tant qu'intelligence artificielle spécialisée dans l'immobilier sénégalais, je peux vous aider Ï  trouver le terrain parfait, analyser les opportunités d'investissement, et vous guider dans toutes vos démarches. Comment puis-je vous assister aujourd'hui ?",
        suggestedActions: [
          "Rechercher un terrain Ï  Liberté 6",
          "Analyser mes investissements",
          "Configurer des alertes IA",
          "Comprendre les prix du marché"
        ],
        insights: s.propertiesCount !== null
          ? `🧠 ${s.propertiesCount} bien(s) référencé(s) actuellement sur la plateforme`
          : null
      },
      banque: {
        text: "ðŸ¦ Bienvenue ! Je suis votre assistant IA spécialisé dans les services financiers immobiliers. Je peux analyser les dossiers de crédit, évaluer les risques, optimiser votre portefeuille et automatiser vos processus d'approbation. Mon expertise couvre la lutte anti-fraude et l'évaluation des garanties foncières.",
        suggestedActions: [
          "Analyser les demandes de crédit",
          "Évaluer les risques portfolio",
          "Optimiser les taux",
          "Détecter les fraudes"
        ],
        insights: s.pendingFinancingCount !== null
          ? `💰 ${s.pendingFinancingCount} dossier(s) de financement en attente de validation`
          : null
      },
      vendeur_particulier: {
        text: "ðŸª Salut ! En tant qu'IA commerciale experte, je vais révolutionner vos ventes. Je peux optimiser vos prix, générer des leads qualifiés, négocier avec les acheteurs, et automatiser votre marketing. Mon algorithme analyse le marché en temps réel pour maximiser vos profits.",
        suggestedActions: [
          "Optimiser mes prix de vente",
          "Générer des leads qualifiés",
          "Analyser la concurrence",
          "Automatiser mes annonces"
        ],
        insights: s.myContactsCount !== null
          ? `📈 ${s.myContactsCount} contact(s) CRM enregistré(s) sur votre compte`
          : null
      },
      mairie: {
        text: "ðŸ›ï¸ Bonjour ! Je suis votre IA administrative municipale. Je surveille votre territoire, traite les demandes communales, détecte les fraudes foncières et optimise vos services citoyens. Mon système de surveillance territoriale protège votre commune 24h/24.",
        suggestedActions: [
          "Surveiller les terrains",
          "Traiter demandes communales",
          "Détecter les fraudes",
          "Analyser l'urbanisation"
        ],
        insights: s.communalPendingCount !== null
          ? `🚨 ${s.communalPendingCount} demande(s) communale(s) en attente de traitement`
          : null
      },
      agent_foncier: {
        text: "ðŸ‘¨â€ðŸ’¼ Bonjour ! Je suis votre IA experte en médiation foncière. Je facilite les transactions, vérifie l'authenticité des documents, détecte les conflits potentiels et optimise vos négociations. Mon expertise juridique vous protège contre toute fraude.",
        suggestedActions: [
          "Vérifier un titre foncier",
          "Analyser une transaction",
          "Détecter les conflits",
          "Optimiser une négociation"
        ],
        insights: s.disputesCount !== null
          ? `⚖️ ${s.disputesCount} litige(s) enregistré(s) sur la plateforme`
          : null
      },
      visiteur: {
        text: "ðŸ‘‹ Bienvenue sur Teranga Foncier ! Je suis l'IA qui révolutionne l'immobilier au Sénégal. Expert en foncier, lutte anti-fraude et facilitation d'acquisition, je vous guide dans toutes vos démarches. Posez-moi n'importe quelle question sur l'immobilier sénégalais !",
        suggestedActions: [
          "Comment acheter un terrain ?",
          "Quels sont les prix Ï  Dakar ?",
          "Comment éviter les fraudes ?",
          "Découvrir Teranga Foncier"
        ],
        insights: "Plateforme sécurisée par blockchain et IA"
      }
    };

    return welcomeMessages[userRole] || welcomeMessages.visiteur;
  };

  const processIntelligentResponse = async (userMessage) => {
    const message = userMessage.toLowerCase();
    const userRole = user?.user_metadata?.role || 'visiteur';
    const s = platformStats;

    // Détection d'intention et réponses intelligentes
    if (message.includes('terrain') || message.includes('parcelle')) {
      return {
        response: `ðŸžï¸ Excellente question sur les terrains ! En tant qu'expert IA immobilier, je peux vous aider Ï  trouver le terrain parfait. 

Sur Teranga Foncier, nous avons plusieurs options :
â€¢ **Terrains privés** : ${s.certificatesCount !== null ? s.certificatesCount : '…'} parcelles certifiées par blockchain
â€¢ **Terrains communaux** : Demandes d'attribution simplifiées  
â€¢ **Terrains promoteurs** : Projets résidentiels et commerciaux

Quel type de terrain vous intéresse ? Dans quelle zone de Dakar ou du Sénégal ?`,
        actions: [
          "Chercher terrains Ï  Liberté 6",
          "Voir terrains communaux",
          "Prix moyens par zone",
          "Vérification légale terrain"
        ],
        insights: s.propertiesCount !== null
          ? `💡 ${s.propertiesCount} terrain(s) actuellement référencé(s) sur la plateforme`
          : null,
        confidence: 95,
        nextQuestions: ["Dans quelle zone ?", "Quel budget ?", "Usage prévu ?"]
      };
    }

    if (message.includes('prix') || message.includes('coût') || message.includes('budget')) {
      return {
        response: `ðŸ’° Parlons budget ! Mes algorithmes analysent en temps réel les prix du marché immobilier sénégalais.

${s.priceByRegion && s.priceByRegion.length > 0
  ? `**Prix moyens constatés par région (biens actifs) :**\n${s.priceByRegion.map(r => `• **${r.region}** : ${Math.round(r.avgPricePerSqm).toLocaleString()} FCFA/m²`).join('\n')}`
  : `Je n'ai pas encore assez de biens actifs enregistrés pour calculer une moyenne fiable par région.`}

Je peux analyser votre budget et vous proposer les meilleures opportunités !`,
        actions: [
          "Analyser mon budget",
          "Opportunités Ï  moins de 100k/mÂ²",
          "Prédictions prix 6 mois",
          "Négocier avec l'IA"
        ],
        insights: s.avgPricePerSqm !== null
          ? `📈 Prix moyen constaté : ${Math.round(s.avgPricePerSqm).toLocaleString()} FCFA/m² sur les biens actifs`
          : null,
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
        insights: s.disputesCount !== null
          ? `🔍 ${s.disputesCount} litige(s) enregistré(s) sur la plateforme`
          : null,
        confidence: 98,
        nextQuestions: ["Avez-vous un doute sur une transaction ?"]
      };
    }

    if (message.includes('projet') || message.includes('promoteur') || message.includes('construction')) {
      return {
        response: `ðŸ—ï¸ Les projets promoteurs, mon domaine d'expertise ! J'analyse tous les projets en temps réel.

${s.developerProjectsCount !== null
  ? `**Projets promoteurs actuellement référencés :** ${s.developerProjectsCount}`
  : `Aucune donnée de projet disponible pour le moment.`}

Mon IA évalue chaque promoteur sur :
✅ Historique financier, ✅ Qualité constructions, ✅ Respect délais, ✅ Satisfaction clients

Quel type de projet vous intéresse ?`,
        actions: [
          "Voir tous les projets",
          "Projets Ï  Liberté 6",
          "Évaluer un promoteur",
          "Demande de construction"
        ],
        insights: s.developerProjectsCount !== null
          ? `🏢 ${s.developerProjectsCount} projet(s) promoteur(s) référencé(s)`
          : null,
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
        insights: s.chatHistoryCount !== null
          ? `💡 ${s.chatHistoryCount} échange(s) enregistré(s) dans l'historique IA`
          : null,
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

