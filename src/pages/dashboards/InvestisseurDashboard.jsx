import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/hooks/useUser';
import { 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  DollarSign,
  Building,
  MapPin,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Calculator,
  TreePine
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * Dashboard spécialisé pour les Investisseurs (Immobilier & Agricole)
 * Analyse de marché, ROI, opportunités d'investissement, portefeuille
 */
const InvestisseurDashboard = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');

  // Données simulées pour les investisseurs
  const stats = {
    portefeuilleValeur: '850,000,000',
    roiAnnuel: '12.5',
    investissementsActifs: 23,
    opportunitesIdentifiees: 45,
    rendementMensuel: '8,750,000'
  };

  const investissementsActifs = [
    {
      id: 1,
      type: 'Immobilier',
      nom: 'Résidence Les Palmiers',
      localisation: 'Almadies, Dakar',
      investissement: '125,000,000',
      valeurActuelle: '148,000,000',
      roi: '18.4',
      statut: 'Performant',
      dateAcquisition: '2023-06-15',
      rendementMensuel: '2,100,000'
    },
    {
      id: 2,
      type: 'Agricole',
      nom: 'Exploitation Agrumiculture',
      localisation: 'Niayes, Thiès',
      investissement: '75,000,000',
      valeurActuelle: '89,500,000',
      roi: '19.3',
      statut: 'Excellent',
      dateAcquisition: '2023-03-20',
      rendementMensuel: '1,650,000'
    },
    {
      id: 3,
      type: 'Immobilier',
      nom: 'Complexe Commercial',
      localisation: 'Plateau, Dakar',
      investissement: '200,000,000',
      valeurActuelle: '195,000,000',
      roi: '-2.5',
      statut: 'Surveillé',
      dateAcquisition: '2023-11-10',
      rendementMensuel: '850,000'
    }
  ];

  const opportunites = [
    {
      id: 1,
      type: 'Immobilier',
      nom: 'Projet Résidentiel Haut Standing',
      localisation: 'Golf Sud, Guédiawaye',
      investissementMin: '50,000,000',
      roiPrevu: '22.0',
      risque: 'Modéré',
      delaiRetour: '18 mois',
      statut: 'Analysé',
      note: 'A+'
    },
    {
      id: 2,
      type: 'Agricole',
      nom: 'Ferme Maraîchère Bio',
      localisation: 'Gandiol, Saint-Louis',
      investissementMin: '35,000,000',
      roiPrevu: '28.5',
      risque: 'Faible',
      delaiRetour: '12 mois',
      statut: 'Recommandé',
      note: 'A'
    },
    {
      id: 3,
      type: 'Immobilier',
      nom: 'Centre Logistique',
      localisation: 'Diamniadio',
      investissementMin: '150,000,000',
      roiPrevu: '15.8',
      risque: 'Faible',
      delaiRetour: '24 mois',
      statut: 'Opportunité',
      note: 'B+'
    }
  ];

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Performant': return 'bg-green-100 text-green-800';
      case 'Excellent': return 'bg-emerald-100 text-emerald-800';
      case 'Surveillé': return 'bg-yellow-100 text-yellow-800';
      case 'Problématique': return 'bg-red-100 text-red-800';
      case 'Analysé': return 'bg-blue-100 text-blue-800';
      case 'Recommandé': return 'bg-emerald-100 text-emerald-800';
      case 'Opportunité': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRisqueColor = (risque) => {
    switch (risque) {
      case 'Faible': return 'bg-green-100 text-green-800';
      case 'Modéré': return 'bg-yellow-100 text-yellow-800';
      case 'Élevé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNoteColor = (note) => {
    if (note.startsWith('A')) return 'bg-emerald-100 text-emerald-800';
    if (note.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (note.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type) => {
    return type === 'Agricole' ? <TreePine className="w-4 h-4" /> : <Building className="w-4 h-4" />;
  };

  const getRoiColor = (roi) => {
    const roiNum = parseFloat(roi);
    if (roiNum >= 15) return 'text-emerald-600';
    if (roiNum >= 8) return 'text-green-600';
    if (roiNum >= 0) return 'text-blue-600';
    return 'text-red-600';
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Investisseur</h1>
          <p className="text-gray-600 mt-2">Analyse de portefeuille et opportunités d'investissement</p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Target className="w-4 h-4 mr-2" />
            Nouvelle Opportunité
          </Button>
          <Button variant="outline">
            <Calculator className="w-4 h-4 mr-2" />
            Calculateur ROI
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
                <p className="text-sm font-medium text-gray-600">Valeur portefeuille</p>
                <p className="text-2xl font-bold text-gray-900">{stats.portefeuilleValeur} XOF</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <PieChart className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ROI Annuel</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.roiAnnuel}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Investissements actifs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.investissementsActifs}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Opportunités</p>
                <p className="text-2xl font-bold text-gray-900">{stats.opportunitesIdentifiees}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rendement mensuel</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rendementMensuel} XOF</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="portefeuille">Mon Portefeuille</TabsTrigger>
          <TabsTrigger value="opportunites">Opportunités</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & ROI</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investissementsActifs.filter(inv => parseFloat(inv.roi) > 15).map((investment) => (
                    <div key={investment.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium flex items-center gap-2">
                          {getTypeIcon(investment.type)}
                          {investment.nom}
                        </h4>
                        <Badge className={getStatutColor(investment.statut)}>
                          {investment.statut}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        📍 {investment.localisation}
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        <div className="text-sm">
                          <span className="text-gray-500">Rendement:</span>
                          <span className={`font-bold ml-1 ${getRoiColor(investment.roi)}`}>
                            {investment.roi}%
                          </span>
                        </div>
                        <div className="text-sm text-emerald-600 font-medium">
                          +{parseInt(investment.rendementMensuel).toLocaleString()} XOF/mois
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Opportunités recommandées */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Opportunités recommandées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {opportunites.filter(opp => opp.statut === 'Recommandé').map((opportunite) => (
                    <div key={opportunite.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium flex items-center gap-2">
                          {getTypeIcon(opportunite.type)}
                          {opportunite.nom}
                        </h4>
                        <Badge className={getNoteColor(opportunite.note)}>
                          {opportunite.note}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        📍 {opportunite.localisation}
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                        <div>
                          <span className="text-gray-500">ROI prévu:</span>
                          <span className="font-bold text-emerald-600 ml-1">{opportunite.roiPrevu}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Délai:</span>
                          <span className="ml-1">{opportunite.delaiRetour}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <Badge className={getRisqueColor(opportunite.risque)}>
                          Risque {opportunite.risque}
                        </Badge>
                        <Button size="sm">
                          Analyser
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Mon Portefeuille */}
        <TabsContent value="portefeuille" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tous mes investissements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investissementsActifs.map((investment) => (
                  <div key={investment.id} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          {getTypeIcon(investment.type)}
                          {investment.nom}
                        </h3>
                        <p className="text-gray-600 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {investment.localisation}
                        </p>
                        <p className="text-sm text-gray-500">
                          Acquisition: {investment.dateAcquisition}
                        </p>
                      </div>
                      <Badge className={getStatutColor(investment.statut)}>
                        {investment.statut}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-500">Investissement initial:</span>
                        <div className="font-medium text-gray-900">
                          {parseInt(investment.investissement).toLocaleString()} XOF
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Valeur actuelle:</span>
                        <div className="font-medium text-blue-600">
                          {parseInt(investment.valeurActuelle).toLocaleString()} XOF
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">ROI:</span>
                        <div className={`font-bold ${getRoiColor(investment.roi)}`}>
                          {investment.roi}%
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Rendement mensuel:</span>
                        <div className="font-medium text-emerald-600">
                          {parseInt(investment.rendementMensuel).toLocaleString()} XOF
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Plus-value: {(parseInt(investment.valeurActuelle) - parseInt(investment.investissement)).toLocaleString()} XOF
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Analyser
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

        {/* Opportunités */}
        <TabsContent value="opportunites" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les opportunités d'investissement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {opportunites.map((opportunite) => (
                  <div key={opportunite.id} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          {getTypeIcon(opportunite.type)}
                          {opportunite.nom}
                        </h3>
                        <p className="text-gray-600 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {opportunite.localisation}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getNoteColor(opportunite.note)}>
                          Note {opportunite.note}
                        </Badge>
                        <Badge className={getStatutColor(opportunite.statut)}>
                          {opportunite.statut}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-500">Investissement min:</span>
                        <div className="font-medium text-gray-900">
                          {parseInt(opportunite.investissementMin).toLocaleString()} XOF
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">ROI prévu:</span>
                        <div className="font-bold text-emerald-600">
                          {opportunite.roiPrevu}%
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Délai de retour:</span>
                        <div className="font-medium">{opportunite.delaiRetour}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Niveau de risque:</span>
                        <Badge className={getRisqueColor(opportunite.risque)}>
                          {opportunite.risque}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Gain prévu: {(parseInt(opportunite.investissementMin) * parseFloat(opportunite.roiPrevu) / 100).toLocaleString()} XOF
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Analyser en détail
                        </Button>
                        <Button size="sm">
                          Investir
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics & ROI */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Performance globale</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">
                  {stats.roiAnnuel}%
                </div>
                <p className="text-sm text-gray-600 mb-4">ROI annuel moyen</p>
                <div className="text-sm text-gray-500">
                  Objectif: 15% | Atteint: {((parseFloat(stats.roiAnnuel) / 15) * 100).toFixed(0)}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full"
                    style={{ width: `${Math.min((parseFloat(stats.roiAnnuel) / 15) * 100, 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Diversification</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Immobilier</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Agricole</span>
                    <span className="font-medium">35%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Projection 12 mois</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  105,000,000 XOF
                </div>
                <p className="text-sm text-gray-600">Revenus prévisionnels</p>
                <div className="text-xs text-gray-500 mt-2">
                  Basé sur la performance actuelle
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestisseurDashboard;
