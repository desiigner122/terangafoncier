import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
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
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Conversations RÉEL depuis Supabase (aucune donnée fictive)
  const [conversations, setConversations] = useState([]);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
        if (error) throw error;
        if (active) {
          setConversations((data || []).map((c) => ({
            id: c.id,
            client: {
              name: c.title || c.name || c.subject || 'Conversation',
              avatar: c.avatar_url || '',
              location: c.location || ''
            },
            project: c.subject || c.title || '',
            lastMessage: c.last_message || '',
            timestamp: c.updated_at || c.created_at,
            unreadCount: c.unread_count || 0,
            status: c.status || 'offline'
          })));
        }
      } catch (err) {
        console.warn('conversations indisponible:', err?.message);
        if (active) setConversations([]);
      }
    })();
    return () => { active = false; };
  }, []);

  // Messages RÉEL depuis Supabase pour la conversation sélectionnée
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    let active = true;
    if (!selectedConversation) {
      setMessages([]);
      return () => { active = false; };
    }
    (async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', selectedConversation)
          .order('created_at', { ascending: true })
          .limit(200);
        if (error) throw error;
        if (active) {
          setMessages((data || []).map((m) => ({
            id: m.id,
            sender: m.sender || 'client',
            content: m.content || m.body || m.message || '',
            timestamp: m.created_at,
            status: m.status || 'sent'
          })));
        }
      } catch (err) {
        console.warn('messages indisponible:', err?.message);
        if (active) setMessages([]);
      }
    })();
    return () => { active = false; };
  }, [selectedConversation]);

  const filteredConversations = conversations.filter(conv =>
    (conv.client.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (conv.project || '').toLowerCase().includes(searchTerm.toLowerCase())
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
          {filteredConversations.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">Aucune conversation</p>
          ) : (
            filteredConversations.map(conversation => (
              <ConversationItem key={conversation.id} conversation={conversation} />
            ))
          )}
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