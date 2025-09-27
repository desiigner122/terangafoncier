import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail,
  Search,
  Filter,
  Plus,
  Send,
  Paperclip,
  MapPin,
  FileText,
  User,
  Clock,
  Check,
  CheckCheck,
  Star,
  Archive,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AgentFoncierMessages = () => {
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageFilter, setMessageFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const conversations = [
    {
      id: 1,
      clientName: 'Amadou Diallo',
      clientType: 'Propriétaire',
      lastMessage: 'Merci pour l\'évaluation du terrain. Pouvons-nous programmer une visite ?',
      timestamp: '10:30',
      unread: 2,
      status: 'active',
      avatar: 'AD',
      subject: 'Évaluation Terrain Almadies',
      location: 'Almadies, Dakar'
    },
    {
      id: 2,
      clientName: 'Fatou Seck',
      clientType: 'Promoteur',
      lastMessage: 'Les documents cadastraux sont-ils prêts ?',
      timestamp: '09:15',
      unread: 0,
      status: 'pending',
      avatar: 'FS',
      subject: 'Dossier Cadastral Rufisque',
      location: 'Rufisque'
    },
    {
      id: 3,
      clientName: 'Société IMMOGO',
      clientType: 'Entreprise',
      lastMessage: 'Rapport d\'expertise reçu. Excellent travail !',
      timestamp: 'Hier',
      unread: 0,
      status: 'completed',
      avatar: 'SI',
      subject: 'Expertise Judiciaire',
      location: 'Parcelles Assainies'
    },
    {
      id: 4,
      clientName: 'Moussa Fall',
      clientType: 'Particulier',
      lastMessage: 'Quand pouvez-vous visiter le terrain agricole ?',
      timestamp: 'Hier',
      unread: 1,
      status: 'active',
      avatar: 'MF',
      subject: 'Terrain Agricole Thiès',
      location: 'Thiès'
    }
  ];

  const messages = selectedConversation ? [
    {
      id: 1,
      sender: 'client',
      content: 'Bonjour, j\'ai besoin d\'une évaluation pour mon terrain aux Almadies.',
      timestamp: '08:30',
      date: 'Aujourd\'hui'
    },
    {
      id: 2,
      sender: 'agent',
      content: 'Bonjour M. Diallo. Je peux vous aider avec l\'évaluation. Avez-vous les documents de propriété ?',
      timestamp: '08:35',
      date: 'Aujourd\'hui'
    },
    {
      id: 3,
      sender: 'client',
      content: 'Oui, j\'ai le titre foncier et les plans. Quand pouvez-vous passer pour voir le terrain ?',
      timestamp: '08:40',
      date: 'Aujourd\'hui'
    },
    {
      id: 4,
      sender: 'agent',
      content: 'Perfect! Je peux me déplacer demain matin vers 10h. Le terrain fait quelle superficie exactement ?',
      timestamp: '08:45',
      date: 'Aujourd\'hui'
    },
    {
      id: 5,
      sender: 'client',
      content: 'C\'est un terrain de 500m² avec une belle vue sur l\'océan. Merci pour votre réactivité !',
      timestamp: '10:30',
      date: 'Aujourd\'hui'
    }
  ] : [];

  const filteredConversations = conversations.filter(conv => {
    const matchesFilter = messageFilter === 'all' || 
      (messageFilter === 'unread' && conv.unread > 0) ||
      (messageFilter === 'active' && conv.status === 'active') ||
      (messageFilter === 'completed' && conv.status === 'completed');
    
    const matchesSearch = conv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white">
      <div className="flex h-full">
        {/* Liste des conversations */}
        <div className="w-1/3 border-r bg-gray-50">
          {/* Header conversations */}
          <div className="p-4 border-b bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-1" />
                Nouveau
              </Button>
            </div>
            
            {/* Barre de recherche */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            {/* Filtres */}
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'Tous', count: conversations.length },
                { key: 'unread', label: 'Non lus', count: conversations.filter(c => c.unread > 0).length },
                { key: 'active', label: 'Actifs', count: conversations.filter(c => c.status === 'active').length }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setMessageFilter(filter.key)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    messageFilter === filter.key
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>
          
          {/* Liste des conversations */}
          <div className="overflow-y-auto h-full">
            {filteredConversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b cursor-pointer transition-colors ${
                  selectedConversation?.id === conversation.id
                    ? 'bg-green-50 border-green-200'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-green-700">
                      {conversation.avatar}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 truncate">
                        {conversation.clientName}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {conversation.unread > 0 && (
                          <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">
                            {conversation.unread}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{conversation.subject}</p>
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{conversation.location}</span>
                      <Badge variant="secondary" className="text-xs">
                        {conversation.clientType}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
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
              <div className="p-4 border-b bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-green-700">
                        {selectedConversation.avatar}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedConversation.clientName}</h3>
                      <p className="text-sm text-gray-600">{selectedConversation.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'agent'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-end mt-1 space-x-1">
                        <span className={`text-xs ${
                          message.sender === 'agent' ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp}
                        </span>
                        {message.sender === 'agent' && (
                          <CheckCheck className="h-3 w-3 text-green-100" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Zone de saisie */}
              <div className="p-4 border-t bg-white">
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Tapez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newMessage.trim()) {
                          // Logique d'envoi de message
                          setNewMessage('');
                        }
                      }}
                    />
                  </div>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Sélectionnez une conversation
                </h3>
                <p className="text-gray-600">
                  Choisissez une conversation dans la liste pour commencer à échanger
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentFoncierMessages;