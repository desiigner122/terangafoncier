import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/hooks/useUser';
import { 
  Map, 
  Compass, 
  FileText, 
  Users, 
  Calculator, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Ruler,
  Navigation
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * Dashboard spécialisé pour les Géomètres
 * Gestion des missions de bornage, levés topographiques, calculs de superficie
 */
const GeometreDashboard = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');

  // Données simulées pour les géomètres
  const stats = {
    missionsEnCours: 18,
    missionsCompletes: 143,
    clientsActifs: 67,
    revenusMonth: '1,850,000',
    bornagesEnAttente: 8
  };

  const missionsEnCours = [
    {
      id: 1,
      type: 'Bornage terrain',
      client: 'Seydou Diallo',
      localisation: 'Almadies, Dakar',
      superficie: '2,500 m²',
      statut: 'En cours',
      dateDebut: '2024-01-12',
      priorite: 'haute',
      avancement: 65
    },
    {
      id: 2,
      type: 'Levé topographique',
      client: 'Société BATIMMO',
      localisation: 'Rufisque',
      superficie: '15,000 m²',
      statut: 'Planification',
      dateDebut: '2024-01-15',
      priorite: 'moyenne',
      avancement: 25
    },
    {
      id: 3,
      type: 'Division parcellaire',
      client: 'Aminata Niang',
      localisation: 'Saly, Mbour',
      superficie: '8,000 m²',
      statut: 'Calculs',
      dateDebut: '2024-01-08',
      priorite: 'haute',
      avancement: 80
    }
  ];

  const demandeBornage = [
    {
      id: 1,
      client: 'Mamadou Ba',
      localisation: 'Golf Sud, Guédiawaye',
      superficie: '450 m²',
      urgence: 'Normal',
      dateReception: '2024-01-16',
      contactClient: '+221 77 123 45 67'
    },
    {
      id: 2,
      client: 'Fatou Sow',
      localisation: 'Parcelles Assainies',
      superficie: '300 m²',
      urgence: 'Urgent',
      dateReception: '2024-01-15',
      contactClient: '+221 76 987 65 43'
    }
  ];

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Planification': return 'bg-yellow-100 text-yellow-800';
      case 'Calculs': return 'bg-purple-100 text-purple-800';
      case 'Terminé': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioriteColor = (priorite) => {
    switch (priorite) {
      case 'haute': return 'bg-red-100 text-red-800';
      case 'moyenne': return 'bg-yellow-100 text-yellow-800';
      case 'basse': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgenceColor = (urgence) => {
    switch (urgence) {
      case 'Urgent': return 'bg-red-100 text-red-800';
      case 'Normal': return 'bg-blue-100 text-blue-800';
      case 'Différé': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Géomètre</h1>
          <p className="text-gray-600 mt-2">Gestion des missions topographiques et bornages</p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Map className="w-4 h-4 mr-2" />
            Nouvelle Mission
          </Button>
          <Button variant="outline">
            <Calculator className="w-4 h-4 mr-2" />
            Calculateur
          </Button>
        </div>
      </motion.div>

      {/* Statistiques principales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Missions en cours</p>
                <p className="text-2xl font-bold text-gray-900">{stats.missionsEnCours}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Missions complètes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.missionsCompletes}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clients actifs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.clientsActifs}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus du mois</p>
                <p className="text-2xl font-bold text-gray-900">{stats.revenusMonth} XOF</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bornages en attente</p>
                <p className="text-2xl font-bold text-gray-900">{stats.bornagesEnAttente}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Compass className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="missions">Missions en cours</TabsTrigger>
          <TabsTrigger value="demandes">Nouvelles demandes</TabsTrigger>
          <TabsTrigger value="outils">Outils & Calculs</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Missions prioritaires */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="w-5 h-5" />
                  Missions prioritaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {missionsEnCours.filter(m => m.priorite === 'haute').map((mission) => (
                    <div key={mission.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{mission.type}</h4>
                        <Badge className={getPrioriteColor(mission.priorite)}>
                          {mission.priorite}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Client: {mission.client}
                      </p>
                      <p className="text-sm text-gray-500">
                        📍 {mission.localisation} | {mission.superficie}
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-emerald-600 h-2 rounded-full"
                              style={{ width: `${mission.avancement}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{mission.avancement}%</span>
                        </div>
                        <Badge className={getStatutColor(mission.statut)}>
                          {mission.statut}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Demandes urgentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="w-5 h-5" />
                  Demandes de bornage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demandeBornage.map((demande) => (
                    <div key={demande.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{demande.client}</h4>
                        <Badge className={getUrgenceColor(demande.urgence)}>
                          {demande.urgence}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        📍 {demande.localisation}
                      </p>
                      <p className="text-sm text-gray-500">
                        Superficie: {demande.superficie}
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-gray-400">
                          Reçu le {demande.dateReception}
                        </span>
                        <Button size="sm" variant="outline">
                          Planifier
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Missions en cours */}
        <TabsContent value="missions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les missions en cours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {missionsEnCours.map((mission) => (
                  <div key={mission.id} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{mission.type}</h3>
                        <p className="text-gray-600">Client: {mission.client}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          {mission.localisation} | {mission.superficie}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPrioriteColor(mission.priorite)}>
                          {mission.priorite}
                        </Badge>
                        <Badge className={getStatutColor(mission.statut)}>
                          {mission.statut}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Avancement</span>
                        <span className="text-sm font-medium">{mission.avancement}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-600 h-2 rounded-full transition-all"
                          style={{ width: `${mission.avancement}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Début: {mission.dateDebut}
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Map className="w-4 h-4 mr-1" />
                          Voir carte
                        </Button>
                        <Button size="sm">
                          <Navigation className="w-4 h-4 mr-1" />
                          Continuer
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nouvelles demandes */}
        <TabsContent value="demandes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Demandes de bornage et levés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demandeBornage.map((demande) => (
                  <div key={demande.id} className="p-6 border rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{demande.client}</h3>
                        <p className="text-gray-600 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {demande.localisation}
                        </p>
                        <p className="text-sm text-gray-500">
                          Superficie: {demande.superficie}
                        </p>
                      </div>
                      <Badge className={getUrgenceColor(demande.urgence)}>
                        {demande.urgence}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">
                          Reçu le {demande.dateReception}
                        </p>
                        <p className="text-sm text-gray-500">
                          Contact: {demande.contactClient}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Contacter
                        </Button>
                        <Button size="sm">
                          Accepter mission
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Outils et calculs */}
        <TabsContent value="outils" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Calculator className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Calculateur de superficie</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Calcul automatique des superficies à partir des coordonnées
                </p>
                <Button>Accéder</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Ruler className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Outils de mesure</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Outils de mesure et conversion d'unités
                </p>
                <Button variant="outline">Accéder</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Map className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Cartographie</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Outils de cartographie et géolocalisation
                </p>
                <Button variant="outline">Accéder</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GeometreDashboard;
