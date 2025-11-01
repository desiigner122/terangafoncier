/**
 * Purchase Case Messaging Component
 * Affiche et gère les messages entre vendeur et acheteur
 * @author Teranga Foncier Team
 */

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Send, 
  Paperclip, 
  FileText, 
  User,
  Clock,
  CheckCheck,
  X
} from 'lucide-react';

const PurchaseCaseMessaging = ({ caseId, caseNumber, buyerInfo, sellerInfo }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [documents, setDocuments] = useState([]);
  const messagesEndRef = useRef(null);

  // Charger les messages
  useEffect(() => {
    if (caseId) {
      loadMessages();
      loadDocuments();
      
      // Subscribe aux nouveaux messages en temps réel
      const subscription = supabase
        .channel(`case-messages-${caseId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'purchase_case_messages',
            filter: `case_id=eq.${caseId}`
          },
          (payload) => {
            console.log('📨 [MESSAGING] Nouveau message reçu:', payload);
            loadMessages();
          }
        )
        .subscribe();

      return () => {
        supabase.channel(`case-messages-${caseId}`).unsubscribe();
      };
    }
  }, [caseId]);

  // Auto-scroll vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('purchase_case_messages_detailed')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Marquer les messages comme lus
      if (user && data && data.length > 0) {
        const unreadMessages = data.filter(
          m => m.sent_by !== user.id && m.read_at === null
        );
        
        if (unreadMessages.length > 0) {
          await Promise.all(
            unreadMessages.map(msg =>
              supabase
                .from('purchase_case_messages')
                .update({ read_at: new Date().toISOString() })
                .eq('id', msg.id)
            )
          );
          loadMessages();
        }
      }
    } catch (error) {
      console.error('❌ Erreur chargement messages:', error);
      toast.error('Impossible de charger les messages');
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('purchase_case_documents')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('❌ Erreur chargement documents:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast.error('Veuillez entrer un message');
      return;
    }

    try {
      setSendingMessage(true);

      const { error } = await supabase
        .from('purchase_case_messages')
        .insert({
          case_id: caseId,
          sent_by: user.id,
          message: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage('');
      toast.success('Message envoyé');
      loadMessages();
    } catch (error) {
      console.error('❌ Erreur envoi message:', error);
      toast.error('Impossible d\'envoyer le message');
    } finally {
      setSendingMessage(false);
    }
  };

  const getSenderName = (message) => {
    if (message.sender_role === 'buyer') {
      return buyerInfo?.name || message.sender_first_name || 'Acheteur';
    } else if (message.sender_role === 'seller') {
      return sellerInfo?.name || message.sender_first_name || 'Vendeur';
    }
    return message.sender_first_name || 'Utilisateur';
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Tabs defaultValue="messages" className="w-full flex flex-col flex-1">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="messages">
            📨 Messages ({messages.length})
          </TabsTrigger>
          <TabsTrigger value="documents">
            📄 Documents ({documents.length})
          </TabsTrigger>
        </TabsList>

        {/* MESSAGES TAB */}
        <TabsContent value="messages" className="flex-1 flex flex-col">
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Aucun message pour le moment. Commencez la conversation!</p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isSentByMe = msg.sent_by === user?.id;
                const showDate =
                  idx === 0 ||
                  formatDate(messages[idx - 1].created_at) !== formatDate(msg.created_at);

                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="flex justify-center mb-4">
                        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {formatDate(msg.created_at)}
                        </span>
                      </div>
                    )}

                    <div className={`flex gap-2 ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xs lg:max-w-md ${
                          isSentByMe
                            ? 'bg-blue-600 text-white rounded-l-lg rounded-tr-lg'
                            : 'bg-gray-100 text-gray-900 rounded-r-lg rounded-tl-lg'
                        } px-4 py-2`}
                      >
                        {!isSentByMe && (
                          <p className="text-xs font-semibold opacity-70 mb-1">
                            {getSenderName(msg)}
                          </p>
                        )}
                        <p className="text-sm break-words">{msg.message}</p>
                        <div
                          className={`text-xs mt-1 flex items-center justify-between gap-1 ${
                            isSentByMe ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          <span>{formatTime(msg.created_at)}</span>
                          {isSentByMe && msg.read_at && (
                            <CheckCheck className="w-3 h-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t p-4 bg-gray-50">
            <div className="flex gap-2">
              <Input
                placeholder="Tapez votre message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={sendingMessage}
                className="flex-1"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={sendingMessage || !newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Appuyez sur Entrée pour envoyer
            </p>
          </div>
        </TabsContent>

        {/* DOCUMENTS TAB */}
        <TabsContent value="documents" className="flex-1 flex flex-col overflow-auto">
          <div className="p-4 space-y-3">
            {documents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Aucun document pour le moment</p>
              </div>
            ) : (
              documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="w-8 h-8 text-blue-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">
                            {doc.file_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {doc.document_type} • {(doc.file_size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <Badge
                          className={`text-xs ${
                            doc.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : doc.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {doc.status}
                        </Badge>
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-xs"
                        >
                          Voir
                        </a>
                      </div>
                    </div>
                    {doc.comments && (
                      <p className="text-xs text-gray-600 mt-2 border-t pt-2">
                        💬 {doc.comments}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PurchaseCaseMessaging;
