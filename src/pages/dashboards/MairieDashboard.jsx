import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/hooks/useUser';
import { 
  Building2, 
  Users, 
  FileText, 
  Map,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Scale,
  Home,
  TreePine
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * Dashboard spécialisé pour les Mairies
 * Gestion des demandes de terrain communal, urbanisme, taxes foncières
 */
const MairieDashboard = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');

  // Données simulées pour les mairies
  const stats = {
    demandesEnCours: 45,
    demandesApprouvees: 234,
    taxesCollectees: '125,650,000',
    projetsUrbanisme: 12,
    permisEnAttente: 18
  };

  const demandesTerrains = [
    {
      id: 1,
      demandeur: 'Amadou Diop',
      typeProjet: 'Résidentiel',
      superficie: '500 m²',
      localisation: 'Zone résidentielle Nord',
      statut: 'En évaluation',
      dateDepot: '2024-01-12',
      priorite: 'normale',
      contact: '+221 77 123 45 67'
    },
    {
      id: 2,
      demandeur: 'Société IMMOBAT',
      typeProjet: 'Commercial',
      superficie: '2,000 m²',
      localisation: 'Zone commerciale Centre',
      statut: 'Commission technique',
      dateDepot: '2024-01-08',
      priorite: 'haute',
      contact: '+221 33 456 78 90'
    },
    {
      id: 3,
      demandeur: 'Fatou Ndiaye',
      typeProjet: 'Résidentiel',
      superficie: '300 m²',
      localisation: 'Zone pavillonnaire Sud',
      statut: 'Approuvé',
      dateDepot: '2024-01-05',
      priorite: 'normale',
      contact: '+221 76 987 65 43'
    }
  ];

  const projetsUrbanisme = [
    {
      id: 1,
      nom: 'Aménagement Zone Industrielle',
      statut: 'En cours',
      avancement: 65,
      budget: '2,500,000,000',
      dateDebut: '2023-10-15',
      responsable: 'Direction Urbanisme'
    },
    {
      id: 2,
      nom: 'Rénovation Centre-ville',
      statut: 'Planification',
      avancement: 25,
      budget: '1,800,000,000',
      dateDebut: '2024-02-01',
      responsable: 'Équipe Patrimoine'
    },
    {
      id: 3,
      nom: 'Extension Zone Résidentielle',
      statut: 'Étude',
      avancement: 15,
      budget: '3,200,000,000',
      dateDebut: '2024-03-15',
      responsable: 'Bureau Études'
    }
  ];

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'En évaluation': return 'bg-blue-100 text-blue-800';
      case 'Commission technique': return 'bg-yellow-100 text-yellow-800';
      case 'Approuvé': return 'bg-green-100 text-green-800';
      case 'Rejeté': return 'bg-red-100 text-red-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Planification': return 'bg-purple-100 text-purple-800';
      case 'Étude': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioriteColor = (priorite) => {
    switch (priorite) {
      case 'haute': return 'bg-red-100 text-red-800';
      case 'normale': return 'bg-blue-100 text-blue-800';
      case 'basse': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeProjetIcon = (type) => {
    switch (type) {
      case 'Résidentiel': return <Home className="w-4 h-4" />;
      case 'Commercial': return <Building2 className="w-4 h-4" />;
      case 'Industriel': return <Building2 className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Mairie</h1>
          <p className="text-gray-600 mt-2">Gestion des terrains communaux et urbanisme</p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4 mr-2" />
            Nouvelle Demande
          </Button>
          <Button variant="outline">
            <Map className="w-4 h-4 mr-2" />
            Plan Urbanisme
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
                <p className="text-sm font-medium text-gray-600">Demandes en cours</p>
                <p className="text-2xl font-bold text-gray-900">{stats.demandesEnCours}</p>
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
                <p className="text-sm font-medium text-gray-600">Demandes approuvées</p>
                <p className="text-2xl font-bold text-gray-900">{stats.demandesApprouvees}</p>
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
                <p className="text-sm font-medium text-gray-600">Taxes collectées</p>
                <p className="text-2xl font-bold text-gray-900">{stats.taxesCollectees} XOF</p>
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
                <p className="text-sm font-medium text-gray-600">Projets urbanisme</p>
                <p className="text-2xl font-bold text-gray-900">{stats.projetsUrbanisme}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Map className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Permis en attente</p>
                <p className="text-2xl font-bold text-gray-900">{stats.permisEnAttente}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="demandes">Demandes de terrain</TabsTrigger>
          <TabsTrigger value="urbanisme">Projets urbanisme</TabsTrigger>
          <TabsTrigger value="finances">Finances & Taxes</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Demandes prioritaires */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Demandes prioritaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demandesTerrains.filter(d => d.priorite === 'haute' || d.statut === 'Commission technique').map((demande) => (
                    <div key={demande.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium flex items-center gap-2">
                          {getTypeProjetIcon(demande.typeProjet)}
                          {demande.demandeur}
                        </h4>
                        <Badge className={getPrioriteColor(demande.priorite)}>
                          {demande.priorite}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {demande.typeProjet} | {demande.superficie}
                      </p>
                      <p className="text-sm text-gray-500">
                        📍 {demande.localisation}
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-gray-400">
                          Dépôt: {demande.dateDepot}
                        </span>
                        <Badge className={getStatutColor(demande.statut)}>
                          {demande.statut}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Projets en cours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="w-5 h-5" />
                  Projets urbanisme actifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projetsUrbanisme.filter(p => p.statut === 'En cours').map((projet) => (
                    <div key={projet.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{projet.nom}</h4>
                        <Badge className={getStatutColor(projet.statut)}>
                          {projet.statut}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {projet.responsable}
                      </p>
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Avancement</span>
                          <span className="text-sm font-medium">{projet.avancement}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${projet.avancement}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Budget: {parseInt(projet.budget).toLocaleString()} XOF
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Demandes de terrain */}
        <TabsContent value="demandes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les demandes de terrain communal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demandesTerrains.map((demande) => (
                  <div key={demande.id} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          {getTypeProjetIcon(demande.typeProjet)}
                          {demande.demandeur}
                        </h3>
                        <p className="text-gray-600">
                          Projet {demande.typeProjet} | Superficie: {demande.superficie}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          {demande.localisation}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPrioriteColor(demande.priorite)}>
                          {demande.priorite}
                        </Badge>
                        <Badge className={getStatutColor(demande.statut)}>
                          {demande.statut}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Date de dépôt:</span>
                        <div className="font-medium">{demande.dateDepot}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Contact:</span>
                        <div className="font-medium">{demande.contact}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Examiner
                        </Button>
                        <Button size="sm">
                          {demande.statut === 'En évaluation' ? 'Évaluer' : 'Traiter'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projets urbanisme */}
        <TabsContent value="urbanisme" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tous les projets d'urbanisme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projetsUrbanisme.map((projet) => (
                  <div key={projet.id} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{projet.nom}</h3>
                        <p className="text-gray-600">Responsable: {projet.responsable}</p>
                      </div>
                      <Badge className={getStatutColor(projet.statut)}>
                        {projet.statut}
                      </Badge>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Avancement du projet</span>
                        <span className="text-sm font-medium">{projet.avancement}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                          style={{ width: `${projet.avancement}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Budget total:</span>
                        <div className="font-medium text-emerald-600">
                          {parseInt(projet.budget).toLocaleString()} XOF
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Date de début:</span>
                        <div className="font-medium">{projet.dateDebut}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Voir détails
                        </Button>
                        <Button size="sm">
                          Gérer
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Finances et taxes */}
        <TabsContent value="finances" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Taxes foncières</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  {stats.taxesCollectees} XOF
                </div>
                <p className="text-sm text-gray-600">Collectées ce mois</p>
                <div className="mt-4">
                  <div className="text-sm text-gray-500 mb-1">Objectif mensuel</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">78% atteint</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Revenus terrains</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  89,500,000 XOF
                </div>
                <p className="text-sm text-gray-600">Ventes terrains communaux</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Permis & autorisations</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  12,350,000 XOF
                </div>
                <p className="text-sm text-gray-600">Frais administratifs</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Répartition des revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Taxes foncières</h4>
                    <p className="text-sm text-gray-600">55% des revenus</p>
                  </div>
                  <div className="text-lg font-bold text-emerald-600">
                    {stats.taxesCollectees} XOF
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Ventes terrains communaux</h4>
                    <p className="text-sm text-gray-600">39% des revenus</p>
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    89,500,000 XOF
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Permis et autorisations</h4>
                    <p className="text-sm text-gray-600">6% des revenus</p>
                  </div>
                  <div className="text-lg font-bold text-purple-600">
                    12,350,000 XOF
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MairieDashboard;
