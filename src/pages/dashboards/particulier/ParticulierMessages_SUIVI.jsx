import React, { useState } from 'react';
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
  MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ParticulierMessages = () => {
  const [activeTab, setActiveTab] = useState('recus');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');

  // Messages administratifs - SUIVI COMMUNICATIONS OFFICIELLES
  const [messages] = useState([
    {
      id: 'MSG-001',
      dossierRef: 'DT-2024-001',
      expediteur: {
        nom: 'Commission Technique',
        role: 'Agent Technique',
        service: 'Direction de l\'Urbanisme - Thiès',
        avatar: 'CT',
        type: 'officiel'
      },
      objet: 'Validation de votre demande de terrain - DT-2024-001',
      contenu: 'Monsieur/Madame,\n\nNous avons le plaisir de vous informer que votre demande de terrain communal (Réf: DT-2024-001) a été approuvée par la commission technique.\n\nProchaines étapes:\n- Validation par le Maire\n- Établissement du titre provisoire\n- Notification officielle\n\nDocuments à fournir:\n- Copie CNI légalisée\n- Certificat de résidence\n- Justificatif de revenus\n\nCordialement,\nLa Commission Technique',
      dateEnvoi: '2024-01-28',
      heureEnvoi: '14:30',
      statut: 'non_lu',
      priorite: 'Élevée',
      type: 'validation',
      pieceJointe: ['checklist_documents.pdf', 'plan_terrain.pdf'],
      actions: ['Répondre', 'Télécharger documents']
    },
    {
      id: 'MSG-002',
      dossierRef: 'PC-2024-007',
      expediteur: {
        nom: 'Service des Permis',
        role: 'Instructeur',
        service: 'Mairie de Dakar',
        avatar: 'SP',
        type: 'officiel'
      },
      objet: 'Documents manquants - Permis de Construire PC-2024-007',
      contenu: 'Madame, Monsieur,\n\nSuite à l\'instruction de votre dossier de permis de construire (PC-2024-007), nous vous informons que les documents suivants sont manquants:\n\n1. Étude géotechnique du sol\n2. Plan de fondation validé par un ingénieur\n3. Attestation de raccordement SENELEC\n\nDélai de fourniture: 30 jours à compter de ce courrier.\n\nPour toute question, contactez le 33 123 45 67.\n\nCordialement,\nService des Permis de Construire',
      dateEnvoi: '2024-01-26',
      heureEnvoi: '09:15',
      statut: 'lu',
      priorite: 'Élevée',
      type: 'demande_document',
      pieceJointe: ['liste_documents_manquants.pdf'],
      echeance: '2024-02-25',
      actions: ['Répondre', 'Joindre documents', 'Prendre RDV']
    },
    {
      id: 'MSG-003',
      dossierRef: 'CP-2024-003',
      expediteur: {
        nom: 'TERANGA CONSTRUCTION',
        role: 'Chargé de Clientèle',
        service: 'Service Commercial',
        avatar: 'TC',
        type: 'promoteur',
        telephone: '77 123 45 67',
        email: 'contact@terangaconstruction.sn'
      },
      objet: 'Convocation entretien final - Candidature CP-2024-003',
      contenu: 'Bonjour,\n\nNous avons le plaisir de vous convoquer pour l\'entretien final concernant votre candidature pour la Résidence Les Palmiers (CP-2024-003).\n\nDétails de la convocation:\n- Date: Vendredi 16 février 2024\n- Heure: 10h00\n- Lieu: Siège social TERANGA CONSTRUCTION\n- Adresse: VDN, Immeuble TERANGA, 3ème étage\n\nDocuments à apporter:\n- Pièce d\'identité\n- Justificatifs de revenus (3 derniers bulletins)\n- Attestation bancaire\n\nCordialement,\nService Commercial TERANGA CONSTRUCTION',
      dateEnvoi: '2024-02-01',
      heureEnvoi: '16:45',
      statut: 'lu',
      priorite: 'Normale',
      type: 'convocation',
      pieceJointe: ['plan_logement.pdf', 'conditions_vente.pdf'],
      rdv: {
        date: '2024-02-16',
        heure: '10:00',
        lieu: 'Siège TERANGA CONSTRUCTION'
      },
      actions: ['Confirmer présence', 'Reporter RDV', 'Télécharger plan']
    },
    {
      id: 'MSG-004',
      dossierRef: 'General',
      expediteur: {
        nom: 'Plateforme TERANGA FONCIER',
        role: 'Système',
        service: 'Notifications automatiques',
        avatar: 'TF',
        type: 'systeme'
      },
      objet: 'Rappel: Échéances à venir - Vos dossiers',
      contenu: 'Bonjour,\n\nCeci est un rappel automatique concernant vos dossiers avec des échéances à venir:\n\n📋 DT-2024-001: Validation commission technique (échéance: 15/02/2024)\n🏗️ PC-2024-007: Documents manquants (échéance: 25/02/2024)\n⭐ CP-2024-003: Entretien final (date: 16/02/2024)\n\nConnectez-vous à votre tableau de bord pour plus de détails.\n\nCordialement,\nL\'équipe TERANGA FONCIER',
      dateEnvoi: '2024-02-02',
      heureEnvoi: '08:00',
      statut: 'lu',
      priorite: 'Normale',
      type: 'rappel',
      pieceJointe: [],
      actions: ['Voir tableau de bord', 'Configurer rappels']
    }
  ]);

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
      'demande_document': AlertCircle,
      'convocation': Calendar,
      'rappel': Clock
    };
    return icons[type] || MessageSquare;
  };

  const getExpediteursColor = (type) => {
    const colors = {
      'officiel': 'bg-blue-600',
      'promoteur': 'bg-green-600',
      'systeme': 'bg-purple-600'
    };
    return colors[type] || 'bg-gray-600';
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.objet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.expediteur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.dossierRef.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'non_lus') {
      return matchesSearch && message.statut === 'non_lu';
    }
    if (activeTab === 'officiels') {
      return matchesSearch && message.expediteur.type === 'officiel';
    }
    if (activeTab === 'promoteurs') {
      return matchesSearch && message.expediteur.type === 'promoteur';
    }
    return matchesSearch;
  });

  const MessageCard = ({ message, isSelected, onClick }) => {
    const TypeIcon = getTypeIcon(message.type);

    return (
      <Card 
        className={`cursor-pointer transition-all duration-200 ${
          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
        } ${message.statut === 'non_lu' ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''}`}
        onClick={() => onClick(message)}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-start gap-3 flex-1">
              <Avatar className={`w-10 h-10 ${getExpediteursColor(message.expediteur.type)}`}>
                <AvatarFallback className="text-white font-medium">
                  {message.expediteur.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate">{message.expediteur.nom}</h4>
                  <Badge variant="outline" className="text-xs">
                    {message.expediteur.role}
                  </Badge>
                  {message.dossierRef !== 'General' && (
                    <Badge variant="secondary" className="text-xs">
                      {message.dossierRef}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{message.expediteur.service}</p>
                <h3 className={`font-medium mb-2 ${message.statut === 'non_lu' ? 'font-semibold' : ''}`}>
                  {message.objet}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">{message.contenu}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 ml-4">
              <Badge className={getStatutColor(message.statut)}>
                {message.statut === 'non_lu' ? 'Nouveau' : 'Lu'}
              </Badge>
              <Badge className={getPrioriteColor(message.priorite)} variant="outline">
                {message.priorite}
              </Badge>
              <div className="text-xs text-gray-500">
                {message.dateEnvoi} - {message.heureEnvoi}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <TypeIcon className="w-4 h-4" />
                <span className="capitalize">{message.type.replace('_', ' ')}</span>
              </div>
              {message.pieceJointe.length > 0 && (
                <div className="flex items-center gap-1">
                  <Paperclip className="w-4 h-4" />
                  {message.pieceJointe.length} PJ
                </div>
              )}
              {message.echeance && (
                <div className="flex items-center gap-1 text-orange-600">
                  <Clock className="w-4 h-4" />
                  Échéance: {message.echeance}
                </div>
              )}
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Reply className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Star className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const MessageDetail = ({ message }) => {
    const TypeIcon = getTypeIcon(message.type);

    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-4">
              <Avatar className={`w-12 h-12 ${getExpediteursColor(message.expediteur.type)}`}>
                <AvatarFallback className="text-white font-medium text-lg">
                  {message.expediteur.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold mb-1">{message.objet}</h2>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{message.expediteur.nom}</span>
                  <Badge variant="outline">{message.expediteur.role}</Badge>
                  {message.dossierRef !== 'General' && (
                    <Badge variant="secondary">{message.dossierRef}</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{message.expediteur.service}</p>
                {message.expediteur.telephone && (
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {message.expediteur.telephone}
                    </div>
                    {message.expediteur.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {message.expediteur.email}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getPrioriteColor(message.priorite)}>
                {message.priorite}
              </Badge>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
            <div className="flex items-center gap-1">
              <TypeIcon className="w-4 h-4" />
              <span className="capitalize">{message.type.replace('_', ' ')}</span>
            </div>
            <span>{message.dateEnvoi} à {message.heureEnvoi}</span>
            {message.echeance && (
              <div className="flex items-center gap-1 text-orange-600">
                <Clock className="w-4 h-4" />
                Échéance: {message.echeance}
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="prose max-w-none mb-6">
            <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
              {message.contenu}
            </div>
          </div>

          {message.rdv && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Rendez-vous programmé
              </h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Date:</span> {message.rdv.date}
                </div>
                <div>
                  <span className="font-medium">Heure:</span> {message.rdv.heure}
                </div>
                <div>
                  <span className="font-medium">Lieu:</span> {message.rdv.lieu}
                </div>
              </div>
            </div>
          )}

          {message.pieceJointe.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                Pièces jointes ({message.pieceJointe.length})
              </h4>
              <div className="space-y-2">
                {message.pieceJointe.map((piece, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-red-600" />
                      <span className="text-sm">{piece}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Télécharger
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {message.actions.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium mb-3">Actions disponibles</h4>
              <div className="flex flex-wrap gap-2">
                {message.actions.map((action, index) => (
                  <Button key={index} variant="outline">
                    {action}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Zone de réponse */}
          <div className="border-t pt-6">
            <h4 className="font-medium mb-3">Répondre</h4>
            <Textarea
              placeholder="Tapez votre réponse..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="mb-3"
              rows={4}
            />
            <div className="flex justify-between items-center">
              <Button variant="outline">
                <Paperclip className="w-4 h-4 mr-2" />
                Joindre un fichier
              </Button>
              <Button>
                <Send className="w-4 h-4 mr-2" />
                Envoyer la réponse
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-blue-600" />
          Messages Administratifs
        </h1>
        <p className="text-gray-600">
          Communications officielles concernant vos dossiers
        </p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {messages.filter(m => m.statut === 'non_lu').length}
            </div>
            <div className="text-sm text-gray-600">Non lus</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {messages.filter(m => m.expediteur.type === 'officiel').length}
            </div>
            <div className="text-sm text-gray-600">Officiels</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {messages.filter(m => m.expediteur.type === 'promoteur').length}
            </div>
            <div className="text-sm text-gray-600">Promoteurs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {messages.filter(m => m.echeance).length}
            </div>
            <div className="text-sm text-gray-600">Avec échéance</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 flex gap-6">
        {/* Liste des messages */}
        <div className="w-1/2 flex flex-col">
          <div className="mb-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher dans les messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="recus">Tous</TabsTrigger>
                <TabsTrigger value="non_lus">Non lus</TabsTrigger>
                <TabsTrigger value="officiels">Officiels</TabsTrigger>
                <TabsTrigger value="promoteurs">Promoteurs</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {filteredMessages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                isSelected={selectedMessage?.id === message.id}
                onClick={setSelectedMessage}
              />
            ))}
          </div>
        </div>

        {/* Détail du message */}
        <div className="w-1/2">
          {selectedMessage ? (
            <MessageDetail message={selectedMessage} />
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Sélectionnez un message
                </h3>
                <p className="text-gray-600">
                  Cliquez sur un message pour afficher son contenu complet
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticulierMessages;