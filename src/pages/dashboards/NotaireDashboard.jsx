import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/hooks/useUser';
import { 
  FileText, 
  Users, 
  Calendar, 
  Archive, 
  Shield, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Building,
  Scale,
  FileCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * Dashboard spécialisé pour les Notaires
 * Gestion des actes, authentifications, dossiers clients, archives
 */
const NotaireDashboard = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');

  // Données simulées pour les notaires
  const stats = {
    actesEnCours: 24,
    actesCompletes: 156,
    clientsActifs: 89,
    revenusMonth: '2,450,000',
    authentificationsEnAttente: 12
  };

  const actesPendants = [
    {
      id: 1,
      type: 'Vente Terrain',
      client: 'Amadou Ndiaye',
      vendeur: 'Fatou Seck',
      montant: '45,000,000',
      statut: 'En cours',
      dateCreation: '2024-01-15',
      priorite: 'haute'
    },
    {
      id: 2,
      type: 'Donation',
      client: 'Marie Diop',
      vendeur: 'Jean Baptiste',
      montant: '30,000,000',
      statut: 'Vérification',
      dateCreation: '2024-01-12',
      priorite: 'moyenne'
    },
    {
      id: 3,
      type: 'Hypothèque',
      client: 'Ousmane Fall',
      vendeur: 'Banque Atlantique',
      montant: '75,000,000',
      statut: 'Signature',
      dateCreation: '2024-01-10',
      priorite: 'haute'
    }
  ];

  const authentifications = [
    {
      id: 1,
      document: 'Titre foncier TF 1245/DK',
      demandeur: 'Awa Cissé',
      type: 'Vérification propriété',
      statut: 'En attente',
      dateReception: '2024-01-16'
    },
    {
      id: 2,
      document: 'Acte de vente 2023/156',
      demandeur: 'Ibrahima Sarr',
      type: 'Certification conforme',
      statut: 'En cours',
      dateReception: '2024-01-15'
    }
  ];

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Vérification': return 'bg-yellow-100 text-yellow-800';
      case 'Signature': return 'bg-green-100 text-green-800';
      case 'En attente': return 'bg-orange-100 text-orange-800';
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

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Notaire</h1>
          <p className="text-gray-600 mt-2">Gestion des actes notariés et authentifications</p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4 mr-2" />
            Nouvel Acte
          </Button>
          <Button variant="outline">
            <Archive className="w-4 h-4 mr-2" />
            Archives
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
                <p className="text-sm font-medium text-gray-600">Actes en cours</p>
                <p className="text-2xl font-bold text-gray-900">{stats.actesEnCours}</p>
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
                <p className="text-sm font-medium text-gray-600">Actes complétés</p>
                <p className="text-2xl font-bold text-gray-900">{stats.actesCompletes}</p>
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
                <p className="text-sm font-medium text-gray-600">Authentifications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.authentificationsEnAttente}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="actes">Actes en cours</TabsTrigger>
          <TabsTrigger value="authentifications">Authentifications</TabsTrigger>
          <TabsTrigger value="archives">Archives</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Actes récents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Actes récents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {actesPendants.slice(0, 3).map((acte) => (
                    <div key={acte.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{acte.type}</h4>
                        <Badge className={getPrioriteColor(acte.priorite)}>
                          {acte.priorite}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {acte.client} ↔ {acte.vendeur}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm font-medium text-green-600">
                          {parseInt(acte.montant).toLocaleString()} XOF
                        </span>
                        <Badge className={getStatutColor(acte.statut)}>
                          {acte.statut}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Authentifications en attente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Authentifications en attente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {authentifications.map((auth) => (
                    <div key={auth.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{auth.document}</h4>
                        <Badge className={getStatutColor(auth.statut)}>
                          {auth.statut}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{auth.demandeur}</p>
                      <p className="text-xs text-gray-500 mt-1">{auth.type}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Reçu le {auth.dateReception}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Actes en cours */}
        <TabsContent value="actes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tous les actes en cours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {actesPendants.map((acte) => (
                  <div key={acte.id} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{acte.type}</h3>
                        <p className="text-gray-600">
                          Client: {acte.client} | Vendeur: {acte.vendeur}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPrioriteColor(acte.priorite)}>
                          {acte.priorite}
                        </Badge>
                        <Badge className={getStatutColor(acte.statut)}>
                          {acte.statut}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Montant:</span>
                        <span className="font-medium text-green-600 ml-2">
                          {parseInt(acte.montant).toLocaleString()} XOF
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Date de création:</span>
                        <span className="ml-2">{acte.dateCreation}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <FileCheck className="w-4 h-4 mr-1" />
                          Voir détails
                        </Button>
                        <Button size="sm">
                          Traiter
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Authentifications */}
        <TabsContent value="authentifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Demandes d'authentification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {authentifications.map((auth) => (
                  <div key={auth.id} className="p-6 border rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{auth.document}</h3>
                        <p className="text-gray-600">Demandeur: {auth.demandeur}</p>
                        <p className="text-sm text-gray-500">{auth.type}</p>
                      </div>
                      <Badge className={getStatutColor(auth.statut)}>
                        {auth.statut}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Reçu le {auth.dateReception}
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Examiner
                        </Button>
                        <Button size="sm">
                          Authentifier
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Archives */}
        <TabsContent value="archives" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Archives et historique</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Système d'archives
                </h3>
                <p className="text-gray-600 mb-4">
                  Accédez à tous vos actes archivés et à l'historique complet des transactions.
                </p>
                <Button>
                  Parcourir les archives
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotaireDashboard;
