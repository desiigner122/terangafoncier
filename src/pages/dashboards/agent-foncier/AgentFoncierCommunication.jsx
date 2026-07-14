import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter, 
  Phone, 
  Video, 
  Mail, 
  Bell,
  Clock,
  Check,
  CheckCheck,
  Plus,
  Paperclip,
  Smile,
  MoreVertical,
  Archive,
  Trash2,
  Star,
  User,
  Calendar,
  Activity,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

const AgentFoncierCommunication = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');

  // Données de communication simulées
  // conversations RÉEL depuis Supabase (aucune donnée fictive)
  const [conversations, setConversations] = useState([]);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase.from('conversations').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (active) setConversations(data || []);
      } catch (err) {
        console.warn('conversations indisponible:', err?.message);
        if (active) setConversations([]);
      }
    })();
    return () => { active = false; };
  }, []);

  // Compteur de messages réel depuis Supabase (0 par défaut)
  const [totalMessages, setTotalMessages] = useState(0);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { count, error } = await supabase.from('messages').select('*', { count: 'exact', head: true });
        if (error) throw error;
        if (active) setTotalMessages(count || 0);
      } catch (err) {
        console.warn('totalMessages indisponible:', err?.message);
        if (active) setTotalMessages(0);
      }
    })();
    return () => { active = false; };
  }, []);

  const stats = {
    totalMessages,
    messagesNonLus: conversations.reduce((acc, c) => acc + (Number(c.unread) || 0), 0),
    conversationsActives: conversations.length,
    tempsReponse: '—'
  };

  const filteredConversations = conversations.filter(conv =>
    (conv.name || conv.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      // Logique d'envoi de message
      console.log('Envoi message:', newMessage);
      setNewMessage('');
    }
  };

  const getStatusIndicator = (status) => {
    const colors = {
      online: 'bg-green-500',
      offline: 'bg-gray-400',
      away: 'bg-yellow-500'
    };
    return `w-3 h-3 rounded-full ${colors[status] || 'bg-gray-400'}`;
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'client': return 'bg-blue-100 text-blue-800';
      case 'prospect': return 'bg-green-100 text-green-800';
      case 'service': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 via-orange-700 to-red-700 bg-clip-text text-transparent">
            Communication
          </h1>
          <p className="text-slate-600">Messagerie et suivi des échanges</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Phone className="w-4 h-4 mr-2" />
            Appeler
          </Button>
          <Button variant="outline">
            <Video className="w-4 h-4 mr-2" />
            Visio
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-600">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Total Messages', value: stats.totalMessages, icon: MessageSquare, color: 'from-blue-500 to-cyan-600' },
          { title: 'Non Lus', value: stats.messagesNonLus, icon: Bell, color: 'from-red-500 to-pink-600' },
          { title: 'Conversations', value: stats.conversationsActives, icon: Users, color: 'from-green-500 to-emerald-600' },
          { title: 'Tps Réponse', value: stats.tempsReponse, icon: Clock, color: 'from-purple-500 to-indigo-600' }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Interface de messagerie */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]"
      >
        {/* Liste des conversations */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 overflow-y-auto max-h-[480px]">
              {filteredConversations.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-6">Aucune conversation disponible</p>
              )}
              {filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center space-x-3 p-3 cursor-pointer transition-colors ${
                    selectedConversation?.id === conversation.id 
                      ? 'bg-amber-50 border-r-2 border-amber-500' 
                      : 'hover:bg-slate-50'
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
                        {(conversation.name || conversation.title || '?').split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 ${getStatusIndicator(conversation.status)} border-2 border-white`}></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900 truncate">{conversation.name || conversation.title || 'Conversation'}</p>
                      <div className="flex items-center space-x-1">
                        <Badge className={`text-xs ${getTypeColor(conversation.type)}`}>
                          {conversation.type}
                        </Badge>
                        {(conversation.unread || 0) > 0 && (
                          <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 truncate">{conversation.lastMessage}</p>
                    <p className="text-xs text-slate-400">{conversation.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Zone de chat */}
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              {/* Header du chat */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedConversation.avatar} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
                          {(selectedConversation.name || selectedConversation.title || '?').split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 ${getStatusIndicator(selectedConversation.status)} border-2 border-white`}></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{selectedConversation.name || selectedConversation.title || 'Conversation'}</h3>
                      <p className="text-sm text-slate-600 capitalize">{selectedConversation.status || ''}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
                {(selectedConversation.messages || []).length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-6">Aucun message</p>
                )}
                {(selectedConversation.messages || []).map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'me' 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white' 
                        : 'bg-slate-100 text-slate-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-xs ${message.sender === 'me' ? 'text-amber-100' : 'text-slate-500'}`}>
                          {message.timestamp}
                        </p>
                        {message.sender === 'me' && (
                          <div className="ml-2">
                            {message.read ? (
                              <CheckCheck className="w-3 h-3 text-amber-100" />
                            ) : (
                              <Check className="w-3 h-3 text-amber-100" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>

              {/* Zone de saisie */}
              <div className="border-t p-4">
                <div className="flex items-end space-x-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Tapez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-[40px] max-h-[120px] resize-none"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>
                  <Button variant="ghost" size="sm">
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-gradient-to-r from-amber-500 to-orange-600"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-slate-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium">Sélectionnez une conversation</p>
                <p className="text-sm">Choisissez une conversation pour commencer à chatter</p>
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default AgentFoncierCommunication;