import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Building2, Search, FileCheck, TrendingUp, CalendarDays, DollarSign, Lightbulb, Users, Map, PlusCircle, Filter, Calculator, LandPlot, Coins as HandCoins } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const kpiData = [
  { title: "Projets en Cours", value: "5", icon: Building2, trend: "+1", trendColor: "text-green-500", unit: "projets" },
  { title: "Terrains Identifiés (Mois)", value: "12", icon: Search, trend: "+3", trendColor: "text-green-500", unit: "terrains" },
  { title: "Faisabilités Approuvées", value: "3", icon: FileCheck, trendColor: "text-green-500", trend: "Stable", unit: "études" },
  { title: "Budget Total Engagé", value: "2.5", icon: DollarSign, trendColor: "text-neutral-500", trend: "", unit: "Mds XOF" },
];

const currentProjects = [
  { id: 'PROJ001', name: 'Résidence Les Filaos', zone: 'Diamniadio', type: 'Résidentiel', statut: 'En construction', progression: 60, prochaineEcheance: '2025-08-15', budgetUtilise: '600M XOF / 1Md XOF' },
  { id: 'PROJ002', name: 'Saly Center', zone: 'Saly', type: 'Commercial', statut: 'Planification', progression: 20, prochaineEcheance: '2025-07-30', budgetUtilise: '50M XOF / 500M XOF' },
  { id: 'PROJ003', name: 'Logements Keur Massar', zone: 'Dakar', type: 'Social', statut: 'Faisabilité', progression: 10, prochaineEcheance: '2025-07-10', budgetUtilise: '10M XOF / 800M XOF' },
];

const identifiedLands = [
    {id: 'LAND001', zone: 'Lac Rose', superficie: '2 Ha', potentiel: 'Touristique / Résidentiel', statutDoc: 'Vérifié', prixEst: '45000000', rentabiliteEst: '18%'},
    {id: 'LAND002', zone: 'Diamniadio Pôle Urbain', superficie: '5000 m²', potentiel: 'Bureaux / Commercial', statutDoc: 'En cours de vérification', prixEst: '60000000', rentabiliteEst: '22%'},
    {id: 'LAND003', zone: 'Thiès Nord', superficie: '10 Ha', potentiel: 'Logements économiques', statutDoc: 'Vérifié', prixEst: '150000000', rentabiliteEst: '15%'},
];

const keyPartners = [
    {name: 'Architectes Associés', type: 'Cabinet d\'Architecture', contact: 'contact@archi-associes.sn'},
    {name: 'BTP Sénégal Construction', type: 'Entreprise de Construction', contact: 'info@btp-senegal.com'},
    {name: 'Investisseurs Privés Club', type: 'Réseau d\'Investisseurs', contact: 'club@invest-sn.org'},
];

const MarketTrendsChart = () => (
  <div className="h-full bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-800/30 rounded-lg p-4 flex flex-col items-center justify-center shadow-inner">
    <TrendingUp className="h-12 w-12 text-purple-600 dark:text-purple-400 mb-3" />
    <p className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2">Tendances du Marché Foncier</p>
    <div className="w-full mt-2 space-y-1.5">
      {[
        { label: 'Demande Résidentiel Haut Standing', value: 75, color: 'bg-purple-500 dark:bg-purple-400' },
        { label: 'Prix / m² Zone Côtière', value: 60, color: 'bg-teal-500 dark:bg-teal-400' },
        { label: 'Disponibilité Terrains Viabilisés', value: 40, color: 'bg-orange-500 dark:bg-orange-400' }
      ].map(item => (
        <div key={item.label} className="text-xs text-purple-700 dark:text-purple-300">
          <div className="flex justify-between mb-0.5"><span>{item.label}</span><span>{item.value}%</span></div>
          <div className="w-full bg-purple-200 dark:bg-purple-700 rounded-full h-2"><div className={`${item.color} h-2 rounded-full`} style={{width: `${item.value}%`}}></div></div>
        </div>
      ))}
    </div>
    <Button variant="link" size="sm" className="mt-3 text-xs p-0 h-auto text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">Rapport Complet des Tendances</Button>
  </div>
);

const OpportunitiesMap = () => (
     <div className="h-full bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/30 dark:to-amber-800/30 rounded-lg p-4 flex flex-col items-center justify-center shadow-inner">
        <Lightbulb className="h-12 w-12 text-yellow-500 dark:text-yellow-400 mb-3" />
        <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">Carte des Opportunités Foncières</p>
        <p className="text-xs text-center mt-1 text-yellow-700 dark:text-yellow-300">Zones à fort potentiel de développement pour promoteurs (données fictives).</p>
        <img  className="w-full h-auto mt-2 rounded" alt="Simulation de carte des opportunités foncières pour promoteurs avec filtres de zonage et potentiel" src="https://images.unsplash.com/photo-1614783702763-48dcc1f32a91" />
        <Button variant="link" size="sm" className="mt-2 text-xs p-0 h-auto text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300">Explorer les Zones d'Opportunités</Button>
     </div>
);

const PromoteursDashboardPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  const [calculatorData, setCalculatorData] = useState({ terrainId: '', coutTerrain: '', coutConstruction: '', prixVenteEstime: ''});
  const [calculatedProfit, setCalculatedProfit] = useState(null);


  const handleSimulatedAction = (message) => {
    toast({ title: "Action Simulée", description: message });
  };

  const openRentabilityCalculator = (terrain) => {
    setCalculatorData({ terrainId: terrain.id, coutTerrain: terrain.prixEst, coutConstruction: '', prixVenteEstime: '' });
    setCalculatedProfit(null);
    setIsCalculatorModalOpen(true);
  };

  const handleCalculatorChange = (e) => {
    const { name, value } = e.target;
    setCalculatorData(prev => ({...prev, [name]: value}));
  };

  const calculateProfit = () => {
    const { coutTerrain, coutConstruction, prixVenteEstime } = calculatorData;
    if (coutTerrain && coutConstruction && prixVenteEstime) {
      const profit = parseFloat(prixVenteEstime) - (parseFloat(coutTerrain) + parseFloat(coutConstruction));
      setCalculatedProfit(profit);
    } else {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs pour calculer.", variant: "destructive" });
    }
  };

  const renderTabContent = () => {
    switch(activeTab) {
        case 'overview':
            return(
                <>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {kpiData.map((kpi, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-purple-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            <kpi.icon className="h-5 w-5 text-purple-600" />
                            </CardHeader>
                            <CardContent>
                            <div className="text-2xl font-bold">{kpi.value} <span className="text-sm text-muted-foreground">{kpi.unit}</span></div>
                            {kpi.trend && <p className={`text-xs ${kpi.trendColor}`}>{kpi.trend}</p>}
                            </CardContent>
                        </Card>
                        ))}
                    </div>
                     <div className="grid gap-6 lg:grid-cols-2 mt-6">
                        <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center text-purple-700 dark:text-purple-300"><TrendingUp className="mr-2 h-5 w-5"/>Tendances du Marché Foncier</CardTitle>
                        </CardHeader>
                        <CardContent className="h-full flex flex-col">
                            <MarketTrendsChart />
                        </CardContent>
                        </Card>
                        <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center text-yellow-700 dark:text-yellow-300"><Lightbulb className="mr-2 h-5 w-5"/>Carte des Opportunités</CardTitle>
                        </CardHeader>
                        <CardContent className="h-full flex flex-col">
                            <OpportunitiesMap />
                        </CardContent>
                        </Card>
                    </div>
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5"/>Réseau de Partenaires Clés</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {keyPartners.map(partner => (
                                    <li key={partner.name} className="flex justify-between items-center p-2 bg-muted/30 rounded-md text-sm">
                                        <div>
                                            <p className="font-semibold">{partner.name} <span className="text-xs text-muted-foreground">({partner.type})</span></p>
                                            <p className="text-xs text-primary hover:underline cursor-pointer" onClick={() => handleSimulatedAction(`Contacter ${partner.name} via ${partner.contact}`)}>{partner.contact}</p>
                                        </div>
                                        <Button variant="outline" size="xs" onClick={() => handleSimulatedAction(`Voir profil de ${partner.name}`)}>Profil</Button>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </>
            );
        case 'projects':
            return (
                <Card>
                    <CardHeader>
                    <CardTitle className="flex items-center"><CalendarDays className="mr-2 h-5 w-5"/>Suivi des Projets Immobiliers</CardTitle>
                    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 mt-2">
                        <div className="relative w-full sm:w-auto sm:flex-grow">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="search" placeholder="Rechercher par nom, zone..." className="pl-8 w-full sm:w-[300px]" onChange={(e) => handleSimulatedAction(`Recherche projets: ${e.target.value}`)} />
                        </div>
                        <Select onValueChange={(value) => handleSimulatedAction(`Filtrage projets par statut: ${value}`)}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filtrer par statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous statuts</SelectItem>
                            <SelectItem value="construction">En construction</SelectItem>
                            <SelectItem value="planification">Planification</SelectItem>
                            <SelectItem value="faisabilite">Faisabilité</SelectItem>
                            <SelectItem value="livre">Livré</SelectItem>
                        </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={() => handleSimulatedAction("Création d'un nouveau projet.")}><PlusCircle className="mr-2 h-4 w-4"/>Nouveau Projet</Button>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                            <th className="text-left p-2 font-semibold">Projet</th>
                            <th className="text-left p-2 font-semibold">Zone</th>
                            <th className="text-left p-2 font-semibold">Statut</th>
                            <th className="text-left p-2 font-semibold">Progression</th>
                            <th className="text-left p-2 font-semibold">Budget Utilisé</th>
                            <th className="text-left p-2 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProjects.map((proj) => (
                            <tr key={proj.id} className="border-b hover:bg-muted/30">
                                <td className="p-2 text-primary hover:underline"><Link to="#">{proj.name} ({proj.id})</Link></td>
                                <td className="p-2">{proj.zone}</td>
                                <td className="p-2">{proj.statut}</td>
                                <td className="p-2">
                                <div className="w-full bg-muted rounded-full h-2.5">
                                    <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${proj.progression}%` }}></div>
                                </div>
                                <span className="text-xs">{proj.progression}%</span>
                                </td>
                                <td className="p-2 text-xs">{proj.budgetUtilise}</td>
                                <td className="p-2 space-x-1">
                                <Button variant="outline" size="xs" onClick={() => handleSimulatedAction(`Gestion du projet ${proj.name}`)}>Gérer</Button>
                                <Button variant="ghost" size="xs" title="Commercialisation" onClick={() => handleSimulatedAction(`Ouvrir le module de commercialisation pour ${proj.name}`)}><HandCoins className="h-3.5 w-3.5"/></Button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    <Button variant="link" className="mt-4 p-0" onClick={() => handleSimulatedAction("Affichage de tous les projets.")}>Voir tous les projets</Button>
                    </CardContent>
                </Card>
            );
        case 'lands':
            return (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><LandPlot className="mr-2 h-5 w-5"/>Terrains Identifiés & Potentiel</CardTitle>
                         <CardDescription>Catalogue de terrains potentiels pour vos futurs projets et analyse de rentabilité.</CardDescription>
                    </CardHeader>
                     <CardContent>
                        <ul className="space-y-3">
                            {identifiedLands.map(land => (
                                <li key={land.id} className="p-3 bg-muted/30 rounded-md flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                    <div>
                                        <p className="font-medium text-primary">{land.zone} - {land.superficie}</p>
                                        <p className="text-xs text-muted-foreground">Potentiel: {land.potentiel} | Statut Doc: <span className={land.statutDoc === 'Vérifié' ? 'text-green-600' : 'text-yellow-600'}>{land.statutDoc}</span></p>
                                        <p className="text-xs text-muted-foreground">Prix Est.: {new Intl.NumberFormat('fr-SN').format(land.prixEst)} XOF | Rentabilité Estimée: <span className="font-semibold text-green-600">{land.rentabiliteEst}</span></p>
                                    </div>
                                    <div className="flex space-x-1 shrink-0">
                                        <Button size="sm" variant="outline" onClick={() => handleSimulatedAction(`Analyse détaillée du terrain ${land.id}`)}>Analyser</Button>
                                        <Button size="sm" variant="ghost" onClick={() => openRentabilityCalculator(land)} title="Calculateur de Rentabilité">
                                            <Calculator className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <Button variant="link" className="mt-4 p-0" onClick={() => handleSimulatedAction("Affichage de tous les terrains identifiés.")}>Voir tous les terrains</Button>
                    </CardContent>
                </Card>
            );
        default: return null;
    }
  };


  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4 space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center">
            <Building2 className="h-8 w-8 mr-3 text-purple-600"/>
            Tableau de Bord Promoteurs
          </h1>
          <p className="text-muted-foreground">Gestion de projets, identification d'opportunités et analyse de rentabilité.</p>
        </div>
        <Button asChild variant="outline">
            <Link to="/solutions/promoteurs">Retour aux Solutions Promoteurs</Link>
        </Button>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {['overview', 'projects', 'lands'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {tab === 'overview' ? 'Vue d\'ensemble & Partenaires' : tab === 'projects' ? 'Mes Projets en Cours' : 'Terrains & Rentabilité'}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {renderTabContent()}
      </div>
    </motion.div>

    <Dialog open={isCalculatorModalOpen} onOpenChange={setIsCalculatorModalOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Calculateur de Rentabilité Prévisionnelle</DialogTitle>
                <DialogDescription>
                    Simulez la rentabilité d'un projet basé sur ce terrain. Les valeurs sont indicatives. Terrain: {calculatorData.terrainId}
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="coutTerrain">Coût du Terrain (FCFA)</Label>
                    <Input id="coutTerrain" name="coutTerrain" type="number" value={calculatorData.coutTerrain} onChange={handleCalculatorChange} placeholder="Ex: 45000000"/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="coutConstruction">Coût de Construction Estimé (FCFA)</Label>
                    <Input id="coutConstruction" name="coutConstruction" type="number" value={calculatorData.coutConstruction} onChange={handleCalculatorChange} placeholder="Ex: 150000000"/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="prixVenteEstime">Prix de Vente Total Estimé (FCFA)</Label>
                    <Input id="prixVenteEstime" name="prixVenteEstime" type="number" value={calculatorData.prixVenteEstime} onChange={handleCalculatorChange} placeholder="Ex: 250000000"/>
                </div>
                 {calculatedProfit !== null && (
                    <div className={`mt-4 p-3 rounded-md text-sm ${calculatedProfit > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        Profit Prévisionnel: <span className="font-bold">{calculatedProfit.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                )}
            </div>
            <DialogFooter className="sm:justify-start">
                 <Button type="button" onClick={calculateProfit}>Calculer</Button>
                <Button type="button" variant="outline" onClick={() => setIsCalculatorModalOpen(false)}>Fermer</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
};

export default PromoteursDashboardPage;