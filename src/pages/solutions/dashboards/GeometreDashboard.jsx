import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Badge, 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../../../components/ui';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  MapPin, 
  Ruler, 
  Calculator, 
  FileText, 
  Camera, 
  Navigation, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Target, 
  Activity,
  Compass,
  Map,
  Layers,
  Scan,
  Settings
} from 'lucide-react';

const GeometreDashboard = () => {
  const [geometreMetrics, setGeometreMetrics] = useState({
    projetsActifs: 42,
    mesuresCompletes: 156,
    plansDessines: 89,
    clientsSatisfaits: 134,
    revenusGeneres: 4200000,
    precisionMoyenne: 99.8,
    delaiMoyen: 12,
    tauxReussite: 97.5
  });

  const [chartData, setChartData] = useState({
    activitesMensuelles: [
      { mois: 'Jan', mesures: 45, plans: 32, revenus: 850000, projets: 12 },
      { mois: 'Fév', mesures: 52, plans: 38, revenus: 920000, projets: 14 },
      { mois: 'Mar', mesures: 48, plans: 35, revenus: 890000, projets: 13 },
      { mois: 'Avr', mesures: 61, plans: 42, revenus: 1050000, projets: 16 },
      { mois: 'Mai', mesures: 58, plans: 41, revenus: 980000, projets: 15 },
      { mois: 'Jun', mesures: 65, plans: 47, revenus: 1150000, projets: 18 }
    ],
    typesProjets: [
      { type: 'Bornage', nombre: 28, pourcentage: 35, couleur: '#8B5CF6' },
      { type: 'Lotissement', nombre: 18, pourcentage: 22.5, couleur: '#06B6D4' },
      { type: 'Cadastre', nombre: 15, pourcentage: 18.8, couleur: '#10B981' },
      { type: 'Topographie', nombre: 12, pourcentage: 15, couleur: '#F59E0B' },
      { type: 'Implantation', nombre: 7, pourcentage: 8.7, couleur: '#EF4444' }
    ],
    precisionTemporelle: [
      { semaine: 'S1', precision: 99.2, delai: 14 },
      { semaine: 'S2', precision: 99.5, delai: 13 },
      { semaine: 'S3', precision: 99.1, delai: 15 },
      { semaine: 'S4', precision: 99.8, delai: 11 },
      { semaine: 'S5', precision: 99.6, delai: 12 },
      { semaine: 'S6', precision: 99.9, delai: 10 }
    ]
  });

  const [projetsActivites, setProjetsActivites] = useState([
    {
      id: 1,
      type: 'Mesure terrain',
      projet: 'Lotissement Almadies Phase 2',
      client: 'SODIDA',
      statut: 'En cours',
      avancement: 75,
      deadline: '2025-09-15',
      priorite: 'haute',
      equipement: 'Station totale',
      zone: 'Almadies'
    },
    {
      id: 2,
      type: 'Plan cadastral',
      projet: 'Bornage Villa Sacré-Cœur',
      client: 'M. Diallo',
      statut: 'Finalisation',
      avancement: 90,
      deadline: '2025-09-08',
      priorite: 'moyenne',
      equipement: 'GPS RTK',
      zone: 'Sacré-Cœur'
    },
    {
      id: 3,
      type: 'Levé topographique',
      projet: 'Aménagement Zone Industrielle',
      client: 'Ministère Commerce',
      statut: 'Planifié',
      avancement: 25,
      deadline: '2025-09-25',
      priorite: 'haute',
      equipement: 'Drone + LiDAR',
      zone: 'Diamniadio'
    },
    {
      id: 4,
      type: 'Implantation',
      projet: 'Construction Centre Commercial',
      client: 'Auchan Sénégal',
      statut: 'En cours',
      avancement: 60,
      deadline: '2025-09-12',
      priorite: 'critique',
      equipement: 'Station totale',
      zone: 'Guédiawaye'
    }
  ]);

  const [outilsTechniques, setOutilsTechniques] = useState([
    {
      outil: 'Station Totale Leica TS16',
      statut: 'Actif',
      precision: '1mm + 1.5ppm',
      dernierEtalonnage: '2025-08-15',
      prochainEtalonnage: '2025-11-15',
      utilisationMensuelle: 85
    },
    {
      outil: 'GPS RTK Trimble R12',
      statut: 'Actif',
      precision: '8mm + 1ppm',
      dernierEtalonnage: '2025-08-20',
      prochainEtalonnage: '2025-11-20',
      utilisationMensuelle: 72
    },
    {
      outil: 'Drone DJI Phantom RTK',
      statut: 'Maintenance',
      precision: '1cm H / 1.5cm V',
      dernierEtalonnage: '2025-08-01',
      prochainEtalonnage: '2025-10-01',
      utilisationMensuelle: 45
    },
    {
      outil: 'Scanner 3D Faro Focus',
      statut: 'Actif',
      precision: '±2mm',
      dernierEtalonnage: '2025-07-25',
      prochainEtalonnage: '2025-10-25',
      utilisationMensuelle: 38
    }
  ]);

  useEffect(() => {
    // Simulation de données temps réel
    const interval = setInterval(() => {
      setGeometreMetrics(prev => ({
        ...prev,
        projetsActifs: prev.projetsActifs + Math.floor(Math.random() * 3) - 1,
        precisionMoyenne: 99.5 + Math.random() * 0.5
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Finalisation': return 'bg-green-100 text-green-800';
      case 'Planifié': return 'bg-yellow-100 text-yellow-800';
      case 'Terminé': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioriteColor = (priorite) => {
    switch (priorite) {
      case 'critique': return 'bg-red-100 text-red-800';
      case 'haute': return 'bg-orange-100 text-orange-800';
      case 'moyenne': return 'bg-blue-100 text-blue-800';
      case 'basse': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOutilStatutColor = (statut) => {
    switch (statut) {
      case 'Actif': return 'bg-green-100 text-green-800';
      case 'Maintenance': return 'bg-orange-100 text-orange-800';
      case 'Hors service': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* En-tête Dashboard */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Dashboard Géomètre-Expert
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            Tableau de bord professionnel pour la gestion des projets topographiques, 
            mesures de précision et production de plans cadastraux
          </motion.p>
        </div>

        {/* KPIs Principaux */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Projets Actifs</p>
                  <p className="text-3xl font-bold">{geometreMetrics.projetsActifs}</p>
                  <p className="text-blue-100 text-xs mt-1">+3 ce mois</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <Target className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Mesures Complètes</p>
                  <p className="text-3xl font-bold">{geometreMetrics.mesuresCompletes}</p>
                  <p className="text-green-100 text-xs mt-1">+12 cette semaine</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <Ruler className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Précision Moyenne</p>
                  <p className="text-3xl font-bold">{geometreMetrics.precisionMoyenne.toFixed(1)}%</p>
                  <p className="text-purple-100 text-xs mt-1">Excellent standard</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <Compass className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Revenus Générés</p>
                  <p className="text-3xl font-bold">{(geometreMetrics.revenusGeneres / 1000000).toFixed(1)}M</p>
                  <p className="text-orange-100 text-xs mt-1">FCFA ce semestre</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <TrendingUp className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Graphiques Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Activités Mensuelles */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Évolution des Activités Mensuelles
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Mesures, plans et revenus par mois
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData.activitesMensuelles}>
                    <defs>
                      <linearGradient id="colorMesures" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorPlans" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'mesures' ? value + ' mesures' :
                        name === 'plans' ? value + ' plans' : value,
                        name === 'mesures' ? 'Mesures' :
                        name === 'plans' ? 'Plans' : name
                      ]}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="mesures" 
                      stroke="#8B5CF6" 
                      fillOpacity={1} 
                      fill="url(#colorMesures)" 
                      name="Mesures"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="plans" 
                      stroke="#06B6D4" 
                      fillOpacity={1} 
                      fill="url(#colorPlans)" 
                      name="Plans"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Types de Projets */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Répartition des Types de Projets
                </CardTitle>
                <CardDescription className="text-green-100">
                  Distribution par spécialité géométrique
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.typesProjets}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, pourcentage }) => `${type} (${pourcentage}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="nombre"
                    >
                      {chartData.typesProjets.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.couleur} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value + ' projets', name]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {chartData.typesProjets.map((type, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: type.couleur }}
                        ></div>
                        <span>{type.type}</span>
                      </div>
                      <span className="font-medium">{type.nombre} projets</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Projets et Activités */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8"
        >
          {/* Liste des Projets Actifs */}
          <div className="xl:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  Projets en Cours d'Exécution
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Suivi détaillé des missions topographiques
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {projetsActivites.map((projet) => (
                    <motion.div
                      key={projet.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            {projet.projet}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {projet.type} • {projet.client} • Zone: {projet.zone}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getPrioriteColor(projet.priorite)}>
                            {projet.priorite}
                          </Badge>
                          <Badge className={getStatutColor(projet.statut)}>
                            {projet.statut}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Settings className="h-3 w-3" />
                          {projet.equipement}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(projet.deadline).toLocaleDateString('fr-FR')}
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${projet.avancement}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Avancement: {projet.avancement}%
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Outils et Équipements */}
          <div>
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5" />
                  Équipements Techniques
                </CardTitle>
                <CardDescription className="text-orange-100">
                  État et maintenance des instruments
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {outilsTechniques.map((outil, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-gradient-to-r from-gray-50 to-orange-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {outil.outil}
                        </h4>
                        <Badge className={getOutilStatutColor(outil.statut)}>
                          {outil.statut}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-xs text-gray-600">
                        <p>Précision: {outil.precision}</p>
                        <p>Utilisation: {outil.utilisationMensuelle}%</p>
                        <p>Prochain étalonnage: {new Date(outil.prochainEtalonnage).toLocaleDateString('fr-FR')}</p>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                        <div
                          className="bg-gradient-to-r from-orange-400 to-red-400 h-1 rounded-full"
                          style={{ width: `${outil.utilisationMensuelle}%` }}
                        ></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Graphique Précision et Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Analyse de Performance et Précision
              </CardTitle>
              <CardDescription className="text-teal-100">
                Évolution de la qualité des mesures et des délais
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.precisionTemporelle}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semaine" />
                  <YAxis yAxisId="left" domain={[99, 100]} />
                  <YAxis yAxisId="right" orientation="right" domain={[8, 16]} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'precision' ? value + '%' : value + ' jours',
                      name === 'precision' ? 'Précision' : 'Délai moyen'
                    ]}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="precision" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    name="Précision (%)"
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="delai" 
                    stroke="#F59E0B" 
                    strokeWidth={3}
                    name="Délai (jours)"
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Métriques Supplémentaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">Plans Dessinés</p>
                  <p className="text-3xl font-bold">{geometreMetrics.plansDessines}</p>
                  <p className="text-indigo-100 text-xs mt-1">Ce semestre</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <FileText className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-100 text-sm font-medium">Clients Satisfaits</p>
                  <p className="text-3xl font-bold">{geometreMetrics.clientsSatisfaits}</p>
                  <p className="text-cyan-100 text-xs mt-1">Taux: {geometreMetrics.tauxReussite}%</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <Users className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Délai Moyen</p>
                  <p className="text-3xl font-bold">{geometreMetrics.delaiMoyen}</p>
                  <p className="text-emerald-100 text-xs mt-1">jours/projet</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <Clock className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-500 to-pink-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-100 text-sm font-medium">Taux de Réussite</p>
                  <p className="text-3xl font-bold">{geometreMetrics.tauxReussite}%</p>
                  <p className="text-rose-100 text-xs mt-1">Excellence continue</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <CheckCircle className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GeometreDashboard;
