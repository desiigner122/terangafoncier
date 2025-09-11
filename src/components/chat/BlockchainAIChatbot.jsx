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
      content: "ðŸ‘‹ Salut ! Je suis **TERRA-IA**, votre assistant blockchain immobilier intelligent. Comment puis-je vous aider aujourd'hui ?",
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
      action: "Montrez-moi les terrains disponibles avec vÃ©rification blockchain"
    },
    {
      icon: Calculator,
      text: "Calculer prix",
      action: "Calculer le prix d'un terrain Ã  Dakar"
    },
    {
      icon: Shield,
      text: "VÃ©rification blockchain",
      action: "Comment fonctionne la vÃ©rification blockchain des propriÃ©tÃ©s ?"
    },
    {
      icon: TrendingUp,
      text: "MarchÃ© immobilier",
      action: "Analyse du marchÃ© immobilier sÃ©nÃ©galais actuel"
    }
  ];

  // RÃ©ponses prÃ©dÃ©finies intelligentes avec blockchain
  const aiResponses = {
    terrains: {
      keywords: ['terrain', 'parcelle', 'lot', 'disponible', 'acheter'],
      response: `ðŸžï¸ **Terrains VÃ©rifiÃ©s Blockchain**

Voici nos terrains certifiÃ©s :

ðŸ“ **Dakar - Almadies** 
â€¢ 500mÂ² - 45M FCFA âœ… VÃ©rifiÃ©
â€¢ Titre foncier blockchain sÃ©curisÃ©

ðŸ“ **ThiÃ¨s - Centre**
â€¢ 1000mÂ² - 25M FCFA âœ… VÃ©rifiÃ©  
â€¢ Smart contract activÃ©

ðŸ“ **Mbour - RÃ©sidentiel**
â€¢ 750mÂ² - 18M FCFA âœ… VÃ©rifiÃ©
â€¢ NFT propriÃ©tÃ© disponible

ðŸ”— Tous nos terrains sont vÃ©rifiÃ©s par blockchain et incluent :
â€¢ Certificat NFT de propriÃ©tÃ©
â€¢ Smart contract automatisÃ©
â€¢ Historique transparent
â€¢ Paiement crypto acceptÃ©

Voulez-vous plus de dÃ©tails sur une zone spÃ©cifique ?`
    },
    
    blockchain: {
      keywords: ['blockchain', 'vÃ©rification', 'sÃ©curitÃ©', 'nft', 'crypto', 'smart contract'],
      response: `â›“ï¸ **Technologie Blockchain Teranga**

Notre plateforme rÃ©volutionnaire utilise :

ðŸ” **VÃ©rification Blockchain**
â€¢ Chaque propriÃ©tÃ© a un hash unique
â€¢ ImpossibilitÃ© de falsification
â€¢ Transparence totale des transactions

ðŸ’Ž **NFT PropriÃ©tÃ©s** 
â€¢ Certificat numÃ©rique de propriÃ©tÃ©
â€¢ TransfÃ©rable instantanÃ©ment
â€¢ Stockage dÃ©centralisÃ© sÃ©curisÃ©

ðŸ¤– **Smart Contracts**
â€¢ Paiements automatisÃ©s
â€¢ Conditions prÃ©-programmÃ©es
â€¢ ExÃ©cution sans intermÃ©diaire

ðŸš€ **Avantages uniques :**
â€¢ RÃ©duction des fraudes Ã  0%
â€¢ Transactions 10x plus rapides  
â€¢ CoÃ»ts rÃ©duits de 60%
â€¢ SÃ©curitÃ© maximale garantie

Souhaitez-vous voir un exemple de vÃ©rification blockchain ?`
    },

    prix: {
      keywords: ['prix', 'coÃ»t', 'calculer', 'tarif', 'budget'],
      response: `ðŸ’° **Calculateur Prix IA**

Prix moyens par rÃ©gion (mise Ã  jour blockchain) :

ðŸ“Š **Dakar MÃ©tropolitaine**
â€¢ Centre-ville : 80-120k FCFA/mÂ²
â€¢ Almadies : 60-90k FCFA/mÂ² 
â€¢ Parcelles Assainies : 45-65k FCFA/mÂ²

ðŸ“Š **RÃ©gions**
â€¢ ThiÃ¨s : 15-35k FCFA/mÂ²
â€¢ Saint-Louis : 12-25k FCFA/mÂ²
â€¢ Mbour : 20-40k FCFA/mÂ²

ðŸŽ¯ **Facteurs de prix IA :**
âœ… ProximitÃ© mer/ville
âœ… Infrastructures disponibles  
âœ… Potentiel d'investissement
âœ… SÃ©curitÃ© blockchain

ðŸ’¡ **Astuce :** Nos algorithmes d'IA analysent +50 critÃ¨res pour un prix optimal !

Quelle zone vous intÃ©resse pour un calcul prÃ©cis ?`
    },

    marche: {
      keywords: ['marchÃ©', 'investissement', 'tendance', 'analyse', 'Ã©volution'],
      response: `ðŸ“ˆ **Analyse MarchÃ© IA - Temps RÃ©el**

**Ã‰tat du MarchÃ© (Blockchain Data):**

ðŸ”¥ **Tendances Actuelles**
â€¢ +15% croissance terrains Dakar (6 mois)
â€¢ +8% demande diaspora sÃ©nÃ©galaise
â€¢ +25% adoption paiements crypto

ðŸŽ¯ **OpportunitÃ©s DÃ©tectÃ©es par IA**
â€¢ ThiÃ¨s : Potentiel +40% (5 ans)
â€¢ Mbour : Zone touristique en expansion
â€¢ Rufisque : Infrastructure en dÃ©veloppement

âš¡ **Alertes Blockchain**
â€¢ ðŸŸ¢ MarchÃ© stable et croissant
â€¢ ðŸŸ¢ LiquiditÃ© excellente  
â€¢ ðŸŸ¢ SÃ©curitÃ© maximale

ðŸ“± **PrÃ©dictions IA 2024**
â€¢ Croissance prÃ©vue : +12-18%
â€¢ Zones Ã©mergentes identifiÃ©es
â€¢ ROI optimal : 8-15% annuel

Voulez-vous une analyse personnalisÃ©e de votre profil d'investissement ?`
    },

    help: {
      keywords: ['aide', 'comment', 'help', 'assistance', 'problÃ¨me'],
      response: `ðŸ¤– **TERRA-IA - Assistant Intelligent**

Je peux vous aider avec :

ðŸ¡ **Recherche de PropriÃ©tÃ©s**
â€¢ Filtres intelligents IA
â€¢ Recommandations personnalisÃ©es
â€¢ Comparaison automatique

â›“ï¸ **Blockchain & Crypto**
â€¢ VÃ©rification propriÃ©tÃ©s
â€¢ Paiements cryptomonnaies
â€¢ Smart contracts expliquÃ©s

ðŸ“Š **Analyses & Calculs**
â€¢ Ã‰valuation prix terrain
â€¢ Simulation financement
â€¢ PrÃ©dictions marchÃ©

ðŸ” **SÃ©curitÃ© & LÃ©gal**
â€¢ VÃ©rification documents
â€¢ Processus d'achat sÃ©curisÃ©
â€¢ Conseils juridiques IA

ðŸ’¬ **Questions frÃ©quentes :**
â€¢ "Montrez-moi des terrains Ã  [ville]"
â€¢ "Comment fonctionne la blockchain ?"
â€¢ "Calculer prix terrain 500mÂ²"
â€¢ "Analyse investissement [rÃ©gion]"

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
    
    // Recherche de mots-clÃ©s dans les rÃ©ponses prÃ©dÃ©finies
    for (const [key, responseData] of Object.entries(aiResponses)) {
      if (responseData.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return responseData.response;
      }
    }

    // RÃ©ponse par dÃ©faut avec suggestions
    return `ðŸ¤” Je n'ai pas trouvÃ© d'information spÃ©cifique sur "${message}".

Voici ce que je peux faire pour vous :

ðŸ” **Recherches populaires :**
â€¢ "Terrains disponibles Dakar"
â€¢ "Prix moyen terrain ThiÃ¨s"  
â€¢ "Comment fonctionne la blockchain"
â€¢ "Analyse marchÃ© immobilier"

ðŸ’¡ **Astuce :** Soyez plus spÃ©cifique pour des rÃ©ponses prÃ©cises !

Ou choisissez une action rapide ci-dessous ðŸ‘‡`;
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

    // Simulation dÃ©lai rÃ©ponse IA
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
              
              {/* IcÃ´ne avec animation */}
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
                Trouvez votre terrain idÃ©al avec l'IA !
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
                    <AvatarImage src="/api/YOUR_API_KEY/40/40" />
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
                  YOUR_API_KEY="Posez votre question..."
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
                AlimentÃ© par l'IA Blockchain Teranga
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BlockchainAIChatbot;
