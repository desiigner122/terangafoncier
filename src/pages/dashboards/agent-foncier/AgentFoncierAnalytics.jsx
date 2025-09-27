import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Map,
  Users,
  FileText,
  DollarSign,
  Target,
  Calendar,
  Filter,
  Download,
  Eye,
  MapPin,
  Building2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AgentFoncierAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const performanceKPIs = [
    {
      title: 'Revenus Totaux',
      value: '125,500,000',
      unit: 'XOF',
      change: '+18.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Terrains Évalués',
      value: '342',
      change: '+12.3%',
      trend: 'up',
      icon: Map,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Nouveaux Clients',
      value: '47',
      change: '+25.1%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Temps Moyen/Dossier',
      value: '3.2',
      unit: 'jours',
      change: '-8.4%',
      trend: 'down',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const zoneAnalysis = [
    {
      zone: 'Dakar Plateau',
      terrains: 145,
      valeurMoyenne: '850M',
      evolution: '+15.2%',
      status: 'high'
    },
    {
      zone: 'Almadies',
      terrains: 89,
      valeurMoyenne: '1.2B',
      evolution: '+22.8%',
      status: 'high'
    },
    {
      zone: 'Parcelles Assainies',
      terrains: 234,
      valeurMoyenne: '420M',
      evolution: '+8.5%',
      status: 'medium'
    },
    {
      zone: 'Rufisque',
      terrains: 167,
      valeurMoyenne: '280M',
      evolution: '+5.1%',
      status: 'medium'
    },
    {
      zone: 'Guédiawaye',
      terrains: 98,
      valeurMoyenne: '180M',
      evolution: '+12.3%',
      status: 'low'
    }
  ];

  const monthlyTrends = [
    { month: 'Jan', terrains: 28, revenus: 8500000, clients: 12 },
    { month: 'Fév', terrains: 35, revenus: 11200000, clients: 15 },
    { month: 'Mar', terrains: 42, revenus: 13800000, clients: 18 },
    { month: 'Avr', terrains: 38, revenus: 12100000, clients: 16 },
    { month: 'Mai', terrains: 45, revenus: 15600000, clients: 21 },
    { month: 'Jun', terrains: 52, revenus: 18200000, clients: 24 }
  ];

  const typeDocuments = [
    { type: 'Titres Fonciers', count: 145, percentage: 35, color: 'bg-green-500' },
    { type: 'Actes de Vente', count: 98, percentage: 24, color: 'bg-blue-500' },
    { type: 'Baux Emphytéotiques', count: 67, percentage: 16, color: 'bg-purple-500' },
    { type: 'Certificats d\'Occupation', count: 54, percentage: 13, color: 'bg-orange-500' },
    { type: 'Autres Documents', count: 48, percentage: 12, color: 'bg-gray-500' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Agent Foncier</h1>
          <p className="text-gray-600">Analyse des performances et tendances</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {performanceKPIs.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{kpi.title}</p>
                    <div className="flex items-baseline space-x-1">
                      <p className="text-2xl font-bold text-gray-900">
                        {kpi.value.toLocaleString()}
                      </p>
                      {kpi.unit && (
                        <span className="text-sm text-gray-500">{kpi.unit}</span>
                      )}
                    </div>
                    <div className="flex items-center mt-2">
                      {kpi.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                      )}
                      <span className="text-sm text-green-600">{kpi.change}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                    <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="zones" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="zones">Analyse par Zones</TabsTrigger>
          <TabsTrigger value="tendances">Tendances</TabsTrigger>
          <TabsTrigger value="documents">Types Documents</TabsTrigger>
          <TabsTrigger value="predictions">Prédictions IA</TabsTrigger>
        </TabsList>

        <TabsContent value="zones" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Performance par Zone Géographique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {zoneAnalysis.map((zone, index) => (
                  <motion.div
                    key={zone.zone}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        zone.status === 'high' ? 'bg-green-500' :
                        zone.status === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <h4 className="font-medium text-gray-900">{zone.zone}</h4>
                        <p className="text-sm text-gray-600">{zone.terrains} terrains gérés</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{zone.valeurMoyenne} XOF</p>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">{zone.evolution}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tendances" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution Mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyTrends.map((trend, index) => (
                    <div key={trend.month} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">{trend.month}</span>
                      <div className="flex space-x-4 text-sm">
                        <span className="text-green-600">{trend.terrains} terrains</span>
                        <span className="text-blue-600">{(trend.revenus/1000000).toFixed(1)}M XOF</span>
                        <span className="text-purple-600">{trend.clients} clients</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition Géographique</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Dakar Centre</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '45%'}}></div>
                      </div>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Banlieue</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '35%'}}></div>
                      </div>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Zone Rurale</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{width: '20%'}}></div>
                      </div>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Répartition des Types de Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {typeDocuments.map((doc, index) => (
                  <motion.div
                    key={doc.type}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded ${doc.color}`}></div>
                      <div>
                        <h4 className="font-medium text-gray-900">{doc.type}</h4>
                        <p className="text-sm text-gray-600">{doc.count} documents</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{doc.percentage}%</Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Prédictions IA - Prochains 3 Mois
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Demande Croissante</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Zone Almadies: +35% d'évaluations prévues
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Opportunité Marché</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Terrains agricoles: Valorisation attendue +20%
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-900">Attention Requise</h4>
                    <p className="text-sm text-orange-700 mt-1">
                      Zone Rufisque: Ralentissement possible -5%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommandations Stratégiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Développer le portefeuille Almadies
                      </p>
                      <p className="text-xs text-gray-600">
                        Forte demande prévue pour les 6 prochains mois
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Spécialisation terrains agricoles
                      </p>
                      <p className="text-xs text-gray-600">
                        Marché en expansion avec peu de concurrence
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Formation blockchain recommandée
                      </p>
                      <p className="text-xs text-gray-600">
                        Nouvelle technologie pour les titres fonciers
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentFoncierAnalytics;