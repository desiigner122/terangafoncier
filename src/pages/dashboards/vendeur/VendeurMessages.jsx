import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter, 
  MoreVertical, 
  Phone, 
  Video, 
  Paperclip, 
  Smile, 
  Archive, 
  Trash2,
  Star,
  Clock,
  Check,
  CheckCheck,
  Users,
  Building,
  MapPin,
  Calendar,
  Eye,
  Download
} from 'lucide-react';

const VendeurMessages = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    let active = true;
    const loadConversations = async () => {
      try {
        // Conversations RÉELLES depuis Supabase (aucune conversation fictive)
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .order('updated_at', { ascending: false });
        if (error) throw error;
        if (active) setConversations(data || []);
      } catch (err) {
        console.warn('Conversations indisponibles:', err?.message);
        if (active) setConversations([]);
      }
    };
    loadConversations();
    return () => { active = false; };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      sender: 'vendor',
      read: true
    };

    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id 
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: {
                text: newMessage,
                time: message.time,
                sender: 'vendor',
                read: true
              }
            }
          : conv
      )
    );

    setSelectedConversation(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));

    setNewMessage('');
  };

  const filteredConversations = conversations.filter(conv =>
    conv.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.property.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread, 0);

  return (
    <div className="h-[calc(100vh-120px)] flex">
      {/* Liste des conversations */}
      <div className="w-1/3 border-r bg-white">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <MessageSquare className="mr-2 h-6 w-6 text-blue-600" />
              Messages
              {totalUnread > 0 && (
                <Badge className="ml-2 bg-red-500">{totalUnread}</Badge>
              )}
            </h2>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher une conversation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-y-auto h-full">
          {filteredConversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              whileHover={{ backgroundColor: '#f9fafb' }}
              className={`p-4 border-b cursor-pointer transition-colors ${
                selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={conversation.contact.avatar} />
                    <AvatarFallback>
                      {conversation.contact.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.contact.status === 'online' && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.contact.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">{conversation.lastMessage.time}</span>
                      {conversation.unread > 0 && (
                        <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Building className="w-3 h-3 mr-1" />
                    <span className="truncate">{conversation.property.title}</span>
                  </div>

                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conversation.lastMessage.text}
                  </p>
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
            {/* En-tête de conversation */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={selectedConversation.contact.avatar} />
                      <AvatarFallback>
                        {selectedConversation.contact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {selectedConversation.contact.status === 'online' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedConversation.contact.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-2">{selectedConversation.contact.lastSeen}</span>
                      <span className="mr-2">•</span>
                      <Building className="w-3 h-3 mr-1" />
                      <span>{selectedConversation.property.title}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                {selectedConversation.messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'vendor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'vendor' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-900 border'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <div className={`flex items-center justify-end mt-1 text-xs ${
                        message.sender === 'vendor' ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        <span className="mr-1">{message.time}</span>
                        {message.sender === 'vendor' && (
                          message.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Zone de saisie */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-end space-x-2">
                <Button variant="outline" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                
                <div className="flex-1">
                  <Textarea
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="min-h-[40px] max-h-32 resize-none"
                    rows={1}
                  />
                </div>

                <Button variant="outline" size="sm">
                  <Smile className="w-4 h-4" />
                </Button>

                <Button 
                  onClick={handleSendMessage} 
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* État initial sans conversation sélectionnée */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sélectionnez une conversation
              </h3>
              <p className="text-gray-500">
                Choisissez une conversation dans la liste pour commencer à échanger
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendeurMessages;