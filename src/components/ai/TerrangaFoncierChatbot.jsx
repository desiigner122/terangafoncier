import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Sparkles
} from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContextFixed';

const TerrangaFoncierChatbot = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useSupabaseAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Base de connaissances FAQ Teranga Foncier
  const faqDatabase = {
    // Questions sur les services
    "comment acheter terrain": {
      response: "🏠 **Acheter un terrain sur Teranga Foncier :**\n\n1. **Parcourez** notre catalogue de terrains disponibles\n2. **Contactez** le vendeur via notre messagerie sécurisée\n3. **Vérifiez** les FileTexts fonciers avec nos notaires partenaires\n4. **Finalisez** la transaction avec accompagnement juridique\n\n✅ Tous nos terrains sont vérifiés et géolocalisés !",
      keywords: ["acheter", "terrain", "achat", "propriété", "parcelle"]
    },
    "comment vendre terrain": {
      response: "💰 **Vendre votre terrain :**\n\n1. **Créez** votre annonce avec photos et description\n2. **Uploadez** vos FileTexts fonciers\n3. **Attendez** la vérification par nos experts\n4. **Recevez** des offres d'acheteurs qualifiés\n\n📋 **FileTexts requis :** Titre foncier, carte d'identité, justificatif de domicile",
      keywords: ["vendre", "vente", "vendeur", "annonce", "mettre en vente"]
    },
    "comment devenir vendeur": {
      response: "🎯 **Devenir vendeur sur Teranga Foncier :**\n\n1. **Connectez-vous** à votre compte\n2. **Cliquez** sur \"Devenir Vendeur\" dans votre profil\n3. **Soumettez** vos FileTexts (CNI, justificatif domicile)\n4. **Attendez** la validation (24-48h)\n\n🔍 **Avantages :** Commission réduite, outils marketing, support dédié",
      keywords: ["devenir vendeur", "vendeur", "comment devenir", "inscription vendeur"]
    },
    "prix commission": {
      response: "💳 **Nos commissions :**\n\n• **Particuliers :** 2% du prix de vente\n• **Vendeurs Pro :** 1.5% du prix de vente\n• **Primo-vendeurs :** 1% les 6 premiers mois\n\n🎁 **Promotion :** Première vente gratuite pour les nouveaux inscrits !",
      keywords: ["prix", "commission", "frais", "coût", "tarif"]
    },
    "FileTexts requis": {
      response: "📄 **FileTexts nécessaires :**\n\n**Pour vendre :**\n• Titre foncier ou acte de vente\n• Carte d'identité nationale\n• Justificatif de domicile récent\n\n**Pour acheter :**\n• Carte d'identité\n• Justificatif de revenus\n• Attestation bancaire\n\n✅ Tous les FileTexts sont vérifiés par nos notaires partenaires",
      keywords: ["FileTexts", "papiers", "requis", "nécessaires", "titre foncier"]
    },
    "financement crédit": {
      response: "🏦 **Solutions de financement :**\n\nNos **banques partenaires** :\n• **CBAO** - Crédit habitat jusqu'à 80%\n• **BOA** - Crédit terrain jusqu'à 70%\n• **Ecobank** - Solutions personnalisées\n\n📞 **Simulation gratuite** avec nos conseillers financiers\n💡 **Conseil :** Préparez votre dossier en amont !",
      keywords: ["financement", "crédit", "banque", "prêt", "financer"]
    },
    "régions disponibles": {
      response: "🗺️ **Teranga Foncier couvre tout le Sénégal :**\n\n**Principales régions :**\n• Dakar & Banlieue (plus de 500 terrains)\n• Thiès & Mbour (zone touristique)\n• Saint-Louis (patrimoine historique)\n• Kaolack (centre commercial)\n• Ziguinchor (Casamance)\n\n📍 **14 régions** couvertes avec géolocalisation précise",
      keywords: ["régions", "où", "zones", "secteurs", "localisation", "dakar", "thiès"]
    },
    "sécurité transaction": {
      response: "🔒 **Sécurité garantie :**\n\n• **Vérification** : Tous les terrains sont contrôlés\n• **Notaires** : Authentification par professionnels\n• **Géomètres** : Délimitation précise\n• **Assurance** : Protection jusqu'à 50M FCFA\n\n⚖️ **Support juridique** inclus dans toutes nos transactions",
      keywords: ["sécurité", "sûr", "arnaque", "fiable", "confiance", "protection"]
    },
    "contact support": {
      response: "📞 **Contactez notre support :**\n\n• **Téléphone :** +221 77 593 42 41\n• **WhatsApp :** +221 77 593 42 41  \n• **Email :** support@terangafoncier.com\n• **Chat :** Directement sur la plateforme\n\n⏰ **Horaires :** Lun-Ven 8h-22h, Sam-Dim 9h-20h\n🚀 **Réponse moyenne :** 24 heures maximum",
      keywords: ["contact", "support", "aide", "assistance", "problème", "téléphone"]
    }
  };

  // Messages d'accueil personnalisés selon le rôle
  const getWelcomeMessage = () => {
    const userName = user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Utilisateur';
    const userRole = user?.role || user?.user_type || 'Particulier';
    
    const roleMessages = {
      'Particulier': `Bonjour ${userName} ! 👋 Je suis votre assistant Teranga Foncier. Je peux vous aider à trouver le terrain parfait ou répondre à vos questions sur l'immobilier au Sénégal.`,
      'Vendeur Particulier': `Bonjour ${userName} ! 💼 En tant que vendeur, je peux vous aider à optimiser vos annonces, comprendre les démarches de vente et maximiser vos chances de transaction.`,
      'Vendeur Pro': `Bonjour ${userName} ! 🏢 Je suis là pour vous accompagner dans vos ventes professionnelles, la gestion de votre portfolio et l'optimisation de votre activité.`,
      'Banque': `Bonjour ${userName} ! 🏦 Je peux vous renseigner sur les solutions de financement, les partenariats et l'intégration de vos services bancaires.`,
      'Notaire': `Bonjour ${userName} ! ⚖️ Je suis disponible pour toutes questions sur la vérification des actes, les procédures d'authentification et la sécurisation des transactions.`,
      'Agent Foncier': `Bonjour ${userName} ! 🏢 Je peux vous aider avec les vérifications foncières, les procédures administratives et la gestion des dossiers.`,
      'Mairie': `Bonjour ${userName} ! 🏛️ Je suis à votre disposition pour les questions sur les demandes municipales, les autorisations et les démarches administratives.`
    };

    return roleMessages[userRole] || roleMessages['Particulier'];
  };

  // Questions suggérées selon le rôle
  const getSuggestedQuestions = () => {
    const userRole = user?.role || user?.user_type || 'Particulier';
    
    const roleSuggestions = {
      'Particulier': [
        "Comment acheter un terrain ?",
        "Quels FileTexts pour acheter ?",
        "Comment obtenir un crédit ?",
        "Quelles régions disponibles ?"
      ],
      'Vendeur Particulier': [
        "Comment créer une annonce ?",
        "Quels sont les frais de commission ?",
        "Comment devenir vendeur ?",
        "Durée de validation d'annonce ?"
      ],
      'Banque': [
        "Comment devenir partenaire ?",
        "Solutions de financement disponibles",
        "Intégration API bancaire",
        "Critères d'éligibilité crédit"
      ],
      'Notaire': [
        "Procédures d'authentification",
        "FileTexts à vérifier",
        "Sécurisation des transactions",
        "Rôle du notaire sur la plateforme"
      ]
    };

    return roleSuggestions[userRole] || roleSuggestions['Particulier'];
  };

  // Intelligence artificielle simple pour répondre
  const generateResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Recherche dans la FAQ
    for (const [key, value] of Object.entries(faqDatabase)) {
      if (value.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return value.response;
      }
    }

    // Réponses contextuelles selon le rôle
    const userRole = user?.role || 'Particulier';
    
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut')) {
      return `Bonjour ! 😊 Je suis ravi de vous aider. En tant que ${userRole}, quelles sont vos questions sur Teranga Foncier ?`;
    }

    if (lowerMessage.includes('merci')) {
      return "De rien ! 😊 N'hésitez pas si vous avez d'autres questions. Je suis là pour vous aider à réussir sur Teranga Foncier ! 🏠✨";
    }

    // Réponse par défaut intelligente
    return `🤖 Je n'ai pas trouvé d'information spécifique sur "${message}". \n\nVoici ce que je peux vous aider à comprendre :\n• Acheter ou vendre un terrain\n• Procédures et documents\n• Financement et crédits\n• Sécurité des transactions\n\n💬 Reformulez votre question ou contactez notre support au +221 77 593 42 41`;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulation de délai de réponse
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: generateResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // 1-3 secondes
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  // Initialiser avec message de bienvenue
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: 0,
        text: getWelcomeMessage(),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4"
          >
            <Card className="w-96 h-[500px] shadow-2xl border-2 border-primary/20">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="h-6 w-6" />
                    <div>
                      <CardTitle className="text-lg">Assistant Teranga</CardTitle>
                      <p className="text-blue-100 text-xs">Intelligence Artificielle</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-0 flex flex-col h-full">
                {/* Zone des messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-80">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender === 'user' 
                            ? 'bg-primary text-white' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        }`}>
                          {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div className={`rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                        }`}>
                          <div className="text-sm whitespace-pre-line">{message.text}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Questions suggérées */}
                {messages.length <= 1 && (
                  <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 mb-2">Questions fréquentes :</p>
                    <div className="flex flex-wrap gap-1">
                      {getSuggestedQuestions().map((question, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-white text-xs"
                          onClick={() => handleQuickQuestion(question)}
                        >
                          {question}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Zone de saisie */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Posez votre question..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton d'ouverture */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
          size="icon"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <div className="relative">
              <MessageCircle className="h-6 w-6" />
              <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-300" />
            </div>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default TerrangaFoncierChatbot;
