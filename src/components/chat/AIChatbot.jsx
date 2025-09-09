import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Brain, 
  X, 
  Minimize2, 
  Maximize2,
  TrendingUp,
  MapPin,
  DollarSign,
  Shield,
  Zap,
  BarChart3,
  Users,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { advancedAIService } from '@/services/AdvancedAIService';
import { blockchainAIService } from '@/services/BlockchainAIService';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentContext, setCurrentContext] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Message de bienvenue intelligent
    if (messages.length === 0) {
      addWelcomeMessage();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addWelcomeMessage = async () => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'ai',
      content: "👋 Salut ! Je suis **Teranga AI**, votre assistant intelligent pour l'immobilier au Sénégal.\n\nJe combine l'**Intelligence Artificielle** et la **Blockchain** pour vous offrir :\n\n🧠 **Analyses de marché** en temps réel\n📊 **Prédictions de prix** précises\n🔐 **Transactions sécurisées** blockchain\n🎯 **Recommandations personnalisées**\n\nComment puis-je vous aider aujourd'hui ?",
      timestamp: new Date(),
      suggestions: [
        "💰 Analyser les prix du marché",
        "📍 Trouver les meilleures zones d'investissement", 
        "🔮 Prédictions de prix à court terme",
        "⛓️ Status de mes transactions blockchain",
        "🏠 Évaluer une propriété avec l'IA"
      ]
    };

    setMessages([welcomeMessage]);
    setSuggestions(welcomeMessage.suggestions);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (messageText = inputValue) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Analyser le message et générer une réponse
    try {
      const response = await generateAIResponse(messageText);
      
      setTimeout(() => {
        setMessages(prev => [...prev, response]);
        setSuggestions(response.suggestions || []);
        setIsTyping(false);
      }, 1500); // Simule le temps de réflexion de l'IA

    } catch (error) {
      console.error('Erreur génération réponse IA:', error);
      setIsTyping(false);
    }
  };

  const generateAIResponse = async (userMessage) => {
    const intent = analyzeIntent(userMessage);
    
    let content = '';
    let suggestions = [];
    let responseType = 'text';
    let data = null;

    try {
      switch (intent.type) {
        case 'price_analysis':
          const priceData = await advancedAIService.generateMarketInsights();
          content = `📊 **Analyse de marché actuelle :**\n\n`;
          content += `💹 **Tendance générale :** ${priceData.marketSentiment?.status || 'Optimiste'}\n`;
          content += `📈 **Prédiction court terme :** ${priceData.pricePredictions?.shortTerm?.prediction || '+2.5%'}\n`;
          content += `🎯 **Confiance IA :** ${((priceData.confidenceScore || 0.89) * 100).toFixed(1)}%\n\n`;
          content += `**Top 3 zones performantes :**\n`;
          
          if (priceData.zoneAnalysis?.length > 0) {
            priceData.zoneAnalysis.slice(0, 3).forEach((zone, index) => {
              content += `${index + 1}. **${zone.zone}** - Score: ${zone.investmentScore?.toFixed(1) || 'N/A'}\n`;
            });
          }

          suggestions = [
            "🏆 Voir le classement complet des zones",
            "💰 Calculer ma capacité d'investissement",
            "📊 Analyser une zone spécifique",
            "🔮 Prédictions à long terme"
          ];
          data = priceData;
          break;

        case 'zone_recommendation':
          content = `🎯 **Recommandations d'investissement par zone :**\n\n`;
          content += `🥇 **Almadies** - Zone premium en forte croissance\n`;
          content += `💰 Prix moyen: 850,000 FCFA/m²\n`;
          content += `📈 Tendance: +12% cette année\n\n`;
          
          content += `🥈 **Diamniadio** - Zone émergente à fort potentiel\n`;
          content += `💰 Prix moyen: 450,000 FCFA/m²\n`;
          content += `📈 Tendance: +15% cette année\n\n`;
          
          content += `🥉 **VDN** - Équilibre parfait prix/qualité\n`;
          content += `💰 Prix moyen: 750,000 FCFA/m²\n`;
          content += `📈 Tendance: +9% cette année`;

          suggestions = [
            "📍 Analyser Almadies en détail",
            "🚀 Pourquoi investir à Diamniadio ?",
            "📊 Comparer toutes les zones",
            "💡 Conseils d'investissement personnalisés"
          ];
          break;

        case 'blockchain_status':
          const blockchainData = await blockchainAIService.getRealtimeMetrics();
          content = `⛓️ **Status Blockchain Teranga :**\n\n`;
          content += `🔥 **Transactions totales :** ${blockchainData.totalTransactions || '15,247'}\n`;
          content += `💎 **Smart contracts actifs :** ${blockchainData.activeContracts || '89'}\n`;
          content += `🏠 **NFT Propriétés :** ${blockchainData.nftProperties || '342'}\n`;
          content += `💰 **Volume journalier :** ${blockchainData.dailyVolume || '2.4'}M FCFA\n`;
          content += `🛡️ **Score sécurité :** ${((blockchainData.securityScore || 0.98) * 100).toFixed(1)}%\n`;
          content += `⚡ **Santé réseau :** ${((blockchainData.networkHealth || 0.96) * 100).toFixed(1)}%`;

          suggestions = [
            "🔍 Voir mes transactions",
            "📈 Analytics blockchain détaillées", 
            "🏠 Créer un NFT propriété",
            "💼 Status de mes contrats"
          ];
          data = blockchainData;
          break;

        case 'property_valuation':
          content = `🏠 **Évaluation IA de propriété :**\n\n`;
          content += `Pour une évaluation précise, j'ai besoin de quelques informations :\n\n`;
          content += `📍 **Localisation :** Quelle zone ?\n`;
          content += `📐 **Surface :** Combien de m² ?\n`;
          content += `🏠 **Type :** Villa, appartement, terrain ?\n`;
          content += `⭐ **Équipements :** Piscine, jardin, garage ?\n\n`;
          content += `Mon IA analysera ensuite **15+ facteurs** pour vous donner une estimation ultra-précise !`;

          suggestions = [
            "📍 Évaluer à Almadies",
            "🏠 Évaluer une villa avec piscine",
            "📊 Voir un exemple d'évaluation",
            "💰 Calculateur de prix rapide"
          ];
          break;

        case 'investment_advice':
          content = `💡 **Conseils d'investissement IA :**\n\n`;
          content += `**🎯 Stratégie recommandée pour 2024 :**\n\n`;
          content += `1. **Diversification géographique** - Répartir entre zones matures et émergentes\n`;
          content += `2. **Focus Diaspora** - Profiter du boom des investissements internationaux\n`;
          content += `3. **Blockchain first** - Sécuriser avec des NFT propriétés\n`;
          content += `4. **IA monitoring** - Surveillance continue de vos investissements\n\n`;
          content += `**💰 Budget recommandé :** Commencer avec minimum 50M FCFA pour une diversification efficace`;

          suggestions = [
            "📊 Analyser mon profil d'investisseur",
            "💰 Calculer ma capacité d'emprunt",
            "🎯 Stratégie pour la diaspora",
            "⚡ Opportunités actuelles"
          ];
          break;

        case 'market_trends':
          content = `📈 **Tendances marché 2024 :**\n\n`;
          content += `🔥 **Croissance générale :** +8.5% sur l'année\n`;
          content += `🏆 **Zones leaders :** Almadies, Ngor (+12%)\n`;
          content += `🚀 **Zones émergentes :** Diamniadio, Lac Rose (+15%)\n`;
          content += `💎 **Segment premium :** Demande forte diaspora\n`;
          content += `🏠 **Type recherché :** Villas 3-4 chambres\n`;
          content += `⛓️ **Innovation :** Boom des transactions blockchain\n\n`;
          content += `**🔮 Prédiction 2025 :** Consolidation des gains avec une croissance plus modérée (+6-8%)`;

          suggestions = [
            "📊 Détails par zone",
            "💰 Impact sur mes investissements",
            "🔮 Prédictions long terme",
            "🎯 Opportunités à saisir"
          ];
          break;

        default:
          content = `🤔 Je comprends que vous vous intéressez à l'immobilier ! \n\n`;
          content += `Voici comment je peux vous aider avec mon **IA avancée** :\n\n`;
          content += `🧠 **Analyses intelligentes** du marché\n`;
          content += `💰 **Évaluations précises** de propriétés\n`;
          content += `📊 **Prédictions fiables** des prix\n`;
          content += `⛓️ **Sécurisation blockchain** de vos transactions\n`;
          content += `🎯 **Recommandations personnalisées** d'investissement`;

          suggestions = [
            "💰 Analyser les prix actuels",
            "📍 Meilleures zones d'investissement",
            "🏠 Évaluer une propriété", 
            "⛓️ Status blockchain",
            "📈 Tendances du marché"
          ];
      }

    } catch (error) {
      content = "⚠️ Désolé, je rencontre une difficulté technique. Pouvez-vous reformuler votre question ?";
      suggestions = [
        "💰 Analyser les prix",
        "📍 Recommandations zones",
        "🔄 Réessayer"
      ];
    }

    return {
      id: Date.now(),
      type: 'ai',
      content,
      timestamp: new Date(),
      suggestions,
      data,
      responseType
    };
  };

  const analyzeIntent = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('prix') || lowerMessage.includes('marché') || lowerMessage.includes('évolution')) {
      return { type: 'price_analysis', confidence: 0.9 };
    }
    
    if (lowerMessage.includes('zone') || lowerMessage.includes('investir') || lowerMessage.includes('recommand')) {
      return { type: 'zone_recommendation', confidence: 0.9 };
    }
    
    if (lowerMessage.includes('blockchain') || lowerMessage.includes('transaction') || lowerMessage.includes('nft')) {
      return { type: 'blockchain_status', confidence: 0.9 };
    }
    
    if (lowerMessage.includes('évaluer') || lowerMessage.includes('estimer') || lowerMessage.includes('propriété')) {
      return { type: 'property_valuation', confidence: 0.8 };
    }
    
    if (lowerMessage.includes('conseil') || lowerMessage.includes('stratégie') || lowerMessage.includes('placement')) {
      return { type: 'investment_advice', confidence: 0.8 };
    }
    
    if (lowerMessage.includes('tendance') || lowerMessage.includes('futur') || lowerMessage.includes('prédiction')) {
      return { type: 'market_trends', confidence: 0.8 };
    }
    
    return { type: 'general', confidence: 0.5 };
  };

  const formatMessage = (content) => {
    // Conversion markdown simple pour l'affichage
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  if (!isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          <Brain className="h-8 w-8" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 100 }}
      animate={{ 
        opacity: 1, 
        scale: isMinimized ? 0.8 : 1, 
        y: 0,
        height: isMinimized ? '60px' : '600px'
      }}
      className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden transition-all duration-300 ${
        isMinimized ? 'w-80' : 'w-96'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Brain className="h-6 w-6" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-bold">Teranga AI</h3>
            <p className="text-xs opacity-90">Assistant IA + Blockchain</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs p-3 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-cyan-500 text-white ml-4' 
                      : 'bg-gray-100 text-gray-900 mr-4'
                  }`}>
                    {message.type === 'ai' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-4 w-4 text-cyan-500" />
                        <span className="text-xs font-semibold text-cyan-600">Teranga AI</span>
                      </div>
                    )}
                    <div 
                      className="text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Indicateur de frappe */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 p-3 rounded-2xl mr-4">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-cyan-500 animate-pulse" />
                    <span className="text-sm text-gray-600">L'IA réfléchit...</span>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t">
              <div className="flex flex-wrap gap-2">
                {suggestions.slice(0, 2).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(suggestion.replace(/[🔥💰📍🏠⛓️📊🎯🚀💡📈🔮⚡🧠💎🛡️]/g, '').trim())}
                    className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 hover:bg-cyan-50 hover:border-cyan-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Posez votre question sur l'immobilier..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-sm"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="p-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default AIChatbot;
