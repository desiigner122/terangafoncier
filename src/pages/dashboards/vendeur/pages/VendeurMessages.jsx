import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Users, 
  Mail,
  Send,
  Search,
  Filter,
  Phone,
  Video,
  MoreVertical,
  Star,
  Archive,
  Trash2,
  Clock,
  CheckCheck,
  Check,
  AlertCircle,
  Plus,
  Paperclip,
  Smile,
  Image,
  MapPin,
  Calendar,
  UserCircle
} from 'lucide-react';

const VendeurMessages = () => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filterOptions = [
    { id: 'all', name: 'Tous', count: 12 },
    { id: 'unread', name: 'Non lus', count: 4 },
    { id: 'starred', name: 'Favoris', count: 2 },
    { id: 'archived', name: 'Archivés', count: 8 }
  ];

  const conversations = [
    {
      id: 1,
      name: 'Marie Diallo',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Bonjour, je suis intéressée par la villa à Almadies. Pouvons-nous organiser une visite ?',
      timestamp: '14:30',
      unread: 2,
      property: 'Villa Moderne Almadies',
      status: 'hot',
      isOnline: true
    },
    {
      id: 2,
      name: 'Amadou Ba',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Merci pour les informations. Le prix est-il négociable ?',
      timestamp: '12:45',
      unread: 0,
      property: 'Appartement Plateau',
      status: 'warm',
      isOnline: false
    },
    {
      id: 3,
      name: 'Fatou Sall',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Parfait, je confirme la visite pour demain 15h.',
      timestamp: 'Hier',
      unread: 0,
      property: 'Maison Parcelles Assainies',
      status: 'confirmed',
      isOnline: true
    },
    {
      id: 4,
      name: 'Ousmane Ndiaye',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Avez-vous d\'autres propriétés similaires dans le quartier ?',
      timestamp: 'Hier',
      unread: 1,
      property: 'Terrain Saly',
      status: 'interested',
      isOnline: false
    }
  ];

  const messages = [
    {
      id: 1,
      senderId: 'client',
      senderName: 'Marie Diallo',
      message: 'Bonjour, je viens de voir votre annonce pour la villa à Almadies. Elle m\'intéresse beaucoup !',
      timestamp: '14:20',
      status: 'read'
    },
    {
      id: 2,
      senderId: 'vendor',
      senderName: 'Vous',
      message: 'Bonjour Marie ! Merci pour votre intérêt. Cette villa est effectivement exceptionnelle. Souhaitez-vous organiser une visite ?',
      timestamp: '14:22',
      status: 'read'
    },
    {
      id: 3,
      senderId: 'client',
      senderName: 'Marie Diallo',
      message: 'Oui, ce serait parfait ! Quand êtes-vous disponible cette semaine ? J\'aimerais aussi savoir s\'il y a une piscine.',
      timestamp: '14:28',
      status: 'read'
    },
    {
      id: 4,
      senderId: 'vendor',
      senderName: 'Vous',
      message: 'Excellente nouvelle ! Oui, la villa dispose d\'une magnifique piscine avec vue mer. Je suis disponible demain après-midi ou jeudi matin. Quel créneau vous arrange ?',
      timestamp: '14:29',
      status: 'delivered'
    },
    {
      id: 5,
      senderId: 'client',
      senderName: 'Marie Diallo',
      message: 'Demain après-midi serait parfait ! Vers 15h ça vous va ?',
      timestamp: '14:30',
      status: 'unread'
    }
  ];

  const quickReplies = [
    'Merci pour votre intérêt !',
    'Je peux organiser une visite',
    'Le prix est négociable',
    'Voici plus d\'informations',
    'Je vous rappelle bientôt'
  ];

  const getStatusColor = (status) => {
    const colors = {
      hot: 'bg-red-100 text-red-800',
      warm: 'bg-orange-100 text-orange-800',
      interested: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      hot: 'Très intéressé',
      warm: 'Intéressé',
      interested: 'Curieux',
      confirmed: 'Confirmé'
    };
    return texts[status] || 'Contact';
  };

  const getMessageStatus = (status) => {
    switch(status) {
      case 'sent':
        return <Check className="h-4 w-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-4 w-4 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.property.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'unread' && conv.unread > 0) ||
                         (selectedFilter === 'starred' && conv.starred) ||
                         (selectedFilter === 'archived' && conv.archived);
    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setNewMessage('');
    // Logic to send message
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messagerie Clients</h1>
          <p className="text-gray-600">Communication centralisée avec vos prospects</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Chat
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Mail className="h-4 w-4 mr-2" />
            Email Groupe
          </Button>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Messages Total</p>
                <p className="text-2xl font-bold text-blue-600">127</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Non Lus</p>
                <p className="text-2xl font-bold text-red-600">4</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Réponse Moy.</p>
                <p className="text-2xl font-bold text-green-600">12min</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contacts Actifs</p>
                <p className="text-2xl font-bold text-purple-600">28</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interface de messagerie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Liste des conversations */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            
            {/* Filtres */}
            <div className="flex flex-wrap gap-1">
              {filterOptions.map(filter => (
                <Button
                  key={filter.id}
                  variant={selectedFilter === filter.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter.id)}
                  className="flex items-center gap-1"
                >
                  {filter.name}
                  {filter.count > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {filter.count}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="space-y-0 max-h-96 overflow-y-auto">
              {filteredConversations.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedConversation === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserCircle className="h-6 w-6 text-gray-500" />
                      </div>
                      {conv.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm truncate">{conv.name}</h4>
                        <div className="flex items-center gap-1">
                          {conv.unread > 0 && (
                            <Badge className="bg-red-600 text-white text-xs">
                              {conv.unread}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">{conv.timestamp}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-600 truncate mb-2">
                        {conv.lastMessage}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <Badge className={`text-xs ${getStatusColor(conv.status)}`}>
                          {getStatusText(conv.status)}
                        </Badge>
                        <span className="text-xs text-gray-500 truncate max-w-20">
                          {conv.property}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversation active */}
        <Card className="lg:col-span-2">
          {selectedConv ? (
            <>
              {/* Header conversation */}
              <CardHeader className="pb-3 border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserCircle className="h-6 w-6 text-gray-500" />
                      </div>
                      {selectedConv.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedConv.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        {selectedConv.property}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 p-0">
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === 'vendor' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === 'vendor'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.message}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className={`text-xs ${
                            message.senderId === 'vendor' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp}
                          </span>
                          {message.senderId === 'vendor' && getMessageStatus(message.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Réponses rapides */}
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {quickReplies.map((reply, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setNewMessage(reply)}
                        className="text-xs"
                      >
                        {reply}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Zone de saisie */}
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Tapez votre message..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Image className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Smile className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sélectionnez une conversation</h3>
                <p className="text-gray-600">Choisissez un contact pour commencer à discuter</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default VendeurMessages;