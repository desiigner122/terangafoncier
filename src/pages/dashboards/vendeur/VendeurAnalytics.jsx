import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Eye, 
  Users, 
  MessageSquare, 
  DollarSign,
  Calendar,
  ArrowUp,
  ArrowDown,
  PieChart,
  LineChart,
  Target,
  Building,
  Star,
  Clock,
  Download,
  Filter
} from 'lucide-react';

const VendeurAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState({
    totalViews: 15420,
    uniqueVisitors: 8750,
    conversionRate: 12.5,
    averageTimeOnPage: '3m 42s',
    topProperties: [
      { id: 1, title: 'Villa Moderne Almadies', views: 2340, inquiries: 45, conversion: 15.2 },
      { id: 2, title: 'Terrain Sacré-Cœur', views: 1890, inquiries: 28, conversion: 8.7 },
      { id: 3, title: 'Appartement Plateau', views: 1650, inquiries: 38, conversion: 18.9 }
    ],
    viewsByMonth: [
      { month: 'Jan', views: 1200, inquiries: 25 },
      { month: 'Fév', views: 1450, inquiries: 32 },
      { month: 'Mar', views: 1780, inquiries: 41 },
      { month: 'Avr', views: 2100, inquiries: 48 },
      { month: 'Mai', views: 2350, inquiries: 55 },
      { month: 'Jun', views: 2180, inquiries: 52 }
    ],
    sourceTraffic: [
      { source: 'Recherche directe', percentage: 45, visits: 6930 },
      { source: 'Réseaux sociaux', percentage: 28, visits: 4320 },
      { source: 'Email marketing', percentage: 15, visits: 2310 },
      { source: 'Référencement', percentage: 12, visits: 1850 }
    ]
  });

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="mr-3 h-8 w-8 text-blue-600" />
            Analytics Avancées
          </h1>
          <p className="text-gray-600 mt-1">
            Analyses détaillées de performance de vos propriétés
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 jours</SelectItem>
              <SelectItem value="30d">30 jours</SelectItem>
              <SelectItem value="90d">3 mois</SelectItem>
              <SelectItem value="1y">1 an</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vues totales</p>
                  <p className="text-2xl font-bold text-blue-600">{formatNumber(analyticsData.totalViews)}</p>
                  <div className="flex items-center mt-1">
                    <ArrowUp className="w-3 h-3 text-green-600 mr-1" />
                    <span className="text-xs text-green-600">+24.5%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Visiteurs uniques</p>
                  <p className="text-2xl font-bold text-green-600">{formatNumber(analyticsData.uniqueVisitors)}</p>
                  <div className="flex items-center mt-1">
                    <ArrowUp className="w-3 h-3 text-green-600 mr-1" />
                    <span className="text-xs text-green-600">+18.2%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taux de conversion</p>
                  <p className="text-2xl font-bold text-purple-600">{analyticsData.conversionRate}%</p>
                  <div className="flex items-center mt-1">
                    <ArrowUp className="w-3 h-3 text-green-600 mr-1" />
                    <span className="text-xs text-green-600">+2.1%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Temps moyen</p>
                  <p className="text-2xl font-bold text-orange-600">{analyticsData.averageTimeOnPage}</p>
                  <div className="flex items-center mt-1">
                    <ArrowUp className="w-3 h-3 text-green-600 mr-1" />
                    <span className="text-xs text-green-600">+12s</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des vues */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="w-5 h-5 mr-2" />
                Évolution des vues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.viewsByMonth.map((data, index) => (
                  <div key={data.month} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 text-sm font-medium text-gray-600">{data.month}</div>
                      <div className="flex-1">
                        <Progress 
                          value={(data.views / 2500) * 100} 
                          className="h-2 w-40" 
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{formatNumber(data.views)}</div>
                      <div className="text-xs text-gray-500">{data.inquiries} demandes</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sources de trafic */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Sources de trafic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.sourceTraffic.map((source, index) => (
                  <div key={source.source} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">{source.source}</div>
                      <div className="text-sm font-bold text-blue-600">{source.percentage}%</div>
                    </div>
                    <Progress value={source.percentage} className="h-2" />
                    <div className="text-xs text-gray-500">{formatNumber(source.visits)} visites</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top propriétés */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Propriétés les plus performantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Propriété</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">Vues</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">Demandes</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">Conversion</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.topProperties.map((property, index) => (
                    <motion.tr
                      key={property.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{property.title}</div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <Eye className="w-4 h-4 text-blue-600 mr-1" />
                          {formatNumber(property.views)}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 text-green-600 mr-1" />
                          {property.inquiries}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge 
                          variant={property.conversion > 15 ? 'default' : property.conversion > 10 ? 'secondary' : 'outline'}
                          className="font-medium"
                        >
                          {property.conversion}%
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < Math.floor(property.conversion / 4) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommandations IA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Recommandations IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">📈 Optimisation des prix</h4>
                <p className="text-sm text-blue-800">
                  Vos propriétés à Almadies sont 12% sous-évaluées par rapport au marché. 
                  Ajustement recommandé : +15M FCFA.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">📸 Amélioration photos</h4>
                <p className="text-sm text-green-800">
                  Ajoutez 3 photos supplémentaires à "Terrain Sacré-Cœur" pour augmenter 
                  l'engagement de 35%.
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">🎯 Ciblage marketing</h4>
                <p className="text-sm text-purple-800">
                  Concentrez vos efforts marketing sur les 25-40 ans : 
                  meilleur taux de conversion (+23%).
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">⏰ Timing optimal</h4>
                <p className="text-sm text-orange-800">
                  Publiez vos nouvelles annonces le mardi entre 14h-16h pour 
                  maximiser la visibilité (+41%).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VendeurAnalytics;