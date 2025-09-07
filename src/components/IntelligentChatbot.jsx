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
      text: "Salut ! Je suis Teranga AI 🤖, votre assistant immobilier blockchain. Comment puis-je vous aider aujourd'hui ?",
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

  // Réponses intelligentes du chatbot
  const responses = {
    // Salutations
    greetings: [
      "bonjour", "salut", "hello", "bonsoir", "hey", "coucou"
    ],
    greetingResponses: [
      "Bonjour ! Bienvenue sur Teranga Foncier 🏠. Je suis là pour vous accompagner dans vos projets immobiliers blockchain !",
      "Salut ! Ravi de vous voir sur notre plateforme ! Comment puis-je vous aider avec vos projets immobiliers ?",
      "Hello ! Je suis Teranga AI, votre guide dans l'univers de l'immobilier blockchain sénégalais 🇸🇳"
    ],

    // Questions sur les terrains
    terrain: [
      "terrain", "parcelle", "lot", "foncier", "acheter", "vendre"
    ],
    terrainResponses: [
      "🏞️ Excellent ! Nous avons plus de 1,284 terrains vérifiés blockchain. Voulez-vous :\n• Parcourir par région (Dakar, Thiès, Mbour...)\n• Filtrer par prix\n• Voir les terrains NFT\n• Obtenir une évaluation IA ?",
      "🗺️ Super ! Notre catalogue comprend des terrains dans toutes les régions du Sénégal, tous vérifiés par blockchain. Quel type de terrain vous intéresse ?",
      "📍 Parfait ! Tous nos terrains sont certifiés NFT pour éviter les fraudes. Dans quelle zone cherchez-vous ?"
    ],

    // Questions sur la blockchain
    blockchain: [
      "blockchain", "nft", "smart contract", "crypto", "sécurité", "fraude"
    ],
    blockchainResponses: [
      "🔐 La blockchain garantit que chaque propriété est unique et vérifiable ! Chaque terrain devient un NFT avec :\n• Titre de propriété inviolable\n• Historique complet des transactions\n• Protection contre les doubles ventes\n• Smart contracts pour paiements automatiques",
      "⛓️ Notre blockchain Ethereum sécurise toutes les transactions ! Plus de fraude possible grâce à :\n• Vérification par IA\n• Registre public immuable\n• Signatures cryptographiques\n• Traçabilité complète",
      "🛡️ Avec 2,847 NFT créés et 0% de fraude détectée, notre blockchain révolutionne l'immobilier sénégalais !"
    ],

    // Questions sur les prix
    prix: [
      "prix", "coût", "budget", "financement", "crédit", "paiement"
    ],
    prixResponses: [
      "💰 Nos prix varient selon la localisation :\n• Dakar centre : 25,000-50,000 FCFA/m²\n• Banlieue Dakar : 8,000-20,000 FCFA/m²\n• Thiès/Mbour : 3,000-12,000 FCFA/m²\n\nVoulez-vous une estimation personnalisée ?",
      "💳 Nous proposons plusieurs options de financement :\n• Paiement échelonné blockchain\n• Partenariat avec 12 banques\n• Taux préférentiels diaspora\n• Smart contracts sécurisés",
      "🏦 Taux actuels : Crédit habitat 6.5% | ROI moyen 18.5% | Financement jusqu'à 25 ans"
    ],

    // Questions sur la construction
    construction: [
      "construction", "bâtir", "projet", "promoteur", "maison", "villa"
    ],
    constructionResponses: [
      "🏗️ Nos 45 promoteurs certifiés proposent :\n• Suivi construction par IA satellite\n• Rapports photos quotidiens\n• Paiements liés à l'avancement\n• Garanties blockchain\n\nVoulez-vous voir les projets disponibles ?",
      "🏠 Construction moderne avec technologie :\n• Surveillance 24/7 par IA\n• Matériaux de qualité certifiés\n• Respect des délais (72h vs 3 mois)\n• Garantie décennale blockchain",
      "👷 125 projets actifs avec suivi temps réel ! Quel type de construction vous intéresse ?"
    ],

    // Questions sur la diaspora
    diaspora: [
      "diaspora", "étranger", "france", "italie", "usa", "distance"
    ],
    diasporaResponses: [
      "🌍 Spécialement conçu pour la diaspora ! Services inclus :\n• Visite virtuelle 360°\n• Support multidevise (EUR, USD, CAD)\n• Accompagnement juridique\n• Suivi construction à distance\n• Support 24/7 en français",
      "✈️ 3,100+ membres diaspora nous font confiance ! Nous couvrons 50+ pays avec :\n• Transferts sécurisés blockchain\n• Vérification à distance\n• Représentation légale locale\n• Garanties internationales",
      "🇸🇳 Investir depuis l'étranger n'a jamais été aussi sûr ! Notre plateforme élimine tous les risques traditionnels."
    ],

    // Questions générales
    help: [
      "aide", "comment", "pourquoi", "qui", "quoi", "où"
    ],
    helpResponses: [
      "🤝 Je peux vous aider avec :\n• Recherche de terrains/propriétés\n• Explication blockchain\n• Calculs de prix/financement\n• Contact promoteurs\n• Processus d'achat\n• Support diaspora\n\nQue souhaitez-vous savoir ?",
      "📚 Services disponibles :\n• Catalogue 1,284 terrains\n• 125 projets construction\n• Outils d'évaluation IA\n• Support multilingue\n• Guides détaillés\n\nPar quoi commencer ?",
      "💡 Teranga Foncier c'est :\n• 1ère plateforme blockchain immobilière du Sénégal\n• 8,200+ utilisateurs satisfaits\n• 0% de fraude détectée\n• Support 24/7\n\nUne question spécifique ?"
    ]
  };

  // Suggestions contextuelles
  const quickActions = [
    { icon: Home, text: "Chercher un terrain", category: "terrain" },
    { icon: Building2, text: "Voir les projets", category: "construction" },
    { icon: MapPin, text: "Explorer par région", category: "terrain" },
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

  // Analyser le message et générer une réponse intelligente
  const generateResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    // Vérifier les catégories de mots-clés
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

    // Réponse par défaut intelligente
    return {
      text: "🤔 Je comprends votre question ! Pour vous donner la meilleure réponse, pourriez-vous préciser si vous cherchez des informations sur :\n• Les terrains disponibles\n• Les processus blockchain\n• Les financements\n• Les projets de construction\n• Les services diaspora ?",
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
      blockchain: ["Smart contracts", "Sécurité NFT", "Éviter fraudes", "Guide blockchain"],
      prix: ["Calculer budget", "Options crédit", "Taux actuels", "Simulation"],
      construction: ["Projets actifs", "Suivi IA", "Promoteurs certifiés", "Faire devis"],
      diaspora: ["Services diaspora", "Visite virtuelle", "Support multidevise", "Investir distance"],
      help: ["Guide complet", "Créer compte", "Contacter expert", "Démo plateforme"]
    };
    return suggestionMap[category] || ["Aide générale", "Contacter support", "Guide utilisateur"];
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

    // Simuler délai de réflexion
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
            Besoin d'aide ? 💬
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
                    <span className="text-xs text-gray-500">Teranga AI réfléchit...</span>
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
                  placeholder="Tapez votre message..."
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
