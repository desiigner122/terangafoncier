import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Send, 
  Search, 
  Filter,
  MoreVertical,
  Paperclip,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  Check,
  CheckCheck,
  Circle,
  User,
  Calendar,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const InvestisseurMessages = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'Maître Diop - Notaire',
      subject: 'Validation de l\'acte de propriété - Terrain Almadies',
      preview: 'Bonjour, je vous confirme que l\'acte de propriété pour votre investissement...',
      timestamp: '2024-01-20T14:30:00Z',
      read: false,
      important: true,
      attachments: 2,
      type: 'legal',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      from: 'Sarah Chen - Promoteur',
      subject: 'Nouvelle opportunité - Résidence Premium Saly',
      preview: 'Une opportunité exclusive vient de se présenter pour un projet résidentiel...',
      timestamp: '2024-01-20T11:15:00Z',
      read: false,
      important: false,
      attachments: 5,
      type: 'opportunity',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b3db?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      from: 'Mamadou Ba - Agent Foncier',
      subject: 'Rapport d\'évaluation - Terrain Commercial Thiès',
      preview: 'Veuillez trouver ci-joint le rapport d\'évaluation complet du terrain...',
      timestamp: '2024-01-19T16:45:00Z',
      read: true,
      important: false,
      attachments: 1,
      type: 'report',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 4,
      from: 'Banque Atlantique',
      subject: 'Confirmation de financement approuvé',
      preview: 'Nous avons le plaisir de vous informer que votre demande de financement...',
      timestamp: '2024-01-19T09:20:00Z',
      read: true,
      important: true,
      attachments: 0,
      type: 'banking',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 5,
      from: 'Teranga Foncier - Support',
      subject: 'Mise à jour de votre profil investisseur',
      preview: 'Votre profil a été mis à jour avec succès. Découvrez les nouvelles fonctionnalités...',
      timestamp: '2024-01-18T13:10:00Z',
      read: true,
      important: false,
      attachments: 0,
      type: 'system',
      avatar: null
    }
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 300);
  }, []);

  const getTypeColor = (type) => {
    const colors = {
      legal: 'bg-purple-100 text-purple-800',
      opportunity: 'bg-green-100 text-green-800',
      report: 'bg-blue-100 text-blue-800',
      banking: 'bg-orange-100 text-orange-800',
      system: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type) => {
    const icons = {
      legal: '⚖️',
      opportunity: '🎯',
      report: '📊',
      banking: '🏦',
      system: '⚙️'
    };
    return icons[type] || '📧';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 1) return 'À l\'instant';
    if (hours < 24) return `${Math.floor(hours)}h`;
    if (hours < 48) return 'Hier';
    return date.toLocaleDateString('fr-FR');
  };

  const filteredMessages = messages.filter(message =>
    message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('Messages Debug:', { loading, messagesCount: messages.length, filteredCount: filteredMessages.length });

  if (loading) {
    return (
      <div className="w-full h-full bg-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white">
      <div className="flex h-full">
        {/* Liste des messages */}
        <div className="w-1/3 border-r bg-gray-50">
          {/* Header liste */}
          <div className="p-4 border-b bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4 mr-2" />
                Nouveau
              </Button>
            </div>
            
            {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtres */}
          <div className="p-4 bg-white border-b">
            <div className="flex space-x-2">
              <Badge className="bg-blue-100 text-blue-800 cursor-pointer">
                Tous ({messages.length})
              </Badge>
              <Badge className="bg-red-100 text-red-800 cursor-pointer">
                Non lus ({messages.filter(m => !m.read).length})
              </Badge>
              <Badge className="bg-yellow-100 text-yellow-800 cursor-pointer">
                Importants ({messages.filter(m => m.important).length})
              </Badge>
            </div>
          </div>

          {/* Liste messages */}
          <div className="overflow-y-auto h-full">
            {filteredMessages.map((message) => (
              <motion.div
                key={message.id}
                onClick={() => setSelectedMessage(message)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${
                  selectedMessage?.id === message.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'bg-white'
                } ${!message.read ? 'font-semibold' : ''}`}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    {message.avatar ? (
                      <img 
                        src={message.avatar} 
                        alt={message.from}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-gray-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm truncate ${!message.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {message.from}
                      </p>
                      <div className="flex items-center space-x-1">
                        {message.important && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                        {!message.read ? (
                          <Circle className="h-2 w-2 text-blue-600 fill-current" />
                        ) : (
                          <CheckCheck className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    <p className={`text-sm mb-1 truncate ${!message.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                      {message.subject}
                    </p>
                    
                    <p className="text-xs text-gray-500 truncate mb-2">
                      {message.preview}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs ${getTypeColor(message.type)}`}>
                          {getTypeIcon(message.type)} {message.type}
                        </Badge>
                        {message.attachments > 0 && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Paperclip className="h-3 w-3 mr-1" />
                            {message.attachments}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contenu du message */}
        <div className="flex-1 flex flex-col">
          {selectedMessage ? (
            <>
              {/* Header message */}
              <div className="p-6 border-b bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      {selectedMessage.avatar ? (
                        <img 
                          src={selectedMessage.avatar} 
                          alt={selectedMessage.from}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedMessage.from}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedMessage.timestamp).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Reply className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Forward className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">{selectedMessage.subject}</h2>
                  <Badge className={getTypeColor(selectedMessage.type)}>
                    {getTypeIcon(selectedMessage.type)} {selectedMessage.type}
                  </Badge>
                </div>
              </div>

              {/* Contenu message */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {selectedMessage.preview}
                  </p>
                  
                  {/* Contenu étendu simulé */}
                  <div className="space-y-4 text-gray-700">
                    <p>
                      Cher investisseur,
                    </p>
                    <p>
                      Suite à notre échange précédent, je vous confirme que tous les documents nécessaires 
                      ont été vérifiés et validés. Votre investissement dans ce projet présente un excellent 
                      potentiel de rendement.
                    </p>
                    <p>
                      Les points clés à retenir :
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Statut juridique du terrain : <strong>Validé</strong></li>
                      <li>Potentiel de valorisation : <strong>+25% sur 18 mois</strong></li>
                      <li>Risques identifiés : <strong>Faible</strong></li>
                      <li>Financement : <strong>Approuvé</strong></li>
                    </ul>
                    <p>
                      N'hésitez pas à me contacter pour toute question complémentaire.
                    </p>
                    <p>
                      Cordialement,<br />
                      {selectedMessage.from}
                    </p>
                  </div>

                  {/* Pièces jointes */}
                  {selectedMessage.attachments > 0 && (
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Paperclip className="h-4 w-4 mr-2" />
                        Pièces jointes ({selectedMessage.attachments})
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                              📄
                            </div>
                            <div>
                              <p className="text-sm font-medium">Acte_propriété_Almadies.pdf</p>
                              <p className="text-xs text-gray-500">2.3 MB</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            Télécharger
                          </Button>
                        </div>
                        
                        {selectedMessage.attachments > 1 && (
                          <div className="flex items-center justify-between p-2 bg-white rounded border">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                                📊
                              </div>
                              <div>
                                <p className="text-sm font-medium">Analyse_investissement.xlsx</p>
                                <p className="text-xs text-gray-500">1.8 MB</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              Télécharger
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Zone de réponse */}
              <div className="p-6 border-t bg-gray-50">
                <div className="space-y-3">
                  <textarea
                    placeholder="Tapez votre réponse..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Brouillon
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Aucun message sélectionné */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez un message</h3>
                <p className="text-gray-600">Choisissez un message dans la liste pour le lire</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestisseurMessages;