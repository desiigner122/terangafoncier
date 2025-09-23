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
  XCircle
} from 'lucide-react';
import ContextualAIAssistant from '@/components/dashboard/ContextualAIAssistant';
import { useNotifications } from '@/contexts/NotificationContext';

const PrivateInterests = () => {
  const { addNotification } = useNotifications();
  const [interests, setInterests] = useState([]);
  const [negotiations, setNegotiations] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState('interests');

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
        responseReceived: false
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
        responseReceived: true
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

        <div className="flex gap-2">
          <Button size="sm" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Appeler
          </Button>
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Message
          </Button>
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Voir détails
          </Button>
        </div>
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
    </div>
    </ModernDashboardLayout>
  );
};

export default PrivateInterests;