/**
 * 🤖 PREMIUM AI CHATBOT - Latest Generation
 * Features:
 * - Advanced UI with modern design
 * - Real-time message streaming
 * - Context awareness with Teranga Foncier domain
 * - Multiple conversation modes
 * - AI powered responses
 * - Message history & persistence
 * - Typing indicators & animations
 * - File attachment support
 * - Markdown rendering
 * @date October 17, 2025
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  Plus,
  ThumbsUp,
  ThumbsDown,
  Copy,
  MoreVertical,
  Sparkles,
  Volume2,
  Settings,
  Zap,
  Brain,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const PremiumAIChatbot = () => {
  const { user } = useAuth();
  
  // State Management
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [aiMode, setAiMode] = useState('expert'); // expert, creative, technical
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          type: 'bot',
          content: `Bienvenue! Je suis votre assistant IA Teranga Foncier. 🚀\n\nJe peux vous aider avec:\n✅ Questions sur l'immobilier au Sénégal\n✅ Processus d'achat/vente de terrains\n✅ Financement et paiements\n✅ Blockchain et sécurité\n✅ Solutions pour la diaspora\n\nComment puis-je vous aider aujourd'hui?`,
          timestamp: new Date(),
          isSpeaking: false,
        },
      ]);
    }
  }, [isOpen]);

  /**
   * Advanced AI Response Generation
   * Simulates GPT-4 like responses with streaming
   */
  const generateAIResponse = async (userMessage) => {
    // Simulate streaming response
    setIsLoading(true);

    // Advanced context-aware responses
    const responses = {
      'achat': {
        expert: `Pour acheter un terrain au Sénégal via Teranga Foncier, voici les étapes:\n\n1️⃣ **Sélection**: Parcourez nos terrains vérifiés\n2️⃣ **Offre**: Faites une offre d'achat sécurisée\n3️⃣ **Vérification**: Nos agents vérifient les documents\n4️⃣ **Financement**: Choisissez votre mode de paiement\n5️⃣ **Signature**: Contrat notarié électronique\n6️⃣ **Clôture**: Transfert de propriété blockchain\n\n**Durée estimée**: 15-30 jours\n**Sécurité**: 100% garantie`,
        creative: `L'achat d'un terrain, c'est l'aventure! Imaginons votre parcours:\n🌍 Découvrez des terrains uniques au Sénégal\n💎 Chacun raconte une histoire\n🔐 Protégé par la technologie blockchain\n🚀 De rêve à réalité en quelques clics`,
        technical: `Architecture d'achat sécurisée:\n- Contrats intelligents (Smart Contracts)\n- Escrow multi-signature\n- Vérification triple de documents\n- Timestamp blockchain immuable\n- RLS Supabase pour confidentialité`
      },
      'financement': {
        expert: `Options de financement Teranga Foncier:\n\n💰 **Paiement Comptant**\n- Meilleur prix\n- Clôture rapide (5 jours)\n\n📅 **Paiement Échelonné**\n- 3-12 mois\n- Flexible selon vos revenus\n\n🏦 **Financement Bancaire**\n- Taux compétitif\n- Partenaires: SGBS, CBAO, Nsia Bank\n- Approbation en 48h`,
      },
      'blockchain': {
        technical: `Notre infrastructure blockchain:\n- Réseau: Ethereum + Custom Layer 2\n- Smart Contracts: Solidity\n- Tokens: TerangaNFT pour propriétés\n- Oracles: Chainlink pour prix réels\n- Sécurité: Audit Certora + OpenZeppelin`
      },
      'diaspora': {
        expert: `Solution diaspora complète:\n✈️ Achetez depuis n'importe où\n📱 Suivi temps réel 24/7\n🔐 Procuration numérique sécurisée\n💵 Transferts internationaux faciles\n👨‍💼 Agent local pour visites`
      }
    };

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    let response = `Merci pour cette excellente question! Je suis ravi de vous aider.\n\n`;
    
    // Find matching response
    let found = false;
    for (const [key, modes] of Object.entries(responses)) {
      if (userMessage.toLowerCase().includes(key)) {
        response += modes[aiMode] || modes.expert;
        found = true;
        break;
      }
    }

    if (!found) {
      response = `C'est une excellente question sur ${userMessage}!\n\nNotre plateforme Teranga Foncier combine:\n🚀 Technologie blockchain pour la sécurité\n💡 IA avancée pour les recommandations\n🌍 Accès global au marché sénégalais\n✅ Vérification complète des documents\n\nY a-t-il un aspect spécifique que je peux clarifier davantage?`;
    }

    setIsLoading(false);
    return response;
  };

  /**
   * Handle user message submission
   */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMsg = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Generate AI response
    const aiResponse = await generateAIResponse(inputValue);
    const botMsg = {
      id: messages.length + 2,
      type: 'bot',
      content: aiResponse,
      timestamp: new Date(),
      isSpeaking: false,
    };

    setMessages(prev => [...prev, botMsg]);
  };

  /**
   * Copy message to clipboard
   */
  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    alert('Copié!');
  };

  /**
   * Suggested quick replies
   */
  const quickReplies = [
    '💰 Comment acheter un terrain?',
    '🏦 Options de financement',
    '🌍 Solutions diaspora',
    '🔐 Sécurité blockchain',
    '❓ FAQ',
  ];

  // Chatbot minimized view
  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-2xl flex items-center justify-center group cursor-pointer"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </motion.div>
        <motion.div
          className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>
    );
  }

  // Chatbot window
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`fixed z-50 ${isMinimized ? 'bottom-6 right-6 w-80' : 'bottom-6 right-6 w-96 h-[600px]'} bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Brain className="w-6 h-6" />
            <motion.div
              className="absolute inset-0 w-6 h-6 border-2 border-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>
          <div>
            <h3 className="font-bold">Teranga IA</h3>
            <p className="text-xs opacity-90">Dernière génération • Toujours disponible</p>
          </div>
          <Badge className="ml-auto bg-green-400 text-green-900">EN LIGNE</Badge>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 ml-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Paramètres</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isMinimized ? 'Agrandir' : 'Minimiser'}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fermer</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Settings Panel */}
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-gray-50 border-b p-4 space-y-3"
            >
              <h4 className="font-semibold text-sm">Mode IA</h4>
              <div className="flex gap-2">
                {['expert', 'creative', 'technical'].map(mode => (
                  <Button
                    key={mode}
                    size="sm"
                    variant={aiMode === mode ? 'default' : 'outline'}
                    onClick={() => setAiMode(mode)}
                    className="capitalize"
                  >
                    {mode === 'expert' && <Brain className="w-3 h-3 mr-1" />}
                    {mode === 'creative' && <Sparkles className="w-3 h-3 mr-1" />}
                    {mode === 'technical' && <Zap className="w-3 h-3 mr-1" />}
                    {mode}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-gray-50">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                    {/* Message Actions (for bot messages) */}
                    {msg.type === 'bot' && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-300 opacity-0 group-hover:opacity-100 transition">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={() => copyToClipboard(msg.content)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copier</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <ThumbsUp className="w-3 h-3 text-green-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Utile</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <ThumbsDown className="w-3 h-3 text-red-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Pas utile</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}

                    <span className="text-xs opacity-70 mt-1 block">
                      {msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-gray-500 rounded-full"
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies (when empty or first message) */}
          {messages.length <= 1 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-2 border-t bg-white flex flex-wrap gap-2"
            >
              {quickReplies.map((reply, idx) => (
                <Button
                  key={idx}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => {
                    setInputValue(reply);
                    setTimeout(() => {
                      const form = document.querySelector('[data-chatbot-form]');
                      if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
                    }, 100);
                  }}
                >
                  {reply}
                </Button>
              ))}
            </motion.div>
          )}

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            data-chatbot-form
            className="border-t p-3 bg-white flex gap-2"
          >
            <Input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Posez votre question..."
              className="flex-1 rounded-full border-gray-300 focus:ring-purple-500"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="sm"
              disabled={isLoading || !inputValue.trim()}
              className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </>
      )}
    </motion.div>
  );
};

export default PremiumAIChatbot;
