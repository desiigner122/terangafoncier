import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter, 
  User, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Paperclip,
  MoreHorizontal,
  Phone,
  Video,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const BanqueMessages = () => {
  const [selectedConversation, setSelectedConversation] = useState('conv-1');
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Conversations simulées spécifiques aux banques
  const conversations = [
    {
      id: 'conv-1',
      contact: 'Amadou Diallo',
      type: 'Client',
      lastMessage: 'Ma demande de crédit terrain a-t-elle été approuvée ?',
      timestamp: '10:30',
      unread: 2,
      priority: 'high',
      status: 'En attente',
      amount: '85M FCFA',
      property: 'Terrain Almadies'
    },
    {
      id: 'conv-2', 
      contact: 'Me Fatou Ndiaye',
      type: 'Notaire',
      lastMessage: 'Les documents pour le crédit Sarr sont prêts',
      timestamp: '09:45',
      unread: 0,
      priority: 'normal',
      status: 'Documenté',
      amount: '120M FCFA',
      property: 'Villa Mermoz'
    },
    {
      id: 'conv-3',
      contact: 'Teranga Foncier',
      type: 'Plateforme',
      lastMessage: 'Nouvelle demande de financement reçue',
      timestamp: '08:20',
      unread: 1,
      priority: 'normal',
      status: 'Nouveau',
      amount: '65M FCFA',
      property: 'Terrain Rufisque'
    },
    {
      id: 'conv-4',
      contact: 'Moussa Thiam',
      type: 'Client',
      lastMessage: 'Merci pour l\'approbation rapide !',
      timestamp: 'Hier',
      unread: 0,
      priority: 'low',
      status: 'Approuvé',
      amount: '95M FCFA',
      property: 'Appartement Plateau'
    }
  ];

  const messages = {
    'conv-1': [
      {
        id: 1,
        sender: 'Amadou Diallo',
        text: 'Bonjour, j\'ai soumis ma demande de crédit terrain il y a une semaine.',
        timestamp: '10:25',
        isClient: true
      },
      {
        id: 2,
        sender: 'Banque Atlantique',
        text: 'Bonjour M. Diallo. Votre dossier est en cours d\'analyse par notre équipe crédit.',
        timestamp: '10:27',
        isClient: false
      },
      {
        id: 3,
        sender: 'Amadou Diallo', 
        text: 'Ma demande de crédit terrain a-t-elle été approuvée ?',
        timestamp: '10:30',
        isClient: true
      }
    ]
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    window.safeGlobalToast({
      title: "Message envoyé",
      description: "Votre message a été envoyé avec succès",
      variant: "success"
    });
    setMessageText('');
  };

  const handleCallClient = (contact) => {
    window.safeGlobalToast({
      title: "Appel en cours",
      description: `Appel vers ${contact}...`,
      variant: "success"
    });
  };

  const handleVideoCall = (contact) => {
    window.safeGlobalToast({
      title: "Visioconférence",
      description: `Démarrage de la visio avec ${contact}`,
      variant: "success"  
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approuvé': return 'bg-green-100 text-green-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Rejeté': return 'bg-red-100 text-red-800';
      case 'Documenté': return 'bg-blue-100 text-blue-800';
      case 'Nouveau': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Messagerie Bancaire</h2>
          <p className="text-gray-600 mt-1">
            Communication avec clients, notaires et partenaires
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau message
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
        {/* Liste des conversations */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <Badge variant="secondary">{conversations.length}</Badge>
            </div>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 max-h-[500px] overflow-y-auto">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 border-l-4 ${
                    selectedConversation === conv.id 
                      ? 'bg-blue-50 border-l-blue-600' 
                      : 'border-l-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {conv.contact.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{conv.contact}</p>
                        <Badge variant="outline" className="text-xs">
                          {conv.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{conv.timestamp}</p>
                      {conv.unread > 0 && (
                        <Badge className="bg-red-500 text-white text-xs mt-1">
                          {conv.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {conv.lastMessage}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <Badge className={getStatusColor(conv.status)}>
                      {conv.status}
                    </Badge>
                    <div className="text-gray-500">
                      {conv.amount} • {conv.property}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Zone de conversation */}
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              {/* Header conversation */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {conversations.find(c => c.id === selectedConversation)?.contact.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {conversations.find(c => c.id === selectedConversation)?.contact}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {conversations.find(c => c.id === selectedConversation)?.type}
                        </Badge>
                        <Badge className={getStatusColor(conversations.find(c => c.id === selectedConversation)?.status)}>
                          {conversations.find(c => c.id === selectedConversation)?.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCallClient(conversations.find(c => c.id === selectedConversation)?.contact)}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleVideoCall(conversations.find(c => c.id === selectedConversation)?.contact)}
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-4">
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {(messages[selectedConversation] || []).map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isClient ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`max-w-[70%] p-3 rounded-lg ${
                        message.isClient 
                          ? 'bg-gray-100 text-gray-900' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.isClient ? 'text-gray-500' : 'text-blue-100'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Zone de saisie */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Tapez votre message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                <p>Sélectionnez une conversation pour commencer</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default BanqueMessages;