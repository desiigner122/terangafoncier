import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, User, Sparkles, Lightbulb, Search, Home, Building2, MapPin, CreditCard, Shield, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const IntelligentChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Salut ! Je suis Teranga AI ðŸ¤–, votre assistant immobilier blockchain. Comment puis-je vous aider aujourd'hui ?",
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [
        "Rechercher un terrain",
        "Comprendre la blockchain",
        "Calculer un prix",
        "Contacter un promoteur"
      ]
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // RÃ©ponses intelligentes du chatbot
  const responses = {
    // Salutations
    greetings: [
      "bonjour", "salut", "hello", "bonsoir", "hey", "coucou"
    ],
    greetingResponses: [
      "Bonjour ! Bienvenue sur Teranga Foncier ðŸ . Je suis lÃ  pour vous accompagner dans vos projets immobiliers blockchain !",
      "Salut ! Ravi de vous voir sur notre plateforme ! Comment puis-je vous aider avec vos projets immobiliers ?",
      "Hello ! Je suis Teranga AI, votre guide dans l'univers de l'immobilier blockchain sÃ©nÃ©galais ðŸ‡¸ðŸ‡³"
    ],

    // Questions sur les terrains
    terrain: [
      "terrain", "parcelle", "lot", "foncier", "acheter", "vendre"
    ],
    terrainResponses: [
      "ðŸžï¸ Excellent ! Nous avons plus de 1,284 terrains vÃ©rifiÃ©s blockchain. Voulez-vous :\nâ€¢ Parcourir par rÃ©gion (Dakar, ThiÃ¨s, Mbour...)\nâ€¢ Filtrer par prix\nâ€¢ Voir les terrains NFT\nâ€¢ Obtenir une Ã©valuation IA ?",
      "ðŸ—ºï¸ Super ! Notre catalogue comprend des terrains dans toutes les rÃ©gions du SÃ©nÃ©gal, tous vÃ©rifiÃ©s par blockchain. Quel type de terrain vous intÃ©resse ?",
      "ðŸ“ Parfait ! Tous nos terrains sont certifiÃ©s NFT pour Ã©viter les fraudes. Dans quelle zone cherchez-vous ?"
    ],

    // Questions sur la blockchain
    blockchain: [
      "blockchain", "nft", "smart contract", "crypto", "sÃ©curitÃ©", "fraude"
    ],
    blockchainResponses: [
      "ðŸ” La blockchain garantit que chaque propriÃ©tÃ© est unique et vÃ©rifiable ! Chaque terrain devient un NFT avec :\nâ€¢ Titre de propriÃ©tÃ© inviolable\nâ€¢ Historique complet des transactions\nâ€¢ Protection contre les doubles ventes\nâ€¢ Smart contracts pour paiements automatiques",
      "â›“ï¸ Notre blockchain Ethereum sÃ©curise toutes les transactions ! Plus de fraude possible grÃ¢ce Ã  :\nâ€¢ VÃ©rification par IA\nâ€¢ Registre public immuable\nâ€¢ Signatures cryptographiques\nâ€¢ TraÃ§abilitÃ© complÃ¨te",
      "ðŸ›¡ï¸ Avec 2,847 NFT crÃ©Ã©s et 0% de fraude dÃ©tectÃ©e, notre blockchain rÃ©volutionne l'immobilier sÃ©nÃ©galais !"
    ],

    // Questions sur les prix
    prix: [
      "prix", "coÃ»t", "budget", "financement", "crÃ©dit", "paiement"
    ],
    prixResponses: [
      "ðŸ’° Nos prix varient selon la localisation :\nâ€¢ Dakar centre : 25,000-50,000 FCFA/mÂ²\nâ€¢ Banlieue Dakar : 8,000-20,000 FCFA/mÂ²\nâ€¢ ThiÃ¨s/Mbour : 3,000-12,000 FCFA/mÂ²\n\nVoulez-vous une estimation personnalisÃ©e ?",
      "ðŸ’³ Nous proposons plusieurs options de financement :\nâ€¢ Paiement Ã©chelonnÃ© blockchain\nâ€¢ Partenariat avec 12 banques\nâ€¢ Taux prÃ©fÃ©rentiels diaspora\nâ€¢ Smart contracts sÃ©curisÃ©s",
      "ðŸ¦ Taux actuels : CrÃ©dit habitat 6.5% | ROI moyen 18.5% | Financement jusqu'Ã  25 ans"
    ],

    // Questions sur la construction
    construction: [
      "construction", "bÃ¢tir", "projet", "promoteur", "maison", "villa"
    ],
    constructionResponses: [
      "ðŸ—ï¸ Nos 45 promoteurs certifiÃ©s proposent :\nâ€¢ Suivi construction par IA satellite\nâ€¢ Rapports photos quotidiens\nâ€¢ Paiements liÃ©s Ã  l'avancement\nâ€¢ Garanties blockchain\n\nVoulez-vous voir les projets disponibles ?",
      "ðŸ  Construction moderne avec technologie :\nâ€¢ Surveillance 24/7 par IA\nâ€¢ MatÃ©riaux de qualitÃ© certifiÃ©s\nâ€¢ Respect des dÃ©lais (72h vs 3 mois)\nâ€¢ Garantie dÃ©cennale blockchain",
      "ðŸ‘· 125 projets actifs avec suivi temps rÃ©el ! Quel type de construction vous intÃ©resse ?"
    ],

    // Questions sur la diaspora
    diaspora: [
      "diaspora", "Ã©tranger", "france", "italie", "usa", "distance"
    ],
    diasporaResponses: [
      "ðŸŒ SpÃ©cialement conÃ§u pour la diaspora ! Services inclus :\nâ€¢ Visite virtuelle 360Â°\nâ€¢ Support multidevise (EUR, USD, CAD)\nâ€¢ Accompagnement juridique\nâ€¢ Suivi construction Ã  distance\nâ€¢ Support 24/7 en franÃ§ais",
      "âœˆï¸ 3,100+ membres diaspora nous font confiance ! Nous couvrons 50+ pays avec :\nâ€¢ Transferts sÃ©curisÃ©s blockchain\nâ€¢ VÃ©rification Ã  distance\nâ€¢ ReprÃ©sentation lÃ©gale locale\nâ€¢ Garanties internationales",
      "ðŸ‡¸ðŸ‡³ Investir depuis l'Ã©tranger n'a jamais Ã©tÃ© aussi sÃ»r ! Notre plateforme Ã©limine tous les risques traditionnels."
    ],

    // Questions gÃ©nÃ©rales
    help: [
      "aide", "comment", "pourquoi", "qui", "quoi", "oÃ¹"
    ],
    helpResponses: [
      "ðŸ¤ Je peux vous aider avec :\nâ€¢ Recherche de terrains/propriÃ©tÃ©s\nâ€¢ Explication blockchain\nâ€¢ Calculs de prix/financement\nâ€¢ Contact promoteurs\nâ€¢ Processus d'achat\nâ€¢ Support diaspora\n\nQue souhaitez-vous savoir ?",
      "ðŸ“š Services disponibles :\nâ€¢ Catalogue 1,284 terrains\nâ€¢ 125 projets construction\nâ€¢ Outils d'Ã©valuation IA\nâ€¢ Support multilingue\nâ€¢ Guides dÃ©taillÃ©s\n\nPar quoi commencer ?",
      "ðŸ’¡ Teranga Foncier c'est :\nâ€¢ 1Ã¨re plateforme blockchain immobiliÃ¨re du SÃ©nÃ©gal\nâ€¢ 8,200+ utilisateurs satisfaits\nâ€¢ 0% de fraude dÃ©tectÃ©e\nâ€¢ Support 24/7\n\nUne question spÃ©cifique ?"
    ]
  };

  // Suggestions contextuelles
  const quickActions = [
    { icon: Home, text: "Chercher un terrain", category: "terrain" },
    { icon: Building2, text: "Voir les projets", category: "construction" },
    { icon: MapPin, text: "Explorer par rÃ©gion", category: "terrain" },
    { icon: CreditCard, text: "Calculer financement", category: "prix" },
    { icon: Shield, text: "Comprendre blockchain", category: "blockchain" },
    { icon: Phone, text: "Contacter support", category: "help" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Analyser le message et gÃ©nÃ©rer une rÃ©ponse intelligente
  const generateResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    // VÃ©rifier les catÃ©gories de mots-clÃ©s
    for (const [category, keywords] of Object.entries(responses)) {
      if (keywords.includes && keywords.some(keyword => msg.includes(keyword))) {
        const responseKey = category + 'Responses';
        if (responses[responseKey]) {
          const randomResponse = responses[responseKey][Math.floor(Math.random() * responses[responseKey].length)];
          return {
            text: randomResponse,
            suggestions: getSuggestions(category)
          };
        }
      }
    }

    // RÃ©ponse par dÃ©faut intelligente
    return {
      text: "ðŸ¤” Je comprends votre question ! Pour vous donner la meilleure rÃ©ponse, pourriez-vous prÃ©ciser si vous cherchez des informations sur :\nâ€¢ Les terrains disponibles\nâ€¢ Les processus blockchain\nâ€¢ Les financements\nâ€¢ Les projets de construction\nâ€¢ Les services diaspora ?",
      suggestions: [
        "Voir les terrains",
        "Expliquer blockchain", 
        "Options financement",
        "Projets disponibles"
      ]
    };
  };

  const getSuggestions = (category) => {
    const suggestionMap = {
      terrain: ["Voir le catalogue", "Filtrer par prix", "Localisation Dakar", "Terrains NFT"],
      blockchain: ["Smart contracts", "SÃ©curitÃ© NFT", "Ã‰viter fraudes", "Guide blockchain"],
      prix: ["Calculer budget", "Options crÃ©dit", "Taux actuels", "Simulation"],
      construction: ["Projets actifs", "Suivi IA", "Promoteurs certifiÃ©s", "Faire devis"],
      diaspora: ["Services diaspora", "Visite virtuelle", "Support multidevise", "Investir distance"],
      help: ["Guide complet", "CrÃ©er compte", "Contacter expert", "DÃ©mo plateforme"]
    };
    return suggestionMap[category] || ["Aide gÃ©nÃ©rale", "Contacter support", "Guide utilisateur"];
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simuler dÃ©lai de rÃ©flexion
    setTimeout(() => {
      const response = generateResponse(currentMessage);
      const botMessage = {
        id: Date.now() + 1,
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: response.suggestions
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion) => {
    setCurrentMessage(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <>
      {/* Bouton flottant */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300"
        >
          <MessageCircle className="w-8 h-8" />
        </Button>
        {!isOpen && (
          <motion.div
            className="absolute -top-12 -left-20 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 3 }}
          >
            Besoin d'aide ? ðŸ’¬
          </motion.div>
        )}
      </motion.div>

      {/* Interface de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">Teranga AI</h3>
                  <p className="text-xs opacity-90 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    En ligne - Assistant IA
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-l-2xl rounded-tr-2xl' 
                      : 'bg-gray-100 text-gray-900 rounded-r-2xl rounded-tl-2xl'
                  } p-3`}>
                    <div className="flex items-start space-x-2">
                      {message.sender === 'bot' && (
                        <Sparkles className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                      )}
                      <div className="whitespace-pre-wrap text-sm">{message.text}</div>
                    </div>
                    
                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left p-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-blue-50 hover:border-blue-200 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 rounded-r-2xl rounded-tl-2xl p-3 flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">Teranga AI rÃ©flÃ©chit...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Actions rapides */}
            <div className="p-3 border-t border-gray-100">
              <div className="grid grid-cols-3 gap-2 mb-3">
                {quickActions.slice(0, 6).map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(action.text)}
                    className="flex flex-col items-center p-2 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors text-xs"
                  >
                    <action.icon className="w-4 h-4 text-blue-600 mb-1" />
                    <span className="text-gray-700 text-center">{action.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex space-x-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  YOUR_API_KEY="Tapez votre message..."
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isTyping}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default IntelligentChatbot;
