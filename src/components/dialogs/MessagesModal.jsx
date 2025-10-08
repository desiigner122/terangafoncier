import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Send,
  Inbox,
  SendHorizonal,
  Search,
  Paperclip,
  Clock,
  CheckCheck,
  User
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Centre de messagerie avec inbox/outbox et real-time
 */
const MessagesModal = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('inbox');
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    body: ''
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Templates réponses rapides
  const quickReplies = [
    "Merci pour votre message. Je reviens vers vous rapidement.",
    "La propriété est toujours disponible. Quand souhaitez-vous organiser une visite ?",
    "Pouvez-vous me donner plus de détails sur vos critères de recherche ?",
    "Je vous propose un rendez-vous cette semaine. Êtes-vous disponible ?"
  ];

  // Charger les messages
  useEffect(() => {
    if (open && user) {
      fetchMessages();
      
      // Real-time subscription
      const subscription = supabase
        .channel('messages')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        }, () => {
          fetchMessages();
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [open, user]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(full_name, email),
          recipient:recipient_id(full_name, email)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les messages
  const getFilteredMessages = (type) => {
    let filtered = messages;

    if (type === 'inbox') {
      filtered = messages.filter(m => m.recipient_id === user.id);
    } else if (type === 'sent') {
      filtered = messages.filter(m => m.sender_id === user.id);
    }

    if (searchQuery) {
      filtered = filtered.filter(m =>
        m.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.body?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  // Marquer comme lu
  const markAsRead = async (messageId) => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);

      setMessages(prev =>
        prev.map(m => m.id === messageId ? { ...m, is_read: true } : m)
      );
    } catch (error) {
      console.error('Erreur marquage lu:', error);
    }
  };

  // Envoyer un message
  const handleSendMessage = async () => {
    if (!newMessage.body.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: user.id,
          recipient_id: newMessage.recipient_id || selectedMessage?.sender_id,
          subject: newMessage.subject || 'Re: ' + (selectedMessage?.subject || 'Sans sujet'),
          body: newMessage.body,
          is_read: false,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      if (window.safeGlobalToast) {
        window.safeGlobalToast({
          title: "Message envoyé",
          description: "Votre message a été envoyé avec succès."
        });
      }

      // Réinitialiser
      setNewMessage({ recipient: '', subject: '', body: '' });
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      console.error('Erreur envoi message:', error);
      if (window.safeGlobalToast) {
        window.safeGlobalToast({
          title: "Erreur",
          description: "Impossible d'envoyer le message.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Composer une réponse
  const composeReply = (message) => {
    setSelectedMessage(message);
    setNewMessage({
      recipient: message.sender?.full_name || message.sender?.email || '',
      recipient_id: message.sender_id,
      subject: message.subject?.startsWith('Re:') ? message.subject : `Re: ${message.subject}`,
      body: ''
    });
    setActiveTab('compose');
  };

  const displayedMessages = getFilteredMessages(activeTab);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center text-xl">
            <MessageSquare className="w-6 h-6 mr-2 text-orange-600" />
            Centre de Messages
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="inbox" className="flex items-center">
                <Inbox className="w-4 h-4 mr-2" />
                Reçus ({messages.filter(m => m.recipient_id === user.id && !m.is_read).length})
              </TabsTrigger>
              <TabsTrigger value="sent" className="flex items-center">
                <SendHorizonal className="w-4 h-4 mr-2" />
                Envoyés
              </TabsTrigger>
              <TabsTrigger value="compose" className="flex items-center">
                <Send className="w-4 h-4 mr-2" />
                Nouveau
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Barre de recherche (inbox et sent) */}
          {(activeTab === 'inbox' || activeTab === 'sent') && (
            <div className="px-6 pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}

          {/* Liste des messages */}
          <TabsContent value="inbox" className="mt-0">
            <ScrollArea className="h-[500px] px-6">
              {loading ? (
                <div className="text-center py-10 text-gray-500">Chargement...</div>
              ) : displayedMessages.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  Aucun message reçu
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  {displayedMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        !message.is_read 
                          ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSelectedMessage(message);
                        if (!message.is_read) {
                          markAsRead(message.id);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className={`font-semibold ${!message.is_read ? 'text-blue-600' : 'text-gray-900'}`}>
                              {message.sender?.full_name || message.sender?.email || 'Inconnu'}
                            </span>
                            {!message.is_read && (
                              <Badge variant="default" className="bg-blue-600">Nouveau</Badge>
                            )}
                          </div>
                          <div className={`font-medium mb-1 ${!message.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {message.subject || 'Sans sujet'}
                          </div>
                          <div className="text-sm text-gray-600 line-clamp-2">
                            {message.body}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 ml-4 flex flex-col items-end space-y-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {formatDistanceToNow(new Date(message.created_at), { 
                              addSuffix: true, 
                              locale: fr 
                            })}
                          </span>
                        </div>
                      </div>
                      {selectedMessage?.id === message.id && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="whitespace-pre-wrap text-sm text-gray-700 mb-4">
                            {message.body}
                          </div>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              composeReply(message);
                            }}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Répondre
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="sent" className="mt-0">
            <ScrollArea className="h-[500px] px-6">
              {loading ? (
                <div className="text-center py-10 text-gray-500">Chargement...</div>
              ) : displayedMessages.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  Aucun message envoyé
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  {displayedMessages.map((message) => (
                    <div
                      key={message.id}
                      className="p-4 rounded-lg border bg-white hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm text-gray-600">À :</span>
                            <span className="font-semibold text-gray-900">
                              {message.recipient?.full_name || message.recipient?.email || 'Inconnu'}
                            </span>
                            {message.is_read && (
                              <CheckCheck className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                          <div className="font-medium mb-1 text-gray-700">
                            {message.subject || 'Sans sujet'}
                          </div>
                          <div className="text-sm text-gray-600 line-clamp-2">
                            {message.body}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 ml-4">
                          {formatDistanceToNow(new Date(message.created_at), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </div>
                      </div>
                      {selectedMessage?.id === message.id && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="whitespace-pre-wrap text-sm text-gray-700">
                            {message.body}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* Composer un message */}
          <TabsContent value="compose" className="mt-0">
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Destinataire</label>
                <Input
                  placeholder="Nom ou email du destinataire"
                  value={newMessage.recipient}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, recipient: e.target.value }))}
                  disabled={selectedMessage}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sujet</label>
                <Input
                  placeholder="Objet du message"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <Textarea
                  placeholder="Écrivez votre message..."
                  value={newMessage.body}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, body: e.target.value }))}
                  rows={8}
                />
              </div>

              {/* Réponses rapides */}
              <div>
                <label className="text-sm font-medium mb-2 block">Réponses rapides</label>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setNewMessage(prev => ({ 
                        ...prev, 
                        body: prev.body + (prev.body ? '\n\n' : '') + reply 
                      }))}
                    >
                      {reply.substring(0, 30)}...
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewMessage({ recipient: '', subject: '', body: '' });
                    setSelectedMessage(null);
                  }}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={loading || !newMessage.body.trim()}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MessagesModal;
