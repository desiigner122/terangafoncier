import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, Send, Search, Filter, MoreVertical,
  User, Clock, Check, CheckCheck, Paperclip, Smile,
  Phone, Video, Info, Archive, Star, Flag
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Helmet } from 'react-helmet-async';
import ModernSidebar from '@/components/layout/ModernSidebar';
import { useUser } from '@/hooks/useUser';

const MessagesPage = () => {
  const { user, profile } = useUser();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // DonnÃ©es simulÃ©es des conversations
  const [conversations] = useState([
    {
      id: 1,
      name: 'Aminata Diallo',
      role: 'Agent Foncier',
      lastMessage: 'Le terrain de Mbour est toujours disponible',
      timestamp: '14:30',
      unread: 2,
      avatar: null,
      online: true,
      messages: [
        {
          id: 1,
          sender: 'Aminata Diallo',
          text: 'Bonjour ! J\'ai vu votre intÃ©rÃªt pour le terrain Ã  Mbour.',
          timestamp: '14:25',
          read: true
        },
        {
          id: 2,
          sender: 'Moi',
          text: 'Oui, pouvez-vous me donner plus de dÃ©tails ?',
          timestamp: '14:27',
          read: true
        },
        {
          id: 3,
          sender: 'Aminata Diallo',
          text: 'Le terrain de Mbour est toujours disponible. 500mÂ², titre foncier, proche de la mer.',
          timestamp: '14:30',
          read: false
        }
      ]
    },
    {
      id: 2,
      name: 'Moussa Promoteur',
      role: 'Promoteur',
      lastMessage: 'Photos du chantier envoyÃ©es',
      timestamp: '12:15',
      unread: 0,
      avatar: null,
      online: false,
      messages: [
        {
          id: 1,
          sender: 'Moussa Promoteur',
          text: 'Voici les derniÃ¨res photos du chantier',
          timestamp: '12:15',
          read: true
        }
      ]
    },
    {
      id: 3,
      name: 'Support Teranga',
      role: 'Support',
      lastMessage: 'Votre demande a Ã©tÃ© traitÃ©e',
      timestamp: 'Hier',
      unread: 1,
      avatar: null,
      online: true,
      messages: [
        {
          id: 1,
          sender: 'Support Teranga',
          text: 'Votre demande a Ã©tÃ© traitÃ©e avec succÃ¨s.',
          timestamp: 'Hier',
          read: false
        }
      ]
    }
  ]);

  const sendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;
    
    // Logique d'envoi de message ici
    console.log('Envoi message:', messageText);
    setMessageText('');
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <ModernSidebar currentPage="messages" />
      <div className="flex-1 ml-80 bg-gray-50">
        <Helmet>
          <title>Messages - Teranga Foncier</title>
          <meta name="description" content="Messagerie intÃ©grÃ©e de Teranga Foncier" />
        </Helmet>

        <div className="h-screen flex">
          {/* Liste des conversations */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Header conversations */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Messages</h2>
                <Button size="sm" variant="ghost">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  YOUR_API_KEY="Rechercher une conversation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Liste des conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 cursor-pointer border-b border-gray-100 ${
                    selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {conversation.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                      </div>
                      
                      <p className="text-xs text-gray-500 mb-1">{conversation.role}</p>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate max-w-48">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <Badge variant="destructive" className="text-xs px-2 py-0.5">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
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
                <div className="p-4 bg-white border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={selectedConversation.avatar} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {selectedConversation.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{selectedConversation.name}</h3>
                        <p className="text-sm text-gray-500">{selectedConversation.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Info className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'Moi' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'Moi'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <div className="flex items-center justify-end mt-1 space-x-1">
                          <span className={`text-xs ${
                            message.sender === 'Moi' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp}
                          </span>
                          {message.sender === 'Moi' && (
                            message.read ? (
                              <CheckCheck className="w-3 h-3 text-blue-100" />
                            ) : (
                              <Check className="w-3 h-3 text-blue-100" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Zone de saisie */}
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    
                    <div className="flex-1 relative">
                      <Input
                        type="text"
                        YOUR_API_KEY="Tapez votre message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            sendMessage();
                          }
                        }}
                        className="pr-20"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      >
                        <Smile className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Button onClick={sendMessage} disabled={!messageText.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    SÃ©lectionnez une conversation
                  </h3>
                  <p className="text-gray-500">
                    Choisissez une conversation pour commencer Ã  Ã©changer
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
