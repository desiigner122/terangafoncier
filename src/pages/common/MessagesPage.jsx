import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter, 
  Star, 
  Archive, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  User, 
  Phone, 
  Mail,
  MoreVertical,
  Paperclip,
  Smile,
  ArrowLeft
} from 'lucide-react';
import { useUser } from '@/hooks/useUserFixed';

const MessagesPage = () => {
  const { user, profile } = useUser();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // DonnÃ©es simulÃ©es pour les conversations
  const mockConversations = [
    {
      id: 1,
      participant: {
        name: 'Amadou Diallo',
        role: 'PROMOTEUR',
        avatar: null,
        status: 'online'
      },
      lastMessage: {
        content: 'Merci pour les informations sur le terrain Ã  Almadies. Pouvons-nous programmer une visite ?',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isRead: false,
        sender: 'them'
      },
      messages: [
        {
          id: 1,
          content: 'Bonjour, je suis intÃ©ressÃ© par votre terrain Ã  Almadies.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          sender: 'them'
        },
        {
          id: 2,
          content: 'Bonjour Amadou, merci pour votre intÃ©rÃªt. Le terrain fait 500mÂ² et est bien situÃ©.',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          sender: 'me'
        },
        {
          id: 3,
          content: 'Merci pour les informations. Pouvons-nous programmer une visite ?',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          sender: 'them'
        }
      ],
      isStarred: false,
      category: 'business'
    },
    {
      id: 2,
      participant: {
        name: 'Fatou Ndiaye',
        role: 'BANQUE',
        avatar: null,
        status: 'offline'
      },
      lastMessage: {
        content: 'Le dossier de financement a Ã©tÃ© approuvÃ©. FÃ©licitations !',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: true,
        sender: 'them'
      },
      messages: [
        {
          id: 1,
          content: 'Votre demande de financement est en cours d\'Ã©tude.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          sender: 'them'
        },
        {
          id: 2,
          content: 'Merci, j\'attends votre retour.',
          timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
          sender: 'me'
        },
        {
          id: 3,
          content: 'Le dossier de financement a Ã©tÃ© approuvÃ©. FÃ©licitations !',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          sender: 'them'
        }
      ],
      isStarred: true,
      category: 'finance'
    },
    {
      id: 3,
      participant: {
        name: 'Support Teranga',
        role: 'SUPPORT',
        avatar: null,
        status: 'online'
      },
      lastMessage: {
        content: 'Votre demande de support a Ã©tÃ© rÃ©solue. N\'hÃ©sitez pas si vous avez d\'autres questions.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        isRead: true,
        sender: 'them'
      },
      messages: [
        {
          id: 1,
          content: 'Bonjour, j\'ai un problÃ¨me avec l\'upload de documents.',
          timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000),
          sender: 'me'
        },
        {
          id: 2,
          content: 'Nous avons identifiÃ© le problÃ¨me et l\'avons rÃ©solu.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          sender: 'them'
        }
      ],
      isStarred: false,
      category: 'support'
    }
  ];

  useEffect(() => {
    // Simuler le chargement des conversations
    setTimeout(() => {
      setConversations(mockConversations);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filtrer les conversations selon la recherche et l'onglet actif
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'unread') return matchesSearch && !conv.lastMessage.isRead && conv.lastMessage.sender === 'them';
    if (activeTab === 'starred') return matchesSearch && conv.isStarred;
    
    return matchesSearch;
  });

  // Envoyer un message
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      id: Date.now(),
      content: newMessage,
      timestamp: new Date(),
      sender: 'me'
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          lastMessage: {
            content: newMessage,
            timestamp: new Date(),
            isRead: true,
            sender: 'me'
          }
        };
      }
      return conv;
    }));

    setNewMessage('');
  };

  // Formater l'heure
  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'maintenant';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min`;
    if (diff < 86400000) return timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    return timestamp.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  // Obtenir la couleur du rÃ´le
  const getRoleColor = (role) => {
    const colors = {
      PROMOTEUR: 'bg-orange-500',
      BANQUE: 'bg-green-500',
      SUPPORT: 'bg-blue-500',
      VENDEUR: 'bg-purple-500',
      ACHETEUR: 'bg-cyan-500'
    };
    return colors[role] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-primary" />
            Messagerie
          </h1>
          <p className="text-gray-600 mt-2">GÃ©rez vos conversations avec les autres utilisateurs</p>
        </div>
        <Button>
          <Send className="w-4 h-4 mr-2" />
          Nouveau message
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Liste des conversations */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input 
                YOUR_API_KEY="Rechercher une conversation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">Toutes</TabsTrigger>
                <TabsTrigger value="unread">Non lues</TabsTrigger>
                <TabsTrigger value="starred">Favorites</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-y-auto h-[calc(100vh-400px)]">
              {filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  className={`p-4 border-b cursor-pointer transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-primary/5 border-primary/20' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conversation.participant.avatar} />
                        <AvatarFallback className={getRoleColor(conversation.participant.role)}>
                          {conversation.participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.participant.status === 'online' && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm truncate">{conversation.participant.name}</h3>
                        <div className="flex items-center gap-1">
                          {conversation.isStarred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                          <span className="text-xs text-gray-500">{formatTime(conversation.lastMessage.timestamp)}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-1">{conversation.participant.role}</p>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-700 truncate flex-1">
                          {conversation.lastMessage.content}
                        </p>
                        {!conversation.lastMessage.isRead && conversation.lastMessage.sender === 'them' && (
                          <div className="w-2 h-2 bg-primary rounded-full ml-2"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Zone de conversation */}
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              {/* Header de conversation */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="lg:hidden">
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <Avatar>
                      <AvatarImage src={selectedConversation.participant.avatar} />
                      <AvatarFallback className={getRoleColor(selectedConversation.participant.role)}>
                        {selectedConversation.participant.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedConversation.participant.name}</h3>
                      <p className="text-sm text-gray-600">{selectedConversation.participant.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="p-0">
                <div className="h-[calc(100vh-500px)] overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        message.sender === 'me' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'me' ? 'text-primary-foreground/70' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Zone de saisie */}
                <div className="p-4 border-t">
                  <div className="flex items-end gap-3">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <div className="flex-1">
                      <Textarea
                        YOUR_API_KEY="Tapez votre message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        className="min-h-[40px] resize-none"
                      />
                    </div>
                    <Button variant="ghost" size="sm">
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-500 mb-2">SÃ©lectionnez une conversation</h3>
                <p className="text-gray-400">Choisissez une conversation pour commencer Ã  discuter</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MessagesPage;
