import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageSquare,
  Send,
  Search,
  Filter,
  FileText,
  Paperclip,
  Star,
  Archive,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Building2,
  Shield,
  Phone,
  Mail,
  Calendar,
  Eye,
  Reply,
  Forward,
  MoreVertical,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/customSupabaseClient';

const ParticulierMessages = () => {
  const outletContext = useOutletContext();
  const { user } = outletContext || {};
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recus');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (user?.id) {
      loadMessages();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const loadMessages = async () => {
    if (!user?.id) {
      console.log('❌ Utilisateur non disponible');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('📊 Chargement des messages administratifs...');

      const { data, error } = await supabase
        .from('messages_administratifs')
        .select('*')
        .eq('destinataire_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMessages(data || []);
      console.log(`✅ ${data?.length || 0} messages chargés`);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatutColor = (statut) => {
    return statut === 'non_lu' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600';
  };

  const getPrioriteColor = (priorite) => {
    const colors = {
      'Élevée': 'bg-red-100 text-red-800',
      'Normale': 'bg-green-100 text-green-800'
    };
    return colors[priorite] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'validation': CheckCircle2,
      'demande_document': FileText,
      'rendez_vous': Calendar,
      'signature': Shield,
      'rappel': Clock,
      'general': MessageSquare
    };
    return icons[type] || MessageSquare;
  };

  const markAsRead = async (messageId) => {
    try {
      const { error } = await supabase
        .from('messages_administratifs')
        .update({ statut: 'lu' })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, statut: 'lu' } : msg
        )
      );
    } catch (error) {
      console.error('❌ Erreur lors du marquage comme lu:', error);
    }
  };

  const filteredMessages = messages.filter(message => {
    if (activeTab === 'recus') {
      return message.objet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             message.expediteur?.nom?.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const unreadCount = messages.filter(msg => msg.statut === 'non_lu').length;

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Chargement des messages...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">
            {unreadCount > 0 && (
              <span className="text-blue-600 font-medium">
                {unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}
              </span>
            )}
            {unreadCount === 0 && "Tous vos messages sont lus"}
          </p>
        </div>
        <Button 
          onClick={loadMessages}
          variant="outline" 
          size="sm"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recus" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Messages reçus
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="envoyes" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Messages envoyés
          </TabsTrigger>
          <TabsTrigger value="archives" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Archives
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recus" className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher dans les messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrer
            </Button>
          </div>

          <div className="space-y-4">
            {filteredMessages.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun message</h3>
                  <p className="text-gray-600 text-center">
                    Vous n'avez pas encore reçu de messages de la part des services administratifs.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredMessages.map((message) => {
                const TypeIcon = getTypeIcon(message.type);
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        message.statut === 'non_lu' ? 'border-blue-200 bg-blue-50/50' : ''
                      }`}
                      onClick={() => {
                        setSelectedMessage(message);
                        if (message.statut === 'non_lu') {
                          markAsRead(message.id);
                        }
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="flex-shrink-0">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-gray-100">
                                  {message.expediteur?.avatar || 
                                   message.expediteur?.nom?.split(' ').map(n => n[0]).join('').toUpperCase() || 
                                   'AD'}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {message.expediteur?.nom || 'Service Administratif'}
                                </p>
                                <Badge className={getStatutColor(message.statut)} variant="secondary">
                                  {message.statut === 'non_lu' ? 'Non lu' : 'Lu'}
                                </Badge>
                                {message.priorite && (
                                  <Badge className={getPrioriteColor(message.priorite)} variant="secondary">
                                    {message.priorite}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mb-2">
                                {message.expediteur?.service || 'Service Administratif'} • 
                                {message.dossier_ref && ` Dossier: ${message.dossier_ref} • `}
                                {new Date(message.created_at).toLocaleDateString('fr-FR')}
                              </p>
                              <h3 className="text-sm font-medium text-gray-900 mb-2">
                                {message.objet || 'Message administratif'}
                              </h3>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {message.contenu || 'Contenu du message...'}
                              </p>
                              {message.pieces_jointes && message.pieces_jointes.length > 0 && (
                                <div className="flex items-center mt-2 text-xs text-gray-500">
                                  <Paperclip className="h-3 w-3 mr-1" />
                                  {message.pieces_jointes.length} pièce{message.pieces_jointes.length > 1 ? 's' : ''} jointe{message.pieces_jointes.length > 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TypeIcon className="h-5 w-5 text-gray-400" />
                            <MoreVertical className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="envoyes" className="space-y-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Send className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Messages envoyés</h3>
              <p className="text-gray-600 text-center">
                Cette fonctionnalité sera bientôt disponible.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archives" className="space-y-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Archive className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Messages archivés</h3>
              <p className="text-gray-600 text-center">
                Cette fonctionnalité sera bientôt disponible.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog pour afficher le message sélectionné */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedMessage && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-100">
                        {selectedMessage.expediteur?.avatar || 
                         selectedMessage.expediteur?.nom?.split(' ').map(n => n[0]).join('').toUpperCase() || 
                         'AD'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle className="text-lg">
                        {selectedMessage.objet || 'Message administratif'}
                      </DialogTitle>
                      <p className="text-sm text-gray-500">
                        De: {selectedMessage.expediteur?.nom || 'Service Administratif'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPrioriteColor(selectedMessage.priorite)} variant="secondary">
                      {selectedMessage.priorite}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Service:</span>
                      <p className="text-gray-600">{selectedMessage.expediteur?.service || 'Service Administratif'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Date:</span>
                      <p className="text-gray-600">
                        {new Date(selectedMessage.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {selectedMessage.dossier_ref && (
                      <div className="col-span-2">
                        <span className="font-medium text-gray-700">Dossier:</span>
                        <p className="text-gray-600">{selectedMessage.dossier_ref}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Message:</h4>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700">
                      {selectedMessage.contenu || 'Contenu du message...'}
                    </p>
                  </div>
                </div>

                {selectedMessage.pieces_jointes && selectedMessage.pieces_jointes.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Pièces jointes:</h4>
                    <div className="space-y-2">
                      {selectedMessage.pieces_jointes.map((piece, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{piece}</span>
                          <Button size="sm" variant="ghost">
                            Télécharger
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2 pt-4 border-t">
                  <Button size="sm" className="flex-1">
                    <Reply className="h-4 w-4 mr-2" />
                    Répondre
                  </Button>
                  <Button size="sm" variant="outline">
                    <Forward className="h-4 w-4 mr-2" />
                    Transférer
                  </Button>
                  <Button size="sm" variant="outline">
                    <Archive className="h-4 w-4 mr-2" />
                    Archiver
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParticulierMessages;