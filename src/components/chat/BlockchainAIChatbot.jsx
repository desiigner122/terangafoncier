import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  ChevronDown,
  Zap,
  Brain,
  Blocks,
  Shield,
  MapPin,
  Calculator,
  TrendingUp,
  Home,
  FileText,
  HelpCircle,
  Sparkles,
  Cpu,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const BlockchainAIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "👋 Salut ! Je suis **TERRA-IA**, votre assistant blockchain immobilier intelligent. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef(null);

  // Suggestions rapides intelligentes
  const quickActions = [
    {
      icon: MapPin,
      text: "Terrains disponibles",
      action: "Montrez-moi les terrains disponibles avec vérification blockchain"
    },
    {
      icon: Calculator,
      text: "Calculer prix",
      action: "Calculer le prix d'un terrain à Dakar"
    },
    {
      icon: Shield,
      text: "Vérification blockchain",
      action: "Comment fonctionne la vérification blockchain des propriétés ?"
    },
    {
      icon: TrendingUp,
      text: "Marché immobilier",
      action: "Analyse du marché immobilier sénégalais actuel"
    }
  ];

  // Réponses prédéfinies intelligentes avec blockchain
  const aiResponses = {
    terrains: {
      keywords: ['terrain', 'parcelle', 'lot', 'disponible', 'acheter'],
      response: `🏞️ **Terrains Vérifiés Blockchain**

Voici nos terrains certifiés :

📍 **Dakar - Almadies** 
• 500m² - 45M FCFA ✅ Vérifié
• Titre foncier blockchain sécurisé

📍 **Thiès - Centre**
• 1000m² - 25M FCFA ✅ Vérifié  
• Smart contract activé

📍 **Mbour - Résidentiel**
• 750m² - 18M FCFA ✅ Vérifié
• NFT propriété disponible

🔗 Tous nos terrains sont vérifiés par blockchain et incluent :
• Certificat NFT de propriété
• Smart contract automatisé
• Historique transparent
• Paiement crypto accepté

Voulez-vous plus de détails sur une zone spécifique ?`
    },
    
    blockchain: {
      keywords: ['blockchain', 'vérification', 'sécurité', 'nft', 'crypto', 'smart contract'],
      response: `⛓️ **Technologie Blockchain Teranga**

Notre plateforme révolutionnaire utilise :

🔐 **Vérification Blockchain**
• Chaque propriété a un hash unique
• Impossibilité de falsification
• Transparence totale des transactions

💎 **NFT Propriétés** 
• Certificat numérique de propriété
• Transférable instantanément
• Stockage décentralisé sécurisé

🤖 **Smart Contracts**
• Paiements automatisés
• Conditions pré-programmées
• Exécution sans intermédiaire

🚀 **Avantages uniques :**
• Réduction des fraudes à 0%
• Transactions 10x plus rapides  
• Coûts réduits de 60%
• Sécurité maximale garantie

Souhaitez-vous voir un exemple de vérification blockchain ?`
    },

    prix: {
      keywords: ['prix', 'coût', 'calculer', 'tarif', 'budget'],
      response: `💰 **Calculateur Prix IA**

Prix moyens par région (mise à jour blockchain) :

📊 **Dakar Métropolitaine**
• Centre-ville : 80-120k FCFA/m²
• Almadies : 60-90k FCFA/m² 
• Parcelles Assainies : 45-65k FCFA/m²

📊 **Régions**
• Thiès : 15-35k FCFA/m²
• Saint-Louis : 12-25k FCFA/m²
• Mbour : 20-40k FCFA/m²

🎯 **Facteurs de prix IA :**
✅ Proximité mer/ville
✅ Infrastructures disponibles  
✅ Potentiel d'investissement
✅ Sécurité blockchain

💡 **Astuce :** Nos algorithmes d'IA analysent +50 critères pour un prix optimal !

Quelle zone vous intéresse pour un calcul précis ?`
    },

    marche: {
      keywords: ['marché', 'investissement', 'tendance', 'analyse', 'évolution'],
      response: `📈 **Analyse Marché IA - Temps Réel**

**État du Marché (Blockchain Data):**

🔥 **Tendances Actuelles**
• +15% croissance terrains Dakar (6 mois)
• +8% demande diaspora sénégalaise
• +25% adoption paiements crypto

🎯 **Opportunités Détectées par IA**
• Thiès : Potentiel +40% (5 ans)
• Mbour : Zone touristique en expansion
• Rufisque : Infrastructure en développement

⚡ **Alertes Blockchain**
• 🟢 Marché stable et croissant
• 🟢 Liquidité excellente  
• 🟢 Sécurité maximale

📱 **Prédictions IA 2024**
• Croissance prévue : +12-18%
• Zones émergentes identifiées
• ROI optimal : 8-15% annuel

Voulez-vous une analyse personnalisée de votre profil d'investissement ?`
    },

    help: {
      keywords: ['aide', 'comment', 'help', 'assistance', 'problème'],
      response: `🤖 **TERRA-IA - Assistant Intelligent**

Je peux vous aider avec :

🏡 **Recherche de Propriétés**
• Filtres intelligents IA
• Recommandations personnalisées
• Comparaison automatique

⛓️ **Blockchain & Crypto**
• Vérification propriétés
• Paiements cryptomonnaies
• Smart contracts expliqués

📊 **Analyses & Calculs**
• Évaluation prix terrain
• Simulation financement
• Prédictions marché

🔐 **Sécurité & Légal**
• Vérification documents
• Processus d'achat sécurisé
• Conseils juridiques IA

💬 **Questions fréquentes :**
• "Montrez-moi des terrains à [ville]"
• "Comment fonctionne la blockchain ?"
• "Calculer prix terrain 500m²"
• "Analyse investissement [région]"

Quelle est votre question ?`
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Recherche de mots-clés dans les réponses prédéfinies
    for (const [key, responseData] of Object.entries(aiResponses)) {
      if (responseData.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return responseData.response;
      }
    }

    // Réponse par défaut avec suggestions
    return `🤔 Je n'ai pas trouvé d'information spécifique sur "${message}".

Voici ce que je peux faire pour vous :

🔍 **Recherches populaires :**
• "Terrains disponibles Dakar"
• "Prix moyen terrain Thiès"  
• "Comment fonctionne la blockchain"
• "Analyse marché immobilier"

💡 **Astuce :** Soyez plus spécifique pour des réponses précises !

Ou choisissez une action rapide ci-dessous 👇`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user', 
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setShowQuickActions(false);

    // Simulation délai réponse IA
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: getAIResponse(inputMessage),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickAction = (action) => {
    setInputMessage(action);
    handleSendMessage();
  };

  const formatMessage = (content) => {
    // Convertir markdown simple en HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <>
      {/* Bouton d'ouverture du chat */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 hover:from-blue-600 hover:via-purple-600 hover:to-teal-600 shadow-2xl border-4 border-white/20 relative overflow-hidden group"
            >
              {/* Animation de particules */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
              
              {/* Icône avec animation */}
              <div className="relative z-10 flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>

              {/* Badge IA */}
              <div className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white">
                IA
              </div>
            </Button>
            
            {/* Tooltip d'invitation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2 }}
              className="absolute right-20 top-2 bg-white rounded-lg shadow-xl p-3 border border-gray-200 max-w-64"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                <Sparkles className="h-4 w-4 text-purple-500" />
                Assistant IA Blockchain
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Trouvez votre terrain idéal avec l'IA !
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interface du Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden"
          >
            {/* Header du Chat */}
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 p-4 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-white/30">
                    <AvatarImage src="/api/placeholder/40/40" />
                    <AvatarFallback className="bg-white/20 text-white">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold flex items-center gap-2">
                      TERRA-IA
                      <Badge className="bg-yellow-400 text-black text-xs">
                        <Cpu className="h-3 w-3 mr-1" />
                        SMART
                      </Badge>
                    </h3>
                    <p className="text-xs text-white/90 flex items-center gap-1">
                      <Database className="h-3 w-3" />
                      Assistant Blockchain
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Zone des Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      {message.type === 'user' ? (
                        <AvatarFallback className="bg-blue-500 text-white">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      ) : (
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div className={`rounded-2xl p-3 ${
                      message.type === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white border border-gray-200 shadow-sm'
                    }`}>
                      <div 
                        className={`text-sm ${message.type === 'user' ? 'text-white' : 'text-gray-800'}`}
                        dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                      />
                      <div className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                        {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Indicateur de frappe */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
                      <div className="flex gap-1">
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

            {/* Actions Rapides */}
            {showQuickActions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border-t border-gray-200 bg-white"
              >
                <p className="text-xs text-gray-600 mb-3 flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Actions rapides
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action.action)}
                      className="text-xs h-auto py-2 flex items-center gap-1 hover:bg-blue-50 hover:border-blue-300"
                    >
                      <action.icon className="h-3 w-3" />
                      {action.text}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Zone de Saisie */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Posez votre question..."
                  className="flex-1 border-gray-300 focus:border-blue-500 rounded-xl"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Indicateur IA */}
              <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
                <Brain className="h-3 w-3 mr-1" />
                Alimenté par l'IA Blockchain Teranga
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BlockchainAIChatbot;
