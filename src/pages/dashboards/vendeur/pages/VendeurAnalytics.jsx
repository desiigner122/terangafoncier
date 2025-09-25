import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart,
  Calendar,
  Target,
  Users,
  Eye,
  Heart,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  Brain,
  Zap,
  Clock,
  MapPin,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

const VendeurAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('views');

  const periodOptions = [
    { id: '7d', name: '7 jours' },
    { id: '30d', name: '30 jours' },
    { id: '90d', name: '90 jours' },
    { id: '1y', name: '1 an' }
  ];

  const metricOptions = [
    { id: 'views', name: 'Vues', icon: Eye, color: 'text-blue-600' },
    { id: 'favorites', name: 'Favoris', icon: Heart, color: 'text-red-600' },
    { id: 'inquiries', name: 'Demandes', icon: MessageSquare, color: 'text-green-600' },
    { id: 'shares', name: 'Partages', icon: Users, color: 'text-purple-600' }
  ];

  const kpiData = [
    {
      title: 'Vues Totales',
      value: '12,847',
      change: '+23.5%',
      trend: 'up',
      icon: Eye,
      color: 'text-blue-600'
    },
    {
      title: 'Taux de Conversion',
      value: '3.2%',
      change: '+0.8%',
      trend: 'up',
      icon: Target,
      color: 'text-green-600'
    },
    {
      title: 'Temps Moyen',
      value: '2m 34s',
      change: '+12s',
      trend: 'up',
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      title: 'Score IA Moyen',
      value: '87.3',
      change: '+2.1',
      trend: 'up',
      icon: Brain,
      color: 'text-purple-600'
    }
  ];

  const topProperties = [
    {
      id: 1,
      title: 'Villa Moderne Almadies',
      location: 'Almadies, Dakar',
      views: 1247,
      favorites: 23,
      inquiries: 8,
      conversionRate: 4.2,
      trend: 'up'
    },
    {
      id: 2,
      title: 'Appartement Standing Plateau',
      location: 'Plateau, Dakar',
      views: 892,
      favorites: 15,
      inquiries: 5,
      conversionRate: 3.1,
      trend: 'stable'
    },
    {
      id: 3,
      title: 'Maison Familiale Parcelles',
      location: 'Parcelles Assainies, Dakar',
      views: 654,
      favorites: 12,
      inquiries: 3,
      conversionRate: 1.8,
      trend: 'down'
    }
  ];

  const audienceData = [
    { segment: 'Jeunes Professionnels', percentage: 45, color: 'bg-blue-500' },
    { segment: 'Familles', percentage: 30, color: 'bg-green-500' },
    { segment: 'Investisseurs', percentage: 15, color: 'bg-purple-500' },
    { segment: 'Retraités', percentage: 10, color: 'bg-orange-500' }
  ];

  const locationData = [
    { city: 'Dakar', views: 5234, percentage: 68 },
    { city: 'Thiès', views: 1247, percentage: 16 },
    { city: 'Saint-Louis', views: 892, percentage: 12 },
    { city: 'Kaolack', views: 312, percentage: 4 }
  ];

  const aiInsights = [
    {
      type: 'opportunity',
      title: 'Optimisation Photos',
      description: 'Ajoutez 3-5 photos supplémentaires pour augmenter les vues de 24%',
      impact: 'high',
      action: 'Ajouter Photos'
    },
    {
      type: 'trend',
      title: 'Demande Croissante',
      description: 'Les propriétés à Almadies ont +34% de demandes ce mois',
      impact: 'medium',
      action: 'Explorer Zone'
    },
    {
      type: 'warning',
      title: 'Baisse Performance',
      description: 'Villa Parcelles: -15% de vues cette semaine',
      impact: 'medium',
      action: 'Réviser Prix'
    }
  ];

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4" />;
  };

  const getImpactColor = (impact) => {
    const colors = {
      high: 'border-l-green-500 bg-green-50',
      medium: 'border-l-yellow-500 bg-yellow-50',
      low: 'border-l-blue-500 bg-blue-50'
    };
    return colors[impact] || colors.low;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Avancées</h1>
          <p className="text-gray-600">Analyses prédictives et insights IA pour optimiser vos ventes</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Filtres de période */}
      <div className="flex flex-wrap gap-2">
        {periodOptions.map(period => (
          <Button
            key={period.id}
            variant={selectedPeriod === period.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod(period.id)}
          >
            {period.name}
          </Button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                {getTrendIcon(kpi.trend)}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                <p className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.change} vs période précédente
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart principal */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Évolution des Performances</CardTitle>
            <div className="flex gap-2">
              {metricOptions.map(metric => (
                <Button
                  key={metric.id}
                  variant={selectedMetric === metric.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMetric(metric.id)}
                  className="flex items-center gap-2"
                >
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  {metric.name}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Graphique interactif des {metricOptions.find(m => m.id === selectedMetric)?.name}</p>
              <p className="text-sm text-gray-500 mt-2">Données temps réel - Période: {periodOptions.find(p => p.id === selectedPeriod)?.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Properties & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Propriétés les plus performantes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Top Propriétés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProperties.map((property, index) => (
                <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                      <h4 className="font-medium text-sm">{property.title}</h4>
                      {getTrendIcon(property.trend)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                      <MapPin className="h-3 w-3" />
                      {property.location}
                    </div>
                    <div className="flex gap-4 text-xs text-gray-600 mt-2">
                      <span>{property.views} vues</span>
                      <span>{property.favorites} favoris</span>
                      <span>{property.inquiries} demandes</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">
                      {property.conversionRate}%
                    </div>
                    <div className="text-xs text-gray-600">conversion</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights IA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Insights IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className={`p-4 border-l-4 rounded-r-lg ${getImpactColor(insight.impact)}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <Zap className="h-4 w-4 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-700 mb-3">{insight.description}</p>
                  <Button size="sm" variant="outline" className="text-xs">
                    {insight.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audience & Location */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analyse Audience */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Segments d'Audience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {audienceData.map((segment, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{segment.segment}</span>
                    <span>{segment.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${segment.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${segment.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Répartition Géographique */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-600" />
              Répartition Géographique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {locationData.map((location, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span className="font-medium text-sm">{location.city}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{location.views.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">{location.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Stats */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">12,847</div>
              <div className="text-sm text-gray-600">Vues Totales</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">3.2%</div>
              <div className="text-sm text-gray-600">Taux Conversion</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">87.3</div>
              <div className="text-sm text-gray-600">Score IA Moyen</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">2m 34s</div>
              <div className="text-sm text-gray-600">Temps Moyen</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">42</div>
              <div className="text-sm text-gray-600">Favoris Total</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendeurAnalytics;