import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare,
  Send,
  Phone,
  Mail,
  Users,
  Bell,
  Calendar,
  FileText,
  Search,
  Filter,
  Plus,
  Star,
  Clock,
  CheckCircle,
  User,
  Building,
  Flag,
  Archive,
  Paperclip,
  Eye,
  Reply
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const MairieMessages = ({ dashboardStats }) => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState('');

  // Messages reçus
  const inboxMessages = [
    {
      id: 'msg-001',
      sender: 'Conseil Départemental de Dakar',
      senderEmail: 'contact@conseil-dakar.sn',
      senderAvatar: null,
      subject: 'Nouvelle directive sur l\'attribution foncière communale',
      preview: 'Suite aux récentes réformes, nous vous informons des nouvelles procédures...',
      content: 'Monsieur le Maire,\n\nSuite aux récentes réformes du code foncier, nous vous informons des nouvelles procédures d\'attribution foncière communale qui entreront en vigueur le 1er février 2024.\n\nLes principales modifications concernent :\n- Les seuils d\'attribution automatique\n- Les procédures de consultation publique\n- Les délais de traitement\n\nVeuillez trouver en pièce jointe le guide complet des nouvelles procédures.\n\nCordialement,\nLe Secrétaire Général',
      timestamp: '2024-01-22T14:30:00',
      isRead: false,
      isImportant: true,
      category: 'Officiel',
      attachments: ['Guide_nouvelles_procedures.pdf'],
      priority: 'Haute'
    },
    {
      id: 'msg-002',
      sender: 'Association des Résidents - Quartier Nord',
      senderEmail: 'president@residents-nord.org',
      senderAvatar: null,
      subject: 'Demande d\'aménagement d\'un parc public',
      preview: 'Les résidents du quartier Nord souhaitent soumettre une demande d\'aménagement...',
      content: 'Monsieur le Maire,\n\nAu nom de l\'Association des Résidents du Quartier Nord, nous souhaitons vous soumettre une demande d\'aménagement d\'un parc public sur le terrain vague situé entre les rues 15 et 17.\n\nCe projet bénéficierait à plus de 800 familles et comprend :\n- Aires de jeux pour enfants\n- Espaces verts\n- Terrain de sport\n- Éclairage public\n\nNous avons déjà réuni 65% des signatures nécessaires et disposons d\'un budget participatif de 2,5M FCFA.\n\nNous restons à votre disposition pour présenter ce projet en détail.\n\nCordialement,\nMadame Fatou Diop, Présidente',
      timestamp: '2024-01-21T09:15:00',
      isRead: true,
      isImportant: false,
      category: 'Citoyens',
      attachments: ['Petition_signatures.pdf', 'Plan_amenagement.jpg'],
      priority: 'Moyenne'
    },
    {
      id: 'msg-003',
      sender: 'Moussa Ba - Entrepreneur',
      senderEmail: 'moussa.ba@construction.sn',
      senderAvatar: null,
      subject: 'Demande de permis de construire - Complexe commercial',
      preview: 'Je souhaite déposer une demande de permis de construire pour un complexe commercial...',
      content: 'Monsieur le Maire,\n\nJ\'ai l\'honneur de vous adresser ma demande de permis de construire pour un complexe commercial moderne situé Zone Commerciale Centre, parcelle 245-B.\n\nLe projet comprend :\n- Surface totale : 2,400m²\n- 45 boutiques\n- 150 places de parking\n- Centre de services (banque, poste, pharmacie)\n\nTous les documents techniques sont joints à ce message. Le projet respecte toutes les normes d\'urbanisme en vigueur et créera environ 200 emplois directs.\n\nInvestissement total : 850M FCFA\nDurée des travaux prévue : 18 mois\n\nJe reste à votre disposition pour tout complément d\'information.\n\nCordialement,\nMoussa Ba',
      timestamp: '2024-01-20T16:45:00',
      isRead: true,
      isImportant: false,
      category: 'Business',
      attachments: ['Plans_architecturaux.pdf', 'Etude_impact.pdf', 'Devis_estimatif.xlsx'],
      priority: 'Normale'
    },
    {
      id: 'msg-004',
      sender: 'Préfet du Département',
      senderEmail: 'cabinet@prefet-dakar.gouv.sn',
      senderAvatar: null,
      subject: 'Convocation réunion des maires - Schéma directeur',
      preview: 'Vous êtes convié à la réunion mensuelle des maires du département...',
      content: 'Monsieur le Maire,\n\nVous êtes convié à la réunion mensuelle des maires du département qui se tiendra le jeudi 25 janvier 2024 à 14h00 dans les locaux de la Préfecture.\n\nOrdre du jour :\n1. Présentation du nouveau schéma directeur d\'urbanisme\n2. Budget participatif régional 2024\n3. Coordination des projets intercommunaux\n4. Point sur les réformes foncières\n5. Questions diverses\n\nMerci de confirmer votre présence avant le 23 janvier.\n\nCordialement,\nLe Chef de Cabinet',
      timestamp: '2024-01-19T11:20:00',
      isRead: false,
      isImportant: true,
      category: 'Officiel',
      attachments: ['Ordre_du_jour.pdf'],
      priority: 'Haute'
    }
  ];

  // Messages envoyés
  const sentMessages = [
    {
      id: 'sent-001',
      recipient: 'Direction Régionale de l\'Urbanisme',
      subject: 'Transmission dossier attribution Zone Résidentielle Nord',
      content: 'Madame la Directrice,\n\nJ\'ai l\'honneur de vous transmettre le dossier complet d\'attribution foncière pour la Zone Résidentielle Nord, secteur B.\n\nLe dossier comprend 15 demandes pré-approuvées par la commission municipale...',
      timestamp: '2024-01-22T10:30:00',
      attachments: ['Dossier_complet.pdf']
    },
    {
      id: 'sent-002',
      recipient: 'Association des Commerçants',
      subject: 'Réponse à votre demande d\'extension marché',
      content: 'Monsieur le Président,\n\nSuite à votre demande d\'extension du marché central, je vous informe que le projet a été approuvé en principe par le conseil municipal...',
      timestamp: '2024-01-21T15:45:00',
      attachments: []
    }
  ];

  // Contacts fréquents
  const frequentContacts = [
    { name: 'Conseil Départemental', email: 'contact@conseil-dakar.sn', category: 'Officiel' },
    { name: 'Préfet du Département', email: 'cabinet@prefet-dakar.gouv.sn', category: 'Officiel' },
    { name: 'Direction Urbanisme', email: 'urbanisme@region-dakar.sn', category: 'Technique' },
    { name: 'Association Citoyens Nord', email: 'president@residents-nord.org', category: 'Citoyens' },
    { name: 'Chambre Commerce', email: 'info@chambre-commerce-dakar.sn', category: 'Business' }
  ];

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Officiel': return 'bg-blue-100 text-blue-800';
      case 'Citoyens': return 'bg-green-100 text-green-800';
      case 'Business': return 'bg-purple-100 text-purple-800';
      case 'Technique': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Haute': return 'text-red-600';
      case 'Moyenne': return 'text-orange-600';
      case 'Normale': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const filteredMessages = (messages) => {
    return messages.filter(message => 
      message.sender?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.recipient?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && recipient.trim()) {
      // Logique d'envoi de message
      setNewMessage('');
      setRecipient('');
      // Toast success
    }
  };

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
        
        <Button className="bg-teal-600 hover:bg-teal-700 mt-4 lg:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Message
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Messages Reçus</p>
                <p className="text-2xl font-bold text-blue-600">24</p>
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
                <p className="text-2xl font-bold text-red-600">6</p>
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
                <p className="text-2xl font-bold text-green-600">18</p>
              </div>
              <Send className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Importants</p>
                <p className="text-2xl font-bold text-orange-600">4</p>
              </div>
              <Star className="h-8 w-8 text-orange-600" />
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
                  <Badge className="ml-auto bg-red-500 text-white">6</Badge>
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
                <h4 className="text-sm font-medium text-gray-700 mb-3">Contacts Fréquents</h4>
                <div className="space-y-2">
                  {frequentContacts.slice(0, 4).map((contact, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">{contact.name}</p>
                        <Badge className={`text-xs ${getCategoryColor(contact.category)}`}>
                          {contact.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
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
                <div className="divide-y">
                  {filteredMessages(inboxMessages).map((message) => (
                    <div 
                      key={message.id} 
                      className={`p-4 hover:bg-gray-50 cursor-pointer ${
                        !message.isRead ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-1">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={message.senderAvatar} />
                              <AvatarFallback>
                                {message.sender.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <p className={`text-sm truncate ${
                                  !message.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                                }`}>
                                  {message.sender}
                                </p>
                                <Badge className={getCategoryColor(message.category)}>
                                  {message.category}
                                </Badge>
                                {message.isImportant && (
                                  <Star className="h-4 w-4 text-yellow-500" />
                                )}
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
                          <div className="flex items-center space-x-1">
                            {message.attachments.length > 0 && (
                              <Paperclip className="h-3 w-3 text-gray-400" />
                            )}
                            <Flag className={`h-3 w-3 ${getPriorityColor(message.priority)}`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'sent' && (
            <Card>
              <CardHeader>
                <CardTitle>Messages Envoyés</CardTitle>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredMessages(sentMessages).map((message) => (
                    <div key={message.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{message.recipient}</p>
                          <p className="text-sm text-gray-600">{message.subject}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {message.content.substring(0, 100)}...
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
                      <SelectValue placeholder="Sélectionner un destinataire" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequentContacts.map((contact, index) => (
                        <SelectItem key={index} value={contact.email}>
                          {contact.name} - {contact.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Objet</label>
                  <Input placeholder="Objet du message" />
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

                <div className="flex items-center justify-between">
                  <Button variant="outline">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Joindre Fichier
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline">Brouillon</Button>
                    <Button 
                      onClick={handleSendMessage}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Envoyer
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
                  <Badge className={getCategoryColor(selectedMessage.category)}>
                    {selectedMessage.category}
                  </Badge>
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
              <Button variant="outline">
                <Reply className="h-4 w-4 mr-2" />
                Répondre
              </Button>
              <Button variant="outline">
                <Archive className="h-4 w-4 mr-2" />
                Archiver
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MairieMessages;