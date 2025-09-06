import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/hooks/useUser';
import { 
  FileText, 
  Users, 
  Building, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Calendar,
  Search,
  Coins
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * Dashboard spécialisé pour les Agents Fonciers
 * Gestion des clients, négociations, commissions, suivi des ventes
 */
const AgentFoncierDashboard = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');

  // Données simulées pour les agents fonciers
  const stats = {
    clientsActifs: 34,
    ventesEnCours: 12,
    ventesCompletes: 87,
    commissionsMonth: '3,250,000',
    rdvPlanifies: 8
  };

  const ventesEnCours = [
    {
      id: 1,
      propriete: 'Villa 4 pièces Almadies',
      client: 'Awa Diop',
      proprietaire: 'Moussa Ndiaye',
      prixDemande: '85,000,000',
      offre: '78,000,000',
      statut: 'Négociation',
      commission: '2,550,000',
      dateDebut: '2024-01-10',
      priorite: 'haute'
    },
    {
      id: 2,
      propriete: 'Terrain 500m² Rufisque',
      client: 'Mamadou Fall',
      proprietaire: 'Aïssatou Ba',
      prixDemande: '25,000,000',
      offre: '22,000,000',
      statut: 'Visite planifiée',
      commission: '750,000',
      dateDebut: '2024-01-14',
      priorite: 'moyenne'
    },
    {
      id: 3,
      propriete: 'Appartement 3 pièces Mermoz',
      client: 'Fatou Seck',
      proprietaire: 'Ibrahima Sarr',
      prixDemande: '45,000,000',
      offre: '42,000,000',
      statut: 'Contre-offre',
      commission: '1,350,000',
      dateDebut: '2024-01-08',
      priorite: 'haute'
    }
  ];

  const prochainRdv = [
    {
      id: 1,
      client: 'Ousmane Diallo',
      propriete: 'Villa Cité Keur Gorgui',
      type: 'Visite terrain',
      heure: '09:00',
      date: '2024-01-17',
      contact: '+221 77 456 78 90'
    },
    {
      id: 2,
      client: 'Mariama Cissé',
      propriete: 'Terrain Yoff',
      type: 'Signature contrat',
      heure: '14:30',
      date: '2024-01-17',
      contact: '+221 76 123 45 67'
    },
    {
      id: 3,
      client: 'Baba Ndiaye',
      propriete: 'Appartement Point E',
      type: 'Négociation',
      heure: '11:00',
      date: '2024-01-18',
      contact: '+221 78 987 65 43'
    }
  ];

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Négociation': return 'bg-blue-100 text-blue-800';
      case 'Visite planifiée': return 'bg-yellow-100 text-yellow-800';
      case 'Contre-offre': return 'bg-purple-100 text-purple-800';
      case 'Finalisation': return 'bg-green-100 text-green-800';
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

  const getTypeRdvColor = (type) => {
    switch (type) {
      case 'Visite terrain': return 'bg-blue-100 text-blue-800';
      case 'Signature contrat': return 'bg-green-100 text-green-800';
      case 'Négociation': return 'bg-orange-100 text-orange-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Agent Foncier</h1>
          <p className="text-gray-600 mt-2">Gestion de votre portefeuille clients et négociations</p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Users className="w-4 h-4 mr-2" />
            Nouveau Client
          </Button>
          <Button variant="outline">
            <Search className="w-4 h-4 mr-2" />
            Rechercher Propriété
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
                <p className="text-sm font-medium text-gray-600">Clients actifs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.clientsActifs}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ventes en cours</p>
                <p className="text-2xl font-bold text-gray-900">{stats.ventesEnCours}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ventes complètes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.ventesCompletes}</p>
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
                <p className="text-sm font-medium text-gray-600">Commissions du mois</p>
                <p className="text-2xl font-bold text-gray-900">{stats.commissionsMonth} XOF</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <Coins className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">RDV planifiés</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rdvPlanifies}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="ventes">Ventes en cours</TabsTrigger>
          <TabsTrigger value="agenda">Mon Agenda</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ventes prioritaires */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Ventes prioritaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ventesEnCours.filter(v => v.priorite === 'haute').map((vente) => (
                    <div key={vente.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{vente.propriete}</h4>
                        <Badge className={getPrioriteColor(vente.priorite)}>
                          {vente.priorite}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Client: {vente.client}
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        <div className="text-sm">
                          <span className="text-gray-500">Offre:</span>
                          <span className="font-medium text-emerald-600 ml-1">
                            {parseInt(vente.offre).toLocaleString()} XOF
                          </span>
                        </div>
                        <Badge className={getStatutColor(vente.statut)}>
                          {vente.statut}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Commission: {parseInt(vente.commission).toLocaleString()} XOF
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Prochains rendez-vous */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Prochains rendez-vous
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prochainRdv.map((rdv) => (
                    <div key={rdv.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{rdv.client}</h4>
                        <Badge className={getTypeRdvColor(rdv.type)}>
                          {rdv.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{rdv.propriete}</p>
                      <div className="flex justify-between items-center mt-3">
                        <div className="text-sm text-gray-500">
                          📅 {rdv.date} à {rdv.heure}
                        </div>
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4 mr-1" />
                          Appeler
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Ventes en cours */}
        <TabsContent value="ventes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les ventes en cours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ventesEnCours.map((vente) => (
                  <div key={vente.id} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{vente.propriete}</h3>
                        <p className="text-gray-600">
                          Client: {vente.client} | Propriétaire: {vente.proprietaire}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPrioriteColor(vente.priorite)}>
                          {vente.priorite}
                        </Badge>
                        <Badge className={getStatutColor(vente.statut)}>
                          {vente.statut}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-500">Prix demandé:</span>
                        <div className="font-medium text-gray-900">
                          {parseInt(vente.prixDemande).toLocaleString()} XOF
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Offre actuelle:</span>
                        <div className="font-medium text-emerald-600">
                          {parseInt(vente.offre).toLocaleString()} XOF
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Commission prévue:</span>
                        <div className="font-medium text-purple-600">
                          {parseInt(vente.commission).toLocaleString()} XOF
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Début négociation:</span>
                        <div className="font-medium">{vente.dateDebut}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Écart: {((parseInt(vente.prixDemande) - parseInt(vente.offre)) / parseInt(vente.prixDemande) * 100).toFixed(1)}%
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Contacter client
                        </Button>
                        <Button size="sm">
                          Négocier
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mon Agenda */}
        <TabsContent value="agenda" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Planning des rendez-vous</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prochainRdv.map((rdv) => (
                  <div key={rdv.id} className="p-6 border rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          {rdv.client}
                        </h3>
                        <p className="text-gray-600">{rdv.propriete}</p>
                      </div>
                      <Badge className={getTypeRdvColor(rdv.type)}>
                        {rdv.type}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Date & Heure:</span>
                        <div className="font-medium">{rdv.date} à {rdv.heure}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Contact:</span>
                        <div className="font-medium">{rdv.contact}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4 mr-1" />
                          Appeler
                        </Button>
                        <Button size="sm">
                          Modifier
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commissions */}
        <TabsContent value="commissions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Ce mois</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  {stats.commissionsMonth} XOF
                </div>
                <p className="text-sm text-gray-600">Commissions gagnées</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">En attente</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  4,650,000 XOF
                </div>
                <p className="text-sm text-gray-600">Commissions en cours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Objectif mensuel</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  5,000,000 XOF
                </div>
                <p className="text-sm text-gray-600">65% atteint</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentFoncierDashboard;
