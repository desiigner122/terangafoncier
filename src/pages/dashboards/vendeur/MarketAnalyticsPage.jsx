import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  TrendingUp,
  TrendingDown,
  Download,
  DollarSign,
  Home,
  MapPin,
  Users,
  Activity,
  Calendar,
  Target
} from 'lucide-react';
import { format, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import pdfGenerator from '@/services/pdfGenerator';

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

/**
 * Page analytics marché avec graphiques et prédictions IA
 */
const MarketAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedZone, setSelectedZone] = useState('all');
  const [propertyType, setPropertyType] = useState('all');

  // Données mock pour les graphiques
  const generateMonthLabels = (months) => {
    const labels = [];
    for (let i = months - 1; i >= 0; i--) {
      labels.push(format(subMonths(new Date(), i), 'MMM yyyy', { locale: fr }));
    }
    return labels;
  };

  const months = timeRange === '3months' ? 3 : timeRange === '6months' ? 6 : 12;
  const monthLabels = generateMonthLabels(months);

  // Données prix moyen par m²
  const priceData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Prix moyen/m²',
        data: Array.from({ length: months }, () => 
          150000 + Math.random() * 50000
        ),
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Données volume de ventes
  const salesData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Ventes',
        data: Array.from({ length: months }, () => 
          Math.floor(50 + Math.random() * 50)
        ),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'Annonces',
        data: Array.from({ length: months }, () => 
          Math.floor(100 + Math.random() * 100)
        ),
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
      },
    ],
  };

  // Données répartition par zone
  const zonesData = {
    labels: ['Almadies', 'Plateau', 'Mermoz', 'Ouakam', 'Ngor', 'Autres'],
    datasets: [
      {
        data: [25, 20, 18, 15, 12, 10],
        backgroundColor: [
          'rgba(249, 115, 22, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(107, 114, 128, 0.8)',
        ],
      },
    ],
  };

  // Options des graphiques
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  // KPIs
  const kpis = {
    avgPrice: 175000000,
    avgPricePerSqm: 185000,
    totalListings: 1247,
    avgSaleTime: 45,
    demandLevel: 'Élevée',
    trend: 'up',
    priceChange: 8.5
  };

  // Prédictions IA
  const predictions = {
    nextMonth: {
      price: kpis.avgPrice * 1.03,
      confidence: 87,
      trend: 'Hausse modérée'
    },
    bestZones: ['Almadies', 'Mermoz', 'Ngor'],
    bestTime: 'Février - Avril',
    recommendation: 'Le marché est favorable aux vendeurs. Les prix devraient continuer à augmenter légèrement.'
  };

  // Export rapport PDF
  const exportReport = async () => {
    try {
      await pdfGenerator.generateMarketAnalysis({
        averagePrice: kpis.avgPrice,
        totalProperties: kpis.totalListings,
        demand: kpis.demandLevel,
        trend: kpis.trend === 'up' ? 'Croissante' : 'Décroissante'
      });
    } catch (error) {
      console.error('Erreur export PDF:', error);
      if (window.safeGlobalToast) {
        window.safeGlobalToast({
          title: "Erreur",
          description: "Impossible d'exporter le rapport.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analyse du Marché
          </h1>
          <p className="text-gray-600 mt-2">
            Tendances, prédictions IA et insights du marché immobilier
          </p>
        </div>
        <Button onClick={exportReport} className="bg-orange-600 hover:bg-orange-700">
          <Download className="w-4 h-4 mr-2" />
          Exporter PDF
        </Button>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">3 derniers mois</SelectItem>
                <SelectItem value="6months">6 derniers mois</SelectItem>
                <SelectItem value="12months">12 derniers mois</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les zones</SelectItem>
                <SelectItem value="almadies">Almadies</SelectItem>
                <SelectItem value="plateau">Plateau</SelectItem>
                <SelectItem value="mermoz">Mermoz</SelectItem>
                <SelectItem value="ouakam">Ouakam</SelectItem>
              </SelectContent>
            </Select>

            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="terrain">Terrain</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="appartement">Appartement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Prix Moyen</div>
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold">
              {(kpis.avgPrice / 1000000).toFixed(1)}M
            </div>
            <div className="flex items-center text-sm mt-2">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+{kpis.priceChange}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Prix/m²</div>
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold">
              {(kpis.avgPricePerSqm / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-gray-600 mt-2">XOF</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Annonces Actives</div>
              <Home className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold">
              {kpis.totalListings.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-2">propriétés</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Temps de Vente</div>
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold">{kpis.avgSaleTime}</div>
            <div className="text-sm text-gray-600 mt-2">jours en moyenne</div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des prix */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution des Prix</CardTitle>
            <CardDescription>Prix moyen par m² sur {months} mois</CardDescription>
          </CardHeader>
          <CardContent>
            <Line data={priceData} options={lineOptions} />
          </CardContent>
        </Card>

        {/* Volume de ventes */}
        <Card>
          <CardHeader>
            <CardTitle>Volume d'Activité</CardTitle>
            <CardDescription>Ventes vs Annonces</CardDescription>
          </CardHeader>
          <CardContent>
            <Bar data={salesData} options={barOptions} />
          </CardContent>
        </Card>
      </div>

      {/* Répartition par zone */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Zone</CardTitle>
            <CardDescription>Part de marché par quartier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Doughnut data={zonesData} options={doughnutOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Prédictions IA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-purple-600" />
              Prédictions IA
            </CardTitle>
            <CardDescription>Analyse prédictive du marché</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Prédiction prix */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Prévision Mois Prochain</span>
                <Badge className="bg-purple-600">{predictions.nextMonth.confidence}% confiance</Badge>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {(predictions.nextMonth.price / 1000000).toFixed(1)}M XOF
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {predictions.nextMonth.trend}
              </div>
            </div>

            {/* Zones chaudes */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Zones à Forte Demande</div>
              <div className="flex flex-wrap gap-2">
                {predictions.bestZones.map((zone) => (
                  <Badge key={zone} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    <MapPin className="w-3 h-3 mr-1" />
                    {zone}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Meilleure période */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Meilleure Période de Vente</div>
              <div className="flex items-center text-sm text-gray-900">
                <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                {predictions.bestTime}
              </div>
            </div>

            {/* Recommandation */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-green-900 mb-1">Recommandation IA</div>
                  <div className="text-sm text-green-800">
                    {predictions.recommendation}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights supplémentaires */}
      <Card>
        <CardHeader>
          <CardTitle>Insights Détaillés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">🔥 Points Chauds</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span className="text-sm">Forte demande sur les terrains à Almadies (+23%)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span className="text-sm">Villas de luxe en hausse (délai vente -15%)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span className="text-sm">Investisseurs diaspora très actifs</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">⚠️ Points d'Attention</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span className="text-sm">Saturation sur les petits appartements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span className="text-sm">Délais administratifs en augmentation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span className="text-sm">Concurrence accrue en périphérie</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketAnalyticsPage;
