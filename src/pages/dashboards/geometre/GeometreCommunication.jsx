import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Video, 
  Phone, 
  Mail,
  Users,
  Calendar,
  Clock,
  FileText,
  Send,
  Paperclip,
  Search,
  Filter,
  Star,
  MapPin,
  Building,
  User,
  CheckCircle,
  Circle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

const GeometreCommunication = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');

  // Données des conversations
  const conversations = [
    {
      id: 1,
      name: 'Atelier Architecture Dakar',
      contact: 'Amadou Sall',
      type: 'Architecte',
      lastMessage: 'Les plans de topographie sont-ils prêts ?',
      timestamp: '10:30',
      unread: 2,
      status: 'online',
      project: 'Complexe résidentiel Almadies'
    },
    {
      id: 2,
      name: 'Me Fatou Sow Sarr',
      contact: 'Notaire',
      type: 'Partenaire',
      lastMessage: 'Document de bornage validé ✓',
      timestamp: '09:45',
      unread: 0,
      status: 'online',
      project: 'Lotissement VDN'
    },
    {
      id: 3,
      name: 'Groupe Promoteur Sénégal',
      contact: 'Fatou Diop',
      type: 'Promoteur',
      lastMessage: 'RDV planifié pour demain 14h',
      timestamp: 'Hier',
      unread: 1,
      status: 'away',
      project: 'Lotissement VDN Extension'
    },
    {
      id: 4,
      name: 'Famille Ndiaye',
      contact: 'Moussa Ndiaye',
      type: 'Particulier',
      lastMessage: 'Merci pour le rapport de mission',
      timestamp: 'Hier',
      unread: 0,
      status: 'offline',
      project: 'Bornage terrain familial Thiès'
    }
  ];

  // Messages pour une conversation
  const messages = [
    {
      id: 1,
      sender: 'client',
      content: 'Bonjour, j\'aimerais connaître l\'avancement du levé topographique',
      timestamp: '09:30',
      type: 'text'
    },
    {
      id: 2,
      sender: 'me',
      content: 'Bonjour ! Le levé est terminé à 80%. Je vous envoie un rapport d\'avancement.',
      timestamp: '09:35',
      type: 'text'
    },
    {
      id: 3,
      sender: 'me',
      content: 'rapport_avancement_topographie.pdf',
      timestamp: '09:36',
      type: 'file'
    },
    {
      id: 4,
      sender: 'client',
      content: 'Parfait ! Quand pensez-vous finaliser ?',
      timestamp: '09:40',
      type: 'text'
    },
    {
      id: 5,
      sender: 'me',
      content: 'D\'ici vendredi maximum. Je vous tiendrai informé.',
      timestamp: '09:42',
      type: 'text'
    }
  ];

  // Réunions à venir
  const meetings = [
    {
      id: 1,
      title: 'Point projet Almadies',
      client: 'Atelier Architecture Dakar',
      date: '2025-10-05',
      time: '10:00',
      type: 'Visioconférence',
      participants: 3,
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'Validation bornage',
      client: 'Me Fatou Sow Sarr',
      date: '2025-10-06',
      time: '14:30',
      type: 'Présentiel',
      participants: 4,
      status: 'pending'
    },
    {
      id: 3,
      title: 'Présentation rapport',
      client: 'Groupe Promoteur Sénégal',
      date: '2025-10-08',
      time: '09:00',
      type: 'Visioconférence',
      participants: 5,
      status: 'confirmed'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Architecte': return Building;
      case 'Promoteur': return Building;
      case 'Partenaire': return Users;
      case 'Particulier': return User;
      default: return User;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
            Communication Professionnelle
          </h1>
          <p className="text-gray-600 mt-2">
            Hub de communication multicanal : Messagerie, Visioconférence, Rapports clients
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
            <Calendar className="h-4 w-4 mr-2" />
            Planifier RDV
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
            <Video className="h-4 w-4 mr-2" />
            Nouvelle Visio
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Messages</CardTitle>
                <Badge className="bg-red-100 text-red-800">
                  {conversations.filter(c => c.unread > 0).length} non lus
                </Badge>
              </div>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input placeholder="Rechercher..." className="pl-10" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {conversations.map((conv) => {
                  const TypeIcon = getTypeIcon(conv.type);
                  return (
                    <div
                      key={conv.id}
                      onClick={() => setActiveChat(conv)}
                      className={`p-4 cursor-pointer border-l-4 transition-all duration-200 ${
                        activeChat?.id === conv.id
                          ? 'bg-blue-50 border-blue-500'
                          : 'hover:bg-gray-50 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <TypeIcon className="h-6 w-6 text-white" />
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(conv.status)} rounded-full border-2 border-white`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 truncate">{conv.name}</h4>
                            <span className="text-xs text-gray-500">{conv.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{conv.contact} • {conv.type}</p>
                          <p className="text-sm text-gray-500 truncate mt-1">{conv.lastMessage}</p>
                          <p className="text-xs text-blue-600 mt-1">{conv.project}</p>
                        </div>
                        {conv.unread > 0 && (
                          <div className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {conv.unread}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          {activeChat ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg h-full">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        {React.createElement(getTypeIcon(activeChat.type), { className: "h-5 w-5 text-white" })}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(activeChat.status)} rounded-full border-2 border-white`}></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{activeChat.name}</h3>
                      <p className="text-sm text-gray-600">{activeChat.contact} • {activeChat.project}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 flex flex-col h-96">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${
                        msg.sender === 'me'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        {msg.type === 'file' ? (
                          <div className="flex items-center gap-2">
                            <Paperclip className="h-4 w-4" />
                            <span className="text-sm underline">{msg.content}</span>
                          </div>
                        ) : (
                          <p className="text-sm">{msg.content}</p>
                        )}
                        <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-white/80' : 'text-gray-500'}`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 flex gap-2">
                    <Textarea
                      placeholder="Tapez votre message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="resize-none"
                      rows={2}
                    />
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg h-full flex items-center justify-center">
              <CardContent className="text-center">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sélectionnez une conversation</h3>
                <p className="text-gray-600">Choisissez un contact pour commencer à discuter</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Réunions à venir */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Réunions & RDV à venir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{meeting.title}</h4>
                        <Badge variant={meeting.status === 'confirmed' ? 'default' : 'outline'}>
                          {meeting.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{meeting.client}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {meeting.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {meeting.time}
                        </div>
                        <div className="flex items-center gap-1">
                          {meeting.type === 'Visioconférence' ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                          {meeting.type}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {meeting.participants} participants
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                      {meeting.type === 'Visioconférence' && (
                        <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                          <Video className="h-4 w-4 mr-2" />
                          Rejoindre
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default GeometreCommunication;