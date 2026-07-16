import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Users,
  Bell,
  Search,
  Plus,
  Star,
  User,
  Archive,
  Paperclip,
  Eye,
  Reply,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { toast } from 'sonner';

const MairieMessages = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Données réelles (schéma : conversations / conversation_participants / messages)
  const [inboxMessages, setInboxMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (user?.id) {
      loadMessages();
    }
  }, [user]);

  const loadMessages = async () => {
    try {
      setLoading(true);

      // 1) Conversations auxquelles la mairie participe
      const { data: participations, error: partError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);
      if (partError) throw partError;

      const conversationIds = [...new Set((participations || []).map(p => p.conversation_id))];
      if (conversationIds.length === 0) {
        setInboxMessages([]);
        setSentMessages([]);
        setContacts([]);
        setLoading(false);
        return;
      }

      // 2) Conversations + participants + messages en parallèle
      const [conversationsRes, messagesRes] = await Promise.all([
        supabase
          .from('conversations')
          .select('*, participants:conversation_participants(user_id)')
          .in('id', conversationIds),
        supabase
          .from('messages')
          .select('id, conversation_id, sender_id, content, read, created_at')
          .in('conversation_id', conversationIds)
          .order('created_at', { ascending: true })
      ]);
      if (conversationsRes.error) throw conversationsRes.error;
      if (messagesRes.error) throw messagesRes.error;

      const conversationsData = conversationsRes.data || [];
      const allMessages = messagesRes.data || [];

      const conversationsById = new Map(conversationsData.map(c => [c.id, c]));

      // 3) Profils des interlocuteurs (tous les participants + expéditeurs hors mairie)
      const participantIds = [...new Set(
        conversationsData
          .flatMap(c => (c.participants || []).map(p => p.user_id))
          .concat(allMessages.map(m => m.sender_id))
          .filter(id => id && id !== user.id)
      )];

      const { data: profilesData } = participantIds.length > 0
        ? await supabase
            .from('profiles')
            .select('id, first_name, last_name, full_name, email, avatar_url')
            .in('id', participantIds)
        : { data: [] };

      const profilesById = new Map((profilesData || []).map(p => [p.id, p]));

      const nameOf = (id) => {
        const p = profilesById.get(id);
        if (!p) return 'Interlocuteur';
        return p.full_name
          || `${p.first_name || ''} ${p.last_name || ''}`.trim()
          || p.email
          || 'Interlocuteur';
      };
      const otherParticipant = (conv) => (conv?.participants || [])
        .map(p => p.user_id)
        .find(id => id && id !== user.id);

      // 4) Boîte de réception : messages reçus (expéditeur ≠ mairie)
      const inbox = allMessages
        .filter(m => m.sender_id !== user.id)
        .map(m => {
          const conv = conversationsById.get(m.conversation_id);
          const senderProfile = profilesById.get(m.sender_id);
          return {
            id: m.id,
            conversationId: m.conversation_id,
            sender: nameOf(m.sender_id),
            senderEmail: senderProfile?.email || '',
            senderAvatar: senderProfile?.avatar_url || '',
            subject: conv?.subject || 'Conversation',
            content: m.content || '',
            preview: (m.content || '').slice(0, 120),
            timestamp: m.created_at,
            isRead: !!m.read,
            attachments: []
          };
        })
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      // 5) Messages envoyés (expéditeur = mairie)
      const sent = allMessages
        .filter(m => m.sender_id === user.id)
        .map(m => {
          const conv = conversationsById.get(m.conversation_id);
          const otherId = otherParticipant(conv);
          return {
            id: m.id,
            conversationId: m.conversation_id,
            recipient: otherId ? nameOf(otherId) : 'Destinataire',
            subject: conv?.subject || 'Conversation',
            content: m.content || '',
            timestamp: m.created_at,
            attachments: []
          };
        })
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      // 6) Contacts (interlocuteurs des conversations) pour le formulaire de rédaction
      const contactList = conversationsData
        .map(conv => {
          const otherId = otherParticipant(conv);
          if (!otherId) return null;
          const p = profilesById.get(otherId);
          return {
            conversationId: conv.id,
            name: nameOf(otherId),
            email: p?.email || '',
            avatar: p?.avatar_url || ''
          };
        })
        .filter(Boolean);

      setInboxMessages(inbox);
      setSentMessages(sent);
      setContacts(contactList);
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
      toast.error('Erreur lors du chargement des messages');
      setInboxMessages([]);
      setSentMessages([]);
      setContacts([]);
      setLoading(false);
    }
  };

  const unreadCount = inboxMessages.filter(m => !m.isRead).length;

  const openMessage = async (message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      try {
        await supabase.from('messages').update({ read: true }).eq('id', message.id);
        setInboxMessages(prev => prev.map(m =>
          m.id === message.id ? { ...m, isRead: true } : m
        ));
      } catch (error) {
        console.error('Erreur marquage lu:', error);
      }
    }
  };

  const filteredMessages = (messages) => {
    const q = searchQuery.toLowerCase();
    return messages.filter(message =>
      message.sender?.toLowerCase().includes(q) ||
      message.subject?.toLowerCase().includes(q) ||
      message.recipient?.toLowerCase().includes(q)
    );
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !recipient) {
      toast.error('Choisissez un destinataire et saisissez un message');
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: recipient,
          sender_id: user.id,
          content: newMessage.trim(),
          read: false
        });
      if (error) throw error;

      // Mettre à jour l'activité (et le sujet si renseigné) de la conversation
      const convUpdate = { updated_at: new Date().toISOString() };
      if (newSubject.trim()) convUpdate.subject = newSubject.trim();
      await supabase.from('conversations').update(convUpdate).eq('id', recipient);

      toast.success('Message envoyé');
      setNewMessage('');
      setNewSubject('');
      setRecipient('');
      setActiveTab('sent');
      await loadMessages();
    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setSending(false);
    }
  };

  const initials = (name) => (name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Communications</h2>
          <p className="text-gray-600 mt-1">
            Messagerie institutionnelle et correspondances officielles
          </p>
        </div>

        <Button
          className="bg-teal-600 hover:bg-teal-700 mt-4 lg:mt-0"
          onClick={() => setActiveTab('compose')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Message
        </Button>
      </div>

      {/* Statistiques rapides (données réelles) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Messages Reçus</p>
                <p className="text-2xl font-bold text-blue-600">
                  {loading ? '—' : inboxMessages.length}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Non Lus</p>
                <p className="text-2xl font-bold text-red-600">
                  {loading ? '—' : unreadCount}
                </p>
              </div>
              <Bell className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Envoyés</p>
                <p className="text-2xl font-bold text-green-600">
                  {loading ? '—' : sentMessages.length}
                </p>
              </div>
              <Send className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversations</p>
                <p className="text-2xl font-bold text-orange-600">
                  {loading ? '—' : contacts.length}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar gauche - Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <Button
                  variant={activeTab === 'inbox' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('inbox')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Boîte de Réception
                  {unreadCount > 0 && (
                    <Badge className="ml-auto bg-red-500 text-white">{unreadCount}</Badge>
                  )}
                </Button>

                <Button
                  variant={activeTab === 'sent' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('sent')}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Messages Envoyés
                </Button>

                <Button
                  variant={activeTab === 'compose' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('compose')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Rédiger
                </Button>
              </div>

              <hr className="my-4" />

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Contacts</h4>
                {contacts.length === 0 ? (
                  <p className="text-xs text-gray-400">Aucun contact pour le moment.</p>
                ) : (
                  <div className="space-y-2">
                    {contacts.slice(0, 5).map((contact, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback className="text-xs">
                            {initials(contact.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">{contact.name}</p>
                          {contact.email && (
                            <p className="text-xs text-gray-500 truncate">{contact.email}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <div className="lg:col-span-3">
          {activeTab === 'inbox' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Boîte de Réception</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center py-16 text-gray-500">
                    <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                    Chargement...
                  </div>
                ) : filteredMessages(inboxMessages).length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Aucun message reçu</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Les messages des administrés et institutions apparaîtront ici.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredMessages(inboxMessages).map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer ${
                          !message.isRead ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => openMessage(message)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-1">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={message.senderAvatar} />
                                <AvatarFallback>
                                  {initials(message.sender)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <p className={`text-sm truncate ${
                                    !message.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                                  }`}>
                                    {message.sender}
                                  </p>
                                </div>
                                <p className={`text-sm truncate ${
                                  !message.isRead ? 'font-medium text-gray-900' : 'text-gray-600'
                                }`}>
                                  {message.subject}
                                </p>
                                <p className="text-xs text-gray-500 truncate mt-1">
                                  {message.preview}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="ml-4 flex flex-col items-end space-y-1">
                            <span className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleDateString('fr-FR')}
                            </span>
                            {message.attachments.length > 0 && (
                              <Paperclip className="h-3 w-3 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'sent' && (
            <Card>
              <CardHeader>
                <CardTitle>Messages Envoyés</CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center py-16 text-gray-500">
                    <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                    Chargement...
                  </div>
                ) : filteredMessages(sentMessages).length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <Send className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Aucun message envoyé</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Vos messages envoyés apparaîtront ici.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredMessages(sentMessages).map((message) => (
                      <div key={message.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{message.recipient}</p>
                            <p className="text-sm text-gray-600">{message.subject}</p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {(message.content || '').substring(0, 100)}
                              {(message.content || '').length > 100 ? '...' : ''}
                            </p>
                          </div>
                          <div className="ml-4 text-right">
                            <span className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleDateString('fr-FR')}
                            </span>
                            {message.attachments.length > 0 && (
                              <div className="mt-1">
                                <Paperclip className="h-3 w-3 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'compose' && (
            <Card>
              <CardHeader>
                <CardTitle>Rédiger un Message</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Destinataire</label>
                  <Select value={recipient} onValueChange={setRecipient}>
                    <SelectTrigger>
                      <SelectValue placeholder={contacts.length ? 'Sélectionner un destinataire' : 'Aucun contact disponible'} />
                    </SelectTrigger>
                    <SelectContent>
                      {contacts.map((contact, index) => (
                        <SelectItem key={index} value={contact.conversationId}>
                          {contact.name}{contact.email ? ` - ${contact.email}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {contacts.length === 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      Aucune conversation existante. Les échanges se créent depuis les demandes communales.
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Objet</label>
                  <Input
                    placeholder="Objet du message"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  <Textarea
                    placeholder="Rédigez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={10}
                  />
                </div>

                <div className="flex items-center justify-end">
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleSendMessage}
                      disabled={sending || !recipient || !newMessage.trim()}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {sending ? 'Envoi...' : 'Envoyer'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Dialog détail message */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedMessage.subject}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-gray-600">De: {selectedMessage.sender}</span>
                  {selectedMessage.timestamp && (
                    <span className="text-sm text-gray-400">
                      · {new Date(selectedMessage.timestamp).toLocaleString('fr-FR')}
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedMessage(null)}
                className="text-gray-600"
              >
                ×
              </Button>
            </div>

            <div className="prose max-w-none">
              <div className="whitespace-pre-line text-gray-700">
                {selectedMessage.content}
              </div>
            </div>

            {selectedMessage.attachments.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Pièces jointes:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMessage.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded">
                      <Paperclip className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{attachment}</span>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setRecipient(selectedMessage.conversationId);
                  setNewSubject(selectedMessage.subject === 'Conversation' ? '' : selectedMessage.subject);
                  setSelectedMessage(null);
                  setActiveTab('compose');
                }}
              >
                <Reply className="h-4 w-4 mr-2" />
                Répondre
              </Button>
              <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                <Archive className="h-4 w-4 mr-2" />
                Fermer
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MairieMessages;
