import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Phone,
  Video,
  Paperclip,
  Smile,
  Search,
  Filter,
  Users,
  Clock,
  CheckCircle2,
  Circle,
  Star,
  MoreVertical,
  Edit,
  Trash2,
  Archive,
  Flag,
  User,
  Building2,
  Home,
  Calendar,
  File,
  Image,
  Download
} from 'lucide-react';

const VendeurCommunication = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Données de communication enrichies
  const [communicationData] = useState({
    conversations: [
      {
        id: 1,
        participant: {
          name: 'Fatou Sall',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c3e9a3?w=80&h=80&fit=crop&crop=face',
          status: 'online',
          type: 'prospect',
          company: 'Entreprise Sall & Fils'
        },
        lastMessage: 'Parfait, je confirme la visite pour demain à 14h',
        timestamp: '2024-03-20T15:30:00',
        unreadCount: 2,
        priority: 'high',
        property: 'Villa Moderne Almadies',
        messages: [
          {
            id: 1,
            sender: 'Fatou Sall',
            message: 'Bonjour, je suis très intéressée par la villa aux Almadies. Pourriez-vous m\'envoyer plus de détails ?',
            timestamp: '2024-03-20T10:00:00',
            type: 'text',
            status: 'read'
          },
          {
            id: 2,
            sender: 'Amadou Diallo',
            message: 'Bonjour Madame Sall, merci pour votre intérêt ! Je vous envoie immédiatement le dossier complet avec photos et plan.',
            timestamp: '2024-03-20T10:15:00',
            type: 'text',
            status: 'delivered'
          },
          {
            id: 3,
            sender: 'Amadou Diallo',
            message: '',
            timestamp: '2024-03-20T10:16:00',
            type: 'file',
            fileName: 'Villa_Almadies_Dossier_Complet.pdf',
            fileSize: '2.4 MB',
            status: 'delivered'
          },
          {
            id: 4,
            sender: 'Fatou Sall',
            message: 'Merci beaucoup ! Le dossier est très complet. Serait-il possible de programmer une visite cette semaine ?',
            timestamp: '2024-03-20T14:00:00',
            type: 'text',
            status: 'read'
          },
          {
            id: 5,
            sender: 'Amadou Diallo',
            message: 'Bien sûr ! Je suis disponible demain (jeudi) à 14h ou vendredi à 10h. Quelle heure vous convient le mieux ?',
            timestamp: '2024-03-20T14:30:00',
            type: 'text',
            status: 'delivered'
          },
          {
            id: 6,
            sender: 'Fatou Sall',
            message: 'Parfait, je confirme la visite pour demain à 14h',
            timestamp: '2024-03-20T15:30:00',
            type: 'text',
            status: 'sent'
          }
        ]
      },
      {
        id: 2,
        participant: {
          name: 'Moussa Diop',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
          status: 'away',
          type: 'prospect',
          company: 'Cabinet Diop Associés'
        },
        lastMessage: 'Je vais réfléchir au prix et vous reviens',
        timestamp: '2024-03-20T11:45:00',
        unreadCount: 0,
        priority: 'medium',
        property: 'Appartement Standing Plateau',
        messages: [
          {
            id: 1,
            sender: 'Moussa Diop',
            message: 'Bonjour, j\'ai vu votre appartement au Plateau. Le prix me semble un peu élevé, y a-t-il une possibilité de négociation ?',
            timestamp: '2024-03-20T09:00:00',
            type: 'text',
            status: 'read'
          },
          {
            id: 2,
            sender: 'Amadou Diallo',
            message: 'Bonjour Monsieur Diop. Le prix reflète la qualité et l\'emplacement exceptionnel, mais je peux étudier une proposition sérieuse.',
            timestamp: '2024-03-20T09:30:00',
            type: 'text',
            status: 'delivered'
          },
          {
            id: 3,
            sender: 'Moussa Diop',
            message: 'Je vais réfléchir au prix et vous reviens',
            timestamp: '2024-03-20T11:45:00',
            type: 'text',
            status: 'sent'
          }
        ]
      },
      {
        id: 3,
        participant: {
          name: 'Banque CBAO',
          avatar: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=80&h=80&fit=crop',
          status: 'online',
          type: 'partner',
          company: 'Institution Financière'
        },
        lastMessage: 'Dossier de financement approuvé pour Mme Sall',
        timestamp: '2024-03-20T16:00:00',
        unreadCount: 1,
        priority: 'high',
        property: 'Villa Moderne Almadies',
        messages: [
          {
            id: 1,
            sender: 'Banque CBAO',
            message: 'Bonjour M. Diallo, nous avons reçu le dossier de financement pour Mme Sall concernant la villa aux Almadies.',
            timestamp: '2024-03-20T14:00:00',
            type: 'text',
            status: 'read'
          },
          {
            id: 2,
            sender: 'Amadou Diallo',
            message: 'Perfect ! Où en êtes-vous dans l\'instruction du dossier ?',
            timestamp: '2024-03-20T14:15:00',
            type: 'text',
            status: 'delivered'
          },
          {
            id: 3,
            sender: 'Banque CBAO',
            message: 'Dossier de financement approuvé pour Mme Sall',
            timestamp: '2024-03-20T16:00:00',
            type: 'text',
            status: 'sent'
          }
        ]
      }
    ],
    quickReplies: [
      'Merci pour votre intérêt !',
      'Je vous envoie les détails par email',
      'Quand seriez-vous disponible pour une visite ?',
      'Le prix est négociable selon les conditions',
      'Je vous rappelle dans la journée',
      'Parfait, c\'est noté !'
    ],
    templates: [
      {
        name: 'Première prise de contact',
        content: 'Bonjour {nom}, merci pour votre intérêt pour {propriete}. Je serais ravi de vous accompagner dans votre projet immobilier.'
      },
      {
        name: 'Proposition de visite',
        content: 'Bonjour {nom}, seriez-vous disponible pour visiter {propriete} cette semaine ? Je peux vous proposer plusieurs créneaux.'
      },
      {
        name: 'Suivi après visite',
        content: 'Bonjour {nom}, j\'espère que la visite de {propriete} vous a plu. N\'hésitez pas si vous avez des questions !'
      }
    ]
  });

  const filteredConversations = communicationData.conversations.filter(conv => {
    const matchesSearch = conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'unread' && conv.unreadCount > 0) ||
                         (filterType === 'prospects' && conv.participant.type === 'prospect') ||
                         (filterType === 'partners' && conv.participant.type === 'partner');
    return matchesSearch && matchesFilter;
  });

  const sendMessage = () => {
    if (messageText.trim() && selectedConversation) {
      const newMessage = {
        id: Date.now(),
        sender: 'Amadou Diallo',
        message: messageText,
        timestamp: new Date().toISOString(),
        type: 'text',
        status: 'sending'
      };
      
      // Simuler l'envoi
      setTimeout(() => {
        newMessage.status = 'delivered';
      }, 1000);
      
      setMessageText('');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sending':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'sent':
        return <CheckCircle2 className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      case 'read':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getParticipantTypeIcon = (type) => {
    switch (type) {
      case 'prospect':
        return <User className="w-4 h-4" />;
      case 'partner':
        return <Building2 className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="flex h-screen">
        {/* Sidebar des conversations */}
        <div className="w-1/3 bg-white/80 backdrop-blur-sm border-r border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
              Messages
            </h2>
            {/* Recherche */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une conversation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/60 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            {/* Filtres */}
            <div className="flex space-x-1">
              {[
                { id: 'all', label: 'Tous' },
                { id: 'unread', label: 'Non lus' },
                { id: 'prospects', label: 'Prospects' },
                { id: 'partners', label: 'Partenaires' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setFilterType(filter.id)}
                  className={`px-3 py-1 text-sm rounded-lg transition-all ${
                    filterType === filter.id
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      : 'bg-white/60 text-gray-600 hover:bg-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Liste des conversations */}
          <div className="overflow-y-auto h-full">
            {filteredConversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-all ${
                  selectedConversation?.id === conversation.id
                    ? 'bg-gradient-to-r from-orange-100 to-red-100 border-l-4 border-l-orange-500'
                    : 'hover:bg-gray-50'
                }`}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <img
                      src={conversation.participant.avatar}
                      alt={conversation.participant.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      conversation.participant.status === 'online' ? 'bg-green-500' :
                      conversation.participant.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-800 truncate">
                          {conversation.participant.name}
                        </h4>
                        {getParticipantTypeIcon(conversation.participant.type)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {formatDate(conversation.timestamp)}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 font-bold">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1 truncate">
                      {conversation.participant.company}
                    </p>
                    <p className="text-sm text-gray-700 truncate">
                      {conversation.lastMessage}
                    </p>
                    {conversation.property && (
                      <div className="flex items-center space-x-1 mt-2">
                        <Home className="w-3 h-3 text-orange-500" />
                        <span className="text-xs text-orange-600 font-medium">
                          {conversation.property}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Zone de conversation */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header conversation */}
              <div className="bg-white/80 backdrop-blur-sm p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedConversation.participant.avatar}
                    alt={selectedConversation.participant.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {selectedConversation.participant.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedConversation.participant.company}
                    </p>
                  </div>
                  {selectedConversation.property && (
                    <div className="flex items-center space-x-2 bg-orange-100 px-3 py-1 rounded-lg">
                      <Home className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-orange-800 font-medium">
                        {selectedConversation.property}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.sender === 'Amadou Diallo' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`max-w-xs lg:max-w-md ${
                      message.sender === 'Amadou Diallo'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-white border border-gray-200'
                    } rounded-2xl p-3 shadow-sm`}>
                      {message.type === 'text' ? (
                        <p className="text-sm">{message.message}</p>
                      ) : message.type === 'file' ? (
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <File className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{message.fileName}</p>
                            <p className="text-xs text-gray-500">{message.fileSize}</p>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ) : null}
                      <div className={`flex items-center justify-between mt-2 ${
                        message.sender === 'Amadou Diallo' ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">{formatTime(message.timestamp)}</span>
                        {message.sender === 'Amadou Diallo' && (
                          <div className="ml-2">
                            {getStatusIcon(message.status)}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Zone de saisie */}
              <div className="bg-white/80 backdrop-blur-sm p-4 border-t border-gray-200">
                {/* Réponses rapides */}
                <div className="mb-3 flex flex-wrap gap-2">
                  {communicationData.quickReplies.slice(0, 3).map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => setMessageText(reply)}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                    <Image className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Tapez votre message..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                      <Smile className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!messageText.trim()}
                    className="p-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Sélectionnez une conversation
                </h3>
                <p className="text-gray-600">
                  Choisissez une conversation pour commencer à échanger
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendeurCommunication;