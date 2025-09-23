import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  Phone,
  User,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Wrench,
  TrendingUp,
  Home
} from 'lucide-react';
import ContextualAIAssistant from '@/components/dashboard/ContextualAIAssistant';
import { useNotifications } from '@/contexts/NotificationContext';

const PromoterReservations = () => {
  const { addNotification } = useNotifications();
  const [reservations, setReservations] = useState([]);
  const [constructions, setConstructions] = useState([]);
  const [selectedTab, setSelectedTab] = useState('reservations');

  useEffect(() => {
    // Réservations VEFA
    setReservations([
      {
        id: 1,
        projectId: 'VEFA001',
        title: 'Résidence Les Cocotiers',
        developer: 'PROMOGIM',
        location: 'Almadies, Dakar',
        apartmentType: 'F3',
        surface: '85 m²',
        price: '75,000,000 FCFA',
        status: 'Réservé',
        reservationDate: '2023-12-15',
        deliveryDate: '2024-06-30',
        progress: 65,
        contact: '+221 33 123 45 67',
        description: 'Appartement F3 avec vue sur mer, résidence haut standing',
        paymentPlan: 'Échelonné sur 12 mois',
        documentsReceived: true
      },
      {
        id: 2,
        projectId: 'VEFA002',
        title: 'Les Jardins de Fann',
        developer: 'SCAT URBAM',
        location: 'Fann Résidence, Dakar',
        apartmentType: 'F4',
        surface: '120 m²',
        price: '95,000,000 FCFA',
        status: 'En construction',
        reservationDate: '2024-01-10',
        deliveryDate: '2024-08-15',
        progress: 40,
        contact: '+221 33 987 65 43',
        description: 'Appartement F4 dans résidence sécurisée avec espaces verts',
        paymentPlan: 'Paiement progressif',
        documentsReceived: false
      }
    ]);

    // Constructions en cours
    setConstructions([
      {
        id: 1,
        projectId: 'CONST001',
        title: 'Villa individuelle - Keur Massar',
        location: 'Keur Massar Extension, Dakar',
        type: 'Villa R+1',
        surface: '250 m²',
        totalCost: '65,000,000 FCFA',
        status: 'Gros œuvre',
        startDate: '2023-11-01',
        estimatedCompletion: '2024-04-30',
        progress: 55,
        contractor: 'BTP Services SARL',
        architect: 'Cabinet ARCHI+',
        contact: '+221 77 234 56 78',
        currentPhase: 'Élévation des murs',
        nextMilestone: 'Charpente - 15 Mars',
        lastInspection: '2024-01-10'
      }
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Réservé': return 'bg-blue-500';
      case 'En construction': return 'bg-orange-500';
      case 'Livré': return 'bg-green-500';
      case 'Gros œuvre': return 'bg-yellow-600';
      case 'Finitions': return 'bg-purple-500';
      case 'Terminé': return 'bg-green-600';
      default: return 'bg-gray-500';
    }
  };

  const ReservationCard = ({ reservation }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{reservation.title}</CardTitle>
            <p className="text-gray-600 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {reservation.location}
            </p>
            <p className="text-blue-600 font-medium mt-1">{reservation.developer}</p>
          </div>
          <Badge className={`${getStatusColor(reservation.status)} text-white`}>
            {reservation.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Avancement du projet</span>
            <span className="text-sm text-gray-600">{reservation.progress}%</span>
          </div>
          <Progress value={reservation.progress} className="mb-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-medium">{reservation.apartmentType}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Surface</p>
              <p className="font-medium">{reservation.surface}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Prix</p>
              <p className="font-medium">{reservation.price}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Livraison prévue</p>
              <p className="font-medium">{reservation.deliveryDate}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-600">Réservé le</p>
            <p className="font-medium">{reservation.reservationDate}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-sm text-gray-600">Plan de paiement</p>
            <p className="font-medium">{reservation.paymentPlan}</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium">Documents</span>
            {reservation.documentsReceived ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-orange-500" />
            )}
          </div>
          <p className="text-sm text-gray-600">
            {reservation.documentsReceived ? 'Tous les documents ont été reçus' : 'Documents en attente'}
          </p>
        </div>

        <p className="text-gray-700 mb-4">{reservation.description}</p>

        <div className="flex gap-2">
          <Button size="sm" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Contacter
          </Button>
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Voir projet
          </Button>
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Documents
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ConstructionCard = ({ construction }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{construction.title}</CardTitle>
            <p className="text-gray-600 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {construction.location}
            </p>
          </div>
          <Badge className={`${getStatusColor(construction.status)} text-white`}>
            {construction.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Avancement des travaux</span>
            <span className="text-sm text-gray-600">{construction.progress}%</span>
          </div>
          <Progress value={construction.progress} className="mb-2" />
          <p className="text-sm text-gray-600">Phase actuelle: {construction.currentPhase}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-medium">{construction.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Surface</p>
              <p className="font-medium">{construction.surface}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Coût total</p>
              <p className="font-medium">{construction.totalCost}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-600">Début des travaux</p>
            <p className="font-medium">{construction.startDate}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-sm text-gray-600">Fin prévue</p>
            <p className="font-medium">{construction.estimatedCompletion}</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-gray-600" />
            <span className="text-sm">Entrepreneur: {construction.contractor}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-600" />
            <span className="text-sm">Architecte: {construction.architect}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-sm">Dernière inspection: {construction.lastInspection}</span>
          </div>
        </div>

        <div className="bg-yellow-50 p-3 rounded mb-4">
          <p className="text-sm font-medium text-yellow-800">Prochaine étape:</p>
          <p className="text-sm text-yellow-700">{construction.nextMilestone}</p>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Contacter entrepreneur
          </Button>
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Voir photos
          </Button>
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Planifier visite
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header de la page */}
      <div className="bg-white rounded-lg border p-6">
        <h1 className="text-2xl font-bold text-gray-900">Projets VEFA</h1>
        <p className="text-gray-600 mt-1">Suivi de vos réservations et constructions neuves</p>
      </div>

      <div className="space-y-6">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Réservations VEFA</p>
                  <p className="text-2xl font-bold">{reservations.length}</p>
                </div>
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Constructions</p>
                  <p className="text-2xl font-bold">{constructions.length}</p>
                </div>
                <Wrench className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avancement moyen</p>
                  <p className="text-2xl font-bold">
                    {Math.round((reservations.reduce((sum, r) => sum + r.progress, 0) + 
                                constructions.reduce((sum, c) => sum + c.progress, 0)) / 
                               (reservations.length + constructions.length))}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Projets livrés</p>
                  <p className="text-2xl font-bold">
                    {[...reservations, ...constructions].filter(p => 
                      p.status === 'Livré' || p.status === 'Terminé'
                    ).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reservations" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Réservations VEFA ({reservations.length})
            </TabsTrigger>
            <TabsTrigger value="constructions" className="flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Constructions ({constructions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reservations" className="mt-6">
            <div className="space-y-4">
              {reservations.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      Aucune réservation VEFA
                    </h3>
                    <p className="text-gray-500">
                      Vous n'avez pas encore de réservation sur plan.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                reservations.map(reservation => (
                  <ReservationCard key={reservation.id} reservation={reservation} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="constructions" className="mt-6">
            <div className="space-y-4">
              {constructions.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      Aucune construction en cours
                    </h3>
                    <p className="text-gray-500">
                      Vous n'avez pas de projet de construction en cours.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                constructions.map(construction => (
                  <ConstructionCard key={construction.id} construction={construction} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Assistant IA contextuel */}
      <ContextualAIAssistant />
    </div>
  );
};

export default PromoterReservations;