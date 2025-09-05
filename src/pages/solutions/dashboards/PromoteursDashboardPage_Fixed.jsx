import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { 
  Building2, 
  Search, 
  FileCheck, 
  TrendingUp, 
  CalendarDays, 
  DollarSign, 
  Lightbulb, 
  Users, 
  Map, 
  PlusCircle, 
  Filter, 
  Calculator, 
  LandPlot, 
  Target, 
  Crown, 
  Zap, 
  BarChart3, 
  LineChart, 
  PieChart, 
  Activity, 
  Bell, 
  Eye, 
  Star, 
  Hammer, 
  Building
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

// =====================================================
// DASHBOARD PROMOTEURS MODERNISÉ - TERANGA FONCIER
// Version Professionnelle avec Analytics de Développement
// =====================================================

// Données simulées pour analytics promoteurs
const projectsEvolutionData = [
  { month: 'Jan', projets: 5, investissement: 950, marge: 18 },
  { month: 'Fév', projets: 7, investissement: 1200, marge: 22 },
  { month: 'Mar', projets: 9, investissement: 1650, marge: 25 },
  { month: 'Avr', projets: 12, investissement: 2100, marge: 28 },
  { month: 'Mai', projets: 15, investissement: 2800, marge: 31 },
  { month: 'Jun', projets: 18, investissement: 3400, marge: 35 }
];

const projectTypesData = [
  { name: 'Résidentiel', value: 45, color: '#3B82F6' },
  { name: 'Commercial', value: 25, color: '#10B981' },
  { name: 'Mixte', value: 20, color: '#F59E0B' },
  { name: 'Industriel', value: 10, color: '#EF4444' }
];

const marketOpportunityData = [
  { zone: 'Almadies', potentiel: 92, demande: 'Très Élevée', prix_m2: 850000 },
  { zone: 'Mermoz', potentiel: 78, demande: 'Élevée', prix_m2: 450000 },
  { zone: 'Yeumbeul', potentiel: 85, demande: 'Élevée', prix_m2: 280000 },
  { zone: 'Diamniadio', potentiel: 95, demande: 'Très Élevée', prix_m2: 320000 }
];

// Plans d'abonnement promoteurs
const PROMOTEUR_PLANS = {
  starter: {
    name: 'Promoteur Starter',
    price: 150000,
    features: [
      'Jusqu\'à 5 projets simultanés',
      'Outils de base de gestion',
      'Accès aux parcelles publiques',
      'Support email standard'
    ]
  },
  professional: {
    name: 'Promoteur Pro',
    price: 280000,
    features: [
      'Jusqu\'à 15 projets simultanés',
      'Analytics avancés & ROI',
      'Accès prioritaire aux terrains',
      'Gestion d\'équipes (5 membres)',
      'API Teranga Foncier',
      'Support prioritaire'
    ]
  },
  enterprise: {
    name: 'Promoteur Enterprise',
    price: 500000,
    features: [
      'Projets illimités',
      'Analytics & BI complets',
      'Accès exclusif VIP',
      'Équipes illimitées',
      'Intégrations personnalisées',
      'Account manager dédié',
      'Formation équipe incluse'
    ]
  }
};

const PromoteursDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState([]);
  const [currentProjects, setCurrentProjects] = useState([]);
  const [identifiedLands, setIdentifiedLands] = useState([]);
  const [showROICalculator, setShowROICalculator] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('professional');

  // Nouvelles données pour construction à distance
  const [remoteConstructionProjects, setRemoteConstructionProjects] = useState([]);

  // États pour le calculateur ROI
  const [roiInputs, setRoiInputs] = useState({
    investmentAmount: '',
    projectDuration: '',
    expectedRevenue: '',
    operatingCosts: ''
  });

  const [projetsActifs, setProjetsActifs] = useState(18);
  const [rendementMoyen, setRendementMoyen] = useState(35.2);
  const [equipesActives, setEquipesActives] = useState(4);
  const [terrainsIdentifies, setTerrainsIdentifies] = useState(12);
  const [faisabilitesApprouvees, setFaisabilitesApprouvees] = useState(8);
  const [budgetTotal, setBudgetTotal] = useState(15800000000);

  useEffect(() => {
    loadPromoteurData();
  }, []);

  const loadPromoteurData = async () => {
    try {
      // Récupérer les parcelles disponibles
      const { data: parcels } = await supabase
        .from('land_parcels')
        .select('*')
        .eq('status', 'available')
        .limit(10);

      // Générer les KPIs
      const kpis = [
        {
          title: "Projets Actifs",
          value: projetsActifs.toString(),
          icon: Building,
          trend: "+2",
          trendColor: "text-green-500",
          unit: "projets"
        },
        {
          title: "Rendement Moyen",
          value: rendementMoyen.toFixed(1),
          icon: TrendingUp,
          trend: "+2.3%",
          trendColor: "text-green-500",
          unit: "%"
        },
        {
          title: "Équipes Actives",
          value: equipesActives.toString(),
          icon: Users,
          trend: "+1",
          trendColor: "text-green-500",
          unit: "équipes"
        },
        { 
          title: "Terrains Identifiés (Mois)", 
          value: terrainsIdentifies.toString(), 
          icon: Search, 
          trend: terrainsIdentifies > 10 ? "+3" : "+1", 
          trendColor: "text-green-500", 
          unit: "terrains" 
        },
        { 
          title: "Faisabilités Approuvées", 
          value: faisabilitesApprouvees.toString(), 
          icon: FileCheck, 
          trendColor: "text-green-500", 
          trend: "Stable", 
          unit: "études" 
        },
        { 
          title: "Budget Total Engagé", 
          value: (budgetTotal / 1000000000).toFixed(1), 
          icon: DollarSign, 
          trendColor: "text-neutral-500", 
          trend: "", 
          unit: "Mds XOF" 
        }
      ];

      setKpiData(kpis);

      // Générer les projets actuels basés sur les parcelles
      const projects = parcels?.slice(0, 3).map((parcel, index) => ({
        id: `PROJ00${index + 1}`,
        name: parcel.title || `Projet ${parcel.id.slice(0, 8)}`,
        zone: parcel.commune || parcel.region || 'Zone non spécifiée',
        type: ['Résidentiel', 'Commercial', 'Social'][index % 3],
        statut: parcel.status === 'available' ? 'En construction' : 'Planification',
        progression: Math.floor(Math.random() * 80) + 20,
        prochaineEcheance: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        budgetUtilise: `${Math.floor(parcel.price / 2000000)}M XOF / ${Math.floor(parcel.price / 1000000)}M XOF`
      })) || [];

      setCurrentProjects(projects);

      // Générer les terrains identifiés
      const lands = parcels?.slice(0, 3).map((parcel, index) => ({
        id: `LAND00${index + 1}`,
        zone: parcel.location || parcel.commune || 'Zone non spécifiée',
        superficie: `${Math.floor(Math.random() * 5000) + 1000} m²`,
        potentiel: ['Touristique / Résidentiel', 'Bureaux / Commercial', 'Logements économiques'][index % 3],
        statutDoc: index === 1 ? 'En cours de vérification' : 'Vérifié',
        prixEst: parcel.price?.toString() || '0',
        rentabiliteEst: `${Math.floor(Math.random() * 10) + 15}%`
      })) || [];

      setIdentifiedLands(lands);

      // Générer projets de construction à distance
      const remoteProjects = [
        {
          id: 'REMOTE001',
          client: 'Amadou Diallo - Diaspora France',
          terrain: 'Parcelle VDN - 800m²',
          statut: 'En construction',
          progression: 65,
          phase: 'Élévation murs',
          derniereUpdate: '2025-01-15',
          prochaineMajor: '2025-01-20',
          budget: '85M XOF',
          utilise: '55M XOF'
        },
        {
          id: 'REMOTE002', 
          client: 'Fatou Sall - Diaspora USA',
          terrain: 'Parcelle Almadies - 1200m²',
          statut: 'Fondations',
          progression: 35,
          phase: 'Coulage dalle',
          derniereUpdate: '2025-01-10',
          prochaineMajor: '2025-01-18',
          budget: '120M XOF',
          utilise: '42M XOF'
        }
      ];

      setRemoteConstructionProjects(remoteProjects);
      setLoading(false);

    } catch (error) {
      console.error('Erreur lors du chargement des données promoteur:', error);
      setLoading(false);
    }
  };

  const keyPartners = [
      {name: 'Architectes Associés', type: 'Cabinet d\'Architecture', contact: 'contact@archi-associes.sn'},
      {name: 'BTP Sénégal Construction', type: 'Entreprise de Construction', contact: 'info@btp-senegal.com'},
      {name: 'Investisseurs Privés Club', type: 'Réseau d\'Investisseurs', contact: 'club@invest-sn.org'},
  ];

  const marketAlerts = [
    { type: 'opportunity', priority: 'high', title: 'Nouvelle Zone Ouverte', description: 'Zone industrielle Diamniadio Extension - 150 hectares', date: '2025-01-15' },
    { type: 'regulatory', priority: 'medium', title: 'Mise à Jour Réglementaire', description: 'Nouveaux coefficients d\'urbanisme pour Dakar Centre', date: '2025-01-10' },
    { type: 'market', priority: 'high', title: 'Tendance Marché', description: 'Hausse 15% demande logements économiques Pikine', date: '2025-01-08' },
    { type: 'competitor', priority: 'low', title: 'Veille Concurrentielle', description: 'Lancement nouveau projet résidentiel concurrent Almadies', date: '2025-01-05' }
  ];

  const calculateROI = () => {
    const investment = parseFloat(roiInputs.investmentAmount) || 0;
    const revenue = parseFloat(roiInputs.expectedRevenue) || 0;
    const costs = parseFloat(roiInputs.operatingCosts) || 0;
    const duration = parseFloat(roiInputs.projectDuration) || 1;
    
    const netProfit = revenue - costs - investment;
    const roi = investment > 0 ? ((netProfit / investment) * 100) : 0;
    const monthlyReturn = roi / duration;
    
    return { roi: roi.toFixed(2), monthlyReturn: monthlyReturn.toFixed(2), netProfit };
  };

  const getAlertIcon = (type) => {
    switch(type) {
      case 'opportunity': return <Target className="h-4 w-4" />;
      case 'regulatory': return <FileCheck className="h-4 w-4" />;
      case 'market': return <TrendingUp className="h-4 w-4" />;
      case 'competitor': return <Users className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getAlertColor = (priority) => {
    switch(priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <>
            {/* KPIs Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
              {kpiData.map((kpi, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">{kpi.title}</CardTitle>
                      <kpi.icon className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{kpi.value} <span className="text-sm text-muted-foreground">{kpi.unit}</span></div>
                      {kpi.trend && <p className={`text-xs ${kpi.trendColor}`}>{kpi.trend}</p>}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-2 mb-8">
              {/* Evolution Projets */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Évolution des Projets et Marges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={projectsEvolutionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="projets" stackId="1" stroke="#9333ea" fill="#9333ea" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="marge" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Types de Projets */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-purple-600" />
                    Répartition Types de Projets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={projectTypesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {projectTypesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Construction à Distance - NOUVELLE SECTION */}
            <Card className="mb-8 border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700">
                  <Hammer className="h-6 w-6" />
                  Construction à Distance - Diaspora
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Nouveau</Badge>
                </CardTitle>
                <CardDescription>
                  Suivi en temps réel des projets de construction pour la diaspora
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {remoteConstructionProjects.map((project) => (
                    <Card key={project.id} className="border border-emerald-200">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-sm text-emerald-700">{project.client}</CardTitle>
                            <CardDescription className="text-xs">{project.terrain}</CardDescription>
                          </div>
                          <Badge variant={project.statut === 'En construction' ? 'default' : 'secondary'}>
                            {project.statut}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Timeline Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Phase: {project.phase}</span>
                            <span>{project.progression}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-emerald-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${project.progression}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Budget */}
                        <div className="flex justify-between text-sm">
                          <span>Budget:</span>
                          <span className="font-medium">{project.utilise} / {project.budget}</span>
                        </div>
                        
                        {/* Updates */}
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>Dernière update: {project.derniereUpdate}</div>
                          <div>Prochaine majeure: {project.prochaineMajor}</div>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            Timeline
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            📸 Photos
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            🎥 Vidéos
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-4 p-4 bg-emerald-100 rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-700 font-medium mb-2">
                    <Target className="h-4 w-4" />
                    Revenus Construction à Distance
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-emerald-600 font-medium">2 Projets Actifs</div>
                      <div className="text-gray-600">Total: 205M XOF</div>
                    </div>
                    <div>
                      <div className="text-emerald-600 font-medium">Marge Moyenne</div>
                      <div className="text-gray-600">22% sur projets</div>
                    </div>
                    <div>
                      <div className="text-emerald-600 font-medium">Revenus Prévisionnels</div>
                      <div className="text-gray-600">45M XOF (3 mois)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opportunités Marché */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-purple-600" />
                  Opportunités Marché par Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {marketOpportunityData.map((zone, index) => (
                    <div key={index} className="p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{zone.zone}</h4>
                        <Badge variant={zone.demande === 'Très Élevée' ? 'default' : 'secondary'}>
                          {zone.potentiel}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{zone.demande}</p>
                      <p className="text-sm font-medium text-purple-600">
                        {(zone.prix_m2 / 1000).toFixed(0)}k XOF/m²
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alertes Marché */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-purple-600" />
                  Alertes & Veille Marché
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketAlerts.map((alert, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${getAlertColor(alert.priority)}`}>
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-sm">{alert.title}</h4>
                            <span className="text-xs text-gray-500">{alert.date}</span>
                          </div>
                          <p className="text-sm text-gray-600">{alert.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Projets en Cours</h3>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <PlusCircle className="h-4 w-4 mr-2" />
                Nouveau Projet
              </Button>
            </div>
            
            <div className="grid gap-6">
              {currentProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription>{project.zone} • {project.type}</CardDescription>
                      </div>
                      <Badge variant={project.statut === 'En construction' ? 'default' : 'secondary'}>
                        {project.statut}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>{project.progression}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${project.progression}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Budget utilisé:</span>
                        <span className="font-medium">{project.budgetUtilise}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Prochaine échéance:</span>
                        <span>{project.prochaineEcheance}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'lands':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Terrains Identifiés</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {identifiedLands.map((land) => (
                <Card key={land.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-sm">{land.zone}</CardTitle>
                    <CardDescription>{land.superficie}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Potentiel:</span>
                        <span className="font-medium">{land.potentiel}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>FileTexts:</span>
                        <Badge variant={land.statutDoc === 'Vérifié' ? 'default' : 'secondary'}>
                          {land.statutDoc}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Prix estimé:</span>
                        <span className="font-medium">{(parseInt(land.prixEst) / 1000000).toFixed(0)}M XOF</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Rentabilité:</span>
                        <span className="font-medium text-green-600">{land.rentabiliteEst}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      default: 
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 p-4 space-y-6">
      {/* Header avec branding promoteurs */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Promoteurs</h1>
            <p className="text-gray-600">Développement immobilier professionnel</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowROICalculator(true)}
            variant="outline"
            className="border-purple-300 text-purple-600 hover:bg-purple-50"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Calculateur ROI
          </Button>
          
          <Select value={selectedPlan} onValueChange={setSelectedPlan}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PROMOTEUR_PLANS).map(([key, plan]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    {plan.name} - {(plan.price / 1000).toFixed(0)}k XOF/mois
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border"
      >
        {[
          { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
          { id: 'projects', label: 'Projets', icon: Building2 },
          { id: 'lands', label: 'Terrains', icon: LandPlot },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {renderTabContent()}
      </motion.div>

      {/* ROI Calculator Dialog */}
      <Dialog open={showROICalculator} onOpenChange={setShowROICalculator}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Calculateur ROI Promoteur</DialogTitle>
            <DialogDescription>
              Estimez la rentabilité de votre projet immobilier
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="investment">Investissement initial (XOF)</Label>
              <Input
                id="investment"
                type="number"
                placeholder="ex: 50000000"
                value={roiInputs.investmentAmount}
                onChange={(e) => setRoiInputs({...roiInputs, investmentAmount: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="duration">Durée du projet (mois)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="ex: 18"
                value={roiInputs.projectDuration}
                onChange={(e) => setRoiInputs({...roiInputs, projectDuration: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="revenue">Revenus attendus (XOF)</Label>
              <Input
                id="revenue"
                type="number"
                placeholder="ex: 85000000"
                value={roiInputs.expectedRevenue}
                onChange={(e) => setRoiInputs({...roiInputs, expectedRevenue: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="costs">Coûts opérationnels (XOF)</Label>
              <Input
                id="costs"
                type="number"
                placeholder="ex: 15000000"
                value={roiInputs.operatingCosts}
                onChange={(e) => setRoiInputs({...roiInputs, operatingCosts: e.target.value})}
              />
            </div>
            
            {roiInputs.investmentAmount && roiInputs.expectedRevenue && (
              <div className="p-4 bg-purple-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>ROI:</span>
                  <span className="font-bold text-purple-600">{calculateROI().roi}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Retour mensuel:</span>
                  <span className="font-medium">{calculateROI().monthlyReturn}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Profit net:</span>
                  <span className="font-medium">{(calculateROI().netProfit / 1000000).toFixed(1)}M XOF</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowROICalculator(false)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromoteursDashboardPage;
