import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import ModernDashboardLayout from '@/components/dashboard/ModernDashboardLayout';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  Phone,
  Plus,
  Target,
  TrendingUp,
  User,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Edit,
  Trash2,
  FileText,
  Upload,
  Download,
  PhoneCall,
  Mail,
  Star,
  Heart,
  Search,
  Filter,
  MoreVertical,
  Save,
  X,
  Send,
  History
} from 'lucide-react';
import ContextualAIAssistant from '@/components/dashboard/ContextualAIAssistant';
import { useNotifications } from '@/contexts/NotificationContext';

const PrivateInterests = () => {
  const { addNotification } = useNotifications();
  const [interests, setInterests] = useState([]);
  const [negotiations, setNegotiations] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState('interests');
  const [editingInterest, setEditingInterest] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Simuler des données
  useEffect(() => {
    // Intérêts exprimés
    setInterests([
      {
        id: 1,
        propertyId: 'PRIV001',
        title: 'Villa moderne - Almadies',
        location: 'Almadies, Dakar',
        price: '250,000,000 FCFA',
        status: 'En attente',
        dateExpressed: '2024-01-10',
        owner: 'M. Diallo',
        ownerPhone: '+221 77 123 45 67',
        surface: '350 m²',
        type: 'Villa',
        description: 'Belle villa moderne avec piscine et jardin',
        priority: 'haute',
        lastContact: '2024-01-15',
        responseReceived: false,
        isFavorite: true,
        lastActions: [
          { date: '2024-01-15', description: 'Contact téléphonique' },
          { date: '2024-01-12', description: 'Envoi message WhatsApp' },
          { date: '2024-01-10', description: 'Intérêt exprimé' }
        ]
      },
      {
        id: 2,
        propertyId: 'PRIV002',
        title: 'Terrain résidentiel - Keur Massar',
        location: 'Keur Massar, Dakar',
        price: '45,000,000 FCFA',
        status: 'Intérêt confirmé',
        dateExpressed: '2024-01-08',
        owner: 'Mme Fall',
        ownerPhone: '+221 76 987 65 43',
        surface: '500 m²',
        type: 'Terrain',
        description: 'Terrain bien situé pour construction résidentielle',
        priority: 'moyenne',
        lastContact: '2024-01-12',
        responseReceived: true,
        isFavorite: false,
        lastActions: [
          { date: '2024-01-12', description: 'Réponse positive reçue' },
          { date: '2024-01-08', description: 'Intérêt exprimé' }
        ]
      },
      {
        id: 3,
        propertyId: 'PRIV003',
        title: 'Appartement - Mermoz',
        location: 'Mermoz, Dakar',
        price: '120,000,000 FCFA',
        status: 'En négociation',
        dateExpressed: '2024-01-05',
        owner: 'M. Ba',
        ownerPhone: '+221 75 555 66 77',
        surface: '90 m²',
        type: 'Appartement',
        description: 'Appartement 3 pièces bien situé',
        priority: 'haute',
        lastContact: '2024-01-14',
        responseReceived: true,
        isFavorite: true,
        negotiationProgress: 65,
        lastActions: [
          { date: '2024-01-14', description: 'Contre-proposition envoyée' },
          { date: '2024-01-10', description: 'Négociation démarrée' },
          { date: '2024-01-05', description: 'Intérêt exprimé' }
        ]
      }
    ]);

    // Négociations en cours
    setNegotiations([
      {
        id: 1,
        propertyId: 'PRIV003',
        title: 'Appartement - Plateau',
        location: 'Plateau, Dakar',
        initialPrice: '180,000,000 FCFA',
        currentOffer: '165,000,000 FCFA',
        status: 'En négociation',
        startDate: '2024-01-05',
        owner: 'M. Ndiaye',
        ownerPhone: '+221 78 456 78 90',
        surface: '120 m²',
        type: 'Appartement',
        negotiationPhase: 'Contre-proposition',
        lastUpdate: '2024-01-14',
        progress: 75
      }
    ]);
  }, []);

  const handleAddInterest = (interestData) => {
    const newInterest = {
      id: interests.length + 1,
      ...interestData,
      dateExpressed: new Date().toISOString().split('T')[0],
      status: 'En attente',
      responseReceived: false
    };
    setInterests([...interests, newInterest]);
    setShowAddForm(false);
    addNotification({
      type: 'success',
      title: 'Intérêt ajouté',
      message: `Votre intérêt pour ${interestData.title} a été enregistré.`
    });
  };

  // 🔥 NOUVELLES ACTIONS AJOUTÉES
  const handleEditInterest = (interest) => {
    setEditingInterest(interest);
  };

  const handleUpdateInterest = (updatedData) => {
    setInterests(interests.map(interest => 
      interest.id === editingInterest.id 
        ? { ...interest, ...updatedData }
        : interest
    ));
    setEditingInterest(null);
    addNotification({
      type: 'success',
      title: 'Intérêt modifié',
      message: `Les modifications ont été sauvegardées.`
    });
  };

  const handleDeleteInterest = (interest) => {
    setSelectedInterest(interest);
    setShowDeleteModal(true);
  };

  const handleStartNegotiation = (interest) => {
    setSelectedInterest(interest);
    setShowNegotiationModal(true);
  };

  const actualDeleteInterest = (interest) => {
    setInterests(interests.filter(i => i.id !== interest.id));
    addNotification({
      type: 'success',
      title: 'Intérêt supprimé',
      message: `L'intérêt "${interest.title}" a été retiré de votre liste.`
    });
  };

  const handleSendOfferConfirm = (interestId, offerData) => {
    // Convertir l'intérêt en négociation
    const interest = interests.find(i => i.id === interestId);
    const newNegotiation = {
      id: negotiations.length + 1,
      propertyId: interest.propertyId,
      title: interest.title,
      location: interest.location,
      initialPrice: interest.price,
      currentOffer: offerData.amount,
      status: 'En négociation',
      startDate: new Date().toISOString().split('T')[0],
      owner: interest.owner,
      ownerPhone: interest.ownerPhone,
      surface: interest.surface,
      type: interest.type,
      negotiationPhase: 'Offre envoyée',
      lastUpdate: new Date().toISOString().split('T')[0],
      progress: 25,
      message: offerData.message
    };
    
    setNegotiations([...negotiations, newNegotiation]);
    setInterests(interests.map(i => 
      i.id === interestId 
        ? { ...i, status: 'En négociation' }
        : i
    ));
    setShowNegotiationModal(null);
    addNotification({
      type: 'success',
      title: 'Offre envoyée',
      message: `Votre offre de ${offerData.amount} a été transmise au propriétaire.`
    });
  };

  const handleUploadDocumentConfirm = (interestId, files) => {
    addNotification({
      type: 'success',
      title: 'Documents uploadés',
      message: `${files.length} document(s) ajouté(s) au dossier.`
    });
    setShowUploadModal(false);
  };

  const handleContactOwnerConfirm = (interest, method) => {
    if (method === 'phone') {
      window.open(`tel:${interest.ownerPhone}`);
    } else if (method === 'email') {
      window.open(`mailto:palaye122@gmail.com?subject=Intérêt pour ${interest.title}`);
    }
    addNotification({
      type: 'info',
      title: 'Contact initié',
      message: `Contact avec ${interest.owner} via ${method === 'phone' ? 'téléphone' : 'email'}.`
    });
  };

  const handleToggleFavorite = (interestId) => {
    setInterests(interests.map(interest => 
      interest.id === interestId 
        ? { ...interest, isFavorite: !interest.isFavorite }
        : interest
    ));
  };

  // Fonctions pour ouvrir les modales
  const handleContactOwner = (interest) => {
    setSelectedInterest(interest);
    setShowContactModal(true);
  };

  const handleUploadDocument = (interest) => {
    setSelectedInterest(interest);
    setShowUploadModal(true);
  };

  const handleSendOffer = (interest) => {
    setSelectedInterest(interest);
    setShowNegotiationModal(true);
  };

  // Filtres et recherche
  const filteredInterests = interests.filter(interest => {
    const matchesSearch = interest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          interest.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || interest.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || interest.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'En attente': return 'bg-yellow-500';
      case 'Intérêt confirmé': return 'bg-green-500';
      case 'En négociation': return 'bg-blue-500';
      case 'Refusé': return 'bg-red-500';
      case 'Finalisé': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'haute': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'moyenne': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'basse': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const AddInterestForm = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Exprimer un nouvel intérêt
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Titre du bien</label>
            <Input placeholder="Ex: Villa moderne - Almadies" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Localisation</label>
            <Input placeholder="Ex: Almadies, Dakar" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Prix demandé</label>
            <Input placeholder="Ex: 250,000,000 FCFA" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Surface</label>
            <Input placeholder="Ex: 350 m²" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Type de bien</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="appartement">Appartement</SelectItem>
                <SelectItem value="terrain">Terrain</SelectItem>
                <SelectItem value="immeuble">Immeuble</SelectItem>
                <SelectItem value="local">Local commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Priorité</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Niveau de priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="haute">Haute</SelectItem>
                <SelectItem value="moyenne">Moyenne</SelectItem>
                <SelectItem value="basse">Basse</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Nom du propriétaire</label>
            <Input placeholder="Ex: M. Diallo" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Téléphone</label>
            <Input placeholder="Ex: +221 77 123 45 67" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea placeholder="Décrivez le bien et votre intérêt..." rows={3} />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleAddInterest({})}>
            Enregistrer l'intérêt
          </Button>
          <Button variant="outline" onClick={() => setShowAddForm(false)}>
            Annuler
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const InterestCard = ({ interest }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{interest.title}</CardTitle>
            <p className="text-gray-600 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {interest.location}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getPriorityIcon(interest.priority)}
            <Badge className={`${getStatusColor(interest.status)} text-white`}>
              {interest.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Prix</p>
              <p className="font-medium">{interest.price}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-medium">{interest.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Surface</p>
              <p className="font-medium">{interest.surface}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Exprimé le</p>
              <p className="font-medium">{interest.dateExpressed}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-600" />
            <span>{interest.owner}</span>
            <Phone className="w-4 h-4 text-gray-600 ml-4" />
            <span>{interest.ownerPhone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            Dernier contact: {interest.lastContact}
          </div>
        </div>

        <p className="text-gray-700 mb-4">{interest.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {/* Actions principales */}
          <Button 
            size="sm" 
            onClick={() => handleContactOwner(interest)}
            className="flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            Contacter
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => handleStartNegotiation(interest)}
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Négocier
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => handleSendOffer(interest)}
            className="flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Faire une offre
          </Button>
          
          {/* Actions secondaires */}
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => handleEditInterest(interest)}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Modifier
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => handleToggleFavorite(interest)}
            className="flex items-center gap-2"
          >
            {interest.isFavorite ? (
              <Heart className="w-4 h-4 fill-current text-red-500" />
            ) : (
              <Heart className="w-4 h-4" />
            )}
            {interest.isFavorite ? 'Retirer favoris' : 'Ajouter favoris'}
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => handleUploadDocument(interest)}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Documents
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => handleDeleteInterest(interest)}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </Button>
        </div>

        {/* Barre de progression si négociation en cours */}
        {interest.status === 'En négociation' && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progression de la négociation</span>
              <span>{interest.negotiationProgress || 25}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${interest.negotiationProgress || 25}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Dernières actions */}
        {interest.lastActions && interest.lastActions.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Dernières actions:</h4>
            <div className="space-y-1">
              {interest.lastActions.slice(0, 3).map((action, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{action.date}</span>
                  <span>-</span>
                  <span>{action.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const NegotiationCard = ({ negotiation }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{negotiation.title}</CardTitle>
            <p className="text-gray-600 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {negotiation.location}
            </p>
          </div>
          <Badge className={`${getStatusColor(negotiation.status)} text-white`}>
            {negotiation.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progression de la négociation</span>
            <span className="text-sm text-gray-600">{negotiation.progress}%</span>
          </div>
          <Progress value={negotiation.progress} className="mb-2" />
          <p className="text-sm text-gray-600">Phase: {negotiation.negotiationPhase}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-600">Prix initial</p>
            <p className="font-bold text-lg">{negotiation.initialPrice}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-sm text-gray-600">Offre actuelle</p>
            <p className="font-bold text-lg text-blue-600">{negotiation.currentOffer}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Surface</p>
              <p className="font-medium">{negotiation.surface}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Début négociation</p>
              <p className="font-medium">{negotiation.startDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Dernière mise à jour</p>
              <p className="font-medium">{negotiation.lastUpdate}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-600" />
            <span>{negotiation.owner}</span>
            <Phone className="w-4 h-4 text-gray-600 ml-4" />
            <span>{negotiation.ownerPhone}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Nouvelle offre
          </Button>
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Appeler
          </Button>
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <ModernDashboardLayout>
      <div className="space-y-6">
        {/* Header de la page */}
        <div className="bg-white rounded-lg border p-6">
          <h1 className="text-2xl font-bold text-gray-900">Intérêts Privés</h1>
          <p className="text-gray-600 mt-1">Suivi de vos négociations et intérêts privés</p>
        </div>

      <div className="space-y-6">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Intérêts exprimés</p>
                  <p className="text-2xl font-bold">{interests.length}</p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En négociation</p>
                  <p className="text-2xl font-bold">{negotiations.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Réponses reçues</p>
                  <p className="text-2xl font-bold">
                    {interests.filter(i => i.responseReceived).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En attente</p>
                  <p className="text-2xl font-bold">
                    {interests.filter(i => i.status === 'En attente').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bouton d'ajout */}
        {!showAddForm && (
          <div className="flex justify-end">
            <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Exprimer un intérêt
            </Button>
          </div>
        )}

        {/* Formulaire d'ajout */}
        {showAddForm && <AddInterestForm />}

        {/* Barre d'outils et filtres */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Filtres et recherche */}
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher un bien..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="En attente">En attente</SelectItem>
                    <SelectItem value="Intérêt confirmé">Confirmé</SelectItem>
                    <SelectItem value="En négociation">En négociation</SelectItem>
                    <SelectItem value="Refusé">Refusé</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes priorités</SelectItem>
                    <SelectItem value="haute">Haute</SelectItem>
                    <SelectItem value="moyenne">Moyenne</SelectItem>
                    <SelectItem value="basse">Basse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Actions rapides */}
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvel Intérêt
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Onglets */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="interests" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Intérêts exprimés ({interests.length})
            </TabsTrigger>
            <TabsTrigger value="negotiations" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Négociations ({negotiations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="interests" className="mt-6">
            <div className="space-y-4">
              {interests.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      Aucun intérêt exprimé
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Commencez par exprimer votre intérêt pour des biens privés.
                    </p>
                    <Button onClick={() => setShowAddForm(true)}>
                      Exprimer un intérêt
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                interests.map(interest => (
                  <InterestCard key={interest.id} interest={interest} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="negotiations" className="mt-6">
            <div className="space-y-4">
              {negotiations.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      Aucune négociation en cours
                    </h3>
                    <p className="text-gray-500">
                      Les négociations démarreront une fois que vous aurez reçu des réponses positives à vos intérêts.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                negotiations.map(negotiation => (
                  <NegotiationCard key={negotiation.id} negotiation={negotiation} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Assistant IA contextuel */}
      <ContextualAIAssistant />

      {/* Modales pour les actions CRUD */}
      
      {/* Modal d'édition d'intérêt */}
      {editingInterest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Modifier l'intérêt</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateInterest(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <input
                    type="text"
                    value={editingInterest.title}
                    onChange={(e) => setEditingInterest({...editingInterest, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Localisation</label>
                  <input
                    type="text"
                    value={editingInterest.location}
                    onChange={(e) => setEditingInterest({...editingInterest, location: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Budget maximum</label>
                  <input
                    type="text"
                    value={editingInterest.price}
                    onChange={(e) => setEditingInterest({...editingInterest, price: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Type de bien</label>
                  <select
                    value={editingInterest.type}
                    onChange={(e) => setEditingInterest({...editingInterest, type: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    <option value="Terrain résidentiel">Terrain résidentiel</option>
                    <option value="Terrain commercial">Terrain commercial</option>
                    <option value="Terrain agricole">Terrain agricole</option>
                    <option value="Terrain industriel">Terrain industriel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Surface souhaitée</label>
                  <input
                    type="text"
                    value={editingInterest.surface}
                    onChange={(e) => setEditingInterest({...editingInterest, surface: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Priorité</label>
                  <select
                    value={editingInterest.priority}
                    onChange={(e) => setEditingInterest({...editingInterest, priority: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="haute">Haute</option>
                    <option value="moyenne">Moyenne</option>
                    <option value="basse">Basse</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Description détaillée</label>
                <textarea
                  value={editingInterest.description}
                  onChange={(e) => setEditingInterest({...editingInterest, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
                  rows="3"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditingInterest(null)}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  Mettre à jour
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer cet intérêt ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </Button>
              <Button 
                variant="destructive"
                onClick={() => {
                  actualDeleteInterest(selectedInterest);
                  setShowDeleteModal(false);
                  setSelectedInterest(null);
                }}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de négociation */}
      {showNegotiationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Démarrer une négociation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Montant proposé</label>
                <input
                  type="text"
                  placeholder="Ex: 15,000,000 FCFA"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Conditions spéciales</label>
                <textarea
                  placeholder="Décrivez vos conditions (délai de paiement, modalités, etc.)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Échéance souhaitée</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowNegotiationModal(false)}
              >
                Annuler
              </Button>
              <Button onClick={() => {
                // Ici, vous ajouteriez la logique pour soumettre la négociation
                showNotification('Demande de négociation envoyée avec succès', 'success');
                setShowNegotiationModal(false);
              }}>
                Envoyer la proposition
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'upload de documents */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Télécharger des documents</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type de document</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="">Sélectionner le type</option>
                  <option value="identite">Pièce d'identité</option>
                  <option value="revenus">Justificatif de revenus</option>
                  <option value="banque">Relevé bancaire</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Fichier</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Glissez un fichier ici ou cliquez pour sélectionner</p>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (optionnel)</label>
                <textarea
                  placeholder="Décrivez le document"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
                  rows="2"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowUploadModal(false)}
              >
                Annuler
              </Button>
              <Button onClick={() => {
                showNotification('Document téléchargé avec succès', 'success');
                setShowUploadModal(false);
              }}>
                Télécharger
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de contact propriétaire */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Contacter le propriétaire</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <User className="w-8 h-8 text-gray-600" />
                <div>
                  <p className="font-medium">{selectedInterest?.owner}</p>
                  <p className="text-sm text-gray-600">{selectedInterest?.ownerPhone}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mode de contact</label>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 justify-center"
                    onClick={() => {
                      window.location.href = `tel:${selectedInterest?.ownerPhone}`;
                      setShowContactModal(false);
                    }}
                  >
                    <PhoneCall className="w-4 h-4" />
                    Appel direct
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 justify-center"
                    onClick={() => {
                      window.location.href = `sms:${selectedInterest?.ownerPhone}`;
                      setShowContactModal(false);
                    }}
                  >
                    <MessageSquare className="w-4 h-4" />
                    SMS
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message personnalisé</label>
                <textarea
                  placeholder="Bonjour, je suis intéressé par votre terrain..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
                  rows="3"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowContactModal(false)}
              >
                Fermer
              </Button>
              <Button onClick={() => {
                addNotification({
                  type: 'success',
                  title: 'Message envoyé',
                  message: 'Votre message a été envoyé au propriétaire'
                });
                setShowContactModal(false);
              }}>
                Envoyer le message
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </ModernDashboardLayout>
  );
};

export default PrivateInterests;