import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Filter,
  Users,
  Clock,
  CheckCheck,
  Circle,
  User,
  MapPin,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const GeometreMessages = () => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Conversations simulées
  const conversations = [
    {
      id: 1,
      client: {
        name: 'SARL Sénégal Construction',
        avatar: '/api/placeholder/40/40',
        type: 'Entreprise',
        location: 'Dakar'
      },
      lastMessage: 'Pouvons-nous programmer la visite du terrain pour demain ?',
      timestamp: '2025-09-27T14:30:00',
      unreadCount: 2,
      status: 'active',
      project: 'Levé topographique - Parcelle 1247'
    },
    {
      id: 2,
      client: {
        name: 'Ministère de l\'Urbanisme',
        avatar: '/api/placeholder/40/40',
        type: 'Institution',
        location: 'Dakar'
      },
      lastMessage: 'Le rapport de conformité est-il prêt ?',
      timestamp: '2025-09-27T11:15:00',
      unreadCount: 0,
      status: 'away',
      project: 'Étude cadastrale - Zone industrielle'
    },
    {
      id: 3,
      client: {
        name: 'Promoteur Almadies SA',
        avatar: '/api/placeholder/40/40',
        type: 'Promoteur',
        location: 'Almadies'
      },
      lastMessage: 'Merci pour le plan mis à jour !',
      timestamp: '2025-09-26T16:45:00',
      unreadCount: 0,
      status: 'online',
      project: 'Bornage - Résidence Les Almadies'
    },
    {
      id: 4,
      client: {
        name: 'Direction du Cadastre',
        avatar: '/api/placeholder/40/40',
        type: 'Administration',
        location: 'Dakar'
      },
      lastMessage: 'Les données GPS sont bien reçues',
      timestamp: '2025-09-26T09:20:00',
      unreadCount: 1,
      status: 'offline',
      project: 'Cartographie numérique'
    },
    {
      id: 5,
      client: {
        name: 'Mairie de Keur Massar',
        avatar: '/api/placeholder/40/40',
        type: 'Collectivité',
        location: 'Keur Massar'
      },
      lastMessage: 'Le contrat est signé, nous pouvons commencer',
      timestamp: '2025-09-25T14:10:00',
      unreadCount: 0,
      status: 'online',
      project: 'Lotissement communal'
    }
  ];

  // Messages simulés pour la conversation sélectionnée
  const messages = [
    {
      id: 1,
      sender: 'client',
      content: 'Bonjour, nous avons besoin d\'un levé topographique pour notre nouvelle parcelle.',
      timestamp: '2025-09-27T09:00:00',
      status: 'read'
    },
    {
      id: 2,
      sender: 'geometre',
      content: 'Bonjour ! Bien sûr, je peux vous aider. Pouvez-vous me donner plus de détails sur la parcelle ? Localisation, superficie approximative ?',
      timestamp: '2025-09-27T09:15:00',
      status: 'read'
    },
    {
      id: 3,
      sender: 'client',
      content: 'C\'est une parcelle de 2 hectares située à Keur Massar, près de la nouvelle route. Nous prévoyons une construction résidentielle.',
      timestamp: '2025-09-27T09:30:00',
      status: 'read'
    },
    {
      id: 4,
      sender: 'geometre',
      content: 'Parfait ! Pour ce type de projet, je recommande un levé complet avec GPS différentiel et nivellement. Le délai serait de 3-4 jours ouvrables.',
      timestamp: '2025-09-27T10:00:00',
      status: 'read'
    },
    {
      id: 5,
      sender: 'client',
      content: 'Excellent. Quel serait le coût pour cette prestation ?',
      timestamp: '2025-09-27T10:15:00',
      status: 'read'
    },
    {
      id: 6,
      sender: 'geometre',
      content: 'Pour 2 hectares avec toutes les prestations incluses : 850 000 FCFA. Cela comprend le levé, le plan CAD, et le rapport technique.',
      timestamp: '2025-09-27T10:30:00',
      status: 'read'
    },
    {
      id: 7,
      sender: 'client',
      content: 'C\'est dans notre budget. Pouvons-nous programmer la visite du terrain pour demain ?',
      timestamp: '2025-09-27T14:30:00',
      status: 'delivered'
    },
    {
      id: 8,
      sender: 'geometre',
      content: 'Parfaitement ! Je suis disponible demain à partir de 8h. Préférez-vous le matin ou l\'après-midi ?',
      timestamp: '2025-09-27T14:35:00',
      status: 'sent'
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'active': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case 'sent': return <Circle className="h-3 w-3 text-gray-400" />;
      case 'delivered': return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read': return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default: return null;
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Logique d'envoi du message
      setNewMessage('');
    }
  };

  const ConversationItem = ({ conversation }) => (
    <motion.div
      whileHover={{ x: 5 }}
      onClick={() => setSelectedConversation(conversation.id)}
      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
        selectedConversation === conversation.id ? 'bg-blue-50 border-r-4 border-r-blue-500' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage src={conversation.client.avatar} />
            <AvatarFallback>
              {conversation.client.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(conversation.status)}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 truncate">
              {conversation.client.name}
            </h3>
            <span className="text-xs text-gray-500">
              {new Date(conversation.timestamp).toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 truncate mt-1">
            {conversation.lastMessage}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <MapPin className="h-3 w-3" />
              <span>{conversation.client.location}</span>
            </div>
            {conversation.unreadCount > 0 && (
              <Badge className="bg-red-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                {conversation.unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const Message = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${message.sender === 'geometre' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        message.sender === 'geometre' 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-900'
      }`}>
        <p className="text-sm">{message.content}</p>
        <div className={`flex items-center justify-between mt-1 text-xs ${
          message.sender === 'geometre' ? 'text-blue-100' : 'text-gray-500'
        }`}>
          <span>
            {new Date(message.timestamp).toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          {message.sender === 'geometre' && getMessageStatusIcon(message.status)}
        </div>
      </div>
    </motion.div>
  );

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Liste des conversations */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Messages</h2>
            <Button size="sm" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Nouveau
            </Button>
          </div>
          
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Rechercher une conversation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(conversation => (
            <ConversationItem key={conversation.id} conversation={conversation} />
          ))}
        </div>
      </div>

      {/* Zone de conversation */}
      <div className="flex-1 flex flex-col">
        {selectedConv && (
          <>
            {/* En-tête de conversation */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConv.client.avatar} />
                    <AvatarFallback>
                      {selectedConv.client.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedConv.client.name}</h3>
                    <p className="text-sm text-gray-600">{selectedConv.project}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <Message key={message.id} message={message} />
              ))}
            </div>

            {/* Zone de saisie */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-end space-x-2">
                <Button size="sm" variant="outline">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <Textarea
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[44px] max-h-32 resize-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
                <Button size="sm" variant="outline">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GeometreMessages;